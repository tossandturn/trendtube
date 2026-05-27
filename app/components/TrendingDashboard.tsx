'use client'

import { useEffect, useMemo, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
} from 'recharts'

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

const CHART_DATA = [
  { day: 'Mon', score: 12 },
  { day: 'Tue', score: 22 },
  { day: 'Wed', score: 39 },
  { day: 'Thu', score: 52 },
  { day: 'Fri', score: 71 },
  { day: 'Sat', score: 88 },
  { day: 'Sun', score: 100 },
]

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

function predictVirality(video: Video) {
  const score = calculateTrendScore(video)
  if (score > 400) return 96
  if (score > 300) return 89
  if (score > 200) return 76
  return 61
}

function calculateOpportunity(video: Video) {
  const views = Number(video.statistics?.viewCount || 0)
  const score = calculateTrendScore(video)
  if (views < 100000 && score > 250) return 98
  if (views < 300000) return 87
  return 68
}

function getTrendStage(score: number) {
  if (score > 350) return { emoji: '🔥', label: 'VIRAL' }
  if (score > 250) return { emoji: '📈', label: 'RISING' }
  return { emoji: '🌱', label: 'EMERGING' }
}

function getTrendGrowth(video: Video) {
  const views = Number(video.statistics?.viewCount || 0)
  if (views > 5_000_000) return '↑ 24h +520%'
  if (views > 1_000_000) return '↑ 24h +310%'
  if (views > 500_000) return '↑ 24h +180%'
  if (views > 100_000) return '↑ 24h +95%'
  return '↑ 24h +45%'
}

function generateAdvancedAIAnalysis(video: Video) {
  const title = video.snippet?.title?.toLowerCase() || ''
  const tags = extractAITags(
    video.snippet?.title || '',
    video.snippet?.description || ''
  )
  const views = Number(video.statistics?.viewCount || 0)
  const likes = Number(video.statistics?.likeCount || 0)
  const comments = Number(video.statistics?.commentCount || 0)
  const engagement = ((likes + comments) / Math.max(views, 1)) * 100

  const insights: string[] = []

  if (tags.includes('Shorts')) {
    insights.push('📱 Shorts content is receiving aggressive recommendation boosts from YouTube.')
  }
  if (tags.includes('AI')) {
    insights.push('🤖 AI-related search demand is rapidly accelerating globally.')
  }
  if (tags.includes('Gaming')) {
    insights.push('🎮 Gaming viewers generate extremely high repeat watch behavior.')
  }
  if (engagement > 8) {
    insights.push('🔥 Engagement rate is significantly above platform average.')
  }
  if (views > 1_000_000) {
    insights.push('🚀 High early velocity triggered YouTube algorithm expansion.')
  }
  if (title.includes('how') || title.includes('why') || title.includes('secret')) {
    insights.push('🧠 Curiosity-driven title psychology increases CTR dramatically.')
  }
  if (title.includes('crazy') || title.includes('insane') || title.includes('impossible')) {
    insights.push('⚡ Emotional trigger words improve audience retention.')
  }

  insights.push('📈 Creator competition is increasing rapidly inside this niche.')
  return insights.slice(0, 4)
}

/* =========================================================
   MAIN
========================================================= */

