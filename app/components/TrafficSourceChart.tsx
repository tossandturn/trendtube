'use client'

import { useState } from 'react'

interface TrafficSource {
  name: string
  nameEn: string
  percentage: number
  views: number
  color: string
}

interface TrafficSourceData {
  totalViews: number
  sources: TrafficSource[]
}

interface TrafficSourceChartProps {
  data?: TrafficSourceData
}

const defaultData: TrafficSourceData = {
  totalViews: 2847293,
  sources: [
    { name: '移动端', nameEn: 'Mobile', percentage: 62.5, views: 1779558, color: '#3b82f6' },
    { name: 'H5', nameEn: 'H5 Web', percentage: 15.3, views: 435636, color: '#10b981' },
    { name: 'PC端', nameEn: 'PC', percentage: 12.8, views: 364454, color: '#f59e0b' },
    { name: 'TV端', nameEn: 'TV', percentage: 6.2, views: 176532, color: '#8b5cf6' },
    { name: '其他', nameEn: 'Other', percentage: 3.2, views: 91113, color: '#6b7280' },
  ],
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toLocaleString()
}

export default function TrafficSourceChart({ data = defaultData }: TrafficSourceChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Calculate donut segments
  const totalPercentage = data.sources.reduce((sum, s) => sum + s.percentage, 0)
  let cumulativePercentage = 0

  const segments = data.sources.map((source, index) => {
    const startAngle = (cumulativePercentage / 100) * 360
    cumulativePercentage += source.percentage
    const endAngle = (cumulativePercentage / 100) * 360

    // Calculate SVG arc path
    const startRad = (startAngle - 90) * (Math.PI / 180)
    const endRad = (endAngle - 90) * (Math.PI / 180)

    const x1 = 50 + 35 * Math.cos(startRad)
    const y1 = 50 + 35 * Math.sin(startRad)
    const x2 = 50 + 35 * Math.cos(endRad)
    const y2 = 50 + 35 * Math.sin(endRad)

    const largeArc = source.percentage > 50 ? 1 : 0

    return {
      ...source,
      index,
      path: `M 50 50 L ${x1} ${y1} A 35 35 0 ${largeArc} 1 ${x2} ${y2} Z`,
      startAngle,
      endAngle,
    }
  })

  return (
    <div className="glass-panel neon-border rounded-2xl p-5 sm:p-6 glow-hover">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-400 to-blue-600" />
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">播放量来源</h2>
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">流量分析</span>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>

      {/* Total Views */}
      <div className="text-center mb-6">
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">总播放量</div>
        <div className="text-3xl font-black text-gray-900 data-mono">{formatNumber(data.totalViews)}</div>
      </div>

      {/* Chart and Legend Container */}
      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Donut Chart */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="20"
            />

            {/* Segments */}
            {segments.map((segment) => (
              <path
                key={segment.index}
                d={segment.path}
                fill={segment.color}
                className={`transition-all duration-300 cursor-pointer ${
                  hoveredIndex === segment.index ? 'opacity-100' : hoveredIndex !== null ? 'opacity-60' : 'opacity-100'
                }`}
                onMouseEnter={() => setHoveredIndex(segment.index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  filter: hoveredIndex === segment.index ? 'brightness(1.1)' : 'none',
                }}
              />
            ))}

            {/* Inner white circle for donut effect */}
            <circle
              cx="50"
              cy="50"
              r="22"
              fill="white"
            />
          </svg>

          {/* Center info */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {hoveredIndex !== null ? (
              <>
                <span className="text-2xl font-black" style={{ color: segments[hoveredIndex].color }}>
                  {segments[hoveredIndex].percentage}%
                </span>
                <span className="text-xs text-gray-500">{segments[hoveredIndex].name}</span>
              </>
            ) : (
              <>
                <span className="text-lg font-bold text-gray-700">来源分布</span>
                <span className="text-xs text-gray-500">5 个渠道</span>
              </>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full">
          <div className="space-y-3">
            {data.sources.map((source, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                  hoveredIndex === index ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: source.color }}
                  />
                  <div>
                    <div className="font-medium text-gray-900">{source.name}</div>
                    <div className="text-xs text-gray-500">{source.nameEn}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{source.percentage}%</div>
                  <div className="text-xs text-gray-500">{formatNumber(source.views)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-semibold text-blue-600">移动端主导</span>
          </div>
          <p className="text-xs text-blue-800">
            {data.sources[0].percentage}% 的流量来自移动设备，建议优化竖屏观看体验。
          </p>
        </div>

        <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-semibold text-purple-600">大屏增长</span>
          </div>
          <p className="text-xs text-purple-800">
            TV端和PC端合计占比 {data.sources[2].percentage + data.sources[3].percentage}%，适合长视频内容。
          </p>
        </div>

        <div className="p-4 bg-green-50 rounded-xl border border-green-100">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-xs font-semibold text-green-600">H5潜力</span>
          </div>
          <p className="text-xs text-green-800">
            H5端占比 {data.sources[1].percentage}%，社交媒体分享效果良好。
          </p>
        </div>
      </div>
    </div>
  )
}
