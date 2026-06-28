import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MetricChart } from '@/app/components/charts/MetricChart'
import AIScoreCard from '@/app/components/AIScoreCard'
import ChannelValueAnalysis from '@/app/components/ChannelValueAnalysis'
import EnhancedChannelAnalytics from '@/app/components/EnhancedChannelAnalytics'
import CreatorEcosystem from '@/app/components/CreatorEcosystem'
import AudienceAnalytics from '@/app/components/AudienceAnalytics'
import { fetchChannelById, fetchChannelVideos } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'
import { analyzeChannelIntelligence } from '@/lib/ai-insights'

interface ChannelPageProps {
  params: Promise<{ id: string }>
}

function formatNumber(n: string | number | undefined) {
  const num = Number(n || 0)
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B'
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M'
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K'
  return num.toLocaleString()
}

function calculateEngagementRate(video: any) {
  const views = Number(video.statistics?.viewCount || 0)
  const likes = Number(video.statistics?.likeCount || 0)
  const comments = Number(video.statistics?.commentCount || 0)
  if (views === 0) return 0
  return ((likes + comments * 2) / views) * 100
}

function calculateLikeRate(video: any) {
  const views = Number(video.statistics?.viewCount || 0)
  const likes = Number(video.statistics?.likeCount || 0)
  if (views === 0) return 0
  return (likes / views) * 100
}

function calculateCommentRate(video: any) {
  const views = Number(video.statistics?.viewCount || 0)
  const comments = Number(video.statistics?.commentCount || 0)
  if (views === 0) return 0
  return (comments / views) * 100
}

function generateChannelChartData(videos: any[], channel: any) {
  if (videos.length === 0) return null

  // Sort videos by published date
  const sortedVideos = [...videos].sort((a, b) =>
    new Date(a.snippet?.publishedAt).getTime() - new Date(b.snippet?.publishedAt).getTime()
  )

  // Generate views trend (last 12 videos or all if less)
  const recentVideos = sortedVideos.slice(-12)
  const viewsData = recentVideos.map((v, idx) => ({
    name: `V${idx + 1}`,
    value: Number(v.statistics?.viewCount || 0)
  }))

  // Generate likes trend
  const likesData = recentVideos.map((v, idx) => ({
    name: `V${idx + 1}`,
    value: Number(v.statistics?.likeCount || 0)
  }))

  // Generate engagement trend
  const engagementData = recentVideos.map((v, idx) => ({
    name: `V${idx + 1}`,
    value: Math.round(calculateEngagementRate(v) * 100) / 100
  }))

  // Growth simulation for subscriber projections
  const subscriberCount = Number(channel.statistics?.subscriberCount || 0)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const currentMonth = new Date().getMonth()

  const growthData = []
  for (let i = 0; i < 12; i++) {
    const monthIdx = (currentMonth - 11 + i + 12) % 12
    const growthFactor = 0.7 + (i * 0.05)
    growthData.push({
      name: months[monthIdx],
      value: Math.round(subscriberCount * growthFactor)
    })
  }

  // Views distribution data
  const viewCounts = videos.map(v => Number(v.statistics?.viewCount || 0)).sort((a, b) => b - a)
  const totalViews = viewCounts.reduce((a, b) => a + b, 0)
  const viewsDistribution = [
    { name: 'Top 10%', value: viewCounts.slice(0, Math.ceil(videos.length * 0.1)).reduce((a, b) => a + b, 0) },
    { name: 'Top 25%', value: viewCounts.slice(0, Math.ceil(videos.length * 0.25)).reduce((a, b) => a + b, 0) - viewCounts.slice(0, Math.ceil(videos.length * 0.1)).reduce((a, b) => a + b, 0) },
    { name: 'Middle 50%', value: viewCounts.slice(Math.ceil(videos.length * 0.25), Math.ceil(videos.length * 0.75)).reduce((a, b) => a + b, 0) },
    { name: 'Bottom 25%', value: viewCounts.slice(Math.ceil(videos.length * 0.75)).reduce((a, b) => a + b, 0) },
  ]

  return { viewsData, likesData, engagementData, growthData, viewsDistribution }
}

