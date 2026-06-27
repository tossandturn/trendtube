'use client'

import { useState, useEffect, useRef } from 'react'

export default function VideoPlayer({ videoId, thumbnail }: { videoId: string; thumbnail: string }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    // 延长超时时间到10秒，给嵌入播放器更多加载时间
    timerRef.current = setTimeout(() => {
      if (!loaded) {
        console.log('[VideoPlayer] Load timeout, showing fallback')
        setError(true)
      }
    }, 10000)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [loaded])

  // 使用 youtube-nocookie 避免第三方 Cookie 问题
  // 添加 autoplay=0 和 mute=0 提高兼容性
  // origin 参数帮助 YouTube 识别来源
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&autoplay=0&mute=0&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`

  const handleRetry = () => {
    setError(false)
    setLoaded(false)
    // 强制重新加载 iframe
    if (iframeRef.current) {
      iframeRef.current.src = embedUrl
    }
    // 重新设置超时
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      if (!loaded) setError(true)
    }, 10000)
  }

  return (
    <div className="aspect-video w-full rounded-2xl overflow-hidden bg-zinc-900 relative">
      <iframe
        ref={iframeRef}
        className={`w-full h-full absolute inset-0 ${error ? 'hidden' : 'block'}`}
        src={embedUrl}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        onLoad={() => {
          console.log('[VideoPlayer] Iframe loaded successfully')
          setLoaded(true)
          if (timerRef.current) clearTimeout(timerRef.current)
        }}
        onError={() => {
          console.log('[VideoPlayer] Iframe error')
          setError(true)
          if (timerRef.current) clearTimeout(timerRef.current)
        }}
        sandbox="allow-scripts allow-same-origin allow-presentation"
        title="YouTube video player"
      />

      {/* Fallback when loading or error */}
      {(!loaded || error) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <img
            src={thumbnail}
            alt="Video thumbnail"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="relative z-10 text-center px-6">
            {!error && (
              <>
                <div className="w-12 h-12 border-3 border-zinc-500 border-t-white rounded-full animate-spin mx-auto mb-4" />
                <p className="text-zinc-300 text-sm">Loading player...</p>
              </>
            )}
            {error && (
              <>
                <p className="text-zinc-200 text-base mb-4 font-medium">
                  视频播放器加载失败
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleRetry}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-700 hover:bg-zinc-600 rounded-xl font-medium text-sm transition"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    重试
                  </button>
                  <a
                    href={`https://www.youtube.com/watch?v=${videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 rounded-xl font-medium text-sm transition"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    在 YouTube 上观看
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
