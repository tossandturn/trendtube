'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'

const DISALLOWED_PREFIXES = [
  '/api',
  '/login',
  '/signup',
  '/verify-email',
  '/workspace',
  '/watchlist',
  '/alerts',
  '/compare-new',
  '/ai-assistant',
  '/status',
  '/download-youtube-video',
  '/download-youtube-mp3',
  '/download-youtube-shorts',
  '/youtube-thumbnail-downloader',
  '/tag',
]

export default function AdSenseScript() {
  const adsEnabled = process.env.NEXT_PUBLIC_ENABLE_ADSENSE === 'true'
  const pathname = usePathname() || '/'
  const shouldLoadAds = adsEnabled && !DISALLOWED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))

  if (!shouldLoadAds) return null

  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2329966945529740"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  )
}
