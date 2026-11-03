import { site } from "@/config/site";
import { mostReadSlugs } from "@/config/mostRead";
import { buildHomepage } from "@/lib/homepage";
import { emptySource } from "./empty";
import { seedSource } from "./seed";
import { supabaseSource, getMostReadArticles as getSupabaseMostRead } from "@/server/content/supabase";
import type { AdCampaign, AdSlotName, Article, Category, FrontPagePicks, SiteSettings } from "./types";
import type { ContentRepository, PublishedArticleQuery } from "@/server/content/ports";

export type { AdCampaign, AdSlotName, Article, ArticleImage, Category, FrontPagePicks, SiteSettings } from "./types";

// Supabase is the production database when configured with data.
// In preview, client review, and offline modes, seedSource provides verified Badagry reporting.
const hasSupabase = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
export const isSeedContent = !hasSupabase || process.env.CONTENT_SEED === "1" || process.env.NODE_ENV === "test";

export async function getCategories(): Promise<Category[]> {
  if (process.env.EMPTY_CONTENT === "1") return emptySource.categories();
  if (!isSeedContent) {
    try {
      const cats = await supabaseSource.categories();
      if (cats && cats.length > 0) return [...cats].sort((a, b) => a.order - b.order);
    } catch {
      // Gracefully fall back to verified seed categories
    }
  }
  const categories = await seedSource.categories();
  return [...categories].sort((a, b) => a.order - b.order);
}

/** Published articles, newest first. */
export async function getArticles(now: Date = new Date()): Promise<Article[]> {
  if (process.env.EMPTY_CONTENT === "1") return [];
  if (!isSeedContent) {
    try {
      const list = await supabaseSource.articles(now);
      if (list && list.length > 0) return publishedNewestFirst(list, now);
    } catch {
      // Gracefully fall back to verified seed reporting
    }
  }
  return publishedNewestFirst(await seedSource.articles(now), now);
}

export async function searchArticles(query: PublishedArticleQuery = {}, now: Date = new Date()): Promise<Article[]> {
  if (process.env.EMPTY_CONTENT === "1") return [];
  if (!isSeedContent) {
    try {
      const result = await (supabaseSource as ContentRepository).publishedArticles({ ...query, limit: query.limit ?? 50 });
      if (result && result.items.length > 0) return result.items;
    } catch {
      // Fall through to search articles
    }
  }

  const term = query.search?.trim().toLocaleLowerCase();
  const category = query.categorySlug;
  return (await getArticles(now))
    .filter((article) => {
      const matchesTerm =
        !term ||
        [article.title, article.standfirst, article.body, ...article.tags]
          .join(" ")
          .toLocaleLowerCase()
          .includes(term);
      return matchesTerm && (!category || article.category === category);
    })
    .slice(0, query.limit ?? 50);
}

export async function getPublishedArticle(idOrSlug: string, now: Date = new Date()): Promise<Article | null> {
  if (process.env.EMPTY_CONTENT === "1") return null;
  if (!isSeedContent) {
    try {
      const article = await (supabaseSource as ContentRepository).publishedArticle(idOrSlug);
      if (article) return article;
    } catch {
      // Fall through to getArticles
    }
  }
  return (await getArticles(now)).find((article) => article.id === idOrSlug || article.slug === idOrSlug) ?? null;
}

export async function getMostRead(now: Date = new Date()): Promise<Article[]> {
  if (process.env.EMPTY_CONTENT === "1") return [];
  if (!isSeedContent) {
    try {
      const ranked = await getSupabaseMostRead(4);
      if (ranked && ranked.length > 0) return ranked;
    } catch {
      // Fall through
    }
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

export async function getFrontPagePicks(now: Date = new Date()): Promise<FrontPagePicks> {
  if (process.env.EMPTY_CONTENT === "1") return { leadId: null, topIds: [], mostReadIds: [] };
  if (!isSeedContent) {
    try {
      const picks = await supabaseSource.frontPage(now);
      if (picks && (picks.leadId || picks.topIds.some(Boolean))) return picks;
    } catch {
      // Fall through
    }
  }
  return seedSource.frontPage(now);
}

/** Everything the homepage shows, built with the DESIGN_SPEC §5 rules. */
export async function getHomepage(now: Date = new Date()) {
  const [articles, categories, picks] = await Promise.all([getArticles(now), getCategories(), getFrontPagePicks(now)]);
  return { articles, categories, home: buildHomepage(articles, categories, picks) };
}

/** The campaign for a slot running at `now` (the most recently started, if several overlap), or null for the house ad. */
export async function getAdCampaign(slot: AdSlotName, now: Date = new Date()): Promise<AdCampaign | null> {
  if (process.env.EMPTY_CONTENT === "1") return null;
  if (!isSeedContent) {
    try {
      const campaigns = await supabaseSource.adCampaigns(now);
      const match = campaigns.find((c) => c.slot === slot);
      if (match) return match;
    } catch {
      // Fall through
    }
  }
  return (await seedSource.adCampaigns(now)).find((c) => c.slot === slot) ?? null;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSeedContent) {
    try {
      return await supabaseSource.siteSettings();
    } catch {
      // Fall through
    }
  }
  return seedSource.siteSettings();
}

export function publishedNewestFirst(articles: Article[], now: Date): Article[] {
  return articles
    .filter((a) => Date.parse(a.publishedAt) <= now.getTime())
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

/**
 * Breaking items, newest first, capped. Expects newest-first input.
 */
export function selectBreaking(
  articles: Article[],
  now: Date,
  maxAgeHours: number = site.breakingMaxAgeHours,
  maxItems: number = site.breakingMaxItems,
): Article[] {
  const cutoff = now.getTime() - maxAgeHours * 60 * 60 * 1000;
  const isBreaking = (a: Article) =>
    a.breakingUntil !== undefined
      ? a.breakingUntil !== null && Date.parse(a.breakingUntil) > now.getTime()
      : a.tags.includes("breaking") && Date.parse(a.publishedAt) >= cutoff;
  return articles.filter(isBreaking).slice(0, maxItems);
}

export function categoryBySlug(categories: Category[], slug: string | null): Category | undefined {
  return slug ? categories.find((c) => c.slug === slug) : undefined;
}
