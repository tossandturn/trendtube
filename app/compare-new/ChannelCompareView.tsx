'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ChannelCompareCard from './ChannelCompareCard'
import ChannelCompareMetrics from './ChannelCompareMetrics'

interface ChannelCompareViewProps {
  leftId: string
  rightId: string
}

function inferCommercialFit(videos: any[]) {
  const text = videos.map(v => `${v.snippet?.title || ''} ${v.snippet?.description || ''}`).join(' ').toLowerCase()
  if (/finance|business|software|saas|marketing|tools|productivity/.test(text)) return 'High'
  if (/gaming|tutorial|education|tech|review/.test(text)) return 'Medium'
  return 'Low'
}

function inferBrandSafety(videos: any[]) {
  const text = videos.map(v => `${v.snippet?.title || ''} ${v.snippet?.description || ''}`).join(' ').toLowerCase()
  if (/violence|fight|nsfw|18\+|drama|exposed|scandal/.test(text)) return 'Higher risk'
  if (/prank|reaction|challenge|roast/.test(text)) return 'Moderate risk'
  return 'Brand friendly'
}

function inferAudienceOverlap(leftVideos: any[], rightVideos: any[]) {
  const normalize = (videos: any[]) => videos
    .flatMap(v => (v.snippet?.title || '').toLowerCase().split(/\s+/))
    .map((w: string) => w.replace(/[^a-z0-9]/g, ''))
    .filter((w: string) => w.length > 3)

  const leftSet = new Set(normalize(leftVideos))
  const rightSet = new Set(normalize(rightVideos))
  const overlap = [...leftSet].filter(word => rightSet.has(word)).length
  const base = Math.max(1, Math.min(leftSet.size, rightSet.size))
  const score = Math.round((overlap / base) * 100)
  if (score > 45) return 'High overlap'
  if (score > 20) return 'Medium overlap'
  return 'Low overlap'
}

function inferReplicationDifficulty(channel: any, videos: any[]) {
  const subs = Number(channel?.statistics?.subscriberCount || 0)
  const avgViews = videos.length ? videos.reduce((sum, v) => sum + Number(v.statistics?.viewCount || 0), 0) / videos.length : 0
  if (subs > 1000000 || avgViews > 1000000) return 'Hard to replicate'
  if (subs > 100000 || avgViews > 100000) return 'Moderate to replicate'
  return 'More replicable'
}

function getWinnerSummary(leftChannel: any, rightChannel: any, leftVideos: any[], rightVideos: any[]) {
  const leftSubs = Number(leftChannel?.statistics?.subscriberCount || 0)
  const rightSubs = Number(rightChannel?.statistics?.subscriberCount || 0)

  const getEngagement = (videos: any[]) => {
    if (!videos.length) return 0
    return videos.reduce((sum, v) => {
      const views = Number(v.statistics?.viewCount || 0)
      const likes = Number(v.statistics?.likeCount || 0)
      const comments = Number(v.statistics?.commentCount || 0)
      if (!views) return sum
      return sum + ((likes + comments * 2) / views) * 100
    }, 0) / videos.length
  }

  const leftEngagement = getEngagement(leftVideos)
  const rightEngagement = getEngagement(rightVideos)
  const leftAvgViews = leftVideos.length ? leftVideos.reduce((sum, v) => sum + Number(v.statistics?.viewCount || 0), 0) / leftVideos.length : 0
  const rightAvgViews = rightVideos.length ? rightVideos.reduce((sum, v) => sum + Number(v.statistics?.viewCount || 0), 0) / rightVideos.length : 0

  const scaleWinner = leftSubs >= rightSubs ? 'A' : 'B'
  const efficiencyWinner = leftAvgViews >= rightAvgViews ? 'A' : 'B'
  const engagementWinner = leftEngagement >= rightEngagement ? 'A' : 'B'

  const aWins = [scaleWinner, efficiencyWinner, engagementWinner].filter(v => v === 'A').length
  const bWins = 3 - aWins
  const overallWinner = aWins === bWins ? 'Tie' : aWins > bWins ? 'Channel A' : 'Channel B'

  let recommendation = 'Use this comparison to decide which channel strategy is more worth studying in depth.'
  if (overallWinner === 'Channel A') {
    recommendation = efficiencyWinner === 'A'
      ? 'Channel A is the better model to study if you care about repeatable performance per upload.'
      : 'Channel A wins on overall scale, but check whether its strategy is realistic for your stage.'
  }
  if (overallWinner === 'Channel B') {
    recommendation = engagementWinner === 'B'
      ? 'Channel B is the better model to study if your goal is stronger audience connection and content response.'
      : 'Channel B wins on overall score, but compare its format against your niche before copying it.'
  }

  return {
    overallWinner,
    scaleWinner: scaleWinner === 'A' ? leftChannel?.snippet?.title || 'Channel A' : rightChannel?.snippet?.title || 'Channel B',
    efficiencyWinner: efficiencyWinner === 'A' ? leftChannel?.snippet?.title || 'Channel A' : rightChannel?.snippet?.title || 'Channel B',
    engagementWinner: engagementWinner === 'A' ? leftChannel?.snippet?.title || 'Channel A' : rightChannel?.snippet?.title || 'Channel B',
    recommendation,
    sponsorFitA: inferCommercialFit(leftVideos),
    sponsorFitB: inferCommercialFit(rightVideos),
    brandSafetyA: inferBrandSafety(leftVideos),
    brandSafetyB: inferBrandSafety(rightVideos),
    audienceOverlap: inferAudienceOverlap(leftVideos, rightVideos),
    replicationA: inferReplicationDifficulty(leftChannel, leftVideos),
    replicationB: inferReplicationDifficulty(rightChannel, rightVideos),
  }
}

