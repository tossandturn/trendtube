import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About TubeFission | YouTube Trend Intelligence for Creators',
  description: 'Learn how TubeFission helps creators analyze public YouTube data, compare videos, track opportunities, and turn trend research into content decisions.',
  alternates: { canonical: 'https://tubefission.com/about' },
}

export default function AboutPage() {
  return (
    <main className="bg-white">
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">About TubeFission</div>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-gray-950 sm:text-5xl">
          We help creators decide what to analyze, compare, and publish next.
        </h1>
        <p className="mt-5 text-base leading-8 text-gray-700">
          TubeFission is a YouTube research workspace for creators, marketers, and analysts who need more than a list of trending videos. The product connects public YouTube metrics, content pattern analysis, comparison baskets, watchlists, and brief generation so research can become a concrete upload decision.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { title: 'Public data first', copy: 'We use public YouTube metadata and performance signals such as titles, descriptions, views, likes, comments, publish time, and channel context.' },
            { title: 'Decision oriented', copy: 'Each analysis is designed to answer whether a topic is worth testing, what can be copied safely, and what should be avoided.' },
            { title: 'Workspace loop', copy: 'Logged-in users can save opportunities, build a video comparison basket, track watchlists, and return to prior research.' },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <h2 className="font-bold text-gray-950">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">{item.copy}</p>
            </div>
          ))}
        </div>

        <section className="mt-12 space-y-6 text-sm leading-7 text-gray-700">
          <div>
            <h2 className="text-xl font-black text-gray-950">What makes the analysis useful</h2>
            <p className="mt-2">
              TubeFission separates raw popularity from creator usefulness. A video with high views is not automatically a good benchmark; we also look at momentum, engagement quality, format repeatability, commercial fit, regional clues, and saturation risk.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-950">What we do not claim</h2>
            <p className="mt-2">
              We do not access private retention, revenue, subscriber demographics, or creator studio analytics. Scores are decision aids inferred from public data, not guarantees of future performance.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-950">How to contact us</h2>
            <p className="mt-2">
              For product feedback, data concerns, partnership questions, or account support, visit the <Link href="/contact" className="font-bold text-red-600 hover:text-red-700">contact page</Link>.
            </p>
          </div>
        </section>
      </section>
    </main>
  )
}
