import type { Metadata } from "next";
import { mostReadSlugs } from "@/config/mostRead";
import { site } from "@/config/site";
import { categoryBySlug, getArticles, getCategories, type Article, type Category } from "@/lib/content";
import { buildHomepage, type CategoryBlock } from "@/lib/homepage";
import { categoryHref } from "@/lib/urls";
import { LatestRail } from "./components/LatestRail";
import { MostRead } from "./components/MostRead";
import { PeopleBand } from "./components/PeopleBand";
import { SectionHeader } from "./components/SectionHeader";
import { StoryCard } from "./components/StoryCard";
import { AdSlot } from "./components/shell/AdSlot";

// Homepage composition: DESIGN_SPEC.md §5.
// The DOM follows the desktop order (1024px+). Below 1024px, `order-*` classes
// rearrange rows into the mobile order: lead, latest, MPU, top stories, People,
// Local, Politics, Culture, Most read, Business (+ MPU), Tourism.

const container = "mx-auto w-full max-w-cm px-(--cm-gutter)";

async function loadHomepage() {
  const now = new Date();
  const [articles, categories] = await Promise.all([getArticles(now), getCategories()]);
  return { now, categories, home: buildHomepage(articles, categories, mostReadSlugs) };
}

export async function generateMetadata(): Promise<Metadata> {
  const { home } = await loadHomepage();
  const image = home.lead?.image;
  // Without a lead image, app/opengraph-image.png (logo on black) applies.
  if (!image) return {};
  const images = [{ url: image.src, width: image.width, height: image.height, alt: image.alt }];
  return { openGraph: { images }, twitter: { card: "summary_large_image", images } };
}

