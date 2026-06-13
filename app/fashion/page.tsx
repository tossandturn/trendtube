import type { Metadata } from 'next'
import Link from 'next/link'
import RegionSelectorBar from '@/app/components/RegionSelectorBar'
import { getViewVelocity, getEngagementRate } from '@/lib/analytics'
import { fetchTrendingVideos } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'


export const metadata: Metadata = {
  title: 'Fashion YouTube Trends 2026 | Viral Fashion Videos',
  description: 'Track the fastest-growing fashion content on YouTube. Style guides, outfit ideas, and fashion inspiration with real-time creator intelligence.',
  keywords: ['fashion trends', 'style', 'outfit', 'clothing', 'trend', 'youtube fashion', 'fashion inspiration'],
}

function formatNumber(n: string | undefined) {
  const num = Number(n || 0)
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return num.toLocaleString()
}

function getFashionInsights(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('haul') || t.includes('unboxing')) return 'Haul content satisfies shopping vicariously. Unboxing moments create anticipation and discovery excitement.'
  if (t.includes('lookbook') || t.includes('outfit')) return 'Lookbooks provide visual inspiration. Styling combinations help viewers imagine possibilities.'
  if (t.includes('thrift') || t.includes('vintage') || t.includes('second')) return 'Sustainable fashion aligns with values. Unique finds and bargains drive engagement.'
  if (t.includes('budget') || t.includes('cheap') || t.includes('affordable')) return 'Budget fashion serves price-conscious audiences. Style on a budget is universally appealing.'
  if (t.includes('try on') || t.includes('review')) return 'Try-on content provides realistic expectations. Fit and quality assessments build trust.'
  if (t.includes('trend') || t.includes('202') || t.includes('season')) return 'Trend content stays culturally current. Seasonal updates create recurring engagement.'
  return 'Fashion content succeeds with visual appeal and authenticity. Personal style resonates more than generic advice.'
}

const FASHION_KEYWORDS = [
  'fashion', 'style', 'outfit', 'clothing', 'trend', 'look', 'wear',
  'dress', 'apparel', 'wardrobe', 'accessory', 'shoes', 'bag',
  'designer', 'brand', 'collection', 'season', 'vintage', 'thrift'
]

