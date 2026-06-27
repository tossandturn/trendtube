import type { Metadata } from 'next'
import Link from 'next/link'
import { getViewVelocity, getEngagementRate } from '@/lib/analytics'
import { searchYouTubeMulti } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'

export const metadata: Metadata = {
  title: 'Viral YouTube Shorts Today | Trending Shorts Radar',
  description: 'Discover viral YouTube Shorts with explosive growth. Real-time Shorts intelligence with velocity, engagement, and creator opportunities.',
}

function formatNumber(n: string | undefined) {
  const num = Number(n || 0)
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return num.toLocaleString()
}

export default async function ViralShortsPage() {
  const region = await getRegion()
  const videos = await searchYouTubeMulti(
    ['youtube shorts trending', 'viral shorts'],
    25,
    'viewCount'
  )

  const finalShorts = videos.slice(0, 15)

  return (
    <main className="min-h-screen bg-[#070707] text-white terminal-grid relative overflow-hidden">
      <div className="ambient-glow-tl" />
      <div className="ambient-glow-tr" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6 sm:mb-8">
          <span className="text-lg">←</span>
          <span className="text-sm font-medium">Back to Trends</span>
        </Link>

        <div className="mb-8 sm:mb-10">
          <div className="text-zinc-500 text-xs font-bold tracking-[0.2em] uppercase mb-2 data-mono">📱 SHORTS INTELLIGENCE</div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-glow">Viral YouTube Shorts</h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            The most explosive YouTube Shorts right now. Vertical content with maximum
            algorithmic reach and creator opportunity.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {finalShorts.map((video: any) => {
            const velocity = getViewVelocity(video)
            return (
              <Link key={video.id} href={`/video/${video.id}`} className="group block">
                <div className="aspect-[9/16] rounded-xl sm:rounded-2xl overflow-hidden relative glass-panel neon-border glow-hover">
                  <img
                    src={video.snippet?.thumbnails?.high?.url}
                    alt={`Shorts thumbnail for ${video.snippet?.title}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="absolute top-2 left-2 bg-red-500/90 px-2 py-0.5 rounded-md text-[10px] font-bold shadow-[0_0_10px_rgba(239,68,68,0.4)]">SHORTS</div>
                  <div className="absolute top-2 right-2 glass-panel px-2 py-0.5 rounded-md text-[10px] font-bold text-white data-mono">
                    ⚡ {velocity >= 1e6 ? (velocity / 1e6).toFixed(1) + 'M' : velocity >= 1e3 ? (velocity / 1e3).toFixed(1) + 'K' : Math.round(velocity)}/d
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="text-white font-bold text-xs line-clamp-2 mb-1">{video.snippet?.title}</div>
                    <div className="text-zinc-400 text-[10px] data-mono">👁️ {formatNumber(video.statistics?.viewCount)} views</div>
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
