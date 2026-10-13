import type { Article } from "@/lib/content";

// URL scheme for routes that are not built yet (OPEN_QUESTIONS #10).
export const articleHref = (article: Pick<Article, "slug" | "category">) =>
  `/${article.category ?? "news"}/${article.slug}`;

export const categoryHref = (slug: string) => `/${slug}`;
