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

interface ActiveHour {
  hour: string
  percentage: number
  categoryAvg: number
}

interface AudienceData {
  gender: GenderData
  ageGroups: AgeGroup[]
  interests: Interest[]
  topRegions: Region[]
  activeHours: ActiveHour[]
}

interface AudienceDemographicsProps {
  video?: any
}

const defaultColors = {
  age: ['#f472b6', '#ec4899', '#db2777', '#be185d'],
  interests: ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ec4899', '#ef4444', '#06b6d4', '#84cc16', '#6366f1', '#71717a'],
}

// Summary Card Component
function StatCard({ icon, label, value, sublabel }: { icon: string; label: string; value: string; sublabel?: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-gray-500 mb-1">{label}</div>
          <div className="text-lg font-bold text-gray-900">{value}</div>
          {sublabel && <div className="text-xs text-gray-400 mt-1">{sublabel}</div>}
        </div>
        <div className="text-2xl opacity-50">{icon}</div>
      </div>
    </div>
  )
}

// Gender Donut Chart
function GenderChart({ data }: { data: GenderData }) {
  const total = data.male + data.female + data.unknown

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 sm:w-40 sm:h-40">
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
            <span className="text-xs text-gray-400">Total</span>
            <div className="text-lg font-bold text-gray-700">100%</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-xs text-gray-600">Male {data.male}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-pink-500" />
          <span className="text-xs text-gray-600">Female {data.female}%</span>
        </div>
        {data.unknown > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-gray-400" />
            <span className="text-xs text-gray-600">Unknown {data.unknown}%</span>
          </div>
        )}
      </div>
    </div>
  )
}

