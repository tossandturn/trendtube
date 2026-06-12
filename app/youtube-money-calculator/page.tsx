import type { Metadata } from 'next'
import Link from 'next/link'
import { BreadcrumbSchema, FAQPageSchema } from '@/app/components/JsonLd'

export const metadata: Metadata = {
  title: '💰 YouTube Money Calculator 2026 | Estimate Channel Earnings | Tubefission',
  description: 'Calculate your YouTube earnings with our free Money Calculator. Estimate revenue based on views, CPM, and engagement. No login required. Try it now!',
  keywords: 'youtube money calculator, youtube earnings estimator, youtube revenue calculator, cpm calculator, youtube income calculator 2026',
  alternates: {
    canonical: 'https://tubefission.com/youtube-money-calculator',
  },
  openGraph: {
    title: '💰 YouTube Money Calculator 2026 | Estimate Channel Earnings | Tubefission',
    description: 'Calculate your YouTube earnings with our free Money Calculator. Estimate revenue based on views, CPM, and engagement.',
    url: 'https://tubefission.com/youtube-money-calculator',
    siteName: 'Tubefission',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '💰 YouTube Money Calculator 2026 | Tubefission',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '💰 YouTube Money Calculator 2026 | Estimate Channel Earnings | Tubefission',
    description: 'Calculate your YouTube earnings with our free Money Calculator. Estimate revenue based on views, CPM, and engagement.',
    images: ['/og-image.png'],
  },
}

const FAQ_ITEMS = [
  {
    question: 'How accurate is the YouTube Money Calculator?',
    answer: 'Our calculator provides estimates based on industry-standard CPM rates and your channel metrics. Actual earnings vary based on niche, audience location, and advertiser demand.',
  },
  {
    question: 'What is a typical YouTube CPM?',
    answer: 'CPM varies widely by niche. Finance and business channels often see $10-30 CPM, while gaming might be $2-5. The average across all niches is $3-5 per 1000 views.',
  },
  {
    question: 'How much do YouTubers make per 1000 views?',
    answer: 'Most creators earn $3-5 per 1000 monetized views through AdSense. However, this can range from $1 to $30+ depending on your niche and audience demographics.',
  },
  {
    question: 'Does the calculator include sponsorships?',
    answer: 'The base calculator shows AdSense revenue only. Sponsorships vary greatly and depend on your niche, audience size, and engagement rate.',
  },
]

export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://tubefission.com' },
        { name: 'YouTube Money Calculator', url: 'https://tubefission.com/youtube-money-calculator' },
      ]} />
      <FAQPageSchema items={FAQ_ITEMS} />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50 to-white pt-16 pb-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            💰 YouTube Money Calculator 2026
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            Estimate your YouTube earnings with our free calculator. Based on real CPM data 
            from thousands of channels across different niches.
          </p>
        </div>
      </section>

      {/* Calculator Form */}
      <section className="max-w-2xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Views
              </label>
              <input
                type="number"
                placeholder="e.g., 10000"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Niche Category
              </label>
              <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="finance">Finance & Business ($15-30 CPM)</option>
                <option value="tech">Tech Reviews ($8-15 CPM)</option>
                <option value="education">Education ($6-12 CPM)</option>
                <option value="health">Health & Wellness ($5-10 CPM)</option>
                <option value="entertainment">Entertainment ($3-6 CPM)</option>
                <option value="gaming">Gaming ($2-5 CPM)</option>
                <option value="vlog">Vlogs & Lifestyle ($2-4 CPM)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Audience Location
              </label>
              <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="us">United States (High CPM)</option>
                <option value="uk">United Kingdom (High CPM)</option>
                <option value="ca">Canada (High CPM)</option>
                <option value="au">Australia (High CPM)</option>
                <option value="eu">Europe (Medium CPM)</option>
                <option value="asia">Asia (Medium CPM)</option>
                <option value="other">Other (Lower CPM)</option>
              </select>
            </div>
            <button className="w-full py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
              Calculate Earnings
            </button>
          </div>

          {/* Results Preview */}
          <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estimated Earnings</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">$0</p>
                <p className="text-sm text-gray-500">Daily</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">$0</p>
                <p className="text-sm text-gray-500">Monthly</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">$0</p>
                <p className="text-sm text-gray-500">Yearly</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <article className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-6">How Does the YouTube Money Calculator Work?</h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Our YouTube Money Calculator estimates your potential earnings based on several key factors 
          that influence ad revenue. While actual earnings can vary, this tool gives you a realistic 
          projection based on industry data from thousands of creators.
        </p>

        <h2 className="text-3xl font-bold mb-6">Understanding YouTube CPM Rates by Niche</h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          CPM (Cost Per Mille) represents how much advertisers pay per 1000 views. Different niches 
          attract different advertising rates based on audience value and competition.
        </p>

        <div className="space-y-4 mb-10">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Finance & Business</h3>
              <span className="text-green-600 font-bold">$15-30 CPM</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">High advertiser competition for credit cards, investing, and business tools.</p>
          </div>
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Tech Reviews</h3>
              <span className="text-green-600 font-bold">$8-15 CPM</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Strong affiliate potential plus high-value product advertising.</p>
          </div>
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Education</h3>
              <span className="text-green-600 font-bold">$6-12 CPM</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Online courses and educational platforms pay premium rates.</p>
          </div>
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Gaming</h3>
              <span className="text-green-600 font-bold">$2-5 CPM</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Large audience but lower advertiser competition.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-6">Factors That Affect Your YouTube Earnings</h2>
        <div className="space-y-4 mb-10">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">1</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Audience Location</h3>
              <p className="text-gray-600 text-sm">Viewers from US, UK, Canada, and Australia generate higher CPMs than other regions.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">2</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Watch Time</h3>
              <p className="text-gray-600 text-sm">Longer videos with higher retention rates can show more ads and earn more.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">3</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Ad-Friendly Content</h3>
              <p className="text-gray-600 text-sm">Family-friendly content attracts more advertisers than controversial topics.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">4</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Seasonality</h3>
              <p className="text-gray-600 text-sm">Q4 (October-December) typically sees 30-50% higher CPMs due to holiday advertising.</p>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4 mb-10">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">{item.question}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border border-green-100 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Want to Grow Your Channel?</h2>
          <p className="text-gray-600 mb-6">Use Tubefission's analytics tools to find high-CPM niches and trending topics.</p>
          <Link href="/trends" className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
            Explore Trend Database �?          </Link>
        </div>
      </article>
    </main>
  )
}
