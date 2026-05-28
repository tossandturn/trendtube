'use client'

import { useEffect } from 'react'

interface AdBannerProps {
  slot: string
  className?: string
}

export default function AdBanner({ slot, className = '' }: AdBannerProps) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        (window as any).adsbygoogle.push({})
      }
    } catch {
      // ignore ad errors
    }
  }, [])

  return (
    <div className={`flex justify-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6772936350717773"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
