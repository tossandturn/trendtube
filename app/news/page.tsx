import type { Metadata } from 'next'
import Link from 'next/link'
import { getViewVelocity, getEngagementRate } from '@/lib/analytics'
import { fetchTrendingVideos } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'
import { ArticleSchema, FAQPageSchema, BreadcrumbSchema } from '@/app/components/JsonLd'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'News YouTube Trends 2026 | Viral News Videos',
  description: 'Track the fastest-growing news content on YouTube. Breaking news, current events, and journalism with real-time creator intelligence.',
  keywords: ['news trends', 'breaking', 'current', 'events', 'journalism', 'youtube news', 'current affairs'],
}

function formatNumber(n: string | undefined) {
  const num = Number(n || 0)
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return num.toLocaleString()
}

function getNewsInsights(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('breaking') || t.includes('urgent') || t.includes('just')) return 'Breaking news satisfies immediate information needs. Timeliness is critical for news content success.'
  if (t.includes('explain') || t.includes('what') || t.includes('how')) return 'Explainer content provides context. Helping viewers understand complex events drives loyalty.'
  if (t.includes('update') || t.includes('develop')) return 'Update content keeps audiences informed. Ongoing coverage of evolving stories creates returning viewers.'
  if (t.includes('analysis') || t.includes('deep')) return 'Analysis content offers unique perspectives. Going beyond headlines differentiates from mainstream sources.'
  if (t.includes('exclusive') || t.includes('inside')) return 'Exclusive content provides unique value. Information unavailable elsewhere drives subscriptions.'
  if (t.includes('reaction') || t.includes('response')) return 'Reaction content captures immediate sentiment. First impressions on major events drive engagement.'
  return 'News content succeeds with speed and credibility. Trustworthy reporting builds loyal audiences.'
}

const NEWS_KEYWORDS = [
  'news', 'breaking', 'current', 'events', 'journalism', 'report',
  'update', 'latest', 'today', 'world', 'politics', 'economy',
  'headline', 'story', 'coverage', 'announcement', 'developing'
]

