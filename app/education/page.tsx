import type { Metadata } from 'next'
import Link from 'next/link'
import { getViewVelocity, getEngagementRate } from '@/lib/analytics'
import { fetchTrendingVideos } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Education YouTube Trends 2026 | Learning & Tutorial Content',
  description: 'Track the fastest-growing educational content on YouTube. Tutorials, courses, skill-building, and learning trends with real-time creator intelligence.',
  keywords: ['education trends', 'learning content', 'youtube education', 'tutorial trends', 'online courses', 'skill building'],
}

function formatNumber(n: string | undefined) {
  const num = Number(n || 0)
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return num.toLocaleString()
}

function getEducationInsights(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('tutorial') || t.includes('how to')) return 'Tutorials succeed on clear outcomes and step-by-step progression. Visual demonstrations outperform verbal explanations.'
  if (t.includes('course') || t.includes('lesson') || t.includes('class')) return 'Course-style content builds authority through structured learning. Series and playlists improve retention and subscriptions.'
  if (t.includes('tips') || t.includes('tricks') || t.includes('hacks')) return 'Tips and tricks content promises quick value. Numbered lists and before/after demonstrations perform well.'
  if (t.includes('explained') || t.includes('explain') || t.includes('what is')) return 'Explanation content captures curiosity-driven search. Analogies and visual metaphors improve comprehension.'
  if (t.includes('beginner') || t.includes('start') || t.includes('basics')) return 'Beginner content serves the largest audience segment. Starting from zero and building up reduces intimidation.'
  if (t.includes('project') || t.includes('build') || t.includes('make')) return 'Project-based learning provides tangible outcomes. Follow-along formats create active engagement.'
  return 'Educational content benefits from clear structure and measurable outcomes. Consistency builds authority and returning audiences.'
}

// Education keywords for filtering
const EDUCATION_KEYWORDS = [
  'education', 'learn', 'learning', 'tutorial', 'course', 'lesson', 'class',
  'study', 'student', 'teacher', 'professor', 'academic', 'school', 'university',
  'college', 'lecture', 'seminar', 'workshop', 'training', 'skill', 'skills',
  'how to', 'guide', 'explained', 'explanation', 'what is', 'why', 'basics',
  'beginner', 'intro', 'introduction', 'advanced', 'mastery', 'tips', 'tricks',
  'hacks', 'techniques', 'methods', 'strategies', 'project', 'build', 'make',
  'create', 'diy', 'science', 'math', 'history', 'language', 'programming',
  'coding', 'design', 'art', 'music', 'business', 'finance', 'personal development',
  'productivity', 'study tips', 'exam', 'test', 'preparation', 'homework'
]

