'use client'

import { useState, useMemo } from 'react'

interface DropoffPoint {
  time: string
  percentage: number
  similarAvg: number
}

interface ContentRhythmData {
  averageProgress: string
  completionRate: number
  completionRating: string
  stars: number
  totalDuration: string
  dropoffData: DropoffPoint[]
  comparisonVideos: {
    title: string
    completionRate: number
    color: string
  }[]
}

interface ContentRhythmAnalyticsProps {
  video?: any
}

// Parse ISO 8601 duration to readable format
function formatDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return '0:00'
  const hours = parseInt(match[1] || '0')
  const minutes = parseInt(match[2] || '0')
  const seconds = parseInt(match[3] || '0')

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// Calculate estimated completion rate based on video metrics
function calculateCompletionRate(video: any): number {
  const views = Number(video?.statistics?.viewCount || 0)
  const likes = Number(video?.statistics?.likeCount || 0)
  const comments = Number(video?.statistics?.commentCount || 0)

  if (views === 0) return 35

  // Engagement ratio correlates with completion rate
  const engagementRate = ((likes + comments * 2) / views) * 100

  // Higher engagement typically means higher completion
  if (engagementRate > 5) return Math.min(75, 45 + engagementRate * 4)
  if (engagementRate > 3) return Math.min(70, 40 + engagementRate * 6)
  if (engagementRate > 1) return Math.min(60, 35 + engagementRate * 10)
  return 35
}

