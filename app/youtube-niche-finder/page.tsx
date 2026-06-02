import type { Metadata } from 'next'
import Link from 'next/link'
import { AnalyzeHeroForm } from '@/app/components/AnalyzeHeroForm'
import { BreadcrumbSchema, FAQPageSchema } from '@/app/components/JsonLd'

export const metadata: Metadata = {
  title: 'YouTube Niche Finder — Discover Profitable Channel Niches (2025)',
  description: 'Find untapped YouTube niches with our free Niche Finder. Analyze competition, search demand, and earning potential to discover your perfect channel topic.',
  keywords: 'youtube niche finder, youtube niche ideas, profitable youtube niches, channel niche finder, youtube topic finder',
  alternates: {
    canonical: 'https://tubefission.com/youtube-niche-finder',
  },
}

const FAQ_ITEMS = [
  {
    question: 'What is the most profitable YouTube niche in 2025?',
    answer: 'The most profitable niches include AI tools tutorials, personal finance, health and wellness, and educational content.',
  },
  {
    question: 'How do I find a low competition YouTube niche?',
    answer: 'Use Tubefission to analyze trending topics with low creator saturation and high search demand.',
  },
  {
    question: 'Should I choose a broad or specific niche?',
    answer: 'Start specific. A narrow niche helps build authority faster and rank for targeted keywords.',
  },
]

export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://tubefission.com' },
        { name: 'YouTube Niche Finder', url: 'https://tubefission.com/youtube-niche-finder' },
      ]} />
      <FAQPageSchema items={FAQ_ITEMS} />

      <section className="bg-gradient-to-b from-blue-50 to-white pt-16 pb-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Find Your Perfect YouTube Niche
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            Discover profitable, low-competition YouTube niches with data-driven insights.
          </p>
          <AnalyzeHeroForm />
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-6">What Is a YouTube Niche Finder?</h2>
        <p className="text-gray-700 mb-6">
          A YouTube Niche Finder helps content creators identify profitable, underserved topics 
          for their channel using real data from trending videos and engagement rates.
        </p>

        <h2 className="text-3xl font-bold mb-6">Top Profitable YouTube Niches 2025</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {['AI Tools & Tutorials', 'Personal Finance', 'Health & Wellness', 'Tech Reviews'].map((niche) => (
            <div key={niche} className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold">{niche}</h3>
            </div>
          ))}
        </div>

        <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
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
