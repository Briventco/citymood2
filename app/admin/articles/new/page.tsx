import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

import { createDraft } from "@/app/admin/articles/actions";
import { requireStaff } from "@/server/auth/session";
import { createClient } from "@/server/supabase/server";

const fieldLabel = "text-xs font-extrabold uppercase tracking-cm-caps text-cm-meta";
const fieldInput =
  "border-2 border-cm-rule bg-cm-white px-4 text-cm-black transition-colors duration-150 placeholder:text-cm-meta focus:border-cm-black focus:outline-none";

export default async function NewArticlePage() {
  await requireStaff();
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id,name")
    .eq("active", true)
    .order("display_order", { ascending: true });

  return (
    <section>
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm font-bold text-cm-meta hover:text-cm-black">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to newsroom
      </Link>

      <div className="mt-5 border-t-[6px] border-cm-black pt-3">
        <p className="text-cm-kicker font-extrabold uppercase tracking-cm-caps text-cm-meta">Editorial workspace</p>
        <h1 className="font-serif text-cm-feature font-bold">Create a draft</h1>
      </div>

      <form action={createDraft} className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px] lg:items-start">
        {/* Main content */}
        <div className="grid gap-6">
          <label className="grid gap-2" htmlFor="title">
            <span className={fieldLabel}>Headline</span>
            <input
              id="title"
              name="title"
              required
              maxLength={300}
              placeholder="Write a clear, specific headline"
              className={`${fieldInput} h-14 font-serif text-xl font-bold`}
            />
          </label>

          <label className="grid gap-2" htmlFor="slug">
            <span className={fieldLabel}>Slug</span>
            <input
              id="slug"
              name="slug"
              required
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              placeholder="badagry-market-update"
              className={`${fieldInput} h-12 font-mono text-sm`}
            />
            <span className="text-xs text-cm-meta">Lowercase, numbers and hyphens only — this becomes the article&rsquo;s URL.</span>
          </label>

          <label className="grid gap-2" htmlFor="standfirst">
            <span className={fieldLabel}>Standfirst</span>
            <textarea
              id="standfirst"
              name="standfirst"
              rows={3}
              placeholder="A short summary that pulls the reader into the story"
              className={`${fieldInput} py-3 text-cm-ink`}
            />
          </label>

          <label className="grid gap-2" htmlFor="body">
            <span className={fieldLabel}>Body</span>
            <textarea
              id="body"
              name="body"
              rows={16}
              required
              placeholder="Start writing the full story here…"
              className={`${fieldInput} py-3 leading-relaxed`}
            />
          </label>
        </div>

        {/* Publish sidebar */}
        <div className="lg:sticky lg:top-24">
          <div className="border-2 border-cm-black bg-cm-paper p-5">
            <p className="text-xs font-extrabold uppercase tracking-cm-caps text-cm-meta">Publish settings</p>

            <label className="mt-4 grid gap-2" htmlFor="category_id">
              <span className={fieldLabel}>Category</span>
              <select id="category_id" name="category_id" className={`${fieldInput} h-12 bg-cm-white`}>
                <option value="">Uncategorised</option>
                {(categories ?? []).map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <p className="mt-4 border-t border-cm-rule pt-4 text-xs text-cm-meta">
              Saved as a draft first. You can submit it for review once it&rsquo;s ready.
            </p>

            <button
              type="submit"
              className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 border-2 border-cm-black bg-cm-lime px-5 text-sm font-extrabold uppercase tracking-cm-caps text-cm-black transition-colors duration-150 hover:bg-cm-black hover:text-cm-lime"
            >
              <Save className="size-4" aria-hidden="true" />
              Save draft
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}