import { MetadataRoute } from 'next'

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || ''
const BASE_URL = 'https://trendtube-omega.vercel.app'

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
