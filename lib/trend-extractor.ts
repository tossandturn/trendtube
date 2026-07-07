/* =========================================================
   REAL TREND EXTRACTOR — 100% real data, country-first
   Extracts trends from actual YouTube videos. No fake data.
========================================================= */

import { fetchTrendingVideos, type YouTubeVideo } from './api-client'

export interface RealTrend {
  slug: string
  title: string
  category: string
  description: string
  keyword: string
  videoCount: number
  totalViews: number
  totalLikes: number
  totalComments: number
  avgVelocity: number
  saturationScore: number
  breakoutScore: number
  creatorCount: number
  peakHours: number
  tags: string[]
  topVideoIds: string[]
  region: string
}

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'and', 'or', 'but',
  'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
  'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'i',
  'you', 'he', 'she', 'it', 'we', 'they', 'my', 'your', 'his', 'her', 'its', 'our', 'their',
  'what', 'which', 'who', 'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both',
  'few', 'more', 'most', 'other', 'some', 'such', 'only', 'own', 'same', 'so', 'than', 'too',
  'very', 'just', 'now', 'then', 'here', 'there', 'up', 'down', 'out', 'off', 'over', 'under',
  'again', 'further', 'once', 'me', 'him', 'them', 'us', 'her', 'himself', 'herself', 'itself',
  'themselves', 'ourselves', 'yourselves', 'not', 'no', 'yes', 'get', 'go', 'like', 'one',
  'two', 'new', 'old', 'first', 'last', 'long', 'great', 'little', 'own', 'right', 'good',
  'still', 'back', 'after', 'use', 'work', 'way', 'even', 'also', 'any', 'may', 'say', 'make',
  'well', 'time', 'year', 'day', 'much', 'many', 'about', 'if', 'out', 'up', 'so', 'its',
  'into', 'them', 'than', 'only', 'other', 'some', 'what', 'know', 'take', 'people', 'year',
  'good', 'some', 'could', 'state', 'over', 'think', 'where', 'being', 'every', 'great',
  'world', 'year', 'still', 'own', 'under', 'while', 'last', 'might', 'come', 'place',
  'made', 'live', 'where', 'back', 'little', 'only', 'round', 'man', 'year', 'came',
  'show', 'live', 'think', 'also', 'around', 'another', 'came', 'come', 'work', 'three',
  'must', 'because', 'does', 'part', 'even', 'place', 'well', 'such', 'here', 'take',
  'why', 'things', 'help', 'put', 'years', 'different', 'away', 'again', 'off', 'went',
  'old', 'number', 'great', 'tell', 'men', 'say', 'small', 'every', 'found', 'still',
  'between', 'name', 'should', 'home', 'big', 'give', 'air', 'line', 'set', 'own',
  'under', 'read', 'last', 'never', 'us', 'left', 'end', 'along', 'while', 'might',
  'next', 'sound', 'below', 'saw', 'something', 'thought', 'both', 'few', 'those',
  'always', 'show', 'large', 'often', 'together', 'asked', 'house', 'don', 'world',
  'going', 'want', 'school', 'important', 'until', 'form', 'food', 'keep', 'children',
  'feet', 'land', 'side', 'without', 'boy', 'once', 'animal', 'life', 'enough',
  'took', 'four', 'head', 'above', 'kind', 'began', 'almost', 'live', 'page',
  'got', 'need', 'felt', 'seemed', 'turned', 'hand', 'high', 'sure', 'upon',
  'head', 'saw', 'cut', 'far', 'watch', 'color', 'face', 'main', 'youtube',
  'video', 'videos', 'channel', 'channels', 'watching', 'watched', 'subscribe',
  'subscribers', 'views', 'like', 'likes', 'comment', 'comments', 'vlog',
  'episode', 'update', 'official', 'full', 'hd', 'ft', 'feat', 'featuring',
  'version', 'original', 'cover', 'remix', 'live', 'stream', 'streaming',
  'secret', 'official', 'second', 'stage', '2nd', 'run', 'ball', 'black',
  'dear', 'final', 'season', 'episode', 'part',
])

