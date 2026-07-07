'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface AdBannerProps {
  slot: string
  className?: string
}

type AdSenseWindow = Window & {
  adsbygoogle?: unknown[]
}

export default function AdBanner({ slot, className = '' }: AdBannerProps) {
  const pathname = usePathname() || '/'
  const shouldRender = !['/login', '/signup', '/workspace', '/watchlist', '/alerts', '/compare-new', '/ai-assistant', '/status'].some((path) => pathname === path || pathname.startsWith(`${path}/`))

  useEffect(() => {
    if (!shouldRender) return
    try {
      const adWindow = window as AdSenseWindow
      if (typeof window !== 'undefined' && adWindow.adsbygoogle) {
        adWindow.adsbygoogle.push({})
      }
    } catch {
      // ignore ad errors
    }
  }, [shouldRender])

  if (!shouldRender) return null

  return (
    <div className={`flex justify-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-2329966945529740"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
