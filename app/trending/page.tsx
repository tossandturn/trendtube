import type { Metadata } from 'next'
import Link from 'next/link'
import { getViewVelocity, getEngagementRate, getTagEmoji } from '@/lib/analytics'
import { fetchTrendingVideos } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'
import { getRegionLabels } from '@/lib/region'
import { generateDailyRecommendations, getTodayString, getTimeBasedGreeting, REGIONAL_PREFERENCES } from '@/lib/recommendations'

export const metadata: Metadata = {
  title: 'Trending YouTube Videos Today | Real-Time Viral Tracker',
  description: 'Track the most viral YouTube videos right now. Real-time trending analysis with velocity, engagement, and creator intelligence.',
}

function formatNumber(n: string | undefined) {
  const num = Number(n || 0)
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return num.toLocaleString()
}

function calculateViralityScore(video: any): number {
  const views = Number(video.statistics?.viewCount || 0)
  const likes = Number(video.statistics?.likeCount || 0)
  const comments = Number(video.statistics?.commentCount || 0)
  const velocity = getViewVelocity(video)

  const engagementRate = views > 0 ? ((likes + comments * 2) / views) * 100 : 0
  const velocityScore = Math.min(40, Math.log10(velocity + 1) * 8)
  const engagementScore = Math.min(35, engagementRate * 7)
  const viewScore = Math.min(25, Math.log10(views + 1) * 3)

  return Math.round(velocityScore + engagementScore + viewScore)
}

function getPerformanceTier(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'VIRAL', color: 'text-red-600' }
  if (score >= 60) return { label: 'TRENDING', color: 'text-orange-600' }
  if (score >= 40) return { label: 'RISING', color: 'text-yellow-600' }
  return { label: 'STEADY', color: 'text-green-600' }
}

