/* =========================================================
   DAILY TOPIC RECOMMENDATIONS — AI-powered content ideas
   Based on real trending data per country/region
========================================================= */

import { Video, getEngagementRate, getViewVelocity } from './analytics'

export interface TopicRecommendation {
  id: string
  title: string
  category: string
  confidence: number // 0-100
  potentialViews: 'low' | 'medium' | 'high' | 'viral'
  difficulty: 'easy' | 'medium' | 'hard'
  whyTrending: string
  suggestedTags: string[]
  similarVideos: { id: string; title: string; views: number }[]
}

// Pattern extraction from trending titles
const PATTERNS = {
  numbers: /\$?\d+(?:,\d+)?(?:k|m|b)?|\d+\s*(?:million|billion|thousand)/gi,
  timeframes: /\d+\s*(?:seconds?|minutes?|hours?|days?|weeks?|months?|years?)/gi,
  comparisons: /vs\.?|versus|comparison|better than|worse than/gi,
  challenges: /challenge|try|attempt|test|experiment/gi,
  reactions: /reaction|reacts? to|responds? to/gi,
  tutorials: /how to|tutorial|guide|learn|teach|explain/gi,
  secrets: /secret|hidden|unknown|revealed|exposed|truth/gi,
  rankings: /top\s*\d+|ranking|best|worst|fastest|slowest/gi,
  transformations: /transform|makeover|before.*after|upgrade/gi,
  stories: /story|journey|experience|i tried|i went/gi,
}

// Country-specific content trends
export const REGIONAL_PREFERENCES: Record<string, {
  flag: string
  popularFormats: string[]
  trendingTopics: string[]
  optimalLength: string
  bestPostTime: string
}> = {
  US: {
    flag: '🇺🇸',
    popularFormats: ['Challenge', 'Reaction', 'Storytime', 'Tutorial', 'Review'],
    trendingTopics: ['AI tools', 'Side hustle', 'Productivity', 'Finance tips', 'Tech reviews'],
    optimalLength: '8-12 minutes',
    bestPostTime: '2PM - 4PM EST',
  },
  JP: {
    flag: '🇯🇵',
    popularFormats: ['ASMR', 'Daily vlog', 'Cooking', 'Gaming', 'Craft/DIY'],
    trendingTopics: ['Anime reactions', 'Convenience store food', 'Life hacks', 'Study with me', 'Room tour'],
    optimalLength: '15-20 minutes',
    bestPostTime: '7PM - 9PM JST',
  },
  KR: {
    flag: '🇰🇷',
    popularFormats: ['Mukbang', 'Dance cover', 'Beauty tutorial', 'Gaming', 'Shorts'],
    trendingTopics: ['K-beauty', 'K-pop reactions', 'Street food', 'Fashion haul', 'Studygram'],
    optimalLength: '10-15 minutes',
    bestPostTime: '8PM - 10PM KST',
  },
  GB: {
    flag: '🇬🇧',
    popularFormats: ['Documentary style', 'Interview', 'Comedy sketch', 'Vlog', 'Review'],
    trendingTopics: ['Premier League', 'British humor', 'Travel UK', 'Pub culture', 'Vintage finds'],
    optimalLength: '10-15 minutes',
    bestPostTime: '6PM - 8PM GMT',
  },
  HK: {
    flag: '🇭🇰',
    popularFormats: ['Food review', 'City walk', 'Finance', 'Tech unboxing', 'Tutorial'],
    trendingTopics: ['Dim sum', 'Stock market', 'Property', 'Immigration', 'Phone reviews'],
    optimalLength: '8-12 minutes',
    bestPostTime: '12PM - 2PM HKT',
  },
  TW: {
    flag: '🇹🇼',
    popularFormats: ['Mukbang', 'Travel vlog', 'Gaming', 'Beauty', 'Study with me'],
    trendingTopics: ['Night markets', 'Bubble tea', 'Anime', 'Study tips', 'Room decor'],
    optimalLength: '10-15 minutes',
    bestPostTime: '7PM - 9PM CST',
  },
}

