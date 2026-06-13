import type { Metadata } from 'next'
import Link from 'next/link'
import RegionSelectorBar from '@/app/components/RegionSelectorBar'
import { getViewVelocity, getEngagementRate } from '@/lib/analytics'
import { fetchTrendingVideos } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'


export const metadata: Metadata = {
  title: 'Comedy YouTube Trends 2026 | Viral Comedy Videos',
  description: 'Track the fastest-growing comedy content on YouTube. Funny videos, sketches, and entertainment content with real-time creator intelligence.',
  keywords: ['comedy trends', 'funny videos', 'humor', 'sketch', 'entertainment', 'youtube comedy'],
}

function formatNumber(n: string | undefined) {
  const num = Number(n || 0)
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return num.toLocaleString()
}

function getComedyInsights(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('sketch') || t.includes('skit')) return 'Sketch comedy leverages relatable situations. Everyday scenarios with unexpected twists create shareable moments.'
  if (t.includes('prank') || t.includes('troll')) return 'Prank content thrives on surprise reactions. Authentic responses outperform staged scenarios significantly.'
  if (t.includes('react') || t.includes('reaction')) return 'Reaction comedy leverages existing content. Commentary and genuine reactions add comedic value.'
  if (t.includes('meme') || t.includes('trend')) return 'Meme-based comedy stays culturally relevant. Timely references to current events drive discovery.'
  if (t.includes('stand') || t.includes('comic')) return 'Stand-up style content showcases personality. Unique perspectives and delivery create loyal fanbases.'
  if (t.includes('parody') || t.includes('spoof')) return 'Parody content rides existing popularity. Familiar formats with comedic twists attract built-in audiences.'
  return 'Comedy content succeeds with timing and relatability. Shareability drives viral success in this category.'
}

const COMEDY_KEYWORDS = [
  'comedy', 'funny', 'humor', 'sketch', 'entertainment', 'laugh',
  'hilarious', 'joke', 'prank', 'react', 'meme', 'parody', 'spoof',
  'stand up', 'comic', 'satire', 'comedic', 'lol'
]

// Schema markup data
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  'headline': 'Comedy YouTube Trends 2026',
  'description': 'Discover the latest trends in YouTube comedy content including Shorts comedy, sketches, reaction videos, and viral funny content strategies.',
  'author': {
    '@type': 'Organization',
    'name': 'Tubefission'
  },
  'datePublished': '2026-06-14',
  'articleSection': 'Comedy'
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': [
    {
      '@type': 'Question',
      'name': 'What comedy content is trending on YouTube?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Sketch comedy, reaction videos, meme-based content, and parody videos are currently seeing high engagement across all regions. Shorts comedy with 15-60 second formats is experiencing explosive growth in 2026.'
      }
    },
    {
      '@type': 'Question',
      'name': 'How do I make my comedy videos go viral?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Focus on relatable situations, perfect timing, shareable moments, and staying current with cultural trends and memes. The first 30 seconds are crucial for hooking viewers.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Is comedy content competitive on YouTube?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Comedy is extremely competitive with high barriers to entry. Success requires unique humor, consistent style, and viral distribution strategies to build loyal audiences.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Who is the target audience for comedy content?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Comedy audiences are primarily young viewers aged 13-30, with a slight male skew (55% vs 45%). Major markets include the US, UK, Canada, and Australia. These viewers seek entertainment and relaxation while actively sharing funny content.'
      }
    },
    {
      '@type': 'Question',
      'name': 'What content formats work best for comedy?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Top formats include: Shorts (15-60s) for viral potential, sketches (5-15 min) as the mainstream format, reaction videos (10-20 min) for steady traffic, parodies (5-12 min) with viral potential, and commentary comedy (10-20 min) for deeper engagement.'
      }
    },
    {
      '@type': 'Question',
      'name': 'How competitive is the comedy category?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'The comedy category has extremely high competition (5/5 stars). Entry difficulty is very high due to established creators and viral content dominance. Success requires unique positioning, consistent innovation, and strong community building.'
      }
    },
    {
      '@type': 'Question',
      'name': 'What are common mistakes in comedy content?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Common mistakes include: blindly following trends without originality, poor comedic timing and pacing, weak opening 30 seconds, over-reliance on sensitive topics, neglecting audience interaction, prioritizing quantity over quality, and failing to build community engagement.'
      }
    },
    {
      '@type': 'Question',
      'name': 'How can I monetize comedy content?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Monetization strategies include: AdSense revenue (CPM $4-10), brand partnerships with entertainment and gaming brands, merchandise sales featuring comedy catchphrases, live performance income, channel memberships for exclusive content, and content licensing deals.'
      }
    }
  ]
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': [
    {
      '@type': 'ListItem',
      'position': 1,
      'name': 'Home',
      'item': 'https://tubefission.com/'
    },
    {
      '@type': 'ListItem',
      'position': 2,
      'name': 'Comedy',
      'item': 'https://tubefission.com/comedy'
    }
  ]
}

