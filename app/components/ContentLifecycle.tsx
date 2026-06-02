'use client'

import { useState, useEffect } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
} from 'recharts'

interface LifecycleData {
  day: string
  views: number
  dayNumber: number
  phase: 'Day 1' | 'Week 1' | 'Month 1' | 'Stable'
}

interface ContentLifecycleProps {
  videoId: string
}

export default function ContentLifecycle({ videoId }: ContentLifecycleProps) {
  const [data, setData] = useState<LifecycleData[]>([])
  const [potential, setPotential] = useState<'viral' | 'growing' | 'steady' | 'niche'>('growing')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      // Simulated content lifecycle data
      const lifecycleData: LifecycleData[] = [
        // Day 1
        { day: 'Day 1', views: 15000, dayNumber: 1, phase: 'Day 1' },
        { day: 'Day 2', views: 35000, dayNumber: 2, phase: 'Day 1' },
        // Week 1
        { day: 'Day 3', views: 52000, dayNumber: 3, phase: 'Week 1' },
        { day: 'Day 4', views: 68000, dayNumber: 4, phase: 'Week 1' },
        { day: 'Day 5', views: 89000, dayNumber: 5, phase: 'Week 1' },
        { day: 'Day 6', views: 112000, dayNumber: 6, phase: 'Week 1' },
        { day: 'Day 7', views: 135000, dayNumber: 7, phase: 'Week 1' },
        // Month 1
        { day: 'Week 2', views: 168000, dayNumber: 14, phase: 'Month 1' },
        { day: 'Week 3', views: 215000, dayNumber: 21, phase: 'Month 1' },
        { day: 'Week 4', views: 289000, dayNumber: 28, phase: 'Month 1' },
        // Stable
        { day: 'Month 2', views: 356000, dayNumber: 60, phase: 'Stable' },
        { day: 'Month 3', views: 428000, dayNumber: 90, phase: 'Stable' },
      ]
      setData(lifecycleData)
      setPotential('viral')
      setLoading(false)
    }, 800)
  }, [videoId])

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 animate-pulse">
        <div className="h-64 bg-gray-100 rounded-lg"></div>
      </div>
    )
  }

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Day 1': return '#ef4444'
      case 'Week 1': return '#f59e0b'
      case 'Month 1': return '#3b82f6'
      case 'Stable': return '#10b981'
      default: return '#6b7280'
    }
  }

  const potentialConfig = {
    viral: { label: 'Viral Potential', color: 'bg-red-100 text-red-700', icon: '🔥' },
    growing: { label: 'Growing', color: 'bg-green-100 text-green-700', icon: '📈' },
    steady: { label: 'Steady', color: 'bg-blue-100 text-blue-700', icon: '📊' },
    niche: { label: 'Niche', color: 'bg-purple-100 text-purple-700', icon: '💎' },
  }

  const metrics = [
    { label: 'Day 1 Views', value: '15,000', growth: '+133%', phase: 'Day 1' },
    { label: 'Week 1 Total', value: '135,000', growth: '+800%', phase: 'Week 1' },
    { label: 'Month 1 Total', value: '289,000', growth: '+114%', phase: 'Month 1' },
    { label: 'Stable Estimate', value: '428,000', growth: '+48%', phase: 'Stable' },
  ]

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="text-2xl">📈</span>
          Content Lifecycle Analysis
        </h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${potentialConfig[potential].color}`}>
          {potentialConfig[potential].icon} {potentialConfig[potential].label}
        </div>
      </div>

      {/* Lifecycle Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11 }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              tick={{ fontSize: 11 }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip
              formatter={(value) => [`${Number(value).toLocaleString()} views`, 'Total Views']}
              contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <ReferenceLine x="Day 7" stroke="#f59e0b" strokeDasharray="3 3" label="Week 1" />
            <ReferenceLine x="Week 4" stroke="#3b82f6" strokeDasharray="3 3" label="Month 1" />
            <Area
              type="monotone"
              dataKey="views"
              stroke="#6366f1"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorViews)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Phase Metrics */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-500 mb-1">{metric.label}</div>
            <div className="text-lg font-bold text-gray-900">{metric.value}</div>
            <div className="text-xs text-green-600">{metric.growth}</div>
            <div
              className="text-xs mt-1 px-2 py-0.5 rounded-full inline-block"
              style={{
                backgroundColor: `${getPhaseColor(metric.phase)}20`,
                color: getPhaseColor(metric.phase),
              }}
            >
              {metric.phase}
            </div>
          </div>
        ))}
      </div>

      {/* Growth Model */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-100">
        <h4 className="font-semibold text-indigo-900 mb-3 flex items-center gap-2">
          <span>🤖</span> AI Growth Model Analysis
        </h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-indigo-700 font-medium mb-1">Day 1 Burst Factor</div>
            <div className="text-2xl font-bold text-indigo-900">2.3x</div>
            <div className="text-xs text-indigo-600">67% above similar videos</div>
          </div>
          <div>
            <div className="text-indigo-700 font-medium mb-1">Weekly Growth</div>
            <div className="text-2xl font-bold text-indigo-900">800%</div>
            <div className="text-xs text-indigo-600">Strong first week growth</div>
          </div>
          <div>
            <div className="text-indigo-700 font-medium mb-1">Long-tail Potential</div>
            <div className="text-2xl font-bold text-indigo-900">High</div>
            <div className="text-xs text-indigo-600">Expected 3 month growth</div>
          </div>
        </div>
      </div>

      {/* Predictions */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-green-500">✓</span>
          <span className="text-gray-700">Day 1 performance is excellent, viral potential detected</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-green-500">✓</span>
          <span className="text-gray-700">Week 1 growth curve is healthy, algorithm-friendly</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-blue-500">ℹ️</span>
          <span className="text-gray-700">Consider sequel content around Day 30 to capture long-tail traffic</span>
        </div>
      </div>
    </div>
  )
}
