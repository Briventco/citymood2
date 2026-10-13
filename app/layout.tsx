import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CityMood Badagry — Grassroots Media, Culture & Tourism",
  description:
    "Leading grassroots media, cultural journalism, and tourist guide company tracking the historic Badagry Division in Lagos State, Nigeria.",
  keywords:
    "Badagry, Lagos, Nigeria, cultural journalism, tourism, heritage, Point of No Return, slave route",
  openGraph: {
    title: "CityMood Badagry",
    description:
      "Premium editorial destination covering Badagry Division — culture, heritage, tourism & local business.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=Inter:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
