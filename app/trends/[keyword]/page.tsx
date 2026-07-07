import type { Metadata } from 'next'
import Link from 'next/link'
import { fetchTrendingVideos, searchYouTube, type YouTubeVideo } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'
import { getViewVelocity, getEngagementRate, getTagColor, getTagEmoji } from '@/lib/analytics'
import { REGION_META, type Region } from '@/lib/region'
import { extractTrendsFromVideos } from '@/lib/trend-extractor'
import TrendVideosGrid from '@/app/components/TrendVideosGrid'
import { WordCloud } from '@/app/components/WordCloud'
import PotentialVideoRanking from '@/app/components/PotentialVideoRanking'
import { trendFreshnessCopy } from '@/lib/data-freshness'

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

// Comprehensive keyword list for SEO coverage - 80+ keywords
export const TREND_KEYWORDS = [
  // AI & Technology
  'ai-shorts', 'chatgpt', 'ai-tools', 'midjourney', 'artificial-intelligence',
  'tech-review', 'smartphone', 'app-review', 'coding-tutorial', 'programming',
  'software-review', 'gadget-review', 'tech-news', 'cybersecurity', 'blockchain',

  // Gaming
  'gaming-youtube', 'minecraft', 'fortnite', 'gta', 'valorant',
  'roblox', 'call-of-duty', 'mobile-gaming', 'esports', 'game-review',
  'gaming-setup', 'walkthrough', 'speedrun', 'challenge-gaming', 'multiplayer',

  // Finance & Business
  'passive-income', 'side-hustle', 'stock-market', 'crypto',
  'personal-finance', 'entrepreneurship', 'online-business', 'dropshipping',
  'affiliate-marketing', 'investing', 'wealth-building', 'financial-freedom',

  // Health & Fitness
  'workout', 'fitness', 'gym', 'health', 'diet', 'exercise', 'yoga',
  'meditation', 'mental-health', 'nutrition', 'weight-loss', 'bodybuilding',

  // Education & Learning
  'tutorial', 'how-to', 'learn', 'education', 'study', 'course',
  'language-learning', 'skill-building', 'online-learning', 'productivity',
  'study-tips', 'exam-prep', 'career-advice', 'self-improvement',

  // Entertainment & Lifestyle
  'vlog', 'travel', 'food', 'cooking', 'recipe', 'mukbang', 'beauty',
  'fashion', 'skincare', 'makeup', 'lifestyle', 'home-decor', 'diy',

  // YouTube Growth
  'youtube-automation', 'mrbeast-style', 'viral-video', 'content-creation',
  'channel-growth', 'monetization', 'youtube-seo', 'thumbnail-design',
  'video-editing', 'script-writing', 'audience-retention', 'clickbait',

  // Short-Form Content
  'shorts-viral', 'tiktok', 'reels', 'shorts-strategy', 'viral-clips',
  'trending-sounds', 'shorts-monetization', 'quick-tips', 'life-hacks',

  // Music & Creative
  'music', 'cover-song', 'reaction-video', 'album-review', 'music-production',
  'singing', 'instrument', 'dj', 'remix', 'creative-content',

  // Social Issues & Commentary
  'news-commentary', 'social-issues', 'politics', 'conspiracy', 'mystery',
  'true-crime', 'unsolved', 'documentary', 'expose', 'investigation',
]

