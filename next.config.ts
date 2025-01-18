import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    domains: ["cambodia.suhwan.me"],
    unoptimized: true,
  },
  output: 'export',
};

export default nextConfig;
