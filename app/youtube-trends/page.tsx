import type { Metadata } from 'next'
import Link from 'next/link'
import { getViewVelocity, getEngagementRate } from '@/lib/analytics'
import { fetchTrendingVideos } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'

export const metadata: Metadata = {
  title: 'YouTube Trends Today 2026 | Trending YouTube Videos & Topics',
  description: 'Discover the latest YouTube trends today. Track trending videos, viral topics, and emerging content opportunities with real-time AI analysis.',
  keywords: 'youtube trends today, trending youtube videos, youtube trends 2026, viral youtube topics',
}

function formatNumber(n: string | undefined) {
  const num = Number(n || 0)
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return num.toLocaleString()
}

export default async function YouTubeTrendsPage() {
  const region = await getRegion()
  const videos = await fetchTrendingVideos(region, 50)

  const sorted = [...videos].sort((a: any, b: any) =>
    Number(b.statistics?.viewCount || 0) - Number(a.statistics?.viewCount || 0)
  )

  const trendingTags = ['AI', 'Shorts', 'Gaming', 'Music', 'Business', 'Crypto', 'Tutorial']

  return (
    <main className="min-h-screen bg-white text-gray-900 terminal-grid relative overflow-hidden">
      <div className="ambient-glow-tl" />
      <div className="ambient-glow-tr" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 sm:mb-8">
          <span className="text-lg">←</span>
          <span className="text-sm font-medium">Back to TubeFission</span>
        </Link>

        {/* Hero */}
        <div className="mb-8 sm:mb-12">
          <div className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase mb-2 data-mono">🔥 YOUTUBE TRENDS</div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-glow text-gray-900">
            YouTube Trends Today
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl leading-relaxed mb-6">
            Discover the latest trending YouTube videos and topics. Real-time trend tracking with AI-powered insights
            to help creators stay ahead of the curve.
          </p>

          {/* Trending Tags */}
          <div className="flex flex-wrap gap-2">
            {trendingTags.map((tag) => (
              <Link
                key={tag}
                href={`/tag/${tag.toLowerCase()}`}
                className="px-4 py-2 bg-red-50 text-red-700 rounded-full text-sm font-bold hover:bg-red-100 transition"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          <div className="glass-panel rounded-xl p-4 border border-gray-200">
            <div className="text-gray-500 text-[10px] data-mono tracking-wider mb-1">📊 TRENDING VIDEOS</div>
            <div className="text-xl font-black text-glow text-gray-900">{sorted.length}</div>
          </div>
          <div className="glass-panel rounded-xl p-4 border border-gray-200">
            <div className="text-gray-500 text-[10px] data-mono tracking-wider mb-1">⚡ TOP VELOCITY</div>
            <div className="text-xl font-black text-green-600 text-glow-green">
              {sorted.length > 0 ? `${formatNumber(sorted[0].statistics?.viewCount)}` : '0'}
            </div>
          </div>
          <div className="glass-panel rounded-xl p-4 border border-gray-200">
            <div className="text-gray-500 text-[10px] data-mono tracking-wider mb-1">📈 AVG ENGAGEMENT</div>
            <div className="text-xl font-black text-yellow-600 text-glow-yellow">
              {sorted.length > 0
                ? `${(sorted.reduce((s, v) => s + getEngagementRate(v), 0) / sorted.length).toFixed(2)}%`
                : '0%'}
            </div>
          </div>
          <div className="glass-panel rounded-xl p-4 border border-gray-200">
            <div className="text-gray-500 text-[10px] data-mono tracking-wider mb-1">🔄 UPDATED</div>
            <div className="text-xl font-black text-blue-600">LIVE</div>
          </div>
        </div>

        {/* Trending Videos */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
            <span className="text-red-600">🔥</span> Trending YouTube Videos Right Now
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {sorted.slice(0, 9).map((video: any) => {
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

        {/* FAQ Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'What are the top YouTube trends today?', a: 'The top trends today include AI-generated content, viral Shorts challenges, gaming highlights, and music covers. Our real-time tracking updates hourly.' },
              { q: 'How do I find trending YouTube topics?', a: 'TubeFission analyzes millions of videos to identify emerging trends. Check our trending dashboard or tag pages for specific niches.' },
              { q: 'Why do videos trend on YouTube?', a: 'Videos trend due to high engagement rates, rapid view velocity, social sharing, and algorithmic recommendations. Early momentum is key.' },
            ].map((item, i) => (
              <div key={i} className="glass-panel rounded-xl p-4">
                <div className="font-bold text-sm mb-1 text-gray-900">{item.q}</div>
                <div className="text-gray-500 text-xs leading-relaxed">{item.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="glass-panel neon-border rounded-2xl p-6 sm:p-8 text-center glow-hover">
          <h2 className="text-xl font-bold mb-2 text-gray-900">Want More Trend Insights?</h2>
          <p className="text-gray-500 text-sm mb-4 max-w-xl mx-auto">
            Get AI-powered trend predictions, upload suggestions, and opportunity alerts.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition shadow-[0_0_20px_rgba(220,38,38,0.15)]"
          >
            Explore All Features →
          </Link>
        </div>
      </div>
    </main>
  )
}
