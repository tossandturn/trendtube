import { Metadata } from 'next'
import Link from 'next/link'
import { getAllTrends, getAllTags } from '@/lib/db'
import { getLatestSnapshot } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Trend Database | TubeFission',
  description: 'Explore historical YouTube trend data. Analyze velocity, saturation, breakout potential, and creator adoption across content categories.',
  keywords: 'youtube trends, viral content, creator intelligence, trend analysis',
}

export default async function TrendsPage() {
  const trends = getAllTrends()
  const tags = getAllTags()

  // Get snapshots for display
  const trendsWithStats = trends.map(t => {
    const snapshot = getLatestSnapshot(t.id)
    return {
      ...t,
      velocity: snapshot?.velocity || 0,
      breakout: snapshot?.breakout_score || 0,
      saturation: snapshot?.saturation_score || 0,
    }
  })

  // Group by category
  const byCategory: Record<string, typeof trendsWithStats> = {}
  trendsWithStats.forEach(t => {
    const cat = t.category || 'Other'
    if (!byCategory[cat]) byCategory[cat] = []
    byCategory[cat].push(t)
  })

  return (
    <main className="min-h-screen bg-[#fafafa]">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="flex items-center text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-900">Trends</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Trend Intelligence Database
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Historical trend data with velocity tracking, saturation analysis, and breakout predictions.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Trends Tracked</p>
              <p className="text-2xl font-bold text-gray-900">{trends.length}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{Object.keys(byCategory).length}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Tags</p>
              <p className="text-2xl font-bold text-gray-900">{tags.length}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Data Points</p>
              <p className="text-2xl font-bold text-gray-900">365+</p>
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
                    key={trend.id}
                    href={`/trends/${trend.slug}`}
                    className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">{trend.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">{trend.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-green-600 font-medium">
                        {trend.velocity > 0 ? `+${(trend.velocity / 1000).toFixed(1)}K` : '0'} velocity
                      </span>
                      <span className="text-blue-600">
                        {trend.breakout.toFixed(0)} breakout
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tags Section */}
      <section className="pb-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Browse by Tag</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <Link
                key={tag}
                href={`/tag/${tag}`}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
