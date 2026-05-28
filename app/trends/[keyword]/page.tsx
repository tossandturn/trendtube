import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { fetchTrendingVideos } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'
import { getViewVelocity, getEngagementRate, getTagColor, getTagEmoji } from '@/lib/analytics'
import { generateDailyRecommendations, getTodayString, getTimeBasedGreeting, REGIONAL_PREFERENCES } from '@/lib/recommendations'

interface TrendPageProps {
  params: Promise<{
    keyword: string
  }>
}

// Trend data knowledge base
const TREND_KNOWLEDGE: Record<string, {
  title: string
  description: string
  whyGrowing: string
  audienceProfile: string
  creatorOpportunity: string
  competitionAnalysis: string
  content: string
}> = {
  'ai-shorts': {
    title: 'AI Shorts Trends 2026',
    description: 'Discover viral AI-powered Shorts trends. From ChatGPT tutorials to AI-generated content, learn how creators are leveraging AI to grow fast.',
    whyGrowing: 'AI content is experiencing explosive growth due to mainstream adoption of ChatGPT, Midjourney, and other AI tools. Viewers are hungry for practical AI applications, productivity hacks, and tutorials. The barrier to create AI content is low while interest is at an all-time high, creating a perfect storm for early creators.',
    audienceProfile: 'Tech-curious millennials and Gen Z (ages 18-34) interested in productivity, side hustles, and staying ahead of technology trends. High engagement from developers, content creators, students, and professionals looking to leverage AI for work efficiency.',
    creatorOpportunity: 'First-mover advantage still exists. AI education content performs exceptionally well. Tutorial-style Shorts showing practical AI use cases get 3-5x higher engagement than traditional content. Faceless AI channels are exploding with low competition.',
    competitionAnalysis: 'Current competition is MODERATE with growing saturation. While many creators are jumping on AI trends, quality educational content is still scarce. Opportunity exists for deep-dive tutorials rather than surface-level "AI is crazy" content.',
    content: `
## The AI Shorts Revolution

Artificial Intelligence has fundamentally transformed how content is created and consumed on YouTube. AI Shorts represent one of the fastest-growing content categories, combining the viral potential of short-form video with the massive interest in AI technology.

### Why AI Shorts Are Exploding

The convergence of three factors has created an unprecedented opportunity:

1. **Mainstream AI Adoption**: ChatGPT reached 100 million users faster than any app in history. This massive user base is actively seeking tutorials and use cases.

2. **Low Production Barrier**: AI tools have democratized content creation. What previously required expensive software or professional skills can now be done in minutes.

3. **Algorithm Favor**: YouTube is actively promoting AI-related content as it drives high engagement and watch time.

### Content Categories That Work

**Tutorial Shorts** (Highest engagement)
- "How I built X in 60 seconds using AI"
- "This AI tool saves me 10 hours/week"
- "ChatGPT prompt that changed my workflow"

**Showcase Shorts**
- Before/after AI transformations
- Side-by-side AI vs human comparisons
- "AI predicted this trend"

**Reaction Shorts**
- Reacting to AI developments
- Testing viral AI tools
- "I asked AI to create my content"

### Optimization Strategies

For maximum reach on AI Shorts:

- Hook within 0.5 seconds with visual AI demonstration
- Use trending AI-related hashtags: #AI, #ChatGPT, #AITools
- Post when AI news breaks for maximum relevance
- Create series: "AI Tool of the Day", "ChatGPT Hacks"

The window for dominating this niche is closing as competition increases. Creators who establish authority now will benefit from compound algorithmic preference.
    `,
  },
  'gaming-youtube': {
    title: 'Gaming YouTube Trends 2026',
    description: 'Track the latest gaming trends on YouTube. From Minecraft builds to GTA updates, discover what gamers are watching right now.',
    whyGrowing: 'Gaming content remains YouTube\'s most consistent performer with 2.9 billion monthly active gaming viewers. New game releases, updates, and esports events create constant fresh content opportunities. The community aspect drives repeat viewership and engagement.',
    audienceProfile: 'Primarily Gen Z and millennials (ages 13-30) with high platform loyalty. Gamers watch multiple hours daily, subscribe to dozens of channels, and actively engage through comments and live chats. High purchase intent for games, hardware, and accessories.',
    creatorOpportunity: 'Gaming niches offer sustainable long-term growth. While major games are competitive, emerging indie games and specific game modes (speedrunning, challenge runs, builds) have lower competition. Consistent upload schedules build loyal audiences.',
    competitionAnalysis: 'Competition varies dramatically by game. Minecraft and Fortnite are HIGH competition with established creators dominating. New releases and indie games offer LOW competition windows for 2-4 weeks post-launch.',
    content: `
## Gaming Content Strategy

Gaming remains the backbone of YouTube content with unparalleled viewer engagement and monetization potential. Understanding current trends is essential for growth.

### Trending Gaming Formats

**Shorts Gaming** (Fastest growing segment)
- Clips from long-form content
- Epic moments and fails
- Quick tutorials and tips
- Reacting to game trailers

**Long-Form Retention Drivers**
- Let's Plays with personality
- Challenge runs and restrictions
- Build showcases and tutorials
- Analysis and commentary

**Live Streaming Highlights**
- Best moments compilations
- Subscriber interaction moments
- Tournament and event coverage

### Game-Specific Opportunities

**Minecraft**: Eternal evergreen with update-driven spikes
- Building tutorials remain high-performing
- Redstone contraptions attract technical viewers
- SMP and roleplay content builds community

**GTA**: Consistent performer with update waves
- RP servers create infinite content
- Challenge videos (survival, restricted)
- Vehicle showcases and customization

**Valorant/Fortnite**: Esports and skill-based
- Rank climbing series
- Pro player analysis
- Tutorial content for improvement

### Optimization Tips

- Title with specific game version/season
- Thumbnails showing emotion/reaction
- Series formatting for binge-watching
- Community posts between uploads
    `,
  },
  'mrbeast-style': {
    title: 'MrBeast-Style Video Trends 2026',
    description: 'Analyze high-production challenge videos. Learn the psychology behind viral challenges and extreme content formats.',
    whyGrowing: 'High-stakes challenge content triggers dopamine responses and completion bias. Viewers feel invested in outcomes. The format is highly shareable and drives massive engagement through suspense and emotional investment.',
    audienceProfile: 'Broad demographic appeal (ages 13-35) due to entertainment-first approach. High completion rates due to narrative tension. Viewers seeking escapism and vicarious experiences. Strong international appeal.',
    creatorOpportunity: 'High production value creates barriers to entry, protecting established creators. However, micro-budget versions can succeed with creative concepts. Collaboration potential is high. Sponsorship opportunities abundant.',
    competitionAnalysis: 'VERY HIGH competition at top tier. Entry-level creators can succeed with unique angles or local adaptations. Challenge formats are infinitely remixable. Originality in concept trumps production value at smaller scales.',
    content: `
## The MrBeast Effect

MrBeast revolutionized YouTube by proving that extreme production value combined with genuine generosity creates unmatched engagement. His formula has spawned an entire genre of content.

### Core Psychology Principles

**1. Stakes and Suspense**
Every video has clear stakes: "Will they survive?" "Who wins the money?" This creates narrative tension that keeps viewers watching.

**2. Visual Spectacle**
High production value signals credibility. Professional editing, multiple camera angles, and cinematic shots create premium feel.

**3. Emotional Payoff**
The generosity angle creates feel-good moments that viewers want to share. Positive emotions drive higher share rates.

### Adaptable Formats

**For Small Creators:**
- "$10 vs $100 Challenge" (budget versions)
- "Last to Stop [Activity] Wins"
- "Giving Strangers [Small Amount]"
- "Surviving 24 Hours in [Location]"

**Medium Budget:**
- Localized versions of popular challenges
- Collaborations pooling resources
- "I Survived [Difficult Thing]"
- "Transforming [Person/Thing]"

**Scale Considerations:**
- Start with concepts, scale production
- Focus on editing quality over budget
- Build audience before major investments
- Reinvest revenue into bigger concepts

### Common Success Patterns

- Clickable titles with clear value proposition
- Multiple camera coverage
- Fast-paced editing (jumps every 2-3 seconds)
- Background music building to moments
- Genuine reactions over scripted content
- Community involvement and callbacks
    `,
  },
  'youtube-automation': {
    title: 'YouTube Automation Trends 2026',
    description: 'Faceless channel strategies and automation workflows. Build scalable YouTube businesses without showing your face.',
    whyGrowing: 'Desire for passive income and location independence drives massive interest. AI tools have reduced content production barriers. Success stories of 6-figure faceless channels create aspirational pull. Business-minded creators see scalability potential.',
    audienceProfile: 'Aspiring entrepreneurs (ages 25-45) seeking passive income. Digital nomads and remote workers. Side-hustle seekers with limited time. Higher CPM due to business/finance focus. Repeat viewers seeking ongoing education.',
    creatorOpportunity: 'Faceless channels allow creators to build multiple channels simultaneously. Outsourcing potential enables scaling beyond individual capacity. Evergreen content provides long-term passive returns. Systematized approach is teachable.',
    competitionAnalysis: 'SATURATION IS INCREASING rapidly. Early mover advantage has passed for generic channels. Opportunity exists in sub-niches and hybrid approaches. Quality expectations are rising as competition increases.',
    content: `
## The Faceless Channel Business

YouTube automation represents a paradigm shift in content creation—separating personality from production to create scalable media businesses.

### Automation Model Components

**Content Systems:**
- Script writers using AI assistance
- Voiceover artists or AI voices
- Video editors with templates
- Thumbnail designers on retainer
- Upload managers handling scheduling

**Channel Types:**

1. **Compilation Channels**
   - Reddit stories with gameplay
   - Top 10 lists with stock footage
   - News commentary with B-roll

2. **Educational Channels**
   - Historical facts with visuals
   - Science explainers
   - Financial tutorials

3. **Entertainment Channels**
   - Animated stories
   - Mystery/unsolved cases
   - True crime narrations

### Critical Success Factors

**Script Quality**
- Hook in first 5 seconds
- Information density vs pacing
- Pattern interrupts every 30 seconds
- Clear structure: intro, points, CTA

**Voiceover**
- Consistent tone and energy
- Proper pronunciation and pacing
- Emotional variation
- Professional audio quality

**Visual Engagement**
- Changing visuals every 3-5 seconds
- Relevant B-roll matching narration
- Text overlays emphasizing key points
- Smooth transitions maintaining flow

### Scaling Strategy

1. Prove concept with 1 channel
2. Systematize and document processes
3. Hire for each role
4. Replicate model across niches
5. Build holding company structure

### Common Pitfalls

- Outsourcing too early
- Inconsistent upload schedules
- Ignoring analytics and feedback
- Copying saturated formats
- Neglecting thumbnail optimization
    `,
  },
}

