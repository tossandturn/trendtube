/* =========================================================
   BREAKOUT KEYWORD PAGE - Trending keyword analytics
   /breakout/[keyword]/page.tsx
========================================================= */

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  TrendingUp,
  Zap,
  Clock,
  ArrowUp,
  ArrowRight,
  Users,
  Play,
  Target,
  BarChart3,
  Flame,
  ChevronRight,
  LineChart,
  Activity
} from 'lucide-react'
import { DatasetSchema } from '@/app/components/DatasetSchema'
import { BreadcrumbSchema } from '@/app/components/ArticleSchema'
import TrendVideosGrid from '@/app/components/TrendVideosGrid'
import { fetchTrendingVideos } from '@/lib/api-client'

interface PageProps {
  params: Promise<{ keyword: string }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { keyword } = await params
  const decodedKeyword = decodeURIComponent(keyword).replace(/-/g, ' ')

  return {
    title: `${decodedKeyword} - Breakout YouTube Trend | TubeFission`,
    description: `Track the "${decodedKeyword}" trend on YouTube. Real-time analytics, related videos, and content opportunities. See velocity, growth patterns, and recommended strategies.`,
    keywords: [
      decodedKeyword,
      'trending keyword',
      'youtube trends',
      'viral content',
      'breakout keyword',
      'content opportunities',
      'video analytics'
    ],
    openGraph: {
      title: `${decodedKeyword} - Breakout Trend | TubeFission`,
      description: `Real-time analytics for "${decodedKeyword}" trend on YouTube.`,
      type: 'website',
      images: [{
        url: '/og-image.jpg',
        width: 1200,
        height: 630
      }]
    },
    alternates: {
      canonical: `https://tubefission.com/breakout/${keyword}`
    }
  }
}

