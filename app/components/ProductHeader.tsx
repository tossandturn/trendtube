'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, Search, X } from 'lucide-react'
import { extractChannelId, extractVideoId, isValidYouTubeUrl } from '@/lib/youtube-parser'
import { REGIONS, REGION_META, type Region } from '@/lib/region'

const HEADER_REGIONS = REGIONS.filter((region) => region !== 'GLOBAL')

interface User {
  id: string
  username: string
  email: string
}

const navGroups = [
  {
    label: 'Discover',
    href: '/trending',
    links: [
      { label: 'Trending Videos', href: '/trending' },
      { label: 'Trend Database', href: '/trends' },
      { label: 'Low Competition Keywords', href: '/low-competition-keywords' },
      { label: 'Shorts Trends', href: '/youtube-shorts-trends' },
      { label: 'AI Trends', href: '/youtube-ai-trends' },
    ],
  },
  {
    label: 'Analyze',
    href: '/youtube-video-analyzer',
    links: [
      { label: 'Video Analyzer', href: '/youtube-video-analyzer' },
      { label: 'Channel Analytics', href: '/youtube-channel-analytics' },
      { label: 'Keyword Research', href: '/youtube-keyword-research' },
    ],
  },
  {
    label: 'Compare',
    href: '/compare-new',
    links: [
      { label: 'Compare Channels', href: '/compare-new?type=channels' },
      { label: 'Compare Videos', href: '/compare-new?type=videos' },
      { label: 'Competitor Analysis', href: '/youtube-competitor-analysis' },
    ],
  },
  {
    label: 'Plan',
    href: '/ai-assistant',
    links: [
      { label: 'AI Assistant', href: '/ai-assistant' },
      { label: 'Niche Finder', href: '/youtube-niche-finder' },
      { label: 'Opportunity Finder', href: '/youtube-opportunity-finder' },
    ],
  },
  {
    label: 'Track',
    href: '/workspace',
    links: [
      { label: 'Workspace', href: '/workspace' },
      { label: 'Watchlist', href: '/watchlist' },
      { label: 'Alerts', href: '/alerts' },
      { label: 'Status', href: '/status' },
    ],
  },
]

const seoLinks = [
  { label: 'Gaming trends', href: '/gaming-youtube-trends' },
  { label: 'Viral shorts', href: '/viral-youtube-shorts' },
  { label: 'Music trends', href: '/viral-music-trends' },
  { label: 'Low competition keywords', href: '/low-competition-keywords' },
]

function UserNav({ compact = false }: { compact?: boolean }) {
  const [user, setUser] = useState<User | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    queueMicrotask(() => {
      setMounted(true)
      const userJson = localStorage.getItem('user')
      if (userJson) {
        try {
          setUser(JSON.parse(userJson))
        } catch {
          localStorage.removeItem('user')
        }
      }
    })
  }, [])

  function logout() {
    localStorage.removeItem('user')
    localStorage.removeItem('authToken')
    setUser(null)
    window.location.reload()
  }

  if (!mounted) return null

  if (user) {
    return (
      <div className="flex items-center gap-2">
        {!compact && (
          <div className="hidden xl:flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-xs font-bold text-white">
              {user.username[0].toUpperCase()}
            </div>
            <span className="max-w-[90px] truncate text-sm font-medium text-gray-700">{user.username}</span>
          </div>
        )}
        <button onClick={logout} className="rounded-lg px-2.5 py-1.5 text-sm text-gray-600 transition hover:bg-gray-100 hover:text-gray-900">
          Logout
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1.5">
      <Link href="/login" className="rounded-lg px-2.5 py-1.5 text-sm text-gray-600 transition hover:bg-gray-100 hover:text-gray-900">
        Sign In
      </Link>
      <Link href="/signup" className="rounded-lg bg-gray-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-gray-800">
        Sign Up
      </Link>
    </div>
  )
}

function RegionSelect({ region, onSwitch }: { region: Region; onSwitch: (region: Region) => void }) {
  return (
    <select
      value={region}
      onChange={(event) => onSwitch(event.target.value as Region)}
      className="h-9 rounded-lg border border-gray-200 bg-white px-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
      aria-label="Select region"
    >
      {HEADER_REGIONS.map((r) => (
        <option key={r} value={r}>
          {r} - {REGION_META[r].label}
        </option>
      ))}
    </select>
  )
}

