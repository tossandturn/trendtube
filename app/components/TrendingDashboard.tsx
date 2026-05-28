'use client'

import { useEffect, useMemo, useState, useRef } from 'react'
import Link from 'next/link'
import AdBanner from './AdBanner'
import { getEngagementRate, getViewVelocity, getTagColor, getTagEmoji } from '@/lib/analytics'

/* =========================================================
   TYPES
========================================================= */

interface VideoSnippet {
  title: string
  channelTitle: string
  description?: string
  thumbnails?: {
    high?: { url: string }
    medium?: { url: string }
    default?: { url: string }
  }
}

interface VideoStatistics {
  viewCount?: string
  likeCount?: string
  commentCount?: string
}

interface Video {
  id: string
  snippet?: VideoSnippet
  statistics?: VideoStatistics
}

interface TagItem {
  tag: string
  growth: number
  rank: number
  previousRank: number
}

interface TrendingDashboardProps {
  initialVideos: Video[]
  initialRegion?: string
}

/* =========================================================
   CONSTANTS
========================================================= */

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || ''
const REGIONS = ['US', 'JP', 'KR', 'GB', 'HK', 'TW']

const REGION_META: Record<string, { label: string; flag: string }> = {
  US: { label: 'United States', flag: 'us' },
  JP: { label: 'Japan', flag: 'jp' },
  KR: { label: 'Korea', flag: 'kr' },
  GB: { label: 'United Kingdom', flag: 'gb' },
  HK: { label: 'Hong Kong', flag: 'hk' },
  TW: { label: 'Taiwan', flag: 'tw' },
}

const TAG_MAP: { tag: string; keywords: string[] }[] = [
  { tag: 'AI', keywords: ['ai', 'chatgpt', 'openai', 'gpt'] },
  { tag: 'Shorts', keywords: ['shorts', '#shorts', 'short'] },
  { tag: 'Gaming', keywords: ['gaming', 'minecraft', 'gta', 'fortnite'] },
  { tag: 'Coding', keywords: ['coding', 'developer', 'programming', 'react', 'javascript'] },
  { tag: 'Crypto', keywords: ['crypto', 'bitcoin', 'ethereum'] },
  { tag: 'Business', keywords: ['business', 'money', 'startup'] },
  { tag: 'Football', keywords: ['football', 'soccer'] },
  { tag: 'Anime', keywords: ['anime'] },
  { tag: 'Music', keywords: ['music', 'song'] },
  { tag: 'MrBeast Style', keywords: ['$10000', '$100000', 'challenge', 'last to leave'] },
]

const PEAK_OPTIONS = ['6 hours', '12 hours', '18 hours', '24 hours', '36 hours', '48 hours']

const SUGGESTED_TITLES: Record<string, string[]> = {
  'AI': ['Build an AI app in 60 seconds', 'I taught AI to code for me', 'This AI tool changed everything'],
  'Coding': ['Coding this in 1 minute', 'You need this JavaScript trick', 'React tutorial that actually works'],
  'Shorts': ['Wait for the ending', 'This trend is insane', 'You won\'t believe this'],
  'Gaming': ['Secret level you missed', 'This glitch broke the game', 'Speedrun world record'],
  'Crypto': ['This coin just exploded', 'Crypto update you need', 'Trading strategy revealed'],
  'Business': ['Make $1000 online today', 'Business idea no one talks about', 'Side hustle that works'],
  'Football': ['Goal you need to see', 'This player is unstoppable', 'Match analysis'],
  'Anime': ['Anime recommendation', 'This scene broke me', 'Top 10 anime this week'],
  'Music': ['Song you need to hear', 'This beat is fire', 'Music production secret'],
  'MrBeast Style': ['$1000 challenge', 'Last to leave wins', 'Extreme challenge'],
}

/* =========================================================
   HELPERS
========================================================= */

function extractAITags(title: string, description: string = '') {
  const text = `${title} ${description}`.toLowerCase()
  const tags = TAG_MAP.filter((item) =>
    item.keywords.some((keyword) => text.includes(keyword))
  ).map((item) => item.tag)
  if (tags.length === 0) tags.push('Trending')
  return tags
}

function calculateTrendScore(video: Video) {
  const views = Number(video.statistics?.viewCount || 0)
  const likes = Number(video.statistics?.likeCount || 0)
  const comments = Number(video.statistics?.commentCount || 0)
  return Math.floor(((likes * 3 + comments * 5) / Math.max(views, 1)) * 100000)
}

