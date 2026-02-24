import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Project 1 — GitHub user avatars
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      // Project 2 — Hygraph CMS cover images (media CDN)
      {
        protocol: "https",
        hostname: "media.graphassets.com",
      },
      // Project 2 — Hygraph EU region CDN
      {
        protocol: "https",
        hostname: "eu-central-1-shared-euc1-02.graphassets.com",
      },
    ],
  },
};

export default nextConfig;
