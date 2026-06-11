import type { Metadata } from 'next'
import Link from 'next/link'
import { getRegion } from '@/lib/region-server'
import { fetchTrendingVideos } from '@/lib/api-client'
import { FAQPageSchema, BreadcrumbSchema, ArticleSchema } from '@/app/components/JsonLd'
import { extractVideoId, isValidYouTubeUrl } from '@/lib/youtube-parser'
import { AnalyzeHeroForm } from '@/app/components/AnalyzeHeroForm'

export const metadata: Metadata = {
  title: '📊 Free YouTube Channel Analytics Tool | Stats & Insights (2025)',
  description: 'Analyze any YouTube channel for free. View subscriber growth, engagement rates, top videos, and trending content. No login required. Get insights now!',
  keywords: [
    'youtube channel analytics',
    'youtube analytics tool free',
    'channel stats',
    'youtube engagement rate',
    'channel growth tracker',
    'video performance analysis',
    'youtube analytics 2025',
  ],
  alternates: {
    canonical: 'https://tubefission.com/youtube-channel-analytics',
  },
  openGraph: {
    title: 'YouTube Channel Analytics Tool — Free Channel Stats & Insights',
    description: 'Analyze any YouTube channel for free. View subscriber growth, engagement rates, top videos, and trending content.',
    url: 'https://tubefission.com/youtube-channel-analytics',
    type: 'article',
  },
}

const FAQ_ITEMS = [
  {
    question: 'Can I analyze any YouTube channel?',
    answer: 'Yes. As long as the channel is public, Tubefission can fetch its statistics, top videos, and engagement metrics through the YouTube API.',
  },
  {
    question: 'What metrics does the analytics tool show?',
    answer: 'We display total views, average engagement rate, like-to-view ratio, comment density, upload frequency, top-performing videos, and a breakout score based on recent velocity.',
  },
  {
    question: 'How often is the data updated?',
    answer: 'Analytics are fetched in real-time when you submit a channel URL. Trending data is refreshed hourly to ensure you see the latest numbers.',
  },
  {
    question: 'Do I need a YouTube account to use this?',
    answer: 'No. Tubefission does not require any login or API key from you. Paste a channel URL and get instant results.',
  },
  {
    question: 'Is the analytics data accurate?',
    answer: 'All data comes directly from the official YouTube Data API. The numbers you see are the same metrics YouTube tracks internally.',
  },
]

