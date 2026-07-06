import { NextResponse } from 'next/server'
import { extractTrendsFromRegion, getTrendsByCategoryFromReal } from '@/lib/trend-extractor'
import { getRegion } from '@/lib/region-server'
import { REGIONS, type Region } from '@/lib/region'

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
    const allTrends = await extractTrendsFromRegion(region, 50)
    const trends = category ? getTrendsByCategoryFromReal(allTrends, category) : allTrends
    return NextResponse.json({ region, trends })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch trends' }, { status: 500 })
  }
}
