import { NextResponse } from 'next/server'
import { REGIONS, type Region } from '@/lib/region'

function normalizeRegion(region: string): Region {
  if (!REGIONS.includes(region as Region)) return 'US'
  return region === 'GLOBAL' ? 'US' : region as Region
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const regionParam = searchParams.get('region')
  const redirect = searchParams.get('redirect') || '/'

  if (!regionParam) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  const region = normalizeRegion(regionParam)

  // Set cookie and redirect
  const response = NextResponse.redirect(new URL(redirect, request.url))
  response.cookies.set('region', region, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    httpOnly: false,
  })

  return response
}

export async function POST(request: Request) {
  const { region: regionParam } = await request.json()

  if (!regionParam) {
    return NextResponse.json({ error: 'Region required' }, { status: 400 })
  }

  const region = normalizeRegion(regionParam)

  const response = NextResponse.json({ success: true, region })
  response.cookies.set('region', region, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    httpOnly: false,
  })

  return response
}
