'use client'

interface VideoExportProps {
  video: {
    id: string
    snippet?: {
      title?: string
      channelTitle?: string
      description?: string
      publishedAt?: string
    }
    statistics?: {
      viewCount?: string
      likeCount?: string
      commentCount?: string
    }
  }
}

export default function VideoExport({ video }: VideoExportProps) {
  const videoId = video.id
  const title = video.snippet?.title || 'Untitled'
  const channelTitle = video.snippet?.channelTitle || 'Unknown'
  const views = video.statistics?.viewCount || '0'
  const likes = video.statistics?.likeCount || '0'
  const comments = video.statistics?.commentCount || '0'
  const publishedAt = video.snippet?.publishedAt || ''

  const youtubeUrl = `https://youtube.com/watch?v=${videoId}`
  const analysisUrl = `${window.location.origin}/video/${videoId}`

  function exportMetrics() {
    const data = {
      videoId,
      title,
      channelTitle,
      publishedAt,
      statistics: {
        views: parseInt(views),
        likes: parseInt(likes),
        comments: parseInt(comments),
      },
      engagementRate: views !== '0'
        ? (((parseInt(likes) + parseInt(comments) * 2) / parseInt(views)) * 100).toFixed(2)
        : '0',
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `video-analysis-${videoId}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  async function copyVideoUrl() {
    try {
      await navigator.clipboard.writeText(youtubeUrl)
      alert('YouTube URL copied to clipboard!')
    } catch {
      // Fallback
      const textarea = document.createElement('textarea')
      textarea.value = youtubeUrl
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      alert('YouTube URL copied to clipboard!')
    }
  }

  async function shareAnalysis() {
    const shareData = {
      title: `TubeFission Analysis: ${title}`,
      text: `Check out this video analysis on TubeFission: ${title} by ${channelTitle}`,
      url: analysisUrl,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        // User cancelled or share failed
        if ((err as Error).name !== 'AbortError') {
          copyToClipboard(analysisUrl)
        }
      }
    } else {
      copyToClipboard(analysisUrl)
    }
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      alert('Analysis URL copied to clipboard!')
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      alert('Analysis URL copied to clipboard!')
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={exportMetrics}
        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition flex items-center gap-2"
      >
        <span>📊</span> Export Metrics
      </button>
      <button
        onClick={copyVideoUrl}
        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition flex items-center gap-2"
      >
        <span>🔗</span> Copy Video URL
      </button>
      <button
        onClick={shareAnalysis}
        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition flex items-center gap-2"
      >
        <span>📱</span> Share Analysis
      </button>
    </div>
  )
}
