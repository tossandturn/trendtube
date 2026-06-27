'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ChannelCompareCard from './ChannelCompareCard'
import ChannelCompareMetrics from './ChannelCompareMetrics'

interface ChannelCompareViewProps {
  leftId: string
  rightId: string
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
        // Fetch both channels in parallel
        const [leftRes, rightRes] = await Promise.all([
          fetch(`/api/analyze?type=channel&id=${encodeURIComponent(leftId)}`),
          fetch(`/api/analyze?type=channel&id=${encodeURIComponent(rightId)}`)
        ])

        if (!leftRes.ok) throw new Error('Failed to fetch Channel A')
        if (!rightRes.ok) throw new Error('Failed to fetch Channel B')

        const leftData = await leftRes.json()
        const rightData = await rightRes.json()

        setLeftChannel(leftData.channel)
        setRightChannel(rightData.channel)
        setLeftVideos(leftData.videos || [])
        setRightVideos(rightData.videos || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [leftId, rightId])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-8 animate-pulse">
            <div className="h-24 bg-gray-100 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-100 rounded w-1/2"></div>
          </div>
          <div className="bg-white rounded-xl p-8 animate-pulse">
            <div className="h-24 bg-gray-100 rounded-lg mb-4"></div>
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
          <h2 className="text-xl font-bold text-red-900 mb-2">Error Loading Data</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <Link
            href={`/compare-new?type=channels`}
            className="inline-block px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition"
          >
            Try Again
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href={`/compare-new?type=channels`}
            className="text-gray-500 hover:text-gray-900"
          >
            ← New Comparison
          </Link>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Channel Comparison</h2>
        <p className="text-gray-500">Side-by-side performance analysis</p>
      </div>

      {/* Side-by-Side Cards */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <ChannelCompareCard
          channel={leftChannel}
          videos={leftVideos}
          label="Channel A"
          color="blue"
        />
        <ChannelCompareCard
          channel={rightChannel}
          videos={rightVideos}
          label="Channel B"
          color="red"
        />
      </div>

      {/* Detailed Metrics Comparison */}
      {leftChannel && rightChannel && (
        <ChannelCompareMetrics
          leftChannel={leftChannel}
          rightChannel={rightChannel}
          leftVideos={leftVideos}
          rightVideos={rightVideos}
        />
      )}
    </div>
  )
}
