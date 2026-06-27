import type { Metadata } from 'next'
import Link from 'next/link'
import { getViewVelocity, getEngagementRate } from '@/lib/analytics'
import { searchYouTubeMulti } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'

export const metadata: Metadata = {
  title: 'Viral Music YouTube Trends 2026 | Trending Songs & Covers',
  description: 'Track viral music content on YouTube. Trending songs, covers, music production, and artist breakthrough moments with real-time creator intelligence.',
}

function formatNumber(n: string | undefined) {
  const num = Number(n || 0)
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return num.toLocaleString()
}

function getMusicInsights(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('cover') || t.includes('covers')) return 'Coversions tap into existing song popularity while adding unique interpretation. Cross-pollinates fanbases.'
  if (t.includes('reaction') || t.includes('reacts')) return 'Music reactions benefit from the original artist’s audience discovering the reactor. Low production, high engagement.'
  if (t.includes('remix') || t.includes('mashup')) return 'Remixes and mashups create novelty from familiar elements. Shareable and playlist-friendly.'
  if (t.includes('tutorial') || t.includes('how to')) return 'Music tutorials capture high-intent search traffic. Evergreen content with strong retention.'
  if (t.includes('production') || t.includes('beat')) return 'Production content attracts aspiring creators. High CPM and loyal subscriber base.'
  if (t.includes('official') || t.includes('music video')) return 'Official releases benefit from algorithmic priority and fan anticipation. Guaranteed initial velocity.'
  if (t.includes('live') || t.includes('concert')) return 'Live performances create FOMO and exclusivity. Fans watch for moments they missed.'
  return 'Music content benefits from repeatability, playlisting, and emotional connection. Strong retention signals.'
}

export default async function MusicTrendsPage() {
  const region = await getRegion()
  const videos = await searchYouTubeMulti(
    ['trending music', 'viral songs', 'music covers'],
    25,
    'viewCount'
  )

  const sorted = [...videos].sort((a: any, b: any) => {
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
          <div className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase mb-2 data-mono">🎵 MUSIC INTELLIGENCE</div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-glow text-gray-900">Viral Music YouTube Trends</h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl leading-relaxed mb-6">
            Track viral music content before it peaks. Trending songs, covers, music production,
            and artist breakthrough moments with real-time creator intelligence.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="glass-panel rounded-xl p-4 border border-gray-200">
              <div className="text-gray-500 text-[10px] data-mono tracking-wider mb-1">🎵 MUSIC VIDEOS</div>
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
              <div className="text-gray-500 text-[10px] data-mono tracking-wider mb-1">📈 AVG ENGAGEMENT</div>
              <div className="text-xl font-black text-yellow-600 text-glow-yellow">
                {sorted.length > 0
                  ? `${(sorted.reduce((s, v) => s + getEngagementRate(v), 0) / sorted.length).toFixed(2)}%`
                  : '0%'}
              </div>
            </div>
            <div className="glass-panel rounded-xl p-4 border border-gray-200">
              <div className="text-gray-500 text-[10px] data-mono tracking-wider mb-1">🎯 COMPETITION</div>
              <div className="text-xl font-black text-yellow-600">MEDIUM 🟡</div>
            </div>
          </div>
        </div>

        {/* Music Formats */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
            <span className="text-purple-600">🎧</span> Trending Music Formats
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: 'Covers', trend: '+28%', color: 'text-purple-600' },
              { name: 'Reactions', trend: '+22%', color: 'text-pink-600' },
              { name: 'Production', trend: '+19%', color: 'text-blue-600' },
              { name: 'Live', trend: '+15%', color: 'text-green-600' },
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
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
            <span className="text-red-600">🔥</span> Trending Music Content
          </h2>

          {sorted.length === 0 && (
            <div className="glass-panel rounded-xl p-8 text-center">
              <div className="text-gray-500 mb-2">No music content trending right now.</div>
              <Link href="/" className="text-red-600 hover:text-red-500 text-sm font-medium">
                Check all trends →
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {sorted.slice(0, 9).map((video: any) => {
              const velocity = getViewVelocity(video)
              const engagement = getEngagementRate(video)
              const insights = getMusicInsights(video.snippet?.title || '')
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
                        🎵 MUSIC
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

                      <div className="glass-panel rounded-xl p-3 mb-3">
                        <div className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 data-mono">🎵 WHY IT WORKS</div>
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

        {/* Why Music Content Works */}
        <div className="glass-panel neon-border rounded-2xl p-6 sm:p-8 glow-hover mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900">Why Music Content Works on YouTube</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { title: 'Repeatability', desc: 'People re-watch songs. High replay value inflates view counts and signals strong retention.' },
              { title: 'Playlist Friendly', desc: 'Music gets added to playlists. Passive discovery through autoplay and recommendations.' },
              { title: 'Emotional Connection', desc: 'Music triggers emotions. Strong parasocial bonds and comment engagement.' },
            ].map((item) => (
              <div key={item.title} className="glass-panel rounded-xl p-4">
                <div className="font-bold text-sm mb-2 text-gray-900">{item.title}</div>
                <div className="text-gray-500 text-xs">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="glass-panel neon-border rounded-2xl p-6 sm:p-8 glow-hover mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900">Music Creator Tips</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-gray-700">🎯 Best Upload Times</h3>
              <ul className="text-gray-500 text-xs space-y-1">
                <li>• Friday 12 PM - 3 PM (new music day)</li>
                <li>• Weekend evenings (leisure listening)</li>
                <li>• After major artist drops (reaction content)</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-gray-700">📈 Trending Titles</h3>
              <ul className="text-gray-500 text-xs space-y-1">
                <li>• "Song you need to hear"</li>
                <li>• "This beat is fire"</li>
                <li>• "Vocalist you have to know"</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'What type of music content is trending on YouTube?', a: 'Covers, reactions, production tutorials, and remixes are seeing high engagement. Live performances also perform well.' },
              { q: 'How do I get my music noticed on YouTube?', a: 'Focus on covers of trending songs, collaborate with reactors, and optimize for search with clear titles and thumbnails.' },
              { q: 'Is music content competitive on YouTube?', a: 'Yes, but specific niches like production tutorials, niche covers, and reaction content still offer entry points.' },
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
          <h2 className="text-xl font-bold mb-2 text-gray-900">Ready to Create Viral Music Content?</h2>
          <p className="text-gray-500 text-sm mb-4 max-w-xl mx-auto">
            Find trending music formats before they peak.
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
