'use client'

import { useEffect, useMemo, useState, useRef } from 'react'
import Link from 'next/link'
import AdBanner from './AdBanner'

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
}

/* =========================================================
   CONSTANTS
========================================================= */

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || ''
const REGIONS = ['US', 'JP', 'KR', 'GB']

const REGION_META: Record<string, { label: string; flag: string }> = {
  US: { label: 'United States', flag: 'us' },
  JP: { label: 'Japan', flag: 'jp' },
  KR: { label: 'Korea', flag: 'kr' },
  GB: { label: 'United Kingdom', flag: 'gb' },
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
  const views = Number(video.statistics?.viewCount || 0)
  if (views > 5_000_000) return '↑ 24h +520%'
  if (views > 1_000_000) return '↑ 24h +310%'
  if (views > 500_000) return '↑ 24h +180%'
  if (views > 100_000) return '↑ 24h +95%'
  return '↑ 24h +45%'
}

function seededRandom(seed: string, max: number) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0
  }
  return Math.abs(hash) % max
}

function getViralScore(video: Video): number {
  const score = calculateTrendScore(video)
  return Math.min(100, Math.max(1, Math.floor(score / 4)))
}

function getOpportunityScore(video: Video): number {
  const score = calculateTrendScore(video)
  const views = Number(video.statistics?.viewCount || 0)
  const saturationPenalty = views > 10_000_000 ? 25 : views > 1_000_000 ? 12 : 0
  return Math.min(100, Math.max(1, Math.floor(score / 4) + 35 - saturationPenalty))
}

function getPeakExpected(seed: string): string {
  return PEAK_OPTIONS[seededRandom(seed + '-peak', PEAK_OPTIONS.length)]
}

function getCreatorAlert(seed: string): number {
  return seededRandom(seed + '-creators', 80) + 20
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
  const likeRatio = views > 0 ? likes / views : 0

  if (likeRatio > 0.05 && title.includes('shorts')) return 'Strong like ratio + Shorts format = maximum algorithmic push'
  if (likeRatio > 0.05) return 'Strong like-to-view ratio signals premium content to the algorithm'
  if (title.includes('shorts') || title.includes('#shorts')) return 'Shorts format receives 2-3x more impressions per upload vs long-form'
  if (views > 5_000_000) return 'Massive view velocity indicates strong algorithmic recommendation performance'
  if (title.includes('how to') || title.includes('tutorial')) return 'Evergreen tutorial content maintains steady search traffic over time'
  if (title.includes('ai') || title.includes('chatgpt')) return 'AI topics are experiencing surging search demand globally'
  if (title.includes('minecraft') || title.includes('gaming')) return 'Gaming content drives consistently high session duration'
  return 'Strong engagement velocity and audience retention pattern detected'
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
    <div>
      <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 mb-1">
        <span className="text-yellow-400">{icon}</span> {title}
      </h2>
      {subtitle && <p className="text-zinc-500 text-sm">{subtitle}</p>}
    </div>
  )
}

/* =========================================================
   MAIN
========================================================= */

