import type { Metadata } from 'next'
import Link from 'next/link'
import { fetchTrendingVideos } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'

export const metadata: Metadata = {
  title: 'Low Competition YouTube Keywords 2026 | Find Underserved Niches',
  description: 'Discover low competition YouTube keywords with high search volume. Find underserved niches and opportunities before they become saturated.',
  keywords: 'low competition youtube keywords, underserved youtube niches, youtube niche finder, low competition niches',
}

const LOW_COMPETITION_NICHES = [
  {
    niche: 'AI Tool Reviews',
    searchVolume: '125K/mo',
    competition: 'Low',
    cpm: '$8-12',
    growth: '+234%',
    saturation: 'Early',
    difficulty: 3,
  },
  {
    niche: 'Shorts Analytics',
    searchVolume: '89K/mo',
    competition: 'Low',
    cpm: '$6-9',
    growth: '+156%',
    saturation: 'Early',
    difficulty: 4,
  },
  {
    niche: 'Niche Gaming Guides',
    searchVolume: '67K/mo',
    competition: 'Low',
    cpm: '$5-8',
    growth: '+89%',
    saturation: 'Growing',
    difficulty: 5,
  },
  {
    niche: 'Faceless Channel Strategies',
    searchVolume: '156K/mo',
    competition: 'Medium',
    cpm: '$7-11',
    growth: '+178%',
    saturation: 'Growing',
    difficulty: 6,
  },
  {
    niche: 'Thumbnail Psychology',
    searchVolume: '45K/mo',
    competition: 'Low',
    cpm: '$9-15',
    growth: '+67%',
    saturation: 'Early',
    difficulty: 3,
  },
  {
    niche: 'Algorithm Updates',
    searchVolume: '234K/mo',
    competition: 'Medium',
    cpm: '$6-10',
    growth: '+45%',
    saturation: 'Established',
    difficulty: 7,
  },
  {
    niche: 'Creator Mental Health',
    searchVolume: '78K/mo',
    competition: 'Low',
    cpm: '$8-14',
    growth: '+123%',
    saturation: 'Early',
    difficulty: 4,
  },
  {
    niche: 'Micro-Niche Discovery',
    searchVolume: '34K/mo',
    competition: 'Low',
    cpm: '$10-18',
    growth: '+89%',
    saturation: 'Early',
    difficulty: 2,
  },
]

const KEYWORD_RESEARCH_TIPS = [
  {
    title: 'Look for Rising Queries',
    desc: 'Use Google Trends to find topics with increasing search interest but low current competition.',
  },
  {
    title: 'Check Video Count',
    desc: 'Search your keyword and count results. Under 10K videos = low competition opportunity.',
  },
  {
    title: 'Analyze Top Performers',
    desc: 'If top videos have under 100K views, the niche is likely underserved.',
  },
  {
    title: 'Long-Tail Strategy',
    desc: 'Target specific long-tail variations like &quot;best AI tools for YouTube Shorts 2026&quot; instead of just &quot;AI tools&quot;.',
  },
]

export default async function LowCompetitionKeywordsPage() {
  const region = await getRegion()
  await fetchTrendingVideos(region, 50)

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
            Discover underserved YouTube niches with high potential. These keywords have low competition
            but growing search volume — perfect for new and growing channels.
          </p>
        </div>

        {/* Niches Table */}
        <div className="mb-12 overflow-hidden">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Underserved Niches</h2>
          <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Niche</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Search Volume</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Competition</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">CPM Range</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {LOW_COMPETITION_NICHES.map((niche) => (
                    <tr key={niche.niche} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{niche.niche}</td>
                      <td className="px-4 py-3 text-gray-600">{niche.searchVolume}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${
                          niche.competition === 'Low' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {niche.competition}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{niche.cpm}</td>
                      <td className="px-4 py-3 text-green-600 font-bold">{niche.growth}</td>
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
            {KEYWORD_RESEARCH_TIPS.map((tip) => (
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
