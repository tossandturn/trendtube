import type { Metadata } from 'next'
import Link from 'next/link'
import { AnalyzeHeroForm } from '@/app/components/AnalyzeHeroForm'
import { FAQPageSchema, BreadcrumbSchema, ArticleSchema } from '@/app/components/JsonLd'
import { searchYouTubeMulti } from '@/lib/api-client'
import { getViewVelocity, getEngagementRate } from '@/lib/analytics'

export const metadata: Metadata = {
  title: 'YouTube Competitor Analysis — AI-Powered Channel Intelligence',
  description: 'Analyze YouTube competitors with AI. Compare channel growth, engagement rates, content strategies, and discover winning tactics. Free, no registration.',
  keywords: [
    'YouTube competitor analysis',
    'channel competitor research',
    'YouTube competitive intelligence',
    'compare YouTube channels',
    'competitor benchmarking',
    'YouTube growth strategy',
    'channel analytics comparison',
  ],
  alternates: {
    canonical: 'https://tubefission.com/youtube-competitor-analysis',
  },
  openGraph: {
    title: 'YouTube Competitor Analysis — AI-Powered Channel Intelligence',
    description: 'Analyze YouTube competitors with AI. Compare channel growth, engagement rates, and discover winning tactics.',
    url: 'https://tubefission.com/youtube-competitor-analysis',
    type: 'article',
  },
}

const FAQ_ITEMS = [
  {
    question: 'How does YouTube competitor analysis work?',
    answer: 'Paste any YouTube channel or video URL into our tool. Our AI engine fetches real-time data including subscriber growth, engagement rates, upload frequency, and top-performing content. We then generate actionable insights comparing the channel against industry benchmarks.',
  },
  {
    question: 'What metrics can I compare?',
    answer: 'You can compare subscriber velocity, average views per video, engagement rate (likes + comments / views), upload consistency, content type distribution, and thumbnail effectiveness scores across multiple channels.',
  },
  {
    question: 'Is competitor analysis free?',
    answer: 'Yes. Basic competitor analysis is completely free with no account required. Advanced features like historical trend comparison and batch analysis may require registration in the future.',
  },
  {
    question: 'Can I analyze private channels?',
    answer: 'No. We can only analyze public YouTube channels and videos using the official YouTube Data API. Private or unlisted content cannot be accessed.',
  },
  {
    question: 'How accurate is the competitor data?',
    answer: 'All data comes directly from the YouTube Data API and is refreshed daily. Our AI scoring models analyze patterns across thousands of channels to provide reliable benchmarks and recommendations.',
  },
  {
    question: 'What is the Viral Score?',
    answer: 'Viral Score is an AI-calculated metric (0-100) that predicts a videos potential to go viral based on engagement velocity, audience retention signals, and historical trend patterns from similar content.',
  },
  {
    question: 'Can I compare more than two channels?',
    answer: 'Currently our tool analyzes one channel at a time with detailed breakdowns. Multi-channel comparison dashboards are on our roadmap for advanced users.',
  },
  {
    question: 'How often should I analyze competitors?',
    answer: 'For active creators, we recommend weekly competitor checks to spot trending topics and strategy shifts. For marketers and agencies, monthly deep-dives are usually sufficient.',
  },
]

function formatNumber(n: number) {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return n.toLocaleString()
}

function summarizeChannel(video: any, allVideos: any[]) {
  const channelTitle = video.snippet?.channelTitle || 'Unknown channel'
  const channelVideos = allVideos.filter((v: any) => v.snippet?.channelTitle === channelTitle)
  const avgViews = channelVideos.length
    ? channelVideos.reduce((sum: number, v: any) => sum + Number(v.statistics?.viewCount || 0), 0) / channelVideos.length
    : 0
  const avgEngagement = channelVideos.length
    ? channelVideos.reduce((sum: number, v: any) => sum + getEngagementRate(v), 0) / channelVideos.length
    : 0
  const avgVelocity = channelVideos.length
    ? channelVideos.reduce((sum: number, v: any) => sum + getViewVelocity(v), 0) / channelVideos.length
    : 0

  return {
    channelTitle,
    channelId: video.snippet?.channelId,
    avgViews,
    avgEngagement,
    avgVelocity,
    sampleCount: channelVideos.length,
  }
}

