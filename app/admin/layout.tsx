import type { ReactNode } from "react";

import { AdminShell } from "@/app/admin/AdminShell";
import { hasPermission } from "@/server/auth/permissions";
import { requireStaff } from "@/server/auth/session";
import { signOut } from "@/server/auth/actions";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const actor = await requireStaff();

  const navItems = [
    { href: "/admin", label: "Overview", icon: "dashboard" as const, exact: true, show: true },
    { href: "/admin/articles/new", label: "New article", icon: "new-article" as const, show: hasPermission(actor, "article:create") },
    { href: "/admin/taxonomy", label: "Categories & tags", icon: "taxonomy" as const, show: true },
    { href: "/admin/users", label: "Users", icon: "users" as const, show: hasPermission(actor, "user:manage") },
    { href: "/admin/ads", label: "Advertising", icon: "ads" as const, show: hasPermission(actor, "ad:manage") },
    { href: "/admin/audit", label: "Audit log", icon: "audit" as const, show: hasPermission(actor, "system:manage") },
  ].filter((item) => item.show);

  const roleLabel = actor.roles.length > 0 ? actor.roles.join(", ") : "Newsroom";

  return (
    <AdminShell
      displayName={actor.displayName}
      email={actor.email}
      roleLabel={roleLabel}
      navItems={navItems}
      signOutAction={signOut}
    >
      {children}
    </AdminShell>
  );
}