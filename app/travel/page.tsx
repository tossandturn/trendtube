import type { Metadata } from 'next'
import Link from 'next/link'
import { getViewVelocity, getEngagementRate } from '@/lib/analytics'
import { fetchTrendingVideos } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Travel YouTube Trends 2026 | Viral Travel Videos',
  description: 'Track the fastest-growing travel content on YouTube. Travel vlogs, destination guides, and adventure content with real-time creator intelligence.',
  keywords: ['travel trends', 'trip', 'destination', 'adventure', 'explore', 'youtube travel', 'travel vlog'],
}

function formatNumber(n: string | undefined) {
  const num = Number(n || 0)
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return num.toLocaleString()
}

function getTravelInsights(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('budget') || t.includes('cheap') || t.includes('affordable')) return 'Budget travel content serves cost-conscious travelers. Money-saving tips and hacks drive strong engagement.'
  if (t.includes('guide') || t.includes('tips') || t.includes('how to')) return 'Guide content provides practical value. Actionable advice helps travelers plan better trips.'
  if (t.includes('solo') || t.includes('alone')) return 'Solo travel content addresses safety and empowerment. Personal experiences inspire independent travelers.'
  if (t.includes('food') || t.includes('eat') || t.includes('local')) return 'Food-focused travel combines two popular niches. Culinary exploration adds cultural depth to travel content.'
  if (t.includes('hidden') || t.includes('secret') || t.includes('unknown')) return 'Hidden gem content offers exclusivity. Off-the-beaten-path destinations attract curious travelers.'
  if (t.includes('van') || t.includes('rv') || t.includes('road')) return 'Alternative travel content shows unique lifestyles. Van life and road trips inspire adventure seekers.'
  return 'Travel content succeeds with visual storytelling and authenticity. Unique perspectives on familiar destinations drive engagement.'
}

const TRAVEL_KEYWORDS = [
  'travel', 'trip', 'destination', 'adventure', 'explore', 'vacation',
  'journey', 'tour', 'backpack', 'hotel', 'flight', 'itinerary',
  'country', 'city', 'landmark', 'culture', 'experience', 'wander'
]

