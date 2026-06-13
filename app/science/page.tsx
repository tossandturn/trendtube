import type { Metadata } from 'next'
import Link from 'next/link'
import RegionSelectorBar from '@/app/components/RegionSelectorBar'
import { getViewVelocity, getEngagementRate } from '@/lib/analytics'
import { fetchTrendingVideos } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'


export const metadata: Metadata = {
  title: 'Science YouTube Trends 2026 | Viral Science Videos',
  description: 'Track the fastest-growing science content on YouTube. Scientific discoveries, experiments, and educational content with real-time creator intelligence.',
  keywords: ['science trends', 'experiment', 'discovery', 'research', 'education', 'youtube science', 'scientific', 'science explained', 'science education', 'science communication'],
}

function formatNumber(n: string | undefined) {
  const num = Number(n || 0)
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return num.toLocaleString()
}

function getScienceInsights(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('experiment') || t.includes('test')) return 'Experiment content provides visual proof. Hands-on demonstrations make abstract concepts concrete and memorable.'
  if (t.includes('explain') || t.includes('how') || t.includes('why')) return 'Explanation content satisfies curiosity. Breaking down complex topics into understandable pieces drives engagement.'
  if (t.includes('mystery') || t.includes('unsolved') || t.includes('strange')) return 'Mystery content leverages curiosity gaps. Unanswered questions keep viewers watching until the end.'
  if (t.includes('space') || t.includes('universe') || t.includes('planet')) return 'Space content inspires awe and wonder. The vastness of the cosmos creates emotional connections.'
  if (t.includes('mind') || t.includes('brain') || t.includes('psychology')) return 'Mind science content feels personally relevant. Understanding ourselves creates strong engagement.'
  if (t.includes('debunk') || t.includes('myth') || t.includes('fact')) return 'Myth-busting content provides clarity. Correcting misconceptions satisfies the need for accurate knowledge.'
  if (t.includes('ai') || t.includes('quantum') || t.includes('biotech')) return 'Frontier science content captivates audiences with the cutting edge of human knowledge. Future-facing topics drive shares and comments.'
  if (t.includes('climate') || t.includes('environment') || t.includes('sustainability')) return 'Climate science content connects to everyday life. Environmental topics create urgency and emotional investment from viewers.'
  return 'Science content succeeds with wonder and clarity. Making the complex accessible drives educational engagement.'
}

const SCIENCE_KEYWORDS = [
  'science', 'experiment', 'discovery', 'research', 'education', 'physics',
  'chemistry', 'biology', 'space', 'universe', 'planet', 'nature',
  'technology', 'innovation', 'study', 'theory', 'fact', 'knowledge',
  'quantum', 'climate', 'brain', 'evolution', 'dna', 'genetics',
  'astronomy', 'cosmos', 'hypothesis', 'laboratory', 'scientific'
]

