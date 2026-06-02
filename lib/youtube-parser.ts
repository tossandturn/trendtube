/* =========================================================
   YOUTUBE URL PARSER — Extract video/channel IDs from URLs
========================================================= */

export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/, // YouTube Shorts
    /^([a-zA-Z0-9_-]{11})$/, // bare ID
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

export function extractChannelId(url: string): string | null {
  const decodedUrl = decodeURIComponent(url)
  const patterns = [
    /youtube\.com\/channel\/([^\/\?&]+)/,
    /youtube\.com\/c\/([^\/\?&]+)/,
    /youtube\.com\/user\/([^\/\?&]+)/,
    /youtube\.com\/(@[^\/\?&]+)/,
  ]
  for (const p of patterns) {
    const m = decodedUrl.match(p)
    if (m) {
      return m[1]
    }
  }
  return null
}

export function isValidYouTubeUrl(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be')
}