// Default trend data generator
function generateTrendData(keyword: string) {
  const normalized = keyword.replace(/-/g, ' ')
  return {
    title: `${normalized.charAt(0).toUpperCase() + normalized.slice(1)} Trends 2026`,
    description: `Discover the latest trends in ${normalized}. Real-time analysis of what's working for creators right now.`,
    whyGrowing: `The ${normalized} space is experiencing significant growth due to changing viewer preferences and platform algorithm shifts. Early adopters are seeing exceptional results.`,
    audienceProfile: 'Mixed demographic with high engagement rates. Active community with strong sharing behavior.',
    creatorOpportunity: 'Moderate competition with room for quality creators. Early-stage opportunity window.',
    competitionAnalysis: 'Competition varies by sub-niche. Entry possible with differentiated approach.',
    content: `
## ${normalized.charAt(0).toUpperCase() + normalized.slice(1)} Content Strategy

This trending topic offers significant opportunities for creators who can deliver consistent, high-quality content.

### Why This Trend Matters

Content in this category is resonating with audiences due to its relevance and timeliness. Creators who establish authority early will benefit from algorithmic preference.

### Content Angles That Work

- Educational content teaching the topic
- Entertainment-focused approaches
- News and updates in the space
- Community-driven content

### Growth Strategies

- Post consistently during peak hours
- Engage with community through comments
- Collaborate with related creators
- Optimize titles and thumbnails for CTR
    `,
  }
}