const MEANINGFUL_SINGLE_WORDS = new Set([
  'ai', 'chatgpt', 'midjourney', 'minecraft', 'fortnite', 'roblox', 'valorant',
  'meccha', 'chameleon', 'odyssey', 'trailer', 'anime', 'netflix', 'crunchyroll',
  'gaming', 'mukbang', 'shorts', 'iphone', 'tesla', 'bitcoin',
])

// Category detection from keywords
export function detectCategory(keyword: string): string {
  const lower = keyword.toLowerCase()
  const hasTerm = (terms: string[]) => terms.some((term) =>
    term.includes(' ')
      ? lower.includes(term)
      : new RegExp(`\\b${term}\\b`, 'i').test(lower)
  )

  if (hasTerm(['ai', 'tech', 'phone', 'app', 'software', 'chatgpt', 'gpt', 'robot', 'code', 'coding', 'programming', 'developer', 'computer', 'gadget', 'review'])) return 'Technology'
  if (hasTerm(['money', 'finance', 'invest', 'stock', 'crypto', 'bitcoin', 'trading', 'forex', 'wealth', 'income', 'passive'])) return 'Finance'
  if (hasTerm(['game', 'gaming', 'minecraft', 'fortnite', 'gta', 'valorant', 'roblox', 'play', 'esports', 'player'])) return 'Gaming'
  if (hasTerm(['food', 'cook', 'recipe', 'eat', 'mukbang', 'restaurant', 'kitchen', 'chef', 'meal', 'dish'])) return 'Food'
  if (hasTerm(['beauty', 'makeup', 'skincare', 'fashion', 'outfit', 'style', 'glam', 'cosmetic'])) return 'Beauty'
  if (hasTerm(['workout', 'fitness', 'gym', 'health', 'diet', 'exercise', 'muscle', 'training', 'yoga'])) return 'Health'
  if (hasTerm(['travel', 'vlog', 'trip', 'visit', 'tour', 'vacation', 'hotel', 'flight', 'adventure'])) return 'Travel'
  if (hasTerm(['study', 'learn', 'education', 'tutorial', 'how to', 'lesson', 'course', 'exam', 'university'])) return 'Education'
  if (hasTerm(['music', 'song', 'cover', 'reaction', 'album', 'artist', 'rap', 'hip hop', 'pop', 'rock', 'dj', 'concert'])) return 'Music'
  if (hasTerm(['shorts', 'short', 'tiktok', 'reel', 'clip', 'viral clip'])) return 'Short-Form'
  if (hasTerm(['movie', 'film', 'cinema', 'trailer', 'series', 'tv', 'show', 'actor', 'netflix'])) return 'Entertainment'
  if (hasTerm(['car', 'auto', 'vehicle', 'drive', 'racing', 'motor', 'bike', 'supercar', 'drift'])) return 'Auto'
  if (hasTerm(['sport', 'sports', 'football', 'basketball', 'soccer', 'nfl', 'nba', 'fifa', 'match', 'goal'])) return 'Sports'
  return 'Entertainment'
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').substring(0, 50)
}

function getAgeDays(publishedAt: string): number {
  const ageMs = Date.now() - new Date(publishedAt).getTime()
  return Math.max(0.5, ageMs / (1000 * 60 * 60 * 24))
}

function getKeywordWeight(keyword: string) {
  return keyword.split(/\s+/).filter(Boolean).length
}

function isUsefulTrendKeyword(keyword: string) {
  const normalized = keyword.toLowerCase().trim()
  const words = normalized.split(/\s+/).filter(Boolean)

  if (words.length === 0) return false
  if (words.some((word) => STOP_WORDS.has(word))) return false
  if (words.length === 1 && !MEANINGFUL_SINGLE_WORDS.has(normalized)) return false
  return true
}

