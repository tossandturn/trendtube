import type { Metadata } from 'next'
import Link from 'next/link'
import { getViewVelocity, getTagEmoji } from '@/lib/analytics'
import { fetchTrendingVideos } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'

export const metadata: Metadata = {
  title: 'YouTube Shorts Trends 2026 | Viral Shorts Radar & Analytics',
  description: 'Track viral YouTube Shorts trends before they explode. Real-time analytics on trending Shorts, hooks, and creator opportunities.',
  keywords: 'youtube shorts trends, viral shorts, shorts analytics, trending shorts, youtube shorts ideas',
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

export default async function ShortsTrendsPage() {
  const region = await getRegion()
  const videos = await fetchTrendingVideos(region, 50)
  const shortsVideos = videos.filter((video: any) => {
    const title = video.snippet?.title?.toLowerCase() || ''
    return title.includes('shorts') || title.includes('#shorts') || title.includes('short')
  })
  const finalShorts = shortsVideos.length > 0 ? shortsVideos : videos

  return (
    <main className="min-h-screen bg-white text-gray-900 terminal-grid relative overflow-hidden">
      <div className="ambient-glow-tl" />
      <div className="ambient-glow-tr" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 sm:mb-8">
          <span className="text-lg">←</span>
          <span className="text-sm font-medium">Back to TubeFission</span>
        </Link>

        <div className="mb-8 sm:mb-12">
          <div className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase mb-2 data-mono">📱 SHORTS INTELLIGENCE</div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-glow text-gray-900">{getTagEmoji('Shorts')} YouTube Shorts Trends</h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl leading-relaxed mb-6">
            Track viral YouTube Shorts trends before they explode. Analyze hooks, engagement patterns,
            and discover creator opportunities with AI-powered insights.
          </p>
        </div>

        {/* Shorts Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-12">
          {finalShorts.slice(0, 10).map((video: any) => {
            const viralScore = getViralScore(video)
            const hookStyle = getHookStyle(video.snippet?.title || '')
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
                  <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/10 to-transparent" />
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-0.5 rounded-md text-[10px] font-bold">SHORTS</div>
                  <div className="absolute top-2 right-2 glass-panel px-2 py-0.5 rounded-md text-[10px] font-bold text-gray-700 data-mono">
                    {viralScore}/100
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="text-gray-900 font-bold text-xs line-clamp-2 mb-1">{video.snippet?.title}</div>
                    <div className="text-gray-500 text-[10px] mb-1 data-mono">{formatNumber(video.statistics?.viewCount)} views</div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded data-mono">{hookStyle}</span>
                      <span className="text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded font-bold data-mono">
                        {velocity >= 1e6 ? (velocity / 1e6).toFixed(1) + 'M/d' : velocity >= 1e3 ? (velocity / 1e3).toFixed(1) + 'K/d' : Math.round(velocity) + '/d'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Why Shorts Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Why Shorts Are Exploding</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { title: 'Algorithm Boost', desc: 'YouTube is heavily promoting Shorts, giving them 2-3x more impressions than regular videos.' },
              { title: 'Lower Competition', desc: 'Fewer creators means less saturation and more opportunity to stand out.' },
              { title: 'Mobile-First', desc: 'Short-form content is perfect for mobile consumption and quick engagement.' },
            ].map((item) => (
              <div key={item.title} className="glass-panel rounded-xl p-5">
                <div className="font-bold text-gray-900 mb-2">{item.title}</div>
                <div className="text-gray-500 text-sm">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900">Shorts FAQ</h2>
          <div className="space-y-3">
            {[
              { q: 'What makes a Short go viral?', a: 'Strong hooks in the first 3 seconds, trending audio, and strong public retention proxies such as engagement and replay-friendly structure are key factors.' },
              { q: 'How often should I post Shorts?', a: 'Consistency matters. Most successful Shorts creators post 3-5 times daily.' },
              { q: 'Can Shorts help grow my channel?', a: 'Yes! Shorts can drive massive traffic to your long-form content and boost subscriber growth.' },
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
          <h2 className="text-xl font-bold mb-2 text-gray-900">Ready to Dominate Shorts?</h2>
          <p className="text-gray-500 text-sm mb-4 max-w-xl mx-auto">
            Get AI-powered Shorts trend alerts and upload recommendations.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition"
          >
            Explore Shorts Trends →
          </Link>
        </div>
      </div>
    </main>
  )
}
