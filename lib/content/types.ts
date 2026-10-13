// CityMood content model. The repository in ./index.ts is the only thing the UI
// imports, so a CMS can replace the seed adapter without touching components.

export type Category = {
  slug: string;
  name: string;
  /** Short label for the mobile section strip, e.g. "Local". */
  shortName: string;
  order: number;
};

export type ArticleImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Editor's focal point, 0–1 on each axis. Maps to object-position. */
  focalPoint?: { x: number; y: number };
  caption?: string;
  credit?: string;
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  standfirst: string;
  /** Plain-text paragraphs separated by blank lines. */
  body: string;
  image: ArticleImage | null;
  /** Category slug, or null when uncategorised. */
  category: string | null;
  /** "breaking" puts the article in the ticker. */
  tags: string[];
  author: string;
  /** ISO 8601. */
  publishedAt: string;
  readingMinutes?: number;
  /** Candidate for the homepage lead. */
  featured: boolean;
  /** Editor flag for the People of Badagry band. */
  featurePeople?: boolean;
  /** Portrait line on People cards: "Canoe builder" + "Topo". */
  role?: string;
  place?: string;
  /** Reserved for view counting; unused while Most read is curated. */
  viewCount?: number;
};

/** Where articles come from. The seed adapter implements this today; a CMS adapter later. */
export type ContentSource = {
  categories(): Promise<Category[]>;
  /** Every article, any order. The repository filters and sorts. */
  articles(now: Date): Promise<Article[]>;
};
