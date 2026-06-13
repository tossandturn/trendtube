import type { Metadata } from 'next'
import Link from 'next/link'
import { getViewVelocity, getEngagementRate } from '@/lib/analytics'
import { fetchTrendingVideos } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Food YouTube Trends 2026 | Viral Food Videos',
  description: 'Track the fastest-growing food content on YouTube. Cooking tutorials, recipes, and food adventures with real-time creator intelligence.',
  keywords: ['food trends', 'cooking', 'recipe', 'culinary', 'eating', 'youtube food', 'cooking tutorial'],
}

function formatNumber(n: string | undefined) {
  const num = Number(n || 0)
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return num.toLocaleString()
}

function getFoodInsights(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('easy') || t.includes('simple') || t.includes('beginner')) return 'Easy recipes remove intimidation barriers. Simple instructions with common ingredients attract home cooks.'
  if (t.includes('quick') || t.includes('fast') || t.includes('minutes')) return 'Quick recipes satisfy busy lifestyles. Time-efficient meals appeal to working professionals.'
  if (t.includes('healthy') || t.includes('diet') || t.includes('low')) return 'Health-conscious content aligns with wellness trends. Nutritional information adds value beyond recipes.'
  if (t.includes('budget') || t.includes('cheap') || t.includes('affordable')) return 'Budget-friendly content serves price-conscious audiences. Cost breakdowns build trust and relatability.'
  if (t.includes('street food') || t.includes('authentic') || t.includes('traditional')) return 'Authentic cuisine content offers cultural exploration. Unique flavors and techniques attract curious viewers.'
  if (t.includes('mukbang') || t.includes('eating')) return 'Mukbang content satisfies vicarious eating experiences. ASMR elements enhance engagement and watch time.'
  return 'Food content succeeds with visual appeal and clear instructions. Satisfying cooking processes drive repeat viewing.'
}

const FOOD_KEYWORDS = [
  'food', 'cooking', 'recipe', 'culinary', 'eating', 'chef', 'kitchen',
  'meal', 'dish', 'cuisine', 'baking', 'dessert', 'healthy', 'diet',
  'nutrition', 'restaurant', 'taste', 'flavor', 'ingredient', 'cook'
]

