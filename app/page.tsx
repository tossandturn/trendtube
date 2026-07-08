import type { Metadata } from 'next'
import Link from 'next/link'
import { SoftwareApplicationSchema, FAQPageSchema, BreadcrumbSchema } from '@/app/components/JsonLd'
import { AnalyzeHeroForm } from '@/app/components/AnalyzeHeroForm'
import { PRODUCT_ACCESS_COPY } from '@/lib/product-positioning'
import { getCreatorBriefHref } from '@/lib/creator-brief-links'

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
    answer: PRODUCT_ACCESS_COPY.short,
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
    answer: 'Metrics come from the YouTube Data API. Trend pages use hourly refreshed snapshots so every page can show a clear data timestamp instead of mixing live claims with stale cache.',
  },
  {
    question: 'Is Tubefission safe to use?',
    answer: 'Yes. Anonymous analysis works without connecting a YouTube account. If you create a TubeFission account, it is used to keep workspace history, watchlists, alerts, and saved comparisons connected.',
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
    answer: 'Visit our Trend Database or Trending pages to see hourly refreshed breakout scores and velocity metrics. Each trend page explains the snapshot time and the signals behind the recommendation.',
  },
  {
    question: 'Is there an analysis limit?',
    answer: PRODUCT_ACCESS_COPY.limit,
  },
  {
    question: 'Who is Tubefission for?',
    answer: 'Tubefission is designed for YouTube creators, content strategists, digital marketers, researchers, and anyone who wants data-driven insights into YouTube performance and trends.',
  },
]

