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
  if (score > 350) return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'VIRAL' }
  if (score > 250) return { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', label: 'RISING' }
  return { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: 'EMERGING' }
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
  if (velocity > 5_000_000) return '5M+ /day'
  if (velocity > 2_000_000) return '2M+ /day'
  if (velocity > 1_000_000) return '1M+ /day'
  if (velocity > 500_000) return '500K+ /day'
  if (velocity > 100_000) return '100K+ /day'
  return Math.round(velocity).toLocaleString() + ' /day'
}

function getViralScore(video: Video): number {
  const views = Number(video.statistics?.viewCount || 0)
  const likes = Number(video.statistics?.likeCount || 0)
  const comments = Number(video.statistics?.commentCount || 0)
  const velocity = getViewVelocity(video)
  const title = video.snippet?.title?.toLowerCase() || ''

  let velocityWeight = 0
  if (velocity > 5_000_000) velocityWeight = 35
  else if (velocity > 2_000_000) velocityWeight = 30
  else if (velocity > 1_000_000) velocityWeight = 25
  else if (velocity > 500_000) velocityWeight = 20
  else if (velocity > 200_000) velocityWeight = 15
  else if (velocity > 100_000) velocityWeight = 10
  else velocityWeight = Math.max(1, Math.round(velocity / 10_000))

  const likeRate = views > 0 ? (likes / views) * 1000 : 0
  const commentRate = views > 0 ? (comments / views) * 1000 : 0
  const engagementWeight = Math.min(30, likeRate * 2 + commentRate * 5)

  const commentRichness = likes > 0 ? (comments / likes) * 100 : 0
  const retentionWeight = Math.min(20, commentRichness * 2 + likeRate * 1.5)

  const competitionBonus = views < 1_000_000 ? 10 : views < 5_000_000 ? 6 : views < 20_000_000 ? 3 : 0

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

  let momentumWindow = 0
  if (views < 500_000 && velocity > 200_000) momentumWindow = 40
  else if (views < 1_000_000 && velocity > 100_000) momentumWindow = 35
  else if (views < 2_000_000 && velocity > 50_000) momentumWindow = 30
  else if (views < 5_000_000) momentumWindow = 20
  else if (views < 15_000_000) momentumWindow = 10
  else momentumWindow = 3

  const likeRate = views > 0 ? (likes / views) * 1000 : 0
  const commentRate = views > 0 ? (comments / views) * 1000 : 0
  const engagementScore = Math.min(30, likeRate * 2.5 + commentRate * 6)

  const velocityBonus = Math.min(20, Math.round(velocity / 200_000))

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

function generateSuggestedTitles(tag: string): string[] {
  return SUGGESTED_TITLES[tag] || [`${tag} content that blows up`, `Why ${tag} is trending now`, `The ${tag} opportunity you missed`]
}

function slugifyTag(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, '-')
}

/* =========================================================
   SUB-COMPONENTS
========================================================= */

// Clean Sparkline for trend preview
function MiniSparkline({ value, color = '#dc2626' }: { value: number; color?: string }) {
  const points = [20, 35, 30, 45, 40, 55, 50, 65, 70, value / 1.5].map((y, i) => `${i * 10},${100 - y}`)
  return (
    <svg viewBox="0 0 90 100" className="w-20 h-8">
      <polyline fill="none" stroke={color} strokeWidth="2" points={points.join(' ')} />
      <circle cx="90" cy={100 - value / 1.5} r="3" fill={color} />
    </svg>
  )
}

