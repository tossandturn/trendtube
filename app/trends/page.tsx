import { Metadata } from 'next'
import Link from 'next/link'
import { getRegion } from '@/lib/region-server'
import { fetchTrendingVideos } from '@/lib/api-client'
import { extractTrendsFromRegion, type RealTrend } from '@/lib/trend-extractor'
import { Breadcrumbs } from '@/app/components/Breadcrumbs'
import { TrendDiscovery } from '@/app/components/TrendDiscovery'
import { REGIONS, REGION_META } from '@/lib/region'

export const metadata: Metadata = {
  title: 'Trend Discovery | TubeFission',
  description: 'Discover viral YouTube trends in real-time. Analyze velocity, breakout potential, and creator opportunities across content categories.',
}

export default async function TrendsPage() {
  const region = await getRegion()
  const videos = await fetchTrendingVideos(region, 50)
  const trends = videos.length > 0 ? await extractTrendsFromRegion(region, 50) : []

  // Group by category from real data
  const byCategory: Record<string, RealTrend[]> = {}
  trends.forEach(t => {
    if (!byCategory[t.category]) byCategory[t.category] = []
    byCategory[t.category].push(t)
  })

  const totalViews = trends.reduce((sum, t) => sum + t.totalViews, 0)
  const avgBreakout = trends.length > 0
    ? trends.reduce((sum, t) => sum + t.breakoutScore, 0) / trends.length
    : 0

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: 'Trends' }
        ]} />
      </div>

      {/* Hero */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Real Trend Intelligence
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Trends extracted from actual viral videos in {region}. Zero fake data.
            </p>
          </div>

          {/* Region Selector - Mobile: Horizontal Scroll */}
          <div className="mt-6 flex justify-center">
            <div className="inline-flex items-center gap-2 bg-white rounded-xl border border-gray-200 p-2 shadow-sm max-w-full">
              <span className="text-sm text-gray-500 px-2 hidden sm:inline">Region:</span>
              <div className="flex gap-1 overflow-x-auto max-w-[280px] sm:max-w-none scrollbar-hide">
                {REGIONS.map((r) => (
                  <Link
                    key={r}
                    href={`/api/switch-region?region=${r}&redirect=/trends`}
                    className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                      region === r
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    title={REGION_META[r].label}
                  >
                    <img
                      src={`https://flagcdn.com/w40/${REGION_META[r].flag}.png`}
                      alt={REGION_META[r].label}
                      className="w-4 h-3 rounded-sm object-cover"
                    />
                    <span>{r}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Trends Detected</p>
              <p className="text-2xl font-bold text-gray-900">{trends.length}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{Object.keys(byCategory).length}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Total Views Analyzed</p>
              <p className="text-2xl font-bold text-gray-900">{(totalViews / 1e9).toFixed(1)}B</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Avg Breakout</p>
              <p className="text-2xl font-bold text-gray-900">{avgBreakout.toFixed(0)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trend Discovery Component */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured Categories - Mobile: 2 cols, Desktop: 4 cols */}
          <div className="mb-8">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Featured Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <Link
                href="/gaming"
                className="group block bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 sm:p-4 border border-purple-200 hover:border-purple-400 hover:shadow-md transition-all active:scale-95"
              >
                <div className="text-xl sm:text-2xl mb-1.5 sm:mb-2">🎮</div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-purple-600 transition-colors">Gaming</h3>
                <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">Minecraft, GTA, Fortnite & more</p>
              </Link>
              <Link
                href="/trends/ai-shorts"
                className="group block bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-3 sm:p-4 border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all active:scale-95"
              >
                <div className="text-xl sm:text-2xl mb-1.5 sm:mb-2">🤖</div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors">AI</h3>
                <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">AI tools, tutorials & trends</p>
              </Link>
              <Link
                href="/trends/mrbeast-style"
                className="group block bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-3 sm:p-4 border border-yellow-200 hover:border-yellow-400 hover:shadow-md transition-all active:scale-95"
              >
                <div className="text-xl sm:text-2xl mb-1.5 sm:mb-2">🎬</div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-orange-600 transition-colors">Challenges</h3>
                <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">High-stakes challenge content</p>
              </Link>
              <Link
                href="/trends/youtube-automation"
                className="group block bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 sm:p-4 border border-green-200 hover:border-green-400 hover:shadow-md transition-all active:scale-95"
              >
                <div className="text-xl sm:text-2xl mb-1.5 sm:mb-2">🚀</div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-green-600 transition-colors">Automation</h3>
                <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">Faceless channel strategies</p>
              </Link>
            </div>
          </div>

          <TrendDiscovery
            trends={trends.map(t => ({
              ...t,
              momentum: t.avgVelocity > 50000 ? 'rising' : t.avgVelocity < 10000 ? 'falling' : 'stable'
            }))}
            categories={Object.keys(byCategory)}
          />
        </div>
      </section>
    </main>
  )
}
