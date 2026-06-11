import type { Metadata } from 'next'
import Link from 'next/link'
import { BreadcrumbSchema, FAQPageSchema } from '@/app/components/JsonLd'

export const metadata: Metadata = {
  title: '⏰ YouTube Best Time to Post 2025 | Maximize Engagement | Tubefission',
  description: 'Find the best time to post on YouTube for maximum views. Data-driven optimal upload times by region and niche. No login required. Try it now!',
  keywords: 'best time to post on youtube, youtube upload time, optimal posting time, youtube schedule 2025, best time to upload',
  alternates: {
    canonical: 'https://tubefission.com/youtube-best-time-to-post',
  },
  openGraph: {
    title: '⏰ YouTube Best Time to Post 2025 | Maximize Engagement | Tubefission',
    description: 'Find the best time to post on YouTube for maximum views. Data-driven optimal upload times by region and niche.',
    url: 'https://tubefission.com/youtube-best-time-to-post',
    siteName: 'Tubefission',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '⏰ YouTube Best Time to Post 2025 | Tubefission',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '⏰ YouTube Best Time to Post 2025 | Maximize Engagement | Tubefission',
    description: 'Find the best time to post on YouTube for maximum views. Data-driven optimal upload times by region and niche.',
    images: ['/og-image.png'],
  },
}

const FAQ_ITEMS = [
  {
    question: 'What is the best time to post on YouTube?',
    answer: 'The best time varies by your audience location, but generally 2PM-4PM on weekdays and 9AM-11AM on weekends work well for US audiences. Use our tool to find optimal times for your specific region.',
  },
  {
    question: 'Does upload time affect YouTube algorithm?',
    answer: 'Yes, uploading when your audience is active increases initial engagement, which signals the algorithm to promote your video. First 24 hours performance is crucial.',
  },
  {
    question: 'How do I find my audience active hours?',
    answer: 'Check YouTube Analytics > Audience > When your viewers are on YouTube. This shows peak activity times for your specific subscribers.',
  },
  {
    question: 'Should I post at the same time every week?',
    answer: 'Consistency helps build audience habits, but you can experiment with different times. Once you find what works, stick to a regular schedule.',
  },
]

