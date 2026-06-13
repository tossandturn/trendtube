import type { Metadata } from 'next'
import Link from 'next/link'
import { getViewVelocity, getEngagementRate } from '@/lib/analytics'
import { fetchTrendingVideos } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Music YouTube Trends 2026 | Viral Music Videos & Artist Trends',
  description: 'Track the fastest-growing music content on YouTube. New releases, artist trends, music videos, and viral audio trends with real-time creator intelligence.',
  keywords: ['music trends', 'viral music', 'youtube music', 'artist trends', 'music video trends', 'audio trends'],
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
  if (t.includes('cover')) return 'Cover songs tap into existing fanbases while showcasing unique artistic interpretation. Quality audio production is essential.'
  if (t.includes('reaction') || t.includes('react')) return 'Music reaction videos succeed on authentic emotional responses. First-time listens to popular tracks drive engagement.'
  if (t.includes('tutorial') || t.includes('lesson') || t.includes('how to play')) return 'Music tutorials capture search intent from learners. Clear progression and multiple camera angles improve retention.'
  if (t.includes('remix') || t.includes('mashup')) return 'Remixes and mashups create novelty from familiar content. Unique combinations can go viral across multiple fanbases.'
  if (t.includes('live') || t.includes('performance')) return 'Live performance content captures energy and authenticity. Concert footage and acoustic sessions perform well.'
  if (t.includes('review') || t.includes('album')) return 'Album reviews build authority through consistent critique. Timely releases around album drops maximize visibility.'
  return 'Music content benefits from audio quality and emotional connection. Consistent upload schedules help build dedicated audiences.'
}

// Music keywords for filtering
const MUSIC_KEYWORDS = [
  'music', 'song', 'artist', 'album', 'single', 'track', 'audio', 'sound',
  'cover', 'remix', 'mashup', 'mix', 'playlist', 'genre', 'pop', 'rock',
  'hip hop', 'rap', 'r&b', 'electronic', 'edm', 'dance', 'classical',
  'jazz', 'country', 'folk', 'indie', 'metal', 'punk', 'soul', 'funk',
  'reggae', 'latin', 'k-pop', 'j-pop', 'concert', 'live', 'performance',
  'mv', 'music video', 'lyrics', 'karaoke', 'instrumental', 'beat'
]

export default async function MusicTrendsPage() {
  const region = await getRegion()
  const videos = await fetchTrendingVideos(region, 50)

  const musicVideos = videos.filter((v: any) => {
    const text = `${v.snippet?.title || ''} ${v.snippet?.description || ''}`.toLowerCase()
    return MUSIC_KEYWORDS.some((k) => text.includes(k))
  })

  const sortedMusic = [...musicVideos].sort((a: any, b: any) => {
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
          <div className="text-purple-600 text-xs font-bold tracking-[0.2em] uppercase mb-2">🎵 MUSIC INTELLIGENCE</div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-gray-900">Music Trends</h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl leading-relaxed mb-6">
            Track viral music content before it peaks. New releases, artist trends, covers, and audio trends with
            real-time velocity and competition analysis for music creators.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">🎵 TRENDING</div>
              <div className="text-xl font-black text-gray-900">{sortedMusic.length}</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">⚡ AVG VELOCITY</div>
              <div className="text-xl font-black text-green-600">
                {sortedMusic.length > 0
                  ? `${Math.round(sortedMusic.reduce((s, v) => s + getViewVelocity(v), 0) / sortedMusic.length / 1000)}K/d`
                  : '0K/d'}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">📈 ENGAGEMENT</div>
              <div className="text-xl font-black text-yellow-600">
                {sortedMusic.length > 0
                  ? `${(sortedMusic.reduce((s, v) => s + getEngagementRate(v), 0) / sortedMusic.length).toFixed(2)}%`
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
            <span className="text-purple-600">🔥</span> Hot Music Niches Right Now
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: 'Song Covers', icon: '🎤', trend: '+32%', color: 'text-purple-600' },
              { name: 'Music Reactions', icon: '🎧', trend: '+24%', color: 'text-blue-600' },
              { name: 'Live Performances', icon: '🎸', trend: '+18%', color: 'text-green-600' },
              { name: 'Music Tutorials', icon: '🎹', trend: '+21%', color: 'text-orange-600' },
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
            <span className="text-purple-600">🔥</span> Trending Music Videos
          </h2>

          {sortedMusic.length === 0 && (
            <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
              <div className="text-gray-500 mb-2">No music videos in trending right now.</div>
              <Link href="/trending" className="text-purple-600 hover:text-purple-500 text-sm font-medium">
                Check all trends →
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {sortedMusic.slice(0, 9).map((video: any) => {
              const velocity = getViewVelocity(video)
              const engagement = getEngagementRate(video)
              const insights = getMusicInsights(video.snippet?.title || '')
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
                        🎵 MUSIC
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
            <span className="text-green-600">💡</span> Music Creator Tips
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-gray-700">🎯 Best Upload Times</h3>
              <ul className="text-gray-500 text-xs space-y-1">
                <li>• Friday: 2 PM - 5 PM (new release day)</li>
                <li>• Weekends: 10 AM - 1 PM (discovery time)</li>
                <li>• Weeknights: 7 PM - 9 PM (commute listening)</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-gray-700">📈 Trending Formats</h3>
              <ul className="text-gray-500 text-xs space-y-1">
                <li>• "Covering [viral song] in 10 styles"</li>
                <li>• "First time hearing [classic album]"</li>
                <li>• "How to play [popular song] on guitar"</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ for SEO */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'What music content is trending on YouTube?', a: 'Song covers, reaction videos, live performances, and music tutorials are currently seeing high engagement across all genres.' },
              { q: 'How do I find viral music video ideas?', a: 'Monitor trending songs on Spotify and Apple Music, follow artist announcements, and cover songs within 48 hours of release.' },
              { q: 'Is music content competitive on YouTube?', a: 'Music is competitive but specific niches like niche genre covers or music theory content offer opportunities.' },
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
            <Link href="/viral-music-trends" className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="text-2xl mb-2">🎵</div>
              <div className="text-sm font-medium text-gray-900">Music Trends</div>
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
          <h2 className="text-xl font-bold mb-2 text-gray-900">Ready to Grow Your Music Channel?</h2>
          <p className="text-gray-500 text-sm mb-4 max-w-xl mx-auto">
            Get early access to viral music trends before your competition.
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
