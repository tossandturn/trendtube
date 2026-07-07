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

function hasActionableTrendEvidence(trend: { videoCount: number; totalViews: number }) {
  return trend.videoCount >= 3 && trend.totalViews > 0
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const includeEarlySignals = searchParams.get('includeEarly') === '1'
  const region = normalizeRegion(searchParams.get('region')) || await getRegion()

  try {
    const board = await getCachedTrendBoard(region)
    const videos = board.sections.flatMap((section) => section.videos.map((item) => item.video))
    const allTrends = extractTrendsFromVideos(videos, region, 40)
    const scopedTrends = category ? getTrendsByCategoryFromReal(allTrends, category) : allTrends
    const actionableTrends = scopedTrends.filter(hasActionableTrendEvidence)
    const earlySignals = scopedTrends.filter((trend) => !hasActionableTrendEvidence(trend))

    return NextResponse.json({
      region,
      snapshotAt: board.generatedAt,
      refreshCadence: board.refreshCadence,
      videosTracked: board.videosTracked,
      dataGate: {
        minSourceVideos: 3,
        minTotalViews: 1,
        rule: 'Default trends are decision-ready only. Use includeEarly=1 to inspect 1-2 video early signals.',
      },
      trends: includeEarlySignals ? scopedTrends : actionableTrends,
      earlySignals,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch trends' }, { status: 500 })
  }
}
