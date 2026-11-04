"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { hasPermission } from "@/server/auth/permissions";
import { requireStaff } from "@/server/auth/session";
import { createClient } from "@/server/supabase/server";

function value(formData: FormData, name: string): string {
  const item = formData.get(name);
  return typeof item === "string" ? item.trim() : "";
}

function validSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export async function createCategory(formData: FormData): Promise<void> {
  const actor = await requireStaff();
  if (!hasPermission(actor, "category:manage")) redirect("/admin/taxonomy?error=forbidden");
  const slug = value(formData, "slug");
  const name = value(formData, "name");
  const shortName = value(formData, "short_name");
  const displayOrder = Number.parseInt(value(formData, "display_order") || "99", 10);
  if (!validSlug(slug) || !name || !shortName || !Number.isInteger(displayOrder)) redirect("/admin/taxonomy?error=invalid_input");

  const supabase = await createClient();
  const { error } = await supabase.from("categories").insert({ slug, name, short_name: shortName, display_order: displayOrder });
  if (error) redirect("/admin/taxonomy?error=save_failed");
  revalidatePath("/admin/taxonomy");
  revalidatePath("/");
  redirect("/admin/taxonomy?created=category");
}

export async function createTag(formData: FormData): Promise<void> {
  const actor = await requireStaff();
  if (!hasPermission(actor, "tag:manage")) redirect("/admin/taxonomy?error=forbidden");
  const slug = value(formData, "slug");
  const name = value(formData, "name");
  if (!validSlug(slug) || !name) redirect("/admin/taxonomy?error=invalid_input");

  const supabase = await createClient();
  const { error } = await supabase.from("tags").insert({ slug, name });
  if (error) redirect("/admin/taxonomy?error=save_failed");
  revalidatePath("/admin/taxonomy");
  redirect("/admin/taxonomy?created=tag");
}
