'use client'

import { useState, useEffect } from 'react'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts'

interface Creator {
  id: string
  name: string
  score: number
  growth: number
  niche: string
  tags: string[]
  potential: 'high' | 'medium' | 'emerging'
  totalViews: number
  avgEngagement: string
}

interface RadarDataPoint {
  subject: string
  A: number
  fullMark: number
}

interface EcosystemStats {
  activeCreators: number
  newCreatorGrowth: number
  avgContentPerWeek: string
  transitionSuccess: number
}

interface CreatorEcosystemProps {
  category: string
}

export default function CreatorEcosystem({ category }: CreatorEcosystemProps) {
  const [creators, setCreators] = useState<Creator[]>([])
  const [radarData, setRadarData] = useState<RadarDataPoint[]>([])
  const [stats, setStats] = useState<EcosystemStats>({
    activeCreators: 0,
    newCreatorGrowth: 0,
    avgContentPerWeek: '0',
    transitionSuccess: 0,
  })
  const [trendDirection, setTrendDirection] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchEcosystemData() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch('/api/creator-ecosystem', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category }),
        })

        if (!response.ok) {
          throw new Error('Failed to fetch ecosystem data')
        }

        const data = await response.json()
        setCreators(data.creators || [])
        setRadarData(data.radarData || [])
        setStats(data.stats || { activeCreators: 0, newCreatorGrowth: 0, avgContentPerWeek: '0', transitionSuccess: 0 })
        setTrendDirection(data.trendDirection || '')
      } catch (err) {
        setError('Failed to load creator ecosystem data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchEcosystemData()
  }, [category])

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6">
        <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
        <div className="mt-4 h-4 bg-gray-100 rounded w-3/4 animate-pulse"></div>
        <div className="mt-2 h-4 bg-gray-100 rounded w-1/2 animate-pulse"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 text-center">
        <p className="text-red-600 mb-2">{error}</p>
        <p className="text-sm text-gray-500">Showing {category} category ecosystem data</p>
      </div>
    )
  }

  const getPotentialBadge = (potential: string) => {
    switch (potential) {
      case 'high':
        return { label: 'Top Creator', color: 'bg-red-100 text-red-700', icon: '👑' }
      case 'medium':
        return { label: 'Mid-tier', color: 'bg-blue-100 text-blue-700', icon: '📊' }
      case 'emerging':
        return { label: 'Rising Star', color: 'bg-green-100 text-green-700', icon: '🌱' }
      default:
        return { label: 'New', color: 'bg-gray-100 text-gray-700', icon: '⭐' }
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="text-2xl">🌐</span>
          Creator Ecosystem
        </h3>
        <div className="text-sm text-gray-500">{category} Category</div>
      </div>

      {/* Trend Direction */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-100 mb-6">
        <h4 className="font-semibold text-indigo-900 mb-1 flex items-center gap-2">
          <span>🔄</span> Trend Direction
        </h4>
        <p className="text-sm text-indigo-700">{trendDirection || `Analyzing ${category} creator trends...`}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-600 mb-3 text-center">Creator Capability Model</h4>
          <div className="h-64">
            {radarData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                  <Radar
                    name="Average"
                    dataKey="A"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Creator List */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-600 mb-3">Rising Creators</h4>
          {creators.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">No creators found for this category</p>
          )}
          {creators.map((creator) => {
            const badge = getPotentialBadge(creator.potential)
            return (
              <div
                key={creator.id}
                className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold">
                    {creator.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 truncate">{creator.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${badge.color} whitespace-nowrap`}>
                        {badge.icon} {badge.label}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{creator.niche}</div>
                    <div className="flex gap-1 mt-1">
                      {creator.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-1.5 py-0.5 bg-white rounded border border-gray-200 text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <div className="text-lg font-bold text-indigo-600">{creator.score}</div>
                    <div className="text-xs text-green-600">+{creator.growth}%</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Ecosystem Insights */}
      <div className="mt-6 grid grid-cols-4 gap-3">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.activeCreators.toLocaleString()}</div>
          <div className="text-xs text-blue-700">Active Creators</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.newCreatorGrowth}%</div>
          <div className="text-xs text-green-700">New Creator Growth</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.avgContentPerWeek}</div>
          <div className="text-xs text-purple-700">Avg Content/Week</div>
        </div>
        <div className="bg-amber-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-amber-600">{stats.transitionSuccess}%</div>
          <div className="text-xs text-amber-700">Transition Success</div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-400 text-center">
        📊 Data sourced from real YouTube channels in this category
      </div>
    </div>
  )
}