function getSemanticTrendTerms(video: YouTubeVideo) {
  const text = [
    video.snippet?.title || '',
    video.snippet?.description || '',
    video.snippet?.channelTitle || '',
    ...(video.snippet?.tags || []),
  ].join(' ').toLowerCase()
  const terms: string[] = []

  const hasAny = (patterns: RegExp[]) => patterns.some((pattern) => pattern.test(text))

  if (hasAny([/\btrailer\b/, /\bteaser\b/, /\bmovie\b/, /\bfilm\b/, /\bcinema\b/, /\bseries\b/, /\banime\b/])) {
    terms.push('film trailers')
  }

  if (hasAny([/\broblox\b/, /\bminecraft\b/, /\bfortnite\b/, /\bgaming\b/, /\bgameplay\b/, /\besports\b/, /\bnintendo\b/, /\bplaystation\b/, /\bxbox\b/])) {
    terms.push('gaming formats')
  }

  if (hasAny([/\bofficial video\b/, /\blyrics?\b/, /\bvisuali[sz]er\b/, /\bremix\b/, /\bcover\b/, /\balbum\b/, /\bmusic\b/, /\bsong\b/])) {
    terms.push('music releases')
  }

  if (hasAny([/\bchallenge\b/, /\bsurvive\b/, /\blast to\b/, /\bhide\b/, /\bseek\b/, /\bvs\b/, /\bexperiment\b/, /\btesting\b/])) {
    terms.push('creator challenges')
  }

  if (hasAny([/\bchatgpt\b/, /\bopenai\b/, /\bgpt\b/, /\bclaude\b/, /\bmidjourney\b/, /\bai tools?\b/, /\bartificial intelligence\b/])) {
    terms.push('ai tools')
  }

  return terms
}

function overlapRatio(a: string[], b: string[]) {
  if (a.length === 0 || b.length === 0) return 0
  const bSet = new Set(b)
  const overlap = a.filter((id) => bSet.has(id)).length
  return overlap / Math.min(a.length, b.length)
}

function dedupeOverlappingTrends(trends: RealTrend[]) {
  const selected: RealTrend[] = []

  for (const trend of trends) {
    const duplicate = selected.some((existing) => {
      const overlap = overlapRatio(trend.topVideoIds, existing.topVideoIds)
      if (overlap < 0.67) return false

      const currentWords = getKeywordWeight(trend.keyword)
      const existingWords = getKeywordWeight(existing.keyword)
      return currentWords <= existingWords || trend.videoCount <= existing.videoCount
    })

    if (!duplicate) selected.push(trend)
  }

  return selected
}

