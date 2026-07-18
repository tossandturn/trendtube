import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { SoftwareApplicationSchema, BreadcrumbSchema } from '@/app/components/JsonLd'
import AddToVideoCompareButton from '@/app/components/AddToVideoCompareButton'
import { getEngagementRate, getViewVelocity } from '@/lib/analytics'
import { TREND_REFRESH_CADENCE, trendFreshnessCopy } from '@/lib/data-freshness'
import { getRegionLabels, REGION_META, type Region } from '@/lib/region'
import { getRegion } from '@/lib/region-server'
import { buildTrendBoard, getCachedTrendBoard, type TrendBoard } from '@/lib/trend-board'
import type { YouTubeVideo } from '@/lib/api-client'

export const metadata: Metadata = {
  title: 'YouTube Trending Videos & Creator Opportunity Board | TubeFission',
  description: 'TubeFission homepage shows hourly YouTube trend snapshots, viral videos, niche opportunities, creative formats, and a fixed URL input for instant video or channel analysis.',
  alternates: {
    canonical: 'https://tubefission.com',
  },
  openGraph: {
    title: 'TubeFission Trending Board',
    description: 'Find rising YouTube videos, compare opportunities, and analyze any YouTube URL from the fixed header input.',
    url: 'https://tubefission.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TubeFission Trending Board',
    description: 'Hourly YouTube trend intelligence with fixed URL analysis input.',
  },
}

function getHomepageRegion(region: Region): Region {
  return region === 'GLOBAL' ? 'US' : region
}

function formatNumber(value: number | string | undefined) {
  const num = Number(value || 0)
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B'
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M'
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K'
  return num.toLocaleString()
}

function getViralScore(video: YouTubeVideo) {
  const views = Number(video.statistics?.viewCount || 0)
  const engagement = getEngagementRate(video)
  const velocity = getViewVelocity(video)

  return Math.round(
    Math.min(42, Math.log10(views + 1) * 5.3) +
    Math.min(38, Math.log10(velocity + 1) * 5.5) +
    Math.min(20, engagement * 3.4)
  )
}

function getDecision(score: number, engagement: number) {
  if (score >= 82 && engagement >= 4) return 'Analyze now'
  if (score >= 65) return 'Add to compare'
  return 'Track signal'
}

async function getHomepageBoard(region: Region): Promise<TrendBoard> {
  const fallback = buildTrendBoard([], region, [region])
  return Promise.race([
    getCachedTrendBoard(region),
    new Promise<TrendBoard>((resolve) => setTimeout(() => resolve(fallback), 6000)),
  ])
}

