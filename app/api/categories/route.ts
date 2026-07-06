import { NextResponse } from 'next/server'
import { extractTrendsFromRegion, getAllCategoriesFromReal } from '@/lib/trend-extractor'
import { getRegion } from '@/lib/region-server'
import { REGIONS, type Region } from '@/lib/region'

function normalizeRegion(region: string | null): Region | null {
  if (!region) return null
  if (!REGIONS.includes(region as Region)) return 'US'
  return region === 'GLOBAL' ? 'US' : region as Region
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const region = normalizeRegion(searchParams.get('region')) || await getRegion()

  try {
    const trends = await extractTrendsFromRegion(region, 50)
    const categories = getAllCategoriesFromReal(trends)
    return NextResponse.json({ region, categories })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
