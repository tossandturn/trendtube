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
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            AI-powered YouTube analytics, competitor research, and viral trend discovery. Get data-driven insights to grow your channel.
          </p>

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

      {/* ===== FEATURE CARDS ===== */}
      <section className="border-y border-gray-200 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 text-center">Powerful Analytics Tools</h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Everything you need to analyze, optimize, and grow your YouTube presence
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Link href="/youtube-channel-analytics" className="group bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">📊</div>
              <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">Channel Analytics</h3>
              <p className="text-gray-500 text-xs">Deep dive into any channel's performance metrics</p>
            </Link>
            <Link href="/youtube-competitor-analysis" className="group bg-white rounded-xl p-5 border border-gray-200 hover:border-purple-400 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">🎯</div>
              <h3 className="font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">Competitor Research</h3>
              <p className="text-gray-500 text-xs">Compare channels &amp; uncover winning strategies</p>
            </Link>
            <Link href="/trending" className="group bg-white rounded-xl p-5 border border-gray-200 hover:border-red-400 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">🔥</div>
              <h3 className="font-bold text-gray-900 mb-1 group-hover:text-red-600 transition-colors">Trending Videos</h3>
              <p className="text-gray-500 text-xs">Real-time trending content across regions</p>
            </Link>
            <Link href="/trends" className="group bg-white rounded-xl p-5 border border-gray-200 hover:border-green-400 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">📈</div>
              <h3 className="font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">Trend Database</h3>
              <p className="text-gray-500 text-xs">AI-powered trend discovery &amp; forecasting</p>
            </Link>
            <Link href="/ai-assistant" className="group bg-white rounded-xl p-5 border border-gray-200 hover:border-yellow-400 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-lg bg-yellow-50 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">🤖</div>
              <h3 className="font-bold text-gray-900 mb-1 group-hover:text-yellow-600 transition-colors">AI Assistant</h3>
              <p className="text-gray-500 text-xs">Get personalized content recommendations</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="bg-white border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">How It Works</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Analyze any YouTube video or channel in three simple steps. No software installation, no registration required.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-2xl mb-4 mx-auto">1</div>
              <h3 className="font-semibold text-gray-900 mb-2">Paste URL</h3>
              <p className="text-gray-600 text-sm">Copy the YouTube video or channel link from your browser and paste it into the input field above.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-2xl mb-4 mx-auto">2</div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Analysis</h3>
              <p className="text-gray-600 text-sm">Our AI engine processes the data in seconds, extracting performance metrics, trends, and insights.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-2xl mb-4 mx-auto">3</div>
              <h3 className="font-semibold text-gray-900 mb-2">Get Insights</h3>
              <p className="text-gray-600 text-sm">View detailed analytics, competitor benchmarks, and actionable recommendations to grow your channel.</p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <Link href="/youtube-channel-analytics" className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
              Explore Analytics Features →
            </Link>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <p className="text-sm text-gray-600 flex-1 text-center sm:text-left">
              Paste a YouTube URL to start analyzing videos and channels
            </p>
            <Link
              href="/youtube-channel-analytics"
              className="w-full sm:w-auto px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors text-center"
            >
              Analyze Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