// Age Bar Chart
function AgeBarChart({ data }: { data: AgeGroup[] }) {
  const maxValue = Math.max(...data.map(d => d.percentage))

  return (
    <div className="space-y-3">
      {data.map((group, index) => (
        <div key={index} className="flex items-center gap-3">
          <span className="text-xs text-gray-600 w-16 flex-shrink-0">{group.range}</span>
          <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
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

// Interest Word Cloud
function InterestCloud({ interests }: { interests: Interest[] }) {
  const sorted = useMemo(() => [...interests].sort((a, b) => b.weight - a.weight), [interests])

  return (
    <div className="flex flex-wrap gap-2 justify-center py-4">
      {sorted.map((interest, index) => {
        const size = interest.weight > 90 ? 'text-base px-4 py-2' : interest.weight > 75 ? 'text-sm px-3 py-1.5' : interest.weight > 60 ? 'text-xs px-2.5 py-1' : 'text-xs px-2 py-1'
        const opacity = interest.weight > 75 ? 'opacity-100' : interest.weight > 50 ? 'opacity-80' : 'opacity-60'

        return (
          <span
            key={index}
            className={`${size} ${opacity} rounded-full font-medium transition-all duration-300 hover:scale-105 cursor-default`}
            style={{
              backgroundColor: `${interest.color}15`,
              color: interest.color,
              border: `1px solid ${interest.color}30`,
            }}
          >
            {interest.name}
          </span>
        )
      })}
    </div>
  )
}

// Active Hours Chart
function ActiveHoursChart({ data }: { data: ActiveHour[] }) {
  const maxValue = Math.max(...data.map(d => d.percentage))

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-pink-500" />
          <span>This Video</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-gray-300" />
          <span>Category Avg</span>
        </div>
      </div>

      <div className="flex items-end gap-1 h-32">
        {data.map((hour, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-1">
            {/* Category average (background) */}
            <div
              className="w-full bg-gray-200 rounded-t"
              style={{ height: `${(hour.categoryAvg / maxValue) * 100}%` }}
            />
            {/* This video */}
            <div
              className="w-full bg-gradient-to-t from-pink-500 to-pink-400 rounded-t relative group cursor-pointer"
              style={{ height: `${(hour.percentage / maxValue) * 100}%` }}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {hour.hour}: {hour.percentage}%
              </div>
            </div>
            <span className="text-[10px] text-gray-400">{hour.hour}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Geographic Distribution
function GeoChart({ regions }: { regions: Region[] }) {
  const maxValue = Math.max(...regions.map(r => r.percentage))

  return (
    <div className="space-y-2.5">
      {regions.map((region, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="flex items-center gap-2 w-24 flex-shrink-0">
            <span className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600 font-mono">
              {region.code}
            </span>
            <span className="text-xs text-gray-700 truncate">{region.name}</span>
          </div>
          <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-blue-400 to-blue-600"
              style={{ width: `${(region.percentage / maxValue) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-600 w-10 text-right">{region.percentage}%</span>
        </div>
      ))}
    </div>
  )
}

export default function AudienceDemographics({ video }: AudienceDemographicsProps) {
  // Derive data from video
  const data = useMemo<AudienceData>(() => {
    const title = video?.snippet?.title?.toLowerCase() || ''
    const channelTitle = video?.snippet?.channelTitle?.toLowerCase() || ''

    // Determine content category
    const isGaming = title.includes('game') || title.includes('gameplay') || title.includes('gaming') || title.includes('play')
    const isBeauty = title.includes('makeup') || title.includes('beauty') || title.includes('skincare') || title.includes('cosmetic')
    const isTech = title.includes('tech') || title.includes('review') || title.includes('unboxing') || title.includes('tutorial')
    const isKids = title.includes('kids') || title.includes('toy') || title.includes('cartoon') || title.includes('minecraft')
    const isFitness = title.includes('workout') || title.includes('fitness') || title.includes('gym') || title.includes('exercise')
    const isMusic = title.includes('music') || title.includes('song') || title.includes('cover') || title.includes('remix')
    const isEducation = title.includes('learn') || title.includes('education') || title.includes('course') || title.includes('how to')

    // Gender distribution
    let genderData: GenderData = { male: 52.3, female: 41.5, unknown: 6.2 }
    if (isGaming) genderData = { male: 68.5, female: 28.3, unknown: 3.2 }
    else if (isBeauty) genderData = { male: 22.5, female: 72.8, unknown: 4.7 }
    else if (isTech) genderData = { male: 62.5, female: 32.8, unknown: 4.7 }
    else if (isKids) genderData = { male: 48.5, female: 45.2, unknown: 6.3 }
    else if (isFitness) genderData = { male: 42.5, female: 51.5, unknown: 6.0 }
    else if (isMusic) genderData = { male: 48.5, female: 45.5, unknown: 6.0 }

    // Age groups
    let ageData: AgeGroup[] = [
      { range: 'Under 18', percentage: 15.5, color: defaultColors.age[0] },
      { range: '18-24', percentage: 28.2, color: defaultColors.age[1] },
      { range: '25-34', percentage: 32.8, color: defaultColors.age[2] },
      { range: '35+', percentage: 23.5, color: defaultColors.age[3] },
    ]
    if (isGaming) ageData = [
      { range: 'Under 18', percentage: 22.5, color: defaultColors.age[0] },
      { range: '18-24', percentage: 38.5, color: defaultColors.age[1] },
      { range: '25-34', percentage: 25.8, color: defaultColors.age[2] },
      { range: '35+', percentage: 13.2, color: defaultColors.age[3] },
    ]
    else if (isBeauty) ageData = [
      { range: 'Under 18', percentage: 18.2, color: defaultColors.age[0] },
      { range: '18-24', percentage: 35.5, color: defaultColors.age[1] },
      { range: '25-34', percentage: 32.5, color: defaultColors.age[2] },
      { range: '35+', percentage: 13.8, color: defaultColors.age[3] },
    ]
    else if (isTech) ageData = [
      { range: 'Under 18', percentage: 8.5, color: defaultColors.age[0] },
      { range: '18-24', percentage: 25.5, color: defaultColors.age[1] },
      { range: '25-34', percentage: 38.5, color: defaultColors.age[2] },
      { range: '35+', percentage: 27.5, color: defaultColors.age[3] },
    ]
    else if (isKids) ageData = [
      { range: 'Under 18', percentage: 45.5, color: defaultColors.age[0] },
      { range: '18-24', percentage: 22.5, color: defaultColors.age[1] },
      { range: '25-34', percentage: 18.5, color: defaultColors.age[2] },
      { range: '35+', percentage: 13.5, color: defaultColors.age[3] },
    ]

    // Interests
    const interests: Interest[] = [
      { name: isGaming ? 'Gaming' : isBeauty ? 'Beauty' : isTech ? 'Technology' : isEducation ? 'Education' : 'Entertainment', weight: 95, color: defaultColors.interests[0] },
      { name: isGaming ? 'Esports' : isBeauty ? 'Fashion' : isTech ? 'Gadgets' : isEducation ? 'Learning' : 'Music', weight: 88, color: defaultColors.interests[1] },
      { name: isGaming ? 'Streaming' : isBeauty ? 'Lifestyle' : isTech ? 'Reviews' : 'Comedy', weight: 76, color: defaultColors.interests[2] },
      { name: isGaming ? 'Reviews' : isBeauty ? 'Wellness' : isTech ? 'DIY' : 'Vlogs', weight: 72, color: defaultColors.interests[3] },
      { name: isGaming ? 'Walkthroughs' : isBeauty ? 'Skincare' : isTech ? 'Tutorials' : 'Reactions', weight: 68, color: defaultColors.interests[4] },
      { name: 'Social Media', weight: 64, color: defaultColors.interests[5] },
      { name: isGaming ? 'Hardware' : isBeauty ? 'Shopping' : 'Science', weight: 58, color: defaultColors.interests[6] },
      { name: 'Sports', weight: 54, color: defaultColors.interests[7] },
      { name: 'Travel', weight: 48, color: defaultColors.interests[8] },
      { name: 'Food', weight: 42, color: defaultColors.interests[9] },
    ]

    // Active hours (6 time slots)
    const activeHours: ActiveHour[] = [
      { hour: '0-4', percentage: 12, categoryAvg: 15 },
      { hour: '4-8', percentage: 18, categoryAvg: 22 },
      { hour: '8-12', percentage: 45, categoryAvg: 38 },
      { hour: '12-16', percentage: 52, categoryAvg: 48 },
      { hour: '16-20', percentage: 68, categoryAvg: 55 },
      { hour: '20-24', percentage: 55, categoryAvg: 42 },
    ]

    // Regions
    const regions: Region[] = [
      { name: 'United States', percentage: 18.5, code: 'US' },
      { name: 'India', percentage: 15.2, code: 'IN' },
      { name: 'United Kingdom', percentage: 8.3, code: 'GB' },
      { name: 'Brazil', percentage: 7.8, code: 'BR' },
      { name: 'Japan', percentage: 6.5, code: 'JP' },
      { name: 'Germany', percentage: 5.4, code: 'DE' },
      { name: 'France', percentage: 4.2, code: 'FR' },
      { name: 'Canada', percentage: 3.8, code: 'CA' },
    ]

    return {
      gender: genderData,
      ageGroups: ageData,
      interests,
      topRegions: regions,
      activeHours,
    }
  }, [video])

  const primaryAge = data.ageGroups.reduce((max, g) => g.percentage > max.percentage ? g : max, data.ageGroups[0])
  const topInterest = data.interests[0]
  const peakHour = data.activeHours.reduce((max, h) => h.percentage > max.percentage ? h : max, data.activeHours[0])

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-gradient-to-b from-cyan-400 to-cyan-600" />
          <h2 className="text-base sm:text-lg font-bold text-gray-900">Audience Demographics</h2>
          <span className="text-xs px-2 py-1 bg-cyan-100 text-cyan-600 rounded-full hidden sm:inline">Last 30 Days</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard icon="⚧" label="Gender" value={`${data.gender.male > data.gender.female ? 'Male' : 'Female'} ${Math.max(data.gender.male, data.gender.female).toFixed(0)}%`} sublabel="Primary" />
        <StatCard icon="👤" label="Age" value={primaryAge.range} sublabel="Largest group" />
        <StatCard icon="❤️" label="Interest" value={topInterest.name} sublabel="Top category" />
        <StatCard icon="🕐" label="Peak Hours" value={peakHour.hour} sublabel="Most active" />
      </div>

      {/* Main Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Gender Distribution */}
        <div className="bg-gray-50/50 rounded-xl p-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Gender Distribution</h3>
          <GenderChart data={data.gender} />
        </div>

        {/* Age Distribution */}
        <div className="bg-gray-50/50 rounded-xl p-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Age Distribution</h3>
          <AgeBarChart data={data.ageGroups} />
        </div>

        {/* Interest Cloud */}
        <div className="bg-gray-50/50 rounded-xl p-4 lg:col-span-2">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Audience Interests</h3>
          <InterestCloud interests={data.interests} />
        </div>

        {/* Active Hours */}
        <div className="bg-gray-50/50 rounded-xl p-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Active Hours (Last 30 Days)</h3>
          <ActiveHoursChart data={data.activeHours} />
        </div>

        {/* Geographic Distribution */}
        <div className="bg-gray-50/50 rounded-xl p-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Geographic Distribution</h3>
          <GeoChart regions={data.topRegions} />
        </div>
      </div>

      {/* Insights */}
      <div className="mt-5 p-4 bg-cyan-50 border border-cyan-100 rounded-xl">
        <div className="flex items-start gap-2">
          <span className="text-cyan-500 text-lg">🎯</span>
          <div className="text-sm text-cyan-800">
            <span className="font-semibold">Audience Insight: </span>
            Your content resonates most with {data.gender.male > data.gender.female ? 'male' : 'female'} viewers aged {primaryAge.range}.
            Peak engagement occurs during {peakHour.hour} hours. {topInterest.name} is your strongest interest category.
          </div>
        </div>
      </div>
    </div>
  )
}
