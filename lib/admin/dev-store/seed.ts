import { randomUUID } from "node:crypto";
import { mostReadSlugs } from "@/config/mostRead";
import { site } from "@/config/site";
import { defaultCategories } from "@/lib/content/categories";
import { seedArticles } from "@/lib/content/seed";
import { docFromParagraphs, renderBodyHtml } from "../richtext";
import type { Article, Database, Media, StaffRole, Uuid } from "../types";

// DEVELOPMENT SEED for data/admin-dev.json. Every story, name and photo is a
// fictional placeholder, not CityMood reporting or staff. The stories come from
// lib/content/seed.ts, so the homepage looks the same as before the admin existed.

export const DEMO_USERS: Record<"admin" | "editor" | "reporter" | "reporter2" | "invited", {
  id: Uuid;
  email: string;
  full_name: string;
  role: StaffRole;
}> = {
  admin: { id: "d0000000-0000-4000-8000-00000000000a", email: "admin@demo.citymood.test", full_name: "Demo Admin", role: "admin" },
  editor: { id: "d0000000-0000-4000-8000-00000000000e", email: "editor@demo.citymood.test", full_name: "Demo Editor", role: "editor" },
  reporter: { id: "d0000000-0000-4000-8000-000000000001", email: "reporter@demo.citymood.test", full_name: "Demo Reporter", role: "reporter" },
  reporter2: { id: "d0000000-0000-4000-8000-000000000002", email: "reporter2@demo.citymood.test", full_name: "Second Demo Reporter", role: "reporter" },
  invited: { id: "d0000000-0000-4000-8000-000000000009", email: "invited@demo.citymood.test", full_name: "Invited Demo Reporter", role: "reporter" },
};

const HOUR = 3_600_000;

