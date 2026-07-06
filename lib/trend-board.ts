import { unstable_cache } from 'next/cache'
import { fetchTrendingVideos, type YouTubeVideo } from './api-client'
import { getEngagementRate, getViewVelocity } from './analytics'
import type { Region } from './region'

export type TrendBoardCategoryId = 'gaming' | 'lifestyle' | 'music' | 'film'
export type TrendBoardLaneId = 'viral' | 'niche' | 'creative'

export interface TrendBoardVideo {
  video: YouTubeVideo
  category: TrendBoardCategoryId
  categoryLabel: string
  views: number
  engagement: number
  velocity: number
  viralScore: number
  nicheScore: number
  creativeScore: number
  topic: string
  format: string
  decision: string
}

export interface TrendBoardLane {
  id: TrendBoardLaneId
  label: string
  description: string
  videos: TrendBoardVideo[]
}

export interface TrendBoardSection {
  id: TrendBoardCategoryId
  label: string
  description: string
  videos: TrendBoardVideo[]
  lanes: TrendBoardLane[]
}

export interface TrendBoard {
  region: Region
  generatedAt: string
  refreshCadence: string
  videosTracked: number
  totalViews: number
  avgEngagement: number
  avgVelocity: number
  sections: TrendBoardSection[]
}

const CATEGORY_META: Record<TrendBoardCategoryId, { label: string; description: string; terms: string[] }> = {
  gaming: {
    label: 'Gaming',
    description: 'Games, esports, challenges, live-play moments, and creator-led gameplay formats.',
    terms: ['game', 'gaming', 'minecraft', 'fortnite', 'roblox', 'valorant', 'esports', 'nintendo', 'playstation', 'xbox', 'steam', 'gta', 'pokemon', 'dragon ball', 'subnautica', 'keyboard escape'],
  },
  lifestyle: {
    label: 'Lifestyle',
    description: 'People, food, travel, beauty, fitness, daily life, social experiments, and creator personality formats.',
    terms: ['vlog', 'food', 'mukbang', 'recipe', 'beauty', 'makeup', 'skincare', 'travel', 'fitness', 'workout', 'life', 'hospital', 'hide', 'seek', 'paint', 'cafe', 'challenge', 'sidemen'],
  },
  music: {
    label: 'Music',
    description: 'Official videos, lyric videos, covers, visualisers, artist drops, and music-led reaction loops.',
    terms: ['music', 'song', 'official video', 'lyrics', 'lyric', 'album', 'visualiser', 'visualizer', 'remix', 'cover', 'vevo', 'topic', 'rap', 'hip hop', 'concert'],
  },
  film: {
    label: 'Film & TV',
    description: 'Trailers, anime drops, episode breakdowns, streaming launches, film discourse, and fandom spikes.',
    terms: ['trailer', 'teaser', 'movie', 'film', 'cinema', 'series', 'episode', 'season', 'netflix', 'crunchyroll', 'anime', 'universal', 'disney', 'house of the dragon', 'odyssey', 'jojo'],
  },
}

const LANE_META: Record<TrendBoardLaneId, { label: string; description: string }> = {
  viral: {
    label: 'Viral',
    description: 'Highest immediate reach and velocity. Use these for packaging and timing benchmarks.',
  },
  niche: {
    label: 'Niche',
    description: 'Specific demand pockets with less broad competition. Use these for focused channel ideas.',
  },
  creative: {
    label: 'Creative Minds',
    description: 'Fresh formats, unusual hooks, or strong creator decisions. Use these for concept inspiration.',
  },
}

const CREATIVE_TERMS = [
  'challenge', 'experiment', 'secret', 'myth', 'testing', 'built', 'survived',
  'paint', 'hide', 'seek', 'modded', 'finally', 'breakdown', 'analyzed',
  'frame', 'worst', 'unexpected', 'vs', 'battle', 'tournament',
]

function textFor(video: YouTubeVideo) {
  return [
    video.snippet?.title || '',
    video.snippet?.description || '',
    video.snippet?.channelTitle || '',
  ].join(' ').toLowerCase()
}

function includesAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term))
}

function detectCategory(video: YouTubeVideo): TrendBoardCategoryId {
  const text = textFor(video)
  const matches = (id: TrendBoardCategoryId) =>
    CATEGORY_META[id].terms.reduce((score, term) => score + (text.includes(term) ? 1 : 0), 0)

  const scored = (Object.keys(CATEGORY_META) as TrendBoardCategoryId[])
    .map((id) => ({ id, score: matches(id) }))
    .sort((a, b) => b.score - a.score)

  if (scored[0]?.score > 0) return scored[0].id
  return 'lifestyle'
}

