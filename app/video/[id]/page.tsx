import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import VideoPlayer from '@/app/components/VideoPlayer'
import AdBanner from '@/app/components/AdBanner'
import { fetchVideoById, fetchRelatedVideos } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'
import { getViewVelocity, getEngagementRate } from '@/lib/analytics'

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
  const velocity = getViewVelocity(video)

  const insights = []

  // Velocity insights
  if (velocity > 5_000_000) {
    insights.push({ icon: '🚀', title: 'Massive Velocity', desc: `Growing at ${formatNumber(velocity.toString())} views/day — exceptional viral momentum.`, level: 'viral' })
  } else if (velocity > 1_000_000) {
    insights.push({ icon: '⚡', title: 'High Velocity', desc: `Growing at ${formatNumber(velocity.toString())} views/day — strong algorithmic push.`, level: 'high' })
  } else if (velocity > 500_000) {
    insights.push({ icon: '↗️', title: 'Growing Fast', desc: `Steady growth at ${formatNumber(velocity.toString())} views/day.`, level: 'medium' })
  }

  // Engagement insights
  if (engagement > 5) {
    insights.push({ icon: '🔥', title: 'High Engagement', desc: `Engagement rate of ${engagement.toFixed(2)}% is well above the YouTube average of 1-3%.`, level: 'high' })
  } else if (engagement > 3) {
    insights.push({ icon: '💎', title: 'Good Engagement', desc: `Engagement rate of ${engagement.toFixed(2)}% indicates quality content.`, level: 'medium' })
  }

  // View milestone insights
  if (views > 50_000_000) {
    insights.push({ icon: '👑', title: 'Mega Viral', desc: 'Over 50M views places this in the top 0.1% of YouTube content.', level: 'viral' })
  } else if (views > 10_000_000) {
    insights.push({ icon: '🏆', title: 'Major Viral Hit', desc: '10M+ views indicates significant mainstream appeal.', level: 'high' })
  } else if (views > 1_000_000) {
    insights.push({ icon: '📈', title: 'Viral Success', desc: 'Crossed 1M views — a notable achievement for any creator.', level: 'medium' })
  }

  // Content format insights
  if (title.includes('shorts') || title.includes('#shorts')) {
    insights.push({ icon: '📱', title: 'Shorts Format', desc: 'Shorts receive 2-3x more impressions per upload compared to long-form content.', level: 'info' })
  }
  if (title.includes('how to') || title.includes('tutorial')) {
    insights.push({ icon: '🧠', title: 'Evergreen Potential', desc: 'Tutorial content maintains steady search traffic over time and builds authority.', level: 'info' })
  }
  if (title.includes('challenge')) {
    insights.push({ icon: '🎯', title: 'Challenge Format', desc: 'Challenge videos drive high participation and share rates.', level: 'info' })
  }

  // Like ratio insights
  const likeRatio = views > 0 ? (likes / views) * 100 : 0
  if (likeRatio > 5) {
    insights.push({ icon: '❤️', title: 'Exceptional Like Ratio', desc: `${likeRatio.toFixed(2)}% like-to-view ratio signals outstanding content quality.`, level: 'high' })
  }

  if (insights.length === 0) {
    insights.push({ icon: '📊', title: 'Steady Performance', desc: 'This video is performing within expected parameters for its niche.', level: 'low' })
  }

  return insights
}

function analyzeTitle(title: string) {
  const lower = title.toLowerCase()
  const analysis = {
    hasNumber: /\d/.test(title),
    hasQuestion: title.includes('?'),
    hasExclamation: title.includes('!'),
    hasPowerWord: ['secret', 'ultimate', 'best', 'worst', 'amazing', 'insane', 'incredible', 'shocking'].some(w => lower.includes(w)),
    hasHowTo: lower.includes('how to') || lower.includes('tutorial'),
    hasPersonal: lower.includes('i ') || lower.includes('my ') || lower.includes('me '),
    wordCount: title.split(' ').length,
    charCount: title.length,
  }
  return analysis
}