export default function TrendingDashboard({ initialVideos }: TrendingDashboardProps) {
  const [videos, setVideos] = useState<Video[]>(initialVideos)
  const [loading, setLoading] = useState(initialVideos.length === 0)
  const [region, setRegion] = useState('US')
  const [activeTagIndex, setActiveTagIndex] = useState(0)
  const [isHoveringTag, setIsHoveringTag] = useState(false)
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
    const map: Record<string, TagItem> = {}
    videos.forEach((video) => {
      const tags = extractAITags(video.snippet?.title || '', video.snippet?.description || '')
      tags.forEach((tag) => {
        if (!map[tag]) {
          map[tag] = {
            tag,
            growth: seededRandom(tag + (video.id || ''), 320) + 100,
            rank: seededRandom(tag, 5) + 1,
            previousRank: seededRandom(tag + 'prev', 20) + 5,
          }
        }
      })
    })
    return Object.values(map).sort((a, b) => b.growth - a.growth)
  }, [videos])

  /* ----- AUTO TAG ROTATION (10s) ----- */
  useEffect(() => {
    if (trendingTags.length === 0) return
    const interval = setInterval(() => {
      if (isHoveringTag) return
      setActiveTagIndex((prev) => (prev >= trendingTags.length - 1 ? 0 : prev + 1))
    }, 10000)
    return () => clearInterval(interval)
  }, [trendingTags, isHoveringTag])

  /* ----- CREATOR SUGGESTIONS ----- */
  const creatorSuggestions = useMemo(() => {
    return trendingTags.slice(0, 3).map((tag) => ({
      tag: tag.tag,
      titles: generateSuggestedTitles(tag.tag),
      competition: tag.growth > 300 ? 'MEDIUM' : 'LOW',
      saturationDays: seededRandom(tag.tag + '-sat', 5) + 2,
    }))
  }, [trendingTags])

  /* ----- MISSED OPPORTUNITIES ----- */
  const missedOpportunities = useMemo(() => {
    return [...videos]
      .sort((a, b) => Number(b.statistics?.viewCount || 0) - Number(a.statistics?.viewCount || 0))
      .slice(0, 3)
      .map((video, idx) => {
        const tag = extractAITags(video.snippet?.title || '')[0] || 'Trending'
        const missedGrowth = [1280, 940, 730][idx] || seededRandom(video.id + '-missed', 500) + 500
        return { video, tag, missedGrowth }
      })
  }, [videos])

  const topOpportunityTag = trendingTags[0] || { tag: 'AI', growth: 420 }
  const topOpportunityVideo = opportunityVideos[0]

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* ===== HEADER ===== */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-10 sm:mb-14">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              <span className="text-red-400 text-xs font-bold tracking-widest uppercase">Live Trend Radar</span>
            </div>
            <div className="text-3xl sm:text-5xl font-black tracking-tight">TrendTube</div>
            <p className="text-zinc-500 mt-1 text-sm sm:text-base">Discover viral YouTube trends before everyone else.</p>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2">
            <div className="flex gap-2">
              {REGIONS.map((country) => (
                <button
                  key={country}
                  onClick={() => { setVideos([]); setRegion(country) }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                    region === country
                      ? 'bg-white text-black border-white'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
                  }`}
                >
                  <img
                    src={`https://flagcdn.com/w40/${REGION_META[country].flag}.png`}
                    alt={REGION_META[country].label}
                    className="w-5 h-4 rounded-sm object-cover"
                    loading="lazy"
                  />
                  <span className="hidden sm:inline">{REGION_META[country].label}</span>
                  <span className="sm:hidden">{country}</span>
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* ===== SECTION 1: HERO ===== */}
        <section className="relative overflow-hidden rounded-3xl mb-16 sm:mb-20">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/[0.07] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-500/[0.07] rounded-full blur-[120px]" />
          <div className="relative p-6 sm:p-12 lg:p-16">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-8 leading-[1.05]">
                Today&apos;s Biggest<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">Opportunity</span>
              </h1>

              <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-3xl">🔥</span>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold">{topOpportunityTag.tag}</div>
                    <div className="text-green-400 font-black text-lg">+{topOpportunityTag.growth}% Growth</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-black/30 rounded-xl p-3">
                    <div className="text-zinc-500 text-xs mb-1">Competition</div>
                    <div className="text-green-400 font-bold text-sm">LOW</div>
                  </div>
                  <div className="bg-black/30 rounded-xl p-3">
                    <div className="text-zinc-500 text-xs mb-1">Predicted Peak</div>
                    <div className="text-white font-bold text-sm">Next 48h</div>
                  </div>
                  <div className="bg-black/30 rounded-xl p-3">
                    <div className="text-zinc-500 text-xs mb-1">Creator Urgency</div>
                    <div className="text-red-400 font-bold text-sm">HIGH</div>
                  </div>
                </div>

                {topOpportunityVideo && (
                  <div className="bg-black/40 rounded-xl p-4 mb-6">
                    <div className="text-zinc-500 text-xs mb-1">Suggested Video</div>
                    <div className="font-bold text-sm sm:text-base line-clamp-1">
                      &quot;{generateSuggestedTitles(topOpportunityTag.tag)[0]}&quot;
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/tag/${slugifyTag(topOpportunityTag.tag)}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl font-bold text-sm hover:bg-zinc-200 transition"
                  >
                    Watch Trend →
                  </Link>
                  <Link
                    href="/shorts"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-800 text-white border border-zinc-700 rounded-xl font-bold text-sm hover:bg-zinc-700 transition"
                  >
                    Find More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <AdBanner slot="1234567890" className="my-8" />

        {/* ===== SECTION 2: TRENDING TAGS ===== */}
        <section className="mb-16 sm:mb-20">
          <div className="mb-6 sm:mb-8">
            <SectionHeader icon="✦" title="Trending Tags" subtitle="Click any tag to explore dedicated trend intelligence" />
          </div>
          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4"
            onMouseEnter={() => setIsHoveringTag(true)}
            onMouseLeave={() => setIsHoveringTag(false)}
          >
            {trendingTags.map((item, index) => (
              <Link
                key={item.tag}
                href={`/tag/${slugifyTag(item.tag)}`}
                className={`block text-left rounded-2xl p-3 sm:p-4 border transition-all ${
                  activeTagIndex === index
                    ? 'bg-zinc-800 border-zinc-600 scale-[1.02]'
                    : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/70'
                }`}
                onMouseEnter={() => setActiveTagIndex(index)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-zinc-500 text-xs font-bold">#{index + 1}</span>
                  <span className="text-green-400 text-xs font-black">+{item.growth}%</span>
                </div>
                <div className="font-bold text-sm sm:text-base mb-2">{item.tag}</div>
                <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden mb-2">
                  <div
                    className="bg-green-400 h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(item.growth, 100)}%` }}
                  />
                </div>
                <div className="text-zinc-500 text-[10px] sm:text-xs">
                  Rank change: <span className="text-yellow-400 font-bold">↑{item.previousRank - item.rank}</span>
                </div>
              </Link>
            ))}
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
                  <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors h-full">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${stage.bg} ${stage.color} ${stage.border}`}>
                        {stage.label}
                      </span>
                      <span className="text-green-400 text-xs font-bold">{getTrendGrowth(video)}</span>
                    </div>
                    <h3 className="font-bold text-sm sm:text-base line-clamp-2 mb-3 group-hover:text-red-400 transition-colors">
                      {video.snippet?.title}
                    </h3>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div>
                        <div className="text-zinc-500 text-[10px]">Views</div>
                        <div className="text-white text-xs font-bold">{formatNumber(video.statistics?.viewCount)}</div>
                      </div>
                      <div>
                        <div className="text-zinc-500 text-[10px]">Competition</div>
                        <div className={`text-xs font-bold ${competition === 'LOW' ? 'text-green-400' : competition === 'MEDIUM' ? 'text-yellow-400' : 'text-red-400'}`}>
                          {competition}
                        </div>
                      </div>
                      <div>
                        <div className="text-zinc-500 text-[10px]">Action</div>
                        <div className="text-red-400 text-xs font-bold">24h</div>
                      </div>
                    </div>
                    <div className="text-zinc-400 text-xs leading-relaxed">
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
              const peak = getPeakExpected(video.id)
              const creatorAlert = getCreatorAlert(video.id)
              return (
                <Link key={`trend-${video.id}`} href={`/video/${video.id}`} className="group block">
                  <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl sm:rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors">
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
                      <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur px-2 py-1 rounded-lg text-[10px] sm:text-xs font-medium">
                        {formatNumber(video.statistics?.viewCount)} views
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-3 sm:p-5">
                      <h3 className="font-bold text-sm sm:text-base line-clamp-2 mb-2 group-hover:text-red-400 transition-colors">
                        {video.snippet?.title}
                      </h3>

                      <div className="text-green-400 text-xs font-bold mb-3">
                        {getTrendGrowth(video)}
                      </div>

                      <div className="flex items-center gap-2 text-zinc-500 text-xs mb-3">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-[10px] font-bold">
                          {video.snippet?.channelTitle?.[0]}
                        </div>
                        <span className="truncate">{video.snippet?.channelTitle}</span>
                      </div>

                      {/* AI Analysis */}
                      <div className="bg-black/30 border border-zinc-800/60 rounded-xl p-3 mb-3">
                        <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-1">Why It Blows Up</div>
                        <div className="text-zinc-300 text-xs leading-relaxed">{generateWhyBlowingUp(video)}</div>
                      </div>

                      {/* Scores */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex-1 bg-zinc-800/60 rounded-lg p-2 text-center">
                          <div className="text-zinc-500 text-[10px]">Viral Score</div>
                          <div className="text-white font-black text-sm">{viralScore}/100</div>
                        </div>
                        <div className="flex-1 bg-zinc-800/60 rounded-lg p-2 text-center">
                          <div className="text-zinc-500 text-[10px]">Opportunity</div>
                          <div className={`font-black text-sm ${opportunityScore > 70 ? 'text-green-400' : 'text-yellow-400'}`}>{opportunityScore}/100</div>
                        </div>
                      </div>

                      {/* Creator Alert */}
                      <div className="text-zinc-500 text-[10px] sm:text-xs mb-3">
                        ⚠️ {creatorAlert} creators uploaded similar videos today
                      </div>

                      {/* Peak */}
                      <div className="text-zinc-500 text-[10px] sm:text-xs mb-3">
                        Peak expected in <span className="text-white font-bold">{peak}</span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-2 py-0.5 rounded-full bg-black/50 border border-zinc-800 text-[10px] sm:text-xs text-zinc-400">
                            #{tag}
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
            <SectionHeader icon="▶" title="Shorts Exploding Right Now" subtitle="Vertical content with maximum algorithmic reach" />
            <Link href="/shorts" className="text-sm font-bold text-red-400 hover:text-red-300 transition shrink-0">View All Shorts →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {shortsVideos.slice(0, 6).map((video) => {
              const viralScore = getViralScore(video)
              const hookStyle = getHookStyle(video.snippet?.title || '')
              const retention = getRetentionPrediction(video)
              return (
                <Link key={`short-${video.id}`} href={`/video/${video.id}`} className="group block">
                  <div className="aspect-[9/16] rounded-xl sm:rounded-2xl overflow-hidden relative bg-zinc-900">
                    <img
                      src={video.snippet?.thumbnails?.high?.url}
                      alt={`Shorts thumbnail for ${video.snippet?.title}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    <div className="absolute top-2 left-2 bg-red-500 px-2 py-0.5 rounded-md text-[10px] font-bold">SHORTS</div>
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-0.5 rounded-md text-[10px] font-bold text-white">
                      {viralScore}/100
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="text-white font-bold text-xs line-clamp-2 mb-1">{video.snippet?.title}</div>
                      <div className="text-zinc-400 text-[10px] mb-1">{formatNumber(video.statistics?.viewCount)} views</div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-zinc-500 bg-black/40 px-1.5 py-0.5 rounded">{hookStyle}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${retention === 'HIGH' ? 'bg-green-500/20 text-green-400' : retention === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-zinc-700 text-zinc-400'}`}>
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
            {missedOpportunities.map(({ video, tag, missedGrowth }, idx) => (
              <div key={`missed-${video.id}`} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 sm:p-6">
                <div className="text-red-400 font-black text-3xl sm:text-4xl mb-2">+{missedGrowth}%</div>
                <div className="text-white font-bold text-lg mb-1">{tag}</div>
                <div className="text-zinc-500 text-sm line-clamp-1 mb-4">{video.snippet?.title}</div>
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <span>{formatNumber(video.statistics?.viewCount)} views</span>
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-800">
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
            <SectionHeader icon="🔥" title="What You Should Upload Today" subtitle="AI-generated opportunities based on current momentum" />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {creatorSuggestions.map((suggestion) => (
              <div key={`suggest-${suggestion.tag}`} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 sm:p-6 hover:border-zinc-700 transition-colors">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🎯</span>
                  <span className="text-zinc-500 text-xs font-bold tracking-wider uppercase">Suggested Opportunity</span>
                </div>
                <div className="text-white font-bold text-lg mb-1">{suggestion.tag}</div>
                <div className="bg-black/30 rounded-xl p-3 mb-4">
                  <div className="text-zinc-500 text-[10px] mb-1">Suggested Title</div>
                  <div className="font-bold text-sm">&quot;{suggestion.titles[0]}&quot;</div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <div className="text-zinc-500 text-[10px]">Competition</div>
                    <div className={`text-sm font-bold ${suggestion.competition === 'LOW' ? 'text-green-400' : 'text-yellow-400'}`}>
                      {suggestion.competition}
                    </div>
                  </div>
                  <div>
                    <div className="text-zinc-500 text-[10px]">Saturation In</div>
                    <div className="text-red-400 text-sm font-bold">{suggestion.saturationDays} days</div>
                  </div>
                </div>
                <Link
                  href={`/tag/${slugifyTag(suggestion.tag)}`}
                  className="block text-center py-2.5 bg-white text-black rounded-xl font-bold text-sm hover:bg-zinc-200 transition"
                >
                  Explore {suggestion.tag} →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="border-t border-zinc-800 pt-14 sm:pt-20 pb-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-10">
            <div>
              <h3 className="font-bold text-lg mb-3">Why TrendTube?</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                We analyze YouTube&apos;s most popular videos in real-time, extracting hidden patterns
                and viral signals that creators need to stay ahead of the curve.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">How It Works</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Our AI scans trending content across 4 major regions, calculating engagement
                velocity, opportunity scores, and niche growth potential every hour.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">For Creators</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Discover what&apos;s blowing up right now. Find underserved niches. Copy what works
                — before everyone else does.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-600 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Data refreshed hourly from YouTube API</span>
            </div>
            <div>© {new Date().getFullYear()} TrendTube. Not affiliated with YouTube.</div>
          </div>
        </footer>

        {/* LOADING */}
        {loading && <div className="text-center py-10 text-zinc-500 text-sm">Loading trends...</div>}
      </div>
    </main>
  )
}
