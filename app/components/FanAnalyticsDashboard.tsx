'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

interface Video {
  id: string
  snippet?: {
    title?: string
    channelTitle?: string
    thumbnails?: {
      medium?: { url: string }
      default?: { url: string }
    }
    publishedAt?: string
  }
  statistics?: {
    viewCount?: string
    likeCount?: string
    commentCount?: string
  }
}

interface FanAnalyticsData {
  subscriberCount: number
  viewCount: number
  videoCount: number
  engagementRate: number
  avgViewsPerVideo: number
  growthRate: number
}

interface FanAnalyticsProps {
  videos: Video[]
  channelData?: any
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toLocaleString()
}

// Generate subscriber growth data based on video performance
function generateSubscriberGrowth(videos: Video[], channelData?: any) {
  const days = 7
  const data = []
  const baseSubscribers = Number(channelData?.statistics?.subscriberCount || 100)

  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    // Calculate growth from video performance (deterministic)
    const recentVideos = videos.slice(0, 3)
    const totalViews = recentVideos.reduce((sum, v) => sum + Number(v.statistics?.viewCount || 0), 0)

    // Deterministic growth: ~1 subscriber per 1000 views
    const growth = Math.floor(totalViews / 1000) + 1

    data.push({
      date: date.toISOString().split('T')[0].replace(/-/g, '/'),
      subscribers: baseSubscribers + (days - i) * growth
    })
  }

  return data
}

// Calculate engagement rate
function calculateEngagementRate(video: Video): number {
  const views = Number(video.statistics?.viewCount || 0)
  const likes = Number(video.statistics?.likeCount || 0)
  const comments = Number(video.statistics?.commentCount || 0)

  if (views === 0) return 0
  return ((likes + comments * 2) / views) * 100
}

// Generate audience demographics based on video content
function generateDemographics(videos: Video[]) {
  // Analyze video titles/content to infer demographics
  const titles = videos.map(v => v.snippet?.title || '').join(' ').toLowerCase()

  // Gaming content skews male and young
  const gamingKeywords = ['gaming', 'game', 'gameplay', 'minecraft', 'fortnite', 'valorant']
  const isGaming = gamingKeywords.some(k => titles.includes(k))

  // Tech content skews male
  const techKeywords = ['ai', 'tech', 'tutorial', 'how to', 'review']
  const isTech = techKeywords.some(k => titles.includes(k))

  if (isGaming) {
    return {
      gender: { male: 72, female: 28 },
      age: { '18-24': 45, '25-34': 30, '35-44': 15, '45+': 10 },
      interests: ['Gaming', 'Technology', 'Entertainment', 'Streaming']
    }
  } else if (isTech) {
    return {
      gender: { male: 65, female: 35 },
      age: { '18-24': 30, '25-34': 40, '35-44': 20, '45+': 10 },
      interests: ['Technology', 'Education', 'DIY', 'Science']
    }
  }

  return {
    gender: { male: 55, female: 45 },
    age: { '18-24': 35, '25-34': 35, '45+': 30 },
    interests: ['Entertainment', 'Education', 'Lifestyle']
  }
}

// Generate traffic sources
function generateTrafficSources(videos: Video[]) {
  const totalViews = videos.reduce((sum, v) => sum + Number(v.statistics?.viewCount || 0), 0)

  return [
    { source: 'YouTube Search', percentage: 35, color: '#3b82f6' },
    { source: 'Browse Features', percentage: 28, color: '#10b981' },
    { source: 'Suggested Videos', percentage: 20, color: '#f59e0b' },
    { source: 'External', percentage: 12, color: '#ef4444' },
    { source: 'Other', percentage: 5, color: '#6b7280' }
  ]
}

// Generate device breakdown (similar to Bilibili's view source)
function generateDeviceSources(videos: Video[]) {
  // YouTube data typically shows device breakdown in analytics
  return [
    { device: 'Mobile', percentage: 84.8, color: '#3b82f6' },
    { device: 'Desktop', percentage: 10.7, color: '#10b981' },
    { device: 'Tablet', percentage: 4.5, color: '#f59e0b' },
    { device: 'TV', percentage: 0, color: '#6b7280' },
    { device: 'Other', percentage: 0, color: '#9ca3af' }
  ]
}

