import type { Metadata } from 'next'
import Link from 'next/link'
import { AnalyzeHeroForm } from '@/app/components/AnalyzeHeroForm'
import { BreadcrumbSchema, FAQPageSchema } from '@/app/components/JsonLd'

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

export default function Page() {
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

      <article className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-6">What Is Content Gap Analysis?</h2>
        <p className="text-gray-700 mb-6">
          Content gap analysis identifies topics where audience demand exceeds creator supply. 
          These gaps represent the best opportunities for new channels to gain traction.
        </p>

        <h2 className="text-3xl font-bold mb-6">Opportunity Metrics</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {['Breakout Score', 'Saturation Rate', 'Demand Index', 'Competition Level'].map((metric) => (
            <div key={metric} className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold">{metric}</h3>
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
