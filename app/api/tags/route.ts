import { NextResponse } from 'next/server'
import { extractTrendsFromRegion, getAllTagsFromReal } from '@/lib/trend-extractor'
import { getRegion } from '@/lib/region-server'
import { REGIONS, type Region } from '@/lib/region'

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
    const allTrends = await extractTrendsFromRegion(region, 50)
    if (tag) {
      const normalizedTag = tag.toLowerCase()
      const trends = allTrends.filter((trend) =>
        trend.tags.some((item) => item.toLowerCase() === normalizedTag) ||
        trend.keyword.toLowerCase() === normalizedTag
      )
      return NextResponse.json({ region, tag, trends })
    }
    const tags = getAllTagsFromReal(allTrends)
    return NextResponse.json({ region, tags })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
