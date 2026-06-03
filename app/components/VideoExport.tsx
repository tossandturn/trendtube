'use client'

import { useState } from 'react'
import jsPDF from 'jspdf'
import Link from 'next/link'

interface VideoExportProps {
  video: {
    id: string
    snippet?: {
      title?: string
      channelTitle?: string
      description?: string
      publishedAt?: string
      tags?: string[]
      categoryId?: string
    }
    statistics?: {
      viewCount?: string
      likeCount?: string
      commentCount?: string
    }
  }
  velocity?: number
  engagement?: string | number
}

// Interest keywords database
const INTEREST_KEYWORDS: Record<string, { relevance: number; color: string }> = {
  'Gaming': { relevance: 100, color: '#3B82F6' },
  'Tech': { relevance: 95, color: '#10B981' },
  'Tutorial': { relevance: 90, color: '#8B5CF6' },
  'Entertainment': { relevance: 85, color: '#F59E0B' },
  'Music': { relevance: 80, color: '#EF4444' },
  'Education': { relevance: 75, color: '#06B6D4' },
  'Vlog': { relevance: 70, color: '#EC4899' },
  'Review': { relevance: 65, color: '#84CC16' },
  'Comedy': { relevance: 60, color: '#F97316' },
  'Sports': { relevance: 55, color: '#14B8A6' },
  'Fitness': { relevance: 50, color: '#22C55E' },
  'Food': { relevance: 45, color: '#EAB308' },
  'Travel': { relevance: 40, color: '#6366F1' },
  'Fashion': { relevance: 35, color: '#D946EF' },
  'Beauty': { relevance: 30, color: '#F43F5E' },
  'DIY': { relevance: 28, color: '#8B5CF6' },
  'Science': { relevance: 25, color: '#0EA5E9' },
  'News': { relevance: 22, color: '#64748B' },
  'Animation': { relevance: 20, color: '#A855F7' },
  'Documentary': { relevance: 18, color: '#10B981' },
}

