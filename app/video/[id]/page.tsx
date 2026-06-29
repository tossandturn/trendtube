import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import VideoPlayer from '@/app/components/VideoPlayer'
import AdBanner from '@/app/components/AdBanner'
import { MetricChart } from '@/app/components/charts/MetricChart'
import ContentQualityScore from '@/app/components/ContentQualityScore'
import EngagementAnalytics from '@/app/components/EngagementAnalytics'
import SmartRecommendations from '@/app/components/SmartRecommendations'
import CommentAnalysis from '@/app/components/CommentAnalysis'
import ContentVelocity from '@/app/components/ContentVelocity'
import VideoExport from '@/app/components/VideoExport'
import ContentRhythmAnalytics from '@/app/components/ContentRhythmAnalytics'
import TrafficSourceChart from '@/app/components/TrafficSourceChart'
import AudienceDemographics from '@/app/components/AudienceDemographics'
import { fetchVideoById, fetchRelatedVideos } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'
import { getViewVelocity, getEngagementRate } from '@/lib/analytics'
import { analyzeVideoIntelligence } from '@/lib/ai-insights'

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

function analyzePublishTime(publishedAt: string) {
  const date = new Date(publishedAt)
  const hour = date.getHours()
  const day = date.getDay()

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dayName = dayNames[day]

  // Best time analysis
  let timeScore = 50
  let timeRecommendation = ''

  if (hour >= 14 && hour <= 18) {
    timeScore = 90
    timeRecommendation = 'Optimal afternoon slot - high viewer activity'
  } else if (hour >= 19 && hour <= 22) {
    timeScore = 85
    timeRecommendation = 'Prime evening time - peak engagement period'
  } else if (hour >= 10 && hour <= 13) {
    timeScore = 75
    timeRecommendation = 'Good morning visibility - moderate activity'
  } else if (hour >= 23 || hour <= 5) {
    timeScore = 40
    timeRecommendation = 'Off-peak hours - lower initial traction'
  } else {
    timeScore = 60
    timeRecommendation = 'Standard hours - average performance'
  }

  // Day analysis
  let dayScore = 50
  if (day >= 1 && day <= 3) {
    dayScore = 80
    timeRecommendation += ' | Monday-Wednesday are strong upload days'
  } else if (day >= 4 && day <= 5) {
    dayScore = 75
    timeRecommendation += ' | Thursday-Friday build weekend momentum'
  } else if (day === 0) {
    dayScore = 70
    timeRecommendation += ' | Sunday captures weekend browsing'
  } else {
    dayScore = 65
    timeRecommendation += ' | Saturday has mixed results'
  }

  return {
    dayName,
    hour,
    timeString: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    dateString: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    timeScore,
    dayScore,
    recommendation: timeRecommendation,
  }
}

function analyzeDescription(description: string) {
  const length = description.length
  const hasLinks = /https?:\/\/\S+/.test(description)
  const hasTimestamps = /\d{1,2}:\d{2}/.test(description)
  const hasHashtags = /#\w+/.test(description)
  const hasMentions = /@\w+/.test(description)
  const paragraphs = description.split('\n').filter(p => p.trim().length > 0).length

  // Calculate SEO score
  let seoScore = 50
  if (length > 200) seoScore += 15
  if (length > 500) seoScore += 10
  if (hasLinks) seoScore += 10
  if (hasTimestamps) seoScore += 10
  if (hasHashtags) seoScore += 5
  if (paragraphs >= 3) seoScore += 10

  return {
    length,
    hasLinks,
    hasTimestamps,
    hasHashtags,
    hasMentions,
    paragraphs,
    seoScore: Math.min(100, seoScore),
  }
}

