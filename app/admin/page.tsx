import Link from "next/link";

import { archiveArticle, publishArticle, submitArticle, unpublishArticle } from "@/app/admin/articles/actions";
import { hasPermission } from "@/server/auth/permissions";
import { requireStaff } from "@/server/auth/session";
import { createClient } from "@/server/supabase/server";

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
    { label: "Drafts", value: draftCount.count ?? 0 },
    { label: "In review", value: reviewCount.count ?? 0 },
    { label: "Scheduled", value: scheduledCount.count ?? 0 },
    { label: "Published", value: publishedCount.count ?? 0 },
  ];

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4 border-t-[6px] border-cm-black pt-3">
        <div>
          <p className="text-cm-kicker font-extrabold uppercase tracking-cm-caps">Editorial workspace</p>
          <h1 className="font-serif text-cm-feature font-bold">Good morning, {actor.displayName}</h1>
          <p className="mt-2 max-w-xl text-cm-meta">Manage the newsroom from one place. Your overview shows the current publishing queue and the latest activity.</p>
        </div>
        <Link href="/admin/articles/new" className="flex min-h-12 items-center bg-cm-lime px-4 font-bold text-cm-black">
          New article
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-px border border-cm-rule bg-cm-rule sm:grid-cols-4">
        {stats.map((stat) => <div key={stat.label} className="bg-cm-paper p-4"><p className="text-cm-kicker font-extrabold uppercase tracking-cm-caps text-cm-meta">{stat.label}</p><p className="mt-2 font-serif text-4xl font-bold">{stat.value}</p></div>)}
      </div>

      <div className="mt-8 border-t border-cm-rule">
        <div className="flex flex-wrap items-center justify-between gap-3 py-3"><h2 className="text-cm-section font-extrabold uppercase">Recent activity</h2><span className="text-sm text-cm-meta">Latest 6 articles</span></div>
        {error ? (
          <p role="alert" className="border-t border-cm-rule py-4 text-cm-ink">
            Articles could not be loaded right now.
          </p>
        ) : articles && articles.length > 0 ? (
          <ul className="border-t border-cm-rule">
            {articles.map((article) => (
              <li key={article.id} className="grid gap-2 border-b border-cm-rule py-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <h3 className="font-serif text-xl font-bold">{article.title}</h3>
                  <p className="mt-1 text-sm text-cm-meta">
                    {article.category && typeof article.category === "object" && "name" in article.category
                      ? article.category.name
                      : "Uncategorised"} · {article.status}
                  </p>
                </div>
                <div className="flex items-center gap-3 sm:justify-end">
                  <Link href={`/admin/articles/${article.id}/edit`} className="text-sm font-bold underline">
                    Edit
                  </Link>
                  <span className="text-sm font-bold text-cm-meta">
                    {new Date(article.updated_at).toLocaleDateString()}
                  </span>
                  {hasPermission(actor, "article:publish") && article.status !== "published" && (
                    <form action={publishArticle}>
                      <input type="hidden" name="article_id" value={article.id} />
                      <button type="submit" className="min-h-11 border-2 border-cm-black px-3 text-sm font-bold">
                        Publish
                      </button>
                    </form>
                  )}
                  {hasPermission(actor, "article:submit") && (article.status === "draft" || article.status === "unpublished") && (
                    <form action={submitArticle}>
                      <input type="hidden" name="article_id" value={article.id} />
                      <button type="submit" className="min-h-11 border-2 border-cm-black px-3 text-sm font-bold">Submit</button>
                    </form>
                  )}
                  {hasPermission(actor, "article:unpublish") && article.status === "published" && (
                    <form action={unpublishArticle}>
                      <input type="hidden" name="article_id" value={article.id} />
                      <button type="submit" className="min-h-11 border-2 border-cm-black px-3 text-sm font-bold">Unpublish</button>
                    </form>
                  )}
                  {hasPermission(actor, "article:unpublish") && article.status !== "archived" && (
                    <form action={archiveArticle}>
                      <input type="hidden" name="article_id" value={article.id} />
                      <button type="submit" className="min-h-11 border-2 border-cm-black px-3 text-sm font-bold">Archive</button>
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