// Schema Markup Components
function ArticleSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Science YouTube Trends 2026',
    description: 'Discover the latest trends in YouTube science content including scientific discoveries, experiments, AI frontiers, and educational content with creator intelligence.',
    author: {
      '@type': 'Organization',
      name: 'Tubefission'
    },
    datePublished: '2026-06-14',
    dateModified: '2026-06-14',
    articleSection: 'Science',
    keywords: 'science trends, science explained, youtube science, science experiments, science education, science communication, science discovery'
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
        name: 'What science content is trending on YouTube?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Experiments, space content, mysteries, and mind science are currently seeing high engagement across all regions. AI and frontier science content is experiencing explosive growth in 2026.'
        }
      },
      {
        '@type': 'Question',
        name: 'How do I make science content engaging?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Use visual demonstrations, connect to everyday experiences, create wonder and curiosity, and explain complex topics simply. Balance scientific rigor with accessibility and invest in high-quality visual aids like animations and experiments.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is science content competitive on YouTube?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Science has medium competition overall. While established channels dominate mainstream topics, specific sub-niches like frontier AI science, climate research, and specialized experiments offer opportunities for new creators to establish authority.'
        }
      },
      {
        '@type': 'Question',
        name: 'Who is the target audience for science content?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Science audiences span a wide age range, with core viewers aged 18-40. The audience skews slightly male (55% vs 45%) and is primarily concentrated in the US, UK, Canada, Germany, and India. Viewers seek knowledge, curiosity satisfaction, and scientific literacy improvement.'
        }
      },
      {
        '@type': 'Question',
        name: 'What content formats work best for science?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Science explanations (10-20 minutes) are the most mainstream format, followed by experiment demonstrations (8-15 minutes), science news (8-15 minutes), deep dives (15-30 minutes), Q&A formats (10-15 minutes), and animated explanations (5-10 minutes).'
        }
      },
      {
        '@type': 'Question',
        name: 'How competitive is the science category?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The science category has medium competition (3/5 stars). Entry difficulty is medium-high. Success requires scientific rigor combined with visual presentation and curiosity-driven storytelling. The recommended strategy is to specialize in a sub-field and build scientific authority.'
        }
      },
      {
        '@type': 'Question',
        name: 'What are common mistakes in science content?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Common mistakes include making content too technical for general audiences, neglecting scientific rigor, lacking visual presentations, not engaging with viewers, letting content become outdated, ignoring SEO optimization, and failing to cite reliable sources.'
        }
      },
      {
        '@type': 'Question',
        name: 'How can I monetize science content?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Science content monetizes through AdSense (CPM $5-12), brand partnerships with science and education brands, book publishing for popular science titles, speaking engagements at science communication events, online course sales, and channel memberships for exclusive content.'
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
        name: 'Science',
        item: 'https://tubefission.com/science'
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

export default async function ScienceTrendsPage() {
  const region = await getRegion()
  const videos = await fetchTrendingVideos(region, 50)

  const scienceVideos = videos.filter((v: any) => {
    const text = `${v.snippet?.title || ''} ${v.snippet?.description || ''}`.toLowerCase()
    return SCIENCE_KEYWORDS.some((k) => text.includes(k))
  })

  const sortedScience = [...scienceVideos].sort((a: any, b: any) => {
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
          <div className="text-sky-600 text-xs font-bold tracking-[0.2em] uppercase mb-2">🔬 SCIENCE INTELLIGENCE</div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-gray-900">Science Trends</h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl leading-relaxed mb-6">
            Track viral science content before it peaks. Scientific discoveries, experiments, and educational content with
            real-time velocity and competition analysis for science creators.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">🔬 TRENDING</div>
              <div className="text-xl font-black text-gray-900">{sortedScience.length}</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">⚡ AVG VELOCITY</div>
              <div className="text-xl font-black text-green-600">
                {sortedScience.length > 0
                  ? `${Math.round(sortedScience.reduce((s, v) => s + getViewVelocity(v), 0) / sortedScience.length / 1000)}K/d`
                  : '0K/d'}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">📈 ENGAGEMENT</div>
              <div className="text-xl font-black text-yellow-600">
                {sortedScience.length > 0
                  ? `${(sortedScience.reduce((s, v) => s + getEngagementRate(v), 0) / sortedScience.length).toFixed(2)}%`
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
            <span className="text-sky-600">🔥</span> Hot Science Niches Right Now
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: 'AI & Frontier Tech', icon: '🤖', trend: '+38%', color: 'text-sky-600' },
              { name: 'Space Exploration', icon: '🚀', trend: '+36%', color: 'text-blue-600' },
              { name: 'Climate Science', icon: '🌍', trend: '+28%', color: 'text-green-600' },
              { name: 'Health & Medicine', icon: '🧬', trend: '+33%', color: 'text-violet-600' },
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

        {/* Trending Videos */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
            <span className="text-sky-600">🔥</span> Trending Science Videos
          </h2>

          {sortedScience.length === 0 && (
            <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
              <div className="text-gray-500 mb-2">No science videos in trending right now.</div>
              <Link href="/trending" className="text-sky-600 hover:text-sky-500 text-sm font-medium">
                Check all trends →
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {sortedScience.slice(0, 9).map((video: any) => {
              const velocity = getViewVelocity(video)
              const engagement = getEngagementRate(video)
              const insights = getScienceInsights(video.snippet?.title || '')
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
                        🔬 SCIENCE
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

        {/* Editorial Content Section */}
        <section className="mb-8 sm:mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">YouTube Science Content Trends 2026</h2>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-6">
              Science is one of the most educationally valuable and socially impactful categories on YouTube. In 2026, 
              science content has evolved from traditional knowledge lectures into diverse science communication forms 
              including experiment demonstrations, scientific news, scientist interviews, and science history. Successful 
              science creators don't just transmit knowledge—they ignite curiosity and the scientific spirit in their 
              audiences, creating a lasting impact that extends far beyond the screen.
            </p>

            <p className="text-gray-600 leading-relaxed mb-6">
              The science category on YouTube has undergone a remarkable transformation. Where once it was dominated by 
              university lectures and documentary-style content, today's science landscape features dynamic creators who 
              combine rigorous research with entertainment, visual storytelling, and community engagement. The category 
              attracts viewers across all demographics—from students seeking to understand complex concepts, to professionals 
              staying current with scientific breakthroughs, to lifelong learners driven by pure curiosity. This engaged 
              audience creates significant monetization potential through advertising, sponsorships, educational partnerships, 
              and premium content offerings.
            </p>

            <p className="text-gray-600 leading-relaxed mb-6">
              What makes science content particularly valuable is its evergreen nature combined with constant discovery. 
              While entertainment videos may have short shelf lives, a comprehensive science explainer can continue 
              generating views for years as new students discover it. Additionally, the relentless pace of scientific 
              advancement ensures a never-ending stream of new discoveries, breakthroughs, and paradigm shifts to cover, 
              providing content creators with an infinite well of compelling topics to explore.
            </p>

            <h3 className="text-xl font-bold mb-4 text-gray-900">2026 Science Category Hot Topics</h3>
            
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="bg-sky-50 rounded-xl p-5">
                <h4 className="font-bold text-sky-900 mb-2">🤖 AI & Frontier Technology</h4>
                <p className="text-sky-800 text-sm leading-relaxed">
                  Artificial intelligence, quantum computing, and biotechnology frontier science content satisfies audiences' 
                  curiosity about future technology. These topics bridge science and technology, attracting both science 
                  enthusiasts and tech-curious mainstream viewers, making them among the highest-performing content in 2026.
                </p>
              </div>
              <div className="bg-green-50 rounded-xl p-5">
                <h4 className="font-bold text-green-900 mb-2">🌍 Climate Change & Environment</h4>
                <p className="text-green-800 text-sm leading-relaxed">
                  Climate change, environmental protection, and sustainable development content carries significant social 
                  importance. As climate events become more frequent and visible, audiences increasingly seek scientific 
                  understanding of these critical issues. This content creates emotional investment and drives meaningful 
                  viewer engagement.
                </p>
              </div>
              <div className="bg-indigo-50 rounded-xl p-5">
                <h4 className="font-bold text-indigo-900 mb-2">🚀 Space Exploration</h4>
                <p className="text-indigo-800 text-sm leading-relaxed">
                  Space exploration, astronomy, and space missions continue to captivate audiences with their inherent 
                  wonder and grandeur. New Mars missions, James Webb Space Telescope discoveries, and commercial space 
                  ventures provide constant fresh content that inspires awe and drives exceptional viewer retention.
                </p>
              </div>
              <div className="bg-rose-50 rounded-xl p-5">
                <h4 className="font-bold text-rose-900 mb-2">🧬 Health & Medicine</h4>
                <p className="text-rose-800 text-sm leading-relaxed">
                  Health science, medical advances, and mental health content has broad audience demand. Personal health 
                  topics create immediate relevance for viewers, while breakthrough medical research generates significant 
                  news interest. This sub-niche combines scientific rigor with deeply personal viewer connections.
                </p>
              </div>
              <div className="bg-purple-50 rounded-xl p-5 sm:col-span-2">
                <h4 className="font-bold text-purple-900 mb-2">🧪 Science Experiments & Demonstrations</h4>
                <p className="text-purple-800 text-sm leading-relaxed">
                  Fascinating science experiments, physics phenomena, and chemistry reaction demonstrations provide both 
                  visual spectacle and educational value. This format is uniquely suited to YouTube's visual medium, 
                  offering creators the opportunity to make abstract scientific concepts tangible and memorable through 
                  hands-on demonstrations that leave lasting impressions on viewers.
                </p>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-4 text-gray-900">Success Case Studies</h3>
            
            <div className="space-y-6 mb-8">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center text-xl font-bold text-sky-600">K</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">Kurzgesagt – In a Nutshell</h4>
                    <p className="text-gray-500 text-sm mb-2">24M+ Subscribers | Avg 5M+ views per video | Science Animation Leader</p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      <strong>Strategy:</strong> Science animation combined with complex topics and exceptionally high production 
                      quality. Kurzgesagt's success stems from transforming dense scientific subjects—from existential risks to 
                      the immune system—into visually stunning animated narratives. Their distinctive art style and meticulous 
                      research have made them the gold standard for science animation on YouTube.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl font-bold text-blue-600">V</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">Veritasium</h4>
                    <p className="text-gray-500 text-sm mb-2">16M+ Subscribers | Avg 2M+ views per video | Science Education Representative</p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      <strong>Strategy:</strong> Scientific phenomena combined with experiment demonstrations and deep explanation. 
                      Derek Muller built Veritasium by exploring counterintuitive science with rigorous experimentation. His 
                      approach of starting with common misconceptions and then revealing the surprising truth creates powerful 
                      narrative hooks that keep viewers engaged.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center text-xl font-bold text-violet-600">V</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">Vsauce</h4>
                    <p className="text-gray-500 text-sm mb-2">22M+ Subscribers | Avg 5M+ views per video | Science Education Benchmark</p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      <strong>Strategy:</strong> Scientific questions combined with deep exploration and philosophical thinking. 
                      Michael Stevens created a unique genre that blends hard science with philosophy, psychology, and mathematics. 
                      His signature style of asking seemingly simple questions and spiraling into profound scientific territory has 
                      made Vsauce one of the most iconic science channels on the platform.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-xl font-bold text-green-600">S</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">SciShow</h4>
                    <p className="text-gray-500 text-sm mb-2">8M+ Subscribers | 1000+ Videos | Science News Pioneer</p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      <strong>Strategy:</strong> Science news, Q&A format, and diverse topic coverage. Hosted by Hank Green and 
                      a team of science communicators, SciShow excels at covering breaking science news, answering viewer questions, 
                      and exploring a wide range of scientific topics in an accessible, engaging format. Their prolific output and 
                      consistent quality have established them as a reliable source for science communication.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-4 text-gray-900">Content Strategy Recommendations</h3>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">1.</span>
                  <span><strong>Balance Rigor with Accessibility:</strong> Science content needs to find equilibrium between 
                  scientific accuracy and mainstream accessibility. Too technical limits your audience; too simplified loses 
                  core educational value. The best science creators translate complex ideas without sacrificing accuracy.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">2.</span>
                  <span><strong>Invest in Visual Aids:</strong> Charts, animations, experiment demonstrations, and infographics 
                  significantly improve comprehension and retention of scientific content. Visual learning is central to how 
                  audiences absorb complex scientific information.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">3.</span>
                  <span><strong>Spark Curiosity:</strong> The core of science content is curiosity. Use question introductions, 
                  suspenseful hooks, surprising facts, and "what if" scenarios to ignite viewer curiosity from the first 
                  seconds of your video.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">4.</span>
                  <span><strong>Cite Reliable Sources:</strong> Science content demands credible sourcing. Include research paper 
                  links, data sources, and expert quotes to establish content credibility. Audiences increasingly value 
                  transparency in scientific claims.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">5.</span>
                  <span><strong>Develop a Distinctive Communication Style:</strong> Science communication is an art. Whether 
                  through animation, demonstration, storytelling, or dialogue, find a unique style that makes your science 
                  content instantly recognizable and shareable.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">6.</span>
                  <span><strong>Build Scientific Authority Over Time:</strong> Trust is the most valuable asset in science 
                  content. Consistently accurate information, transparent methodology, and willingness to correct errors 
                  builds long-term credibility that compounds over hundreds of videos.</span>
                </li>
              </ul>
            </div>

            <h3 className="text-xl font-bold mb-4 text-gray-900">How to Succeed in Science Content</h3>
            
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-2">🎯 Find Your Science Niche</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Science is an incredibly broad field. Choose a sub-discipline to specialize in—whether physics, biology, 
                  astronomy, or earth science. Deep expertise in a focused area builds authority faster than broad coverage 
                  of everything.
                </p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-2">🔍 Optimize for Scientific SEO</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  SEO is critical for science content. Include scientific concepts, "explained," and "science of" keywords 
                  in titles. These terms are primary drivers of search traffic from students, educators, and curious 
                  learners seeking scientific understanding.
                </p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-2">🎨 Leverage Visual Presentation</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Invest in animations, diagrams, experiment demonstrations, and high-quality visuals to elevate your 
                  content's appeal and comprehension. The science channels with the highest retention rates are those 
                  that make abstract concepts visually compelling.
                </p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-2">💬 Build a Science Community</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Science enthusiasts love to discuss and share. Build community through comment engagement, community 
                  posts, Q&A sessions, and live streams. A thriving community creates organic word-of-mouth growth and 
                  provides valuable feedback on content direction.
                </p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200 sm:col-span-2">
                <h4 className="font-bold text-gray-900 mb-2">💰 Diversify Revenue Sources</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Science content's commercial value extends well beyond ad revenue. Brand partnerships with science and 
                  education companies, popular science book publishing, speaking engagements at science communication 
                  events, online courses, and exclusive membership content all represent significant income streams for 
                  established science creators.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Creator Tips */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
            <span className="text-green-600">💡</span> Science Creator Tips
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-gray-700">🎯 Best Upload Times</h3>
              <ul className="text-gray-500 text-xs space-y-1">
                <li>• Tuesday-Thursday evenings: 6 PM - 9 PM (peak learning time)</li>
                <li>• Weekend mornings: 10 AM - 12 PM (curiosity browsing)</li>
                <li>• Breaking discoveries: Within 24 hours of news</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-gray-700">📈 Trending Formats</h3>
              <ul className="text-gray-500 text-xs space-y-1">
                <li>• "The science behind [everyday thing]"</li>
                <li>• "I tried [experiment] and here's what happened"</li>
                <li>• "What would happen if [scientific scenario]"</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ Section - 8 Questions */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { 
                q: 'What science content is trending on YouTube?', 
                a: 'Experiments, space content, mysteries, and mind science are currently seeing high engagement across all regions. AI and frontier science content is experiencing explosive growth in 2026.' 
              },
              { 
                q: 'How do I make science content engaging?', 
                a: 'Use visual demonstrations, connect to everyday experiences, create wonder and curiosity, and explain complex topics simply. Balance scientific rigor with accessibility and invest in high-quality visual aids like animations and experiments.' 
              },
              { 
                q: 'Is science content competitive on YouTube?', 
                a: 'Science has medium competition overall. While established channels dominate mainstream topics, specific sub-niches like frontier AI science, climate research, and specialized experiments offer opportunities for new creators to establish authority.' 
              },
              { 
                q: 'Who is the target audience for science content?', 
                a: 'Science audiences span a wide age range, with core viewers aged 18-40. The audience skews slightly male (55% vs 45%) and is primarily concentrated in the US, UK, Canada, Germany, and India. Viewers seek knowledge, curiosity satisfaction, and scientific literacy improvement.' 
              },
              { 
                q: 'What content formats work best for science?', 
                a: 'Science explanations (10-20 minutes) are the most mainstream format, followed by experiment demonstrations (8-15 minutes), science news (8-15 minutes), deep dives (15-30 minutes), Q&A formats (10-15 minutes), and animated explanations (5-10 minutes).' 
              },
              { 
                q: 'How competitive is the science category?', 
                a: 'The science category has medium competition (3/5 stars). Entry difficulty is medium-high. Success requires scientific rigor combined with visual presentation and curiosity-driven storytelling. The recommended strategy is to specialize in a sub-field and build scientific authority.' 
              },
              { 
                q: 'What are common mistakes in science content?', 
                a: 'Common mistakes include making content too technical for general audiences, neglecting scientific rigor, lacking visual presentations, not engaging with viewers, letting content become outdated, ignoring SEO optimization, and failing to cite reliable sources.' 
              },
              { 
                q: 'How can I monetize science content?', 
                a: 'Science content monetizes through AdSense (CPM $5-12), brand partnerships with science and education brands, book publishing for popular science titles, speaking engagements at science communication events, online course sales, and channel memberships for exclusive content.' 
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
            </Link>
            <Link href="/youtube-channel-analytics" className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="text-2xl mb-2">📈</div>
              <div className="text-sm font-medium text-gray-900">Channel Analytics</div>
            </Link>
            <Link href="/ai-assistant" className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="text-2xl mb-2">🤖</div>
              <div className="text-sm font-medium text-gray-900">AI Assistant</div>
            </Link>
            <Link href="/trends" className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="text-2xl mb-2">🔥</div>
              <div className="text-sm font-medium text-gray-900">Trend Database</div>
            </Link>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 text-center border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold mb-2 text-gray-900">Ready to Grow Your Science Channel?</h2>
          <p className="text-gray-500 text-sm mb-4 max-w-xl mx-auto">
            Get early access to viral science trends before your competition.
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
