import Link from "next/link";
import type { Article, Category } from "@/lib/content";
import { categoryHref } from "@/lib/urls";
import { CategoryLabel } from "./CategoryLabel";
import { StoryCard } from "./StoryCard";

// DESIGN_SPEC.md §4.10. Full-width black band. Mobile: horizontal scroll row
// of ~210px cards. Tablet: 2×2. Desktop: four columns.
export function PeopleBand({
  articles,
  category,
  className = "",
}: {
  articles: Article[];
  category: Category;
  className?: string;
}) {
  if (articles.length === 0) return null;
  return (
    <section aria-labelledby="people-heading" className={`cm-on-dark bg-cm-black text-cm-white ${className}`}>
      <div className="mx-auto max-w-cm px-(--cm-gutter) pt-10 pb-11 lg:pt-12 lg:pb-[52px]">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <CategoryLabel category={category} onDark className="mb-2" />
            <h2 id="people-heading" className="font-serif text-cm-band font-bold">
              People of Badagry
            </h2>
          </div>
          <Link prefetch={false}
            href={categoryHref(category.slug)}
            className="inline-flex min-h-11 items-center text-[15px] font-bold text-cm-white hover:underline"
          >
            All community stories
          </Link>
        </div>
        <ul className="-mx-(--cm-gutter) flex gap-4 overflow-x-auto px-(--cm-gutter) pb-2 [scrollbar-width:thin] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
          {articles.slice(0, 4).map((a) => (
            <li key={a.id} className="w-[210px] flex-none sm:w-auto">
              <StoryCard article={a} variant="portrait" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
