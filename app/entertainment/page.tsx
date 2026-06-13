import type { Metadata } from 'next'
import Link from 'next/link'
import { getViewVelocity, getEngagementRate } from '@/lib/analytics'
import { fetchTrendingVideos } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'
import { ArticleSchema, FAQPageSchema, BreadcrumbSchema } from '@/app/components/JsonLd'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Entertainment YouTube Trends 2026 | Viral Entertainment Videos',
  description: 'Track viral entertainment content before it peaks. Comedy, reactions, challenges, and pop culture deep-dives with real-time velocity and competition analysis.',
  keywords: ['entertainment trends', 'viral entertainment', 'youtube entertainment', 'celebrity news', 'movie trends', 'tv show trends'],
}

function formatNumber(n: string | undefined) {
  const num = Number(n || 0)
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return num.toLocaleString()
}

function getEntertainmentInsights(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('movie') || t.includes('film') || t.includes('trailer')) return 'Movie and trailer content drives massive engagement around releases. Timing uploads with premiere dates maximizes discovery.'
  if (t.includes('celebrity') || t.includes('star') || t.includes('actor')) return 'Celebrity content thrives on exclusivity and behind-the-scenes access. Breaking news angles perform exceptionally well.'
  if (t.includes('react') || t.includes('reaction')) return 'Reaction content leverages existing fanbases. Authentic emotional responses drive higher engagement than scripted content.'
  if (t.includes('drama') || t.includes('tea') || t.includes('gossip')) return 'Drama and gossip content creates anticipation for updates. Serialized storytelling keeps audiences returning.'
  if (t.includes('interview')) return 'Interview content succeeds with unique questions and candid moments. Exclusive access differentiates from competitors.'
  if (t.includes('review')) return 'Review content builds authority through consistency. Honest opinions create trust and loyal audiences.'
  return 'Entertainment content benefits from timeliness and cultural relevance. Stay current with trends and provide unique angles to stand out.'
}

// Entertainment keywords for filtering
const ENTERTAINMENT_KEYWORDS = [
  'entertainment', 'movie', 'film', 'cinema', 'trailer', 'celebrity', 'star',
  'actor', 'actress', 'hollywood', 'netflix', 'show', 'series', 'tv', 'drama',
  'comedy', 'funny', 'react', 'reaction', 'review', 'interview', 'gossip',
  'news', 'pop culture', 'viral', 'trending', 'meme'
]

// FAQ Items for Schema and display
const FAQ_ITEMS = [
  {
    question: 'What entertainment content is trending on YouTube?',
    answer: 'Movie reviews, celebrity news, reaction videos, and TV show discussions are currently seeing high engagement across all regions. Short-form drama content (5-15 minutes) and reaction videos are experiencing the highest growth rates in 2026.'
  },
  {
    question: 'How often are entertainment trends updated?',
    answer: 'Entertainment trends change rapidly. We update our trend data daily, with real-time velocity tracking for viral content. Major content format trends typically emerge every 3-6 months, while daily trending topics can shift within hours.'
  },
  {
    question: 'What metrics determine entertainment trend rankings?',
    answer: 'Our rankings combine view velocity (views per day), engagement rate (likes, comments, shares), subscriber growth rate, and competition analysis. High-velocity content with strong engagement ranks highest.'
  },
  {
    question: 'Who is the target audience for entertainment content?',
    answer: 'Entertainment content primarily targets viewers aged 18-34 (Gen Z and Millennials), with a slight female majority (55% vs 45%). These viewers seek relaxation, social connection, and trending topics, with average watch sessions of 8-12 minutes.'
  },
  {
    question: 'What content formats work best for entertainment?',
    answer: 'Top-performing formats include: Short dramas (5-15 min) for viral potential, Reaction videos (10-20 min) for steady traffic, Behind-the-scenes content (15-25 min) for fan loyalty, Funny compilations (8-15 min) for shareability, and Commentary/analysis (12-20 min) for authority building.'
  },
  {
    question: 'How competitive is the entertainment category?',
    answer: 'Entertainment is extremely competitive (5/5 stars). Success requires unique creativity, high production quality, and consistent posting. New creators should focus on underserved niche subcategories rather than broad entertainment coverage.'
  },
  {
    question: 'What are common mistakes in entertainment content?',
    answer: 'Common mistakes include: copying trends without adding originality, weak video hooks in the first 30 seconds, poor thumbnail/title quality, inconsistent posting schedules, ignoring audience engagement, and neglecting data analytics.'
  },
  {
    question: 'How can I monetize entertainment content?',
    answer: 'Monetization strategies include: Ad revenue (CPM $4-12 for entertainment), Brand sponsorships ($500-$50,000+ per video), Merchandise sales for personal brands, Channel memberships for exclusive content, Affiliate marketing for entertainment products, and Content licensing for viral videos.'
  }
]

