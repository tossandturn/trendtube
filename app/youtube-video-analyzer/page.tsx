import type { Metadata } from 'next'
import Link from 'next/link'
import { AnalyzeHeroForm } from '@/app/components/AnalyzeHeroForm'
import { BreadcrumbSchema, FAQPageSchema } from '@/app/components/JsonLd'

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

export default function Page() {
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

      <article className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-6">What Is a YouTube Video Analyzer?</h2>
        <p className="text-gray-700 mb-6">
          A Video Analyzer extracts deep performance metrics from any YouTube video to help you 
          understand why it succeeds and how to replicate that success.
        </p>

        <h2 className="text-3xl font-bold mb-6">Key Metrics Analyzed</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {['Engagement Rate', 'View Velocity', 'Like-to-View Ratio', 'Upload Time Score'].map((metric) => (
            <div key={metric} className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold">{metric}</h3>
            </div>
          ))}
        </div>

        <h2 className="text-3xl font-bold mb-6">How to Use Video Analytics</h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 mb-10">
          <li>Paste any YouTube video URL into the analyzer</li>
          <li>Review engagement metrics and performance scores</li>
          <li>Study the title, thumbnail, and description analysis</li>
          <li>Apply insights to optimize your own content</li>
        </ol>

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
