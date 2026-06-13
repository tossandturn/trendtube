'use client'

import React, { useState, useMemo } from 'react'

/* ── Types ──────────────────────────────────────────────────────────── */

interface VideoData {
  id: string
  snippet?: {
    title?: string
    description?: string
    publishedAt?: string
    thumbnails?: Record<string, { url: string }>
    tags?: string[]
  }
  statistics?: {
    viewCount?: string
    likeCount?: string
    commentCount?: string
  }
  interestScore: number
  intelligence?: {
    successFactors?: Array<{
      factor: string
      impact: 'high' | 'medium' | 'low'
    }>
  }
}

type SortKey = 'relevance' | 'date' | 'views' | 'engagement'
type ScoreThreshold = 'all' | 'strong' | 'good' | 'partial'

interface InterestVideoListProps {
  videos: VideoData[]
  interestKey: string
  interestIcon: string
  config: {
    icon: string
    color: string
    bg: string
    border: string
    text: string
    keywords: string[]
    description: string
  }
}

/* ── Constants ──────────────────────────────────────────────────────── */

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'relevance', label: 'Relevance' },
  { key: 'date', label: 'Latest' },
  { key: 'views', label: 'Views' },
  { key: 'engagement', label: 'Engagement' },
]

const SCORE_OPTIONS: { key: ScoreThreshold; label: string; min: number }[] = [
  { key: 'all', label: 'All', min: 0 },
  { key: 'strong', label: 'Strong ≥80', min: 80 },
  { key: 'good', label: 'Good ≥50', min: 50 },
  { key: 'partial', label: 'Partial ≥25', min: 25 },
]

const PAGE_SIZE = 20

/* ── Helpers ────────────────────────────────────────────────────────── */

function formatNumber(n: string | number | undefined): string {
  const num = Number(n || 0)
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B'
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M'
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K'
  return num.toLocaleString()
}