export function extractTrendsFromVideos(videos: YouTubeVideo[], region: string, maxTrends = 20): RealTrend[] {
  if (videos.length === 0) return []

  // Extract all keywords from video titles
  const keywordMap = new Map<string, {
    videos: typeof videos
    totalViews: number
    totalLikes: number
    totalComments: number
    totalVelocity: number
    creators: Set<string>
    tags: Set<string>
  }>()

  videos.forEach(video => {
    const title = video.snippet?.title || ''
    const rawWords = title
      .replace(/[^\w\s#]/g, ' ')
      .split(/\s+/)
      .map(w => w.replace(/^#/, '').toLowerCase())
      .filter(w => w.length >= 2 && !/^\d+$/.test(w))
    const words = rawWords
      .filter(w => w.length >= 3 && !STOP_WORDS.has(w) && !/^\d+$/.test(w))

    const views = Number(video.statistics?.viewCount || 0)
    const likes = Number(video.statistics?.likeCount || 0)
    const comments = Number(video.statistics?.commentCount || 0)
    const publishedAt = video.snippet?.publishedAt || new Date().toISOString()
    const ageDays = getAgeDays(publishedAt)
    const velocity = views / ageDays
    const channel = video.snippet?.channelTitle || 'unknown'

    // Also extract bigrams (2-word phrases) for richer trends
    const bigrams: string[] = []
    for (let i = 0; i < rawWords.length - 1; i++) {
      bigrams.push(`${rawWords[i]} ${rawWords[i + 1]}`)
    }

    const semanticTerms = getSemanticTrendTerms(video)
    const allTerms = [...words, ...bigrams, ...semanticTerms]

    allTerms.forEach(term => {
      const existing = keywordMap.get(term)
      if (existing) {
        existing.videos.push(video)
        existing.totalViews += views
        existing.totalLikes += likes
        existing.totalComments += comments
        existing.totalVelocity += velocity
        existing.creators.add(channel)
      } else {
        keywordMap.set(term, {
          videos: [video],
          totalViews: views,
          totalLikes: likes,
          totalComments: comments,
          totalVelocity: velocity,
          creators: new Set([channel]),
          tags: new Set(words.filter(w => w !== term)),
        })
      }
    })
  })

  // Convert to trends, filter meaningful ones
  const trends: RealTrend[] = []
  keywordMap.forEach((data, keyword) => {
    if (data.videos.length < 2) return // Must appear in at least 2 videos
    if (!isUsefulTrendKeyword(keyword)) return

    const avgVelocity = Math.round(data.totalVelocity / data.videos.length)
    const engagementRate = data.totalViews > 0
      ? ((data.totalLikes + data.totalComments * 2) / data.totalViews) * 100
      : 0
    const saturation = Math.min(100, data.creators.size * 8)
    const breakout = Math.min(100, (avgVelocity / 100000) * 20 + engagementRate * 3 + data.videos.length * 2)

    // Only keep trends with meaningful metrics
    if (breakout < 5 && data.videos.length < 3) return

    trends.push({
      slug: slugify(keyword),
      title: `${keyword.charAt(0).toUpperCase() + keyword.slice(1)}`,
      category: detectCategory(keyword),
      description: `Trending content about ${keyword} in ${region}. Based on ${data.videos.length} real viral videos with ${(data.totalViews / 1e6).toFixed(1)}M total views.`,
      keyword,
      videoCount: data.videos.length,
      totalViews: data.totalViews,
      totalLikes: data.totalLikes,
      totalComments: data.totalComments,
      avgVelocity,
      saturationScore: saturation,
      breakoutScore: breakout,
      creatorCount: data.creators.size,
      peakHours: Math.max(1, Math.round(48 - breakout * 0.4)),
      tags: Array.from(data.tags).slice(0, 5),
      topVideoIds: data.videos
        .sort((a, b) => Number(b.statistics?.viewCount || 0) - Number(a.statistics?.viewCount || 0))
        .slice(0, 12)
        .map(v => v.id),
      region,
    })
  })

  // Sort by breakout score descending
  const ranked = trends.sort((a, b) => {
    if (b.breakoutScore !== a.breakoutScore) return b.breakoutScore - a.breakoutScore
    if (b.videoCount !== a.videoCount) return b.videoCount - a.videoCount
    return getKeywordWeight(b.keyword) - getKeywordWeight(a.keyword)
  })

  return dedupeOverlappingTrends(ranked).slice(0, maxTrends)
}

export async function extractTrendsFromRegion(region: string, maxResults = 50): Promise<RealTrend[]> {
  const videos = await fetchTrendingVideos(region, maxResults)
  return extractTrendsFromVideos(videos, region, 20)
}

export function getTrendsByCategoryFromReal(trends: RealTrend[], category: string): RealTrend[] {
  return trends.filter(t => t.category.toLowerCase() === category.toLowerCase())
}

export function getAllCategoriesFromReal(trends: RealTrend[]): string[] {
  return Array.from(new Set(trends.map(t => t.category)))
}

export function getAllTagsFromReal(trends: RealTrend[]): string[] {
  const tagSet = new Set<string>()
  trends.forEach(t => t.tags.forEach(tag => tagSet.add(tag)))
  return Array.from(tagSet).sort()
}