export function buildSeed(now: Date = new Date()): Database {
  const iso = (ms: number) => new Date(ms).toISOString();
  const t = now.getTime();
  const db: Database = {
    auth_users: [], profiles: [], categories: [], tags: [], media: [], articles: [], article_tags: [],
    front_page_pins: [], most_read_picks: [], ad_campaigns: [],
    site_settings: [
      {
        id: true,
        newsroom_address: site.contact.address,
        newsroom_phone: site.contact.phone,
        newsroom_email: site.contact.newsroomEmail,
        corrections_email: site.contact.correctionsEmail,
        facebook_url: site.social.find((s) => s.network === "Facebook")?.url ?? "",
        instagram_url: site.social.find((s) => s.network === "Instagram")?.url ?? "",
        tiktok_url: site.social.find((s) => s.network === "TikTok")?.url ?? "",
      },
    ],
  };

  for (const [key, u] of Object.entries(DEMO_USERS)) {
    const invitedOnly = key === "invited";
    db.auth_users.push({
      id: u.id, email: u.email, raw_user_meta_data: { full_name: u.full_name },
      invited_at: iso(t - 30 * 24 * HOUR), last_sign_in_at: invitedOnly ? null : iso(t - 2 * HOUR),
      created_at: iso(t - 30 * 24 * HOUR),
    });
    db.profiles.push({ id: u.id, full_name: u.full_name, role: u.role, is_active: true, created_at: iso(t - 30 * 24 * HOUR) });
  }

  const categoryId = new Map<string, Uuid>();
  for (const c of defaultCategories) {
    const id = randomUUID();
    categoryId.set(c.slug, id);
    db.categories.push({ id, name: c.name, slug: c.slug, position: c.order, is_active: true });
  }

  const seedTag = { id: randomUUID(), name: "Seed placeholder", slug: "seed-placeholder" };
  db.tags.push(seedTag);
  const tagFor = new Map<string, Uuid>();
  const tag = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    if (!tagFor.has(slug)) {
      const id = randomUUID();
      tagFor.set(slug, id);
      db.tags.push({ id, name, slug });
    }
    return tagFor.get(slug)!;
  };

  // One media row per seed file (storage_path is unique); the first story's alt text wins.
  const mediaFor = new Map<string, Media>();
  const writers = [DEMO_USERS.reporter.id, DEMO_USERS.reporter2.id, DEMO_USERS.editor.id];

  const stories = seedArticles(now);
  stories.forEach((s, i) => {
    let image: Media | undefined;
    if (s.image) {
      const path = s.image.src.replace(/^\//, "");
      image = mediaFor.get(path);
      if (!image) {
        image = {
          id: randomUUID(), storage_path: path, width: s.image.width, height: s.image.height,
          alt: s.image.alt, caption: s.image.caption ?? "", credit: s.image.credit ?? "",
          focal_x: s.image.focalPoint?.x ?? 0.5, focal_y: s.image.focalPoint?.y ?? 0.5,
          uploaded_by: DEMO_USERS.editor.id, created_at: iso(t - 40 * 24 * HOUR),
        };
        mediaFor.set(path, image);
        db.media.push(image);
      }
    }
    const body = docFromParagraphs(s.body);
    const breaking = s.tags.includes("breaking");
    const article: Article = {
      id: randomUUID(), slug: s.slug, headline: s.title, standfirst: s.standfirst, body,
      body_html: renderBodyHtml(body),
      category_id: (s.category && categoryId.get(s.category)) || null,
      author_id: writers[i % writers.length], featured_image_id: image?.id ?? null,
      status: "published", publish_at: s.publishedAt, featured: s.featured, breaking,
      breaking_until: breaking ? iso(Date.parse(s.publishedAt) + 6 * HOUR) : null,
      seo_title: "", seo_description: "",
      created_by: writers[i % writers.length], updated_by: writers[i % writers.length],
      created_at: s.publishedAt, updated_at: s.publishedAt,
    };
    db.articles.push(article);
    db.article_tags.push({ article_id: article.id, tag_id: seedTag.id });
    if (s.place) db.article_tags.push({ article_id: article.id, tag_id: tag(s.place) });
  });

  // Stories that aren't live, so every tab on the Articles screen has something in it.
  const notLive: Partial<Article>[] = [
    {
      headline: "Seed draft: jetty ferry timetable changes from next month",
      standfirst: "A placeholder draft for the Demo Reporter.",
      category_id: categoryId.get("local-news")!, author_id: DEMO_USERS.reporter.id, status: "draft",
    },
    {
      headline: "Seed draft with no category yet",
      author_id: DEMO_USERS.reporter2.id, status: "draft",
    },
    {
      headline: "Seed scheduled story: heritage walk opens at the weekend",
      standfirst: "A placeholder story scheduled for tomorrow morning.",
      category_id: categoryId.get("tourism-heritage")!, author_id: DEMO_USERS.reporter.id,
      status: "scheduled", publish_at: iso(t + 20 * HOUR),
    },
    {
      headline: "Seed unpublished story: corrected market opening times",
      standfirst: "A placeholder story an editor took down.",
      category_id: categoryId.get("business-development")!, author_id: DEMO_USERS.reporter2.id,
      status: "unpublished", publish_at: iso(t - 72 * HOUR),
    },
  ];
  notLive.forEach((a, i) => {
    const body = docFromParagraphs("Placeholder body text for a seed story. This is not CityMood reporting.");
    const stamp = iso(t - (i + 1) * 3 * HOUR);
    db.articles.push({
      id: randomUUID(), slug: `seed-${a.status}-${i + 1}`, headline: "", standfirst: "", body,
      body_html: renderBodyHtml(body), category_id: null, author_id: null, featured_image_id: null,
      status: "draft", publish_at: null, featured: false, breaking: false, breaking_until: null,
      seo_title: "", seo_description: "", created_by: a.author_id ?? null, updated_by: a.author_id ?? null,
      created_at: stamp, updated_at: stamp,
      ...a,
    });
  });

  const bySlug = new Map(db.articles.map((a) => [a.slug, a.id]));
  mostReadSlugs.forEach((slug, i) => {
    const id = bySlug.get(slug);
    if (id) db.most_read_picks.push({ position: i + 1, article_id: id });
  });

  return db;
}
