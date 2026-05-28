import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import AdBanner from '@/app/components/AdBanner'
import { getEngagementRate, getViewVelocity, getTagColor, getTagEmoji } from '@/lib/analytics'
import { fetchTrendingVideos } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'

const TAG_KEYWORDS: Record<string, string[]> = {
  ai: ['ai', 'chatgpt', 'openai', 'gpt'],
  shorts: ['shorts', '#shorts', 'short'],
  gaming: ['gaming', 'minecraft', 'gta', 'fortnite'],
  coding: ['coding', 'developer', 'programming', 'react', 'javascript'],
  crypto: ['crypto', 'bitcoin', 'ethereum'],
  business: ['business', 'money', 'startup'],
  football: ['football', 'soccer'],
  anime: ['anime'],
  music: ['music', 'song'],
  'mrbeast-style': ['$10000', '$100000', 'challenge', 'last to leave'],
}

const TAG_DISPLAY: Record<string, string> = {
  ai: 'AI',
  shorts: 'Shorts',
  gaming: 'Gaming',
  coding: 'Coding',
  crypto: 'Crypto',
  business: 'Business',
  football: 'Football',
  anime: 'Anime',
  music: 'Music',
  'mrbeast-style': 'MrBeast Style',
}

const TAG_ANALYSIS: Record<string, string> = {
  ai: 'AI content is surging due to rapid tool releases, democratized access, and creator curiosity. Early adopters are capturing massive search traffic before saturation hits.',
  shorts: 'Shorts benefit from YouTube\'s aggressive algorithmic push, lower competition per upload, and mobile-first consumption trends. Vertical content receives 2-3x more impressions.',
  gaming: 'Gaming maintains evergreen demand with new releases, updates, and community events driving cyclical spikes. Live streaming cross-pollination amplifies discovery.',
  coding: 'Developer education content has high search retention and strong CPMs. Tutorial-style videos generate steady long-tail traffic and build loyal subscriber bases.',
  crypto: 'Crypto trends spike around market movements, regulatory news, and new project launches. Timing uploads to news cycles yields outsized view velocity.',
  business: 'Business content attracts high-value audiences and premium advertisers. "How to make money" queries are perpetually high-volume across all platforms.',
  football: 'Football content peaks during match days, transfer windows, and tournaments. Fan communities drive intense engagement and rapid sharing behavior.',
  anime: 'Anime trends surge around season releases, manga adaptations, and viral clips. Dedicated communities generate above-average watch time and comment density.',
  music: 'Music content benefits from algorithmic playlisting, reaction formats, and trend-jacking viral sounds. Short-form music clips drive exceptional reach.',
  'mrbeast-style': 'High-stakes challenge formats trigger curiosity gaps and social sharing. The MrBeast formula has proven replicable across budget levels and niches.',
}

const VIDEO_IDEAS: Record<string, string[]> = {
  ai: ['I built an AI app in 60 seconds — here is the result', 'ChatGPT vs human coder: who wins?', 'This free AI tool replaced my designer'],
  shorts: ['Wait for the ending — unbelievable twist', 'I tried viral shorts for 7 days', 'This short got 10M views in 24 hours'],
  gaming: ['Secret level 99% of players miss', 'I broke the game with this glitch', 'Speedrun world record reaction'],
  coding: ['JavaScript trick senior devs hide', 'Build a SaaS in 1 hour', 'React mistake costing you views'],
  crypto: ['This coin is about to explode', 'I tracked whale wallets for a week', 'Crypto portfolio for beginners 2026'],
  business: ['Side hustle making $500/day', 'Business idea no one talks about', 'I copied this store and doubled sales'],
  football: ['Goal that broke the internet', 'This player is unstoppable right now', 'Match analysis you need to see'],
  anime: ['Anime that will break you', 'Top 10 anime this season', 'This scene went viral for a reason'],
  music: ['Song you need in your playlist', 'This beat is pure fire', 'Music production secret revealed'],
  'mrbeast-style': ['$1000 challenge — last to leave wins', 'I copied MrBeast with $100', 'Extreme challenge gone wrong'],
}

interface TagPageProps {
  params: Promise<{ slug: string }>
}

async function fetchVideos() {
  const region = await getRegion()
  return fetchTrendingVideos(region, 50)
}

