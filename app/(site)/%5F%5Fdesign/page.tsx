import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CategoryLabel } from "../../components/CategoryLabel";
import { LatestRail } from "../../components/LatestRail";
import { MostRead } from "../../components/MostRead";
import { PeopleBand } from "../../components/PeopleBand";
import { SectionHeader } from "../../components/SectionHeader";
import { StoryCard } from "../../components/StoryCard";
import { AdSlot } from "../../components/shell/AdSlot";
import { categoryBySlug, getArticles, getCategories } from "@/lib/content";

// Temporary dev-only reference page for the Phase 1 foundations.
// The folder is named %5F%5Fdesign so the URL is /__design (a plain _folder is private in the App Router).

export const metadata: Metadata = {
  title: "Design foundations (dev only)",
  robots: { index: false, follow: false },
};

const YORUBA = "Àgbádárìgì Ọjà Ẹ̀kọ́ ṣ";

const colours = [
  { token: "--cm-lime", hex: "#9AFF01", use: "Fills, markers, rules; text only on black", swatch: "bg-cm-lime" },
  { token: "--cm-black", hex: "#000000", use: "Masthead, footer, dark bands, headlines, body", swatch: "bg-cm-black" },
  { token: "--cm-white", hex: "#FFFFFF", use: "Reading background", swatch: "bg-cm-white" },
  { token: "--cm-paper", hex: "#F3F3EF", use: "Ad bands, neutral strips", swatch: "bg-cm-paper" },
  { token: "--cm-rule", hex: "#D9D9D4", use: "1px dividers on white", swatch: "bg-cm-rule" },
  { token: "--cm-rule-dark", hex: "#333330", use: "1px dividers on black", swatch: "bg-cm-rule-dark" },
  { token: "--cm-meta", hex: "#5C5C58", use: "Bylines, times, captions (6.7:1)", swatch: "bg-cm-meta" },
  { token: "--cm-meta-on-dark", hex: "#B8B8B2", use: "Secondary text on black (10.5:1)", swatch: "bg-cm-meta-dark" },
  { token: "--cm-ink-soft", hex: "#222222", use: "Standfirsts and summaries", swatch: "bg-cm-ink" },
  { token: "--cm-ad-border", hex: "#8A8A84", use: "Dashed outline on empty ad slots (dev only)", swatch: "bg-cm-ad-border" },
];

const typeScale = [
  { role: "Lead headline", spec: "30/1.08 → 50/1.05, Serif 700", className: "font-serif font-bold text-cm-lead" },
  { role: "Feature headline", spec: "26/1.1 → 40/1.08, Serif 700", className: "font-serif font-bold text-cm-feature" },
  { role: "Band title", spec: "30/1 → 44/1, Serif 700", className: "font-serif font-bold text-cm-band" },
  { role: "Section lead card", spec: "24/1.12 → 30/1.1, Serif 700", className: "font-serif font-bold text-cm-card-lg" },
  { role: "Card headline", spec: "19/1.2 → 22/1.2, Serif 700", className: "font-serif font-bold text-cm-card" },
  { role: "List headline", spec: "18/1.25 → 19/1.25, Serif 600", className: "font-serif font-semibold text-cm-list" },
  { role: "Standfirst", spec: "17/1.5 → 20/1.5, Sans 400", className: "text-cm-standfirst text-cm-ink" },
  { role: "Summary", spec: "16/1.45 → 17/1.45, Sans 400", className: "text-cm-summary text-cm-ink" },
  { role: "Section heading", spec: "19 → 22, Sans 800, uppercase", className: "text-cm-section font-extrabold uppercase" },
  { role: "Kicker", spec: "13 → 14, Sans 800, uppercase, 0.1em", className: "text-cm-kicker font-extrabold uppercase tracking-cm-caps" },
  { role: "Metadata", spec: "13 → 14, Sans 400 / 700", className: "text-cm-metadata text-cm-meta" },
  { role: "Label", spec: "11, Sans 800, uppercase, 0.12em", className: "text-cm-label font-extrabold uppercase tracking-[0.12em]" },
];

const weights = [
  { name: "Source Serif 4 · 600", className: "font-serif font-semibold" },
  { name: "Source Serif 4 · 700", className: "font-serif font-bold" },
  { name: "Source Sans 3 · 400", className: "font-sans font-normal" },
  { name: "Source Sans 3 · 700", className: "font-sans font-bold" },
  { name: "Source Sans 3 · 800", className: "font-sans font-extrabold" },
  { name: "Source Sans 3 · 300 italic", className: "font-sans font-light italic" },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-6 flex items-center gap-3 border-t-[6px] border-cm-black pt-3 text-cm-section font-extrabold uppercase">
      <span aria-hidden="true" className="inline-block size-3.5 bg-cm-lime outline outline-1 outline-cm-black" />
      {children}
    </h2>
  );
}

