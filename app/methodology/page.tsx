import type { Metadata } from 'next'
import Link from 'next/link'
import { BreadcrumbSchema, FAQPageSchema, WebPageSchema } from '@/app/components/JsonLd'

export const metadata: Metadata = {
  title: 'TubeFission Methodology: YouTube Trend and Video Analysis',
  description: 'How TubeFission turns public YouTube data into creator decisions, including trend snapshots, video scoring, retention inference, compare workflows, and data limitations.',
  alternates: {
    canonical: 'https://tubefission.com/methodology',
  },
}

const FAQ_ITEMS = [
  {
    question: 'Does TubeFission use private YouTube Studio data?',
    answer: 'No. TubeFission analyzes public YouTube signals such as video metadata, visible engagement, publish timing, channel information, and regional trend snapshots. Private retention, revenue, CTR, and traffic-source data require creator-owned YouTube Studio access and are not used here.',
  },
  {
    question: 'Why are some metrics labeled inferred?',
    answer: 'Some decisions creators need, such as likely retention drop-off or regional audience fit, are not directly exposed by public YouTube APIs. TubeFission labels these as directional estimates and explains which public evidence influenced the estimate.',
  },
  {
    question: 'How often is trend data refreshed?',
    answer: 'Trend boards use cached snapshots so pages remain fast and consistent for users. The product is designed around hourly refresh windows rather than expensive real-time calls on every page view.',
  },
  {
    question: 'Can scores guarantee a video will go viral?',
    answer: 'No score can guarantee performance. TubeFission scores are decision aids that help creators compare options, identify risks, and choose what to test next.',
  },
]

const signalGroups = [
  {
    title: 'Public performance signals',
    items: ['Views and view velocity', 'Likes, comments, and weighted engagement', 'Publish age and lifecycle stage', 'Channel/title/description metadata'],
  },
  {
    title: 'Content interpretation',
    items: ['Title promise and hook clarity', 'Format classification', 'Search intent and keyword coverage', 'Topic fit and audience job'],
  },
  {
    title: 'Decision outputs',
    items: ['Creator Brief verdict', 'Suggested next angle', 'Compare benchmark selection', 'Watchlist and alert follow-up'],
  },
]

const workflow = [
  {
    step: '01',
    title: 'Collect public evidence',
    copy: 'TubeFission reads public metadata and performance signals from a video, channel, trend snapshot, or comparison set.',
  },
  {
    step: '02',
    title: 'Normalize for decision context',
    copy: 'Metrics are compared against publish age, format, topic, and visible engagement so a large old video does not automatically beat a fast newer opportunity.',
  },
  {
    step: '03',
    title: 'Explain the score',
    copy: 'The interface shows what the signal means, why it matters, and where the estimate is limited by missing private data.',
  },
  {
    step: '04',
    title: 'Turn research into action',
    copy: 'Results point toward a title angle, opening hook, content structure, compare benchmark, workspace save, or alert threshold.',
  },
]

export default function MethodologyPage() {
  return (
    <main className="min-h-screen bg-white">
      <WebPageSchema
        title="TubeFission Methodology"
        description="How TubeFission turns public YouTube data into creator decisions."
        url="https://tubefission.com/methodology"
        datePublished="2026-07-07"
      />
      <FAQPageSchema items={FAQ_ITEMS} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://tubefission.com' },
        { name: 'Methodology', url: 'https://tubefission.com/methodology' },
      ]} />

      <section className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl">
            <div className="text-xs font-bold uppercase tracking-wider text-red-600">Methodology</div>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-gray-950 sm:text-5xl">
              How TubeFission turns public YouTube data into creator decisions
            </h1>
            <p className="mt-5 text-base leading-8 text-gray-600 sm:text-lg">
              TubeFission is built for creators who need to decide what to publish next. The product combines public YouTube evidence, content analysis, comparison workflows, and clearly labeled inference so users can move from research to an upload plan.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {signalGroups.map((group) => (
            <div key={group.title} className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="text-lg font-black text-gray-950">{group.title}</h2>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-gray-600">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="mb-6 max-w-2xl">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Analysis workflow</div>
            <h2 className="mt-2 text-2xl font-black text-gray-950">From raw signal to next action</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            {workflow.map((item) => (
              <div key={item.step} className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-sm font-black text-red-600">{item.step}</div>
                <h3 className="mt-4 font-black text-gray-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-red-600">Data limitations</div>
          <h2 className="mt-2 text-2xl font-black text-gray-950">What TubeFission does not claim</h2>
          <p className="mt-3 text-sm leading-7 text-gray-600">
            Public data is useful, but it is not the same as a creator&apos;s private YouTube Studio dashboard. TubeFission separates directly available public evidence from modeled estimates so users know how much confidence to place in each recommendation.
          </p>
        </div>
        <div className="grid gap-3">
          {[
            ['Private retention', 'Audience retention curves are inferred from public signals unless the creator supplies private analytics elsewhere.'],
            ['Revenue and RPM', 'Commercial value is estimated from topic, format, and intent, not from private revenue reports.'],
            ['Geography', 'Regional fit uses language, topic, market clues, and selected trend regions rather than private viewer geography.'],
            ['Forecasting', 'Predictions are scenario-based decisions, not guarantees of future views or income.'],
          ].map(([title, copy]) => (
            <div key={title} className="rounded-xl border border-gray-200 bg-white p-4">
              <h3 className="font-bold text-gray-950">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-gray-600">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-gray-200 bg-gray-950 text-white">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { href: '/youtube-video-analyzer', title: 'Analyze a video', copy: 'Understand why one video rose or stalled.' },
              { href: '/trending', title: 'Find trend evidence', copy: 'Browse source-backed regional opportunities.' },
              { href: '/compare-new?type=videos', title: 'Compare candidates', copy: 'Pick the stronger benchmark before copying.' },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="rounded-xl border border-white/10 bg-white/5 p-5 hover:bg-white/10">
                <h3 className="font-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-300">{item.copy}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <h2 className="text-2xl font-black text-gray-950">Frequently asked questions</h2>
        <div className="mt-5 space-y-3">
          {FAQ_ITEMS.map((item) => (
            <div key={item.question} className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <h3 className="font-bold text-gray-950">{item.question}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
