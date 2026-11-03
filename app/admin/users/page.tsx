import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { updateUserRole, updateUserStatus } from "@/app/admin/users/actions";
import { InviteForm } from "@/app/admin/users/InviteForm";
import { roles, hasPermission } from "@/server/auth/permissions";
import { requireStaff } from "@/server/auth/session";
import { createAdminClient } from "@/server/supabase/admin";
import { createClient } from "@/server/supabase/server";

const fieldInput =
  "h-11 border-2 border-cm-rule bg-cm-white px-3 text-sm text-cm-black transition-colors duration-150 focus:border-cm-black focus:outline-none";
const btnOutline =
  "inline-flex min-h-11 items-center justify-center border-2 border-cm-black px-3 text-xs font-extrabold uppercase tracking-cm-caps text-cm-black transition-colors duration-150 hover:bg-cm-black hover:text-cm-white";
const btnMuted =
  "inline-flex min-h-11 items-center justify-center border-2 border-cm-rule px-3 text-xs font-extrabold uppercase tracking-cm-caps text-cm-meta transition-colors duration-150 hover:border-cm-black hover:bg-cm-black hover:text-cm-white";

const STATUS_STYLES: Record<string, string> = {
  active: "border border-cm-black bg-cm-lime text-cm-black",
  invited: "border-2 border-cm-black bg-cm-white text-cm-black",
  suspended: "bg-cm-black text-cm-white",
};

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? "border border-cm-rule bg-cm-paper text-cm-meta";
  return (
    <span className={`inline-flex min-h-6 items-center px-2 text-[11px] font-extrabold uppercase tracking-cm-caps ${style}`}>
      {status}
    </span>
  );
}

export default async function UsersPage() {
  const actor = await requireStaff();
  if (!hasPermission(actor, "user:manage")) return <p role="alert">You do not have permission to manage users.</p>;
  const [adminResult, supabase] = [createAdminClient(), await createClient()];
  const [{ data: authData, error: authError }, { data: profiles }] = await Promise.all([
    adminResult.auth.admin.listUsers({ page: 1, perPage: 100 }),
    supabase.from("profiles").select("id,display_name,status,created_at,last_login_at").order("created_at", { ascending: false }),
  ]);
  const { data: assignments } = await supabase.from("user_roles").select("user_id,role_name");
  const emails = new Map((authData?.users ?? []).map((user) => [user.id, user.email ?? ""]));
  const roleMap = new Map<string, string[]>();
  for (const assignment of assignments ?? []) roleMap.set(assignment.user_id, [...(roleMap.get(assignment.user_id) ?? []), assignment.role_name]);

  return (
    <section>
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm font-bold text-cm-meta hover:text-cm-black">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to newsroom
      </Link>

      <div className="mt-5 border-t-[6px] border-cm-black pt-3">
        <p className="text-cm-kicker font-extrabold uppercase tracking-cm-caps text-cm-meta">Administration</p>
        <h1 className="font-serif text-cm-feature font-bold">Newsroom users</h1>
      </div>

      <div className="mt-8">
        <InviteForm roles={roles} />
      </div>

      <div className="mt-8 border-t border-cm-rule">
        <div className="flex flex-wrap items-center justify-between gap-3 py-3">
          <h2 className="text-cm-section font-extrabold uppercase">All users</h2>
          <span className="text-sm text-cm-meta">{(profiles ?? []).length} total</span>
        </div>
        <ul className="divide-y divide-cm-rule border-t border-cm-rule">
          {(profiles ?? []).map((profile) => {
            const name = profile.display_name || "Unnamed user";
            const initial = name.trim().charAt(0).toUpperCase();
            return (
              <li
                key={profile.id}
                className="grid gap-4 px-2 py-5 transition-colors duration-150 hover:bg-cm-paper lg:grid-cols-[1fr_auto_auto] lg:items-center"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center border-2 border-cm-black font-serif text-base font-bold">
                    {initial}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold">{name}</p>
                      <StatusBadge status={profile.status} />
                    </div>
                    <p className="truncate text-sm text-cm-meta">{emails.get(profile.id) || "Email unavailable"}</p>
                  </div>
                </div>
                <form action={updateUserRole} className="flex gap-2">
                  <input type="hidden" name="user_id" value={profile.id} />
                  <label className="sr-only" htmlFor={`role-${profile.id}`}>
                    Role
                  </label>
                  <select
                    id={`role-${profile.id}`}
                    name="role"
                    defaultValue={roleMap.get(profile.id)?.[0] ?? "reporter"}
                    className={fieldInput}
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  <button className={btnOutline}>Save role</button>
                </form>
                <form action={updateUserStatus}>
                  <input type="hidden" name="user_id" value={profile.id} />
                  <input type="hidden" name="status" value={profile.status === "suspended" ? "active" : "suspended"} />
                  <button className={btnMuted}>{profile.status === "suspended" ? "Reactivate" : "Suspend"}</button>
                </form>
              </li>
            );
          })}
        </ul>
      </div>

      {authError && (
        <p role="alert" className="mt-4 border-l-4 border-cm-black bg-cm-paper px-4 py-3 text-sm">
          Auth user list could not be loaded. Configure the server-only Supabase secret key.
        </p>
      )}
    </section>
  );
}