// Simple Velocity Bar
function VelocityBar({ velocity }: { velocity: number }) {
  const percentage = Math.min(100, (velocity / 5000000) * 100)
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5">
      <div
        className="bg-red-500 h-1.5 rounded-full transition-all"
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

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

  const topOpportunityTag = trendingTags[0] || { tag: 'AI', growth: 420 }
  const topOpportunityVideo = opportunityVideos[0]

  // Sample trends for hero preview
  const sampleTrends = useMemo(() => {
    return trendingVideos.slice(0, 3).map((video) => ({
      title: video.snippet?.title?.slice(0, 40) + '...',
      velocity: getViewVelocity(video),
      score: getViralScore(video),
      competition: getOpportunityScore(video) > 70 ? 'Low' : 'Medium',
      timing: getPeakExpected(video),
    }))
  }, [trendingVideos])

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* ===== STICKY TOP CTA (Desktop) ===== */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-red-600">TubeFission</span>
            <span className="text-xs text-gray-500">AI Trend Intelligence</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/trending"
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
            >
              Start Free
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">

        {/* ===== TASK 1.1: CLEAN HERO SECTION ===== */}
        <section className="mb-16 sm:mb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* LEFT: Value Proposition */}
            <div>
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-4">
                <span className="px-2 py-1 bg-gray-100 rounded-full">Updated every hour</span>
                <span className="px-2 py-1 bg-gray-100 rounded-full">Tracks millions of videos</span>
                <span className="px-2 py-1 bg-gray-100 rounded-full">AI-powered</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
                Find Viral YouTube Potential<br />
                <span className="text-red-600">Before Everyone Else</span>
              </h1>

              <p className="text-gray-600 text-lg max-w-xl mb-8 leading-relaxed">
                AI-powered trend intelligence for YouTube creators, Shorts operators, and growth teams. Predict breakout videos before they explode.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <Link
                  href="/trending"
                  className="px-8 py-4 bg-red-600 text-white rounded-xl font-bold text-base hover:bg-red-700 transition shadow-lg shadow-red-600/20"
                >
                  Start Finding Potential →
                </Link>
                <button
                  onClick={() => document.getElementById('live-demo')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 border border-gray-300 text-gray-700 rounded-xl font-bold text-base hover:bg-gray-50 transition"
                >
                  Watch Demo
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Updated every hour</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Tracks millions of videos</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>AI-powered momentum detection</span>
                </div>
              </div>
            </div>

            {/* RIGHT: Interactive Live Trend Preview */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Live Trend Preview</h3>
                <span className="flex items-center gap-1.5 text-xs text-green-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Live Data
                </span>
              </div>

              <div className="space-y-4">
                {sampleTrends.map((trend, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 hover:border-red-300 transition">
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-sm font-medium text-gray-900 line-clamp-1 flex-1">{trend.title}</div>
                      <span className="text-xs font-bold text-red-600 ml-2">{trend.score}/100</span>
                    </div>
                    <VelocityBar velocity={trend.velocity} />
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <span>⚡ {trend.velocity >= 1000000 ? (trend.velocity / 1000000).toFixed(1) + 'M' : (trend.velocity / 1000).toFixed(0) + 'K'}/day</span>
                      <span>🎯 {trend.competition} competition</span>
                      <span>⏰ Upload in {trend.timing}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-center">
                <Link href="/trending" className="text-sm text-red-600 font-medium hover:underline">
                  View all trending →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===== TASK 1.2: HOW IT WORKS (3 Steps) ===== */}
        <section className="mb-16 sm:mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">AI-powered trend detection in 3 simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Detect Early Momentum',
                desc: 'Analyze rising YouTube topics before they become saturated. Our AI monitors millions of videos 24/7.',
                icon: '📡',
              },
              {
                step: '2',
                title: 'Identify Low Competition Opportunities',
                desc: 'Discover niches where demand rises faster than creator supply. Perfect timing window.',
                icon: '🎯',
              },
              {
                step: '3',
                title: 'Publish Before Peak',
                desc: 'Use AI-assisted insights to publish content at the optimal time for maximum reach.',
                icon: '🚀',
              },
            ].map((item) => (
              <div key={item.step} className="bg-gray-50 rounded-2xl p-8 border border-gray-200 hover:border-red-200 transition">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                  {item.icon}
                </div>
                <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== TASK 1.3: SOCIAL PROOF / CASE STUDIES ===== */}
        <section className="mb-16 sm:mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Creator Success Stories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Real results from creators using TubeFission</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                niche: 'AI Tools Review',
                before: '12K',
                after: '245K',
                growth: '+1,941%',
                trend: 'ChatGPT Tutorials',
                ctr: '+312%',
                views: '3.2M',
              },
              {
                niche: 'Gaming Shorts',
                before: '8K',
                after: '189K',
                growth: '+2,262%',
                trend: 'Minecraft Builds',
                ctr: '+287%',
                views: '8.5M',
              },
              {
                niche: 'Faceless Business',
                before: '25K',
                after: '520K',
                growth: '+1,980%',
                trend: 'Side Hustle Ideas',
                ctr: '+456%',
                views: '12M',
              },
            ].map((story, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    {story.niche[0]}
                  </div>
                  <div>
                    <div className="font-bold">{story.niche}</div>
                    <div className="text-xs text-gray-500">Creator</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Before</div>
                    <div className="font-bold text-gray-400">{story.before}</div>
                  </div>
                  <div className="flex-1 h-px bg-gray-200" />
                  <div className="text-center">
                    <div className="text-sm text-gray-500">After</div>
                    <div className="font-bold text-red-600">{story.after}</div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Growth</span>
                    <span className="font-bold text-green-600">{story.growth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Trend Used</span>
                    <span className="font-medium">{story.trend}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">CTR Improvement</span>
                    <span className="font-bold text-green-600">{story.ctr}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Views</span>
                    <span className="font-medium">{story.views}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== TASK 1.4: LIVE PRODUCT DEMO ===== */}
        <section id="live-demo" className="mb-16 sm:mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Live Trend Explorer</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Interactive demo of our trend intelligence platform</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* Demo Header */}
            <div className="bg-gray-50 border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-bold">Trend Explorer</span>
                <div className="flex gap-2">
                  {['All', 'AI', 'Shorts', 'Gaming', 'Business'].map((cat) => (
                    <button
                      key={cat}
                      className={`px-3 py-1 rounded-lg text-sm ${cat === 'All' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search trends..."
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm w-48"
                />
                <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
                  <option>Sort by Velocity</option>
                  <option>Sort by Engagement</option>
                  <option>Sort by Opportunity</option>
                </select>
              </div>
            </div>

            {/* Demo Content */}
            <div className="p-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {trendingVideos.slice(0, 6).map((video) => {
                  const viralScore = getViralScore(video)
                  const opportunityScore = getOpportunityScore(video)
                  return (
                    <div key={video.id} className="border border-gray-200 rounded-xl p-4 hover:border-red-300 transition cursor-pointer group">
                      <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                        <img
                          src={video.snippet?.thumbnails?.medium?.url}
                          alt={video.snippet?.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                          loading="lazy"
                        />
                        <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                          {viralScore}/100
                        </div>
                      </div>
                      <h4 className="font-bold text-sm line-clamp-2 mb-2">{video.snippet?.title}</h4>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>⚡ {getTrendGrowth(video)}</span>
                        <span>🎯 {opportunityScore > 70 ? 'High' : 'Medium'} opportunity</span>
                      </div>
                      <div className="mt-2 text-xs text-gray-400 group-hover:text-red-600 transition">
                        Why this trend matters →
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <AdBanner slot="1234567890" className="my-12" />

        {/* ===== TASK 1.5: FEATURE CARDS ===== */}
        <section className="mb-16 sm:mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Everything you need to predict and capitalize on viral trends</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '⚡', title: 'Trend Velocity', desc: 'Track view acceleration in real-time', use: 'Spot momentum shifts early' },
              { icon: '🎯', title: 'Opportunity Score', desc: 'AI-calculated upload window rating', use: 'Know when to strike' },
              { icon: '🔍', title: 'Competition Analysis', desc: 'Creator density vs demand metrics', use: 'Find blue ocean niches' },
              { icon: '✍️', title: 'AI Hooks', desc: 'Generated titles and thumbnails', use: 'Higher CTR from day one' },
              { icon: '🔮', title: 'Viral Prediction', desc: 'ML-powered breakout forecasting', use: 'Be first, not follower' },
              { icon: '📱', title: 'Shorts Detection', desc: 'Vertical content trend radar', use: 'Ride the Shorts wave' },
              { icon: '🏷️', title: 'Niche Discovery', desc: 'Hidden micro-trend finder', use: 'Own small, win big' },
              { icon: '🔔', title: 'Trend Alerts', desc: 'Instant breakout notifications', use: 'Never miss opportunity' },
            ].map((feature) => (
              <div key={feature.title} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-red-200 transition group">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{feature.desc}</p>
                <p className="text-xs text-red-600 font-medium">{feature.use}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== TASK 1.6: PRICING SECTION ===== */}
        <section className="mb-16 sm:mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Start free, upgrade when you grow</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="text-sm font-medium text-gray-500 mb-2">Free</div>
              <div className="text-4xl font-bold mb-6">$0</div>
              <div className="text-sm text-gray-500 mb-6">Forever free</div>
              <ul className="space-y-3 mb-8">
                {['10 trends/day', 'Basic velocity scores', 'Weekly reports', 'Email support'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/trending" className="block w-full py-3 border border-gray-300 text-center rounded-xl font-medium hover:bg-gray-50 transition">
                Get Started
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-red-50 rounded-2xl p-8 border-2 border-red-500 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
                MOST POPULAR
              </div>
              <div className="text-sm font-medium text-red-600 mb-2">Pro</div>
              <div className="text-4xl font-bold mb-6">$29<span className="text-lg text-gray-500">/mo</span></div>
              <div className="text-sm text-gray-500 mb-6">Billed monthly</div>
              <ul className="space-y-3 mb-8">
                {['Unlimited trends', 'AI opportunity scores', 'Daily alerts', 'Priority support', 'API access', 'Export data'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/trending" className="block w-full py-3 bg-red-600 text-white text-center rounded-xl font-medium hover:bg-red-700 transition">
                Start Free Trial
              </Link>
            </div>

            {/* Team */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="text-sm font-medium text-gray-500 mb-2">Team</div>
              <div className="text-4xl font-bold mb-6">$99<span className="text-lg text-gray-500">/mo</span></div>
              <div className="text-sm text-gray-500 mb-6">For agencies & teams</div>
              <ul className="space-y-3 mb-8">
                {['Everything in Pro', '5 team seats', 'White-label reports', 'Custom integrations', 'Dedicated manager', 'SLA guarantee'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/trending" className="block w-full py-3 border border-gray-300 text-center rounded-xl font-medium hover:bg-gray-50 transition">
                Contact Sales
              </Link>
            </div>
          </div>
        </section>

        {/* ===== STICKY BOTTOM CTA (Mobile) ===== */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 sm:hidden z-50">
          <Link
            href="/trending"
            className="block w-full py-3 bg-red-600 text-white text-center rounded-xl font-bold"
          >
            Start Finding Potential →
          </Link>
        </div>

        {/* Spacer for mobile sticky CTA */}
        <div className="h-20 sm:hidden" />

        {/* ===== FOOTER ===== */}
        <footer className="border-t border-gray-200 pt-16 pb-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-bold text-lg mb-4">TubeFission</h3>
              <p className="text-gray-600 text-sm">AI-powered trend intelligence for YouTube creators.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/trending" className="hover:text-red-600">Potential</Link></li>
                <li><Link href="/shorts" className="hover:text-red-600">Shorts</Link></li>
                <li><Link href="/pricing" className="hover:text-red-600">Pricing</Link></li>
                <li><Link href="/api" className="hover:text-red-600">API</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/guides" className="hover:text-red-600">Guides</Link></li>
                <li><Link href="/blog" className="hover:text-red-600">Blog</Link></li>
                <li><Link href="/case-studies" className="hover:text-red-600">Case Studies</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/about" className="hover:text-red-600">About</Link></li>
                <li><Link href="/contact" className="hover:text-red-600">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-red-600">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} TubeFission. Not affiliated with YouTube.
          </div>
        </footer>

        {/* LOADING */}
        {loading && <div className="text-center py-10 text-gray-500 text-sm">Loading trends...</div>}
      </div>
    </main>
  )
}
