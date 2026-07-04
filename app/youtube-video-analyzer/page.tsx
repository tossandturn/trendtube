import type { Metadata } from 'next'
import Link from 'next/link'
import { AnalyzeHeroForm } from '@/app/components/AnalyzeHeroForm'
import { BreadcrumbSchema, FAQPageSchema } from '@/app/components/JsonLd'
import { fetchTrendingVideos } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'
import { getViewVelocity, getEngagementRate } from '@/lib/analytics'
import AddToVideoCompareButton from '@/app/components/AddToVideoCompareButton'

export const metadata: Metadata = {
  title: 'YouTube Video Analyzer — Free Video Performance Analytics',
  description: 'Analyze any YouTube video with our free Video Analyzer. Get engagement metrics, SEO scores, and optimization recommendations instantly.',
  keywords: 'youtube video analyzer, video performance analytics, youtube video stats, video engagement analyzer',
  alternates: {
    canonical: 'https://tubefission.com/youtube-video-analyzer',
  },
}

const FAQ_ITEMS = [
  {
    question: 'What metrics does the Video Analyzer show?',
    answer: 'View count, likes, comments, engagement rate, velocity, upload time analysis, and SEO optimization scores.',
  },
  {
    question: 'How accurate is the data?',
    answer: 'All data comes directly from the YouTube Data API and is refreshed daily for maximum accuracy.',
  },
]

function formatNumber(n: number) {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return n.toLocaleString()
}

export default async function Page() {
  const region = await getRegion()
  const videos = await fetchTrendingVideos(region, 12)

  const samples = videos.map((video: any) => ({
    video,
    engagement: getEngagementRate(video),
    velocity: getViewVelocity(video),
  })).sort((a: any, b: any) => b.velocity - a.velocity).slice(0, 6)

  return (
    <main className="min-h-screen bg-white">
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://tubefission.com' },
        { name: 'YouTube Video Analyzer', url: 'https://tubefission.com/youtube-video-analyzer' },
      ]} />
      <FAQPageSchema items={FAQ_ITEMS} />

      <section className="bg-gradient-to-b from-green-50 to-white pt-16 pb-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Analyze Any YouTube Video
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            Get detailed video analytics including engagement rates, SEO scores, and optimization tips. Free and instant.
          </p>
          <AnalyzeHeroForm />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <div className="text-xs font-bold uppercase tracking-wider text-green-600 mb-1">Samples</div>
            <div className="text-2xl font-black text-gray-900">{samples.length}</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Region</div>
            <div className="text-2xl font-black text-gray-900">{region}</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
            <div className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-1">Data</div>
            <div className="text-2xl font-black text-gray-900">Live</div>
          </div>
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
            <div className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-1">Use</div>
            <div className="text-2xl font-black text-gray-900">Free</div>
          </div>
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Live Video Samples</h2>
            <Link href="/trending" className="text-sm font-medium text-green-600 hover:text-green-700">
              See full trending list →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {samples.map(({ video, engagement, velocity }: any, index: number) => (
              <div key={video.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-green-300 hover:shadow-sm transition">
                <Link href={`/video/${video.id}`} className="block">
                  <div className="flex gap-4 items-start">
                    <img
                      src={video.snippet?.thumbnails?.medium?.url || video.snippet?.thumbnails?.high?.url}
                      alt={video.snippet?.title}
                      className="w-32 aspect-video object-cover rounded-lg border border-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Sample #{index + 1}</div>
                      <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{video.snippet?.title}</h3>
                      <div className="text-sm text-gray-500 mb-3">{video.snippet?.channelTitle}</div>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <div className="text-gray-400 text-xs uppercase tracking-wider">Views</div>
                          <div className="font-bold text-gray-900">{formatNumber(Number(video.statistics?.viewCount || 0))}</div>
                        </div>
                        <div>
                          <div className="text-gray-400 text-xs uppercase tracking-wider">Engagement</div>
                          <div className="font-bold text-gray-900">{engagement.toFixed(2)}%</div>
                        </div>
                        <div>
                          <div className="text-gray-400 text-xs uppercase tracking-wider">Velocity</div>
                          <div className="font-bold text-gray-900">{velocity >= 1e6 ? (velocity / 1e6).toFixed(1) + 'M/d' : velocity >= 1e3 ? (velocity / 1e3).toFixed(1) + 'K/d' : Math.round(velocity) + '/d'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="mt-4">
                  <AddToVideoCompareButton videoId={video.id} compact fullWidth />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-6">What Is a YouTube Video Analyzer?</h2>
        <p className="text-gray-700 mb-6">
          A Video Analyzer extracts deep performance metrics from any YouTube video to help you
          understand why it succeeds and how to replicate that success.
        </p>

        <h2 className="text-3xl font-bold mb-6">Key Metrics Analyzed</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {[
            { name: 'Engagement Rate', desc: 'How strongly the audience reacts relative to total views.' },
            { name: 'View Velocity', desc: 'How quickly a video accumulates views after publishing.' },
            { name: 'Like-to-View Ratio', desc: 'A fast proxy for how positively the audience received the content.' },
            { name: 'Upload Time Score', desc: 'How favorable the publishing time appears relative to likely viewer activity.' },
          ].map((metric) => (
            <div key={metric.name} className="bg-green-50 rounded-lg p-4 border border-green-100">
              <h3 className="font-semibold mb-1">{metric.name}</h3>
              <p className="text-sm text-gray-600">{metric.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-3xl font-bold mb-6">FAQs</h2>
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">{item.question}</h3>
              <p className="text-gray-600 text-sm">{item.answer}</p>
            </div>
          ))}
        </div>
      </article>
    </main>
  )
}