function getTitleScore(analysis: any) {
  let score = 50
  if (analysis.hasNumber) score += 10
  if (analysis.hasQuestion) score += 5
  if (analysis.hasExclamation) score += 5
  if (analysis.hasPowerWord) score += 15
  if (analysis.hasHowTo) score += 10
  if (analysis.hasPersonal) score += 10
  if (analysis.wordCount >= 6 && analysis.wordCount <= 12) score += 10
  if (analysis.charCount <= 60) score += 10
  return Math.min(100, score)
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
  const velocity = getViewVelocity(video)
  const engagementRate = getEngagementRate(video)

  const titleAnalysis = analyzeTitle(video.snippet?.title || '')
  const titleScore = getTitleScore(titleAnalysis)

  // Calculate performance percentiles
  const allRelatedEngagement = related.map((v: any) => getEngagementRate(v))
  const avgRelatedEngagement = allRelatedEngagement.length > 0
    ? allRelatedEngagement.reduce((a: number, b: number) => a + b, 0) / allRelatedEngagement.length
    : 0
  const engagementPercentile = avgRelatedEngagement > 0
    ? Math.round((engagementRate / avgRelatedEngagement) * 50) + 50
    : 50

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
          <span className="text-sm font-medium">Back to Potential</span>
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

        {/* Key Stats Grid */}
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

        {/* Professional Analytics Dashboard */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-400 to-blue-600" />
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-gray-900">
              <span className="text-blue-600">📊</span> Performance Analytics
            </h2>
          </div>

          {/* Velocity & Engagement Trend */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Velocity Visualization */}
            <div className="glass-panel neon-border rounded-2xl p-5 sm:p-6 glow-hover">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider data-mono">⚡ VELOCITY METRIC</h3>
                <span className="text-[10px] text-gray-500 data-mono">views/day</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-3xl font-black text-gray-900">{formatNumber(velocity.toString())}</div>
                  <div className="text-sm text-gray-500">views per day</div>
                </div>
                <div className={`text-2xl font-bold ${velocity > 1_000_000 ? 'text-red-600' : velocity > 500_000 ? 'text-orange-600' : 'text-green-600'}`}>
                  {velocity > 1_000_000 ? '🔥 VIRAL' : velocity > 500_000 ? '⚡ HIGH' : '📈 STEADY'}
                </div>
              </div>
              {/* Velocity Bar */}
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, (velocity / 5_000_000) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>0</span>
                <span>1M</span>
                <span>3M</span>
                <span>5M+</span>
              </div>
            </div>

            {/* Engagement Breakdown */}
            <div className="glass-panel neon-border rounded-2xl p-5 sm:p-6 glow-hover">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider data-mono">📈 ENGAGEMENT BREAKDOWN</h3>
                <span className="text-[10px] text-gray-500 data-mono">percentile: {engagementPercentile}%</span>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Like Rate</span>
                    <span className="font-medium">
                      {((Number(video.statistics?.likeCount || 0) / Math.max(Number(video.statistics?.viewCount || 1), 1)) * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{ width: `${Math.min(100, (Number(video.statistics?.likeCount || 0) / Math.max(Number(video.statistics?.viewCount || 1), 1)) * 100 * 10)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Comment Rate</span>
                    <span className="font-medium">
                      {((Number(video.statistics?.commentCount || 0) / Math.max(Number(video.statistics?.viewCount || 1), 1)) * 100).toFixed(3)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${Math.min(100, (Number(video.statistics?.commentCount || 0) / Math.max(Number(video.statistics?.viewCount || 1), 1)) * 100 * 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Overall Engagement</span>
                    <span className="font-medium text-green-600">{engagement}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${Math.min(100, Number(engagement) * 10)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Title Analysis */}
          <div className="glass-panel neon-border rounded-2xl p-5 sm:p-6 glow-hover corner-accent">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider data-mono">✍️ TITLE ANALYSIS</h3>
              <span className={`text-lg font-bold ${titleScore >= 70 ? 'text-green-600' : titleScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                Score: {titleScore}/100
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className={`p-3 rounded-lg ${titleAnalysis.hasNumber ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                <div className="text-lg mb-1">{titleAnalysis.hasNumber ? '✅' : '❌'}</div>
                <div className="text-xs font-medium">Contains Number</div>
                <div className="text-[10px] text-gray-500">{titleAnalysis.hasNumber ? 'Boosts CTR' : 'Consider adding'}</div>
              </div>
              <div className={`p-3 rounded-lg ${titleAnalysis.hasPowerWord ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                <div className="text-lg mb-1">{titleAnalysis.hasPowerWord ? '✅' : '❌'}</div>
                <div className="text-xs font-medium">Power Words</div>
                <div className="text-[10px] text-gray-500">{titleAnalysis.hasPowerWord ? 'Drives clicks' : 'Add emotional words'}</div>
              </div>
              <div className={`p-3 rounded-lg ${titleAnalysis.wordCount >= 6 && titleAnalysis.wordCount <= 12 ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                <div className="text-lg mb-1">{titleAnalysis.wordCount >= 6 && titleAnalysis.wordCount <= 12 ? '✅' : '⚠️'}</div>
                <div className="text-xs font-medium">Word Count: {titleAnalysis.wordCount}</div>
                <div className="text-[10px] text-gray-500">Optimal: 6-12 words</div>
              </div>
              <div className={`p-3 rounded-lg ${titleAnalysis.charCount <= 60 ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                <div className="text-lg mb-1">{titleAnalysis.charCount <= 60 ? '✅' : '⚠️'}</div>
                <div className="text-xs font-medium">Length: {titleAnalysis.charCount} chars</div>
                <div className="text-[10px] text-gray-500">Max: 60 for mobile</div>
              </div>
            </div>
          </div>
        </section>

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
            {insights.slice(0, 4).map((insight, idx) => (
              <div
                key={idx}
                className={`glass-panel neon-border rounded-2xl p-4 sm:p-5 glow-hover corner-accent ${
                  insight.level === 'viral' ? 'border-red-400 bg-red-50/30' :
                  insight.level === 'high' ? 'border-orange-400 bg-orange-50/30' :
                  insight.level === 'medium' ? 'border-green-400 bg-green-50/30' :
                  ''
                }`}
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

        {/* Data Export */}
        <div className="glass-panel neon-border rounded-2xl p-5 sm:p-6 glow-hover mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider data-mono">📥 EXPORT DATA</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition flex items-center gap-2">
              <span>📊</span> Export Metrics
            </button>
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition flex items-center gap-2">
              <span>🔗</span> Copy Video URL
            </button>
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition flex items-center gap-2">
              <span>📱</span> Share Analysis
            </button>
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
              {related.slice(0, 6).map((v: any) => (
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
