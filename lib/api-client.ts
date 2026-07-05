/* =========================================================
   YOUTUBE API CLIENT — Resilient, monitored, with fallback
========================================================= */

import { monitoredFetch, sendAlert } from './monitored-fetch'

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || ''
const IS_PRODUCTION_BUILD = process.env.NEXT_PHASE === 'phase-production-build'

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
interface FetchTrendingOptions {
  retries?: number
  timeoutMs?: number
}

const DEFAULT_TRENDING_RETRIES = 0
const DEFAULT_TRENDING_TIMEOUT_MS = 4000
const DEFAULT_SEARCH_TIMEOUT_MS = 2500

export async function fetchTrendingVideos(region = 'US', maxResults = 50, options: FetchTrendingOptions = {}): Promise<YouTubeVideo[]> {
  if (IS_PRODUCTION_BUILD) {
    return loadFallbackVideos(region)
  }

  if (!API_KEY) {
    console.error('YouTube API Key is missing')
    return loadFallbackVideos(region)
  }

  // Handle GLOBAL region - fetch from multiple major regions and merge
  if (region === 'GLOBAL') {
    return fetchGlobalTrendingVideos(maxResults, options)
  }

  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=${maxResults}&regionCode=${region}&key=${API_KEY}`

  try {
    const res = await monitoredFetch(url, {
      next: { revalidate: 3600 },
      quotaUnits: Math.ceil(maxResults / 50) * 1, // videos.list costs 1 unit per 50 items
      retries: options.retries ?? DEFAULT_TRENDING_RETRIES,
      timeoutMs: options.timeoutMs ?? DEFAULT_TRENDING_TIMEOUT_MS,
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

/* ---- Fetch global trending videos from multiple regions ---- */
async function fetchGlobalTrendingVideos(maxResults = 50, options: FetchTrendingOptions = {}): Promise<YouTubeVideo[]> {
  // Fetch from major regions and merge results
  const majorRegions = ['US', 'GB', 'JP', 'KR', 'DE', 'FR', 'IN', 'BR', 'AU', 'CA', 'MX', 'ES', 'IT', 'NL', 'SE']
  const allVideos: YouTubeVideo[] = []
  const seenIds = new Set<string>()

  // Track which regions contributed data
  const successfulRegions: string[] = []
  const failedRegions: string[] = []

  // Fetch from all regions with concurrency limit
  const concurrencyLimit = 5
  for (let i = 0; i < majorRegions.length; i += concurrencyLimit) {
    const batch = majorRegions.slice(i, i + concurrencyLimit)
    const batchPromises = batch.map(async (region) => {
      try {
        const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=${Math.ceil(maxResults / 3)}&regionCode=${region}&key=${API_KEY}`
        const res = await monitoredFetch(url, {
          next: { revalidate: 3600 },
          quotaUnits: 1,
          retries: options.retries ?? DEFAULT_TRENDING_RETRIES,
          timeoutMs: options.timeoutMs ?? DEFAULT_TRENDING_TIMEOUT_MS,
        })

        if (!res.ok) {
          failedRegions.push(region)
          return []
        }

        const data = await res.json()
        successfulRegions.push(region)
        return data.items || []
      } catch {
        failedRegions.push(region)
        return []
      }
    })

    const batchResults = await Promise.all(batchPromises)

    // Merge results from this batch
    for (const videos of batchResults) {
      for (const video of videos) {
        if (!seenIds.has(video.id)) {
          seenIds.add(video.id)
          allVideos.push(video)
        }
      }
    }
  }

  // Log for debugging
  console.log(`[GLOBAL] Successfully fetched from ${successfulRegions.length} regions: ${successfulRegions.join(', ')}`)
  if (failedRegions.length > 0) {
    console.log(`[GLOBAL] Failed regions: ${failedRegions.join(', ')}`)
  }
  console.log(`[GLOBAL] Total unique videos: ${allVideos.length}`)

  // Sort by view count for global ranking
  allVideos.sort((a, b) => {
    const viewsA = Number(a.statistics?.viewCount || 0)
    const viewsB = Number(b.statistics?.viewCount || 0)
    return viewsB - viewsA
  })

  return allVideos.slice(0, maxResults)
}