function generateTrendData(video: any) {
  const views = Number(video.statistics?.viewCount || 0)
  const likes = Number(video.statistics?.likeCount || 0)
  const comments = Number(video.statistics?.commentCount || 0)

  // Generate 7 days of trend data based on current metrics
  const days = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7']
  const viewData = []
  const engagementData = []
  const likeData = []

  // Simulate growth curve (views typically follow a curve that plateaus)
  for (let i = 0; i < 7; i++) {
    const factor = 0.1 + (i * 0.15) // Growth factor
    viewData.push({
      name: days[i],
      value: Math.round(views * factor)
    })
    likeData.push({
      name: days[i],
      value: Math.round(likes * factor)
    })
    engagementData.push({
      name: days[i],
      value: Math.round((likes + comments * 2) * factor)
    })
  }

  return { viewData, likeData, engagementData }
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

function buildActionPlan(video: any, titleAnalysis: any, publishAnalysis: any, descAnalysis: any, velocity: number, engagementRate: number) {
  const actionItems = []

  actionItems.push({
    priority: titleAnalysis.hasPowerWord && titleAnalysis.hasNumber ? 'Keep' : 'High impact',
    title: 'Packaging strategy',
    description: titleAnalysis.hasPowerWord && titleAnalysis.hasNumber
      ? 'This title already uses click-driving structure. Study which specific words and framing are doing the work before reusing the pattern.'
      : 'Test a tighter title with one concrete outcome, a number, or a stronger curiosity phrase. This is the fastest improvement lever for underperforming packaging.',
  })

  actionItems.push({
    priority: engagementRate > 5 ? 'Scale this' : 'Quick win',
    title: 'Audience response',
    description: engagementRate > 5
      ? `Engagement is already strong at ${engagementRate.toFixed(2)}%. Double down on the same promise, pacing, and CTA pattern in the next 2-3 uploads.`
      : `Engagement is only ${engagementRate.toFixed(2)}%. Add a clearer opinion, stronger hook, or a more specific viewer prompt in the first 30 seconds.`,
  })

  actionItems.push({
    priority: publishAnalysis.timeScore >= 80 ? 'Test next' : 'High impact',
    title: 'Distribution timing',
    description: publishAnalysis.timeScore >= 80
      ? `Publishing time looks favorable. Keep the timing stable and test whether topic/thumbnail changes move the result more than timing does.`
      : `This upload time was not ideal. Re-test the same style closer to ${publishAnalysis.dayName} ${publishAnalysis.timeString} windows that better match viewer activity.`,
  })

  actionItems.push({
    priority: descAnalysis.seoScore >= 80 ? 'Maintain' : 'Quick win',
    title: 'Search and description support',
    description: descAnalysis.seoScore >= 80
      ? 'Description support is solid. Preserve structure, links, and timestamps when repeating this format.'
      : 'Improve description depth with clearer summary text, timestamps, or related links so the video has more search and session-supporting context.',
  })

  return actionItems
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

  // Get deep AI intelligence
  const aiIntelligence = analyzeVideoIntelligence(video, related)

  const titleAnalysis = analyzeTitle(video.snippet?.title || '')
  const titleScore = getTitleScore(titleAnalysis)
  const publishAnalysis = analyzePublishTime(video.snippet?.publishedAt || '')
  const descAnalysis = analyzeDescription(video.snippet?.description || '')
  const trendData = generateTrendData(video)

  // Calculate performance percentiles
  const actionPlan = buildActionPlan(video, titleAnalysis, publishAnalysis, descAnalysis, velocity, engagementRate)
  const allRelatedEngagement = related.map((v: any) => getEngagementRate(v))
  const avgRelatedEngagement = allRelatedEngagement.length > 0
    ? allRelatedEngagement.reduce((a: number, b: number) => a + b, 0) / allRelatedEngagement.length
    : 0
  const engagementPercentile = avgRelatedEngagement > 0
    ? Math.min(99, Math.max(1, Math.round((engagementRate / avgRelatedEngagement) * 50) + 50))
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

        <div className="flex flex-wrap gap-3 mb-6">
          <Link
            href="/trending"
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition"
          >
            Back to Trending
          </Link>
          <Link
            href="/compare-new?type=videos"
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition"
          >
            Compare Videos
          </Link>
        </div>

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

        {/* Action Plan */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600" />
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-gray-900">
              <span className="text-emerald-600">🎯</span> What To Do Next
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {actionPlan.map((item) => (
              <div key={item.title} className="glass-panel neon-border rounded-2xl p-5 glow-hover corner-accent">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <h3 className="font-bold text-gray-900">{item.title}</h3>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    item.priority === 'High impact' ? 'bg-red-100 text-red-700' :
                    item.priority === 'Quick win' ? 'bg-green-100 text-green-700' :
                    item.priority === 'Scale this' ? 'bg-blue-100 text-blue-700' :
                    item.priority === 'Maintain' ? 'bg-gray-100 text-gray-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Performance Trend Charts */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-indigo-400 to-indigo-600" />
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-gray-900">
              <span className="text-indigo-600">📈</span> Performance Trends
            </h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="glass-panel neon-border rounded-2xl p-5 glow-hover">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Views Trend</h3>
              <MetricChart data={trendData.viewData} dataKey="value" color="#3b82f6" height={180} />
              <p className="text-xs text-gray-500 mt-2">Projected growth based on current velocity</p>
            </div>
            <div className="glass-panel neon-border rounded-2xl p-5 glow-hover">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Likes Trend</h3>
              <MetricChart data={trendData.likeData} dataKey="value" color="#ef4444" height={180} />
              <p className="text-xs text-gray-500 mt-2">Like accumulation pattern</p>
            </div>
            <div className="glass-panel neon-border rounded-2xl p-5 glow-hover">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Engagement Trend</h3>
              <MetricChart data={trendData.engagementData} dataKey="value" color="#22c55e" height={180} />
              <p className="text-xs text-gray-500 mt-2">Combined engagement metrics</p>
            </div>
          </div>
        </section>

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

          {/* Publish Time & Description Analysis */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Publish Time Analysis */}
            <div className="glass-panel neon-border rounded-2xl p-5 sm:p-6 glow-hover">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider data-mono">🕐 PUBLISH TIME ANALYSIS</h3>
                <span className={`text-lg font-bold ${publishAnalysis.timeScore >= 80 ? 'text-green-600' : publishAnalysis.timeScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                  Score: {publishAnalysis.timeScore}/100
                </span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Published</span>
                  <span className="font-medium">{publishAnalysis.dayName}, {publishAnalysis.timeString}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">{publishAnalysis.dateString}</span>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600">💡</span>
                    <span className="text-sm text-blue-800">{publishAnalysis.recommendation}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description SEO Analysis */}
            <div className="glass-panel neon-border rounded-2xl p-5 sm:p-6 glow-hover">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider data-mono">📝 DESCRIPTION SEO</h3>
                <span className={`text-lg font-bold ${descAnalysis.seoScore >= 80 ? 'text-green-600' : descAnalysis.seoScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                  Score: {descAnalysis.seoScore}/100
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className={`p-3 rounded-lg border ${descAnalysis.hasLinks ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="text-lg mb-1">{descAnalysis.hasLinks ? '✅' : '❌'}</div>
                  <div className="text-xs font-medium">External Links</div>
                </div>
                <div className={`p-3 rounded-lg border ${descAnalysis.hasTimestamps ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="text-lg mb-1">{descAnalysis.hasTimestamps ? '✅' : '❌'}</div>
                  <div className="text-xs font-medium">Timestamps</div>
                </div>
                <div className={`p-3 rounded-lg border ${descAnalysis.hasHashtags ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="text-lg mb-1">{descAnalysis.hasHashtags ? '✅' : '❌'}</div>
                  <div className="text-xs font-medium">Hashtags</div>
                </div>
                <div className={`p-3 rounded-lg border ${descAnalysis.length > 200 ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                  <div className="text-lg mb-1">{descAnalysis.length > 200 ? '✅' : '⚠️'}</div>
                  <div className="text-xs font-medium">{descAnalysis.length} chars</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {descAnalysis.paragraphs} paragraphs · {descAnalysis.hasMentions ? 'Has mentions' : 'No mentions'}
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
              <span className="text-yellow-600">🧠</span> What The Data Says
            </h2>
          </div>
          <p className="text-sm text-gray-500 mb-4 max-w-3xl">
            Read this as the explanation layer. The action plan above tells you what to change first; this section explains why the video likely behaved this way.
          </p>
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

        {/* Replication Checklist */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-purple-400 to-purple-600" />
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-gray-900">
              <span className="text-purple-600">💡</span> Replication Checklist
            </h2>
          </div>
          <div className="glass-panel neon-border rounded-2xl p-5 sm:p-6 glow-hover bg-gradient-to-br from-purple-50/30 to-blue-50/30">
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="rounded-xl bg-white/70 border border-purple-100 p-4">
                <div className="font-semibold text-gray-900 mb-2">Check packaging separately</div>
                <p className="text-gray-600">Save the title and thumbnail pattern before assuming the topic was the only reason it worked.</p>
              </div>
              <div className="rounded-xl bg-white/70 border border-purple-100 p-4">
                <div className="font-semibold text-gray-900 mb-2">Match audience fit</div>
                <p className="text-gray-600">Reuse the format only if the promise also fits your niche, tone, and viewer expectation.</p>
              </div>
              <div className="rounded-xl bg-white/70 border border-purple-100 p-4">
                <div className="font-semibold text-gray-900 mb-2">Test one variable</div>
                <p className="text-gray-600">Change one thing first — title, topic angle, or thumbnail — so you know what actually moved performance.</p>
              </div>
              <div className="rounded-xl bg-white/70 border border-purple-100 p-4">
                <div className="font-semibold text-gray-900 mb-2">Confirm with more examples</div>
                <p className="text-gray-600">Use 3-5 comparable winners before turning one successful video into a content rule.</p>
              </div>
            </div>
          </div>
        </div>


        {/* Content Quality Score */}
        <div className="mb-8 sm:mb-10">
          <ContentQualityScore videoId={id} type="video" />
        </div>

        {/* Engagement Analytics */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-pink-400 to-pink-600" />
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-gray-900">
              <span className="text-pink-600">👥</span> Engagement Intelligence
            </h2>
          </div>
          <EngagementAnalytics videoId={id} />
        </div>

        {/* Comment Analysis - User Behavior Mining */}
        <div className="mb-8 sm:mb-10">
          <CommentAnalysis videoId={id} />
        </div>

        {/* Content Velocity */}
        <div className="mb-8 sm:mb-10">
          <ContentVelocity videoId={id} />
        </div>

        {/* Smart Recommendations */}
        <div className="mb-8 sm:mb-10">
          <SmartRecommendations
            currentVideoId={id}
            videoCategory={(video.snippet as any)?.categoryId || ''}
            videoTags={(video.snippet as any)?.tags || []}
          />
        </div>

        {/* Advanced Video Analytics */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-pink-400 to-pink-600" />
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-gray-900">
              <span className="text-pink-600">📊</span> Advanced Video Analytics
            </h2>
          </div>
          <div className="space-y-6">
            <ContentRhythmAnalytics video={video} />
            <div className="grid lg:grid-cols-2 gap-6">
              <TrafficSourceChart video={video} />
              <AudienceDemographics video={video} />
            </div>
          </div>
        </div>

        {/* Data Export */}
        <div className="glass-panel neon-border rounded-2xl p-5 sm:p-6 glow-hover mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider data-mono">📥 EXPORT DATA</h3>
          </div>
          <VideoExport video={video} velocity={velocity} engagement={engagement} />
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
