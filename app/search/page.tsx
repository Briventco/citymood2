import Link from "next/link";

import { StoryCard } from "@/app/components/StoryCard";
import { categoryBySlug, getCategories, searchArticles } from "@/lib/content";
import { site } from "@/config/site";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const query = q.trim().slice(0, 100);
  const [articles, categories] = await Promise.all([
    query ? searchArticles({ search: query, limit: 50 }) : Promise.resolve([]),
    getCategories(),
  ]);

  return (
    <main className="mx-auto max-w-cm px-(--cm-gutter) py-10">
      <Link href="/" className="text-sm font-bold underline">← Back to CityMood</Link>
      <div className="mt-5 border-t-[6px] border-cm-black pt-3">
        <p className="text-cm-kicker font-extrabold uppercase tracking-cm-caps">{site.name}</p>
        <h1 className="font-serif text-cm-feature font-bold">Search</h1>
      </div>
      <form role="search" action="/search" method="get" className="mt-8 flex max-w-2xl gap-2">
        <label className="sr-only" htmlFor="search-query">Search stories</label>
        <input id="search-query" name="q" type="search" defaultValue={query} placeholder="Search CityMood" className="min-h-12 min-w-0 flex-1 border border-cm-black px-3" />
        <button type="submit" className="min-h-12 bg-cm-black px-5 font-bold text-cm-white">Search</button>
      </form>
      {query ? <p className="mt-8 border-b border-cm-rule pb-3 font-bold">{articles.length} result{articles.length === 1 ? "" : "s"} for “{query}”</p> : <p className="mt-8 border-b border-cm-rule pb-3">Enter a search term to find published stories.</p>}
      {articles.length > 0 && <div className="mt-6 grid gap-6 md:grid-cols-2">{articles.map((article) => <StoryCard key={article.id} article={article} category={categoryBySlug(categories, article.category)} variant="standard" />)}</div>}
      {query && articles.length === 0 && <p className="mt-6">No published stories matched your search.</p>}
    </main>
  );
}