// Extract trending keywords from video titles
function extractTrendingKeywords(videos: Video[]): Map<string, { count: number; avgEngagement: number; avgVelocity: number }> {
  const keywords = new Map<string, { count: number; avgEngagement: number; avgVelocity: number; totalEngagement: number; totalVelocity: number }>()

  const stopWords = new Set(['the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'what', 'which', 'who', 'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'now', 'then', 'here', 'there', 'up', 'down', 'out', 'off', 'over', 'under', 'again', 'further', 'once', 'me', 'him', 'them', 'us', 'her', 'his', 'yourself', 'himself', 'herself', 'itself', 'themselves', 'ourselves', 'yourselves'])

  videos.forEach(video => {
    const title = video.snippet?.title?.toLowerCase() || ''
    const words = title
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopWords.has(w) && !/^\d+$/.test(w))

    const engagement = getEngagementRate(video)
    const velocity = getViewVelocity(video)

    words.forEach(word => {
      const existing = keywords.get(word)
      if (existing) {
        existing.count++
        existing.totalEngagement += engagement
        existing.totalVelocity += velocity
        existing.avgEngagement = existing.totalEngagement / existing.count
        existing.avgVelocity = existing.totalVelocity / existing.count
      } else {
        keywords.set(word, {
          count: 1,
          avgEngagement: engagement,
          avgVelocity: velocity,
          totalEngagement: engagement,
          totalVelocity: velocity
        })
      }
    })
  })

  // Convert to final format without total fields
  const result = new Map<string, { count: number; avgEngagement: number; avgVelocity: number }>()
  keywords.forEach((value, key) => {
    result.set(key, {
      count: value.count,
      avgEngagement: value.avgEngagement,
      avgVelocity: value.avgVelocity
    })
  })

  return result
}

// Detect content patterns from titles
function detectPatterns(videos: Video[]): Map<string, { count: number; examples: string[] }> {
  const patterns = new Map<string, { count: number; examples: string[] }>()

  videos.forEach(video => {
    const title = video.snippet?.title || ''

    Object.entries(PATTERNS).forEach(([patternName, regex]) => {
      if (regex.test(title)) {
        const existing = patterns.get(patternName)
        if (existing) {
          existing.count++
          if (existing.examples.length < 3) existing.examples.push(title)
        } else {
          patterns.set(patternName, { count: 1, examples: [title] })
        }
      }
    })
  })

  return patterns
}

// Calculate virality potential score
function calculateViralityPotential(
  keyword: string,
  stats: { count: number; avgEngagement: number; avgVelocity: number },
  totalVideos: number
): number {
  const frequency = stats.count / totalVideos
  const engagementScore = Math.min(stats.avgEngagement / 10, 1) // Cap at 10%
  const velocityScore = Math.min(stats.avgVelocity / 100000, 1) // Cap at 100k/day

  // Formula: frequency * 30 + engagement * 40 + velocity * 30
  return Math.round((frequency * 30 + engagementScore * 40 + velocityScore * 30) * 100)
}

// Generate daily recommendations based on region
export function generateDailyRecommendations(
  videos: Video[],
  region: string,
  count: number = 5
): TopicRecommendation[] {
  const keywords = extractTrendingKeywords(videos)
  const patterns = detectPatterns(videos)
  const regionalPrefs = REGIONAL_PREFERENCES[region] || REGIONAL_PREFERENCES.US

  // Score and rank keywords
  const scoredKeywords = Array.from(keywords.entries())
    .filter(([, stats]) => stats.count >= 2) // Must appear at least twice
    .map(([keyword, stats]) => ({
      keyword,
      stats,
      viralityScore: calculateViralityPotential(keyword, stats, videos.length)
    }))
    .sort((a, b) => b.viralityScore - a.viralityScore)
    .slice(0, count * 2) // Take top candidates

  // Find similar videos for each topic
  const recommendations: TopicRecommendation[] = scoredKeywords.slice(0, count).map((item, index) => {
    const similarVids = videos
      .filter(v => v.snippet?.title?.toLowerCase().includes(item.keyword))
      .sort((a, b) => getViewVelocity(b) - getViewVelocity(a))
      .slice(0, 3)
      .map(v => ({
        id: v.id,
        title: v.snippet?.title || '',
        views: Number(v.statistics?.viewCount || 0)
      }))

    // Determine potential
    const potentialViews: TopicRecommendation['potentialViews'] =
      item.viralityScore > 80 ? 'viral' :
      item.viralityScore > 60 ? 'high' :
      item.viralityScore > 40 ? 'medium' : 'low'

    // Determine difficulty based on competition
    const difficulty: TopicRecommendation['difficulty'] =
      item.stats.count > videos.length * 0.3 ? 'hard' :
      item.stats.count > videos.length * 0.15 ? 'medium' : 'easy'

    // Generate why trending explanation
    const topPattern = Array.from(patterns.entries())
      .sort((a, b) => b[1].count - a[1].count)[0]?.[0] || 'viral content'

    return {
      id: `rec-${region}-${index}-${Date.now()}`,
      title: generateTitleSuggestion(item.keyword, topPattern, regionalPrefs),
      category: detectCategory(item.keyword, regionalPrefs),
      confidence: Math.min(item.viralityScore, 95),
      potentialViews,
      difficulty,
      whyTrending: generateWhyTrending(item.keyword, item.stats, topPattern),
      suggestedTags: generateTags(item.keyword, regionalPrefs),
      similarVideos: similarVids
    }
  })

  return recommendations
}

