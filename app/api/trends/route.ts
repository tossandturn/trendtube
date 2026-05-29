import { NextResponse } from 'next/server'
import { getAllTrends, getTrendsByCategory } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  try {
    const trends = category ? getTrendsByCategory(category) : getAllTrends()
    return NextResponse.json({ trends })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch trends' }, { status: 500 })
  }
}
