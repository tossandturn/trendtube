'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface AudienceAnalyticsProps {
  video?: {
    snippet?: {
      title?: string
      description?: string
      tags?: string[]
      categoryId?: string
    }
    statistics?: {
      viewCount?: string
    }
  }
  channel?: {
    snippet?: {
      title?: string
      description?: string
    }
    statistics?: {
      subscriberCount?: string
      viewCount?: string
    }
  }
}

// Category-based audience estimation
const CATEGORY_DEMOGRAPHICS: Record<string, { male: number; age: string; regions: Record<string, number> }> = {
  '1': { male: 65, age: '18-34', regions: { US: 40, UK: 15, CA: 10, AU: 8, Other: 27 } }, // Film & Animation
  '2': { male: 55, age: '18-34', regions: { US: 35, UK: 12, CA: 8, IN: 10, Other: 35 } }, // Autos & Vehicles
  '10': { male: 60, age: '18-34', regions: { US: 30, UK: 10, CA: 8, DE: 8, Other: 44 } }, // Music
  '15': { male: 45, age: '25-44', regions: { US: 35, UK: 15, CA: 10, AU: 8, Other: 32 } }, // Pets & Animals
  '17': { male: 70, age: '13-34', regions: { US: 25, UK: 8, CA: 6, JP: 12, Other: 49 } }, // Sports
  '18': { male: 75, age: '18-34', regions: { US: 30, UK: 10, CA: 8, KR: 8, Other: 44 } }, // Short Movies
  '19': { male: 50, age: '25-44', regions: { US: 40, UK: 15, CA: 10, AU: 8, Other: 27 } }, // Travel & Events
  '20': { male: 55, age: '18-34', regions: { US: 35, UK: 12, CA: 8, IN: 10, Other: 35 } }, // Gaming
  '21': { male: 45, age: '18-34', regions: { US: 40, UK: 15, CA: 10, AU: 8, Other: 27 } }, // Videoblogging
  '22': { male: 40, age: '25-44', regions: { US: 45, UK: 15, CA: 10, AU: 8, Other: 22 } }, // People & Blogs
  '23': { male: 55, age: '18-34', regions: { US: 35, UK: 10, CA: 8, IN: 15, Other: 32 } }, // Comedy
  '24': { male: 50, age: '18-34', regions: { US: 40, UK: 12, CA: 10, MX: 8, Other: 30 } }, // Entertainment
  '25': { male: 45, age: '25-44', regions: { US: 45, UK: 15, CA: 12, AU: 10, Other: 18 } }, // News & Politics
  '26': { male: 35, age: '25-44', regions: { US: 40, UK: 15, CA: 10, AU: 8, Other: 27 } }, // Howto & Style
  '27': { male: 60, age: '18-34', regions: { US: 35, UK: 10, CA: 8, IN: 12, Other: 35 } }, // Education
  '28': { male: 65, age: '18-34', regions: { US: 40, UK: 12, CA: 10, DE: 8, Other: 30 } }, // Science & Technology
  '29': { male: 50, age: '25-44', regions: { US: 50, UK: 15, CA: 12, AU: 8, Other: 15 } }, // Nonprofits & Activism
}

