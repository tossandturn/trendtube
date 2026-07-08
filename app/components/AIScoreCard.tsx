'use client'

import { useState, useEffect } from 'react'

interface ScoreData {
  overall: number
  percentile: number
  quality: number
  engagement: number
  retention: number
  growth: number
  category: string
}

interface AIScoreCardProps {
  videoId?: string
  channelId?: string
  type: 'video' | 'channel'
  // Optional: pass real data for scoring
  videoData?: {
    statistics?: {
      viewCount?: string
      likeCount?: string
      commentCount?: string
    }
    snippet?: {
      publishedAt?: string
      title?: string
    }
  }
  channelData?: {
    statistics?: {
      subscriberCount?: string
      viewCount?: string
      videoCount?: string
    }
    snippet?: {
      publishedAt?: string
    }
  }
  videos?: any[] // Channel videos for analysis
}

export default function AIScoreCard({ videoId, channelId, type, videoData, channelData, videos }: AIScoreCardProps) {
  const [score, setScore] = useState<ScoreData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const calculateScore = () => {
      setLoading(true)

      // Calculate real scores based on actual data
      const calculateRealScores = (): ScoreData => {
        if (type === 'video' && videoData) {
          const views = Number(videoData.statistics?.viewCount || 0)
          const likes = Number(videoData.statistics?.likeCount || 0)
          const comments = Number(videoData.statistics?.commentCount || 0)
          const publishedAt = videoData.snippet?.publishedAt
            ? new Date(videoData.snippet.publishedAt)
            : new Date()
          const daysSince = Math.max(1, (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60 * 24))

          // Engagement rate (likes + comments * 2) / views
          const engagementRate = views > 0 ? ((likes + comments * 2) / views) * 100 : 0
          // Like rate
          const likeRate = views > 0 ? (likes / views) * 100 : 0

          // Velocity score (views per day)
          const velocity = views / daysSince
          const velocityScore = Math.min(100, Math.round(velocity / 10000))

          // Content quality based on title length, description presence
          const title = videoData.snippet?.title || ''
          const qualityScore = Math.min(100, 50 + (title.length > 30 ? 20 : 0) + (views > 10000 ? 30 : 0))

          // Public-data proxy based on engagement; private retention is not available.
          const retentionScore = Math.min(100, Math.round(engagementRate * 10))

          // Overall score weighted combination
          const overall = Math.round(
            qualityScore * 0.25 +
            Math.min(100, engagementRate * 10) * 0.25 +
            retentionScore * 0.25 +
            velocityScore * 0.25
          )

          // Percentile based on view count relative to typical videos
          const percentile = views > 1000000 ? 95 : views > 100000 ? 85 : views > 10000 ? 70 : 50

          return {
            overall,
            percentile,
            quality: qualityScore,
            engagement: Math.min(100, Math.round(engagementRate * 10)),
            retention: retentionScore,
            growth: velocityScore,
            category: engagementRate > 5 ? 'Entertainment' : likeRate > 2 ? 'Educational' : 'General',
          }
        }

        if (type === 'channel' && channelData && videos) {
          const subscriberCount = Number(channelData.statistics?.subscriberCount || 0)
          const totalViews = Number(channelData.statistics?.viewCount || 0)
          const videoCount = Number(channelData.statistics?.videoCount || 0)

          // Calculate avg views per video
          const avgViews = videoCount > 0 ? totalViews / videoCount : 0

          // Calculate engagement from recent videos
          let totalEngagement = 0
          videos.forEach((v: any) => {
            const vViews = Number(v.statistics?.viewCount || 0)
            const vLikes = Number(v.statistics?.likeCount || 0)
            const vComments = Number(v.statistics?.commentCount || 0)
            if (vViews > 0) {
              totalEngagement += ((vLikes + vComments * 2) / vViews) * 100
            }
          })
          const avgEngagement = videos.length > 0 ? totalEngagement / videos.length : 0

          // Channel age in days
          const publishedAt = channelData.snippet?.publishedAt
            ? new Date(channelData.snippet.publishedAt)
            : new Date()
          const daysSince = Math.max(1, (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60 * 24))
          const yearsActive = daysSince / 365

          // Growth score based on subscribers per year
          const growthScore = yearsActive > 0
            ? Math.min(100, Math.round(subscriberCount / yearsActive / 10000))
            : 50

          // Quality score based on consistency
          const qualityScore = Math.min(100, 40 + (avgEngagement > 3 ? 30 : 0) + (videos.length >= 10 ? 30 : 0))

          // Loyalty proxy based on views per subscriber; private retention is not available.
          const viewsPerSubscriber = subscriberCount > 0 ? totalViews / subscriberCount : 0
          const retentionScore = Math.min(100, Math.round(viewsPerSubscriber * 10))

          // Engagement score
          const engagementScore = Math.min(100, Math.round(avgEngagement * 15))

          // Overall score
          const overall = Math.round(
            qualityScore * 0.2 +
            engagementScore * 0.25 +
            retentionScore * 0.25 +
            growthScore * 0.3
          )

          // Percentile based on subscriber count
          const percentile = subscriberCount > 1000000 ? 97 : subscriberCount > 100000 ? 88 : subscriberCount > 10000 ? 75 : 55

          return {
            overall,
            percentile,
            quality: qualityScore,
            engagement: engagementScore,
            retention: retentionScore,
            growth: growthScore,
            category: avgEngagement > 4 ? 'Entertainment' : avgEngagement > 2 ? 'Knowledge' : 'Vlog',
          }
        }

        // Fallback if no data provided
        return {
          overall: 0,
          percentile: 0,
          quality: 0,
          engagement: 0,
          retention: 0,
          growth: 0,
          category: 'Unknown',
        }
      }

      // Small delay for UX
      setTimeout(() => {
        setScore(calculateRealScores())
        setLoading(false)
      }, 300)
    }

    calculateScore()
  }, [videoId, channelId, type, videoData, channelData, videos])

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 animate-pulse">
        <div className="h-32 bg-white/20 rounded-lg"></div>
      </div>
    )
  }

  if (!score || score.overall === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl p-6 text-white">
        <p className="text-center">Insufficient data for AI analysis</p>
      </div>
    )
  }

  const getScoreColor = (s: number) => {
    if (s >= 90) return 'text-green-400'
    if (s >= 70) return 'text-yellow-400'
    return 'text-orange-400'
  }

  const getScoreBg = (s: number) => {
    if (s >= 90) return 'bg-green-500'
    if (s >= 70) return 'bg-yellow-500'
    return 'bg-orange-500'
  }

  return (
    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span className="text-2xl">AI</span>
            AI Content Quality Score
          </h3>
          <p className="text-indigo-200 text-sm">Public metrics with clearly labeled proxy signals</p>
        </div>
        <div className="text-right">
          <div className={`text-4xl font-bold ${getScoreColor(score.overall)}`}>
            {score.overall}
          </div>
          <div className="text-sm text-indigo-200">Overall Score</div>
        </div>
      </div>

      {/* Percentile Ranking */}
      <div className="bg-white/10 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-indigo-200">Top Percentile</div>
            <div className="text-2xl font-bold text-green-400">
              Top {100 - score.percentile}%
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-indigo-200">Category</div>
            <div className="text-lg font-semibold">{score.category}</div>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-xs text-indigo-200 mb-1">
            <span>Ranking Distribution</span>
            <span>{score.percentile}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-1000"
              style={{ width: `${score.percentile}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Dimension Scores */}
      <div className="grid grid-cols-2 gap-3">
        <ScoreItem label="Content Quality" score={score.quality} icon="Q" />
        <ScoreItem label="Engagement" score={score.engagement} icon="E" />
        <ScoreItem label="Retention proxy" score={score.retention} icon="R" />
        <ScoreItem label="Growth Potential" score={score.growth} icon="G" />
      </div>

      {/* AI Recommendation */}
      <div className="mt-4 bg-white/10 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">Tip</span>
          <div>
            <div className="font-semibold mb-1">AI Recommendations</div>
            <p className="text-sm text-indigo-100">
              {score.overall >= 85
                ? 'Excellent content quality! Maintain your current creative pace and consider exploring related topics.'
                : score.overall >= 70
                ? 'Good overall performance. Optimizing titles and thumbnails can further improve CTR.'
                : 'Content has potential. Analyze top-performing similar videos to learn their success factors.'}
            </p>
            <p className="mt-2 text-xs text-indigo-100">
              Retention proxy is inferred from public engagement and channel/video behavior, not private YouTube Studio retention.
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
