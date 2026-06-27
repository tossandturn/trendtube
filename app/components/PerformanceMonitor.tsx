'use client'

import { useEffect } from 'react'

// Extend Window interface for Plausible
declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, unknown> }) => void
  }
}

// Component to include in layout
export default function PerformanceMonitor() {
  useEffect(() => {
    // Report page load time
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const timing = performance.timing
          const pageLoadTime = timing.loadEventEnd - timing.navigationStart

          if (window.plausible && pageLoadTime > 0) {
            window.plausible('Page Load', {
              props: { load_time: pageLoadTime },
            })
          }

          // Log in development
          if (process.env.NODE_ENV === 'development') {
            console.log('[Performance] Page load time:', pageLoadTime, 'ms')
          }
        }, 0)
      })
    }
  }, [])

  return null
}
