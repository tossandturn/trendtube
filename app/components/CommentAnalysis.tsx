'use client'

import { useState, useEffect } from 'react'
import { fetchVideoComments, YouTubeComment } from '@/lib/api-client'

interface CommentStats {
  totalComments: number
  avgLikesPerComment: number
  topComments: YouTubeComment[]
  recentActivity: 'high' | 'medium' | 'low'
}

interface CommentAnalysisProps {
  videoId: string
}

function analyzeComments(comments: YouTubeComment[]): CommentStats {
  if (comments.length === 0) {
    return {
      totalComments: 0,
      avgLikesPerComment: 0,
      topComments: [],
      recentActivity: 'low',
    }
  }

  const totalLikes = comments.reduce((sum, c) => sum + (c.snippet?.topLevelComment?.snippet?.likeCount || 0), 0)
  const avgLikes = totalLikes / comments.length

  // Sort by likes to get top comments
  const sortedByLikes = [...comments].sort((a, b) => {
    const likesA = a.snippet?.topLevelComment?.snippet?.likeCount || 0
    const likesB = b.snippet?.topLevelComment?.snippet?.likeCount || 0
    return likesB - likesA
  })

  // Determine activity level based on comment count
  let recentActivity: 'high' | 'medium' | 'low' = 'low'
  if (comments.length > 50) recentActivity = 'high'
  else if (comments.length > 20) recentActivity = 'medium'

  return {
    totalComments: comments.length,
    avgLikesPerComment: Math.round(avgLikes),
    topComments: sortedByLikes.slice(0, 5),
    recentActivity,
  }
}

export default function CommentAnalysis({ videoId }: CommentAnalysisProps) {
  const [stats, setStats] = useState<CommentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadComments = async () => {
      setLoading(true)
      setError(null)

      try {
        const comments = await fetchVideoComments(videoId, 100)
        setStats(analyzeComments(comments))
      } catch (err) {
        setError('Comments may be disabled for this video')
      } finally {
        setLoading(false)
      }
    }

    if (videoId) {
      loadComments()
    }
  }, [videoId])

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 animate-pulse">
        <div className="h-32 bg-gray-100 rounded-lg"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">💬</span>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Comment Analysis</h3>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!stats || stats.totalComments === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">💬</span>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Comment Analysis</h3>
            <p className="text-sm text-gray-500">No comments available for this video</p>
          </div>
        </div>
      </div>
    )
  }

  const formatNumber = (n: number) => {
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
    return n.toString()
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="text-2xl">💬</span>
          Comment Analysis
        </h3>
        <span className={`text-xs px-3 py-1 rounded-full ${
          stats.recentActivity === 'high' ? 'bg-green-100 text-green-700' :
          stats.recentActivity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {stats.recentActivity === 'high' ? 'High Activity' :
           stats.recentActivity === 'medium' ? 'Moderate' : 'Low Activity'}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-xs text-blue-600 mb-1">Comments Analyzed</div>
          <div className="text-2xl font-bold text-blue-900">{stats.totalComments}</div>
        </div>
        <div className="bg-indigo-50 rounded-lg p-4">
          <div className="text-xs text-indigo-600 mb-1">Avg Likes/Comment</div>
          <div className="text-2xl font-bold text-indigo-900">{stats.avgLikesPerComment}</div>
        </div>
      </div>

      {/* Top Comments */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Top Comments by Engagement</h4>
        <div className="space-y-3">
          {stats.topComments.slice(0, 3).map((comment, index) => {
            const snippet = comment.snippet?.topLevelComment?.snippet
            if (!snippet) return null

            return (
              <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <img
                    src={snippet.authorProfileImageUrl}
                    alt={snippet.authorDisplayName}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-gray-900">{snippet.authorDisplayName}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(snippet.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{snippet.textDisplay}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-gray-500">{snippet.likeCount} likes</span>
                      <span className="text-xs text-gray-400">#{index + 1}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
        <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
          <span>📊</span> Comment Insights
        </h4>
        <ul className="space-y-2 text-sm text-purple-800">
          <li className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span>
              {stats.avgLikesPerComment > 10
                ? 'Comments show strong community engagement with high like rates'
                : stats.avgLikesPerComment > 5
                ? 'Moderate engagement on comments - typical for most content'
                : 'Lower engagement on comments - consider asking questions in video'}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span>
              {stats.recentActivity === 'high'
                ? 'High comment volume indicates viral potential and active discussion'
                : stats.recentActivity === 'medium'
                ? 'Steady comment activity - content is generating discussion'
                : 'Lower comment activity - focus on creating more discussion-worthy content'}
            </span>
          </li>
        </ul>
      </div>

      <p className="text-xs text-gray-400 mt-4">
        Data from YouTube Data API - Real comment statistics
      </p>
    </div>
  )
}
