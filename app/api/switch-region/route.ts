import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const region = searchParams.get('region')
  const redirect = searchParams.get('redirect') || '/'

  if (!region) {
    return NextResponse.redirect(new URL('/', request.url))
  }

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
  const { region } = await request.json()

  if (!region) {
    return NextResponse.json({ error: 'Region required' }, { status: 400 })
  }

  const response = NextResponse.json({ success: true, region })
  response.cookies.set('region', region, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    httpOnly: false,
  })

  return response
}