// Main page component
export default async function BreakoutKeywordPage({ params }: PageProps) {
  const { keyword } = await params
  const decodedKeyword = decodeURIComponent(keyword).replace(/-/g, ' ')

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  // Mock data - in production, fetch from API
  const keywordData = {
    keyword: decodedKeyword,
    velocity: Math.floor(Math.random() * 5000) + 1000,
    velocityChange: Math.floor(Math.random() * 300) + 50,
    trend: 'up' as const,
    firstSeen: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US'),
    peakDay: 'Today',
    category: ['Technology', 'Entertainment', 'Education'][Math.floor(Math.random() * 3)],
    competition: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
    opportunityScore: Math.floor(Math.random() * 30) + 70,
    relatedKeywords: [
      `${decodedKeyword} tutorial`,
      `${decodedKeyword} review`,
      `best ${decodedKeyword}`,
      `${decodedKeyword} 2026`,
      `how to ${decodedKeyword}`
    ],
    historicalData: Array.from({ length: 7 }, (_, i) => ({
      day: `Day ${i + 1}`,
      views: Math.floor(Math.random() * 5000) + (i * 1000)
    })),
    lifecycle: {
      stage: ['emerging', 'accelerating', 'peak', 'mature'][Math.floor(Math.random() * 3)],
      daysToPeak: Math.floor(Math.random() * 14) + 3,
      predictedDecline: Math.floor(Math.random() * 30) + 14
    }
  }

  // Get trending videos for this keyword
  const trendingVideos = await fetchTrendingVideos('GLOBAL', 12)

  // Breadcrumb items
  const breadcrumbItems = [
    { name: 'Home', url: 'https://tubefission.com/' },
    { name: 'Breakout', url: 'https://tubefission.com/breakout' },
    { name: decodedKeyword, url: `https://tubefission.com/breakout/${keyword}` }
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Schema Markup */}
      <DatasetSchema
        name={`${decodedKeyword} Trend Analysis`}
        description={`Comprehensive trend analysis for "${decodedKeyword}" keyword on YouTube, including velocity metrics, historical data, and content recommendations.`}
        url={`https://tubefission.com/breakout/${keyword}`}
        keywords={[decodedKeyword, 'trend analysis', 'youtube keywords', 'content opportunities']}
        temporalCoverage={today}
        variableMeasured={['Search volume', 'View velocity', 'Engagement rate', 'Competition level']}
        measurementTechnique="Real-time trend tracking and predictive analytics"
      />
      <BreadcrumbSchema items={breadcrumbItems} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 via-red-700 to-red-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {/* Breadcrumb */}
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-red-100">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><span className="text-red-300">/</span></li>
              <li><Link href="/breakout" className="hover:text-white transition-colors">Breakout</Link></li>
              <li><span className="text-red-300">/</span></li>
              <li className="text-white font-medium capitalize">{decodedKeyword}</li>
            </ol>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="lg:w-2/3">
              {/* Trending Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-4 border border-white/20">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-orange-100">Breakout Trend</span>
                <span className="text-red-200">•</span>
                <span className="text-white">{keywordData.category}</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 capitalize">
                {decodedKeyword}
              </h1>
              <p className="text-xl text-red-100 mb-4">
                Real-time trend velocity: {keywordData.velocity.toLocaleString()} views/hour
              </p>
              <p className="text-lg text-red-50 max-w-3xl leading-relaxed">
                This keyword is experiencing rapid growth with {keywordData.velocityChange}% increase
                in search volume over the past 24 hours. First detected {keywordData.firstSeen},
                this trend shows strong momentum in the {keywordData.category.toLowerCase()} category.
              </p>
            </div>

            {/* Opportunity Score Card */}
            <div className="lg:w-1/3 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Opportunity Score
              </h3>
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="white"
                      strokeWidth="8"
                      strokeDasharray={`${(keywordData.opportunityScore / 100) * 283} 283`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold">{keywordData.opportunityScore}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-red-200">Competition:</span>
                  <span className="font-semibold">{keywordData.competition}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-red-200">Trend:</span>
                  <span className="flex items-center gap-1 font-semibold text-green-400">
                    <ArrowUp className="w-4 h-4" />
                    +{keywordData.velocityChange}%
                  </span>
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
              {/* Velocity Explanation */}
              <article className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Zap className="w-6 h-6 text-red-600" />
                  Understanding Trend Velocity
                </h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Trend velocity measures how quickly content related to "{decodedKeyword}" is gaining
                  traction on YouTube. This metric combines view accumulation rate, engagement growth,
                  and search volume increases to identify breakout opportunities.
                </p>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-5 h-5 text-red-600" />
                      <span className="font-medium text-gray-900">Current Velocity</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {keywordData.velocity.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">views/hour</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-gray-900">24h Growth</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      +{keywordData.velocityChange}%
                    </p>
                    <p className="text-sm text-gray-500">acceleration</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-gray-900">Trend Age</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.floor(Math.random() * 7) + 1} days
                    </p>
                    <p className="text-sm text-gray-500">since emergence</p>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                  <h3 className="font-semibold text-blue-900 mb-2">What This Means</h3>
                  <p className="text-blue-800">
                    Keywords with velocity above 1,000 views/hour and growth rates exceeding 50%
                    typically indicate emerging trends with 2-3 weeks of growth potential.
                    Early content creation captures algorithmic favor while competition remains low.
                  </p>
                </div>
              </article>

              {/* Historical Data */}
              <article className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <LineChart className="w-6 h-6 text-red-600" />
                  Historical Performance
                </h2>

                {/* Simple Bar Chart Visualization */}
                <div className="mb-6">
                  <div className="flex items-end justify-between gap-2 h-48">
                    {keywordData.historicalData.map((day, idx) => {
                      const maxViews = Math.max(...keywordData.historicalData.map(d => d.views))
                      const height = (day.views / maxViews) * 100
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                          <div
                            className="w-full bg-red-500 rounded-t-lg transition-all hover:bg-red-600"
                            style={{ height: `${height}%` }}
                            title={`${day.day}: ${day.views.toLocaleString()} views`}
                          />
                          <span className="text-xs text-gray-500">{day.day}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Trend Trajectory</h3>
                    <p className="text-gray-600">
                      The trend shows consistent upward momentum with accelerating growth
                      over the past week. Peak performance is projected within the next
                      {keywordData.lifecycle.daysToPeak} days.
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Lifecycle Prediction</h3>
                    <p className="text-gray-600">
                      Currently in the <strong>{keywordData.lifecycle.stage}</strong> phase.
                      Expected decline begins in approximately {keywordData.lifecycle.predictedDecline} days.
                      Optimal content window: now through day {keywordData.lifecycle.daysToPeak}.
                    </p>
                  </div>
                </div>
              </article>

              {/* Content Recommendations */}
              <article className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border border-red-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Target className="w-6 h-6 text-red-600" />
                  Content Strategy Recommendations
                </h2>

                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-sm font-bold">1</span>
                      Act Quickly
                    </h3>
                    <p className="text-gray-600">
                      With the trend in {keywordData.lifecycle.stage} phase, content published
                      in the next 48-72 hours will have maximum algorithmic advantage and minimal competition.
                    </p>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-sm font-bold">2</span>
                      Angle Differentiation
                    </h3>
                    <p className="text-gray-600">
                      Don't just copy existing content. Find your unique angle on {decodedKeyword}.
                      Review top-performing videos and identify gaps or fresh perspectives.
                    </p>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-sm font-bold">3</span>
                      Optimize for Discovery
                    </h3>
                    <p className="text-gray-600">
                      Include "{decodedKeyword}" in your title within the first 60 characters.
                      Use related keywords in tags and descriptions to capture semantic search.
                    </p>
                  </div>
                </div>
              </article>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Related Keywords */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-red-600" />
                  Related Keywords
                </h3>
                <div className="space-y-2">
                  {keywordData.relatedKeywords.map((related, idx) => (
                    <Link
                      key={idx}
                      href={`/breakout/${related.replace(/\s+/g, '-')}`}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <span className="text-gray-700 capitalize group-hover:text-red-600">
                        {related}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Trend Status */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Trend Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Stage</span>
                    <span className="font-bold text-gray-900 capitalize">{keywordData.lifecycle.stage}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Competition</span>
                    <span className={`font-bold ${
                      keywordData.competition === 'Low' ? 'text-green-600' :
                      keywordData.competition === 'Medium' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {keywordData.competition}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Category</span>
                    <span className="font-bold text-gray-900">{keywordData.category}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">First Seen</span>
                    <span className="font-bold text-gray-900">{keywordData.firstSeen}</span>
                  </div>
                </div>
              </div>

              {/* Related Channels */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-red-600" />
                  Top Creators
                </h3>
                <div className="space-y-3">
                  {[
                    { name: 'TrendSpotter', views: '2.4M', growth: '+156%' },
                    { name: 'ViralInsights', views: '1.8M', growth: '+89%' },
                    { name: 'ContentKing', views: '1.2M', growth: '+67%' }
                  ].map((channel, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold">
                        {channel.name[0]}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{channel.name}</p>
                        <p className="text-sm text-gray-500">{channel.views} views</p>
                      </div>
                      <span className="text-green-600 text-sm font-medium">{channel.growth}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-6 text-white">
                <h3 className="text-xl font-bold mb-2">
                  Track This Trend
                </h3>
                <p className="text-red-100 text-sm mb-4">
                  Get alerts when "{decodedKeyword}" spikes
                </p>
                <Link
                  href="/signup"
                  className="w-full py-3 px-4 bg-white text-red-600 rounded-xl font-semibold text-center block hover:bg-red-50 transition-colors"
                >
                  Set Alert
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
              Videos About "{decodedKeyword}"
            </h2>
            <Link
              href={`/trends?keyword=${encodeURIComponent(decodedKeyword)}`}
              className="flex items-center gap-2 text-red-600 font-medium hover:text-red-700"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <TrendVideosGrid
            videos={trendingVideos}
            keyword={decodedKeyword}
            initialRegion="GLOBAL"
          />
        </div>
      </section>

      {/* Trend Lifecycle Visualization */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <Clock className="w-6 h-6 text-red-600" />
            Trend Lifecycle
          </h2>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            {/* Lifecycle Timeline */}
            <div className="relative">
              <div className="flex items-center justify-between mb-8">
                {['Emerging', 'Accelerating', 'Peak', 'Mature', 'Declining'].map((stage, idx) => {
                  const stages = ['emerging', 'accelerating', 'peak', 'mature', 'declining']
                  const currentStageIndex = stages.indexOf(keywordData.lifecycle.stage)
                  const isActive = idx <= currentStageIndex
                  const isCurrent = idx === currentStageIndex

                  return (
                    <div key={stage} className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                          isCurrent
                            ? 'bg-red-600 text-white ring-4 ring-red-100'
                            : isActive
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        <span className="font-bold">{idx + 1}</span>
                      </div>
                      <span className={`text-sm font-medium ${
                        isCurrent ? 'text-red-600' : isActive ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        {stage}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Progress Bar */}
              <div className="relative h-2 bg-gray-200 rounded-full">
                <div
                  className="absolute h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full transition-all"
                  style={{
                    width: `${((['emerging', 'accelerating', 'peak', 'mature', 'declining'].indexOf(keywordData.lifecycle.stage) + 1) / 5) * 100}%`
                  }}
                />
              </div>
            </div>

            <div className="mt-8 grid md:grid-cols-3 gap-6 text-center">
              <div className="p-4 bg-green-50 rounded-xl">
                <h4 className="font-semibold text-green-900 mb-1">Emerging Phase</h4>
                <p className="text-sm text-green-700">
                  Low competition, high opportunity. Best time to establish authority.
                </p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-xl">
                <h4 className="font-semibold text-yellow-900 mb-1">Peak Phase</h4>
                <p className="text-sm text-yellow-700">
                  Maximum visibility but highest competition. Quality differentiates.
                </p>
              </div>
              <div className="p-4 bg-red-50 rounded-xl">
                <h4 className="font-semibold text-red-900 mb-1">Declining Phase</h4>
                <p className="text-sm text-red-700">
                  Prepare transition to next trend. Maintain audience with related content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Trends */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Similar Breakout Trends
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'ai-automation',
              'short-form-content',
              'creator-economy',
              'live-streaming'
            ].map((trend) => (
              <Link
                key={trend}
                href={`/breakout/${trend}`}
                className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-red-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-xs text-gray-500">Trending</span>
                </div>
                <p className="font-medium text-gray-900 capitalize">
                  {trend.replace(/-/g, ' ')}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