export default async function CompetitorAnalysisPage() {
  const sampleVideos = await searchYouTubeMulti(['youtube creator tips', 'youtube growth strategy', 'channel growth'], 12, 'viewCount')

  const competitors = sampleVideos
    .map((video: any) => summarizeChannel(video, sampleVideos))
    .filter((channel: any, index: number, arr: any[]) => arr.findIndex((c) => c.channelTitle === channel.channelTitle) === index)
    .sort((a: any, b: any) => b.avgViews - a.avgViews)
    .slice(0, 6)

  return (
    <main className="min-h-screen bg-white">
      <ArticleSchema
        title="YouTube Competitor Analysis — AI-Powered Channel Intelligence"
        description="Analyze YouTube competitors with AI. Compare channel growth, engagement rates, content strategies, and discover winning tactics."
        url="https://tubefission.com/youtube-competitor-analysis"
        datePublished="2026-01-01"
      />
      <FAQPageSchema items={FAQ_ITEMS} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://tubefission.com' },
        { name: 'YouTube Competitor Analysis', url: 'https://tubefission.com/youtube-competitor-analysis' },
      ]} />

      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white pt-16 pb-12 sm:pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-4 leading-tight">
            YouTube Competitor Analysis
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            AI-powered competitive intelligence for YouTube. Analyze rival channels, compare growth metrics, and reverse-engineer winning strategies.
          </p>
          <AnalyzeHeroForm />
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1">• Real-time data</span>
            <span className="inline-flex items-center gap-1">• AI insights</span>
            <span className="inline-flex items-center gap-1">• No registration</span>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Live Competitor Snapshot</h2>
          <Link href="/compare-new" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Open compare tool →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
          {competitors.map((channel: any, index: number) => (
            <div key={channel.channelTitle} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-sm transition">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Competitor #{index + 1}</div>
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
                  <div className="text-gray-400 text-xs uppercase tracking-wider">Velocity</div>
                  <div className="font-bold text-gray-900">{channel.avgVelocity >= 1e6 ? (channel.avgVelocity / 1e6).toFixed(1) + 'M/d' : channel.avgVelocity >= 1e3 ? (channel.avgVelocity / 1e3).toFixed(1) + 'K/d' : Math.round(channel.avgVelocity) + '/d'}</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-500">Sample size: {channel.sampleCount} videos</div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm">
            <Link href="/youtube-channel-analytics" className="text-blue-600 hover:text-blue-800 font-medium">
              Channel Analytics →
            </Link>
            <Link href="/trends" className="text-blue-600 hover:text-blue-800 font-medium">
              Trend Database →
            </Link>
            <Link href="/ai-assistant" className="text-blue-600 hover:text-blue-800 font-medium">
              AI Assistant →
            </Link>
          </div>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">AI-Powered YouTube Competitive Intelligence</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          Understanding what your competitors are doing is half the battle in growing a YouTube channel. Our <strong>YouTube competitor analysis</strong> tool uses AI to dissect rival channels, reveal their growth strategies, and identify opportunities they are missing — so you can outrank them.
        </p>
        <p className="text-gray-700 leading-relaxed mb-10">
          Unlike manual research that takes hours of spreadsheet work, Tubefission automates the entire process. Paste a competitor channel URL, and within seconds you will see subscriber velocity, engagement benchmarks, content gap analysis, and AI-generated strategic recommendations tailored to your niche.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Metrics We Analyze</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Subscriber Velocity</h3>
            <p className="text-sm text-gray-600">Track how fast competitors gain subscribers relative to their upload frequency and content strategy.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Engagement Rate</h3>
            <p className="text-sm text-gray-600">Compare likes, comments, and shares per view to identify which content types resonate most with audiences.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Content Type Distribution</h3>
            <p className="text-sm text-gray-600">See what percentage of their content is tutorials, vlogs, reviews, or Shorts — and which drives the most growth.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Upload Consistency</h3>
            <p className="text-sm text-gray-600">Analyze publishing schedules to understand the optimal frequency and timing for audience retention.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/youtube-channel-analytics" className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            Channel Analytics →
          </Link>
          <Link href="/compare-new" className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
            Open Compare Tool →
          </Link>
        </div>
      </article>

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
