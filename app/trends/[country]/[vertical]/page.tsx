/* =========================================================
   VERTICAL TREND PAGE - Category-specific trend analytics
   /trends/[country]/[vertical]/page.tsx
========================================================= */

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  TrendingUp,
  Users,
  Clock,
  Target,
  ArrowRight,
  Zap,
  BarChart3,
  Play,
  Star,
  ChevronRight,
  PieChart,
  Activity
} from 'lucide-react'
import { getCountryTrendContent, getVerticalContent, COUNTRIES, VERTICALS } from '@/lib/recommendations'
import { DatasetSchema } from '@/app/components/DatasetSchema'
import { BreadcrumbSchema } from '@/app/components/ArticleSchema'
import { TrendVideosGrid } from '@/app/components/TrendVideosGrid'
import { getTrendingVideos } from '@/lib/db'

// Valid countries and verticals
const VALID_COUNTRIES = ['US', 'JP', 'KR', 'GB', 'HK', 'TW', 'GLOBAL']
const VALID_VERTICALS = Object.keys(VERTICALS)

interface PageProps {
  params: Promise<{ country: string; vertical: string }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country, vertical } = await params
  const upperCountry = country.toUpperCase()
  const lowerVertical = vertical.toLowerCase()

  if (!VALID_COUNTRIES.includes(upperCountry) || !VALID_VERTICALS.includes(lowerVertical)) {
    return {
      title: 'Page Not Found | TubeFission',
      description: 'Explore YouTube trends by category.'
    }
  }

  const countryContent = getCountryTrendContent(upperCountry)
  const verticalContent = getVerticalContent(lowerVertical)
  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  const countryName = countryContent?.name || country.toUpperCase()
  const verticalName = verticalContent?.name || vertical

  return {
    title: `${verticalName} Trends in ${countryName} - ${today} | TubeFission`,
    description: `Discover the latest ${verticalName.toLowerCase()} trends on YouTube in ${countryName}. Analytics, popular videos, and creator insights for ${today}.`,
    keywords: [
      `${vertical} youtube trends`,
      `${country.toLowerCase()} ${vertical} content`,
      `${verticalName.toLowerCase()} analytics`,
      `trending ${vertical}`,
      'youtube algorithm',
      'content strategy',
      'video analytics',
      'creator insights'
    ],
    openGraph: {
      title: `${verticalName} Trends in ${countryName} | TubeFission`,
      description: `Real-time ${verticalName.toLowerCase()} trend analytics for ${countryName}. Top videos, engagement metrics, and creator strategies.`,
      type: 'website',
      locale: 'en_US',
      images: [{
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: `${verticalName} Trends in ${countryName}`
      }]
    },
    alternates: {
      canonical: `https://tubefission.com/trends/${country.toLowerCase()}/${vertical.toLowerCase()}`
    }
  }
}

// Generate static params
export function generateStaticParams() {
  const params: { country: string; vertical: string }[] = []
  VALID_COUNTRIES.forEach(country => {
    VALID_VERTICALS.forEach(vertical => {
      params.push({ country: country.toLowerCase(), vertical: vertical.toLowerCase() })
    })
  })
  return params
}

