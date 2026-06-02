'use client'

import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  BarChart,
  Bar,
  Cell,
} from 'recharts'

interface ChannelMetrics {
  subscriberGrowth: { date: string; count: number }[]
  activityScore: number
  lastUpload: string
  uploadFrequency: string
  contentHeat: { category: string; score: number; trend: string }[]
  fanLoyalty: number
}

interface EnhancedChannelAnalyticsProps {
  channelId: string
}

export default function EnhancedChannelAnalytics({ channelId }: EnhancedChannelAnalyticsProps) {
  const [metrics, setMetrics] = useState<ChannelMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      const mockMetrics: ChannelMetrics = {
        subscriberGrowth: [
          { date: 'M1', count: 125000 },
          { date: 'M2', count: 138000 },
          { date: 'M3', count: 152000 },
          { date: 'M4', count: 171000 },
          { date: 'M5', count: 195000 },
          { date: 'M6', count: 228000 },
        ],
        activityScore: 87,
        lastUpload: '2天前',
        uploadFrequency: '每周3次',
        contentHeat: [
          { category: '科技数码', score: 92, trend: 'up' },
          { category: '知识科普', score: 78, trend: 'up' },
          { category: '生活分享', score: 65, trend: 'stable' },
          { category: '娱乐搞笑', score: 45, trend: 'down' },
          { category: '教育学习', score: 88, trend: 'up' },
        ],
        fanLoyalty: 82,
      }
      setMetrics(mockMetrics)
      setLoading(false)
    }, 800)
  }, [channelId])

  if (loading || !metrics) {
    return (
      <div className="bg-white rounded-xl p-6 animate-pulse">
        <div className="h-64 bg-gray-100 rounded-lg"></div>
      </div>
    )
  }

  const growthRate = ((metrics.subscriberGrowth[5].count - metrics.subscriberGrowth[0].count) / metrics.subscriberGrowth[0].count * 100).toFixed(1)

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="text-2xl">📊</span>
          频道深度分析
        </h3>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-xs text-blue-600 mb-1">粉丝增长率(6月)</div>
          <div className="text-2xl font-bold text-blue-900">+{growthRate}%</div>
          <div className="text-xs text-blue-600">+{((metrics.subscriberGrowth[5].count - metrics.subscriberGrowth[0].count) / 1000).toFixed(0)}K</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-xs text-green-600 mb-1">活跃度评分</div>
          <div className="text-2xl font-bold text-green-900">{metrics.activityScore}</div>
          <div className="text-xs text-green-600">{metrics.uploadFrequency}</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-xs text-purple-600 mb-1">粉丝忠诚度</div>
          <div className="text-2xl font-bold text-purple-900">{metrics.fanLoyalty}%</div>
          <div className="text-xs text-purple-600">高于同类 23%</div>
        </div>
        <div className="bg-amber-50 rounded-lg p-4">
          <div className="text-xs text-amber-600 mb-1">最近更新</div>
          <div className="text-2xl font-bold text-amber-900">{metrics.lastUpload}</div>
          <div className="text-xs text-amber-600">更新及时</div>
        </div>
      </div>

      {/* Subscriber Growth Chart */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-600 mb-3">粉丝增长趋势(6个月)</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics.subscriberGrowth}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`${Number(v).toLocaleString()}`, '粉丝数']} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Content Heat by Category */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-600 mb-3">内容分区热度分析</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics.contentHeat} layout="vertical">
              <XAxis type="number" hide />
              <YAxis
                dataKey="category"
                type="category"
                width={80}
                tick={{ fontSize: 11 }}
              />
              <Tooltip formatter={(v) => [`热度: ${v}`, '']} />
              <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                {metrics.contentHeat.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.trend === 'up'
                        ? '#10b981'
                        : entry.trend === 'down'
                        ? '#ef4444'
                        : '#f59e0b'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Content Heat Insights */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">分区热度洞察</h4>
        <div className="grid grid-cols-2 gap-4">
          {metrics.contentHeat.slice(0, 4).map((item) => (
            <div key={item.category} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{item.category}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{item.score}</span>
                <span
                  className={`text-xs ${
                    item.trend === 'up'
                      ? 'text-green-600'
                      : item.trend === 'down'
                      ? 'text-red-600'
                      : 'text-yellow-600'
                  }`}
                >
                  {item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
