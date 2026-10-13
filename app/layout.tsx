import type { Metadata } from "next";
import { preload } from "react-dom";
import { BreakingTicker } from "./components/shell/BreakingTicker";
import { SectionNav } from "./components/shell/SectionNav";
import { SiteFooter } from "./components/shell/SiteFooter";
import { SiteHeader } from "./components/shell/SiteHeader";
import { site } from "@/config/site";
import { getCategories, isSeedContent } from "@/lib/content";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  // Wording to be confirmed with CityMood (DESIGN_SPEC.md §8).
  title: "CityMood: News from Badagry and surrounding communities",
  description: site.description,
  openGraph: {
    siteName: site.name,
    title: "CityMood",
    description: site.description,
    type: "website",
  },
};

// No publish webhook exists yet, so pages regenerate on a timer. This also keeps
// the masthead date and the breaking ticker's expiry window current.
export const revalidate = 90;

// The only two font files preloaded (DESIGN_SPEC.md §3). Everything else loads on demand.
const preloadedFonts = [
  "/fonts/source-serif-4-latin-700-normal.woff2",
  "/fonts/source-sans-3-latin-400-normal.woff2",
];

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // React emits one deduplicated <link rel="preload"> per call (a literal <link> in <head> gets doubled).
  for (const href of preloadedFonts) preload(href, { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  const now = new Date();
  const categories = await getCategories();

  return (
    <html lang="en">
      <body>
        <a href="#main" className="cm-skip-link">
          Skip to main content
        </a>
        {isSeedContent && (
          <p className="border-b border-cm-rule bg-cm-paper px-4 py-2 text-center text-[13px] text-cm-meta">
            Development seed content · every story, name and photo is a fictional placeholder, not CityMood
            reporting.
          </p>
        )}
        <SiteHeader categories={categories} now={now} />
        <SectionNav categories={categories} />
        <BreakingTicker now={now} />
        <main id="main">{children}</main>
        <SiteFooter now={now} />
      </body>
    </html>
  );
}
