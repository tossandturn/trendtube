'use client'

import { useState, useEffect } from 'react'

interface PredictedTopic {
  topic: string
  confidence: number
  trend: 'rising' | 'stable' | 'falling'
  tags: string[]
  estimatedViews: string
  competition: 'low' | 'medium' | 'high'
}

interface TopicPredictionProps {
  category: string
}

export default function TopicPrediction({ category }: TopicPredictionProps) {
  const [topics, setTopics] = useState<PredictedTopic[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      const mockTopics: PredictedTopic[] = [
        {
          topic: 'AI Tools Tutorial',
          confidence: 92,
          trend: 'rising',
          tags: ['AI', 'Tutorial', 'Productivity'],
          estimatedViews: '500K-1M',
          competition: 'medium',
        },
        {
          topic: '2024 Workplace Skills Review',
          confidence: 88,
          trend: 'rising',
          tags: ['Work', 'Skills', 'Year-end'],
          estimatedViews: '300K-800K',
          competition: 'low',
        },
        {
          topic: 'Minimalist Living Guide',
          confidence: 85,
          trend: 'stable',
          tags: ['Life', 'Minimalism', 'Declutter'],
          estimatedViews: '200K-500K',
          competition: 'medium',
        },
        {
          topic: 'Side Hustle Case Studies',
          confidence: 82,
          trend: 'rising',
          tags: ['Side Hustle', 'Monetization', 'Entrepreneurship'],
          estimatedViews: '400K-900K',
          competition: 'high',
        },
        {
          topic: 'Learning Methodology Upgrade',
          confidence: 78,
          trend: 'stable',
          tags: ['Learning', 'Efficiency', 'Methods'],
          estimatedViews: '250K-600K',
          competition: 'low',
        },
      ]
      setTopics(mockTopics)
      setLoading(false)
    }, 800)
  }, [category])

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 animate-pulse">
        <div className="h-48 bg-gray-100 rounded-lg"></div>
      </div>
    )
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising':
        return { icon: '📈', label: 'Rising', color: 'text-green-600' }
      case 'stable':
        return { icon: '➡️', label: 'Stable', color: 'text-blue-600' }
      case 'falling':
        return { icon: '📉', label: 'Falling', color: 'text-orange-600' }
      default:
        return { icon: '➡️', label: 'Stable', color: 'text-gray-600' }
    }
  }

  const getCompetitionBadge = (level: string) => {
    switch (level) {
      case 'low':
        return { label: 'Low Competition', color: 'bg-green-100 text-green-700' }
      case 'medium':
        return { label: 'Medium', color: 'bg-yellow-100 text-yellow-700' }
      case 'high':
        return { label: 'High Competition', color: 'bg-red-100 text-red-700' }
      default:
        return { label: 'Unknown', color: 'bg-gray-100 text-gray-700' }
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="text-2xl">🔮</span>
          Trending Topics Prediction
        </h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          AI Prediction Model
        </span>
      </div>

      {/* Prediction List */}
      <div className="space-y-3">
        {topics.map((topic, index) => {
          const trend = getTrendIcon(topic.trend)
          const competition = getCompetitionBadge(topic.competition)
          return (
            <div
              key={topic.topic}
              className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-gray-900">{topic.topic}</span>
                    <span className={`text-xs ${trend.color}`}>{trend.icon} {trend.label}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {topic.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 bg-white rounded border border-gray-200 text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-indigo-600">{topic.confidence}%</div>
                  <div className="text-xs text-gray-500">Prediction Confidence</div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-xs text-gray-500">Est. Views</span>
                    <div className="font-semibold text-gray-900">{topic.estimatedViews}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${competition.color}`}>
                    {competition.label}
                  </span>
                </div>
                <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                  View Details →
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Prediction Insight */}
      <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
        <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
          <span>💡</span> Topic Recommendations
        </h4>
        <ul className="space-y-1 text-sm text-purple-800">
          <li>• "AI Tools Tutorial" has highest predicted popularity, prioritize this</li>
          <li>• "2024 Workplace Skills Review" has low competition, great for new creators</li>
          <li>• "Side Hustle Case Studies" has high search volume but fierce competition</li>
        </ul>
      </div>
    </div>
  )
}
