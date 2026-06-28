'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface ChannelCompareMetricsProps {
  leftChannel: any
  rightChannel: any
  leftVideos: any[]
  rightVideos: any[]
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
  return totalEngagement / videos.length
}

export default function ChannelCompareMetrics({
  leftChannel,
  rightChannel,
  leftVideos,
  rightVideos,
}: ChannelCompareMetricsProps) {
  const leftStats = leftChannel.statistics
  const rightStats = rightChannel.statistics

  const leftEngagement = calculateEngagementRate(leftVideos)
  const rightEngagement = calculateEngagementRate(rightVideos)

  const leftAvgViews = leftVideos.length
    ? leftVideos.reduce((sum, v) => sum + Number(v.statistics?.viewCount || 0), 0) / leftVideos.length
    : 0
  const rightAvgViews = rightVideos.length
    ? rightVideos.reduce((sum, v) => sum + Number(v.statistics?.viewCount || 0), 0) / rightVideos.length
    : 0

  // Comparison data for charts
  const comparisonData = [
    {
      metric: 'Subscribers',
      left: Number(leftStats?.subscriberCount || 0),
      right: Number(rightStats?.subscriberCount || 0),
    },
    {
      metric: 'Total Views',
      left: Number(leftStats?.viewCount || 0),
      right: Number(rightStats?.viewCount || 0),
    },
    {
      metric: 'Videos',
      left: Number(leftStats?.videoCount || 0),
      right: Number(rightStats?.videoCount || 0),
    },
    {
      metric: 'Avg Views',
      left: leftAvgViews,
      right: rightAvgViews,
    },
  ]

  // Calculate relative strengths
  const metrics = [
    {
      name: 'Subscribers',
      left: Number(leftStats?.subscriberCount || 0),
      right: Number(rightStats?.subscriberCount || 0),
      format: (n: number) => formatNumber(n),
    },
    {
      name: 'Total Views',
      left: Number(leftStats?.viewCount || 0),
      right: Number(rightStats?.viewCount || 0),
      format: (n: number) => formatNumber(n),
    },
    {
      name: 'Video Count',
      left: Number(leftStats?.videoCount || 0),
      right: Number(rightStats?.videoCount || 0),
      format: (n: number) => formatNumber(n),
    },
    {
      name: 'Avg Views/Video',
      left: leftAvgViews,
      right: rightAvgViews,
      format: (n: number) => formatNumber(Math.round(n)),
    },
    {
      name: 'Engagement Rate',
      left: leftEngagement,
      right: rightEngagement,
      format: (n: number) => n.toFixed(2) + '%',
      isPercentage: true,
    },
    {
      name: 'Views/Subscriber',
      left: leftAvgViews / Math.max(1, Number(leftStats?.subscriberCount || 1)) * 1000,
      right: rightAvgViews / Math.max(1, Number(rightStats?.subscriberCount || 1)) * 1000,
      format: (n: number) => n.toFixed(1) + 'x',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Winner Summary */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Head-to-Head Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          {metrics.slice(0, 3).map((metric) => {
            const winner = metric.left > metric.right ? 'left' : metric.right > metric.left ? 'right' : 'tie'
            const diff = Math.abs(metric.left - metric.right)
            const diffPercent = metric.left > 0
              ? ((diff / Math.max(metric.left, metric.right)) * 100).toFixed(0)
              : '0'

            return (
              <div key={metric.name} className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-sm text-gray-500 mb-1">{metric.name}</div>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-bold text-blue-600">{metric.format(metric.left)}</span>
                  <span className="text-gray-400">vs</span>
                  <span className="font-bold text-red-600">{metric.format(metric.right)}</span>
                </div>
                {winner !== 'tie' && (
                  <div className={`text-xs mt-1 ${winner === 'left' ? 'text-blue-600' : 'text-red-600'}`}>
                    {winner === 'left' ? 'Channel A' : 'Channel B'} leads by {diffPercent}%
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Detailed Comparison Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Detailed Metrics Comparison</h3>
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
                  <span className="text-sm font-medium text-gray-700">{metric.name}</span>
                  {winner !== 'tie' && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      winner === 'left' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {winner === 'left' ? 'Channel A Wins' : 'Channel B Wins'}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {/* Channel A Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-600 font-medium">Channel A</span>
                      <span className="font-bold">{metric.format(metric.left)}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${leftPercent}%` }}
                      />
                    </div>
                  </div>
                  {/* Channel B Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-red-600 font-medium">Channel B</span>
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
            <BarChart data={comparisonData} layout="vertical" margin={{ left: 80, right: 30, top: 10, bottom: 10 }}>
              <XAxis type="number" tickFormatter={(v) => formatNumber(v)} />
              <YAxis dataKey="metric" type="category" width={70} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => formatNumber(Number(v))} />
              <Bar dataKey="left" name="Channel A" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              <Bar dataKey="right" name="Channel B" fill="#ef4444" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600">Channel A</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600">Channel B</span>
          </div>
        </div>
      </div>

      {/* Recent Videos Comparison */}
      {leftVideos.length > 0 && rightVideos.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Videos Comparison</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Channel A Recent Videos */}
            <div>
              <h4 className="text-sm font-medium text-blue-600 mb-3">Channel A Latest</h4>
              <div className="space-y-3">
                {leftVideos.slice(0, 3).map((video: any) => (
                  <div key={video.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={video.snippet?.thumbnails?.default?.url}
                      alt={video.snippet?.title}
                      className="w-20 h-14 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">{video.snippet?.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatNumber(video.statistics?.viewCount)} views
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Channel B Recent Videos */}
            <div>
              <h4 className="text-sm font-medium text-red-600 mb-3">Channel B Latest</h4>
              <div className="space-y-3">
                {rightVideos.slice(0, 3).map((video: any) => (
                  <div key={video.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={video.snippet?.thumbnails?.default?.url}
                      alt={video.snippet?.title}
                      className="w-20 h-14 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">{video.snippet?.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatNumber(video.statistics?.viewCount)} views
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Comparison Actions */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">What To Do With This Comparison</h3>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="font-semibold text-gray-900 mb-2">Study the efficiency winner</div>
            <p className="text-gray-600">If a smaller channel gets stronger average views per upload, its topic choice or packaging may be more repeatable than the biggest player.</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="font-semibold text-gray-900 mb-2">Separate scale from strategy</div>
            <p className="text-gray-600">The largest channel is not always the best model. Prioritize formats and posting patterns you can realistically replicate at your current stage.</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="font-semibold text-gray-900 mb-2">Open the winner next</div>
            <p className="text-gray-600">After comparing, inspect the winner’s recent uploads and best-performing videos to understand which exact formats or topics are carrying the result.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
