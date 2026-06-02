'use client'

import { useState } from 'react'
import jsPDF from 'jspdf'

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
  const [showShareMenu, setShowShareMenu] = useState(false)
  const videoId = video.id
  const title = video.snippet?.title || 'Untitled'
  const channelTitle = video.snippet?.channelTitle || 'Unknown'
  const views = video.statistics?.viewCount || '0'
  const likes = video.statistics?.likeCount || '0'
  const comments = video.statistics?.commentCount || '0'
  const publishedAt = video.snippet?.publishedAt || ''

  const youtubeUrl = `https://youtube.com/watch?v=${videoId}`
  const analysisUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://tubefission.com'}/video/${videoId}`

  const engagementRate = views !== '0'
    ? (((parseInt(likes) + parseInt(comments) * 2) / parseInt(views)) * 100).toFixed(2)
    : '0'

  function generatePDF() {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    let y = 20

    doc.setFillColor(17, 24, 39)
    doc.rect(0, 0, pageWidth, 50, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.text('TubeFission Analysis Report', margin, 35)

    y = 60
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(10)
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y)
    doc.text(`Report ID: ${videoId}`, pageWidth - margin - 60, y)

    y = 80
    doc.setTextColor(17, 24, 39)
    doc.setFontSize(16)
    doc.text('Video Information', margin, y)

    y += 15
    doc.setFontSize(12)
    doc.setTextColor(60, 60, 60)
    const displayTitle = title.length > 80 ? title.substring(0, 80) + '...' : title
    doc.text(`Title: ${displayTitle}`, margin, y)

    y += 10
    doc.text(`Channel: ${channelTitle}`, margin, y)

    y += 10
    doc.text(`Published: ${publishedAt ? new Date(publishedAt).toLocaleDateString() : 'N/A'}`, margin, y)

    y += 10
    doc.text(`YouTube URL: ${youtubeUrl}`, margin, y)

    y += 25
    doc.setTextColor(17, 24, 39)
    doc.setFontSize(16)
    doc.text('Performance Metrics', margin, y)

    y += 15
    const metrics = [
      { label: 'Views', value: parseInt(views).toLocaleString() },
      { label: 'Likes', value: parseInt(likes).toLocaleString() },
      { label: 'Comments', value: parseInt(comments).toLocaleString() },
      { label: 'Engagement', value: `${engagementRate}%` },
    ]

    y += 20
    doc.setFontSize(12)
    metrics.forEach((metric) => {
      doc.text(`${metric.label}: ${metric.value}`, margin, y)
      y += 10
    })

    doc.save(`tubefission-report-${videoId}.pdf`)
  }

  async function copyVideoUrl() {
    try {
      await navigator.clipboard.writeText(youtubeUrl)
      alert('YouTube URL copied to clipboard!')
    } catch {
      alert('Failed to copy URL')
    }
  }

  function shareToSocial(platform: string) {
    const text = encodeURIComponent(`Check out this analysis on TubeFission: ${title} by ${channelTitle}`)
    const url = encodeURIComponent(analysisUrl)

    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      telegram: `https://t.me/share/url?url=${url}&text=${text}`,
    }

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400')
    }
    setShowShareMenu(false)
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={generatePDF}
        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition flex items-center gap-2"
      >
        <span>📄</span> Export PDF Report
      </button>
      <button
        onClick={copyVideoUrl}
        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition flex items-center gap-2"
      >
        <span>🔗</span> Copy Video URL
      </button>
      <div className="relative">
        <button
          onClick={() => setShowShareMenu(!showShareMenu)}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition flex items-center gap-2"
        >
          <span>📱</span> Share Analysis
        </button>

        {showShareMenu && (
          <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-200 p-3 z-50 min-w-[200px]">
            <div className="space-y-2">
              <button onClick={() => shareToSocial('twitter')} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition text-left">
                <span className="text-blue-400 font-bold">X</span>
                <span className="text-sm">Twitter / X</span>
              </button>
              <button onClick={() => shareToSocial('facebook')} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition text-left">
                <span className="text-blue-600 font-bold">f</span>
                <span className="text-sm">Facebook</span>
              </button>
              <button onClick={() => shareToSocial('linkedin')} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition text-left">
                <span className="text-blue-700 font-bold">in</span>
                <span className="text-sm">LinkedIn</span>
              </button>
              <button onClick={() => shareToSocial('whatsapp')} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition text-left">
                <span className="text-green-500">📱</span>
                <span className="text-sm">WhatsApp</span>
              </button>
              <button onClick={() => shareToSocial('telegram')} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition text-left">
                <span className="text-blue-500">✈️</span>
                <span className="text-sm">Telegram</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
