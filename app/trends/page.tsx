import { Metadata } from 'next'
import Link from 'next/link'
import { getRegion } from '@/lib/region-server'
import { fetchTrendingVideos } from '@/lib/api-client'
import { extractTrendsFromRegion, type RealTrend } from '@/lib/trend-extractor'
import { Breadcrumbs } from '@/app/components/Breadcrumbs'
import { TrendDiscovery } from '@/app/components/TrendDiscovery'

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
