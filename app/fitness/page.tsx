import type { Metadata } from 'next'
import Link from 'next/link'
import RegionSelectorBar from '@/app/components/RegionSelectorBar'
import { getViewVelocity, getEngagementRate } from '@/lib/analytics'
import { fetchTrendingVideos } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'


export const metadata: Metadata = {
  title: 'Fitness YouTube Trends 2026 | Viral Fitness Videos',
  description: 'Track the fastest-growing fitness content on YouTube. Workout routines, health tips, and wellness content with real-time creator intelligence.',
  keywords: ['fitness trends', 'workout', 'health', 'gym', 'exercise', 'youtube fitness', 'wellness'],
}

function formatNumber(n: string | undefined) {
  const num = Number(n || 0)
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return num.toLocaleString()
}

function getFitnessInsights(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('home') || t.includes('no gym')) return 'Home workouts remove barriers to entry. No equipment requirements expand audience reach significantly.'
  if (t.includes('beginner') || t.includes('start')) return 'Beginner content captures the largest fitness audience. Simple, achievable goals reduce intimidation.'
  if (t.includes('abs') || t.includes('core') || t.includes('six pack')) return 'Core-focused content has high visual appeal. Transformation promises drive strong engagement.'
  if (t.includes('challenge') || t.includes('30 day') || t.includes('week')) return 'Challenge content creates commitment and accountability. Structured programs improve completion rates.'
  if (t.includes('meal') || t.includes('diet') || t.includes('nutrition')) return 'Nutrition content complements workouts. Diet advice has high search volume year-round.'
  if (t.includes('transformation') || t.includes('before after')) return 'Transformation stories provide proof and inspiration. Visual results drive emotional engagement.'
  return 'Fitness content succeeds with clear outcomes and accessibility. Results-oriented messaging drives consistent engagement.'
}

const FITNESS_KEYWORDS = [
  'fitness', 'workout', 'health', 'gym', 'exercise', 'training',
  'muscle', 'strength', 'cardio', 'yoga', 'pilates', 'crossfit',
  'bodybuilding', 'weight loss', 'fat burn', 'abs', 'core', 'diet',
  'nutrition', 'wellness', 'healthy', 'fit', 'sweat'
]

