import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Video Analysis Entry | TubeFission',
  description: 'Paste a YouTube video URL to start analysis in TubeFission.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function LegacyVideoAnalyzePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8">
          <span className="text-lg">←</span>
          <span className="text-sm font-medium">Back to TubeFission</span>
        </Link>

        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Video Analysis Entry</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            This older analysis entry has moved. Use the main analysis flow or trending pages to open a valid video report.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/youtube-video-analyzer" className="bg-gray-50 rounded-xl border border-gray-200 p-5 hover:border-green-300 hover:bg-white transition">
            <div className="font-semibold text-gray-900 mb-1">Video Analyzer</div>
            <div className="text-sm text-gray-500">Paste a YouTube video URL and open a valid video analysis report.</div>
          </Link>
          <Link href="/trending" className="bg-gray-50 rounded-xl border border-gray-200 p-5 hover:border-red-300 hover:bg-white transition">
            <div className="font-semibold text-gray-900 mb-1">Trending Videos</div>
            <div className="text-sm text-gray-500">Start from live examples and jump into a real video analysis page.</div>
          </Link>
        </div>
      </div>
    </main>
  )
}
