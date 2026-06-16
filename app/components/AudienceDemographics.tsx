'use client'

import { useMemo } from 'react'

interface GenderData {
  male: number
  female: number
  unknown: number
}

interface AgeGroup {
  range: string
  percentage: number
  color: string
}

interface Interest {
  name: string
  weight: number
  color: string
}

interface Region {
  name: string
  percentage: number
  code: string
}

interface AudienceData {
  gender: GenderData
  ageGroups: AgeGroup[]
  interests: Interest[]
  topRegions: Region[]
}

interface AudienceDemographicsProps {
  data?: AudienceData
}

const defaultData: AudienceData = {
  gender: {
    male: 52.3,
    female: 41.5,
    unknown: 6.2,
  },
  ageGroups: [
    { range: '16岁以下', percentage: 8.5, color: '#f472b6' },
    { range: '16-25岁', percentage: 35.2, color: '#ec4899' },
    { range: '25-40岁', percentage: 42.8, color: '#db2777' },
    { range: '40岁以上', percentage: 13.5, color: '#be185d' },
  ],
  interests: [
    { name: '科技数码', weight: 95, color: '#3b82f6' },
    { name: '游戏娱乐', weight: 88, color: '#8b5cf6' },
    { name: '美食探店', weight: 76, color: '#f59e0b' },
    { name: '旅行户外', weight: 72, color: '#10b981' },
    { name: '影视综艺', weight: 68, color: '#ec4899' },
    { name: '音乐舞蹈', weight: 64, color: '#ef4444' },
    { name: '时尚穿搭', weight: 58, color: '#06b6d4' },
    { name: '运动健身', weight: 54, color: '#84cc16' },
    { name: '学习教育', weight: 48, color: '#6366f1' },
    { name: '生活日常', weight: 42, color: '#71717a' },
  ],
  topRegions: [
    { name: '广东省', percentage: 18.5, code: 'GD' },
    { name: '北京市', percentage: 12.3, code: 'BJ' },
    { name: '上海市', percentage: 11.8, code: 'SH' },
    { name: '浙江省', percentage: 9.6, code: 'ZJ' },
    { name: '江苏省', percentage: 8.2, code: 'JS' },
    { name: '四川省', percentage: 6.9, code: 'SC' },
    { name: '湖北省', percentage: 5.4, code: 'HB' },
    { name: '河南省', percentage: 4.8, code: 'HN' },
  ],
}

function GenderChart({ data }: { data: GenderData }) {
  const total = data.male + data.female + data.unknown

  return (
    <div className="relative w-32 h-32">
      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
        {/* Background */}
        <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="20" />

        {/* Male segment */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="20"
          strokeDasharray={`${(data.male / 100) * 251} 251`}
          className="transition-all duration-500"
        />

        {/* Female segment */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#ec4899"
          strokeWidth="20"
          strokeDasharray={`${(data.female / 100) * 251} 251`}
          strokeDashoffset={-((data.male / 100) * 251)}
          className="transition-all duration-500"
        />

        {/* Unknown segment */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#9ca3af"
          strokeWidth="20"
          strokeDasharray={`${(data.unknown / 100) * 251} 251`}
          strokeDashoffset={-(((data.male + data.female) / 100) * 251)}
          className="transition-all duration-500"
        />
      </svg>

      {/* Center label */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <span className="text-xs text-gray-500">性别分布</span>
        </div>
      </div>
    </div>
  )
}

function AgeBarChart({ data }: { data: AgeGroup[] }) {
  const maxValue = Math.max(...data.map(d => d.percentage))

  return (
    <div className="space-y-3">
      {data.map((group, index) => (
        <div key={index} className="flex items-center gap-3">
          <span className="text-xs text-gray-600 w-16 flex-shrink-0">{group.range}</span>
          <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
              style={{
                width: `${(group.percentage / maxValue) * 100}%`,
                backgroundColor: group.color,
              }}
            >
              <span className="text-[10px] text-white font-medium">{group.percentage}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function WordCloud({ interests }: { interests: Interest[] }) {
  const sortedInterests = useMemo(() => {
    return [...interests].sort((a, b) => b.weight - a.weight)
  }, [interests])

  return (
    <div className="flex flex-wrap gap-2 justify-center p-4">
      {sortedInterests.map((interest, index) => {
        const size = interest.weight > 90 ? 'text-lg' : interest.weight > 75 ? 'text-base' : interest.weight > 60 ? 'text-sm' : 'text-xs'
        const opacity = interest.weight > 75 ? 'opacity-100' : interest.weight > 50 ? 'opacity-80' : 'opacity-60'

        return (
          <span
            key={index}
            className={`${size} ${opacity} px-3 py-1 rounded-full font-medium transition-all duration-300 hover:scale-110 cursor-default`}
            style={{
              backgroundColor: `${interest.color}20`,
              color: interest.color,
              border: `1px solid ${interest.color}40`,
            }}
          >
            {interest.name}
          </span>
        )
      })}
    </div>
  )
}

function RegionChart({ regions }: { regions: Region[] }) {
  const maxValue = Math.max(...regions.map(r => r.percentage))

  return (
    <div className="space-y-2">
      {regions.map((region, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="flex items-center gap-2 w-20 flex-shrink-0">
            <span className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600 font-mono">
              {region.code}
            </span>
            <span className="text-xs text-gray-700">{region.name}</span>
          </div>
          <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-pink-400 to-pink-600"
              style={{ width: `${(region.percentage / maxValue) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-600 w-10 text-right">{region.percentage}%</span>
        </div>
      ))}
    </div>
  )
}

export default function AudienceDemographics({ data = defaultData }: AudienceDemographicsProps) {
  return (
    <div className="glass-panel neon-border rounded-2xl p-5 sm:p-6 glow-hover">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-cyan-400 to-cyan-600" />
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">观众画像</h2>
          <span className="text-xs px-2 py-1 bg-cyan-100 text-cyan-600 rounded-full">用户分析</span>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Gender Distribution */}
        <div className="p-4 bg-gray-50/50 rounded-xl">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">性别分布</h3>
          <div className="flex items-center gap-6">
            <GenderChart data={data.gender} />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm text-gray-600">男性</span>
                <span className="text-sm font-bold text-blue-600">{data.gender.male}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-pink-500" />
                <span className="text-sm text-gray-600">女性</span>
                <span className="text-sm font-bold text-pink-600">{data.gender.female}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gray-400" />
                <span className="text-sm text-gray-600">未知</span>
                <span className="text-sm font-bold text-gray-600">{data.gender.unknown}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Age Distribution */}
        <div className="p-4 bg-gray-50/50 rounded-xl">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">年龄分布</h3>
          <AgeBarChart data={data.ageGroups} />
        </div>

        {/* Interest Word Cloud */}
        <div className="p-4 bg-gray-50/50 rounded-xl lg:col-span-2">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">兴趣分布</h3>
          <WordCloud interests={data.interests} />
        </div>

        {/* Geographic Distribution */}
        <div className="p-4 bg-gray-50/50 rounded-xl lg:col-span-2">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">地域分布</h3>
          <RegionChart regions={data.topRegions} />

          <div className="mt-4 p-3 bg-cyan-50 border border-cyan-100 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-cyan-500 text-lg">🎯</span>
              <div className="text-sm text-cyan-800">
                <span className="font-semibold">受众洞察：</span>
                您的核心受众为 25-40 岁男性用户，主要分布在一二线城市，对科技数码和游戏娱乐内容高度感兴趣。
                建议针对这一群体优化内容策略。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
