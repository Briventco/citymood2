import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import { restoreArticleRevision, scheduleArticle, updateArticle, updateArticleFlags, uploadArticleMedia } from "@/app/admin/articles/actions";
import { canEditArticle, hasPermission } from "@/server/auth/permissions";
import { requireStaff } from "@/server/auth/session";
import { createClient } from "@/server/supabase/server";

type EditArticlePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const actor = await requireStaff();
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: article, error }, { data: categories }, { data: tags }, { data: articleTags }, { data: revisions }] = await Promise.all([
    supabase
      .from("articles")
      .select("id,title,slug,standfirst,body,author_id,category_id,status,scheduled_for,featured,feature_people")
      .eq("id", id)
      .maybeSingle(),
    supabase.from("categories").select("id,name").eq("active", true).order("display_order", { ascending: true }),
    supabase.from("tags").select("id,name,slug").order("name", { ascending: true }),
    supabase.from("article_tags").select("tag_id").eq("article_id", id),
    supabase.from("article_revisions").select("id,revision_number,title,change_summary,created_at,editor_id").eq("article_id", id).order("revision_number", { ascending: false }).limit(20),
  ]);

  if (error || !article) notFound();
  if (!canEditArticle(actor, { id: article.id, authorId: article.author_id })) notFound();
  const { data: media } = await supabase
    .from("article_media")
    .select("id,storage_path,alt_text,caption,credit,width,height,created_at")
    .eq("article_id", article.id)
    .order("created_at", { ascending: false });
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.SUPABASE_STORAGE_BUCKET ?? "article-media");
  const mediaUrl = (path: string) => bucket ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}` : path;
  const selectedTagIds = new Set((articleTags ?? []).map((item) => item.tag_id));

  return (
    <section>
      <Link href="/admin" className="text-sm font-bold underline">
        ← Back to newsroom
      </Link>
      <div className="mt-5 border-t-[6px] border-cm-black pt-3">
        <p className="text-cm-kicker font-extrabold uppercase tracking-cm-caps">Editorial workspace</p>
        <h1 className="font-serif text-cm-feature font-bold">Edit article</h1>
      </div>
      <form action={updateArticle} className="mt-8 grid gap-5">
        <input type="hidden" name="article_id" value={article.id} />
        <label className="grid gap-2 font-bold" htmlFor="title">
          Headline
          <input id="title" name="title" required maxLength={300} defaultValue={article.title} className="h-12 border border-cm-black px-3 font-serif text-xl" />
        </label>
        <label className="grid gap-2 font-bold" htmlFor="slug">
          Slug
          <input id="slug" name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" defaultValue={article.slug} className="h-12 border border-cm-black px-3" />
        </label>
        <label className="grid gap-2 font-bold" htmlFor="standfirst">
          Standfirst
          <textarea id="standfirst" name="standfirst" rows={3} defaultValue={article.standfirst} className="border border-cm-black px-3 py-2" />
        </label>
        <label className="grid gap-2 font-bold" htmlFor="body">
          Body
          <textarea id="body" name="body" rows={12} required defaultValue={article.body} className="border border-cm-black px-3 py-2" />
        </label>
        <label className="grid gap-2 font-bold" htmlFor="category_id">
          Category
          <select id="category_id" name="category_id" defaultValue={article.category_id ?? ""} className="h-12 border border-cm-black bg-cm-white px-3">
            <option value="">Uncategorised</option>
            {(categories ?? []).map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </label>
        <fieldset className="grid gap-2">
          <legend className="font-bold">Tags</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {(tags ?? []).map((tag) => (
              <label key={tag.id} className="flex min-h-11 items-center gap-2 border border-cm-rule px-3">
                <input type="checkbox" name="tag_ids" value={tag.id} defaultChecked={selectedTagIds.has(tag.id)} />
                <span>{tag.name}</span>
              </label>
            ))}
          </div>
          <Link href="/admin/taxonomy" className="text-sm font-bold underline">Manage tags</Link>
        </fieldset>
        <button type="submit" className="min-h-12 w-fit bg-cm-black px-5 font-bold text-cm-white">
          Save changes
        </button>
      </form>
      <div className="mt-12 border-t-[6px] border-cm-black pt-3">
        <p className="text-cm-kicker font-extrabold uppercase tracking-cm-caps">Workflow</p>
        <p className="mt-1 text-sm text-cm-meta">Current status: <span className="font-bold text-cm-black">{article.status}</span></p>
        <div className="mt-5 grid gap-6 lg:grid-cols-2">
          {hasPermission(actor, "article:publish") && <form action={scheduleArticle} className="grid gap-3 border border-cm-rule p-4">
            <input type="hidden" name="article_id" value={article.id} />
            <label className="grid gap-2 font-bold" htmlFor="scheduled_for">Schedule publication<input id="scheduled_for" name="scheduled_for" type="datetime-local" required defaultValue={article.scheduled_for ? article.scheduled_for.slice(0, 16) : ""} className="h-11 border border-cm-black px-3" /></label>
            <button type="submit" className="min-h-11 w-fit bg-cm-black px-4 font-bold text-cm-white">Schedule</button>
          </form>}
          {hasPermission(actor, "article:feature") && <form action={updateArticleFlags} className="grid gap-3 border border-cm-rule p-4">
            <input type="hidden" name="article_id" value={article.id} />
            <label className="flex min-h-11 items-center gap-2 font-bold"><input type="checkbox" name="featured" defaultChecked={article.featured} /> Featured homepage candidate</label>
            <label className="flex min-h-11 items-center gap-2 font-bold"><input type="checkbox" name="feature_people" defaultChecked={article.feature_people} /> People of Badagry feature</label>
            <button type="submit" className="min-h-11 w-fit bg-cm-black px-4 font-bold text-cm-white">Save flags</button>
          </form>}
        </div>
      </div>
      <div className="mt-12 border-t-[6px] border-cm-black pt-3">
        <p className="text-cm-kicker font-extrabold uppercase tracking-cm-caps">Audit trail</p>
        <h2 className="font-serif text-2xl font-bold">Revision history</h2>
        {revisions && revisions.length > 0 ? <ol className="mt-5 divide-y divide-cm-rule border-t border-cm-rule">
          {revisions.map((revision) => <li key={revision.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div><p className="font-bold">Revision {revision.revision_number}: {revision.title}</p><p className="text-sm text-cm-meta">{revision.change_summary || "Editorial revision"} · {new Date(revision.created_at).toLocaleString()}</p></div>
            <form action={restoreArticleRevision}><input type="hidden" name="revision_id" value={revision.id} /><input type="hidden" name="article_id" value={article.id} /><button type="submit" className="min-h-11 border-2 border-cm-black px-3 text-sm font-bold">Restore</button></form>
          </li>)}
        </ol> : <p className="mt-4 text-cm-meta">No saved revisions yet. The first revision is created when this article is edited.</p>}
      </div>
      <div className="mt-12 border-t-[6px] border-cm-black pt-3">
        <h2 className="font-serif text-2xl font-bold">Article media</h2>
        <form action={uploadArticleMedia} className="mt-5 grid gap-4 border-b border-cm-rule pb-6">
          <input type="hidden" name="article_id" value={article.id} />
          <label className="grid gap-2 font-bold" htmlFor="file">Image<input id="file" name="file" type="file" accept="image/jpeg,image/png,image/webp,image/avif" required className="min-h-11 border border-cm-black p-2" /></label>
          <label className="grid gap-2 font-bold" htmlFor="alt_text">Alt text<input id="alt_text" name="alt_text" required maxLength={500} className="h-11 border border-cm-black px-3" /></label>
          <label className="grid gap-2 font-bold" htmlFor="caption">Caption<input id="caption" name="caption" maxLength={500} className="h-11 border border-cm-black px-3" /></label>
          <label className="grid gap-2 font-bold" htmlFor="credit">Credit<input id="credit" name="credit" maxLength={300} className="h-11 border border-cm-black px-3" /></label>
          <p className="text-sm text-cm-meta">JPEG, PNG, WebP or AVIF. Maximum 5 MB.</p>
          <button type="submit" className="min-h-12 w-fit bg-cm-black px-5 font-bold text-cm-white">Upload image</button>
        </form>
        {media && media.length > 0 && (
          <ul className="mt-6 grid gap-4">
            {media.map((item) => (
              <li key={item.id} className="grid gap-3 border-b border-cm-rule pb-4 sm:grid-cols-[160px_1fr]">
                <Image src={mediaUrl(item.storage_path)} alt={item.alt_text} width={item.width} height={item.height} className="h-32 w-full object-cover" />
                <div><p className="font-bold">{item.alt_text}</p><p className="text-sm text-cm-meta">{item.width} × {item.height}{item.credit ? ` · ${item.credit}` : ""}</p>{item.caption && <p className="mt-1 text-sm">{item.caption}</p>}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
