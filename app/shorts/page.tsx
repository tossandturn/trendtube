import type { Metadata } from 'next'
import Link from 'next/link'
import { getViewVelocity, getTagEmoji } from '@/lib/analytics'
import { fetchTrendingVideos } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'
import { REGION_META } from '@/lib/region'
import { getTodayString } from '@/lib/recommendations'

export async function generateMetadata(): Promise<Metadata> {
  const region = await getRegion()
  const regionLabel = REGION_META[region]?.label || region
  const today = getTodayString()
  return {
    title: `${regionLabel} Trending YouTube Shorts ${today} | Viral Shorts Radar`,
    description: `Explore ${regionLabel} viral YouTube Shorts for ${today}, analyze rapid growth videos, and identify creator opportunities before everyone else.`,
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

// Get region from video if available (for GLOBAL view)
function getVideoRegion(video: any): string | null {
  // In GLOBAL mode, videos may have region metadata from the API
  return video.region || null
}

export default async function ShortsPage() {
  const region = await getRegion()
  const videos = await fetchTrendingVideos(region, 50)

  // Filter for shorts content and sort by velocity
  const shortsVideos = videos
    .filter((v: any) => {
      const title = v.snippet?.title?.toLowerCase() || ''
      const desc = v.snippet?.description?.toLowerCase() || ''
      return title.includes('shorts') || desc.includes('shorts') || title.includes('#shorts')
    })
    .sort((a: any, b: any) => getViewVelocity(b) - getViewVelocity(a))
    .slice(0, 15)

  return (
    <main className="min-h-screen bg-white text-gray-900 terminal-grid relative overflow-hidden">
      <div className="ambient-glow-tl" />
      <div className="ambient-glow-tr" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 sm:mb-8"
        >
          <span className="text-lg">←</span>
          <span className="text-sm font-medium">Back to Trends</span>
        </Link>

        <div className="mb-8 sm:mb-10">
          <div className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase mb-2 data-mono">📱 SHORTS RADAR</div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-glow text-gray-900">
            {getTagEmoji('Shorts')} Shorts Exploding Right Now
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl leading-relaxed">
            Explore the latest viral YouTube Shorts, analyze rapid growth videos, and identify
            creator opportunities before everyone else.
          </p>
          {region === 'GLOBAL' && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm">
              <span className="text-lg">🌍</span>
              <span>Showing Shorts from all regions — ranked by global velocity</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {shortsVideos.map((video: any) => {
            const viralScore = getViralScore(video)
            const hookStyle = getHookStyle(video.snippet?.title || '')
            const velocity = getViewVelocity(video)
            const videoRegion = getVideoRegion(video)

            return (
              <Link key={video.id} href={`/video/${video.id}`} className="group block">
                <div className="aspect-[9/16] rounded-xl sm:rounded-2xl overflow-hidden relative glass-panel neon-border glow-hover">
                  <img
                    src={video.snippet?.thumbnails?.high?.url}
                    alt={`Shorts thumbnail for ${video.snippet?.title}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/10 to-transparent" />
                  <div className="absolute top-2 left-2 bg-red-500/90 px-2 py-0.5 rounded-md text-[10px] font-bold shadow-[0_0_10px_rgba(220,38,38,0.3)] text-white">
                    SHORTS
                  </div>

                  {/* Region Badge for GLOBAL view */}
                  {region === 'GLOBAL' && videoRegion && (
                    <div className="absolute top-2 right-2 bg-blue-500/90 px-2 py-0.5 rounded-md text-[10px] font-bold text-white">
                      {videoRegion}
                    </div>
                  )}

                  {/* Viral Score Badge - shown when not GLOBAL or no region */}
                  {region !== 'GLOBAL' && (
                    <div className="absolute top-2 right-2 glass-panel px-2 py-0.5 rounded-md text-[10px] font-bold text-gray-700 data-mono">
                      {viralScore}/100
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="text-gray-900 font-bold text-xs line-clamp-2 mb-1">
                      {video.snippet?.title}
                    </div>
                    <div className="text-gray-500 text-[10px] mb-1 data-mono">
                      {formatNumber(video.statistics?.viewCount)} views
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-gray-500 glass-panel px-1.5 py-0.5 rounded data-mono">
                        {hookStyle}
                      </span>
                      <span className="text-[10px] text-green-600 bg-green-100 px-1.5 py-0.5 rounded font-bold data-mono text-glow-green">
                        {velocity >= 1e6 ? (velocity / 1e6).toFixed(1) + 'M/d' : velocity >= 1e3 ? (velocity / 1e3).toFixed(1) + 'K/d' : Math.round(velocity) + '/d'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Stats Summary */}
        <div className="mt-8 glass-panel rounded-2xl p-6 border border-gray-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-black text-gray-900">{shortsVideos.length}</div>
              <div className="text-xs text-gray-500">Shorts Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-red-600">
                {formatNumber(
                  shortsVideos.reduce((sum, v) => sum + Number(v.statistics?.viewCount || 0), 0).toString()
                )}
              </div>
              <div className="text-xs text-gray-500">Total Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-green-600">
                {Math.round(
                  shortsVideos.reduce((sum, v) => sum + getViewVelocity(v), 0) / Math.max(shortsVideos.length, 1) / 1000
                )}K
              </div>
              <div className="text-xs text-gray-500">Avg Velocity/Day</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-blue-600">
                {region === 'GLOBAL' ? 'All Regions' : REGION_META[region]?.label}
              </div>
              <div className="text-xs text-gray-500">Data Source</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