// Extended interest keywords database with relevance scores and routes
const EXTENDED_KEYWORDS: Record<string, { relevance: number; route: string }> = {
  'Gaming': { relevance: 100, route: '/gaming-youtube-trends' },
  'Technology': { relevance: 98, route: '/youtube-ai-trends' },
  'Tutorial': { relevance: 95, route: '/youtube-video-analyzer' },
  'Entertainment': { relevance: 92, route: '/trends/entertainment' },
  'Music': { relevance: 90, route: '/viral-music-trends' },
  'Education': { relevance: 88, route: '/trends/education' },
  'Vlog': { relevance: 85, route: '/trends/vlog' },
  'Review': { relevance: 82, route: '/youtube-video-analyzer' },
  'Comedy': { relevance: 80, route: '/trends/comedy' },
  'Sports': { relevance: 78, route: '/trends/sports' },
  'Fitness': { relevance: 75, route: '/trends/fitness' },
  'Food': { relevance: 72, route: '/trends/food' },
  'Travel': { relevance: 70, route: '/trends/travel' },
  'Fashion': { relevance: 68, route: '/trends/fashion' },
  'Beauty': { relevance: 65, route: '/trends/beauty' },
  'DIY': { relevance: 62, route: '/trends/diy' },
  'Science': { relevance: 60, route: '/trends/science' },
  'News': { relevance: 58, route: '/trends/news' },
  'Animation': { relevance: 55, route: '/trends/animation' },
  'Documentary': { relevance: 52, route: '/trends/documentary' },
  'Tech Review': { relevance: 95, route: '/youtube-ai-trends' },
  'Unboxing': { relevance: 88, route: '/youtube-video-analyzer' },
  'Challenge': { relevance: 85, route: '/viral-video-ideas' },
  'Reaction': { relevance: 82, route: '/trends/reaction' },
  'Podcast': { relevance: 78, route: '/trends/podcast' },
  'Shorts': { relevance: 95, route: '/youtube-shorts-trends' },
  'Livestream': { relevance: 72, route: '/gaming-youtube-trends' },
  'ASMR': { relevance: 70, route: '/trends/asmr' },
  'Cooking': { relevance: 75, route: '/trends/cooking' },
  'Mukbang': { relevance: 72, route: '/trends/mukbang' },
  'Prank': { relevance: 78, route: '/viral-video-ideas' },
  'Magic': { relevance: 65, route: '/trends/magic' },
  'Dance': { relevance: 80, route: '/viral-music-trends' },
  'Cover': { relevance: 75, route: '/viral-music-trends' },
  'Remix': { relevance: 72, route: '/viral-music-trends' },
  'Parody': { relevance: 70, route: '/trends/parody' },
  'Meme': { relevance: 85, route: '/viral-video-ideas' },
  'Trend': { relevance: 90, route: '/youtube-trends' },
  'Viral': { relevance: 88, route: '/viral-video-ideas' },
  'How-To': { relevance: 92, route: '/youtube-video-analyzer' },
  'Guide': { relevance: 88, route: '/trends/guide' },
  'Tips': { relevance: 85, route: '/trends/tips' },
  'Tricks': { relevance: 82, route: '/trends/tricks' },
  'Hacks': { relevance: 80, route: '/trends/hacks' },
  'Comparison': { relevance: 78, route: '/youtube-video-analyzer' },
  'Test': { relevance: 75, route: '/youtube-video-analyzer' },
  'Experiment': { relevance: 77, route: '/viral-video-ideas' },
  'Speedrun': { relevance: 90, route: '/gaming-youtube-trends' },
  'Walkthrough': { relevance: 85, route: '/gaming-youtube-trends' },
  'Gameplay': { relevance: 88, route: '/gaming-youtube-trends' },
  "Let's Play": { relevance: 82, route: '/gaming-youtube-trends' },
  'Esports': { relevance: 80, route: '/gaming-youtube-trends' },
  'Montage': { relevance: 75, route: '/gaming-youtube-trends' },
  'Highlight': { relevance: 78, route: '/gaming-youtube-trends' },
  'Stream': { relevance: 72, route: '/gaming-youtube-trends' },
  'Commentary': { relevance: 70, route: '/gaming-youtube-trends' },
}

// Keyword-based interest mapping
const INTEREST_KEYWORDS: Record<string, string[]> = {
  'Gaming': ['game', 'gaming', 'gameplay', 'playthrough', 'minecraft', 'fortnite', 'roblox', 'gta', 'speedrun', 'walkthrough'],
  'Technology': ['tech', 'technology', 'gadget', 'review', 'unboxing', 'iphone', 'android', 'ai', 'software', 'app'],
  'Entertainment': ['funny', 'comedy', 'prank', 'challenge', 'reaction', 'meme', 'entertainment'],
  'Music': ['music', 'song', 'album', 'concert', 'cover', 'remix', 'dance', 'viral music'],
  'Education': ['learn', 'tutorial', 'how to', 'lesson', 'course', 'study', 'explained', 'guide', 'tips'],
  'Sports': ['sports', 'football', 'basketball', 'soccer', 'nfl', 'nba', 'highlights', 'fitness'],
  'Lifestyle': ['vlog', 'travel', 'food', 'cooking', 'fashion', 'beauty', 'makeup', 'lifestyle'],
  'Science': ['science', 'experiment', 'documentary', 'education', 'knowledge'],
  'News': ['news', 'politics', 'current events', 'update', 'breaking'],
}

