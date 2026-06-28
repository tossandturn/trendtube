'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface VideoCompareMetricsProps {
  leftVideo: any
  rightVideo: any
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
  return ((likes + comments * 2) / views) * 100
}

function calculateLikeRate(video: any) {
  const views = Number(video.statistics?.viewCount || 0)
  const likes = Number(video.statistics?.likeCount || 0)
  if (views === 0) return 0
  return (likes / views) * 100
}

function calculateCommentRate(video: any) {
  const views = Number(video.statistics?.viewCount || 0)
  const comments = Number(video.statistics?.commentCount || 0)
  if (views === 0) return 0
  return (comments / views) * 100
}

export default function VideoCompareMetrics({ leftVideo, rightVideo }: VideoCompareMetricsProps) {
  const leftStats = leftVideo.statistics
  const rightStats = rightVideo.statistics

  const leftEngagement = calculateEngagementRate(leftVideo)
  const rightEngagement = calculateEngagementRate(rightVideo)
  const leftLikeRate = calculateLikeRate(leftVideo)
  const rightLikeRate = calculateLikeRate(rightVideo)
  const leftCommentRate = calculateCommentRate(leftVideo)
  const rightCommentRate = calculateCommentRate(rightVideo)

  // Comparison data for charts
  const comparisonData = [
    {
      metric: 'Views',
      left: Number(leftStats?.viewCount || 0),
      right: Number(rightStats?.viewCount || 0),
    },
    {
      metric: 'Likes',
      left: Number(leftStats?.likeCount || 0),
      right: Number(rightStats?.likeCount || 0),
    },
    {
      metric: 'Comments',
      left: Number(leftStats?.commentCount || 0),
      right: Number(rightStats?.commentCount || 0),
    },
  ]

  // Detailed metrics
  const metrics = [
    {
      name: 'Views',
      left: Number(leftStats?.viewCount || 0),
      right: Number(rightStats?.viewCount || 0),
      format: (n: number) => formatNumber(n),
      icon: '👁️',
    },
    {
      name: 'Likes',
      left: Number(leftStats?.likeCount || 0),
      right: Number(rightStats?.likeCount || 0),
      format: (n: number) => formatNumber(n),
      icon: '👍',
    },
    {
      name: 'Comments',
      left: Number(leftStats?.commentCount || 0),
      right: Number(rightStats?.commentCount || 0),
      format: (n: number) => formatNumber(n),
      icon: '💬',
    },
    {
      name: 'Engagement Rate',
      left: leftEngagement,
      right: rightEngagement,
      format: (n: number) => n.toFixed(2) + '%',
      icon: '📊',
      isPercentage: true,
    },
    {
      name: 'Like Rate',
      left: leftLikeRate,
      right: rightLikeRate,
      format: (n: number) => n.toFixed(2) + '%',
      icon: '❤️',
      isPercentage: true,
    },
    {
      name: 'Comment Rate',
      left: leftCommentRate,
      right: rightCommentRate,
      format: (n: number) => n.toFixed(3) + '%',
      icon: '💭',
      isPercentage: true,
    },
    {
      name: 'Likes/View Ratio',
      left: leftLikeRate / 100,
      right: rightLikeRate / 100,
      format: (n: number) => n.toFixed(4),
      icon: '⚖️',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Winner Summary */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Winner</h3>
        <div className="grid grid-cols-3 gap-4">
          {['Views', 'Likes', 'Engagement Rate'].map((metricName) => {
            const metric = metrics.find(m => m.name === metricName)
            if (!metric) return null

            const winner = metric.left > metric.right ? 'left' : metric.right > metric.left ? 'right' : 'tie'
            const diff = Math.abs(metric.left - metric.right)
            const diffPercent = metric.left > 0
              ? ((diff / Math.max(metric.left, metric.right)) * 100).toFixed(0)
              : '0'

            return (
              <div key={metric.name} className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl mb-1">{metric.icon}</div>
                <div className="text-sm text-gray-500 mb-1">{metric.name}</div>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-bold text-blue-600">{metric.format(metric.left)}</span>
                  <span className="text-gray-400">vs</span>
                  <span className="font-bold text-red-600">{metric.format(metric.right)}</span>
                </div>
                {winner !== 'tie' && (
                  <div className={`text-xs mt-1 ${winner === 'left' ? 'text-blue-600' : 'text-red-600'}`}>
                    Video {winner === 'left' ? 'A' : 'B'} wins by {diffPercent}%
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Detailed Comparison */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Detailed Metrics</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {metrics.map((metric) => {
            const maxValue = Math.max(metric.left, metric.right) || 1
            const leftPercent = (metric.left / maxValue) * 100
            const rightPercent = (metric.right / maxValue) * 100
            const winner = metric.left > metric.right ? 'left' : metric.right > metric.left ? 'right' : 'tie'

            return (
              <div key={metric.name} className="px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span>{metric.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{metric.name}</span>
                  </div>
                  {winner !== 'tie' && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      winner === 'left' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                    }`}>
                      Video {winner === 'left' ? 'A' : 'B'} Wins
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {/* Video A Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-600 font-medium">Video A</span>
                      <span className="font-bold">{metric.format(metric.left)}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${leftPercent}%` }}
                      />
                    </div>
                  </div>
                  {/* Video B Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-red-600 font-medium">Video B</span>
                      <span className="font-bold">{metric.format(metric.right)}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full transition-all"
                        style={{ width: `${rightPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Visualization Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Visual Comparison</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ left: 30, right: 30, top: 10, bottom: 10 }}>
              <XAxis dataKey="metric" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => formatNumber(v)} />
              <Tooltip formatter={(v) => formatNumber(Number(v))} />
              <Bar dataKey="left" name="Video A" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="right" name="Video B" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600">Video A</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600">Video B</span>
          </div>
        </div>
      </div>

      {/* Video Info Comparison */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Video Details</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Video A Details */}
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <h4 className="font-medium text-blue-900 mb-3">Video A</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Channel</span>
                <span className="font-medium">{leftVideo.snippet?.channelTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Published</span>
                <span className="font-medium">
                  {new Date(leftVideo.snippet?.publishedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Category</span>
                <span className="font-medium">{leftVideo.snippet?.categoryId || 'N/A'}</span>
              </div>
            </div>
          </div>
          {/* Video B Details */}
          <div className="p-4 bg-red-50 rounded-xl border border-red-100">
            <h4 className="font-medium text-red-900 mb-3">Video B</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Channel</span>
                <span className="font-medium">{rightVideo.snippet?.channelTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Published</span>
                <span className="font-medium">
                  {new Date(rightVideo.snippet?.publishedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Category</span>
                <span className="font-medium">{rightVideo.snippet?.categoryId || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Actions */}
      <div className="bg-gradient-to-br from-slate-50 to-amber-50 rounded-2xl border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">How To Use This Result</h3>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="font-semibold text-gray-900 mb-2">Copy the winner’s strength</div>
            <p className="text-gray-600">If one video wins on engagement, study its promise, pacing, and viewer payoff before copying only the topic.</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="font-semibold text-gray-900 mb-2">Test packaging separately</div>
            <p className="text-gray-600">A view winner and an engagement winner may be different. Treat title-thumbnail packaging and content satisfaction as separate tests.</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="font-semibold text-gray-900 mb-2">Validate with more examples</div>
            <p className="text-gray-600">Do not generalize from one match-up. Compare 3-5 similar videos in the same niche before turning this into a repeatable content rule.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
