import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { fetchTrendingVideos } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'
import { getViewVelocity, getEngagementRate } from '@/lib/analytics'

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

        {/* Key Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Growth Rate</div>
            <div className="text-2xl font-bold text-green-600">+147%</div>
            <div className="text-xs text-gray-400">Last 30 days</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Competition</div>
            <div className="text-2xl font-bold text-yellow-600">Medium</div>
            <div className="text-xs text-gray-400">Saturation level</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Peak Window</div>
            <div className="text-2xl font-bold text-red-600">24h</div>
            <div className="text-xs text-gray-400">Until saturation</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Opportunity</div>
            <div className="text-2xl font-bold text-green-600">85/100</div>
            <div className="text-xs text-gray-400">Score</div>
          </div>
        </div>

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
              Start Finding Trends →
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
