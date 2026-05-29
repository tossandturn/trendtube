import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 3600,
  },
  experimental: {
    optimizePackageImports: ['recharts', 'framer-motion'],
  },
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
