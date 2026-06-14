/**
 * Next.js Sitemap Configuration
 * 
 * 自动生成包含所有动态页面的sitemap
 */

import { generateDynamicSitemapUrls } from './programmatic-seo-infrastructure';

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: 'https://tubefission.com',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  
  // 静态页面
  additionalPaths: async (config) => {
    const staticPaths = [
      { loc: '/', changefreq: 'hourly', priority: 1.0 },
      { loc: '/trends', changefreq: 'hourly', priority: 0.9 },
      { loc: '/trending', changefreq: 'hourly', priority: 0.9 },
      { loc: '/emerging', changefreq: 'hourly', priority: 0.9 },
      { loc: '/youtube-channel-analytics', changefreq: 'daily', priority: 0.95 },
      { loc: '/youtube-competitor-analysis', changefreq: 'daily', priority: 0.95 },
      { loc: '/youtube-niche-finder', changefreq: 'daily', priority: 0.95 },
      { loc: '/youtube-trend-finder', changefreq: 'hourly', priority: 0.95 },
      { loc: '/youtube-video-analyzer', changefreq: 'daily', priority: 0.95 },
      { loc: '/youtube-opportunity-finder', changefreq: 'daily', priority: 0.95 },
      { loc: '/youtube-money-calculator', changefreq: 'daily', priority: 0.95 },
      { loc: '/youtube-seo-tool', changefreq: 'daily', priority: 0.95 },
      { loc: '/youtube-best-time-to-post', changefreq: 'daily', priority: 0.95 },
      { loc: '/watchlist', changefreq: 'daily', priority: 0.7 },
      { loc: '/alerts', changefreq: 'daily', priority: 0.7 },
      { loc: '/ai-assistant', changefreq: 'daily', priority: 0.7 },
    ];
    
    return staticPaths;
  },
  
  // 动态页面
  transform: async (config, path) => {
    // 动态页面已经在additionalPaths中处理
    return {
      loc: path,
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date().toISOString()
    };
  },
  
  // 排除某些路径
  exclude: [
    '/api/*',
    '/server-sitemap.xml'
  ],
  
  // Robots.txt配置
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/static/']
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/']
      }
    ],
    additionalSitemaps: [
      'https://tubefission.com/server-sitemap.xml'
    ]
  }
};

export default config;
