/* =========================================================
   COUNTRY TREND PAGE - Dynamic SEO page for each country
   /trends/[country]/page.tsx
========================================================= */

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  TrendingUp,
  Users,
  Clock,
  Upload,
  DollarSign,
  ArrowRight,
  Globe,
  Flame,
  Target,
  Zap,
  BarChart3
} from 'lucide-react'
import { getCountryTrendContent, COUNTRIES } from '@/lib/recommendations'
import { DatasetSchema } from '@/app/components/DatasetSchema'
import { BreadcrumbSchema } from '@/app/components/ArticleSchema'
import TrendVideosGrid from '@/app/components/TrendVideosGrid'
import { fetchTrendingVideos } from '@/lib/api-client'

// Valid countries
const VALID_COUNTRIES = ['US', 'JP', 'KR', 'GB', 'HK', 'TW', 'GLOBAL']

interface PageProps {
  params: Promise<{ country: string }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country } = await params

  // Handle undefined country
  if (!country) {
    return {
      title: 'Country Trends | TubeFission',
      description: 'Explore YouTube trends by country on TubeFission.'
    }
  }

  const upperCountry = country.toUpperCase()

  if (!VALID_COUNTRIES.includes(upperCountry)) {
    return {
      title: 'Country Not Found | TubeFission',
      description: 'Explore YouTube trends by country on TubeFission.'
    }
  }

  const content = getCountryTrendContent(upperCountry)
  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  const countryName = content?.name || country.toUpperCase()

  return {
    title: `${countryName} YouTube Trends - Real-time Analytics ${today} | TubeFission`,
    description: `Discover what's trending on YouTube in ${countryName} today. Real-time analytics, top videos, popular categories, and data-driven insights for content creators. Updated ${today}.`,
    keywords: [
      `${country.toLowerCase()} youtube trends`,
      `${countryName} trending videos`,
      `youtube analytics ${countryName}`,
      'trending content',
      'video analytics',
      'content strategy',
      'youtube algorithm',
      'viral videos'
    ],
    openGraph: {
      title: `${countryName} YouTube Trends - Live Analytics | TubeFission`,
      description: `Real-time YouTube trends and analytics for ${countryName}. Discover viral content, popular categories, and creator insights.`,
      type: 'website',
      locale: 'en_US',
      images: [{
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: `${countryName} YouTube Trends Analytics`
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${countryName} YouTube Trends | TubeFission`,
      description: `Discover what's trending on YouTube in ${countryName} today.`
    },
    alternates: {
      canonical: `https://tubefission.com/trends/${country.toLowerCase()}`
    }
  }
}

// Generate static params for all countries
export function generateStaticParams() {
  return VALID_COUNTRIES.map(country => ({ country: country.toLowerCase() }))
}

// Main page component
export default async function CountryTrendPage({ params }: PageProps) {
  const { country } = await params

  // Validate param exists
  if (!country) {
    notFound()
    return
  }

  const upperCountry = country.toUpperCase()

  if (!VALID_COUNTRIES.includes(upperCountry)) {
    notFound()
    return
  }

  const content = getCountryTrendContent(upperCountry)
  if (!content) {
    notFound()
    return
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  // Get trending videos for this country (in production, fetch from API)
  const trendingVideos = await fetchTrendingVideos(upperCountry, 12)

  // Breadcrumb items
  const breadcrumbItems = [
    { name: 'Home', url: 'https://tubefission.com/' },
    { name: 'Trends', url: 'https://tubefission.com/trends' },
    { name: content.name, url: `https://tubefission.com/trends/${country.toLowerCase()}` }
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Schema Markup */}
      <DatasetSchema
        name={`YouTube Trends in ${content.name}`}
        description={`Comprehensive YouTube trend analytics for ${content.name} including top videos, popular categories, and creator insights.`}
        url={`https://tubefission.com/trends/${country.toLowerCase()}`}
        keywords={['YouTube trends', content.name, 'video analytics', 'social media trends']}
        temporalCoverage={today}
        spatialCoverage={content.name}
        variableMeasured={['View count', 'Engagement rate', 'Trend velocity', 'Content categories']}
        measurementTechnique="YouTube API data collection and statistical analysis"
      />
      <BreadcrumbSchema items={breadcrumbItems} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 via-red-700 to-red-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="lg:w-2/3">
              {/* Breadcrumb */}
              <nav className="mb-6" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-sm text-red-100">
                  <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                  <li><span className="text-red-300">/</span></li>
                  <li><Link href="/trends" className="hover:text-white transition-colors">Trends</Link></li>
                  <li><span className="text-red-300">/</span></li>
                  <li className="text-white font-medium">{content.name}</li>
                </ol>
              </nav>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                <span className="mr-3">{content.flag}</span>
                {content.fullName}
              </h1>
              <p className="text-xl text-red-100 mb-6">
                Real-time analytics and insights for {today}
              </p>
              <p className="text-lg text-red-50 max-w-3xl leading-relaxed">
                {content.description}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="lg:w-1/3 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Quick Stats
              </h3>
              <div className="space-y-4">
                {content.statistics.slice(0, 4).map((stat, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-red-100">{stat.label}</span>
                    <span className="font-bold text-white">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Cards */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {content.statistics.map((stat, idx) => (
              <div
                key={idx}
                className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-red-200 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  {idx === 0 && <Users className="w-5 h-5 text-red-600" />}
                  {idx === 1 && <Clock className="w-5 h-5 text-red-600" />}
                  {idx === 2 && <Upload className="w-5 h-5 text-red-600" />}
                  {idx === 3 && <TrendingUp className="w-5 h-5 text-red-600" />}
                  <span className="text-sm font-medium text-gray-600">{stat.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                  {stat.trend === 'up' && (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  )}
                  {stat.trend === 'stable' && (
                    <span className="text-gray-400 text-sm">→</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Market Overview */}
              <article className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Globe className="w-6 h-6 text-red-600" />
                  {content.name} YouTube Market Overview
                </h2>
                <div className="prose prose-lg max-w-none text-gray-600">
                  <p className="leading-relaxed mb-4">
                    {content.description}
                  </p>
                  <p className="leading-relaxed">
                    Understanding the unique characteristics of the {content.name} market is essential for creators
                    looking to build audiences and maximize engagement. With {content.statistics[0]?.value} daily active users
                    consuming an average of {content.statistics[1]?.value} of content, the opportunity for strategic
                    content creators is substantial.
                  </p>
                </div>
              </article>

              {/* Market Insights */}
              <article className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Target className="w-6 h-6 text-red-600" />
                  Key Market Insights
                </h2>
                <ul className="space-y-4">
                  {content.marketInsights.map((insight, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-600 text-sm font-semibold">{idx + 1}</span>
                      </div>
                      <span className="text-gray-700 leading-relaxed">{insight}</span>
                    </li>
                  ))}
                </ul>
              </article>

              {/* Content Trends */}
              <article className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Flame className="w-6 h-6 text-red-600" />
                  Trending Content Patterns
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {content.contentTrends.map((trend, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <TrendingUp className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <span className="text-gray-700">{trend}</span>
                    </div>
                  ))}
                </div>
              </article>

              {/* Content Tips */}
              <article className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Zap className="w-6 h-6 text-red-600" />
                  Creator Tips for {content.name}
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {content.contentTips.map((tip, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-100"
                    >
                      <span className="text-red-600 font-semibold mr-2">{idx + 1}.</span>
                      <span className="text-gray-700">{tip}</span>
                    </div>
                  ))}
                </div>
              </article>

              {/* Data Explanation */}
              <article className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-red-600" />
                  About This Data
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  TubeFission analyzes millions of YouTube videos daily across all categories to identify
                  trending content patterns. Our data is collected in real-time and updated continuously to
                  provide the most accurate view of what's capturing audience attention in {content.name}.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Metrics include view velocity (views per hour), engagement rates, subscriber growth rates,
                  and cross-platform trend signals. This comprehensive analysis helps creators understand
                  not just what's popular, but why certain content resonates with audiences.
                </p>
              </article>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Category Grid */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Popular Categories
                </h3>
                <div className="space-y-3">
                  {content.topCategories.map((category, idx) => (
                    <Link
                      key={idx}
                      href={`/trends/${country.toLowerCase()}/${category.slug}`}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-red-50 hover:border-red-200 border border-transparent transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                          <span className="text-red-600 text-xs font-bold">{idx + 1}</span>
                        </div>
                        <span className="font-medium text-gray-700 group-hover:text-red-700">
                          {category.name}
                        </span>
                      </div>
                      <span className="text-green-600 text-sm font-medium">{category.growth}</span>
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/trends/${country.toLowerCase()}/all`}
                  className="mt-4 flex items-center justify-center gap-2 text-red-600 font-medium hover:text-red-700 transition-colors"
                >
                  View All Categories
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Related Insights */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Related Insights
                </h3>
                <div className="space-y-3">
                  {[
                    { title: 'Why Videos Go Viral on YouTube', slug: 'why-videos-go-viral-on-youtube' },
                    { title: 'How to Spot Emerging Trends', slug: 'how-to-spot-emerging-trends' },
                    { title: 'Understanding View Velocity', slug: 'understanding-view-velocity' },
                    { title: 'Content Strategy for 2025', slug: 'content-strategy-for-2025' }
                  ].map((article, idx) => (
                    <Link
                      key={idx}
                      href={`/insights/${article.slug}`}
                      className="block p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <span className="text-gray-700 group-hover:text-red-600 font-medium">
                        {article.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-6 text-white">
                <h3 className="text-xl font-bold mb-2">
                  Track Trends in Real-Time
                </h3>
                <p className="text-red-100 text-sm mb-4">
                  Get daily alerts for trending content in {content.name}
                </p>
                <Link
                  href="/signup"
                  className="w-full py-3 px-4 bg-white text-red-600 rounded-xl font-semibold text-center block hover:bg-red-50 transition-colors"
                >
                  Start Free Trial
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
              <Flame className="w-6 h-6 text-red-600" />
              Trending in {content.name}
            </h2>
            <Link
              href={`/trends/${country.toLowerCase()}/videos`}
              className="flex items-center gap-2 text-red-600 font-medium hover:text-red-700"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Video Grid Component */}
          <TrendVideosGrid
            videos={trendingVideos}
            keyword={content.name}
            initialRegion={upperCountry}
          />
        </div>
      </section>

      {/* Internal Links */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Explore Other Regions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            {Object.entries(COUNTRIES).map(([code, data]) => (
              code !== upperCountry && (
                <Link
                  key={code}
                  href={`/trends/${code.toLowerCase()}`}
                  className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-200 hover:border-red-300 hover:shadow-md transition-all"
                >
                  <span className="text-2xl">{data.flag}</span>
                  <span className="font-medium text-gray-700">{data.name}</span>
                </Link>
              )
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
