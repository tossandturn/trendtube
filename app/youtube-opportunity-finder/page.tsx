import type { Metadata } from 'next'
import Link from 'next/link'
import { AnalyzeHeroForm } from '@/app/components/AnalyzeHeroForm'
import { BreadcrumbSchema, FAQPageSchema } from '@/app/components/JsonLd'
import { searchYouTubeMulti } from '@/lib/api-client'
import { getViewVelocity, getEngagementRate } from '@/lib/analytics'

export const metadata: Metadata = {
  title: 'YouTube Opportunity Finder — Discover Content Gaps & Trends',
  description: 'Find high-opportunity YouTube content gaps with low competition. Our Opportunity Finder identifies trending topics with viral potential.',
  keywords: 'youtube opportunity finder, content gap finder, low competition keywords, viral opportunity finder',
  alternates: {
    canonical: 'https://tubefission.com/youtube-opportunity-finder',
  },
}

const FAQ_ITEMS = [
  {
    question: 'What is a content gap?',
    answer: 'A content gap is a topic with high search demand but low creator supply - an opportunity for new channels.',
  },
  {
    question: 'How do I find low competition opportunities?',
    answer: 'Look for trending topics with breakout scores above 70 and saturation below 40%.',
  },
]

function formatNumber(n: number) {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return n.toLocaleString()
}

function scoreOpportunity(video: any, sampleSize: number) {
  const views = Number(video.statistics?.viewCount || 0)
  const engagement = getEngagementRate(video)
  const velocity = getViewVelocity(video)
  const saturation = Math.min(100, sampleSize * 4)
  const breakout = Math.min(100, Math.round((Math.log10(velocity + 1) * 12) + engagement * 8))
  const demand = Math.min(100, Math.round((Math.log10(views + 1) * 10) + engagement * 5))

  let competition: 'Low' | 'Medium' | 'High' = 'Medium'
  if (saturation < 35) competition = 'Low'
  else if (saturation > 70) competition = 'High'

  return { breakout, saturation, demand, competition }
}

export default async function Page() {
  const queries = ['viral youtube ideas', 'trending youtube topic', 'low competition youtube niche', 'youtube content ideas']
  const videos = await searchYouTubeMulti(queries, 12, 'viewCount')

  const opportunityVideos = videos
    .map((video: any) => ({
      video,
      velocity: getViewVelocity(video),
      engagement: getEngagementRate(video),
      score: scoreOpportunity(video, videos.length),
    }))
    .sort((a: any, b: any) => b.score.breakout - a.score.breakout)
    .slice(0, 8)

  const avgBreakout = opportunityVideos.length
    ? Math.round(opportunityVideos.reduce((sum, item) => sum + item.score.breakout, 0) / opportunityVideos.length)
    : 0

  return (
    <main className="min-h-screen bg-white">
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://tubefission.com' },
        { name: 'YouTube Opportunity Finder', url: 'https://tubefission.com/youtube-opportunity-finder' },
      ]} />
      <FAQPageSchema items={FAQ_ITEMS} />

      <section className="bg-gradient-to-b from-purple-50 to-white pt-16 pb-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Find YouTube Content Opportunities
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            Discover high-opportunity content gaps with low competition. Get breakout scores and viral predictions.
          </p>
          <AnalyzeHeroForm />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
            <div className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-1">Opportunities</div>
            <div className="text-2xl font-black text-gray-900">{opportunityVideos.length}</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Avg Breakout</div>
            <div className="text-2xl font-black text-gray-900">{avgBreakout}</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <div className="text-xs font-bold uppercase tracking-wider text-green-600 mb-1">Real Videos</div>
            <div className="text-2xl font-black text-gray-900">{videos.length}</div>
          </div>
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
            <div className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-1">Signal</div>
            <div className="text-2xl font-black text-gray-900">Live</div>
          </div>
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Live Opportunity Board</h2>
            <Link href="/trending" className="text-sm font-medium text-purple-600 hover:text-purple-700">
              See full trending list →
            </Link>
          </div>
          <div className="space-y-4">
            {opportunityVideos.map(({ video, velocity, engagement, score }: any, index: number) => (
              <Link key={video.id} href={`/video/${video.id}`} className="block bg-white rounded-xl border border-gray-200 p-4 hover:border-purple-300 hover:shadow-sm transition">
                <div className="flex gap-4 items-start">
                  <div className="text-xl font-black text-gray-300 w-8">#{index + 1}</div>
                  <img
                    src={video.snippet?.thumbnails?.medium?.url || video.snippet?.thumbnails?.high?.url}
                    alt={video.snippet?.title}
                    className="w-32 aspect-video object-cover rounded-lg border border-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{video.snippet?.title}</h3>
                    <div className="text-sm text-gray-500 mb-3">{video.snippet?.channelTitle}</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div>
                        <div className="text-gray-400 text-xs uppercase tracking-wider">Breakout</div>
                        <div className="font-bold text-purple-600">{score.breakout}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-xs uppercase tracking-wider">Competition</div>
                        <div className={`font-bold ${score.competition === 'Low' ? 'text-green-600' : score.competition === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>{score.competition}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-xs uppercase tracking-wider">Velocity</div>
                        <div className="font-bold text-gray-900">{velocity >= 1e6 ? (velocity / 1e6).toFixed(1) + 'M/d' : velocity >= 1e3 ? (velocity / 1e3).toFixed(1) + 'K/d' : Math.round(velocity) + '/d'}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-xs uppercase tracking-wider">Engagement</div>
                        <div className="font-bold text-gray-900">{engagement.toFixed(2)}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-6">What Is Content Gap Analysis?</h2>
        <p className="text-gray-700 mb-6">
          Content gap analysis identifies topics where audience demand exceeds creator supply.
          These gaps represent the best opportunities for new channels to gain traction.
        </p>

        <h2 className="text-3xl font-bold mb-6">Opportunity Metrics</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {[
            { name: 'Breakout Score', desc: 'How likely a topic is to expand rapidly based on current velocity and engagement.' },
            { name: 'Saturation Rate', desc: 'How crowded a topic currently looks based on the amount of overlapping creator activity.' },
            { name: 'Demand Index', desc: 'How much audience attention the current leaders are already pulling into this topic.' },
            { name: 'Competition Level', desc: 'A simpler label that helps you judge whether the opportunity is still easy, moderate, or crowded.' },
          ].map((metric) => (
            <div key={metric.name} className="bg-purple-50 rounded-lg p-4 border border-purple-100">
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
