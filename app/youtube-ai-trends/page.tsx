import type { Metadata } from 'next'
import Link from 'next/link'
import { getViewVelocity, getEngagementRate } from '@/lib/analytics'
import { fetchTrendingVideos } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'

export const metadata: Metadata = {
  title: 'YouTube AI Trends 2026 | Viral AI Videos & Shorts',
  description: 'Track the fastest-growing AI content on YouTube. ChatGPT tutorials, AI tools, and machine learning trends with real-time creator intelligence.',
}

function formatNumber(n: string | undefined) {
  const num = Number(n || 0)
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return num.toLocaleString()
}

export default async function AITrendsPage() {
  const region = await getRegion()
  const videos = await fetchTrendingVideos(region, 50)

  const aiVideos = videos.filter((v: any) => {
    const text = `${v.snippet?.title || ''} ${v.snippet?.description || ''}`.toLowerCase()
    return ['ai', 'chatgpt', 'openai', 'gpt', 'midjourney', 'stable diffusion', 'llm'].some((k) => text.includes(k))
  })

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
          <div className="text-zinc-500 text-xs font-bold tracking-[0.2em] uppercase mb-2 data-mono">🤖 AI INTELLIGENCE</div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-glow">YouTube AI Trends</h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            The hottest AI content on YouTube right now — ChatGPT tutorials, AI tools,
            Midjourney art, and machine learning breakthroughs.
          </p>
        </div>

        {aiVideos.length === 0 && (
          <div className="text-zinc-500 text-sm py-10">No AI videos in trending right now. Check back soon.</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {aiVideos.map((video: any) => {
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
                    <div className="absolute top-2 left-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 px-2.5 py-1 rounded-lg text-[10px] font-bold backdrop-blur data-mono">
                      🤖 AI
                    </div>
                    <div className="absolute bottom-2 right-2 glass-panel px-2 py-1 rounded-lg text-[10px] sm:text-xs font-medium data-mono">
                      👁️ {formatNumber(video.statistics?.viewCount)}
                    </div>
                  </div>
                  <div className="p-3 sm:p-5">
                    <h3 className="font-bold text-sm sm:text-base line-clamp-2 mb-2 group-hover:text-red-400 transition-colors">
                      {video.snippet?.title}
                    </h3>
                    <div className="flex items-center gap-2 text-zinc-500 text-xs mb-3">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-[10px] font-bold">
                        {video.snippet?.channelTitle?.[0]}
                      </div>
                      <span className="truncate">{video.snippet?.channelTitle}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="glass-panel rounded-lg p-2 text-center">
                        <div className="text-zinc-500 text-[10px] data-mono tracking-wider">⚡ VELOCITY</div>
                        <div className="text-green-400 font-bold text-xs data-mono text-glow-green">
                          {velocity >= 1e6 ? (velocity / 1e6).toFixed(1) + 'M/d' : velocity >= 1e3 ? (velocity / 1e3).toFixed(1) + 'K/d' : Math.round(velocity) + '/d'}
                        </div>
                      </div>
                      <div className="glass-panel rounded-lg p-2 text-center">
                        <div className="text-zinc-500 text-[10px] data-mono tracking-wider">📈 ENGAGEMENT</div>
                        <div className="text-yellow-400 font-bold text-xs data-mono text-glow-yellow">{engagement.toFixed(2)}%</div>
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
