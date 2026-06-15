import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getRegion } from '@/lib/region-server'
import { REGION_META } from '@/lib/region'
import { fetchTrendingVideos } from '@/lib/api-client'
import { extractTrendsFromRegion, getTrendsByCategoryFromReal } from '@/lib/trend-extractor'
import { Breadcrumbs } from '@/app/components/Breadcrumbs'
import { getTodayString } from '@/lib/recommendations'

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  const region = await getRegion()
  const regionLabel = REGION_META[region]?.label || region
  const today = getTodayString()
  const normalized = category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  return {
    title: `${regionLabel} ${normalized} Trends ${today} | TubeFission`,
    description: `Real ${normalized} trends in ${regionLabel} for ${today} extracted from viral YouTube videos. Live data with velocity and breakout analysis.`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  const normalizedCategory = category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  const region = await getRegion()

  const videos = await fetchTrendingVideos(region, 50)
  const allTrends = videos.length > 0 ? await extractTrendsFromRegion(region, 50) : []
  const trends = getTrendsByCategoryFromReal(allTrends, normalizedCategory)

  if (trends.length === 0) {
    notFound()
  }

  const totalViews = trends.reduce((sum, t) => sum + t.totalViews, 0)
  const avgBreakout = trends.reduce((sum, t) => sum + t.breakoutScore, 0) / trends.length
  const avgVelocity = trends.reduce((sum, t) => sum + t.avgVelocity, 0) / trends.length

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: 'Trends', href: '/trends' },
          { label: normalizedCategory }
        ]} />
      </div>

      {/* Hero */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{normalizedCategory} Potential</h1>
          <p className="text-gray-600">Real trends from {region} extracted from {videos.length} viral videos.</p>

          <div className="mt-8 grid grid-cols-3 gap-4 max-w-lg">
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{trends.length}</p>
              <p className="text-sm text-gray-500">Trends</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-green-600">+{(avgVelocity / 1000).toFixed(0)}K</p>
              <p className="text-sm text-gray-500">Avg Velocity</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{avgBreakout.toFixed(0)}</p>
              <p className="text-sm text-gray-500">Avg Breakout</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trends Grid */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Trends in this category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trends.map(trend => (
              <Link
                key={trend.slug}
                href={`/trends/${trend.slug}`}
                className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{trend.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">{trend.description}</p>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-green-600 font-medium">+{(trend.avgVelocity / 1000).toFixed(0)}K vel</span>
                  <span className="text-blue-600">{trend.breakoutScore.toFixed(0)} breakout</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