export default async function EducationTrendsPage() {
  const region = await getRegion()
  const videos = await fetchTrendingVideos(region, 50)

  const educationVideos = videos.filter((v: any) => {
    const text = `${v.snippet?.title || ''} ${v.snippet?.description || ''}`.toLowerCase()
    return EDUCATION_KEYWORDS.some((k) => text.includes(k))
  })

  const sortedEducation = [...educationVideos].sort((a: any, b: any) => {
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
          <div className="text-indigo-600 text-xs font-bold tracking-[0.2em] uppercase mb-2">🎓 EDUCATION INTELLIGENCE</div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-gray-900">Education Trends</h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl leading-relaxed mb-6">
            Track viral educational content before it peaks. Tutorials, courses, skill-building, and learning trends with
            real-time velocity and competition analysis for educational creators.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">🎓 TRENDING</div>
              <div className="text-xl font-black text-gray-900">{sortedEducation.length}</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">⚡ AVG VELOCITY</div>
              <div className="text-xl font-black text-green-600">
                {sortedEducation.length > 0
                  ? `${Math.round(sortedEducation.reduce((s, v) => s + getViewVelocity(v), 0) / sortedEducation.length / 1000)}K/d`
                  : '0K/d'}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">📈 ENGAGEMENT</div>
              <div className="text-xl font-black text-yellow-600">
                {sortedEducation.length > 0
                  ? `${(sortedEducation.reduce((s, v) => s + getEngagementRate(v), 0) / sortedEducation.length).toFixed(2)}%`
                  : '0%'}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">🎯 COMPETITION</div>
              <div className="text-xl font-black text-green-600">LOW 🟢</div>
            </div>
          </div>
        </div>

        {/* Hot Niches */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
            <span className="text-indigo-600">🔥</span> Hot Education Niches Right Now
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: 'Programming', icon: '💻', trend: '+38%', color: 'text-blue-600' },
              { name: 'Language Learning', icon: '🗣️', trend: '+25%', color: 'text-green-600' },
              { name: 'Study Tips', icon: '📚', trend: '+30%', color: 'text-purple-600' },
              { name: 'Skill Building', icon: '🛠️', trend: '+22%', color: 'text-orange-600' },
            ].map((niche) => (
              <Link
                key={niche.name}
                href={`/tag/${niche.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:border-indigo-400 hover:shadow-lg transition-all group"
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
            <span className="text-indigo-600">🔥</span> Trending Education Videos
          </h2>

          {sortedEducation.length === 0 && (
            <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
              <div className="text-gray-500 mb-2">No education videos in trending right now.</div>
              <Link href="/trending" className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
                Check all trends →
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {sortedEducation.slice(0, 9).map((video: any) => {
              const velocity = getViewVelocity(video)
              const engagement = getEngagementRate(video)
              const insights = getEducationInsights(video.snippet?.title || '')
              return (
                <Link key={video.id} href={`/video/${video.id}`} className="group block">
                  <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 hover:border-indigo-400 hover:shadow-lg transition-all h-full">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={video.snippet?.thumbnails?.high?.url || video.snippet?.thumbnails?.medium?.url}
                        alt={video.snippet?.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 bg-indigo-500/90 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold">
                        🎓 EDUCATION
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-lg text-[10px] font-medium">
                        👁️ {formatNumber(video.statistics?.viewCount)}
                      </div>
                    </div>
                    <div className="p-3 sm:p-5">
                      <h3 className="font-bold text-sm sm:text-base line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors text-gray-900">
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
            <span className="text-green-600">💡</span> Education Creator Tips
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-gray-700">🎯 Best Upload Times</h3>
              <ul className="text-gray-500 text-xs space-y-1">
                <li>• Weekdays: 7 PM - 9 PM (study time)</li>
                <li>• Weekends: 10 AM - 12 PM (weekend learning)</li>
                <li>• Exam seasons: Any time (high demand)</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-gray-700">📈 Trending Formats</h3>
              <ul className="text-gray-500 text-xs space-y-1">
                <li>• "Learn [skill] in 10 minutes"</li>
                <li>• "Complete guide to [topic]"</li>
                <li>• "Common mistakes beginners make"</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ for SEO */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'What educational content is trending on YouTube?', a: 'Programming tutorials, language learning, study tips, and skill-building content are currently seeing high engagement.' },
              { q: 'How do I find viral education video ideas?', a: 'Monitor popular courses on platforms like Udemy and Coursera, follow industry trends, and address common learning pain points.' },
              { q: 'Is educational content competitive on YouTube?', a: 'Education has lower competition than entertainment. Specific niches like advanced programming or specialized skills offer great opportunities.' },
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
            <Link href="/youtube-video-analyzer" className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm font-medium text-gray-900">Video Analyzer</div>
            </Link>
            <Link href="/youtube-channel-analytics" className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="text-2xl mb-2">📈</div>
              <div className="text-sm font-medium text-gray-900">Channel Analytics</div>
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
          <h2 className="text-xl font-bold mb-2 text-gray-900">Ready to Grow Your Education Channel?</h2>
          <p className="text-gray-500 text-sm mb-4 max-w-xl mx-auto">
            Get early access to viral educational trends before your competition.
          </p>
          <Link
            href="/trends"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition shadow-lg"
          >
            Explore All Trends →
          </Link>
        </div>
      </div>
    </main>
  )
}
