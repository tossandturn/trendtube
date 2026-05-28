import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import VideoPlayer from '@/app/components/VideoPlayer'
import AdBanner from '@/app/components/AdBanner'

interface VideoPageProps {
  params: Promise<{ id: string }>
}

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || ''

async function fetchVideoById(id: string) {
  if (!API_KEY) return null
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${id}&key=${API_KEY}`,
      { next: { revalidate: 300 } }
    )
    if (!res.ok) return null
    const data = await res.json()
    return data.items?.[0] || null
  } catch {
    return null
  }
}

async function fetchRelatedVideos(region: string = 'US') {
  if (!API_KEY) return []
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=12&regionCode=${region}&key=${API_KEY}`,
      { next: { revalidate: 300 } }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.items || []
  } catch {
    return []
  }
}

function formatNumber(n: string | undefined) {
  const num = Number(n || 0)
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B'
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M'
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K'
  return num.toLocaleString()
}

function calculateEngagement(video: any) {
  const views = Number(video.statistics?.viewCount || 0)
  const likes = Number(video.statistics?.likeCount || 0)
  const comments = Number(video.statistics?.commentCount || 0)
  if (views === 0) return 0
  return (((likes + comments * 2) / views) * 100).toFixed(2)
}

function generateInsights(video: any) {
  const title = video.snippet?.title?.toLowerCase() || ''
  const views = Number(video.statistics?.viewCount || 0)
  const likes = Number(video.statistics?.likeCount || 0)
  const comments = Number(video.statistics?.commentCount || 0)
  const engagement = views > 0 ? ((likes + comments) / views) * 100 : 0

  const insights = []
  if (engagement > 5) {
    insights.push({ icon: '🔥', title: 'High Engagement', desc: `Engagement rate of ${engagement.toFixed(2)}% is well above the YouTube average of 1-3%.` })
  }
  if (views > 5_000_000) {
    insights.push({ icon: '🚀', title: 'Viral Velocity', desc: 'High view count indicates strong algorithmic recommendation performance.' })
  }
  if (title.includes('shorts') || title.includes('#shorts')) {
    insights.push({ icon: '📱', title: 'Shorts Format', desc: 'Shorts receive 2-3x more impressions per upload compared to long-form content.' })
  }
  if (title.includes('how to') || title.includes('tutorial')) {
    insights.push({ icon: '🧠', title: 'Evergreen Potential', desc: 'Tutorial content maintains steady search traffic over time.' })
  }
  if (likes / Math.max(views, 1) > 0.05) {
    insights.push({ icon: '❤️', title: 'Strong Like Ratio', desc: 'High like-to-view ratio signals quality content to the algorithm.' })
  }
  if (insights.length === 0) {
    insights.push({ icon: '📈', title: 'Steady Growth', desc: 'This video is performing within expected parameters for its niche.' })
  }
  return insights
}

export async function generateMetadata({ params }: VideoPageProps): Promise<Metadata> {
  const { id } = await params
  const video = await fetchVideoById(id)
  const title = video?.snippet?.title || 'Video Analysis'
  return {
    title: `Why "${title}" Went Viral on YouTube — TubeFission`,
    description: `Analyze why "${title}" is trending, view retention stats, viral growth trajectory, and AI-powered creator insights. Discover actionable opportunity.`,
  }
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { id } = await params
  const video = await fetchVideoById(id)
  if (!video) return notFound()

  const related = await fetchRelatedVideos()
  const insights = generateInsights(video)
  const engagement = calculateEngagement(video)

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6 sm:mb-8"
        >
          <span className="text-lg">←</span>
          <span className="text-sm font-medium">Back to Trends</span>
        </Link>

        {/* Video Player */}
        <div className="mb-6 sm:mb-8">
          <VideoPlayer
            videoId={id}
            thumbnail={video.snippet?.thumbnails?.high?.url}
          />
        </div>

        {/* Title & Channel */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-xl sm:text-3xl font-bold leading-snug mb-3">
            {video.snippet?.title}
          </h1>
          <div className="flex items-center gap-3 text-zinc-400">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-xs font-bold">
              {video.snippet?.channelTitle?.[0]}
            </div>
            <span className="font-medium text-zinc-300">{video.snippet?.channelTitle}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-5">
            <div className="text-zinc-500 text-xs sm:text-sm mb-1">Views</div>
            <div className="text-xl sm:text-2xl font-black">{formatNumber(video.statistics?.viewCount)}</div>
          </div>
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-5">
            <div className="text-zinc-500 text-xs sm:text-sm mb-1">Likes</div>
            <div className="text-xl sm:text-2xl font-black text-red-400">{formatNumber(video.statistics?.likeCount)}</div>
          </div>
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-5">
            <div className="text-zinc-500 text-xs sm:text-sm mb-1">Comments</div>
            <div className="text-xl sm:text-2xl font-black text-blue-400">{formatNumber(video.statistics?.commentCount)}</div>
          </div>
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-5">
            <div className="text-zinc-500 text-xs sm:text-sm mb-1">Engagement</div>
            <div className="text-xl sm:text-2xl font-black text-green-400">{engagement}%</div>
          </div>
        </div>

        <AdBanner slot="3456789012" className="my-8" />

        {/* AI Insights */}
        <div className="mb-8 sm:mb-10">
          <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-yellow-400">✦</span> AI Trend Analysis
          </h2>
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            {insights.map((insight, idx) => (
              <div
                key={idx}
                className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 sm:p-5 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{insight.icon}</div>
                  <div>
                    <div className="font-bold text-sm sm:text-base mb-1">{insight.title}</div>
                    <div className="text-zinc-400 text-xs sm:text-sm leading-relaxed">{insight.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Videos */}
        {related.length > 0 && (
          <div>
            <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-red-400">▶</span> Related Trending Videos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((v: any) => (
                <Link
                  key={v.id}
                  href={`/video/${v.id}`}
                  className="group block bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={v.snippet?.thumbnails?.medium?.url}
                      alt={v.snippet?.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="font-bold text-sm line-clamp-2 mb-1 group-hover:text-red-400 transition-colors">
                      {v.snippet?.title}
                    </h3>
                    <div className="text-zinc-500 text-xs">
                      {v.snippet?.channelTitle} · {formatNumber(v.statistics?.viewCount)} views
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
