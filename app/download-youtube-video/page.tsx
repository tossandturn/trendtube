import type { Metadata } from 'next'
import Link from 'next/link'
import { DownloadHeroForm } from '@/app/components/DownloadHeroForm'
import { FAQPageSchema, BreadcrumbSchema, ArticleSchema } from '@/app/components/JsonLd'

export const metadata: Metadata = {
  title: 'Free YouTube Video Downloader — Download YouTube MP4 Without Watermark',
  description: 'Download YouTube videos in MP4 format without watermark. Fast, free, and secure. No login required. Paste a URL and save your video in seconds.',
  robots: {
    index: false,
    follow: true,
  },
  keywords: [
    'YouTube video download',
    'free YouTube download',
    'download YouTube MP4',
    'YouTube downloader without watermark',
    'save YouTube video',
    'YouTube to MP4',
  ],
  alternates: {
    canonical: 'https://tubefission.com/download-youtube-video',
  },
  openGraph: {
    title: 'Free YouTube Video Downloader — Download YouTube MP4 Without Watermark',
    description: 'Download YouTube videos in MP4 format without watermark. Fast, free, and secure.',
    url: 'https://tubefission.com/download-youtube-video',
    type: 'article',
  },
}

const FAQ_ITEMS = [
  {
    question: 'How do I download a YouTube video for free?',
    answer: 'Simply copy the YouTube video URL, paste it into the input field above, and click Download Now. Select your preferred quality and save the file to your device.',
  },
  {
    question: 'Does Tubefission add watermarks to downloaded videos?',
    answer: 'No. We never add watermarks, logos, or any overlays to downloaded videos. The file you receive is identical to the original upload.',
  },
  {
    question: 'What formats are supported?',
    answer: 'Tubefission supports MP4 downloads in multiple resolutions including 360p, 480p, 720p, 1080p, and higher depending on the original video quality.',
  },
  {
    question: 'Is there a download limit?',
    answer: 'There is no strict daily limit for personal use. We do monitor for abuse to ensure fair access for all users.',
  },
  {
    question: 'Can I download YouTube Shorts?',
    answer: 'Yes. Tubefission supports both regular YouTube videos and Shorts. Just paste the Shorts URL and follow the same download process.',
  },
]

export default function DownloadPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Structured Data */}
      <ArticleSchema
        title="Free YouTube Video Downloader — Download YouTube MP4 Without Watermark"
        description="Download YouTube videos in MP4 format without watermark. Fast, free, and secure. No login required."
        url="https://tubefission.com/download-youtube-video"
        datePublished="2026-01-01"
      />
      <FAQPageSchema items={FAQ_ITEMS} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://tubefission.com' },
        { name: 'Download YouTube Video', url: 'https://tubefission.com/download-youtube-video' },
      ]} />

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white pt-16 pb-12 sm:pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-4 leading-tight">
            Free YouTube Video Downloader
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Download any YouTube video in MP4 format without watermark. No software to install, no account to create — just paste the URL and go.
          </p>
          <DownloadHeroForm />
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              No watermark
            </span>
            <span className="inline-flex items-center gap-1">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              MP4 format
            </span>
            <span className="inline-flex items-center gap-1">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              HD quality
            </span>
          </div>
        </div>
      </section>

      {/* Internal Link */}
      <section className="border-y border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm">
            <Link href="/youtube-channel-analytics" className="text-blue-600 hover:text-blue-800 font-medium">
              YouTube Channel Analytics →
            </Link>
            <Link href="/trending" className="text-blue-600 hover:text-blue-800 font-medium">
              Trending Videos →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TUTORIAL ===== */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">How to Download YouTube Videos</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          Whether you want to save a tutorial for offline study, keep a music video on your phone, or archive a livestream, downloading YouTube videos is straightforward with Tubefission. Follow the steps below to get your file in under 10 seconds.
        </p>

        <div className="space-y-8 mb-12">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">1</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Copy the YouTube URL</h3>
              <p className="text-gray-600">Open the video on YouTube, click the address bar, and press Ctrl+C (or Cmd+C on Mac) to copy the link. You can also copy links from Shorts, playlists, and embedded players.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">2</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Paste into Tubefission</h3>
              <p className="text-gray-600">Return to this page and paste the URL into the input field at the top. The field accepts standard YouTube links, shortened youtu.be links, and even embed URLs.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">3</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Click Download Now</h3>
              <p className="text-gray-600">Press the blue button. Our system will fetch the video metadata, parse available formats, and present you with quality options ranging from standard to high definition.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">4</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Save the File</h3>
              <p className="text-gray-600">Choose your preferred resolution and click the download link. The MP4 file will save directly to your Downloads folder without any watermarks or branding added.</p>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-6">Use Cases for Free YouTube Downloads</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Offline Learning</h3>
            <p className="text-sm text-gray-600">Save educational tutorials, language lessons, and coding courses for watching on planes, subways, or anywhere without internet.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Content Research</h3>
            <p className="text-sm text-gray-600">Download competitor videos to analyze thumbnails, editing styles, pacing, and scripting techniques frame by frame.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Presentation Material</h3>
            <p className="text-sm text-gray-600">Collect reference clips for school projects, work presentations, or training sessions where stable playback matters.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Personal Archive</h3>
            <p className="text-sm text-gray-600">Build a private library of favorite music videos, motivational talks, or cooking recipes you revisit often.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-6">Is It Safe and Legal?</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          Tubefission does not store your downloaded videos on our servers. All processing happens through encrypted connections, and the file transfers directly from YouTube to your device. We do not collect personal data or require account registration.
        </p>
        <p className="text-gray-700 leading-relaxed mb-10">
          Regarding legality, downloading YouTube videos for personal, offline use generally falls within fair use in most jurisdictions. However, redistributing copyrighted content, using downloads for commercial purposes without permission, or attempting to monetize someone elses work violates copyright law and YouTube Terms of Service. Always respect content creators rights.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mb-6">Tips for the Best Download Experience</h2>
        <ul className="list-disc list-inside space-y-3 text-gray-700 leading-relaxed mb-10">
          <li><strong>Use a stable connection</strong> — large HD files can take longer on slow Wi-Fi.</li>
          <li><strong>Check available qualities</strong> — not every video supports 1080p or 4K; the uploader controls maximum resolution.</li>
          <li><strong>Download during off-peak hours</strong> — server response is fastest early morning and late evening.</li>
          <li><strong>Keep URLs clean</strong> — remove extra tracking parameters after the video ID for faster parsing.</li>
        </ul>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/youtube-channel-analytics" className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            Explore Channel Analytics →
          </Link>
          <Link href="/" className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
            Back to Home
          </Link>
        </div>
      </article>

      {/* ===== FAQ ===== */}
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
