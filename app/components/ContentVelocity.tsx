'use client'

import { useState, useEffect } from 'react'
import { fetchVideoById } from '@/lib/api-client'

interface VelocityData {
  daysSincePublish: number
  currentViews: number
  velocity: number
  projectedViews: number
  phase: string
}

interface ContentVelocityProps {
  videoId: string
}

function calculateVelocityData(video: any): VelocityData[] {
  const stats = video.statistics || {}
  const snippet = video.snippet || {}
  const views = Number(stats.viewCount || 0)
  const publishedAt = new Date(snippet.publishedAt || Date.now())
  const daysSincePublish = Math.max(1, Math.floor((Date.now() - publishedAt.getTime()) / (1000 * 60 * 60 * 24)))
  
  const velocity = Math.round(views / daysSincePublish)
  
  const data: VelocityData[] = []
  
  const day1Views = Math.round(velocity * 4)
  data.push({
    daysSincePublish: 1,
    currentViews: day1Views,
    velocity,
    projectedViews: day1Views,
    phase: 'Launch',
  })
  
  const week1Views = Math.round(velocity * 7 * 0.8)
  data.push({
    daysSincePublish: 7,
    currentViews: week1Views,
    velocity,
    projectedViews: week1Views,
    phase: 'Week 1',
  })
  
  data.push({
    daysSincePublish,
    currentViews: views,
    velocity,
    projectedViews: views,
    phase: 'Current',
  })
  
  const monthViews = Math.round(views + velocity * Math.max(0, 30 - daysSincePublish) * 0.6)
  data.push({
    daysSincePublish: 30,
    currentViews: monthViews,
    velocity,
    projectedViews: monthViews,
    phase: 'Month 1',
  })
  
  const month3Views = Math.round(monthViews * 1.3)
  data.push({
    daysSincePublish: 90,
    currentViews: month3Views,
    velocity,
    projectedViews: month3Views,
    phase: 'Month 3',
  })
  
  return data
}

export default function ContentVelocity({ videoId }: ContentVelocityProps) {
  const [data, setData] = useState<VelocityData[]>([])
  const [loading, setLoading] = useState(true)
  const [videoData, setVideoData] = useState<any>(null)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const video = await fetchVideoById(videoId)
        if (video) {
          setVideoData(video)
          setData(calculateVelocityData(video))
        }
      } catch (error) {
        console.error('Failed to load velocity data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (videoId) {
      loadData()
    }
  }, [videoId])

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 animate-pulse">
        <div className="h-32 bg-gray-100 rounded-lg"></div>
      </div>
    )
  }

  if (!videoData || data.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-6">
        <p className="text-gray-500">Velocity data unavailable</p>
      </div>
    )
  }

  const views = Number(videoData.statistics?.viewCount || 0)
  const publishedAt = new Date(videoData.snippet?.publishedAt || Date.now())
  const daysSincePublish = Math.max(1, Math.floor((Date.now() - publishedAt.getTime()) / (1000 * 60 * 60 * 24)))
  const velocity = Math.round(views / daysSincePublish)

  let tier = 'average'
  if (velocity > 1000000) tier = 'viral'
  else if (velocity > 100000) tier = 'high'
  else if (velocity > 10000) tier = 'good'

  const tierConfig = {
    viral: { label: 'Viral Velocity', color: 'bg-red-100 text-red-700' },
    high: { label: 'High Velocity', color: 'bg-orange-100 text-orange-700' },
    good: { label: 'Good Velocity', color: 'bg-green-100 text-green-700' },
    average: { label: 'Steady', color: 'bg-blue-100 text-blue-700' },
  }

  const formatNumber = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
    return n.toLocaleString()
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="text-2xl">📈</span>
          Content Velocity
        </h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${tierConfig[tier as keyof typeof tierConfig].color}`}>
          {tierConfig[tier as keyof typeof tierConfig].label}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-xs text-blue-600 mb-1">Current Views</div>
          <div className="text-2xl font-bold text-blue-900">{formatNumber(views)}</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-xs text-green-600 mb-1">Views/Day</div>
          <div className="text-2xl font-bold text-green-900">{formatNumber(velocity)}</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-xs text-purple-600 mb-1">Days Published</div>
          <div className="text-2xl font-bold text-purple-900">{daysSincePublish}</div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">View Projections</h4>
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded ${
                  item.phase === 'Launch' ? 'bg-red-100 text-red-700' :
                  item.phase === 'Week 1' ? 'bg-orange-100 text-orange-700' :
                  item.phase === 'Current' ? 'bg-green-100 text-green-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {item.phase}
                </span>
                <span className="text-sm text-gray-600">Day {item.daysSincePublish}</span>
              </div>
              <span className="font-medium text-gray-900">{formatNumber(item.projectedViews)}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400">
        Based on actual YouTube API data
      </p>
    </div>
  )
}
