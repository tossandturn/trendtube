'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { extractVideoId, extractChannelId, isValidYouTubeUrl } from '@/lib/youtube-parser'
import { useAuth } from '@/app/hooks/useAuth'
import { PRODUCT_ACCESS_COPY } from '@/lib/product-positioning'

function LoginModal({ isOpen, onClose, onLogin }: { isOpen: boolean; onClose: () => void; onLogin: (email: string, password: string) => Promise<void> }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await onLogin(email, password)
    } catch (err) {
      setError('Login failed. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Sign in to continue</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          You&apos;ve used your anonymous analysis preview. Sign in to continue analyzing videos and channels with a connected workspace.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <span className="text-gray-500">Don&apos;t have an account? </span>
          <a href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign up free
          </a>
        </div>
      </div>
    </div>
  )
}

export function AnalyzeHeroForm() {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const router = useRouter()
  const { canAnalyze, recordAnalyze, login, isLoggedIn } = useAuth()

  async function handleSubmit(e: React.FormEvent) {
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

    // Check if user needs to login before analyzing
    if (!canAnalyze) {
      setShowLoginModal(true)
      return
    }

    setLoading(true)

    // Record the analyze attempt
    await recordAnalyze()

    if (videoId) {
      router.push(`/video/${videoId}`)
    } else if (channelId) {
      // Encode the channel ID to handle special characters like @
      router.push(`/channel/${encodeURIComponent(channelId)}`)
    } else {
      setError('Could not extract video or channel ID from URL')
      setLoading(false)
    }
  }

  async function handleLogin(email: string, password: string) {
    const result = await login(email, password)
    if (result.success) {
      setShowLoginModal(false)
      // Retry the analyze after login
      handleSubmit({ preventDefault: () => {} } as React.FormEvent)
    } else {
      throw new Error(result.error || 'Login failed')
    }
  }

  return (
    <>
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
        {!isLoggedIn && (
          <p className="mt-3 text-xs leading-5 text-gray-500 sm:text-center">
            {PRODUCT_ACCESS_COPY.short}{' '}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign up free
            </a>
          </p>
        )}
      </form>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
    </>
  )
}
