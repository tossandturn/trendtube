import type { Metadata } from 'next'
import Link from 'next/link'
import { getViewVelocity, getEngagementRate } from '@/lib/analytics'
import { fetchTrendingVideos } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'
import { getRegionLabels } from '@/lib/region'

export const metadata: Metadata = {
  title: 'Trending YouTube Videos Today | Real-Time Viral Tracker',
  description: 'Track the most viral YouTube videos right now. Real-time trending analysis with velocity, engagement, and creator intelligence.',
}

function formatNumber(n: string | undefined) {
  const num = Number(n || 0)
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return num.toLocaleString()
}

export default async function TrendingPage() {
  const region = await getRegion()
  const labels = getRegionLabels(region)
  const videos = await fetchTrendingVideos(region, 50)

  const sorted = [...videos].sort((a: any, b: any) =>
    Number(b.statistics?.viewCount || 0) - Number(a.statistics?.viewCount || 0)
  )

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
          <div className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase mb-2 data-mono">🔥 TRENDING NOW</div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-glow text-gray-900">Trending YouTube Videos</h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl leading-relaxed">
            The most viral YouTube videos right now, ranked by real-time view count with
            velocity and engagement analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {sorted.map((video: any, idx: number) => {
            const velocity = getViewVelocity(video)
            const engagement = getEngagementRate(video)
            return (
              <Link key={video.id} href={`/video/${video.id}`} className="group block">
                <div className="glass-panel neon-border rounded-xl sm:rounded-2xl overflow-hidden glow-hover corner-accent">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={video.snippet?.thumbnails?.high?.url}
                      alt={video.snippet?.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 bg-red-500/20 border border-red-500/30 text-red-600 px-2.5 py-1 rounded-lg text-[10px] font-bold backdrop-blur data-mono">
                      #{idx + 1} TRENDING
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
            )
          })}
        </div>
      </div>
    </main>
  )
}
