import type { ReactNode } from "react";
import Link from "next/link";

import { requireStaff } from "@/server/auth/session";
import { hasPermission } from "@/server/auth/permissions";
import { signOut } from "@/server/auth/actions";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const actor = await requireStaff();

  return (
    <div className="min-h-screen border-t-8 border-cm-lime bg-cm-paper">
      <header className="bg-cm-black text-cm-white">
        <div className="mx-auto flex max-w-cm items-center justify-between gap-4 px-(--cm-gutter) py-4">
          <div>
            <p className="text-cm-kicker font-extrabold uppercase tracking-cm-caps text-cm-lime">CityMood</p>
            <p className="font-serif text-2xl font-bold">Newsroom</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-cm-meta-dark sm:inline">{actor.displayName}</span>
            <form action={signOut}>
              <button type="submit" className="min-h-11 border border-cm-meta-dark px-3 font-bold text-cm-white">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-cm gap-0 px-(--cm-gutter) py-8 lg:grid-cols-[240px_1fr]">
        <aside className="border-b-2 border-cm-rule bg-cm-white pb-6 lg:border-r-2 lg:border-b-0 lg:pr-7">
          <p className="text-cm-kicker font-extrabold uppercase tracking-cm-caps">Workspace</p>
          <nav aria-label="Newsroom" className="mt-4 grid gap-0 border-t border-cm-rule">
            <Link className="flex min-h-12 items-center border-b border-cm-rule font-bold underline" href="/admin">
              Overview
            </Link>
            <Link className="flex min-h-12 items-center border-b border-cm-rule font-bold underline" href="/admin/articles/new">
              New article
            </Link>
            <Link className="flex min-h-12 items-center border-b border-cm-rule font-bold underline" href="/admin/taxonomy">
              Categories &amp; tags
            </Link>
            <Link className="flex min-h-12 items-center border-b border-cm-rule font-bold underline" href="/admin/users">
              Users
            </Link>
            <Link className="flex min-h-12 items-center border-b border-cm-rule font-bold underline" href="/admin/ads">
              Advertising
            </Link>
            {hasPermission(actor, "social:publish") && <Link className="flex min-h-12 items-center border-b border-cm-rule font-bold underline" href="/api/meta/connect">
              Connect Meta
            </Link>}
            <Link className="flex min-h-12 items-center border-b border-cm-rule font-bold underline" href="/admin/audit">
              Audit log
            </Link>
          </nav>
          <p className="mt-8 text-sm text-cm-meta">
            Dashboard layout is provisional. The approved design spec does not define an editorial dashboard yet.
          </p>
        </aside>
        <main className="min-w-0 bg-cm-white px-5 py-1 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
