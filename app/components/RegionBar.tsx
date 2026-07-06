'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { REGIONS, REGION_META, type Region } from '@/lib/region'

const HEADER_REGIONS = REGIONS.filter((region) => region !== 'GLOBAL')

interface User {
  id: string
  username: string
  email: string
}

function UserNav() {
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
      <div className="flex items-center gap-2 shrink-0">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg border border-gray-200">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
            {user.username[0].toUpperCase()}
          </div>
          <span className="text-sm font-medium text-gray-700 max-w-[90px] truncate">{user.username}</span>
        </div>
        <button
          onClick={logout}
          className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap"
        >
          Logout
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      <Link
        href="/login"
        className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap"
      >
        Sign In
      </Link>
      <Link
        href="/signup"
        className="px-3 py-1.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap"
      >
        Sign Up
      </Link>
    </div>
  )
}

export default function RegionBar() {
  const [region, setRegion] = useState<Region>('US')
  const [mounted, setMounted] = useState(false)

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

  function switchRegion(r: Region) {
    if (r === 'GLOBAL') r = 'US'
    if (r === region) return
    // Cookie updates are event-driven here so the selected region survives reloads.
    // eslint-disable-next-line react-hooks/purity
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString()
    // eslint-disable-next-line react-hooks/immutability
    document.cookie = `region=${r};path=/;expires=${expires}`
    window.location.reload()
  }

  if (!mounted) {
    return (
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 mr-auto hover:opacity-80 transition-opacity min-w-0">
            <img src="/favicon.svg" alt="TubeFission" className="w-7 h-7" />
            <span className="text-sm font-bold tracking-tight text-gray-900 truncate">TubeFission</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 mr-auto hover:opacity-80 transition-opacity min-w-0">
          <img src="/favicon.svg" alt="TubeFission" className="w-7 h-7 shrink-0" />
          <div className="hidden sm:flex flex-col min-w-0">
            <span className="text-sm font-bold tracking-tight leading-tight text-gray-900 truncate">TubeFission</span>
            <span className="text-[10px] text-gray-500 data-mono leading-tight truncate">YOUTUBE INTELLIGENCE</span>
          </div>
          <span className="sm:hidden text-sm font-bold tracking-tight text-gray-900 truncate">TubeFission</span>
        </Link>

        <div className="flex items-center gap-2 min-w-0">
          <div className="hidden lg:flex items-center gap-1 bg-gray-100 rounded-xl p-1 border border-gray-200">
            <span className="text-[10px] text-gray-500 data-mono px-2">REGION</span>
            {HEADER_REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => switchRegion(r)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  region === r
                    ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.25)]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                }`}
                title={REGION_META[r].label}
              >
                <img
                  src={`https://flagcdn.com/w40/${REGION_META[r].flag}.png`}
                  alt={REGION_META[r].label}
                  className="w-4 h-3 rounded-sm object-cover"
                  loading="lazy"
                />
                <span>{r}</span>
              </button>
            ))}
          </div>
          <div className="lg:hidden">
            <select
              value={region}
              onChange={(e) => switchRegion(e.target.value as Region)}
              className="h-9 rounded-lg border border-gray-200 bg-white px-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Select region"
            >
              {HEADER_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r} · {REGION_META[r].label}
                </option>
              ))}
            </select>
          </div>
          <UserNav />
        </div>
      </div>
    </div>
  )
}