function estimateDemographics(video?: AudienceAnalyticsProps['video'], channel?: AudienceAnalyticsProps['channel']) {
  // Get base data
  const title = (video?.snippet?.title || channel?.snippet?.title || '').toLowerCase()
  const description = (video?.snippet?.description || channel?.snippet?.description || '').toLowerCase()
  const tags = video?.snippet?.tags || []
  const categoryId = video?.snippet?.categoryId || '24' // Default to Entertainment
  const viewCount = parseInt(video?.statistics?.viewCount || '0')

  // Get base demographics from category
  const baseDemo = CATEGORY_DEMOGRAPHICS[categoryId] || CATEGORY_DEMOGRAPHICS['24']

  // Adjust based on keywords
  let malePercentage = baseDemo.male
  let ageGroups = { '13-17': 15, '18-24': 30, '25-34': 35, '35-44': 15, '45+': 5 }

  // Age adjustments based on content
  if (title.includes('kids') || title.includes('toy') || title.includes('minecraft') || tags.some(t => t.includes('kids'))) {
    ageGroups = { '13-17': 50, '18-24': 25, '25-34': 15, '35-44': 7, '45+': 3 }
    malePercentage = 60
  } else if (title.includes('tutorial') || title.includes('how to') || title.includes('learn')) {
    ageGroups = { '13-17': 10, '18-24': 35, '25-34': 40, '35-44': 12, '45+': 3 }
  } else if (title.includes('news') || title.includes('politics')) {
    ageGroups = { '13-17': 5, '18-24': 15, '25-34': 30, '35-44': 30, '45+': 20 }
    malePercentage = 55
  }

  // Gender adjustments
  if (title.includes('makeup') || title.includes('beauty') || title.includes('fashion') || tags.some(t => ['beauty', 'makeup', 'fashion'].includes(t))) {
    malePercentage = 25
  } else if (title.includes('gaming') || title.includes('tech') || tags.some(t => ['gaming', 'tech'].includes(t))) {
    malePercentage = 75
  }

  // Region distribution (adjust based on language/region indicators)
  const regions = { ...baseDemo.regions }
  if (title.includes('uk') || title.includes('british') || description.includes('uk')) {
    regions.UK = (regions.UK || 0) + 20
    regions.US = Math.max(20, (regions.US || 0) - 20)
  }

  // Calculate interests from keywords
  const interests: Record<string, number> = {}
  for (const [category, keywords] of Object.entries(INTEREST_KEYWORDS)) {
    let score = 0
    for (const keyword of keywords) {
      if (title.includes(keyword)) score += 3
      if (description.includes(keyword)) score += 2
      if (tags.some(t => t.toLowerCase().includes(keyword))) score += 4
    }
    if (score > 0) interests[category] = score
  }

  // Normalize interests
  const sortedInterests = Object.entries(interests)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, score]) => ({ name, score }))

  return {
    gender: { male: malePercentage, female: 100 - malePercentage },
    ageGroups,
    regions,
    interests: sortedInterests.length > 0 ? sortedInterests : [
      { name: 'Entertainment', score: 30 },
      { name: 'Lifestyle', score: 25 },
      { name: 'Social Media', score: 20 },
    ],
  }
}