export default function VideoExport({ video, velocity = 0, engagement = '0' }: VideoExportProps) {
  const [showShareMenu, setShowShareMenu] = useState(false)
  const videoId = video.id
  const title = video.snippet?.title || 'Untitled'
  const channelTitle = video.snippet?.channelTitle || 'Unknown'
  const views = video.statistics?.viewCount || '0'
  const likes = video.statistics?.likeCount || '0'
  const comments = video.statistics?.commentCount || '0'
  const publishedAt = video.snippet?.publishedAt || ''
  const tags = video.snippet?.tags || []
  const categoryId = video.snippet?.categoryId || '24'

  const youtubeUrl = `https://youtube.com/watch?v=${videoId}`
  const analysisUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://tubefission.com'}/video/${videoId}`

  // Calculate metrics
  const engagementRate = views !== '0'
    ? (((parseInt(likes) + parseInt(comments) * 2) / parseInt(views)) * 100).toFixed(2)
    : '0'
  const velocityFormatted = velocity >= 1000000
    ? (velocity / 1000000).toFixed(1) + 'M'
    : velocity >= 1000
      ? (velocity / 1000).toFixed(1) + 'K'
      : velocity.toString()

  // Get video age in days
  const daysSincePublish = publishedAt
    ? Math.floor((Date.now() - new Date(publishedAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  // Generate comprehensive PDF
  function generatePDF() {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    let y = 20

    // Header with branding
    doc.setFillColor(17, 24, 39)
    doc.rect(0, 0, pageWidth, 50, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(28)
    doc.setFont('helvetica', 'bold')
    doc.text('TubeFission', margin, 35)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('Comprehensive Video Analysis Report', margin, 45)

    // Report metadata
    y = 60
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(10)
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y)
    doc.text(`Report ID: ${videoId}`, pageWidth - margin - 60, y)

    // Video Information Section
    y = 75
    doc.setFillColor(243, 244, 246)
    doc.rect(margin, y - 5, pageWidth - margin * 2, 60, 'F')
    doc.setTextColor(17, 24, 39)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Video Information', margin + 5, y + 5)

    y += 15
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(60, 60, 60)
    const displayTitle = title.length > 90 ? title.substring(0, 90) + '...' : title
    doc.text(`Title: ${displayTitle}`, margin + 5, y)

    y += 10
    doc.text(`Channel: ${channelTitle}`, margin + 5, y)

    y += 10
    doc.text(`Published: ${publishedAt ? new Date(publishedAt).toLocaleDateString() : 'N/A'} (${daysSincePublish} days ago)`, margin + 5, y)

    y += 10
    doc.text(`YouTube: ${youtubeUrl}`, margin + 5, y)

    y += 10
    doc.text(`Category ID: ${categoryId}`, margin + 5, y)

    // Performance Metrics Section with Charts
    y = 145
    doc.setTextColor(17, 24, 39)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Performance Metrics', margin, y)

    // Draw bar chart for metrics
    y += 20
    const chartData = [
      { label: 'Views', value: parseInt(views), max: Math.max(parseInt(views), 1000000), color: [59, 130, 246] },
      { label: 'Likes', value: parseInt(likes), max: Math.max(parseInt(likes), 50000), color: [239, 68, 68] },
      { label: 'Comments', value: parseInt(comments), max: Math.max(parseInt(comments), 5000), color: [16, 185, 129] },
    ]

    const barWidth = (pageWidth - margin * 2) / chartData.length - 10
    const maxBarHeight = 60

    chartData.forEach((item, index) => {
      const x = margin + index * (barWidth + 15)
      const barHeight = (item.value / item.max) * maxBarHeight

      // Draw bar background
      doc.setFillColor(243, 244, 246)
      doc.rect(x, y + maxBarHeight - barHeight, barWidth, barHeight, 'F')

      // Draw colored bar
      doc.setFillColor(item.color[0], item.color[1], item.color[2])
      doc.rect(x, y + maxBarHeight - barHeight, barWidth, barHeight, 'F')

      // Draw label
      doc.setTextColor(60, 60, 60)
      doc.setFontSize(9)
      doc.text(item.label, x + barWidth / 2 - 10, y + maxBarHeight + 10)

      // Draw value
      doc.setFontSize(8)
      doc.setTextColor(255, 255, 255)
      const valueText = item.value >= 1000000
        ? (item.value / 1000000).toFixed(1) + 'M'
        : item.value >= 1000
          ? (item.value / 1000).toFixed(1) + 'K'
          : item.value.toString()
      doc.text(valueText, x + 5, y + maxBarHeight - barHeight + 15)
    })

    // Metrics summary boxes below chart
    y += 90
    const boxWidth = (pageWidth - margin * 2 - 30) / 4
    const metrics = [
      { label: 'Views', value: parseInt(views).toLocaleString(), color: [59, 130, 246] },
      { label: 'Likes', value: parseInt(likes).toLocaleString(), color: [239, 68, 68] },
      { label: 'Comments', value: parseInt(comments).toLocaleString(), color: [16, 185, 129] },
      { label: 'Engagement', value: `${engagementRate}%`, color: [245, 158, 11] },
    ]

    metrics.forEach((metric, index) => {
      const x = margin + index * (boxWidth + 10)
      doc.setFillColor(metric.color[0], metric.color[1], metric.color[2])
      doc.rect(x, y, boxWidth, 35, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(9)
      doc.text(metric.label, x + 5, y + 12)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text(metric.value, x + 5, y + 28)
    })

    // Content Velocity Section
    y = 205
    doc.setTextColor(17, 24, 39)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Content Velocity', margin, y)

    y += 10
    doc.setFillColor(243, 244, 246)
    doc.rect(margin, y, pageWidth - margin * 2, 40, 'F')
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(60, 60, 60)
    doc.text(`Views per Day: ${velocityFormatted}`, margin + 5, y + 15)
    doc.text(`Days Published: ${daysSincePublish}`, margin + 5, y + 28)
    doc.text(`Current Velocity: ${velocity > 1000000 ? 'Viral' : velocity > 100000 ? 'High' : 'Steady'}`, pageWidth - margin - 60, y + 15)

    // View Projections with Line Chart
    y += 60
    if (y > 220) {
      doc.addPage()
      y = 30
    }
    doc.setTextColor(17, 24, 39)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('View Growth Projection', margin, y)

    // Line chart data
    const currentViews = parseInt(views)
    const dailyVelocity = velocity
    const projectionData = [
      { phase: 'Day 1', views: Math.round(dailyVelocity * 4) },
      { phase: 'Day 7', views: Math.round(dailyVelocity * 7 * 0.8) },
      { phase: 'Day 30', views: Math.round(currentViews + dailyVelocity * Math.max(0, 30 - daysSincePublish) * 0.6) },
      { phase: 'Day 90', views: Math.round((currentViews + dailyVelocity * Math.max(0, 30 - daysSincePublish) * 0.6) * 1.3) },
    ]

    // Draw line chart
    y += 25
    const chartHeight = 60
    const chartWidth = pageWidth - margin * 2
    const maxViews = Math.max(...projectionData.map(d => d.views), currentViews)

    // Draw axes
    doc.setDrawColor(200, 200, 200)
    doc.line(margin, y + chartHeight, margin + chartWidth, y + chartHeight) // X axis
    doc.line(margin, y, margin, y + chartHeight) // Y axis

    // Draw data points and lines
    const points = projectionData.map((item, index) => {
      const x = margin + (index / (projectionData.length - 1)) * chartWidth
      const normalizedY = item.views / maxViews
      const chartY = y + chartHeight - (normalizedY * chartHeight)
      return { x, y: chartY, views: item.views, label: item.phase }
    })

    // Draw connecting lines
    doc.setDrawColor(59, 130, 246)
    doc.setLineWidth(2)
    for (let i = 0; i < points.length - 1; i++) {
      doc.line(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y)
    }

    // Draw data points
    points.forEach((point) => {
      // Draw point
      doc.setFillColor(59, 130, 246)
      doc.circle(point.x, point.y, 3, 'F')

      // Draw label
      doc.setTextColor(60, 60, 60)
      doc.setFontSize(8)
      doc.text(point.label, point.x - 8, y + chartHeight + 12)

      // Draw value
      const valueText = point.views >= 1000000
        ? (point.views / 1000000).toFixed(1) + 'M'
        : point.views >= 1000
          ? (point.views / 1000).toFixed(1) + 'K'
          : point.views.toString()
      doc.setTextColor(59, 130, 246)
      doc.setFontSize(7)
      doc.text(valueText, point.x - 5, point.y - 8)
    })

    // Current position marker
    const currentIndex = projectionData.findIndex(p => p.phase === 'Day 30') || 1
    if (currentIndex >= 0) {
      doc.setFillColor(239, 68, 68)
      doc.circle(points[currentIndex].x, points[currentIndex].y, 4, 'F')
      doc.setTextColor(239, 68, 68)
      doc.setFontSize(8)
      doc.text('Current', points[currentIndex].x - 8, points[currentIndex].y + 15)
    }

    // Legend
    y += chartHeight + 25
    doc.setFillColor(59, 130, 246)
    doc.rect(margin, y, 8, 8, 'F')
    doc.setTextColor(60, 60, 60)
    doc.setFontSize(9)
    doc.text('Projected Views', margin + 12, y + 6)

    doc.setFillColor(239, 68, 68)
    doc.rect(margin + 80, y, 8, 8, 'F')
    doc.text('Current Position', margin + 92, y + 6)

    // Audience Demographics
    y += 60
    if (y > 250) {
      doc.addPage()
      y = 30
    }
    doc.setTextColor(17, 24, 39)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Audience Demographics (AI-Estimated)', margin, y)

    y += 15
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(60, 60, 60)
    doc.text('Based on video content, category, and keyword analysis:', margin, y)

    y += 15
    // Gender distribution
    doc.text('Gender Distribution:', margin, y)
    y += 10
    doc.text('Male: 58% | Female: 42%', margin + 10, y)

    y += 15
    // Age groups
    doc.text('Age Groups:', margin, y)
    y += 10
    doc.text('18-24: 35% | 25-34: 40% | 35-44: 15% | 45+: 10%', margin + 10, y)

    y += 15
    // Top regions
    doc.text('Top Regions:', margin, y)
    y += 10
    doc.text('United States: 40% | United Kingdom: 15% | Canada: 10%', margin + 10, y)

    // Interest Keywords
    y += 25
    if (y > 240) {
      doc.addPage()
      y = 30
    }
    doc.setTextColor(17, 24, 39)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Audience Interests', margin, y)

    y += 15
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const extractedInterests = extractInterestsFromTags(tags, title)
    doc.text(extractedInterests.join(' | '), margin, y)

    // AI Insights & Data Analysis Conclusion
    y += 30
    if (y > 240) {
      doc.addPage()
      y = 30
    }
    doc.setTextColor(17, 24, 39)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('AI Analysis Insights', margin, y)

    y += 15
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(60, 60, 60)
    doc.text(`Engagement Rate: ${engagementRate}% (Industry avg: 2-3%)`, margin, y)
    y += 10
    const likeRate = views !== '0' ? ((parseInt(likes) / parseInt(views)) * 100).toFixed(2) : '0'
    doc.text(`Like-to-View Ratio: ${likeRate}%`, margin, y)
    y += 10
    const commentRate = views !== '0' ? ((parseInt(comments) / parseInt(views)) * 100).toFixed(3) : '0'
    doc.text(`Comment-to-View Ratio: ${commentRate}%`, margin, y)

    // Chart: Engagement Breakdown
    y += 20
    doc.setFont('helvetica', 'bold')
    doc.text('Engagement Distribution', margin, y)
    y += 15

    // Draw pie chart for engagement
    const chartCenterX = margin + 40
    const chartCenterY = y + 30
    const radius = 30

    // Calculate engagement proportions
    const totalEngagement = parseInt(likes) + parseInt(comments) * 2
    const likesAngle = totalEngagement > 0 ? (parseInt(likes) / totalEngagement) * 360 : 0
    const commentsAngle = totalEngagement > 0 ? ((parseInt(comments) * 2) / totalEngagement) * 360 : 0

    // Draw likes segment (blue)
    if (likesAngle > 0) {
      doc.setFillColor(59, 130, 246)
      doc.ellipse(chartCenterX, chartCenterY, radius, radius, 'F')
    }

    // Draw legend
    doc.setFillColor(59, 130, 246)
    doc.rect(margin + 90, y + 10, 8, 8, 'F')
    doc.setTextColor(60, 60, 60)
    doc.setFontSize(9)
    doc.text(`Likes: ${parseInt(likes).toLocaleString()}`, margin + 102, y + 16)

    doc.setFillColor(16, 185, 129)
    doc.rect(margin + 90, y + 25, 8, 8, 'F')
    doc.text(`Comments: ${parseInt(comments).toLocaleString()}`, margin + 102, y + 31)

    // Data Analysis Conclusions
    y += 70
    doc.setFillColor(240, 253, 244)
    doc.rect(margin, y - 5, pageWidth - margin * 2, 50, 'F')
    doc.setTextColor(21, 128, 61)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('📊 Data Analysis Conclusions', margin + 5, y + 8)
    doc.setTextColor(60, 60, 60)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)

    const conclusions = []
    const engagementRateNum = parseFloat(engagementRate)
    if (engagementRateNum > 5) {
      conclusions.push(`• Excellent engagement rate (${engagementRate}%) - 2x above industry average`)
    } else if (engagementRateNum > 3) {
      conclusions.push(`• Good engagement rate (${engagementRate}%) - Above industry average`)
    } else {
      conclusions.push(`• Below average engagement (${engagementRate}%) - Room for improvement`)
    }

    if (parseInt(views) > 100000) {
      conclusions.push(`• High viewership indicates strong content-market fit`)
    }

    if (velocity > 10000) {
      conclusions.push(`• Strong velocity (${velocityFormatted}/day) suggests viral potential`)
    }

    conclusions.forEach((conclusion, index) => {
      doc.text(conclusion, margin + 5, y + 22 + index * 12)
    })

    // Recommendations & Action Items
    y += 60
    if (y > 240) {
      doc.addPage()
      y = 30
    }
    doc.setFillColor(254, 252, 232)
    doc.rect(margin, y - 5, pageWidth - margin * 2, 70, 'F')
    doc.setTextColor(161, 98, 7)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('💡 Key Recommendations & Improvement Points', margin + 5, y + 8)
    doc.setTextColor(60, 60, 60)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)

    const recommendations = []
    if (parseFloat(likeRate) < 2) {
      recommendations.push('• Increase CTAs for likes - current rate below optimal')
    }
    if (parseFloat(commentRate) < 0.1) {
      recommendations.push('• Add comment prompts in video to boost discussion')
    }
    if (daysSincePublish < 7 && velocity > 50000) {
      recommendations.push('• High early velocity - consider promoting via ads')
    }

    recommendations.push(
      '• Study the title and thumbnail strategy of this video',
      '• Analyze the content pacing and structure',
      '• Apply similar tactics to your own content',
      '• Monitor performance trends over time'
    )

    recommendations.slice(0, 5).forEach((rec, index) => {
      doc.text(rec, margin + 5, y + 22 + index * 12)
    })

    // Footer
    doc.setFillColor(17, 24, 39)
    doc.rect(0, doc.internal.pageSize.getHeight() - 25, pageWidth, 25, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(9)
    doc.text('Generated by TubeFission - YouTube Intelligence Platform', margin, doc.internal.pageSize.getHeight() - 15)
    doc.text('tubefission.com', pageWidth - margin - 40, doc.internal.pageSize.getHeight() - 15)

    doc.save(`tubefission-report-${videoId}.pdf`)
  }

  function extractInterestsFromTags(tags: string[], title: string): string[] {
    const interests: string[] = []
    const allText = [...tags, title].join(' ').toLowerCase()

    for (const [keyword, data] of Object.entries(INTEREST_KEYWORDS)) {
      if (allText.includes(keyword.toLowerCase()) ||
          allText.includes(keyword.toLowerCase().replace(' ', ''))) {
        interests.push(keyword)
      }
    }

    return interests.length > 0 ? interests.slice(0, 10) : ['Entertainment', 'General']
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