function formatDate(d: string | undefined): string {
  if (!d) return 'Unknown'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function calcEngagement(video: VideoData): number {
  const views = Number(video.statistics?.viewCount || 0)
  const likes = Number(video.statistics?.likeCount || 0)
  const comments = Number(video.statistics?.commentCount || 0)
  if (views === 0) return 0
  return ((likes + comments * 2) / views) * 100
}

function scoreColor(s: number): string {
  if (s >= 80) return 'text-green-600'
  if (s >= 60) return 'text-yellow-600'
  if (s >= 40) return 'text-orange-600'
  return 'text-red-600'
}

function matchBadge(s: number) {
  if (s >= 80) return { label: 'Strong Match', cls: 'bg-green-100 text-green-700 border-green-200' }
  if (s >= 50) return { label: 'Good Match', cls: 'bg-yellow-100 text-yellow-700 border-yellow-200' }
  if (s >= 25) return { label: 'Partial Match', cls: 'bg-orange-100 text-orange-700 border-orange-200' }
  return { label: 'Weak Match', cls: 'bg-gray-100 text-gray-500 border-gray-200' }
}

/* ── Pagination Component ───────────────────────────────────────────── */

function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
}) {
  if (totalPages <= 1) return null

  const start = (currentPage - 1) * pageSize + 1
  const end = Math.min(currentPage * pageSize, totalItems)

  // Build page numbers array (show at most 7 pages with ellipsis)
  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    const pages: (number | '...')[] = []
    if (currentPage <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(totalPages)
    } else if (currentPage >= totalPages - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
      <p className="text-sm text-gray-500">
        Showing <span className="font-medium text-gray-900">{start}–{end}</span> of{' '}
        <span className="font-medium text-gray-900">{totalItems}</span> videos
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          ← Prev
        </button>
        {getPageNumbers().map((page, i) =>
          page === '...' ? (
            <span key={`ellipsis-${i}`} className="px-2 py-1.5 text-sm text-gray-400">
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`min-w-[36px] px-2 py-1.5 text-sm rounded-lg border transition-colors ${
                page === currentPage
                  ? 'bg-blue-100 text-blue-700 border-blue-300 font-medium'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  )
}

/* ── Video Card ─────────────────────────────────────────────────────── */

function VideoCard({
  video,
  index,
  interestKey,
}: {
  video: VideoData
  index: number
  interestKey: string
}) {
  const eng = calcEngagement(video)
  const badge = matchBadge(video.interestScore)

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <div className="relative sm:w-64 flex-shrink-0">
          <div className="aspect-video bg-gray-100">
            {video.snippet?.thumbnails?.medium?.url ? (
              <img
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">🎬</div>
            )}
          </div>
          <div className="absolute top-2 left-2 bg-black/80 text-white rounded-lg px-2 py-1 text-xs font-bold">
            #{index}
          </div>
        </div>
        <div className="flex-1 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base sm:text-lg line-clamp-2 mb-1">
                <a
                  href={`https://youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors"
                >
                  {video.snippet?.title}
                </a>
              </h3>
              <p className="text-xs text-gray-400">{formatDate(video.snippet?.publishedAt)}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className={`text-2xl font-extrabold ${scoreColor(video.interestScore)}`}>
                {video.interestScore}
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${badge.cls}`}>
                {badge.label}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-500 mb-3">
            <span>👁️ {formatNumber(video.statistics?.viewCount)} views</span>
            <span>👍 {formatNumber(video.statistics?.likeCount)} likes</span>
            <span>💬 {formatNumber(video.statistics?.commentCount)} comments</span>
            <span>📊 {eng.toFixed(1)}% engagement</span>
          </div>
          {video.intelligence && video.intelligence.successFactors && video.intelligence.successFactors.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {video.intelligence.successFactors.slice(0, 3).map((f, i) => (
                <span
                  key={i}
                  className={`text-[10px] px-2 py-1 rounded-full border ${
                    f.impact === 'high'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : f.impact === 'medium'
                        ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        : 'bg-gray-50 text-gray-500 border-gray-200'
                  }`}
                >
                  {f.factor}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Main Filter Component ──────────────────────────────────────────── */

export default function InterestVideoList({
  videos,
  interestKey,
  interestIcon,
  config,
}: InterestVideoListProps) {
  const [sort, setSort] = useState<SortKey>('relevance')
  const [search, setSearch] = useState('')
  const [threshold, setThreshold] = useState<ScoreThreshold>('all')
  const [page, setPage] = useState(1)

  const thresholdMin = SCORE_OPTIONS.find((o) => o.key === threshold)!.min

  // ── Filter + Sort + Paginate (all client-side) ──────────────────────
  const { filtered, paged, totalPages, totalFiltered } = useMemo(() => {
    // 1. Filter by score threshold
    let result = videos.filter((v) => v.interestScore >= thresholdMin)

    // 2. Filter by search keyword
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter((v) => {
        const title = (v.snippet?.title || '').toLowerCase()
        const desc = (v.snippet?.description || '').toLowerCase()
        return title.includes(q) || desc.includes(q)
      })
    }

    // 3. Sort
    result = [...result].sort((a, b) => {
      switch (sort) {
        case 'relevance':
          return b.interestScore - a.interestScore
        case 'date':
          return (
            new Date(b.snippet?.publishedAt || 0).getTime() -
            new Date(a.snippet?.publishedAt || 0).getTime()
          )
        case 'views':
          return Number(b.statistics?.viewCount || 0) - Number(a.statistics?.viewCount || 0)
        case 'engagement':
          return calcEngagement(b) - calcEngagement(a)
        default:
          return 0
      }
    })

    const totalFiltered = result.length
    const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE))

    // Reset page when filters change
    const safePage = Math.min(page, totalPages)
    const paged = result.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

    return { filtered: result, paged, totalPages, totalFiltered }
  }, [videos, sort, search, thresholdMin, page])

  // Reset page when filters change
  const handleSort = (key: SortKey) => {
    setSort(key)
    setPage(1)
  }
  const handleThreshold = (key: ScoreThreshold) => {
    setThreshold(key)
    setPage(1)
  }
  const handleSearchChange = (val: string) => {
    setSearch(val)
    setPage(1)
  }
  const clearFilters = () => {
    setSearch('')
    setThreshold('all')
    setSort('relevance')
    setPage(1)
  }

  const hasActiveFilters = search.trim() !== '' || threshold !== 'all' || sort !== 'relevance'

  return (
    <div>
      {/* ── Filter Bar ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col gap-4">
          {/* Row 1: Sort + Search */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Sort buttons */}
            <div className="flex flex-wrap gap-1.5">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => handleSort(opt.key)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                    sort === opt.key
                      ? 'bg-blue-100 text-blue-700 border-blue-300'
                      : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200 hover:text-gray-700'
                  }`}
                >
                  {opt.key === 'relevance' && '🎯 '}
                  {opt.key === 'date' && '📅 '}
                  {opt.key === 'views' && '👁️ '}
                  {opt.key === 'engagement' && '📊 '}
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Search input */}
            <div className="relative flex-1 min-w-0 sm:max-w-xs">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search videos..."
                className="w-full border border-gray-200 rounded-lg pl-9 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all"
              />
              {search && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-0.5"
                  aria-label="Clear search"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Row 2: Score Threshold + Clear */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Match:</span>
            {SCORE_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => handleThreshold(opt.key)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all border ${
                  threshold === opt.key
                    ? 'bg-blue-100 text-blue-700 border-blue-300'
                    : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200 hover:text-gray-700'
                }`}
              >
                {opt.label}
              </button>
            ))}

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="ml-auto px-3 py-1 rounded-lg text-sm font-medium text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 transition-colors"
              >
                ✕ Clear filters
              </button>
            )}
          </div>

          {/* Results count */}
          {totalFiltered !== videos.length && (
            <p className="text-xs text-gray-400">
              Showing {totalFiltered} of {videos.length} videos
            </p>
          )}
        </div>
      </div>

      {/* ── Video List ──────────────────────────────────────────────── */}
      {paged.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-xl font-semibold mb-2">No videos match your filters</p>
          <p className="text-gray-500 mb-4">
            Try adjusting your search, sort, or match threshold settings.
          </p>
          <button
            onClick={clearFilters}
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {paged.map((video, i) => (
              <VideoCard
                key={video.id || i}
                video={video}
                index={(page - 1) * PAGE_SIZE + i + 1}
                interestKey={interestKey}
              />
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalFiltered}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  )
}
