'use client'

import { useState, useEffect } from 'react'
import { fetchVideoById } from '@/lib/api-client'

interface ScoreData {
  overall: number
  engagement: number
  retention: number
  growth: number
  category: string
}

interface ContentQualityScoreProps {
  videoId?: string
  channelId?: string
  type: 'video' | 'channel'
}

// Calculate real content score based on engagement metrics
function calculateContentScore(video: any): ScoreData {
  const stats = video.statistics || {}
  const views = Number(stats.viewCount || 0)
  const likes = Number(stats.likeCount || 0)
  const comments = Number(stats.commentCount || 0)

  // Engagement rate (real calculation)
  const engagementRate = views > 0 ? ((likes + comments * 2) / views) * 100 : 0
  const likeRate = views > 0 ? (likes / views) * 100 : 0
  const commentRate = views > 0 ? (comments / views) * 1000 : 0

  // Calculate days since publish for velocity
  const publishedAt = new Date(video.snippet?.publishedAt || Date.now())
  const daysSincePublish = Math.max(1, (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60 * 24))
  const velocity = views / daysSincePublish

  // Score components (0-100 scale based on real benchmarks)
  // Industry average engagement is 2-3%, so score relative to that
  const engagementScore = Math.min(100, (engagementRate / 3) * 50 + 50)

  // Like rate: average is 2-4%
  const retentionScore = Math.min(100, (likeRate / 4) * 50 + 50)

  // Velocity score based on views per day
  // 10K/day = average (50), 100K/day = good (75), 1M/day = excellent (100)
  let growthScore = 50
  if (velocity > 1_000_000) growthScore = 95
  else if (velocity > 500_000) growthScore = 85
  else if (velocity > 100_000) growthScore = 75
  else if (velocity > 50_000) growthScore = 65
  else if (velocity > 10_000) growthScore = 55

  // Overall score (weighted average)
  const overall = Math.round(engagementScore * 0.4 + retentionScore * 0.3 + growthScore * 0.3)

  // Determine category from title analysis
  const title = video.snippet?.title?.toLowerCase() || ''
  let category = 'General'
  if (title.includes('tutorial') || title.includes('how to') || title.includes('guide')) {
    category = 'Educational'
  } else if (title.includes('review') || title.includes('unboxing')) {
    category = 'Review'
  } else if (title.includes('gaming') || title.includes('gameplay') || title.includes('lets play')) {
    category = 'Gaming'
  } else if (title.includes('vlog') || title.includes('day in')) {
    category = 'Vlog'
  } else if (title.includes('comedy') || title.includes('funny') || title.includes('prank')) {
    category = 'Entertainment'
  } else if (title.includes('music') || title.includes('song') || title.includes('cover')) {
    category = 'Music'
  }

  return {
    overall,
    engagement: Math.round(engagementScore),
    retention: Math.round(retentionScore),
    growth: Math.round(growthScore),
    category,
  }
}

export default function ContentQualityScore({ videoId, channelId, type }: ContentQualityScoreProps) {
  const [score, setScore] = useState<ScoreData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)

      try {
        if (type === 'video' && videoId) {
          const video = await fetchVideoById(videoId)
          if (video) {
            setScore(calculateContentScore(video))
          } else {
            setError('Video data unavailable')
          }
        } else {
          setError('Channel analysis requires video data')
        }
      } catch (err) {
        setError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [videoId, channelId, type])

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 animate-pulse">
        <div className="h-32 bg-white/20 rounded-lg"></div>
      </div>
    )
  }

  if (error || !score) {
    return (
      <div className="bg-gray-100 rounded-2xl p-6">
        <div className="text-center text-gray-500">
          <p>Content quality analysis unavailable</p>
          <p className="text-sm mt-1">Insufficient data from YouTube API</p>
        </div>
      </div>
    )
  }

  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-green-400'
    if (s >= 60) return 'text-yellow-400'
    return 'text-orange-400'
  }

  const getScoreBg = (s: number) => {
    if (s >= 80) return 'bg-green-500'
    if (s >= 60) return 'bg-yellow-500'
    return 'bg-orange-500'
  }

  return (
    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span className="text-2xl">📊</span>
            Content Quality Score
          </h3>
          <p className="text-indigo-200 text-sm">Based on actual engagement metrics</p>
        </div>
        <div className="text-right">
          <div className={`text-4xl font-bold ${getScoreColor(score.overall)}`}>
            {score.overall}
          </div>
          <div className="text-sm text-indigo-200">Overall Score</div>
        </div>
      </div>

      {/* Category */}
      <div className="bg-white/10 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-indigo-200">Content Category</div>
            <div className="text-2xl font-bold text-white">{score.category}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-indigo-200">Performance</div>
            <div className={`text-lg font-semibold ${getScoreColor(score.overall)}`}>
              {score.overall >= 80 ? 'Excellent' : score.overall >= 60 ? 'Good' : 'Average'}
            </div>
          </div>
        </div>
      </div>

      {/* Dimension Scores */}
      <div className="grid grid-cols-3 gap-3">
        <ScoreItem label="Engagement" score={score.engagement} icon="💬" />
        <ScoreItem label="Retention" score={score.retention} icon="👁️" />
        <ScoreItem label="Velocity" score={score.growth} icon="📈" />
      </div>

      {/* Recommendations */}
      <div className="mt-4 bg-white/10 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <div className="font-semibold mb-1">Analysis</div>
            <p className="text-sm text-indigo-100">
              {score.overall >= 80
                ? 'This content performs in the top 20% based on engagement metrics. The high scores indicate strong audience resonance.'
                : score.overall >= 60
                ? 'Good performance with room for improvement. Focus on increasing engagement rate through stronger CTAs.'
                : 'Below average engagement. Analyze high-performing similar videos to identify improvement opportunities.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ScoreItem({ label, score, icon }: { label: string; score: number; icon: string }) {
  const getColor = (s: number) => {
    if (s >= 80) return 'text-green-400'
    if (s >= 60) return 'text-yellow-400'
    return 'text-orange-400'
  }

  return (
    <div className="bg-white/10 rounded-lg p-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-indigo-200 flex items-center gap-1">
          {icon} {label}
        </span>
        <span className={`font-bold ${getColor(score)}`}>{score}</span>
      </div>
      <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            score >= 80 ? 'bg-green-400' : score >= 60 ? 'bg-yellow-400' : 'bg-orange-400'
          }`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  )
}
