import type { Metadata } from 'next'
import Link from 'next/link'
import { DownloadHeroForm } from '@/app/components/DownloadHeroForm'
import { FAQPageSchema, BreadcrumbSchema, ArticleSchema } from '@/app/components/JsonLd'

export const metadata: Metadata = {
  title: 'Download YouTube to MP3 — Free Audio Converter',
  description: 'Convert YouTube videos to MP3 for free. Extract audio in high quality. Fast, secure, no registration required.',
  keywords: [
    'download YouTube MP3',
    'YouTube to MP3 converter',
    'convert YouTube to audio',
    'free MP3 downloader',
    'YouTube audio extractor',
    'save YouTube audio',
  ],
  alternates: {
    canonical: 'https://tubefission.com/download-youtube-mp3',
  },
  openGraph: {
    title: 'Download YouTube to MP3 — Free Audio Converter',
    description: 'Convert YouTube videos to MP3 for free. Extract audio in high quality.',
    url: 'https://tubefission.com/download-youtube-mp3',
    type: 'article',
  },
}

const FAQ_ITEMS = [
  {
    question: 'How do I convert YouTube to MP3?',
    answer: 'Copy the YouTube video URL, paste it into our converter, and click download. The audio will be extracted and saved as MP3.',
  },
  {
    question: 'What audio quality is available?',
    answer: 'We provide MP3 downloads in high quality up to 320kbps, preserving the original audio fidelity from the source video.',
  },
  {
    question: 'Is the MP3 download free?',
    answer: 'Yes. Converting YouTube videos to MP3 is completely free with no hidden charges or subscription required.',
  },
  {
    question: 'Can I download audio from any video?',
    answer: 'You can extract audio from any public YouTube video, including music, podcasts, lectures, and interviews.',
  },
  {
    question: 'Is MP3 conversion legal?',
    answer: 'Downloading audio for personal use is generally acceptable. Please respect copyright and do not redistribute content without permission.',
  },
  {
    question: 'Does it work on mobile?',
    answer: 'Yes. Our MP3 converter works on all devices including smartphones, tablets, and desktop computers.',
  },
  {
    question: 'What file format is used?',
    answer: 'Downloads are provided in MP3 format, which is compatible with all music players and devices.',
  },
  {
    question: 'How long does conversion take?',
    answer: 'Conversion is fast and typically completes within seconds, depending on the video length and server load.',
  },
]

export default function MP3DownloadPage() {
  return (
    <main className="min-h-screen bg-white">
      <ArticleSchema
        title="Download YouTube to MP3 — Free Audio Converter"
        description="Convert YouTube videos to MP3 for free. Extract audio in high quality."
        url="https://tubefission.com/download-youtube-mp3"
        datePublished="2026-01-01"
      />
      <FAQPageSchema items={FAQ_ITEMS} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://tubefission.com' },
        { name: 'Download YouTube MP3', url: 'https://tubefission.com/download-youtube-mp3' },
      ]} />

      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white pt-16 pb-12 sm:pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-4 leading-tight">
            Download YouTube to MP3
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Convert YouTube videos to MP3 audio for free. High quality audio extraction, fast and secure.
          </p>
          <DownloadHeroForm />
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              High quality MP3
            </span>
            <span className="inline-flex items-center gap-1">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              Fast conversion
            </span>
            <span className="inline-flex items-center gap-1">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              No registration
            </span>
          </div>
        </div>
      </section>

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

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Convert YouTube Videos to MP3 Audio</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          YouTube hosts millions of audio tracks, podcasts, lectures, and music videos. Our <strong>YouTube to MP3 converter</strong> lets you extract high-quality audio from any video and save it as an MP3 file for offline listening.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mb-6">How to Download MP3 from YouTube</h2>
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
              <h3 className="font-semibold text-gray-900 mb-1">Paste and Convert</h3>
              <p className="text-gray-600">Paste the URL into our converter and click Download. We will extract the audio track.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">3</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Save MP3 File</h3>
              <p className="text-gray-600">Download the extracted audio as an MP3 file to your device for offline playback.</p>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-6">Available Audio Qualities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Standard (128kbps)</h3>
            <p className="text-sm text-gray-600">Good quality with smaller file size, suitable for mobile devices.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">High (192kbps)</h3>
            <p className="text-sm text-gray-600">Better audio fidelity for music and high-quality content.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Premium (256kbps)</h3>
            <p className="text-sm text-gray-600">Excellent quality for audiophiles and professional use.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Maximum (320kbps)</h3>
            <p className="text-sm text-gray-600">Best possible MP3 quality, preserving all audio details.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Convert YouTube to MP3</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Offline Listening</h3>
            <p className="text-sm text-gray-600">Save music, podcasts, and lectures for listening without internet connection.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Device Compatibility</h3>
            <p className="text-sm text-gray-600">MP3 works on all devices: phones, MP3 players, car stereos, and computers.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Content Research</h3>
            <p className="text-sm text-gray-600">Archive educational content, interviews, and talks for study and reference.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Personal Collection</h3>
            <p className="text-sm text-gray-600">Build your own audio library from YouTube content you love.</p>
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
