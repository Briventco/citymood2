import { describe, expect, it } from "vitest";
import { defaultCategories } from "@/lib/content/categories";
import { seedSource } from "@/lib/content/seed";
import { publishedNewestFirst } from "@/lib/content";
import { makeArticle } from "@/lib/testing";
import { buildHomepage, type Homepage } from "./homepage";

const now = new Date("2026-10-12T12:00:00.000Z");
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60_000).toISOString();

function placedIds(h: Homepage): string[] {
  const blocks = [h.local, h.politics, h.business].flatMap((b) => (b ? [b.first, ...b.list] : []));
  return [
    ...(h.lead ? [h.lead] : []),
    ...h.latest,
    ...h.topStories,
    ...blocks,
    ...(h.people?.articles ?? []),
    ...(h.culture ? [h.culture.feature, ...h.culture.related] : []),
    ...(h.tourism?.articles ?? []),
  ].map((a) => a.id);
}

describe("buildHomepage", () => {
  it("places every article at most once (Most read excepted) with the seed data", async () => {
    const articles = publishedNewestFirst(await seedSource.articles(now), now);
    const h = buildHomepage(articles, defaultCategories, articles.slice(0, 4).map((a) => a.slug));
    const ids = placedIds(h);
    expect(new Set(ids).size).toBe(ids.length);
    expect(h.mostRead).toHaveLength(4);
    // Every slot is filled by the seed, so the dev homepage looks complete.
    expect(h.topStories).toHaveLength(4);
    expect(h.local && h.politics && h.business && h.people && h.culture && h.tourism).toBeTruthy();
  });

  it("leads with the newest featured article that has an image", () => {
    const newest = makeArticle({ publishedAt: minutesAgo(1) });
    const featuredNoImage = makeArticle({ featured: true, image: null, publishedAt: minutesAgo(2) });
    const featured = makeArticle({ featured: true, publishedAt: minutesAgo(3) });
    const h = buildHomepage([newest, featuredNoImage, featured], defaultCategories, []);
    expect(h.lead?.id).toBe(featured.id);
  });

  it("falls back to the newest article with an image, then the newest article", () => {
    const noImage = makeArticle({ image: null, publishedAt: minutesAgo(1) });
    const withImage = makeArticle({ publishedAt: minutesAgo(2) });
    expect(buildHomepage([noImage, withImage], defaultCategories, []).lead?.id).toBe(withImage.id);
    expect(buildHomepage([noImage], defaultCategories, []).lead?.id).toBe(noImage.id);
  });

  it("hides blocks for empty categories", () => {
    // Lead + 5 latest + 2 top stories use eight; the rest fill the Local block.
    const articles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((m) =>
      makeArticle({ category: "local-news", publishedAt: minutesAgo(m) }),
    );
    const h = buildHomepage(articles, defaultCategories, []);
    expect(h.local).not.toBeNull();
    expect(h.politics).toBeNull();
    expect(h.business).toBeNull();
    expect(h.people).toBeNull();
    expect(h.culture).toBeNull();
    expect(h.tourism).toBeNull();
  });

  it("never puts uncategorised articles in category-based slots", () => {
    const uncategorised = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((m) =>
      makeArticle({ category: null, publishedAt: minutesAgo(m) }),
    );
    const h = buildHomepage(uncategorised, defaultCategories, []);
    expect(h.lead).not.toBeNull();
    expect(h.latest).toHaveLength(5);
    expect(h.topStories).toHaveLength(0);
    expect(h.local).toBeNull();
  });

  it("picks People from Community & People portraits only", () => {
    const portrait = { src: "/p.jpg", alt: "p", width: 800, height: 1000 };
    // Newer filler absorbs the lead, latest and top-story slots.
    const filler = [
      ...[1, 2, 3, 4, 5, 6, 7].map((m) => makeArticle({ category: "local-news", publishedAt: minutesAgo(m) })),
      ...[10, 11, 12].map((m) => makeArticle({ category: "business-development", publishedAt: minutesAgo(m) })),
    ];
    const landscapeCommunity = makeArticle({ category: "community-people", publishedAt: minutesAgo(50) });
    const portraitCommunity = makeArticle({ category: "community-people", image: portrait, publishedAt: minutesAgo(60) });
    const flagged = makeArticle({ category: "community-people", featurePeople: true, publishedAt: minutesAgo(70) });
    const h = buildHomepage([...filler, landscapeCommunity, portraitCommunity, flagged], defaultCategories, []);
    // The landscape one is taken by top stories; People gets the portrait and the flagged article.
    expect(h.people?.articles.map((a) => a.id)).toEqual([portraitCommunity.id, flagged.id]);
  });

  it("returns an empty page for no articles", () => {
    const h = buildHomepage([], defaultCategories, ["missing"]);
    expect(h.lead).toBeNull();
    expect(placedIds(h)).toEqual([]);
    expect(h.mostRead).toEqual([]);
  });
});
