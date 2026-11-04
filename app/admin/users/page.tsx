import Link from "next/link";

import { updateUserRole, updateUserStatus } from "@/app/admin/users/actions";
import { InviteForm } from "@/app/admin/users/InviteForm";
import { roles, hasPermission } from "@/server/auth/permissions";
import { requireStaff } from "@/server/auth/session";
import { createAdminClient } from "@/server/supabase/admin";
import { createClient } from "@/server/supabase/server";

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
      <Link href="/admin" className="text-sm font-bold underline">← Back to newsroom</Link>
      <div className="mt-5 border-t-[6px] border-cm-black pt-3"><p className="text-cm-kicker font-extrabold uppercase tracking-cm-caps">Administration</p><h1 className="font-serif text-cm-feature font-bold">Newsroom users</h1></div>
      <InviteForm roles={roles} />
      <ul className="mt-8 divide-y divide-cm-rule border-t border-cm-rule">{(profiles ?? []).map((profile) => <li key={profile.id} className="grid gap-4 py-5 lg:grid-cols-[1fr_auto_auto] lg:items-center">
        <div><p className="font-bold">{profile.display_name || "Unnamed user"}</p><p className="text-sm text-cm-meta">{emails.get(profile.id) || "Email unavailable"} · {profile.status}</p></div>
        <form action={updateUserRole} className="flex gap-2"><input type="hidden" name="user_id" value={profile.id} /><label className="sr-only" htmlFor={`role-${profile.id}`}>Role</label><select id={`role-${profile.id}`} name="role" defaultValue={roleMap.get(profile.id)?.[0] ?? "reporter"} className="h-11 border border-cm-black bg-cm-white px-2">{roles.map((role) => <option key={role} value={role}>{role}</option>)}</select><button className="min-h-11 border-2 border-cm-black px-3 text-sm font-bold">Save role</button></form>
        <form action={updateUserStatus}><input type="hidden" name="user_id" value={profile.id} /><input type="hidden" name="status" value={profile.status === "suspended" ? "active" : "suspended"} /><button className="min-h-11 border-2 border-cm-black px-3 text-sm font-bold">{profile.status === "suspended" ? "Reactivate" : "Suspend"}</button></form>
      </li>)}</ul>
      {authError && <p role="alert" className="mt-4 text-sm">Auth user list could not be loaded. Configure the server-only Supabase secret key.</p>}
    </section>
  );
}