/* ---- Fetch single video by ID ---- */
export async function fetchVideoById(id: string): Promise<YouTubeVideo | null> {
  if (!API_KEY) return loadFallbackVideoById(id)

  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${id}&key=${API_KEY}`

  try {
    const res = await monitoredFetch(url, {
      next: { revalidate: 300 },
      quotaUnits: 1,
      retries: 2,
    })

    if (!res.ok) return loadFallbackVideoById(id)
    const data = await res.json()
    return data.items?.[0] || loadFallbackVideoById(id)
  } catch {
    return loadFallbackVideoById(id)
  }
}

interface YouTubeThumbnail {
  url: string
  width?: number
  height?: number
}

export interface YouTubeChannel {
  id: string
  snippet?: {
    title?: string
    description?: string
    customUrl?: string
    publishedAt?: string
    categoryId?: string
    country?: string
    thumbnails?: {
      default?: YouTubeThumbnail
      medium?: YouTubeThumbnail
      high?: YouTubeThumbnail
    }
    localized?: {
      title?: string
      description?: string
    }
  }
  statistics?: {
    viewCount?: string
    subscriberCount?: string
    hiddenSubscriberCount?: boolean
    videoCount?: string
  }
  brandingSettings?: {
    channel?: {
      title?: string
      description?: string
      keywords?: string
      country?: string
      unsubscribedTrailer?: string
    }
    image?: {
      bannerExternalUrl?: string
    }
  }
  contentDetails?: {
    relatedPlaylists?: {
      likes?: string
      uploads?: string
    }
  }
}

interface YouTubeSearchItem {
  id?: {
    videoId?: string
  }
  snippet?: YouTubeVideo['snippet']
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
      if (!IS_PRODUCTION_BUILD) {
        await sendAlert({
          level: 'info',
          source: 'Fallback',
          message: `Serving stale data from ${last.date} for region ${region}`,
          timestamp: new Date().toISOString(),
        })
      }

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

async function loadFallbackVideoById(id: string): Promise<YouTubeVideo | null> {
  const videos = await loadFallbackVideos('cached')
  return videos.find((video) => video.id === id) || null
}

/* ---- Fetch channel by ID or Handle ---- */
export async function fetchChannelById(channelId: string): Promise<YouTubeChannel | null> {
  if (!API_KEY) return null

  // Decode URL-encoded characters (e.g., %40 -> @)
  const decodedId = decodeURIComponent(channelId)

  // Check if it's a handle (starts with @)
  const isHandle = decodedId.startsWith('@')
  const param = isHandle ? `forHandle=${decodedId}` : `id=${decodedId}`
  const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings,contentDetails&${param}&key=${API_KEY}`

  try {
    const res = await monitoredFetch(url, {
      next: { revalidate: 300 },
      quotaUnits: 1,
      retries: 2,
    })

    if (!res.ok) return null
    const data = await res.json() as { items?: YouTubeChannel[] }
    return data.items?.[0] || null
  } catch {
    return null
  }
}

/* ---- Fetch channel videos ---- */
export async function fetchChannelVideos(channelId: string, maxResults = 50): Promise<YouTubeVideo[]> {
  if (!API_KEY) return []

  // Decode URL-encoded characters
  const decodedId = decodeURIComponent(channelId)

  // If it's a handle, first fetch the channel to get the real channel ID
  let realChannelId = decodedId
  if (decodedId.startsWith('@')) {
    const channel = await fetchChannelById(decodedId)
    if (!channel) return []
    realChannelId = channel.id
  }

  // First, get video IDs from channel
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=id&channelId=${realChannelId}&order=date&type=video&maxResults=${maxResults}&key=${API_KEY}`

  try {
    const searchRes = await monitoredFetch(searchUrl, {
      next: { revalidate: 3600 },
      quotaUnits: Math.ceil(maxResults / 50) * 100, // search.list costs 100 units
      retries: 2,
    })

    if (!searchRes.ok) return []

    const searchData = await searchRes.json() as { items?: YouTubeSearchItem[] }
    const videoIds = searchData.items
      ?.map((item) => item.id?.videoId)
      .filter((id): id is string => Boolean(id))

    if (!videoIds || videoIds.length === 0) return []

    // Then fetch video details in batch
    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds.join(',')}&key=${API_KEY}`
    const videosRes = await monitoredFetch(videosUrl, {
      next: { revalidate: 300 },
      quotaUnits: Math.ceil(videoIds.length / 50) * 1,
      retries: 2,
    })

    if (!videosRes.ok) return []

    const videosData = await videosRes.json()
    return videosData.items || []
  } catch {
    return []
  }
}

