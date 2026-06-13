import type { Metadata } from 'next'
import Link from 'next/link'
import { getViewVelocity, getEngagementRate } from '@/lib/analytics'
import { fetchTrendingVideos } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Gaming YouTube Trends 2026 | Viral Gaming Videos & Streams',
  description: 'Track the fastest-growing gaming content on YouTube. Minecraft, GTA, Fortnite, Roblox trends with real-time creator intelligence for gaming channels.',
  keywords: ['gaming trends', 'viral gaming', 'youtube gaming', 'minecraft trends', 'fortnite trends', 'gta trends', 'game streaming'],
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
  if (t.includes('roblox')) return 'Roblox content appeals to younger demographics with game creation showcases and obby challenges driving consistent views.'
  if (t.includes('speedrun')) return 'Speedrun content taps into completionist communities and world record chase narratives. High engagement from dedicated audiences.'
  if (t.includes('glitch') || t.includes('secret')) return 'Secret discovery and glitch content creates curiosity gaps. Viewers watch to learn something they can use.'
  if (t.includes('challenge')) return 'Gaming challenges create natural narrative arcs. Progression and skill demonstration drive watch time.'
  if (t.includes('walkthrough') || t.includes('guide')) return 'Walkthrough content captures search intent from stuck players. SEO-optimized titles perform exceptionally well.'
  return 'Gaming content benefits from dedicated communities and consistent upload schedules. Live streaming cross-pollination amplifies discovery.'
}

// Gaming keywords for filtering
const GAMING_KEYWORDS = [
  'gaming', 'game', 'gameplay', 'gamer', 'play', 'playing', 'stream', 'streaming',
  'minecraft', 'gta', 'fortnite', 'roblox', 'valorant', 'cod', 'call of duty',
  'fps', 'rpg', 'mmo', 'battle royale', 'esports', 'competitive', 'ranked',
  'speedrun', 'walkthrough', 'guide', 'tutorial', 'tips', 'tricks', 'secret',
  'glitch', 'hack', 'mod', 'challenge', 'lets play', 'playthrough', 'review',
  'reaction', 'highlight', 'clip', 'montage', 'funny moments', 'fails', 'win'
]

export default async function GamingTrendsPage() {
  const region = await getRegion()
  const videos = await fetchTrendingVideos(region, 50)

  const gamingVideos = videos.filter((v: any) => {
    const text = `${v.snippet?.title || ''} ${v.snippet?.description || ''}`.toLowerCase()
    return GAMING_KEYWORDS.some((k) => text.includes(k))
  })

  const sortedGaming = [...gamingVideos].sort((a: any, b: any) => {
    const velA = getViewVelocity(a)
    const velB = getViewVelocity(b)
    return velB - velA
  })

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 sm:mb-8">
          <span className="text-lg">←</span>
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        {/* Hero */}
        <div className="mb-8 sm:mb-12">
          <div className="text-purple-600 text-xs font-bold tracking-[0.2em] uppercase mb-2">🎮 GAMING INTELLIGENCE</div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-gray-900">Gaming Trends</h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl leading-relaxed mb-6">
            Track viral gaming content before it peaks. Minecraft, GTA, Fortnite, Roblox, and emerging game trends with
            real-time velocity and competition analysis for gaming creators.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">🎮 TRENDING</div>
              <div className="text-xl font-black text-gray-900">{sortedGaming.length}</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">⚡ AVG VELOCITY</div>
              <div className="text-xl font-black text-green-600">
                {sortedGaming.length > 0
                  ? `${Math.round(sortedGaming.reduce((s, v) => s + getViewVelocity(v), 0) / sortedGaming.length / 1000)}K/d`
                  : '0K/d'}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">📈 ENGAGEMENT</div>
              <div className="text-xl font-black text-yellow-600">
                {sortedGaming.length > 0
                  ? `${(sortedGaming.reduce((s, v) => s + getEngagementRate(v), 0) / sortedGaming.length).toFixed(2)}%`
                  : '0%'}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">🎯 COMPETITION</div>
              <div className="text-xl font-black text-yellow-600">MEDIUM 🟡</div>
            </div>
          </div>
        </div>

        {/* Hot Niches */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
            <span className="text-purple-600">🔥</span> Hot Gaming Niches Right Now
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
                href={`/tag/${niche.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:border-purple-400 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{niche.icon}</span>
                  <span className="font-bold text-gray-900 text-sm">{niche.name}</span>
                </div>
                <div className={`text-sm font-bold ${niche.color}`}>{niche.trend} this week</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Trending Videos */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
            <span className="text-red-600">🔥</span> Trending Gaming Videos
          </h2>

          {sortedGaming.length === 0 && (
            <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
              <div className="text-gray-500 mb-2">No gaming videos in trending right now.</div>
              <Link href="/trending" className="text-purple-600 hover:text-purple-500 text-sm font-medium">
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
                  <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 hover:border-purple-400 hover:shadow-lg transition-all h-full">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={video.snippet?.thumbnails?.high?.url || video.snippet?.thumbnails?.medium?.url}
                        alt={video.snippet?.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 bg-purple-500/90 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold">
                        🎮 GAMING
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-lg text-[10px] font-medium">
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

                      {/* Insight */}
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <div className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">💡 WHY IT WORKS</div>
                        <div className="text-gray-600 text-xs leading-relaxed">{insights}</div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-50 rounded-lg p-2 text-center">
                          <div className="text-gray-500 text-[10px] uppercase tracking-wider">⚡ VELOCITY</div>
                          <div className="text-green-600 font-bold text-xs">
                            {velocity >= 1e6 ? (velocity / 1e6).toFixed(1) + 'M/d' : velocity >= 1e3 ? (velocity / 1e3).toFixed(1) + 'K/d' : Math.round(velocity) + '/d'}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2 text-center">
                          <div className="text-gray-500 text-[10px] uppercase tracking-wider">📈 ENGAGEMENT</div>
                          <div className="text-yellow-600 font-bold text-xs">{engagement.toFixed(2)}%</div>
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
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm mb-8">
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
              <div key={i} className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="font-bold text-sm mb-1 text-gray-900">{item.q}</div>
                <div className="text-gray-500 text-xs leading-relaxed">{item.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Tools */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900">Related Tools</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link href="/gaming-youtube-trends" className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="text-2xl mb-2">🎮</div>
              <div className="text-sm font-medium text-gray-900">Gaming Trends</div>
            </Link>
            <Link href="/youtube-video-analyzer" className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm font-medium text-gray-900">Video Analyzer</div>
            </Link>
            <Link href="/trends" className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="text-2xl mb-2">🔥</div>
              <div className="text-sm font-medium text-gray-900">Trend Database</div>
            </Link>
            <Link href="/ai-assistant" className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="text-2xl mb-2">🤖</div>
              <div className="text-sm font-medium text-gray-900">AI Assistant</div>
            </Link>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 text-center border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold mb-2 text-gray-900">Ready to Grow Your Gaming Channel?</h2>
          <p className="text-gray-500 text-sm mb-4 max-w-xl mx-auto">
            Get early access to viral gaming trends before your competition.
          </p>
          <Link
            href="/trends"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-bold text-sm hover:bg-purple-700 transition shadow-lg"
          >
            Explore All Trends →
          </Link>
        </div>
      </div>
    </main>
  )
}
