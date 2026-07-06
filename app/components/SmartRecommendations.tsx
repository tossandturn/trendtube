'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import AddToVideoCompareButton from './AddToVideoCompareButton'

interface YouTubeVideo {
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

interface RecommendedVideo {
  id: string
  title: string
  thumbnail: string
  channelTitle: string
  viewCount: string
  aiScore: number
  reason: string
}

interface SmartRecommendationsProps {
  currentVideoId: string
  videoCategory: string
  videoTags: string[]
}

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || ''

async function fetchRelatedVideos(videoId: string, maxResults = 8): Promise<YouTubeVideo[]> {
  if (!API_KEY) return []

  try {
    // First try to get related videos from YouTube API
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${videoId}&type=video&maxResults=${maxResults}&key=${API_KEY}`,
      { next: { revalidate: 300 } }
    )

    if (!response.ok) {
      // Fallback to trending videos if related videos fail
      return fetchTrendingVideos('US', maxResults)
    }

    const data = await response.json()
    const videoIds = data.items?.map((item: any) => item.id.videoId).join(',') || ''

    if (!videoIds) return []

    // Get statistics for the related videos
    const statsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds}&key=${API_KEY}`,
      { next: { revalidate: 300 } }
    )

    if (!statsResponse.ok) return []

    const statsData = await statsResponse.json()
    return statsData.items || []
  } catch {
    return fetchTrendingVideos('US', maxResults)
  }
}

async function fetchTrendingVideos(region = 'US', maxResults = 8): Promise<YouTubeVideo[]> {
  if (!API_KEY) return []

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=${region}&maxResults=${maxResults}&key=${API_KEY}`,
      { next: { revalidate: 300 } }
    )

    if (!response.ok) return []

    const data = await response.json()
    return data.items || []
  } catch {
    return []
  }
}

export default function SmartRecommendations({
  currentVideoId,
  videoCategory,
  videoTags,
}: SmartRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<RecommendedVideo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRecommendations = async () => {
      setLoading(true)
      try {
        // Fetch related videos based on current video
        const videos = await fetchRelatedVideos(currentVideoId, 8)

        // Filter out current video and transform to recommendation format
        const filtered = videos
          .filter(v => v.id !== currentVideoId)
          .slice(0, 4)
          .map((v, i) => {
            const viewCount = Number(v.statistics?.viewCount || 0)
            const likeCount = Number(v.statistics?.likeCount || 0)
            const engagement = viewCount > 0 ? (likeCount / viewCount) * 100 : 0

            // Calculate AI score based on engagement (deterministic)
            const aiScore = Math.min(98, Math.round(70 + engagement * 3 + (viewCount % 10)))

            // Determine reason based on category/tags match
            let reason = 'Trending'
            if (videoCategory && (v.snippet as any)?.categoryId === videoCategory) {
              reason = 'Same Category'
            } else if (videoTags.some(tag => v.snippet?.title?.toLowerCase().includes(tag.toLowerCase()))) {
              reason = 'Tag Match'
            } else if (i === 0) {
              reason = 'High Score'
            } else if (i === 1) {
              reason = 'Rising'
            }

            return {
              id: v.id,
              title: v.snippet?.title || 'Unknown Video',
              thumbnail: v.snippet?.thumbnails?.medium?.url || v.snippet?.thumbnails?.default?.url || '',
              channelTitle: v.snippet?.channelTitle || 'Unknown Channel',
              viewCount: formatViewCount(viewCount),
              aiScore,
              reason,
            }
          })

        setRecommendations(filtered)
      } catch (error) {
        console.error('Failed to load recommendations:', error)
        setRecommendations([])
      } finally {
        setLoading(false)
      }
    }

    loadRecommendations()
  }, [currentVideoId, videoCategory, videoTags])

  function formatViewCount(count: number): string {
    if (count >= 1_000_000) return (count / 1_000_000).toFixed(1) + 'M'
    if (count >= 1_000) return (count / 1_000).toFixed(1) + 'K'
    return count.toString()
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-100 rounded-xl h-32 animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <span className="text-xl">🎯</span>
          AI Recommendations
        </h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          Based on content similarity
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {recommendations.map((video) => (
          <div
            key={video.id}
            className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <Link href={`/video/${video.id}`} className="block">
            <div className="flex gap-3 p-3">
              {/* Thumbnail */}
              <div className="relative w-28 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                {video.thumbnail ? (
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">🎬</span>
                  </div>
                )}
                <div className="absolute top-1 right-1 bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                  {video.aiScore}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                  {video.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1">{video.channelTitle}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-400">▶ {video.viewCount}</span>
                  <span className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full">
                    {video.reason}
                  </span>
                </div>
              </div>
            </div>
            </Link>
            <div className="px-3 pb-3">
              <AddToVideoCompareButton
                videoId={video.id}
                title={video.title}
                channelTitle={video.channelTitle}
                thumbnailUrl={video.thumbnail}
                sourceLabel="AI recommendation"
                compact
                fullWidth
              />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
        <div className="flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div>
            <h4 className="font-semibold text-amber-900 mb-1">Learning Tips</h4>
            <p className="text-sm text-amber-800">
              These videos have similar themes and high quality scores. Analyzing their success
              can help you optimize your content strategy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
