"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { roles, type Role, hasPermission } from "@/server/auth/permissions";
import { requireStaff } from "@/server/auth/session";
import { createAdminClient } from "@/server/supabase/admin";
import { createClient } from "@/server/supabase/server";

function value(formData: FormData, name: string): string {
  const item = formData.get(name);
  return typeof item === "string" ? item.trim() : "";
}

function isRole(value: string): value is Role {
  return (roles as readonly string[]).includes(value);
}

function redirectError(error: string): never {
  redirect(`/admin/users?error=${error}`);
}

export type InviteState = { status: "idle" | "success" | "error"; error?: string };

async function manager() {
  const actor = await requireStaff();
  if (!hasPermission(actor, "user:manage")) redirectError("forbidden");
  return actor;
}

export async function inviteUser(_previousState: InviteState, formData: FormData): Promise<InviteState> {
  const actor = await requireStaff();
  if (!hasPermission(actor, "user:manage")) return { status: "error", error: "forbidden" };
  const email = value(formData, "email").toLowerCase();
  const displayName = value(formData, "display_name");
  const role = value(formData, "role");
  if (!/^\S+@\S+\.\S+$/.test(email) || !displayName || !isRole(role)) return { status: "error", error: "invalid_input" };

  try {
    const admin = createAdminClient();
    const result = await admin.auth.admin.inviteUserByEmail(email, { data: { full_name: displayName } });
    if (result.error || !result.data.user) {
      console.error("Supabase invitation failed", { code: result.error?.code, status: result.error?.status, message: result.error?.message });
      return { status: "error", error: "invite_failed" };
    }

    const supabase = await createClient();
    const { error: roleError } = await supabase.from("user_roles").insert({ user_id: result.data.user.id, role_name: role });
    if (roleError) {
      console.error("Invited user role assignment failed", { code: roleError.code, message: roleError.message });
      return { status: "error", error: "role_failed" };
    }
    await supabase.from("audit_log").insert({ actor_id: actor.id, action: "invite", entity_type: "user", entity_id: result.data.user.id, after_data: { email, role } });
    revalidatePath("/admin/users");
    return { status: "success" };
  } catch (error) {
    console.error("Supabase invitation configuration failure", error instanceof Error ? error.message : "unknown error");
    return { status: "error", error: "invite_config" };
  }
}

export async function updateUserRole(formData: FormData): Promise<void> {
  const actor = await manager();
  const userId = value(formData, "user_id");
  const role = value(formData, "role");
  if (!userId || !isRole(role)) redirectError("invalid_input");
  if (userId === actor.id && role !== "administrator") redirectError("cannot_demote_self");

  const supabase = await createClient();
  const { error: deleteError } = await supabase.from("user_roles").delete().eq("user_id", userId);
  if (deleteError) redirectError("role_failed");
  const { error } = await supabase.from("user_roles").insert({ user_id: userId, role_name: role });
  if (error) redirectError("role_failed");
  await supabase.from("audit_log").insert({ actor_id: actor.id, action: "role_change", entity_type: "user", entity_id: userId, after_data: { role } });
  revalidatePath("/admin/users");
  redirect("/admin/users?updated=1");
}

export async function updateUserStatus(formData: FormData): Promise<void> {
  const actor = await manager();
  const userId = value(formData, "user_id");
  const status = value(formData, "status");
  if (!userId || !["active", "suspended"].includes(status)) redirectError("invalid_input");
  if (userId === actor.id && status === "suspended") redirectError("cannot_suspend_self");

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ status }).eq("id", userId);
  if (error) redirectError("status_failed");
  await supabase.from("audit_log").insert({ actor_id: actor.id, action: "status_change", entity_type: "user", entity_id: userId, after_data: { status } });
  revalidatePath("/admin/users");
  redirect("/admin/users?updated=1");
}
