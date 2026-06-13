import type { Metadata } from 'next'
import Link from 'next/link'
import { getViewVelocity, getEngagementRate } from '@/lib/analytics'
import { fetchTrendingVideos } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'DIY YouTube Trends 2026 | Viral DIY Videos',
  description: 'Track the fastest-growing DIY content on YouTube. Do-it-yourself projects, crafts, and creative builds with real-time creator intelligence.',
  keywords: ['diy trends', 'craft', 'handmade', 'project', 'creative', 'youtube diy', 'do it yourself', 'upcycle', 'home improvement', 'tutorial'],
}

function formatNumber(n: string | undefined) {
  const num = Number(n || 0)
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return num.toLocaleString()
}

function getDIYInsights(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('easy') || t.includes('simple') || t.includes('beginner')) return 'Easy DIY removes intimidation barriers. Simple projects with clear instructions attract first-time crafters.'
  if (t.includes('cheap') || t.includes('dollar') || t.includes('budget')) return 'Budget DIY serves cost-conscious creators. Low-cost projects with impressive results drive engagement.'
  if (t.includes('room') || t.includes('decor') || t.includes('home')) return 'Home decor DIY offers tangible transformation. Before/after reveals create satisfying viewing experiences.'
  if (t.includes('gift') || t.includes('present')) return 'Gift DIY content is seasonally evergreen. Handmade presents add personal value to special occasions.'
  if (t.includes('upcycle') || t.includes('recycle') || t.includes('thrift')) return 'Sustainable DIY aligns with values. Transforming old items into new treasures creates compelling narratives.'
  if (t.includes('organization') || t.includes('storage') || t.includes('clean')) return 'Organization DIY solves real problems. Practical solutions with visual results satisfy viewers.'
  if (t.includes('wood') || t.includes('furniture') || t.includes('build')) return 'Woodworking and furniture DIY showcases craftsmanship. Detailed build processes attract dedicated maker audiences.'
  if (t.includes('repair') || t.includes('fix') || t.includes('restore')) return 'Repair content provides immense practical value. Money-saving fixes create strong viewer loyalty and repeat viewership.'
  return 'DIY content succeeds with clear instructions and satisfying results. Transformation moments drive shareability.'
}

const DIY_KEYWORDS = [
  'diy', 'craft', 'handmade', 'project', 'creative', 'make', 'build',
  'create', 'homemade', 'tutorial', 'how to make', 'do it yourself',
  'upcycle', 'repurpose', 'renovation', 'decor', 'furniture', 'art',
  'wood', 'paint', 'sew', 'knit', 'crochet', 'repair', 'restore',
  'dollar store', 'budget', 'organization', 'decor'
]

// Schema Markup Components
function ArticleSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'DIY YouTube Trends 2026 | Viral DIY Videos',
    description: 'Track the fastest-growing DIY content on YouTube. Do-it-yourself projects, crafts, and creative builds with real-time creator intelligence.',
    author: {
      '@type': 'Organization',
      name: 'Tubefission'
    },
    datePublished: '2026-06-14',
    dateModified: '2026-06-14',
    articleSection: 'DIY',
    publisher: {
      '@type': 'Organization',
      name: 'Tubefission',
      url: 'https://tubefission.com'
    }
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

function FAQPageSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What DIY content is trending on YouTube?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Home decor, dollar store DIY, upcycling, and organization projects are currently seeing high engagement across all regions.'
        }
      },
      {
        '@type': 'Question',
        name: 'How do I make my DIY videos popular?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Focus on clear step-by-step instructions, show before/after transformations, use affordable materials, and create satisfying reveal moments.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is DIY content competitive on YouTube?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'DIY has medium competition. Unique project ideas, budget-friendly approaches, and creative upcycling offer opportunities for new creators to stand out.'
        }
      },
      {
        '@type': 'Question',
        name: 'Who is the target audience for DIY content?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'DIY audiences span ages 25-45, with women comprising about 55% of viewers. Core audiences are in the US, UK, Canada, and Australia, seeking practical tips, creative inspiration, and the satisfaction of creating something with their own hands.'
        }
      },
      {
        '@type': 'Question',
        name: 'What content formats work best for DIY?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Project tutorials (10-20 min), makeover processes (15-30 min), quick tips (5-10 min), material introductions (8-12 min), tool reviews (10-15 min), and Shorts for quick previews (15-60 sec) perform best.'
        }
      },
      {
        '@type': 'Question',
        name: 'How competitive is the DIY category?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The DIY category has medium competition (3/5 stars). Success requires niche specialization, detailed step-by-step instruction, and building a community of fellow makers who share your creative vision.'
        }
      },
      {
        '@type': 'Question',
        name: 'What are common mistakes in DIY content?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Common mistakes include insufficient step-by-step detail, neglecting safety precautions, poor lighting that hides details, failing to provide material lists and costs, ignoring audience interaction, inconsistent upload schedules, and making projects too complex for beginners.'
        }
      },
      {
        '@type': 'Question',
        name: 'How can I monetize DIY content?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Monetization options include ad revenue ($4-10 CPM), brand partnerships with tool and material companies, affiliate marketing for recommended supplies, course sales, membership subscriptions for exclusive projects, and selling DIY tool kits and material bundles.'
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
        name: 'DIY',
        item: 'https://tubefission.com/diy'
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

export default async function DIYTrendsPage() {
  const region = await getRegion()
  const videos = await fetchTrendingVideos(region, 50)

  const diyVideos = videos.filter((v: any) => {
    const text = `${v.snippet?.title || ''} ${v.snippet?.description || ''}`.toLowerCase()
    return DIY_KEYWORDS.some((k) => text.includes(k))
  })

  const sortedDIY = [...diyVideos].sort((a: any, b: any) => {
    const velA = getViewVelocity(a)
    const velB = getViewVelocity(b)
    return velB - velA
  })

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <ArticleSchema />
      <FAQPageSchema />
      <BreadcrumbSchema />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">DIY</span>
        </nav>

        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 sm:mb-8">
          <span className="text-lg">←</span>
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        {/* Hero */}
        <div className="mb-8 sm:mb-12">
          <div className="text-teal-600 text-xs font-bold tracking-[0.2em] uppercase mb-2">🔨 DIY INTELLIGENCE</div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-gray-900">DIY Trends</h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl leading-relaxed mb-6">
            Track viral DIY content before it peaks. Do-it-yourself projects, crafts, and creative builds with
            real-time velocity and competition analysis for DIY creators.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">🔨 TRENDING</div>
              <div className="text-xl font-black text-gray-900">{sortedDIY.length}</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">⚡ AVG VELOCITY</div>
              <div className="text-xl font-black text-green-600">
                {sortedDIY.length > 0
                  ? `${Math.round(sortedDIY.reduce((s, v) => s + getViewVelocity(v), 0) / sortedDIY.length / 1000)}K/d`
                  : '0K/d'}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">📈 ENGAGEMENT</div>
              <div className="text-xl font-black text-yellow-600">
                {sortedDIY.length > 0
                  ? `${(sortedDIY.reduce((s, v) => s + getEngagementRate(v), 0) / sortedDIY.length).toFixed(2)}%`
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
            <span className="text-teal-600">🔥</span> Hot DIY Niches Right Now
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: 'Home Decor', icon: '🏠', trend: '+37%', color: 'text-teal-600' },
              { name: 'Dollar Store DIY', icon: '💵', trend: '+32%', color: 'text-cyan-600' },
              { name: 'Upcycling', icon: '♻️', trend: '+29%', color: 'text-emerald-600' },
              { name: 'Organization', icon: '📦', trend: '+34%', color: 'text-green-600' },
            ].map((niche) => (
              <Link
                key={niche.name}
                href={`/tag/${niche.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:border-teal-400 hover:shadow-lg transition-all group"
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

        {/* Editorial Content - YouTube DIY Trends 2026 */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900">YouTube DIY Content Trends 2026</h2>

          <div className="prose prose-sm max-w-none text-gray-600">
            <p className="mb-4">
              DIY (Do It Yourself) is one of the most practical and fulfilling content categories on YouTube. In 2026, DIY content has evolved from simple craft tutorials into a多元化 ecosystem encompassing home renovation, upcycling, woodworking, creative art projects, and comprehensive repair guides. Successful DIY creators don't just demonstrate techniques—they inspire creativity, teach valuable life skills, and build communities of makers who share the satisfaction of creating something with their own hands.
            </p>

            <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">2026 DIY Category Hot Topics</h3>

            <div className="space-y-4 mb-6">
              <div>
                <h4 className="font-bold text-gray-900">1. Sustainable & Upcycling Projects</h4>
                <p>Upcycling, repurposing, and zero-waste DIY have surged in popularity as environmental consciousness grows. Creators are transforming thrift store finds, old furniture, and discarded materials into stunning home decor and functional pieces. This trend aligns with the broader sustainability movement and attracts environmentally conscious viewers.</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900">2. Home Renovation & Decoration</h4>
                <p>Home renovation content continues to be a cornerstone of the DIY category. From small bathroom makeovers to complete room transformations, viewers are hungry for practical renovation guides. The satisfaction of before-and-after reveals remains one of the most compelling formats on YouTube.</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900">3. Crafts & Creative Arts</h4>
                <p>Handmade crafts, personalized gifts, and creative art projects cater to viewers seeking creative expression. Resin art, candle making, pottery, and textile crafts are experiencing rapid growth, driven by the desire for unique, handmade items.</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900">4. Repair & Maintenance</h4>
                <p>Practical repair content—appliance fixes, automotive maintenance, and everyday problem-solving—provides immense value to viewers. In an era of rising costs, learning to repair instead of replace resonates deeply with audiences looking to save money.</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900">5. Budget-Friendly DIY</h4>
                <p>Dollar store transformations, budget-friendly room makeovers, and low-cost craft projects attract viewers who want impressive results without breaking the bank. The "under $10 challenge" format has become particularly viral.</p>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">Success Case Studies</h3>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-900">5-Minute Crafts</h4>
                <p className="text-xs text-gray-500 mb-2">80M+ Subscribers</p>
                <p className="text-sm">Strategy: Quick DIY hacks + viral formatting + massive content volume. Success factors: Fast-paced format + viral potential + high production cadence. Key metrics: 5M+ average views per video, the undisputed giant of DIY content on YouTube.</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-900">April Wilkerson</h4>
                <p className="text-xs text-gray-500 mb-2">1M+ Subscribers</p>
                <p className="text-sm">Strategy: Detailed woodworking projects + female maker perspective + step-by-step tutorials. Success factors: Professional craftsmanship + authentic representation + detailed build documentation. Key metrics: 200K+ average views, a leading voice in woodworking DIY.</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-900">Home RenoVision DIY</h4>
                <p className="text-xs text-gray-500 mb-2">1M+ Subscribers</p>
                <p className="text-sm">Strategy: Comprehensive home renovation + professional-grade instruction + real project documentation. Success factors: Deep expertise + practical value + honest assessment of costs and challenges. Key metrics: 100K+ average views, the authority for home renovation DIY.</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-900">I Like To Make Stuff</h4>
                <p className="text-xs text-gray-500 mb-2">4M+ Subscribers</p>
                <p className="text-sm">Strategy: Creative builds + diverse project types + educational value + personal storytelling. Success factors: Versatile maker skills + engaging narrative + genuine passion. Key metrics: 500K+ average views, the creative DIY champion.</p>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">Content Strategy Recommendations</h3>

            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li><strong>Provide Detailed Steps:</strong> DIY content must be actionable. Provide comprehensive step-by-step instructions, complete materials lists, and tool requirements so viewers can follow along and recreate the project themselves.</li>
              <li><strong>Show Before/After Transformations:</strong> The dramatic contrast between before and after is one of the most satisfying elements of DIY content. Invest in quality comparison shots to maximize the visual impact.</li>
              <li><strong>Invest in Production Quality:</strong> Good lighting, clear footage, and appropriate background music significantly enhance the DIY viewing experience. Close-up shots of detailed work are essential.</li>
              <li><strong>Provide Alternative Options:</strong> Consider viewers with different budgets and skill levels. Offer alternative materials, simplified versions, and budget-friendly substitutions to make your content accessible to a wider audience.</li>
            </ul>

            <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">How to Succeed in the DIY Category</h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="border-l-4 border-teal-500 pl-4">
                <h4 className="font-bold text-gray-900">Find Your DIY Niche</h4>
                <p className="text-sm">The DIY category is extremely broad. Choose a specific area to focus on—whether it&apos;s woodworking, sewing, home renovation, or craft art—and build deep expertise in that niche to establish authority.</p>
              </div>

              <div className="border-l-4 border-teal-500 pl-4">
                <h4 className="font-bold text-gray-900">Optimize for SEO</h4>
                <p className="text-sm">SEO is crucial for DIY content. Use project names, &quot;DIY&quot;, &quot;tutorial&quot;, &quot;how to&quot;, and &quot;make&quot; keywords in titles and descriptions to capture search traffic from viewers actively looking for project ideas.</p>
              </div>

              <div className="border-l-4 border-teal-500 pl-4">
                <h4 className="font-bold text-gray-900">Leverage Shorts for Discovery</h4>
                <p className="text-sm">Create short-form clips of your DIY projects to drive discovery and funnel viewers to your full tutorials. The quick reveal format works exceptionally well for Shorts.</p>
              </div>

              <div className="border-l-4 border-teal-500 pl-4">
                <h4 className="font-bold text-gray-900">Build a Maker Community</h4>
                <p className="text-sm">DIY enthusiasts love sharing their creations. Foster community through comments, community posts, viewer project showcases, and collaborative challenges to build lasting engagement.</p>
              </div>

              <div className="border-l-4 border-teal-500 pl-4">
                <h4 className="font-bold text-gray-900">Diversify Revenue Streams</h4>
                <p className="text-sm">The commercial value of DIY content extends beyond ad revenue. Brand partnerships with tool and material companies, affiliate marketing, course sales, and selling DIY kits are all viable income sources.</p>
              </div>

              <div className="border-l-4 border-teal-500 pl-4">
                <h4 className="font-bold text-gray-900">Maintain Safety Standards</h4>
                <p className="text-sm">Always include safety warnings and protective equipment recommendations. Responsible content builds trust, reduces liability, and positions you as a professional creator in the space.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trending Videos */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
            <span className="text-teal-600">🔥</span> Trending DIY Videos
          </h2>

          {sortedDIY.length === 0 && (
            <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
              <div className="text-gray-500 mb-2">No DIY videos in trending right now.</div>
              <Link href="/trending" className="text-teal-600 hover:text-teal-500 text-sm font-medium">
                Check all trends →
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {sortedDIY.slice(0, 9).map((video: any) => {
              const velocity = getViewVelocity(video)
              const engagement = getEngagementRate(video)
              const insights = getDIYInsights(video.snippet?.title || '')
              return (
                <Link key={video.id} href={`/video/${video.id}`} className="group block">
                  <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 hover:border-teal-400 hover:shadow-lg transition-all h-full">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={video.snippet?.thumbnails?.high?.url || video.snippet?.thumbnails?.medium?.url}
                        alt={video.snippet?.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 bg-teal-500/90 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold">
                        🔨 DIY
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-lg text-[10px] font-medium">
                        👁️ {formatNumber(video.statistics?.viewCount)}
                      </div>
                    </div>
                    <div className="p-3 sm:p-5">
                      <h3 className="font-bold text-sm sm:text-base line-clamp-2 mb-2 group-hover:text-teal-600 transition-colors text-gray-900">
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
            <span className="text-green-600">💡</span> DIY Creator Tips
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-gray-700">🎯 Best Upload Times</h3>
              <ul className="text-gray-500 text-xs space-y-1">
                <li>• Wednesday & Friday: 5 PM - 8 PM (peak DIY browsing)</li>
                <li>• Saturday mornings: 10 AM - 12 PM (weekend project planning)</li>
                <li>• Sunday afternoons: 2 PM - 5 PM (week prep & inspiration)</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-gray-700">📈 Trending Formats</h3>
              <ul className="text-gray-500 text-xs space-y-1">
                <li>• &quot;I transformed [item] into [result]&quot;</li>
                <li>• &quot;Dollar store DIY: [project] under $10&quot;</li>
                <li>• &quot;Before &amp; after: [room/project] makeover&quot;</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ - 8 Questions */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'What DIY content is trending on YouTube?', a: 'Home decor, dollar store DIY, upcycling, and organization projects are currently seeing high engagement across all regions.' },
              { q: 'How do I make my DIY videos popular?', a: 'Focus on clear step-by-step instructions, show before/after transformations, use affordable materials, and create satisfying reveal moments.' },
              { q: 'Is DIY content competitive on YouTube?', a: 'DIY has medium competition. Unique project ideas, budget-friendly approaches, and creative upcycling offer opportunities for new creators to stand out.' },
              { q: 'Who is the target audience for DIY content?', a: 'DIY audiences span ages 25-45, with women comprising about 55% of viewers. Core audiences are in the US, UK, Canada, and Australia, seeking practical tips, creative inspiration, and the satisfaction of creating something with their own hands.' },
              { q: 'What content formats work best for DIY?', a: 'Project tutorials (10-20 min), makeover processes (15-30 min), quick tips (5-10 min), material introductions (8-12 min), tool reviews (10-15 min), and Shorts for quick previews (15-60 sec) perform best.' },
              { q: 'How competitive is the DIY category?', a: 'The DIY category has medium competition (3/5 stars). Success requires niche specialization, detailed step-by-step instruction, and building a community of fellow makers who share your creative vision.' },
              { q: 'What are common mistakes in DIY content?', a: 'Common mistakes include insufficient step-by-step detail, neglecting safety precautions, poor lighting that hides details, failing to provide material lists and costs, ignoring audience interaction, inconsistent upload schedules, and making projects too complex for beginners.' },
              { q: 'How can I monetize DIY content?', a: 'Monetization options include ad revenue ($4-10 CPM), brand partnerships with tool and material companies, affiliate marketing for recommended supplies, course sales, membership subscriptions for exclusive projects, and selling DIY tool kits and material bundles.' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="font-bold text-sm mb-1 text-gray-900">{item.q}</div>
                <div className="text-gray-500 text-xs leading-relaxed">{item.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Tools - Optimized Internal Links */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900">Related Tools</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link href="/youtube-video-analyzer" className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm font-medium text-gray-900">Video Analyzer</div>
              <div className="text-xs text-gray-500 mt-1">Analyze DIY video performance</div>
            </Link>
            <Link href="/youtube-channel-analytics" className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="text-2xl mb-2">📈</div>
              <div className="text-sm font-medium text-gray-900">Channel Analytics</div>
              <div className="text-xs text-gray-500 mt-1">Track DIY channel growth</div>
            </Link>
            <Link href="/trends" className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="text-2xl mb-2">🔥</div>
              <div className="text-sm font-medium text-gray-900">Trend Database</div>
              <div className="text-xs text-gray-500 mt-1">All trending content</div>
            </Link>
            <Link href="/ai-assistant" className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="text-2xl mb-2">🤖</div>
              <div className="text-sm font-medium text-gray-900">AI Assistant</div>
              <div className="text-xs text-gray-500 mt-1">Get DIY project ideas</div>
            </Link>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 text-center border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold mb-2 text-gray-900">Ready to Grow Your DIY Channel?</h2>
          <p className="text-gray-500 text-sm mb-4 max-w-xl mx-auto">
            Get early access to viral DIY trends before your competition.
          </p>
          <Link
            href="/trends"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-700 transition shadow-lg"
          >
            Explore All Trends →
          </Link>
        </div>
      </div>
    </main>
  )
}
