'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface AudienceData {
  regions: { name: string; value: number; color: string }[]
  ageGroups: { name: string; value: number }[]
  gender: { name: string; value: number; color: string }[]
  interests: { text: string; size: number }[]
}

interface AudienceAnalyticsProps {
  videoId?: string
  channelId?: string
}

export default function AudienceAnalytics({ videoId, channelId }: AudienceAnalyticsProps) {
  // Simulated data - in production this would come from API
  const data: AudienceData = {
    regions: [
      { name: 'Mainland China', value: 45, color: '#FF6B6B' },
      { name: 'United States', value: 20, color: '#4ECDC4' },
      { name: 'Japan', value: 12, color: '#45B7D1' },
      { name: 'Korea', value: 8, color: '#96CEB4' },
      { name: 'Europe', value: 10, color: '#FECA57' },
      { name: 'Other', value: 5, color: '#DDA0DD' },
    ],
    ageGroups: [
      { name: '18-24', value: 35 },
      { name: '25-34', value: 40 },
      { name: '35-44', value: 15 },
      { name: '45+', value: 10 },
    ],
    gender: [
      { name: 'Male', value: 58, color: '#74B9FF' },
      { name: 'Female', value: 42, color: '#FD79A8' },
    ],
    interests: [
      { text: 'Tech', size: 40 },
      { text: 'Gaming', size: 35 },
      { text: 'Knowledge', size: 30 },
      { text: 'Entertainment', size: 28 },
      { text: 'Food', size: 25 },
      { text: 'Travel', size: 22 },
      { text: 'Music', size: 20 },
      { text: 'Sports', size: 18 },
      { text: 'Fashion', size: 15 },
      { text: 'Movies', size: 12 },
    ],
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <span className="text-2xl">👥</span>
        Audience Analytics
      </h3>

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
                  data={data.regions}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.regions.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {data.regions.slice(0, 3).map((region) => (
              <div key={region.name} className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500">{region.name}</div>
                <div className="font-bold text-lg" style={{ color: region.color }}>
                  {region.value}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Age Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h4 className="text-sm font-semibold text-gray-600 mb-4 flex items-center gap-2">
            <span>📊</span> Age Distribution
          </h4>
          <div className="space-y-4">
            {data.ageGroups.map((age) => (
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

          {/* Gender Distribution */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h4 className="text-sm font-semibold text-gray-600 mb-4 flex items-center gap-2">
              <span>⚤</span> Gender Distribution
            </h4>
            <div className="flex items-center gap-4">
              {data.gender.map((g) => (
                <div key={g.name} className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{g.name}</span>
                    <span className="font-semibold" style={{ color: g.color }}>
                      {g.value}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${g.value}%`, backgroundColor: g.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interest Word Cloud */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
          <h4 className="text-sm font-semibold text-gray-600 mb-4 flex items-center gap-2">
            <span>☁️</span> Interest Keywords
          </h4>
          <div className="flex flex-wrap gap-3 justify-center">
            {data.interests.map((interest, index) => (
              <span
                key={interest.text}
                className="px-4 py-2 rounded-full font-medium transition-all hover:scale-105 cursor-default"
                style={{
                  fontSize: `${14 + interest.size / 5}px`,
                  backgroundColor: `hsl(${200 + index * 15}, 70%, ${90 - interest.size / 4}%)`,
                  color: `hsl(${200 + index * 15}, 80%, 30%)`,
                }}
              >
                {interest.text}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-500 text-center mt-4">
            Generated from audience interaction and comment analysis
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
            <span>Core audience concentrated in 25-34 age group with strong purchasing power</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>Highest viewership from China mainland, consider localizing content</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500 mt-0.5">!</span>
            <span>Male audience is dominant, try expanding female-oriented content</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