export default function AudienceAnalytics({ video, channel }: AudienceAnalyticsProps) {
  const data = useMemo(() => estimateDemographics(video, channel), [video, channel])

  const regionData = Object.entries(data.regions).map(([name, value]) => ({
    name,
    value,
    color: name === 'US' ? '#3B82F6' : name === 'UK' ? '#EF4444' : name === 'CA' ? '#10B981' : name === 'AU' ? '#F59E0B' : '#6B7280',
  }))

  const genderData = [
    { name: 'Male', value: data.gender.male, color: '#60A5FA' },
    { name: 'Female', value: data.gender.female, color: '#F472B6' },
  ]

  const ageData = Object.entries(data.ageGroups).map(([name, value]) => ({
    name,
    value,
  }))

  const maxInterestScore = Math.max(...data.interests.map(i => i.score), 1)

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <span className="text-2xl">👥</span>
        Audience Demographics
        <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-700">Public-data estimate</span>
      </h3>
      <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
        Audience geography, gender, age, and interest data are inferred from public category, title, description, tags, and channel context. Private YouTube Studio audience data is not available here.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geographic Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h4 className="text-sm font-semibold text-gray-600 mb-4 flex items-center gap-2">
            <span>🌍</span> Geographic Distribution
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {regionData.slice(0, 3).map((region) => (
              <div key={region.name} className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500">{region.name}</div>
                <div className="font-bold text-lg" style={{ color: region.color }}>
                  {region.value}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Age & Gender Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          {/* Gender Distribution */}
          <h4 className="text-sm font-semibold text-gray-600 mb-4 flex items-center gap-2">
            <span>⚤</span> Gender Distribution
          </h4>
          <div className="h-40 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Age Distribution */}
          <h4 className="text-sm font-semibold text-gray-600 mb-4 flex items-center gap-2">
            <span>📊</span> Age Distribution
          </h4>
          <div className="space-y-3">
            {ageData.map((age) => (
              <div key={age.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{age.name}</span>
                  <span className="font-semibold text-gray-900">{age.value}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
                    style={{ width: `${age.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interest Keywords - Clickable Word Cloud */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
          <h4 className="text-sm font-semibold text-gray-600 mb-4 flex items-center gap-2">
            <span>☁️</span> Audience Interests
          </h4>
          <div className="flex flex-wrap gap-3 justify-center">
            {data.interests.map((interest, index) => {
              const keywordData = EXTENDED_KEYWORDS[interest.name]
              const size = Math.max(12, Math.min(28, 12 + (interest.score / maxInterestScore) * 16))
              // Use keywordData route or generate proper slug for /trends/
              const route = keywordData?.route || `/trends/${interest.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`
              return (
                <Link
                  key={interest.name}
                  href={route}
                  className="px-4 py-2 rounded-full font-medium transition-all hover:scale-110 hover:shadow-md cursor-pointer inline-block"
                  style={{
                    fontSize: `${size}px`,
                    backgroundColor: `hsl(${200 + index * 15}, 70%, ${85 - (interest.score / maxInterestScore) * 20}%)`,
                    color: `hsl(${200 + index * 15}, 80%, 25%)`,
                  }}
                >
                  {interest.name}
                </Link>
              )
            })}
            {/* Add extra keywords from EXTENDED_KEYWORDS that weren't matched */}
            {Object.entries(EXTENDED_KEYWORDS)
              .filter(([name]) => !data.interests.some(i => i.name === name))
              .slice(0, 15)
              .map(([name, data], index) => {
                const size = Math.max(10, Math.min(20, 10 + (data.relevance / 100) * 10))
                return (
                  <Link
                    key={name}
                    href={data.route}
                    className="px-3 py-1.5 rounded-full font-medium transition-all hover:scale-110 hover:shadow-md cursor-pointer inline-block opacity-70"
                    style={{
                      fontSize: `${size}px`,
                      backgroundColor: `hsl(${300 + index * 10}, 60%, 90%)`,
                      color: `hsl(${300 + index * 10}, 70%, 30%)`,
                    }}
                  >
                    {name}
                  </Link>
                )
              })}
          </div>
          <p className="text-xs text-gray-500 text-center mt-4">
            Based on video content, tags, and category analysis. Click any keyword to explore related trends.
          </p>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
        <h4 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
          <span>💡</span> Audience Insights
        </h4>
        <ul className="space-y-2 text-sm text-indigo-800">
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>Primary audience is {data.gender.male > data.gender.female ? 'male' : 'female'} ({Math.max(data.gender.male, data.gender.female)}%) in the {Object.entries(data.ageGroups).sort((a,b) => b[1] - a[1])[0][0]} age group</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>Top geographic market: {regionData.sort((a,b) => b.value - a.value)[0]?.name} ({regionData.sort((a,b) => b.value - a.value)[0]?.value}%)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500 mt-0.5">!</span>
            <span>Content resonates with {data.interests[0]?.name || 'Entertainment'} enthusiasts</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
