import { NextResponse } from 'next/server'
import { getAllTrends } from '@/lib/db'

export async function GET() {
  try {
    const trends = getAllTrends()
    const categories = Array.from(new Set(trends.map(t => t.category).filter(Boolean)))
    return NextResponse.json({ categories })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
