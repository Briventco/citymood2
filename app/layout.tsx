import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  // Wording to be confirmed with CityMood (DESIGN_SPEC.md §8).
  title: "CityMood: News from Badagry and surrounding communities",
  description:
    "Independent news for Badagry and surrounding communities. Published by CityMood Communications.",
  openGraph: {
    title: "CityMood",
    description: "Independent news for Badagry and surrounding communities.",
    type: "website",
  },
};

// The only two font files preloaded (DESIGN_SPEC.md §3). Everything else loads on demand.
const preloadedFonts = [
  "/fonts/source-serif-4-latin-700-normal.woff2",
  "/fonts/source-sans-3-latin-400-normal.woff2",
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {preloadedFonts.map((href) => (
          <link
            key={href}
            rel="preload"
            href={href}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        ))}
      </head>
      <body>
        <a href="#main" className="cm-skip-link">
          Skip to main content
        </a>
        <main id="main">
          {children}
        </main>
      </body>
    </html>
  );
}
