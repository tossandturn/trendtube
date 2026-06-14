'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { getViewVelocity, getEngagementRate, getVideoAgeDays } from '@/lib/analytics'

/* =========================================================
   TYPES
========================================================= */

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

/* =========================================================
   CONSTANTS
========================================================= */

const REGIONS = [
  { code: 'US', label: 'United States', flag: '🇺🇸' },
  { code: 'GB', label: 'United Kingdom', flag: '🇬🇧' },
  { code: 'JP', label: 'Japan', flag: '🇯🇵' },
  { code: 'KR', label: 'South Korea', flag: '🇰🇷' },
  { code: 'HK', label: 'Hong Kong', flag: '🇭🇰' },
  { code: 'TW', label: 'Taiwan', flag: '🇹🇼' },
  { code: 'CA', label: 'Canada', flag: '🇨🇦' },
  { code: 'AU', label: 'Australia', flag: '🇦🇺' },
  { code: 'DE', label: 'Germany', flag: '🇩🇪' },
  { code: 'FR', label: 'France', flag: '🇫🇷' },
  { code: 'IN', label: 'India', flag: '🇮🇳' },
  { code: 'BR', label: 'Brazil', flag: '🇧🇷' },
]

const INITIAL_DISPLAY_COUNT = 12
const LOAD_MORE_COUNT = 12

/* =========================================================
   HELPERS
========================================================= */

function formatNumber(n: string | number | undefined): string {
  const num = typeof n === 'string' ? Number(n) : n || 0
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B'
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M'
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K'
  return Math.round(num).toLocaleString()
}

function formatVelocity(velocity: number): string {
  if (velocity >= 1_000_000) return (velocity / 1_000_000).toFixed(1) + 'M'
  if (velocity >= 1_000) return (velocity / 1_000).toFixed(0) + 'K'
  return Math.round(velocity).toLocaleString()
}

function getThumbnailUrl(video: Video): string {
  return video.snippet?.thumbnails?.medium?.url ||
         video.snippet?.thumbnails?.high?.url ||
         video.snippet?.thumbnails?.default?.url ||
         `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`
}

/* =========================================================
   COMPONENT
========================================================= */

