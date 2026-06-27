'use client'

import { useState, useEffect } from 'react'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts'

interface Creator {
  name: string
  id: string
  avatar: string
  score: number
  growth: number
  niche: string
  tags: string[]
  potential: 'high' | 'medium' | 'emerging'
}

interface CreatorEcosystemProps {
  category: string
}

export default function CreatorEcosystem({ category }: CreatorEcosystemProps) {
  const [creators, setCreators] = useState<Creator[]>([])
  const [trendDirection, setTrendDirection] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      const mockCreators: Creator[] = [
        {
          name: 'Tech Frontier',
          id: 'creator1',
          avatar: '',
          score: 92,
          growth: 45,
          niche: 'AI Tech',
          tags: ['AI', 'Tech', 'Tutorial'],
          potential: 'high',
        },
        {
          name: 'Geek Park',
          id: 'creator2',
          avatar: '',
          score: 88,
          growth: 38,
          niche: 'Tech Reviews',
          tags: ['Review', 'Tech', 'Hardware'],
          potential: 'high',
        },
        {
          name: 'Future Classroom',
          id: 'creator3',
          avatar: '',
          score: 75,
          growth: 68,
          niche: 'Online Education',
          tags: ['Education', 'Knowledge', 'Course'],
          potential: 'emerging',
        },
        {
          name: 'Code Poet',
          id: 'creator4',
          avatar: '',
          score: 82,
          growth: 52,
          niche: 'Programming',
          tags: ['Coding', 'Tutorial', 'Tech'],
          potential: 'high',
        },
        {
          name: 'Design Mind',
          id: 'creator5',
          avatar: '',
          score: 78,
          growth: 35,
          niche: 'UI Design',
          tags: ['Design', 'UI', 'Creative'],
          potential: 'medium',
        },
      ]
      setCreators(mockCreators)
      setTrendDirection('Transitioning from tech reviews to AI content, education trending upward')
      setLoading(false)
    }, 800)
  }, [category])

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 animate-pulse">
        <div className="h-64 bg-gray-100 rounded-lg"></div>
      </div>
    )
  }

  const radarData = [
    { subject: 'Content Quality', A: 85, fullMark: 100 },
    { subject: 'Growth Rate', A: 72, fullMark: 100 },
    { subject: 'Fan Loyalty', A: 78, fullMark: 100 },
    { subject: 'Engagement', A: 68, fullMark: 100 },
    { subject: 'Business Potential', A: 82, fullMark: 100 },
    { subject: 'Innovation', A: 75, fullMark: 100 },
  ]

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
        <p className="text-sm text-indigo-700">{trendDirection}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-600 mb-3 text-center">Creator Capability Model</h4>
          <div className="h-64">
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
          </div>
        </div>

        {/* Creator List */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-600 mb-3">Rising Creators</h4>
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
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{creator.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${badge.color}`}>
                        {badge.icon} {badge.label}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{creator.niche}</div>
                    <div className="flex gap-1 mt-1">
                      {creator.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-1.5 py-0.5 bg-white rounded border border-gray-200 text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
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
          <div className="text-2xl font-bold text-blue-600">1,247</div>
          <div className="text-xs text-blue-700">Active Creators</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-600">23%</div>
          <div className="text-xs text-green-700">New Creator Growth</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-600">5.2</div>
          <div className="text-xs text-purple-700">Avg Content/Week</div>
        </div>
        <div className="bg-amber-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-amber-600">68%</div>
          <div className="text-xs text-amber-700">Transition Success</div>
        </div>
      </div>
    </div>
  )
}
