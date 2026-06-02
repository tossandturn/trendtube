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
          topic: 'AI工具实操教程',
          confidence: 92,
          trend: 'rising',
          tags: ['AI', '教程', '效率工具'],
          estimatedViews: '50-100万',
          competition: 'medium',
        },
        {
          topic: '2024职场技能盘点',
          confidence: 88,
          trend: 'rising',
          tags: ['职场', '技能', '年终'],
          estimatedViews: '30-80万',
          competition: 'low',
        },
        {
          topic: '极简生活方法论',
          confidence: 85,
          trend: 'stable',
          tags: ['生活', '极简', '断舍离'],
          estimatedViews: '20-50万',
          competition: 'medium',
        },
        {
          topic: '副业变现案例',
          confidence: 82,
          trend: 'rising',
          tags: ['副业', '变现', '创业'],
          estimatedViews: '40-90万',
          competition: 'high',
        },
        {
          topic: '学习方法论升级',
          confidence: 78,
          trend: 'stable',
          tags: ['学习', '效率', '方法论'],
          estimatedViews: '25-60万',
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
        return { icon: '📈', label: '上升', color: 'text-green-600' }
      case 'stable':
        return { icon: '➡️', label: '稳定', color: 'text-blue-600' }
      case 'falling':
        return { icon: '📉', label: '下降', color: 'text-orange-600' }
      default:
        return { icon: '➡️', label: '稳定', color: 'text-gray-600' }
    }
  }

  const getCompetitionBadge = (level: string) => {
    switch (level) {
      case 'low':
        return { label: '低竞争', color: 'bg-green-100 text-green-700' }
      case 'medium':
        return { label: '中等', color: 'bg-yellow-100 text-yellow-700' }
      case 'high':
        return { label: '高竞争', color: 'bg-red-100 text-red-700' }
      default:
        return { label: '未知', color: 'bg-gray-100 text-gray-700' }
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="text-2xl">🔮</span>
          热门选题预测
        </h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          AI 预测模型
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
                  <div className="text-xs text-gray-500">预测置信度</div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-xs text-gray-500">预估播放量</span>
                    <div className="font-semibold text-gray-900">{topic.estimatedViews}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${competition.color}`}>
                    {competition.label}
                  </span>
                </div>
                <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                  查看详情 →
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Prediction Insight */}
      <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
        <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
          <span>💡</span> 选题建议
        </h4>
        <ul className="space-y-1 text-sm text-purple-800">
          <li>• "AI工具实操教程" 预测热度最高，建议优先制作</li>
          <li>• "2024职场技能盘点" 竞争较低，适合新人创作者</li>
          <li>• "副业变现案例" 搜索量高但竞争激烈，需差异化切入</li>
        </ul>
      </div>
    </div>
  )
}
