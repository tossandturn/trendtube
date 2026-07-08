'use client'

import { useState, useEffect } from 'react'
import { fetchVideoById } from '@/lib/api-client'

interface EngagementMetrics {
  totalViews: number
  totalLikes: number
  totalComments: number
  engagementRate: number
  likeRate: number
  commentRate: number
  estimatedWatchTime: number
  performanceTier: string
}

interface EngagementAnalyticsProps {
  videoId?: string
  channelId?: string
}

function calculateEngagementMetrics(video: any): EngagementMetrics {
  const stats = video.statistics || {}
  const views = Number(stats.viewCount || 0)
  const likes = Number(stats.likeCount || 0)
  const comments = Number(stats.commentCount || 0)

  // Real engagement calculations
  const engagementRate = views > 0 ? ((likes + comments * 2) / views) * 100 : 0
  const likeRate = views > 0 ? (likes / views) * 100 : 0
  const commentRate = views > 0 ? (comments / views) * 1000 : 0

  // Estimate watch time based on engagement (public-data heuristic).
  const estimatedWatchTime = engagementRate > 5 ? 240 : engagementRate > 3 ? 180 : 120

  // Performance tier based on real benchmarks
  let performanceTier = 'Average'
  if (engagementRate > 8) performanceTier = 'Exceptional'
  else if (engagementRate > 5) performanceTier = 'High'
  else if (engagementRate > 3) performanceTier = 'Good'
  else if (engagementRate > 1.5) performanceTier = 'Average'
  else performanceTier = 'Below Average'

  return {
    totalViews: views,
    totalLikes: likes,
    totalComments: comments,
    engagementRate,
    likeRate,
    commentRate,
    estimatedWatchTime,
    performanceTier,
  }
}

export default function EngagementAnalytics({ videoId, channelId }: EngagementAnalyticsProps) {
  const [metrics, setMetrics] = useState<EngagementMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        if (videoId) {
          const video = await fetchVideoById(videoId)
          if (video) {
            setMetrics(calculateEngagementMetrics(video))
          }
        }
      } catch (error) {
        console.error('Failed to load engagement data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [videoId, channelId])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Engagement data unavailable</p>
        <p className="text-sm mt-1">Video statistics not accessible</p>
      </div>
    )
  }

  const formatNumber = (n: number) => {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
    return n.toLocaleString()
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <span className="text-2xl">E</span>
        Engagement Analytics
      </h3>
      <p className="text-xs leading-relaxed text-gray-500">
        Views, likes, and comments come from public YouTube data. Watch time is an estimate, not private YouTube Studio retention.
      </p>

      {/* Performance Tier */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500 mb-1">Performance Tier</div>
            <div className={`text-2xl font-bold ${
              metrics.performanceTier === 'Exceptional' ? 'text-purple-600' :
              metrics.performanceTier === 'High' ? 'text-green-600' :
              metrics.performanceTier === 'Good' ? 'text-blue-600' :
              metrics.performanceTier === 'Average' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {metrics.performanceTier}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Engagement Rate</div>
            <div className="text-2xl font-bold text-gray-900">{metrics.engagementRate.toFixed(2)}%</div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Total Views</div>
          <div className="text-2xl font-bold text-gray-900">{formatNumber(metrics.totalViews)}</div>
          <div className="text-xs text-gray-400 mt-1">From YouTube API</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Total Likes</div>
          <div className="text-2xl font-bold text-red-600">{formatNumber(metrics.totalLikes)}</div>
          <div className="text-xs text-gray-400 mt-1">{metrics.likeRate.toFixed(2)}% like rate</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Comments</div>
          <div className="text-2xl font-bold text-blue-600">{formatNumber(metrics.totalComments)}</div>
          <div className="text-xs text-gray-400 mt-1">{metrics.commentRate.toFixed(1)} per 1K views</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Estimated Watch Time</div>
          <div className="text-2xl font-bold text-green-600">~{metrics.estimatedWatchTime}s</div>
          <div className="text-xs text-gray-400 mt-1">Public engagement proxy</div>
        </div>
      </div>

      {/* Engagement Breakdown */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">Engagement Breakdown</h4>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Like Rate</span>
              <span className="font-medium">{metrics.likeRate.toFixed(2)}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full"
                style={{ width: `${Math.min(100, metrics.likeRate * 20)}%` }}
              />
            </div>
            <div className="text-xs text-gray-400 mt-1">Industry avg: 2-4%</div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Comment Rate</span>
              <span className="font-medium">{metrics.commentRate.toFixed(1)}‰</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${Math.min(100, metrics.commentRate * 2)}%` }}
              />
            </div>
            <div className="text-xs text-gray-400 mt-1">Industry avg: 0.5-2‰</div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Overall Engagement</span>
              <span className="font-medium text-green-600">{metrics.engagementRate.toFixed(2)}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${Math.min(100, metrics.engagementRate * 10)}%` }}
              />
            </div>
            <div className="text-xs text-gray-400 mt-1">Industry avg: 2-3%</div>
          </div>
        </div>
      </div>

      {/* Benchmark Comparison */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
        <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
          <span>B</span> Benchmark Analysis
        </h4>
        <p className="text-sm text-amber-800">
          {metrics.engagementRate > 5
            ? 'This content significantly outperforms industry benchmarks. Top 10% performance.'
            : metrics.engagementRate > 3
            ? 'Above average engagement. Performance is in the top 25% of content.'
            : metrics.engagementRate > 2
            ? 'Average engagement, typical for most YouTube content.'
            : 'Below average engagement. Consider optimizing content hooks and CTAs.'}
        </p>
      </div>
    </div>
  )
}
