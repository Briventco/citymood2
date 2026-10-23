import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // The Tailwind stylesheet is ~7KB gzipped. Inlining it removes the only
    // render-blocking request, which helps LCP for first visits on mobile data.
    inlineCss: true,
    // Newsroom photo uploads. Browsers resize to 2000px WebP first (usually
    // under 1 MB); the server still enforces its own 10 MB limit and message.
    serverActions: { bodySizeLimit: "11mb" },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // 90 is used for the logo, so its flat lime stays clean.
    qualities: [75, 90],
  },
};

export default nextConfig;