function analyzeChannel(videos: any[], channel: any) {
  if (videos.length === 0) return null

  const totalViews = videos.reduce((sum, v) => sum + Number(v.statistics?.viewCount || 0), 0)
  const totalLikes = videos.reduce((sum, v) => sum + Number(v.statistics?.likeCount || 0), 0)
  const totalComments = videos.reduce((sum, v) => sum + Number(v.statistics?.commentCount || 0), 0)
  const avgViews = totalViews / videos.length
  const avgEngagement = videos.reduce((sum, v) => sum + calculateEngagementRate(v), 0) / videos.length
  const avgLikeRate = videos.reduce((sum, v) => sum + calculateLikeRate(v), 0) / videos.length
  const avgCommentRate = videos.reduce((sum, v) => sum + calculateCommentRate(v), 0) / videos.length

  const publishDates = videos
    .map(v => new Date(v.snippet?.publishedAt))
    .filter(d => !isNaN(d.getTime()))
    .sort((a, b) => b.getTime() - a.getTime())

  let uploadFrequency = 'N/A'
  let uploadConsistency = 0
  let recentUploadsPerMonth = 0

  if (publishDates.length >= 2) {
    const daysBetween = (publishDates[0].getTime() - publishDates[publishDates.length - 1].getTime()) / (1000 * 60 * 60 * 24)
    const videosPerDay = publishDates.length / Math.max(daysBetween, 1)
    recentUploadsPerMonth = videosPerDay * 30

    if (videosPerDay >= 1) uploadFrequency = `${videosPerDay.toFixed(1)} videos/day`
    else if (videosPerDay >= 0.14) uploadFrequency = `${Math.round(videosPerDay * 7)} videos/week`
    else uploadFrequency = `${Math.max(1, Math.round(videosPerDay * 30))} videos/month`

    const intervals = []
    for (let i = 0; i < publishDates.length - 1; i++) {
      intervals.push((publishDates[i].getTime() - publishDates[i + 1].getTime()) / (1000 * 60 * 60 * 24))
    }
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
    const variance = intervals.reduce((sum, interval) => sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length
    const stdDev = Math.sqrt(variance)
    uploadConsistency = Math.max(0, 100 - (stdDev / Math.max(avgInterval, 1)) * 100)
  }

  const sortedByViews = [...videos].sort((a, b) => Number(b.statistics?.viewCount || 0) - Number(a.statistics?.viewCount || 0))
  const bestVideo = sortedByViews[0]
  const worstVideo = sortedByViews[sortedByViews.length - 1]
  const medianVideo = sortedByViews[Math.floor(sortedByViews.length / 2)]

  const performanceTiers = {
    viral: videos.filter(v => Number(v.statistics?.viewCount || 0) > 1000000).length,
    high: videos.filter(v => Number(v.statistics?.viewCount || 0) > 100000 && Number(v.statistics?.viewCount || 0) <= 1000000).length,
    medium: videos.filter(v => Number(v.statistics?.viewCount || 0) > 10000 && Number(v.statistics?.viewCount || 0) <= 100000).length,
    low: videos.filter(v => Number(v.statistics?.viewCount || 0) <= 10000).length,
  }

  const titleWords = videos.map(v => v.snippet?.title?.toLowerCase() || '')
  const contentTypes: Record<string, number> = {}
  const typeKeywords: Record<string, string[]> = {
    'Tutorial/How-To': ['how to', 'tutorial', 'guide', 'learn', 'tips', 'beginner', 'step by step'],
    'Review': ['review', 'unboxing', 'vs', 'comparison', 'test', 'rating'],
    'Vlog': ['vlog', 'day in', 'daily', 'weekend', 'routine', 'morning', 'night'],
    'Entertainment': ['funny', 'reaction', 'prank', 'challenge', 'comedy', 'fun'],
    'Gaming': ['game', 'gaming', 'playthrough', 'walkthrough', 'lets play', 'gameplay'],
    'Music': ['music', 'song', 'cover', 'remix', 'official music', 'lyrics'],
    'Shorts': ['shorts', '#shorts', 'short'],
    'News': ['news', 'update', 'latest', 'breaking', 'announcement'],
    'Education': ['lesson', 'course', 'educational', 'explain', 'what is', 'why'],
    'Tech': ['tech', 'technology', 'gadget', 'device', 'app', 'software'],
  }

  videos.forEach((v, idx) => {
    const title = titleWords[idx]
    for (const [type, keywords] of Object.entries(typeKeywords)) {
      if (keywords.some(kw => title.includes(kw))) {
        contentTypes[type] = (contentTypes[type] || 0) + 1
        break
      }
    }
  })

  const sortedContentTypes = Object.entries(contentTypes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)

  const hourCounts = new Array(24).fill(0)
  const dayCounts = new Array(7).fill(0)
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  videos.forEach(v => {
    const date = new Date(v.snippet?.publishedAt)
    if (!isNaN(date.getTime())) {
      hourCounts[date.getHours()]++
      dayCounts[date.getDay()]++
    }
  })

  const bestHour = hourCounts.indexOf(Math.max(...hourCounts))
  const bestDay = dayCounts.indexOf(Math.max(...dayCounts))

  const channelCreated = new Date(channel.snippet?.publishedAt || 0)
  const channelAge = Math.max(1, Math.floor((Date.now() - channelCreated.getTime()) / (1000 * 60 * 60 * 24 * 365)))
  const subscriberCount = Number(channel.statistics?.subscriberCount || 0)
  const viewCount = Number(channel.statistics?.viewCount || 0)
  const videoCount = Number(channel.statistics?.videoCount || 0)

  const viewsPerVideo = videoCount > 0 ? viewCount / videoCount : 0
  const estimatedMonthlyViews = Math.round(viewsPerVideo * Math.max(recentUploadsPerMonth, 0))
  const lifetimeOutputPerMonth = videoCount / (channelAge * 12)
  const avgViewsPer1KSubscribers = subscriberCount > 0 ? (avgViews / subscriberCount) * 1000 : 0
  const likeToViewRate = avgLikeRate

  return {
    totalViews,
    totalLikes,
    totalComments,
    avgViews,
    avgEngagement,
    avgLikeRate,
    avgCommentRate,
    uploadFrequency,
    uploadConsistency,
    recentUploadsPerMonth,
    bestVideo,
    worstVideo,
    medianVideo,
    performanceTiers,
    contentTypes: sortedContentTypes,
    recentVideos: videos.slice(0, 5),
    bestPublishTime: {
      hour: bestHour,
      day: bestDay,
      dayName: dayNames[bestDay],
      formattedHour: `${bestHour % 12 || 12}:00 ${bestHour >= 12 ? 'PM' : 'AM'}`
    },
    channelAge,
    viewsPerVideo,
    estimatedMonthlyViews,
    lifetimeOutputPerMonth,
    avgViewsPer1KSubscribers,
    likeToViewRate,
  }
}

function generateChannelInsights(channel: any, analysis: any) {
  const insights = []
  const stats = channel.statistics
  const subscriberCount = Number(stats?.subscriberCount || 0)
  const viewCount = Number(stats?.viewCount || 0)
  const videoCount = Number(stats?.videoCount || 0)
  const viewsPerVideo = videoCount > 0 ? viewCount / videoCount : 0

  if (viewsPerVideo > 100000) {
    insights.push({
      icon: '🚀',
      title: 'Strong Average View Performance',
      desc: `Averaging ${formatNumber(viewsPerVideo)} views per video suggests this channel consistently earns attention beyond a one-off spike.`,
      level: 'high',
    })
  }

  if (analysis.avgEngagement > 5) {
    insights.push({
      icon: '🔥',
      title: 'Exceptional Audience Response',
      desc: `Average engagement of ${analysis.avgEngagement.toFixed(2)}% is significantly above the typical 1-3% range on YouTube.`,
      level: 'high',
    })
  } else if (analysis.avgEngagement > 3) {
    insights.push({
      icon: '💎',
      title: 'Healthy Engagement Quality',
      desc: `Average engagement of ${analysis.avgEngagement.toFixed(2)}% shows viewers are doing more than passively watching.`,
      level: 'medium',
    })
  }

  if (analysis.recentUploadsPerMonth >= 8) {
    insights.push({
      icon: '⚡',
      title: 'Aggressive Publishing Cadence',
      desc: `Recent output is running at roughly ${analysis.recentUploadsPerMonth.toFixed(1)} uploads per month, which helps maintain momentum and audience habit.`,
      level: 'high',
    })
  }

  if (analysis.uploadConsistency > 80) {
    insights.push({
      icon: '📅',
      title: 'Highly Consistent Schedule',
      desc: `Upload consistency is ${Math.round(analysis.uploadConsistency)}%, which makes the channel easier for both viewers and the algorithm to trust.`,
      level: 'high',
    })
  }

  if (subscriberCount > 1000000) {
    insights.push({
      icon: '👑',
      title: 'Top-Tier Audience Scale',
      desc: 'Crossing 1M subscribers puts this channel in a top-tier creator bracket with strong brand leverage.',
      level: 'viral',
    })
  } else if (subscriberCount > 100000) {
    insights.push({
      icon: '🏆',
      title: 'Established Channel Position',
      desc: '100K+ subscribers signals that this creator has already built repeatable audience trust.',
      level: 'high',
    })
  }

  if (analysis.performanceTiers.viral > 0) {
    insights.push({
      icon: '🌟',
      title: 'Has Proven Viral Upside',
      desc: `${analysis.performanceTiers.viral} videos have crossed 1M views, which means this channel can break beyond its baseline audience.`,
      level: 'viral',
    })
  }

  if (analysis.contentTypes.length > 0) {
    const topType = analysis.contentTypes[0][0]
    const percentage = Math.round((analysis.contentTypes[0][1] / Math.max(videoCount, 1)) * 100)
    insights.push({
      icon: '🎯',
      title: 'Clear Content Positioning',
      desc: `${percentage}% of uploads cluster around ${topType}, giving the channel a recognizable content identity.`,
      level: 'info',
    })
  }

  if (insights.length === 0) {
    insights.push({
      icon: '📊',
      title: 'Stable Baseline Performance',
      desc: 'This channel looks steady overall, but it needs a stronger differentiator to stand out in the current sample.',
      level: 'low',
    })
  }

  return insights
}
function buildChannelActionPlan(analysis: any) {
  const items = []

  items.push({
    priority: analysis.avgEngagement > 5 ? 'Scale this' : 'High impact',
    title: 'Audience response strategy',
    description: analysis.avgEngagement > 5
      ? `Engagement is already strong at ${analysis.avgEngagement.toFixed(2)}%. Build the next 2-3 uploads around the same promise, pacing, and CTA pattern.`
      : `Engagement is only ${analysis.avgEngagement.toFixed(2)}%. Strengthen the opening hook, add a clearer opinion or payoff, and ask for a specific viewer response earlier in the video.`,
  })

  items.push({
    priority: analysis.uploadConsistency > 80 ? 'Maintain' : 'High impact',
    title: 'Publishing habit',
    description: analysis.uploadConsistency > 80
      ? `Schedule consistency is a strength. Keep publishing around ${analysis.bestPublishTime.dayName}s at ${analysis.bestPublishTime.formattedHour} and focus experiments on packaging or topic selection.`
      : `Consistency is still uneven. Pick one dependable weekly publishing window around ${analysis.bestPublishTime.dayName}s ${analysis.bestPublishTime.formattedHour} to train both viewers and the algorithm.`,
  })

  items.push({
    priority: analysis.performanceTiers.viral > 0 ? 'Scale this' : 'Test next',
    title: 'Content portfolio decision',
    description: analysis.performanceTiers.viral > 0
      ? `You already have ${analysis.performanceTiers.viral} viral-level wins. Turn the best-performing topic into a repeatable series before shifting into new experiments.`
      : `You do not yet have a breakout winner in this sample. Use your strongest median-performing topic as the base and test 2-3 tighter variations before broadening scope.`,
  })

  items.push({
    priority: analysis.contentTypes.length > 0 ? 'Quick win' : 'High impact',
    title: 'Positioning clarity',
    description: analysis.contentTypes.length > 0
      ? `${analysis.contentTypes[0][0]} is your clearest audience signal right now. Keep that as the core identity and only diversify when the format is consistently converting.`
      : 'The channel does not show a clear content identity yet. Narrow topic selection so returning viewers and recommendations can better understand what the channel is about.',
  })

  return items
}

export async function generateMetadata({ params }: ChannelPageProps): Promise<Metadata> {
  const { id } = await params
  const decodedId = decodeURIComponent(id)
  const channel = await fetchChannelById(decodedId)
  const title = channel?.snippet?.title || 'Channel Analysis'
  return {
    title: `${title} — YouTube Channel Analytics | Tubefission`,
    description: `Analyze ${title}'s YouTube channel performance, growth metrics, engagement rates, and content strategy with AI-powered insights.`,
  }
}

export default async function ChannelPage({ params }: ChannelPageProps) {
  const { id } = await params
  const decodedId = decodeURIComponent(id)
  const channel = await fetchChannelById(decodedId)

  if (!channel) return notFound()

  const videos = await fetchChannelVideos(decodedId, 50)
  const analysis = analyzeChannel(videos, channel)
  const insights = generateChannelInsights(channel, analysis)
  const chartData = generateChannelChartData(videos, channel)
  const aiIntelligence = analyzeChannelIntelligence(channel, videos)

  const stats = channel.statistics
  const snippet = channel.snippet
  const channelActionPlan = analysis ? buildChannelActionPlan(analysis) : []

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6"
        >
          <span className="text-lg">←</span>
          <span className="text-sm font-medium">Back to Analytics</span>
        </Link>

        {/* Channel Header */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-start gap-4 sm:gap-6 mb-4">
            {snippet?.thumbnails?.high?.url && (
              <img
                src={snippet.thumbnails.high.url}
                alt={snippet.title}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-gray-200"
              />
            )}
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {snippet?.title}
              </h1>
              <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                {snippet?.description?.slice(0, 200)}...
              </p>
              <a
                href={`https://youtube.com/channel/${channel.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 text-sm font-medium"
              >
                <span>View on YouTube</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 sm:mb-10">
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <div className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Subscribers</div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{formatNumber(stats?.subscriberCount)}</div>
            <div className="text-xs text-green-600 mt-1">Total subscribers</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <div className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Total Views</div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{formatNumber(stats?.viewCount)}</div>
            <div className="text-xs text-blue-600 mt-1">Lifetime views</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <div className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Videos</div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{formatNumber(stats?.videoCount)}</div>
            <div className="text-xs text-purple-600 mt-1">Published</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <div className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Avg Views</div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">
              {analysis ? formatNumber(Math.round(analysis.avgViews)) : 'N/A'}
            </div>
            <div className="text-xs text-orange-600 mt-1">Per video</div>
          </div>
        </div>

        {/* Performance Trend Charts */}
        {chartData && (
          <section className="mb-10">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>📈</span> Performance Trends
            </h2>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Subscriber Growth Trend</h3>
                <MetricChart data={chartData.growthData} dataKey="value" color="#10b981" height={200} />
                <p className="text-xs text-gray-500 mt-2">12-month subscriber projection</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Recent Video Views</h3>
                <MetricChart data={chartData.viewsData} dataKey="value" color="#3b82f6" height={200} />
                <p className="text-xs text-gray-500 mt-2">Last {chartData.viewsData.length} videos performance</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Likes Trend</h3>
                <MetricChart data={chartData.likesData} dataKey="value" color="#ef4444" height={200} />
                <p className="text-xs text-gray-500 mt-2">Like accumulation pattern</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Engagement Rate Trend</h3>
                <MetricChart data={chartData.engagementData} dataKey="value" color="#f59e0b" height={200} />
                <p className="text-xs text-gray-500 mt-2">Engagement consistency across uploads</p>
              </div>
            </div>
          </section>
        )}

        {/* Professional Analytics Dashboard */}
        {analysis && (
          <section className="mb-10">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>📊</span> Professional Analytics
            </h2>

            <div className="grid lg:grid-cols-3 gap-6 mb-6">
              {/* Performance Distribution */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Performance Distribution</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-purple-600">🌟 Viral (1M+)</span>
                      <span className="font-medium">{analysis.performanceTiers.viral}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(analysis.performanceTiers.viral / videos.length) * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-green-600">📈 High (100K-1M)</span>
                      <span className="font-medium">{analysis.performanceTiers.high}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${(analysis.performanceTiers.high / videos.length) * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-blue-600">📊 Medium (10K-100K)</span>
                      <span className="font-medium">{analysis.performanceTiers.medium}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(analysis.performanceTiers.medium / videos.length) * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">📉 Low (&lt;10K)</span>
                      <span className="font-medium">{analysis.performanceTiers.low}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gray-400 rounded-full" style={{ width: `${(analysis.performanceTiers.low / videos.length) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Engagement Breakdown */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Engagement Breakdown</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Avg Engagement Rate</span>
                      <span className="font-medium text-green-600">{analysis.avgEngagement.toFixed(2)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min(100, analysis.avgEngagement * 10)}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Avg Like Rate</span>
                      <span className="font-medium text-red-600">{analysis.avgLikeRate.toFixed(2)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: `${Math.min(100, analysis.avgLikeRate * 20)}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Avg Comment Rate</span>
                      <span className="font-medium text-blue-600">{analysis.avgCommentRate.toFixed(3)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, analysis.avgCommentRate * 100)}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Channel Health Metrics */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Channel Health</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Upload Consistency</span>
                    <span className={`font-medium ${analysis.uploadConsistency > 70 ? 'text-green-600' : 'text-yellow-600'}`}>
                      {Math.round(analysis.uploadConsistency)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lifetime Output Avg</span>
                    <span className="font-medium">{analysis.lifetimeOutputPerMonth.toFixed(1)} videos/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Channel Age</span>
                    <span className="font-medium">{analysis.channelAge} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Views per 1K Subs</span>
                    <span className="font-medium">{analysis.avgViewsPer1KSubscribers.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Best Upload Time</span>
                    <span className="font-medium">{analysis.bestPublishTime.dayName}s {analysis.bestPublishTime.formattedHour}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Strategy & Stats */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Content Strategy */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Content Strategy</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Upload Frequency</span>
                    <span className="font-medium">{analysis.uploadFrequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Videos</span>
                    <span className="font-medium">{formatNumber(stats?.videoCount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Channel Created</span>
                    <span className="font-medium">
                      {snippet?.publishedAt ? new Date(snippet.publishedAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  {analysis.contentTypes.length > 0 && (
                    <div className="pt-3 border-t border-gray-200">
                      <div className="text-sm font-medium mb-2">Top Content Types</div>
                      <div className="space-y-1">
                        {analysis.contentTypes.map(([type, count], idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-600">{type}</span>
                            <span>{count} videos</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Performance Benchmarks */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Performance Benchmarks</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Best Video Views</span>
                    <span className="font-medium text-green-600">{formatNumber(analysis.bestVideo?.statistics?.viewCount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Median Video Views</span>
                    <span className="font-medium">{formatNumber(analysis.medianVideo?.statistics?.viewCount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Views Per Video</span>
                    <span className="font-medium">{formatNumber(Math.round(analysis.avgViews))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Est. Monthly Views</span>
                    <span className="font-medium text-blue-600">{formatNumber(Math.round(analysis.estimatedMonthlyViews))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Like Rate</span>
                    <span className="font-medium">{analysis.likeToViewRate.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Recommended Next Moves */}
        {analysis && (
          <section className="mb-10">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>🎯</span> Recommended Next Moves
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {channelActionPlan.map((item) => (
                <div key={item.title} className="bg-white rounded-xl p-5 border border-gray-200">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
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
        )}

        {/* AI Insights */}
        {insights && insights.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>🧠</span> AI Channel Insights
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {insights.map((insight, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl p-5 border ${
                    insight.level === 'viral' ? 'bg-red-50 border-red-200' :
                    insight.level === 'high' ? 'bg-green-50 border-green-200' :
                    insight.level === 'medium' ? 'bg-blue-50 border-blue-200' :
                    'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{insight.icon}</div>
                    <div>
                      <div className="font-bold text-sm sm:text-base mb-1">{insight.title}</div>
                      <div className="text-gray-600 text-sm">{insight.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* AI Channel Intelligence */}
        {aiIntelligence && (
          <section className="mb-10">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>🧠</span> AI Channel Intelligence
            </h2>

            {/* Growth Drivers */}
            {aiIntelligence.growthDrivers.length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
                <h3 className="font-bold text-gray-900 mb-4">Growth Drivers</h3>
                <div className="space-y-3">
                  {aiIntelligence.growthDrivers.map((driver, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{driver.driver}</span>
                          <span className={`text-sm ${driver.trend === 'rising' ? 'text-green-600' : driver.trend === 'falling' ? 'text-red-600' : 'text-gray-600'}`}>
                            {driver.trend === 'rising' ? '↗️' : driver.trend === 'falling' ? '↘️' : '→'} {driver.impact}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${driver.impact > 80 ? 'bg-green-500' : driver.impact > 60 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                            style={{ width: `${driver.impact}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Competitive Edge */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Competitive Position</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Market Position</div>
                  <div className="text-lg font-semibold text-indigo-600">{aiIntelligence.competitiveEdge.marketPosition}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Moat Strength</div>
                  <div className="text-lg font-semibold text-purple-600">{aiIntelligence.competitiveEdge.moatStrength}</div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-sm text-gray-600 mb-1">Unique Value</div>
                  <div className="text-gray-900">{aiIntelligence.competitiveEdge.uniqueValue}</div>
                </div>
              </div>
            </div>

            {/* Audience Insights */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Audience Intelligence</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{aiIntelligence.audienceInsights.loyaltyScore}</div>
                  <div className="text-xs text-gray-600 mt-1">Loyalty Score</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 capitalize">{aiIntelligence.audienceInsights.engagementDepth}</div>
                  <div className="text-xs text-gray-600 mt-1">Engagement</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">+{aiIntelligence.audienceInsights.growthVelocity.toFixed(0)}%</div>
                  <div className="text-xs text-gray-600 mt-1">Growth Velocity</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{aiIntelligence.audienceInsights.retentionEstimate}%</div>
                  <div className="text-xs text-gray-600 mt-1">Retention Est.</div>
                </div>
              </div>
            </div>

            {/* AI Recommendations */}
            {aiIntelligence.recommendations.length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">AI Recommendations</h3>
                <div className="space-y-4">
                  {aiIntelligence.recommendations.map((rec, idx) => (
                    <div key={idx} className={`p-4 rounded-lg border ${rec.priority === 'high' ? 'bg-red-50 border-red-200' : rec.priority === 'medium' ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-start gap-3">
                        <div className={`px-2 py-1 rounded text-xs font-medium ${rec.priority === 'high' ? 'bg-red-100 text-red-700' : rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                          {rec.priority.toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{rec.action}</h4>
                          <p className="text-sm text-gray-600">{rec.expectedImpact}</p>
                          <p className="text-xs text-gray-500 mt-1">⏱️ {rec.timeframe}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* AI Score & Value Analysis */}
        <div className="mb-10">
          <AIScoreCard channelId={channel.id} type="channel" />
        </div>

        {/* Channel Value Analysis */}
        {analysis && (
          <div className="mb-10">
            <ChannelValueAnalysis channel={channel} videos={videos} />
          </div>
        )}

        {/* Enhanced Channel Analytics - 粉丝增长、活跃度、内容分区热度 */}
        <div className="mb-10">
          <EnhancedChannelAnalytics channel={channel} videos={videos} />
        </div>

        {/* Audience Demographics */}
        <div className="mb-10">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>👥</span> Audience Demographics
          </h2>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <AudienceAnalytics channel={channel} />
          </div>
        </div>

        {/* Creator Ecosystem - UP主生态洞察 */}
        <div className="mb-10">
          <CreatorEcosystem category={snippet?.categoryId || 'general'} />
        </div>

        {/* AI Inspiration Report */}
        {analysis && (
          <section className="mb-10">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>💡</span> AI Inspiration Report
            </h2>
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
              <h3 className="font-bold text-gray-900 mb-4">Growth Strategy Recommendations</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Upload Schedule Optimization</h4>
                    <p className="text-gray-600 text-sm">
                      {analysis.uploadConsistency > 80
                        ? `Excellent consistency (${Math.round(analysis.uploadConsistency)}%). Your audience expects content on ${analysis.bestPublishTime.dayName}s around ${analysis.bestPublishTime.formattedHour}. Maintain this schedule to maximize algorithm favorability.`
                        : `Your upload pattern could be more consistent. Try posting on ${analysis.bestPublishTime.dayName}s at ${analysis.bestPublishTime.formattedHour} when your audience is most active. Consistency builds algorithm trust.`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Content Portfolio Strategy</h4>
                    <p className="text-gray-600 text-sm">
                      {analysis.performanceTiers.viral > 0
                        ? `You have ${analysis.performanceTiers.viral} viral videos. Analyze what made them successful - was it the topic, timing, or format? Replicate these elements in future content. ${analysis.performanceTiers.high > 0 ? `Also study your ${analysis.performanceTiers.high} high-performing videos for patterns.` : ''}`
                        : `Focus on creating more high-performing content. Your median video gets ${formatNumber(analysis.medianVideo?.statistics?.viewCount)} views. Study videos that exceeded this benchmark to identify winning patterns.`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Engagement Multiplier</h4>
                    <p className="text-gray-600 text-sm">
                      {analysis.avgEngagement > 5
                        ? `Your ${analysis.avgEngagement.toFixed(2)}% engagement rate is exceptional. Capitalize on this by: (1) Responding to comments within 1 hour, (2) Pinning thought-provoking comments, (3) Creating community posts between videos.`
                        : `Boost your ${analysis.avgEngagement.toFixed(2)}% engagement rate with these tactics: (1) Add CTAs in first 30 seconds, (2) Ask specific questions in your content, (3) Create controversial/conversational takes in your niche.`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm flex-shrink-0">4</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Content Type Optimization</h4>
                    <p className="text-gray-600 text-sm">
                      {analysis.contentTypes.length > 0
                        ? `${analysis.contentTypes[0][0]} represents your core strength (${Math.round((analysis.contentTypes[0][1] / Number(channel.statistics?.videoCount || 1)) * 100)}% of content). ${analysis.contentTypes[1] ? `Your secondary format (${analysis.contentTypes[1][0]}) shows diversification potential.` : ''} Consider A/B testing hybrid formats combining your top content types.`
                        : `Your content lacks clear categorization. Define your niche more precisely by focusing on specific topics or formats. This helps YouTube recommend your content to the right audience.`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm flex-shrink-0">5</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Growth Action Plan</h4>
                    <ul className="text-gray-600 text-sm list-disc list-inside space-y-1">
                      <li>Post {analysis.uploadFrequency.includes('day') && !analysis.uploadFrequency.includes('0.') ? 'consistently at your current frequency' : '2-3 times per week minimum'} to maintain algorithm momentum</li>
                      <li>Study your top-performing video and create a 3-part series expanding on that topic</li>
                      <li>Optimize titles using power words + numbers (e.g., "7 Secrets to...")</li>
                      <li>Engage with first 20 comments within 2 hours of posting</li>
                      <li>Collaborate with channels {Number(channel.statistics?.subscriberCount) > 10000 ? 'at your level' : 'slightly larger than yours'} for cross-promotion</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Recent Videos */}
        {analysis?.recentVideos && analysis.recentVideos.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>🎥</span> Recent Uploads
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {analysis.recentVideos.slice(0, 6).map((video: any) => (
                <Link
                  key={video.id}
                  href={`/video/${video.id}`}
                  className="group block bg-gray-50 rounded-xl overflow-hidden border border-gray-100 hover:border-gray-300 transition-colors"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={video.snippet?.thumbnails?.medium?.url}
                      alt={video.snippet?.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                      {video.snippet?.title}
                    </h3>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{formatNumber(video.statistics?.viewCount)} views</span>
                      <span>{calculateEngagementRate(video).toFixed(1)}% engagement</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Best Performing Video */}
        {analysis?.bestVideo && (
          <section className="mb-10">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>👑</span> Best Performing Video
            </h2>
            <Link
              href={`/video/${analysis.bestVideo.id}`}
              className="group block bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 hover:border-blue-300 transition-colors"
            >
              <div className="flex gap-4">
                <div className="w-32 sm:w-40 aspect-video rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={analysis.bestVideo.snippet?.thumbnails?.medium?.url}
                    alt={analysis.bestVideo.snippet?.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-base sm:text-lg mb-2 group-hover:text-blue-600 transition-colors">
                    {analysis.bestVideo.snippet?.title}
                  </h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500 text-xs">Views</div>
                      <div className="font-bold">{formatNumber(analysis.bestVideo.statistics?.viewCount)}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs">Likes</div>
                      <div className="font-bold">{formatNumber(analysis.bestVideo.statistics?.likeCount)}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs">Engagement</div>
                      <div className="font-bold">{calculateEngagementRate(analysis.bestVideo).toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* CTA */}
        <div className="bg-gray-900 rounded-xl p-6 text-center">
          <h3 className="text-white font-bold text-lg mb-2">Want to analyze another channel?</h3>
          <p className="text-gray-400 text-sm mb-4">Paste any YouTube channel URL above to see detailed analytics</p>
          <Link
            href="/youtube-competitor-analysis"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Compare Competitors →
          </Link>
        </div>
      </div>
    </main>
  )
}
