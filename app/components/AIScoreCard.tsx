'use client'

import { useState, useEffect } from 'react'

interface ScoreData {
  overall: number
  percentile: number
  quality: number
  engagement: number
  retention: number
  growth: number
  category: string
}

interface AIScoreCardProps {
  videoId?: string
  channelId?: string
  type: 'video' | 'channel'
}

export default function AIScoreCard({ videoId, channelId, type }: AIScoreCardProps) {
  const [score, setScore] = useState<ScoreData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate AI calculation
    const calculateScore = () => {
      setLoading(true)
      setTimeout(() => {
        // Generate realistic scores based on type
        const baseScore = type === 'video' ? 72 : 68
        setScore({
          overall: baseScore + Math.floor(Math.random() * 20),
          percentile: 85 + Math.floor(Math.random() * 14),
          quality: 70 + Math.floor(Math.random() * 25),
          engagement: 75 + Math.floor(Math.random() * 20),
          retention: 65 + Math.floor(Math.random() * 30),
          growth: 60 + Math.floor(Math.random() * 35),
          category: type === 'video' ? 'Entertainment' : 'Knowledge',
        })
        setLoading(false)
      }, 800)
    }
    calculateScore()
  }, [videoId, channelId, type])

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 animate-pulse">
        <div className="h-32 bg-white/20 rounded-lg"></div>
      </div>
    )
  }

  if (!score) return null

  const getScoreColor = (s: number) => {
    if (s >= 90) return 'text-green-400'
    if (s >= 70) return 'text-yellow-400'
    return 'text-orange-400'
  }

  const getScoreBg = (s: number) => {
    if (s >= 90) return 'bg-green-500'
    if (s >= 70) return 'bg-yellow-500'
    return 'bg-orange-500'
  }

  return (
    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            AI Content Quality Score
          </h3>
          <p className="text-indigo-200 text-sm">Deep analysis of similar {type === 'video' ? 'videos' : 'channels'}</p>
        </div>
        <div className="text-right">
          <div className={`text-4xl font-bold ${getScoreColor(score.overall)}`}>
            {score.overall}
          </div>
          <div className="text-sm text-indigo-200">Overall Score</div>
        </div>
      </div>

      {/* Percentile Ranking */}
      <div className="bg-white/10 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-indigo-200">Top Percentile</div>
            <div className="text-2xl font-bold text-green-400">
              Top {100 - score.percentile}%
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-indigo-200">Category</div>
            <div className="text-lg font-semibold">{score.category}</div>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-xs text-indigo-200 mb-1">
            <span>Ranking Distribution</span>
            <span>{score.percentile}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-1000"
              style={{ width: `${score.percentile}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Dimension Scores */}
      <div className="grid grid-cols-2 gap-3">
        <ScoreItem label="Content Quality" score={score.quality} icon="✨" />
        <ScoreItem label="Engagement" score={score.engagement} icon="💬" />
        <ScoreItem label="Retention" score={score.retention} icon="👁️" />
        <ScoreItem label="Growth Potential" score={score.growth} icon="📈" />
      </div>

      {/* AI Recommendation */}
      <div className="mt-4 bg-white/10 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <div className="font-semibold mb-1">AI Recommendations</div>
            <p className="text-sm text-indigo-100">
              {score.overall >= 85
                ? 'Excellent content quality! Maintain your current creative pace and consider exploring related topics.'
                : score.overall >= 70
                ? 'Good overall performance. Optimizing titles and thumbnails can further improve CTR.'
                : 'Content has potential. Analyze top-performing similar videos to learn their success factors.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ScoreItem({ label, score, icon }: { label: string; score: number; icon: string }) {
  const getColor = (s: number) => {
    if (s >= 80) return 'text-green-400'
    if (s >= 60) return 'text-yellow-400'
    return 'text-orange-400'
  }

  return (
    <div className="bg-white/10 rounded-lg p-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-indigo-200 flex items-center gap-1">
          {icon} {label}
        </span>
        <span className={`font-bold ${getColor(score)}`}>{score}</span>
      </div>
      <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            score >= 80 ? 'bg-green-400' : score >= 60 ? 'bg-yellow-400' : 'bg-orange-400'
          }`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  )
}
