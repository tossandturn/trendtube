'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

interface Video {
  id: string
  snippet?: {
    title?: string
    channelTitle?: string
    thumbnails?: {
      medium?: { url: string }
      default?: { url: string }
    }
  }
  statistics?: {
    viewCount?: string
    likeCount?: string
    commentCount?: string
  }
}

interface PotentialVideoRankingProps {
  videos: Video[]
  region?: string
}

// Calculate potential score based on multiple factors
function calculatePotentialScore(video: Video): number {
  const views = Number(video.statistics?.viewCount || 0)
  const likes = Number(video.statistics?.likeCount || 0)
  const comments = Number(video.statistics?.commentCount || 0)

  // Base engagement rate
  const engagementRate = views > 0 ? ((likes + comments * 2) / views) * 100 : 0

  // View velocity factor (normalized)
  const viewVelocity = Math.log10(views + 1) / 10

  // Engagement quality
  const engagementScore = Math.min(engagementRate * 10, 40)

  // Combined score (0-100)
  const score = (viewVelocity * 30) + engagementScore + 30

  return Math.min(100, Math.max(20, score))
}

// Get score color based on value
function getScoreColor(score: number): string {
  if (score >= 80) return 'from-green-500 to-emerald-600'
  if (score >= 60) return 'from-blue-500 to-indigo-600'
  if (score >= 40) return 'from-yellow-500 to-orange-600'
  return 'from-red-500 to-pink-600'
}

// Get score label
function getScoreLabel(score: number): string {
  if (score >= 80) return 'High Potential'
  if (score >= 60) return 'Good Potential'
  if (score >= 40) return 'Moderate'
  return 'Low'
}

// Get rank badge color
function getRankColor(rank: number): string {
  if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900'
  if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800'
  if (rank === 3) return 'bg-gradient-to-r from-orange-300 to-orange-400 text-orange-900'
  return 'bg-gray-100 text-gray-600'
}

// Format numbers
function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toLocaleString()
}

export default function PotentialVideoRanking({ videos, region = 'US' }: PotentialVideoRankingProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'high' | 'rising' | 'viral'>('all')

  // Calculate scores and sort
  const scoredVideos = useMemo(() => {
    const scored = videos.map(video => {
      const score = calculatePotentialScore(video)
      const views = Number(video.statistics?.viewCount || 0)
      const likes = Number(video.statistics?.likeCount || 0)
      const comments = Number(video.statistics?.commentCount || 0)
      const engagement = views > 0 ? ((likes + comments) / views) * 100 : 0

      return {
        video,
        score,
        views,
        engagement,
        potentialType: score >= 80 ? 'high' : score >= 60 ? 'rising' : 'viral'
      }
    })

    // Sort by score descending
    return scored.sort((a, b) => b.score - a.score)
  }, [videos])

  // Filter videos based on active tab
  const filteredVideos = useMemo(() => {
    switch (activeTab) {
      case 'high':
        return scoredVideos.filter(v => v.score >= 80)
      case 'rising':
        return scoredVideos.filter(v => v.score >= 60 && v.score < 80)
      case 'viral':
        return scoredVideos.filter(v => v.views >= 1000000)
      default:
        return scoredVideos
    }
  }, [scoredVideos, activeTab])

  // Take top 10
  const displayVideos = filteredVideos.slice(0, 10)

  const tabs = [
    { key: 'all', label: 'All Videos', count: scoredVideos.length },
    { key: 'high', label: 'High Potential', count: scoredVideos.filter(v => v.score >= 80).length },
    { key: 'rising', label: 'Rising', count: scoredVideos.filter(v => v.score >= 60 && v.score < 80).length },
    { key: 'viral', label: 'Viral', count: scoredVideos.filter(v => v.views >= 1000000).length },
  ]

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-purple-500 to-indigo-600" />
            <h2 className="text-base font-bold text-gray-900">Potential Video Ranking</h2>
            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded-full">AI Scored</span>
          </div>
          <span className="text-xs text-gray-500">{region} Region</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === tab.key
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
              <span className={`ml-1.5 px-1.5 py-0.5 rounded text-[10px] ${
                activeTab === tab.key ? 'bg-white/20' : 'bg-gray-200'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Video List */}
      <div className="divide-y divide-gray-100">
        {displayVideos.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-sm">No videos found in this category</div>
          </div>
        ) : (
          displayVideos.map((item, index) => {
            const rank = index + 1
            const score = item.score
            const video = item.video

            return (
              <Link
                key={video.id}
                href={`/video/${video.id}`}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group"
              >
                {/* Rank */}
                <div className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm ${getRankColor(rank)}`}>
                  {rank}
                </div>

                {/* Thumbnail */}
                <div className="relative w-24 h-16 sm:w-32 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  <img
                    src={video.snippet?.thumbnails?.medium?.url || `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`}
                    alt={video.snippet?.title || 'Video thumbnail'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {/* Duration overlay */}
                  <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                    Video
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors">
                    {video.snippet?.title || 'Untitled Video'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{video.snippet?.channelTitle || 'Unknown Channel'}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-600">
                      {formatNumber(item.views)} views
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className={`text-xs font-medium ${
                      item.engagement >= 5 ? 'text-green-600' : item.engagement >= 3 ? 'text-yellow-600' : 'text-gray-600'
                    }`}>
                      {item.engagement.toFixed(2)}% engagement
                    </span>
                  </div>
                </div>

                {/* Score */}
                <div className="flex flex-col items-end gap-1">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getScoreColor(score)} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                    {Math.round(score)}
                  </div>
                  <span className="text-[10px] text-gray-500 whitespace-nowrap">
                    {getScoreLabel(score)}
                  </span>
                </div>
              </Link>
            )
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Scored by AI based on engagement, velocity & growth potential</span>
          <Link href="/trending" className="text-purple-600 hover:text-purple-700 font-medium">
            View All Trends →
          </Link>
        </div>
      </div>
    </div>
  )
}
