'use client'

import { useState, useEffect } from 'react'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'

interface ChannelValueData {
  commercial: number
  knowledge: number
  social: number
  entertainment: number
  influence: number
  growth: number
  paidConversion: number
  subscriberDistribution: { tier: string; percentage: number }[]
}

interface ChannelValueAnalysisProps {
  channelId: string
}

export default function ChannelValueAnalysis({ channelId }: ChannelValueAnalysisProps) {
  const [data, setData] = useState<ChannelValueData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setData({
        commercial: 78,
        knowledge: 85,
        social: 72,
        entertainment: 68,
        influence: 82,
        growth: 75,
        paidConversion: 12.5,
        subscriberDistribution: [
          { tier: '核心粉丝(>90天)', percentage: 35 },
          { tier: '活跃用户(30-90天)', percentage: 28 },
          { tier: '普通关注(7-30天)', percentage: 22 },
          { tier: '新关注(<7天)', percentage: 10 },
          { tier: '流失风险', percentage: 5 },
        ],
      })
      setLoading(false)
    }, 800)
  }, [channelId])

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 animate-pulse">
        <div className="h-64 bg-gray-100 rounded-lg"></div>
      </div>
    )
  }

  if (!data) return null

  const radarData = [
    { subject: '商业价值', A: data.commercial, fullMark: 100 },
    { subject: '知识价值', A: data.knowledge, fullMark: 100 },
    { subject: '社会价值', A: data.social, fullMark: 100 },
    { subject: '娱乐价值', A: data.entertainment, fullMark: 100 },
    { subject: '影响力', A: data.influence, fullMark: 100 },
    { subject: '增长潜力', A: data.growth, fullMark: 100 },
  ]

  const getScoreLevel = (score: number) => {
    if (score >= 80) return { text: '优秀', color: 'text-green-600', bg: 'bg-green-100' }
    if (score >= 60) return { text: '良好', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    return { text: '一般', color: 'text-orange-600', bg: 'bg-orange-100' }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <span className="text-2xl">💎</span>
        频道价值分析
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h4 className="text-sm font-semibold text-gray-600 mb-4">多维度价值评估</h4>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                <Radar
                  name="频道评分"
                  dataKey="A"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.3}
                />
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Value Cards */}
        <div className="space-y-4">
          <ValueCard
            title="商业价值"
            score={data.commercial}
            icon="💰"
            description="品牌合作潜力、变现能力、广告价值"
            metrics={[
              { label: '付费转化率', value: `${data.paidConversion}%` },
              { label: '预估CPM', value: '¥45-80' },
            ]}
          />
          <ValueCard
            title="知识价值"
            score={data.knowledge}
            icon="📚"
            description="内容深度、教育意义、信息密度"
            metrics={[
              { label: '完播率', value: '68%' },
              { label: '收藏率', value: '12%' },
            ]}
          />
          <ValueCard
            title="社会价值"
            score={data.social}
            icon="🌍"
            description="社会影响力、公益贡献、正向引导"
            metrics={[
              { label: '正面评价', value: '92%' },
              { label: '分享率', value: '8.5%' },
            ]}
          />
        </div>
      </div>

      {/* Subscriber Distribution */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h4 className="text-sm font-semibold text-gray-600 mb-4 flex items-center gap-2">
          <span>👥</span> 订阅者分布
        </h4>
        <div className="grid grid-cols-5 gap-3">
          {data.subscriberDistribution.map((item, index) => (
            <div key={item.tier} className="text-center">
              <div
                className="text-lg font-bold mb-1"
                style={{ color: `hsl(${200 + index * 30}, 70%, 45%)` }}
              >
                {item.percentage}%
              </div>
              <div className="text-xs text-gray-500">{item.tier}</div>
              <div
                className="h-2 mt-2 rounded-full"
                style={{
                  backgroundColor: `hsl(${200 + index * 30}, 70%, 90%)`,
                }}
              >
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: `hsl(${200 + index * 30}, 70%, 50%)`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Commercial Insights */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200">
        <h4 className="font-semibold text-amber-900 mb-4 flex items-center gap-2">
          <span>💡</span> 商业价值洞察
        </h4>
        <div className="grid grid-cols-3 gap-4">
          <InsightCard
            title="品牌合作估价"
            value="¥8,000-15,000"
            desc="单次视频合作"
            trend="up"
          />
          <InsightCard
            title="月变现潜力"
            value="¥45,000+"
            desc="广告+带货+会员"
            trend="up"
          />
          <InsightCard
            title="粉丝终身价值"
            value="¥28"
            desc="单粉丝平均贡献"
            trend="stable"
          />
        </div>
      </div>
    </div>
  )
}

function ValueCard({
  title,
  score,
  icon,
  description,
  metrics,
}: {
  title: string
  score: number
  icon: string
  description: string
  metrics: { label: string; value: string }[]
}) {
  const level =
    score >= 80
      ? { text: '优秀', color: 'text-green-600', bg: 'bg-green-100' }
      : score >= 60
        ? { text: '良好', color: 'text-yellow-600', bg: 'bg-yellow-100' }
        : { text: '一般', color: 'text-orange-600', bg: 'bg-orange-100' }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <div>
            <h5 className="font-semibold text-gray-900">{title}</h5>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-indigo-600">{score}</div>
          <span className={`text-xs px-2 py-0.5 rounded-full ${level.bg} ${level.color}`}>
            {level.text}
          </span>
        </div>
      </div>
      <div className="flex gap-4 mt-3 pt-3 border-t border-gray-100">
        {metrics.map((m) => (
          <div key={m.label}>
            <div className="text-xs text-gray-500">{m.label}</div>
            <div className="font-semibold text-gray-900">{m.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function InsightCard({
  title,
  value,
  desc,
  trend,
}: {
  title: string
  value: string
  desc: string
  trend: 'up' | 'down' | 'stable'
}) {
  const trendIcon = trend === 'up' ? '↗️' : trend === 'down' ? '↘️' : '➡️'
  const trendColor =
    trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'

  return (
    <div className="text-center p-4 bg-white/70 rounded-lg">
      <div className="text-xs text-amber-700 mb-1">{title}</div>
      <div className="text-xl font-bold text-amber-900">{value}</div>
      <div className="text-xs text-amber-600 flex items-center justify-center gap-1">
        {desc}
        <span className={trendColor}>{trendIcon}</span>
      </div>
    </div>
  )
}
