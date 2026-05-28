import fs from 'fs'
import path from 'path'
import { monitoredFetch, sendAlert } from '../lib/monitor'

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || ''

interface HistoryEntry {
  date: string
  timestamp: string
  region: string
  videos: {
    id: string
    title: string
    channelTitle: string
    views: number
    likes: number
    comments: number
    publishedAt: string
  }[]
}

async function collect() {
  if (!API_KEY) {
    console.error('❌ No YouTube API key found')
    await sendAlert({
      level: 'critical',
      source: 'Data Collection',
      message: 'Data collection failed: No API key configured',
      timestamp: new Date().toISOString(),
    })
    process.exit(1)
  }

  console.log('🚀 Fetching trending data from YouTube API...')

  let data: any
  try {
    const res = await monitoredFetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=50&regionCode=US&key=${API_KEY}`,
      { quotaUnits: 1, retries: 3 }
    )

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`)
    }

    data = await res.json()
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`❌ ${msg}`)
    await sendAlert({
      level: 'critical',
      source: 'Data Collection',
      message: 'Daily data collection failed',
      detail: msg,
      timestamp: new Date().toISOString(),
    })
    process.exit(1)
  }
  const now = new Date()
  const dateStr = now.toISOString().split('T')[0]

  const entry: HistoryEntry = {
    date: dateStr,
    timestamp: now.toISOString(),
    region: 'US',
    videos: (data.items || []).map((item: any) => ({
      id: item.id,
      title: item.snippet?.title || '',
      channelTitle: item.snippet?.channelTitle || '',
      views: Number(item.statistics?.viewCount || 0),
      likes: Number(item.statistics?.likeCount || 0),
      comments: Number(item.statistics?.commentCount || 0),
      publishedAt: item.snippet?.publishedAt || '',
    })),
  }

  const dataDir = path.join(process.cwd(), 'public', 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  const historyPath = path.join(dataDir, 'history.json')
  let history: HistoryEntry[] = []

  if (fs.existsSync(historyPath)) {
    history = JSON.parse(fs.readFileSync(historyPath, 'utf-8'))
  }

  // Remove today's entry if exists (update)
  history = history.filter((h) => h.date !== entry.date)
  history.push(entry)

  // Keep only last 30 days
  history = history.slice(-30)

  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2))
  console.log(`✅ Collected ${entry.videos.length} videos for ${entry.date}`)
  console.log(`📁 Saved to ${historyPath}`)
}

collect().catch((err) => {
  console.error(err)
  process.exit(1)
})