export async function generateMetadata({ params }: TrendPageProps): Promise<Metadata> {
  const { keyword } = await params
  const trendData = TREND_KNOWLEDGE[keyword] || generateTrendData(keyword)

  return {
    title: `${trendData.title} | TubeFission`,
    description: trendData.description,
    keywords: `${keyword} trends, youtube ${keyword}, viral ${keyword} content, ${keyword} creators`,
    openGraph: {
      title: trendData.title,
      description: trendData.description,
      type: 'article',
    },
  }
}

function formatNumber(n: string | undefined) {
  const num = Number(n || 0)
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B'
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M'
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K'
  return num.toLocaleString()
}

export default async function TrendPage({ params }: TrendPageProps) {
  const { keyword } = await params
  const trendData = TREND_KNOWLEDGE[keyword] || generateTrendData(keyword)

  const region = await getRegion()
  const videos = await fetchTrendingVideos(region, 50)

  // Filter videos relevant to this trend
  const relevantVideos = videos.filter((v: any) => {
    const text = `${v.snippet?.title || ''} ${v.snippet?.description || ''}`.toLowerCase()
    return keyword.split('-').some((part: string) => text.includes(part))
  }).slice(0, 6)

  // Use top videos if no direct matches
  const displayVideos = relevantVideos.length > 0 ? relevantVideos : videos.slice(0, 6)

  // Generate daily recommendations for this trend
  const dailyRecommendations = generateDailyRecommendations(displayVideos, region, 3)
  const regionalPrefs = REGIONAL_PREFERENCES[region] || REGIONAL_PREFERENCES.US

  // Calculate analytics
  const totalViews = displayVideos.reduce((sum: number, v: any) => sum + Number(v.statistics?.viewCount || 0), 0)
  const avgEngagement = displayVideos.length > 0
    ? displayVideos.reduce((sum: number, v: any) => sum + getEngagementRate(v), 0) / displayVideos.length
    : 0
  const avgVelocity = displayVideos.length > 0
    ? displayVideos.reduce((sum: number, v: any) => sum + getViewVelocity(v), 0) / displayVideos.length
    : 0

  // Calculate velocity trend (simulated)
  const velocityData = displayVideos
    .map((v: any, i: number) => ({
      day: `Day ${i + 1}`,
      velocity: getViewVelocity(v),
      views: Number(v.statistics?.viewCount || 0),
    }))
    .sort((a: any, b: any) => b.velocity - a.velocity)
    .slice(0, 7)

  // Engagement vs Views data
  const engagementData = displayVideos.map((v: any) => ({
    views: Number(v.statistics?.viewCount || 0),
    engagement: getEngagementRate(v),
    title: v.snippet?.title || '',
  })).filter((d: any) => d.views > 0)

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-red-600">Home</Link>
          <span>→</span>
          <Link href="/trending" className="hover:text-red-600">Trends</Link>
          <span>→</span>
          <span className="text-gray-900">{trendData.title}</span>
        </nav>

        {/* Hero */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">{trendData.title}</h1>
          <p className="text-gray-600 text-lg max-w-3xl">{trendData.description}</p>
        </div>

        {/* Professional Analytics Dashboard */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-400 to-blue-600" />
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-gray-900">
              <span className="text-blue-600">📊</span> Trend Analytics Dashboard
            </h2>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">Total Views</div>
              <div className="text-2xl font-bold text-gray-900">{formatNumber(totalViews.toString())}</div>
              <div className="text-xs text-green-600">↗ Across analyzed videos</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">Avg Engagement</div>
              <div className="text-2xl font-bold text-yellow-600">{avgEngagement.toFixed(2)}%</div>
              <div className="text-xs text-gray-400">likes + comments</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">Avg Velocity</div>
              <div className="text-2xl font-bold text-green-600">
                {avgVelocity >= 1e6 ? (avgVelocity / 1e6).toFixed(1) + 'M' : avgVelocity >= 1e3 ? (avgVelocity / 1e3).toFixed(1) + 'K' : Math.round(avgVelocity)}
              </div>
              <div className="text-xs text-gray-400">views/day</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">Videos Tracked</div>
              <div className="text-2xl font-bold text-blue-600">{displayVideos.length}</div>
              <div className="text-xs text-gray-400">in this trend</div>
            </div>
          </div>

          {/* Analytics Charts */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Velocity Trend Chart */}
            <div className="glass-panel neon-border rounded-2xl p-5 sm:p-6 glow-hover">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider data-mono">⚡ VELOCITY ANALYSIS</h3>
                <span className="text-[10px] text-gray-500 data-mono">views/day</span>
              </div>
              <svg viewBox="0 0 520 200" className="w-full" preserveAspectRatio="xMidYMid meet">
                {(() => {
                  const width = 520
                  const height = 200
                  const margin = { top: 20, right: 60, bottom: 40, left: 80 }
                  const chartW = width - margin.left - margin.right
                  const chartH = height - margin.top - margin.bottom

                  const data = velocityData
                  if (data.length === 0) return <text x={width / 2} y={height / 2} fill="#9ca3af" fontSize="14" textAnchor="middle">No data</text>

                  const maxVelocity = Math.max(...data.map((d: any) => d.velocity), 1)
                  const barSlot = chartW / data.length
                  const barWidth = barSlot * 0.7
                  const barGap = barSlot * 0.3

                  return (
                    <>
                      <rect x={margin.left} y={margin.top} width={chartW} height={chartH} fill="#f3f4f6" opacity="0.5" rx="8" />
                      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
                        const y = margin.top + (1 - t) * chartH
                        const val = t * maxVelocity
                        return (
                          <g key={`grid-${i}`}>
                            <line x1={margin.left} y1={y} x2={margin.left + chartW} y2={y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2" />
                            <text x={margin.left - 8} y={y + 4} fill="#9ca3af" fontSize="10" textAnchor="end" fontFamily="monospace">
                              {val >= 1e6 ? (val / 1e6).toFixed(0) + 'M' : val >= 1e3 ? (val / 1e3).toFixed(0) + 'K' : Math.round(val)}
                            </text>
                          </g>
                        )
                      })}
                      {data.map((d: any, i: number) => {
                        const x = margin.left + i * barSlot + barGap / 2
                        const h = (d.velocity / maxVelocity) * chartH
                        const y = margin.top + chartH - h
                        return (
                          <g key={i}>
                            <rect x={x} y={y} width={barWidth} height={h} rx="4" fill="#dc2626" opacity="0.85" />
                            <text x={x + barWidth / 2} y={margin.top + chartH + 16} fill="#9ca3af" fontSize="10" textAnchor="middle" fontFamily="monospace">{d.day}</text>
                          </g>
                        )
                      })}
                    </>
                  )
                })()}
              </svg>
            </div>

            {/* Engagement Scatter Plot */}
            <div className="glass-panel neon-border rounded-2xl p-5 sm:p-6 glow-hover">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider data-mono">📈 ENGAGEMENT VS VIEWS</h3>
                <span className="text-[10px] text-gray-500 data-mono">correlation analysis</span>
              </div>
              <svg viewBox="0 0 520 200" className="w-full" preserveAspectRatio="xMidYMid meet">
                {(() => {
                  const width = 520
                  const height = 200
                  const margin = { top: 20, right: 20, bottom: 50, left: 55 }
                  const chartW = width - margin.left - margin.right
                  const chartH = height - margin.top - margin.bottom

                  const data = engagementData
                  if (data.length === 0) return <text x={width / 2} y={height / 2} fill="#9ca3af" fontSize="14" textAnchor="middle">No data</text>

                  const maxViews = Math.max(...data.map((d: any) => d.views), 1)
                  const maxEngagement = Math.max(...data.map((d: any) => d.engagement), 0.1)

                  const getX = (views: number) => margin.left + (Math.log10(views + 1) / Math.log10(maxViews + 1)) * chartW
                  const getY = (engagement: number) => margin.top + chartH - (engagement / Math.max(maxEngagement, 5)) * chartH

                  return (
                    <>
                      <rect x={margin.left} y={margin.top} width={chartW} height={chartH} fill="#f3f4f6" opacity="0.5" rx="8" />
                      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
                        const x = margin.left + t * chartW
                        const viewVal = Math.round(Math.pow(10, t * Math.log10(maxViews + 1)) - 1)
                        return (
                          <g key={`x-${i}`}>
                            <line x1={x} y1={margin.top} x2={x} y2={margin.top + chartH} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2" />
                            <text x={x} y={margin.top + chartH + 18} fill="#9ca3af" fontSize="10" textAnchor="middle" fontFamily="monospace">
                              {viewVal >= 1e6 ? (viewVal / 1e6).toFixed(0) + 'M' : viewVal >= 1e3 ? (viewVal / 1e3).toFixed(0) + 'K' : viewVal}
                            </text>
                          </g>
                        )
                      })}
                      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
                        const y = margin.top + (1 - t) * chartH
                        const val = t * Math.max(maxEngagement, 5)
                        return (
                          <g key={`y-${i}`}>
                            <line x1={margin.left} y1={y} x2={margin.left + chartW} y2={y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2" />
                            <text x={margin.left - 8} y={y + 4} fill="#9ca3af" fontSize="10" textAnchor="end" fontFamily="monospace">{val.toFixed(1)}%</text>
                          </g>
                        )
                      })}
                      <text x={margin.left + chartW / 2} y={height - 5} fill="#6b7280" fontSize="11" textAnchor="middle" fontWeight="bold" fontFamily="monospace">Views (log scale)</text>
                      <text x={14} y={margin.top + chartH / 2} fill="#6b7280" fontSize="11" textAnchor="middle" fontWeight="bold" transform={`rotate(-90, 14, ${margin.top + chartH / 2})`} fontFamily="monospace">Engagement %</text>
                      {data.map((d: any, i: number) => (
                        <circle
                          key={i}
                          cx={getX(d.views)}
                          cy={getY(d.engagement)}
                          r="6"
                          fill="#dc2626"
                          opacity="0.7"
                          stroke="#f3f4f6"
                          strokeWidth="2"
                        >
                          <title>{d.title.slice(0, 50)}... — {formatNumber(d.views.toString())} views, {d.engagement.toFixed(2)}% engagement</title>
                        </circle>
                      ))}
                    </>
                  )
                })()}
              </svg>
            </div>
          </div>

          {/* Competition Analysis */}
          <div className="glass-panel neon-border rounded-2xl p-5 sm:p-6 glow-hover">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider data-mono">🎯 COMPETITION ANALYSIS</h3>
              <span className="text-[10px] text-gray-500 data-mono">supply vs demand</span>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-black text-gray-900 mb-2">{displayVideos.length}</div>
                <div className="text-sm text-gray-500">Videos in Trend</div>
                <div className="text-xs text-gray-400 mt-1">Supply</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-green-600 mb-2">{formatNumber(totalViews.toString())}</div>
                <div className="text-sm text-gray-500">Total Views</div>
                <div className="text-xs text-gray-400 mt-1">Demand</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-blue-600 mb-2">
                  {displayVideos.length > 0 ? Math.round(totalViews / displayVideos.length / 1000) : 0}K
                </div>
                <div className="text-sm text-gray-500">Views per Video</div>
                <div className="text-xs text-gray-400 mt-1">Opportunity</div>
              </div>
            </div>
            <div className="mt-6 h-4 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full" style={{ width: '65%' }} />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Low Competition</span>
              <span className="font-medium text-yellow-600">Medium Saturation</span>
              <span>High Competition</span>
            </div>
          </div>
        </section>

          {/* Daily Recommendations for This Trend */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-purple-400 to-purple-600" />
              <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-gray-900">
                <span className="text-purple-600">💡</span> {getTimeBasedGreeting()}, Creator
              </h2>
            </div>
            <span className="text-xs text-gray-500 data-mono bg-gray-100 px-3 py-1 rounded-full">
              {getTodayString()}
            </span>
          </div>

          {/* Trend-Specific Insight */}
          <div className="glass-panel neon-border rounded-2xl p-5 sm:p-6 glow-hover corner-accent mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{regionalPrefs.flag || '🌍'}</span>
              <div>
                <h3 className="font-bold text-gray-900">{trendData.title} — {regionalPrefs.flag} {region} Market Intelligence</h3>
                <p className="text-sm text-gray-500">Based on {displayVideos.length} trending videos in this category</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
                <div className="text-purple-600 text-xs font-bold mb-1">🎬 WORKS IN {region}</div>
                <div className="text-sm text-gray-700">{regionalPrefs.popularFormats.slice(0, 2).join(', ')}</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                <div className="text-blue-600 text-xs font-bold mb-1">🔥 HOT IN {region}</div>
                <div className="text-sm text-gray-700">{regionalPrefs.trendingTopics.slice(0, 2).join(', ')}</div>
              </div>
              <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                <div className="text-green-600 text-xs font-bold mb-1">⏱️ OPTIMAL LENGTH</div>
                <div className="text-sm text-gray-700">{regionalPrefs.optimalLength}</div>
              </div>
              <div className="bg-orange-50 rounded-xl p-3 border border-orange-100">
                <div className="text-orange-600 text-xs font-bold mb-1">🚀 BEST POST TIME</div>
                <div className="text-sm text-gray-700">{regionalPrefs.bestPostTime}</div>
              </div>
            </div>
          </div>

          {/* Recommendations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dailyRecommendations.map((rec, idx) => (
              <div key={rec.id} className="glass-panel neon-border rounded-2xl p-5 glow-hover corner-accent group">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    rec.potentialViews === 'viral' ? 'bg-red-100 text-red-600' :
                    rec.potentialViews === 'high' ? 'bg-orange-100 text-orange-600' :
                    rec.potentialViews === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {rec.potentialViews === 'viral' ? '🔥 VIRAL' :
                     rec.potentialViews === 'high' ? '⚡ HIGH' :
                     rec.potentialViews === 'medium' ? '💡 MEDIUM' : '📈 STEADY'}
                  </span>
                  <span className="text-xs text-gray-400 data-mono">#{idx + 1}</span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-sm text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                  {rec.title}
                </h3>

                {/* Category */}
                <div className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                  <span>🏷️</span> {rec.category}
                </div>

                {/* Metrics */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Confidence</span>
                    <span className="font-bold data-mono">{rec.confidence}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full" style={{ width: `${rec.confidence}%` }} />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Difficulty</span>
                    <span className={`font-bold ${
                      rec.difficulty === 'easy' ? 'text-green-600' :
                      rec.difficulty === 'medium' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {rec.difficulty === 'easy' ? '🟢 Easy' :
                       rec.difficulty === 'medium' ? '🟡 Medium' : '🔴 Hard'}
                    </span>
                  </div>
                </div>

                {/* Why Trending */}
                <div className="bg-gray-50 rounded-xl p-3 mb-4">
                  <div className="text-xs font-bold text-gray-700 mb-1">🧠 Why This Works</div>
                  <p className="text-xs text-gray-500 leading-relaxed">{rec.whyTrending}</p>
                </div>

                {/* Similar Videos */}
                {rec.similarVideos.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs font-bold text-gray-700 mb-2">📺 Similar Videos</div>
                    <div className="space-y-1">
                      {rec.similarVideos.slice(0, 2).map((v, i) => (
                        <Link key={i} href={`/video/${v.id}`} className="block text-xs text-gray-500 hover:text-purple-600 transition truncate">
                          • {v.title.slice(0, 35)}{v.title.length > 35 ? '...' : ''}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {rec.suggestedTags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Left: Long-form Content */}
          <div className="lg:col-span-2">
            <article className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold mb-4">Why This Trend Is Growing</h2>
              <p className="text-gray-600 mb-6">{trendData.whyGrowing}</p>

              <h2 className="text-2xl font-bold mb-4">Audience Profile</h2>
              <p className="text-gray-600 mb-6">{trendData.audienceProfile}</p>

              <h2 className="text-2xl font-bold mb-4">Creator Opportunity</h2>
              <p className="text-gray-600 mb-6">{trendData.creatorOpportunity}</p>

              <h2 className="text-2xl font-bold mb-4">Competition Analysis</h2>
              <p className="text-gray-600 mb-6">{trendData.competitionAnalysis}</p>

              {/* Additional Content */}
              <div className="mt-8 text-gray-600">
                {trendData.content.split('\n').map((line, i) => {
                  if (line.startsWith('## ')) {
                    return <h2 key={i} className="text-2xl font-bold mt-8 mb-4">{line.replace('## ', '')}</h2>
                  }
                  if (line.startsWith('### ')) {
                    return <h3 key={i} className="text-xl font-bold mt-6 mb-3">{line.replace('### ', '')}</h3>
                  }
                  if (line.startsWith('- ')) {
                    return <li key={i} className="ml-4">{line.replace('- ', '')}</li>
                  }
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <strong key={i} className="font-bold">{line.replace(/\*\*/g, '')}</strong>
                  }
                  if (line.trim()) {
                    return <p key={i} className="mb-4">{line}</p>
                  }
                  return null
                })}
              </div>
            </article>
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-6">
            {/* Upload Timing */}
            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
              <h3 className="font-bold text-red-900 mb-2">⏰ Upload Timing</h3>
              <p className="text-red-700 text-sm">Post within 24 hours for maximum reach. Trend saturation expected in 48 hours.</p>
            </div>

            {/* Related Trends */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold mb-4">Related Trends</h3>
              <div className="space-y-2">
                {Object.keys(TREND_KNOWLEDGE).filter(k => k !== keyword).slice(0, 3).map((related) => (
                  <Link
                    key={related}
                    href={`/trends/${related}`}
                    className="block p-3 rounded-lg bg-white border border-gray-200 hover:border-red-300 transition"
                  >
                    <div className="font-medium">{TREND_KNOWLEDGE[related].title}</div>
                    <div className="text-xs text-gray-500">View trend →</div>
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gray-900 rounded-xl p-6 text-white">
              <h3 className="font-bold mb-2">Get Full Access</h3>
              <p className="text-gray-400 text-sm mb-4">Unlock AI predictions and trend alerts for this niche.</p>
              <Link
                href="/trending"
                className="block w-full py-3 bg-red-600 text-white text-center rounded-lg font-medium hover:bg-red-700 transition"
              >
                Start Free →
              </Link>
            </div>
          </div>
        </div>

        {/* Top Videos */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Top Videos in This Trend</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayVideos.map((video: any) => (
              <Link key={video.id} href={`/video/${video.id}`} className="group block">
                <div className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-red-300 transition">
                  <div className="relative aspect-video">
                    <img
                      src={video.snippet?.thumbnails?.medium?.url}
                      alt={video.snippet?.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {formatNumber(video.statistics?.viewCount)} views
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-sm line-clamp-2 group-hover:text-red-600 transition">{video.snippet?.title}</h3>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <span>⚡ {getViewVelocity(video) >= 1000000 ? (getViewVelocity(video) / 1000000).toFixed(1) + 'M' : (getViewVelocity(video) / 1000).toFixed(0) + 'K'}/day</span>
                      <span>•</span>
                      <span>{getEngagementRate(video).toFixed(2)}% engagement</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: `How long will this ${keyword} trend last?`, a: 'Based on velocity analysis, we predict this trend will peak within 24-48 hours. Early uploaders capture 70% of total views.' },
              { q: 'Is it too late to start creating content?', a: 'There is still opportunity for quality content. Focus on unique angles or sub-niches within this trend to differentiate.' },
              { q: 'What type of content performs best?', a: 'Educational and tutorial-style content consistently outperforms in emerging trends. Viewers seek to understand the topic deeply.' },
              { q: 'How can I track this trend over time?', a: 'Create a free TubeFission account to save this trend and receive alerts when momentum changes or related opportunities emerge.' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="font-bold mb-2">{item.q}</h3>
                <p className="text-gray-600 text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gray-50 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Capitalize on This Trend?</h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-6">
            Get AI-powered trend predictions, upload timing recommendations, and competition analysis.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/trending"
              className="px-8 py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition"
            >
              Start Finding Potential →
            </Link>
            <Link
              href="/"
              className="px-8 py-4 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-white transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
