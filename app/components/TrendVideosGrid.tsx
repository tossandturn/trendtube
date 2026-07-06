'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { getEngagementRate, getVideoAgeDays, getViewVelocity } from '@/lib/analytics'
import { REGION_META, REGIONS, type Region } from '@/lib/region'
import AddToVideoCompareButton from './AddToVideoCompareButton'

interface VideoSnippet {
  title: string
  channelTitle: string
  publishedAt?: string
  thumbnails?: {
    high?: { url: string }
    medium?: { url: string }
    default?: { url: string }
  }
}

interface VideoStatistics {
  viewCount?: string
  likeCount?: string
  commentCount?: string
}

interface Video {
  id: string
  snippet?: VideoSnippet
  statistics?: VideoStatistics
}

interface TrendVideosGridProps {
  videos: Video[]
  keyword: string
  initialRegion?: string
  showRanks?: boolean
}

type SortBy = 'views' | 'engagement' | 'velocity'
type TimeRange = 'all' | '30d' | '7d'

const INITIAL_DISPLAY_COUNT = 12
const LOAD_MORE_COUNT = 12

const SORT_OPTIONS: Array<{ value: SortBy; label: string; shortLabel: string }> = [
  { value: 'views', label: 'Views', shortLabel: 'Views' },
  { value: 'engagement', label: 'Engagement', shortLabel: 'Eng' },
  { value: 'velocity', label: 'Velocity', shortLabel: 'Velo' },
]

const TIME_OPTIONS: Array<{ value: TimeRange; label: string }> = [
  { value: 'all', label: 'All Time' },
  { value: '30d', label: '30 Days' },
  { value: '7d', label: '7 Days' },
]

function formatNumber(n: string | number | undefined): string {
  const num = typeof n === 'string' ? Number(n) : n || 0
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B'
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M'
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K'
  return Math.round(num).toLocaleString()
}

function formatVelocity(velocity: number): string {
  if (velocity >= 1_000_000) return `${(velocity / 1_000_000).toFixed(1)}M`
  if (velocity >= 1_000) return `${(velocity / 1_000).toFixed(0)}K`
  return Math.round(velocity).toLocaleString()
}

function getThumbnailUrl(video: Video): string {
  return video.snippet?.thumbnails?.medium?.url ||
    video.snippet?.thumbnails?.high?.url ||
    video.snippet?.thumbnails?.default?.url ||
    `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`
}

function getRankClass(rank: number) {
  if (rank === 1) return 'bg-yellow-400 text-yellow-950'
  if (rank === 2) return 'bg-gray-300 text-gray-950'
  if (rank === 3) return 'bg-orange-300 text-orange-950'
  return 'bg-gray-900/80 text-white'
}

