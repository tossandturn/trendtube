import type { Metadata } from 'next'
import Link from 'next/link'
import { searchYouTubeMulti } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'

export const metadata: Metadata = {
  title: 'YouTube Keyword Research Tool 2026 | Free Keyword Explorer',
  description: 'Free YouTube keyword research tool. Discover search volume, competition level, and trending keywords to optimize your content strategy.',
  keywords: 'youtube keyword research, youtube keyword tool, video keyword explorer, youtube seo keywords',
}

function formatNumber(n: number) {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return n.toLocaleString()
}

function analyzeKeywordMetrics(videos: any[], keyword: string) {
  if (videos.length === 0) {
    return {
      searchVolume: 'N/A',
      competition: 'Low',
      difficulty: 1,
      cpc: '$0.00',
      trend: '+0%',
      topVideos: [],
      relatedKeywords: [],
    }
  }

  const totalViews = videos.reduce((sum, v) => sum + Number(v.statistics?.viewCount || 0), 0)
  const avgViews = totalViews / videos.length

  let competition: 'Low' | 'Medium' | 'High'
  let difficulty: number

  if (avgViews > 1000000) {
    competition = 'High'
    difficulty = Math.min(10, Math.round(avgViews / 500000))
  } else if (avgViews > 100000) {
    competition = 'Medium'
    difficulty = Math.min(7, Math.round(avgViews / 100000))
  } else {
    competition = 'Low'
    difficulty = Math.max(1, Math.round(avgViews / 50000))
  }

  const estimatedMonthly = Math.round(totalViews / 10)
  const searchVolume = estimatedMonthly >= 1000
    ? formatNumber(estimatedMonthly) + '/mo'
    : estimatedMonthly.toString() + '/mo'

  const recentVideos = videos.filter(v => {
    const published = new Date(v.snippet?.publishedAt || 0)
    const daysOld = (Date.now() - published.getTime()) / (1000 * 60 * 60 * 24)
    return daysOld < 30
  })
  const trendPercent = Math.round((recentVideos.length / Math.max(videos.length, 1)) * 100)
  const trend = trendPercent > 50 ? `+${trendPercent}%` : `-${100 - trendPercent}%`

  const keywordLower = keyword.toLowerCase()
  let cpc = '$0.50-$2.00'
  if (keywordLower.includes('review') || keywordLower.includes('best')) cpc = '$2.00-$8.00'
  if (keywordLower.includes('tutorial') || keywordLower.includes('how to')) cpc = '$1.00-$4.00'
  if (keywordLower.includes('business') || keywordLower.includes('marketing')) cpc = '$5.00-$15.00'

  return {
    searchVolume,
    competition,
    difficulty,
    cpc,
    trend,
    topVideos: videos.slice(0, 5),
    relatedKeywords: generateRelatedKeywords(keyword),
  }
}

function generateRelatedKeywords(baseKeyword: string): string[] {
  const modifiers = ['tutorial', 'review', 'guide', 'tips', 'for beginners', '2026', 'how to', 'best', 'vs', 'comparison']
  return modifiers.map(mod => `${baseKeyword} ${mod}`).slice(0, 5)
}

