import Link from "next/link";
import { site } from "@/config/site";
import { type Article, type Category, categoryBySlug } from "@/lib/content";
import { StoryCard } from "./StoryCard";

// DESIGN_SPEC.md §4.9. Five items from 1024px, four below. No LIVE badge:
// the rail does not update itself, it refreshes with the page.
export function LatestRail({
  articles,
  categories,
  now,
  className = "",
}: {
  articles: Article[];
  categories: Category[];
  now: Date;
  className?: string;
}) {
  if (articles.length === 0) return null;
  return (
    <aside aria-labelledby="latest-heading" className={className}>
      <h2
        id="latest-heading"
        className="border-t-[6px] border-cm-black pt-3 text-[15px] font-extrabold uppercase tracking-[0.12em]"
      >
        Latest
      </h2>
      <ol>
        {articles.slice(0, 5).map((a, i) => (
          <li key={a.id} className={i >= 4 ? "hidden lg:block" : undefined}>
            <StoryCard article={a} variant="latest" category={categoryBySlug(categories, a.category)} now={now} />
          </li>
        ))}
      </ol>
      <Link prefetch={false}
        href={site.latestPath}
        className="mt-4 flex h-12 items-center justify-center border-2 border-cm-black text-[15px] font-bold hover:underline"
      >
        All latest news
      </Link>
    </aside>
  );
}