export default function TrendVideosGrid({ videos, keyword, initialRegion = 'US', showRanks = false }: TrendVideosGridProps) {
  const [sortBy, setSortBy] = useState<SortBy>('views')
  const [timeRange, setTimeRange] = useState<TimeRange>('all')
  const [selectedRegion, setSelectedRegion] = useState(initialRegion)
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT)
  const [showFilters, setShowFilters] = useState(false)
  const [isSwitchingRegion, setIsSwitchingRegion] = useState(false)
  const [referenceTime] = useState(() => Date.now())

  const filteredAndSortedVideos = useMemo(() => {
    let result = [...videos]

    if (timeRange !== 'all') {
      const daysBack = timeRange === '30d' ? 30 : 7
      const cutoffTime = referenceTime - daysBack * 24 * 60 * 60 * 1000

      result = result.filter((video) => {
        const published = video.snippet?.publishedAt
        if (!published) return false
        return new Date(published).getTime() >= cutoffTime
      })
    }

    result.sort((a, b) => {
      if (sortBy === 'engagement') return getEngagementRate(b) - getEngagementRate(a)
      if (sortBy === 'velocity') return getViewVelocity(b) - getViewVelocity(a)
      return Number(b.statistics?.viewCount || 0) - Number(a.statistics?.viewCount || 0)
    })

    return result
  }, [videos, sortBy, timeRange, referenceTime])

  const displayedVideos = filteredAndSortedVideos.slice(0, displayCount)
  const hasMore = displayCount < filteredAndSortedVideos.length

  function resetDisplayCount() {
    setDisplayCount(INITIAL_DISPLAY_COUNT)
  }

  function handleSortChange(nextSort: SortBy) {
    setSortBy(nextSort)
    resetDisplayCount()
  }

  function handleTimeRangeChange(nextRange: TimeRange) {
    setTimeRange(nextRange)
    resetDisplayCount()
  }

  function handleRegionChange(nextRegion: string) {
    if (!REGIONS.includes(nextRegion as Region)) return

    setSelectedRegion(nextRegion)
    resetDisplayCount()

    if (nextRegion === initialRegion || typeof window === 'undefined') return

    setIsSwitchingRegion(true)
    const redirect = `${window.location.pathname}${window.location.search}${window.location.hash}`
    window.location.assign(`/api/switch-region?region=${encodeURIComponent(nextRegion)}&redirect=${encodeURIComponent(redirect)}`)
  }

  function clearFilters() {
    setSortBy('views')
    setTimeRange('all')
    setSelectedRegion(initialRegion)
    resetDisplayCount()
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Top Videos in This Trend
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({filteredAndSortedVideos.length} videos)
            </span>
          </h2>

          <button
            type="button"
            onClick={() => setShowFilters((current) => !current)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
            aria-expanded={showFilters}
          >
            <span>Filters</span>
            {(sortBy !== 'views' || timeRange !== 'all' || selectedRegion !== initialRegion) && (
              <span className="h-2 w-2 rounded-full bg-red-500" />
            )}
          </button>
        </div>

        {showFilters && (
          <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Sort By
                </label>
                <div className="flex gap-2">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSortChange(option.value)}
                      className={`flex-1 rounded-lg px-2 py-2 text-xs font-medium transition-all sm:px-3 sm:text-sm ${
                        sortBy === option.value
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'border border-gray-200 bg-white text-gray-700 hover:border-red-300'
                      }`}
                    >
                      <span className="hidden sm:inline">{option.label}</span>
                      <span className="sm:hidden">{option.shortLabel}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Upload Window
                </label>
                <div className="flex gap-2">
                  {TIME_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleTimeRangeChange(option.value)}
                      className={`flex-1 rounded-lg px-2 py-2 text-xs font-medium transition-all sm:px-3 sm:text-sm ${
                        timeRange === option.value
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'border border-gray-200 bg-white text-gray-700 hover:border-red-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Region
                </label>
                <select
                  value={selectedRegion}
                  onChange={(event) => handleRegionChange(event.target.value)}
                  disabled={isSwitchingRegion}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-500 disabled:cursor-wait disabled:bg-gray-100"
                >
                  {REGIONS.map((region) => (
                    <option key={region} value={region}>
                      {region} - {REGION_META[region].label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  {isSwitchingRegion ? 'Loading regional videos...' : 'Changing region reloads this trend with fresh data.'}
                </p>
              </div>
            </div>

            {(sortBy !== 'views' || timeRange !== 'all' || selectedRegion !== initialRegion) && (
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-gray-200 pt-3 sm:mt-4 sm:pt-4">
                <span className="text-xs text-gray-500">Active filters:</span>
                {sortBy !== 'views' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs text-red-700">
                    Sorted by {sortBy}
                    <button type="button" onClick={() => handleSortChange('views')} className="ml-1 hover:text-red-900">
                      x
                    </button>
                  </span>
                )}
                {timeRange !== 'all' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700">
                    Last {timeRange === '30d' ? '30 days' : '7 days'}
                    <button type="button" onClick={() => handleTimeRangeChange('all')} className="ml-1 hover:text-blue-900">
                      x
                    </button>
                  </span>
                )}
                {selectedRegion !== initialRegion && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs text-green-700">
                    {selectedRegion} region
                    <button type="button" onClick={() => setSelectedRegion(initialRegion)} className="ml-1 hover:text-green-900">
                      x
                    </button>
                  </span>
                )}
                <button
                  type="button"
                  onClick={clearFilters}
                  className="ml-2 text-xs text-gray-500 underline hover:text-red-600"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {displayedVideos.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {displayedVideos.map((video, index) => {
              const velocity = getViewVelocity(video)
              const engagement = getEngagementRate(video)
              const views = Number(video.statistics?.viewCount || 0)
              const channelTitle = video.snippet?.channelTitle || 'Unknown Channel'
              const videoAge = getVideoAgeDays(video)
              const rank = index + 1

              return (
                <div
                  key={video.id}
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-200 hover:border-red-300 hover:shadow-md"
                >
                  <Link href={`/video/${video.id}`} className="block">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={getThumbnailUrl(video)}
                        alt={video.snippet?.title || 'Video thumbnail'}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      {showRanks && (
                        <div className={`absolute left-2 top-2 rounded-lg px-2 py-1 text-xs font-bold shadow-lg ${getRankClass(rank)}`}>
                          #{rank}
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs font-medium text-white">
                        {formatNumber(views)} views
                      </div>
                      {videoAge <= 7 && (
                        <div className="absolute right-2 top-2 rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                          New
                        </div>
                      )}
                    </div>

                    <div className="p-3 pb-2 sm:p-4 sm:pb-2">
                      <h3 className="mb-1.5 line-clamp-2 text-xs font-semibold text-gray-900 transition-colors group-hover:text-red-600 sm:mb-2 sm:text-sm">
                        {video.snippet?.title || 'Untitled Video'}
                      </h3>

                      <p className="mb-2 truncate text-[10px] text-gray-500 sm:mb-3 sm:text-xs">
                        {channelTitle}
                      </p>

                      <div className="grid grid-cols-3 gap-1.5 text-[10px] sm:gap-2 sm:text-xs">
                        <div className="rounded-lg bg-gray-50 p-1.5 text-center sm:p-2">
                          <div className="mb-0.5 hidden text-gray-500 sm:block">Views</div>
                          <div className="font-bold text-gray-900">{formatNumber(views)}</div>
                        </div>
                        <div className="rounded-lg bg-gray-50 p-1.5 text-center sm:p-2">
                          <div className="mb-0.5 hidden text-gray-500 sm:block">Engage</div>
                          <div className={`font-bold ${engagement >= 5 ? 'text-green-600' : engagement >= 2 ? 'text-yellow-600' : 'text-gray-900'}`}>
                            {engagement.toFixed(1)}%
                          </div>
                        </div>
                        <div className="rounded-lg bg-gray-50 p-1.5 text-center sm:p-2">
                          <div className="mb-0.5 hidden text-gray-500 sm:block">Vel</div>
                          <div className={`font-bold ${velocity >= 100000 ? 'text-red-600' : velocity >= 10000 ? 'text-orange-600' : 'text-gray-900'}`}>
                            {formatVelocity(velocity)}
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center gap-2 sm:mt-3">
                        <div className="h-1 flex-1 overflow-hidden rounded-full bg-gray-200 sm:h-1.5">
                          <div
                            className={`h-full rounded-full transition-all ${
                              engagement >= 5 ? 'w-full bg-green-500' :
                              engagement >= 3 ? 'w-3/4 bg-yellow-500' :
                              engagement >= 1 ? 'w-1/2 bg-orange-400' :
                              'w-1/4 bg-gray-400'
                            }`}
                          />
                        </div>
                        <span className="text-[8px] font-medium uppercase text-gray-500 sm:text-[10px]">
                          {engagement >= 5 ? 'High' : engagement >= 3 ? 'Good' : engagement >= 1 ? 'Avg' : 'Low'}
                        </span>
                      </div>
                    </div>
                  </Link>
                  <div className="px-3 pb-3 sm:px-4 sm:pb-4">
                    <AddToVideoCompareButton
                      videoId={video.id}
                      title={video.snippet?.title}
                      channelTitle={channelTitle}
                      thumbnailUrl={video.snippet?.thumbnails?.medium?.url || video.snippet?.thumbnails?.high?.url || `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`}
                      sourceLabel="Trend detail"
                      compact
                      fullWidth
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {hasMore && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setDisplayCount((current) => Math.min(current + LOAD_MORE_COUNT, filteredAndSortedVideos.length))}
                className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 font-medium text-white shadow-sm transition-colors hover:bg-gray-800 hover:shadow-md"
              >
                Load More Videos
                <span className="text-sm text-gray-400">
                  ({Math.min(LOAD_MORE_COUNT, filteredAndSortedVideos.length - displayCount)} more)
                </span>
              </button>
              <p className="mt-2 text-sm text-gray-500">
                Showing {displayedVideos.length} of {filteredAndSortedVideos.length} videos
              </p>
            </div>
          )}

          {!hasMore && filteredAndSortedVideos.length > INITIAL_DISPLAY_COUNT && (
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                You have seen all {filteredAndSortedVideos.length} videos in this trend
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-gray-50 py-12 text-center">
          <div className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-400">No matches</div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">No videos found</h3>
          <p className="mb-4 text-gray-500">
            No videos match your current filters for &quot;{keyword}&quot;.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}
