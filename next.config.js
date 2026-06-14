/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com', 'i.ytimg.com'],
  },
  // 确保所有页面都被静态生成
  trailingSlash: false,
}

module.exports = nextConfig
