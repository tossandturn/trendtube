'use client'

import { useEffect, useState } from 'react'
import { REGIONS, REGION_META, type Region } from '@/lib/region'

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
          <div className="flex items-center gap-2 mr-auto">
            <YouTubeLogo />
            <span className="text-sm font-bold tracking-tight text-gray-900">TubeFission</span>
          </div>
          <div className="flex gap-1" />
        </div>
      </div>
    )
  }

  return (
    <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center gap-3">
        {/* YouTube Branding */}
        <div className="flex items-center gap-2 mr-auto">
          <YouTubeLogo />
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-bold tracking-tight leading-tight text-gray-900">TubeFission</span>
            <span className="text-[10px] text-gray-500 data-mono leading-tight">YOUTUBE INTELLIGENCE</span>
          </div>
          <span className="sm:hidden text-sm font-bold tracking-tight text-gray-900">TubeFission</span>
        </div>

        {/* Region Selector */}
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
      </div>
    </div>
  )
}

function YouTubeLogo() {
  return (
    <div className="flex items-center gap-1.5">
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 00.5 6.19 31.5 31.5 0 000 12a31.5 31.5 0 00.5 5.81 3.02 3.02 0 002.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 002.12-2.14A31.5 31.5 0 0024 12a31.5 31.5 0 00-.5-5.81z"
          fill="#FF0000"
        />
        <path d="M9.55 15.5V8.5l6.27 3.5-6.27 3.5z" fill="white" />
      </svg>
    </div>
  )
}
