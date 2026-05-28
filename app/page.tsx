import type { Metadata } from 'next'
import TrendingDashboard from './components/TrendingDashboard'
import { fetchTrendingVideos } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'TubeFission — Discover Viral YouTube Trends Before They Explode',
  description: 'Discover exploding YouTube trends, viral Shorts, and creator opportunities before everyone else. Updated daily with AI analysis.',
}

export default async function HomePage() {
  const region = await getRegion()
  const videos = await fetchTrendingVideos(region, 50)

  return <TrendingDashboard initialVideos={videos} initialRegion={region} />
}
