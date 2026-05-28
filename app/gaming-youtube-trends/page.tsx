import type { Metadata } from 'next'
import Link from 'next/link'
import { getViewVelocity, getEngagementRate } from '@/lib/analytics'
import { fetchTrendingVideos } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'

export const metadata: Metadata = {
  title: 'Gaming YouTube Trends 2026 | Viral Gaming Videos & Shorts',
  description: 'Track the fastest-growing gaming content on YouTube. Minecraft, GTA, Fortnite trends with real-time creator intelligence for gaming channels.',
}

function formatNumber(n: string | undefined) {
  const num = Number(n || 0)
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return num.toLocaleString()
}

function getGamingInsights(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('minecraft')) return 'Minecraft content maintains evergreen popularity with constant updates, mod showcases, and building tutorials driving sustained engagement.'
  if (t.includes('gta') || t.includes('grand theft auto')) return 'GTA content spikes around updates, roleplay trends, and viral moments. Open-world chaos drives high retention.'
  if (t.includes('fortnite')) return 'Fortnite trends align with new seasons, events, and competitive scenes. Battle royale moments create viral clip potential.'
  if (t.includes('speedrun')) return 'Speedrun content taps into completionist communities and world record chase narratives. High engagement from dedicated audiences.'
  if (t.includes('glitch') || t.includes('secret')) return 'Secret discovery and glitch content creates curiosity gaps. Viewers watch to learn something they can use.'
  if (t.includes('challenge')) return 'Gaming challenges create natural narrative arcs. Progression and skill demonstration drive watch time.'
  return 'Gaming content benefits from dedicated communities and consistent upload schedules. Live streaming cross-pollination amplifies discovery.'
}

