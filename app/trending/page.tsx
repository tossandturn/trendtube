import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getViewVelocity, getEngagementRate, getTagEmoji } from '@/lib/analytics'
import { fetchTrendingVideos, type YouTubeVideo } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'
import { getRegionLabels, REGION_META, type Region } from '@/lib/region'
import { generateDailyRecommendations, getTodayString, getTimeBasedGreeting, REGIONAL_PREFERENCES } from '@/lib/recommendations'
import AddToVideoCompareButton from '@/app/components/AddToVideoCompareButton'

function getTrendingAnalysisRegion(region: Region): Region {
  return region === 'GLOBAL' ? 'US' : region
}

export async function generateMetadata(): Promise<Metadata> {
  const region = getTrendingAnalysisRegion(await getRegion())
  const regionLabel = REGION_META[region]?.label || region
  const today = getTodayString()

  return {
    title: `${regionLabel} Trending Videos ${today} | Real-Time Viral Tracker`,
    description: `Track the most viral YouTube videos in ${regionLabel} right now for ${today}. Real-time trending analysis with velocity, engagement, and creator intelligence.`,
  }
}

function formatNumber(n: string | undefined) {
  const num = Number(n || 0)
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return num.toLocaleString()
}

function calculateViralityScore(video: YouTubeVideo): number {
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

function getDecisionHint(score: number, engagement: number) {
  if (score >= 80 && engagement >= 4) return 'Study immediately'
  if (score >= 60) return 'Worth tracking'
  return 'Use as context'
}

export default async function TrendingPage() {
  const region = getTrendingAnalysisRegion(await getRegion())
  const labels = getRegionLabels(region)
  const videos = await fetchTrendingVideos(region, 30, { retries: 0, timeoutMs: 3500, revalidateSeconds: 300 })

  const sorted = [...videos].sort((a, b) =>
    Number(b.statistics?.viewCount || 0) - Number(a.statistics?.viewCount || 0)
  )

  const visibleVideos = sorted.slice(0, 18)
  const dailyRecommendations = generateDailyRecommendations(sorted.slice(0, 12), region, 4)
  const regionalPrefs = REGIONAL_PREFERENCES[region] || REGIONAL_PREFERENCES.US

  const totalViews = sorted.reduce((sum, v) => sum + Number(v.statistics?.viewCount || 0), 0)
  const avgEngagement = sorted.length > 0
    ? sorted.reduce((sum, v) => sum + getEngagementRate(v), 0) / sorted.length
    : 0
  const avgVelocity = sorted.length > 0
    ? sorted.reduce((sum, v) => sum + getViewVelocity(v), 0) / sorted.length
    : 0

  const categoryMap = new Map<string, number>()
  sorted.forEach((v) => {
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
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-glow text-gray-900">
            {labels.full} Trending Videos {getTodayString()}
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-3xl leading-relaxed">
            Use this page to answer three questions fast: what is getting the most attention, which patterns are worth studying, and which channels deserve a deeper audit.
          </p>
          {region === 'GLOBAL' && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm">
              <span className="text-lg">🌍</span>
              <span>Global ranking from 15 regions — sorted by total views</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <Link href="/trends" className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition">
            Open Trend Database
          </Link>
          <Link href="/compare-new" className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition">
            Compare Channels or Videos
          </Link>
        </div>

        <section className="mb-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
              <div className="text-gray-500 text-xs sm:text-sm mb-1 data-mono tracking-wider">🎬 VIDEOS TRACKED</div>
              <div className="text-2xl sm:text-3xl font-black data-mono text-glow text-gray-900">{sorted.length}</div>
              <div className="text-xs text-gray-500 mt-1">Live from {labels.full}</div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
              <div className="text-gray-500 text-xs sm:text-sm mb-1 data-mono tracking-wider">👁️ TOTAL VIEWS</div>
              <div className="text-2xl sm:text-3xl font-black data-mono text-glow-red text-red-600">{formatNumber(totalViews.toString())}</div>
              <div className="text-xs text-green-600 mt-1">Across current leaders</div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
              <div className="text-gray-500 text-xs sm:text-sm mb-1 data-mono tracking-wider">⚡ AVG VELOCITY</div>
              <div className="text-2xl sm:text-3xl font-black data-mono text-glow-green text-green-600">
                {avgVelocity >= 1e6 ? (avgVelocity / 1e6).toFixed(1) + 'M' : avgVelocity >= 1e3 ? (avgVelocity / 1e3).toFixed(1) + 'K' : Math.round(avgVelocity)}
              </div>
              <div className="text-xs text-gray-500 mt-1">views/day</div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
              <div className="text-gray-500 text-xs sm:text-sm mb-1 data-mono tracking-wider">📈 AVG ENGAGEMENT</div>
              <div className="text-2xl sm:text-3xl font-black data-mono text-glow-yellow text-yellow-600">{avgEngagement.toFixed(2)}%</div>
              <div className="text-xs text-gray-500 mt-1">likes + comments</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-6 mb-8">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔥</span>
                  <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider data-mono">TODAY&apos;S KEYWORD</h3>
                    <p className="text-xs text-gray-400">Trending search term with highest velocity</p>
                  </div>
                </div>
              </div>

              {(() => {
                const keywordCounts = new Map<string, { count: number; totalViews: number; velocity: number }>()
                const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'can', 'will', 'just', 'should', 'now'])

                sorted.forEach((v) => {
                  const title = v.snippet?.title?.toLowerCase() || ''
                  const words = title.split(/\s+/).filter((w: string) => w.length > 3 && !stopWords.has(w) && !/^\d+$/.test(w))
                  const velocity = getViewVelocity(v)
                  const views = Number(v.statistics?.viewCount || 0)

                  words.forEach((word: string) => {
                    const cleanWord = word.replace(/[^a-z]/g, '')
                    if (cleanWord.length > 3) {
                      const existing = keywordCounts.get(cleanWord)
                      if (existing) {
                        existing.count += 1
                        existing.totalViews += views
                        existing.velocity += velocity
                      } else {
                        keywordCounts.set(cleanWord, { count: 1, totalViews: views, velocity })
                      }
                    }
                  })
                })

                const topKeyword = Array.from(keywordCounts.entries())
                  .sort((a, b) => (b[1].velocity + b[1].count * 10000) - (a[1].velocity + a[1].count * 10000))
                  .slice(0, 1)[0]

                if (!topKeyword) return <div className="text-gray-500 text-sm py-4 text-center">No trending keywords detected</div>

                const [keyword, data] = topKeyword
                const keywordVelocity = data.velocity / data.count

                return (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <Link href={`/trends/${keyword}`} className="group inline-flex items-center gap-3 hover:opacity-80 transition">
                        <span className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                          #{keyword.charAt(0).toUpperCase() + keyword.slice(1)}
                        </span>
                      </Link>
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full font-medium">🔍 {data.count} videos</span>
                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">👁️ {formatNumber(data.totalViews.toString())} total views</span>
                        <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full font-medium">⚡ {keywordVelocity >= 1e6 ? (keywordVelocity / 1e6).toFixed(1) + 'M' : keywordVelocity >= 1e3 ? (keywordVelocity / 1e3).toFixed(1) + 'K' : Math.round(keywordVelocity)}/day</span>
                      </div>
                    </div>
                    <Link href={`/trends/${keyword}`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition shadow-lg shadow-purple-200 whitespace-nowrap">
                      Explore Trend
                    </Link>
                  </div>
                )
              })()}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider data-mono mb-4">HOW TO USE THIS PAGE</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>1. Open videos with strong velocity and strong engagement first.</p>
                <p>2. If a channel appears repeatedly, open the channel analysis next.</p>
                <p>3. Use Compare after you have 2 candidates worth benchmarking.</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider data-mono">🏷️ CATEGORY DISTRIBUTION</h3>
                <span className="text-[10px] text-gray-500 data-mono">by video count</span>
              </div>
              {topCategories.length > 0 ? (
                <div className="space-y-3">
                  {topCategories.map(([category, count]) => {
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
                            <div className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full" style={{ width: `${(count / maxCount) * 100}%` }} />
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

            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider data-mono mb-4">REGIONAL INTELLIGENCE</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
                  <div className="text-purple-600 text-xs font-bold mb-1">TOP FORMATS</div>
                  <div className="text-sm text-gray-700">{regionalPrefs.popularFormats.slice(0, 2).join(', ')}</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                  <div className="text-blue-600 text-xs font-bold mb-1">HOT TOPICS</div>
                  <div className="text-sm text-gray-700">{regionalPrefs.trendingTopics.slice(0, 2).join(', ')}</div>
                </div>
                <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                  <div className="text-green-600 text-xs font-bold mb-1">OPTIMAL LENGTH</div>
                  <div className="text-sm text-gray-700">{regionalPrefs.optimalLength}</div>
                </div>
                <div className="bg-orange-50 rounded-xl p-3 border border-orange-100">
                  <div className="text-orange-600 text-xs font-bold mb-1">BEST TIME</div>
                  <div className="text-sm text-gray-700">{regionalPrefs.bestPostTime}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-purple-400 to-purple-600" />
              <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-gray-900">
                <span className="text-purple-600">💡</span> {getTimeBasedGreeting()}, Creator
              </h2>
            </div>
            <span className="text-xs text-gray-500 data-mono bg-gray-100 px-3 py-1 rounded-full">{getTodayString()}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {dailyRecommendations.map((rec, idx) => {
              const trendKeyword = rec.title.toLowerCase()
                .replace(/[^a-z0-9\s]/g, '')
                .split(' ')
                .slice(0, 3)
                .join('-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '') || 'trend'

              return (
                <Link key={rec.id} href={`/trends/${trendKeyword}`} className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 group block hover:border-purple-200 hover:no-underline">
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      rec.potentialViews === 'viral' ? 'bg-red-100 text-red-600' :
                      rec.potentialViews === 'high' ? 'bg-orange-100 text-orange-600' :
                      rec.potentialViews === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {rec.potentialViews === 'viral' ? '🔥 VIRAL' : rec.potentialViews === 'high' ? '⚡ HIGH' : rec.potentialViews === 'medium' ? '💡 MEDIUM' : '📈 STEADY'}
                    </span>
                    <span className="text-xs text-gray-400 data-mono shrink-0">#{idx + 1}</span>
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">{rec.title}</h3>
                  <div className="text-xs text-gray-500 mb-3 flex items-center gap-1"><span>🏷️</span> {rec.category}</div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs gap-2">
                      <span className="text-gray-500">Confidence</span>
                      <span className="font-bold data-mono shrink-0">{rec.confidence}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full" style={{ width: `${rec.confidence}%` }} />
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 mb-4">
                    <div className="text-xs font-bold text-gray-700 mb-1">🧠 Why This Works</div>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{rec.whyTrending}</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {rec.suggestedTags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">#{tag}</span>
                    ))}
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-red-400 to-red-600" />
              <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-gray-900">
                <span className="text-red-600">🔥</span> Trending Videos
              </h2>
            </div>
            <div className="text-sm text-gray-500">Open the video first if you want packaging insight. Open the channel next if you want repeatability.</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {visibleVideos.map((video, idx) => {
              const velocity = getViewVelocity(video)
              const engagement = getEngagementRate(video)
              const viralityScore = calculateViralityScore(video)
              const tier = getPerformanceTier(viralityScore)
              const decisionHint = getDecisionHint(viralityScore, engagement)

              return (
                <div key={video.id} className="glass-panel rounded-xl border border-gray-200 sm:rounded-2xl overflow-hidden">
                  <Link href={`/video/${video.id}`} className="group block">
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={video.snippet?.thumbnails?.medium?.url || video.snippet?.thumbnails?.high?.url || `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`}
                        alt={video.snippet?.title || 'Trending YouTube video thumbnail'}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        unoptimized
                        className="object-cover"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 bg-red-50/95 border border-red-100 text-red-600 px-2.5 py-1 rounded-lg text-[10px] font-bold data-mono">
                        #{idx + 1} TRENDING
                      </div>
                      <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-lg text-[10px] font-bold">
                        Score: {viralityScore}
                      </div>
                      <div className="absolute bottom-2 right-2 glass-panel px-2 py-1 rounded-lg text-[10px] sm:text-xs font-medium data-mono text-gray-700">
                        👁️ {formatNumber(video.statistics?.viewCount)}
                      </div>
                    </div>
                  </Link>
                  <div className="p-3 sm:p-5">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${tier.color.replace('text-', 'bg-').replace('600', '100')} ${tier.color}`}>
                        {tier.label}
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        {decisionHint}
                      </span>
                    </div>
                    <Link href={`/video/${video.id}`} className="group block">
                      <h3 className="font-bold text-sm sm:text-base line-clamp-2 mb-2 group-hover:text-red-600 transition-colors text-gray-900">
                        {video.snippet?.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-3">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-[10px] font-bold text-gray-700">
                        {video.snippet?.channelTitle?.[0]}
                      </div>
                      <span className="truncate">{video.snippet?.channelTitle}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="rounded-lg border border-gray-100 bg-gray-50 p-2 text-center">
                        <div className="text-gray-500 text-[10px] data-mono tracking-wider">⚡ VELOCITY</div>
                        <div className="text-green-600 font-bold text-xs data-mono text-glow-green">
                          {velocity >= 1e6 ? (velocity / 1e6).toFixed(1) + 'M/d' : velocity >= 1e3 ? (velocity / 1e3).toFixed(1) + 'K/d' : Math.round(velocity) + '/d'}
                        </div>
                      </div>
                      <div className="rounded-lg border border-gray-100 bg-gray-50 p-2 text-center">
                        <div className="text-gray-500 text-[10px] data-mono tracking-wider">📈 ENGAGEMENT</div>
                        <div className="text-yellow-600 font-bold text-xs data-mono text-glow-yellow">{engagement.toFixed(2)}%</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/video/${video.id}`} className="flex-1 px-3 py-2 bg-gray-900 text-white rounded-lg text-xs font-medium text-center hover:bg-gray-800 transition">
                        Analyze Video
                      </Link>
                      <AddToVideoCompareButton
                        videoId={video.id}
                        title={video.snippet?.title}
                        channelTitle={video.snippet?.channelTitle}
                        thumbnailUrl={video.snippet?.thumbnails?.medium?.url || video.snippet?.thumbnails?.high?.url || `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`}
                        sourceLabel="Trending"
                        compact
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          {sorted.length > visibleVideos.length && (
            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-600">
              Showing the top {visibleVideos.length} videos for faster browsing. Open the Trend Database for the full research list.
              <Link href="/trends" className="ml-2 font-bold text-red-600 hover:text-red-700">Open Trend Database</Link>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
