'use client'

import { useState, useEffect, useRef } from 'react'

export default function VideoPlayer({ videoId, thumbnail }: { videoId: string; thumbnail: string }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      if (!loaded) setError(true)
    }, 5000)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [loaded])

  return (
    <div className="aspect-video w-full rounded-2xl overflow-hidden bg-zinc-900 relative">
      <iframe
        className={`w-full h-full absolute inset-0 ${error ? 'hidden' : ''}`}
        src={`https://www.youtube.com/embed/${videoId}?rel=0`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={() => {
          setLoaded(true)
          if (timerRef.current) clearTimeout(timerRef.current)
        }}
      />

      {/* Fallback */}
      {(error || !loaded) && (
        <div className={`absolute inset-0 flex flex-col items-center justify-center ${loaded ? 'hidden' : ''}`}
        >
          <img
            src={thumbnail}
            alt="Video thumbnail"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="relative z-10 text-center px-6"
          >
            {!error && (
              <div className="w-10 h-10 border-2 border-zinc-600 border-t-white rounded-full animate-spin mx-auto mb-4" />
            )}
            {error && (
              <>
                <p className="text-zinc-400 text-sm mb-4">
                  Unable to load video player.
                </p>
                <a
                  href={`https://www.youtube.com/watch?v=${videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 rounded-xl font-bold text-sm transition"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch on YouTube
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
