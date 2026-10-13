import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // 90 is used for the logo, so its flat lime stays clean.
    qualities: [75, 90],
  },
};

export default nextConfig;
