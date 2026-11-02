import { site } from "@/config/site";
import { emptySource } from "./empty";
import { seedSource } from "./seed";
import type { Article, Category, ContentSource } from "./types";

export type { Article, ArticleImage, Category } from "./types";

// Default to seedSource (real CityMood reporting) so review and demo deploys show stories.
// Set EMPTY_CONTENT=1 to preview empty states.
export const isSeedContent = process.env.EMPTY_CONTENT !== "1";

const source: ContentSource = process.env.EMPTY_CONTENT === "1" ? emptySource : seedSource;

export async function getCategories(): Promise<Category[]> {
  const categories = await source.categories();
  return [...categories].sort((a, b) => a.order - b.order);
}

/** Published articles, newest first. */
export async function getArticles(now: Date = new Date()): Promise<Article[]> {
  return publishedNewestFirst(await source.articles(now), now);
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
