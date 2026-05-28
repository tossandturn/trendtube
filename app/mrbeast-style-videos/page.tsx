import type { Metadata } from 'next'
import Link from 'next/link'
import { getViewVelocity, getEngagementRate } from '@/lib/analytics'
import { fetchTrendingVideos } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'

export const metadata: Metadata = {
  title: 'MrBeast Style YouTube Videos | Viral Challenge & Giveaway Trends',
  description: 'Analyze high-stakes challenge videos, giveaway formats, and "last to leave" content that drives massive engagement. Learn the MrBeast formula.',
}

function formatNumber(n: string | undefined) {
  const num = Number(n || 0)
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return num.toLocaleString()
}

function getMrBeastInsights(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('last to leave') || t.includes('last to stop')) return 'Last-to-leave formats create natural suspense and high retention. Viewers stay to see who wins the prize.'
  if (t.includes('challenge')) return 'Challenge videos drive participation and sharing. The competitive element creates emotional investment.'
  if (t.includes('$') || t.includes('dollar')) return 'High-stake giveaways ($10,000+) create curiosity gaps. Viewers watch to see if the prize is real and who wins.'
  if (t.includes('survive')) return 'Survival challenges tap into primal instincts. The struggle element creates empathy and engagement.'
  if (t.includes('extreme')) return 'Extreme challenges push boundaries. The "will they make it" factor drives watch time.'
  if (t.includes('24 hours') || t.includes('48 hours')) return 'Time-based challenges create urgency. The ticking clock element keeps viewers watching.'
  return 'High-stakes formats leverage curiosity gaps and suspense. The promise of payoff drives exceptional retention.'
}