export default async function ComedyTrendsPage() {
  const region = await getRegion()
  const videos = await fetchTrendingVideos(region, 50)

  const comedyVideos = videos.filter((v: any) => {
    const text = `${v.snippet?.title || ''} ${v.snippet?.description || ''}`.toLowerCase()
    return COMEDY_KEYWORDS.some((k) => text.includes(k))
  })

  const sortedComedy = [...comedyVideos].sort((a: any, b: any) => {
    const velA = getViewVelocity(a)
    const velB = getViewVelocity(b)
    return velB - velA
  })

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Comedy</span>
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
          <div className="text-rose-600 text-xs font-bold tracking-[0.2em] uppercase mb-2">😂 COMEDY INTELLIGENCE</div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-gray-900">Comedy Trends</h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl leading-relaxed mb-6">
            Track viral comedy content before it peaks. Funny videos, sketches, and entertainment content with
            real-time velocity and competition analysis for comedy creators.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">😂 TRENDING</div>
              <div className="text-xl font-black text-gray-900">{sortedComedy.length}</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">⚡ AVG VELOCITY</div>
              <div className="text-xl font-black text-green-600">
                {sortedComedy.length > 0
                  ? `${Math.round(sortedComedy.reduce((s, v) => s + getViewVelocity(v), 0) / sortedComedy.length / 1000)}K/d`
                  : '0K/d'}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">📈 ENGAGEMENT</div>
              <div className="text-xl font-black text-yellow-600">
                {sortedComedy.length > 0
                  ? `${(sortedComedy.reduce((s, v) => s + getEngagementRate(v), 0) / sortedComedy.length).toFixed(2)}%`
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
            <span className="text-rose-600">🔥</span> Hot Comedy Niches Right Now
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: 'Sketch Comedy', icon: '🎭', trend: '+33%', color: 'text-rose-600' },
              { name: 'Reaction Videos', icon: '😮', trend: '+27%', color: 'text-pink-600' },
              { name: 'Meme Content', icon: '🐸', trend: '+31%', color: 'text-purple-600' },
              { name: 'Parody Videos', icon: '🎬', trend: '+24%', color: 'text-fuchsia-600' },
            ].map((niche) => (
              <Link
                key={niche.name}
                href={`/tag/${niche.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:border-rose-400 hover:shadow-lg transition-all group"
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
            <span className="text-rose-600">🔥</span> Trending Comedy Videos
          </h2>

          {sortedComedy.length === 0 && (
            <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
              <div className="text-gray-500 mb-2">No comedy videos in trending right now.</div>
              <Link href="/trending" className="text-rose-600 hover:text-rose-500 text-sm font-medium">
                Check all trends →
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {sortedComedy.slice(0, 9).map((video: any) => {
              const velocity = getViewVelocity(video)
              const engagement = getEngagementRate(video)
              const insights = getComedyInsights(video.snippet?.title || '')
              return (
                <Link key={video.id} href={`/video/${video.id}`} className="group block">
                  <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 hover:border-rose-400 hover:shadow-lg transition-all h-full">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={video.snippet?.thumbnails?.high?.url || video.snippet?.thumbnails?.medium?.url}
                        alt={video.snippet?.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 bg-rose-500/90 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold">
                        😂 COMEDY
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-lg text-[10px] font-medium">
                        👁️ {formatNumber(video.statistics?.viewCount)}
                      </div>
                    </div>
                    <div className="p-3 sm:p-5">
                      <h3 className="font-bold text-sm sm:text-base line-clamp-2 mb-2 group-hover:text-rose-600 transition-colors text-gray-900">
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

        {/* Editorial Content - YouTube Comedy Trends 2026 */}
        <article className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">YouTube Comedy Content Trends 2026</h2>
          
          <div className="prose prose-sm max-w-none text-gray-600">
            <p className="mb-4 leading-relaxed">
              Comedy is one of the most entertaining and viral-potential categories on YouTube. In 2026, comedy content has evolved from traditional funny videos into diverse entertainment formats, including skits, parodies, reaction videos, and comedic commentary. Successful comedy creators don't just make people laugh—they build unique personal brands that resonate with millions.
            </p>

            <h3 className="text-lg font-bold mt-6 mb-3 text-gray-900">2026 Comedy Category Hot Topics Analysis</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">1. Shorts Comedy Explosion</h4>
                <p className="text-gray-600">
                  15-60 second funny short videos have exploded in growth in 2026. Quick punchlines, visual gags, and unexpected twists in short formats have become major traffic drivers.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">2. Skits and Scripted Comedy</h4>
                <p className="text-gray-600">
                  Scripted short-form content continues to thrive in 2026. From everyday humor to social satire, skit formats provide greater creative space for storytellers.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">3. Reaction and Commentary Comedy</h4>
                <p className="text-gray-600">
                  Commenting on trending topics with humor, video reactions, and funny commentary combines timeliness with entertainment value.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">4. Parody and Spoof</h4>
                <p className="text-gray-600">
                  Parodying popular content, impersonating celebrities, and funny dubbing have viral spread potential.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">5. Dark Humor and Satire</h4>
                <p className="text-gray-600">
                  Dark humor, social satire, and political satire for adult audiences attract highly engaged viewers.
                </p>
              </div>
            </div>

            <h3 className="text-lg font-bold mt-6 mb-3 text-gray-900">Success Case Studies</h3>
            
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-2">PewDiePie</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Subscribers: 110M+</li>
                  <li>• Strategy: Gaming + Comedy + Reactions</li>
                  <li>• Success: Early entry + Distinct personality</li>
                  <li>• Avg views: 5M+ per video</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-2">MrBeast</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Subscribers: 300M+</li>
                  <li>• Strategy: Challenges + Charity + Comedy</li>
                  <li>• Success: Unlimited creativity + Production quality</li>
                  <li>• Avg views: 100M+ per video</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-2">Smosh</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Subscribers: 26M+</li>
                  <li>• Strategy: Skits + Parodies + Series</li>
                  <li>• Success: Early accumulation + Team creation</li>
                  <li>• Avg views: 500K+ per video</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-2">Danny Gonzalez</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Subscribers: 6M+</li>
                  <li>• Strategy: Commentary + Satire + Music</li>
                  <li>• Success: Unique perspective + Musical talent</li>
                  <li>• Avg views: 1M+ per video</li>
                </ul>
              </div>
            </div>

            <h3 className="text-lg font-bold mt-6 mb-3 text-gray-900">Content Strategy Recommendations</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex gap-3">
                <span className="text-rose-600 font-bold">1.</span>
                <div>
                  <span className="font-semibold text-gray-900">Find Your Comedy Voice:</span>
                  <span className="text-gray-600"> Comedy is deeply personal. Discover your unique humor style—whether satirical, absurd, observational, or physical comedy.</span>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-rose-600 font-bold">2.</span>
                <div>
                  <span className="font-semibold text-gray-900">Master Timing and Pacing:</span>
                  <span className="text-gray-600"> Comedy is the art of timing. Learn comedic rhythm—punchline setup, pauses, and twists.</span>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-rose-600 font-bold">3.</span>
                <div>
                  <span className="font-semibold text-gray-900">Know Your Audience:</span>
                  <span className="text-gray-600"> Different audiences have different humor preferences. Understand your target viewers and create content that resonates with them.</span>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-rose-600 font-bold">4.</span>
                <div>
                  <span className="font-semibold text-gray-900">Stay Original:</span>
                  <span className="text-gray-600"> While you can reference trends, originality is key to comedy success. Avoid excessive imitation—create unique content.</span>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-bold mt-6 mb-3 text-gray-900">How to Succeed in the Comedy Category</h3>
            
            <div className="bg-rose-50 rounded-lg p-4 mb-4">
              <ul className="space-y-2 text-gray-700">
                <li className="flex gap-2">
                  <span className="text-rose-600">✓</span>
                  <span><strong>Capture the First 30 Seconds:</strong> The opening is critical. Quickly establish humor or suspense to hook viewers.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-600">✓</span>
                  <span><strong>Use Shorts for Traffic:</strong> Clip highlights from long videos into Shorts to drive traffic to full content.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-600">✓</span>
                  <span><strong>Build Series Content:</strong> Series comedy (recurring characters, formats) builds audience anticipation and subscription conversion.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-600">✓</span>
                  <span><strong>Engage with Your Audience:</strong> Comedy viewers love participation. Build connections through comments, community posts, and viewer submissions.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-600">✓</span>
                  <span><strong>Maintain Consistent Publishing:</strong> Comedy needs fresh content. Establish a sustainable publishing schedule.</span>
                </li>
              </ul>
            </div>

            {/* Data Insights */}
            <h3 className="text-lg font-bold mt-6 mb-3 text-gray-900">Category Performance Metrics</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs mb-4">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-2 font-semibold">Metric</th>
                    <th className="text-left p-2 font-semibold">Value</th>
                    <th className="text-left p-2 font-semibold">Industry Comparison</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="p-2">Average Views</td>
                    <td className="p-2 font-medium">800K-3M</td>
                    <td className="p-2 text-green-600">+200% above platform average</td>
                  </tr>
                  <tr>
                    <td className="p-2">Engagement Rate</td>
                    <td className="p-2 font-medium">6.0%-9.0%</td>
                    <td className="p-2 text-green-600">+150% above platform average</td>
                  </tr>
                  <tr>
                    <td className="p-2">Avg Watch Time</td>
                    <td className="p-2 font-medium">6-12 min</td>
                    <td className="p-2 text-gray-500">On par with platform average</td>
                  </tr>
                  <tr>
                    <td className="p-2">Subscription Conversion</td>
                    <td className="p-2 font-medium">2.5%-4.5%</td>
                    <td className="p-2 text-green-600">+120% above platform average</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              <strong>Best Publishing Times:</strong> Friday-Sunday, 6:00 PM - 10:00 PM. Weekend traffic significantly exceeds weekdays.
            </p>
          </div>
        </article>

        {/* Creator Tips */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
            <span className="text-green-600">💡</span> Comedy Creator Tips
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-gray-700">🎯 Best Upload Times</h3>
              <ul className="text-gray-500 text-xs space-y-1">
                <li>• Friday evenings: 6 PM - 9 PM (weekend wind-down)</li>
                <li>• Weekends: 2 PM - 6 PM (peak leisure time)</li>
                <li>• Trending moments: Within hours of viral events</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-gray-700">📈 Trending Formats</h3>
              <ul className="text-gray-500 text-xs space-y-1">
                <li>• "When [relatable situation] happens"</li>
                <li>• "POV: You're [character/scenario]"</li>
                <li>• "Types of [group] in [situation]"</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ - 8 Questions */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'What comedy content is trending on YouTube?', a: 'Sketch comedy, reaction videos, meme-based content, and parody videos are currently seeing high engagement across all regions. Shorts comedy with 15-60 second formats is experiencing explosive growth in 2026.' },
              { q: 'How do I make my comedy videos go viral?', a: 'Focus on relatable situations, perfect timing, shareable moments, and staying current with cultural trends and memes. The first 30 seconds are crucial for hooking viewers.' },
              { q: 'Is comedy content competitive on YouTube?', a: 'Comedy is extremely competitive with high barriers to entry. Success requires unique humor, consistent style, and viral distribution strategies to build loyal audiences.' },
              { q: 'Who is the target audience for comedy content?', a: 'Comedy audiences are primarily young viewers aged 13-30, with a slight male skew (55% vs 45%). Major markets include the US, UK, Canada, and Australia. These viewers seek entertainment and relaxation while actively sharing funny content.' },
              { q: 'What content formats work best for comedy?', a: 'Top formats include: Shorts (15-60s) for viral potential, sketches (5-15 min) as the mainstream format, reaction videos (10-20 min) for steady traffic, parodies (5-12 min) with viral potential, and commentary comedy (10-20 min) for deeper engagement.' },
              { q: 'How competitive is the comedy category?', a: 'The comedy category has extremely high competition (5/5 stars). Entry difficulty is very high due to established creators and viral content dominance. Success requires unique positioning, consistent innovation, and strong community building.' },
              { q: 'What are common mistakes in comedy content?', a: 'Common mistakes include: blindly following trends without originality, poor comedic timing and pacing, weak opening 30 seconds, over-reliance on sensitive topics, neglecting audience interaction, prioritizing quantity over quality, and failing to build community engagement.' },
              { q: 'How can I monetize comedy content?', a: 'Monetization strategies include: AdSense revenue (CPM $4-10), brand partnerships with entertainment and gaming brands, merchandise sales featuring comedy catchphrases, live performance income, channel memberships for exclusive content, and content licensing deals.' },
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
          <h2 className="text-xl font-bold mb-2 text-gray-900">Ready to Grow Your Comedy Channel?</h2>
          <p className="text-gray-500 text-sm mb-4 max-w-xl mx-auto">
            Get early access to viral comedy trends before your competition.
          </p>
          <Link
            href="/trends"
            className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-xl font-bold text-sm hover:bg-rose-700 transition shadow-lg"
          >
            Explore All Trends →
          </Link>
        </div>
      </div>
    </main>
  )
}
