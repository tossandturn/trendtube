'use client'

import { useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  readVideoCompareItems,
  subscribeVideoCompareIds,
  writeVideoCompareItems,
  type VideoCompareItem,
} from '@/app/components/AddToVideoCompareButton'
import ChannelCompareView from './ChannelCompareView'
import VideoCompareView from './VideoCompareView'

const CHANNEL_EXAMPLES = ['@MrBeast', '@MKBHD']
const VIDEO_EXAMPLES = ['VI9igkwFNI0', '4Q4TuAzkz4k']

export default function CompareNewContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialType = searchParams.get('type')
  const initialMode = initialType === 'videos' ? 'videos' : 'channels'
  const initialLeft = searchParams.get('left') || ''
  const initialRight = searchParams.get('right') || ''
  const [mode, setMode] = useState<'channels' | 'videos'>(initialMode)
  const [leftId, setLeftId] = useState(initialLeft)
  const [rightId, setRightId] = useState(initialRight)
  const [isComparing, setIsComparing] = useState(Boolean(initialLeft && initialRight))
  const basketItems = useSyncExternalStore(subscribeVideoCompareIds, readVideoCompareItems, () => [])
  const basketIds = basketItems.map((item) => item.id)
  const selectedLeft = basketItems.find((item) => item.id === leftId)
  const selectedRight = basketItems.find((item) => item.id === rightId)

  const handleCompare = () => {
    if (!leftId || !rightId || leftId === rightId) return

    const params = new URLSearchParams({ type: mode })
    params.set('left', leftId)
    params.set('right', rightId)
    router.replace(`/compare-new?${params.toString()}`)
    setIsComparing(true)
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

  const applyBasket = () => {
    if (basketIds.length === 0) return
    setMode('videos')
    setLeftId(basketIds[0] || '')
    setRightId(basketIds[1] || '')
    setIsComparing(basketIds.length === 2)
  }

  const clearBasket = () => {
    writeVideoCompareItems([])
    setLeftId('')
    setRightId('')
    setIsComparing(false)
  }

  const chooseBasketVideo = (id: string, side: 'left' | 'right') => {
    setMode('videos')
    setIsComparing(false)
    if (side === 'left') {
      setLeftId(id)
      if (rightId === id) setRightId('')
    } else {
      setRightId(id)
      if (leftId === id) setLeftId('')
    }
  }

  const removeBasketVideo = (id: string) => {
    const nextItems = basketItems.filter((item) => item.id !== id)
    writeVideoCompareItems(nextItems)
    if (leftId === id) setLeftId('')
    if (rightId === id) setRightId('')
  }

  const getItemLabel = (item?: VideoCompareItem, fallbackId?: string) => {
    return item?.title || fallbackId || 'Choose from basket'
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

            {mode === 'videos' && basketIds.length > 0 && (
              <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-bold text-amber-950">Analysis Basket</div>
                    <p className="text-xs text-amber-800">
                      Save many candidates here, then pick exactly two videos for A/B analysis.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-white px-3 py-1 text-xs font-bold text-amber-900">
                      {basketIds.length} videos
                    </div>
                    <button
                      type="button"
                      onClick={clearBasket}
                      className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 hover:bg-amber-200"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="mb-3 grid gap-2 sm:grid-cols-2">
                  <div className="rounded-lg border border-blue-100 bg-white px-3 py-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-blue-500">Selected A</div>
                    <div className="truncate text-sm font-semibold text-gray-900">{getItemLabel(selectedLeft, leftId)}</div>
                  </div>
                  <div className="rounded-lg border border-red-100 bg-white px-3 py-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-red-500">Selected B</div>
                    <div className="truncate text-sm font-semibold text-gray-900">{getItemLabel(selectedRight, rightId)}</div>
                  </div>
                </div>

                <div className="grid max-h-[28rem] gap-2 overflow-y-auto pr-1">
                  {basketItems.map((item) => {
                    const isLeft = leftId === item.id
                    const isRight = rightId === item.id
                    const thumbnail = item.thumbnailUrl || `https://i.ytimg.com/vi/${item.id}/mqdefault.jpg`
                    return (
                      <div key={item.id} className="grid gap-3 rounded-lg border border-amber-200 bg-white p-3 sm:grid-cols-[120px_1fr]">
                        <div className="relative aspect-video overflow-hidden rounded-md bg-gray-100">
                          <img
                            src={thumbnail}
                            alt={item.title || 'Video thumbnail'}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="line-clamp-2 text-sm font-bold leading-snug text-gray-900">
                                {item.title || item.id}
                              </div>
                              <div className="mt-1 truncate text-xs text-gray-500">
                                {item.channelTitle || 'Unknown channel'} · {item.sourceLabel || 'Saved video'}
                              </div>
                            </div>
                            <Link
                              href={`/video/${item.id}`}
                              className="shrink-0 rounded-md bg-gray-100 px-2 py-1 text-[11px] font-bold text-gray-600 hover:bg-gray-200"
                            >
                              View
                            </Link>
                          </div>

                          <div className="mt-3 grid grid-cols-[1fr_1fr_auto] gap-2">
                            <button
                              type="button"
                              onClick={() => chooseBasketVideo(item.id, 'left')}
                              className={`rounded-md px-2 py-1.5 text-xs font-bold ${
                                isLeft ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                              }`}
                            >
                              {isLeft ? 'A selected' : 'Set A'}
                            </button>
                            <button
                              type="button"
                              onClick={() => chooseBasketVideo(item.id, 'right')}
                              className={`rounded-md px-2 py-1.5 text-xs font-bold ${
                                isRight ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100'
                              }`}
                            >
                              {isRight ? 'B selected' : 'Set B'}
                            </button>
                            <button
                              type="button"
                              onClick={() => removeBasketVideo(item.id)}
                              className="rounded-md bg-gray-100 px-2 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-200"
                              aria-label={`Remove ${item.id} from basket`}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={handleCompare}
                disabled={!leftId || !rightId || leftId === rightId}
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
              {mode === 'videos' && basketIds.length > 0 && (
                <button
                  onClick={applyBasket}
                  className="w-full sm:w-auto px-5 py-4 bg-amber-100 text-amber-900 font-medium rounded-xl hover:bg-amber-200 transition"
                >
                  Fill A/B from Basket ({basketIds.length})
                </button>
              )}
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
