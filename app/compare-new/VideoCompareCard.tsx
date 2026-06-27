'use client'

import Link from 'next/link'

interface VideoCompareCardProps {
  video: any
  label: string
  color: 'blue' | 'red'
}

function formatNumber(n: string | number | undefined) {
  const num = Number(n || 0)
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B'
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M'
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K'
  return num.toLocaleString()
}

function calculateEngagementRate(video: any) {
  const views = Number(video.statistics?.viewCount || 0)
  const likes = Number(video.statistics?.likeCount || 0)
  const comments = Number(video.statistics?.commentCount || 0)
  if (views === 0) return 0
  return (((likes + comments * 2) / views) * 100).toFixed(2)
}

function formatDuration(duration: string) {
  if (!duration) return 'N/A'
  // Parse PT#H#M#S format
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return duration
  const hours = parseInt(match[1] || '0')
  const minutes = parseInt(match[2] || '0')
  const seconds = parseInt(match[3] || '0')
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export default function VideoCompareCard({ video, label, color }: VideoCompareCardProps) {
  if (!video) return null

  const stats = video.statistics
  const snippet = video.snippet
  const colorClasses = {
    blue: {
      border: 'border-blue-200',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      badge: 'bg-blue-100 text-blue-700'
    },
    red: {
      border: 'border-red-200',
      bg: 'bg-red-50',
      text: 'text-red-600',
      badge: 'bg-red-100 text-red-700'
    }
  }[color]

  const engagementRate = calculateEngagementRate(video)
  const duration = formatDuration(snippet?.duration)
  const publishDate = snippet?.publishedAt
    ? new Date(snippet.publishedAt).toLocaleDateString()
    : 'Unknown'

  return (
    <div className={`bg-white rounded-2xl border-2 ${colorClasses.border} overflow-hidden`}>
      {/* Header */}
      <div className={`${colorClasses.bg} px-6 py-3 border-b ${colorClasses.border}`}>
        <span className={`text-xs font-bold uppercase tracking-wider ${colorClasses.text}`}>
          {label}
        </span>
      </div>

      {/* Video Info */}
      <div className="p-6">
        {/* Thumbnail */}
        <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-gray-100">
          <img
            src={snippet?.thumbnails?.high?.url || snippet?.thumbnails?.medium?.url}
            alt={snippet?.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
          {snippet?.title}
        </h3>

        {/* Channel Info */}
        <p className="text-gray-500 text-sm mb-4">
          {snippet?.channelTitle} • {publishDate}
        </p>

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="text-xs text-gray-500 mb-1">Views</div>
            <div className="text-xl font-bold text-gray-900">{formatNumber(stats?.viewCount)}</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="text-xs text-gray-500 mb-1">Likes</div>
            <div className="text-xl font-bold text-gray-900">{formatNumber(stats?.likeCount)}</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="text-xs text-gray-500 mb-1">Comments</div>
            <div className="text-xl font-bold text-gray-900">{formatNumber(stats?.commentCount)}</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="text-xs text-gray-500 mb-1">Engagement</div>
            <div className="text-xl font-bold text-gray-900">{engagementRate}%</div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Duration</span>
            <span className="font-semibold text-gray-900">{duration}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">Like Rate</span>
            <span className="font-semibold text-gray-900">
              {stats?.viewCount && stats?.likeCount
                ? ((Number(stats.likeCount) / Number(stats.viewCount)) * 100).toFixed(2) + '%'
                : 'N/A'
              }
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          href={`/video/${video.id}`}
          className={`mt-4 block w-full text-center py-3 rounded-xl font-medium transition ${
            color === 'blue'
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          View Full Analysis →
        </Link>
      </div>
    </div>
  )
}
