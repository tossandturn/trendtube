'use client'

import Link from 'next/link'

interface ChannelCompareCardProps {
  channel: any
  videos: any[]
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

function calculateEngagementRate(videos: any[]) {
  if (!videos.length) return 0
  const totalEngagement = videos.reduce((sum, v) => {
    const views = Number(v.statistics?.viewCount || 0)
    const likes = Number(v.statistics?.likeCount || 0)
    const comments = Number(v.statistics?.commentCount || 0)
    if (views === 0) return sum
    return sum + ((likes + comments * 2) / views) * 100
  }, 0)
  return (totalEngagement / videos.length).toFixed(2)
}

export default function ChannelCompareCard({ channel, videos, label, color }: ChannelCompareCardProps) {
  if (!channel) return null

  const stats = channel.statistics
  const snippet = channel.snippet
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

  const engagementRate = calculateEngagementRate(videos)
  const avgViews = videos.length
    ? Math.round(videos.reduce((sum, v) => sum + Number(v.statistics?.viewCount || 0), 0) / videos.length)
    : 0

  return (
    <div className={`bg-white rounded-2xl border-2 ${colorClasses.border} overflow-hidden`}>
      {/* Header */}
      <div className={`${colorClasses.bg} px-6 py-3 border-b ${colorClasses.border}`}>
        <span className={`text-xs font-bold uppercase tracking-wider ${colorClasses.text}`}>
          {label}
        </span>
      </div>

      {/* Channel Info */}
      <div className="p-6">
        <div className="flex items-start gap-4 mb-6">
          {snippet?.thumbnails?.high?.url && (
            <img
              src={snippet.thumbnails.high.url}
              alt={snippet.title}
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-gray-900 truncate mb-1">
              {snippet?.title}
            </h3>
            <p className="text-gray-500 text-sm line-clamp-2 mb-2">
              {snippet?.description?.slice(0, 150)}...
            </p>
            <Link
              href={`/channel/${channel.id}`}
              className={`text-sm font-medium ${colorClasses.text} hover:underline`}
            >
              View Full Analysis →
            </Link>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-xs text-gray-500 mb-1">Subscribers</div>
            <div className="text-2xl font-bold text-gray-900">{formatNumber(stats?.subscriberCount)}</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-xs text-gray-500 mb-1">Total Views</div>
            <div className="text-2xl font-bold text-gray-900">{formatNumber(stats?.viewCount)}</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-xs text-gray-500 mb-1">Videos</div>
            <div className="text-2xl font-bold text-gray-900">{formatNumber(stats?.videoCount)}</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-xs text-gray-500 mb-1">Avg Engagement</div>
            <div className="text-2xl font-bold text-gray-900">{engagementRate}%</div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Avg Views/Video</span>
            <span className="font-semibold text-gray-900">{formatNumber(avgViews)}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">Views/Subscriber</span>
            <span className="font-semibold text-gray-900">
              {stats?.subscriberCount && avgViews
                ? (avgViews / Number(stats.subscriberCount) * 1000).toFixed(1) + 'x'
                : 'N/A'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
