import type { Metadata } from 'next'
import Link from 'next/link'
import { AnalyzeHeroForm } from '@/app/components/AnalyzeHeroForm'
import { BreadcrumbSchema, FAQPageSchema } from '@/app/components/JsonLd'
import { fetchTrendingVideos } from '@/lib/api-client'
import { getViewVelocity, getEngagementRate, getVideoAgeDays } from '@/lib/analytics'
import { getRegion } from '@/lib/region-server'

export const metadata: Metadata = {
  title: 'YouTube Niche Finder — Potentially Viral Video Rankings (2026)',
  description: 'Discover potentially viral YouTube videos ranked by AI-powered virality scores. Find trending content with high velocity, engagement, and breakout potential.',
  keywords: 'youtube niche finder, viral videos, youtube trending, breakout videos, viral content ranking',
  alternates: {
    canonical: 'https://tubefission.com/youtube-niche-finder',
  },
}

const FAQ_ITEMS = [
  {
    question: 'How are viral scores calculated?',
    answer: 'Our virality score combines view velocity (views per day), engagement rate (likes + comments relative to views), and content freshness. Higher velocity and engagement with newer content = higher viral potential.',
  },
  {
    question: 'What makes a video potentially viral?',
    answer: 'Videos with high velocity (gaining views rapidly), strong engagement (high like/comment ratio), and recent publication dates have the highest breakout potential.',
  },
  {
    question: 'How often is the ranking updated?',
    answer: 'The ranking is updated daily using real-time YouTube API data to ensure you always see the latest potentially viral content.',
  },
]

function formatNumber(n: number): string {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return n.toLocaleString()
}