// Schema Markup Components
function ArticleSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Food YouTube Trends 2026 | Viral Food Videos',
    description: 'Track the fastest-growing food content on YouTube. Cooking tutorials, recipes, and food adventures with real-time creator intelligence.',
    author: {
      '@type': 'Organization',
      name: 'Tubefission'
    },
    datePublished: '2026-06-14',
    dateModified: '2026-06-14',
    articleSection: 'Food',
    publisher: {
      '@type': 'Organization',
      name: 'Tubefission',
      logo: {
        '@type': 'ImageObject',
        url: 'https://tubefission.com/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://tubefission.com/food'
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
        name: 'What food content is trending on YouTube?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Quick recipes, healthy meals, budget cooking, and street food adventures are currently seeing high engagement across all regions. Shorts food content (15-60 seconds) has exploded in 2026, with fast recipes and visually stunning cooking clips driving massive traffic.'
        }
      },
      {
        '@type': 'Question',
        name: 'How do I make my cooking videos popular?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Focus on visual presentation, clear step-by-step instructions, use trending ingredients, and create satisfying cooking processes. Invest in good lighting and camera angles, especially overhead shots. Provide practical value with recipes viewers can actually replicate at home.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is food content competitive on YouTube?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Food content is highly competitive but unique cuisines, specific dietary niches (vegan, keto, gluten-free), and creative presentation styles offer opportunities. Success requires consistent quality, a unique positioning, and strong community engagement.'
        }
      },
      {
        '@type': 'Question',
        name: 'Who is the target audience for food content?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Food content appeals to a broad audience aged 25-45, with a slight female majority (55%). Core viewers are in the US, UK, Canada, Australia, and India. They seek practical recipes, cooking inspiration, and food entertainment. Many are home cooks looking for accessible recipes they can recreate.'
        }
      },
      {
        '@type': 'Question',
        name: 'What content formats work best for food?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Recipe tutorials (8-15 minutes) remain the most popular format. Food challenges and experiments (10-20 minutes) have viral potential. Street food explorations (15-25 minutes) satisfy wanderlust. Cooking tips and techniques (5-10 minutes) provide quick value. Shorts recipes (15-60 seconds) are excellent for discovery and driving traffic to full videos.'
        }
      },
      {
        '@type': 'Question',
        name: 'How competitive is the food category?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The food category has HIGH competition (4/5 stars). Major creators like Gordon Ramsay (21M+), Joshua Weissman (12M+), and Nick DiGiovanni (22M+) dominate. However, niches like specific cuisines, dietary restrictions, budget cooking, and regional specialties offer entry points for new creators with unique angles.'
        }
      },
      {
        '@type': 'Question',
        name: 'What are common mistakes in food content?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Common mistakes include poor lighting that makes food unappetizing, unclear instructions that viewers cannot follow, neglecting mise en place (preparation), bad audio quality from kitchen noise, low-quality thumbnails, and overly complex recipes that intimidate home cooks. Successful creators keep it simple, well-lit, and achievable.'
        }
      },
      {
        '@type': 'Question',
        name: 'How can I monetize food content?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Food content monetization includes: AdSense revenue (CPM $5-12, higher than average), cookbook publishing (physical and digital), brand partnerships with kitchen and ingredient brands, affiliate marketing for cookware and ingredients, cooking courses and workshops, and culinary consulting services. Diversification is key to sustainable income.'
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
        name: 'Food',
        item: 'https://tubefission.com/food'
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

export default async function FoodTrendsPage() {
  const region = await getRegion()
  const videos = await fetchTrendingVideos(region, 50)

  const foodVideos = videos.filter((v: any) => {
    const text = `${v.snippet?.title || ''} ${v.snippet?.description || ''}`.toLowerCase()
    return FOOD_KEYWORDS.some((k) => text.includes(k))
  })

  const sortedFood = [...foodVideos].sort((a: any, b: any) => {
    const velA = getViewVelocity(a)
    const velB = getViewVelocity(b)
    return velB - velA
  })

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Schema Markup */}
      <ArticleSchema />
      <FAQPageSchema />
      <BreadcrumbSchema />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">Food</span>
        </nav>

        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 sm:mb-8">
          <span className="text-lg">←</span>
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        {/* Hero */}
        <div className="mb-8 sm:mb-12">
          <div className="text-amber-600 text-xs font-bold tracking-[0.2em] uppercase mb-2">🍕 FOOD INTELLIGENCE</div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-gray-900">Food Trends</h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl leading-relaxed mb-6">
            Track viral food content before it peaks. Cooking tutorials, recipes, and food adventures with
            real-time velocity and competition analysis for food creators.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">🍕 TRENDING</div>
              <div className="text-xl font-black text-gray-900">{sortedFood.length}</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">⚡ AVG VELOCITY</div>
              <div className="text-xl font-black text-green-600">
                {sortedFood.length > 0
                  ? `${Math.round(sortedFood.reduce((s, v) => s + getViewVelocity(v), 0) / sortedFood.length / 1000)}K/d`
                  : '0K/d'}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">📈 ENGAGEMENT</div>
              <div className="text-xl font-black text-yellow-600">
                {sortedFood.length > 0
                  ? `${(sortedFood.reduce((s, v) => s + getEngagementRate(v), 0) / sortedFood.length).toFixed(2)}%`
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
            <span className="text-amber-600">🔥</span> Hot Food Niches Right Now
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: 'Quick Recipes', icon: '⏱️', trend: '+34%', color: 'text-amber-600' },
              { name: 'Healthy Meals', icon: '🥗', trend: '+28%', color: 'text-green-600' },
              { name: 'Budget Cooking', icon: '💰', trend: '+31%', color: 'text-yellow-600' },
              { name: 'Street Food', icon: '🍜', trend: '+26%', color: 'text-orange-600' },
            ].map((niche) => (
              <Link
                key={niche.name}
                href={`/tag/${niche.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:border-amber-400 hover:shadow-lg transition-all group"
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
            <span className="text-amber-600">🔥</span> Trending Food Videos
          </h2>

          {sortedFood.length === 0 && (
            <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
              <div className="text-gray-500 mb-2">No food videos in trending right now.</div>
              <Link href="/trending" className="text-amber-600 hover:text-amber-500 text-sm font-medium">
                Check all trends →
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {sortedFood.slice(0, 9).map((video: any) => {
              const velocity = getViewVelocity(video)
              const engagement = getEngagementRate(video)
              const insights = getFoodInsights(video.snippet?.title || '')
              return (
                <Link key={video.id} href={`/video/${video.id}`} className="group block">
                  <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 hover:border-amber-400 hover:shadow-lg transition-all h-full">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={video.snippet?.thumbnails?.high?.url || video.snippet?.thumbnails?.medium?.url}
                        alt={video.snippet?.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 bg-amber-500/90 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold">
                        🍕 FOOD
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-lg text-[10px] font-medium">
                        👁️ {formatNumber(video.statistics?.viewCount)}
                      </div>
                    </div>
                    <div className="p-3 sm:p-5">
                      <h3 className="font-bold text-sm sm:text-base line-clamp-2 mb-2 group-hover:text-amber-600 transition-colors text-gray-900">
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

        {/* Editorial Content Section */}
        <section className="mb-12 bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">YouTube Food Content Trends 2026</h2>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-6">
              Food content is one of the most visually compelling and globally appealing categories on YouTube. In 2026, 
              culinary content continues to flourish, expanding from traditional cooking tutorials to innovative food experiments, 
              street food adventures, and high-end gastronomy. Food creators are constantly pushing boundaries, making this 
              category both highly competitive and incredibly rewarding for those who succeed.
            </p>

            <h3 className="text-xl font-bold mb-4 text-gray-900">2026 Food Category Hot Topics</h3>
            
            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-amber-500">📱</span> Shorts Food Explosion
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  15-60 second food Shorts have exploded in 2026. Quick recipes, cooking hacks, and visually stunning 
                  food clips serve as powerful traffic drivers to full-length content.
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-green-500">🥗</span> Health & Nutrition
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Healthy eating, nutrition-focused content, and specialized diets (vegan, keto, gluten-free) 
                  continue to see strong growth as viewers prioritize wellness.
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-orange-500">🌍</span> International Cuisine
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Street food tours, authentic regional dishes, and cultural food experiences satisfy viewers' 
                  wanderlust and curiosity about global cuisines.
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-red-500">🔥</span> Food Challenges
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Creative cooking challenges, extreme recipes, and food experiments have viral potential 
                  and attract younger demographics seeking entertainment.
                </p>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-4 text-gray-900">Success Case Studies</h3>
            
            <div className="space-y-4 mb-6">
              <div className="border-l-4 border-amber-500 pl-4 py-2">
                <h4 className="font-bold text-gray-900">Gordon Ramsay</h4>
                <p className="text-gray-500 text-sm">21M+ Subscribers | 2M+ Avg Views</p>
                <p className="text-gray-600 text-sm mt-1">
                  Combines professional culinary expertise with entertainment value. Strategy: Professional cooking 
                  + education + celebrity personality. Key to success: Authority + entertainment + brand extension.
                </p>
              </div>
              <div className="border-l-4 border-amber-500 pl-4 py-2">
                <h4 className="font-bold text-gray-900">Joshua Weissman</h4>
                <p className="text-gray-500 text-sm">12M+ Subscribers | 2M+ Avg Views</p>
                <p className="text-gray-600 text-sm mt-1">
                  Home cooking with humor and high production quality. Strategy: Accessible recipes + comedic timing 
                  + professional execution. Key to success: Relatability + entertainment value + skill demonstration.
                </p>
              </div>
              <div className="border-l-4 border-amber-500 pl-4 py-2">
                <h4 className="font-bold text-gray-900">Maangchi</h4>
                <p className="text-gray-500 text-sm">6M+ Subscribers | 500K+ Avg Views</p>
                <p className="text-gray-600 text-sm mt-1">
                  Korean cooking with cultural storytelling. Strategy: Authentic cuisine + cultural education 
                  + warm personality. Key to success: Cultural authenticity + clear instruction + community building.
                </p>
              </div>
              <div className="border-l-4 border-amber-500 pl-4 py-2">
                <h4 className="font-bold text-gray-900">Nick DiGiovanni</h4>
                <p className="text-gray-500 text-sm">22M+ Subscribers | 5M+ Avg Views</p>
                <p className="text-gray-600 text-sm mt-1">
                  Extreme cooking and viral food challenges. Strategy: Creative concepts + high production 
                  + youthful energy. Key to success: Innovation + production quality + shareability.
                </p>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-4 text-gray-900">Content Strategy Recommendations</h3>
            <ul className="space-y-3 text-gray-600 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-amber-500 font-bold">1.</span>
                <span><strong>Invest in Visuals:</strong> Food is visual art. Quality lighting, overhead shots, and color presentation are non-negotiable.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-500 font-bold">2.</span>
                <span><strong>Deliver Practical Value:</strong> Successful recipes must be replicable. Clear steps, accurate measurements, and achievable techniques.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-500 font-bold">3.</span>
                <span><strong>Tell Food Stories:</strong> Share ingredient origins, cultural backgrounds, and personal memories to add emotional depth.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-500 font-bold">4.</span>
                <span><strong>Build Community:</strong> Engage through comments, feature viewer recreations, and create spaces for food lovers to connect.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-500 font-bold">5.</span>
                <span><strong>Find Your Niche:</strong> The food category is vast. Specialize in a specific cuisine, technique, or dietary approach to stand out.</span>
              </li>
            </ul>

            <h3 className="text-xl font-bold mb-4 text-gray-900">How to Succeed in Food Content</h3>
            <div className="bg-amber-50 rounded-xl p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                Success in the food category requires balancing creativity with practicality. Start by identifying 
                your unique angle—whether it's budget-friendly meals, authentic cultural cuisine, or innovative 
                cooking techniques. Use tools like our <Link href="/youtube-video-analyzer" className="text-amber-600 hover:underline">Video Analyzer</Link> to study top performers 
                and understand what resonates with food audiences.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Optimize your content for recipe SEO by including ingredient lists, cooking times, and difficulty 
                ratings in your descriptions. Leverage Shorts as a discovery tool—clip the most visually appealing 
                moments from your full videos to drive traffic. Track trending ingredients and cooking styles 
                using our <Link href="/trends" className="text-amber-600 hover:underline">Trend Database</Link> to stay ahead of the curve.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Finally, diversify your revenue streams beyond AdSense. Cookbook publishing, brand partnerships, 
                affiliate marketing for kitchen tools, and cooking courses can create sustainable income. 
                Analyze your channel's performance with our <Link href="/youtube-channel-analytics" className="text-amber-600 hover:underline">Channel Analytics</Link> tool, and let our 
                <Link href="/ai-assistant" className="text-amber-600 hover:underline"> AI Assistant</Link> help you brainstorm content ideas tailored to your niche.
              </p>
            </div>
          </div>
        </section>

        {/* Creator Tips */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
            <span className="text-green-600">💡</span> Food Creator Tips
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-gray-700">🎯 Best Upload Times</h3>
              <ul className="text-gray-500 text-xs space-y-1">
                <li>• Meal prep Sunday: 10 AM - 2 PM</li>
                <li>• Dinner inspiration: 4 PM - 6 PM</li>
                <li>• Weekend cooking: Saturday 9 AM - 12 PM</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-gray-700">📈 Trending Formats</h3>
              <ul className="text-gray-500 text-xs space-y-1">
                <li>• &quot;5 ingredient [dish] anyone can make&quot;</li>
                <li>• &quot;Restaurant style [cuisine] at home&quot;</li>
                <li>• &quot;I tried [viral food trend]&quot;</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ - 8 Questions */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { 
                q: 'What food content is trending on YouTube?', 
                a: 'Quick recipes, healthy meals, budget cooking, and street food adventures are currently seeing high engagement across all regions. Shorts food content (15-60 seconds) has exploded in 2026, with fast recipes and visually stunning cooking clips driving massive traffic.' 
              },
              { 
                q: 'How do I make my cooking videos popular?', 
                a: 'Focus on visual presentation, clear step-by-step instructions, use trending ingredients, and create satisfying cooking processes. Invest in good lighting and camera angles, especially overhead shots. Provide practical value with recipes viewers can actually replicate at home.' 
              },
              { 
                q: 'Is food content competitive on YouTube?', 
                a: 'Food content is highly competitive but unique cuisines, specific dietary niches (vegan, keto, gluten-free), and creative presentation styles offer opportunities. Success requires consistent quality, a unique positioning, and strong community engagement.' 
              },
              {
                q: 'Who is the target audience for food content?',
                a: 'Food content appeals to a broad audience aged 25-45, with a slight female majority (55%). Core viewers are in the US, UK, Canada, Australia, and India. They seek practical recipes, cooking inspiration, and food entertainment. Many are home cooks looking for accessible recipes they can recreate.'
              },
              {
                q: 'What content formats work best for food?',
                a: 'Recipe tutorials (8-15 minutes) remain the most popular format. Food challenges and experiments (10-20 minutes) have viral potential. Street food explorations (15-25 minutes) satisfy wanderlust. Cooking tips and techniques (5-10 minutes) provide quick value. Shorts recipes (15-60 seconds) are excellent for discovery and driving traffic to full videos.'
              },
              {
                q: 'How competitive is the food category?',
                a: 'The food category has HIGH competition (4/5 stars). Major creators like Gordon Ramsay (21M+), Joshua Weissman (12M+), and Nick DiGiovanni (22M+) dominate. However, niches like specific cuisines, dietary restrictions, budget cooking, and regional specialties offer entry points for new creators with unique angles.'
              },
              {
                q: 'What are common mistakes in food content?',
                a: 'Common mistakes include poor lighting that makes food unappetizing, unclear instructions that viewers cannot follow, neglecting mise en place (preparation), bad audio quality from kitchen noise, low-quality thumbnails, and overly complex recipes that intimidate home cooks. Successful creators keep it simple, well-lit, and achievable.'
              },
              {
                q: 'How can I monetize food content?',
                a: 'Food content monetization includes: AdSense revenue (CPM $5-12, higher than average), cookbook publishing (physical and digital), brand partnerships with kitchen and ingredient brands, affiliate marketing for cookware and ingredients, cooking courses and workshops, and culinary consulting services. Diversification is key to sustainable income.'
              },
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
              <div className="text-xs text-gray-500 mt-1">Analyze top food videos</div>
            </Link>
            <Link href="/youtube-channel-analytics" className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="text-2xl mb-2">📈</div>
              <div className="text-sm font-medium text-gray-900">Channel Analytics</div>
              <div className="text-xs text-gray-500 mt-1">Track food channel growth</div>
            </Link>
            <Link href="/trends" className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="text-2xl mb-2">🔥</div>
              <div className="text-sm font-medium text-gray-900">Trend Database</div>
              <div className="text-xs text-gray-500 mt-1">Discover viral food trends</div>
            </Link>
            <Link href="/ai-assistant" className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="text-2xl mb-2">🤖</div>
              <div className="text-sm font-medium text-gray-900">AI Assistant</div>
              <div className="text-xs text-gray-500 mt-1">Get content ideas</div>
            </Link>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 text-center border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold mb-2 text-gray-900">Ready to Grow Your Food Channel?</h2>
          <p className="text-gray-500 text-sm mb-4 max-w-xl mx-auto">
            Get early access to viral food trends before your competition.
          </p>
          <Link
            href="/trends"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-xl font-bold text-sm hover:bg-amber-700 transition shadow-lg"
          >
            Explore All Trends →
          </Link>
        </div>
      </div>
    </main>
  )
}