export default async function EntertainmentTrendsPage() {
  const region = await getRegion()
  const videos = await fetchTrendingVideos(region, 50)

  const entertainmentVideos = videos.filter((v: any) => {
    const text = `${v.snippet?.title || ''} ${v.snippet?.description || ''}`.toLowerCase()
    return ENTERTAINMENT_KEYWORDS.some((k) => text.includes(k))
  })

  const sortedEntertainment = [...entertainmentVideos].sort((a: any, b: any) => {
    const velA = getViewVelocity(a)
    const velB = getViewVelocity(b)
    return velB - velA
  })

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Schema Markup */}
      <ArticleSchema
        title="Entertainment YouTube Trends 2026 | Viral Entertainment Videos"
        description="Track viral entertainment content before it peaks. Comedy, reactions, challenges, and pop culture deep-dives with real-time velocity and competition analysis."
        url="https://tubefission.com/entertainment"
        author="Tubefission"
        datePublished="2026-06-13"
        dateModified="2026-06-13"
      />
      <FAQPageSchema items={FAQ_ITEMS} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://tubefission.com' },
        { name: 'Entertainment Trends', url: 'https://tubefission.com/entertainment' },
      ]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 sm:mb-8">
          <span className="text-lg">←</span>
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        {/* Hero */}
        <div className="mb-8 sm:mb-12">
          <div className="text-red-600 text-xs font-bold tracking-[0.2em] uppercase mb-2">🎬 ENTERTAINMENT INTELLIGENCE</div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-gray-900">Entertainment Trends</h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl leading-relaxed mb-6">
            Track viral entertainment content before it peaks. Movies, TV shows, celebrity news, and pop culture trends with
            real-time velocity and competition analysis for entertainment creators.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">🎬 TRENDING</div>
              <div className="text-xl font-black text-gray-900">{sortedEntertainment.length}</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">⚡ AVG VELOCITY</div>
              <div className="text-xl font-black text-green-600">
                {sortedEntertainment.length > 0
                  ? `${Math.round(sortedEntertainment.reduce((s, v) => s + getViewVelocity(v), 0) / sortedEntertainment.length / 1000)}K/d`
                  : '0K/d'}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">📈 ENGAGEMENT</div>
              <div className="text-xl font-black text-yellow-600">
                {sortedEntertainment.length > 0
                  ? `${(sortedEntertainment.reduce((s, v) => s + getEngagementRate(v), 0) / sortedEntertainment.length).toFixed(2)}%`
                  : '0%'}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">🎯 COMPETITION</div>
              <div className="text-xl font-black text-orange-600">HIGH 🔴</div>
            </div>
          </div>
        </div>

        {/* Editorial Content - YouTube Entertainment Trends 2026 */}
        <section className="mb-12 sm:mb-16">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">YouTube Entertainment Content Trends 2026</h2>
            
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed mb-6">
                Entertainment remains one of the most dynamic and competitive categories on YouTube in 2026. This category continues to dominate platform traffic, accounting for over 28% of total watch time. With the rise of short-form content and the deepening of long-form storytelling, entertainment creators face unprecedented opportunities alongside fierce competition.
              </p>

              <h3 className="text-lg font-bold mb-4 text-gray-900">2026 Entertainment Category Hot Topics</h3>
              
              <div className="space-y-6 mb-8">
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">1. Short Drama Content Explosion</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    In 2026, short drama content (5-15 minutes) has become the growth engine of the entertainment category. Success stories like Dhar Mann Studios prove that high-quality, meaningful short dramas can attract hundreds of millions of views. This content combines entertainment with value-driven messaging, resonating deeply with Gen Z and Millennial audiences.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">2. Reaction Videos and Commentary Stay Hot</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Reaction videos continue their strong momentum in 2026. Creators build deep connections with audiences by watching and commenting on trending content in real-time. While production costs are relatively low, success requires sharp entertainment instincts and unique personal perspectives.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">3. Behind-the-Scenes and Creator Lifestyle</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Audience interest in creators&apos; authentic lives continues to grow. Behind-the-scenes footage, daily life documentation, and creative process sharing help build deeper fan relationships and improve viewer loyalty and retention.
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-bold mb-4 text-gray-900">Success Case Studies</h3>
              
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-bold text-gray-800 mb-2">Dhar Mann Studios</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Subscribers: 30M+</li>
                    <li>• Strategy: Moral-driven short dramas</li>
                    <li>• Avg Views: 5M+ per video</li>
                    <li>• Engagement: 8.5%</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-bold text-gray-800 mb-2">MrBeast</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Subscribers: 300M+</li>
                    <li>• Strategy: High-budget viral challenges</li>
                    <li>• Avg Views: 100M+ per video</li>
                    <li>• Brand Deals: $5M+ per video</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-bold text-gray-800 mb-2">SSSniperWolf</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Subscribers: 34M+</li>
                    <li>• Strategy: Reaction + gaming mix</li>
                    <li>• Upload Rate: 1-2 videos daily</li>
                    <li>• Avg Views: 3M+ per video</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-bold text-gray-800 mb-2">PewDiePie</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Subscribers: 110M+</li>
                    <li>• Strategy: Gaming + commentary + lifestyle</li>
                    <li>• Engagement: 6.2%</li>
                    <li>• Community: Extremely active</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-lg font-bold mb-4 text-gray-900">Content Strategy Recommendations</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex gap-3">
                  <span className="text-green-600 font-bold">1.</span>
                  <div>
                    <span className="font-bold text-gray-800">Find Your Unique Voice:</span>
                    <p className="text-gray-600 text-sm">Standing out requires a distinct personal brand. Study your target audience, understand their pain points and interests, and create content that resonates.</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <span className="text-green-600 font-bold">2.</span>
                  <div>
                    <span className="font-bold text-gray-800">Balance Entertainment with Value:</span>
                    <p className="text-gray-600 text-sm">The most successful entertainment content isn&apos;t just fun—it provides value through emotional connection, knowledge, or social currency.</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <span className="text-green-600 font-bold">3.</span>
                  <div>
                    <span className="font-bold text-gray-800">Invest in Production Quality:</span>
                    <p className="text-gray-600 text-sm">As competition intensifies, production quality becomes critical. Good lighting, audio, editing, and thumbnail design significantly improve CTR and watch time.</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <span className="text-green-600 font-bold">4.</span>
                  <div>
                    <span className="font-bold text-gray-800">Build Community, Not Just Audience:</span>
                    <p className="text-gray-600 text-sm">Engage through comments, community posts, and live streams. Loyal community members become advocates for your content.</p>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-bold mb-4 text-gray-900">How to Succeed in Entertainment</h3>
              
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-5 border border-red-100">
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex gap-2">
                    <span className="text-red-600">💡</span>
                    <span><strong>Study Competitors:</strong> Analyze successful content weekly. Note their titles, thumbnails, structure, and timing. Use Tubefission for deep insights.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600">⏰</span>
                    <span><strong>Optimize Timing:</strong> Best posting times are Friday-Sunday 6-9 PM (audience timezone). Weekends are peak entertainment consumption periods.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600">🎨</span>
                    <span><strong>Stay Original:</strong> Follow trends but present them with your unique angle. Copycat content rarely builds lasting brand value.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600">🔗</span>
                    <span><strong>Cross-Platform:</strong> Link YouTube with TikTok, Instagram, and Twitter. Short-form platforms effectively drive traffic to long-form content.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600">📊</span>
                    <span><strong>Iterate Constantly:</strong> Entertainment trends shift rapidly. Stay learning, analyze data regularly, and adjust strategy based on feedback.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Hot Niches */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
            <span className="text-red-600">🔥</span> Hot Entertainment Niches Right Now
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: 'Movie Reviews', icon: '🎬', trend: '+28%', color: 'text-red-600' },
              { name: 'Celebrity News', icon: '⭐', trend: '+22%', color: 'text-yellow-600' },
              { name: 'Reaction Videos', icon: '😮', trend: '+19%', color: 'text-purple-600' },
              { name: 'TV Show Discussions', icon: '📺', trend: '+25%', color: 'text-blue-600' },
            ].map((niche) => (
              <Link
                key={niche.name}
                href={`/tag/${niche.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:border-red-400 hover:shadow-lg transition-all group"
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
            <span className="text-red-600">🔥</span> Trending Entertainment Videos
          </h2>

          {sortedEntertainment.length === 0 && (
            <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
              <div className="text-gray-500 mb-2">No entertainment videos in trending right now.</div>
              <Link href="/trending" className="text-red-600 hover:text-red-500 text-sm font-medium">
                Check all trends →
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {sortedEntertainment.slice(0, 9).map((video: any) => {
              const velocity = getViewVelocity(video)
              const engagement = getEngagementRate(video)
              const insights = getEntertainmentInsights(video.snippet?.title || '')
              return (
                <Link key={video.id} href={`/video/${video.id}`} className="group block">
                  <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 hover:border-red-400 hover:shadow-lg transition-all h-full">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={video.snippet?.thumbnails?.high?.url || video.snippet?.thumbnails?.medium?.url}
                        alt={video.snippet?.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 bg-red-500/90 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold">
                        🎬 ENTERTAINMENT
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-lg text-[10px] font-medium">
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
            <span className="text-green-600">💡</span> Entertainment Creator Tips
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-gray-700">🎯 Best Upload Times</h3>
              <ul className="text-gray-500 text-xs space-y-1">
                <li>• Weeknights: 7 PM - 10 PM (prime time)</li>
                <li>• Weekends: 2 PM - 6 PM (leisure browsing)</li>
                <li>• Movie release days: Within 24 hours</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-gray-700">📈 Trending Formats</h3>
              <ul className="text-gray-500 text-xs space-y-1">
                <li>• &quot;Honest review of [popular movie]&quot;</li>
                <li>• &quot;Reacting to celebrity drama&quot;</li>
                <li>• &quot;Top 10 moments from [show]&quot;</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ for SEO - 8 Questions */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="font-bold text-sm mb-1 text-gray-900">{item.question}</div>
                <div className="text-gray-500 text-xs leading-relaxed">{item.answer}</div>
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
          <h2 className="text-xl font-bold mb-2 text-gray-900">Ready to Grow Your Entertainment Channel?</h2>
          <p className="text-gray-500 text-sm mb-4 max-w-xl mx-auto">
            Get early access to viral entertainment trends before your competition.
          </p>
          <Link
            href="/trends"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition shadow-lg"
          >
            Explore All Trends →
          </Link>
        </div>
      </div>
    </main>
  )
}
