import Link from "next/link";
import { ArrowLeft, FolderPlus, Hash, Plus } from "lucide-react";

import { createCategory, createTag } from "@/app/admin/taxonomy/actions";
import { hasPermission } from "@/server/auth/permissions";
import { requireStaff } from "@/server/auth/session";
import { createClient } from "@/server/supabase/server";

const fieldLabel = "text-xs font-extrabold uppercase tracking-cm-caps text-cm-meta";
const fieldInput =
  "h-12 border-2 border-cm-rule bg-cm-white px-3 text-sm text-cm-black transition-colors duration-150 placeholder:text-cm-meta focus:border-cm-black focus:outline-none";
const btnPrimary =
  "inline-flex min-h-11 w-fit items-center gap-2 border-2 border-cm-black bg-cm-lime px-4 text-xs font-extrabold uppercase tracking-cm-caps text-cm-black transition-colors duration-150 hover:bg-cm-black hover:text-cm-lime";

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
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm font-bold text-cm-meta hover:text-cm-black">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to newsroom
      </Link>

      <div className="mt-5 border-t-[6px] border-cm-black pt-3">
        <p className="text-cm-kicker font-extrabold uppercase tracking-cm-caps text-cm-meta">Newsroom settings</p>
        <h1 className="font-serif text-cm-feature font-bold">Categories and tags</h1>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-start">
        {/* Categories */}
        <div className="border-2 border-cm-rule bg-cm-white p-5">
          <div className="flex items-center gap-2">
            <FolderPlus className="size-5 text-cm-meta" aria-hidden="true" />
            <h2 className="font-serif text-2xl font-bold">Categories</h2>
          </div>

          {canManageCategories && (
            <form action={createCategory} className="mt-5 grid gap-3 border-t border-cm-rule pt-5">
              <label className="grid gap-1.5">
                <span className={fieldLabel}>Category name</span>
                <input name="name" required placeholder="e.g. Local News" className={fieldInput} />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1.5">
                  <span className={fieldLabel}>Short name</span>
                  <input name="short_name" required placeholder="Local" className={fieldInput} />
                </label>
                <label className="grid gap-1.5">
                  <span className={fieldLabel}>Display order</span>
                  <input name="display_order" type="number" min="0" defaultValue="99" className={fieldInput} />
                </label>
              </div>
              <label className="grid gap-1.5">
                <span className={fieldLabel}>Slug</span>
                <input name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" placeholder="local-news" className={`${fieldInput} font-mono`} />
              </label>
              <button type="submit" className={btnPrimary}>
                <Plus className="size-4" strokeWidth={3} aria-hidden="true" />
                Add category
              </button>
            </form>
          )}

          <ul className="mt-5 divide-y divide-cm-rule border-t border-cm-rule">
            {(categories ?? []).map((category, index) => (
              <li key={category.slug} className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center border border-cm-rule text-xs font-extrabold text-cm-meta">
                    {index + 1}
                  </span>
                  <span className="font-bold">{category.name}</span>
                  {category.active === false && (
                    <span className="border border-cm-rule px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-cm-caps text-cm-meta">
                      Inactive
                    </span>
                  )}
                </div>
                <span className="font-mono text-sm text-cm-meta">{category.slug}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tags */}
        <div className="border-2 border-cm-rule bg-cm-white p-5">
          <div className="flex items-center gap-2">
            <Hash className="size-5 text-cm-meta" aria-hidden="true" />
            <h2 className="font-serif text-2xl font-bold">Tags</h2>
          </div>

          {canManageTags && (
            <form action={createTag} className="mt-5 grid gap-3 border-t border-cm-rule pt-5 sm:grid-cols-2">
              <label className="grid gap-1.5">
                <span className={fieldLabel}>Tag name</span>
                <input name="name" required placeholder="e.g. Elections" className={fieldInput} />
              </label>
              <label className="grid gap-1.5">
                <span className={fieldLabel}>Slug</span>
                <input name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" placeholder="elections" className={`${fieldInput} font-mono`} />
              </label>
              <button type="submit" className={`${btnPrimary} sm:col-span-2`}>
                <Plus className="size-4" strokeWidth={3} aria-hidden="true" />
                Add tag
              </button>
            </form>
          )}

          <ul className="mt-5 flex flex-wrap gap-2">
            {(tags ?? []).map((tag) => (
              <li
                key={tag.slug}
                className="inline-flex items-center gap-1 border-2 border-cm-black px-3 py-1.5 text-sm font-bold transition-colors duration-150 hover:bg-cm-black hover:text-cm-white"
              >
                <Hash className="size-3.5 opacity-60" aria-hidden="true" />
                {tag.name}
              </li>
            ))}
            {(tags ?? []).length === 0 && <li className="text-sm text-cm-meta">No tags yet.</li>}
          </ul>
        </div>
      </div>
    </section>
  );
}