export default async function GamingTrendsPage() {
  const region = await getRegion()
  const videos = await fetchTrendingVideos(region, 50)

  const gamingVideos = videos.filter((v: any) => {
    const text = `${v.snippet?.title || ''} ${v.snippet?.description || ''}`.toLowerCase()
    return ['gaming', 'minecraft', 'gta', 'fortnite', 'game', 'speedrun', 'walkthrough', 'gameplay'].some((k) => text.includes(k))
  })

  const sortedGaming = [...gamingVideos].sort((a: any, b: any) => {
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
          <div className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase mb-2 data-mono">🎮 GAMING INTELLIGENCE</div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-glow text-gray-900">Gaming YouTube Trends</h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl leading-relaxed mb-6">
            Track viral gaming content before it peaks. Minecraft, GTA, Fortnite, and emerging game trends with
            real-time velocity and competition analysis for gaming creators.
          </p>

          {/* Gaming Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="glass-panel rounded-xl p-4 border border-gray-200">
              <div className="text-gray-500 text-[10px] data-mono tracking-wider mb-1">🎮 TRENDING GAMES</div>
              <div className="text-xl font-black text-glow text-gray-900">{sortedGaming.length}</div>
            </div>
            <div className="glass-panel rounded-xl p-4 border border-gray-200">
              <div className="text-gray-500 text-[10px] data-mono tracking-wider mb-1">⚡ AVG VELOCITY</div>
              <div className="text-xl font-black text-green-600 text-glow-green">
                {sortedGaming.length > 0
                  ? `${Math.round(sortedGaming.reduce((s, v) => s + getViewVelocity(v), 0) / sortedGaming.length / 1000)}K/d`
                  : '0K/d'}
              </div>
            </div>
            <div className="glass-panel rounded-xl p-4 border border-gray-200">
              <div className="text-gray-500 text-[10px] data-mono tracking-wider mb-1">📈 AVG ENGAGEMENT</div>
              <div className="text-xl font-black text-yellow-600 text-glow-yellow">
                {sortedGaming.length > 0
                  ? `${(sortedGaming.reduce((s, v) => s + getEngagementRate(v), 0) / sortedGaming.length).toFixed(2)}%`
                  : '0%'}
              </div>
            </div>
            <div className="glass-panel rounded-xl p-4 border border-gray-200">
              <div className="text-gray-500 text-[10px] data-mono tracking-wider mb-1">🎯 COMPETITION</div>
              <div className="text-xl font-black text-yellow-600">MEDIUM 🟡</div>
            </div>
          </div>
        </div>

        {/* Gaming Niches */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
            <span className="text-purple-600">🎯</span> Hot Gaming Niches Right Now
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: 'Minecraft', icon: '⛏️', trend: '+23%', color: 'text-green-600' },
              { name: 'GTA V', icon: '🚗', trend: '+18%', color: 'text-blue-600' },
              { name: 'Fortnite', icon: '🏰', trend: '+15%', color: 'text-purple-600' },
              { name: 'Speedruns', icon: '⏱️', trend: '+31%', color: 'text-yellow-600' },
            ].map((niche) => (
              <Link
                key={niche.name}
                href={`/tag/${niche.name.toLowerCase().replace(' ', '-')}`}
                className="glass-panel neon-border rounded-xl p-4 glow-hover group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{niche.icon}</span>
                  <span className="font-bold text-gray-900">{niche.name}</span>
                </div>
                <div className={`text-sm font-bold ${niche.color}`}>{niche.trend} this week</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Trending Gaming Videos */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
            <span className="text-red-600">🔥</span> Trending Gaming Videos
          </h2>

          {sortedGaming.length === 0 && (
            <div className="glass-panel rounded-xl p-8 text-center">
              <div className="text-gray-500 mb-2">No gaming videos in trending right now.</div>
              <Link href="/" className="text-red-600 hover:text-red-500 text-sm font-medium">
                Check all trends →
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {sortedGaming.slice(0, 9).map((video: any) => {
              const velocity = getViewVelocity(video)
              const engagement = getEngagementRate(video)
              const insights = getGamingInsights(video.snippet?.title || '')
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
                      <div className="absolute top-2 left-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 px-2.5 py-1 rounded-lg text-[10px] font-bold backdrop-blur data-mono">
                        🎮 GAMING
                      </div>
                      <div className="absolute bottom-2 right-2 glass-panel px-2 py-1 rounded-lg text-[10px] sm:text-xs font-medium data-mono text-gray-700">
                        👁️ {formatNumber(video.statistics?.viewCount)}
                      </div>
                    </div>
                    <div className="p-3 sm:p-5">
                      <h3 className="font-bold text-sm sm:text-base line-clamp-2 mb-2 group-hover:text-purple-600 transition-colors text-gray-900">
                        {video.snippet?.title}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-500 text-xs mb-3">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-[10px] font-bold text-gray-700">
                          {video.snippet?.channelTitle?.[0]}
                        </div>
                        <span className="truncate">{video.snippet?.channelTitle}</span>
                      </div>

                      {/* Gaming Insight */}
                      <div className="glass-panel rounded-xl p-3 mb-3">
                        <div className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 data-mono">🎮 WHY IT WORKS</div>
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

        {/* Creator Tips */}
        <div className="glass-panel neon-border rounded-2xl p-6 sm:p-8 glow-hover mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
            <span className="text-green-600">💡</span> Gaming Creator Tips
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-gray-700">🎯 Best Upload Times</h3>
              <ul className="text-gray-500 text-xs space-y-1">
                <li>• Weekends: 10 AM - 2 PM (peak gaming hours)</li>
                <li>• Weekdays: 3 PM - 7 PM (after school/work)</li>
                <li>• Game update days: Within 2 hours of patch</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-gray-700">📈 Trending Formats</h3>
              <ul className="text-gray-500 text-xs space-y-1">
                <li>• "Secret locations you missed"</li>
                <li>• "I broke the game with this glitch"</li>
                <li>• "Speedrun world record reaction"</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ for SEO */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'What gaming content is trending on YouTube?', a: 'Minecraft tutorials, GTA roleplay, Fortnite competitive moments, and speedruns are currently seeing high velocity.' },
              { q: 'How do I find viral gaming video ideas?', a: 'Monitor game update releases, trending challenges, and community moments. Upload within 24 hours of trend emergence.' },
              { q: 'Is gaming content competitive on YouTube?', a: 'Gaming is saturated but specific niches (speedruns, secrets, glitches) still offer low-competition entry points.' },
            ].map((item, i) => (
              <div key={i} className="glass-panel rounded-xl p-4">
                <div className="font-bold text-sm mb-1 text-gray-900">{item.q}</div>
                <div className="text-gray-500 text-xs leading-relaxed">{item.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="glass-panel neon-border rounded-2xl p-6 sm:p-8 text-center glow-hover">
          <h2 className="text-xl font-bold mb-2 text-gray-900">Ready to Grow Your Gaming Channel?</h2>
          <p className="text-gray-500 text-sm mb-4 max-w-xl mx-auto">
            Get early access to viral gaming trends before your competition.
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
