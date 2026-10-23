# Open questions

Claude Code adds to this file during the build. CityMood or Brivent answer each question here.

| # | Question | Context / page | Default used meanwhile | Answer |
|---|---|---|---|---|
| 1 | Single lime (#9AFF01) or keep the magazine lime too? | Brand | Single lime | |
| 2 | Newsroom address, phone, emails, corrections email | Footer, Contact | Placeholders in config | |
| 3 | Credit for the cultural-performance photo | Culture feature | "Photo: CityMood" | |
| 4 | Facebook page URL | Footer | Placeholder link | |
| 5 | Production domain (videos show citymood.ng) | SEO, structured data | To confirm | |
| 6 | Most read data source | Homepage | Server view count, else curated | |
| 7 | Font subsets: the spec asks for `latin` + `latin-ext`, but Yoruba Ẹ, Ọ, ọ and the combining tone marks (U+0300, U+0301) live in the `vietnamese` subset. Without it they fall back to Georgia/Arial. | Fonts, all pages | `vietnamese` subset added too; `unicode-range` means it only downloads when a page uses those characters (about 6–8KB per weight) | |
| 8 | Font weights: spec §3 loads Serif 600/700 and Sans 400/700/800/300i, but `tokens.json` lists Serif 500 and Sans 600, and §4.4 sets ticker headlines in Sans 600. | Fonts, BreakingTicker | Spec §3 list only; ticker headlines will use Sans 700 | |
| 9 | Ad creatives "changeable without a deploy" | AdSlot | There is no CMS, so campaigns live in `config/ads.ts` (image, link, alt, start/end). Changing one needs a redeploy. No campaigns are booked, so every slot shows the house ad. | |
| 10 | Pages that don't exist yet: article, category, search, latest, About, Contact, Advertise, Corrections, Privacy, Terms | All links | Phase 5 was skipped, so links point to the planned URLs (`/{category}/{slug}`, `/{category}`, `/search?q=`, `/latest`, `/about`…) and currently 404, including the search form | |
| 11 | No CMS or database is connected | Whole site | Content comes from `lib/content`. Fictional seed stories load only in development (or with `CONTENT_SEED=1`). A production build shows the shell and a "No stories yet" message until a CMS adapter is added. | |
| 12 | Breaking ticker motion | BreakingTicker | No marquee: one headline at a time with a 44px "Next" button, so nothing moves and no Pause control is needed (WCAG 2.2.2, reduced motion). Headlines wrap instead of being cut. | |
| 13 | Tablet order: the spec says use the mobile order; the tablet reference PNG shows the desktop order | Homepage 640–1023px | Followed the spec (mobile order, two-column card rows) | |
| 14 | Category pair on tablet: the spec says two columns | Homepage 640–1023px | Local and Politics stay stacked below 1024px, as in the tablet reference; the 180px compact thumbnail leaves too little room for headlines in two columns | |
| 15 | Ad slots per breakpoint | Homepage | Leaderboard from 640px only (the mobile order has none). Billboard from 1024px only. Below 1024px: MPU after Latest and MPU after Business. | |
| 16 | LIVE badge on the Latest rail | LatestRail | Left out: the rail refreshes with the page (every 90s), not live | |
| 17 | Revalidate on publish | Homepage caching | No publish event exists, so pages regenerate every 90 seconds (`revalidate` in the root layout) | |
| 18 | Top stories selection | Homepage | One per category, newest first, preferring a story with an image in each category | |
| 19 | Link prefetching | All links to unbuilt routes | `prefetch={false}`: prefetch would 404 today, and on mobile data it would download every visible story in the background. Revisit when the routes exist. | |
| 20 | Experimental `inlineCss` (Next 16) | Performance | On: the ~7KB Tailwind stylesheet is inlined, removing the only render-blocking request. Turn it off if it causes problems, or if most readers return often and would benefit from a cached stylesheet. | |
| 21 | Fallback fonts | Fonts | Metric-matched local fallbacks (Arial, Times New Roman) added to the font stacks, so swapping in the non-preloaded weights doesn't shift layout (CLS 0.022 → 0.001) | |

### Admin portal (feature/admin-ui, front end on a dev store; Supabase comes later)

| # | Question | Context / page | Default used meanwhile | Answer |
|---|---|---|---|---|
| 22 | Where the admin handoff lives | Docs | The handoff folder was moved to the paths ADMIN_SPEC uses: `docs/design/ADMIN_SPEC.md`, `docs/design/admin/`, `docs/design/reference/admin/` | |
| 23 | No backend yet | Whole admin | `lib/admin/` has a typed repository whose row types match `admin/schema.sql`. It runs on `data/admin-dev.json` (gitignored, fake seed) through a small engine that applies schema.sql's policies, triggers and constraints. Development builds only, or `ADMIN_DEV_STORE=1`. Production builds show “not connected” on sign-in. Supersedes #11 for development. | |
| 24 | Can reporters unpublish their own live story? | Roles, schema.sql | ADMIN_SPEC §2 gives unpublishing to editors, but schema.sql doesn’t stop a reporter. The dev store refuses it (in its `guard_article` copy). Suggest adding the same check to the trigger in schema.sql. Reporters can still take their own *scheduled* story back to draft. | |
| 25 | Public bylines need author names, but anon can’t read `profiles` | Supabase adapter | The dev reader looks names up with elevated rights. Supabase needs a `public_authors` view (id, full_name) or a narrow policy before the public adapter can show bylines. | |
| 26 | Story body font | Editor, Preview | The reference editor sets the story in Source Serif, but the brand rule is Serif for headlines only. Story text uses Source Sans 3 at 19px. | |
| 27 | Which homepage MPU is “first” and which is “second” | Ads | `mpu_1`: after Latest below 1024px, and beside Business from 1024px (so it shows at every width). `mpu_2`: after Business below 1024px. | |
| 28 | Leaderboard mobile creative (320×50) | Ads | The campaign form takes one, and AdSlot shows it below 640px, but the homepage hides the leaderboard below 640px (#15), so today it never shows there | |
| 29 | Overlapping campaigns in one slot | Ads | The most recently started one shows. The form warns about overlaps but doesn’t block. Changing campaigns no longer needs a redeploy (supersedes #9). | |
| 30 | Automatic top stories | Front page, homepage | ADMIN_SPEC §5 says empty slots take “the newest live articles not already used”. The existing rule (#18, one per category) is kept for empty slots, because it is approved homepage behaviour; pinned slots keep their position and are reserved before Latest fills. Decide which rule you want. | |
| 31 | Most read length | Front page | Editors can pick up to 5 (ADMIN_SPEC). The homepage component shows 4 from 1024px and 3 below (DESIGN_SPEC §4.11), so the 5th is a reserve. | |
| 32 | Autosave on live stories | Editor | Drafts and unpublished stories autosave every 10 seconds and on blur. Live and scheduled stories save only on Update, so half-finished edits never reach readers. | |
| 33 | Preview of unsaved edits to a live story | Preview | Preview shows the last saved version. Previewing edits without publishing them would need a draft copy, which the schema doesn’t have. | |
| 34 | Slug lock after unpublishing | Editor | The editor keeps the web address locked once a story has been published, including when it is unpublished. schema.sql only locks it while the status is published or scheduled. | |
| 35 | Photo details belong to the photo | Editor, Media | Alt text, caption, credit and focal point live on `media`, so they follow a photo into every story. RLS only lets the uploader or an editor change them, so a reporter using someone else’s photo can’t fix its alt text; the editor says so and an editor must do it. | |
| 36 | Invite form needs a name | Staff | The reference has email and role only. A Name field was added because bylines need it (Supabase passes it as `full_name` metadata). | |
| 37 | “Last active” | Staff | Shows the last sign-in (`auth.users.last_sign_in_at`); the schema has no activity tracking | |
| 38 | Sidebar items per role | All admin screens | The reference shows all six items for an Editor. Items a role can’t use are hidden (reporters: Articles and Media library; editors: no Staff or Settings). The pages still show “You don’t have access” if opened directly. | |
| 39 | Ad campaign list | Ads | `/admin/ads` (not in the spec table) lists campaigns per slot. It is reached from the Front page’s Ad slots panel, so the sidebar matches the reference. | |
| 40 | Sign-in attempt limit | Sign-in | The dev store enforces the sentence on screen (5 wrong attempts, 15-minute pause). With Supabase, set the same limit in Auth settings, or remove the sentence. | |
| 41 | Breaking window when a draft is marked breaking | Editor, schema.sql | The trigger starts the 6 hours when the flag is set if there is no publish time yet. Publishing resets `breaking_until`, so the window starts at go-live, as the switch text promises. | |
| 42 | People band role and place line (“Canoe builder · Topo”) | Homepage | The schema has no fields for them, so that line disappears for newsroom stories. Add two optional fields if you want it back. | |
| 43 | Button heights | Admin | The spec says every button is at least 44px, so a few reference buttons drawn at 36–40px (Replace/Remove, reorder arrows, toolbar) are 44px | |
| 44 | Focal point picker | Editor, Media | The whole photo is shown letterboxed on black (the reference crops it) so a click maps to the right spot | |
| 45 | Sans 600 isn’t loaded | Admin | The reference uses Sans 600 for nav items and secondary labels; only 400/700/800 are self-hosted (#8), so it renders as 700 | |
| 46 | Mobile story formatting | Quick publish | No formatting toolbar below 768px, as in the reference. Formatting is available on wider screens. | |
| 47 | Deleting categories | Categories | Not offered: stories reference their category, so hide it instead (its stories stay live) | |
| 48 | Publish revalidation | Homepage caching | Publishing, front page, ads, settings and taxonomy changes call `revalidatePath`, so they show at once. The 90-second timer remains for scheduled stories (supersedes #17). | |
| 49 | Dev image optimizer stall | Development only | Once, Next’s image optimizer in `next dev` stopped answering one image size after browsers were closed mid-request, which stalled every request from that browser. Restarting the dev server cleared it. Not seen in a clean run; watch for it in production. | |
