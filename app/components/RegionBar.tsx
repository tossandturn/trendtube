'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { REGIONS, REGION_META, type Region } from '@/lib/region'

interface User {
  id: number
  username: string
  email: string
}

function UserNav() {
  const [user, setUser] = useState<User | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const userJson = localStorage.getItem('user')
    if (userJson) {
      try {
        setUser(JSON.parse(userJson))
      } catch {
        localStorage.removeItem('user')
      }
    }
  }, [])

  function logout() {
    localStorage.removeItem('user')
    setUser(null)
    window.location.reload()
  }

  if (!mounted) return null

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg border border-gray-200">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
            {user.username[0].toUpperCase()}
          </div>
          <span className="text-sm font-medium text-gray-700">{user.username}</span>
        </div>
        <button
          onClick={logout}
          className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          Logout
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        Sign In
      </Link>
      <Link
        href="/signup"
        className="px-3 py-1.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
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
    setMounted(true)
    const match = document.cookie.match(/region=([A-Z]{2})/)
    if (match && REGIONS.includes(match[1] as Region)) {
      setRegion(match[1] as Region)
    }
  }, [])

  function switchRegion(r: Region) {
    if (r === region) return
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString()
    document.cookie = `region=${r};path=/;expires=${expires}`
    window.location.reload()
  }

  if (!mounted) {
    return (
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 mr-auto hover:opacity-80 transition-opacity">
            <img src="/favicon.svg" alt="TubeFission" className="w-7 h-7" />
            <span className="text-sm font-bold tracking-tight text-gray-900">TubeFission</span>
          </Link>
          <div className="flex gap-1" />
        </div>
      </div>
    )
  }

  return (
    <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center gap-3">
        {/* YouTube Branding - Clickable Logo */}
        <Link href="/" className="flex items-center gap-2 mr-auto hover:opacity-80 transition-opacity">
          <img src="/favicon.svg" alt="TubeFission" className="w-7 h-7" />
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-bold tracking-tight leading-tight text-gray-900">TubeFission</span>
            <span className="text-[10px] text-gray-500 data-mono leading-tight">YOUTUBE INTELLIGENCE</span>
          </div>
          <span className="sm:hidden text-sm font-bold tracking-tight text-gray-900">TubeFission</span>
        </Link>

        {/* Region Selector & User Nav */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 border border-gray-200">
            <span className="text-[10px] text-gray-500 data-mono px-2 hidden sm:inline">REGION</span>
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => switchRegion(r)}
                className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all ${
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
          <UserNav />
        </div>
      </div>
    </div>
  )
}

