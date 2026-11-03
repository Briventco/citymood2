import Link from "next/link";
import { Archive, CalendarClock, CheckCircle2, Clock3, FileEdit, Pencil, Plus, Send } from "lucide-react";

import { archiveArticle, publishArticle, submitArticle, unpublishArticle } from "@/app/admin/articles/actions";
import { hasPermission } from "@/server/auth/permissions";
import { requireStaff } from "@/server/auth/session";
import { createClient } from "@/server/supabase/server";

const btnBase =
  "inline-flex min-h-10 items-center gap-1.5 whitespace-nowrap border-2 px-3 text-xs font-extrabold uppercase tracking-cm-caps transition-colors duration-150";
const btnPrimary = `${btnBase} border-cm-black bg-cm-lime text-cm-black hover:bg-cm-black hover:text-cm-lime`;
const btnOutline = `${btnBase} border-cm-black bg-transparent text-cm-black hover:bg-cm-black hover:text-cm-white`;
const btnMuted = `${btnBase} border-cm-rule text-cm-meta hover:border-cm-black hover:bg-cm-black hover:text-cm-white`;

const STATUS_STYLES: Record<string, string> = {
  draft: "border border-cm-rule bg-cm-paper text-cm-meta",
  in_review: "border-2 border-cm-black bg-cm-white text-cm-black",
  scheduled: "bg-cm-rule-dark text-cm-white",
  published: "border border-cm-black bg-cm-lime text-cm-black",
  unpublished: "border border-cm-rule bg-cm-white text-cm-meta",
  archived: "bg-cm-black text-cm-white",
};

function categoryName(category: unknown): string {
  if (category && typeof category === "object" && "name" in category) {
    const name = (category as { name?: unknown }).name;
    if (typeof name === "string") return name;
  }
  return "Uncategorised";
}

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? "border border-cm-rule bg-cm-paper text-cm-meta";
  return (
    <span className={`inline-flex min-h-6 items-center px-2 text-[11px] font-extrabold uppercase tracking-cm-caps ${style}`}>
      {status.replace("_", " ")}
    </span>
  );
}

export default async function AdminPage() {
  const actor = await requireStaff();
  const supabase = await createClient();
  const [recentResult, draftCount, reviewCount, scheduledCount, publishedCount] = await Promise.all([
    supabase.from("articles").select("id,title,slug,status,updated_at,category:categories(name)").order("updated_at", { ascending: false }).limit(6),
    supabase.from("articles").select("id", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("articles").select("id", { count: "exact", head: true }).eq("status", "in_review"),
    supabase.from("articles").select("id", { count: "exact", head: true }).eq("status", "scheduled"),
    supabase.from("articles").select("id", { count: "exact", head: true }).eq("status", "published"),
  ]);
  const articles = recentResult.data;
  const error = recentResult.error;
  const stats = [
    { label: "Drafts", value: draftCount.count ?? 0, icon: FileEdit, accent: "border-cm-meta" },
    { label: "In review", value: reviewCount.count ?? 0, icon: Clock3, accent: "border-cm-black" },
    { label: "Scheduled", value: scheduledCount.count ?? 0, icon: CalendarClock, accent: "border-cm-rule-dark" },
    { label: "Published", value: publishedCount.count ?? 0, icon: CheckCircle2, accent: "border-cm-lime" },
  ];

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4 border-t-[6px] border-cm-black pt-3">
        <div>
          <p className="text-cm-kicker font-extrabold uppercase tracking-cm-caps text-cm-meta">Editorial workspace</p>
          <h1 className="font-serif text-cm-feature font-bold">Good morning, {actor.displayName}</h1>
          <p className="mt-2 max-w-xl text-cm-meta">Manage the newsroom from one place. Your overview shows the current publishing queue and the latest activity.</p>
        </div>
        <Link href="/admin/articles/new" className={`${btnPrimary} min-h-12 px-5 text-sm`}>
          <Plus className="size-4" strokeWidth={3} aria-hidden="true" />
          New article
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`border-t-4 ${stat.accent} bg-cm-paper p-4`}>
              <div className="flex items-center justify-between">
                <p className="text-cm-kicker font-extrabold uppercase tracking-cm-caps text-cm-meta">{stat.label}</p>
                <Icon className="size-4 text-cm-meta" aria-hidden="true" />
              </div>
              <p className="mt-3 font-serif text-4xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-10 border-t border-cm-rule">
        <div className="flex flex-wrap items-center justify-between gap-3 py-3">
          <h2 className="text-cm-section font-extrabold uppercase">Recent activity</h2>
          <span className="text-sm text-cm-meta">Latest 6 articles</span>
        </div>
        {error ? (
          <p role="alert" className="border-t border-cm-rule py-4 text-cm-ink">
            Articles could not be loaded right now.
          </p>
        ) : articles && articles.length > 0 ? (
          <ul className="border-t border-cm-rule">
            {articles.map((article) => (
              <li
                key={article.id}
                className="grid gap-3 border-b border-cm-rule px-3 py-4 transition-colors duration-150 hover:bg-cm-paper sm:grid-cols-[1fr_auto] sm:items-center sm:px-4"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-serif text-xl font-bold">{article.title}</h3>
                    <StatusBadge status={article.status} />
                  </div>
                  <p className="mt-1 text-sm text-cm-meta">
                    {categoryName(article.category)}
                    {" · "}
                    {new Date(article.updated_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <Link href={`/admin/articles/${article.id}/edit`} className={btnOutline}>
                    <Pencil className="size-3.5" aria-hidden="true" />
                    Edit
                  </Link>
                  {hasPermission(actor, "article:publish") && article.status !== "published" && (
                    <form action={publishArticle}>
                      <input type="hidden" name="article_id" value={article.id} />
                      <button type="submit" className={btnPrimary}>
                        <CheckCircle2 className="size-3.5" aria-hidden="true" />
                        Publish
                      </button>
                    </form>
                  )}
                  {hasPermission(actor, "article:submit") && (article.status === "draft" || article.status === "unpublished") && (
                    <form action={submitArticle}>
                      <input type="hidden" name="article_id" value={article.id} />
                      <button type="submit" className={btnOutline}>
                        <Send className="size-3.5" aria-hidden="true" />
                        Submit
                      </button>
                    </form>
                  )}
                  {hasPermission(actor, "article:unpublish") && article.status === "published" && (
                    <form action={unpublishArticle}>
                      <input type="hidden" name="article_id" value={article.id} />
                      <button type="submit" className={btnMuted}>
                        Unpublish
                      </button>
                    </form>
                  )}
                  {hasPermission(actor, "article:unpublish") && article.status !== "archived" && (
                    <form action={archiveArticle}>
                      <input type="hidden" name="article_id" value={article.id} />
                      <button type="submit" className={btnMuted}>
                        <Archive className="size-3.5" aria-hidden="true" />
                        Archive
                      </button>
                    </form>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="border-t border-cm-rule py-4 text-cm-ink">No newsroom articles yet.</p>
        )}
      </div>
    </section>
  );
}