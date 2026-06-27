import { NextResponse } from 'next/server'
import { recordAnalyzeAttempt, getSessionAnalyzeCount } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { sessionId, userId } = await req.json()

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }

    // Record the attempt
    await recordAnalyzeAttempt(sessionId, userId)
    const totalAttempts = await getSessionAnalyzeCount(sessionId)

    return NextResponse.json({
      totalAttempts,
      requiresLogin: totalAttempts >= 10 && !userId
    })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to record analyze attempt' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }

    const count = await getSessionAnalyzeCount(sessionId)

    return NextResponse.json({
      totalAttempts: count,
      requiresLogin: count >= 10
    })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to get analyze count' }, { status: 500 })
  }
}
