import type { Metadata } from 'next'
import Link from 'next/link'
import { getViewVelocity, getEngagementRate, getTagColor } from '@/lib/analytics'
import { fetchTrendingVideos } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'
import { REGION_META } from '@/lib/region'
import { getTodayString } from '@/lib/recommendations'

export async function generateMetadata(): Promise<Metadata> {
  const region = await getRegion()
  const regionLabel = REGION_META[region]?.label || region
  const today = getTodayString()
  return {
    title: `${regionLabel} Emerging YouTube Trends ${today} | Early Momentum Videos`,
    description: `Discover ${regionLabel} YouTube videos with early momentum for ${today} — low views but explosive growth velocity. Catch trends before they go viral.`,
  }
}

function formatNumber(n: string | undefined) {
  const num = Number(n || 0)
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return num.toLocaleString()
}

export default async function EmergingPage() {
  const region = await getRegion()
  const videos = await fetchTrendingVideos(region, 50)

  const emerging = videos
    .map((v: any) => ({
      video: v,
      velocity: getViewVelocity(v),
      engagement: getEngagementRate(v),
      views: Number(v.statistics?.viewCount || 0),
    }))
    .filter((v: any) => v.views < 5_000_000)
    .sort((a: any, b: any) => b.velocity - a.velocity)
    .slice(0, 12)

  return (
    <main className="min-h-screen bg-white text-gray-900 terminal-grid relative overflow-hidden">
      <div className="ambient-glow-tl" />
      <div className="ambient-glow-tr" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 sm:mb-8">
          <span className="text-lg">←</span>
          <span className="text-sm font-medium">Back to Trends</span>
        </Link>

        <div className="mb-8 sm:mb-10">
          <div className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase mb-2 data-mono">🚀 EARLY MOMENTUM</div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-glow text-gray-900">Emerging YouTube Trends</h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl leading-relaxed">
            Videos with low views but explosive growth velocity. These are the opportunities
            most creators miss — catch them before they blow up.
          </p>
          {region === 'GLOBAL' && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm">
              <span className="text-lg">🌍</span>
              <span>Showing emerging videos from all regions — sorted by velocity</span>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="mb-8 glass-panel rounded-2xl p-6 border border-gray-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-black text-gray-900">{emerging.length}</div>
              <div className="text-xs text-gray-500">Emerging Videos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-green-600">
                {formatNumber(
                  emerging.reduce((sum, { video }) => sum + Number(video.statistics?.viewCount || 0), 0).toString()
                )}
              </div>
              <div className="text-xs text-gray-500">Total Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-yellow-600">
                {emerging.length > 0
                  ? Math.round(emerging.reduce((sum, { velocity }) => sum + velocity, 0) / emerging.length / 1000)
                  : 0}K
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {emerging.map(({ video, velocity, engagement }: any) => (
            <Link key={video.id} href={`/video/${video.id}`} className="group block">
              <div className="glass-panel neon-border rounded-xl sm:rounded-2xl overflow-hidden glow-hover corner-accent">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={video.snippet?.thumbnails?.high?.url}
                    alt={video.snippet?.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 bg-green-500/20 border border-green-500/30 text-green-600 px-2.5 py-1 rounded-lg text-[10px] font-bold backdrop-blur data-mono">
                    🚀 EMERGING
                  </div>
                  <div className="absolute bottom-2 right-2 glass-panel px-2 py-1 rounded-lg text-[10px] sm:text-xs font-medium data-mono text-gray-700">
                    👁️ {formatNumber(video.statistics?.viewCount)}
                  </div>
                </div>
                <div className="p-3 sm:p-5">
                  <h3 className="font-bold text-sm sm:text-base line-clamp-2 mb-2 group-hover:text-red-600 transition-colors text-gray-900">
                    {video.snippet?.title}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-[10px] font-bold text-gray-700">
                      {video.snippet?.channelTitle?.[0]}
                    </div>
                    <span className="truncate">{video.snippet?.channelTitle}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="glass-panel rounded-lg p-2 text-center">
                      <div className="text-gray-500 text-[10px] data-mono tracking-wider">⚡ VELOCITY</div>
                      <div className="text-green-600 font-bold text-xs data-mono text-glow-green">
                        {velocity >= 1e6 ? (velocity / 1e6).toFixed(1) + 'M/d' : velocity >= 1e3 ? (velocity / 1e3).toFixed(1) + 'K/d' : Math.round(velocity) + '/d'}
                      </div>
                    </div>
                    <div className="glass-panel rounded-lg p-2 text-center">
                      <div className="text-gray-500 text-[10px] data-mono tracking-wider">📈 ENGAGEMENT</div>
                      <div className="text-yellow-600 font-bold text-xs data-mono text-glow-yellow">{engagement.toFixed(2)}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