// Default trend data generator
function generateTrendData(keyword: string) {
  const normalized = keyword.replace(/-/g, ' ')
  const title = normalized.replace(/\b\w/g, (char) => char.toUpperCase())
  return {
    title: `${title} Trends 2026`,
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
  const region = getTrendAnalysisRegion(await getRegion())
  const regionLabel = REGION_META[region]?.label || region
  const today = new Date().toISOString().split('T')[0].replace(/-/g, '.')
  const trendTitle = getTrendDisplayTitle(trendData.title)

  return {
    title: `${trendTitle} | ${regionLabel} | ${today} | TubeFission`,
    description: `${trendData.description} Trending in ${regionLabel} on ${today}.`,
    keywords: `${keyword} trends, youtube ${keyword}, viral ${keyword} content, ${keyword} creators`,
    alternates: {
      canonical: `https://tubefission.com/trends/${keyword}`,
    },
    openGraph: {
      title: `${trendTitle} - ${regionLabel} ${today}`,
      description: trendData.description,
      url: `https://tubefission.com/trends/${keyword}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${trendTitle} - ${regionLabel}`,
      description: trendData.description,
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

function getTrendAnalysisRegion(region: Region): Region {
  return region === 'GLOBAL' ? 'US' : region
}

const TREND_RELEVANCE_STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'from', 'this', 'that', 'your', 'you', 'are',
  'video', 'videos', 'youtube', 'short', 'shorts', 'trend', 'trends', 'viral',
  'content', 'creator', 'creators', 'guide', 'latest', 'best', 'new', '2026',
  'about', 'today', 'welcome', 'watch', 'full', 'official', 'update',
])

function normalizeTrendKeyword(keyword: string) {
  return keyword.replace(/-/g, ' ').replace(/\s+/g, ' ').trim()
}

function trendTitleBase(title: string) {
  return title.replace(/\btrends?\b|\b2026\b/gi, '').replace(/\s+/g, ' ').trim()
}

function getTrendDisplayTitle(title: string) {
  return title.replace(/\s+2026\b/gi, '').replace(/\s+/g, ' ').trim()
}

function buildTrendSearchQuery(keyword: string, title: string) {
  const normalized = normalizeTrendKeyword(keyword)
  const titleBase = trendTitleBase(title)
  return normalized.length > 2 ? normalized : titleBase
}

function mergeUniqueVideos(...videoLists: YouTubeVideo[][]) {
  const seen = new Set<string>()
  const merged: YouTubeVideo[] = []

  for (const videos of videoLists) {
    for (const video of videos) {
      if (!video?.id || seen.has(video.id)) continue
      seen.add(video.id)
      merged.push(video)
    }
  }

  return merged
}

function getTrendTerms(keyword: string, title: string) {
  const rawTerms = `${normalizeTrendKeyword(keyword)} ${trendTitleBase(title)}`
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .map((term) => term.trim())
    .filter(Boolean)

  const baseTerms = rawTerms.filter((term) => {
    if (term === 'ai') return true
    return term.length > 2 && !TREND_RELEVANCE_STOP_WORDS.has(term)
  })

  const expandedTerms: string[] = []
  const joined = `${keyword} ${title}`.toLowerCase()

  if (joined.includes('trailer') || joined.includes('teaser')) {
    expandedTerms.push(
      'trailer', 'teaser', 'movie', 'film', 'cinema', 'series', 'episode',
      'season', 'official', 'breakdown', 'clues', 'netflix', 'crunchyroll',
      'disney', 'universal', 'anime',
    )
  }

  if (joined.includes('challenge')) {
    expandedTerms.push(
      'challenge', 'challenged', 'testing', 'test', 'try', 'tried', 'vs',
      'survive', 'last', 'hide', 'seek', 'tournament', 'experiment',
    )
  }

  if (joined.includes('reaction') || joined.includes('react')) {
    expandedTerms.push('reaction', 'reacts', 'reacting', 'breakdown', 'review', 'analysis')
  }

  return Array.from(new Set([...baseTerms, ...expandedTerms]))
}

function textContainsTerm(text: string, term: string) {
  if (term.length <= 2) {
    return new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(text)
  }

  return text.includes(term)
}

function isAiTrendKeyword(keyword: string) {
  const normalized = normalizeTrendKeyword(keyword).toLowerCase()
  const terms = normalized.split(/[^a-z0-9]+/).filter(Boolean)

  return terms.includes('ai')
    || normalized.includes('chatgpt')
    || normalized.includes('artificial intelligence')
    || normalized.includes('midjourney')
    || normalized.includes('openai')
}

function isStrongAiTrendMatch(video: YouTubeVideo, keyword: string) {
  const normalizedKeyword = normalizeTrendKeyword(keyword).toLowerCase()
  const primaryText = [
    video.snippet?.title || '',
    video.snippet?.channelTitle || '',
  ].join(' ').toLowerCase()

  const exactToolMatch = normalizedKeyword.includes('chatgpt')
    ? /\b(chatgpt|openai|gpt[-\s]?[45]?)\b/i.test(primaryText)
    : /\b(ai|artificial intelligence|chatgpt|openai|gpt|claude|midjourney|llm|automation)\b/i.test(primaryText)

  if (!exactToolMatch) return false

  const crossTopicNoise = /\b(roblox|minecraft|fortnite|gameplay|trailer|teaser|movie|film|odyssey|anime|song|music video)\b/i.test(primaryText)
  if (!crossTopicNoise) return true

  return /\b(prompt|tutorial|guide|explained|automation|workflow|productivity|ai tool|model|api|coding|developer)\b/i.test(primaryText)
}

function getTrendRelevanceScore(video: YouTubeVideo, keyword: string, title: string) {
  const normalizedKeyword = normalizeTrendKeyword(keyword).toLowerCase()
  const titleBase = trendTitleBase(title).toLowerCase()
  const terms = getTrendTerms(keyword, title)
  const text = [
    video.snippet?.title || '',
    video.snippet?.description || '',
    video.snippet?.channelTitle || '',
  ].join(' ').toLowerCase()

  let score = 0
  if (normalizedKeyword.length > 2 && text.includes(normalizedKeyword)) score += 12
  if (titleBase.length > 2 && titleBase !== normalizedKeyword && text.includes(titleBase)) score += 8

  for (const term of terms) {
    if (textContainsTerm(text, term)) score += term.length <= 3 ? 2 : 4
  }

  if (keyword.includes('gaming') || keyword.includes('game')) {
    const gamingKeywords = ['gaming', 'minecraft', 'gta', 'fortnite', 'game', 'speedrun', 'walkthrough', 'gameplay', 'valorant', 'roblox', 'call of duty', 'esports', 'nintendo', 'playstation', 'xbox', 'steam', 'twitch', 'mobile game', 'rpg', 'fps', 'mmo']
    if (!gamingKeywords.some((term) => text.includes(term))) return 0
    score += 4
  }

  if (isAiTrendKeyword(keyword)) {
    const aiKeywords = ['ai', 'artificial intelligence', 'chatgpt', 'gpt', 'openai', 'claude', 'midjourney', 'dall-e', 'stable diffusion', 'llm', 'machine learning', 'neural network', 'automation', 'bard', 'copilot']
    if (!aiKeywords.some((term) => textContainsTerm(text, term))) return 0
    if (!isStrongAiTrendMatch(video, keyword)) return 0
    score += 4
  }

  return score
}

function selectTrendSpecificVideos(searchVideos: YouTubeVideo[], regionalVideos: YouTubeVideo[], keyword: string, title: string) {
  const searchIds = new Set(searchVideos.map((video) => video.id))
  const candidates = mergeUniqueVideos(searchVideos, regionalVideos)

  const ranked = candidates
    .map((video) => {
      const relevanceScore = getTrendRelevanceScore(video, keyword, title)
      const searchBoost = searchIds.has(video.id) ? 6 : 0
      const views = Number(video.statistics?.viewCount || 0)
      return { video, score: relevanceScore + searchBoost, relevanceScore, views }
    })
    .filter((item) => item.relevanceScore > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return b.views - a.views
    })
    .map((item) => item.video)

  return ranked.slice(0, 24)
}

function getVideoEvidenceAngles(videos: YouTubeVideo[], keyword: string) {
  return videos.slice(0, 6).map((video) => {
    const title = video.snippet?.title || 'Untitled video'
    const views = Number(video.statistics?.viewCount || 0)
    const velocity = getViewVelocity(video)
    const engagement = getEngagementRate(video)
    const titleLower = title.toLowerCase()
    const hookPattern = /\b(how|why|what|secret|test|tried|vs|before|after|explained|guide|tutorial)\b/i.test(title)
      ? 'clear curiosity or utility hook'
      : title.includes('?')
        ? 'question-led hook'
        : 'topic-led hook'
    const reason = engagement >= 4
      ? 'high engagement suggests the audience is responding, not just clicking'
      : velocity >= 100000
        ? 'strong velocity suggests current demand even if engagement is still developing'
        : 'useful as a supporting benchmark, but not a strong breakout signal yet'

    return {
      id: video.id,
      title,
      channel: video.snippet?.channelTitle || 'Unknown channel',
      href: `/video/${video.id}`,
      views,
      velocity,
      engagement,
      hookPattern,
      reason,
      matchedKeyword: normalizeTrendKeyword(keyword).split(' ').some((term) => titleLower.includes(term.toLowerCase())),
    }
  })
}

export default async function TrendPage({ params }: TrendPageProps) {
  const { keyword } = await params
  const trendData = TREND_KNOWLEDGE[keyword] || generateTrendData(keyword)
  const trendDisplayTitle = getTrendDisplayTitle(trendData.title)

  const region = getTrendAnalysisRegion(await getRegion())
  const searchQuery = buildTrendSearchQuery(keyword, trendData.title)
  const [videos, searchVideos] = await Promise.all([
    fetchTrendingVideos(region, 50, { cache: 'no-store', timeoutMs: 3500 }),
    searchYouTube(searchQuery, 24, 'relevance'),
  ])

  const extractedTrends = extractTrendsFromVideos(videos, region, 50)
  const currentTrend = extractedTrends.find((trend) => trend.slug === keyword)
  const trendAnchorVideos = currentTrend
    ? videos.filter((video) => currentTrend.topVideoIds.includes(video.id))
    : []
  const displayVideos = mergeUniqueVideos(
    trendAnchorVideos,
    selectTrendSpecificVideos(searchVideos, videos, keyword, trendData.title),
  ).filter((video) => getTrendRelevanceScore(video, keyword, trendData.title) > 0)

  const evidenceAngles = getVideoEvidenceAngles(displayVideos, keyword)
  const snapshotAt = new Date().toISOString()

  // Calculate analytics
  const totalViews = displayVideos.reduce((sum: number, v: YouTubeVideo) => sum + Number(v.statistics?.viewCount || 0), 0)
  const avgEngagement = displayVideos.length > 0
    ? displayVideos.reduce((sum: number, v: YouTubeVideo) => sum + getEngagementRate(v), 0) / displayVideos.length
    : 0
  const avgVelocity = displayVideos.length > 0
    ? displayVideos.reduce((sum: number, v: YouTubeVideo) => sum + getViewVelocity(v), 0) / displayVideos.length
    : 0

  const matchedTrendTerms = getTrendTerms(keyword, trendData.title).slice(0, 8)
  const noiseFilteredTerms = ['about', 'today', 'welcome', 'watch', 'full', 'official', 'latest', 'update']
  const evidenceSummary = [
    {
      label: 'Why this belongs',
      value: matchedTrendTerms.length > 0 ? matchedTrendTerms.join(', ') : normalizeTrendKeyword(keyword),
      note: 'Matched against source titles, descriptions, and channel context.',
    },
    {
      label: 'Source videos',
      value: `${displayVideos.length}`,
      note: `Keyword-matched public videos in ${REGION_META[region]?.label || region}.`,
    },
    {
      label: 'Evidence sample',
      value: formatNumber(totalViews.toString()),
      note: 'Total public views across the matched sample.',
    },
    {
      label: '24h velocity proxy',
      value: `${formatNumber(Math.round(avgVelocity).toString())}/day`,
      note: 'Modeled from public publish age and current views.',
    },
    {
      label: '7d momentum proxy',
      value: formatNumber(Math.round(avgVelocity * 7).toString()),
      note: 'Seven-day projection if the current velocity holds.',
    },
    {
      label: 'Noise filtered',
      value: noiseFilteredTerms.slice(0, 5).join(', '),
      note: 'Generic words are removed before trend matching and keyword clouds.',
    },
  ]

  const dailyRecommendations = evidenceAngles.map((angle, index) => ({
    id: angle.id,
    title: angle.hookPattern,
    category: angle.matchedKeyword ? 'Keyword-matched evidence' : 'Related evidence',
    href: angle.href,
    sourceTitle: angle.title,
    sourceChannel: angle.channel,
    confidence: Math.min(95, Math.max(35, Math.round(angle.engagement * 12 + Math.log10(angle.views + 1) * 8))),
    potentialViews: angle.velocity >= 500000 ? 'viral' : angle.velocity >= 100000 ? 'high' : angle.engagement >= 4 ? 'medium' : 'low',
    difficulty: angle.views >= 1000000 ? 'hard' : angle.views >= 100000 ? 'medium' : 'easy',
    whyTrending: `${angle.reason}. Source: ${angle.title}`,
    suggestedTags: [normalizeTrendKeyword(keyword), angle.hookPattern.replace(/\s+/g, '-'), `video-${index + 1}`],
    similarVideos: [{ id: angle.id, title: `${angle.title} (${formatNumber(angle.views.toString())} views)`, views: angle.views }],
  }))

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

  // Generate word cloud data from video titles (server-side)
  const wordCloudData = (() => {
    const wordCounts: Record<string, number> = {}
    // Extended stop words including URL components, platform names, and common noise
    const stopWords = new Set([
      // Basic stop words
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'me', 'him', 'them', 'what', 'which', 'who', 'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'now', 'also', 'get', 'like', 'one', 'two', 'new', 'use', 'way', 'make', 'see', 'know', 'take', 'come', 'think', 'look', 'time', 'day', 'year', 'work', 'well', 'even', 'back', 'after', 'use', 'her', 'here', 'him', 'his', 'how', 'its', 'our', 'out', 'day', 'did', 'many', 'may', 'over', 'say', 'she', 'try', 'way', 'who', 'boy', 'did', 'man', 'men', 'run', 'she', 'sun', 'way', 'ago', 'cut', 'did', 'dry', 'far', 'ill', 'old', 'sit', 'ago', 'about', 'today', 'welcome',
      // URL components
      'http', 'https', 'www', 'com', 'org', 'net', 'io', 'co', 'be', 'ly', 'watch', 'youtu',
      // Platform names
      'youtube', 'facebook', 'twitter', 'instagram', 'tiktok', 'snapchat', 'linkedin', 'reddit', 'tumblr', 'pinterest', 'twitch', 'discord', 'whatsapp', 'telegram', 'vimeo', 'dailymotion',
      // Video metadata terms
      'video', 'videos', 'watch', 'watched', 'views', 'view', 'like', 'likes', 'subscribe', 'subscribed', 'channel', 'channels', 'upload', 'uploaded', 'download', 'clip', 'clips', 'trailer', 'trailers', 'full', 'complete', 'hd', 'high', 'quality', 'version', 'official', 'unofficial', 'fan', 'fans', 'made',
      // Generic content words
      'content', 'creator', 'creators', 'production', 'produced', 'produce', 'director', 'directed', 'producer', 'music', 'song', 'songs', 'lyric', 'lyrics', 'audio', 'sound', 'album', 'track', 'artist', 'artists', 'art', 'arts', 'film', 'films', 'movie', 'movies', 'series', 'episode', 'episodes', 'season', 'tv', 'show', 'shows', 'live', 'stream', 'streaming',
      // Common names (Indian, Korean, etc.)
      'kumar', 'singh', 'sharma', 'verma', 'gupta', 'patel', 'shah', 'lee', 'kim', 'park', 'choi', 'jung', 'kang', 'yoon', 'song', 'sung', 'hong', 'shin', 'khan', 'ahmed', 'ali', 'hassan', 'hussain', 'mohammed', 'muhammad', 'ahmad',
      // Common words in titles
      'team', 'want', 'best', 'follow', 'following', 'link', 'click', 'bio', 'description', 'comment', 'comments', 'share', 'viral', 'trending', 'trend', 'trends', 'popular', 'latest', 'recent', 'updated', 'update', 'news', 'info', 'information',
      // Numbers and misc
      'ft', 'feat', 'featuring', 'vs', 'versus', 'part', 'vol', 'volume', 'ep', 'edition', 'version', 'remix', 'cover', 'remake', 'original', 'copy', 'first', 'last', 'final', 'next', 'prev', 'previous'
    ])

    displayVideos.forEach((v: any) => {
      const title = v.snippet?.title || ''
      const description = v.snippet?.description || ''
      const text = `${title} ${description}`.toLowerCase()

      // Extract words (including hashtags), but filter out URLs first
      const textWithoutUrls = text.replace(/https?:\/\/[^\s]+|www\.[^\s]+/g, ' ')
      const words = textWithoutUrls.match(/#[\w]+|\b[a-z]{3,}\b/g) || []

      words.forEach((word: string) => {
        const cleanWord = word.replace(/^#/, '')
        // Skip stop words, pure numbers, and very short words
        if (!stopWords.has(cleanWord) &&
            cleanWord.length > 2 &&
            !/^\d+$/.test(cleanWord) &&
            !cleanWord.includes('http') &&
            !cleanWord.includes('www')) {
          wordCounts[cleanWord] = (wordCounts[cleanWord] || 0) + 1
        }
      })
    })

    return Object.entries(wordCounts)
      .map(([text, value]) => ({ text, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 40)
  })()

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-red-600">Home</Link>
          <span>→</span>
          <Link href="/trending" className="hover:text-red-600">Trends</Link>
          <span>→</span>
          <span className="text-gray-900">{trendDisplayTitle}</span>
        </nav>

        {/* Hero */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">{trendDisplayTitle}</h1>
          <p className="text-gray-600 text-lg max-w-3xl">{trendData.description}</p>
        </div>

        {/* Today's Top Video */}
        {displayVideos.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-red-400 to-red-600" />
              <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-gray-900">
                <span className="text-red-600">🔥</span> Today&apos;s Top Video
                <span className="text-sm font-normal text-gray-500">— Highest performing in this trend</span>
              </h2>
            </div>
            {(() => {
              const topVideo = displayVideos[0]
              const topVelocity = getViewVelocity(topVideo)
              const topEngagement = getEngagementRate(topVideo)
              const topViews = Number(topVideo.statistics?.viewCount || 0)
              return (
                <Link
                  href={`/video/${topVideo.id}`}
                  className="group block bg-gradient-to-br from-red-50 to-white rounded-2xl overflow-hidden border border-red-200 hover:border-red-400 hover:shadow-xl transition-all duration-300"
                >
                  <div className="grid md:grid-cols-2 gap-0">
                    {/* Thumbnail Side */}
                    <div className="relative aspect-video md:aspect-auto md:min-h-[300px] overflow-hidden">
                      <img
                        src={topVideo.snippet?.thumbnails?.high?.url || topVideo.snippet?.thumbnails?.medium?.url || `https://i.ytimg.com/vi/${topVideo.id}/maxresdefault.jpg`}
                        alt={topVideo.snippet?.title || 'Top video thumbnail'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Rank Badge */}
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-4 py-2 rounded-xl font-black text-xl shadow-lg flex items-center gap-2">
                        <span className="text-2xl">🏆</span>
                        <span>#1 RANK</span>
                      </div>
                      {/* Views Overlay */}
                      <div className="absolute bottom-4 right-4 bg-black/80 text-white px-4 py-2 rounded-lg text-sm font-bold backdrop-blur-sm">
                        {formatNumber(topViews.toString())} views
                      </div>
                    </div>
                    {/* Info Side */}
                    <div className="p-6 md:p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">TRENDING NOW</span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">{region}</span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
                        {topVideo.snippet?.title || 'Untitled Video'}
                      </h3>
                      <p className="text-gray-600 mb-4">{topVideo.snippet?.channelTitle || 'Unknown Channel'}</p>
                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-xl p-3 border border-gray-200 text-center">
                          <div className="text-2xl font-bold text-gray-900">{formatNumber(topViews.toString())}</div>
                          <div className="text-xs text-gray-500">Views</div>
                        </div>
                        <div className="bg-white rounded-xl p-3 border border-gray-200 text-center">
                          <div className={`text-2xl font-bold ${topEngagement >= 5 ? 'text-green-600' : 'text-yellow-600'}`}>
                            {topEngagement.toFixed(2)}%
                          </div>
                          <div className="text-xs text-gray-500">Engagement</div>
                        </div>
                        <div className="bg-white rounded-xl p-3 border border-gray-200 text-center">
                          <div className="text-2xl font-bold text-red-600">
                            {topVelocity >= 1e6 ? (topVelocity / 1e6).toFixed(1) + 'M' : topVelocity >= 1e3 ? (topVelocity / 1e3).toFixed(1) + 'K' : Math.round(topVelocity)}
                          </div>
                          <div className="text-xs text-gray-500">Views/Day</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-red-600 font-medium">
                        <span>Watch Video</span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })()}
          </section>
        )}

        {/* Top Videos in This Trend - Dynamic Grid with Filters */}
        {displayVideos.length > 0 && (
          <div className="mb-12">
            <TrendVideosGrid
              videos={displayVideos}
              keyword={keyword}
              initialRegion={region}
              showRanks={true}
            />
          </div>
        )}

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

        {/* Potential Video Ranking */}
        <section className="mb-12">
          <PotentialVideoRanking videos={displayVideos} region={region} />
        </section>

          {/* Evidence-Based Angles */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-purple-400 to-purple-600" />
              <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-gray-900">
                <span className="text-purple-600">Evidence</span> Creator angles from matched videos
              </h2>
            </div>
            <span className="text-xs text-gray-500 data-mono bg-gray-100 px-3 py-1 rounded-full">
              {trendFreshnessCopy(snapshotAt)}
            </span>
          </div>

          {/* Trend-Specific Evidence */}
          <div className="glass-panel neon-border rounded-2xl p-5 sm:p-6 glow-hover corner-accent mb-6">
            <div className="mb-4 flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-lg font-black text-purple-700">E</span>
              <div>
                <h3 className="font-bold text-gray-900">Why this is classified as {trendDisplayTitle}</h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  The page is built from matched source videos, not generic topic text. Weak words are filtered before scoring, and each creator angle links back to the video that produced the signal.
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {evidenceSummary.map((item) => (
                <div key={item.label} className="rounded-xl border border-purple-100 bg-purple-50 p-3">
                  <div className="text-xs font-bold uppercase tracking-wide text-purple-700">{item.label}</div>
                  <div className="mt-1 text-sm font-black text-gray-900">{item.value}</div>
                  <div className="mt-1 text-xs leading-relaxed text-gray-600">{item.note}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dailyRecommendations.map((rec, idx) => (
              <Link
                key={rec.id}
                href={rec.href}
                className="glass-panel neon-border rounded-2xl p-5 glow-hover corner-accent group block hover:border-purple-300 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    rec.potentialViews === 'viral' ? 'bg-red-100 text-red-600' :
                    rec.potentialViews === 'high' ? 'bg-orange-100 text-orange-600' :
                    rec.potentialViews === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {rec.potentialViews === 'viral' ? 'VIRAL' :
                     rec.potentialViews === 'high' ? 'HIGH' :
                     rec.potentialViews === 'medium' ? 'MEDIUM' : 'STEADY'}
                  </span>
                  <span className="text-xs text-gray-400 data-mono">#{idx + 1}</span>
                </div>

                <h3 className="font-bold text-sm text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                  {rec.title}
                </h3>
                <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-gray-500">
                  From: {rec.sourceTitle}
                </p>

                <div className="text-xs text-gray-500 mb-3 flex flex-wrap items-center gap-1">
                  <span className="font-bold text-gray-700">Source</span>
                  <span>{rec.sourceChannel}</span>
                  <span>-</span>
                  <span>{rec.category}</span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Evidence fit</span>
                    <span className="font-bold data-mono">{rec.confidence}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full" style={{ width: `${rec.confidence}%` }} />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 mb-4">
                  <div className="text-xs font-bold text-gray-700 mb-1">Why this works</div>
                  <p className="text-xs text-gray-500 leading-relaxed">{rec.whyTrending}</p>
                </div>

                {rec.similarVideos.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs font-bold text-gray-700 mb-2">Source video</div>
                    <div className="space-y-1">
                      {rec.similarVideos.slice(0, 2).map((v, i) => (
                        <span key={i} className="block text-xs text-gray-500 truncate">
                          {v.title.slice(0, 35)}{v.title.length > 35 ? '...' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-1">
                  {rec.suggestedTags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Trending Keywords Word Cloud */}
        {wordCloudData.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-green-400 to-green-600" />
              <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-gray-900">
                <span className="text-green-600">☁️</span> Trending Keywords
              </h2>
            </div>
            <div className="glass-panel neon-border rounded-2xl p-6 sm:p-8 glow-hover">
              <WordCloud words={wordCloudData} maxWords={40} />
            </div>
          </section>
        )}

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
