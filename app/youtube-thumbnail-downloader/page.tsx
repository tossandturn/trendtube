import type { Metadata } from 'next'
import Link from 'next/link'
import { FAQPageSchema, BreadcrumbSchema, ArticleSchema } from '@/app/components/JsonLd'
import { getRegion } from '@/lib/region-server'
import { fetchTrendingVideos } from '@/lib/api-client'

export const metadata: Metadata = {
  title: 'YouTube Thumbnail Downloader — Free HD Thumbnail Saver',
  description: 'Download YouTube video thumbnails in HD quality for free. Save cover images without watermark. Works for all videos and Shorts.',
  keywords: [
    'YouTube thumbnail downloader',
    'download YouTube thumbnail',
    'HD thumbnail saver',
    'YouTube cover image',
    'video thumbnail download',
    'free thumbnail downloader',
  ],
  alternates: {
    canonical: 'https://tubefission.com/youtube-thumbnail-downloader',
  },
  openGraph: {
    title: 'YouTube Thumbnail Downloader — Free HD Thumbnail Saver',
    description: 'Download YouTube video thumbnails in HD quality for free. Save cover images without watermark.',
    url: 'https://tubefission.com/youtube-thumbnail-downloader',
    type: 'article',
  },
}

const FAQ_ITEMS = [
  {
    question: 'How do I download a YouTube thumbnail?',
    answer: 'Paste the YouTube video URL, click extract, and download the thumbnail image in your preferred resolution.',
  },
  {
    question: 'What thumbnail qualities are available?',
    answer: 'We provide thumbnail downloads in multiple resolutions: default, medium, high, standard, and maximum resolution available.',
  },
  {
    question: 'Can I download thumbnails from any video?',
    answer: 'Yes. You can extract thumbnails from any public YouTube video, including regular videos and Shorts.',
  },
  {
    question: 'Are the thumbnails watermarked?',
    answer: 'No. The thumbnail images are downloaded exactly as they appear on YouTube, with no watermarks added.',
  },
  {
    question: 'Is downloading thumbnails legal?',
    answer: 'Downloading thumbnails for personal reference or educational purposes is generally acceptable. Do not redistribute without permission.',
  },
]

export default async function ThumbnailDownloaderPage() {
  const region = await getRegion()
  const videos = await fetchTrendingVideos(region, 10)

  return (
    <main className="min-h-screen bg-white">
      <ArticleSchema
        title="YouTube Thumbnail Downloader — Free HD Thumbnail Saver"
        description="Download YouTube video thumbnails in HD quality for free. Save cover images without watermark."
        url="https://tubefission.com/youtube-thumbnail-downloader"
        datePublished="2026-01-01"
      />
      <FAQPageSchema items={FAQ_ITEMS} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://tubefission.com' },
        { name: 'YouTube Thumbnail Downloader', url: 'https://tubefission.com/youtube-thumbnail-downloader' },
      ]} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white pt-16 pb-12 sm:pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-4 leading-tight">
            YouTube Thumbnail Downloader
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Download YouTube video thumbnails in HD quality. Free, fast, no watermark.
          </p>

          {/* Thumbnail Downloader Form */}
          <form className="max-w-xl mx-auto" aria-label="YouTube thumbnail downloader form">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                placeholder="Paste YouTube video URL..."
                className="flex-1 min-h-[48px] px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
              <button
                type="submit"
                className="min-h-[48px] px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                Get Thumbnail
              </button>
            </div>
          </form>

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
              Multiple sizes
            </span>
          </div>
        </div>
      </section>

      {/* Sample Thumbnails */}
      <section className="border-y border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-gray-500 mb-4">Sample thumbnails from {region}</p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {videos.slice(0, 5).map((video, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <img
                  src={video.snippet?.thumbnails?.medium?.url || `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`}
                  alt={video.snippet?.title || 'Video thumbnail'}
                  className="w-full aspect-video object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Internal Links */}
      <section className="border-b border-gray-200 bg-white">
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
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Download YouTube Thumbnails in HD</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          YouTube thumbnails are the first thing viewers see when browsing videos. Our <strong>YouTube thumbnail downloader</strong> lets you save these cover images in high resolution for research, inspiration, or reference.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mb-6">How to Download Thumbnails</h2>
        <div className="space-y-6 mb-10">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">1</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Copy Video URL</h3>
              <p className="text-gray-600">Navigate to the YouTube video and copy the URL from your browser address bar.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">2</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Paste and Extract</h3>
              <p className="text-gray-600">Paste the URL into our tool and click Get Thumbnail. We will fetch all available thumbnail sizes.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">3</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Download Image</h3>
              <p className="text-gray-600">Choose your preferred resolution and download the thumbnail as a JPG or PNG file.</p>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-6">Available Thumbnail Sizes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Default (120x90)</h3>
            <p className="text-sm text-gray-600">Small thumbnail suitable for lists and previews.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Medium (320x180)</h3>
            <p className="text-sm text-gray-600">Standard quality for most applications.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">High (480x360)</h3>
            <p className="text-sm text-gray-600">Better quality for presentations and reference.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Max Resolution (1280x720)</h3>
            <p className="text-sm text-gray-600">Full HD quality, perfect for design work and analysis.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Download Thumbnails</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Design Research</h3>
            <p className="text-sm text-gray-600">Study what makes effective thumbnails to improve your own video covers.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Content Reference</h3>
            <p className="text-sm text-gray-600">Build a library of thumbnail styles for inspiration and analysis.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Educational Use</h3>
            <p className="text-sm text-gray-600">Use thumbnails in presentations about YouTube strategy and content creation.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Archiving</h3>
            <p className="text-sm text-gray-600">Save thumbnails alongside videos for complete content archiving.</p>
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
