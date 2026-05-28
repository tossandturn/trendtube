import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import VideoPlayer from '@/app/components/VideoPlayer'
import AdBanner from '@/app/components/AdBanner'
import { fetchVideoById, fetchRelatedVideos } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'

interface VideoPageProps {
  params: Promise<{ id: string }>
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

  const region = await getRegion()
  const related = await fetchRelatedVideos(region)
  const insights = generateInsights(video)
  const engagement = calculateEngagement(video)

  return (
    <main className="min-h-screen bg-white text-gray-900 terminal-grid relative overflow-hidden">
      <div className="ambient-glow-tl" />
      <div className="ambient-glow-tr" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 sm:mb-8"
        >
          <span className="text-lg">←</span>
          <span className="text-sm font-medium">Back to Trends</span>
        </Link>

        {/* Video Player */}
        <div className="mb-6 sm:mb-8">
          <VideoPlayer
            videoId={id}
            thumbnail={video.snippet?.thumbnails?.high?.url || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
          />
        </div>

        {/* Title & Channel */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-xl sm:text-3xl font-bold leading-snug mb-3 text-glow text-gray-900">
            {video.snippet?.title}
          </h1>
          <div className="flex items-center gap-3 text-gray-500">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-xs font-bold shadow-[0_0_15px_rgba(220,38,38,0.2)] text-white">
              {video.snippet?.channelTitle?.[0]}
            </div>
            <span className="font-medium text-gray-700">{video.snippet?.channelTitle}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
          <div className="glass-panel neon-border rounded-2xl p-4 sm:p-5 glow-hover corner-accent">
            <div className="text-gray-500 text-xs sm:text-sm mb-1 data-mono tracking-wider">👁️ VIEWS</div>
            <div className="text-xl sm:text-2xl font-black data-mono text-glow text-gray-900">{formatNumber(video.statistics?.viewCount)}</div>
          </div>
          <div className="glass-panel neon-border rounded-2xl p-4 sm:p-5 glow-hover corner-accent">
            <div className="text-gray-500 text-xs sm:text-sm mb-1 data-mono tracking-wider">❤️ LIKES</div>
            <div className="text-xl sm:text-2xl font-black text-red-600 data-mono text-glow-red">{formatNumber(video.statistics?.likeCount)}</div>
          </div>
          <div className="glass-panel neon-border rounded-2xl p-4 sm:p-5 glow-hover corner-accent">
            <div className="text-gray-500 text-xs sm:text-sm mb-1 data-mono tracking-wider">💬 COMMENTS</div>
            <div className="text-xl sm:text-2xl font-black text-blue-600 data-mono">{formatNumber(video.statistics?.commentCount)}</div>
          </div>
          <div className="glass-panel neon-border rounded-2xl p-4 sm:p-5 glow-hover corner-accent">
            <div className="text-gray-500 text-xs sm:text-sm mb-1 data-mono tracking-wider">⚡ ENGAGEMENT</div>
            <div className="text-xl sm:text-2xl font-black text-green-600 data-mono text-glow-green">{engagement}%</div>
          </div>
        </div>

        <AdBanner slot="3456789012" className="my-8" />

        {/* AI Insights */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-yellow-400 to-yellow-600" />
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-gray-900">
              <span className="text-yellow-600">🧠</span> AI Trend Analysis
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            {insights.map((insight, idx) => (
              <div
                key={idx}
                className="glass-panel neon-border rounded-2xl p-4 sm:p-5 glow-hover corner-accent"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl float-slow">{insight.icon}</div>
                  <div>
                    <div className="font-bold text-sm sm:text-base mb-1 text-gray-900">{insight.title}</div>
                    <div className="text-gray-500 text-xs sm:text-sm leading-relaxed">{insight.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Videos */}
        {related.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-red-400 to-red-600" />
              <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-gray-900">
                <span className="text-red-600">▶</span> Related Trending Videos
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((v: any) => (
                <Link
                  key={v.id}
                  href={`/video/${v.id}`}
                  className="group block glass-panel neon-border rounded-2xl overflow-hidden glow-hover corner-accent"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={v.snippet?.thumbnails?.medium?.url}
                      alt={v.snippet?.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="font-bold text-sm line-clamp-2 mb-1 group-hover:text-red-600 transition-colors text-gray-900">
                      {v.snippet?.title}
                    </h3>
                    <div className="text-gray-500 text-xs data-mono">
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
