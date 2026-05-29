import type { Metadata } from 'next'
import Link from 'next/link'
import { SoftwareApplicationSchema, FAQPageSchema, BreadcrumbSchema } from '@/app/components/JsonLd'
import { DownloadHeroForm } from '@/app/components/DownloadHeroForm'

export const metadata: Metadata = {
  title: 'YouTube Video Downloader & Analytics Tool | Tubefission',
  description: 'Download YouTube videos without watermark instantly. Analyze channels, trends, and top-performing content using Tubefission. Free, fast, and secure.',
  alternates: {
    canonical: 'https://tubefission.com',
  },
}

const FAQ_ITEMS = [
  {
    question: 'Is Tubefission free to use?',
    answer: 'Yes, Tubefission is completely free. You can download YouTube videos and analyze channels without paying anything or creating an account.',
  },
  {
    question: 'Do I need to install any software?',
    answer: 'No. Tubefission runs entirely in your web browser. Simply paste a YouTube URL and start downloading or analyzing instantly.',
  },
  {
    question: 'Is it legal to download YouTube videos?',
    answer: 'Downloading videos for personal, offline use is generally acceptable. However, redistributing copyrighted content without permission violates YouTube Terms of Service and copyright law. Always respect content creators rights.',
  },
  {
    question: 'What video quality can I download?',
    answer: 'Tubefission supports downloading videos in multiple resolutions, including HD and Full HD, depending on the original upload quality.',
  },
  {
    question: 'Can I analyze any YouTube channel?',
    answer: 'Yes. Paste any channel URL to see detailed analytics including subscriber growth, top-performing videos, engagement rates, and trending content patterns.',
  },
  {
    question: 'Does Tubefission add watermarks to downloads?',
    answer: 'No. We do not add any watermarks to downloaded videos. The file you receive matches the original quality and format.',
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
            YouTube Video Downloader<br className="hidden sm:block" /> & Analytics Platform
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Download YouTube videos without watermark, analyze channels, and track trends instantly with Tubefission.
          </p>

          {/* CTA Input */}
          <DownloadHeroForm />

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
              Fast Processing
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              Secure Download
            </span>
          </div>
        </div>
      </section>

      {/* ===== INTERNAL LINKS BAR ===== */}
      <section className="border-y border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm">
            <Link href="/download-youtube-video" className="text-blue-600 hover:text-blue-800 font-medium">
              YouTube Video Download →
            </Link>
            <Link href="/youtube-channel-analytics" className="text-blue-600 hover:text-blue-800 font-medium">
              Channel Analytics →
            </Link>
            <Link href="/trending" className="text-blue-600 hover:text-blue-800 font-medium">
              Trending Videos →
            </Link>
            <Link href="/trends" className="text-blue-600 hover:text-blue-800 font-medium">
              Trend Database →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== LONG-FORM CONTENT ===== */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">What Is Tubefission for YouTube?</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          Tubefission is a free <strong>YouTube video downloader and analytics platform</strong> designed for creators, marketers, and everyday viewers who want more control over their content consumption and research. Whether you need to save a tutorial for offline viewing, study a competitor channel, or discover viral trends before they peak, Tubefission gives you the tools to do it instantly in your browser.
        </p>
        <p className="text-gray-700 leading-relaxed mb-10">
          Unlike many tools that require software installation, registration, or paid subscriptions, Tubefission operates entirely online with no login required. Paste a YouTube URL, and within seconds you can download the video or unlock deep analytics about its performance, audience engagement, and growth trajectory.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mb-6">How YouTube Download Works</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          Our <strong>YouTube downloader</strong> uses a simple three-step process that anyone can follow:
        </p>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 leading-relaxed mb-10">
          <li><strong>Copy the URL</strong> of the YouTube video you want to download from your browser address bar.</li>
          <li><strong>Paste it into the input field</strong> at the top of this page and click the Download Now button.</li>
          <li><strong>Select your preferred format and quality</strong>, then save the file directly to your device.</li>
        </ol>
        <p className="text-gray-700 leading-relaxed mb-10">
          The entire process takes less than 10 seconds. We support multiple resolutions and formats, ensuring you get the best possible version of the video for your needs. Best of all, Tubefission does not add watermarks to your downloads, preserving the original viewing experience.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mb-6">Channel Analytics Explanation</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          Understanding how channels grow is essential for creators who want to compete on YouTube. Tubefissions <strong>channel analytics</strong> feature breaks down any public channel into actionable metrics:
        </p>
        <ul className="list-disc list-inside space-y-3 text-gray-700 leading-relaxed mb-10">
          <li><strong>Subscriber velocity</strong> — how fast a channel is gaining subscribers relative to its upload frequency.</li>
          <li><strong>Engagement rate</strong> — the ratio of likes and comments to total views, revealing content quality.</li>
          <li><strong>Top-performing videos</strong> — identify which titles, thumbnails, and topics drive the most traffic.</li>
          <li><strong>Upload consistency</strong> — track publishing schedules to understand audience retention patterns.</li>
        </ul>
        <p className="text-gray-700 leading-relaxed mb-10">
          These metrics are computed from real YouTube API data, refreshed daily, and filtered by country so you can see what works in your specific market. No guesswork, no outdated spreadsheets — just clear, visual intelligence.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mb-6">Use Cases for Creators</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          Tubefission serves a wide range of creator workflows:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Competitor Research</h3>
            <p className="text-sm text-gray-600">Download competitor videos to study their editing style, pacing, and hooks frame by frame.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Content Strategy</h3>
            <p className="text-sm text-gray-600">Analyze trending channels in your niche to identify content gaps and high-opportunity topics.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Offline Learning</h3>
            <p className="text-sm text-gray-600">Save tutorials, courses, and educational content for viewing during commutes or travel.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Trend Discovery</h3>
            <p className="text-sm text-gray-600">Spot viral patterns early by tracking breakout scores and velocity across categories.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-6">Trend Discovery with Real Data</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          Our trend engine does not rely on guesswork or static lists. Instead, it pulls live data from YouTubes most popular videos across six countries — the United States, Japan, South Korea, the United Kingdom, Hong Kong, and Taiwan. From these videos, we extract real trending keywords, compute velocity and saturation scores, and surface breakout opportunities that are still early enough to capture.
        </p>
        <p className="text-gray-700 leading-relaxed mb-10">
          This means every trend you see on Tubefission is backed by actual view counts, engagement rates, and creator adoption metrics from the real platform. You are not reading predictions — you are reading data.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Tubefission?</h2>
        <div className="space-y-4 mb-10">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">1</div>
            <div>
              <h3 className="font-semibold text-gray-900">No Account Required</h3>
              <p className="text-gray-600 text-sm">Start downloading and analyzing immediately without handing over your email or creating passwords.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">2</div>
            <div>
              <h3 className="font-semibold text-gray-900">Zero Watermarks</h3>
              <p className="text-gray-600 text-sm">Downloads preserve the original video quality with no overlays, logos, or branding added.</p>
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
              <h3 className="font-semibold text-gray-900">Secure & Fast</h3>
              <p className="text-gray-600 text-sm">All processing happens through encrypted connections. No files are stored on our servers.</p>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-6">Get Started in Seconds</h2>
        <p className="text-gray-700 leading-relaxed mb-8">
          Ready to download your first video or analyze a channel? Scroll back to the top of this page, paste a YouTube URL into the input field, and click <strong>Download Now</strong>. If you want deeper analytics, head over to our <Link href="/youtube-channel-analytics" className="text-blue-600 hover:underline">Channel Analytics</Link> page or explore the <Link href="/trends" className="text-blue-600 hover:underline">Trend Database</Link> to find your next viral topic.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/download-youtube-video" className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
            Download YouTube Video →
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
              Paste a YouTube URL to start downloading or analyzing
            </p>
            <Link
              href="/download-youtube-video"
              className="w-full sm:w-auto px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors text-center"
            >
              Download Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
