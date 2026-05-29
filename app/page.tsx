import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllTrends, getAllTags } from '@/lib/db'
import { getLatestSnapshot } from '@/lib/db'

export const metadata: Metadata = {
  title: 'TubeFission — Discover Viral YouTube Opportunities Before Everyone Else',
  description: 'Real-time creator intelligence platform for YouTube trends, Shorts, and breakout niches. Analyze velocity, saturation, and breakout potential with historical data.',
  keywords: 'youtube trends, viral content, creator intelligence, shorts, analytics',
  alternates: {
    canonical: 'https://tubefission.com',
  },
  openGraph: {
    title: 'TubeFission — Creator Intelligence Platform',
    description: 'Discover viral YouTube opportunities before everyone else.',
    url: 'https://tubefission.com',
    type: 'website',
  },
}

export default async function HomePage() {
  const trends = getAllTrends()
  const tags = getAllTags()
  const categories = Array.from(new Set(trends.map(t => t.category).filter(Boolean)))

  // Get total stats
  let totalVelocity = 0
  let totalViews = 0
  let avgBreakout = 0
  trends.forEach(t => {
    const snap = getLatestSnapshot(t.id)
    if (snap) {
      totalVelocity += snap.velocity || 0
      totalViews += snap.views || 0
      avgBreakout += snap.breakout_score || 0
    }
  })
  avgBreakout = trends.length > 0 ? avgBreakout / trends.length : 0

  return (
    <main className="min-h-screen bg-[#fafafa]">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-[#fafafa]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 text-sm text-gray-600 mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live data from 6 countries
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 tracking-tight mb-6 leading-tight">
              Discover Viral YouTube<br className="hidden sm:block" /> Opportunities Before Everyone Else
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Real-time creator intelligence platform for YouTube trends, Shorts, and breakout niches.
              Analyze velocity, saturation, and historical performance data.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/trending"
                className="w-full sm:w-auto px-8 py-3.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
              >
                Start Free
              </Link>
              <Link
                href="/trends"
                className="w-full sm:w-auto px-8 py-3.5 bg-white text-gray-900 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Explore Trends
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="border-y border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{trends.length}+</p>
              <p className="text-sm text-gray-500 mt-1">Trends Tracked</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{(totalViews / 1e9).toFixed(1)}B+</p>
              <p className="text-sm text-gray-500 mt-1">Views Analyzed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">24h</p>
              <p className="text-sm text-gray-500 mt-1">Daily Updates</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">6</p>
              <p className="text-sm text-gray-500 mt-1">Countries Analyzed</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT PREVIEW */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Professional Intelligence Dashboard</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Built like Bloomberg Terminal for creators. Track velocity, saturation, breakout scores, and historical trends.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="text-xs text-gray-400 ml-2">tubefission.com/trending</span>
            </div>
            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Mock Metric Cards */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Velocity</p>
                    <p className="text-2xl font-bold text-gray-900">2.4M <span className="text-sm font-normal text-green-600">+12%</span></p>
                    <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-green-500 rounded-full" />
                    </div>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Breakout Score</p>
                    <p className="text-2xl font-bold text-gray-900">87 <span className="text-sm font-normal text-green-600">High</span></p>
                    <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full w-[87%] bg-blue-500 rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 h-40 flex items-end justify-around">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95].map((h, i) => (
                    <div key={i} className="w-6 bg-gray-300 rounded-t" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                {['AI Shorts', 'Gaming', 'MrBeast Style', 'YouTube Automation'].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="text-sm font-medium text-gray-900">{item}</span>
                    <span className="text-xs text-green-600 font-medium">+{[12, 8, 5, 3][i]}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Everything you need to find viral content</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Real-Time Velocity Tracking', desc: 'Monitor view velocity, engagement rates, and growth momentum across countries.' },
              { title: 'Breakout Prediction', desc: 'AI-powered scoring identifies trends before they peak. Act early, grow faster.' },
              { title: 'Historical Snapshots', desc: '365+ days of trend data. Understand lifecycle patterns and seasonality.' },
              { title: 'Saturation Analysis', desc: 'Know exactly how competitive a niche is before you invest time in it.' },
              { title: 'Daily Topic Recommendations', desc: 'AI-generated content ideas based on real trending data in your country.' },
              { title: 'SEO-Ready Intelligence', desc: 'Every trend page is server-rendered and optimized for search engines.' },
            ].map((f, i) => (
              <div key={i} className="p-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Browse by Category</h2>
            <Link href="/trends" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View all →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/categories/${cat!.toLowerCase().replace(/\s+/g, '-')}`}
                className="p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all text-center"
              >
                <p className="font-medium text-gray-900">{cat}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TAGS */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Popular Tags</h2>
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 20).map((tag) => (
              <Link
                key={tag}
                href={`/tag/${tag}`}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to find your next viral video?</h2>
          <p className="text-gray-600 mb-8">Join creators using data-driven intelligence to grow their channels.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/trending"
              className="w-full sm:w-auto px-8 py-3.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Start Free
            </Link>
            <Link
              href="/trends"
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-gray-900 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Explore Trends
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
