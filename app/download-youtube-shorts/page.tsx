import type { Metadata } from 'next'
import Link from 'next/link'
import { DownloadHeroForm } from '@/app/components/DownloadHeroForm'
import { FAQPageSchema, BreadcrumbSchema, ArticleSchema } from '@/app/components/JsonLd'

export const metadata: Metadata = {
  title: 'Download YouTube Shorts — Free Shorts Video Downloader',
  description: 'Download YouTube Shorts for free. Save vertical short videos without watermark. Fast, secure, no login required.',
  robots: {
    index: false,
    follow: true,
  },
  keywords: [
    'download YouTube Shorts',
    'YouTube Shorts downloader',
    'save YouTube Shorts',
    'Shorts video download',
    'free Shorts downloader',
    'YouTube Shorts MP4',
  ],
  alternates: {
    canonical: 'https://tubefission.com/download-youtube-shorts',
  },
  openGraph: {
    title: 'Download YouTube Shorts — Free Shorts Video Downloader',
    description: 'Download YouTube Shorts for free. Save vertical short videos without watermark.',
    url: 'https://tubefission.com/download-youtube-shorts',
    type: 'article',
  },
}

const FAQ_ITEMS = [
  {
    question: 'How do I download YouTube Shorts?',
    answer: 'Copy the Shorts URL from the YouTube app or website, paste it into our downloader, and click download. The video will be saved as MP4.',
  },
  {
    question: 'Are Shorts downloaded in HD quality?',
    answer: 'Yes. We preserve the original quality of the Shorts video, supporting up to 1080p resolution depending on the source.',
  },
  {
    question: 'Can I download Shorts without watermark?',
    answer: 'Yes. Our downloader does not add any watermarks to downloaded Shorts videos.',
  },
  {
    question: 'Is there a limit on Shorts downloads?',
    answer: 'No strict limit. You can download multiple Shorts videos per day for personal use.',
  },
  {
    question: 'Do Shorts downloads work on mobile?',
    answer: 'Yes. Our tool is fully responsive and works perfectly on smartphones for downloading Shorts.',
  },
]

export default function ShortsDownloadPage() {
  return (
    <main className="min-h-screen bg-white">
      <ArticleSchema
        title="Download YouTube Shorts — Free Shorts Video Downloader"
        description="Download YouTube Shorts for free. Save vertical short videos without watermark."
        url="https://tubefission.com/download-youtube-shorts"
        datePublished="2026-01-01"
      />
      <FAQPageSchema items={FAQ_ITEMS} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://tubefission.com' },
        { name: 'Download YouTube Shorts', url: 'https://tubefission.com/download-youtube-shorts' },
      ]} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white pt-16 pb-12 sm:pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-4 leading-tight">
            Download YouTube Shorts
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Save YouTube Shorts videos for free. Download vertical short content without watermark.
          </p>
          <DownloadHeroForm />
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              HD quality
            </span>
            <span className="inline-flex items-center gap-1">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              No watermark
            </span>
            <span className="inline-flex items-center gap-1">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              Mobile friendly
            </span>
          </div>
        </div>
      </section>

      {/* Internal Links */}
      <section className="border-y border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm">
            <Link href="/download-youtube-video" className="text-blue-600 hover:text-blue-800 font-medium">
              Video Download →
            </Link>
            <Link href="/youtube-channel-analytics" className="text-blue-600 hover:text-blue-800 font-medium">
              Channel Analytics →
            </Link>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Save YouTube Shorts Videos</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          YouTube Shorts has become one of the fastest-growing content formats. Our <strong>YouTube Shorts downloader</strong> lets you save these vertical videos for offline viewing, content research, or personal archiving.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mb-6">How to Download Shorts</h2>
        <div className="space-y-6 mb-10">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">1</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Copy Shorts URL</h3>
              <p className="text-gray-600">Open the YouTube app or website, find the Shorts video, and copy the share link.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">2</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Paste and Download</h3>
              <p className="text-gray-600">Paste the URL into our tool and click the download button.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">3</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Save to Device</h3>
              <p className="text-gray-600">The MP4 file will download to your device in vertical format.</p>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Download Shorts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Content Research</h3>
            <p className="text-sm text-gray-600">Study trending Shorts formats and hooks for your own content.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Offline Viewing</h3>
            <p className="text-sm text-gray-600">Save entertaining Shorts to watch without internet connection.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Educational Content</h3>
            <p className="text-sm text-gray-600">Archive quick tutorials and tips for future reference.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Reference Library</h3>
            <p className="text-sm text-gray-600">Build a personal collection of inspiring Shorts content.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/download-youtube-video" className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            Video Download →
          </Link>
          <Link href="/" className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
            Back to Home
          </Link>
        </div>
      </article>

      {/* FAQ */}
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
    </main>
  )
}