function getTrendStage(score: number) {
  if (score > 350) return { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', label: 'VIRAL' }
  if (score > 250) return { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', label: 'RISING' }
  return { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', label: 'EMERGING' }
}

function formatNumber(n: string | undefined) {
  const num = Number(n || 0)
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B'
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M'
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K'
  return num.toLocaleString()
}

function getTrendGrowth(video: Video) {
  const velocity = getViewVelocity(video)
  if (velocity > 5_000_000) return '⚡ 5M+ /day'
  if (velocity > 2_000_000) return '⚡ 2M+ /day'
  if (velocity > 1_000_000) return '⚡ 1M+ /day'
  if (velocity > 500_000) return '⚡ 500K+ /day'
  if (velocity > 100_000) return '⚡ 100K+ /day'
  return '⚡ ' + Math.round(velocity).toLocaleString() + ' /day'
}

function getViralScore(video: Video): number {
  const views = Number(video.statistics?.viewCount || 0)
  const likes = Number(video.statistics?.likeCount || 0)
  const comments = Number(video.statistics?.commentCount || 0)
  const velocity = getViewVelocity(video)
  const title = video.snippet?.title?.toLowerCase() || ''

  // Velocity weight (0-35) — MOST IMPORTANT per doc
  let velocityWeight = 0
  if (velocity > 5_000_000) velocityWeight = 35
  else if (velocity > 2_000_000) velocityWeight = 30
  else if (velocity > 1_000_000) velocityWeight = 25
  else if (velocity > 500_000) velocityWeight = 20
  else if (velocity > 200_000) velocityWeight = 15
  else if (velocity > 100_000) velocityWeight = 10
  else velocityWeight = Math.max(1, Math.round(velocity / 10_000))

  // Engagement weight (0-30)
  const likeRate = views > 0 ? (likes / views) * 1000 : 0
  const commentRate = views > 0 ? (comments / views) * 1000 : 0
  const engagementWeight = Math.min(30, likeRate * 2 + commentRate * 5)

  // Retention prediction (0-20) — from engagement patterns
  const commentRichness = likes > 0 ? (comments / likes) * 100 : 0
  const retentionWeight = Math.min(20, commentRichness * 2 + likeRate * 1.5)

  // Low competition bonus (0-10) — lower views = higher bonus
  const competitionBonus = views < 1_000_000 ? 10 : views < 5_000_000 ? 6 : views < 20_000_000 ? 3 : 0

  // Emerging topic bonus (0-5)
  let emergingBonus = 0
  if (title.includes('ai') || title.includes('chatgpt') || title.includes('openai')) emergingBonus = 5
  else if (title.includes('shorts') || title.includes('#shorts')) emergingBonus = 4
  else if (title.includes('challenge')) emergingBonus = 3
  else if (title.includes('tutorial') || title.includes('how to')) emergingBonus = 2

  return Math.min(100, Math.max(1, Math.round(velocityWeight + engagementWeight + retentionWeight + competitionBonus + emergingBonus)))
}

function getOpportunityScore(video: Video): number {
  const views = Number(video.statistics?.viewCount || 0)
  const likes = Number(video.statistics?.likeCount || 0)
  const comments = Number(video.statistics?.commentCount || 0)
  const velocity = getViewVelocity(video)
  const title = video.snippet?.title?.toLowerCase() || ''

  // Early momentum window (0-40) — low views + high velocity = best opportunity
  let momentumWindow = 0
  if (views < 500_000 && velocity > 200_000) momentumWindow = 40
  else if (views < 1_000_000 && velocity > 100_000) momentumWindow = 35
  else if (views < 2_000_000 && velocity > 50_000) momentumWindow = 30
  else if (views < 5_000_000) momentumWindow = 20
  else if (views < 15_000_000) momentumWindow = 10
  else momentumWindow = 3

  // Engagement momentum (0-30)
  const likeRate = views > 0 ? (likes / views) * 1000 : 0
  const commentRate = views > 0 ? (comments / views) * 1000 : 0
  const engagementScore = Math.min(30, likeRate * 2.5 + commentRate * 6)

  // Velocity bonus (0-20) — high velocity gets extra points
  const velocityBonus = Math.min(20, Math.round(velocity / 200_000))

  // Niche freshness (0-10)
  let nicheScore = 3
  if (title.includes('ai') || title.includes('chatgpt') || title.includes('openai')) nicheScore = 10
  else if (title.includes('shorts') || title.includes('#shorts')) nicheScore = 9
  else if (title.includes('tutorial') || title.includes('how to')) nicheScore = 8
  else if (title.includes('challenge') || title.includes('last to')) nicheScore = 7
  else if (title.includes('reaction') || title.includes('reacts')) nicheScore = 6
  else if (title.includes('gaming') || title.includes('minecraft') || title.includes('fortnite')) nicheScore = 5
  else if (title.includes('crypto') || title.includes('bitcoin')) nicheScore = 5

  return Math.min(100, Math.max(1, Math.round(momentumWindow + engagementScore + velocityBonus + nicheScore)))
}

function getPeakExpected(video: Video): string {
  const velocity = getViewVelocity(video)
  if (velocity > 2_000_000) return '6 hours'
  if (velocity > 1_000_000) return '12 hours'
  if (velocity > 500_000) return '18 hours'
  if (velocity > 200_000) return '24 hours'
  if (velocity > 100_000) return '36 hours'
  return '48 hours'
}

function getCreatorAlert(video: Video, allVideos: Video[]): number {
  const tags = extractAITags(video.snippet?.title || '', video.snippet?.description || '')
  let count = 0
  allVideos.forEach((v) => {
    const vTags = extractAITags(v.snippet?.title || '', v.snippet?.description || '')
    if (tags.some((t) => vTags.includes(t))) count++
  })
  return count
}

function getHookStyle(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('wait')) return 'Wait for the ending'
  if (t.includes('challenge') || t.includes('won')) return 'Challenge hook'
  if (t.includes('how to') || t.includes('tutorial')) return 'Tutorial promise'
  if (t.includes('secret') || t.includes('hidden')) return 'Secret reveal'
  if (t.includes('fast') || t.includes('quick') || t.includes('minute')) return 'Speed promise'
  if (t.includes('never') || t.includes("don't")) return 'Curiosity gap'
  return 'Curiosity gap'
}

function getRetentionPrediction(video: Video): string {
  const score = calculateTrendScore(video)
  if (score > 300) return 'HIGH'
  if (score > 200) return 'MEDIUM'
  return 'MODERATE'
}

function generateWhyBlowingUp(video: Video): string {
  const title = video.snippet?.title?.toLowerCase() || ''
  const views = Number(video.statistics?.viewCount || 0)
  const likes = Number(video.statistics?.likeCount || 0)
  const comments = Number(video.statistics?.commentCount || 0)
  const likeRatio = views > 0 ? likes / views : 0
  const commentRatio = views > 0 ? comments / views : 0
  const commentToLikeRatio = likes > 0 ? comments / likes : 0

  // Detect content type from title
  const isShort = title.includes('shorts') || title.includes('#shorts')
  const isTutorial = title.includes('how to') || title.includes('tutorial') || title.includes('guide')
  const isList = /\d+/.test(title) && (title.includes('best') || title.includes('top') || title.includes('ways') || title.includes('things'))
  const isReaction = title.includes('reaction') || title.includes('reacts to') || title.includes('responds')
  const isChallenge = title.includes('challenge') || title.includes('try ') || title.includes('i tried')
  const isNews = title.includes('news') || title.includes('update') || title.includes('breaking')
  const isReview = title.includes('review') || title.includes('vs ') || title.includes('comparison')
  const isStory = title.includes('story') || title.includes('i was') || title.includes('my ') || title.includes('i got')
  const isAI = title.includes('ai') || title.includes('chatgpt') || title.includes('openai') || title.includes('gpt')
  const isGaming = title.includes('game') || title.includes('minecraft') || title.includes('fortnite') || title.includes('gta') || title.includes('play')
  const isMusic = title.includes('song') || title.includes('music') || title.includes('cover') || title.includes('official')
  const isPrank = title.includes('prank') || title.includes('trolling')
  const isTransformation = title.includes('before') || title.includes('makeover') || title.includes('remodel')

  const highLikeRatio = likeRatio > 0.03
  const highCommentRatio = commentRatio > 0.0008
  const highDiscussion = commentToLikeRatio > 0.04
  const megaViral = views > 20_000_000
  const rising = views > 1_000_000 && views < 10_000_000

  // Shorts
  if (isShort && highLikeRatio) {
    return 'Shorts format amplified by exceptional like velocity — the algorithm heavily weights viewer approval on vertical content, creating a rapid distribution loop.'
  }
  if (isShort && highDiscussion) {
    return 'Vertical format triggering unusually high comment debate — Shorts with discussion density receive extended impressions as the algorithm tests broader audiences.'
  }
  if (isShort) {
    return 'Riding YouTube\'s Shorts algorithmic push — vertical content currently receives 2-3x more impressions per upload compared to traditional long-form.'
  }

  // Tutorial
  if (isTutorial && megaViral) {
    return 'Mass-market tutorial hitting global search demand — evergreen "how-to" content with broad appeal sustains discovery through both search and recommended feeds.'
  }
  if (isTutorial && highLikeRatio) {
    return 'Tutorial content with exceptional viewer satisfaction — high like ratio indicates the method actually works, driving repeat watches and saves.'
  }
  if (isTutorial) {
    return 'Educational content capturing high-intent search traffic — viewers actively seeking solutions drive above-average watch time and lower skip rates.'
  }

  // List
  if (isList && megaViral) {
    return 'List format exploiting cognitive completion bias at scale — numbered promises create irresistible click-through and sustained retention across millions of viewers.'
  }
  if (isList) {
    return 'Structured list triggering curiosity-driven retention — viewers feel compelled to watch through all entries to avoid missing the "best" item.'
  }

  // Reaction
  if (isReaction && highDiscussion) {
    return 'Reaction format igniting polarized comment debate — opinion-driven responses create controversy loops that the algorithm interprets as high engagement.'
  }
  if (isReaction && megaViral) {
    return 'Reaction video piggybacking on a mainstream cultural moment — leveraging existing audience interest dramatically reduces discovery friction.'
  }
  if (isReaction) {
    return 'Reaction content feeding parasocial connection — viewers return to see the creator\'s personality and opinions, building habitual watch patterns.'
  }

  // Challenge
  if (isChallenge && megaViral) {
    return 'Challenge format achieving mass participation velocity — repeatable concept encourages response videos, duets, and community submissions that compound reach.'
  }
  if (isChallenge) {
    return 'Challenge structure creating a powerful curiosity gap — viewers must watch to the conclusion to see if the creator succeeds or fails.'
  }

  // News
  if (isNews && highDiscussion) {
    return 'Breaking news surfacing in real-time search with active debate — recency bonus combined with comment controversy accelerates recommendation velocity.'
  }
  if (isNews) {
    return 'News content benefiting from temporal relevance priority — current events receive algorithmic preference in trending and explore surfaces.'
  }

  // Review
  if (isReview && highLikeRatio) {
    return 'Review content validated by strong approval metrics — high like ratio signals trustworthy information, critical for purchase-intent search traffic.'
  }
  if (isReview) {
    return 'Comparison content capturing mid-funnel research traffic — viewers actively evaluating options watch longer and engage deeper than passive entertainment.'
  }

  // Story
  if (isStory && highDiscussion) {
    return 'Personal narrative driving emotional comment engagement — relatability triggers sharing behavior as viewers tag friends who had similar experiences.'
  }
  if (isStory) {
    return 'Storytelling format leveraging emotional hooks — personal experiences create stronger parasocial bonds than generic or informational content.'
  }

  // AI
  if (isAI && megaViral) {
    return 'AI topic riding a global curiosity wave — mainstream interest in artificial intelligence creates sustained cross-demographic discovery traffic.'
  }
  if (isAI && isTutorial) {
    return 'AI tutorial capturing the early-adopter education market — teaching new tools before saturation builds authority and subscriber loyalty.'
  }
  if (isAI) {
    return 'AI content attracting high-value tech-savvy audiences — niche expertise draws viewers with above-average engagement and sharing behavior.'
  }

  // Gaming
  if (isGaming && megaViral) {
    return 'Gaming content boosted by a major update, event, or release — community mobilization around new content drives simultaneous coordinated view spikes.'
  }
  if (isGaming && highDiscussion) {
    return 'Gaming content sparking community debate — patch notes, tier lists, and controversial takes drive above-average comment density.'
  }
  if (isGaming) {
    return 'Gaming content maintaining consistent session duration — dedicated player communities provide reliable return viewership and playlist continuity.'
  }

  // Music
  if (isMusic && megaViral) {
    return 'Music content achieving playlist and algorithmic crossover — tracks that bridge niches receive distribution across multiple recommendation clusters.'
  }
  if (isMusic) {
    return 'Music content benefiting from repeatability — songs get rewatched and re-listened, inflating view counts and signaling strong retention to the algorithm.'
  }

  // Prank
  if (isPrank) {
    return 'Prank format leveraging suspense and surprise — unpredictable outcomes create strong retention curves as viewers anticipate the reaction.'
  }

  // Transformation
  if (isTransformation) {
    return 'Transformation content satisfying the completion bias — viewers are emotionally invested in seeing the before-and-after payoff.'
  }

  // Engagement patterns
  if (highLikeRatio && highDiscussion) {
    return 'Rare combination of mass approval and active discussion — both high likes and comment threads signal exceptional content that resonates and provokes thought.'
  }
  if (highLikeRatio && rising) {
    return 'Strong approval signals on a mid-size video — the algorithm is likely testing this content to broader audiences based on exceptional early engagement.'
  }
  if (highLikeRatio) {
    return 'Above-average like-to-view ratio indicates content exceeds expectations — positive surprise drives organic sharing and saves.'
  }
  if (highDiscussion) {
    return 'Elevated comment density suggests controversy or debate — discussion-driven content receives extended algorithmic promotion as comments indicate depth.'
  }
  if (megaViral) {
    return 'Massive cross-platform virality — this content has broken out of its niche into mainstream recommendation feeds across demographics.'
  }
  if (rising) {
    return 'Rising momentum detected — engagement velocity suggests the algorithm is actively expanding distribution beyond the core audience.'
  }

  return 'Steady engagement pattern with consistent audience retention — reliable performance within its content category with room for broader discovery.'
}

function generateCompetitionLevel(video: Video): string {
  const views = Number(video.statistics?.viewCount || 0)
  if (views < 500_000) return 'LOW'
  if (views < 2_000_000) return 'MEDIUM'
  return 'HIGH'
}

function generateSuggestedTitles(tag: string): string[] {
  return SUGGESTED_TITLES[tag] || [`${tag} content that blows up`, `Why ${tag} is trending now`, `The ${tag} opportunity you missed`]
}

function slugifyTag(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, '-')
}

/* =========================================================
   SUB-COMPONENTS
========================================================= */

function SectionHeader({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return (
    <div className="relative">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-1 h-6 rounded-full bg-gradient-to-b from-red-400 to-red-600" />
        <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
          <span className="text-yellow-400">{icon}</span> {title}
        </h2>
      </div>
      {subtitle && <p className="text-zinc-500 text-sm ml-4">{subtitle}</p>}
      <div className="section-divider mt-3" />
    </div>
  )
}

/* =========================================================
   MAIN
========================================================= */

export default function TrendingDashboard({ initialVideos, initialRegion }: TrendingDashboardProps) {
  const [videos, setVideos] = useState<Video[]>(initialVideos)
  const [loading, setLoading] = useState(initialVideos.length === 0)
  const [region, setRegion] = useState(initialRegion || 'US')
  const didInit = useRef(false)

  /* ----- FETCH ----- */
  async function fetchVideos() {
    if (!API_KEY) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=50&regionCode=${region}&key=${API_KEY}`
      )
      if (!res.ok) throw new Error(`YouTube API error: ${res.status}`)
      const data = await res.json()
      if (data.items) {
        setVideos(data.items)
      }
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true
      if (initialVideos.length === 0) fetchVideos()
      return
    }
    fetchVideos()
  }, [region])

  /* ----- COMPUTED ----- */
  const trendingVideos = useMemo(() => {
    return [...videos].sort((a, b) => Number(b.statistics?.viewCount || 0) - Number(a.statistics?.viewCount || 0))
  }, [videos])

  const opportunityVideos = useMemo(() => {
    const filtered = [...videos]
      .filter((video) => Number(video.statistics?.viewCount || 0) < 50_000_000)
      .sort((a, b) => calculateTrendScore(b) - calculateTrendScore(a))
      .slice(0, 6)
    if (filtered.length > 0) return filtered
    return [...videos].sort((a, b) => calculateTrendScore(b) - calculateTrendScore(a)).slice(0, 6)
  }, [videos])

  const shortsVideos = useMemo(() => {
    const filtered = videos.filter((video) => {
      const title = video.snippet?.title?.toLowerCase() || ''
      return title.includes('shorts') || title.includes('#shorts') || title.includes('short')
    })
    return filtered.length > 0 ? filtered.slice(0, 8) : videos.slice(0, 8)
  }, [videos])

  const trendingTags: TagItem[] = useMemo(() => {
    const map: Record<string, { tag: string; totalVelocity: number; count: number; totalEngagement: number }> = {}
    videos.forEach((video) => {
      const tags = extractAITags(video.snippet?.title || '', video.snippet?.description || '')
      tags.forEach((tag) => {
        if (!map[tag]) {
          map[tag] = { tag, totalVelocity: 0, count: 0, totalEngagement: 0 }
        }
        map[tag].totalVelocity += getViewVelocity(video)
        map[tag].totalEngagement += getEngagementRate(video)
        map[tag].count++
      })
    })
    return Object.values(map)
      .map((item, idx, arr) => ({
        tag: item.tag,
        growth: Math.round(item.totalVelocity / item.count / 1000),
        rank: idx + 1,
        previousRank: arr.length,
      }))
      .sort((a, b) => b.growth - a.growth)
  }, [videos])

  /* ----- CREATOR SUGGESTIONS ----- */
  const creatorSuggestions = useMemo(() => {
    return trendingTags.slice(0, 3).map((tag) => ({
      tag: tag.tag,
      titles: generateSuggestedTitles(tag.tag),
      competition: tag.growth > 300 ? 'MEDIUM' : 'LOW',
      saturationDays: Math.max(1, Math.min(7, Math.round(3000 / Math.max(tag.growth, 1)))),
    }))
  }, [trendingTags])

  /* ----- MISSED OPPORTUNITIES ----- */
  const missedOpportunities = useMemo(() => {
    return [...videos]
      .sort((a, b) => Number(b.statistics?.viewCount || 0) - Number(a.statistics?.viewCount || 0))
      .slice(0, 3)
      .map((video) => {
        const tag = extractAITags(video.snippet?.title || '')[0] || 'Trending'
        const velocity = getViewVelocity(video)
        const missedGrowth = velocity >= 1e6 ? (velocity / 1e6).toFixed(1) + 'M' : velocity >= 1e3 ? (velocity / 1e3).toFixed(1) + 'K' : Math.round(velocity).toString()
        return { video, tag, missedGrowth }
      })
  }, [videos])

  /* ----- TAG STATS & CHART DATA ----- */
  const tagStats = useMemo(() => {
    const stats: Record<string, { count: number; totalEngagement: number; totalViews: number; totalVelocity: number }> = {}
    videos.forEach((video) => {
      const tags = extractAITags(video.snippet?.title || '', video.snippet?.description || '')
      tags.forEach((tag) => {
        if (!stats[tag]) stats[tag] = { count: 0, totalEngagement: 0, totalViews: 0, totalVelocity: 0 }
        stats[tag].count++
        stats[tag].totalEngagement += getEngagementRate(video)
        stats[tag].totalViews += Number(video.statistics?.viewCount || 0)
        stats[tag].totalVelocity += getViewVelocity(video)
      })
    })
    return Object.entries(stats)
      .map(([tag, data]) => ({
        tag,
        count: data.count,
        avgEngagement: data.totalEngagement / data.count,
        avgViews: data.totalViews / data.count,
        avgVelocity: data.totalVelocity / data.count,
      }))
      .sort((a, b) => b.avgVelocity - a.avgVelocity)
  }, [videos])

  const topOpportunityTag = trendingTags[0] || { tag: 'AI', growth: 420 }
  const topOpportunityVideo = opportunityVideos[0]

  return (
    <main className="min-h-screen bg-white text-gray-900 terminal-grid relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="ambient-glow-tl" />
      <div className="ambient-glow-tr" />
      <div className="ambient-glow-bl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10">

        {/* ===== VALUE PROPOSITION HERO ===== */}
        <section className="relative overflow-hidden rounded-3xl mb-10 sm:mb-14 glass-panel corner-accent">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/[0.08] rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-500/[0.06] rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="relative p-6 sm:p-10 lg:p-14">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-gray-500 text-xs data-mono mb-4">
                <img
                  src={`https://flagcdn.com/w40/${REGION_META[region]?.flag || 'us'}.png`}
                  alt={REGION_META[region]?.label || 'United States'}
                  className="w-5 h-4 rounded-sm object-cover"
                  loading="lazy"
                />
                <span className="uppercase tracking-wider">{REGION_META[region]?.label || 'United States'}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4 leading-[1.05] text-glow">
                Find Viral YouTube Topics<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 text-glow-red">Before They Peak</span>
              </h1>
              <p className="text-gray-500 text-base sm:text-lg max-w-2xl leading-relaxed mb-6">
                Predict viral niches early, see low-competition opportunities, and create videos while competition is still low.
              </p>

              <div className="flex flex-wrap gap-3 mb-6">
                <Link
                  href={`/tag/${slugifyTag(topOpportunityTag.tag)}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-zinc-200 transition shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                >
                  Start Exploring →
                </Link>
                <Link
                  href="/trending"
                  className="inline-flex items-center gap-2 px-6 py-3 glass-panel text-white rounded-xl font-bold text-sm hover:bg-zinc-800/80 transition glow-hover"
                >
                  See Trending Now
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: '🔮', text: 'Predict viral niches early' },
                  { icon: '🎯', text: 'See low-competition opportunities' },
                  { icon: '⚡', text: 'Generate winning video ideas instantly' },
                  { icon: '📱', text: 'Built for Shorts & AI creators' },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-2 glass-panel rounded-xl p-3">
                    <span className="text-lg shrink-0">{item.icon}</span>
                    <span className="text-gray-600 text-xs font-medium leading-snug">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION 1: TODAY'S TOP OPPORTUNITY ===== */}
        <section className="mb-16 sm:mb-20">
          <SectionHeader icon="🔥" title="Today's Biggest Opportunity" subtitle="Real-time data on the trend with the highest early-momentum window." />

          <div className="glass-panel neon-border rounded-2xl sm:rounded-3xl p-6 sm:p-8 glow-hover corner-accent relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-red-500/[0.05] rounded-full blur-[80px]" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl float-slow">🔥</span>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-glow">{topOpportunityTag.tag}</div>
                  <div className="text-green-400 font-black text-base text-glow-green data-mono">
                    ⚡ {topOpportunityTag.growth >= 1000 ? (topOpportunityTag.growth / 1000).toFixed(1) + 'M' : topOpportunityTag.growth}K/day velocity
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="glass-panel rounded-xl p-3 corner-accent">
                  <div className="text-gray-500 text-xs mb-1 data-mono tracking-wider">🎯 COMPETITION</div>
                  <div className="text-green-600 font-bold text-sm text-glow-green">LOW 🟢</div>
                </div>
                <div className="glass-panel rounded-xl p-3 corner-accent">
                  <div className="text-gray-500 text-xs mb-1 data-mono tracking-wider">⏰ PREDICTED PEAK</div>
                  <div className="text-gray-900 font-bold text-sm">Next {topOpportunityVideo ? getPeakExpected(topOpportunityVideo) : '24h'} 🚀</div>
                </div>
                <div className="glass-panel rounded-xl p-3 corner-accent">
                  <div className="text-gray-500 text-xs mb-1 data-mono tracking-wider">⚡ URGENCY</div>
                  <div className="text-red-600 font-bold text-sm text-glow-red breathe">HIGH 🔥</div>
                </div>
                <div className="glass-panel rounded-xl p-3 corner-accent">
                  <div className="text-gray-500 text-xs mb-1 data-mono tracking-wider">📊 DATA SOURCE</div>
                  <div className="text-gray-700 font-bold text-sm">YouTube API</div>
                </div>
              </div>

              {/* Velocity Mini Bars */}
              <div className="glass-panel rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-gray-500 text-xs data-mono tracking-wider">📊 TOP {topOpportunityTag.tag.toUpperCase()} VIDEOS BY VELOCITY</div>
                </div>
                <div className="space-y-2">
                  {videos
                    .filter((v) => extractAITags(v.snippet?.title || '', v.snippet?.description || '').includes(topOpportunityTag.tag))
                    .sort((a, b) => getViewVelocity(b) - getViewVelocity(a))
                    .slice(0, 5)
                    .map((v, i) => {
                      const vel = getViewVelocity(v)
                      const maxVel = Math.max(...videos.map((x) => getViewVelocity(x)), 1)
                      return (
                        <div key={i} className="flex items-center gap-2">
                          <div className="text-gray-400 text-[10px] w-4 data-mono">{i + 1}</div>
                          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 shadow-[0_0_8px_rgba(34,197,94,0.4)]" style={{ width: `${(vel / maxVel) * 100}%` }} />
                          </div>
                          <div className="text-gray-500 text-[10px] w-16 text-right data-mono">
                            {vel >= 1e6 ? (vel / 1e6).toFixed(1) + 'M' : (vel / 1e3).toFixed(0) + 'K'}
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>

              {topOpportunityVideo && (
                <div className="glass-panel rounded-xl p-4 mb-6">
                  <div className="text-gray-500 text-xs mb-1 data-mono tracking-wider">💡 SUGGESTED VIDEO IDEA</div>
                  <div className="font-bold text-sm sm:text-base line-clamp-1 text-glow">
                    &quot;{generateSuggestedTitles(topOpportunityTag.tag)[0]}&quot;
                  </div>
                </div>
              )}

              <Link
                href={`/tag/${slugifyTag(topOpportunityTag.tag)}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl font-bold text-sm hover:bg-zinc-200 transition shadow-[0_0_20px_rgba(255,255,255,0.15)]"
              >
                Watch Trend →
              </Link>
            </div>
          </div>
        </section>

        <AdBanner slot="1234567890" className="my-8" />

        {/* ===== SECTION 2: TRENDING TAGS BUBBLE CLUSTER ===== */}
        <section className="mb-16 sm:mb-20">
          <div className="mb-6 sm:mb-8">
            <SectionHeader icon="✦" title="Trending Tags" subtitle="Bubble size = popularity. Glow = momentum. Click to explore." />
          </div>

          <div className="glass-panel neon-border rounded-2xl p-6 sm:p-8 relative overflow-hidden glow-hover">
            {/* Ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/[0.04] rounded-full blur-[100px] animate-pulse" />

            <div className="relative flex flex-wrap items-center justify-center gap-4 sm:gap-6 min-h-[300px]">
              {tagStats.map((stat) => {
                const size = Math.max(90, Math.min(180, stat.count * 30 + 70))
                const isHighVelocity = stat.avgVelocity > 500_000
                const isMediumVelocity = stat.avgVelocity > 100_000
                const glowSize = isHighVelocity ? '50px' : isMediumVelocity ? '30px' : '15px'
                const color = getTagColor(stat.tag)

                return (
                  <Link
                    key={stat.tag}
                    href={`/tag/${slugifyTag(stat.tag)}`}
                    className="group relative rounded-full flex flex-col items-center justify-center text-center transition-all duration-500 hover:scale-110 hover:z-10"
                    style={{
                      width: size,
                      height: size,
                      backgroundColor: `${color}15`,
                      border: `2px solid ${color}`,
                      boxShadow: `0 0 ${glowSize} ${color}40, inset 0 0 ${glowSize} ${color}20`,
                    }}
                  >
                    <div className="text-2xl mb-1 float-medium">{getTagEmoji(stat.tag)}</div>
                    <div className="font-bold text-sm" style={{ color }}>{stat.tag}</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5 data-mono">{stat.count} videos</div>

                    {/* Hover tooltip */}
                    <div className="absolute -bottom-28 left-1/2 -translate-x-1/2 w-52 glass-panel border border-gray-200 rounded-xl p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-2xl">
                      <div className="text-gray-900 font-bold text-xs mb-2 flex items-center gap-1.5">
                        <span>{getTagEmoji(stat.tag)}</span> {stat.tag}
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-gray-500 data-mono">⚡ VELOCITY</span>
                          <span className="text-green-600 font-bold data-mono">
                            {stat.avgVelocity >= 1e6 ? (stat.avgVelocity / 1e6).toFixed(1) + 'M/d' : (stat.avgVelocity / 1e3).toFixed(0) + 'K/d'}
                          </span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                          <span className="text-gray-500 data-mono">📈 ENGAGEMENT</span>
                          <span className="text-yellow-600 font-bold data-mono">{stat.avgEngagement.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                          <span className="text-gray-500 data-mono">👁️ AVG VIEWS</span>
                          <span className="text-gray-900 font-bold data-mono">{formatNumber(Math.floor(stat.avgViews).toString())}</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                          <span className="text-gray-500 data-mono">🎯 COMPETITION</span>
                          <span className={`font-bold data-mono ${stat.count < 5 ? 'text-green-600' : stat.count < 12 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {stat.count < 5 ? 'LOW' : stat.count < 12 ? 'MEDIUM' : 'HIGH'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Legend */}
            <div className="relative mt-6 pt-4 border-t border-gray-200 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[10px] text-gray-500 data-mono tracking-wider">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-zinc-600" /> SIZE = VIDEO COUNT</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]" /> GLOW = VELOCITY</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full border border-zinc-500" /> CLICK TO EXPLORE</span>
            </div>
          </div>
        </section>

        {/* ===== SECTION 3: OPPORTUNITY RADAR ===== */}
        <section className="mb-16 sm:mb-20">
          <div className="mb-6 sm:mb-8">
            <SectionHeader icon="🧠" title="Early Momentum Detected" subtitle="Videos about to blow up. Low competition windows." />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {opportunityVideos.map((video) => {
              const score = calculateTrendScore(video)
              const stage = getTrendStage(score)
              const competition = generateCompetitionLevel(video)
              return (
                <Link key={`opp-${video.id}`} href={`/video/${video.id}`} className="group block">
                  <div className="glass-panel neon-border rounded-2xl p-5 glow-hover h-full corner-accent">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${stage.bg} ${stage.color} ${stage.border}`}>
                        {stage.label}
                      </span>
                      <span className="text-green-600 text-xs font-bold data-mono text-glow-green">{getTrendGrowth(video)}</span>
                    </div>
                    <h3 className="font-bold text-sm sm:text-base line-clamp-2 mb-3 group-hover:text-red-400 transition-colors">
                      {video.snippet?.title}
                    </h3>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="glass-panel rounded-lg p-2">
                        <div className="text-gray-500 text-[10px] data-mono tracking-wider">👁️ VIEWS</div>
                        <div className="text-gray-900 text-xs font-bold data-mono">{formatNumber(video.statistics?.viewCount)}</div>
                      </div>
                      <div className="glass-panel rounded-lg p-2">
                        <div className="text-gray-500 text-[10px] data-mono tracking-wider">⚔️ COMP</div>
                        <div className={`text-xs font-bold ${competition === 'LOW' ? 'text-green-600 text-glow-green' : competition === 'MEDIUM' ? 'text-yellow-600 text-glow-yellow' : 'text-red-600 text-glow-red'}`}>
                          {competition === 'LOW' ? '🟢 ' : competition === 'MEDIUM' ? '🟡 ' : '🔴 '}{competition}
                        </div>
                      </div>
                      <div className="glass-panel rounded-lg p-2">
                        <div className="text-gray-500 text-[10px] data-mono tracking-wider">⏰ ACTION</div>
                        <div className="text-red-600 text-xs font-bold data-mono breathe">24h ⚡</div>
                      </div>
                    </div>
                    <div className="text-gray-500 text-xs leading-relaxed">
                      Recommended: Upload within 24 hours to capture early momentum.
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* ===== SECTION 4: TRENDING VIDEOS ===== */}
        <section className="mb-16 sm:mb-20">
          <div className="mb-6 sm:mb-8">
            <SectionHeader icon="🔥" title="Trending Videos" subtitle="Full analysis of what is blowing up right now" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {trendingVideos.slice(0, 9).map((video) => {
              const trendScore = calculateTrendScore(video)
              const stage = getTrendStage(trendScore)
              const viralScore = getViralScore(video)
              const opportunityScore = getOpportunityScore(video)
              const tags = extractAITags(video.snippet?.title || '', video.snippet?.description || '')
              const peak = getPeakExpected(video)
              const creatorAlert = getCreatorAlert(video, videos)
              return (
                <Link key={`trend-${video.id}`} href={`/video/${video.id}`} className="group block">
                  <div className="glass-panel neon-border rounded-xl sm:rounded-2xl overflow-hidden glow-hover corner-accent">
                    {/* Thumbnail */}
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={video.snippet?.thumbnails?.high?.url}
                        alt={`Thumbnail for ${video.snippet?.title}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold border ${stage.bg} ${stage.color} ${stage.border}`}>
                          {stage.label}
                        </span>
                      </div>
                      <div className="absolute bottom-2 right-2 glass-panel px-2 py-1 rounded-lg text-[10px] sm:text-xs font-medium data-mono text-gray-700">
                        👁️ {formatNumber(video.statistics?.viewCount)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-3 sm:p-5">
                      <h3 className="font-bold text-sm sm:text-base line-clamp-2 mb-2 group-hover:text-red-600 transition-colors text-gray-900">
                        {video.snippet?.title}
                      </h3>

                      <div className="text-green-600 text-xs font-bold mb-3 data-mono text-glow-green">
                        📈 {getTrendGrowth(video)}
                      </div>

                      <div className="flex items-center gap-2 text-gray-500 text-xs mb-3">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-[10px] font-bold text-gray-700">
                          {video.snippet?.channelTitle?.[0]}
                        </div>
                        <span className="truncate">{video.snippet?.channelTitle}</span>
                      </div>

                      {/* AI Analysis */}
                      <div className="glass-panel rounded-xl p-3 mb-3">
                        <div className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 data-mono">🚀 WHY IT BLOWS UP</div>
                        <div className="text-gray-600 text-xs leading-relaxed">{generateWhyBlowingUp(video)}</div>
                      </div>

                      {/* Scores with Explanation */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex-1 glass-panel rounded-lg p-2 text-center group/score cursor-help relative">
                          <div className="text-gray-500 text-[10px] data-mono tracking-wider">VIRAL SCORE</div>
                          <div className="text-gray-900 font-black text-sm data-mono text-glow">{viralScore}/100</div>
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 glass-panel border border-gray-200 rounded-xl p-3 opacity-0 invisible group-hover/score:opacity-100 group-hover/score:visible transition-all z-20 shadow-2xl text-left">
                            <div className="text-gray-900 font-bold text-xs mb-2">🎯 How Viral Score Works</div>
                            <div className="space-y-1.5 text-[10px] text-gray-500">
                              <div className="flex justify-between"><span>Velocity (views/day)</span><span className="text-gray-700">0-35</span></div>
                              <div className="flex justify-between"><span>Engagement rate</span><span className="text-gray-700">0-30</span></div>
                              <div className="flex justify-between"><span>Retention signals</span><span className="text-gray-700">0-20</span></div>
                              <div className="flex justify-between"><span>Low view bonus</span><span className="text-gray-700">0-10</span></div>
                              <div className="flex justify-between"><span>Topic freshness</span><span className="text-gray-700">0-5</span></div>
                            </div>
                            <div className="text-gray-400 text-[10px] mt-2 pt-2 border-t border-gray-200">Based on real YouTube data</div>
                          </div>
                        </div>
                        <div className="flex-1 glass-panel rounded-lg p-2 text-center group/opp cursor-help relative">
                          <div className="text-gray-500 text-[10px] data-mono tracking-wider">OPPORTUNITY</div>
                          <div className={`font-black text-sm data-mono ${opportunityScore > 70 ? 'text-green-600 text-glow-green' : 'text-yellow-600 text-glow-yellow'}`}>{opportunityScore}/100</div>
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 glass-panel border border-gray-200 rounded-xl p-3 opacity-0 invisible group-hover/opp:opacity-100 group-hover/opp:visible transition-all z-20 shadow-2xl text-left">
                            <div className="text-gray-900 font-bold text-xs mb-2">🚀 How Opportunity Score Works</div>
                            <div className="space-y-1.5 text-[10px] text-gray-500">
                              <div className="flex justify-between"><span>Early momentum window</span><span className="text-gray-700">0-40</span></div>
                              <div className="flex justify-between"><span>Engagement momentum</span><span className="text-gray-700">0-30</span></div>
                              <div className="flex justify-between"><span>Velocity bonus</span><span className="text-gray-700">0-20</span></div>
                              <div className="flex justify-between"><span>Niche freshness</span><span className="text-gray-700">0-10</span></div>
                            </div>
                            <div className="text-gray-400 text-[10px] mt-2 pt-2 border-t border-gray-200">Higher = better time to upload</div>
                          </div>
                        </div>
                      </div>

                      {/* Creator Alert */}
                      <div className="text-gray-500 text-[10px] sm:text-xs mb-3 data-mono">
                        ⚠️ {creatorAlert} creators uploaded similar videos today
                      </div>

                      {/* Peak */}
                      <div className="text-gray-500 text-[10px] sm:text-xs mb-3 data-mono">
                        PEAK EXPECTED IN <span className="text-gray-900 font-bold">{peak}</span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-2 py-0.5 rounded-full glass-panel text-[10px] sm:text-xs text-gray-600 data-mono hover:border-gray-300 transition-colors">
                            #{tag.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        <AdBanner slot="2345678901" className="my-8" />

        {/* ===== SECTION 5: SHORTS PREVIEW ===== */}
        <section className="mb-16 sm:mb-20">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 sm:mb-8">
            <SectionHeader icon="📱" title="Shorts Exploding Right Now" subtitle="Vertical content with maximum algorithmic reach" />
            <Link href="/shorts" className="text-sm font-bold text-red-400 hover:text-red-300 transition shrink-0">View All Shorts →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {shortsVideos.slice(0, 6).map((video) => {
              const viralScore = getViralScore(video)
              const hookStyle = getHookStyle(video.snippet?.title || '')
              const retention = getRetentionPrediction(video)
              return (
                <Link key={`short-${video.id}`} href={`/video/${video.id}`} className="group block">
                  <div className="aspect-[9/16] rounded-xl sm:rounded-2xl overflow-hidden relative glass-panel neon-border glow-hover">
                    <img
                      src={video.snippet?.thumbnails?.high?.url}
                      alt={`Shorts thumbnail for ${video.snippet?.title}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/10 to-transparent" />
                    <div className="absolute top-2 left-2 bg-red-500/90 px-2 py-0.5 rounded-md text-[10px] font-bold shadow-[0_0_10px_rgba(239,68,68,0.4)]">SHORTS</div>
                    <div className="absolute top-2 right-2 glass-panel px-2 py-0.5 rounded-md text-[10px] font-bold text-gray-700 data-mono">
                      {viralScore}/100
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="text-gray-900 font-bold text-xs line-clamp-2 mb-1">{video.snippet?.title}</div>
                      <div className="text-gray-500 text-[10px] mb-1 data-mono">{formatNumber(video.statistics?.viewCount)} views</div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-gray-500 glass-panel px-1.5 py-0.5 rounded data-mono">{hookStyle}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${retention === 'HIGH' ? 'bg-green-100 text-green-700' : retention === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-600'}`}>
                          {retention}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* ===== SECTION 6: MISSED OPPORTUNITIES ===== */}
        <section className="mb-16 sm:mb-20">
          <div className="mb-6 sm:mb-8">
            <SectionHeader icon="😭" title="You Missed These" subtitle="FOMO is real. These trends already exploded." />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {missedOpportunities.map(({ video, tag, missedGrowth }) => (
              <div key={`missed-${video.id}`} className="glass-panel neon-border rounded-2xl p-5 sm:p-6 glow-hover corner-accent">
                <div className="text-red-400 font-black text-3xl sm:text-4xl mb-2 text-glow-red data-mono">⚡ {missedGrowth}/day</div>
                <div className="text-white font-bold text-lg mb-1">💔 {tag}</div>
                <div className="text-zinc-500 text-sm line-clamp-1 mb-4">{video.snippet?.title}</div>
                <div className="flex items-center gap-3 text-xs text-zinc-400 data-mono">
                  <span>👁️ {formatNumber(video.statistics?.viewCount)} views</span>
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-800/60">
                  <Link href={`/tag/${slugifyTag(tag)}`} className="text-xs font-bold text-red-400 hover:text-red-300 transition">
                    Don&apos;t miss next {tag} trend →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== SECTION 7: CREATOR SUGGESTIONS ===== */}
        <section className="mb-16 sm:mb-20">
          <div className="mb-6 sm:mb-8">
            <SectionHeader icon="💡" title="What You Should Upload Today" subtitle="AI-generated opportunities based on current momentum" />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {creatorSuggestions.map((suggestion) => (
              <div key={`suggest-${suggestion.tag}`} className="glass-panel neon-border rounded-2xl p-5 sm:p-6 glow-hover corner-accent">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🎯</span>
                  <span className="text-gray-500 text-xs font-bold tracking-wider uppercase data-mono">SUGGESTED OPPORTUNITY</span>
                </div>
                <div className="text-gray-900 font-bold text-lg mb-1 text-glow">{suggestion.tag}</div>
                <div className="glass-panel rounded-xl p-3 mb-4">
                  <div className="text-gray-500 text-[10px] mb-1 data-mono tracking-wider">🎬 SUGGESTED TITLE</div>
                  <div className="font-bold text-sm">&quot;{suggestion.titles[0]}&quot;</div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="glass-panel rounded-lg p-2">
                    <div className="text-gray-500 text-[10px] data-mono tracking-wider">⚔️ COMPETITION</div>
                    <div className={`text-sm font-bold ${suggestion.competition === 'LOW' ? 'text-green-600 text-glow-green' : 'text-yellow-600 text-glow-yellow'}`}>
                      {suggestion.competition === 'LOW' ? '🟢 ' : '🟡 '}{suggestion.competition}
                    </div>
                  </div>
                  <div className="glass-panel rounded-lg p-2">
                    <div className="text-gray-500 text-[10px] data-mono tracking-wider">⏳ SATURATION IN</div>
                    <div className="text-red-600 text-sm font-bold data-mono breathe">{suggestion.saturationDays} days ⏰</div>
                  </div>
                </div>
                <Link
                  href={`/tag/${slugifyTag(suggestion.tag)}`}
                  className="block text-center py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition shadow-[0_0_20px_rgba(255,0,0,0.1)]"
                >
                  Explore {suggestion.tag} →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="border-t border-gray-200 pt-14 sm:pt-20 pb-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-10">
            <div className="glass-panel rounded-xl p-5">
              <h3 className="font-bold text-lg mb-3 text-glow text-gray-900">🎯 Why TubeFission?</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                We analyze YouTube&apos;s most popular videos in real-time, extracting hidden patterns
                and viral signals that creators need to stay ahead of the curve.
              </p>
            </div>
            <div className="glass-panel rounded-xl p-5">
              <h3 className="font-bold text-lg mb-3 text-glow text-gray-900">⚙️ How It Works</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Our AI scans trending content across 6 major regions, calculating engagement
                velocity, opportunity scores, and niche growth potential every hour.
              </p>
            </div>
            <div className="glass-panel rounded-xl p-5">
              <h3 className="font-bold text-lg mb-3 text-glow text-gray-900">🎬 For Creators</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Discover what&apos;s blowing up right now. Find underserved niches. Copy what works
                — before everyone else does.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 text-xs data-mono">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 pulse-glow-green" />
              <span>DATA REFRESHED HOURLY FROM YOUTUBE API</span>
            </div>
            <div>© {new Date().getFullYear()} TUBEFISSION. NOT AFFILIATED WITH YOUTUBE.</div>
          </div>
        </footer>

        {/* LOADING */}
        {loading && <div className="text-center py-10 text-gray-500 text-sm">Loading trends...</div>}
      </div>
    </main>
  )
}
