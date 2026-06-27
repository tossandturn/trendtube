import type { Metadata } from 'next'
import Link from 'next/link'
import { getViewVelocity, getEngagementRate } from '@/lib/analytics'
import { searchYouTubeMulti } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'

export const metadata: Metadata = {
  title: 'YouTube AI Trends 2026 | Viral AI Videos & Rankings',
  description: 'Track the hottest AI content on YouTube — ChatGPT tutorials, AI tools, machine learning, and generative AI rankings updated daily.',
  alternates: {
    canonical: 'https://tubefission.com/youtube-ai-trends',
  },
}

function formatNumber(n: string | undefined) {
  const num = Number(n || 0)
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return num.toLocaleString()
}

const AI_SEARCH_QUERIES = [
  'AI tools 2026',
  'ChatGPT tutorial',
  'artificial intelligence',
  'AI video generator',
  'Midjourney AI',
  'AI coding assistant',
  'machine learning tutorial',
  'generative AI',
]

export default async function AITrendsPage() {
  const region = await getRegion()
  const videos = await searchYouTubeMulti(AI_SEARCH_QUERIES, 20, 'viewCount')

  // Sort by view count for ranking
  const ranked = [...videos].sort((a, b) => {
    return Number(b.statistics?.viewCount || 0) - Number(a.statistics?.viewCount || 0)
  })

  const topVideo = ranked[0]

  // Category breakdown
  const categories: Record<string, number> = {}
  for (const v of ranked) {
    const title = (v.snippet?.title || '').toLowerCase()
    let cat = 'Other AI'
    if (title.includes('chatgpt') || title.includes('gpt') || title.includes('openai')) cat = 'ChatGPT / OpenAI'
    else if (title.includes('midjourney') || title.includes('dall') || title.includes('stable diffusion') || title.includes('image gen')) cat = 'Image Generation'
    else if (title.includes('coding') || title.includes('code') || title.includes('programming')) cat = 'AI Coding'
    else if (title.includes('tutorial') || title.includes('learn') || title.includes('course')) cat = 'AI Tutorials'
    else if (title.includes('tool') || title.includes('app') || title.includes('use')) cat = 'AI Tools'
    else if (title.includes('robot') || title.includes('agi') || title.includes('future')) cat = 'AI News'
    categories[cat] = (categories[cat] || 0) + 1
  }

  return (
    <main className="min-h-screen bg-[#070707] text-white terminal-grid relative overflow-hidden">
      <div className="ambient-glow-tl" />
      <div className="ambient-glow-tr" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6 sm:mb-8">
          <span className="text-lg">←</span>
          <span className="text-sm font-medium">Back to Trends</span>
        </Link>

        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <div className="text-zinc-500 text-xs font-bold tracking-[0.2em] uppercase mb-2 data-mono">🤖 AI INTELLIGENCE</div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-glow">YouTube AI Trends</h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            The hottest AI content on YouTube right now — ranked by views, velocity, and engagement.
            Updated daily from real YouTube search data.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
          <div className="glass-panel neon-border rounded-xl p-4 text-center">
            <div className="text-zinc-500 text-[10px] data-mono tracking-wider mb-1">🤖 AI VIDEOS</div>
            <div className="text-2xl font-black text-blue-400 data-mono text-glow-blue">{ranked.length}</div>
          </div>
          <div className="glass-panel neon-border rounded-xl p-4 text-center">
            <div className="text-zinc-500 text-[10px] data-mono tracking-wider mb-1">👁️ TOTAL VIEWS</div>
            <div className="text-2xl font-black text-green-400 data-mono text-glow-green">
              {formatNumber(ranked.reduce((sum, v) => sum + Number(v.statistics?.viewCount || 0), 0).toString())}
            </div>
          </div>
          <div className="glass-panel neon-border rounded-xl p-4 text-center">
            <div className="text-zinc-500 text-[10px] data-mono tracking-wider mb-1">📈 AVG ENGAGEMENT</div>
            <div className="text-2xl font-black text-yellow-400 data-mono text-glow-yellow">
              {ranked.length > 0
                ? (ranked.reduce((sum, v) => sum + getEngagementRate(v), 0) / ranked.length).toFixed(2) + '%'
                : '0%'}
            </div>
          </div>
          <div className="glass-panel neon-border rounded-xl p-4 text-center">
            <div className="text-zinc-500 text-[10px] data-mono tracking-wider mb-1">📊 CATEGORIES</div>
            <div className="text-2xl font-black text-purple-400 data-mono">{Object.keys(categories).length}</div>
          </div>
        </div>

        {/* Category Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {Object.entries(categories)
            .sort((a, b) => b[1] - a[1])
            .map(([cat, count]) => (
              <span key={cat} className="glass-panel px-3 py-1.5 rounded-full text-xs data-mono text-zinc-300 border border-zinc-700">
                {cat} <span className="text-zinc-500">({count})</span>
              </span>
            ))}
        </div>

        {ranked.length === 0 && (
          <div className="text-zinc-500 text-sm py-10 text-center">
            No AI videos found. The YouTube API may be rate-limited. Check back soon.
          </div>
        )}

        {/* Top Video Hero */}
        {topVideo && (
          <Link href={`/video/${topVideo.id}`} className="group block mb-10">
            <div className="glass-panel neon-border rounded-2xl overflow-hidden glow-hover">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative aspect-video md:aspect-auto md:min-h-[320px] overflow-hidden">
                  <img
                    src={topVideo.snippet?.thumbnails?.high?.url || `https://i.ytimg.com/vi/${topVideo.id}/maxresdefault.jpg`}
                    alt={topVideo.snippet?.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-4 py-2 rounded-xl font-black text-lg shadow-lg flex items-center gap-2">
                    <span>🏆</span>
                    <span>#1 AI VIDEO</span>
                  </div>
                  <div className="absolute bottom-3 right-3 glass-panel px-3 py-1.5 rounded-lg text-xs font-bold data-mono">
                    👁️ {formatNumber(topVideo.statistics?.viewCount)}
                  </div>
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-bold rounded-full data-mono">🤖 AI</span>
                    <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-bold rounded-full data-mono">TRENDING</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-red-400 transition-colors line-clamp-2">
                    {topVideo.snippet?.title}
                  </h2>
                  <p className="text-zinc-400 mb-4">{topVideo.snippet?.channelTitle}</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="glass-panel rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-white data-mono">{formatNumber(topVideo.statistics?.viewCount)}</div>
                      <div className="text-[10px] text-zinc-500 data-mono">VIEWS</div>
                    </div>
                    <div className="glass-panel rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-yellow-400 data-mono">{getEngagementRate(topVideo).toFixed(2)}%</div>
                      <div className="text-[10px] text-zinc-500 data-mono">ENGAGE</div>
                    </div>
                    <div className="glass-panel rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-green-400 data-mono">
                        {(() => {
                          const vel = getViewVelocity(topVideo)
                          return vel >= 1e6 ? (vel / 1e6).toFixed(1) + 'M' : vel >= 1e3 ? (vel / 1e3).toFixed(1) + 'K' : Math.round(vel)
                        })()}
                      </div>
                      <div className="text-[10px] text-zinc-500 data-mono">VEL/DAY</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* All AI Videos Grid - Ranked */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="text-blue-400">📊</span> All AI Videos — Ranked by Views
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {ranked.map((video, index) => {
            const velocity = getViewVelocity(video)
            const engagement = getEngagementRate(video)
            const views = Number(video.statistics?.viewCount || 0)
            const rank = index + 1

            return (
              <Link key={video.id} href={`/video/${video.id}`} className="group block">
                <div className="glass-panel neon-border rounded-xl sm:rounded-2xl overflow-hidden glow-hover corner-accent">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={video.snippet?.thumbnails?.high?.url || `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`}
                      alt={video.snippet?.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      loading="lazy"
                    />
                    {/* Rank Badge */}
                    <div className={`absolute top-2 left-2 px-2.5 py-1 rounded-lg text-xs font-bold shadow-lg data-mono ${
                      rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900' :
                      rank === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900' :
                      rank === 3 ? 'bg-gradient-to-r from-orange-300 to-orange-400 text-orange-900' :
                      'bg-black/80 text-white border border-zinc-600'
                    }`}>
                      #{rank}
                    </div>
                    <div className="absolute top-2 right-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 px-2 py-0.5 rounded text-[10px] font-bold backdrop-blur data-mono">
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

        {/* Bottom CTA */}
        <div className="mt-12 glass-panel neon-border rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Track AI Trends in Real-Time</h2>
          <p className="text-zinc-400 mb-6 max-w-lg mx-auto">
            Get alerts when new AI content goes viral. Analyze any YouTube video or channel with our AI-powered tools.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors">
            Start Analyzing →
          </Link>
        </div>
      </div>
    </main>
  )
}