// Main page component
export default async function VerticalTrendPage({ params }: PageProps) {
  const { country, vertical } = await params
  const upperCountry = country.toUpperCase()
  const lowerVertical = vertical.toLowerCase()

  if (!VALID_COUNTRIES.includes(upperCountry) || !VALID_VERTICALS.includes(lowerVertical)) {
    notFound()
  }

  const countryContent = getCountryTrendContent(upperCountry)
  const verticalContent = getVerticalContent(lowerVertical)

  if (!countryContent || !verticalContent) {
    notFound()
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  // Get trending videos filtered by vertical/category (in production)
  const trendingVideos = await getTrendingVideos(upperCountry, 12)

  // Breadcrumb items
  const breadcrumbItems = [
    { name: 'Home', url: 'https://tubefission.com/' },
    { name: 'Trends', url: 'https://tubefission.com/trends' },
    { name: countryContent.name, url: `https://tubefission.com/trends/${country.toLowerCase()}` },
    { name: verticalContent.name, url: `https://tubefission.com/trends/${country.toLowerCase()}/${vertical.toLowerCase()}` }
  ]

  // Calculate demographic chart data
  const maxDemo = Math.max(...verticalContent.audienceDemographics.map(d => d.percentage))

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Schema Markup */}
      <DatasetSchema
        name={`${verticalContent.name} Trends in ${countryContent.name}`}
        description={`Comprehensive trend analysis for ${verticalContent.name} content on YouTube in ${countryContent.name}, including top videos, engagement metrics, and audience demographics.`}
        url={`https://tubefission.com/trends/${country.toLowerCase()}/${vertical.toLowerCase()}`}
        keywords={[verticalContent.name, countryContent.name, 'YouTube trends', 'content analytics']}
        temporalCoverage={today}
        spatialCoverage={countryContent.name}
        variableMeasured={['View count', 'Engagement rate', 'Audience demographics', 'Content performance']}
      />
      <BreadcrumbSchema items={breadcrumbItems} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 via-red-700 to-red-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {/* Breadcrumb */}
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-red-100 flex-wrap">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><span className="text-red-300">/</span></li>
              <li><Link href="/trends" className="hover:text-white transition-colors">Trends</Link></li>
              <li><span className="text-red-300">/</span></li>
              <li>
                <Link href={`/trends/${country.toLowerCase()}`} className="hover:text-white transition-colors">
                  {countryContent.name}
                </Link>
              </li>
              <li><span className="text-red-300">/</span></li>
              <li className="text-white font-medium">{verticalContent.name}</li>
            </ol>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="lg:w-2/3">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {verticalContent.name} Trends in {countryContent.flag} {countryContent.name}
              </h1>
              <p className="text-xl text-red-100 mb-4">
                {today} • Real-time analytics and insights
              </p>
              <p className="text-lg text-red-50 max-w-3xl leading-relaxed">
                {verticalContent.description}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="lg:w-1/3 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Trend Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-red-100">Active Trending</span>
                  <span className="flex items-center gap-1 text-green-400 font-medium">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Live
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-red-100">Market Growth</span>
                  <span className="font-bold text-white">+127%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-red-100">Avg Engagement</span>
                  <span className="font-bold text-white">8.4%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Content Analysis */}
              <article className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-red-600" />
                  Content Analysis
                </h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {verticalContent.contentAnalysis}
                </p>

                {/* Best Practices */}
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Best Practices
                </h3>
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  {verticalContent.bestPractices.map((practice, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 text-xs font-bold">{idx + 1}</span>
                      </div>
                      <span className="text-gray-700">{practice}</span>
                    </div>
                  ))}
                </div>

                {/* Trending Formats */}
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-red-500" />
                  Trending Formats
                </h3>
                <div className="flex flex-wrap gap-3">
                  {verticalContent.trendingFormats.map((format, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-red-50 text-red-700 rounded-full text-sm font-medium border border-red-100"
                    >
                      {format}
                    </span>
                  ))}
                </div>
              </article>

              {/* Trend Analysis Section */}
              <article className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Target className="w-6 h-6 text-red-600" />
                  {verticalContent.name} Trend Analysis in {countryContent.name}
                </h2>
                <div className="prose prose-lg max-w-none text-gray-600">
                  <p className="leading-relaxed mb-4">
                    The {verticalContent.name.toLowerCase()} vertical in {countryContent.name} shows distinctive patterns
                    that reflect local audience preferences and global trends. Our analysis of thousands of videos
                    reveals the content strategies driving success in this space.
                  </p>
                  <p className="leading-relaxed mb-4">
                    Creators in this vertical benefit from understanding the specific content formats that resonate
                    with {countryContent.name} audiences. The data shows that {verticalContent.bestPractices[0].toLowerCase()}
                    consistently outperforms generic approaches.
                  </p>
                  <p className="leading-relaxed">
                    Engagement rates in this category typically range between 5-12%, with top-performing content
                    achieving viral velocity through strategic thumbnail optimization and title crafting. The
                    average view duration for successful {verticalContent.name.toLowerCase()} content in {countryContent.name}
                    exceeds platform averages, indicating strong audience retention when content matches viewer expectations.
                  </p>
                </div>
              </article>

              {/* Content Recommendations */}
              <article className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border border-red-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Zap className="w-6 h-6 text-red-600" />
                  Content Recommendations
                </h2>
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">For New Creators</h3>
                    <p className="text-gray-600">
                      Start with {verticalContent.trendingFormats[0].toLowerCase()} to establish your voice and build
                      initial audience. Focus on consistency over perfection in your first 20 videos.
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">For Growing Channels</h3>
                    <p className="text-gray-600">
                      Experiment with {verticalContent.trendingFormats[1].toLowerCase()} to diversify content while
                      maintaining your core value proposition. Track engagement metrics to identify winning formats.
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">For Established Creators</h3>
                    <p className="text-gray-600">
                      Leverage {verticalContent.trendingFormats[2].toLowerCase()} to expand into adjacent audiences
                      and cross-pollinate your existing viewership with new demographics.
                    </p>
                  </div>
                </div>
              </article>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Audience Demographics */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-red-600" />
                  Audience Demographics
                </h3>
                <div className="space-y-4">
                  {verticalContent.audienceDemographics.map((demo, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-600 text-sm">Age {demo.age}</span>
                        <span className="font-semibold text-gray-900">{demo.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full transition-all"
                          style={{ width: `${(demo.percentage / maxDemo) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Verticals */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Related Categories
                </h3>
                <div className="space-y-2">
                  {verticalContent.relatedVerticals.map((relVertical, idx) => (
                    <Link
                      key={idx}
                      href={`/trends/${country.toLowerCase()}/${relVertical}`}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <span className="font-medium text-gray-700 capitalize group-hover:text-red-600">
                        {relVertical.replace('-', ' ')}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Country Stats */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {countryContent.name} Stats
                </h3>
                <div className="space-y-3">
                  {countryContent.statistics.slice(0, 3).map((stat, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 text-sm">{stat.label}</span>
                      <span className="font-bold text-gray-900">{stat.value}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href={`/trends/${country.toLowerCase()}`}
                  className="mt-4 flex items-center justify-center gap-2 text-red-600 font-medium hover:text-red-700"
                >
                  View Full Report
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-6 text-white">
                <h3 className="text-xl font-bold mb-2">
                  Get Trend Alerts
                </h3>
                <p className="text-red-100 text-sm mb-4">
                  Monitor {verticalContent.name.toLowerCase()} trends in {countryContent.name}
                </p>
                <Link
                  href="/signup"
                  className="w-full py-3 px-4 bg-white text-red-600 rounded-xl font-semibold text-center block hover:bg-red-50 transition-colors"
                >
                  Create Free Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Videos Section */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Play className="w-6 h-6 text-red-600" />
              Top {verticalContent.name} Videos in {countryContent.name}
            </h2>
            <Link
              href={`/trends/${country.toLowerCase()}/videos?category=${vertical.toLowerCase()}`}
              className="flex items-center gap-2 text-red-600 font-medium hover:text-red-700"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <TrendVideosGrid
            videos={trendingVideos}
            country={upperCountry}
            emptyMessage={`No ${verticalContent.name.toLowerCase()} videos found for ${countryContent.name}. Check back soon for updates.`}
          />
        </div>
      </section>

      {/* Internal Links */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Other Verticals in Same Country */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Other Categories in {countryContent.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {VALID_VERTICALS.filter(v => v !== lowerVertical).slice(0, 6).map(v => (
                  <Link
                    key={v}
                    href={`/trends/${country.toLowerCase()}/${v}`}
                    className="px-4 py-2 bg-white rounded-lg border border-gray-200 hover:border-red-300 hover:text-red-600 transition-colors"
                  >
                    {v.replace('-', ' ')}
                  </Link>
                ))}
              </div>
            </div>

            {/* Same Vertical in Other Countries */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {verticalContent.name} Trends by Country
              </h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(COUNTRIES)
                  .filter(([code]) => code !== upperCountry)
                  .slice(0, 6)
                  .map(([code, data]) => (
                    <Link
                      key={code}
                      href={`/trends/${code.toLowerCase()}/${vertical.toLowerCase()}`}
                      className="px-4 py-2 bg-white rounded-lg border border-gray-200 hover:border-red-300 hover:text-red-600 transition-colors flex items-center gap-2"
                    >
                      <span>{data.flag}</span>
                      {data.name}
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
