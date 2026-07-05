import { NextResponse } from 'next/server'
import { getPrisma, getValidSessionByToken } from '@/lib/auth-db'

const WORKSPACE_TARGET_ID = 'workspace-state'
const MAX_ITEMS_PER_BUCKET = 100

type WorkspacePayload = {
  opportunities?: unknown[]
  watchlist?: unknown[]
  alerts?: unknown[]
  compareIds?: unknown[]
}

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }

function getBearerToken(req: Request): string | null {
  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) return null
  return auth.slice('Bearer '.length).trim()
}

async function requireUser(req: Request) {
  const token = getBearerToken(req)
  if (!token) return null
  const session = await getValidSessionByToken(token)
  return session?.user ?? null
}

function limitArray(value: unknown): JsonValue[] {
  if (!Array.isArray(value)) return []
  return JSON.parse(JSON.stringify(value.slice(0, MAX_ITEMS_PER_BUCKET))) as JsonValue[]
}

function normalizePayload(payload: WorkspacePayload): { [key: string]: JsonValue } {
  return {
    opportunities: limitArray(payload.opportunities),
    watchlist: limitArray(payload.watchlist),
    alerts: limitArray(payload.alerts),
    compareIds: limitArray(payload.compareIds),
    syncedAt: new Date().toISOString(),
  }
}

export async function GET(req: Request) {
  try {
    const user = await requireUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = getPrisma()
    const snapshot = await db.userAnalysis.findFirst({
      where: {
        userId: user.id,
        type: 'workspace',
        targetId: WORKSPACE_TARGET_ID,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        emailVerified: user.emailVerified,
      },
      workspace: snapshot?.data ?? null,
      syncedAt: snapshot?.createdAt ?? null,
    })
  } catch (err) {
    console.error('Workspace sync GET error:', err)
    return NextResponse.json({ error: 'Failed to load workspace' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data = normalizePayload(body)
    const db = getPrisma()

    const existingSnapshot = await db.userAnalysis.findFirst({
      where: {
        userId: user.id,
        type: 'workspace',
        targetId: WORKSPACE_TARGET_ID,
      },
      orderBy: { createdAt: 'desc' },
    })
    const snapshot = existingSnapshot
      ? await db.userAnalysis.update({
          where: { id: existingSnapshot.id },
          data: { data },
        })
      : await db.userAnalysis.create({
          data: {
            userId: user.id,
            type: 'workspace',
            targetId: WORKSPACE_TARGET_ID,
            data,
          },
        })

    return NextResponse.json({
      success: true,
      workspace: snapshot.data,
      syncedAt: snapshot.createdAt,
    })
  } catch (err) {
    console.error('Workspace sync POST error:', err)
    return NextResponse.json({ error: 'Failed to sync workspace' }, { status: 500 })
  }
}
