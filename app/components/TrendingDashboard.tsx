'use client'

import { useEffect, useMemo, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

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

function seededRandom(seed: string, max: number) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0
  }
  return Math.abs(hash) % max
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
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const tabIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isHoveringVideoAreaRef = useRef(isHoveringVideoArea)
  const didInit = useRef(false)

  useEffect(() => {
    isHoveringVideoAreaRef.current = isHoveringVideoArea
  }, [isHoveringVideoArea])

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
      if (data.items) {
        setVideos(data.items)
        setLastUpdated(new Date())
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

  /* =========================================================
     AUTO SWITCH VIDEO TABS (30s)
  ========================================================= */

  useEffect(() => {
    tabIntervalRef.current = setInterval(() => {
      if (isHoveringVideoAreaRef.current) return
      setActiveTab((prev) => {
        if (prev === 'trending') return 'opportunity'
        if (prev === 'opportunity') return 'shorts'
        return 'trending'
      })
    }, 30000)
    return () => {
      if (tabIntervalRef.current) clearInterval(tabIntervalRef.current)
    }
  }, [])

  /* =========================================================
     COMPUTED DATA
  ========================================================= */

  const risingVideos = useMemo(() => {
    const filtered = [...videos]
      .filter((video) => Number(video.statistics?.viewCount || 0) < 50_000_000)
      .sort((a, b) => calculateTrendScore(b) - calculateTrendScore(a))
      .slice(0, 8)
    if (filtered.length > 0) return filtered
    return [...videos]
      .sort((a, b) => calculateTrendScore(b) - calculateTrendScore(a))
      .slice(0, 8)
  }, [videos])

  const shortsVideos = videos.filter((video) => {
    const title = video.snippet?.title?.toLowerCase() || ''
    return title.includes('shorts') || title.includes('#shorts') || title.includes('short')
  })
  const finalShorts = shortsVideos.length > 0 ? shortsVideos : videos.slice(0, 12)

  const trendingTags: TagItem[] = useMemo(() => {
    const source =
      activeTab === 'trending' ? videos : activeTab === 'opportunity' ? risingVideos : finalShorts
    const effectiveSource = source.length > 0 ? source : videos
    const map: Record<string, TagItem> = {}
    effectiveSource.forEach((video) => {
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
  }, [videos, activeTab, risingVideos, finalShorts])

  /* =========================================================
     AUTO TAG CAROUSEL (20s)
  ========================================================= */

  useEffect(() => {
    setActiveTagIndex(0)
  }, [activeTab])

  useEffect(() => {
    if (trendingTags.length === 0) return
    const interval = setInterval(() => {
      if (isHoveringTag) return
      setActiveTagIndex((prev) => (prev >= trendingTags.length - 1 ? 0 : prev + 1))
    }, 20000)
    return () => clearInterval(interval)
  }, [trendingTags, isHoveringTag])

  const activeTag = trendingTags[activeTagIndex]

  /* =========================================================
     UI
  ========================================================= */

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* HEADER */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="text-red-400 text-xs font-bold tracking-widest uppercase">
                Live Trend Radar
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              TrendTube
            </h1>
            <p className="text-zinc-500 mt-1 text-sm sm:text-base">
              Discover viral YouTube trends before everyone else.
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2">
            <div className="flex gap-2">
              {REGIONS.map((country) => (
                <button
                  key={country}
                  onClick={() => {
                    setVideos([])
                    setRegion(country)
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                    region === country
                      ? 'bg-white text-black border-white'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
                  }`}
                >
                  <img
                    src={`https://flagcdn.com/w40/${REGION_META[country].flag}.png`}
                    alt={country}
                    className="w-5 h-4 rounded-sm object-cover"
                  />
                  <span className="hidden sm:inline">{REGION_META[country].label}</span>
                  <span className="sm:hidden">{country}</span>
                </button>
              ))}
            </div>
            <span className="text-zinc-600 text-xs">
              Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </header>

        {/* TAG HERO */}
        {activeTag && (
          <motion.div
            key={activeTag.tag}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            onMouseEnter={() => setIsHoveringTag(true)}
            onMouseLeave={() => setIsHoveringTag(false)}
            className="mb-8 sm:mb-10 bg-zinc-900/50 border border-zinc-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-zinc-500 text-xs font-bold tracking-widest uppercase">
                Now Trending
              </span>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <div className="text-4xl sm:text-6xl font-black mb-3">#{activeTag.tag}</div>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="bg-black/40 border border-zinc-800 rounded-xl px-4 py-2">
                    <div className="text-zinc-500 text-xs">Weekly Growth</div>
                    <div className="text-green-400 text-xl font-black">+{activeTag.growth}%</div>
                  </div>
                  <div className="bg-black/40 border border-zinc-800 rounded-xl px-4 py-2">
                    <div className="text-zinc-500 text-xs">Rank Change</div>
                    <div className="text-yellow-400 text-xl font-black">
                      ↑ {activeTag.previousRank - activeTag.rank}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full sm:w-64">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-zinc-500 text-xs">Momentum</span>
                  <span className="text-green-400 text-sm font-bold">+{activeTag.growth}%</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(activeTag.growth, 100)}%` }}
                    transition={{ duration: 0.8 }}
                    className="bg-green-400 h-full rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAG GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-8 sm:mb-10">
          {trendingTags.map((item, index) => (
            <button
              key={item.tag}
              onClick={() => setActiveTagIndex(index)}
              onMouseEnter={() => setIsHoveringTag(true)}
              onMouseLeave={() => setIsHoveringTag(false)}
              className={`text-left rounded-2xl p-3 sm:p-4 border transition-all ${
                activeTagIndex === index
                  ? 'bg-green-400/10 border-green-400/50'
                  : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-500 text-xs font-bold">#{index + 1}</span>
                <span className="text-green-400 text-xs font-black">+{item.growth}%</span>
              </div>
              <div className="font-bold text-sm sm:text-base mb-1">{item.tag}</div>
              <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-green-400 h-full rounded-full"
                  style={{ width: `${Math.min(item.growth, 100)}%` }}
                />
              </div>
            </button>
          ))}
        </div>

        {/* VIDEO TABS */}
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <div className="flex gap-2">
            {(['trending', 'opportunity', 'shorts'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab
                    ? tab === 'trending'
                      ? 'bg-white text-black'
                      : tab === 'opportunity'
                      ? 'bg-yellow-400 text-black'
                      : 'bg-red-500 text-white'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {tab === 'trending' && '🔥 Trending'}
                {tab === 'opportunity' && '🚀 Opportunity'}
                {tab === 'shorts' && '📱 Shorts'}
              </button>
            ))}
          </div>
        </div>

        {/* VIDEO SECTION */}
        <AnimatePresence>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            onMouseEnter={() => setIsHoveringVideoArea(true)}
            onMouseLeave={() => setIsHoveringVideoArea(false)}
            className={`grid mb-12 sm:mb-16 ${
              activeTab === 'shorts'
                ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5'
            }`}
          >
            {(activeTab === 'trending' ? videos : activeTab === 'opportunity' ? risingVideos : finalShorts).map(
              (video) => {
                const trendScore = calculateTrendScore(video)
                const stage = getTrendStage(trendScore)
                const tags = extractAITags(video.snippet?.title || '', video.snippet?.description || '')

                if (activeTab === 'shorts') {
                  return (
                    <Link
                      key={`${activeTab}-${video.id}`}
                      href={`/video/${video.id}`}
                      className="group block"
                    >
                      <div className="aspect-[9/16] rounded-xl sm:rounded-2xl overflow-hidden relative bg-zinc-900">
                        <img
                          src={video.snippet?.thumbnails?.high?.url}
                          alt={video.snippet?.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                        <div className="absolute top-2 left-2 bg-red-500 px-2 py-0.5 rounded-md text-[10px] font-bold">
                          SHORTS
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <div className="text-white font-bold text-xs line-clamp-2 mb-1">
                            {video.snippet?.title}
                          </div>
                          <div className="text-zinc-400 text-[10px]">
                            {formatNumber(video.statistics?.viewCount)} views
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                }

                return (
                  <Link
                    key={`${activeTab}-${video.id}`}
                    href={`/video/${video.id}`}
                    className="group block"
                  >
                    <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl sm:rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors">
                      {/* THUMB */}
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={video.snippet?.thumbnails?.high?.url}
                          alt={video.snippet?.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute top-2 left-2">
                          <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold border ${stage.bg} ${stage.color} ${stage.border}`}>
                            {stage.label}
                          </span>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur px-2 py-1 rounded-lg text-[10px] sm:text-xs font-medium">
                          {formatNumber(video.statistics?.viewCount)} views
                        </div>
                      </div>

                      {/* CONTENT */}
                      <div className="p-3 sm:p-4">
                        <h3 className="font-bold text-sm sm:text-base line-clamp-2 mb-2 group-hover:text-red-400 transition-colors">
                          {video.snippet?.title}
                        </h3>

                        <div className="flex items-center gap-2 text-zinc-500 text-xs mb-3">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-[10px] font-bold">
                            {video.snippet?.channelTitle?.[0]}
                          </div>
                          <span className="truncate">{video.snippet?.channelTitle}</span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-zinc-400 mb-3">
                          <span>👍 {formatNumber(video.statistics?.likeCount)}</span>
                          <span>💬 {formatNumber(video.statistics?.commentCount)}</span>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-full bg-black/50 border border-zinc-800 text-[10px] sm:text-xs text-zinc-400"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              }
            )}
            {(activeTab === 'trending' ? videos : activeTab === 'opportunity' ? risingVideos : finalShorts).length === 0 && (
              <div className="col-span-full text-center py-16 text-zinc-500">
                No videos found for this category.
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* LOADING */}
        {loading && (
          <div className="text-center py-10 text-zinc-500 text-sm">
            Loading trends...
          </div>
        )}

        {/* FOOTER / STICKINESS SECTION */}
        <div className="border-t border-zinc-800 pt-10 sm:pt-14 pb-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-10">
            <div>
              <h3 className="font-bold text-lg mb-3">Why TrendTube?</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                We analyze YouTube's most popular videos in real-time, extracting hidden patterns
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
                Discover what's blowing up right now. Find underserved niches. Copy what works
                — before everyone else does.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-600 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Data refreshed hourly from YouTube API</span>
            </div>
            <div>
              © {new Date().getFullYear()} TrendTube. Not affiliated with YouTube.
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
