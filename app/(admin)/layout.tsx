import type { Metadata } from "next";
import { preload } from "react-dom";
import "../globals.css";
import "./admin.css";

// Root layout for the newsroom (/admin). It shares the brand tokens and fonts
// with the public site but none of its shell, so public pages never load admin
// code and admin pages never load the masthead, ticker or footer.

export const metadata: Metadata = {
  title: { template: "%s · CityMood Newsroom", default: "CityMood Newsroom" },
  robots: { index: false, follow: false },
};

const preloadedFonts = [
  "/fonts/source-serif-4-latin-700-normal.woff2",
  "/fonts/source-sans-3-latin-400-normal.woff2",
];

export default function AdminRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  for (const href of preloadedFonts) preload(href, { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  return (
    <html lang="en">
      <body className="bg-cm-paper">{children}</body>
    </html>
  );
}
