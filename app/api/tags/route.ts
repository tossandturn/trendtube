import { NextResponse } from 'next/server'
import { getAllTags, getTrendsByTag } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tag = searchParams.get('tag')
  try {
    if (tag) {
      const trends = getTrendsByTag(tag)
      return NextResponse.json({ tag, trends })
    }
    const tags = getAllTags()
    return NextResponse.json({ tags })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
