import { MetadataRoute } from 'next'

const BASE_URL = 'https://tubefission.com'
const now = new Date()

const HIGH_VALUE_ROUTES = [
  '',
  '/trends',
  '/trending',
  '/emerging',
  '/shorts',
  '/youtube-ai-trends',
  '/youtube-channel-analytics',
  '/youtube-competitor-analysis',
  '/youtube-video-analyzer',
  '/youtube-niche-finder',
  '/youtube-opportunity-finder',
  '/viral-video-ideas',
  '/low-competition-keywords',
  '/youtube-keyword-research',
  '/gaming',
  '/gaming-youtube-trends',
  '/viral-music-trends',
  '/viral-youtube-shorts',
  '/mrbeast-style-videos',
  '/youtube-shorts-trends',
  '/youtube-trends',
  '/about',
  '/contact',
  '/methodology',
  '/privacy',
  '/terms',
]

const GUIDE_ROUTES = [
  '/guides/how-to-find-viral-youtube-topics',
  '/guides/how-youtube-shorts-go-viral',
  '/guides/best-youtube-niches',
  '/guides/youtube-trend-analysis',
]

const COMPARE_ROUTES = [
  '/compare/vidiq',
  '/compare/tubebuddy',
  '/compare/google-trends',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const coreRoutes: MetadataRoute.Sitemap = HIGH_VALUE_ROUTES.map((path, index) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === '' || path === '/trends' || path === '/trending' ? 'daily' : 'weekly',
    priority: index === 0 ? 1 : path === '/trends' || path === '/trending' ? 0.95 : 0.85,
  }))

  const guideRoutes: MetadataRoute.Sitemap = GUIDE_ROUTES.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.72,
  }))

  const compareRoutes: MetadataRoute.Sitemap = COMPARE_ROUTES.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.68,
  }))

  return [
    ...coreRoutes,
    ...guideRoutes,
    ...compareRoutes,
  ]
}
