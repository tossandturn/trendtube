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
  ComposedChart,
  Bar,
} from 'recharts'

interface TrendPoint {
  date: string
  hotRank: number
  traffic: number
  category: string
  migration: number
}

interface TrendEvolutionProps {
  keyword: string
}

export default function TrendEvolution({ keyword }: TrendEvolutionProps) {
  const [data, setData] = useState<TrendPoint[]>([])
  const [categoryShift, setCategoryShift] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      const trendData: TrendPoint[] = [
        { date: 'Day 1', hotRank: 85, traffic: 1200, category: 'Tech', migration: 0 },
        { date: 'Day 2', hotRank: 72, traffic: 3500, category: 'Tech', migration: 15 },
        { date: 'Day 3', hotRank: 45, traffic: 8900, category: 'Tech', migration: 28 },
        { date: 'Day 4', hotRank: 23, traffic: 15200, category: 'Knowledge', migration: 45 },
        { date: 'Day 5', hotRank: 15, traffic: 22800, category: 'Knowledge', migration: 62 },
        { date: 'Day 6', hotRank: 8, traffic: 35600, category: 'Education', migration: 78 },
        { date: 'Day 7', hotRank: 5, traffic: 48500, category: 'Education', migration: 85 },
        { date: 'Week 2', hotRank: 3, traffic: 89200, category: 'Trending', migration: 92 },
        { date: 'Week 3', hotRank: 2, traffic: 156000, category: 'Trending', migration: 95 },
      ]
      setData(trendData)
      setCategoryShift('Tech → Knowledge → Education → Trending')
      setLoading(false)
    }, 800)
  }, [keyword])

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 animate-pulse">
        <div className="h-64 bg-gray-100 rounded-lg"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          Trend Evolution Tracker
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Category Traffic Migration:</span>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
            {categoryShift}
          </span>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis
              yAxisId="left"
              orientation="left"
              tick={{ fontSize: 11 }}
              reversed
              label={{ value: 'Hot Rank', angle: -90, position: 'insideLeft' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
              label={{ value: 'Traffic', angle: 90, position: 'insideRight' }}
            />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="traffic"
              fill="#6366f1"
              fillOpacity={0.2}
              stroke="#6366f1"
              strokeWidth={2}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="hotRank"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ fill: '#ef4444', r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Category Timeline */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Category Heat Evolution</h4>
        <div className="flex items-center gap-1">
          {['Tech', 'Knowledge', 'Education', 'Trending'].map((cat, index) => (
            <div key={cat} className="flex items-center">
              <div
                className="px-3 py-1.5 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: `hsl(${220 + index * 20}, 70%, ${90 - index * 10}%)`,
                  color: `hsl(${220 + index * 20}, 80%, 30%)`,
                }}
              >
                {cat}
              </div>
              {index < 3 && (
                <div className="mx-2 flex items-center">
                  <span className="text-gray-400">→</span>
                  <span className="text-xs text-gray-500 ml-1">+{(index + 1) * 25}%</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Migration Analysis */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-xs text-blue-600 mb-1">Initial Category</div>
          <div className="text-lg font-bold text-blue-900">Tech & Digital</div>
          <div className="text-xs text-blue-600">Seed Users: Tech Enthusiasts</div>
        </div>
        <div className="bg-indigo-50 rounded-lg p-4">
          <div className="text-xs text-indigo-600 mb-1">Spread Category</div>
          <div className="text-lg font-bold text-indigo-900">Knowledge</div>
          <div className="text-xs text-indigo-600">Breaking Audience: Learners</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-xs text-purple-600 mb-1">Viral Category</div>
          <div className="text-lg font-bold text-purple-900">Site-wide Trending</div>
          <div className="text-xs text-purple-600">Peak Traffic: 156K</div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
        <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
          <span>💡</span> Trend Evolution Insights
        </h4>
        <ul className="space-y-2 text-sm text-amber-800">
          <li className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span>Content spread from Tech to Knowledge category, successfully breaking audience barriers</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span>Day 3-5 is the critical turning point, traffic migrates to Knowledge category</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">ℹ️</span>
            <span>Recommend publishing sequel before Week 2 to capture traffic from Trending category</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
