import { Metadata } from 'next'
import Link from 'next/link'
import { getRegion } from '@/lib/region-server'
import { fetchTrendingVideos } from '@/lib/api-client'
import { extractTrendsFromRegion, type RealTrend } from '@/lib/trend-extractor'
import { Breadcrumbs } from '@/app/components/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Trend Database | TubeFission',
  description: 'Explore real YouTube trend data extracted from viral videos. Analyze velocity, saturation, breakout potential, and creator adoption across content categories.',
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

      {/* Trend Categories */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {Object.entries(byCategory).map(([category, items]) => (
            <div key={category} className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-semibold text-gray-900">{category}</h2>
                <Link
                  href={`/categories/${category.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  View category →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map(trend => (
                  <Link
                    key={trend.slug}
                    href={`/trends/${trend.slug}`}
                    className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">{trend.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">{trend.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-green-600 font-medium">
                        +{(trend.avgVelocity / 1000).toFixed(0)}K velocity
                      </span>
                      <span className="text-blue-600">
                        {trend.breakoutScore.toFixed(0)} breakout
                      </span>
                      <span className="text-gray-500">
                        {trend.videoCount} videos
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
