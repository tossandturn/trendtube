'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { extractVideoId, isValidYouTubeUrl } from '@/lib/youtube-parser'

export function DownloadHeroForm() {
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
    if (!videoId) {
      setError('Could not extract video ID from URL')
      return
    }

    setLoading(true)
    router.push(`/video/${videoId}?download=1`)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto"
      aria-label="YouTube video download form"
    >
      <div className="flex flex-col sm:flex-row gap-2"
        role="search"
      >
        <label htmlFor="yt-url" className="sr-only">
          YouTube video URL
        </label>
        <input
          id="yt-url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste YouTube URL here..."
          className="flex-1 min-h-[48px] px-4 py-3 text-base sm:text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="min-h-[48px] px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors whitespace-nowrap"
        >
          {loading ? 'Processing...' : 'Download Now'}
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
