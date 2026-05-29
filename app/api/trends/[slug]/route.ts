import { NextResponse } from 'next/server'
import { getTrendBySlug, getTrendSnapshots, getLatestSnapshot, getTagsForTrend } from '@/lib/db'

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const trend = getTrendBySlug(slug)
    if (!trend) {
      return NextResponse.json({ error: 'Trend not found' }, { status: 404 })
    }
    const snapshots = getTrendSnapshots(trend.id, 365)
    const latest = getLatestSnapshot(trend.id)
    const tags = getTagsForTrend(trend.id)
    return NextResponse.json({ trend, snapshots, latest, tags })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch trend' }, { status: 500 })
  }
}
