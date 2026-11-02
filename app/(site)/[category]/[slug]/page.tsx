import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleMeta } from "@/app/components/ArticleMeta";
import { ArticleViewBeacon } from "@/app/components/ArticleViewBeacon";
import { StoryImage } from "@/app/components/StoryImage";
import { categoryBySlug, getCategories, getPublishedArticle } from "@/lib/content";

type ArticlePageProps = { params: Promise<{ category: string; slug: string }> };

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article) return {};
  return { title: `${article.title} | CityMood`, description: article.standfirst || undefined };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { category: categorySlug, slug } = await params;
  const [article, categories] = await Promise.all([getPublishedArticle(slug), getCategories()]);
  if (!article || (article.category && article.category !== categorySlug)) notFound();
  const category = categoryBySlug(categories, article.category);

  return (
    <article className="mx-auto max-w-cm px-(--cm-gutter) py-10">
      <ArticleViewBeacon articleId={article.id} />
      <Link href={category ? `/${category.slug}` : "/"} className="text-sm font-bold underline">← Back to {category?.name ?? "CityMood"}</Link>
      <header className="mt-5 max-w-4xl border-t-[6px] border-cm-black pt-3">
        {category && <p className="text-cm-kicker font-extrabold uppercase tracking-cm-caps">{category.name}</p>}
        <h1 className="mt-2 font-serif text-4xl leading-tight font-bold sm:text-5xl">{article.title}</h1>
        {article.standfirst && <p className="mt-4 max-w-3xl text-cm-standfirst">{article.standfirst}</p>}
        <ArticleMeta article={article} className="mt-5" />
      </header>
      {article.image && <StoryImage image={article.image} ratio="mt-8 aspect-[16/9]" sizes="(max-width: 900px) 100vw, 900px" eager />}
      <div className="mt-8 max-w-3xl">
        {article.body.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index} className="mb-5 text-lg leading-8">{paragraph}</p>)}
      </div>
    </article>
  );
}
