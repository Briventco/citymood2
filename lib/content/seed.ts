import { defaultCategories } from "./categories";
import type { Article, ArticleImage, ContentSource } from "./types";

// DEVELOPMENT SEED CONTENT. Every story, name and photo here is a fictional
// placeholder, not CityMood reporting. It never loads in production unless
// CONTENT_SEED=1 is set (see ./index.ts). Ages are in minutes before "now",
// so the dev homepage, Latest times and the breaking window always look current.

type SeedArticle = Omit<Article, "id" | "publishedAt" | "body" | "author" | "tags" | "featured"> & {
  ageMinutes: number;
  tags?: string[];
  featured?: boolean;
  author?: string;
};

const BODY = [
  "This is a fictional placeholder article used to develop the CityMood website. It is not CityMood reporting, and none of the people, places or events described are real news.",
  "The paragraphs exist so that article pages, reading times and search results have something to work with. Replace them with real copy from the CMS before launch.",
  "Àgbádárìgì Ọjà Ẹ̀kọ́ ṣ is the diacritics test string from the design specification.",
].join("\n\n");

const landscape = (n: number, alt: string, focalPoint?: ArticleImage["focalPoint"]): ArticleImage => ({
  src: `/seed/landscape-${n}.jpg`,
  alt: `Seed placeholder photo: ${alt}`,
  width: 1800,
  height: 1200,
  focalPoint,
  credit: "Seed image",
});

const portrait = (n: number, alt: string): ArticleImage => ({
  src: `/seed/portrait-${n}.jpg`,
  alt: `Seed placeholder portrait: ${alt}`,
  width: 1200,
  height: 1500,
  credit: "Seed image",
});

