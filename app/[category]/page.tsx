import Link from "next/link";
import { notFound } from "next/navigation";

import { StoryCard } from "@/app/components/StoryCard";
import { categoryBySlug, getCategories, searchArticles } from "@/lib/content";

type CategoryPageProps = { params: Promise<{ category: string }> };

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const [categories, articles] = await Promise.all([getCategories(), searchArticles({ categorySlug: slug, limit: 50 })]);
  const category = categoryBySlug(categories, slug);
  if (!category) notFound();

  return (
    <main className="mx-auto max-w-cm px-(--cm-gutter) py-10">
      <Link href="/" className="text-sm font-bold underline">← Back to CityMood</Link>
      <div className="mt-5 border-t-[6px] border-cm-black pt-3">
        <p className="text-cm-kicker font-extrabold uppercase tracking-cm-caps">CityMood</p>
        <h1 className="font-serif text-cm-feature font-bold">{category.name}</h1>
        <p className="mt-2 max-w-2xl text-cm-standfirst">Latest published stories from {category.name}.</p>
      </div>
      {articles.length > 0 ? (
        <div className="mt-8 grid gap-7 border-t border-cm-rule pt-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => <StoryCard key={article.id} article={article} category={category} variant="standard" />)}
        </div>
      ) : <p className="mt-8 border-t border-cm-rule pt-6">No published stories in this section yet.</p>}
    </main>
  );
}
