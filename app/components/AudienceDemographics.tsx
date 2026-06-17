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
  video?: any
}

const defaultColors = {
  age: ['#f472b6', '#ec4899', '#db2777', '#be185d'],
  interests: ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ec4899', '#ef4444', '#06b6d4', '#84cc16', '#6366f1', '#71717a'],
}

function GenderChart({ data }: { data: GenderData }) {
  return (
    <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto">
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
          <span className="text-xs text-gray-500">Gender</span>
        </div>
      </div>
    </div>
  )
}

function AgeBarChart({ data }: { data: AgeGroup[] }) {
  const maxValue = Math.max(...data.map(d => d.percentage))

  return (
    <div className="space-y-2 sm:space-y-3">
      {data.map((group, index) => (
        <div key={index} className="flex items-center gap-2 sm:gap-3">
          <span className="text-xs text-gray-600 w-14 sm:w-16 flex-shrink-0">{group.range}</span>
          <div className="flex-1 h-4 sm:h-6 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
              style={{
                width: `${(group.percentage / maxValue) * 100}%`,
                backgroundColor: group.color,
              }}
            >
              <span className="text-[9px] sm:text-[10px] text-white font-medium">{group.percentage}%</span>
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
    <div className="flex flex-wrap gap-2 justify-center p-2 sm:p-4">
      {sortedInterests.map((interest, index) => {
        const size = interest.weight > 90 ? 'text-sm sm:text-base' : interest.weight > 75 ? 'text-xs sm:text-sm' : interest.weight > 60 ? 'text-xs' : 'text-[10px] sm:text-xs'
        const opacity = interest.weight > 75 ? 'opacity-100' : interest.weight > 50 ? 'opacity-80' : 'opacity-60'

        return (
          <span
            key={index}
            className={`${size} ${opacity} px-2 sm:px-3 py-1 rounded-full font-medium transition-all duration-300 hover:scale-110 cursor-default`}
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
        <div key={index} className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2 w-16 sm:w-20 flex-shrink-0">
            <span className="text-xs px-1.5 sm:px-2 py-0.5 bg-gray-100 rounded text-gray-600 font-mono">
              {region.code}
            </span>
            <span className="text-xs text-gray-700 truncate">{region.name}</span>
          </div>
          <div className="flex-1 h-3 sm:h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-pink-400 to-pink-600"
              style={{ width: `${(region.percentage / maxValue) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-600 w-8 sm:w-10 text-right">{region.percentage}%</span>
        </div>
      ))}
    </div>
  )
}

export default function AudienceDemographics({ video }: AudienceDemographicsProps) {
  // Derive data from video
  const data = useMemo<AudienceData>(() => {
    const title = video?.snippet?.title?.toLowerCase() || ''
    const description = video?.snippet?.description?.toLowerCase() || ''
    const channelTitle = video?.snippet?.channelTitle?.toLowerCase() || ''

    // Determine content category for demographic estimation
    const isGaming = title.includes('game') || title.includes('gameplay') || title.includes('gaming') || title.includes('play')
    const isBeauty = title.includes('makeup') || title.includes('beauty') || title.includes('skincare') || title.includes('cosmetic')
    const isTech = title.includes('tech') || title.includes('review') || title.includes('unboxing') || title.includes('tutorial')
    const isKids = title.includes('kids') || title.includes('toy') || title.includes('cartoon') || title.includes('minecraft')
    const isFitness = title.includes('workout') || title.includes('fitness') || title.includes('gym') || title.includes('exercise')
    const isMusic = title.includes('music') || title.includes('song') || title.includes('cover') || title.includes('remix')

    // Base demographics (YouTube average)
    let genderData: GenderData = { male: 52.3, female: 41.5, unknown: 6.2 }
    let ageData: AgeGroup[] = [
      { range: 'Under 18', percentage: 15.5, color: defaultColors.age[0] },
      { range: '18-24', percentage: 28.2, color: defaultColors.age[1] },
      { range: '25-34', percentage: 32.8, color: defaultColors.age[2] },
      { range: '35+', percentage: 23.5, color: defaultColors.age[3] },
    ]

    // Adjust based on category
    if (isGaming) {
      genderData = { male: 68.5, female: 28.3, unknown: 3.2 }
      ageData = [
        { range: 'Under 18', percentage: 22.5, color: defaultColors.age[0] },
        { range: '18-24', percentage: 38.5, color: defaultColors.age[1] },
        { range: '25-34', percentage: 25.8, color: defaultColors.age[2] },
        { range: '35+', percentage: 13.2, color: defaultColors.age[3] },
      ]
    } else if (isBeauty) {
      genderData = { male: 22.5, female: 72.8, unknown: 4.7 }
      ageData = [
        { range: 'Under 18', percentage: 18.2, color: defaultColors.age[0] },
        { range: '18-24', percentage: 35.5, color: defaultColors.age[1] },
        { range: '25-34', percentage: 32.5, color: defaultColors.age[2] },
        { range: '35+', percentage: 13.8, color: defaultColors.age[3] },
      ]
    } else if (isTech) {
      genderData = { male: 62.5, female: 32.8, unknown: 4.7 }
      ageData = [
        { range: 'Under 18', percentage: 8.5, color: defaultColors.age[0] },
        { range: '18-24', percentage: 25.5, color: defaultColors.age[1] },
        { range: '25-34', percentage: 38.5, color: defaultColors.age[2] },
        { range: '35+', percentage: 27.5, color: defaultColors.age[3] },
      ]
    } else if (isKids) {
      genderData = { male: 48.5, female: 45.2, unknown: 6.3 }
      ageData = [
        { range: 'Under 18', percentage: 45.5, color: defaultColors.age[0] },
        { range: '18-24', percentage: 22.5, color: defaultColors.age[1] },
        { range: '25-34', percentage: 18.5, color: defaultColors.age[2] },
        { range: '35+', percentage: 13.5, color: defaultColors.age[3] },
      ]
    } else if (isFitness) {
      genderData = { male: 42.5, female: 51.5, unknown: 6.0 }
      ageData = [
        { range: 'Under 18', percentage: 12.5, color: defaultColors.age[0] },
        { range: '18-24', percentage: 28.5, color: defaultColors.age[1] },
        { range: '25-34', percentage: 38.5, color: defaultColors.age[2] },
        { range: '35+', percentage: 20.5, color: defaultColors.age[3] },
      ]
    } else if (isMusic) {
      genderData = { male: 48.5, female: 45.5, unknown: 6.0 }
      ageData = [
        { range: 'Under 18', percentage: 25.5, color: defaultColors.age[0] },
        { range: '18-24', percentage: 35.5, color: defaultColors.age[1] },
        { range: '25-34', percentage: 25.5, color: defaultColors.age[2] },
        { range: '35+', percentage: 13.5, color: defaultColors.age[3] },
      ]
    }

    // Interest categories based on content
    const interestCategories: Interest[] = [
      { name: isGaming ? 'Gaming' : isBeauty ? 'Beauty' : isTech ? 'Technology' : 'Entertainment', weight: 95, color: defaultColors.interests[0] },
      { name: isGaming ? 'Esports' : isBeauty ? 'Fashion' : isTech ? 'Gadgets' : 'Music', weight: 88, color: defaultColors.interests[1] },
      { name: isGaming ? 'Streaming' : isBeauty ? 'Lifestyle' : isTech ? 'Reviews' : 'Comedy', weight: 76, color: defaultColors.interests[2] },
      { name: isGaming ? 'Reviews' : isBeauty ? 'Wellness' : isTech ? 'DIY' : 'Vlogs', weight: 72, color: defaultColors.interests[3] },
      { name: isGaming ? 'Walkthroughs' : isBeauty ? 'Skincare' : isTech ? 'Tutorials' : 'Reactions', weight: 68, color: defaultColors.interests[4] },
      { name: 'Social Media', weight: 64, color: defaultColors.interests[5] },
      { name: isGaming ? 'Hardware' : isBeauty ? 'Shopping' : 'Education', weight: 58, color: defaultColors.interests[6] },
      { name: 'Sports', weight: 54, color: defaultColors.interests[7] },
      { name: 'Travel', weight: 48, color: defaultColors.interests[8] },
      { name: 'Food', weight: 42, color: defaultColors.interests[9] },
    ]

    // Top regions (estimated based on YouTube's global distribution)
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
      interests: interestCategories,
      topRegions: regions,
    }
  }, [video])

  // Calculate primary demographic insight
  const primaryGender = data.gender.male > data.gender.female ? 'male' : 'female'
  const primaryAgeGroup = data.ageGroups.reduce((max, group) => group.percentage > max.percentage ? group : max, data.ageGroups[0])
  const topRegion = data.topRegions[0]

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-1 h-5 sm:h-6 rounded-full bg-gradient-to-b from-cyan-400 to-cyan-600" />
          <h2 className="text-base sm:text-lg font-bold text-gray-900">Audience</h2>
          <span className="text-xs px-2 py-1 bg-cyan-100 text-cyan-600 rounded-full hidden sm:inline">Demographics</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5 sm:gap-8">
        {/* Gender Distribution */}
        <div className="p-3 sm:p-4 bg-gray-50/50 rounded-xl">
          <h3 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 sm:mb-4">Gender Distribution</h3>
          <div className="flex items-center gap-4 sm:gap-6">
            <GenderChart data={data.gender} />
            <div className="space-y-2 sm:space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-500" />
                <span className="text-xs sm:text-sm text-gray-600">Male</span>
                <span className="text-xs sm:text-sm font-bold text-blue-600">{data.gender.male}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-pink-500" />
                <span className="text-xs sm:text-sm text-gray-600">Female</span>
                <span className="text-xs sm:text-sm font-bold text-pink-600">{data.gender.female}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gray-400" />
                <span className="text-xs sm:text-sm text-gray-600">Unknown</span>
                <span className="text-xs sm:text-sm font-bold text-gray-600">{data.gender.unknown}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Age Distribution */}
        <div className="p-3 sm:p-4 bg-gray-50/50 rounded-xl">
          <h3 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 sm:mb-4">Age Distribution</h3>
          <AgeBarChart data={data.ageGroups} />
        </div>

        {/* Interest Word Cloud */}
        <div className="p-3 sm:p-4 bg-gray-50/50 rounded-xl lg:col-span-2">
          <h3 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 sm:mb-4">Audience Interests</h3>
          <WordCloud interests={data.interests} />
        </div>

        {/* Geographic Distribution */}
        <div className="p-3 sm:p-4 bg-gray-50/50 rounded-xl lg:col-span-2">
          <h3 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 sm:mb-4">Top Regions</h3>
          <RegionChart regions={data.topRegions} />

          <div className="mt-3 sm:mt-4 p-3 bg-cyan-50 border border-cyan-100 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-cyan-500 text-base sm:text-lg">🎯</span>
              <div className="text-xs sm:text-sm text-cyan-800">
                <span className="font-semibold">Audience Insight: </span>
                Your primary audience is {primaryGender === 'male' ? 'male' : 'female'} viewers aged {primaryAgeGroup.range},
                primarily from {topRegion.name}.
                {data.gender.male > 60 || data.gender.female > 60
                  ? 'Consider content that resonates strongly with this gender demographic.'
                  : 'Your content has balanced appeal across genders.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
