'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import VideoCompareCard from './VideoCompareCard'
import VideoCompareMetrics from './VideoCompareMetrics'

interface VideoCompareViewProps {
  leftId: string
  rightId: string
}

function getVideoWinnerSummary(leftVideo: any, rightVideo: any) {
  const leftViews = Number(leftVideo?.statistics?.viewCount || 0)
  const rightViews = Number(rightVideo?.statistics?.viewCount || 0)
  const leftLikes = Number(leftVideo?.statistics?.likeCount || 0)
  const rightLikes = Number(rightVideo?.statistics?.likeCount || 0)
  const leftComments = Number(leftVideo?.statistics?.commentCount || 0)
  const rightComments = Number(rightVideo?.statistics?.commentCount || 0)

  const getEngagement = (views: number, likes: number, comments: number) => {
    if (!views) return 0
    return ((likes + comments * 2) / views) * 100
  }

  const leftEngagement = getEngagement(leftViews, leftLikes, leftComments)
  const rightEngagement = getEngagement(rightViews, rightLikes, rightComments)
  const leftLikeRate = leftViews ? (leftLikes / leftViews) * 100 : 0
  const rightLikeRate = rightViews ? (rightLikes / rightViews) * 100 : 0

  const reachWinner = leftViews >= rightViews ? 'A' : 'B'
  const engagementWinner = leftEngagement >= rightEngagement ? 'A' : 'B'
  const packagingWinner = leftLikeRate >= rightLikeRate ? 'A' : 'B'

  const aWins = [reachWinner, engagementWinner, packagingWinner].filter(v => v === 'A').length
  const bWins = 3 - aWins
  const overallWinner = aWins === bWins ? 'Tie' : aWins > bWins ? 'Video A' : 'Video B'

  let recommendation = 'Use this comparison to decide which packaging and audience response pattern is more worth testing.'
  if (overallWinner === 'Video A') {
    recommendation = engagementWinner === 'A'
      ? 'Video A is the better benchmark if you want stronger audience response, not just more exposure.'
      : 'Video A wins on overall result, but separate raw reach from replicable strategy before copying it.'
  }
  if (overallWinner === 'Video B') {
    recommendation = packagingWinner === 'B'
      ? 'Video B likely has the stronger title-thumbnail conversion pattern and is worth studying for packaging ideas.'
      : 'Video B wins overall, but compare format and timing before using it as your main template.'
  }

  return {
    overallWinner,
    reachWinner: reachWinner === 'A' ? leftVideo?.snippet?.title || 'Video A' : rightVideo?.snippet?.title || 'Video B',
    engagementWinner: engagementWinner === 'A' ? leftVideo?.snippet?.title || 'Video A' : rightVideo?.snippet?.title || 'Video B',
    packagingWinner: packagingWinner === 'A' ? leftVideo?.snippet?.title || 'Video A' : rightVideo?.snippet?.title || 'Video B',
    recommendation,
  }
}

export default function VideoCompareView({ leftId, rightId }: VideoCompareViewProps) {
  const [leftVideo, setLeftVideo] = useState<any>(null)
  const [rightVideo, setRightVideo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)

      try {
        const [leftRes, rightRes] = await Promise.all([
          fetch(`/api/analyze?type=video&id=${encodeURIComponent(leftId)}`),
          fetch(`/api/analyze?type=video&id=${encodeURIComponent(rightId)}`)
        ])

        if (!leftRes.ok) throw new Error('We could not load Video A. Check the URL or video ID and try again.')
        if (!rightRes.ok) throw new Error('We could not load Video B. Check the URL or video ID and try again.')

        const leftData = await leftRes.json()
        const rightData = await rightRes.json()

        setLeftVideo(leftData.video)
        setRightVideo(rightData.video)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong while comparing these videos. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [leftId, rightId])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="text-sm font-medium text-gray-500 mb-2">Preparing comparison</div>
          <div className="space-y-2 text-sm text-gray-600">
            <div>• Fetching video stats</div>
            <div>• Comparing packaging and engagement</div>
            <div>• Generating winner summary</div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-8 animate-pulse">
            <div className="h-40 bg-gray-100 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-100 rounded w-1/2"></div>
          </div>
          <div className="bg-white rounded-xl p-8 animate-pulse">
            <div className="h-40 bg-gray-100 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-100 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <div className="text-4xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-red-900 mb-2">Comparison unavailable</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <div className="text-sm text-red-800 mb-5">
            Try a public YouTube video URL or a raw 11-character video ID.
          </div>
          <Link
            href={`/compare-new?type=videos`}
            className="inline-block px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition"
          >
            Edit Inputs
          </Link>
        </div>
      </div>
    )
  }

  const summary = getVideoWinnerSummary(leftVideo, rightVideo)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href={`/compare-new?type=videos`} className="text-gray-500 hover:text-gray-900">
            ← Edit Comparison
          </Link>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Video Comparison</h2>
        <p className="text-gray-500">Compare reach, engagement, and packaging efficiency side by side.</p>
      </div>

      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6 mb-8">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">Summary verdict</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{summary.overallWinner} shows the stronger overall performance pattern</h3>
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-xl p-4 border border-amber-100">
            <div className="text-xs text-gray-500 mb-1">Reach winner</div>
            <div className="font-semibold text-gray-900 line-clamp-2">{summary.reachWinner}</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-amber-100">
            <div className="text-xs text-gray-500 mb-1">Engagement winner</div>
            <div className="font-semibold text-gray-900 line-clamp-2">{summary.engagementWinner}</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-amber-100">
            <div className="text-xs text-gray-500 mb-1">Packaging winner</div>
            <div className="font-semibold text-gray-900 line-clamp-2">{summary.packagingWinner}</div>
          </div>
        </div>
        <p className="text-sm text-gray-700">{summary.recommendation}</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        {leftVideo?.id && (
          <Link
            href={`/video/${leftVideo.id}`}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition"
          >
            Open Video A Analysis
          </Link>
        )}
        {rightVideo?.id && (
          <Link
            href={`/video/${rightVideo.id}`}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition"
          >
            Open Video B Analysis
          </Link>
        )}
        <Link
          href="/compare-new?type=videos"
          className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
        >
          Compare Another Pair
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <VideoCompareCard video={leftVideo} label="Video A" color="blue" />
        <VideoCompareCard video={rightVideo} label="Video B" color="red" />
      </div>

      {leftVideo && rightVideo && (
        <VideoCompareMetrics leftVideo={leftVideo} rightVideo={rightVideo} />
      )}
    </div>
  )
}
