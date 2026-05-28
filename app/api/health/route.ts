import { NextResponse } from 'next/server'
import { runHealthCheck } from '@/lib/monitor'

export const dynamic = 'force-dynamic'

export async function GET() {
  const report = await runHealthCheck()

  const statusCode = report.status === 'healthy' ? 200 : report.status === 'degraded' ? 200 : 503

  return NextResponse.json(report, {
    status: statusCode,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}
