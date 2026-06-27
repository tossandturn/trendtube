import type { Metadata } from 'next'
import Link from 'next/link'
import { searchYouTubeMulti } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'

export const metadata: Metadata = {
  title: 'Low Competition YouTube Keywords 2026 | Find Underserved Niches',
  description: 'Discover low competition YouTube keywords with high search volume. Find underserved niches and opportunities before they become saturated.',
  keywords: 'low competition youtube keywords, underserved youtube niches, youtube niche finder, low competition niches',
}

function formatNumber(n: string | undefined) {
  const num = Number(n || 0)
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return num.toLocaleString()
}

// Analyze search results to determine competition level
function analyzeCompetition(videos: any[], query: string) {
  if (videos.length === 0) {
    return { level: 'Unknown', difficulty: 0, videoCount: 0 }
  }

  const totalViews = videos.reduce((sum, v) => sum + Number(v.statistics?.viewCount || 0), 0)
  const avgViews = totalViews / videos.length
  const highViewCount = videos.filter(v => Number(v.statistics?.viewCount || 0) > 1000000).length
  const saturation = (highViewCount / videos.length) * 100

  // Calculate difficulty based on average views and saturation
  let difficulty = Math.min(10, Math.round(avgViews / 500000))
  if (saturation > 50) difficulty += 2

  let level: 'Low' | 'Medium' | 'High'
  if (difficulty <= 4) level = 'Low'
  else if (difficulty <= 7) level = 'Medium'
  else level = 'High'

  return { level, difficulty, videoCount: videos.length, saturation }
}

// Calculate estimated search volume based on video views and age
function estimateSearchVolume(videos: any[]) {
  if (videos.length === 0) return 'N/A'

  const totalViews = videos.reduce((sum, v) => sum + Number(v.statistics?.viewCount || 0), 0)
  const avgViewsPerVideo = totalViews / videos.length

  // Estimate monthly searches based on average views (rough heuristic)
  // Assuming videos get views over ~3 months, estimate monthly
  const estimatedMonthly = Math.round(avgViewsPerVideo * videos.length / 3)

  if (estimatedMonthly >= 1000000) return `${(estimatedMonthly / 1000000).toFixed(1)}M/mo`
  if (estimatedMonthly >= 1000) return `${(estimatedMonthly / 1000).toFixed(0)}K/mo`
  return `${estimatedMonthly}/mo`
}

// Calculate growth based on recent upload patterns
function calculateGrowth(videos: any[]) {
  if (videos.length === 0) return '+0%'

  const recentVideos = videos.filter(v => {
    const published = new Date(v.snippet?.publishedAt || 0)
    const daysOld = (Date.now() - published.getTime()) / (1000 * 60 * 60 * 24)
    return daysOld < 90
  })

  const recentRatio = recentVideos.length / videos.length
  const growthPercent = Math.round(recentRatio * 100)

  return `+${growthPercent}%`
}

// Calculate estimated CPM based on niche
function estimateCPM(query: string) {
  const query_lower = query.toLowerCase()
  if (query_lower.includes('tutorial') || query_lower.includes('how to')) return '$4-8'
  if (query_lower.includes('review')) return '$6-12'
  if (query_lower.includes('business') || query_lower.includes('marketing')) return '$8-15'
  if (query_lower.includes('finance') || query_lower.includes('money')) return '$10-20'
  if (query_lower.includes('tech') || query_lower.includes('ai')) return '$6-10'
  return '$3-6'
}

// Get saturation label
function getSaturationLabel(saturation: number) {
  if (saturation < 20) return 'Early'
  if (saturation < 50) return 'Growing'
  return 'Established'
}

const NICHE_QUERIES = [
  { niche: 'AI Tool Reviews', query: 'AI tools review tutorial' },
  { niche: 'YouTube Analytics', query: 'youtube analytics tutorial' },
  { niche: 'Niche Gaming Guides', query: 'gaming tutorial guide' },
  { niche: 'Content Strategy', query: 'content strategy tips' },
  { niche: 'Thumbnail Design', query: 'thumbnail design tutorial' },
  { niche: 'Creator Tips', query: 'creator tips advice' },
  { niche: 'Shorts Strategy', query: 'youtube shorts strategy' },
  { niche: 'Channel Growth', query: 'channel growth tips' },
]

