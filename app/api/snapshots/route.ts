import { NextResponse } from 'next/server'
import { upsertSnapshot, getLatestSnapshot, getAllTrends } from '@/lib/db'
import { fetchTrendingVideos } from '@/lib/api-client'
import { getViewVelocity, getEngagementRate } from '@/lib/analytics'

export async function POST() {
  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || ''
  if (!API_KEY) {
    return NextResponse.json({ error: 'No API key' }, { status: 500 })
  }

  const today = new Date().toISOString().split('T')[0]
  const trends = getAllTrends()
  let updated = 0

  for (const trend of trends) {
    try {
      // Derive search query from trend title/slug
      const query = trend.slug.replace(/-/g, ' ')
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=25&order=viewCount&key=${API_KEY}`
      const res = await fetch(url, { next: { revalidate: 0 } })
      if (!res.ok) continue
      const data = await res.json()
      const items = data.items || []

      // Fetch stats for these videos
      const ids = items.map((i: any) => i.id?.videoId).filter(Boolean).join(',')
      if (!ids) continue
      const statsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${ids}&key=${API_KEY}`,
        { next: { revalidate: 0 } }
      )
      if (!statsRes.ok) continue
      const statsData = await statsRes.json()
      const statsMap = new Map<string, any>((statsData.items || []).map((s: any) => [s.id, s.statistics]))

      let totalViews = 0
      let totalLikes = 0
      let totalComments = 0
      let creatorSet = new Set<string>()
      let totalVelocity = 0

      for (const item of items) {
        const stat = statsMap.get(item.id?.videoId)
        if (!stat) continue
        const views = Number(stat.viewCount || 0)
        const likes = Number(stat.likeCount || 0)
        const comments = Number(stat.commentCount || 0)
        const snippet = item.snippet
        const publishedAt = new Date(snippet?.publishedAt || Date.now())
        const ageDays = Math.max(1, (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60 * 24))
        const velocity = views / ageDays

        totalViews += views
        totalLikes += likes
        totalComments += comments
        creatorSet.add(snippet?.channelId || snippet?.channelTitle)
        totalVelocity += velocity
      }

      const count = items.length || 1
      const avgVelocity = Math.round(totalVelocity / count)
      const engagement = totalViews > 0 ? ((totalLikes + totalComments * 2) / totalViews) * 100 : 0
      const saturation = Math.min(100, creatorSet.size * 2)
      const breakout = Math.min(100, avgVelocity / 5000 + engagement * 5)

      // Calculate predicted peak hours based on velocity (deterministic)
      // Higher velocity = sooner peak, lower velocity = later peak
      const predictedPeakHours = Math.floor(72 - Math.min(66, avgVelocity / 10000))

      upsertSnapshot({
        trend_id: trend.id,
        velocity: avgVelocity,
        views: totalViews,
        likes: totalLikes,
        comments: totalComments,
        creator_count: creatorSet.size,
        saturation_score: saturation,
        breakout_score: breakout,
        predicted_peak_hours: predictedPeakHours,
        snapshot_date: today,
      })
      updated++
    } catch (e) {
      console.error(`Snapshot failed for ${trend.slug}:`, e)
    }
  }

  return NextResponse.json({ updated, date: today })
}
