import type { Metadata } from 'next'
import Link from 'next/link'
import { AnalyzeHeroForm } from '@/app/components/AnalyzeHeroForm'
import { BreadcrumbSchema, FAQPageSchema } from '@/app/components/JsonLd'

export const metadata: Metadata = {
  title: 'YouTube Trend Finder — Discover Viral Topics Before They Peak',
  description: 'Find trending YouTube topics before they go viral. Our Trend Finder analyzes real-time data to predict breakout content opportunities.',
  keywords: 'youtube trend finder, trending youtube topics, viral video finder, youtube trend predictor',
  alternates: {
    canonical: 'https://tubefission.com/youtube-trend-finder',
  },
}

const FAQ_ITEMS = [
  {
    question: 'How do I find trending topics on YouTube?',
    answer: 'Use our Trend Finder to see real-time trending videos across 6 countries with velocity scores and breakout potential.',
  },
  {
    question: 'What makes a video trend on YouTube?',
    answer: 'High engagement rate, click-through rate, watch time, and early momentum are key factors.',
  },
]

export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://tubefission.com' },
        { name: 'YouTube Trend Finder', url: 'https://tubefission.com/youtube-trend-finder' },
      ]} />
      <FAQPageSchema items={FAQ_ITEMS} />

      <section className="bg-gradient-to-b from-red-50 to-white pt-16 pb-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Discover YouTube Trends Before They Peak
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            Find viral YouTube topics with real-time trend analysis. Get velocity scores and breakout predictions.
          </p>
          <AnalyzeHeroForm />
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-6">What Is a YouTube Trend Finder?</h2>
        <p className="text-gray-700 mb-6">
          A Trend Finder analyzes real-time YouTube data to identify topics that are gaining 
          momentum before they become saturated. Get early access to viral opportunities.
        </p>

        <h2 className="text-3xl font-bold mb-6">How Trend Prediction Works</h2>
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {['Velocity Analysis', 'Engagement Tracking', 'Breakout Scoring'].map((step) => (
            <div key={step} className="bg-red-50 rounded-lg p-4 text-center">
              <h3 className="font-semibold">{step}</h3>
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