export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://tubefission.com' },
        { name: 'Best Time to Post', url: 'https://tubefission.com/youtube-best-time-to-post' },
      ]} />
      <FAQPageSchema items={FAQ_ITEMS} />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-purple-50 to-white pt-16 pb-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            ⏰ Best Time to Post on YouTube 2025
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            Find the optimal upload times for maximum engagement. Based on real data from 
            millions of videos across different regions and niches.
          </p>
        </div>
      </section>

      {/* Time Zone Selector */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Select Your Target Audience</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {[
              { code: 'US', flag: '🇺🇸', name: 'United States', time: '2PM-4PM EST' },
              { code: 'GB', flag: '🇬🇧', name: 'United Kingdom', time: '3PM-5PM GMT' },
              { code: 'CA', flag: '🇨🇦', name: 'Canada', time: '2PM-4PM EST' },
              { code: 'AU', flag: '🇦🇺', name: 'Australia', time: '7PM-9PM AEDT' },
              { code: 'JP', flag: '🇯🇵', name: 'Japan', time: '7PM-9PM JST' },
              { code: 'KR', flag: '🇰🇷', name: 'South Korea', time: '8PM-10PM KST' },
            ].map((region) => (
              <button
                key={region.code}
                className="p-4 rounded-xl border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all text-left"
              >
                <span className="text-2xl mr-2">{region.flag}</span>
                <span className="font-medium text-gray-900">{region.name}</span>
                <p className="text-sm text-gray-500 mt-1">Best time: {region.time}</p>
              </button>
            ))}
          </div>

          {/* Best Times Display */}
          <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
            <h3 className="text-lg font-semibold text-purple-900 mb-4">📊 Optimal Posting Times</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <p className="text-sm text-gray-500 mb-1">Weekdays</p>
                <p className="text-xl font-bold text-purple-600">2PM - 4PM</p>
                <p className="text-xs text-gray-400 mt-1">Peak engagement window</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <p className="text-sm text-gray-500 mb-1">Weekends</p>
                <p className="text-xl font-bold text-purple-600">9AM - 11AM</p>
                <p className="text-xs text-gray-400 mt-1">Morning browsing time</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <p className="text-sm text-gray-500 mb-1">Avoid</p>
                <p className="text-xl font-bold text-red-600">11PM - 6AM</p>
                <p className="text-xs text-gray-400 mt-1">Lowest activity period</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <article className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-6">Why Posting Time Matters on YouTube</h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          YouTube's algorithm heavily weighs the first 24-48 hours of a video's performance. 
          Uploading when your audience is most active gives your video the best chance to 
          generate initial views, likes, and comments—signals that tell YouTube your content 
          is worth promoting.
        </p>

        <h2 className="text-3xl font-bold mb-6">Best Times by Region</h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Your audience's location determines the optimal posting time. Here are the peak 
          engagement windows for major markets based on real YouTube usage data:
        </p>

        <div className="space-y-4 mb-10">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🇺🇸</span>
                <h3 className="font-semibold">United States</h3>
              </div>
              <span className="text-green-600 font-bold">2PM - 4PM EST</span>
            </div>
            <p className="text-sm text-gray-600">Weekdays after school/work. Weekend mornings also perform well.</p>
          </div>
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🇬🇧</span>
                <h3 className="font-semibold">United Kingdom</h3>
              </div>
              <span className="text-green-600 font-bold">3PM - 5PM GMT</span>
            </div>
            <p className="text-sm text-gray-600">Afternoon peak with strong weekend morning performance.</p>
          </div>
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🇯🇵</span>
                <h3 className="font-semibold">Japan</h3>
              </div>
              <span className="text-green-600 font-bold">7PM - 9PM JST</span>
            </div>
            <p className="text-sm text-gray-600">Evening commute and relaxation time. Late night also popular.</p>
          </div>
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🇦🇺</span>
                <h3 className="font-semibold">Australia</h3>
              </div>
              <span className="text-green-600 font-bold">7PM - 9PM AEDT</span>
            </div>
            <p className="text-sm text-gray-600">Evening prime time. Weekend afternoons show strong performance.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-6">Best Times by Day of Week</h2>
        <div className="space-y-4 mb-10">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">M</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Monday - Thursday</h3>
              <p className="text-gray-600 text-sm">2PM - 4PM local time. People check YouTube during afternoon breaks and after work/school.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">F</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Friday</h3>
              <p className="text-gray-600 text-sm">12PM - 3PM local time. Earlier peak as people wind down for the weekend.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">S</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Saturday - Sunday</h3>
              <p className="text-gray-600 text-sm">9AM - 11AM local time. Morning browsing before weekend activities.</p>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-6">How to Find YOUR Best Time</h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          While general guidelines are helpful, your specific audience may have different habits. 
          Here's how to find your optimal posting time:
        </p>

        <div className="space-y-6 mb-10">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">1</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Check YouTube Analytics</h3>
              <p className="text-gray-600 text-sm">Go to Analytics → Audience → "When your viewers are on YouTube" to see your specific audience's active hours.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">2</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Analyze Your Top Videos</h3>
              <p className="text-gray-600 text-sm">Look at when your best-performing videos were published. Look for patterns in timing.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">3</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Experiment with A/B Testing</h3>
              <p className="text-gray-600 text-sm">Try posting at different times for 4-6 weeks and compare first 24-hour performance.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">4</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Consider Your Niche</h3>
              <p className="text-gray-600 text-sm">Educational content performs well on weekday evenings. Entertainment does better on weekends.</p>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-6">Common Posting Time Mistakes</h2>
        <ul className="list-disc list-inside space-y-3 text-gray-700 mb-10">
          <li><strong>Posting at midnight</strong> — Unless you have a global audience, this misses your peak hours</li>
          <li><strong>Inconsistent schedule</strong> — Random posting times confuse the algorithm and your audience</li>
          <li><strong>Ignoring analytics</strong> — Your audience data is more valuable than general guidelines</li>
          <li><strong>Posting on weekends only</strong> — Weekdays often have less competition and more engaged viewers</li>
          <li><strong>Rushing to post</strong> — Better to wait for optimal time than post at a bad time just to be consistent</li>
        </ul>

        <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4 mb-10">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">{item.question}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-100 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to Optimize Your Upload Schedule?</h2>
          <p className="text-gray-600 mb-6">Use Tubefission's trend analysis to find the best content opportunities for your posting schedule.</p>
          <Link href="/trends" className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors">
            Explore Trend Database →
          </Link>
        </div>
      </article>
    </main>
  )
}