function JsonLd() {
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "NewsMediaOrganization",
      name: site.name,
      url: site.url,
      logo: `${site.url}/citymood-logo.png`,
      sameAs: site.social.map((s) => s.url),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: site.name,
      url: site.url,
      potentialAction: {
        "@type": "SearchAction",
        target: `${site.url}${site.searchPath}?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/** Local News / Politics: SectionHeader, one compact card, two list items. */
function CompactBlock({ block, id }: { block: CategoryBlock; id: string }) {
  return (
    <section aria-labelledby={id} className="min-w-0">
      <SectionHeader
        id={id}
        title={block.category.name}
        shortTitle={block.category.shortName}
        href={categoryHref(block.category.slug)}
        className="mb-[18px]"
      />
      <StoryCard
        article={block.first}
        variant="compact"
        showCategory={false}
        className="border-b border-cm-rule pb-4"
      />
      {block.list.map((a) => (
        <StoryCard key={a.id} article={a} variant="list" />
      ))}
    </section>
  );
}

function TopStories({ articles, categories }: { articles: Article[]; categories: Category[] }) {
  if (articles.length === 0) return null;
  const cat = (a: Article) => categoryBySlug(categories, a.category);
  return (
    <section aria-labelledby="top-stories" className={`${container} order-3 lg:order-none`}>
      <h2 id="top-stories" className="sr-only">
        Top stories
      </h2>
      {/* Below 640px: two compact cards (DESIGN_SPEC.md §5, mobile item 7). */}
      <div className="border-t border-cm-rule sm:hidden">
        {articles.slice(0, 2).map((a) => (
          <StoryCard
            key={a.id}
            article={a}
            variant="compact"
            category={cat(a)}
            showSummary={false}
            className="border-b border-cm-rule py-4"
          />
        ))}
      </div>
      {/* From 640px: standard cards, two columns on tablet, four on desktop. */}
      <div className="hidden gap-7 border-t border-cm-rule pt-8 pb-2 sm:grid sm:grid-cols-2 lg:grid-cols-4 lg:pb-10">
        {articles.map((a) => (
          <StoryCard key={a.id} article={a} variant="standard" category={cat(a)} />
        ))}
      </div>
    </section>
  );
}

export default async function HomePage() {
  const { now, categories, home } = await loadHomepage();
  const cat = (a: Article) => categoryBySlug(categories, a.category);

  if (!home.lead) {
    return (
      <div className={`${container} py-16`}>
        <h1 className="mb-3 font-serif text-cm-feature font-bold">No stories yet</h1>
        <p className="max-w-[640px] text-cm-standfirst text-cm-ink">
          The CityMood newsroom hasn’t published anything here yet. Please check back soon.
        </p>
      </div>
    );
  }

  const { lead, latest, topStories, local, politics, business, people, culture, tourism, mostRead } = home;

  return (
    <>
      <JsonLd />
      <div className="flex flex-col">
        {/* 1. Leaderboard: tablet and desktop only (the mobile order starts with the lead). */}
        <AdSlot slot="leaderboard" now={now} className="hidden sm:block" />

        {/* 2. Lead (two thirds) and Latest (one third). */}
        <div className={`${container} order-1 grid gap-8 pb-8 sm:pt-6 lg:order-none lg:grid-cols-[2fr_1fr] lg:gap-9 lg:pt-8 lg:pb-9`}>
          <StoryCard article={lead} variant="lead" category={cat(lead)} headingLevel={1} className="min-w-0" />
          <LatestRail articles={latest} categories={categories} now={now} className="min-w-0" />
        </div>

        {/* Mobile and tablet: first MPU after Latest. */}
        <div className={`${container} order-2 pb-8 lg:hidden`}>
          <AdSlot slot="mpu" now={now} band={false} />
        </div>

        {/* 3. Top stories. */}
        <TopStories articles={topStories} categories={categories} />

        {/* 4. Local News and Politics & Public Affairs: side by side from 1024px. */}
        {(local || politics) && (
          <div className={`${container} order-5 grid gap-10 py-8 lg:order-none lg:grid-cols-2 lg:py-10`}>
            {local && <CompactBlock block={local} id="local-news" />}
            {politics && <CompactBlock block={politics} id="politics" />}
          </div>
        )}

        {/* 5. People of Badagry, full width. */}
        {people && (
          <PeopleBand
            articles={people.articles}
            category={people.category}
            className="order-4 mt-4 mb-8 lg:order-none lg:mt-0 lg:mb-0"
          />
        )}

        {/* 6. Business & Development: section lead, three list items, MPU. */}
        {business && (
          <section aria-labelledby="business" className={`${container} order-8 py-8 lg:order-none lg:pt-11 lg:pb-10`}>
            <SectionHeader
              id="business"
              title={business.category.name}
              shortTitle={business.category.shortName}
              href={categoryHref(business.category.slug)}
              className="mb-5"
            />
            <div className="grid gap-8 sm:grid-cols-[3fr_2fr] lg:grid-cols-[2fr_1fr_300px]">
              <StoryCard article={business.first} variant="section-lead" className="min-w-0" />
              <div className="min-w-0 [&>article:first-child]:pt-0">
                {business.list.map((a) => (
                  <StoryCard key={a.id} article={a} variant="list" />
                ))}
              </div>
              <AdSlot slot="mpu" now={now} band={false} className="sm:col-span-2 lg:col-span-1" />
            </div>
          </section>
        )}

        {/* 7. Culture & Events feature. */}
        {culture && (
          <section aria-labelledby="culture" className={`${container} order-6 py-4 lg:order-none lg:py-11`}>
            <h2 id="culture" className="sr-only">
              {culture.category.name}
            </h2>
            <div className="lg:border-t lg:border-cm-rule lg:pt-11">
              <StoryCard
                article={culture.feature}
                variant="feature"
                category={culture.category}
                related={culture.related}
              />
            </div>
          </section>
        )}

        {/* Mobile and tablet: Most read sits between Culture and Business. */}
        <div className={`${container} order-7 py-8 lg:hidden`}>
          <MostRead articles={mostRead} id="most-read-mobile" />
        </div>

        {/* 8. Billboard: desktop only. */}
        <AdSlot slot="billboard" now={now} className="hidden lg:block" />

        {/* 9. Tourism & Heritage (two thirds) and Most read (one third). */}
        <div className={`${container} order-9 grid gap-10 pt-8 pb-12 lg:order-none lg:grid-cols-[2fr_1fr] lg:pt-11 lg:pb-14`}>
          {tourism && (
            <section aria-labelledby="tourism" className="min-w-0">
              <SectionHeader
                id="tourism"
                title={tourism.category.name}
                shortTitle={tourism.category.shortName}
                href={categoryHref(tourism.category.slug)}
                className="mb-5"
              />
              <div className="grid gap-6 sm:grid-cols-2">
                {tourism.articles.map((a) => (
                  <StoryCard key={a.id} article={a} variant="standard" showCategory={false} />
                ))}
              </div>
            </section>
          )}
          <MostRead articles={mostRead} className="hidden self-start lg:block" />
        </div>
      </div>
    </>
  );
}
