import type { Metadata } from 'next'
import Link from 'next/link'
import { getRegion } from '@/lib/region-server'
import { fetchTrendingVideos } from '@/lib/api-client'
import { FAQPageSchema, BreadcrumbSchema, ArticleSchema } from '@/app/components/JsonLd'
import { AnalyzeHeroForm } from '@/app/components/AnalyzeHeroForm'

export const metadata: Metadata = {
  title: 'YouTube Channel Analytics Tool — Free Channel Stats & Insights',
  description: 'Analyze any YouTube channel for free. View subscriber growth, engagement rates, top videos, and trending content. No login required.',
  keywords: [
    'YouTube analytics',
    'YouTube channel analytics',
    'channel stats',
    'YouTube engagement rate',
    'channel growth tracker',
    'video performance analysis',
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

function formatNumber(n: number) {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return n.toLocaleString()
}

function summarizeChannels(videos: any[]) {
  const map = new Map<string, { channelId?: string; channelTitle: string; views: number; engagement: number; count: number }>()

  for (const video of videos) {
    const title = video.snippet?.channelTitle || 'Unknown channel'
    const views = Number(video.statistics?.viewCount || 0)
    const engagementViews = views || 1
    const likes = Number(video.statistics?.likeCount || 0)
    const comments = Number(video.statistics?.commentCount || 0)
    const engagement = ((likes + comments * 2) / engagementViews) * 100

    if (!map.has(title)) {
      map.set(title, {
        channelId: video.snippet?.channelId,
        channelTitle: title,
        views: 0,
        engagement: 0,
        count: 0,
      })
    }

    const current = map.get(title)!
    current.views += views
    current.engagement += engagement
    current.count += 1
  }

  return Array.from(map.values())
    .map((channel) => ({
      ...channel,
      avgViews: channel.count ? channel.views / channel.count : 0,
      avgEngagement: channel.count ? channel.engagement / channel.count : 0,
    }))
    .sort((a, b) => b.avgViews - a.avgViews)
    .slice(0, 6)
}

export default async function AnalyticsPage() {
  const region = await getRegion()
  const videos = await fetchTrendingVideos(region, 50)
  const channelSamples = summarizeChannels(videos)

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
            <span className="inline-flex items-center gap-1">• Real-time data</span>
            <span className="inline-flex items-center gap-1">• No login</span>
            <span className="inline-flex items-center gap-1">• 100% free</span>
          </div>
        </div>
      </section>

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
              <p className="text-2xl font-bold text-gray-900">{channelSamples.length}</p>
              <p className="text-sm text-gray-500">Sample Channels</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Live Channel Samples</h2>
          <Link href="/trending" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            See full trending list →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {channelSamples.map((channel, index) => (
            <div key={channel.channelTitle} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-sm transition">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Sample #{index + 1}</div>
                {channel.channelId && (
                  <Link href={`/channel/${channel.channelId}`} className="text-xs font-medium text-blue-600 hover:text-blue-700">
                    Analyze →
                  </Link>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{channel.channelTitle}</h3>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <div className="text-gray-400 text-xs uppercase tracking-wider">Avg Views</div>
                  <div className="font-bold text-gray-900">{formatNumber(Math.round(channel.avgViews))}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs uppercase tracking-wider">Engagement</div>
                  <div className="font-bold text-gray-900">{channel.avgEngagement.toFixed(2)}%</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs uppercase tracking-wider">Samples</div>
                  <div className="font-bold text-gray-900">{channel.count}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">How to Analyze a YouTube Channel</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          Understanding how a YouTube channel performs is critical whether you are a creator planning your next move, a marketer researching influencers, or an investor evaluating digital assets. Tubefission's analytics tool breaks down any public channel into clear, actionable metrics.
        </p>

        <div className="space-y-8 mb-12">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">1</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Copy the Channel URL</h3>
              <p className="text-gray-600">Use a standard channel link, custom URL, or handle link.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">2</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Paste into the Analyzer</h3>
              <p className="text-gray-600">The analyzer fetches real-time metrics instantly.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">3</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Review the Dashboard</h3>
              <p className="text-gray-600">Inspect views, engagement, posting rhythm, and best-performing content.</p>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-6">What Metrics Matter for Channel Growth</h2>
        <div className="space-y-4 mb-10">
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-1">Engagement Rate</h3>
            <p className="text-sm text-gray-600">High engagement signals that the audience finds the content valuable, which improves algorithmic distribution.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-1">View Velocity</h3>
            <p className="text-sm text-gray-600">Channels with consistently high velocity are favored by the recommendation algorithm.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-1">Upload Consistency</h3>
            <p className="text-sm text-gray-600">Predictable publishing builds stronger audience habits.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-1">Breakout Score</h3>
            <p className="text-sm text-gray-600">A composite metric combining recent velocity, engagement spike, and cross-video momentum.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/trending" className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            Trending Videos →
          </Link>
          <Link href="/compare-new?type=channels" className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
            Compare Channels →
          </Link>
        </div>
      </article>
    </main>
  )
}