export default async function DesignFoundationsPage() {
  if (process.env.NODE_ENV === "production") notFound();
  const now = new Date();
  const [articles, categories] = await Promise.all([getArticles(now), getCategories()]);
  const cat = (a: (typeof articles)[number]) => categoryBySlug(categories, a.category);
  const withImage = articles.filter((a) => a.image);
  const noImage = articles.filter((a) => !a.image);
  const people = articles.filter((a) => a.role);
  const culture = articles.find((a) => a.slug.startsWith("ogu-"));

  return (
    <div className="mx-auto max-w-cm px-(--cm-gutter) py-10">
      <p className="mb-2 text-cm-label font-extrabold uppercase tracking-[0.12em] text-cm-meta">
        Dev only · not shipped
      </p>
      <h1 className="mb-10 font-serif text-cm-lead font-bold">Design foundations</h1>

      <section aria-labelledby="colours" className="mb-14">
        <SectionTitle>
          <span id="colours">Colour tokens</span>
        </SectionTitle>
        <ul className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
          {colours.map((c) => (
            <li key={c.token} className="flex items-center gap-4 border-b border-cm-rule py-3">
              <span aria-hidden="true" className={`size-14 shrink-0 border border-cm-rule ${c.swatch}`} />
              <span>
                <span className="block font-bold">{c.token}</span>
                <span className="block text-cm-metadata text-cm-meta">
                  {c.hex} · {c.use}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="type" className="mb-14">
        <SectionTitle>
          <span id="type">Type scale</span>
        </SectionTitle>
        <p className="mb-6 text-cm-metadata text-cm-meta">Mobile size → desktop size from 1024px.</p>
        <ul>
          {typeScale.map((t) => (
            <li key={t.role} className="border-b border-cm-rule py-4">
              <span className="mb-1 block text-cm-metadata font-bold text-cm-meta">
                {t.role} · {t.spec}
              </span>
              <span className={`block ${t.className}`}>{t.role}: {YORUBA}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="weights" className="mb-14">
        <SectionTitle>
          <span id="weights">Weights and Yoruba diacritics</span>
        </SectionTitle>
        <ul>
          {weights.map((w) => (
            <li key={w.name} className="border-b border-cm-rule py-4">
              <span className="mb-1 block text-cm-metadata font-bold text-cm-meta">{w.name}</span>
              <span className={`block text-[32px] leading-tight ${w.className}`}>{YORUBA}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="dark" className="cm-on-dark mb-14 bg-cm-black p-6 text-cm-white">
        <h2 id="dark" className="mb-4 text-cm-section font-extrabold uppercase text-cm-lime">
          On black
        </h2>
        <Image
          src="/citymood-logo.png"
          alt="CityMood"
          width={1280}
          height={1259}
          className="mb-4 h-[104px] w-auto"
        />
        <p className="mb-1 italic font-light uppercase tracking-cm-tagline text-[17px]">Window to Badagry</p>
        <p className="mb-4 text-cm-metadata text-cm-meta-dark">Secondary text in --cm-meta-on-dark</p>
        <a href="#dark" className="inline-flex min-h-11 items-center font-bold text-cm-white underline">
          Focusable link on black (Tab to see the lime outline)
        </a>
      </section>

      <section aria-labelledby="focus">
        <SectionTitle>
          <span id="focus">Focus and lime on light</span>
        </SectionTitle>
        <div className="flex flex-wrap items-center gap-4">
          <a href="#focus" className="inline-flex min-h-11 items-center font-bold underline">
            Focusable link on white
          </a>
          <span className="bg-cm-lime px-2 py-1 text-cm-label font-extrabold uppercase tracking-[0.12em] text-cm-black">
            Breaking
          </span>
          <span className="flex items-center gap-2 text-cm-kicker font-extrabold uppercase tracking-cm-caps">
            <span aria-hidden="true" className="inline-block size-3 bg-cm-lime outline outline-1 outline-cm-black" />
            Kicker marker
          </span>
        </div>
      </section>

      <section aria-labelledby="components" className="mt-14">
        <SectionTitle>
          <span id="components">Components (seed data)</span>
        </SectionTitle>
        <div className="space-y-12">
          <div className="flex flex-wrap gap-6">
            <CategoryLabel category={categories[0]} />
            <span className="cm-on-dark bg-cm-black p-2">
              <CategoryLabel category={categories[1]} onDark />
            </span>
          </div>
          <SectionHeader id="demo-section" title="Business & Development" shortTitle="Business" href="#" />
          <StoryCard article={withImage[0]} variant="lead" category={cat(withImage[0])} headingLevel={3} />
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {withImage.slice(1, 4).map((a) => (
              <StoryCard key={a.id} article={a} variant="standard" category={cat(a)} />
            ))}
            <StoryCard article={noImage[0]} variant="standard" category={cat(noImage[0])} />
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <StoryCard article={withImage[4]} variant="section-lead" />
            <div>
              <StoryCard article={withImage[5]} variant="compact" category={cat(withImage[5])} className="border-b border-cm-rule pb-4" />
              <StoryCard article={withImage[6]} variant="compact" category={cat(withImage[6])} showSummary={false} className="border-b border-cm-rule py-4" />
              <StoryCard article={noImage[1]} variant="list" />
              <StoryCard article={noImage[2]} variant="list" />
            </div>
          </div>
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            {culture && <StoryCard article={culture} variant="feature" category={cat(culture)} related={noImage.slice(3, 5)} />}
            <LatestRail articles={articles.slice(0, 5)} categories={categories} now={now} />
          </div>
          <div className="-mx-(--cm-gutter)">
            <PeopleBand articles={people} category={categories[1]} />
          </div>
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-6">
              <AdSlot slot="leaderboard" now={now} />
              <AdSlot slot="billboard" now={now} />
            </div>
            <div className="space-y-6">
              <MostRead articles={articles.slice(0, 4)} />
              <AdSlot slot="mpu_1" now={now} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
