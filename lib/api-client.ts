/* =========================================================
   YOUTUBE API CLIENT — Resilient, monitored, with fallback
========================================================= */

import { monitoredFetch, trackQuotaUsage, sendAlert } from './monitor'

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || ''

export interface YouTubeVideo {
  id: string
  snippet?: {
    title: string
    channelTitle: string
    description?: string
    publishedAt?: string
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
}

/* ---- Fetch trending videos with full resilience ---- */
export async function fetchTrendingVideos(region = 'US', maxResults = 50): Promise<YouTubeVideo[]> {
  if (!API_KEY) {
    console.error('YouTube API Key is missing')
    return []
  }

  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=${maxResults}&regionCode=${region}&key=${API_KEY}`

  try {
    const res = await monitoredFetch(url, {
      next: { revalidate: 3600 },
      quotaUnits: Math.ceil(maxResults / 50) * 1, // videos.list costs 1 unit per 50 items
      retries: 2,
    })

    if (!res.ok) {
      // Try fallback: return cached/historical data
      return await loadFallbackVideos(region)
    }

    const data = await res.json()
    const items: YouTubeVideo[] = data.items || []

    if (items.length === 0) {
      await sendAlert({
        level: 'warning',
        source: 'YouTube API',
        message: `Empty response for region ${region}`,
        timestamp: new Date().toISOString(),
      })
      return await loadFallbackVideos(region)
    }

    return items
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    await sendAlert({
      level: 'critical',
      source: 'YouTube API',
      message: `Failed to fetch trending videos for ${region}`,
      detail: msg,
      timestamp: new Date().toISOString(),
    })
    return await loadFallbackVideos(region)
  }
}

/* ---- Fetch single video by ID ---- */
export async function fetchVideoById(id: string): Promise<YouTubeVideo | null> {
  if (!API_KEY) return null

  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${id}&key=${API_KEY}`

  try {
    const res = await monitoredFetch(url, {
      next: { revalidate: 300 },
      quotaUnits: 1,
      retries: 2,
    })

    if (!res.ok) return null
    const data = await res.json()
    return data.items?.[0] || null
  } catch {
    return null
  }
}

/* ---- Fetch related/popular videos (used on video detail page) ---- */
export async function fetchRelatedVideos(region = 'US', maxResults = 12): Promise<YouTubeVideo[]> {
  return fetchTrendingVideos(region, maxResults)
}

/* ---- Fallback to historical data when API fails ---- */
async function loadFallbackVideos(region: string): Promise<YouTubeVideo[]> {
  try {
    const { loadHistory } = await import('./analytics')
    const history = loadHistory()
    const last = history[history.length - 1]

    if (last && last.videos.length > 0) {
      await sendAlert({
        level: 'info',
        source: 'Fallback',
        message: `Serving stale data from ${last.date} for region ${region}`,
        timestamp: new Date().toISOString(),
      })

      return last.videos.map((v) => ({
        id: v.id,
        snippet: {
          title: v.title,
          channelTitle: v.channelTitle,
          publishedAt: v.publishedAt,
          thumbnails: { medium: { url: `https://i.ytimg.com/vi/${v.id}/mqdefault.jpg` } },
        },
        statistics: {
          viewCount: String(v.views),
          likeCount: String(v.likes),
          commentCount: String(v.comments),
        },
      }))
    }
  } catch {
    // history.json may not exist yet
  }

  return []
}

/* ---- Batch fetch for multiple regions ---- */
export async function fetchMultiRegion(regions: string[]): Promise<Record<string, YouTubeVideo[]>> {
  const result: Record<string, YouTubeVideo[]> = {}
  // Limit concurrency to avoid quota spikes
  for (const region of regions) {
    result[region] = await fetchTrendingVideos(region, 50)
  }
  return result
}
