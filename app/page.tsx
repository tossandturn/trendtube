import type { Metadata } from 'next'
import TrendingDashboard from './components/TrendingDashboard'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'TrendTube — Discover Viral YouTube Trends Before They Explode',
  description: 'Discover exploding YouTube trends, viral Shorts, and creator opportunities before everyone else. Updated daily with AI analysis.',
}

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || ''

interface YouTubeResponse {
  items?: {
    id: string
    snippet?: {
      title: string
      channelTitle: string
      description?: string
      thumbnails?: {
        high?: { url: string }
        medium?: { url: string }
        default?: { url: string }
      }
    }
    statistics?: {
      viewCount?: string
      likeCount?: string
      commentCount?: string
    }
  }[]
}

async function fetchYouTubeVideos(region: string) {
  if (!API_KEY) {
    console.error('YouTube API Key is missing')
    return []
  }

  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=50&regionCode=${region}&key=${API_KEY}`,
      { next: { revalidate: 3600 } }
    )

    if (!res.ok) {
      throw new Error(`YouTube API error: ${res.status}`)
    }

    const data: YouTubeResponse = await res.json()
    return data.items || []
  } catch (err) {
    console.error('Failed to fetch YouTube videos:', err)
    return []
  }
}

export default async function HomePage() {
  const videos = await fetchYouTubeVideos('US')

  return <TrendingDashboard initialVideos={videos} />
}