const seed: SeedArticle[] = [
  // Local News
  {
    slug: "ojo-badagry-road-works-traders-sales-fall",
    title: "Ojo–Badagry road works: traders at Iyana-Era say sales have fallen by half since the diversion",
    standfirst:
      "Shop owners along the corridor say weekday trade dried up when the service lane closed. The contractor says the stretch reopens before December.",
    category: "local-news",
    ageMinutes: 95,
    featured: true,
    readingMinutes: 6,
    image: landscape(1, "roadside shops beside a fenced-off section of expressway", { x: 0.5, y: 0.4 }),
  },
  {
    slug: "agbara-tanker-breakdown-two-lanes-closed",
    title: "Two lanes closed at Agbara after a tanker breaks down on the expressway",
    standfirst: "Traffic officers are directing Lagos-bound vehicles through the service road.",
    category: "local-news",
    ageMinutes: 25,
    tags: ["breaking"],
    image: landscape(2, "traffic queuing on a dual carriageway"),
  },
  {
    slug: "ibereko-power-restored-after-outage",
    title: "Power restored to Ibereko after 30-hour outage",
    standfirst: "The distribution company blamed a failed transformer at the substation.",
    category: "local-news",
    ageMinutes: 150,
    tags: ["breaking"],
    image: null,
  },
  {
    slug: "seme-border-customs-directive-small-importers",
    title: "Seme border: what the new customs directive means for small importers",
    standfirst: "Paperwork changes from next month. We asked clearing agents what traders need to do.",
    category: "local-news",
    ageMinutes: 200,
    image: landscape(4, "lorries waiting at a border post"),
  },
  {
    slug: "agbara-bridge-truck-brakes-two-injured",
    title: "Two injured as truck loses brakes on Agbara bridge",
    standfirst: "Residents renew calls for a weigh station on the route.",
    category: "local-news",
    ageMinutes: 300,
    image: landscape(3, "emergency vehicles on a bridge"),
  },
  {
    slug: "ikoga-road-flooding-overnight-rain",
    title: "Flooding cuts off Ikoga road after overnight rain",
    standfirst: "Commuters waded through knee-deep water to reach the junction.",
    category: "local-news",
    ageMinutes: 1500,
    image: landscape(5, "a flooded road with parked motorcycles"),
  },
  {
    slug: "ajido-fishermen-record-catch",
    title: "Ajido fishermen report a record catch after weeks of rough seas",
    standfirst: "Prices at the beach market fell by a third on Saturday.",
    category: "local-news",
    ageMinutes: 2200,
    image: landscape(7, "canoes pulled up on a beach"),
  },
  {
    slug: "badagry-general-hospital-maternity-wing",
    title: "Badagry General Hospital opens new maternity wing",
    standfirst: "The 40-bed unit replaces wards that flooded last rainy season.",
    category: "local-news",
    ageMinutes: 2800,
    image: landscape(6, "a hospital entrance"),
  },
  {
    slug: "okokomaiko-badagry-late-night-buses",
    title: "Okokomaiko–Badagry buses add a late-night service",
    standfirst: "The last departure moves to 11pm from Monday.",
    category: "local-news",
    ageMinutes: 3200,
    image: null,
  },

  // Community & People
  {
    slug: "topo-canoe-builder-grandfathers-adze",
    title: "“My grandfather’s adze still does the finest work”",
    standfirst: "A canoe builder in Topo on the tools and timber that outlast every trend.",
    category: "community-people",
    ageMinutes: 400,
    role: "Canoe builder",
    place: "Topo",
    image: portrait(1, "a canoe builder in his yard"),
  },
  {
    slug: "agbalata-fish-trader-thirty-years",
    title: "Thirty years at the same fish stall, and still first to open",
    standfirst: "A trader at Agbalata on the market that raised her children.",
    category: "community-people",
    ageMinutes: 900,
    role: "Fish trader",
    place: "Agbalata",
    image: portrait(2, "a market trader at her stall"),
  },
  {
    slug: "marina-heritage-guide-slave-route",
    title: "Telling the slave route story with care, every day",
    standfirst: "A Marina guide on the questions visitors ask, and the ones they don’t.",
    category: "community-people",
    ageMinutes: 1700,
    role: "Heritage guide",
    place: "Marina",
    image: portrait(3, "a tour guide by the waterfront"),
  },
  {
    slug: "ajara-corps-member-maths-teacher",
    title: "The maths teacher who stayed on after her service year",
    standfirst: "She came to Ajara for one year of national service. That was six years ago.",
    category: "community-people",
    ageMinutes: 2600,
    role: "Corps member",
    place: "Ajara",
    image: portrait(4, "a teacher in a classroom"),
  },
  {
    slug: "gberefu-clean-up-volunteers",
    title: "Gberefu clean-up draws hundreds of volunteers before festival season",
    standfirst: "Organisers collected more than 300 bags of plastic in a morning.",
    category: "community-people",
    ageMinutes: 330,
    image: landscape(7, "volunteers with sacks on a beach"),
  },
  {
    slug: "marina-residents-streetlight-petition",
    title: "Marina residents petition for working streetlights",
    standfirst: "The petition goes to the council’s works committee next week.",
    category: "community-people",
    ageMinutes: 210,
    image: null,
  },

  // Business & Development
  {
    slug: "agbalata-market-traders-protest-stall-levy",
    title: "Agbalata market traders protest new stall levy",
    standfirst: "Traders closed their stalls for two hours and marched to the council secretariat.",
    category: "business-development",
    ageMinutes: 170,
    image: landscape(2, "market stalls under corrugated roofs"),
  },
  {
    slug: "jetty-cold-room-hub-catch",
    title: "New cold-room hub at the jetty promises longer life for the day’s catch",
    standfirst: "Fish sellers can rent shelf space by the day.",
    category: "business-development",
    ageMinutes: 260,
    image: landscape(8, "a jetty at morning"),
  },
  {
    slug: "gberefu-coconut-farmers-cooperative",
    title: "Coconut farmers in Gberefu form a cooperative to cut out the middlemen",
    standfirst: "Forty farms have signed up. The first joint sale goes to a Lagos processor next month.",
    category: "business-development",
    ageMinutes: 520,
    image: landscape(3, "a coconut plantation"),
  },
  {
    slug: "fuel-prices-badagry-central-lagos",
    title: "Why fuel prices hit Badagry harder than central Lagos",
    standfirst: "Distance from the depots adds up at the pump.",
    category: "business-development",
    ageMinutes: 800,
    image: null,
  },
  {
    slug: "small-hotels-august-festival-rush",
    title: "Small hotels prepare for the August festival rush",
    standfirst: "Some guesthouses are already fully booked.",
    category: "business-development",
    ageMinutes: 1300,
    image: landscape(4, "a guesthouse courtyard"),
  },
  {
    slug: "pos-agents-cash-shortage-eases",
    title: "POS agents adapt as the cash shortage eases",
    standfirst: "Withdrawal fees are falling back to normal.",
    category: "business-development",
    ageMinutes: 2000,
    image: null,
  },

  // Politics & Public Affairs
  {
    slug: "council-emergency-session-stall-levy",
    title: "Council confirms an emergency session on the market stall levy for Thursday",
    standfirst: "The chairman says the levy is suspended until councillors vote.",
    category: "politics-public-affairs",
    ageMinutes: 70,
    tags: ["breaking"],
    image: landscape(5, "a council chamber"),
  },
  {
    slug: "ward-meeting-drainage-contract",
    title: "Ward meeting hears complaints over delayed drainage contract",
    standfirst: "Residents say the work stopped after the first culvert.",
    category: "politics-public-affairs",
    ageMinutes: 280,
    image: landscape(6, "a town hall meeting"),
  },
  {
    slug: "explainer-who-is-responsible-for-badagry-roads",
    title:
      "Explainer: federal, state or council — who is actually responsible for fixing each of the roads that lead into Badagry town?",
    standfirst: "We traced five routes and the agencies that own them.",
    category: "politics-public-affairs",
    ageMinutes: 450,
    image: landscape(7, "a road junction with signposts"),
  },
  {
    slug: "state-levy-market-stalls-explained",
    title: "What the new state levy on market stalls means for you",
    standfirst: "Who pays, how much, and when collection starts.",
    category: "politics-public-affairs",
    ageMinutes: 1100,
    image: null,
  },
  {
    slug: "youth-groups-waterfront-plan",
    title: "Youth groups demand a voice on the waterfront plan",
    standfirst: "They want seats on the planning committee.",
    category: "politics-public-affairs",
    ageMinutes: 1900,
    image: null,
  },

  // Culture & Events
  {
    slug: "ogu-dance-troupes-weekend-performance",
    title: "Drums at dusk: dance troupes from across the division gather for a weekend of Ogu performance",
    standfirst:
      "Groups from Ajido to Iworo meet for two days of performance. Elders explain what the movements mean.",
    category: "culture-events",
    ageMinutes: 600,
    image: {
      src: "/seed/badagry-performers.jpg",
      alt: "Cultural performers in cowrie headdresses dancing with sticks around a large carved drum",
      width: 2048,
      height: 941,
      focalPoint: { x: 0.5, y: 0.4 },
      caption: "Supplied CityMood cover image, used here as seed content.",
      // Credit to be confirmed (OPEN_QUESTIONS #3).
      credit: "Photo: CityMood",
    },
  },
  {
    slug: "agbadarigi-masquerade-first-timers-guide",
    title: "Àgbádárìgì night: a first-timer’s guide to the masquerade procession",
    standfirst: "Where to stand, what to wear and what not to photograph.",
    category: "culture-events",
    ageMinutes: 1000,
    image: landscape(1, "a street at night"),
  },
  {
    slug: "events-this-week-badagry",
    title: "Events this week in Badagry and beyond",
    standfirst: "Concerts, church harvests and a heritage walk.",
    category: "culture-events",
    ageMinutes: 1400,
    image: null,
  },
  {
    slug: "local-choir-lagos-final",
    title: "Local choir heads to the Lagos final after a surprise win",
    standfirst: "They learned the set piece in three weeks.",
    category: "culture-events",
    ageMinutes: 1600,
    image: landscape(8, "a choir on stage"),
  },

  // Tourism & Heritage
  {
    slug: "mission-house-restoration-custodians-split",
    title: "Custodians split over restoration plan for the historic mission house",
    standfirst: "One family wants original timber; the trust wants concrete.",
    category: "tourism-heritage",
    ageMinutes: 340,
    image: landscape(1, "an old two-storey building"),
  },
  {
    slug: "guides-carry-badagry-hardest-history",
    title: "The guides who carry Badagry’s hardest history",
    standfirst: "They walk the route several times a day. We walked it with them.",
    category: "tourism-heritage",
    ageMinutes: 700,
    image: landscape(2, "a sandy path to the sea"),
  },
  {
    slug: "gberefu-boat-operators-landing",
    title: "Boat operators want a proper landing at Gberefu",
    standfirst: "Visitors still wade ashore at low tide.",
    category: "tourism-heritage",
    ageMinutes: 1250,
    image: landscape(3, "boats on a lagoon"),
  },
  {
    slug: "oja-walking-route-opens",
    title: "Ọjà and the old market: a new walking route opens to visitors",
    standfirst: "Twelve stops, two hours, and a guidebook in English and Yoruba.",
    category: "tourism-heritage",
    ageMinutes: 3000,
    image: landscape(4, "a market lane"),
  },

  // Uncategorised: must never appear in a category block.
  {
    slug: "office-hours-public-holiday",
    title: "CityMood office hours over the public holiday",
    standfirst: "The newsroom stays open; the front desk closes early.",
    category: null,
    ageMinutes: 5000,
    image: null,
  },
];

const authors = ["Placeholder Desk", "Seed Reporter", "Sample Correspondent"];

export const seedSource: ContentSource = {
  categories: async () => defaultCategories,
  articles: async (now) =>
    seed.map(({ ageMinutes, tags = [], featured = false, author, ...rest }, i) => ({
      ...rest,
      id: `seed-${i + 1}`,
      body: BODY,
      author: author ?? authors[i % authors.length],
      tags,
      featured,
      publishedAt: new Date(now.getTime() - ageMinutes * 60_000).toISOString(),
    })),
};
