import { NextResponse } from 'next/server'
import { getSavedTrends, saveTrend, unsaveTrend, isTrendSaved } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = Number(searchParams.get('userId'))
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  try {
    const trends = getSavedTrends(userId)
    return NextResponse.json({ trends })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId, trendId } = await request.json()
    if (!userId || !trendId) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    saveTrend(Number(userId), Number(trendId))
    return NextResponse.json({ saved: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId, trendId } = await request.json()
    if (!userId || !trendId) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    unsaveTrend(Number(userId), Number(trendId))
    return NextResponse.json({ saved: false })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
