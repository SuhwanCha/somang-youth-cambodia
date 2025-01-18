import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    domains: ["cambodia.suhwan.me"],
    unoptimized: true,
  }
};

export default nextConfig;
