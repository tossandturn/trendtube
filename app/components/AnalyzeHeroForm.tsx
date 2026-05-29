'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { extractVideoId, extractChannelId, isValidYouTubeUrl } from '@/lib/youtube-parser'

export function AnalyzeHeroForm() {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!url.trim()) {
      setError('Please enter a YouTube URL')
      return
    }

    if (!isValidYouTubeUrl(url)) {
      setError('Please enter a valid YouTube URL')
      return
    }

    const videoId = extractVideoId(url)
    const channelId = extractChannelId(url)

    if (!videoId && !channelId) {
      setError('Could not extract video or channel ID from URL')
      return
    }

    setLoading(true)
    if (videoId) {
      router.push(`/video/${videoId}`)
    } else {
      // For now redirect to trending if channel analysis page doesn't exist
      router.push(`/trending`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto" aria-label="YouTube channel analytics form">
      <div className="flex flex-col sm:flex-row gap-2" role="search">
        <label htmlFor="channel-url" className="sr-only">
          YouTube channel or video URL
        </label>
        <input
          id="channel-url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste YouTube channel or video URL..."
          className="flex-1 min-h-[48px] px-4 py-3 text-base sm:text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="min-h-[48px] px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors whitespace-nowrap"
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}
