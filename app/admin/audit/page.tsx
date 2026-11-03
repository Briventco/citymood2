import Link from "next/link";
import { ArrowLeft, ScrollText } from "lucide-react";

import { hasPermission } from "@/server/auth/permissions";
import { requireStaff } from "@/server/auth/session";
import { createClient } from "@/server/supabase/server";

export default async function AuditPage() {
  const actor = await requireStaff();
  if (!hasPermission(actor, "system:manage")) return <p role="alert">You do not have permission to view audit records.</p>;
  const supabase = await createClient();
  const { data: entries, error } = await supabase
    .from("audit_log")
    .select("id,action,entity_type,entity_id,after_data,created_at,actor_id")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <section>
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm font-bold text-cm-meta hover:text-cm-black">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to newsroom
      </Link>

      <div className="mt-5 flex items-center gap-2 border-t-[6px] border-cm-black pt-3">
        <div>
          <p className="text-cm-kicker font-extrabold uppercase tracking-cm-caps text-cm-meta">Administration</p>
          <h1 className="font-serif text-cm-feature font-bold">Audit log</h1>
        </div>
      </div>

      {error ? (
        <p role="alert" className="mt-8 border-l-4 border-cm-black bg-cm-paper px-4 py-3 text-sm">
          Audit records could not be loaded.
        </p>
      ) : (
        <ol className="mt-8 divide-y divide-cm-rule border-t border-cm-rule">
          {(entries ?? []).map((entry) => (
            <li key={entry.id} className="grid gap-2 px-2 py-4 transition-colors duration-150 hover:bg-cm-paper sm:grid-cols-[1fr_auto] sm:items-start">
              <div className="flex gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center border-2 border-cm-black">
                  <ScrollText className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="border border-cm-black px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-cm-caps">
                      {entry.action}
                    </span>
                    <span className="font-bold">{entry.entity_type}</span>
                  </div>
                  <p className="mt-1 text-sm text-cm-meta">
                    Entity: <span className="font-mono">{entry.entity_id ?? "—"}</span> · Actor:{" "}
                    <span className="font-mono">{entry.actor_id ?? "system"}</span>
                  </p>
                  {entry.after_data && (
                    <pre className="mt-2 overflow-x-auto border border-cm-rule bg-cm-paper px-3 py-2 font-mono text-xs text-cm-meta">
                      {JSON.stringify(entry.after_data)}
                    </pre>
                  )}
                </div>
              </div>
              <time className="whitespace-nowrap text-xs font-bold text-cm-meta sm:text-right">
                {new Date(entry.created_at).toLocaleString()}
              </time>
            </li>
          ))}
          {(entries ?? []).length === 0 && <li className="py-4 text-sm text-cm-meta">No audit records yet.</li>}
        </ol>
      )}
    </section>
  );
}