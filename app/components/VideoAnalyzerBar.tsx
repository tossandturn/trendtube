'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function VideoAnalyzerBar() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/analyze/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'video',
          targetUrl: url.trim()
        }),
      })

      if (response.ok) {
        router.push(`/video/analyze?url=${encodeURIComponent(url.trim())}`)
      }
    } catch (error) {
      console.error('Analysis error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="sticky top-[58px] z-40 bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3">
        <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="text-gray-400 shrink-0">🔍</span>
            <input
              type="url"
              placeholder="Paste YouTube video URL to analyze..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-white border border-red-200 rounded-lg px-3 sm:px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent min-w-0"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="w-full sm:w-auto px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shrink-0"
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                Analyzing...
              </>
            ) : (
              <>
                <span>🔍</span>
                Analyze
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