// Article Schema for SEO
function ArticleSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Travel YouTube Trends 2026',
    description: 'Discover the latest trends in YouTube travel content including sustainable travel, local exploration, adventure travel, and food culture journeys.',
    author: {
      '@type': 'Organization',
      'name': 'Tubefission'
    },
    datePublished: '2026-06-14',
    dateModified: '2026-06-14',
    articleSection: 'Travel',
    keywords: ['travel trends', 'youtube travel', 'travel vlog', 'sustainable travel', 'adventure travel']
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// FAQPage Schema
function FAQSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What travel content is trending on YouTube?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Budget travel, solo adventures, hidden gems, and food tourism are currently seeing high engagement across all regions. Sustainable travel and digital nomad content are also growing rapidly.'
        }
      },
      {
        '@type': 'Question',
        name: 'How do I grow my travel channel?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Focus on unique perspectives, provide practical guides, show authentic experiences, and create visually stunning content that inspires wanderlust. Consistency and storytelling are key.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is travel content competitive on YouTube?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Travel has medium competition. Specific niches like budget travel, off-beat destinations, and local experiences offer great opportunities for new creators.'
        }
      },
      {
        '@type': 'Question',
        name: 'Who is the target audience for travel content?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Travel content appeals to a broad audience, primarily ages 25-45, seeking inspiration, practical guides, and vicarious experiences. Digital nomads, adventure seekers, and food enthusiasts are key segments.'
        }
      },
      {
        '@type': 'Question',
        name: 'What content formats work best for travel?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Destination guides, travel vlogs, budget breakdowns, food tours, and adventure documentaries perform exceptionally well. Short-form content for platforms like YouTube Shorts is also gaining traction.'
        }
      },
      {
        '@type': 'Question',
        name: 'How competitive is the travel category?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The travel category has medium competition. While established creators dominate broad destinations, niche topics like sustainable travel, budget backpacking, and local hidden gems offer opportunities.'
        }
      },
      {
        '@type': 'Question',
        name: 'What are common mistakes in travel content?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Common mistakes include focusing only on visuals without storytelling, neglecting practical information, inconsistent posting schedules, ignoring SEO optimization, and failing to engage with the community.'
        }
      },
      {
        '@type': 'Question',
        name: 'How can I monetize travel content?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Monetization options include YouTube AdSense, brand partnerships with tourism boards and travel companies, affiliate marketing for hotels and gear, sponsored content, and selling travel guides or courses.'
        }
      }
    ]
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Breadcrumb Schema
function BreadcrumbSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://tubefission.com/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Travel',
        item: 'https://tubefission.com/travel'
      }
    ]
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export default async function TravelTrendsPage() {
  const region = await getRegion()
  const videos = await fetchTrendingVideos(region, 50)

  const travelVideos = videos.filter((v: any) => {
    const text = `${v.snippet?.title || ''} ${v.snippet?.description || ''}`.toLowerCase()
    return TRAVEL_KEYWORDS.some((k) => text.includes(k))
  })

  const sortedTravel = [...travelVideos].sort((a: any, b: any) => {
    const velA = getViewVelocity(a)
    const velB = getViewVelocity(b)
    return velB - velA
  })

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <ArticleSchema />
      <FAQSchema />
      <BreadcrumbSchema />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 sm:mb-8">
          <span className="text-lg">←</span>
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        {/* Hero */}
        <div className="mb-8 sm:mb-12">
          <div className="text-sky-600 text-xs font-bold tracking-[0.2em] uppercase mb-2">✈️ TRAVEL INTELLIGENCE</div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-gray-900">Travel Trends</h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl leading-relaxed mb-6">
            Track viral travel content before it peaks. Travel vlogs, destination guides, and adventure content with
            real-time velocity and competition analysis for travel creators.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">✈️ TRENDING</div>
              <div className="text-xl font-black text-gray-900">{sortedTravel.length}</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">⚡ AVG VELOCITY</div>
              <div className="text-xl font-black text-green-600">
                {sortedTravel.length > 0
                  ? `${Math.round(sortedTravel.reduce((s, v) => s + getViewVelocity(v), 0) / sortedTravel.length / 1000)}K/d`
                  : '0K/d'}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">📈 ENGAGEMENT</div>
              <div className="text-xl font-black text-yellow-600">
                {sortedTravel.length > 0
                  ? `${(sortedTravel.reduce((s, v) => s + getEngagementRate(v), 0) / sortedTravel.length).toFixed(2)}%`
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
            <span className="text-sky-600">🔥</span> Hot Travel Niches Right Now
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: 'Budget Travel', icon: '💰', trend: '+36%', color: 'text-sky-600' },
              { name: 'Solo Adventures', icon: '🎒', trend: '+29%', color: 'text-blue-600' },
              { name: 'Hidden Gems', icon: '💎', trend: '+32%', color: 'text-cyan-600' },
              { name: 'Food Tourism', icon: '🍜', trend: '+27%', color: 'text-teal-600' },
            ].map((niche) => (
              <Link
                key={niche.name}
                href={`/tag/${niche.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:border-sky-400 hover:shadow-lg transition-all group"
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

        {/* Editorial Content - YouTube Travel Trends 2026 */}
        <section className="mb-12 bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">YouTube Travel Content Trends Overview (2026)</h2>
          
          <div className="prose prose-sm max-w-none text-gray-600">
            <p className="mb-4 leading-relaxed">
              Travel content is one of the most visually captivating and aspiration-driven categories on YouTube. In 2026, 
              travel content has evolved from traditional destination showcases to diverse experience-sharing formats, including 
              adventure travel, cultural exploration, culinary journeys, sustainable travel, and digital nomad lifestyles. 
              Successful travel creators don't just showcase destinations—they convey the lifestyle and values of travel itself. 
              The travel category continues to attract millions of viewers worldwide, with average watch times exceeding 10-20 minutes, 
              well above the platform average. This extended engagement signals that travel audiences are deeply invested in the 
              content they consume, making it a highly attractive category for creators and brands alike.
            </p>

            <p className="mb-4 leading-relaxed">
              The YouTube travel ecosystem in 2026 is characterized by a shift from aspirational luxury content toward 
              accessible, authentic, and purpose-driven storytelling. Viewers are increasingly drawn to creators who 
              offer genuine perspectives rather than polished advertisements. This authenticity premium has created new 
              opportunities for micro and mid-tier creators who can establish trust and connection with niche audiences.
            </p>

            <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">2026 Travel Category Hot Topics Analysis</h3>
            
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-sky-50 rounded-xl p-4">
                <h4 className="font-bold text-sky-800 mb-2">🌱 Sustainable & Responsible Travel</h4>
                <p className="text-sm text-gray-600">
                  Eco-friendly travel, low-carbon transportation, and supporting local communities are gaining significant 
                  attention among conscious travelers.
                </p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-bold text-blue-800 mb-2">🏠 Local & Nearby Exploration</h4>
                <p className="text-sm text-gray-600">
                  Post-pandemic, local travel and nearby exploration continue trending. Discovering hidden gems close to home 
                  has become a new travel philosophy.
                </p>
              </div>
              <div className="bg-cyan-50 rounded-xl p-4">
                <h4 className="font-bold text-cyan-800 mb-2">🏔️ Adventure & Extreme Travel</h4>
                <p className="text-sm text-gray-600">
                  Extreme sports, wilderness expeditions, hiking, and mountaineering attract thrill-seeking audiences 
                  looking for adrenaline-pumping content.
                </p>
              </div>
              <div className="bg-teal-50 rounded-xl p-4">
                <h4 className="font-bold text-teal-800 mb-2">🍜 Food & Culture Journeys</h4>
                <p className="text-sm text-gray-600">
                  Travel content centered on food and cultural experiences satisfies viewers' sensory and cultural 
                  exploration desires. Street food tours, local market visits, and cooking-class experiences are among 
                  the fastest-growing sub-niches in this space.
                </p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <h4 className="font-bold text-purple-800 mb-2">💻 Digital Nomad Lifestyle</h4>
                <p className="text-sm text-gray-600">
                  The remote work revolution continues to fuel digital nomad content. Topics like co-working spaces, 
                  cost-of-living comparisons, visa guides, and work-life balance while traveling resonate with millions 
                  of professionals considering location-independent lifestyles.
                </p>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">Travel Category Key Performance Metrics</h3>
            
            <div className="overflow-x-auto mb-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">📊 Avg Views</div>
                  <div className="text-sky-600 font-bold text-sm">300K-1M</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">💬 Engagement</div>
                  <div className="text-green-600 font-bold text-sm">4.5%-7.0%</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">⏱️ Avg Watch</div>
                  <div className="text-blue-600 font-bold text-sm">10-20 min</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">🔄 Sub Conversion</div>
                  <div className="text-purple-600 font-bold text-sm">2.0%-3.5%</div>
                </div>
              </div>
            </div>
            <p className="mb-4 leading-relaxed">
              The travel category boasts engagement rates of 4.5%-7.0%, roughly double the platform average, while average 
              watch times of 10-20 minutes exceed the norm by 150%. These metrics indicate that travel viewers are among 
              the most engaged audiences on YouTube, spending significantly more time per video than most other categories. 
              Subscription conversion rates of 2.0%-3.5% further demonstrate the strong community-building potential of 
              travel content.
            </p>

            <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">Success Case Studies</h3>
            
            <div className="space-y-4 mb-6">
              <div className="border-l-4 border-sky-500 pl-4">
                <h4 className="font-bold text-gray-900">Kara and Nate</h4>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-semibold">Subscribers:</span> 3M+ | <span className="font-semibold">Strategy:</span> Global travel + budget-friendly + authentic experiences
                </p>
                <p className="text-sm text-gray-600">
                  Success factors: Genuine documentation, budget-conscious approach, consistent updates. 
                  Average views: 500K+, highly active travel community.
                </p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-bold text-gray-900">Yes Theory</h4>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-semibold">Subscribers:</span> 8M+ | <span className="font-semibold">Strategy:</span> Challenge-based travel + personal growth + high production
                </p>
                <p className="text-sm text-gray-600">
                  Success factors: Creative challenges, emotional resonance, premium production quality. 
                  Average views: 2M+, beloved by younger audiences.
                </p>
              </div>
              
              <div className="border-l-4 border-cyan-500 pl-4">
                <h4 className="font-bold text-gray-900">Drew Binsky</h4>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-semibold">Subscribers:</span> 5M+ | <span className="font-semibold">Strategy:</span> Country exploration + cultural immersion + fast-paced
                </p>
                <p className="text-sm text-gray-600">
                  Success factors: High output, cultural depth, charismatic personality. 
                  Average views: 500K+, visited every country in the world.
                </p>
              </div>
              
              <div className="border-l-4 border-teal-500 pl-4">
                <h4 className="font-bold text-gray-900">Lost LeBlanc</h4>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-semibold">Subscribers:</span> 2M+ | <span className="font-semibold">Strategy:</span> Cinematic travel + photography + storytelling
                </p>
                <p className="text-sm text-gray-600">
                  Success factors: Stunning visuals, professional cinematography, compelling narratives. 
                  Average views: 300K+, known for high-quality production.
                </p>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">Travel Category Content Strategy Recommendations</h3>
            
            <ul className="space-y-2 text-sm text-gray-600 mb-4">
              <li className="flex items-start gap-2">
                <span className="text-sky-600 font-bold">1.</span>
                <span><strong>Tell Travel Stories:</strong> The best travel content isn't just destination showcases—it's storytelling. Every destination has unique stories waiting to be discovered.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-600 font-bold">2.</span>
                <span><strong>Invest in Visual Presentation:</strong> Travel is visual content. Quality photography, drone footage, and color grading significantly enhance viewing experience.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-600 font-bold">3.</span>
                <span><strong>Provide Practical Information:</strong> Successful travel content offers real value—budget breakdowns, transportation guides, accommodation recommendations, and travel tips.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-600 font-bold">4.</span>
                <span><strong>Respect Local Culture:</strong> Travel content should respect local cultures and communities. Avoid stereotypes and showcase authentic local life.</span>
              </li>
            </ul>

            <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">How to Succeed in the Travel Category</h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">🎯 Find Your Travel Niche</h4>
                <p className="text-sm text-gray-600">
                  The travel category is vast. Choose a specific niche to dominate—whether it's budget travel, 
                  luxury travel, adventure travel, or cultural exploration.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">🔍 Optimize for SEO</h4>
                <p className="text-sm text-gray-600">
                  SEO is crucial for travel content. Destination names, "travel guide," and "things to do" 
                  keywords are primary sources of search traffic.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">📅 Build a Publishing Rhythm</h4>
                <p className="text-sm text-gray-600">
                  Travel content has long production cycles, but audiences expect consistent updates. 
                  Balance travel filming with content publishing schedules.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">💬 Engage Your Audience</h4>
                <p className="text-sm text-gray-600">
                  Travel viewers love sharing experiences and recommendations. Build connections through 
                  comments, community posts, and Q&A sessions.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 sm:col-span-2">
                <h4 className="font-bold text-gray-800 mb-2">💰 Diversify Revenue Streams</h4>
                <p className="text-sm text-gray-600">
                  Travel content's commercial value extends beyond ads. Brand partnerships, affiliate marketing, 
                  travel consulting, and photography sales are important revenue sources.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Videos */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
            <span className="text-sky-600">🔥</span> Trending Travel Videos
          </h2>

          {sortedTravel.length === 0 && (
            <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
              <div className="text-gray-500 mb-2">No travel videos in trending right now.</div>
              <Link href="/trending" className="text-sky-600 hover:text-sky-500 text-sm font-medium">
                Check all trends →
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {sortedTravel.slice(0, 9).map((video: any) => {
              const velocity = getViewVelocity(video)
              const engagement = getEngagementRate(video)
              const insights = getTravelInsights(video.snippet?.title || '')
              return (
                <Link key={video.id} href={`/video/${video.id}`} className="group block">
                  <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 hover:border-sky-400 hover:shadow-lg transition-all h-full">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={video.snippet?.thumbnails?.high?.url || video.snippet?.thumbnails?.medium?.url}
                        alt={video.snippet?.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 bg-sky-500/90 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold">
                        ✈️ TRAVEL
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-lg text-[10px] font-medium">
                        👁️ {formatNumber(video.statistics?.viewCount)}
                      </div>
                    </div>
                    <div className="p-3 sm:p-5">
                      <h3 className="font-bold text-sm sm:text-base line-clamp-2 mb-2 group-hover:text-sky-600 transition-colors text-gray-900">
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
            <span className="text-green-600">💡</span> Travel Creator Tips
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-gray-700">🎯 Best Upload Times</h3>
              <ul className="text-gray-500 text-xs space-y-1">
                <li>• Sunday evenings: 6 PM - 9 PM (trip planning time)</li>
                <li>• Wednesday: 12 PM - 3 PM (mid-week escape)</li>
                <li>• Holiday seasons: Peak travel planning periods</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-gray-700">📈 Trending Formats</h3>
              <ul className="text-gray-500 text-xs space-y-1">
                <li>• "[Destination] on a $50/day budget"</li>
                <li>• "Hidden gems in [popular city]"</li>
                <li>• "What nobody tells you about [place]"</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ - Extended to 8 questions */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { 
                q: 'What travel content is trending on YouTube?', 
                a: 'Budget travel, solo adventures, hidden gems, and food tourism are currently seeing high engagement across all regions. Sustainable travel and digital nomad content are also growing rapidly.' 
              },
              { 
                q: 'How do I grow my travel channel?', 
                a: 'Focus on unique perspectives, provide practical guides, show authentic experiences, and create visually stunning content that inspires wanderlust. Consistency and storytelling are key.' 
              },
              { 
                q: 'Is travel content competitive on YouTube?', 
                a: 'Travel has medium competition. Specific niches like budget travel, off-beat destinations, and local experiences offer great opportunities for new creators.' 
              },
              { 
                q: 'Who is the target audience for travel content?', 
                a: 'Travel content appeals to a broad audience, primarily ages 25-45, seeking inspiration, practical guides, and vicarious experiences. Digital nomads, adventure seekers, and food enthusiasts are key segments.' 
              },
              { 
                q: 'What content formats work best for travel?', 
                a: 'Destination guides, travel vlogs, budget breakdowns, food tours, and adventure documentaries perform exceptionally well. Short-form content for platforms like YouTube Shorts is also gaining traction.' 
              },
              { 
                q: 'How competitive is the travel category?', 
                a: 'The travel category has medium competition. While established creators dominate broad destinations, niche topics like sustainable travel, budget backpacking, and local hidden gems offer opportunities.' 
              },
              { 
                q: 'What are common mistakes in travel content?', 
                a: 'Common mistakes include focusing only on visuals without storytelling, neglecting practical information, inconsistent posting schedules, ignoring SEO optimization, and failing to engage with the community.' 
              },
              { 
                q: 'How can I monetize travel content?', 
                a: 'Monetization options include YouTube AdSense, brand partnerships with tourism boards and travel companies, affiliate marketing for hotels and gear, sponsored content, and selling travel guides or courses.' 
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="font-bold text-sm mb-1 text-gray-900">{item.q}</div>
                <div className="text-gray-500 text-xs leading-relaxed">{item.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Tools - With optimized internal links */}
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
          <h2 className="text-xl font-bold mb-2 text-gray-900">Ready to Grow Your Travel Channel?</h2>
          <p className="text-gray-500 text-sm mb-4 max-w-xl mx-auto">
            Get early access to viral travel trends before your competition.
          </p>
          <Link
            href="/trends"
            className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-xl font-bold text-sm hover:bg-sky-700 transition shadow-lg"
          >
            Explore All Trends →
          </Link>
        </div>
      </div>
    </main>
  )
}