export default async function KeywordResearchPage() {
  const region = await getRegion()

  const trendingKeywords = [
    'AI tools',
    'YouTube Shorts',
    'content creation',
    'video editing',
    'channel growth',
  ]

  const keywordData = await Promise.all(
    trendingKeywords.map(async (keyword) => {
      const videos = await searchYouTubeMulti([keyword], 20, 'relevance')
      return {
        keyword,
        ...analyzeKeywordMetrics(videos, keyword),
      }
    })
  )

  const featuredKeyword = keywordData[0]

  return (
    <main className="min-h-screen bg-white text-gray-900 terminal-grid relative overflow-hidden">
      <div className="ambient-glow-tl" />
      <div className="ambient-glow-tr" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 sm:mb-8">
          <span className="text-lg">←</span>
          <span className="text-sm font-medium">Back to TubeFission</span>
        </Link>

        <div className="mb-8 sm:mb-12">
          <div className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase mb-2 data-mono">🔍 KEYWORD INTELLIGENCE</div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-glow text-gray-900">
            YouTube Keyword Research
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl leading-relaxed mb-6">
            Discover high-opportunity keywords with real search data. Analyze competition,
            search volume, and trends to optimize your content strategy.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-6 mb-8 border border-gray-200">
          <label className="block font-medium mb-2">Enter a keyword to research</label>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="e.g., AI tools, gaming setup, cooking tutorial"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            <button className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition">
              Research
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6 mb-12">
          <div className="glass-panel rounded-2xl overflow-hidden border border-gray-200">
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Trending Keywords</h2>
              <p className="text-sm text-gray-500 mt-1">Real-time analysis based on current YouTube search results</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Keyword</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Search Volume</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Competition</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Difficulty</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Trend</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Est. CPC</th>
                  </tr>
                </thead>
                <tbody>
                  {keywordData.map((data) => (
                    <tr key={data.keyword} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{data.keyword}</div>
                        <div className="text-xs text-gray-400">{data.topVideos.length} videos analyzed</div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{data.searchVolume}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${
                          data.competition === 'Low' ? 'bg-green-100 text-green-700' :
                          data.competition === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {data.competition}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div
                              className={`h-2 rounded-full ${
                                data.difficulty <= 3 ? 'bg-green-500' :
                                data.difficulty <= 6 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${data.difficulty * 10}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{data.difficulty}/10</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={data.trend.startsWith('+') ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                          {data.trend}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-sm">{data.cpc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {featuredKeyword && (
            <div className="space-y-6">
              <div className="glass-panel rounded-2xl p-5 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Top Related Keywords</h2>
                <div className="space-y-2">
                  {featuredKeyword.relatedKeywords.map((keyword) => (
                    <div key={keyword} className="bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700 border border-gray-100">
                      {keyword}
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-5 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Top Ranking Samples</h2>
                <div className="space-y-3">
                  {featuredKeyword.topVideos.slice(0, 3).map((video: any) => (
                    <Link key={video.id} href={`/video/${video.id}`} className="block rounded-xl border border-gray-100 p-3 hover:border-red-200 hover:bg-gray-50 transition">
                      <div className="font-medium text-gray-900 line-clamp-2 mb-1">{video.snippet?.title}</div>
                      <div className="text-xs text-gray-500">{video.snippet?.channelTitle}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {[
            { title: 'Search Volume Data', desc: 'Real-time estimated search volume based on actual YouTube data', icon: '📊' },
            { title: 'Competition Analysis', desc: 'Understand how competitive a keyword is before targeting it', icon: '🎯' },
            { title: 'Trend Forecasting', desc: 'See if a keyword is rising or declining in popularity', icon: '📈' },
          ].map((feature) => (
            <div key={feature.title} className="glass-panel rounded-xl p-5 border border-gray-200">
              <div className="text-3xl mb-2">{feature.icon}</div>
              <div className="font-bold text-gray-900 mb-1">{feature.title}</div>
              <div className="text-gray-500 text-sm">{feature.desc}</div>
            </div>
          ))}
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4 text-gray-900">How Keyword Research Works</h2>
          <div className="glass-panel rounded-2xl p-6 border border-gray-200">
            <div className="grid sm:grid-cols-4 gap-4">
              {[
                { step: '1', title: 'Search', desc: 'We search YouTube for your target keyword' },
                { step: '2', title: 'Analyze', desc: 'Our AI analyzes top-performing videos' },
                { step: '3', title: 'Calculate', desc: 'We compute difficulty, volume, and competition' },
                { step: '4', title: 'Optimize', desc: 'Use insights to improve your content strategy' },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
                    {item.step}
                  </div>
                  <div className="font-bold text-gray-900 mb-1">{item.title}</div>
                  <div className="text-gray-500 text-xs">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-panel neon-border rounded-2xl p-6 sm:p-8 text-center glow-hover border border-gray-200">
          <h2 className="text-xl font-bold mb-2 text-gray-900">Start Your Keyword Research</h2>
          <p className="text-gray-500 text-sm mb-4 max-w-xl mx-auto">
            Find the perfect keywords to rank higher and get more views on your videos.
          </p>
          <Link
            href="/trending"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition"
          >
            Explore Trends →
          </Link>
        </div>
      </div>
    </main>
  )
}