function AnalyzeForm({ compact = false, onDone }: { compact?: boolean; onDone?: () => void }) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const trimmed = url.trim()
    setError('')

    if (!trimmed) {
      setError('Paste a YouTube video or channel URL.')
      return
    }

    if (!isValidYouTubeUrl(trimmed)) {
      setError('Use a valid YouTube URL.')
      return
    }

    const videoId = extractVideoId(trimmed)
    const channelId = extractChannelId(trimmed)

    if (!videoId && !channelId) {
      setError('Could not detect a video or channel.')
      return
    }

    setLoading(true)
    try {
      if (videoId) {
        await fetch('/api/analyze/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'video', targetUrl: trimmed }),
        })
        router.push(`/video/${videoId}`)
      } else if (channelId) {
        await fetch('/api/analyze/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'channel', targetUrl: trimmed }),
        })
        router.push(`/channel/${encodeURIComponent(channelId)}`)
      }
      onDone?.()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? 'space-y-2' : 'min-w-0 flex-1'} role="search">
      <div className={compact ? 'flex flex-col gap-2' : 'flex items-center gap-2'}>
        <label htmlFor={compact ? 'mobile-global-analyze' : 'global-analyze'} className="sr-only">
          YouTube video or channel URL
        </label>
        <input
          id={compact ? 'mobile-global-analyze' : 'global-analyze'}
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder={compact ? 'Paste YouTube URL...' : 'Paste video or channel URL...'}
          className="min-h-10 min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="inline-flex min-h-10 items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </form>
  )
}

export default function ProductHeader() {
  const [region, setRegion] = useState<Region>('US')
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    queueMicrotask(() => {
      setMounted(true)
      const match = document.cookie.match(/region=([A-Z]{2,6})/)
      if (match && REGIONS.includes(match[1] as Region)) {
        const nextRegion = match[1] === 'GLOBAL' ? 'US' : match[1]
        setRegion(nextRegion as Region)
        if (match[1] === 'GLOBAL') {
          const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString()
          document.cookie = `region=US;path=/;expires=${expires}`
        }
      }
    })
  }, [])

  function switchRegion(nextRegion: Region) {
    if (nextRegion === 'GLOBAL') nextRegion = 'US'
    if (nextRegion === region) return
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString()
    document.cookie = `region=${nextRegion};path=/;expires=${expires}`
    window.location.reload()
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 py-2.5 sm:px-6 lg:gap-4">
        <Link href="/" className="flex min-w-0 items-center gap-2 transition hover:opacity-80">
          <Image src="/favicon.svg" alt="TubeFission" width={28} height={28} className="h-7 w-7 shrink-0" />
          <div className="min-w-0">
            <div className="truncate text-sm font-bold leading-tight text-gray-900">TubeFission</div>
            <div className="hidden truncate text-[10px] leading-tight text-gray-500 sm:block">YouTube Intelligence</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {navGroups.map((group) => (
            <div key={group.label} className="group relative">
              <Link href={group.href} className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-950">
                {group.label}
              </Link>
              <div className="invisible absolute left-0 top-full z-50 w-56 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100">
                <div className="rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
                  {group.links.map((link) => (
                    <Link key={link.href} href={link.href} className="block rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 hover:text-red-600">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </nav>

        <div className="hidden min-w-[260px] flex-1 xl:block">
          <AnalyzeForm />
        </div>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          {mounted && <RegionSelect region={region} onSwitch={switchRegion} />}
          <UserNav />
        </div>

        <div className="ml-auto flex items-center gap-2 lg:hidden">
          {mounted && <RegionSelect region={region} onSwitch={switchRegion} />}
          <button
            type="button"
            onClick={() => setSearchOpen((open) => !open)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-700"
            aria-label="Analyze a URL"
          >
            {searchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-700"
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-gray-100 bg-red-50/70 px-3 py-3 lg:hidden">
          <AnalyzeForm compact onDone={() => setSearchOpen(false)} />
        </div>
      )}

      {menuOpen && (
        <div className="border-t border-gray-100 bg-white px-3 py-3 lg:hidden">
          <div className="grid gap-3">
            {navGroups.map((group) => (
              <div key={group.label} className="rounded-xl border border-gray-200 p-3">
                <Link href={group.href} onClick={() => setMenuOpen(false)} className="font-semibold text-gray-900">
                  {group.label}
                </Link>
                <div className="mt-2 grid grid-cols-1 gap-1">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="rounded-lg px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-red-600"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <div className="rounded-xl border border-gray-200 p-3">
              <div className="font-semibold text-gray-900">SEO Tools</div>
              <div className="mt-2 grid grid-cols-1 gap-1">
                {seoLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="rounded-lg px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-red-600">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <UserNav compact />
          </div>
        </div>
      )}
    </header>
  )
}
