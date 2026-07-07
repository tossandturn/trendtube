import { NextResponse } from 'next/server'
import { extractTrendsFromVideos, getAllTagsFromReal } from '@/lib/trend-extractor'
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
  const tag = searchParams.get('tag')
  const region = normalizeRegion(searchParams.get('region')) || await getRegion()

  try {
    const board = await getCachedTrendBoard(region)
    const videos = board.sections.flatMap((section) => section.videos.map((item) => item.video))
    const allTrends = extractTrendsFromVideos(videos, region, 40)
    if (tag) {
      const normalizedTag = tag.toLowerCase()
      const trends = allTrends.filter((trend) =>
        trend.tags.some((item) => item.toLowerCase() === normalizedTag) ||
        trend.keyword.toLowerCase() === normalizedTag
      )
      return NextResponse.json({ region, snapshotAt: board.generatedAt, tag, trends })
    }
    const tags = getAllTagsFromReal(allTrends)
    return NextResponse.json({ region, snapshotAt: board.generatedAt, tags })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