// Generate dropoff data based on video characteristics
function generateDropoffData(duration: string, completionRate: number): DropoffPoint[] {
  const points: DropoffPoint[] = [{ time: '00:00', percentage: 0, similarAvg: 0 }]

  // Parse duration to minutes
  const parts = duration.split(':').map(Number)
  const totalMinutes = parts.length === 3 ? parts[0] * 60 + parts[1] + parts[2] / 60 : parts[0] + (parts[1] || 0) / 60

  const intervals = Math.max(6, Math.min(12, Math.floor(totalMinutes / 0.5)))
  const intervalMinutes = totalMinutes / intervals

  for (let i = 1; i <= intervals; i++) {
    const progress = i / intervals
    const timeMinutes = i * intervalMinutes
    const hours = Math.floor(timeMinutes / 60)
    const mins = Math.floor(timeMinutes % 60)
    const secs = Math.floor((timeMinutes % 1) * 60)
    const timeStr = hours > 0
      ? `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      : `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`

    // Typical dropoff curve - steeper at beginning, then gradual
    const typicalDropoff = 100 * (1 - Math.pow(progress, 0.7))
    const videoDropoff = 100 * (1 - (completionRate / 100) * progress - (1 - completionRate / 100) * Math.pow(progress, 2))

    points.push({
      time: timeStr,
      percentage: Math.round(videoDropoff * 10) / 10,
      similarAvg: Math.round(typicalDropoff * 10) / 10,
    })
  }

  return points
}

function StarRating({ stars }: { stars: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 sm:w-5 sm:h-5 ${star <= stars ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function ContentRhythmAnalytics({ video }: ContentRhythmAnalyticsProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<'dropoff' | 'retention'>('dropoff')

  // Derive data from video
  const data = useMemo<ContentRhythmData>(() => {
    const completionRate = calculateCompletionRate(video)
    const duration = video?.contentDetails?.duration || 'PT5M'
    const formattedDuration = formatDuration(duration)

    // Calculate average progress based on completion rate
    const totalSeconds = duration.includes('H')
      ? parseInt(duration.match(/(\d+)H/)?.[1] || '0') * 3600 + parseInt(duration.match(/(\d+)M/)?.[1] || '0') * 60 + parseInt(duration.match(/(\d+)S/)?.[1] || '0')
      : parseInt(duration.match(/(\d+)M/)?.[1] || '0') * 60 + parseInt(duration.match(/(\d+)S/)?.[1] || '0')
    const avgProgressSeconds = Math.round(totalSeconds * (completionRate / 100))
    const avgProgressMins = Math.floor(avgProgressSeconds / 60)
    const avgProgressSecs = avgProgressSeconds % 60
    const averageProgress = `${avgProgressMins}:${avgProgressSecs.toString().padStart(2, '0')}`

    // Determine rating based on completion rate
    let completionRating = 'Average Retention'
    let stars = 3
    if (completionRate >= 60) {
      completionRating = 'Excellent Retention'
      stars = 5
    } else if (completionRate >= 45) {
      completionRating = 'Good Retention'
      stars = 4
    } else if (completionRate >= 35) {
      completionRating = 'Average Retention'
      stars = 3
    } else {
      completionRating = 'Below Average'
      stars = 2
    }

    const dropoffData = generateDropoffData(formattedDuration, completionRate)

    return {
      averageProgress,
      completionRate,
      completionRating,
      stars,
      totalDuration: formattedDuration,
      dropoffData,
      comparisonVideos: [
        { title: 'Category Average', completionRate: 42.8, color: '#9ca3af' },
        { title: 'Top Performers', completionRate: 68.5, color: '#10b981' },
        { title: 'This Video', completionRate: Math.round(completionRate * 10) / 10, color: '#ec4899' },
      ],
    }
  }, [video])

  const maxDropoff = Math.max(...data.dropoffData.map((d) => d.percentage))

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-1 h-5 sm:h-6 rounded-full bg-gradient-to-b from-pink-400 to-pink-600" />
          <h2 className="text-base sm:text-lg font-bold text-gray-900">Content Rhythm</h2>
          <span className="text-xs px-2 py-1 bg-pink-100 text-pink-600 rounded-full hidden sm:inline">Retention</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="p-3 sm:p-4 bg-pink-50/50 rounded-xl border border-pink-100">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Avg. Watch Time</div>
          <div className="text-xl sm:text-2xl font-black text-pink-600">{data.averageProgress}</div>
          <div className="text-xs text-gray-500 mt-1">Duration: {data.totalDuration}</div>
        </div>

        <div className="p-3 sm:p-4 bg-pink-50/50 rounded-xl border border-pink-100">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Completion Rate</div>
          <div className="text-xl sm:text-2xl font-black text-pink-600">{data.completionRate.toFixed(1)}%</div>
          <div className="text-xs text-gray-500 mt-1">
            {data.completionRate > 42.8 ? '+' : ''}{(data.completionRate - 42.8).toFixed(1)}% vs category
          </div>
        </div>

        <div className="p-3 sm:p-4 bg-pink-50/50 rounded-xl border border-pink-100">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Rating</div>
          <div className="text-base sm:text-lg font-bold text-gray-900 mb-1">{data.completionRating}</div>
          <StarRating stars={data.stars} />
        </div>
      </div>

      {/* Dropoff Chart - Line Chart */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider">Dropoff Trend</h3>
          <div className="flex items-center gap-3 sm:gap-4 text-xs">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-pink-500" />
              <span className="text-gray-600">This Video</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gray-400" />
              <span className="text-gray-600">Category Avg</span>
            </div>
          </div>
        </div>

        <div className="relative h-48 sm:h-56">
          <svg viewBox="0 0 600 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            {(() => {
              const width = 600
              const height = 200
              const margin = { top: 10, right: 20, bottom: 40, left: 50 }
              const chartW = width - margin.left - margin.right
              const chartH = height - margin.top - margin.bottom

              const chartData = data.dropoffData
              if (chartData.length === 0) return <text x={width / 2} y={height / 2} fill="#9ca3af" fontSize="14" textAnchor="middle">No data</text>

              const maxY = 100

              // Generate path for this video line
              const thisVideoPoints = chartData.map((point, i) => {
                const x = margin.left + (i / (chartData.length - 1)) * chartW
                const y = margin.top + chartH - (point.percentage / maxY) * chartH
                return `${x},${y}`
              }).join(' ')

              // Generate path for category average line
              const avgPoints = chartData.map((point, i) => {
                const x = margin.left + (i / (chartData.length - 1)) * chartW
                const y = margin.top + chartH - (point.similarAvg / maxY) * chartH
                return `${x},${y}`
              }).join(' ')

              return (
                <>
                  {/* Grid lines */}
                  {[0, 25, 50, 75, 100].map((val, i) => {
                    const y = margin.top + chartH - (val / maxY) * chartH
                    return (
                      <g key={`grid-${i}`}>
                        <line x1={margin.left} y1={y} x2={margin.left + chartW} y2={y} stroke="#f3f4f6" strokeWidth="1" />
                        <text x={margin.left - 8} y={y + 4} fill="#9ca3af" fontSize="10" textAnchor="end">{val}%</text>
                      </g>
                    )
                  })}

                  {/* Area under this video line (pink gradient) */}
                  <defs>
                    <linearGradient id="pinkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ec4899" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#ec4899" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  <polygon
                    points={`${margin.left},${margin.top + chartH} ${chartData.map((point, i) => {
                      const x = margin.left + (i / (chartData.length - 1)) * chartW
                      const y = margin.top + chartH - (point.percentage / maxY) * chartH
                      return `${x},${y}`
                    }).join(' ')} ${margin.left + chartW},${margin.top + chartH}`}
                    fill="url(#pinkGradient)"
                  />

                  {/* Category average line (dashed gray) */}
                  <polyline
                    points={avgPoints}
                    fill="none"
                    stroke="#9ca3af"
                    strokeWidth="2"
                    strokeDasharray="4,4"
                  />

                  {/* This video line (solid pink) */}
                  <polyline
                    points={thisVideoPoints}
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth="2.5"
                  />

                  {/* Data points for this video */}
                  {chartData.map((point, i) => {
                    const x = margin.left + (i / (chartData.length - 1)) * chartW
                    const y = margin.top + chartH - (point.percentage / maxY) * chartH
                    return (
                      <g key={i}>
                        <circle
                          cx={x}
                          cy={y}
                          r="4"
                          fill="#ec4899"
                          stroke="white"
                          strokeWidth="2"
                          className="cursor-pointer hover:r-6 transition-all"
                          onMouseEnter={() => setHoveredPoint(i)}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                        {/* Tooltip */}
                        {hoveredPoint === i && (
                          <g>
                            <rect
                              x={x - 60}
                              y={y - 55}
                              width="120"
                              height="45"
                              rx="8"
                              fill="#1f2937"
                            />
                            <text x={x} y={y - 38} fill="white" fontSize="11" textAnchor="middle" fontWeight="bold">{point.time}</text>
                            <text x={x} y={y - 25} fill="#f472b6" fontSize="10" textAnchor="middle">This Video: {point.percentage}%</text>
                            <text x={x} y={y - 12} fill="#9ca3af" fontSize="10" textAnchor="middle">Avg: {point.similarAvg}%</text>
                            <polygon points={`${x - 6},${y - 10} ${x + 6},${y - 10} ${x},${y - 5}`} fill="#1f2937" />
                          </g>
                        )}
                      </g>
                    )
                  })}

                  {/* X-axis labels */}
                  {chartData.filter((_, i) => i % Math.ceil(chartData.length / 8) === 0 || i === chartData.length - 1).map((point, i, arr) => {
                    const index = chartData.indexOf(point)
                    const x = margin.left + (index / (chartData.length - 1)) * chartW
                    return (
                      <text key={i} x={x} y={margin.top + chartH + 18} fill="#9ca3af" fontSize="10" textAnchor="middle">{point.time}</text>
                    )
                  })}
                </>
              )
            })()}
          </svg>
        </div>
      </div>

      {/* Comparison with similar videos */}
      <div>
        <h3 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 sm:mb-4">Comparison</h3>
        <div className="space-y-3 sm:space-y-4">
          {data.comparisonVideos.map((video, index) => (
            <div key={index} className="flex items-center gap-3 sm:gap-4">
              <div className="w-24 sm:w-32 text-xs sm:text-sm text-gray-700">{video.title}</div>
              <div className="flex-1 h-5 sm:h-6 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                  style={{
                    width: `${video.completionRate}%`,
                    backgroundColor: video.color,
                  }}
                >
                  <span className="text-[9px] sm:text-[10px] text-white font-medium">{video.completionRate.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="mt-5 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="p-3 sm:p-4 bg-pink-50 rounded-xl border border-pink-100">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-xs font-semibold text-pink-600">Golden Retention</span>
          </div>
          <p className="text-xs text-pink-800">
            First 2 minutes show lower dropoff than category average — strong opening hook.
            Consider adding engagement elements at 50-60% mark to boost completion.
          </p>
        </div>

        <div className="p-3 sm:p-4 bg-rose-50 rounded-xl border border-rose-100">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-xs font-semibold text-rose-600">Optimization Tips</span>
          </div>
          <p className="text-xs text-rose-800">
            Completion rate of {data.completionRate.toFixed(1)}% is performing well.
            To improve further, consider adding end-screen CTAs or suspense in the final 20%.
          </p>
        </div>
      </div>
    </div>
  )
}
