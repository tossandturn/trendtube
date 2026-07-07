import { NextResponse } from 'next/server'
import { extractTrendsFromVideos, getTrendsByCategoryFromReal } from '@/lib/trend-extractor'
import { getRegion } from '@/lib/region-server'
import { REGIONS, type Region } from '@/lib/region'
import { getCachedTrendBoard } from '@/lib/trend-board'

function normalizeRegion(region: string | null): Region | null {
  if (!region) return null
  if (!REGIONS.includes(region as Region)) return 'US'
  return region === 'GLOBAL' ? 'US' : region as Region
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const region = normalizeRegion(searchParams.get('region')) || await getRegion()

  try {
    const board = await getCachedTrendBoard(region)
    const videos = board.sections.flatMap((section) => section.videos.map((item) => item.video))
    const allTrends = extractTrendsFromVideos(videos, region, 40)
    const trends = category ? getTrendsByCategoryFromReal(allTrends, category) : allTrends
    return NextResponse.json({
      region,
      snapshotAt: board.generatedAt,
      refreshCadence: board.refreshCadence,
      videosTracked: board.videosTracked,
      trends,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch trends' }, { status: 500 })
  }
}