function TrendVideoCard({ video, index }: { video: YouTubeVideo; index: number }) {
  const velocity = getViewVelocity(video)
  const engagement = getEngagementRate(video)
  const score = getViralScore(video)
  const thumbnail =
    video.snippet?.thumbnails?.medium?.url ||
    video.snippet?.thumbnails?.high?.url ||
    `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <Link href={`/video/${video.id}`} className="group block">
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          <Image
            src={thumbnail}
            alt={video.snippet?.title || 'Trending YouTube video'}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform group-hover:scale-[1.03]"
            unoptimized
          />
          <div className="absolute left-2 top-2 rounded-lg bg-white/95 px-2 py-1 text-[11px] font-black text-red-600">
            #{index + 1}
          </div>
          <div className="absolute right-2 top-2 rounded-lg bg-black/75 px-2 py-1 text-[11px] font-bold text-white">
            Score {score}
          </div>
        </div>
      </Link>
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="rounded-full bg-red-50 px-2 py-1 text-[11px] font-bold text-red-700">
            {getDecision(score, engagement)}
          </span>
          <span className="text-[11px] font-semibold text-gray-500">{formatNumber(video.statistics?.viewCount)} views</span>
        </div>
        <Link href={`/video/${video.id}`} className="group block">
          <h3 className="line-clamp-2 text-sm font-black leading-5 text-gray-950 group-hover:text-red-600">
            {video.snippet?.title || 'Untitled video'}
          </h3>
        </Link>
        <p className="mt-2 truncate text-xs font-medium text-gray-500">{video.snippet?.channelTitle || 'Unknown channel'}</p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg bg-gray-50 p-2">
            <div className="font-bold uppercase text-gray-400">Velocity</div>
            <div className="mt-1 font-black text-green-700">
              {velocity >= 1_000_000 ? `${(velocity / 1_000_000).toFixed(1)}M/d` : velocity >= 1_000 ? `${(velocity / 1_000).toFixed(1)}K/d` : `${Math.round(velocity)}/d`}
            </div>
          </div>
          <div className="rounded-lg bg-gray-50 p-2">
            <div className="font-bold uppercase text-gray-400">Engagement</div>
            <div className="mt-1 font-black text-yellow-700">{engagement.toFixed(2)}%</div>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Link href={`/video/${video.id}`} className="flex-1 rounded-lg bg-gray-950 px-3 py-2 text-center text-xs font-bold text-white hover:bg-gray-800">
            Analyze
          </Link>
          <AddToVideoCompareButton
            videoId={video.id}
            title={video.snippet?.title}
            channelTitle={video.snippet?.channelTitle}
            thumbnailUrl={thumbnail}
            sourceLabel="Homepage trends"
            compact
          />
        </div>
      </div>
    </article>
  )
}

export default async function HomePage() {
  const region = getHomepageRegion(await getRegion())
  const labels = getRegionLabels(region)
  const board = await getHomepageBoard(region)
  const visibleVideos = board.topVideos.slice(0, 24)
  const topKeyword = board.keywordSignals[0]
  const topSections = board.sections.slice(0, 4)

  return (
    <main className="min-h-screen bg-gray-50 text-gray-950">
      <SoftwareApplicationSchema />
      <BreadcrumbSchema items={[{ name: 'Home', url: 'https://tubefission.com' }]} />

      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.22em] text-red-600">Trend board</div>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-950 sm:text-5xl">
                {labels.full} YouTube trends, ready to analyze.
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600 sm:text-base">
                The homepage is now the trend workspace. Use the fixed input above to analyze any video or channel, then add strong candidates to the compare basket.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                <Link href="/trends" className="rounded-lg bg-gray-950 px-4 py-2 font-bold text-white hover:bg-gray-800">Trend database</Link>
                <Link href="/compare-new?type=videos" className="rounded-lg border border-gray-200 bg-white px-4 py-2 font-bold text-gray-900 hover:bg-gray-50">Compare videos</Link>
                <Link href="/workspace" className="rounded-lg border border-gray-200 bg-white px-4 py-2 font-bold text-gray-900 hover:bg-gray-50">Workspace</Link>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Data snapshot</div>
              <div className="mt-1 text-lg font-black text-gray-950">{TREND_REFRESH_CADENCE}</div>
              <p className="mt-2 text-sm leading-6 text-gray-600">{trendFreshnessCopy(board.generatedAt)}</p>
              <div className="mt-3 text-xs font-semibold text-gray-500">
                Source regions: {board.sourceRegions.join(', ')}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Videos tracked', board.videosTracked.toLocaleString(), 'Hourly cached pool'],
            ['Total views', formatNumber(board.totalViews), 'Across current leaders'],
            ['Avg velocity', `${formatNumber(Math.round(board.avgVelocity))}/d`, 'Public-data proxy'],
            ['Avg engagement', `${board.avgEngagement.toFixed(2)}%`, 'Likes + comments'],
          ].map(([label, value, note]) => (
            <div key={label} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</div>
              <div className="mt-2 text-2xl font-black text-gray-950">{value}</div>
              <div className="mt-1 text-xs text-gray-500">{note}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-6 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Top signal</div>
              <h2 className="mt-1 text-2xl font-black text-gray-950">
                {topKeyword ? `#${topKeyword.keyword}` : 'No dominant keyword yet'}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                {topKeyword
                  ? `${topKeyword.count} matched videos, ${formatNumber(topKeyword.totalViews)} public views, ${formatNumber(topKeyword.avgVelocity)}/day average velocity.`
                  : 'The current snapshot has enough videos for browsing, but no strong repeated keyword cluster.'}
              </p>
            </div>
            {topKeyword && (
              <Link href={`/trends/${topKeyword.keyword}`} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700">
                Open trend
              </Link>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-500">How to use today</div>
          <div className="mt-3 space-y-3 text-sm leading-6 text-gray-600">
            <p>1. Open videos with high velocity and solid engagement.</p>
            <p>2. Add 2-5 candidates to the compare basket.</p>
            <p>3. Compare packaging, hook, audience fit, and retention proxy before copying.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Trend lanes</div>
            <h2 className="mt-1 text-2xl font-black text-gray-950">Gaming, lifestyle, music, and film opportunities.</h2>
          </div>
          <Link href="/trends" className="hidden text-sm font-bold text-red-600 hover:text-red-700 sm:inline">View all trends</Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-4">
          {topSections.map((section) => (
            <article key={section.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <h3 className="text-lg font-black text-gray-950">{section.label}</h3>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">{section.description}</p>
              <div className="mt-4 grid gap-2">
                {section.lanes.map((lane) => (
                  <Link key={lane.id} href={`/trends?category=${section.id}&lane=${lane.id}`} className="rounded-lg bg-gray-50 p-3 hover:bg-red-50">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-gray-950">{lane.label}</span>
                      <span className="text-xs font-bold text-red-600">{lane.videos.length}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">{lane.description}</p>
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Trending videos</div>
            <h2 className="mt-1 text-2xl font-black text-gray-950">Analyze or compare directly from the homepage.</h2>
          </div>
          <div className="text-sm text-gray-500">Showing top {visibleVideos.length} from the hourly snapshot.</div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleVideos.map((video, index) => (
            <TrendVideoCard key={video.id} video={video} index={index} />
          ))}
        </div>
        {visibleVideos.length === 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm leading-6 text-amber-900">
            The hourly trend snapshot is still loading or unavailable. The fixed URL input remains ready; paste a YouTube video or channel URL above to analyze directly.
            <Link href="/trending" className="ml-2 font-bold text-amber-950 underline">Open trending page</Link>
          </div>
        )}
      </section>
    </main>
  )
}