export default async function LowCompetitionKeywordsPage() {
  const region = await getRegion()

  // Analyze each niche with real YouTube data
  const nicheAnalysis = await Promise.all(
    NICHE_QUERIES.map(async ({ niche, query }) => {
      const videos = await searchYouTubeMulti([query], 20, 'relevance')
      const competition = analyzeCompetition(videos, query)
      const searchVolume = estimateSearchVolume(videos)
      const growth = calculateGrowth(videos)
      const cpm = estimateCPM(query)

      return {
        niche,
        query,
        searchVolume,
        competition: competition.level,
        cpm,
        growth,
        saturation: getSaturationLabel(competition.saturation || 0),
        difficulty: competition.difficulty,
        videoCount: competition.videoCount,
      }
    })
  )

  // Sort by difficulty (easiest first)
  const sortedNiches = nicheAnalysis.sort((a, b) => a.difficulty - b.difficulty)

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
          <div className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase mb-2 data-mono">🎯 NICHE FINDER</div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-glow text-gray-900">
            Low Competition Keywords
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl leading-relaxed mb-6">
            Discover underserved YouTube niches with high potential. These keywords are analyzed from real
            YouTube data showing low competition but growth opportunity.
          </p>
        </div>

        {/* Niches Table */}
        <div className="mb-12 overflow-hidden">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Analyzed Niches</h2>
          <p className="text-sm text-gray-500 mb-4">
            Real-time analysis based on current YouTube search results
          </p>
          <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Niche</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Est. Volume</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Competition</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Est. CPM</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedNiches.map((niche) => (
                    <tr key={niche.niche} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{niche.niche}</div>
                        <div className="text-xs text-gray-400">{niche.videoCount} videos analyzed</div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{niche.searchVolume}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${
                          niche.competition === 'Low' ? 'bg-green-100 text-green-700' :
                          niche.competition === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {niche.competition}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{niche.cpm}</td>
                      <td className="px-4 py-3">
                        <span className="text-green-600 font-bold">{niche.growth}</span>
                        <div className="text-xs text-gray-400">{niche.saturation}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Research Tips */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4 text-gray-900">How to Find Low Competition Keywords</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: 'Look for Rising Queries', desc: 'Use Google Trends to find topics with increasing search interest but low current competition.' },
              { title: 'Check Video Count', desc: 'Search your keyword and count results. Under 10K videos = low competition opportunity.' },
              { title: 'Analyze Top Performers', desc: 'If top videos have under 100K views, the niche is likely underserved.' },
              { title: 'Long-Tail Strategy', desc: 'Target specific long-tail variations like &quot;best AI tools for YouTube Shorts 2026&quot; instead of just &quot;AI tools&quot;.' },
            ].map((tip) => (
              <div key={tip.title} className="glass-panel rounded-xl p-5">
                <div className="font-bold text-gray-900 mb-2">{tip.title}</div>
                <div className="text-gray-500 text-sm">{tip.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategy Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Winning Strategy</h2>
          <div className="glass-panel rounded-2xl p-6">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <div className="font-bold text-gray-900 mb-1">Target Early-Stage Niches</div>
                  <div className="text-gray-500 text-sm">Focus on niches in the &quot;Early&quot; or &quot;Growing&quot; saturation phase. These have the best risk/reward ratio.</div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <div className="font-bold text-gray-900 mb-1">Create Comprehensive Content</div>
                  <div className="text-gray-500 text-sm">In low competition niches, longer, more detailed videos often rank #1 by default.</div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <div className="font-bold text-gray-900 mb-1">Build Authority Quickly</div>
                  <div className="text-gray-500 text-sm">Publish 5-10 videos in the niche quickly to establish topical authority before competitors arrive.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900">FAQ</h2>
          <div className="space-y-3">
            {[
              { q: 'What makes a keyword low competition?', a: 'Low competition keywords have high search volume but few quality videos targeting them. They are often emerging trends or specific long-tail phrases.' },
              { q: 'How long does it take to rank for low competition keywords?', a: 'With consistent uploads, you can rank in the top 10 within 2-4 weeks for truly low competition terms.' },
              { q: 'Should I only target low competition keywords?', a: 'Mix strategy: 70% low competition (for quick wins), 20% medium competition (for growth), 10% high competition (for authority).' },
            ].map((item, i) => (
              <div key={i} className="glass-panel rounded-xl p-4">
                <div className="font-bold text-sm mb-1 text-gray-900">{item.q}</div>
                <div className="text-gray-500 text-xs leading-relaxed">{item.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="glass-panel neon-border rounded-2xl p-6 sm:p-8 text-center glow-hover">
          <h2 className="text-xl font-bold mb-2 text-gray-900">Find Your Perfect Niche</h2>
          <p className="text-gray-500 text-sm mb-4 max-w-xl mx-auto">
            Get real-time niche recommendations based on current trends and competition analysis.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition"
          >
            Explore Opportunities →
          </Link>
        </div>
      </div>
    </main>
  )
}
