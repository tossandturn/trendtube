'use client'

import { useState, useMemo } from 'react'

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
  video?: any
}

const defaultColors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#6b7280']

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toLocaleString()
}

export default function TrafficSourceChart({ video }: TrafficSourceChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Derive data from video statistics
  const data = useMemo<TrafficSourceData>(() => {
    const totalViews = Number(video?.statistics?.viewCount || 0)

    if (totalViews === 0) {
      return {
        totalViews: 0,
        sources: [
          { name: 'Mobile', nameEn: 'Mobile', percentage: 0, views: 0, color: defaultColors[0] },
          { name: 'Desktop', nameEn: 'Desktop', percentage: 0, views: 0, color: defaultColors[1] },
          { name: 'Tablet', nameEn: 'Tablet', percentage: 0, views: 0, color: defaultColors[2] },
          { name: 'TV', nameEn: 'TV', percentage: 0, views: 0, color: defaultColors[3] },
          { name: 'Other', nameEn: 'Other', percentage: 0, views: 0, color: defaultColors[4] },
        ]
      }
    }

    // Estimate traffic sources based on video characteristics
    // Mobile typically dominates (60-70%), followed by Desktop (15-25%), TV (5-15%), etc.
    const title = video?.snippet?.title?.toLowerCase() || ''
    const description = video?.snippet?.description?.toLowerCase() || ''

    // Shorts/content optimized for mobile gets more mobile traffic
    const isShort = title.includes('short') || title.includes('#shorts') || title.includes('shorts')
    const isTutorial = title.includes('how to') || title.includes('tutorial')
    const isGaming = title.includes('game') || title.includes('gameplay')

    // Adjust percentages based on content type
    let mobilePct = 62.5
    let desktopPct = 15.3
    let tabletPct = 8.0
    let tvPct = 6.2
    let otherPct = 8.0

    if (isShort) {
      mobilePct = 75.0
      desktopPct = 10.0
      tabletPct = 8.0
      tvPct = 4.0
      otherPct = 3.0
    } else if (isTutorial) {
      mobilePct = 55.0
      desktopPct = 25.0
      tabletPct = 8.0
      tvPct = 7.0
      otherPct = 5.0
    } else if (isGaming) {
      mobilePct = 45.0
      desktopPct = 35.0
      tabletPct = 5.0
      tvPct = 12.0
      otherPct = 3.0
    }

    // Normalize to ensure they sum to 100%
    const total = mobilePct + desktopPct + tabletPct + tvPct + otherPct
    const normalize = (val: number) => Math.round((val / total) * 100 * 10) / 10

    return {
      totalViews,
      sources: [
        { name: 'Mobile', nameEn: 'Mobile App', percentage: normalize(mobilePct), views: Math.round(totalViews * mobilePct / 100), color: defaultColors[0] },
        { name: 'Desktop', nameEn: 'Desktop Web', percentage: normalize(desktopPct), views: Math.round(totalViews * desktopPct / 100), color: defaultColors[1] },
        { name: 'Tablet', nameEn: 'Tablet', percentage: normalize(tabletPct), views: Math.round(totalViews * tabletPct / 100), color: defaultColors[2] },
        { name: 'TV', nameEn: 'Smart TV', percentage: normalize(tvPct), views: Math.round(totalViews * tvPct / 100), color: defaultColors[3] },
        { name: 'Other', nameEn: 'Embedded/Other', percentage: normalize(otherPct), views: Math.round(totalViews * otherPct / 100), color: defaultColors[4] },
      ].sort((a, b) => b.percentage - a.percentage),
    }
  }, [video])

  // Calculate donut segments
  const segments = useMemo(() => {
    let cumulativePercentage = 0
    return data.sources.map((source, index) => {
      const startAngle = (cumulativePercentage / 100) * 360
      cumulativePercentage += source.percentage
      const endAngle = (cumulativePercentage / 100) * 360

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
      }
    })
  }, [data.sources])

  const topSource = data.sources[0]
  const mobileShare = data.sources.find(s => s.name === 'Mobile')?.percentage || 0
  const desktopTvShare = data.sources.find(s => s.name === 'Desktop')?.percentage || 0

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-1 h-5 sm:h-6 rounded-full bg-gradient-to-b from-blue-400 to-blue-600" />
          <h2 className="text-base sm:text-lg font-bold text-gray-900">Traffic Sources</h2>
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full hidden sm:inline">Views</span>
        </div>
      </div>

      {/* Total Views */}
      <div className="text-center mb-5 sm:mb-6">
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Views</div>
        <div className="text-2xl sm:text-3xl font-black text-gray-900">{formatNumber(data.totalViews)}</div>
      </div>

      {/* Chart and Legend Container */}
      <div className="flex flex-col lg:flex-row items-center gap-5 sm:gap-8">
        {/* Donut Chart */}
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex-shrink-0">
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
                <span className="text-xl sm:text-2xl font-black" style={{ color: segments[hoveredIndex].color }}>
                  {segments[hoveredIndex].percentage}%
                </span>
                <span className="text-xs text-gray-500">{segments[hoveredIndex].name}</span>
              </>
            ) : (
              <>
                <span className="text-base sm:text-lg font-bold text-gray-700">Sources</span>
                <span className="text-xs text-gray-500">{data.sources.length} channels</span>
              </>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full">
          <div className="space-y-2 sm:space-y-3">
            {data.sources.map((source, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-2 sm:p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                  hoveredIndex === index ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <span
                    className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: source.color }}
                  />
                  <div>
                    <div className="font-medium text-sm text-gray-900">{source.name}</div>
                    <div className="text-xs text-gray-500 hidden sm:block">{source.nameEn}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm text-gray-900">{source.percentage}%</div>
                  <div className="text-xs text-gray-500">{formatNumber(source.views)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-5 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-3 sm:p-4 bg-blue-50 rounded-xl border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-semibold text-blue-600">Mobile First</span>
          </div>
          <p className="text-xs text-blue-800">
            {mobileShare}% of views come from mobile devices. Optimize for vertical viewing and mobile thumbnails.
          </p>
        </div>

        <div className="p-3 sm:p-4 bg-purple-50 rounded-xl border border-purple-100">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-semibold text-purple-600">Desktop + TV</span>
          </div>
          <p className="text-xs text-purple-800">
            Desktop and TV combined account for {Math.round((desktopTvShare + (data.sources.find(s => s.name === 'TV')?.percentage || 0)) * 10) / 10}% — longer content performs well here.
          </p>
        </div>

        <div className="p-3 sm:p-4 bg-green-50 rounded-xl border border-green-100">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-xs font-semibold text-green-600">Top Channel</span>
          </div>
          <p className="text-xs text-green-800">
            {topSource?.name} is your top traffic source at {topSource?.percentage}%. Consider platform-specific CTAs.
          </p>
        </div>
      </div>
    </div>
  )
}
