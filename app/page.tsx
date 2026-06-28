import type { Metadata } from 'next'
import Link from 'next/link'
import { SoftwareApplicationSchema, FAQPageSchema, BreadcrumbSchema } from '@/app/components/JsonLd'
import { AnalyzeHeroForm } from '@/app/components/AnalyzeHeroForm'

export const metadata: Metadata = {
  title: 'YouTube AI Analytics & Trend Intelligence Platform | Tubefission',
  description: 'AI-powered YouTube analytics platform. Analyze channels, discover viral trends, track competitor performance, and get data-driven content insights with Tubefission.',
  alternates: {
    canonical: 'https://tubefission.com',
  },
}

const FAQ_ITEMS = [
  {
    question: 'What is Tubefission?',
    answer: 'Tubefission is an AI-powered YouTube analytics platform that helps creators, marketers, and researchers analyze channels, discover viral trends, and get data-driven insights without any software installation or registration.',
  },
  {
    question: 'Is Tubefission free to use?',
    answer: 'Yes, Tubefission is completely free. You can analyze YouTube videos and channels without paying anything or creating an account.',
  },
  {
    question: 'Do I need to install any software?',
    answer: 'No. Tubefission runs entirely in your web browser. Simply paste a YouTube URL and start analyzing instantly.',
  },
  {
    question: 'What analytics does Tubefission provide?',
    answer: 'We provide video performance metrics, channel growth analysis, engagement rate tracking, trend velocity scores, competitor benchmarking, and AI-powered content recommendations based on real YouTube data.',
  },
  {
    question: 'Can I analyze any YouTube channel?',
    answer: 'Yes. Paste any public channel or video URL to see detailed analytics including subscriber trends, top-performing videos, engagement rates, and trending content patterns.',
  },
  {
    question: 'How accurate is the data?',
    answer: 'All data comes directly from the YouTube Data API and is refreshed daily. Our trend engine analyzes real videos across six countries to compute velocity, saturation, and breakout scores.',
  },
  {
    question: 'Is Tubefission safe to use?',
    answer: 'Absolutely. We do not store any personal data or require registration. All analysis happens through encrypted connections using official YouTube API data.',
  },
  {
    question: 'What countries are supported?',
    answer: 'Our trend database covers the United States, Japan, South Korea, the United Kingdom, Hong Kong, and Taiwan. You can switch regions to see market-specific trends.',
  },
  {
    question: 'Can I use Tubefission on mobile?',
    answer: 'Yes. Tubefission works on all devices including smartphones and tablets. The interface is fully responsive and optimized for touch screens.',
  },
  {
    question: 'How do I find viral trends?',
    answer: 'Visit our Trend Database or Trending pages to see real-time breakout scores and velocity metrics. Our AI identifies patterns before they peak, giving you a competitive advantage.',
  },
  {
    question: 'Is there an analysis limit?',
    answer: 'There is no strict daily limit for personal use. We monitor for abuse to ensure fair access for all users. You can analyze multiple videos and channels per day.',
  },
  {
    question: 'Who is Tubefission for?',
    answer: 'Tubefission is designed for YouTube creators, content strategists, digital marketers, researchers, and anyone who wants data-driven insights into YouTube performance and trends.',
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Structured Data */}
      <SoftwareApplicationSchema />
      <FAQPageSchema items={FAQ_ITEMS} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://tubefission.com' },
      ]} />

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-6 leading-tight">
            YouTube AI Analytics<br className="hidden sm:block" /> & Trend Intelligence
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-6 leading-relaxed">
            Understand why a video worked, spot trends before they peak, and benchmark against competitors with real YouTube data.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 text-sm">
            <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 font-medium">Analyze a video or channel</span>
            <span className="px-3 py-1.5 rounded-full bg-red-50 text-red-700 font-medium">Find breakout trends</span>
            <span className="px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 font-medium">Compare against competitors</span>
          </div>

          {/* CTA Input */}
          <AnalyzeHeroForm />

          {/* Trust Indicators */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-gray-600">
            <span className="inline-flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              No Login Required
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              Free To Use
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              Real-Time Data
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              AI-Powered Insights
            </span>
          </div>
        </div>
      </section>

      {/* ===== DECISION ENTRY POINTS ===== */}
      <section className="border-y border-gray-200 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 text-center">Start With The Job You Need To Get Done</h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            TubeFission works best when you start from the decision you need to make, not from a generic tool list.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/youtube-channel-analytics" className="group bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">📊</div>
              <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">Audit a Channel</h3>
              <p className="text-gray-500 text-xs">Check growth, engagement quality, posting rhythm, and what the creator should improve next.</p>
            </Link>
            <Link href="/trending" className="group bg-white rounded-xl p-5 border border-gray-200 hover:border-red-400 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">🔥</div>
              <h3 className="font-bold text-gray-900 mb-1 group-hover:text-red-600 transition-colors">Find What Is Rising</h3>
              <p className="text-gray-500 text-xs">See which videos and topics are moving fastest so you can react before the market saturates.</p>
            </Link>
            <Link href="/compare-new" className="group bg-white rounded-xl p-5 border-2 border-amber-300 bg-amber-50/50 hover:border-amber-400 hover:shadow-lg transition-all duration-200 relative">
              <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">HOT</div>
              <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">⚔️</div>
              <h3 className="font-bold text-gray-900 mb-1 group-hover:text-amber-600 transition-colors">Compare Two Players</h3>
              <p className="text-gray-500 text-xs">Benchmark two channels or videos side by side and see who wins on scale, efficiency, and engagement.</p>
            </Link>
            <Link href="/ai-assistant" className="group bg-white rounded-xl p-5 border border-gray-200 hover:border-yellow-400 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-lg bg-yellow-50 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">🤖</div>
              <h3 className="font-bold text-gray-900 mb-1 group-hover:text-yellow-600 transition-colors">Turn Data Into Ideas</h3>
              <p className="text-gray-500 text-xs">Generate stronger titles, hooks, thumbnail angles, and content direction from real winning patterns.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== COMPARE TOOL SPOTLIGHT ===== */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 border-y border-amber-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center mb-10">
            <span className="inline-block bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">FEATURED TOOL</span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">YouTube Competitor Comparison</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Compare two YouTube channels or videos side-by-side. See who leads in subscribers, engagement, views, and more — with AI-powered insights.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white rounded-xl p-6 border border-amber-100 text-center">
              <div className="text-3xl mb-3">⚔️</div>
              <h3 className="font-bold text-gray-900 mb-2">Head-to-Head</h3>
              <p className="text-gray-600 text-sm">Compare any two channels or videos with detailed metric breakdowns and winner analysis.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-amber-100 text-center">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-bold text-gray-900 mb-2">Visual Analytics</h3>
              <p className="text-gray-600 text-sm">Interactive charts and progress bars make it easy to spot strengths and weaknesses at a glance.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-amber-100 text-center">
              <div className="text-3xl mb-3">💡</div>
              <h3 className="font-bold text-gray-900 mb-2">AI Insights</h3>
              <p className="text-gray-600 text-sm">Get smart recommendations on which channel strategy performs better and why.</p>
            </div>
          </div>
          <div className="text-center">
            <Link href="/compare-new" className="inline-flex items-center justify-center px-8 py-4 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors shadow-lg shadow-amber-200 text-lg">
              Start Comparing →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== EXAMPLE OUTPUT ===== */}
      <section className="bg-gradient-to-b from-gray-50 to-white border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Example Output</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See what detailed analytics look like when you analyze a YouTube channel
            </p>
          </div>

          {/* Example Channel Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
            {/* Channel Header */}
            <div className="p-6 sm:p-8 border-b border-gray-100">
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  MR
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">MrBeast</h3>
                  <p className="text-gray-500 text-sm mb-2 line-clamp-1">SUBSCRIBE FOR A FREE CAR!</p>
                  <a href="#" className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-medium">
                    View on YouTube →
                  </a>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100">
              <div className="bg-white p-5">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Subscribers</div>
                <div className="text-2xl font-bold text-gray-900">335M</div>
                <div className="text-xs text-green-600 mt-1">Total subscribers</div>
              </div>
              <div className="bg-white p-5">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Views</div>
                <div className="text-2xl font-bold text-gray-900">65.2B</div>
                <div className="text-xs text-blue-600 mt-1">Lifetime views</div>
              </div>
              <div className="bg-white p-5">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Videos</div>
                <div className="text-2xl font-bold text-gray-900">835</div>
                <div className="text-xs text-purple-600 mt-1">Published</div>
              </div>
              <div className="bg-white p-5">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Avg Views</div>
                <div className="text-2xl font-bold text-gray-900">78M</div>
                <div className="text-xs text-orange-600 mt-1">Per video</div>
              </div>
            </div>
          </div>

          {/* AI Insights Preview */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-xl p-5 border border-green-200">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🚀</div>
                <div>
                  <div className="font-bold text-gray-900 mb-1">Viral Content Producer</div>
                  <div className="text-sm text-gray-600">156 videos with 1M+ views demonstrate viral potential.</div>
                </div>
              </div>
            </div>
            <div className="bg-red-50 rounded-xl p-5 border border-red-200">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🔥</div>
                <div>
                  <div className="font-bold text-gray-900 mb-1">Exceptional Engagement</div>
                  <div className="text-sm text-gray-600">Engagement rate of 8.5% is well above YouTube average.</div>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="text-2xl">⚡</div>
                <div>
                  <div className="font-bold text-gray-900 mb-1">Consistent Upload</div>
                  <div className="text-sm text-gray-600">Publishing 2 videos/week shows dedication.</div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 text-center">
            <Link href="/youtube-channel-analytics" className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors">
              Analyze Your Channel →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== WHO SHOULD START WHERE ===== */}
      <section className="bg-white border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 text-center">Choose The Fastest Path</h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Most users do not need every feature. Start from the workflow that matches the decision you need to make today.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">For creators</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Improve your next upload</h3>
              <p className="text-sm text-gray-600 mb-4">Start with video or channel analysis if you want to understand what worked, what underperformed, and what to test next.</p>
              <div className="flex gap-2">
                <Link href="/youtube-channel-analytics" className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">Analyze Channel</Link>
                <Link href="/ai-assistant" className="px-4 py-2 bg-white text-gray-900 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">Get Ideas</Link>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
              <div className="text-xs font-bold uppercase tracking-wider text-red-600 mb-2">For trend hunters</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Find momentum before it peaks</h3>
              <p className="text-sm text-gray-600 mb-4">Use trending and trend database views when your main question is what is rising right now and where the next content gap is.</p>
              <div className="flex gap-2">
                <Link href="/trending" className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">See Trending</Link>
                <Link href="/trends" className="px-4 py-2 bg-white text-gray-900 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">Open Database</Link>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-2">For competitor research</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Benchmark before you copy</h3>
              <p className="text-sm text-gray-600 mb-4">Use compare when you already have two channels or videos in mind and need a faster conclusion on who is actually worth studying.</p>
              <div className="flex gap-2">
                <Link href="/compare-new" className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">Start Comparing</Link>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* ===== LONG-FORM CONTENT ===== */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">What Is Tubefission?</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          Tubefission is a free <strong>AI-powered YouTube analytics platform</strong> designed for creators, marketers, and researchers who want data-driven insights into YouTube performance and trends. Whether you need to analyze a competitor channel, study viral content patterns, or discover trending topics before they peak, Tubefission gives you the intelligence to make informed decisions.
        </p>
        <p className="text-gray-700 leading-relaxed mb-10">
          Unlike many tools that require paid subscriptions or complex setups, Tubefission operates entirely online with no login required. Paste a YouTube URL, and within seconds you can unlock deep analytics about video performance, audience engagement, channel growth, and competitive positioning.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mb-6">AI-Powered Video Analysis</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          Our <strong>AI video analysis engine</strong> goes beyond basic view counts. We analyze:
        </p>
        <ul className="list-disc list-inside space-y-3 text-gray-700 leading-relaxed mb-10">
          <li><strong>Engagement velocity</strong> — how quickly a video gains likes, comments, and shares relative to its age.</li>
          <li><strong>Audience retention patterns</strong> — identifying which content types keep viewers watching longer.</li>
          <li><strong>Thumbnail effectiveness</strong> — analyzing click-through rates based on visual composition and text overlays.</li>
          <li><strong>SEO optimization scores</strong> — evaluating title, description, and tag quality against top-performing videos.</li>
        </ul>
        <p className="text-gray-700 leading-relaxed mb-10">
          These metrics are computed from real YouTube API data, refreshed daily, and filtered by country so you can see what works in your specific market. No guesswork, no outdated spreadsheets — just clear, visual intelligence powered by machine learning.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mb-6">Channel Analytics & Competitor Research</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          Understanding how channels grow is essential for creators who want to compete on YouTube. Tubefission's <strong>channel analytics</strong> feature breaks down any public channel into actionable metrics:
        </p>
        <ul className="list-disc list-inside space-y-3 text-gray-700 leading-relaxed mb-10">
          <li><strong>Subscriber velocity</strong> — how fast a channel is gaining subscribers relative to its upload frequency.</li>
          <li><strong>Engagement rate</strong> — the ratio of likes and comments to total views, revealing content quality.</li>
          <li><strong>Top-performing videos</strong> — identify which titles, thumbnails, and topics drive the most traffic.</li>
          <li><strong>Upload consistency</strong> — track publishing schedules to understand audience retention patterns.</li>
        </ul>
        <p className="text-gray-700 leading-relaxed mb-10">
          Use these insights to reverse-engineer competitor strategies, identify content gaps in your niche, and optimize your publishing schedule for maximum growth.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mb-6">Trend Discovery with Real Data</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          Our trend engine does not rely on guesswork or static lists. Instead, it pulls live data from YouTube's most popular videos across six countries — the United States, Japan, South Korea, the United Kingdom, Hong Kong, and Taiwan. From these videos, we extract real trending keywords, compute velocity and saturation scores, and surface breakout opportunities that are still early enough to capture.
        </p>
        <p className="text-gray-700 leading-relaxed mb-10">
          This means every trend you see on Tubefission is backed by actual view counts, engagement rates, and creator adoption metrics from the real platform. You are not reading predictions — you are reading data-driven intelligence.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mb-6">Use Cases for Creators & Marketers</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          Tubefission serves a wide range of professional workflows:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Competitor Research</h3>
            <p className="text-sm text-gray-600">Analyze top channels in your niche to study their content strategy, upload frequency, and audience engagement patterns.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Content Strategy</h3>
            <p className="text-sm text-gray-600">Identify trending topics, high-opportunity keywords, and content gaps before your competitors.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Performance Benchmarking</h3>
            <p className="text-sm text-gray-600">Compare your channel metrics against industry leaders to set realistic growth targets.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Trend Discovery</h3>
            <p className="text-sm text-gray-600">Spot viral patterns early by tracking breakout scores and velocity across categories and regions.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Tubefission?</h2>
        <div className="space-y-4 mb-10">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">1</div>
            <div>
              <h3 className="font-semibold text-gray-900">No Account Required</h3>
              <p className="text-gray-600 text-sm">Start analyzing immediately without handing over your email or creating passwords.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">2</div>
            <div>
              <h3 className="font-semibold text-gray-900">AI-Powered Insights</h3>
              <p className="text-gray-600 text-sm">Machine learning algorithms surface patterns and opportunities that manual research would miss.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">3</div>
            <div>
              <h3 className="font-semibold text-gray-900">Country-First Filtering</h3>
              <p className="text-gray-600 text-sm">See what is actually trending in your target market, not generic global averages.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">4</div>
            <div>
              <h3 className="font-semibold text-gray-900">Real-Time Data</h3>
              <p className="text-gray-600 text-sm">All metrics are refreshed daily from the official YouTube API for maximum accuracy.</p>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-6">Get Started in Seconds</h2>
        <p className="text-gray-700 leading-relaxed mb-8">
          Ready to analyze your first video or channel? Scroll back to the top of this page, paste a YouTube URL into the input field, and click <strong>Analyze Now</strong>. If you want deeper insights, head over to our <Link href="/youtube-channel-analytics" className="text-blue-600 hover:underline">Channel Analytics</Link> page or explore the <Link href="/trends" className="text-blue-600 hover:underline">Trend Database</Link> to find your next viral topic.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/trends" className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
            Explore Trend Database →
          </Link>
          <Link href="/youtube-channel-analytics" className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            Analyze Channel →
          </Link>
        </div>
      </article>

      {/* ===== FAQ SECTION ===== */}
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

      {/* ===== STICKY CTA FOOTER ===== */}
      <section className="sticky bottom-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <p className="text-sm text-gray-600 flex-1 text-center sm:text-left">
              Start with a URL if you want diagnosis, or jump into compare/trending if you already know the decision you need to make.
            </p>
            <div className="flex w-full sm:w-auto gap-2">
              <Link
                href="/youtube-channel-analytics"
                className="flex-1 sm:flex-none px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors text-center"
              >
                Analyze a Channel
              </Link>
              <Link
                href="/compare-new"
                className="flex-1 sm:flex-none px-5 py-2.5 bg-white text-gray-900 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center"
              >
                Compare Instead
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