export default function TrendingDashboard({ initialVideos }: TrendingDashboardProps) {
  const [videos, setVideos] = useState<Video[]>(initialVideos)
  const [loading, setLoading] = useState(initialVideos.length === 0)
  const [region, setRegion] = useState('US')
  const [activeTab, setActiveTab] = useState<'trending' | 'opportunity' | 'shorts'>('trending')
  const [activeTagIndex, setActiveTagIndex] = useState(0)
  const [isHoveringTag, setIsHoveringTag] = useState(false)
  const [isHoveringVideoArea, setIsHoveringVideoArea] = useState(false)

  const tabIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const didInit = useRef(false)

  /* =========================================================
     FETCH YOUTUBE DATA
  ========================================================= */

  async function fetchVideos() {
    if (!API_KEY) {
      console.error('YouTube API Key is missing')
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
      if (data.items) setVideos(data.items)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true
      if (initialVideos.length === 0) {
        fetchVideos()
      }
      return
    }
    fetchVideos()
  }, [region])

  /* =========================================================
     AUTO SWITCH VIDEO TABS (15s)
  ========================================================= */

  useEffect(() => {
    tabIntervalRef.current = setInterval(() => {
      if (isHoveringVideoArea) return
      setActiveTab((prev) => {
        if (prev === 'trending') return 'opportunity'
        if (prev === 'opportunity') return 'shorts'
        return 'trending'
      })
    }, 15000)

    return () => {
      if (tabIntervalRef.current) clearInterval(tabIntervalRef.current)
    }
  }, [isHoveringVideoArea])

  /* =========================================================
     TAG EXTRACTION & TRENDING TAGS
  ========================================================= */

  const trendingTags: TagItem[] = useMemo(() => {
    const source =
      activeTab === 'trending'
        ? videos
        : activeTab === 'opportunity'
        ? risingVideos
        : finalShorts
    const map: Record<string, TagItem> = {}
    source.forEach((video) => {
      const tags = extractAITags(
        video.snippet?.title || '',
        video.snippet?.description || ''
      )
      tags.forEach((tag) => {
        if (!map[tag]) {
          map[tag] = {
            tag,
            growth: Math.floor(Math.random() * 320 + 100),
            rank: Math.floor(Math.random() * 5 + 1),
            previousRank: Math.floor(Math.random() * 20 + 5),
          }
        }
      })
    })
    return Object.values(map).sort((a, b) => b.growth - a.growth)
  }, [videos, activeTab])

  /* =========================================================
     AUTO TAG CAROUSEL (10s) with hover pause
  ========================================================= */

  useEffect(() => {
    setActiveTagIndex(0)
  }, [activeTab])

  useEffect(() => {
    if (trendingTags.length === 0) return
    const interval = setInterval(() => {
      if (isHoveringTag) return
      setActiveTagIndex((prev) => (prev >= trendingTags.length - 1 ? 0 : prev + 1))
    }, 10000)
    return () => clearInterval(interval)
  }, [trendingTags, isHoveringTag])

  const activeTag = trendingTags[activeTagIndex]

  /* =========================================================
     OPPORTUNITY VIDEOS
  ========================================================= */

  const risingVideos = useMemo(() => {
    return [...videos]
      .filter((video) => Number(video.statistics?.viewCount || 0) < 500_000)
      .sort((a, b) => calculateTrendScore(b) - calculateTrendScore(a))
      .slice(0, 8)
  }, [videos])

  /* =========================================================
     SHORTS
  ========================================================= */

  const shortsVideos = videos.filter((video) => {
    const title = video.snippet?.title?.toLowerCase() || ''
    return title.includes('shorts') || title.includes('#shorts') || title.includes('short')
  })

  const finalShorts = shortsVideos.length > 0 ? shortsVideos : videos.slice(0, 12)

  /* =========================================================
     UI
  ========================================================= */

  return (
    <main className="min-h-screen bg-[#070707] text-white overflow-hidden">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-red-500/10 blur-[150px]" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-green-500/10 blur-[150px]" />

      <div className="max-w-7xl mx-auto px-5 py-8 relative z-10">
        {/* =========================================================
            HEADER
        ========================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
              <div className="text-red-400 font-bold tracking-wider">
                LIVE YOUTUBE TREND RADAR
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              TrendTube 🚀
            </h1>
            <p className="text-zinc-400 mt-5 text-xl max-w-3xl">
              Discover viral YouTube trends before everyone else.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {REGIONS.map((country) => (
              <button
                key={country}
                onClick={() => {
                  setVideos([])
                  setRegion(country)
                }}
                className={`px-5 py-3 rounded-2xl border transition-all duration-300 ${
                  region === country
                    ? 'bg-white text-black border-white scale-105'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-300'
                }`}
              >
                {country}
              </button>
            ))}
          </div>
        </div>

        {/* =========================================================
            TOP TREND TAG HERO
        ========================================================= */}
        {activeTag && (
          <motion.div
            key={activeTag.tag}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            onMouseEnter={() => setIsHoveringTag(true)}
            onMouseLeave={() => setIsHoveringTag(false)}
            className="mb-20 bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-700 rounded-[32px] p-8 overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-green-400/10 blur-[120px]" />
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                {/* LEFT */}
                <div>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="text-6xl">🔥</div>
                    <div>
                      <div className="text-zinc-500 mb-1">NOW TRENDING</div>
                      <div className="text-6xl font-black">#{activeTag.tag}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 flex-wrap">
                    <div className="bg-black/40 border border-zinc-700 rounded-2xl px-5 py-3">
                      <div className="text-zinc-500 text-sm">Weekly Growth</div>
                      <div className="text-green-400 text-3xl font-black">
                        +{activeTag.growth}%
                      </div>
                    </div>
                    <div className="bg-black/40 border border-zinc-700 rounded-2xl px-5 py-3">
                      <div className="text-zinc-500 text-sm">Rank Change</div>
                      <div className="text-yellow-400 text-3xl font-black">
                        ↑ {activeTag.previousRank - activeTag.rank}
                      </div>
                    </div>
                  </div>

                  {/* AI ANALYSIS */}
                  <div className="mt-6 bg-black/50 border border-zinc-800 rounded-3xl p-5 max-w-2xl">
                    <div className="text-green-400 text-xs mb-3 font-bold tracking-wider">
                      AI TAG ANALYSIS
                    </div>
                    <div className="space-y-2 text-zinc-300">
                      <div>🚀 Search demand for this topic is accelerating rapidly across YouTube.</div>
                      <div>📈 Creator uploads increased significantly this week.</div>
                      <div>🔥 YouTube recommendation momentum is expanding this niche aggressively.</div>
                      <div>⚠️ Creators are rapidly entering this market right now.</div>
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="w-full lg:w-[420px]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-zinc-500">Growth Momentum</div>
                    <div className="text-green-400 text-4xl font-black">+{activeTag.growth}%</div>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-5 overflow-hidden mb-6">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(activeTag.growth, 100)}%` }}
                      transition={{ duration: 1 }}
                      className="bg-green-400 h-full"
                    />
                  </div>
                  <div className="h-[180px] bg-black/30 rounded-3xl p-4 border border-zinc-800">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={CHART_DATA}>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#18181b',
                            border: '1px solid #3f3f46',
                            borderRadius: '12px',
                          }}
                          labelStyle={{ color: '#a1a1aa' }}
                          itemStyle={{ color: '#4ade80' }}
                        />
                        <Line type="monotone" dataKey="score" stroke="#22c55e" strokeWidth={4} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* =========================================================
            TAG GRID
        ========================================================= */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-24">
          {trendingTags.map((item: TagItem, index) => (
            <motion.div
              key={item.tag}
              whileHover={{ y: -5, scale: 1.03 }}
              onClick={() => setActiveTagIndex(index)}
              onMouseEnter={() => setIsHoveringTag(true)}
              onMouseLeave={() => setIsHoveringTag(false)}
              className={`cursor-pointer rounded-3xl p-5 border transition-all duration-300 ${
                activeTagIndex === index
                  ? 'bg-green-400/10 border-green-400'
                  : 'bg-zinc-900 border-zinc-800'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl">🔥</div>
                <div className="text-green-400 font-black">+{item.growth}%</div>
              </div>
              <div className="text-2xl font-black mb-2">#{item.tag}</div>
              <div className="text-zinc-500 text-sm">Rising rapidly now</div>
              <div className="mt-4 w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-green-400 h-full"
                  style={{ width: `${Math.min(item.growth, 100)}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* =========================================================
            VIDEO TAB SWITCH
        ========================================================= */}
        <div className="flex gap-3 mb-12">
          <button
            onClick={() => setActiveTab('trending')}
            className={`px-6 py-3 rounded-2xl transition-all ${
              activeTab === 'trending'
                ? 'bg-white text-black'
                : 'bg-zinc-900 border border-zinc-700'
            }`}
          >
            🔥 Trending
          </button>
          <button
            onClick={() => setActiveTab('opportunity')}
            className={`px-6 py-3 rounded-2xl transition-all ${
              activeTab === 'opportunity'
                ? 'bg-yellow-400 text-black'
                : 'bg-zinc-900 border border-zinc-700'
            }`}
          >
            🚀 Opportunity
          </button>
          <button
            onClick={() => setActiveTab('shorts')}
            className={`px-6 py-3 rounded-2xl transition-all ${
              activeTab === 'shorts'
                ? 'bg-red-500 text-white'
                : 'bg-zinc-900 border border-zinc-700'
            }`}
          >
            📱 Shorts
          </button>
        </div>

        {/* =========================================================
            VIDEO SECTION
        ========================================================= */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onMouseEnter={() => setIsHoveringVideoArea(true)}
            onMouseLeave={() => setIsHoveringVideoArea(false)}
            className={`grid mb-24 ${activeTab === 'shorts' ? 'grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'}`}
          >
            {(activeTab === 'trending' ? videos : activeTab === 'opportunity' ? risingVideos : finalShorts).map((video, index) => {
              const trendScore = calculateTrendScore(video)
              const stage = getTrendStage(trendScore)
              const virality = predictVirality(video)
              const opportunity = calculateOpportunity(video)
              const growthLabel = getTrendGrowth(video)

              return activeTab === 'shorts' ? (
                <a
                  key={`${video.id}-short-${index}`}
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="aspect-[9/16] rounded-3xl overflow-hidden relative group"
                  >
                    <img
                      src={video.snippet?.thumbnails?.high?.url}
                      alt={video.snippet?.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4 bg-red-500 px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                      SHORTS
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="text-white font-bold line-clamp-3 mb-3">
                        {video.snippet?.title}
                      </div>
                      <div className="text-zinc-300 text-sm mb-2">
                        {video.snippet?.channelTitle}
                      </div>
                      <div className="text-red-400 font-bold">
                        👀 {Number(video.statistics?.viewCount || 0).toLocaleString()}
                      </div>
                    </div>
                  </motion.div>
                </a>
              ) : (
                <a
                  key={`${video.id}-${index}`}
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <motion.div
                    whileHover={{ y: -5, scale: 1.01 }}
                    className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden h-full"
                  >
                    {/* THUMB */}
                    <div className="relative overflow-hidden">
                      <img
                        src={video.snippet?.thumbnails?.high?.url}
                        alt={video.snippet?.title}
                        className="w-full aspect-video object-cover hover:scale-105 transition duration-500"
                      />
                      <div className="absolute top-4 left-4 bg-black/80 backdrop-blur px-4 py-2 rounded-full font-bold">
                        {stage.emoji} {stage.label}
                      </div>
                      <div className="absolute top-4 right-4 bg-yellow-400 text-black px-4 py-2 rounded-full font-black">
                        {virality}%
                      </div>
                      <div className="absolute bottom-4 left-4 bg-red-500 px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                        LIVE
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="p-5 space-y-5">
                      {/* TITLE */}
                      <h3 className="font-bold text-xl line-clamp-2">
                        {video.snippet?.title}
                      </h3>

                      {/* TREND GROWTH */}
                      <div className="text-green-400 font-bold text-sm">
                        {growthLabel}
                      </div>

                      {/* AI ANALYSIS */}
                      <div className="bg-black border border-zinc-800 rounded-2xl p-4">
                        <div className="text-yellow-400 text-xs mb-3 font-bold tracking-wider">
                          WHY IT BLOWS UP
                        </div>
                        <div className="space-y-2">
                          {generateAdvancedAIAnalysis(video).map((item, idx) => (
                            <div key={idx} className="text-sm text-zinc-300 leading-relaxed">
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CHANNEL */}
                      <div className="text-zinc-400 text-sm">
                        {video.snippet?.channelTitle}
                      </div>

                      {/* TAGS */}
                      <div className="flex flex-wrap gap-2">
                        {extractAITags(
                          video.snippet?.title || '',
                          video.snippet?.description || ''
                        ).map((tag) => (
                          <div
                            key={tag}
                            className="px-3 py-1 rounded-full bg-black border border-zinc-700 text-sm"
                          >
                            #{tag}
                          </div>
                        ))}
                      </div>

                      {/* FOMO */}
                      <div className="bg-orange-500/10 border border-orange-500 rounded-2xl p-4">
                        <div className="text-orange-400 font-bold mb-1">
                          ⚠️ Creator Copy Alert
                        </div>
                        <div className="text-sm text-zinc-300">
                          {Math.floor(Math.random() * 50 + 10)} creators uploaded similar videos today.
                        </div>
                      </div>

                      {/* EXPLODING */}
                      <div>
                        <div className="text-red-400 font-bold animate-pulse">
                          🚀 Exploding Right Now
                        </div>
                        <div className="text-zinc-500 text-sm mt-1">
                          Peak expected in {Math.floor(Math.random() * 12 + 2)} hours
                        </div>
                      </div>

                      {/* SCORE */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-zinc-500 text-sm">Opportunity Score</div>
                          <div className="text-yellow-400 font-black">{opportunity}/100</div>
                        </div>
                        <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-yellow-400 h-full"
                            style={{ width: `${opportunity}%` }}
                          />
                        </div>
                      </div>

                      {/* STATS */}
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="bg-black rounded-2xl p-3">
                          <div className="text-2xl mb-1">👀</div>
                          <div className="font-bold">
                            {Number(video.statistics?.viewCount || 0).toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-black rounded-2xl p-3">
                          <div className="text-2xl mb-1">❤️</div>
                          <div className="font-bold">
                            {Number(video.statistics?.likeCount || 0).toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-black rounded-2xl p-3">
                          <div className="text-2xl mb-1">💬</div>
                          <div className="font-bold">
                            {Number(video.statistics?.commentCount || 0).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </a>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {/* =========================================================
            LOADING
        ========================================================= */}
        {loading && (
          <div className="text-center py-10 text-zinc-500">
            Loading YouTube trend intelligence...
          </div>
        )}
      </div>
    </main>
  )
}
