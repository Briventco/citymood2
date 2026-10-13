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