export default function ChannelCompareView({ leftId, rightId }: ChannelCompareViewProps) {
  const [leftChannel, setLeftChannel] = useState<any>(null)
  const [rightChannel, setRightChannel] = useState<any>(null)
  const [leftVideos, setLeftVideos] = useState<any[]>([])
  const [rightVideos, setRightVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)

      try {
        const [leftRes, rightRes] = await Promise.all([
          fetch(`/api/analyze?type=channel&id=${encodeURIComponent(leftId)}`),
          fetch(`/api/analyze?type=channel&id=${encodeURIComponent(rightId)}`)
        ])

        if (!leftRes.ok) throw new Error('We could not load Channel A. Check the URL, handle, or channel ID and try again.')
        if (!rightRes.ok) throw new Error('We could not load Channel B. Check the URL, handle, or channel ID and try again.')

        const leftData = await leftRes.json()
        const rightData = await rightRes.json()

        setLeftChannel(leftData.channel)
        setRightChannel(rightData.channel)
        setLeftVideos(leftData.videos || [])
        setRightVideos(rightData.videos || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong while comparing these channels. Please try again.')
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
            <div>• Fetching channel stats</div>
            <div>• Comparing recent video performance</div>
            <div>• Generating winner summary</div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-8 animate-pulse"><div className="h-24 bg-gray-100 rounded-lg mb-4"></div><div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div><div className="h-4 bg-gray-100 rounded w-1/2"></div></div>
          <div className="bg-white rounded-xl p-8 animate-pulse"><div className="h-24 bg-gray-100 rounded-lg mb-4"></div><div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div><div className="h-4 bg-gray-100 rounded w-1/2"></div></div>
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
          <div className="text-sm text-red-800 mb-5">Try a public channel URL, a channel handle like @mrbeast, or a raw channel ID.</div>
          <Link href={`/compare-new?type=channels`} className="inline-block px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition">Edit Inputs</Link>
        </div>
      </div>
    )
  }

  const summary = getWinnerSummary(leftChannel, rightChannel, leftVideos, rightVideos)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <Link href={`/compare-new?type=channels`} className="text-gray-500 hover:text-gray-900">← Edit Comparison</Link>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Channel Comparison</h2>
        <p className="text-gray-500">See who wins on scale, efficiency, engagement, and commercial fit before you copy a strategy.</p>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-200 p-6 mb-8">
        <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">Summary verdict</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{summary.overallWinner} has the stronger overall position</h3>
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-xl p-4 border border-indigo-100"><div className="text-xs text-gray-500 mb-1">Scale winner</div><div className="font-semibold text-gray-900">{summary.scaleWinner}</div></div>
          <div className="bg-white rounded-xl p-4 border border-indigo-100"><div className="text-xs text-gray-500 mb-1">Efficiency winner</div><div className="font-semibold text-gray-900">{summary.efficiencyWinner}</div></div>
          <div className="bg-white rounded-xl p-4 border border-indigo-100"><div className="text-xs text-gray-500 mb-1">Engagement winner</div><div className="font-semibold text-gray-900">{summary.engagementWinner}</div></div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-sm">
          <div className="bg-white rounded-xl p-4 border border-indigo-100"><div className="text-xs text-gray-500 mb-1">Sponsor fit</div><div className="font-semibold text-gray-900">A: {summary.sponsorFitA} · B: {summary.sponsorFitB}</div></div>
          <div className="bg-white rounded-xl p-4 border border-indigo-100"><div className="text-xs text-gray-500 mb-1">Brand safety</div><div className="font-semibold text-gray-900">A: {summary.brandSafetyA} · B: {summary.brandSafetyB}</div></div>
          <div className="bg-white rounded-xl p-4 border border-indigo-100"><div className="text-xs text-gray-500 mb-1">Audience overlap</div><div className="font-semibold text-gray-900">{summary.audienceOverlap}</div></div>
          <div className="bg-white rounded-xl p-4 border border-indigo-100"><div className="text-xs text-gray-500 mb-1">Replication</div><div className="font-semibold text-gray-900">A: {summary.replicationA} · B: {summary.replicationB}</div></div>
        </div>
        <p className="text-sm text-gray-700">{summary.recommendation}</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        {leftChannel?.id && <Link href={`/channel/${leftChannel.id}`} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition">Open Channel A Analysis</Link>}
        {rightChannel?.id && <Link href={`/channel/${rightChannel.id}`} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition">Open Channel B Analysis</Link>}
        <Link href="/compare-new?type=channels" className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition">Compare Another Pair</Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <ChannelCompareCard channel={leftChannel} videos={leftVideos} label="Channel A" color="blue" />
        <ChannelCompareCard channel={rightChannel} videos={rightVideos} label="Channel B" color="red" />
      </div>

      {leftChannel && rightChannel && (
        <ChannelCompareMetrics leftChannel={leftChannel} rightChannel={rightChannel} leftVideos={leftVideos} rightVideos={rightVideos} />
      )}
    </div>
  )
}
