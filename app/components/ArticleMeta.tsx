import type { Article } from "@/lib/content";
import { formatArticleDate, readingMinutes } from "@/lib/format";

// "By {Author} · {12 Oct 2026} · {6} min read" (DESIGN_SPEC.md §4.8).
export function ArticleMeta({ article, className = "" }: { article: Article; className?: string }) {
  return (
    <p className={`text-cm-metadata text-cm-meta ${className}`}>
      By <span className="font-bold text-cm-black">{article.author}</span> ·{" "}
      <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time> ·{" "}
      {readingMinutes(article)} min read
    </p>
  );
}