export default async function NewsTrendsPage() {
  const region = await getRegion()
  const videos = await fetchTrendingVideos(region, 50)

  const newsVideos = videos.filter((v: any) => {
    const text = `${v.snippet?.title || ''} ${v.snippet?.description || ''}`.toLowerCase()
    return NEWS_KEYWORDS.some((k) => text.includes(k))
  })

  const sortedNews = [...newsVideos].sort((a: any, b: any) => {
    const velA = getViewVelocity(a)
    const velB = getViewVelocity(b)
    return velB - velA
  })

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://tubefission.com' },
          { name: 'News', url: 'https://tubefission.com/news' },
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 sm:mb-8">
          <span className="text-lg">←</span>
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        {/* Hero */}
        <div className="mb-8 sm:mb-12">
          <div className="text-cyan-600 text-xs font-bold tracking-[0.2em] uppercase mb-2">📰 NEWS INTELLIGENCE</div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-gray-900">News Trends</h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl leading-relaxed mb-6">
            Track viral news content before it peaks. Breaking news, current events, and journalism with
            real-time velocity and competition analysis for news creators.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">📰 TRENDING</div>
              <div className="text-xl font-black text-gray-900">{sortedNews.length}</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">⚡ AVG VELOCITY</div>
              <div className="text-xl font-black text-green-600">
                {sortedNews.length > 0
                  ? `${Math.round(sortedNews.reduce((s, v) => s + getViewVelocity(v), 0) / sortedNews.length / 1000)}K/d`
                  : '0K/d'}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">📈 ENGAGEMENT</div>
              <div className="text-xl font-black text-yellow-600">
                {sortedNews.length > 0
                  ? `${(sortedNews.reduce((s, v) => s + getEngagementRate(v), 0) / sortedNews.length).toFixed(2)}%`
                  : '0%'}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">🎯 COMPETITION</div>
              <div className="text-xl font-black text-red-600">HIGH 🔴</div>
            </div>
          </div>
        </div>

        {/* Hot Niches */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
            <span className="text-cyan-600">🔥</span> Hot News Niches Right Now
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: 'Breaking News', icon: '🚨', trend: '+42%', color: 'text-cyan-600' },
              { name: 'Explainers', icon: '💡', trend: '+35%', color: 'text-blue-600' },
              { name: 'Deep Analysis', icon: '🔍', trend: '+31%', color: 'text-indigo-600' },
              { name: 'Daily Updates', icon: '📅', trend: '+28%', color: 'text-sky-600' },
            ].map((niche) => (
              <Link
                key={niche.name}
                href={`/tag/${niche.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:border-cyan-400 hover:shadow-lg transition-all group"
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
            <span className="text-cyan-600">🔥</span> Trending News Videos
          </h2>

          {sortedNews.length === 0 && (
            <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
              <div className="text-gray-500 mb-2">No news videos in trending right now.</div>
              <Link href="/trending" className="text-cyan-600 hover:text-cyan-500 text-sm font-medium">
                Check all trends →
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {sortedNews.slice(0, 9).map((video: any) => {
              const velocity = getViewVelocity(video)
              const engagement = getEngagementRate(video)
              const insights = getNewsInsights(video.snippet?.title || '')
              return (
                <Link key={video.id} href={`/video/${video.id}`} className="group block">
                  <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 hover:border-cyan-400 hover:shadow-lg transition-all h-full">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={video.snippet?.thumbnails?.high?.url || video.snippet?.thumbnails?.medium?.url}
                        alt={video.snippet?.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 bg-cyan-500/90 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold">
                        📰 NEWS
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-lg text-[10px] font-medium">
                        👁️ {formatNumber(video.statistics?.viewCount)}
                      </div>
                    </div>
                    <div className="p-3 sm:p-5">
                      <h3 className="font-bold text-sm sm:text-base line-clamp-2 mb-2 group-hover:text-cyan-600 transition-colors text-gray-900">
                        {video.snippet?.title}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-500 text-xs mb-3">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-[10px] font-bold text-gray-700">
                          {video.snippet?.channelTitle?.[0]}
                        </div>
                        <span className="truncate">{video.snippet?.channelTitle}</span>
                      </div>

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
            <span className="text-green-600">💡</span> News Creator Tips
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-gray-700">🎯 Best Upload Times</h3>
              <ul className="text-gray-500 text-xs space-y-1">
                <li>• Breaking news: Immediate (within minutes)</li>
                <li>• Morning briefings: 7 AM - 9 AM</li>
                <li>• Evening summaries: 6 PM - 8 PM</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-gray-700">📈 Trending Formats</h3>
              <ul className="text-gray-500 text-xs space-y-1">
                <li>• "Breaking: [event] just happened"</li>
                <li>• "What you need to know about [topic]"</li>
                <li>• "The real story behind [headline]"</li>
              </ul>
            </div>
          </div>
        </div>

    {/* Editorial Content */}
    <div className="mb-8 sm:mb-12">
      <h2 className="text-lg font-bold mb-4 text-gray-900">YouTube News Content Trends Overview (2026)</h2>
      <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed space-y-4">
        <p>
          News is one of the most time-sensitive and socially impactful categories on YouTube. In 2026, news content has evolved from traditional broadcasts into diverse forms including in-depth analysis, explanatory journalism, opinion commentary, and live coverage. Successful news creators don't just deliver information — they offer unique perspectives and deep analysis that go beyond the headlines.
        </p>

        <h3 className="text-base font-bold text-gray-900 mt-6">Top News Category Topics in 2026</h3>

        <p>
          <strong>1. Politics & Current Affairs</strong> — Political news, current affairs analysis, and policy interpretation continue to attract significant viewer attention, especially during elections and major policy shifts. Creators who can break down complex political developments into accessible content see consistent growth.
        </p>
        <p>
          <strong>2. Technology & Innovation</strong> — Tech news, innovation updates, and industry trends cater to an audience hungry for insights on AI, cybersecurity, space exploration, and emerging technologies. Channels that explain tech developments in relatable terms are thriving.
        </p>
        <p>
          <strong>3. Business & Economics</strong> — Business news, economic analysis, and market trends attract a high-value audience. These viewers tend to be more engaged and are often decision-makers, making this niche particularly valuable for monetization.
        </p>
        <p>
          <strong>4. Society & Culture</strong> — Social issues, cultural phenomena, and lifestyle topics reflect evolving societal changes. Content that addresses viewers' concerns with empathy and insight builds lasting communities.
        </p>
        <p>
          <strong>5. International News</strong> — Global affairs, international developments, and cross-cultural content satisfy viewers' growing appetite for a global perspective. Channels that bring international stories to domestic audiences are filling a significant gap.
        </p>

        <h3 className="text-base font-bold text-gray-900 mt-6">Success Case Studies</h3>

        <p>
          <strong>Philip DeFranco</strong> — Over 6 million subscribers. Content strategy: news analysis + deep commentary + personal perspective. Key to success: analytical depth combined with authentic personal voice and strong community building. Average views exceed 1 million per video, setting the benchmark for independent news commentary.
        </p>
        <p>
          <strong>Vox</strong> — Over 12 million subscribers. Content strategy: in-depth reporting + visual storytelling + explanatory journalism. Key to success: high production value combined with genuinely informative content and distinctive visual presentation. Average views exceed 1 million, representing the gold standard for explanatory news.
        </p>
        <p>
          <strong>CNN</strong> — Over 14 million subscribers. Content strategy: news reporting + live broadcasts + diverse coverage. Key to success: news authority, real-time coverage capability, and established brand credibility. Average views exceed 200K, demonstrating traditional media's continued relevance on YouTube.
        </p>
        <p>
          <strong>Johnny Harris</strong> — Over 5 million subscribers. Content strategy: international news + map visualizations + deep analysis. Key to success: stunning visual presentation combined with global perspective and analytical depth. Average views exceed 2 million, proving that international stories can achieve massive reach with the right approach.
        </p>

        <h3 className="text-base font-bold text-gray-900 mt-6">Content Strategy Recommendations</h3>

        <p>
          <strong>1. Maintain Timeliness</strong> — Respond quickly to breaking news events. Publish related content during trending periods to maximize visibility. Speed is the currency of news content on YouTube.
        </p>
        <p>
          <strong>2. Provide Unique Perspectives</strong> — Go beyond surface-level reporting. Offer deep analysis, background context, and personal viewpoints that viewers can't find elsewhere. Your unique angle is your competitive advantage.
        </p>
        <p>
          <strong>3. Maintain Objectivity</strong> — Clearly distinguish between facts and opinions. Provide balanced reporting that presents multiple viewpoints. Audiences trust creators who are transparent about their perspective.
        </p>
        <p>
          <strong>4. Cite Reliable Sources</strong> — Always reference your information sources, data origins, and expert quotes. Source attribution builds credibility and helps viewers verify information independently.
        </p>

        <h3 className="text-base font-bold text-gray-900 mt-6">How to Succeed in the News Category</h3>

        <p>
          <strong>1. Find Your News Niche</strong> — Specialize in a specific area of news rather than trying to cover everything. Deep expertise in one area builds authority faster than broad but shallow coverage. Use our <Link href="/youtube-video-analyzer" className="text-cyan-600 hover:text-cyan-500 font-medium">Video Analyzer</Link> to study what's working in your niche.
        </p>
        <p>
          <strong>2. Optimize for SEO</strong> — Leverage trending news keywords, event names, and current phrases that people are actively searching for. Our <Link href="/youtube-channel-analytics" className="text-cyan-600 hover:text-cyan-500 font-medium">Channel Analytics</Link> tool helps you track keyword performance over time.
        </p>
        <p>
          <strong>3. Utilize Live Streaming</strong> — Cover major events live and provide real-time commentary. Live content creates urgency and attracts viewers who want immediate information. It also strengthens your connection with the audience.
        </p>
        <p>
          <strong>4. Build a Community</strong> — Engage through comments, community posts, and live interactions. A loyal community not only watches consistently but also amplifies your content through shares and recommendations.
        </p>
        <p>
          <strong>5. Diversify Revenue</strong> — Explore membership subscriptions, brand partnerships, and consulting services. News creators with loyal audiences have strong monetization potential beyond ad revenue. Check our <Link href="/trends" className="text-cyan-600 hover:text-cyan-500 font-medium">Trends Database</Link> to identify emerging monetization opportunities.
        </p>
      </div>
    </div>

    <ArticleSchema
      title="News YouTube Trends 2026 | Viral News Videos"
      description="Track the fastest-growing news content on YouTube. Breaking news, current events, and journalism with real-time creator intelligence."
      url="https://tubefission.com/news"
      datePublished="2026-01-15"
      dateModified="2026-06-14"
    />

    {/* FAQ */}
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-4 text-gray-900">Frequently Asked Questions</h2>
      <FAQPageSchema
        items={[
          { question: 'What news content is trending on YouTube?', answer: 'Breaking news, explainers, deep analysis, and daily updates are currently seeing high engagement across all regions.' },
          { question: 'How do I succeed with news content?', answer: 'Prioritize speed and accuracy, provide unique context, build credibility through consistent reporting, and explain complex events simply.' },
          { question: 'Is news content competitive on YouTube?', answer: 'News is highly competitive. Speed, credibility, and unique perspectives are essential to stand out.' },
          { question: 'What are the best news SEO techniques?', answer: 'Timeliness is the key to news SEO. Report on trending events promptly, use event-related keywords, and optimize your titles and descriptions. Use Tubefission\'s news SEO tools to analyze keyword competition.' },
          { question: 'How can news creators maintain objectivity?', answer: 'Clearly distinguish between facts and opinions, provide multiple perspectives, cite reliable sources, and avoid bias. In your videos, explicitly indicate which parts are factual reporting and which are personal viewpoints.' },
          { question: 'How should news content handle information overload?', answer: 'In an era of information overload, unique perspective is where news content delivers value. Provide in-depth analysis, background context, and exclusive reporting to help viewers understand the stories behind the headlines.' },
          { question: 'How often should I upload news content?', answer: 'For breaking news, publish as quickly as possible. For analysis and explainers, aim for consistency — at least 2-3 times per week. A regular schedule builds audience habits and improves YouTube algorithm recommendations.' },
          { question: 'Can I use AI tools for news content creation?', answer: 'Yes, AI tools can help with research, script writing, and trend analysis. Our AI Assistant can help you draft news scripts and identify trending topics. However, always verify facts and add your unique editorial perspective.' },
        ]}
      />
      <div className="space-y-3">
        {[
          { q: 'What news content is trending on YouTube?', a: 'Breaking news, explainers, deep analysis, and daily updates are currently seeing high engagement across all regions.' },
          { q: 'How do I succeed with news content?', a: 'Prioritize speed and accuracy, provide unique context, build credibility through consistent reporting, and explain complex events simply.' },
          { q: 'Is news content competitive on YouTube?', a: 'News is highly competitive. Speed, credibility, and unique perspectives are essential to stand out.' },
          { q: 'What are the best news SEO techniques?', a: 'Timeliness is the key to news SEO. Report on trending events promptly, use event-related keywords, and optimize your titles and descriptions. Use Tubefission\'s news SEO tools to analyze keyword competition.' },
          { q: 'How can news creators maintain objectivity?', a: 'Clearly distinguish between facts and opinions, provide multiple perspectives, cite reliable sources, and avoid bias. In your videos, explicitly indicate which parts are factual reporting and which are personal viewpoints.' },
          { q: 'How should news content handle information overload?', a: 'In an era of information overload, unique perspective is where news content delivers value. Provide in-depth analysis, background context, and exclusive reporting to help viewers understand the stories behind the headlines.' },
          { q: 'How often should I upload news content?', a: 'For breaking news, publish as quickly as possible. For analysis and explainers, aim for consistency — at least 2-3 times per week. A regular schedule builds audience habits and improves YouTube algorithm recommendations.' },
          { q: 'Can I use AI tools for news content creation?', a: 'Yes, AI tools can help with research, script writing, and trend analysis. Our AI Assistant can help you draft news scripts and identify trending topics. However, always verify facts and add your unique editorial perspective.' },
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
          <h2 className="text-xl font-bold mb-2 text-gray-900">Ready to Grow Your News Channel?</h2>
          <p className="text-gray-500 text-sm mb-4 max-w-xl mx-auto">
            Get early access to viral news trends before your competition.
          </p>
          <Link
            href="/trends"
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-xl font-bold text-sm hover:bg-cyan-700 transition shadow-lg"
          >
            Explore All Trends →
          </Link>
        </div>
      </div>
    </main>
  )
}