function inferFormat(video: YouTubeVideo) {
  const text = textFor(video)
  if (/trailer|teaser|preview/.test(text)) return 'Trailer / preview'
  if (/challenge|hide|seek|survive|last to|vs/.test(text)) return 'Challenge format'
  if (/official video|visuali[sz]er|lyrics|remix|cover/.test(text)) return 'Music drop'
  if (/breakdown|analy[sz]ed|review|explained/.test(text)) return 'Breakdown / analysis'
  if (/roblox|minecraft|gameplay|tournament|modded/.test(text)) return 'Gameplay loop'
  return 'Creator-led format'
}

function inferTopic(video: YouTubeVideo) {
  const title = video.snippet?.title || 'Untitled'
  return title
    .replace(/[^\w\s'-]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2)
    .slice(0, 4)
    .join(' ') || 'emerging topic'
}

function scoreVideo(video: YouTubeVideo): TrendBoardVideo {
  const views = Number(video.statistics?.viewCount || 0)
  const engagement = getEngagementRate(video)
  const velocity = getViewVelocity(video)
  const text = textFor(video)
  const category = detectCategory(video)

  const viralScore = Math.round(
    Math.min(45, Math.log10(views + 1) * 5.5) +
    Math.min(35, Math.log10(velocity + 1) * 5.2) +
    Math.min(20, engagement * 3.5)
  )

  const specificity = Math.min(28, (video.snippet?.title || '').split(/\s+/).filter((word) => word.length > 5).length * 4)
  const nicheScore = Math.round(
    Math.min(38, engagement * 7) +
    Math.min(34, Math.log10(velocity + 1) * 4.2) +
    specificity -
    Math.min(18, Math.log10(views + 1) * 1.8)
  )

  const creativeTermCount = CREATIVE_TERMS.filter((term) => text.includes(term)).length
  const creativeScore = Math.round(
    Math.min(42, creativeTermCount * 12) +
    Math.min(28, engagement * 5) +
    Math.min(30, Math.log10(velocity + 1) * 3.8)
  )

  const format = inferFormat(video)

  return {
    video,
    category,
    categoryLabel: CATEGORY_META[category].label,
    views,
    engagement,
    velocity,
    viralScore,
    nicheScore,
    creativeScore,
    topic: inferTopic(video),
    format,
    decision: viralScore >= 80
      ? 'Benchmark now'
      : nicheScore >= 55
        ? 'Explore niche'
        : creativeScore >= 60
          ? 'Steal the format'
          : 'Track only',
  }
}

function uniqueByVideoId(items: TrendBoardVideo[]) {
  const seen = new Set<string>()
  return items.filter((item) => {
    if (seen.has(item.video.id)) return false
    seen.add(item.video.id)
    return true
  })
}

function topBy(items: TrendBoardVideo[], lane: TrendBoardLaneId, limit: number) {
  const key = lane === 'viral' ? 'viralScore' : lane === 'niche' ? 'nicheScore' : 'creativeScore'
  return uniqueByVideoId([...items].sort((a, b) => {
    if (b[key] !== a[key]) return b[key] - a[key]
    return b.velocity - a.velocity
  })).slice(0, limit)
}

function buildSections(items: TrendBoardVideo[]): TrendBoardSection[] {
  return (Object.keys(CATEGORY_META) as TrendBoardCategoryId[]).map((id) => {
    const videos = items.filter((item) => item.category === id)
    return {
      id,
      label: CATEGORY_META[id].label,
      description: CATEGORY_META[id].description,
      videos,
      lanes: (Object.keys(LANE_META) as TrendBoardLaneId[]).map((laneId) => ({
        id: laneId,
        label: LANE_META[laneId].label,
        description: LANE_META[laneId].description,
        videos: topBy(videos, laneId, 4),
      })),
    }
  }).filter((section) => section.videos.length > 0)
}

export function buildTrendBoard(videos: YouTubeVideo[], region: Region): TrendBoard {
  const scored = uniqueByVideoId(videos.map(scoreVideo))
  const totalViews = scored.reduce((sum, item) => sum + item.views, 0)
  const avgEngagement = scored.length > 0
    ? scored.reduce((sum, item) => sum + item.engagement, 0) / scored.length
    : 0
  const avgVelocity = scored.length > 0
    ? scored.reduce((sum, item) => sum + item.velocity, 0) / scored.length
    : 0

  return {
    region,
    generatedAt: new Date().toISOString(),
    refreshCadence: 'hourly',
    videosTracked: scored.length,
    totalViews,
    avgEngagement,
    avgVelocity,
    sections: buildSections(scored),
  }
}

export const getCachedTrendBoard = unstable_cache(
  async (region: Region) => {
    const videos = await fetchTrendingVideos(region, 50, {
      retries: 0,
      timeoutMs: 3500,
      revalidateSeconds: 3600,
    })
    return buildTrendBoard(videos, region)
  },
  ['tubefission-trend-board-v1'],
  { revalidate: 3600, tags: ['trend-board'] }
)

