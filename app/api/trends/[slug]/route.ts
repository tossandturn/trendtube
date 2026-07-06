import { NextResponse } from 'next/server'
import {
  detectCategory,
  extractTrendsFromRegion,
  type RealTrend,
  slugify,
} from '@/lib/trend-extractor'
import { searchYouTube, type YouTubeVideo } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'
import { REGIONS, type Region } from '@/lib/region'

function normalizeRegion(region: string | null): Region | null {
  if (!region) return null
  if (!REGIONS.includes(region as Region)) return 'US'
  return region === 'GLOBAL' ? 'US' : region as Region
}

function titleCase(text: string): string {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function buildTrendFromVideos(slug: string, videos: YouTubeVideo[], region: Region): RealTrend | null {
  const keyword = slug.replace(/-/g, ' ').trim()
  const terms = keyword
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.length > 2 && !['trend', 'trends', '2026'].includes(term))

  const related = videos.filter((video) => {
    const title = video.snippet?.title?.toLowerCase() || ''
    return terms.length === 0 || terms.some((term) => title.includes(term))
  })

  if (related.length === 0) return null

  const totals = related.reduce(
    (acc, video) => {
      const views = Number(video.statistics?.viewCount || 0)
      const likes = Number(video.statistics?.likeCount || 0)
      const comments = Number(video.statistics?.commentCount || 0)
      const publishedAt = video.snippet?.publishedAt || new Date().toISOString()
      const ageDays = Math.max(0.5, (Date.now() - new Date(publishedAt).getTime()) / (1000 * 60 * 60 * 24))

      acc.views += views
      acc.likes += likes
      acc.comments += comments
      acc.velocity += views / ageDays
      acc.creators.add(video.snippet?.channelTitle || 'unknown')
      return acc
    },
    { views: 0, likes: 0, comments: 0, velocity: 0, creators: new Set<string>() }
  )

  const avgVelocity = Math.round(totals.velocity / related.length)
  const engagementRate = totals.views > 0
    ? ((totals.likes + totals.comments * 2) / totals.views) * 100
    : 0
  const saturationScore = Math.min(100, totals.creators.size * 8)
  const breakoutScore = Math.min(100, avgVelocity / 5000 + engagementRate * 3 + related.length * 4)
  const tags = Array.from(new Set(terms)).slice(0, 5)

  return {
    slug: slugify(keyword) || slug,
    title: titleCase(keyword),
    category: detectCategory(keyword),
    description: `Trend intelligence for ${keyword} in ${region}, based on ${related.length} related videos with ${(totals.views / 1e6).toFixed(1)}M total views.`,
    keyword,
    videoCount: related.length,
    totalViews: totals.views,
    totalLikes: totals.likes,
    totalComments: totals.comments,
    avgVelocity,
    saturationScore,
    breakoutScore,
    creatorCount: totals.creators.size,
    peakHours: Math.max(1, Math.round(48 - breakoutScore * 0.4)),
    tags,
    topVideoIds: related.slice(0, 3).map((video) => video.id),
    region,
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { searchParams } = new URL(request.url)
  const region = normalizeRegion(searchParams.get('region')) || await getRegion()

  try {
    const trends = await extractTrendsFromRegion(region, 50)
    let trend = trends.find((item) => item.slug === slug)

    if (!trend) {
      const query = slug.replace(/-/g, ' ')
      const videos = await searchYouTube(query, 25, 'viewCount')
      trend = buildTrendFromVideos(slug, videos, region) || undefined
    }

    if (!trend) {
      return NextResponse.json({ error: 'Trend not found' }, { status: 404 })
    }

    const latest = {
      velocity: trend.avgVelocity,
      views: trend.totalViews,
      likes: trend.totalLikes,
      comments: trend.totalComments,
      creator_count: trend.creatorCount,
      saturation_score: trend.saturationScore,
      breakout_score: trend.breakoutScore,
      predicted_peak_hours: trend.peakHours,
      snapshot_date: new Date().toISOString().slice(0, 10),
    }
    const snapshots = [latest]

    return NextResponse.json({ region, trend, snapshots, latest, tags: trend.tags })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch trend' }, { status: 500 })
  }
}
