import Link from "next/link";
import type { Article, Category } from "@/lib/content";
import { formatLatestTime } from "@/lib/format";
import { articleHref } from "@/lib/urls";
import { ArticleMeta } from "./ArticleMeta";
import { CategoryLabel } from "./CategoryLabel";
import { StoryImage } from "./StoryImage";

// DESIGN_SPEC.md §4.8. Every card is an <article>; the headline is a heading
// wrapping one link. Cards without an image render text-only. Headlines are
// never truncated.

export type StoryCardVariant =
  | "lead"
  | "standard"
  | "section-lead"
  | "compact"
  | "list"
  | "latest"
  | "portrait"
  | "feature";

type HeadingLevel = 1 | 2 | 3;

type Props = {
  article: Article;
  variant: StoryCardVariant;
  /** Resolved category, for the kicker and the Latest meta line. */
  category?: Category;
  headingLevel?: HeadingLevel;
  /** Show the kicker on standard and compact cards. */
  showCategory?: boolean;
  /** Compact cards: show the standfirst as a summary. */
  showSummary?: boolean;
  /** Latest variant: reference time for "10:42" / "Yesterday". */
  now?: Date;
  /** Feature variant: up to two related links. */
  related?: Article[];
  className?: string;
};

const headlineLink = "hover:underline decoration-2 underline-offset-4";

function Headline({
  level,
  className,
  article,
  linkClassName = "",
}: {
  level: HeadingLevel;
  className: string;
  article: Article;
  linkClassName?: string;
}) {
  const H = `h${level}` as const;
  return (
    <H className={className}>
      <Link href={articleHref(article)} className={`${headlineLink} ${linkClassName}`}>
        {article.title}
      </Link>
    </H>
  );
}

export function StoryCard({
  article,
  variant,
  category,
  headingLevel = 3,
  showCategory = true,
  showSummary = true,
  now,
  related = [],
  className = "",
}: Props) {
  const { image } = article;

  switch (variant) {
    case "lead":
      return (
        <article className={className}>
          {image && (
            <StoryImage
              image={image}
              ratio="aspect-[3/2] lg:aspect-video"
              sizes="(min-width: 1240px) 790px, (min-width: 1024px) 64vw, 100vw"
              eager
              className="-mx-(--cm-gutter) mb-[18px] sm:mx-0"
            />
          )}
          {category && <CategoryLabel category={category} className="mb-2.5" />}
          <Headline
            level={headingLevel}
            article={article}
            className="mb-3.5 font-serif text-cm-lead font-bold tracking-[-0.015em]"
          />
          <p className="mb-3.5 max-w-[720px] text-cm-standfirst text-cm-ink">{article.standfirst}</p>
          <ArticleMeta article={article} />
        </article>
      );

    case "standard":
      return (
        <article className={className}>
          {image && (
            <StoryImage
              image={image}
              ratio="aspect-[3/2]"
              sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
              className="mb-3"
            />
          )}
          {showCategory && category && <CategoryLabel category={category} className="mb-1.5" />}
          <Headline level={headingLevel} article={article} className="font-serif text-cm-card font-bold" />
        </article>
      );

    case "section-lead":
      return (
        <article className={className}>
          {image && (
            <StoryImage
              image={image}
              ratio="aspect-[16/10]"
              sizes="(min-width: 1024px) 560px, 100vw"
              className="mb-3.5"
            />
          )}
          <Headline level={headingLevel} article={article} className="mb-2 font-serif text-cm-card-lg font-bold" />
          <p className="text-cm-summary text-cm-ink">{article.standfirst}</p>
        </article>
      );

    case "compact":
      // Mobile: text left, 96px square thumbnail right. From 640px: 180px 3:2 thumbnail left.
      return (
        <article className={`flex items-start gap-4 sm:gap-[18px] ${className}`}>
          {image && (
            <StoryImage
              image={image}
              ratio="aspect-square sm:aspect-[3/2]"
              sizes="(min-width: 640px) 180px, 96px"
              className="order-2 w-24 flex-none sm:order-none sm:w-[180px]"
            />
          )}
          <div className="min-w-0 flex-1">
            {showCategory && category && <CategoryLabel category={category} className="mb-1" />}
            <Headline level={headingLevel} article={article} className="font-serif text-cm-card font-bold" />
            {showSummary && <p className="mt-1.5 text-cm-summary text-cm-ink">{article.standfirst}</p>}
          </div>
        </article>
      );

    case "list":
      return (
        <article className={`border-b border-cm-rule py-3.5 ${className}`}>
          <Headline level={headingLevel} article={article} className="font-serif text-cm-list font-semibold" />
        </article>
      );

    case "latest":
      return (
        <article className={`border-b border-cm-rule py-3.5 ${className}`}>
          <p className="mb-0.5 text-[13px] font-bold text-cm-meta">
            <time dateTime={article.publishedAt}>{formatLatestTime(article.publishedAt, now ?? new Date())}</time>
            {category && ` · ${category.shortName}`}
          </p>
          <Headline level={headingLevel} article={article} className="font-serif text-cm-list font-semibold" />
        </article>
      );

    case "portrait":
      // On black (PeopleBand). Role and place in lime, headline in white Serif 600.
      return (
        <article className={className}>
          {image && (
            <StoryImage
              image={image}
              ratio="aspect-[4/5]"
              sizes="(min-width: 1024px) 290px, (min-width: 640px) 50vw, 210px"
              className="mb-3"
            />
          )}
          {(article.role || article.place) && (
            <p className="mb-1 text-sm font-bold text-cm-lime">
              {[article.role, article.place].filter(Boolean).join(", ")}
            </p>
          )}
          <Headline
            level={headingLevel}
            article={article}
            className="font-serif text-cm-card font-semibold"
            linkClassName="text-cm-white"
          />
        </article>
      );

    case "feature":
      // Image first on mobile (4:3), side by side from 1024px (16:9).
      return (
        <article className={`grid items-center gap-6 lg:grid-cols-[3fr_2fr] lg:gap-9 ${className}`}>
          {image && (
            <figure>
              <StoryImage
                image={image}
                ratio="aspect-[4/3] lg:aspect-video"
                sizes="(min-width: 1240px) 720px, (min-width: 1024px) 58vw, 100vw"
                className="-mx-(--cm-gutter) sm:mx-0"
              />
              {(image.caption || image.credit) && (
                <figcaption className="pt-2 text-[13px] text-cm-meta">
                  {[image.caption, image.credit].filter(Boolean).join(" ")}
                </figcaption>
              )}
            </figure>
          )}
          <div className="min-w-0">
            {category && <CategoryLabel category={category} className="mb-3" />}
            <Headline level={headingLevel} article={article} className="mb-3.5 font-serif text-cm-feature font-bold" />
            <p className="mb-4 text-cm-standfirst text-cm-ink">{article.standfirst}</p>
            {related.length > 0 && (
              <ul className="border-t border-cm-rule">
                {related.slice(0, 2).map((r) => (
                  <li key={r.id} className="border-b border-cm-rule py-3">
                    <Link href={articleHref(r)} className={`text-[17px] font-semibold ${headlineLink}`}>
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </article>
      );
  }
}