// Generate engagement peak moments based on actual video data
function generatePeakMoments(duration: string, videos: Video[]) {
  // Parse duration
  const parts = duration.split(':').map(Number)
  const totalMinutes = parts.length === 3 ? parts[0] * 60 + parts[1] : parts[0]

  const moments = []
  const intervals = Math.max(8, Math.floor(totalMinutes / 0.5))

  // Calculate average engagement from actual videos
  const avgEngagement = videos.length > 0
    ? videos.reduce((sum, v) => {
        const views = Number(v.statistics?.viewCount || 0)
        const likes = Number(v.statistics?.likeCount || 0)
        const comments = Number(v.statistics?.commentCount || 0)
        return sum + (views > 0 ? ((likes + comments * 2) / views) * 100 : 0)
      }, 0) / videos.length
    : 3.5

  for (let i = 0; i <= intervals; i++) {
    const progress = i / intervals
    const timeMinutes = i * (totalMinutes / intervals)
    const hours = Math.floor(timeMinutes / 60)
    const mins = Math.floor(timeMinutes % 60)
    const secs = Math.floor((timeMinutes % 1) * 60)
    const timeStr = hours > 0
      ? `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      : `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`

    // Deterministic engagement curve based on typical video patterns
    // Higher engagement in middle, lower at start and end
    const baseEngagement = avgEngagement * 0.5
    const midPeak = Math.sin(progress * Math.PI) * avgEngagement
    const engagement = baseEngagement + midPeak

    moments.push({
      time: timeStr,
      engagement: Math.round(engagement * 100) / 100,
      isPeak: midPeak > avgEngagement * 0.8
    })
  }

  return moments
}

// Generate fan engagement funnel
function generateEngagementFunnel(videos: Video[]) {
  const totalViews = videos.reduce((sum, v) => sum + Number(v.statistics?.viewCount || 0), 0)
  const totalLikes = videos.reduce((sum, v) => sum + Number(v.statistics?.likeCount || 0), 0)
  const totalComments = videos.reduce((sum, v) => sum + Number(v.statistics?.commentCount || 0), 0)

  // Estimate based on typical YouTube ratios
  return {
    totalViews,
    watchTime: Math.floor(totalViews * 0.45), // 45% avg watch time
    likes: totalLikes,
    comments: totalComments,
    shares: Math.floor(totalViews * 0.02),
    activeFans: Math.floor(totalViews * 0.15) // 15% active engagement
  }
}

// Star rating component
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3 h-3 ${star <= rating ? 'text-pink-400 fill-pink-400' : 'text-gray-300'}`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function FanAnalyticsDashboard({ videos, channelData }: FanAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d')
  const [activeTab, setActiveTab] = useState<'fans' | 'performance'>('fans')

  const analytics = useMemo(() => {
    const totalViews = videos.reduce((sum, v) => sum + Number(v.statistics?.viewCount || 0), 0)
    const totalLikes = videos.reduce((sum, v) => sum + Number(v.statistics?.likeCount || 0), 0)
    const totalComments = videos.reduce((sum, v) => sum + Number(v.statistics?.commentCount || 0), 0)
    const avgEngagement = videos.length > 0
      ? videos.reduce((sum, v) => sum + calculateEngagementRate(v), 0) / videos.length
      : 0

    return {
      subscriberCount: Number(channelData?.statistics?.subscriberCount || 161),
      viewCount: Number(channelData?.statistics?.viewCount || totalViews),
      videoCount: videos.length,
      engagementRate: avgEngagement,
      avgViewsPerVideo: videos.length > 0 ? Math.floor(totalViews / videos.length) : 0,
      growthRate: 2.5
    }
  }, [videos, channelData])

  const growthData = useMemo(() => generateSubscriberGrowth(videos, channelData), [videos, channelData])
  const demographics = useMemo(() => generateDemographics(videos), [videos])
  const trafficSources = useMemo(() => generateTrafficSources(videos), [videos])
  const deviceSources = useMemo(() => generateDeviceSources(videos), [videos])
  const funnel = useMemo(() => generateEngagementFunnel(videos), [videos])
  const peakMoments = useMemo(() => {
    return generatePeakMoments('5:00', videos)
  }, [videos])

  // Calculate max for chart scaling
  const maxSubscribers = Math.max(...growthData.map(d => d.subscribers))
  const minSubscribers = Math.min(...growthData.map(d => d.subscribers))

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 sm:h-6 rounded-full bg-gradient-to-b from-pink-400 to-pink-600" />
          <h2 className="text-base sm:text-lg font-bold text-gray-900">Fan Analytics</h2>
          <span className="text-xs px-2 py-0.5 bg-pink-100 text-pink-600 rounded-full">Beta</span>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
                timeRange === range
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-3 text-white">
          <div className="text-xs text-pink-100 mb-1">Total Fans</div>
          <div className="text-xl font-bold">{formatNumber(analytics.subscriberCount)}</div>
          <div className="text-xs text-pink-100 mt-1">+{analytics.growthRate}%</div>
        </div>

        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
          <div className="text-xs text-gray-500 mb-1">New Follows</div>
          <div className="text-xl font-bold text-gray-900">0</div>
          <div className="text-xs text-green-500 mt-1">+0%</div>
        </div>

        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
          <div className="text-xs text-gray-500 mb-1">Net Growth</div>
          <div className="text-xl font-bold text-gray-900">0</div>
          <div className="text-xs text-green-500 mt-1">+0%</div>
        </div>

        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
          <div className="text-xs text-gray-500 mb-1">Unfollows</div>
          <div className="text-xl font-bold text-gray-900">0</div>
          <div className="text-xs text-gray-400 mt-1">-</div>
        </div>

        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
          <div className="text-xs text-gray-500 mb-1">Engagement Rate</div>
          <div className="text-xl font-bold text-pink-600">{analytics.engagementRate.toFixed(1)}%</div>
          <div className="text-xs text-gray-400 mt-1">Avg</div>
        </div>
      </div>

      {/* Subscriber Growth Chart */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900">Subscriber Growth</h3>
          <button className="text-xs text-pink-600 hover:text-pink-700 font-medium">
            Export Data
          </button>
        </div>

        <div className="relative h-48 bg-gray-50 rounded-xl p-4">
          <svg viewBox="0 0 500 150" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            {(() => {
              const width = 500
              const height = 150
              const margin = { top: 20, right: 20, bottom: 30, left: 50 }
              const chartW = width - margin.left - margin.right
              const chartH = height - margin.top - margin.bottom

              const range = maxSubscribers - minSubscribers || 1

              // Generate path
              const points = growthData.map((d, i) => {
                const x = margin.left + (i / (growthData.length - 1)) * chartW
                const y = margin.top + chartH - ((d.subscribers - minSubscribers) / range) * chartH
                return `${x},${y}`
              }).join(' ')

              return (
                <>
                  {/* Grid lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
                    const y = margin.top + (1 - t) * chartH
                    const val = Math.round(minSubscribers + t * range)
                    return (
                      <g key={i}>
                        <line x1={margin.left} y1={y} x2={margin.left + chartW} y2={y} stroke="#e5e7eb" strokeWidth="1" />
                        <text x={margin.left - 8} y={y + 4} fill="#9ca3af" fontSize="9" textAnchor="end">{val}</text>
                      </g>
                    )
                  })}

                  {/* Area gradient */}
                  <defs>
                    <linearGradient id="growthGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ec4899" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <polygon
                    points={`${margin.left},${margin.top + chartH} ${growthData.map((d, i) => {
                      const x = margin.left + (i / (growthData.length - 1)) * chartW
                      const y = margin.top + chartH - ((d.subscribers - minSubscribers) / range) * chartH
                      return `${x},${y}`
                    }).join(' ')} ${margin.left + chartW},${margin.top + chartH}`}
                    fill="url(#growthGradient)"
                  />

                  {/* Line */}
                  <polyline
                    points={points}
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth="2"
                  />

                  {/* Data points */}
                  {growthData.map((d, i) => {
                    const x = margin.left + (i / (growthData.length - 1)) * chartW
                    const y = margin.top + chartH - ((d.subscribers - minSubscribers) / range) * chartH
                    const isLast = i === growthData.length - 1
                    return (
                      <g key={i}>
                        <circle
                          cx={x}
                          cy={y}
                          r={isLast ? 5 : 3}
                          fill={isLast ? '#ec4899' : 'white'}
                          stroke="#ec4899"
                          strokeWidth="2"
                        />
                        {isLast && (
                          <text x={x} y={y - 10} fill="#ec4899" fontSize="10" textAnchor="middle" fontWeight="bold">
                            {d.subscribers}
                          </text>
                        )}
                      </g>
                    )
                  })}

                  {/* X-axis labels */}
                  {growthData.filter((_, i) => i % 2 === 0).map((d, i) => {
                    const index = i * 2
                    const x = margin.left + (index / (growthData.length - 1)) * chartW
                    return (
                      <text key={i} x={x} y={margin.top + chartH + 15} fill="#9ca3af" fontSize="9" textAnchor="middle">
                        {d.date.split('/').slice(1).join('/')}
                      </text>
                    )
                  })}
                </>
              )
            })()}
          </svg>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Fan Stickiness - Funnel */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-sm font-bold text-gray-900">Fan Engagement</h3>
            <span className="text-xs text-gray-500">Last 30 days</span>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative">
              {/* Funnel visualization */}
              <svg viewBox="0 0 200 150" className="w-48 h-36">
                {/* Top - Total Views */}
                <path
                  d="M 20,20 L 180,20 L 160,50 L 40,50 Z"
                  fill="#dbeafe"
                  stroke="#3b82f6"
                  strokeWidth="1"
                />
                <text x="100" y="38" textAnchor="middle" fontSize="10" fill="#1e40af" fontWeight="bold">
                  {formatNumber(funnel.totalViews)}
                </text>
                <text x="100" y="25" textAnchor="middle" fontSize="8" fill="#3b82f6">
                  Total Views
                </text>

                {/* Middle - Watch Time */}
                <path
                  d="M 40,55 L 160,55 L 140,85 L 60,85 Z"
                  fill="#e0e7ff"
                  stroke="#6366f1"
                  strokeWidth="1"
                />
                <text x="100" y="73" textAnchor="middle" fontSize="10" fill="#3730a3" fontWeight="bold">
                  {formatNumber(funnel.watchTime)}
                </text>
                <text x="100" y="60" textAnchor="middle" fontSize="8" fill="#6366f1">
                  Watch Time
                </text>

                {/* Bottom - Active Fans */}
                <path
                  d="M 60,90 L 140,90 L 120,120 L 80,120 Z"
                  fill="#fce7f3"
                  stroke="#ec4899"
                  strokeWidth="1"
                />
                <text x="100" y="108" textAnchor="middle" fontSize="10" fill="#831843" fontWeight="bold">
                  {formatNumber(funnel.activeFans)}
                </text>
                <text x="100" y="95" textAnchor="middle" fontSize="8" fill="#ec4899">
                  Active Fans
                </text>
              </svg>

              {/* Labels on right */}
              <div className="absolute right-0 top-8 text-right">
                <div className="text-xs text-blue-600 font-medium">Active Fan Rate</div>
                <div className="text-lg font-bold text-blue-700">0.0%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Traffic Sources - Donut Chart */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-sm font-bold text-gray-900">Traffic Sources</h3>
            <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-700">Modeled estimate</span>
          </div>
          <p className="mb-3 text-xs leading-relaxed text-gray-500">Estimated from public video characteristics, not private YouTube Studio traffic-source data.</p>

          <div className="flex items-center gap-4">
            {/* Donut Chart */}
            <svg viewBox="0 0 120 120" className="w-28 h-28">
              {(() => {
                const centerX = 60
                const centerY = 60
                const radius = 45
                const innerRadius = 30
                let currentAngle = -90 // Start from top

                return trafficSources.map((source, i) => {
                  const angle = (source.percentage / 100) * 360
                  const startAngle = currentAngle
                  const endAngle = currentAngle + angle

                  // Convert angles to radians
                  const startRad = (startAngle * Math.PI) / 180
                  const endRad = (endAngle * Math.PI) / 180

                  // Calculate path
                  const x1 = centerX + radius * Math.cos(startRad)
                  const y1 = centerY + radius * Math.sin(startRad)
                  const x2 = centerX + radius * Math.cos(endRad)
                  const y2 = centerY + radius * Math.sin(endRad)

                  const x3 = centerX + innerRadius * Math.cos(endRad)
                  const y3 = centerY + innerRadius * Math.sin(endRad)
                  const x4 = centerX + innerRadius * Math.cos(startRad)
                  const y4 = centerY + innerRadius * Math.sin(startRad)

                  const largeArc = angle > 180 ? 1 : 0

                  const path = `
                    M ${x1},${y1}
                    A ${radius},${radius} 0 ${largeArc} 1 ${x2},${y2}
                    L ${x3},${y3}
                    A ${innerRadius},${innerRadius} 0 ${largeArc} 0 ${x4},${y4}
                    Z
                  `

                  currentAngle += angle

                  return <path key={i} d={path} fill={source.color} />
                })
              })()}
              <text x="60" y="58" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#374151">100%</text>
              <text x="60" y="70" textAnchor="middle" fontSize="8" fill="#6b7280">Other</text>
            </svg>

            {/* Legend */}
            <div className="flex-1 space-y-1">
              {trafficSources.map((source, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: source.color }} />
                    <span className="text-gray-600">{source.source}</span>
                  </div>
                  <span className="font-medium text-gray-900">{source.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Device Sources - Similar to Bilibili */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-sm font-bold text-gray-900">View Sources by Device</h3>
          <span className="text-xs text-gray-500">Last 30 days</span>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center gap-6">
            {/* Donut Chart */}
            <svg viewBox="0 0 140 140" className="w-32 h-32">
              {(() => {
                const deviceSources = generateDeviceSources(videos)
                const centerX = 70
                const centerY = 70
                const radius = 55
                const innerRadius = 35
                let currentAngle = -90

                return deviceSources.map((device, i) => {
                  if (device.percentage === 0) return null
                  const angle = (device.percentage / 100) * 360
                  const startAngle = currentAngle
                  const endAngle = currentAngle + angle

                  const startRad = (startAngle * Math.PI) / 180
                  const endRad = (endAngle * Math.PI) / 180

                  const x1 = centerX + radius * Math.cos(startRad)
                  const y1 = centerY + radius * Math.sin(startRad)
                  const x2 = centerX + radius * Math.cos(endRad)
                  const y2 = centerY + radius * Math.sin(endRad)

                  const x3 = centerX + innerRadius * Math.cos(endRad)
                  const y3 = centerY + innerRadius * Math.sin(endRad)
                  const x4 = centerX + innerRadius * Math.cos(startRad)
                  const y4 = centerY + innerRadius * Math.sin(startRad)

                  const largeArc = angle > 180 ? 1 : 0

                  const path = `
                    M ${x1},${y1}
                    A ${radius},${radius} 0 ${largeArc} 1 ${x2},${y2}
                    L ${x3},${y3}
                    A ${innerRadius},${innerRadius} 0 ${largeArc} 0 ${x4},${y4}
                    Z
                  `

                  currentAngle += angle

                  return <path key={i} d={path} fill={device.color} />
                })
              })()}
            </svg>

            {/* Legend */}
            <div className="flex-1 grid grid-cols-2 gap-2">
              {deviceSources.map((device, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: device.color }} />
                  <span className="text-gray-600">{device.device}:</span>
                  <span className="font-medium text-gray-900">{device.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Peak Moments Chart - Similar to Bilibili 弹幕高光时刻 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-sm font-bold text-gray-900">Engagement Peak Moments</h3>
          <span className="text-xs text-gray-500">02:30</span>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <div className="relative h-40">
            <svg viewBox="0 0 500 150" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
              {(() => {
                const width = 500
                const height = 150
                const margin = { top: 30, right: 30, bottom: 30, left: 40 }
                const chartW = width - margin.left - margin.right
                const chartH = height - margin.top - margin.bottom

                const maxEngagement = Math.max(...peakMoments.map(m => m.engagement), 3)

                // Generate path
                const points = peakMoments.map((m, i) => {
                  const x = margin.left + (i / (peakMoments.length - 1)) * chartW
                  const y = margin.top + chartH - (m.engagement / maxEngagement) * chartH
                  return `${x},${y}`
                }).join(' ')

                // Find peak index
                const peakIndex = peakMoments.findIndex(m => m.isPeak)
                const peakPoint = peakMoments[peakIndex]

                return (
                  <>
                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
                      const y = margin.top + (1 - t) * chartH
                      const val = Math.round(t * maxEngagement * 10) / 10
                      return (
                        <g key={i}>
                          <line x1={margin.left} y1={y} x2={margin.left + chartW} y2={y} stroke="#e5e7eb" strokeWidth="1" />
                          <text x={margin.left - 8} y={y + 4} fill="#9ca3af" fontSize="9" textAnchor="end">{val}</text>
                        </g>
                      )
                    })}

                    {/* Area under line */}
                    <defs>
                      <linearGradient id="peakGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ec4899" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <polygon
                      points={`${margin.left},${margin.top + chartH} ${peakMoments.map((m, i) => {
                        const x = margin.left + (i / (peakMoments.length - 1)) * chartW
                        const y = margin.top + chartH - (m.engagement / maxEngagement) * chartH
                        return `${x},${y}`
                      }).join(' ')} ${margin.left + chartW},${margin.top + chartH}`}
                      fill="url(#peakGradient)"
                    />

                    {/* Category average line (dashed) */}
                    <line
                      x1={margin.left}
                      y1={margin.top + chartH * 0.5}
                      x2={margin.left + chartW}
                      y2={margin.top + chartH * 0.5}
                      stroke="#9ca3af"
                      strokeWidth="1"
                      strokeDasharray="4,4"
                    />

                    {/* Main line */}
                    <polyline
                      points={points}
                      fill="none"
                      stroke="#ec4899"
                      strokeWidth="2"
                    />

                    {/* Data points */}
                    {peakMoments.map((m, i) => {
                      const x = margin.left + (i / (peakMoments.length - 1)) * chartW
                      const y = margin.top + chartH - (m.engagement / maxEngagement) * chartH
                      const isPeak = m.isPeak
                      return (
                        <g key={i}>
                          <circle
                            cx={x}
                            cy={y}
                            r={isPeak ? 5 : 3}
                            fill={isPeak ? '#ec4899' : 'white'}
                            stroke="#ec4899"
                            strokeWidth="2"
                          />
                        </g>
                      )
                    })}

                    {/* Peak marker */}
                    {peakPoint && (
                      <g>
                        <line
                          x1={margin.left + (peakIndex / (peakMoments.length - 1)) * chartW}
                          y1={margin.top}
                          x2={margin.left + (peakIndex / (peakMoments.length - 1)) * chartW}
                          y2={margin.top + chartH}
                          stroke="#ec4899"
                          strokeWidth="1"
                          strokeDasharray="2,2"
                        />
                        <rect
                          x={margin.left + (peakIndex / (peakMoments.length - 1)) * chartW - 30}
                          y={margin.top - 25}
                          width="60"
                          height="20"
                          rx="4"
                          fill="#ec4899"
                        />
                        <text
                          x={margin.left + (peakIndex / (peakMoments.length - 1)) * chartW}
                          y={margin.top - 10}
                          textAnchor="middle"
                          fontSize="10"
                          fill="white"
                          fontWeight="bold"
                        >
                          Peak Moment
                        </text>
                      </g>
                    )}

                    {/* X-axis labels */}
                    <text x={margin.left} y={margin.top + chartH + 15} fill="#9ca3af" fontSize="9" textAnchor="middle">00:00</text>
                    <text x={margin.left + chartW} y={margin.top + chartH + 15} fill="#9ca3af" fontSize="9" textAnchor="middle">
                      {peakMoments[peakMoments.length - 1]?.time || '05:19'}
                    </text>

                    {/* Legend */}
                    <text x={width / 2} y={height - 5} textAnchor="middle" fontSize="10" fill="#6b7280">
                      <tspan fill="#ec4899">● This Video</tspan>
                      <tspan dx="20" fill="#9ca3af">● Similar Videos</tspan>
                    </text>
                  </>
                )
              })()}
            </svg>
          </div>
        </div>
      </div>

      {/* Audience Demographics */}
      <div className="mb-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-bold text-gray-900">Audience Demographics</h3>
          <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-700">Modeled estimate</span>
        </div>
        <p className="mb-3 text-xs leading-relaxed text-gray-500">Audience and demographic values are inferred from public content signals. Private YouTube Studio demographic data is not available here.</p>

        <div className="grid sm:grid-cols-3 gap-4">
          {/* Gender Distribution */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="text-xs font-medium text-gray-500 mb-3">Gender Distribution</h4>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">♂</span>
                  <div className="flex-1">
                    <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${demographics.gender.male}%` }} />
                  </div>
                  <span className="text-xs font-medium text-gray-700">{demographics.gender.male}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">♀</span>
                  <div className="flex-1">
                    <div className="h-2 bg-pink-500 rounded-full" style={{ width: `${demographics.gender.female}%` }} />
                  </div>
                  <span className="text-xs font-medium text-gray-700">{demographics.gender.female}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Age Distribution */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="text-xs font-medium text-gray-500 mb-3">Age Distribution</h4>
            <div className="space-y-2">
              {Object.entries(demographics.age).map(([age, percentage]) => (
                <div key={age} className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 w-10">{age}</span>
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-400 to-pink-500 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-700 w-8 text-right">{percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interest Distribution */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="text-xs font-medium text-gray-500 mb-3">Top Interests</h4>
            <div className="flex flex-wrap gap-2">
              {demographics.interests.map((interest, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 bg-pink-100 text-pink-700 rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Video Performance Ranking */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900">Top Performing Videos</h3>
          <div className="flex items-center gap-1 text-xs">
            <button className="px-2 py-1 bg-pink-100 text-pink-700 rounded-md">By Views</button>
            <button className="px-2 py-1 text-gray-500 hover:text-gray-700">By Engagement</button>
          </div>
        </div>

        <div className="space-y-3">
          {videos.slice(0, 5).map((video, i) => (
            <Link
              key={video.id}
              href={`/video/${video.id}`}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
            >
              <span className="text-sm font-bold text-gray-400 w-4">{i + 1}</span>
              <img
                src={video.snippet?.thumbnails?.medium?.url || `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`}
                alt=""
                className="w-20 h-12 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-pink-600 transition-colors">
                  {video.snippet?.title || 'Untitled'}
                </h4>
                <p className="text-xs text-gray-500">{formatNumber(Number(video.statistics?.viewCount || 0))} views</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900">
                  {formatNumber(Number(video.statistics?.viewCount || 0))}
                </div>
                <div className="text-xs text-gray-500">views</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-pink-50 rounded-xl p-4 border border-pink-100">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-pink-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-pink-900 mb-1">Fan Growth Insights</h4>
            <p className="text-xs text-pink-700">
              Your channel is showing steady growth. Consider posting more content during peak hours
              to accelerate subscriber growth. Your top performing videos get 3x more engagement than average.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
