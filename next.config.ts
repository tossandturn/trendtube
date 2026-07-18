import type { NextConfig } from "next";
import { realpathSync } from "fs";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', 'better-sqlite3'],
  turbopack: {
    root: realpathSync(process.cwd()),
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 3600,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['recharts', 'framer-motion'],
  },
  compress: true,
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: '/download-youtube-video',
        destination: '/youtube-channel-analytics',
        permanent: true,
      },
      {
        source: '/download-youtube-mp3',
        destination: '/',
        permanent: true,
      },
      {
        source: '/download-youtube-shorts',
        destination: '/youtube-shorts-trends',
        permanent: true,
      },
      {
        source: '/youtube-thumbnail-downloader',
        destination: '/',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
