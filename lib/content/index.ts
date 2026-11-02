import { site } from "@/config/site";
import { emptySource } from "./empty";
import { seedSource } from "./seed";
import { supabaseSource } from "@/server/content/supabase";
import { getMostReadArticles as getSupabaseMostRead } from "@/server/content/supabase";
import { mostReadSlugs } from "@/config/mostRead";
import type { Article, Category, ContentSource } from "./types";
import type { ContentRepository, PublishedArticleQuery } from "@/server/content/ports";

export type { Article, ArticleImage, Category } from "./types";

// Supabase is the default content source in every environment. Set CONTENT_SEED=1
// only when intentionally previewing the fictional design fixture data.
export const isSeedContent = process.env.CONTENT_SEED === "1" || process.env.NODE_ENV === "test";

const source: ContentSource = isSeedContent ? seedSource : supabaseSource ?? emptySource;

export async function getCategories(): Promise<Category[]> {
  const categories = await source.categories();
  return [...categories].sort((a, b) => a.order - b.order);
}

/** Published articles, newest first. */
export async function getArticles(now: Date = new Date()): Promise<Article[]> {
  return publishedNewestFirst(await source.articles(now), now);
}

export async function searchArticles(query: PublishedArticleQuery = {}, now: Date = new Date()): Promise<Article[]> {
  if ("publishedArticles" in source) {
    const result = await (source as ContentRepository).publishedArticles({ ...query, limit: query.limit ?? 50 });
    return result.items;
  }

  const term = query.search?.trim().toLocaleLowerCase();
  const category = query.categorySlug;
  return (await getArticles(now)).filter((article) => {
    const matchesTerm = !term || [article.title, article.standfirst, article.body, ...article.tags]
      .join(" ")
      .toLocaleLowerCase()
      .includes(term);
    return matchesTerm && (!category || article.category === category);
  }).slice(0, query.limit ?? 50);
}

export async function getPublishedArticle(idOrSlug: string): Promise<Article | null> {
  if ("publishedArticle" in source) return (source as ContentRepository).publishedArticle(idOrSlug);
  return (await getArticles()).find((article) => article.id === idOrSlug || article.slug === idOrSlug) ?? null;
}

export async function getMostRead(now: Date = new Date()): Promise<Article[]> {
  if (!isSeedContent) {
    const ranked = await getSupabaseMostRead(4);
    if (ranked.length > 0) return ranked;
  }
  const articles = await getArticles(now);
  return mostReadSlugs.flatMap((slug) => {
    const article = articles.find((item) => item.slug === slug);
    return article ? [article] : [];
  });
}

export async function getBreaking(now: Date = new Date()): Promise<Article[]> {
  return selectBreaking(await getArticles(now), now);
}

export function publishedNewestFirst(articles: Article[], now: Date): Article[] {
  return articles
    .filter((a) => Date.parse(a.publishedAt) <= now.getTime())
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

/** Articles tagged "breaking" inside the expiry window, newest first, capped. Expects newest-first input. */
export function selectBreaking(
  articles: Article[],
  now: Date,
  maxAgeHours: number = site.breakingMaxAgeHours,
  maxItems: number = site.breakingMaxItems,
): Article[] {
  const cutoff = now.getTime() - maxAgeHours * 60 * 60 * 1000;
  return articles
    .filter((a) => a.tags.includes("breaking") && Date.parse(a.publishedAt) >= cutoff)
    .slice(0, maxItems);
}

export function categoryBySlug(categories: Category[], slug: string | null): Category | undefined {
  return slug ? categories.find((c) => c.slug === slug) : undefined;
}
