'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import ChannelCompareView from './ChannelCompareView'
import VideoCompareView from './VideoCompareView'

export default function CompareNewContent() {
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<'channels' | 'videos'>('channels')
  const [leftId, setLeftId] = useState('')
  const [rightId, setRightId] = useState('')
  const [isComparing, setIsComparing] = useState(false)

  // Check URL params on mount
  useEffect(() => {
    const type = searchParams.get('type') as 'channels' | 'videos'
    const left = searchParams.get('left')
    const right = searchParams.get('right')

    if (type && (type === 'channels' || type === 'videos')) {
      setMode(type)
    }
    if (left) setLeftId(left)
    if (right) setRightId(right)
    if (left && right) setIsComparing(true)
  }, [searchParams])

  const handleCompare = () => {
    if (leftId && rightId) {
      setIsComparing(true)
    }
  }

  const extractId = (input: string, type: 'channel' | 'video'): string => {
    if (!input) return ''

    // Handle full URLs
    if (input.includes('youtube.com')) {
      if (type === 'channel') {
        const match = input.match(/\/channel\/([\w-]+)/)
        if (match) return match[1]
        const handleMatch = input.match(/\/@([\w-]+)/)
        if (handleMatch) return '@' + handleMatch[1]
      } else {
        const match = input.match(/[?&]v=([\w-]+)/)
        if (match) return match[1]
        const shortMatch = input.match(/youtu\.be\/([\w-]+)/)
        if (shortMatch) return shortMatch[1]
      }
    }

    // Return as-is if it's just an ID
    return input.trim()
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-500 hover:text-gray-900">
                ← Back
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Compare Tool</h1>
            </div>

            {/* Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => {
                  setMode('channels')
                  setIsComparing(false)
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  mode === 'channels'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Channels
              </button>
              <button
                onClick={() => {
                  setMode('videos')
                  setIsComparing(false)
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  mode === 'videos'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Videos
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Input Section */}
      {!isComparing && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              Compare {mode === 'channels' ? 'YouTube Channels' : 'YouTube Videos'}
            </h2>
            <p className="text-gray-500 text-center mb-8">
              Side-by-side analysis to find insights and differences
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Left Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {mode === 'channels' ? 'Channel A' : 'Video A'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={leftId}
                    onChange={(e) => setLeftId(extractId(e.target.value, mode === 'channels' ? 'channel' : 'video'))}
                    placeholder={mode === 'channels'
                      ? 'Paste channel URL or ID'
                      : 'Paste video URL or ID'
                    }
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Right Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {mode === 'channels' ? 'Channel B' : 'Video B'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={rightId}
                    onChange={(e) => setRightId(extractId(e.target.value, mode === 'channels' ? 'channel' : 'video'))}
                    placeholder={mode === 'channels'
                      ? 'Paste channel URL or ID'
                      : 'Paste video URL or ID'
                    }
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Compare Button */}
            <button
              onClick={handleCompare}
              disabled={!leftId || !rightId}
              className="w-full py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Start Comparing
            </button>

            {/* Quick Tips */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Tip: You can paste full YouTube URLs or just the IDs</p>
              <p className="mt-1">
                Examples: {mode === 'channels'
                  ? "@mrbeast, /channel/UC... , or youtube.com/@mrbeast"
                  : "dQw4w9WgXcQ, or youtube.com/watch?v=dQw4w9WgXcQ"
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Results */}
      {isComparing && mode === 'channels' && (
        <ChannelCompareView leftId={leftId} rightId={rightId} />
      )}

      {isComparing && mode === 'videos' && (
        <VideoCompareView leftId={leftId} rightId={rightId} />
      )}
    </main>
  )
}