// Generate title suggestions based on trending patterns
function generateTitleSuggestion(
  keyword: string,
  pattern: string,
  prefs: { popularFormats: string[] }
): string {
  const formats = [
    `The ${keyword} trend that broke the internet`,
    `I tried ${keyword} for 30 days (unexpected results)`,
    `${keyword} vs Traditional: Which is better?`,
    `The secret to ${keyword} that no one talks about`,
    `${keyword} explained in 60 seconds`,
    `Why ${keyword} is everywhere right now`,
    `Top 5 ${keyword} tips from experts`,
    `I spent $1000 on ${keyword} — here's what happened`,
    `The ${keyword} guide for beginners`,
    `${keyword}: What they don't want you to know`,
  ]

  // Add format-specific variations
  if (prefs.popularFormats.includes('Challenge')) {
    formats.push(`${keyword} challenge — can you do this?`)
  }
  if (prefs.popularFormats.includes('Tutorial')) {
    formats.push(`How to master ${keyword} in 2026`)
  }
  if (prefs.popularFormats.includes('Reaction')) {
    formats.push(`Reacting to the wildest ${keyword} videos`)
  }

  return formats[Math.floor(Math.random() * formats.length)]
}

// Detect content category
function detectCategory(keyword: string, prefs: { trendingTopics: string[] }): string {
  const lower = keyword.toLowerCase()

  if (['ai', 'tech', 'phone', 'app', 'software', 'chatgpt'].some(t => lower.includes(t))) return 'Technology'
  if (['money', 'finance', 'invest', 'stock', 'crypto', 'income'].some(t => lower.includes(t))) return 'Finance'
  if (['game', 'gaming', 'minecraft', 'fortnite', 'play'].some(t => lower.includes(t))) return 'Gaming'
  if (['food', 'cook', 'recipe', 'eat', 'mukbang', 'restaurant'].some(t => lower.includes(t))) return 'Food'
  if (['beauty', 'makeup', 'skincare', 'fashion', 'outfit'].some(t => lower.includes(t))) return 'Beauty & Fashion'
  if (['workout', 'fitness', 'gym', 'health', 'diet'].some(t => lower.includes(t))) return 'Health & Fitness'
  if (['travel', 'vlog', 'trip', 'visit', 'tour'].some(t => lower.includes(t))) return 'Travel'
  if (['study', 'learn', 'education', 'tutorial', 'how'].some(t => lower.includes(t))) return 'Education'
  if (['music', 'song', 'cover', 'reaction'].some(t => lower.includes(t))) return 'Music'

  return 'Entertainment'
}

// Generate why trending explanation
function generateWhyTrending(
  keyword: string,
  stats: { avgEngagement: number; avgVelocity: number },
  pattern: string
): string {
  const reasons = [
    `High engagement rate (${stats.avgEngagement.toFixed(1)}%) indicates strong audience interest`,
    `View velocity of ${Math.round(stats.avgVelocity).toLocaleString()}/day shows viral momentum`,
    `Following the ${pattern} format that viewers actively seek`,
    `Emerging topic with growing search volume and low competition`,
    `Cross-platform trend with potential for algorithmic boost`,
  ]

  return reasons[Math.floor(Math.random() * reasons.length)]
}

// Generate suggested tags
function generateTags(keyword: string, prefs: { trendingTopics: string[] }): string[] {
  const baseTags = [keyword, 'trending', 'viral', '2026']
  const regionTags = prefs.trendingTopics.slice(0, 2).map(t => t.toLowerCase().replace(/\s+/g, ''))

  return [...baseTags, ...regionTags, 'shorts', 'contentcreator'].slice(0, 6)
}

// Get today's formatted date
export function getTodayString(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Get greeting based on time
export function getTimeBasedGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}
