import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-0b3087ca60294f36ab0a9e41a9f08d99.r2.dev',
      },
    ],
  },
};

export default nextConfig;
