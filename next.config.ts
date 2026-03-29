import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "arcraiders.wiki",
      },
      {
        protocol: "https",
        hostname: "static.wikia.nocookie.net",
      },
      {
        protocol: "https",
        hostname: "static1.fextralifeimages.com",
      },
      {
        protocol: "https",
        hostname: "arcforge.gg",
      },
      {
        protocol: "https",
        hostname: "**.arcforge.gg",
      },
    ],
  },
};

export default nextConfig;
