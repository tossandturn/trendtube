import type { Metadata } from 'next'
import Link from 'next/link'
import { getRegion } from '@/lib/region-server'
import { fetchTrendingVideos } from '@/lib/api-client'
import { extractTrendsFromRegion, getAllCategoriesFromReal, getAllTagsFromReal } from '@/lib/trend-extractor'
import { REGION_META } from '@/lib/region'

export const metadata: Metadata = {
  title: 'TubeFission — Discover Viral YouTube Opportunities Before Everyone Else',
  description: 'Real-time creator intelligence platform for YouTube trends, Shorts, and breakout niches. Analyze velocity, saturation, and breakout potential with real data from 6 countries.',
  keywords: 'youtube trends, viral content, creator intelligence, shorts, analytics',
  alternates: {
    canonical: 'https://tubefission.com',
  },
  openGraph: {
    title: 'TubeFission — Creator Intelligence Platform',
    description: 'Discover viral YouTube opportunities before everyone else.',
    url: 'https://tubefission.com',
    type: 'website',
  },
}

export default async function HomePage() {
  const region = await getRegion()
  const regionMeta = REGION_META[region]
  const videos = await fetchTrendingVideos(region, 50)
  const trends = videos.length > 0 ? await extractTrendsFromRegion(region, 50) : []

  const categories = getAllCategoriesFromReal(trends)
  const tags = getAllTagsFromReal(trends)

  const totalViews = videos.reduce((sum, v) => sum + Number(v.statistics?.viewCount || 0), 0)
  const totalLikes = videos.reduce((sum, v) => sum + Number(v.statistics?.likeCount || 0), 0)

  const topTrends = trends.slice(0, 5)

  return (
    <main className="min-h-screen bg-[#fafafa]">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-[#fafafa]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 text-sm text-gray-600 mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live data from {regionMeta.label}
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 tracking-tight mb-6 leading-tight">
              Discover Viral YouTube<br className="hidden sm:block" /> Opportunities Before Everyone Else
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Real-time creator intelligence platform for YouTube trends, Shorts, and breakout niches.
              All data extracted from real viral videos. Country is the first filter.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/trending"
                className="w-full sm:w-auto px-8 py-3.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
              >
                Start Free
              </Link>
              <Link
                href="/trends"
                className="w-full sm:w-auto px-8 py-3.5 bg-white text-gray-900 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Explore Trends
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF — REAL DATA */}
      <section className="border-y border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{videos.length}</p>
              <p className="text-sm text-gray-500 mt-1">Videos Analyzed ({region})</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{(totalViews / 1e9).toFixed(1)}B</p>
              <p className="text-sm text-gray-500 mt-1">Total Views</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{(totalLikes / 1e6).toFixed(1)}M</p>
              <p className="text-sm text-gray-500 mt-1">Total Likes</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{trends.length}</p>
              <p className="text-sm text-gray-500 mt-1">Trends Detected</p>
            </div>
          </div>
        </div>
      </section>

      {/* TOP TRENDS — REAL */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Top Potential in {regionMeta.label}</h2>
            <Link href="/trends" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View all →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topTrends.map(trend => (
              <Link
                key={trend.slug}
                href={`/trends/${trend.slug}`}
                className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{trend.title}</h3>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{trend.category}</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">{trend.description}</p>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-green-600 font-medium">+{(trend.avgVelocity / 1000).toFixed(0)}K vel</span>
                  <span className="text-blue-600">{trend.breakoutScore.toFixed(0)} breakout</span>
                  <span className="text-gray-400">{trend.videoCount} vids</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Categories in {regionMeta.label}</h2>
            <Link href="/trends" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View all →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/categories/${cat.toLowerCase().replace(/\s+/g, '-')}`}
                className="p-4 bg-[#fafafa] rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all text-center"
              >
                <p className="font-medium text-gray-900">{cat}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {trends.filter(t => t.category === cat).length} trends
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TAGS */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Live Tags from {regionMeta.label}</h2>
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 24).map((tag) => (
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

      {/* FINAL CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to find your next viral video?</h2>
          <p className="text-gray-600 mb-8">Real data. Real trends. Real growth.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/trending"
              className="w-full sm:w-auto px-8 py-3.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Start Free
            </Link>
            <Link
              href="/trends"
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-gray-900 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Explore Trends
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
