'use client'

import { useMemo, useState } from 'react'

interface VideoPlayerProps {
  videoId: string
  thumbnail: string
  title?: string
}

export default function VideoPlayer({ videoId, thumbnail, title = 'YouTube video' }: VideoPlayerProps) {
  const [started, setStarted] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const [loadFailed, setLoadFailed] = useState(false)

  const embedUrl = useMemo(() => {
    const params = new URLSearchParams({
      autoplay: started ? '1' : '0',
      rel: '0',
      modestbranding: '1',
      playsinline: '1',
    })

    return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`
  }, [started, videoId])

  function retryPlayer() {
    setLoadFailed(false)
    setStarted(true)
    setReloadKey((key) => key + 1)
  }

  return (
    <section aria-label="Video player" className="rounded-2xl border border-gray-200 bg-gray-950 shadow-sm overflow-hidden">
      <div className="relative aspect-video w-full bg-gray-950">
        {started && !loadFailed ? (
          <iframe
            key={reloadKey}
            className="absolute inset-0 h-full w-full"
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            onError={() => setLoadFailed(true)}
          />
        ) : (
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="group absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden text-left"
            aria-label={`Play ${title}`}
          >
            <img
              src={thumbnail}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/35" />
            <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-red-600 text-white shadow-2xl shadow-black/30 transition group-hover:scale-105 group-hover:bg-red-500 sm:h-24 sm:w-24">
              <svg className="h-9 w-9 translate-x-0.5 fill-current sm:h-11 sm:w-11" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </button>
        )}

        {loadFailed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950/85 px-6 text-center text-white">
            <p className="mb-4 text-sm text-gray-200">The embedded player could not load for this video.</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={retryPlayer}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-950 transition hover:bg-gray-100"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v6h6M20 20v-6h-6M5 15a7 7 0 0 0 12 3M19 9A7 7 0 0 0 7 6" />
                </svg>
                Retry
              </button>
              <a
                href={`https://www.youtube.com/watch?v=${videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M9 7h8v8" />
                </svg>
                Watch on YouTube
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