function formatNumber(n: string | undefined) {
  const num = Number(n || 0)
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B'
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M'
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K'
  return num.toLocaleString()
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params
  const name = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  return {
    title: `${name} YouTube Trends Today | Viral ${name} Videos & Shorts`,
    description: `Track the fastest-growing ${name} YouTube trends, viral videos, and Shorts opportunities with real-time creator intelligence.`,
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params
  const keywords = TAG_KEYWORDS[slug.toLowerCase()]
  if (!keywords) return notFound()

  const videos = await fetchVideos()
  const filtered = videos.filter((v: any) => {
    const text = `${v.snippet?.title || ''} ${v.snippet?.description || ''}`.toLowerCase()
    return keywords.some((k) => text.includes(k))
  })

  const tagName = TAG_DISPLAY[slug.toLowerCase()] || slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  const tagEmoji = getTagEmoji(tagName)
  const analysis = TAG_ANALYSIS[slug.toLowerCase()] || `${tagName} is experiencing significant growth across YouTube. Creators who upload early are capturing outsized attention and subscriber gains.`
  const ideas = VIDEO_IDEAS[slug.toLowerCase()] || [`${tagName} content that blows up`, `Why ${tagName} is trending now`, `The ${tagName} opportunity you missed`]

  const tagVideos = filtered.map((v: any) => ({
    id: v.id,
    title: v.snippet?.title || '',
    views: Number(v.statistics?.viewCount || 0),
    likes: Number(v.statistics?.likeCount || 0),
    comments: Number(v.statistics?.commentCount || 0),
    engagement: getEngagementRate(v),
    velocity: getViewVelocity(v),
  }))

  const avgViews = tagVideos.length > 0 ? tagVideos.reduce((s: number, v: any) => s + v.views, 0) / tagVideos.length : 0
  const avgEngagement = tagVideos.length > 0 ? tagVideos.reduce((s: number, v: any) => s + v.engagement, 0) / tagVideos.length : 0
  const avgVelocity = tagVideos.length > 0 ? tagVideos.reduce((s: number, v: any) => s + v.velocity, 0) / tagVideos.length : 0

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
          <div className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase mb-2 data-mono">🏷️ TAG INTELLIGENCE</div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-glow text-gray-900">{tagEmoji} {tagName} YouTube Trends Today</h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl leading-relaxed">
            Track the fastest-growing {tagName} YouTube trends, viral videos, and Shorts opportunities
            with real-time creator intelligence.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="glass-panel neon-border rounded-2xl p-4 sm:p-5 glow-hover corner-accent">
            <div className="text-gray-500 text-xs sm:text-sm mb-1 data-mono tracking-wider">📊 VIDEOS</div>
            <div className="text-xl sm:text-2xl font-black data-mono text-glow text-gray-900">{filtered.length}</div>
          </div>
          <div className="glass-panel neon-border rounded-2xl p-4 sm:p-5 glow-hover corner-accent">
            <div className="text-gray-500 text-xs sm:text-sm mb-1 data-mono tracking-wider">👁️ AVG VIEWS</div>
            <div className="text-xl sm:text-2xl font-black text-red-600 data-mono text-glow-red">{formatNumber(Math.floor(avgViews).toString())}</div>
          </div>
          <div className="glass-panel neon-border rounded-2xl p-4 sm:p-5 glow-hover corner-accent">
            <div className="text-gray-500 text-xs sm:text-sm mb-1 data-mono tracking-wider">📈 ENGAGEMENT</div>
            <div className="text-xl sm:text-2xl font-black text-green-600 data-mono text-glow-green">{avgEngagement.toFixed(2)}%</div>
          </div>
          <div className="glass-panel neon-border rounded-2xl p-4 sm:p-5 glow-hover corner-accent">
            <div className="text-gray-500 text-xs sm:text-sm mb-1 data-mono tracking-wider">⚡ VELOCITY</div>
            <div className="text-xl sm:text-2xl font-black text-blue-600 data-mono">
              {avgVelocity >= 1e6 ? (avgVelocity / 1e6).toFixed(1) + 'M/d' : avgVelocity >= 1e3 ? (avgVelocity / 1e3).toFixed(1) + 'K/d' : Math.round(avgVelocity) + '/d'}
            </div>
          </div>
        </div>

        <AdBanner slot="4567890123" className="my-8" />

        {/* Real Data Charts */}
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-10">
          {/* Scatter Plot */}
          <div className="glass-panel neon-border rounded-2xl p-5 sm:p-6 glow-hover">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider data-mono">📈 ENGAGEMENT VS VIEWS</h2>
              <span className="text-[10px] text-gray-500 data-mono">{filtered.length} videos</span>
            </div>
            <svg viewBox="0 0 520 300" className="w-full" preserveAspectRatio="xMidYMid meet">
              {(() => {
                const width = 520
                const height = 300
                const margin = { top: 20, right: 20, bottom: 50, left: 55 }
                const chartW = width - margin.left - margin.right
                const chartH = height - margin.top - margin.bottom
                const data = filtered.map((v: any) => ({
                  views: Number(v.statistics?.viewCount || 0),
                  engagement: getEngagementRate(v),
                  title: v.snippet?.title || '',
                })).filter((d: any) => d.views > 0)
                if (data.length === 0) return <text x={width / 2} y={height / 2} fill="#9ca3af" fontSize="14" textAnchor="middle">No data</text>
                const maxViews = Math.max(...data.map((d: any) => d.views), 1)
                const maxEngagement = Math.max(...data.map((d: any) => d.engagement), 0.1)
                const getX = (views: number) => margin.left + (Math.log10(views + 1) / Math.log10(maxViews + 1)) * chartW
                const getY = (engagement: number) => margin.top + chartH - (engagement / Math.max(maxEngagement, 5)) * chartH
                const xTicks = [0, 0.25, 0.5, 0.75, 1]
                const yTicks = 4
                return (
                  <>
                    <rect x={margin.left} y={margin.top} width={chartW} height={chartH} fill="#f3f4f6" opacity="0.5" rx="8" />
                    {xTicks.map((t, i) => {
                      const x = margin.left + t * chartW
                      const viewVal = Math.round(Math.pow(10, t * Math.log10(maxViews + 1)) - 1)
                      return (
                        <g key={`x-${i}`}>
                          <line x1={x} y1={margin.top} x2={x} y2={margin.top + chartH} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2" />
                          <text x={x} y={margin.top + chartH + 18} fill="#9ca3af" fontSize="10" textAnchor="middle" fontFamily="monospace">
                            {viewVal >= 1e6 ? (viewVal / 1e6).toFixed(0) + 'M' : viewVal >= 1e3 ? (viewVal / 1e3).toFixed(0) + 'K' : viewVal}
                          </text>
                        </g>
                      )
                    })}
                    {Array.from({ length: yTicks + 1 }, (_, i) => {
                      const y = margin.top + (i / yTicks) * chartH
                      const val = ((1 - i / yTicks) * Math.max(maxEngagement, 5))
                      return (
                        <g key={`y-${i}`}>
                          <line x1={margin.left} y1={y} x2={margin.left + chartW} y2={y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2" />
                          <text x={margin.left - 8} y={y + 4} fill="#9ca3af" fontSize="10" textAnchor="end" fontFamily="monospace">{val.toFixed(1)}%</text>
                        </g>
                      )
                    })}
                    <text x={margin.left + chartW / 2} y={height - 5} fill="#6b7280" fontSize="11" textAnchor="middle" fontWeight="bold" fontFamily="monospace">Views (log scale)</text>
                    <text x={14} y={margin.top + chartH / 2} fill="#6b7280" fontSize="11" textAnchor="middle" fontWeight="bold" transform={`rotate(-90, 14, ${margin.top + chartH / 2})`} fontFamily="monospace">Engagement</text>
                    {data.map((d: any, i: number) => (
                      <circle
                        key={i}
                        cx={getX(d.views)}
                        cy={getY(d.engagement)}
                        r="5"
                        fill={getTagColor(tagName)}
                        opacity="0.8"
                        stroke="#f3f4f6"
                        strokeWidth="1"
                      >
                        <title>{d.title} — {formatNumber(d.views.toString())} views, {d.engagement.toFixed(2)}% engagement</title>
                      </circle>
                    ))}
                  </>
                )
              })()}
            </svg>
          </div>

          {/* Velocity Bar Chart */}
          <div className="glass-panel neon-border rounded-2xl p-5 sm:p-6 glow-hover">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider data-mono">⚡ TOP VIDEOS BY VELOCITY</h2>
              <span className="text-[10px] text-gray-500 data-mono">views/day</span>
            </div>
            <svg viewBox="0 0 520 300" className="w-full" preserveAspectRatio="xMidYMid meet">
              {(() => {
                const width = 520
                const height = 300
                const margin = { top: 20, right: 80, bottom: 20, left: 150 }
                const chartW = width - margin.left - margin.right
                const chartH = height - margin.top - margin.bottom
                const data = [...filtered]
                  .sort((a: any, b: any) => getViewVelocity(b) - getViewVelocity(a))
                  .slice(0, 8)
                  .map((v: any) => ({
                    velocity: getViewVelocity(v),
                    title: v.snippet?.title || '',
                  }))
                if (data.length === 0) return <text x={width / 2} y={height / 2} fill="#9ca3af" fontSize="14" textAnchor="middle">No data</text>
                const maxVelocity = Math.max(...data.map((d: any) => d.velocity), 1)
                const barSlot = chartH / data.length
                const barHeight = barSlot * 0.65
                const barGap = barSlot * 0.35
                return (
                  <>
                    <rect x={margin.left} y={margin.top} width={chartW} height={chartH} fill="#f3f4f6" opacity="0.5" rx="8" />
                    {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
                      const x = margin.left + t * chartW
                      const val = t * maxVelocity
                      return (
                        <g key={`grid-${i}`}>
                          <line x1={x} y1={margin.top} x2={x} y2={margin.top + chartH} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2" />
                          <text x={x} y={margin.top + chartH + 14} fill="#9ca3af" fontSize="10" textAnchor="middle" fontFamily="monospace">
                            {val >= 1e6 ? (val / 1e6).toFixed(1) + 'M' : val >= 1e3 ? (val / 1e3).toFixed(1) + 'K' : Math.round(val)}
                          </text>
                        </g>
                      )
                    })}
                    {data.map((d: any, i: number) => {
                      const y = margin.top + i * barSlot + barGap / 2
                      const w = (d.velocity / maxVelocity) * chartW
                      return (
                        <g key={i}>
                          <rect x={margin.left} y={y} width={w} height={barHeight} rx="4" fill={getTagColor(tagName)} opacity="0.85" />
                          <text x={margin.left - 8} y={y + barHeight / 2 + 4} fill="#374151" fontSize="10" textAnchor="end" fontFamily="monospace">
                            {d.title.length > 20 ? d.title.slice(0, 20) + '...' : d.title}
                          </text>
                          <text x={margin.left + w + 6} y={y + barHeight / 2 + 4} fill="#6b7280" fontSize="10" fontWeight="bold" fontFamily="monospace">
                            {d.velocity >= 1e6 ? (d.velocity / 1e6).toFixed(1) + 'M/d' : d.velocity >= 1e3 ? (d.velocity / 1e3).toFixed(1) + 'K/d' : Math.round(d.velocity) + '/d'}
                          </text>
                        </g>
                      )
                    })}
                  </>
                )
              })()}
            </svg>
          </div>
        </div>

        {/* AI Analysis */}
        <div className="glass-panel neon-border rounded-2xl p-5 sm:p-6 mb-10 glow-hover corner-accent">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-yellow-400 to-yellow-600" />
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-gray-900">
              <span className="text-yellow-600">🧠</span> AI Trend Analysis
            </h2>
          </div>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{analysis}</p>
        </div>

        {/* Video Ideas */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-red-400 to-red-600" />
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-gray-900">
              <span className="text-red-600">🔥</span> Video Ideas You Should Upload Today
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {ideas.map((idea, idx) => (
              <div key={idx} className="glass-panel neon-border rounded-2xl p-5 glow-hover corner-accent">
                <div className="text-gray-500 text-xs font-bold mb-2 data-mono tracking-wider">💡 IDEA #{idx + 1}</div>
                <div className="font-bold text-sm sm:text-base text-gray-900">&quot;{idea}&quot;</div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Grid */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-yellow-400 to-yellow-600" />
          <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-gray-900">
            <span className="text-yellow-600">✦</span> Top {tagName} Videos
          </h2>
        </div>

        {filtered.length === 0 && (
          <div className="text-gray-500 text-sm py-10">No videos found for this tag right now.</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filtered.map((video: any) => (
            <Link key={video.id} href={`/video/${video.id}`} className="group block">
              <div className="glass-panel neon-border rounded-xl sm:rounded-2xl overflow-hidden glow-hover corner-accent">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={video.snippet?.thumbnails?.high?.url}
                    alt={`Thumbnail for ${video.snippet?.title}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 right-2 glass-panel px-2 py-1 rounded-lg text-[10px] sm:text-xs font-medium data-mono text-gray-700">
                    {formatNumber(video.statistics?.viewCount)} views
                  </div>
                </div>
                <div className="p-3 sm:p-5">
                  <h3 className="font-bold text-sm sm:text-base line-clamp-2 mb-2 group-hover:text-red-600 transition-colors text-gray-900">
                    {video.snippet?.title}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-[10px] font-bold text-gray-700">
                      {video.snippet?.channelTitle?.[0]}
                    </div>
                    <span className="truncate">{video.snippet?.channelTitle}</span>
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