// Schema Markup Components
function ArticleSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Fashion YouTube Trends 2026',
    description: 'Discover the latest trends in YouTube fashion content including sustainable fashion, vintage styles, streetwear, and professional styling.',
    author: {
      '@type': 'Organization',
      name: 'Tubefission'
    },
    datePublished: '2026-06-14',
    articleSection: 'Fashion',
    image: 'https://tubefission.com/images/fashion-trends-2026.jpg'
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
        name: 'What fashion content is trending on YouTube?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Style hauls, lookbooks, thrift finds, and budget fashion are currently seeing high engagement across all regions. Sustainable fashion and vintage styling are also trending strongly in 2026.'
        }
      },
      {
        '@type': 'Question',
        name: 'How do I grow my fashion channel?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Develop a unique personal style, provide styling inspiration, stay current with trends, and create visually appealing content. Consistency and authenticity are key to building a fashion audience.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is fashion content competitive on YouTube?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Fashion is highly competitive but personal style, sustainable fashion, and budget-friendly content offer opportunities. Finding your niche within fashion is crucial for success.'
        }
      },
      {
        '@type': 'Question',
        name: 'Who is the target audience for fashion content?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Fashion content primarily targets women aged 18-35, with growing interest from men in streetwear and professional styling. Audiences seek inspiration, shopping guidance, and personal style development.'
        }
      },
      {
        '@type': 'Question',
        name: 'What content formats work best for fashion?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Lookbooks, hauls, styling tutorials, thrift flips, and outfit-of-the-day videos perform best. Shorts showing quick styling tips are excellent for discovery and channel growth.'
        }
      },
      {
        '@type': 'Question',
        name: 'How competitive is the fashion category?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The fashion category has high competition but also high demand. Success requires finding a unique angle, whether through sustainable fashion, budget styling, or specific aesthetics like vintage or streetwear.'
        }
      },
      {
        '@type': 'Question',
        name: 'What are common mistakes in fashion content?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Common mistakes include poor lighting that hides clothing details, copying trends without adding personal style, neglecting diverse body types, and making content too promotional without providing value.'
        }
      },
      {
        '@type': 'Question',
        name: 'How can I monetize fashion content?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Fashion creators monetize through brand partnerships, affiliate marketing for clothing items, sponsored hauls, creating their own fashion lines, and Patreon for exclusive styling advice.'
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
        name: 'Fashion',
        item: 'https://tubefission.com/fashion'
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

export default async function FashionTrendsPage() {
  const region = await getRegion()
  const videos = await fetchTrendingVideos(region, 50)

  const fashionVideos = videos.filter((v: any) => {
    const text = `${v.snippet?.title || ''} ${v.snippet?.description || ''}`.toLowerCase()
    return FASHION_KEYWORDS.some((k) => text.includes(k))
  })

  const sortedFashion = [...fashionVideos].sort((a: any, b: any) => {
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
          <div className="text-lime-600 text-xs font-bold tracking-[0.2em] uppercase mb-2">👗 FASHION INTELLIGENCE</div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-gray-900">Fashion Trends</h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl leading-relaxed mb-6">
            Track viral fashion content before it peaks. Style guides, outfit ideas, and fashion inspiration with
            real-time velocity and competition analysis for fashion creators.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">👗 TRENDING</div>
              <div className="text-xl font-black text-gray-900">{sortedFashion.length}</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">⚡ AVG VELOCITY</div>
              <div className="text-xl font-black text-green-600">
                {sortedFashion.length > 0
                  ? `${Math.round(sortedFashion.reduce((s, v) => s + getViewVelocity(v), 0) / sortedFashion.length / 1000)}K/d`
                  : '0K/d'}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">📈 ENGAGEMENT</div>
              <div className="text-xl font-black text-yellow-600">
                {sortedFashion.length > 0
                  ? `${(sortedFashion.reduce((s, v) => s + getEngagementRate(v), 0) / sortedFashion.length).toFixed(2)}%`
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
            <span className="text-lime-600">🔥</span> Hot Fashion Niches Right Now
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: 'Style Hauls', icon: '🛍️', trend: '+33%', color: 'text-lime-600' },
              { name: 'Lookbooks', icon: '👔', trend: '+27%', color: 'text-green-600' },
              { name: 'Thrift Finds', icon: '♻️', trend: '+35%', color: 'text-emerald-600' },
              { name: 'Budget Fashion', icon: '💎', trend: '+29%', color: 'text-teal-600' },
            ].map((niche) => (
              <Link
                key={niche.name}
                href={`/tag/${niche.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:border-lime-400 hover:shadow-lg transition-all group"
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

        {/* Editorial Content Section */}
        <section className="mb-12 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 sm:p-8 border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">YouTube Fashion Content Trends 2026</h2>
          
          <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
            <p className="leading-relaxed">
              Fashion is one of the most visually compelling and commercially valuable categories on YouTube. In 2026, fashion content has evolved from traditional outfit showcases to diverse style expressions encompassing sustainable fashion, vintage aesthetics, streetwear culture, and professional styling. Successful fashion creators don't just display clothing—they communicate personal style and lifestyle aspirations that resonate deeply with their audiences.
            </p>
            
            <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">2026 Fashion Category Hot Topics</h3>
            
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-2">🌱 Sustainable & Secondhand Fashion</h4>
                <p className="text-sm text-gray-500">Eco-friendly fashion, thrifted clothing, and upcycling initiatives are gaining massive traction as viewers prioritize conscious consumption.</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-2">📻 Retro & Nostalgic Styles</h4>
                <p className="text-sm text-gray-500">Vintage aesthetics, throwback outfits, and retro brand reviews satisfy audiences seeking timeless fashion inspiration.</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-2">👟 Streetwear & Sneaker Culture</h4>
                <p className="text-sm text-gray-500">Urban fashion, hype brands, and sneaker collections continue dominating among younger demographics.</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-2">💼 Professional & Business Attire</h4>
                <p className="text-sm text-gray-500">Workplace styling, interview outfits, and corporate fashion provide consistent value to career-focused viewers.</p>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">Success Case Studies</h3>
            
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">👑</span>
                  <div>
                    <h4 className="font-bold text-gray-900">Zoella — Lifestyle + Fashion Pioneer</h4>
                    <p className="text-sm text-gray-500 mt-1">With 10M+ subscribers, Zoella built an empire combining lifestyle, fashion, and beauty content. Her success stems from relatability, diverse content formats, and successful brand extensions into fashion and beauty products.</p>
                    <p className="text-xs text-lime-600 mt-2 font-medium">Key Metrics: 500K+ average views, successful fashion brand launch</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎭</span>
                  <div>
                    <h4 className="font-bold text-gray-900">Safiya Nygaard — Fashion Experimentation</h4>
                    <p className="text-sm text-gray-500 mt-1">10M+ subscribers follow Safiya's bold fashion experiments and entertaining deep-dives into style trends. Her experimental approach combined with high production values creates viral, shareable content.</p>
                    <p className="text-xs text-lime-600 mt-2 font-medium">Key Metrics: 3M+ average views, fashion experimentation leader</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✨</span>
                  <div>
                    <h4 className="font-bold text-gray-900">Bestdressed — Vintage Fashion Authority</h4>
                    <p className="text-sm text-gray-500 mt-1">4M+ subscribers admire her vintage aesthetic, DIY skills, and authentic personal style. She proves that niche fashion content can build massive audiences when executed with creativity and consistency.</p>
                    <p className="text-xs text-lime-600 mt-2 font-medium">Key Metrics: 1M+ average views, vintage fashion icon</p>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">Content Strategy Recommendations</h3>
            
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-lime-600 font-bold">1.</span>
                <span><strong>Showcase Personal Style:</strong> Fashion content's core is authentic personal expression. Develop and communicate your unique fashion philosophy.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lime-600 font-bold">2.</span>
                <span><strong>Invest in Visual Quality:</strong> Fashion is inherently visual. Professional photography, lighting, and set design significantly elevate content appeal.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lime-600 font-bold">3.</span>
                <span><strong>Provide Practical Value:</strong> Successful fashion content offers actionable advice—styling tips, shopping guides, and wardrobe building strategies.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lime-600 font-bold">4.</span>
                <span><strong>Build Fashion Community:</strong> Fashion enthusiasts love sharing and discussing. Foster community through comments, style challenges, and interactive content.</span>
              </li>
            </ul>

            <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">How to Succeed in Fashion</h3>
            
            <div className="bg-lime-50 rounded-xl p-4 border border-lime-200">
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong>Find Your Fashion Niche:</strong> Fashion is vast—choose a specific area to dominate, whether that's sustainable fashion, streetwear, professional styling, or vintage aesthetics. 
                <strong>Optimize for SEO:</strong> Fashion keywords like "outfit ideas," "fashion tips," and style names drive significant search traffic. 
                <strong>Leverage Shorts:</strong> Clip styling highlights into Shorts to drive discovery and funnel viewers to full videos. 
                <strong>Build Brand Relationships:</strong> Fashion content's commercial value lies in brand partnerships. Develop relationships with fashion brands early. 
                <strong>Diversify Revenue:</strong> Beyond ads, explore affiliate marketing, brand collaborations, and launching your own fashion line.
              </p>
            </div>
          </div>
        </section>

        {/* Trending Videos */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
            <span className="text-lime-600">🔥</span> Trending Fashion Videos
          </h2>

          {sortedFashion.length === 0 && (
            <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
              <div className="text-gray-500 mb-2">No fashion videos in trending right now.</div>
              <Link href="/trending" className="text-lime-600 hover:text-lime-500 text-sm font-medium">
                Check all trends →
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {sortedFashion.slice(0, 9).map((video: any) => {
              const velocity = getViewVelocity(video)
              const engagement = getEngagementRate(video)
              const insights = getFashionInsights(video.snippet?.title || '')
              return (
                <Link key={video.id} href={`/video/${video.id}`} className="group block">
                  <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 hover:border-lime-400 hover:shadow-lg transition-all h-full">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={video.snippet?.thumbnails?.high?.url || video.snippet?.thumbnails?.medium?.url}
                        alt={video.snippet?.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 bg-lime-500/90 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold">
                        👗 FASHION
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-lg text-[10px] font-medium">
                        👁️ {formatNumber(video.statistics?.viewCount)}
                      </div>
                    </div>
                    <div className="p-3 sm:p-5">
                      <h3 className="font-bold text-sm sm:text-base line-clamp-2 mb-2 group-hover:text-lime-600 transition-colors text-gray-900">
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
            <span className="text-green-600">💡</span> Fashion Creator Tips
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-gray-700">🎯 Best Upload Times</h3>
              <ul className="text-gray-500 text-xs space-y-1">
                <li>• Sunday evenings: 6 PM - 9 PM (week prep)</li>
                <li>• Wednesday: 12 PM - 3 PM (mid-week inspiration)</li>
                <li>• Season transitions: Peak fashion interest</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-gray-700">📈 Trending Formats</h3>
              <ul className="text-gray-500 text-xs space-y-1">
                <li>• "[Number] ways to style [item]"</li>
                <li>• "Thrift flip: [before] to [after]"</li>
                <li>• "[Season] trends you need to know"</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ - 8 Questions */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'What fashion content is trending on YouTube?', a: 'Style hauls, lookbooks, thrift finds, and budget fashion are currently seeing high engagement across all regions. Sustainable fashion and vintage styling are also trending strongly in 2026.' },
              { q: 'How do I grow my fashion channel?', a: 'Develop a unique personal style, provide styling inspiration, stay current with trends, and create visually appealing content. Consistency and authenticity are key to building a fashion audience.' },
              { q: 'Is fashion content competitive on YouTube?', a: 'Fashion is highly competitive but personal style, sustainable fashion, and budget-friendly content offer opportunities. Finding your niche within fashion is crucial for success.' },
              { q: 'Who is the target audience for fashion content?', a: 'Fashion content primarily targets women aged 18-35, with growing interest from men in streetwear and professional styling. Audiences seek inspiration, shopping guidance, and personal style development.' },
              { q: 'What content formats work best for fashion?', a: 'Lookbooks, hauls, styling tutorials, thrift flips, and outfit-of-the-day videos perform best. Shorts showing quick styling tips are excellent for discovery and channel growth.' },
              { q: 'How competitive is the fashion category?', a: 'The fashion category has high competition but also high demand. Success requires finding a unique angle, whether through sustainable fashion, budget styling, or specific aesthetics like vintage or streetwear.' },
              { q: 'What are common mistakes in fashion content?', a: 'Common mistakes include poor lighting that hides clothing details, copying trends without adding personal style, neglecting diverse body types, and making content too promotional without providing value.' },
              { q: 'How can I monetize fashion content?', a: 'Fashion creators monetize through brand partnerships, affiliate marketing for clothing items, sponsored hauls, creating their own fashion lines, and Patreon for exclusive styling advice.' },
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
          <h2 className="text-xl font-bold mb-2 text-gray-900">Ready to Grow Your Fashion Channel?</h2>
          <p className="text-gray-500 text-sm mb-4 max-w-xl mx-auto">
            Get early access to viral fashion trends before your competition.
          </p>
          <Link
            href="/trends"
            className="inline-flex items-center gap-2 px-6 py-3 bg-lime-600 text-white rounded-xl font-bold text-sm hover:bg-lime-700 transition shadow-lg"
          >
            Explore All Trends →
          </Link>
        </div>
      </div>
    </main>
  )
}
