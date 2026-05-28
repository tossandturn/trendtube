import { MetadataRoute } from 'next'

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || ''
const BASE_URL = 'https://tubefission.com'

const TAGS = [
  'ai', 'shorts', 'gaming', 'coding', 'crypto',
  'business', 'football', 'anime', 'music', 'mrbeast-style',
]

async function fetchVideos() {
  if (!API_KEY) return []
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=50&regionCode=US&key=${API_KEY}`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.items || []
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const videos = await fetchVideos()

  const routes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'hourly', priority: 1 },
    { url: `${BASE_URL}/shorts`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/trending`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${BASE_URL}/emerging`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${BASE_URL}/youtube-ai-trends`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/viral-youtube-shorts`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/gaming-youtube-trends`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/mrbeast-style-videos`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/viral-music-trends`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    // SEO Landing Pages
    { url: `${BASE_URL}/youtube-trends`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${BASE_URL}/youtube-shorts-trends`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${BASE_URL}/viral-video-ideas`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/low-competition-keywords`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/youtube-growth-tools`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/youtube-ai-tools`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ]

  TAGS.forEach((tag) => {
    routes.push({
      url: `${BASE_URL}/tag/${tag}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    })
  })

  videos.forEach((video: any) => {
    routes.push({
      url: `${BASE_URL}/video/${video.id}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    })
  })

  return routes
}
