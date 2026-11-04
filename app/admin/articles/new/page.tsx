import Link from "next/link";

import { createDraft } from "@/app/admin/articles/actions";
import { requireStaff } from "@/server/auth/session";
import { createClient } from "@/server/supabase/server";

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
      <Link href="/admin" className="text-sm font-bold underline">
        ← Back to newsroom
      </Link>
      <div className="mt-5 border-t-[6px] border-cm-black pt-3">
        <p className="text-cm-kicker font-extrabold uppercase tracking-cm-caps">Editorial workspace</p>
        <h1 className="font-serif text-cm-feature font-bold">Create a draft</h1>
      </div>
      <form action={createDraft} encType="multipart/form-data" className="mt-8 grid gap-5">
        <label className="grid gap-2 font-bold" htmlFor="title">
          Headline
          <input id="title" name="title" required maxLength={300} className="h-12 border border-cm-black px-3 font-serif text-xl" />
        </label>
        <label className="grid gap-2 font-bold" htmlFor="slug">
          Slug
          <input id="slug" name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" className="h-12 border border-cm-black px-3" />
        </label>
        <label className="grid gap-2 font-bold" htmlFor="standfirst">
          Standfirst
          <textarea id="standfirst" name="standfirst" rows={3} className="border border-cm-black px-3 py-2" />
        </label>
        <label className="grid gap-2 font-bold" htmlFor="body">
          Body
          <textarea id="body" name="body" rows={12} required className="border border-cm-black px-3 py-2" />
        </label>
        <label className="grid gap-2 font-bold" htmlFor="category_id">
          Category
          <select id="category_id" name="category_id" className="h-12 border border-cm-black bg-cm-white px-3">
            <option value="">Uncategorised</option>
            {(categories ?? []).map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <fieldset className="grid gap-4 border-t border-cm-rule pt-5">
          <legend className="font-serif text-2xl font-bold">Lead image (optional)</legend>
          <label className="grid gap-2 font-bold" htmlFor="file">Image<input id="file" name="file" type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="min-h-11 border border-cm-black p-2" /></label>
          <label className="grid gap-2 font-bold" htmlFor="alt_text">Alt text<input id="alt_text" name="alt_text" maxLength={500} className="h-11 border border-cm-black px-3" /></label>
          <label className="grid gap-2 font-bold" htmlFor="caption">Caption<input id="caption" name="caption" maxLength={500} className="h-11 border border-cm-black px-3" /></label>
          <label className="grid gap-2 font-bold" htmlFor="credit">Credit<input id="credit" name="credit" maxLength={300} className="h-11 border border-cm-black px-3" /></label>
          <p className="text-sm text-cm-meta">JPEG, PNG, WebP or AVIF. Maximum 5 MB. Alt text is required when an image is selected.</p>
        </fieldset>
        <button type="submit" className="min-h-12 w-fit bg-cm-black px-5 font-bold text-cm-white">
          Save draft
        </button>
      </form>
    </section>
  );
}