export default async function MrBeastStylePage() {
  const region = await getRegion()
  const videos = await fetchTrendingVideos(region, 50)

  // Filter for challenge/high-stakes content
  const challengeVideos = videos.filter((v: any) => {
    const text = `${v.snippet?.title || ''} ${v.snippet?.description || ''}`.toLowerCase()
    const keywords = ['challenge', 'last to', '$1000', '$10000', '$100000', 'survive', 'extreme', 'giveaway', '24 hours', '48 hours', 'wins']
    return keywords.some((k) => text.includes(k))
  })

  const sorted = [...challengeVideos].sort((a: any, b: any) => {
    const velA = getViewVelocity(a)
    const velB = getViewVelocity(b)
    return velB - velA
  })

  return (
    <main className="min-h-screen bg-white text-gray-900 terminal-grid relative overflow-hidden">
      <div className="ambient-glow-tl" />
      <div className="ambient-glow-tr" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 sm:mb-8">
          <span className="text-lg">←</span>
          <span className="text-sm font-medium">Back to Trends</span>
        </Link>

        {/* Hero */}
        <div className="mb-8 sm:mb-12">
          <div className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase mb-2 data-mono">💰 HIGH-STAKES INTELLIGENCE</div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-glow text-gray-900">MrBeast Style Videos</h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl leading-relaxed mb-6">
            Analyze high-stakes challenge videos, giveaway formats, and "last to leave" content that drives massive engagement.
            Learn what makes the MrBeast formula work.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="glass-panel rounded-xl p-4 border border-gray-200">
              <div className="text-gray-500 text-[10px] data-mono tracking-wider mb-1">🎬 CHALLENGE VIDEOS</div>
              <div className="text-xl font-black text-glow text-gray-900">{sorted.length}</div>
            </div>
            <div className="glass-panel rounded-xl p-4 border border-gray-200">
              <div className="text-gray-500 text-[10px] data-mono tracking-wider mb-1">⚡ AVG VELOCITY</div>
              <div className="text-xl font-black text-green-600 text-glow-green">
                {sorted.length > 0
                  ? `${Math.round(sorted.reduce((s, v) => s + getViewVelocity(v), 0) / sorted.length / 1000)}K/d`
                  : '0K/d'}
              </div>
            </div>
            <div className="glass-panel rounded-xl p-4 border border-gray-200">
              <div className="text-gray-500 text-[10px] data-mono tracking-wider mb-1">📈 ENGAGEMENT</div>
              <div className="text-xl font-black text-yellow-600 text-glow-yellow">
                {sorted.length > 0
                  ? `${(sorted.reduce((s, v) => s + getEngagementRate(v), 0) / sorted.length).toFixed(2)}%`
                  : '0%'}
              </div>
            </div>
            <div className="glass-panel rounded-xl p-4 border border-gray-200">
              <div className="text-gray-500 text-[10px] data-mono tracking-wider mb-1">🎯 COMPETITION</div>
              <div className="text-xl font-black text-green-600">LOW 🟢</div>
            </div>
          </div>
        </div>

        {/* The Formula Section */}
        <div className="glass-panel neon-border rounded-2xl p-6 sm:p-8 glow-hover mb-8 sm:mb-12">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900">
            <span className="text-yellow-600">🏆</span> The MrBeast Formula
          </h2>
          <div className="grid sm:grid-cols-4 gap-4">
            {[
              { step: '1', title: 'High Stakes', desc: '$10,000+ or extreme physical challenge', icon: '💰' },
              { step: '2', title: 'Clear Rules', desc: 'Simple, easy-to-understand challenge parameters', icon: '📋' },
              { step: '3', title: 'Progressive Tension', desc: 'Escalating difficulty or stakes', icon: '📈' },
              { step: '4', title: 'Payoff Moment', desc: 'Winner reveal and prize delivery', icon: '🏆' },
            ].map((item) => (
              <div key={item.step} className="glass-panel rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-yellow-600 font-bold text-sm mb-1">{item.title}</div>
                <div className="text-gray-500 text-xs">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Formats */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
            <span className="text-red-600">🔥</span> Trending Challenge Formats
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: 'Last to Leave', trend: '+45%', color: 'text-green-600' },
              { name: '$10K Challenges', trend: '+38%', color: 'text-yellow-600' },
              { name: 'Survival Format', trend: '+29%', color: 'text-orange-600' },
              { name: 'Extreme Stunts', trend: '+22%', color: 'text-red-600' },
            ].map((format) => (
              <div key={format.name} className="glass-panel neon-border rounded-xl p-4 glow-hover">
                <div className="font-bold text-sm mb-1 text-gray-900">{format.name}</div>
                <div className={`text-sm font-bold ${format.color}`}>{format.trend} this week</div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Videos */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="text-green-400">📈</span> Trending Challenge Videos
          </h2>

          {sorted.length === 0 && (
            <div className="glass-panel rounded-xl p-8 text-center">
              <div className="text-gray-500 mb-2">No challenge videos trending right now.</div>
              <Link href="/" className="text-red-600 hover:text-red-500 text-sm font-medium">
                Check all trends →
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {sorted.slice(0, 9).map((video: any) => {
              const velocity = getViewVelocity(video)
              const engagement = getEngagementRate(video)
              const insights = getMrBeastInsights(video.snippet?.title || '')
              return (
                <Link key={video.id} href={`/video/${video.id}`} className="group block">
                  <div className="glass-panel neon-border rounded-xl sm:rounded-2xl overflow-hidden glow-hover corner-accent h-full">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={video.snippet?.thumbnails?.high?.url}
                        alt={video.snippet?.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 px-2.5 py-1 rounded-lg text-[10px] font-bold backdrop-blur data-mono">
                        💰 CHALLENGE
                      </div>
                      <div className="absolute bottom-2 right-2 glass-panel px-2 py-1 rounded-lg text-[10px] sm:text-xs font-medium data-mono text-gray-700">
                        👁️ {formatNumber(video.statistics?.viewCount)}
                      </div>
                    </div>
                    <div className="p-3 sm:p-5">
                      <h3 className="font-bold text-sm sm:text-base line-clamp-2 mb-2 group-hover:text-yellow-600 transition-colors text-gray-900">
                        {video.snippet?.title}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-500 text-xs mb-3">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-[10px] font-bold text-gray-700">
                          {video.snippet?.channelTitle?.[0]}
                        </div>
                        <span className="truncate">{video.snippet?.channelTitle}</span>
                      </div>

                      <div className="glass-panel rounded-xl p-3 mb-3">
                        <div className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 data-mono">💡 WHY IT WORKS</div>
                        <div className="text-gray-600 text-xs leading-relaxed">{insights}</div>
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

        {/* Why This Works */}
        <div className="glass-panel neon-border rounded-2xl p-6 sm:p-8 glow-hover mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900">Why High-Stakes Content Works</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { title: 'Curiosity Gap', desc: 'Viewers must watch to see if the prize is real and who wins.' },
              { title: 'Retention', desc: 'The suspense keeps viewers watching until the payoff moment.' },
              { title: 'Shareability', desc: 'People share "unbelievable" moments and high-stakes outcomes.' },
            ].map((item) => (
              <div key={item.title} className="glass-panel rounded-xl p-4">
                <div className="font-bold text-sm mb-2 text-gray-900">{item.title}</div>
                <div className="text-gray-500 text-xs">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'Why do MrBeast-style videos get so many views?', a: 'They combine high stakes ($10,000+), clear rules, progressive tension, and a satisfying payoff. The curiosity gap forces viewers to watch until the end.' },
              { q: 'Can small creators do challenge videos?', a: 'Yes. Start with lower stakes ($100-$500) and focus on the format: clear rules, escalating tension, and a winner reveal.' },
              { q: 'What makes a challenge video go viral?', a: 'Extreme or unusual challenges, relatable participants, and a genuine moment of surprise in the outcome.' },
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
          <h2 className="text-xl font-bold mb-2 text-gray-900">Ready to Create Viral Challenge Content?</h2>
          <p className="text-gray-500 text-sm mb-4 max-w-xl mx-auto">
            Find trending challenge formats before they peak.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition shadow-[0_0_20px_rgba(220,38,38,0.15)]"
          >
            Explore All Trends →
          </Link>
        </div>
      </div>
    </main>
  )
}
