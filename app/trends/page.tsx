import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Breadcrumbs } from '@/app/components/Breadcrumbs'
import AddToVideoCompareButton from '@/app/components/AddToVideoCompareButton'
import { getRegion } from '@/lib/region-server'
import { getCachedTrendBoard, type TrendBoardVideo } from '@/lib/trend-board'
import { REGION_META, REGIONS } from '@/lib/region'
import { TREND_REFRESH_CADENCE, formatSnapshotTimestamp, trendFreshnessCopy } from '@/lib/data-freshness'

const TREND_REGIONS = REGIONS.filter((region) => region !== 'GLOBAL')

function formatCompactNumber(value: number) {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return Math.round(value).toLocaleString()
}

function formatVelocity(value: number) {
  return `${formatCompactNumber(value)}/day`
}

function scoreFor(item: TrendBoardVideo, lane: string) {
  if (lane === 'niche') return item.nicheScore
  if (lane === 'creative') return item.creativeScore
  return item.viralScore
}

export async function generateMetadata(): Promise<Metadata> {
  const region = await getRegion()
  const regionLabel = REGION_META[region].label

  return {
    title: `${regionLabel} Viral Content Board | Hourly YouTube Snapshot`,
    description: `Hourly YouTube trend board for ${regionLabel}: gaming, lifestyle, music, and film viral opportunities, niches, and creative formats.`,
  }
}

function VideoOpportunityCard({ item, lane }: { item: TrendBoardVideo; lane: string }) {
  const video = item.video
  const thumbnail = video.snippet?.thumbnails?.medium?.url
    || video.snippet?.thumbnails?.high?.url
    || `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <Link href={`/video/${video.id}`} className="group block">
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          <Image
            src={thumbnail}
            alt={video.snippet?.title || 'YouTube video thumbnail'}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            unoptimized
            className="object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute left-2 top-2 rounded-md bg-black/75 px-2 py-1 text-[10px] font-bold text-white">
            {item.categoryLabel}
          </div>
          <div className="absolute right-2 top-2 rounded-md bg-white/95 px-2 py-1 text-[10px] font-bold text-gray-900">
            {scoreFor(item, lane)}
          </div>
        </div>
      </Link>

      <div className="space-y-3 p-3">
        <div>
          <Link href={`/video/${video.id}`} className="group">
            <h3 className="line-clamp-2 text-sm font-bold leading-snug text-gray-900 group-hover:text-red-600">
              {video.snippet?.title || 'Untitled video'}
            </h3>
          </Link>
          <p className="mt-1 truncate text-xs text-gray-500">{video.snippet?.channelTitle || 'Unknown channel'}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-md bg-gray-50 p-2">
            <div className="text-[10px] font-bold text-gray-400">Views</div>
            <div className="text-xs font-bold text-gray-900">{formatCompactNumber(item.views)}</div>
          </div>
          <div className="rounded-md bg-gray-50 p-2">
            <div className="text-[10px] font-bold text-gray-400">Velocity</div>
            <div className="text-xs font-bold text-green-700">{formatVelocity(item.velocity)}</div>
          </div>
          <div className="rounded-md bg-gray-50 p-2">
            <div className="text-[10px] font-bold text-gray-400">Engage</div>
            <div className="text-xs font-bold text-amber-700">{item.engagement.toFixed(1)}%</div>
          </div>
        </div>

        <div className="rounded-md bg-gray-50 p-2">
          <div className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Analyst read</div>
          <p className="mt-1 line-clamp-2 text-xs text-gray-600">
            {item.decision}: {item.format}. Topic signal: {item.topic}.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/video/${video.id}`}
            className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-3 py-2 text-xs font-bold text-white hover:bg-gray-800"
          >
            Analyze
          </Link>
          <AddToVideoCompareButton
            videoId={video.id}
            title={video.snippet?.title}
            channelTitle={video.snippet?.channelTitle}
            thumbnailUrl={thumbnail}
            sourceLabel={`${item.categoryLabel} ${lane}`}
            compact
            fullWidth
          />
        </div>
      </div>
    </div>
  )
}

export default async function TrendsPage() {
  const region = await getRegion()
  const board = await getCachedTrendBoard(region)
  const regionLabel = REGION_META[region].label
  const updatedAt = formatSnapshotTimestamp(board.generatedAt)

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Trends' }]} />
      </div>

      <section className="py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-red-600">Hourly content board</div>
              <h1 className="max-w-3xl text-3xl font-black tracking-tight text-gray-900 sm:text-5xl">
                {regionLabel} viral opportunities by content vertical
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                Videos are grouped by actual content signals into Gaming, Lifestyle, Music, and Film & TV. Each vertical is split into Viral, Niche, and Creative Minds so you can pick what to analyze or compare next.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase tracking-wide text-gray-500">Region</span>
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                  {TREND_REFRESH_CADENCE}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {TREND_REGIONS.map((r) => (
                  <Link
                    key={r}
                    href={`/api/switch-region?region=${r}&redirect=/trends`}
                    className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                      region === r
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {r}
                  </Link>
                ))}
              </div>
              <p className="mt-3 text-xs text-gray-500">
                {trendFreshnessCopy(board.generatedAt)} Later users see the same snapshot until the next hourly refresh.
              </p>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-wide text-gray-400">Snapshot built {updatedAt}</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Videos tracked</p>
              <p className="mt-1 text-2xl font-black text-gray-900">{board.videosTracked}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Total views</p>
              <p className="mt-1 text-2xl font-black text-gray-900">{formatCompactNumber(board.totalViews)}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Avg velocity</p>
              <p className="mt-1 text-2xl font-black text-green-700">{formatVelocity(board.avgVelocity)}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Avg engagement</p>
              <p className="mt-1 text-2xl font-black text-amber-700">{board.avgEngagement.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
          {board.sections.map((section) => (
            <div key={section.id} className="rounded-lg border border-gray-200 bg-white">
              <div className="border-b border-gray-100 p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-black text-gray-900">{section.label}</h2>
                    <p className="mt-1 max-w-3xl text-sm text-gray-600">{section.description}</p>
                  </div>
                  <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                    {section.videos.length} videos
                  </div>
                </div>
              </div>

              <div className="grid gap-0 lg:grid-cols-3">
                {section.lanes.map((lane) => (
                  <div key={lane.id} className="border-t border-gray-100 p-4 lg:border-l lg:border-t-0 first:lg:border-l-0">
                    <div className="mb-4 min-h-[76px]">
                      <h3 className="text-sm font-black uppercase tracking-wide text-gray-900">{lane.label}</h3>
                      <p className="mt-1 text-xs leading-5 text-gray-500">{lane.description}</p>
                    </div>

                    {lane.videos.length > 0 ? (
                      <div className="space-y-3">
                        {lane.videos.map((item) => (
                          <VideoOpportunityCard key={`${lane.id}-${item.video.id}`} item={item} lane={lane.id} />
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
                        No strong signal in this lane yet. It will fill on the next hourly board when enough videos match.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {board.sections.length === 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
              <h2 className="text-lg font-bold text-gray-900">No board data yet</h2>
              <p className="mt-2 text-sm text-gray-600">The hourly board could not find usable videos. Try another region or check back after the next refresh.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
