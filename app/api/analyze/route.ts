import { NextRequest, NextResponse } from 'next/server'
import { fetchChannelById, fetchChannelVideos, fetchVideoById } from '@/lib/api-client'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get('type')
  const id = searchParams.get('id')

  if (!type || !id) {
    return NextResponse.json(
      { error: 'Missing type or id parameter' },
      { status: 400 }
    )
  }

  if (type !== 'channel' && type !== 'video') {
    return NextResponse.json(
      { error: 'Invalid type. Must be "channel" or "video"' },
      { status: 400 }
    )
  }

  try {
    if (type === 'channel') {
      const channel = await fetchChannelById(id)
      if (!channel) {
        return NextResponse.json(
          { error: 'Channel not found' },
          { status: 404 }
        )
      }

      const videos = await fetchChannelVideos(id, 50)

      return NextResponse.json({
        channel,
        videos,
      })
    }

    if (type === 'video') {
      const video = await fetchVideoById(id)
      if (!video) {
        return NextResponse.json(
          { error: 'Video not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        video,
      })
    }
  } catch (error) {
    console.error('Analyze API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    )
  }
}