// Schema Markup Components
function ArticleSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Fitness YouTube Trends 2026 | Viral Fitness Videos',
    description: 'Track the fastest-growing fitness content on YouTube. Workout routines, health tips, and wellness content with real-time creator intelligence.',
    author: {
      '@type': 'Organization',
      name: 'Tubefission'
    },
    datePublished: '2026-06-14',
    dateModified: '2026-06-14',
    articleSection: 'Fitness',
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
        name: 'What fitness content is trending on YouTube?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Home workouts, core training, 30-day challenges, and nutrition tips are currently seeing high engagement across all regions.'
        }
      },
      {
        '@type': 'Question',
        name: 'How do I grow my fitness channel?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Provide clear workout instructions, show real results, create structured programs, and engage with your community transformation stories.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is fitness content competitive on YouTube?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Fitness is highly competitive but specific niches like home workouts, beginner programs, and unique training methods offer opportunities.'
        }
      },
      {
        '@type': 'Question',
        name: 'Who is the target audience for fitness content?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Fitness audiences span ages 18-40, with women comprising about 55% of viewers. Core audiences are in the US, UK, Canada, and Australia, seeking health improvement and sustainable fitness routines.'
        }
      },
      {
        '@type': 'Question',
        name: 'What content formats work best for fitness?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Follow-along videos (15-30 min), exercise tutorials (5-10 min), fitness challenges (series), nutrition guides (8-15 min), and motivational content (10-20 min) perform best.'
        }
      },
      {
        '@type': 'Question',
        name: 'How competitive is the fitness category?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The fitness category is highly competitive (4/5 stars). Success requires niche specialization, consistent quality content, and building a supportive community around your training philosophy.'
        }
      },
      {
        '@type': 'Question',
        name: 'What are common mistakes in fitness content?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Common mistakes include neglecting exercise safety, creating overly complex routines for beginners, ignoring nutrition/recovery, making unrealistic promises, lacking audience engagement, and omitting disclaimers.'
        }
      },
      {
        '@type': 'Question',
        name: 'How can I monetize fitness content?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Monetization options include ad revenue ($6-15 CPM), course sales (training plans), membership subscriptions, brand partnerships, affiliate marketing for equipment, and app sales.'
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
        name: 'Fitness',
        item: 'https://tubefission.com/fitness'
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

export default async function FitnessTrendsPage() {
  const region = await getRegion()
  const videos = await fetchTrendingVideos(region, 50)

  const fitnessVideos = videos.filter((v: any) => {
    const text = `${v.snippet?.title || ''} ${v.snippet?.description || ''}`.toLowerCase()
    return FITNESS_KEYWORDS.some((k) => text.includes(k))
  })

  const sortedFitness = [...fitnessVideos].sort((a: any, b: any) => {
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
          <span className="text-gray-900 font-medium">Fitness</span>
        </nav>

        {/* Region Filter */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-gray-500 font-medium">Select Region:</span>
          <RegionSelectorBar currentRegion={region} />
        </div>

        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 sm:mb-8">
          <span className="text-lg">←</span>
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        {/* Hero */}
        <div className="mb-8 sm:mb-12">
          <div className="text-orange-600 text-xs font-bold tracking-[0.2em] uppercase mb-2">💪 FITNESS INTELLIGENCE</div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-gray-900">Fitness Trends</h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl leading-relaxed mb-6">
            Track viral fitness content before it peaks. Workout routines, health tips, and wellness content with
            real-time velocity and competition analysis for fitness creators.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">💪 TRENDING</div>
              <div className="text-xl font-black text-gray-900">{sortedFitness.length}</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">⚡ AVG VELOCITY</div>
              <div className="text-xl font-black text-green-600">
                {sortedFitness.length > 0
                  ? `${Math.round(sortedFitness.reduce((s, v) => s + getViewVelocity(v), 0) / sortedFitness.length / 1000)}K/d`
                  : '0K/d'}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">📈 ENGAGEMENT</div>
              <div className="text-xl font-black text-yellow-600">
                {sortedFitness.length > 0
                  ? `${(sortedFitness.reduce((s, v) => s + getEngagementRate(v), 0) / sortedFitness.length).toFixed(2)}%`
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
            <span className="text-orange-600">🔥</span> Hot Fitness Niches Right Now
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: 'Home Workouts', icon: '🏠', trend: '+38%', color: 'text-orange-600' },
              { name: 'Core Training', icon: '🎯', trend: '+29%', color: 'text-red-600' },
              { name: '30 Day Challenges', icon: '📅', trend: '+32%', color: 'text-amber-600' },
              { name: 'Nutrition Tips', icon: '🥗', trend: '+25%', color: 'text-green-600' },
            ].map((niche) => (
              <Link
                key={niche.name}
                href={`/tag/${niche.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:border-orange-400 hover:shadow-lg transition-all group"
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

        {/* Editorial Content - YouTube Fitness Trends 2026 */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900">YouTube Fitness Content Trends 2026</h2>
          
          <div className="prose prose-sm max-w-none text-gray-600">
            <p className="mb-4">
              Fitness content is one of the most practical and engaging categories on YouTube. In 2026, fitness creators are not just providing workout instructions—they are becoming leaders in healthy lifestyle movements. As health awareness continues to rise globally, the demand for quality fitness content keeps growing.
            </p>
            
            <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">2026 Fitness Category Hot Topics</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <h4 className="font-bold text-gray-900">1. Home Workouts</h4>
                <p>Home fitness content remains strong in 2026. Equipment-free training, small-space exercises, and home gym setup guides meet the growing need for convenient at-home fitness solutions.</p>
              </div>
              
              <div>
                <h4 className="font-bold text-gray-900">2. Short & Efficient Training</h4>
                <p>15-30 minute high-efficiency workouts are popular among busy professionals. HIIT, quick fat-burning routines, and morning workout series are seeing rapid growth.</p>
              </div>
              
              <div>
                <h4 className="font-bold text-gray-900">3. Mental Health & Fitness</h4>
                <p>The integration of fitness and mental wellness is a rising trend. Yoga, meditation, and mindful movement content addresses the need for mind-body balance.</p>
              </div>
              
              <div>
                <h4 className="font-bold text-gray-900">4. Personalization & Adaptability</h4>
                <p>Personalized fitness content for different levels, goals, and physical conditions is in demand. Beginner-friendly, advanced challenges, and specialized content for groups like pregnant women and seniors are gaining attention.</p>
              </div>
              
              <div>
                <h4 className="font-bold text-gray-900">5. Nutrition-Fitness Integration</h4>
                <p>Fitness diet, nutritional supplements, and meal planning content work closely with training programs to provide complete health solutions.</p>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">Success Case Studies</h3>
            
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-900">Chloe Ting</h4>
                <p className="text-xs text-gray-500 mb-2">25M+ Subscribers</p>
                <p className="text-sm">Strategy: Free fitness challenges + series courses + community-driven. Success factors: Free value + challenge format + community engagement. Key metrics: 2M+ average views, 600M+ challenge video views.</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-900">Athlean-X (Jeff Cavaliere)</h4>
                <p className="text-xs text-gray-500 mb-2">14M+ Subscribers</p>
                <p className="text-sm">Strategy: Professional training + scientific principles + educational value. Success factors: Professional authority + educational depth + consistent updates. Key metrics: 500K+ average views, fitness education benchmark.</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-900">Blogilates (Cassey Ho)</h4>
                <p className="text-xs text-gray-500 mb-2">10M+ Subscribers</p>
                <p className="text-sm">Strategy: Pilates + positive energy + community building. Success factors: Relatability + consistent series + brand extension. Key metrics: Strong community engagement, successful product lines.</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-900">THENX (Chris Heria)</h4>
                <p className="text-xs text-gray-500 mb-2">8M+ Subscribers</p>
                <p className="text-sm">Strategy: Street workout + extreme moves + motivation. Success factors: Visual impact + skill demonstration + inspirational value. Key metrics: 500K+ average views, street fitness culture representative.</p>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">Content Strategy Recommendations</h3>
            
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li><strong>Provide Clear Guidance:</strong> Fitness content needs clear instructions and demonstrations. Every movement angle, breathing technique, and safety note should be explained in detail.</li>
              <li><strong>Build Progressive Systems:</strong> Successful fitness channels offer progressive training systems from beginner to advanced levels, allowing viewers to continuously improve.</li>
              <li><strong>Invest in Production Quality:</strong> Production quality directly impacts professional image. Good lighting, clear footage, and appropriate music are essential.</li>
              <li><strong>Build Community Culture:</strong> Fitness is a long-term journey. Build supportive communities through challenges, interactions, and progress sharing.</li>
            </ul>
            
            <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">How to Succeed in Fitness Category</h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-bold text-gray-900">Find Your Fitness Niche</h4>
                <p className="text-sm">The fitness category is extremely broad. Choose a specific area to focus on—whether it's strength training, yoga, cardio, or a specific sport.</p>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-bold text-gray-900">Provide Free Value</h4>
                <p className="text-sm">Successful fitness channels typically offer substantial free content to build trust, then monetize through premium courses and memberships.</p>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-bold text-gray-900">Leverage Challenge Formats</h4>
                <p className="text-sm">Fitness challenges (30-day abs, 7-day yoga series) are effective content organization tools and community builders.</p>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-bold text-gray-900">Optimize for SEO</h4>
                <p className="text-sm">SEO is crucial for fitness content. Use keywords like "Workout," "Routine," "Challenge," "For Beginners" in your titles and descriptions.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trending Videos */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
            <span className="text-orange-600">🔥</span> Trending Fitness Videos
          </h2>

          {sortedFitness.length === 0 && (
            <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
              <div className="text-gray-500 mb-2">No fitness videos in trending right now.</div>
              <Link href="/trending" className="text-orange-600 hover:text-orange-500 text-sm font-medium">
                Check all trends →
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {sortedFitness.slice(0, 9).map((video: any) => {
              const velocity = getViewVelocity(video)
              const engagement = getEngagementRate(video)
              const insights = getFitnessInsights(video.snippet?.title || '')
              return (
                <Link key={video.id} href={`/video/${video.id}`} className="group block">
                  <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 hover:border-orange-400 hover:shadow-lg transition-all h-full">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={video.snippet?.thumbnails?.high?.url || video.snippet?.thumbnails?.medium?.url}
                        alt={video.snippet?.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 bg-orange-500/90 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold">
                        💪 FITNESS
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-lg text-[10px] font-medium">
                        👁️ {formatNumber(video.statistics?.viewCount)}
                      </div>
                    </div>
                    <div className="p-3 sm:p-5">
                      <h3 className="font-bold text-sm sm:text-base line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors text-gray-900">
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
            <span className="text-green-600">💡</span> Fitness Creator Tips
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-gray-700">🎯 Best Upload Times</h3>
              <ul className="text-gray-500 text-xs space-y-1">
                <li>• Monday mornings: 6 AM - 9 AM (motivation time)</li>
                <li>• Sunday evenings: 6 PM - 9 PM (week prep)</li>
                <li>• New Year period: Peak engagement season</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-gray-700">📈 Trending Formats</h3>
              <ul className="text-gray-500 text-xs space-y-1">
                <li>• "10 min home workout - no equipment"</li>
                <li>• "30 day transformation challenge"</li>
                <li>• "What I eat in a day [fitness goal]"</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ - 8 Questions */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'What fitness content is trending on YouTube?', a: 'Home workouts, core training, 30-day challenges, and nutrition tips are currently seeing high engagement across all regions.' },
              { q: 'How do I grow my fitness channel?', a: 'Provide clear workout instructions, show real results, create structured programs, and engage with your community transformation stories.' },
              { q: 'Is fitness content competitive on YouTube?', a: 'Fitness is highly competitive but specific niches like home workouts, beginner programs, and unique training methods offer opportunities.' },
              { q: 'Who is the target audience for fitness content?', a: 'Fitness audiences span ages 18-40, with women comprising about 55% of viewers. Core audiences are in the US, UK, Canada, and Australia, seeking health improvement and sustainable fitness routines.' },
              { q: 'What content formats work best for fitness?', a: 'Follow-along videos (15-30 min), exercise tutorials (5-10 min), fitness challenges (series), nutrition guides (8-15 min), and motivational content (10-20 min) perform best.' },
              { q: 'How competitive is the fitness category?', a: 'The fitness category is highly competitive (4/5 stars). Success requires niche specialization, consistent quality content, and building a supportive community around your training philosophy.' },
              { q: 'What are common mistakes in fitness content?', a: 'Common mistakes include neglecting exercise safety, creating overly complex routines for beginners, ignoring nutrition/recovery, making unrealistic promises, lacking audience engagement, and omitting disclaimers.' },
              { q: 'How can I monetize fitness content?', a: 'Monetization options include ad revenue ($6-15 CPM), course sales (training plans), membership subscriptions, brand partnerships, affiliate marketing for equipment, and app sales.' },
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
              <div className="text-xs text-gray-500 mt-1">Analyze fitness videos</div>
            </Link>
            <Link href="/youtube-channel-analytics" className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="text-2xl mb-2">📈</div>
              <div className="text-sm font-medium text-gray-900">Channel Analytics</div>
              <div className="text-xs text-gray-500 mt-1">Track fitness channels</div>
            </Link>
            <Link href="/trends" className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="text-2xl mb-2">🔥</div>
              <div className="text-sm font-medium text-gray-900">Trend Database</div>
              <div className="text-xs text-gray-500 mt-1">All trending content</div>
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
          <h2 className="text-xl font-bold mb-2 text-gray-900">Ready to Grow Your Fitness Channel?</h2>
          <p className="text-gray-500 text-sm mb-4 max-w-xl mx-auto">
            Get early access to viral fitness trends before your competition.
          </p>
          <Link
            href="/trends"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl font-bold text-sm hover:bg-orange-700 transition shadow-lg"
          >
            Explore All Trends →
          </Link>
        </div>
      </div>
    </main>
  )
}
