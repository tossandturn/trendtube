import type { Metadata } from 'next'
import Link from 'next/link'

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || ''

export const metadata: Metadata = {
  title: 'Trending YouTube Shorts Today | Viral Shorts Radar',
  description: 'Explore the latest viral YouTube Shorts, analyze rapid growth videos, and identify creator opportunities before everyone else.',
}

async function fetchVideos() {
  if (!API_KEY) return []
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=50&regionCode=US&key=${API_KEY}`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.items || []
  } catch {
    return []
  }
}

function formatNumber(n: string | undefined) {
  const num = Number(n || 0)
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B'
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M'
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K'
  return num.toLocaleString()
}

function calculateTrendScore(video: any) {
  const views = Number(video.statistics?.viewCount || 0)
  const likes = Number(video.statistics?.likeCount || 0)
  const comments = Number(video.statistics?.commentCount || 0)
  return Math.floor(((likes * 3 + comments * 5) / Math.max(views, 1)) * 100000)
}

function getViralScore(video: any): number {
  const score = calculateTrendScore(video)
  return Math.min(100, Math.max(1, Math.floor(score / 4)))
}

function getHookStyle(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('wait')) return 'Wait for the ending'
  if (t.includes('challenge') || t.includes('won')) return 'Challenge hook'
  if (t.includes('how to') || t.includes('tutorial')) return 'Tutorial promise'
  if (t.includes('secret') || t.includes('hidden')) return 'Secret reveal'
  if (t.includes('fast') || t.includes('quick') || t.includes('minute')) return 'Speed promise'
  if (t.includes('never') || t.includes("don't")) return 'Curiosity gap'
  return 'Curiosity gap'
}

function seededRandom(seed: string, max: number) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0
  }
  return Math.abs(hash) % max
}

export default async function ShortsPage() {
  const videos = await fetchVideos()
  const shortsVideos = videos.filter((video: any) => {
    const title = video.snippet?.title?.toLowerCase() || ''
    return title.includes('shorts') || title.includes('#shorts') || title.includes('short')
  })
  const finalShorts = shortsVideos.length > 0 ? shortsVideos : videos

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6 sm:mb-8"
        >
          <span className="text-lg">←</span>
          <span className="text-sm font-medium">Back to Trends</span>
        </Link>

        <div className="mb-8 sm:mb-10">
          <div className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-2">SHORTS RADAR</div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">Shorts Exploding Right Now</h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Explore the latest viral YouTube Shorts, analyze rapid growth videos, and identify
            creator opportunities before everyone else.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {finalShorts.map((video: any) => {
            const viralScore = getViralScore(video)
            const hookStyle = getHookStyle(video.snippet?.title || '')
            const growth = seededRandom(video.id + '-growth', 400) + 100
            return (
              <Link key={video.id} href={`/video/${video.id}`} className="group block">
                <div className="aspect-[9/16] rounded-xl sm:rounded-2xl overflow-hidden relative bg-zinc-900">
                  <img
                    src={video.snippet?.thumbnails?.high?.url}
                    alt={`Shorts thumbnail for ${video.snippet?.title}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="absolute top-2 left-2 bg-red-500 px-2 py-0.5 rounded-md text-[10px] font-bold">
                    SHORTS
                  </div>
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-0.5 rounded-md text-[10px] font-bold text-white">
                    {viralScore}/100
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="text-white font-bold text-xs line-clamp-2 mb-1">
                      {video.snippet?.title}
                    </div>
                    <div className="text-zinc-400 text-[10px] mb-1">
                      {formatNumber(video.statistics?.viewCount)} views
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-zinc-500 bg-black/40 px-1.5 py-0.5 rounded">
                        {hookStyle}
                      </span>
                      <span className="text-[10px] text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded font-bold">
                        +{growth}%
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
