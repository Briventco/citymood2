import Link from "next/link";

import { createCategory, createTag } from "@/app/admin/taxonomy/actions";
import { hasPermission } from "@/server/auth/permissions";
import { requireStaff } from "@/server/auth/session";
import { createClient } from "@/server/supabase/server";

export default async function TaxonomyPage() {
  const actor = await requireStaff();
  const supabase = await createClient();
  const [{ data: categories }, { data: tags }] = await Promise.all([
    supabase.from("categories").select("slug,name,short_name,display_order,active").order("display_order", { ascending: true }),
    supabase.from("tags").select("slug,name").order("name", { ascending: true }),
  ]);
  const canManageCategories = hasPermission(actor, "category:manage");
  const canManageTags = hasPermission(actor, "tag:manage");

  return (
    <section>
      <Link href="/admin" className="text-sm font-bold underline">← Back to newsroom</Link>
      <div className="mt-5 border-t-[6px] border-cm-black pt-3">
        <p className="text-cm-kicker font-extrabold uppercase tracking-cm-caps">Newsroom settings</p>
        <h1 className="font-serif text-cm-feature font-bold">Categories and tags</h1>
      </div>
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-serif text-2xl font-bold">Categories</h2>
          {canManageCategories && <form action={createCategory} className="mt-4 grid gap-3 border-y border-cm-rule py-4">
            <input name="name" required placeholder="Category name" className="h-11 border border-cm-black px-3" />
            <input name="short_name" required placeholder="Short name" className="h-11 border border-cm-black px-3" />
            <input name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" placeholder="slug" className="h-11 border border-cm-black px-3" />
            <input name="display_order" type="number" min="0" defaultValue="99" className="h-11 border border-cm-black px-3" />
            <button className="min-h-11 w-fit bg-cm-black px-4 font-bold text-cm-white">Add category</button>
          </form>}
          <ul className="mt-4 divide-y divide-cm-rule border-t border-cm-rule">{(categories ?? []).map((category) => <li key={category.slug} className="flex justify-between py-3"><span className="font-bold">{category.name}</span><span className="text-sm text-cm-meta">{category.slug}</span></li>)}</ul>
        </div>
        <div>
          <h2 className="font-serif text-2xl font-bold">Tags</h2>
          {canManageTags && <form action={createTag} className="mt-4 grid gap-3 border-y border-cm-rule py-4">
            <input name="name" required placeholder="Tag name" className="h-11 border border-cm-black px-3" />
            <input name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" placeholder="slug" className="h-11 border border-cm-black px-3" />
            <button className="min-h-11 w-fit bg-cm-black px-4 font-bold text-cm-white">Add tag</button>
          </form>}
          <ul className="mt-4 flex flex-wrap gap-2">{(tags ?? []).map((tag) => <li key={tag.slug} className="border border-cm-black px-3 py-2 text-sm font-bold">{tag.name}</li>)}</ul>
        </div>
      </div>
    </section>
  );
}