export default async function AnalyticsPage() {
  const region = await getRegion()
  const videos = await fetchTrendingVideos(region, 50)

  const totalViews = videos.reduce((sum, v) => sum + Number(v.statistics?.viewCount || 0), 0)
  const avgEngagement = videos.length > 0
    ? videos.reduce((sum, v) => {
        const views = Number(v.statistics?.viewCount || 1)
        const likes = Number(v.statistics?.likeCount || 0)
        const comments = Number(v.statistics?.commentCount || 0)
        return sum + ((likes + comments * 2) / views) * 100
      }, 0) / videos.length
    : 0

  return (
    <main className="min-h-screen bg-white">
      {/* Structured Data */}
      <ArticleSchema
        title="YouTube Channel Analytics Tool — Free Channel Stats & Insights"
        description="Analyze any YouTube channel for free. View subscriber growth, engagement rates, top videos, and trending content."
        url="https://tubefission.com/youtube-channel-analytics"
        datePublished="2026-01-01"
      />
      <FAQPageSchema items={FAQ_ITEMS} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://tubefission.com' },
        { name: 'YouTube Channel Analytics', url: 'https://tubefission.com/youtube-channel-analytics' },
      ]} />

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white pt-16 pb-12 sm:pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-4 leading-tight">
            YouTube Channel Analytics Tool
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Analyze any YouTube channel for free. View subscriber growth, engagement rates, top videos, and trending content. No login required.
          </p>
          <AnalyzeHeroForm />
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              Real-time data
            </span>
            <span className="inline-flex items-center gap-1">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              No login
            </span>
            <span className="inline-flex items-center gap-1">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              100% free
            </span>
          </div>
        </div>
      </section>

      {/* Sample Stats from Current Region */}
      <section className="border-y border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-gray-500 mb-4">Live sample data from {region}</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{videos.length}</p>
              <p className="text-sm text-gray-500">Videos Analyzed</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{(totalViews / 1e9).toFixed(1)}B</p>
              <p className="text-sm text-gray-500">Total Views</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{avgEngagement.toFixed(1)}%</p>
              <p className="text-sm text-gray-500">Avg Engagement</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">6</p>
              <p className="text-sm text-gray-500">Countries Supported</p>
            </div>
          </div>
        </div>
      </section>

      {/* Internal Links */}
      <section className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm">
            <Link href="/download-youtube-video" className="text-blue-600 hover:text-blue-800 font-medium">
              YouTube Video Download →
            </Link>
            <Link href="/trending" className="text-blue-600 hover:text-blue-800 font-medium">
              Trending Videos →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TUTORIAL ===== */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">How to Analyze a YouTube Channel</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          Understanding how a YouTube channel performs is critical whether you are a creator planning your next move, a marketer researching influencers, or an investor evaluating digital assets. Tubefissions analytics tool breaks down any public channel into clear, actionable metrics in four simple steps.
        </p>

        <div className="space-y-8 mb-12">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">1</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Copy the Channel URL</h3>
              <p className="text-gray-600">Navigate to the YouTube channel you want to analyze. Copy the URL from your browser address bar. You can use standard channel links, custom URLs (youtube.com/c/name), or handle links (youtube.com/@name).</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">2</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Paste into the Analyzer</h3>
              <p className="text-gray-600">Return to this page and paste the URL into the input field at the top. Click the Analyze button to trigger the data fetch.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">3</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Review the Dashboard</h3>
              <p className="text-gray-600">Within seconds, you will see a comprehensive breakdown including total views, average engagement rate, upload consistency, top-performing videos, and a breakout score that signals recent momentum.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">4</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Export or Compare</h3>
              <p className="text-gray-600">Use the insights to benchmark against competitors, identify content gaps, or plan your own publishing strategy. All data is exportable and shareable.</p>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-6">What Metrics Matter for Channel Growth</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          Not all numbers are equally important. Here is what our analytics tool focuses on and why each metric matters for creators and marketers:
        </p>

        <div className="space-y-4 mb-10">
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-1">Engagement Rate</h3>
            <p className="text-sm text-gray-600">The percentage of viewers who like or comment relative to total views. High engagement signals that the audience finds the content valuable, which improves algorithmic distribution.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-1">View Velocity</h3>
            <p className="text-sm text-gray-600">How quickly a video accumulates views after publishing. Channels with consistently high velocity are favored by the recommendation algorithm.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-1">Upload Consistency</h3>
            <p className="text-sm text-gray-600">Channels that publish on a predictable schedule build stronger audience habits. Sporadic uploading often leads to subscriber churn and reduced reach.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-1">Breakout Score</h3>
            <p className="text-sm text-gray-600">A composite metric combining recent velocity, engagement spike, and cross-video momentum. A score above 70 indicates a channel is entering a rapid growth phase.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-6">Use Cases for YouTube Analytics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Competitor Benchmarking</h3>
            <p className="text-sm text-gray-600">Compare your channel against direct competitors to identify where you are winning and where you are falling behind on engagement and upload frequency.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Influencer Vetting</h3>
            <p className="text-sm text-gray-600">Marketers can verify if an influencers engagement is genuine and whether their growth curve indicates sustainable audience building or artificial inflation.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Content Strategy</h3>
            <p className="text-sm text-gray-600">Study top-performing videos in your niche to identify recurring topics, title patterns, and thumbnail styles that drive the highest click-through rates.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Trend Timing</h3>
            <p className="text-sm text-gray-600">Spot channels that are gaining breakout momentum early. Collaborating with or covering content from rising channels can boost your own visibility.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Real Data Beats Estimates</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          Many analytics platforms rely on sampling or third-party estimates that can be weeks out of date. Tubefission pulls directly from the YouTube Data API, which means the numbers you see are the same numbers YouTube uses internally. View counts, like ratios, comment densities, and publication timestamps are all fetched live at the moment of analysis.
        </p>
        <p className="text-gray-700 leading-relaxed mb-10">
          This accuracy matters when you are making decisions. A strategy built on stale data might target a trend that has already peaked. With Tubefission, you are working with the present, not the past.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/download-youtube-video" className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            Download YouTube Video →
          </Link>
          <Link href="/" className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
            Back to Home
          </Link>
        </div>
      </article>

      {/* ===== FAQ ===== */}
      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{item.question}</h3>
                <p className="text-gray-600 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