export default function TrendVideosGrid({ videos, keyword, initialRegion = 'US', showRanks = false }: TrendVideosGridProps) {
  const [sortBy, setSortBy] = useState<SortBy>('views')
  const [timeRange, setTimeRange] = useState<TimeRange>('all')
  const [selectedRegion, setSelectedRegion] = useState(initialRegion)
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT)
  const [showFilters, setShowFilters] = useState(false)

  // Filter and sort videos
  const filteredAndSortedVideos = useMemo(() => {
    let result = [...videos]

    // Apply time range filter
    if (timeRange !== 'all') {
      const now = Date.now()
      const daysBack = timeRange === '30d' ? 30 : 7
      const cutoffTime = now - daysBack * 24 * 60 * 60 * 1000

      result = result.filter((video) => {
        const published = video.snippet?.publishedAt
        if (!published) return false
        return new Date(published).getTime() >= cutoffTime
      })
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'views':
          return Number(b.statistics?.viewCount || 0) - Number(a.statistics?.viewCount || 0)
        case 'engagement':
          return getEngagementRate(b) - getEngagementRate(a)
        case 'velocity':
          return getViewVelocity(b) - getViewVelocity(a)
        default:
          return 0
      }
    })

    return result
  }, [videos, sortBy, timeRange])

  // Get currently displayed videos
  const displayedVideos = filteredAndSortedVideos.slice(0, displayCount)
  const hasMore = displayCount < filteredAndSortedVideos.length

  // Handle load more
  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + LOAD_MORE_COUNT, filteredAndSortedVideos.length))
  }

  // Handle region change - this would typically trigger a refetch
  const handleRegionChange = (region: string) => {
    setSelectedRegion(region)
    // Reset display count when region changes
    setDisplayCount(INITIAL_DISPLAY_COUNT)
    // Note: In a real implementation, you might want to trigger a refetch here
    // or pass the region change up to the parent component
  }

  return (
    <div className="w-full">
      {/* Header with Filters */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Top Videos in This Trend
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({filteredAndSortedVideos.length} videos)
            </span>
          </h2>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
            {(sortBy !== 'views' || timeRange !== 'all' || selectedRegion !== initialRegion) && (
              <span className="ml-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200 mb-4 animate-in slide-in-from-top-2">
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {/* Sort By */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Sort By
                </label>
                <div className="flex gap-2">
                  {[
                    { value: 'views', label: 'Views', icon: '👁️' },
                    { value: 'engagement', label: 'Engagement', icon: '💬' },
                    { value: 'velocity', label: 'Velocity', icon: '⚡' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value as SortBy)}
                      className={`flex-1 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                        sortBy === option.value
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-red-300'
                      }`}
                    >
                      <span className="mr-1">{option.icon}</span>
                      <span className="hidden sm:inline">{option.label}</span>
                      <span className="sm:hidden">{option.label.slice(0, 4)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Range */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Time Range
                </label>
                <div className="flex gap-2">
                  {[
                    { value: 'all', label: 'All Time' },
                    { value: '30d', label: '30 Days' },
                    { value: '7d', label: '7 Days' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTimeRange(option.value as TimeRange)}
                      className={`flex-1 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                        timeRange === option.value
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-red-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Region Selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Region
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => handleRegionChange(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  {REGIONS.map((region) => (
                    <option key={region.code} value={region.code}>
                      {region.flag} {region.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters Summary */}
            {(sortBy !== 'views' || timeRange !== 'all' || selectedRegion !== initialRegion) && (
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-500">Active filters:</span>
                {sortBy !== 'views' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 text-xs rounded-full">
                    Sorted by {sortBy}
                    <button
                      onClick={() => setSortBy('views')}
                      className="ml-1 hover:text-red-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {timeRange !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                    Last {timeRange === '30d' ? '30 days' : '7 days'}
                    <button
                      onClick={() => setTimeRange('all')}
                      className="ml-1 hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedRegion !== initialRegion && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                    {REGIONS.find(r => r.code === selectedRegion)?.flag} {selectedRegion}
                    <button
                      onClick={() => setSelectedRegion(initialRegion)}
                      className="ml-1 hover:text-green-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSortBy('views')
                    setTimeRange('all')
                    setSelectedRegion(initialRegion)
                  }}
                  className="text-xs text-gray-500 hover:text-red-600 underline ml-2"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Videos Grid */}
      {displayedVideos.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedVideos.map((video, index) => {
              const velocity = getViewVelocity(video)
              const engagement = getEngagementRate(video)
              const views = Number(video.statistics?.viewCount || 0)
              const channelTitle = video.snippet?.channelTitle || 'Unknown Channel'
              const videoAge = getVideoAgeDays(video)
              const rank = index + 1

              return (
                <Link
                  key={video.id}
                  href={`/video/${video.id}`}
                  className="group block bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-red-300 hover:shadow-md transition-all duration-200"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={getThumbnailUrl(video)}
                      alt={video.snippet?.title || 'Video thumbnail'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {/* Rank Badge */}
                    {showRanks && (
                      <div className={`absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-bold shadow-lg ${
                        rank === 1
                          ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900'
                          : rank === 2
                          ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900'
                          : rank === 3
                          ? 'bg-gradient-to-r from-orange-300 to-orange-400 text-orange-900'
                          : 'bg-gray-900/80 text-white'
                      }`}>
                        #{rank}
                      </div>
                    )}
                    {/* View count overlay */}
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                      {formatNumber(views)} views
                    </div>
                    {/* Age badge for recent videos */}
                    {videoAge <= 7 && (
                      <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
                        NEW
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4">
                    {/* Title */}
                    <h3 className="font-semibold text-xs sm:text-sm text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors mb-1.5 sm:mb-2">
                      {video.snippet?.title || 'Untitled Video'}
                    </h3>

                    {/* Channel */}
                    <p className="text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-3 truncate">
                      {channelTitle}
                    </p>

                    {/* Stats Grid - Mobile: Simpler layout */}
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
                      <div className="bg-gray-50 rounded-lg p-1.5 sm:p-2 text-center">
                        <div className="text-gray-500 mb-0.5 hidden sm:block">Views</div>
                        <div className="font-bold text-gray-900">{formatNumber(views)}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-1.5 sm:p-2 text-center">
                        <div className="text-gray-500 mb-0.5 hidden sm:block">Engage</div>
                        <div className={`font-bold ${engagement >= 5 ? 'text-green-600' : engagement >= 2 ? 'text-yellow-600' : 'text-gray-900'}`}>
                          {engagement.toFixed(1)}%
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-1.5 sm:p-2 text-center">
                        <div className="text-gray-500 mb-0.5 hidden sm:block">Vel</div>
                        <div className={`font-bold ${velocity >= 100000 ? 'text-red-600' : velocity >= 10000 ? 'text-orange-600' : 'text-gray-900'}`}>
                          {formatVelocity(velocity)}
                        </div>
                      </div>
                    </div>

                    {/* Performance indicator - Simplified on mobile */}
                    <div className="mt-2 sm:mt-3 flex items-center gap-2">
                      <div className="flex-1 h-1 sm:h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            engagement >= 5 ? 'bg-green-500 w-full' :
                            engagement >= 3 ? 'bg-yellow-500 w-3/4' :
                            engagement >= 1 ? 'bg-orange-400 w-1/2' :
                            'bg-gray-400 w-1/4'
                          }`}
                        />
                      </div>
                      <span className="text-[8px] sm:text-[10px] font-medium text-gray-500 uppercase">
                        {engagement >= 5 ? 'High' : engagement >= 3 ? 'Good' : engagement >= 1 ? 'Avg' : 'Low'}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={handleLoadMore}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Load More Videos
                <span className="text-gray-400 text-sm">
                  ({Math.min(LOAD_MORE_COUNT, filteredAndSortedVideos.length - displayCount)} more)
                </span>
              </button>
              <p className="mt-2 text-sm text-gray-500">
                Showing {displayedVideos.length} of {filteredAndSortedVideos.length} videos
              </p>
            </div>
          )}

          {/* End of list message */}
          {!hasMore && filteredAndSortedVideos.length > INITIAL_DISPLAY_COUNT && (
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                You've seen all {filteredAndSortedVideos.length} videos in this trend
              </p>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <div className="text-4xl mb-3">📭</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No videos found</h3>
          <p className="text-gray-500 mb-4">
            No videos match your current filters for "{keyword}".
          </p>
          <button
            onClick={() => {
              setSortBy('views')
              setTimeRange('all')
              setSelectedRegion(initialRegion)
              setDisplayCount(INITIAL_DISPLAY_COUNT)
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}