export default function HomePage() {
  const homepageBriefHref = getCreatorBriefHref({
    topic: 'rising YouTube trend opportunity',
    niche: 'Creator content planning',
    type: 'script',
    source: 'homepage-decision',
    angle: 'Turn a discovered trend into a next-upload brief with title angle, hook, timeline, SEO keywords, and risk checks.',
  })

  return (
    <main className="min-h-screen bg-white">
      {/* Structured Data */}
      <SoftwareApplicationSchema />
      <FAQPageSchema items={FAQ_ITEMS} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://tubefission.com' },
      ]} />

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,#fff1f2,transparent_34%),linear-gradient(180deg,#f9fafb_0%,#fff_72%)] pt-8 pb-10 sm:pt-14 sm:pb-14">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8">
          <div>
            <div className="mb-4 inline-flex rounded-full border border-red-100 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-600 shadow-sm">
              YouTube idea decision tool
            </div>
            <h1 className="text-4xl font-black tracking-tight text-gray-950 sm:text-6xl">
              Paste a YouTube URL. Get the next move.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
              See why a video is taking off, whether the trend is still worth chasing, and what to publish next.
            </p>
            <div className="mt-6">
              <AnalyzeHeroForm />
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-sm">
              <Link href="/trending" className="rounded-full bg-gray-900 px-4 py-2 font-bold text-white hover:bg-gray-800">Trending</Link>
              <Link href="/compare-new?type=videos" className="rounded-full border border-gray-200 bg-white px-4 py-2 font-bold text-gray-900 hover:bg-gray-50">Compare</Link>
              <Link href="/workspace" className="rounded-full border border-gray-200 bg-white px-4 py-2 font-bold text-gray-900 hover:bg-gray-50">Workspace</Link>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xl shadow-gray-200/70">
            <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Creator Brief preview</div>
                <div className="text-lg font-black text-gray-950">What you get after analysis</div>
              </div>
              <div className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">Example</div>
            </div>
            <div className="rounded-xl border border-red-100 bg-red-50 p-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-red-700">Verdict</div>
                  <div className="mt-1 text-2xl font-black text-gray-950">Worth testing within 24h</div>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">
                    High view velocity, clear content hook, and medium competition. The trend is still usable before copycat volume rises.
                  </p>
                </div>
                <div className="rounded-lg bg-white p-3">
                  <div className="text-xs text-gray-500">Opportunity</div>
                  <div className="mt-1 text-3xl font-black text-red-600">82</div>
                  <div className="text-xs font-semibold text-gray-500">public sample score</div>
                </div>
              </div>
              <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                {[
                  ['Why it is rising', 'Velocity is above the matched sample and comments show strong curiosity.'],
                  ['Suggested angle', 'Reaction, tutorial, or comparison with a sharper first 15 seconds.'],
                  ['Risk', 'Saturation may climb in 48h if adjacent creators copy the format.'],
                  ['Next action', 'Create an 8-12 min video, test 2 titles, post 2-4PM EST.'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-white p-3">
                    <div className="text-xs font-bold uppercase tracking-wide text-gray-500">{label}</div>
                    <div className="mt-1 leading-relaxed text-gray-800">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {[
                ['Freshness', 'Hourly trend snapshots'],
                ['Evidence', 'Source videos and sample size'],
                ['Regions', 'US, JP, KR, UK, HK, TW'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                  <div className="text-xs font-bold uppercase tracking-wide text-gray-500">{label}</div>
                  <div className="mt-1 text-sm font-semibold text-gray-900">{value}</div>
                </div>
              ))}
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Before TubeFission</div>
                <div className="mt-2 text-sm font-semibold text-gray-900">Pick topics by feel, then hope the upload works.</div>
              </div>
              <div className="rounded-xl bg-gray-950 p-4 text-white">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400">After TubeFission</div>
                <div className="mt-2 text-sm font-semibold">Find 3 shootable ideas, a posting window, and a follow-up alert.</div>
              </div>
            </div>

            <div className="mt-3 grid gap-3">
              {[
                { href: '/youtube-video-analyzer', step: '01', title: 'Analyze a URL', copy: 'Why this video rose or stalled.' },
                { href: '/compare-new?type=videos', step: '02', title: 'Compare winners', copy: 'Pick the stronger model before copying.' },
                { href: '/workspace', step: '03', title: 'Track opportunity', copy: 'Save ideas, alerts, and history.' },
              ].map((item) => (
                <Link key={item.step} href={item.href} className="group grid grid-cols-[44px_1fr] gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 hover:border-red-200 hover:bg-red-50">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-sm font-black text-red-600 shadow-sm">{item.step}</div>
                  <div>
                    <div className="font-black text-gray-950 group-hover:text-red-600">{item.title}</div>
                    <div className="mt-1 text-sm leading-relaxed text-gray-600">{item.copy}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST AND DATA QUALITY ===== */}
      <section className="border-y border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-red-600">Data quality</div>
              <h2 className="mt-2 text-2xl font-black text-gray-950">Built for decisions, not recycled trend lists.</h2>
              <p className="mt-3 text-sm leading-7 text-gray-600">
                TubeFission explains why a video or trend may matter, shows the public evidence behind the score, and labels the limits of the data before you copy an idea.
              </p>
              <Link href="/methodology" className="mt-4 inline-flex rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-900 hover:bg-gray-50">
                Read methodology
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { title: 'Public YouTube evidence', copy: 'Analysis uses public metadata and performance signals such as views, likes, comments, publish age, channel title, video title, and descriptions.' },
                { title: 'Creator brief output', copy: 'Results prioritize next actions: whether to test the idea, what angle to use, what risks to avoid, and which benchmark to compare.' },
                { title: 'Account-scoped workspace', copy: 'Saved opportunities, alerts, watchlists, and Analysis Basket belong to a logged-in account so research can be resumed safely.' },
                { title: 'Clear limitations', copy: 'Scores do not use private retention, revenue, or creator studio data. They are decision aids, not guarantees of future performance.' },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-gray-200 bg-white p-5">
                  <h3 className="font-bold text-gray-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{item.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CREATOR WORKSPACE ===== */}
      <section className="bg-gradient-to-b from-white to-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-red-600">Retention workspace</div>
              <h2 className="mt-2 text-2xl font-black text-gray-900 sm:text-3xl">Save the ideas worth revisiting.</h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-600 sm:text-base">
                Watchlist, alerts, history, and compare queues turn one-off analysis into a repeatable workflow.
              </p>
              <Link href="/workspace" className="mt-5 inline-flex rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700">
                Open Workspace
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { title: 'Watchlist', copy: 'Track channels and trends.', href: '/watchlist' },
                { title: 'Alerts', copy: 'Catch momentum changes.', href: '/alerts' },
                { title: 'History', copy: 'Resume past research.', href: '/workspace' },
                { title: 'Project flow', copy: 'Move idea -> brief -> upload.', href: '/workspace' },
              ].map((item) => (
                <Link key={item.title} href={item.href} className="rounded-xl border border-gray-200 bg-white p-4 hover:border-red-200 hover:bg-red-50">
                  <h3 className="font-bold text-gray-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{item.copy}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== DECISION ENTRY POINTS ===== */}
      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Start here</div>
              <h2 className="mt-1 text-2xl font-black text-gray-950">Choose the job.</h2>
            </div>
            <Link href="/compare-new?type=videos" className="text-sm font-bold text-red-600 hover:text-red-700">Open comparison</Link>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            {[
              { href: '/youtube-channel-analytics', label: 'Audit', title: 'Channel health', color: 'text-blue-600 bg-blue-50' },
              { href: '/trending', label: 'Spot', title: 'Rising topics', color: 'text-red-600 bg-red-50' },
              { href: '/compare-new?type=videos', label: 'Pick', title: 'Better model', color: 'text-amber-700 bg-amber-50' },
              { href: homepageBriefHref, label: 'Plan', title: 'Next brief', color: 'text-emerald-700 bg-emerald-50' },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="group rounded-xl border border-gray-200 bg-white p-4 hover:border-gray-300 hover:shadow-sm">
                <div className={`mb-4 inline-flex rounded-lg px-3 py-1 text-xs font-black uppercase tracking-wider ${item.color}`}>{item.label}</div>
                <div className="text-lg font-black text-gray-950 group-hover:text-red-600">{item.title}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SEO CONTENT ===== */}
      <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <details className="group rounded-2xl border border-gray-200 bg-gray-50 p-5">
          <summary className="cursor-pointer list-none text-sm font-black uppercase tracking-wider text-gray-700">
            SEO notes and product details
            <span className="float-right text-gray-400 group-open:hidden">Show</span>
            <span className="float-right hidden text-gray-400 group-open:inline">Hide</span>
          </summary>
          <div className="mt-6 border-t border-gray-200 pt-6">
        <p className="text-gray-700 leading-relaxed mb-6">
          Tubefission is a free-preview <strong>AI-powered YouTube analytics platform</strong> designed for creators, marketers, and researchers who want data-driven insights into YouTube performance and trends. Whether you need to analyze a competitor channel, study viral content patterns, or discover trending topics before they peak, Tubefission gives you the intelligence to make informed decisions.
        </p>
        <p className="text-gray-700 leading-relaxed mb-10">
          Unlike many tools that require paid subscriptions before research starts, Tubefission lets anonymous visitors try analysis first. A free account is useful when you want saved history, watchlists, alerts, compare queues, and workspace continuity.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mb-6">AI-Powered Video Analysis</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          Our <strong>AI video analysis engine</strong> goes beyond basic view counts. We analyze:
        </p>
        <ul className="list-disc list-inside space-y-3 text-gray-700 leading-relaxed mb-10">
          <li><strong>Engagement velocity</strong> - how quickly a video gains likes, comments, and shares relative to its age.</li>
          <li><strong>Retention proxies</strong> - estimating which content structures are likely to keep viewers watching longer.</li>
          <li><strong>Thumbnail packaging signals</strong> - evaluating visual composition and text overlays as public-data CTR proxies.</li>
          <li><strong>SEO optimization scores</strong> - evaluating title, description, and tag quality against top-performing videos.</li>
        </ul>
        <p className="text-gray-700 leading-relaxed mb-10">
          Public metrics come from YouTube API-backed data, while retention, CTR, geography, and audience fit are labeled estimates unless private Studio data is explicitly connected. Data is refreshed through transparent cache windows and filtered by country so you can see what works in your specific market.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mb-6">Channel Analytics & Competitor Research</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          Understanding how channels grow is essential for creators who want to compete on YouTube. Tubefission&apos;s <strong>channel analytics</strong> feature breaks down any public channel into actionable metrics:
        </p>
        <ul className="list-disc list-inside space-y-3 text-gray-700 leading-relaxed mb-10">
          <li><strong>Subscriber velocity</strong> - how fast a channel is gaining subscribers relative to its upload frequency.</li>
          <li><strong>Engagement rate</strong> - the ratio of likes and comments to total views, revealing content quality.</li>
          <li><strong>Top-performing videos</strong> - identify which titles, thumbnails, and topics drive the most traffic.</li>
          <li><strong>Upload consistency</strong> - track publishing schedules to understand repeat-viewing and retention proxy patterns.</li>
        </ul>
        <p className="text-gray-700 leading-relaxed mb-10">
          Use these insights to reverse-engineer competitor strategies, identify content gaps in your niche, and optimize your publishing schedule for maximum growth.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mb-6">Trend Discovery with Real Data</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          Our trend engine does not rely on guesswork or static lists. Instead, it builds hourly snapshots from YouTube&apos;s most popular videos across six countries - the United States, Japan, South Korea, the United Kingdom, Hong Kong, and Taiwan. From these videos, we extract real trending keywords, compute velocity and saturation scores, and surface breakout opportunities that are still early enough to capture.
        </p>
        <p className="text-gray-700 leading-relaxed mb-10">
          This means every trend you see on Tubefission is backed by actual view counts, engagement rates, and creator adoption metrics from the real platform. You are not reading predictions - you are reading data-driven intelligence.
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
              <h3 className="font-semibold text-gray-900">Free Preview First</h3>
              <p className="text-gray-600 text-sm">{PRODUCT_ACCESS_COPY.limit}</p>
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
              <h3 className="font-semibold text-gray-900">Clear Data Freshness</h3>
              <p className="text-gray-600 text-sm">Trend data uses official YouTube API-backed snapshots with visible refresh timing, so users know when the signal was generated.</p>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-6">Get Started in Seconds</h2>
        <p className="text-gray-700 leading-relaxed mb-8">
          Ready to analyze your first video or channel? Scroll back to the top of this page, paste a YouTube URL into the input field, and click <strong>Analyze Now</strong>. If you want deeper insights, head over to our <Link href="/youtube-channel-analytics" className="text-blue-600 hover:underline">Channel Analytics</Link> page or explore the <Link href="/trends" className="text-blue-600 hover:underline">Trend Database</Link> to find your next viral topic.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/trends" className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
            Explore Trend Database
          </Link>
          <Link href="/youtube-channel-analytics" className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            Analyze Channel
          </Link>
        </div>
          </div>
        </details>
      </article>

      {/* ===== FAQ SECTION ===== */}
      <section className="bg-white border-y border-gray-200">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <details className="group rounded-2xl border border-gray-200 bg-white p-5">
            <summary className="cursor-pointer list-none text-sm font-black uppercase tracking-wider text-gray-700">
              Frequently asked questions
              <span className="float-right text-gray-400 group-open:hidden">Show</span>
              <span className="float-right hidden text-gray-400 group-open:inline">Hide</span>
            </summary>
            <div className="mt-5 space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{item.question}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{item.answer}</p>
              </div>
            ))}
            </div>
          </details>
        </div>
      </section>

      {/* ===== STICKY CTA FOOTER ===== */}
      <section className="hidden sm:block sticky bottom-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <p className="text-sm text-gray-600 flex-1 text-center sm:text-left">
              Paste a URL, or jump straight to compare.
            </p>
            <div className="flex w-full sm:w-auto gap-2">
              <Link
                href="/youtube-channel-analytics"
                className="flex-1 sm:flex-none px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors text-center"
              >
                Analyze a Channel
              </Link>
              <Link
                href="/compare-new?type=videos"
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
