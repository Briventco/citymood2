import Link from "next/link";

import { hasPermission } from "@/server/auth/permissions";
import { requireStaff } from "@/server/auth/session";
import { createClient } from "@/server/supabase/server";

export default async function AuditPage() {
  const actor = await requireStaff();
  if (!hasPermission(actor, "system:manage")) return <p role="alert">You do not have permission to view audit records.</p>;
  const supabase = await createClient();
  const { data: entries, error } = await supabase.from("audit_log").select("id,action,entity_type,entity_id,after_data,created_at,actor_id").order("created_at", { ascending: false }).limit(100);
  return (
    <section>
      <Link href="/admin" className="text-sm font-bold underline">← Back to newsroom</Link>
      <div className="mt-5 border-t-[6px] border-cm-black pt-3"><p className="text-cm-kicker font-extrabold uppercase tracking-cm-caps">Administration</p><h1 className="font-serif text-cm-feature font-bold">Audit log</h1></div>
      {error ? <p role="alert" className="mt-8">Audit records could not be loaded.</p> : <ol className="mt-8 divide-y divide-cm-rule border-t border-cm-rule">{(entries ?? []).map((entry) => <li key={entry.id} className="grid gap-1 py-4 sm:grid-cols-[1fr_auto]"><div><p className="font-bold">{entry.action} · {entry.entity_type}</p><p className="text-sm text-cm-meta">Entity: {entry.entity_id ?? "—"} · Actor: {entry.actor_id ?? "system"}</p>{entry.after_data && <pre className="mt-2 overflow-x-auto text-xs text-cm-meta">{JSON.stringify(entry.after_data)}</pre>}</div><time className="text-sm text-cm-meta">{new Date(entry.created_at).toLocaleString()}</time></li>)}</ol>}
    </section>
  );
}