/* ---- Fetch channel by username/custom URL ---- */
export async function fetchChannelByUsername(username: string): Promise<YouTubeChannel | null> {
  if (!API_KEY) return null

  const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&forUsername=${username}&key=${API_KEY}`

  try {
    const res = await monitoredFetch(url, {
      next: { revalidate: 300 },
      quotaUnits: 1,
      retries: 2,
    })

    if (!res.ok) return null
    const data = await res.json() as { items?: YouTubeChannel[] }
    return data.items?.[0] || null
  } catch {
    return null
  }
}

/* ---- Fetch comments for a video ---- */
export interface YouTubeComment {
  id: string
  snippet: {
    topLevelComment?: {
      snippet: {
        textDisplay: string
        textOriginal: string
        authorDisplayName: string
        authorProfileImageUrl: string
        likeCount: number
        publishedAt: string
      }
    }
    totalReplyCount?: number
  }
}

export async function fetchVideoComments(videoId: string, maxResults = 100): Promise<YouTubeComment[]> {
  if (!API_KEY) return []

  const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=${maxResults}&order=relevance&key=${API_KEY}`

  try {
    const res = await monitoredFetch(url, {
      next: { revalidate: 300 },
      quotaUnits: Math.ceil(maxResults / 100) * 1,
      retries: 2,
    })

    if (!res.ok) {
      // Comments may be disabled for this video
      return []
    }

    const data = await res.json()
    return data.items || []
  } catch {
    return []
  }
}

/* ---- Search YouTube by keyword ---- */
export async function searchYouTube(query: string, maxResults = 25, order: 'relevance' | 'viewCount' | 'date' = 'relevance'): Promise<YouTubeVideo[]> {
  if (IS_PRODUCTION_BUILD) {
    return filterFallbackVideos(query, maxResults)
  }

  if (!API_KEY) return filterFallbackVideos(query, maxResults)

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&order=${order}&key=${API_KEY}`

  try {
    const res = await monitoredFetch(url, {
      next: { revalidate: 1800 },
      quotaUnits: 100, // search.list costs 100 units
      retries: 0,
      timeoutMs: DEFAULT_SEARCH_TIMEOUT_MS,
    })

    if (!res.ok) return filterFallbackVideos(query, maxResults)
    const data = await res.json() as { items?: YouTubeSearchItem[] }
    const items = data.items || []

    if (items.length === 0) return []

    // Fetch statistics for found videos
    const videoIds = items
      .map((item) => item.id?.videoId)
      .filter((id): id is string => Boolean(id))
    if (videoIds.length === 0) return []

    const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds.join(',')}&key=${API_KEY}`
    const statsRes = await monitoredFetch(statsUrl, {
      next: { revalidate: 1800 },
      quotaUnits: 1,
      retries: 0,
      timeoutMs: DEFAULT_SEARCH_TIMEOUT_MS,
    })

    if (!statsRes.ok) {
      // Return search results without stats
      return items.map((item) => ({
        id: item.id?.videoId || '',
        snippet: item.snippet,
        statistics: {},
      }))
    }

    const statsData = await statsRes.json()
    return statsData.items || []
  } catch {
    return filterFallbackVideos(query, maxResults)
  }
}

async function filterFallbackVideos(query: string, maxResults: number): Promise<YouTubeVideo[]> {
  const videos = await loadFallbackVideos('search')
  if (videos.length === 0) return []

  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.replace(/[^a-z0-9]/g, ''))
    .filter((term) => term.length > 2)

  const matches = videos.filter((video) => {
    const text = `${video.snippet?.title || ''} ${video.snippet?.description || ''} ${video.snippet?.channelTitle || ''}`.toLowerCase()
    return terms.some((term) => text.includes(term))
  })

  return (matches.length > 0 ? matches : videos).slice(0, maxResults)
}

/* ---- Batch search multiple keywords and deduplicate ---- */
export async function searchYouTubeMulti(queries: string[], maxPerQuery = 25, order: 'relevance' | 'viewCount' | 'date' = 'relevance'): Promise<YouTubeVideo[]> {
  const seen = new Set<string>()
  const results: YouTubeVideo[] = []

  for (const query of queries) {
    const videos = await searchYouTube(query, maxPerQuery, order)
    for (const video of videos) {
      if (!seen.has(video.id)) {
        seen.add(video.id)
        results.push(video)
      }
    }
  }

  return results
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
