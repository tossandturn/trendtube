'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import ChannelCompareView from './ChannelCompareView'
import VideoCompareView from './VideoCompareView'

const CHANNEL_EXAMPLES = ['@MrBeast', '@MKBHD']
const VIDEO_EXAMPLES = ['VI9igkwFNI0', '4Q4TuAzkz4k']

export default function CompareNewContent() {
  const searchParams = useSearchParams()
  const initialType = searchParams.get('type')
  const initialMode = initialType === 'videos' ? 'videos' : 'channels'
  const initialLeft = searchParams.get('left') || ''
  const initialRight = searchParams.get('right') || ''
  const [mode, setMode] = useState<'channels' | 'videos'>(initialMode)
  const [leftId, setLeftId] = useState(initialLeft)
  const [rightId, setRightId] = useState(initialRight)
  const [isComparing, setIsComparing] = useState(Boolean(initialLeft && initialRight))

  const handleCompare = () => {
    if (leftId && rightId) setIsComparing(true)
  }

  const extractId = (input: string, type: 'channel' | 'video'): string => {
    if (!input) return ''

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

    return input.trim()
  }

  const applyExamples = () => {
    if (mode === 'channels') {
      setLeftId(CHANNEL_EXAMPLES[0])
      setRightId(CHANNEL_EXAMPLES[1])
    } else {
      setLeftId(VIDEO_EXAMPLES[0])
      setRightId(VIDEO_EXAMPLES[1])
    }
  }

  const modeCopy = mode === 'channels'
    ? {
        title: 'Compare YouTube Channels',
        subtitle: 'See who leads on scale, engagement, publishing consistency, and commercial fit before you copy a strategy.',
        learn: [
          'Which channel wins on reach vs efficiency',
          'Which audience pattern is more valuable',
          'Which creator model is more repeatable',
        ],
      }
    : {
        title: 'Compare YouTube Videos',
        subtitle: 'Understand which video wins on packaging, engagement, and performance efficiency.',
        learn: [
          'Which video converted more views into engagement',
          'Which packaging likely worked better',
          'Which result is more worth replicating',
        ],
      }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Link href="/" className="text-gray-500 hover:text-gray-900 shrink-0">
                ← Back
              </Link>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Compare Tool</h1>
            </div>

            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
              <button
                onClick={() => {
                  setMode('channels')
                  setIsComparing(false)
                }}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all ${
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
                className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all ${
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

      {!isComparing && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-8 mb-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{modeCopy.title}</h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">{modeCopy.subtitle}</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {modeCopy.learn.map((item) => (
                <div key={item} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">You will learn</div>
                  <div className="text-sm font-medium text-gray-900">{item}</div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {mode === 'channels' ? 'Channel A URL or ID' : 'Video A URL or ID'}
                </label>
                <input
                  type="text"
                  value={leftId}
                  onChange={(e) => setLeftId(extractId(e.target.value, mode === 'channels' ? 'channel' : 'video'))}
                  placeholder={mode === 'channels' ? 'Paste a channel URL, handle, or ID' : 'Paste a video URL or ID'}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {mode === 'channels' ? 'Channel B URL or ID' : 'Video B URL or ID'}
                </label>
                <input
                  type="text"
                  value={rightId}
                  onChange={(e) => setRightId(extractId(e.target.value, mode === 'channels' ? 'channel' : 'video'))}
                  placeholder={mode === 'channels' ? 'Paste a second channel URL, handle, or ID' : 'Paste a second video URL or ID'}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={handleCompare}
                disabled={!leftId || !rightId}
                className="flex-1 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Start Comparing
              </button>
              <button
                onClick={applyExamples}
                className="w-full sm:w-auto px-5 py-4 bg-gray-100 text-gray-900 font-medium rounded-xl hover:bg-gray-200 transition"
              >
                Use Example Inputs
              </button>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
              <div className="font-semibold mb-2">Accepted inputs</div>
              <ul className="space-y-1 text-blue-800">
                <li>• Full YouTube URLs</li>
                <li>• Channel handles like @mrbeast</li>
                <li>• Raw channel IDs or video IDs</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {isComparing && mode === 'channels' && (
        <ChannelCompareView leftId={leftId} rightId={rightId} />
      )}

      {isComparing && mode === 'videos' && (
        <VideoCompareView leftId={leftId} rightId={rightId} />
      )}
    </main>
  )
}