export default async function NicheFinderPage() {
  const region = await getRegion()
  const videos = await fetchTrendingVideos(region, 50)

  // Calculate virality score for each video
  const scored = videos.map((v) => {
    const velocity = getViewVelocity(v)
    const engagement = getEngagementRate(v)
    const ageDays = getVideoAgeDays(v)
    const views = Number(v.statistics?.viewCount || 0)
    const likes = Number(v.statistics?.likeCount || 0)
    const comments = Number(v.statistics?.commentCount || 0)

    // Virality score: velocity (40%) + engagement (30%) + freshness (20%) + view momentum (10%)
    const velocityScore = Math.min(40, (velocity / 100000) * 40)
    const engagementScore = Math.min(30, engagement * 6)
    const freshnessScore = ageDays <= 1 ? 20 : ageDays <= 3 ? 15 : ageDays <= 7 ? 10 : 5
    const momentumScore = views > 1000000 ? 10 : views > 100000 ? 7 : views > 10000 ? 4 : 2

    const viralityScore = Math.round(velocityScore + engagementScore + freshnessScore + momentumScore)

    return {
      ...v,
      velocity,
      engagement,
      ageDays,
      views,
      likes,
      comments,
      viralityScore: Math.min(100, viralityScore),
    }
  })

  // Sort by virality score
  scored.sort((a, b) => b.viralityScore - a.viralityScore)

  const topVideo = scored[0]

  return (
    <main className="min-h-screen bg-[#070707] text-white terminal-grid relative overflow-hidden">
      <div className="ambient-glow-tl" />
      <div className="ambient-glow-tr" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10">
        <BreadcrumbSchema items={[
          { name: 'Home', url: 'https://tubefission.com' },
          { name: 'YouTube Niche Finder', url: 'https://tubefission.com/youtube-niche-finder' },
        ]} />
        <FAQPageSchema items={FAQ_ITEMS} />

        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6 sm:mb-8">
          <span className="text-lg">←</span>
          <span className="text-sm font-medium">Back to Trends</span>
        </Link>

        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <div className="text-zinc-500 text-xs font-bold tracking-[0.2em] uppercase mb-2 data-mono">🚀 VIRAL RANKINGS</div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-glow">Potentially Viral Videos</h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            AI-ranked videos with the highest breakout potential — based on velocity, engagement, and freshness.
          </p>
        </div>

        {/* Search */}
        <div className="mb-10">
          <AnalyzeHeroForm />
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
          <div className="glass-panel neon-border rounded-xl p-4 text-center">
            <div className="text-zinc-500 text-[10px] data-mono tracking-wider mb-1">📊 TRACKED</div>
            <div className="text-2xl font-black text-blue-400 data-mono text-glow-blue">{scored.length}</div>
          </div>
          <div className="glass-panel neon-border rounded-xl p-4 text-center">
            <div className="text-zinc-500 text-[10px] data-mono tracking-wider mb-1">🔥 TOP SCORE</div>
            <div className="text-2xl font-black text-red-400 data-mono text-glow-red">{topVideo?.viralityScore || 0}</div>
          </div>
          <div className="glass-panel neon-border rounded-xl p-4 text-center">
            <div className="text-zinc-500 text-[10px] data-mono tracking-wider mb-1">⚡ MAX VELOCITY</div>
            <div className="text-2xl font-black text-green-400 data-mono text-glow-green">
              {topVideo ? formatNumber(topVideo.velocity) + '/d' : '0'}
            </div>
          </div>
          <div className="glass-panel neon-border rounded-xl p-4 text-center">
            <div className="text-zinc-500 text-[10px] data-mono tracking-wider mb-1">📈 AVG ENGAGE</div>
            <div className="text-2xl font-black text-yellow-400 data-mono text-glow-yellow">
              {scored.length > 0 ? (scored.reduce((s, v) => s + v.engagement, 0) / scored.length).toFixed(1) + '%' : '0%'}
            </div>
          </div>
        </div>

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
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-xl font-black text-lg shadow-lg flex items-center gap-2">
                    <span>🚀</span>
                    <span>#{1} MOST VIRAL</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-black/80 text-white px-3 py-1.5 rounded-lg text-sm font-bold data-mono backdrop-blur-sm">
                    Score: {topVideo.viralityScore}/100
                  </div>
                  <div className="absolute bottom-3 right-3 glass-panel px-3 py-1.5 rounded-lg text-xs font-bold data-mono">
                    👁️ {formatNumber(topVideo.views)}
                  </div>
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold rounded-full data-mono">🚀 VIRAL</span>
                    <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-bold rounded-full data-mono">{topVideo.ageDays}d old</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-red-400 transition-colors line-clamp-2">
                    {topVideo.snippet?.title}
                  </h2>
                  <p className="text-zinc-400 mb-4">{topVideo.snippet?.channelTitle}</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="glass-panel rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-green-400 data-mono">{formatNumber(topVideo.velocity)}</div>
                      <div className="text-[10px] text-zinc-500 data-mono">VEL/DAY</div>
                    </div>
                    <div className="glass-panel rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-yellow-400 data-mono">{topVideo.engagement.toFixed(2)}%</div>
                      <div className="text-[10px] text-zinc-500 data-mono">ENGAGE</div>
                    </div>
                    <div className="glass-panel rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-blue-400 data-mono">{formatNumber(topVideo.likes)}</div>
                      <div className="text-[10px] text-zinc-500 data-mono">LIKES</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Rankings Table Header */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <span className="text-red-400">📊</span> Full Viral Rankings
          </h2>
        </div>

        {/* Rankings List */}
        <div className="space-y-3">
          {scored.map((video, index) => {
            const rank = index + 1

            return (
              <Link key={video.id} href={`/video/${video.id}`} className="group block">
                <div className="glass-panel neon-border rounded-xl overflow-hidden glow-hover hover:border-red-500/50 transition-all">
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
                    {/* Rank */}
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-black text-lg sm:text-xl flex-shrink-0 ${
                      rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-900' :
                      rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-gray-900' :
                      rank === 3 ? 'bg-gradient-to-br from-orange-300 to-orange-500 text-orange-900' :
                      'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}>
                      {rank}
                    </div>

                    {/* Thumbnail */}
                    <div className="relative w-28 sm:w-36 aspect-video rounded-lg overflow-hidden flex-shrink-0 bg-zinc-800">
                      <img
                        src={video.snippet?.thumbnails?.medium?.url || `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`}
                        alt={video.snippet?.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        loading="lazy"
                      />
                      <div className="absolute bottom-1 right-1 bg-black/80 text-white px-1.5 py-0.5 rounded text-[10px] font-bold data-mono">
                        {formatNumber(video.views)}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm sm:text-base line-clamp-1 group-hover:text-red-400 transition-colors">
                        {video.snippet?.title}
                      </h3>
                      <p className="text-zinc-500 text-xs sm:text-sm truncate">{video.snippet?.channelTitle}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] sm:text-xs text-green-400 data-mono">⚡ {formatNumber(video.velocity)}/d</span>
                        <span className="text-[10px] sm:text-xs text-yellow-400 data-mono">📈 {video.engagement.toFixed(1)}%</span>
                        <span className="text-[10px] sm:text-xs text-zinc-500 data-mono">{video.ageDays}d ago</span>
                      </div>
                    </div>

                    {/* Virality Score */}
                    <div className="flex-shrink-0 text-right">
                      <div className={`text-xl sm:text-2xl font-black data-mono ${
                        video.viralityScore >= 80 ? 'text-red-400 text-glow-red' :
                        video.viralityScore >= 60 ? 'text-orange-400' :
                        video.viralityScore >= 40 ? 'text-yellow-400' :
                        'text-zinc-500'
                      }`}>
                        {video.viralityScore}
                      </div>
                      <div className="text-[10px] text-zinc-500 data-mono">SCORE</div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {scored.length === 0 && (
          <div className="text-zinc-500 text-sm py-10 text-center glass-panel rounded-xl">
            No trending videos found. Check back soon.
          </div>
        )}

        {/* How It Works */}
        <div className="mt-12 glass-panel neon-border rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-bold mb-4">How Virality Scores Work</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-semibold text-sm mb-1">Velocity (40%)</h3>
              <p className="text-zinc-400 text-xs">Views per day — how fast the video is growing right now</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-2xl mb-2">💬</div>
              <h3 className="font-semibold text-sm mb-1">Engagement (30%)</h3>
              <p className="text-zinc-400 text-xs">Likes + comments relative to views — audience interaction quality</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-2xl mb-2">🕐</div>
              <h3 className="font-semibold text-sm mb-1">Freshness (20%)</h3>
              <p className="text-zinc-400 text-xs">Newer videos get a boost — early movers capture more views</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-2xl mb-2">📈</div>
              <h3 className="font-semibold text-sm mb-1">Momentum (10%)</h3>
              <p className="text-zinc-400 text-xs">Absolute view count — established videos with proven reach</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="glass-panel rounded-xl p-4 sm:p-5">
                <h3 className="font-bold text-sm mb-2">{item.question}</h3>
                <p className="text-zinc-400 text-sm">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
