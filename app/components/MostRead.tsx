import Link from "next/link";
import type { Article } from "@/lib/content";
import { articleHref } from "@/lib/urls";

// DESIGN_SPEC.md §4.11. Black box, lime Serif numerals, white headlines.
// Four items from 1024px, three below. Source: editor-curated list (config/mostRead.ts).
export function MostRead({
  articles,
  id = "most-read",
  className = "",
}: {
  articles: Article[];
  id?: string;
  className?: string;
}) {
  if (articles.length === 0) return null;
  return (
    <section
      aria-labelledby={`${id}-heading`}
      className={`cm-on-dark bg-cm-black px-5 pt-5 pb-2 text-cm-white lg:px-6 lg:pt-[22px] lg:pb-2.5 ${className}`}
    >
      <h2 id={`${id}-heading`} className="mb-1 text-base font-extrabold uppercase tracking-[0.12em] lg:text-lg">
        Most read
      </h2>
      <ol>
        {articles.slice(0, 4).map((a, i) => (
          <li
            key={a.id}
            className={`gap-3.5 border-t border-cm-rule-dark py-3 first:border-t-0 lg:gap-4 lg:py-3.5 ${
              i >= 3 ? "hidden lg:flex" : "flex"
            }`}
          >
            <span aria-hidden="true" className="min-w-6 font-serif text-[30px] leading-[0.9] font-bold text-cm-lime lg:text-[34px]">
              {i + 1}
            </span>
            <Link
              href={articleHref(a)}
              className="font-serif text-[17px] leading-[1.3] font-semibold text-cm-white hover:underline lg:text-lg"
            >
              {a.title}
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