export default async function TrendingPage() {
  const region = await getRegion()
  const labels = getRegionLabels(region)
  const videos = await fetchTrendingVideos(region, 50)

  const sorted = [...videos].sort((a: any, b: any) =>
    Number(b.statistics?.viewCount || 0) - Number(a.statistics?.viewCount || 0)
  )

  // Generate daily recommendations based on trending data
  const dailyRecommendations = generateDailyRecommendations(sorted.slice(0, 30), region, 5)
  const regionalPrefs = REGIONAL_PREFERENCES[region] || REGIONAL_PREFERENCES.US

  // Calculate analytics
  const totalViews = sorted.reduce((sum: number, v: any) => sum + Number(v.statistics?.viewCount || 0), 0)
  const totalLikes = sorted.reduce((sum: number, v: any) => sum + Number(v.statistics?.likeCount || 0), 0)
  const avgEngagement = sorted.length > 0
    ? sorted.reduce((sum: number, v: any) => sum + getEngagementRate(v), 0) / sorted.length
    : 0
  const avgVelocity = sorted.length > 0
    ? sorted.reduce((sum: number, v: any) => sum + getViewVelocity(v), 0) / sorted.length
    : 0

  // Top categories
  const categoryMap = new Map()
  sorted.forEach((v: any) => {
    const title = v.snippet?.title?.toLowerCase() || ''
    if (title.includes('ai') || title.includes('chatgpt')) categoryMap.set('AI', (categoryMap.get('AI') || 0) + 1)
    if (title.includes('shorts')) categoryMap.set('Shorts', (categoryMap.get('Shorts') || 0) + 1)
    if (title.includes('gaming') || title.includes('game')) categoryMap.set('Gaming', (categoryMap.get('Gaming') || 0) + 1)
    if (title.includes('music') || title.includes('song')) categoryMap.set('Music', (categoryMap.get('Music') || 0) + 1)
    if (title.includes('how to') || title.includes('tutorial')) categoryMap.set('Tutorial', (categoryMap.get('Tutorial') || 0) + 1)
  })
  const topCategories = Array.from(categoryMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5)

  return (
    <main className="min-h-screen bg-white text-gray-900 terminal-grid relative overflow-hidden">
      <div className="ambient-glow-tl" />
      <div className="ambient-glow-tr" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 sm:mb-8">
          <span className="text-lg">←</span>
          <span className="text-sm font-medium">Back to Potential</span>
        </Link>

        <div className="mb-8 sm:mb-10">
          <div className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase mb-2 data-mono">🔥 TRENDING NOW</div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-glow text-gray-900">Trending YouTube Videos</h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl leading-relaxed">
            The most viral YouTube videos right now, ranked by real-time view count with
            velocity and engagement analysis.
          </p>
        </div>

        {/* Professional Analytics Dashboard */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-400 to-blue-600" />
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-gray-900">
              <span className="text-blue-600">📊</span> Real-Time Analytics Dashboard
            </h2>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="glass-panel neon-border rounded-2xl p-4 sm:p-5 glow-hover corner-accent">
              <div className="text-gray-500 text-xs sm:text-sm mb-1 data-mono tracking-wider">🎬 VIDEOS TRACKED</div>
              <div className="text-2xl sm:text-3xl font-black data-mono text-glow text-gray-900">{sorted.length}</div>
              <div className="text-xs text-gray-500 mt-1">Live from {labels.full}</div>
            </div>
            <div className="glass-panel neon-border rounded-2xl p-4 sm:p-5 glow-hover corner-accent">
              <div className="text-gray-500 text-xs sm:text-sm mb-1 data-mono tracking-wider">👁️ TOTAL VIEWS</div>
              <div className="text-2xl sm:text-3xl font-black data-mono text-glow-red text-red-600">{formatNumber(totalViews.toString())}</div>
              <div className="text-xs text-green-600 mt-1">↗ Across all videos</div>
            </div>
            <div className="glass-panel neon-border rounded-2xl p-4 sm:p-5 glow-hover corner-accent">
              <div className="text-gray-500 text-xs sm:text-sm mb-1 data-mono tracking-wider">⚡ AVG VELOCITY</div>
              <div className="text-2xl sm:text-3xl font-black data-mono text-glow-green text-green-600">
                {avgVelocity >= 1e6 ? (avgVelocity / 1e6).toFixed(1) + 'M' : avgVelocity >= 1e3 ? (avgVelocity / 1e3).toFixed(1) + 'K' : Math.round(avgVelocity)}
              </div>
              <div className="text-xs text-gray-500 mt-1">views/day</div>
            </div>
            <div className="glass-panel neon-border rounded-2xl p-4 sm:p-5 glow-hover corner-accent">
              <div className="text-gray-500 text-xs sm:text-sm mb-1 data-mono tracking-wider">📈 AVG ENGAGEMENT</div>
              <div className="text-2xl sm:text-3xl font-black data-mono text-glow-yellow text-yellow-600">{avgEngagement.toFixed(2)}%</div>
              <div className="text-xs text-gray-500 mt-1">likes + comments</div>
            </div>
          </div>

          {/* Category Distribution & Velocity Chart */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Category Distribution */}
            <div className="glass-panel neon-border rounded-2xl p-5 sm:p-6 glow-hover">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider data-mono">🏷️ CATEGORY DISTRIBUTION</h3>
                <span className="text-[10px] text-gray-500 data-mono">by video count</span>
              </div>
              {topCategories.length > 0 ? (
                <div className="space-y-3">
                  {topCategories.map(([category, count], i) => {
                    const maxCount = topCategories[0][1]
                    const percentage = (count / sorted.length) * 100
                    return (
                      <div key={category} className="flex items-center gap-3">
                        <span className="text-lg">{getTagEmoji(category)}</span>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">{category}</span>
                            <span className="text-gray-500">{count} videos ({percentage.toFixed(1)}%)</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                              style={{ width: `${(count / maxCount) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-gray-500 text-sm py-8 text-center">No category data available</div>
              )}
            </div>

            {/* Velocity Distribution Chart */}
            <div className="glass-panel neon-border rounded-2xl p-5 sm:p-6 glow-hover">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider data-mono">⚡ VELOCITY DISTRIBUTION</h3>
                <span className="text-[10px] text-gray-500 data-mono">views/day</span>
              </div>
              <svg viewBox="0 0 520 200" className="w-full" preserveAspectRatio="xMidYMid meet">
                {(() => {
                  const width = 520
                  const height = 200
                  const margin = { top: 20, right: 60, bottom: 40, left: 80 }
                  const chartW = width - margin.left - margin.right
                  const chartH = height - margin.top - margin.bottom

                  // Group by velocity ranges
                  const ranges = [
                    { label: '0-100K', min: 0, max: 100000, color: '#22c55e' },
                    { label: '100K-500K', min: 100000, max: 500000, color: '#84cc16' },
                    { label: '500K-1M', min: 500000, max: 1000000, color: '#eab308' },
                    { label: '1M-5M', min: 1000000, max: 5000000, color: '#f97316' },
                    { label: '5M+', min: 5000000, max: Infinity, color: '#dc2626' },
                  ]

                  const data = ranges.map(range => ({
                    ...range,
                    count: sorted.filter((v: any) => {
                      const vel = getViewVelocity(v)
                      return vel >= range.min && vel < range.max
                    }).length
                  })).filter(d => d.count > 0)

                  if (data.length === 0) return <text x={width / 2} y={height / 2} fill="#9ca3af" fontSize="14" textAnchor="middle">No velocity data</text>

                  const maxCount = Math.max(...data.map(d => d.count), 1)
                  const barSlot = chartH / data.length
                  const barHeight = barSlot * 0.6
                  const barGap = barSlot * 0.4

                  return (
                    <>
                      <rect x={margin.left} y={margin.top} width={chartW} height={chartH} fill="#f3f4f6" opacity="0.5" rx="8" />
                      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
                        const x = margin.left + t * chartW
                        const val = Math.round(t * maxCount)
                        return (
                          <g key={`grid-${i}`}>
                            <line x1={x} y1={margin.top} x2={x} y2={margin.top + chartH} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2" />
                            <text x={x} y={margin.top + chartH + 18} fill="#9ca3af" fontSize="10" textAnchor="middle" fontFamily="monospace">{val}</text>
                          </g>
                        )
                      })}
                      {data.map((d, i) => {
                        const y = margin.top + i * barSlot + barGap / 2
                        const w = (d.count / maxCount) * chartW
                        return (
                          <g key={i}>
                            <rect x={margin.left} y={y} width={w} height={barHeight} rx="4" fill={d.color} opacity="0.85" />
                            <text x={margin.left - 8} y={y + barHeight / 2 + 4} fill="#374151" fontSize="11" textAnchor="end" fontFamily="monospace">{d.label}</text>
                            <text x={margin.left + w + 6} y={y + barHeight / 2 + 4} fill="#6b7280" fontSize="10" fontWeight="bold" fontFamily="monospace">{d.count}</text>
                          </g>
                        )
                      })}
                    </>
                  )
                })()}
              </svg>
            </div>
          </div>

          {/* Performance Score Distribution */}
          <div className="glass-panel neon-border rounded-2xl p-5 sm:p-6 glow-hover mb-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider data-mono">🎯 PERFORMANCE SCORE DISTRIBUTION</h3>
              <span className="text-[10px] text-gray-500 data-mono">0-100 scale</span>
            </div>
            <div className="flex items-end justify-between gap-2 h-32">
              {(() => {
                const ranges = [
                  { label: '0-20', color: '#9ca3af', desc: 'Steady' },
                  { label: '20-40', color: '#22c55e', desc: 'Rising' },
                  { label: '40-60', color: '#eab308', desc: 'Growing' },
                  { label: '60-80', color: '#f97316', desc: 'Trending' },
                  { label: '80-100', color: '#dc2626', desc: 'Viral' },
                ]
                const scores = sorted.map((v: any) => calculateViralityScore(v))
                return ranges.map((range, i) => {
                  const [min, max] = range.label.split('-').map(Number)
                  const count = scores.filter(s => s >= min && s < (max || 101)).length
                  const maxCount = Math.max(...ranges.map((r, idx) => {
                    const [mn, mx] = r.label.split('-').map(Number)
                    return scores.filter(s => s >= mn && s < (mx || 101)).length
                  }), 1)
                  const height = maxCount > 0 ? (count / maxCount) * 100 : 0
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '100px' }}>
                        <div
                          className="absolute bottom-0 w-full rounded-t-lg transition-all duration-500"
                          style={{
                            height: `${height}%`,
                            backgroundColor: range.color,
                            opacity: 0.85
                          }}
                        />
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-bold text-gray-700">{count}</div>
                        <div className="text-[10px] text-gray-500">{range.desc}</div>
                      </div>
                    </div>
                  )
                })
              })()}
            </div>
          </div>

          {/* Data Export Section */}
          <div className="glass-panel neon-border rounded-2xl p-5 sm:p-6 glow-hover">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider data-mono">📥 EXPORT DATA</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition flex items-center gap-2">
                <span>📊</span> Export as CSV
              </button>
              <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition flex items-center gap-2">
                <span>📈</span> Export Analytics Report
              </button>
              <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition flex items-center gap-2">
                <span>🔗</span> Share Dashboard
              </button>
            </div>
          </div>
        </section>

        {/* Daily Topic Recommendations */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-purple-400 to-purple-600" />
              <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-gray-900">
                <span className="text-purple-600">💡</span> {getTimeBasedGreeting()}, Creator
              </h2>
            </div>
            <span className="text-xs text-gray-500 data-mono bg-gray-100 px-3 py-1 rounded-full">
              {getTodayString()}
            </span>
          </div>

          {/* Regional Insights */}
          <div className="glass-panel neon-border rounded-2xl p-5 sm:p-6 glow-hover corner-accent mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">{regionalPrefs.flag || '🌍'}</span>
              <div>
                <h3 className="font-bold text-gray-900">{labels.full} Creator Intelligence</h3>
                <p className="text-sm text-gray-500">Based on today's trending data from {sorted.length} videos</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
                <div className="text-purple-600 text-xs font-bold mb-1">🎬 TOP FORMATS</div>
                <div className="text-sm text-gray-700">{regionalPrefs.popularFormats.slice(0, 3).join(', ')}</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                <div className="text-blue-600 text-xs font-bold mb-1">🔥 HOT TOPICS</div>
                <div className="text-sm text-gray-700">{regionalPrefs.trendingTopics.slice(0, 2).join(', ')}</div>
              </div>
              <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                <div className="text-green-600 text-xs font-bold mb-1">⏱️ OPTIMAL LENGTH</div>
                <div className="text-sm text-gray-700">{regionalPrefs.optimalLength}</div>
              </div>
              <div className="bg-orange-50 rounded-xl p-3 border border-orange-100">
                <div className="text-orange-600 text-xs font-bold mb-1">🚀 BEST TIME</div>
                <div className="text-sm text-gray-700">{regionalPrefs.bestPostTime}</div>
              </div>
            </div>
          </div>

          {/* Recommendations Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {dailyRecommendations.map((rec, idx) => (
              <div key={rec.id} className="glass-panel neon-border rounded-2xl p-5 glow-hover corner-accent group">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    rec.potentialViews === 'viral' ? 'bg-red-100 text-red-600' :
                    rec.potentialViews === 'high' ? 'bg-orange-100 text-orange-600' :
                    rec.potentialViews === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {rec.potentialViews === 'viral' ? '🔥 VIRAL' :
                     rec.potentialViews === 'high' ? '⚡ HIGH' :
                     rec.potentialViews === 'medium' ? '💡 MEDIUM' : '📈 STEADY'}
                  </span>
                  <span className="text-xs text-gray-400 data-mono">#{idx + 1}</span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-sm text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                  {rec.title}
                </h3>

                {/* Category */}
                <div className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                  <span>🏷️</span> {rec.category}
                </div>

                {/* Metrics */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Confidence</span>
                    <span className="font-bold data-mono">{rec.confidence}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full" style={{ width: `${rec.confidence}%` }} />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Difficulty</span>
                    <span className={`font-bold ${
                      rec.difficulty === 'easy' ? 'text-green-600' :
                      rec.difficulty === 'medium' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {rec.difficulty === 'easy' ? '🟢 Easy' :
                       rec.difficulty === 'medium' ? '🟡 Medium' : '🔴 Hard'}
                    </span>
                  </div>
                </div>

                {/* Why Trending */}
                <div className="bg-gray-50 rounded-xl p-3 mb-4">
                  <div className="text-xs font-bold text-gray-700 mb-1">🧠 Why This Works</div>
                  <p className="text-xs text-gray-500 leading-relaxed">{rec.whyTrending}</p>
                </div>

                {/* Similar Videos */}
                {rec.similarVideos.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs font-bold text-gray-700 mb-2">📺 Similar Performing Videos</div>
                    <div className="space-y-1">
                      {rec.similarVideos.slice(0, 2).map((v, i) => (
                        <Link key={i} href={`/video/${v.id}`} className="block text-xs text-gray-500 hover:text-purple-600 transition truncate">
                          • {v.title.slice(0, 40)}{v.title.length > 40 ? '...' : ''}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {rec.suggestedTags.slice(0, 4).map((tag, i) => (
                    <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-3">
              💡 These recommendations are generated from real trending data in {labels.full}
            </p>
            <Link
              href="/youtube-ai-trends"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium hover:from-purple-600 hover:to-purple-700 transition shadow-lg shadow-purple-200"
            >
              <span>🚀</span> Get More AI-Powered Ideas
            </Link>
          </div>
        </section>

        {/* Video Grid with Enhanced Metrics */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-red-400 to-red-600" />
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-gray-900">
              <span className="text-red-600">🔥</span> Trending Videos
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {sorted.map((video: any, idx: number) => {
              const velocity = getViewVelocity(video)
              const engagement = getEngagementRate(video)
              const viralityScore = calculateViralityScore(video)
              const tier = getPerformanceTier(viralityScore)

              return (
                <Link key={video.id} href={`/video/${video.id}`} className="group block">
                  <div className="glass-panel neon-border rounded-xl sm:rounded-2xl overflow-hidden glow-hover corner-accent">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={video.snippet?.thumbnails?.high?.url}
                        alt={video.snippet?.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 bg-red-500/20 border border-red-500/30 text-red-600 px-2.5 py-1 rounded-lg text-[10px] font-bold backdrop-blur data-mono">
                        #{idx + 1} TRENDING
                      </div>
                      <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-lg text-[10px] font-bold">
                        Score: {viralityScore}
                      </div>
                      <div className="absolute bottom-2 right-2 glass-panel px-2 py-1 rounded-lg text-[10px] sm:text-xs font-medium data-mono text-gray-700">
                        👁️ {formatNumber(video.statistics?.viewCount)}
                      </div>
                    </div>
                    <div className="p-3 sm:p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${tier.color.replace('text-', 'bg-').replace('600', '100')} ${tier.color}`}>
                          {tier.label}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm sm:text-base line-clamp-2 mb-2 group-hover:text-red-600 transition-colors text-gray-900">
                        {video.snippet?.title}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-500 text-xs mb-3">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-[10px] font-bold text-gray-700">
                          {video.snippet?.channelTitle?.[0]}
                        </div>
                        <span className="truncate">{video.snippet?.channelTitle}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="glass-panel rounded-lg p-2 text-center">
                          <div className="text-gray-500 text-[10px] data-mono tracking-wider">⚡ VELOCITY</div>
                          <div className="text-green-600 font-bold text-xs data-mono text-glow-green">
                            {velocity >= 1e6 ? (velocity / 1e6).toFixed(1) + 'M/d' : velocity >= 1e3 ? (velocity / 1e3).toFixed(1) + 'K/d' : Math.round(velocity) + '/d'}
                          </div>
                        </div>
                        <div className="glass-panel rounded-lg p-2 text-center">
                          <div className="text-gray-500 text-[10px] data-mono tracking-wider">📈 ENGAGEMENT</div>
                          <div className="text-yellow-600 font-bold text-xs data-mono text-glow-yellow">{engagement.toFixed(2)}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      </div>
    </main>
  )
}
