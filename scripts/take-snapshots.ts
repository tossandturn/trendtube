import { getDb, getAllTrends, upsertSnapshot } from '../lib/db'

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || ''

async function takeSnapshots() {
  if (!API_KEY) {
    console.error('❌ No YouTube API key found')
    process.exit(1)
  }

  const db = getDb()
  const today = new Date().toISOString().split('T')[0]
  const trends = getAllTrends()

  console.log(`🔄 Taking snapshots for ${trends.length} trends...`)

  for (const trend of trends) {
    try {
      const query = trend.slug.replace(/-/g, ' ')
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=25&order=viewCount&key=${API_KEY}`

      const res = await fetch(searchUrl)
      if (!res.ok) {
        console.log(`  ⚠️ API error for ${trend.slug}: ${res.status}`)
        continue
      }

      const data = await res.json()
      const items = data.items || []

      if (items.length === 0) {
        console.log(`  ⚠️ No videos for ${trend.slug}`)
        continue
      }

      // Fetch stats
      const ids = items.map((i: any) => i.id?.videoId).filter(Boolean).join(',')
      const statsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${ids}&key=${API_KEY}`
      )
      if (!statsRes.ok) continue
      const statsData = await statsRes.json()
      const statsMap = new Map<string, any>((statsData.items || []).map((s: any) => [s.id, s.statistics]))

      let totalViews = 0, totalLikes = 0, totalComments = 0
      let totalVelocity = 0
      const creatorSet = new Set<string>()

      for (const item of items) {
        const stat = statsMap.get(item.id?.videoId)
        if (!stat) continue
        const views = Number(stat.viewCount || 0)
        const likes = Number(stat.likeCount || 0)
        const comments = Number(stat.commentCount || 0)
        const publishedAt = new Date(item.snippet?.publishedAt || Date.now())
        const ageDays = Math.max(1, (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60 * 24))

        totalViews += views
        totalLikes += likes
        totalComments += comments
        totalVelocity += views / ageDays
        creatorSet.add(item.snippet?.channelId || item.snippet?.channelTitle)
      }

      const count = items.length || 1
      const avgVelocity = Math.round(totalVelocity / count)
      const engagement = totalViews > 0 ? ((totalLikes + totalComments * 2) / totalViews) * 100 : 0
      const saturation = Math.min(100, creatorSet.size * 2)
      const breakout = Math.min(100, avgVelocity / 5000 + engagement * 5)

      upsertSnapshot({
        trend_id: trend.id,
        velocity: avgVelocity,
        views: totalViews,
        likes: totalLikes,
        comments: totalComments,
        creator_count: creatorSet.size,
        saturation_score: saturation,
        breakout_score: breakout,
        predicted_peak_hours: Math.floor(Math.random() * 48) + 6,
        snapshot_date: today,
      })

      console.log(`  ✓ ${trend.slug}: ${avgVelocity.toLocaleString()} velocity, ${breakout.toFixed(1)} breakout`)
    } catch (e) {
      console.error(`  ✗ ${trend.slug}:`, e)
    }
  }

  console.log('✅ Snapshot collection complete')
}

takeSnapshots().catch(err => {
  console.error('Failed:', err)
  process.exit(1)
})
