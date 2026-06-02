/* =========================================================
   AI INSIGHTS ENGINE — Deep content intelligence
========================================================= */

export interface VideoIntelligence {
  successFactors: SuccessFactor[]
  contentPatterns: ContentPattern
  optimization: OptimizationInsights
  engagementDeepDive: EngagementAnalysis
  trajectory: TrajectoryPrediction
  competitive: CompetitiveInsights
}

export interface SuccessFactor {
  factor: string
  impact: 'high' | 'medium' | 'low'
  evidence: string
  actionable: string
}

export interface ContentPattern {
  format: string
  hook: string
  pacing: string
  retentionStrategy: string
  emotionalTriggers: string[]
}

export interface OptimizationInsights {
  title: {
    current: number
    suggestions: string[]
    powerWords: string[]
  }
  thumbnail: {
    score: number
    recommendations: string[]
  }
  description: {
    seoScore: number
    improvements: string[]
  }
}

export interface EngagementAnalysis {
  likeVelocity: number
  commentSentiment: 'positive' | 'neutral' | 'mixed'
  shareProbability: number
  watchTimeEstimate: number
}

export interface TrajectoryPrediction {
  projectedViews: number
  growthCurve: 'viral' | 'steady' | 'plateau'
  peakTime: string
  longevity: 'evergreen' | 'trending' | 'fading'
}

export interface CompetitiveInsights {
  nichePosition: string
  differentiation: string
  competitorGap: string
  opportunityScore: number
}

// Main analysis function
export function analyzeVideoIntelligence(video: any, relatedVideos: any[] = []): VideoIntelligence {
  const stats = video.statistics || {}
  const snippet = video.snippet || {}
  const title = snippet.title || ''
  const views = Number(stats.viewCount || 0)
  const likes = Number(stats.likeCount || 0)
  const comments = Number(stats.commentCount || 0)

  // Calculate engagement metrics
  const engagement = views > 0 ? ((likes + comments * 2) / views) * 100 : 0
  const likeRate = views > 0 ? (likes / views) * 100 : 0
  const commentRate = views > 0 ? (comments / views) * 100 : 0

  // Analyze success factors
  const successFactors = analyzeSuccessFactors(video, engagement, likeRate)

  // Analyze content patterns
  const contentPatterns = analyzeContentPatterns(title, video)

  // Generate optimization insights
  const optimization = analyzeOptimization(video, title, snippet.description || '')

  // Engagement deep dive
  const engagementDeepDive = analyzeEngagementDeep(video, engagement)

  // Predict trajectory
  const trajectory = predictTrajectory(video, engagement)

  // Competitive analysis
  const competitive = analyzeCompetitivePosition(video, relatedVideos)

  return {
    successFactors,
    contentPatterns,
    optimization,
    engagementDeepDive,
    trajectory,
    competitive
  }
}

function analyzeSuccessFactors(video: any, engagement: number, likeRate: number): SuccessFactor[] {
  const factors: SuccessFactor[] = []
  const title = video.snippet?.title?.toLowerCase() || ''
  const views = Number(video.statistics?.viewCount || 0)

  // Factor 1: Emotional hook
  if (title.includes('?') || title.includes('!')) {
    factors.push({
      factor: 'Emotional Hook',
      impact: 'high',
      evidence: 'Uses question marks or exclamation points to create curiosity',
      actionable: 'Test emotional hooks in your titles - questions drive 23% more clicks'
    })
  }

  // Factor 2: Numbers/List format
  if (/\d/.test(title)) {
    factors.push({
      factor: 'List Format',
      impact: 'high',
      evidence: 'Uses specific numbers which create concrete expectations',
      actionable: 'Use odd numbers (3, 5, 7) in titles - they perform 20% better than even numbers'
    })
  }

  // Factor 3: Engagement quality
  if (engagement > 5) {
    factors.push({
      factor: 'High Engagement',
      impact: 'high',
      evidence: `Exceptional ${engagement.toFixed(2)}% engagement rate vs industry average of 2-3%`,
      actionable: 'Study the content structure that drove this engagement - replicate the format'
    })
  }

  // Factor 4: Viral mechanics
  if (views > 1000000) {
    factors.push({
      factor: 'Viral Mechanics',
      impact: 'high',
      evidence: 'Crossed 1M views indicating broad appeal and shareability',
      actionable: 'Create follow-up content quickly while momentum is high'
    })
  }

  // Factor 5: Like quality
  if (likeRate > 3) {
    factors.push({
      factor: 'Quality Signal',
      impact: 'medium',
      evidence: `${likeRate.toFixed(2)}% like-to-view ratio indicates content satisfaction`,
      actionable: 'This content resonates - analyze what made viewers hit like'
    })
  }

  // Factor 6: Timing
  const publishHour = new Date(video.snippet?.publishedAt).getHours()
  if (publishHour >= 14 && publishHour <= 18) {
    factors.push({
      factor: 'Optimal Timing',
      impact: 'medium',
      evidence: 'Published during peak engagement window (2-6 PM)',
      actionable: 'Schedule uploads during this window for maximum initial traction'
    })
  }

  return factors
}

function analyzeContentPatterns(title: string, video: any): ContentPattern {
  const patterns: ContentPattern = {
    format: 'standard',
    hook: 'standard',
    pacing: 'moderate',
    retentionStrategy: 'basic',
    emotionalTriggers: []
  }

  // Detect format
  if (title.toLowerCase().includes('how to') || title.toLowerCase().includes('tutorial')) {
    patterns.format = 'educational'
    patterns.retentionStrategy = 'progressive learning'
  } else if (title.toLowerCase().includes('vs') || title.toLowerCase().includes('comparison')) {
    patterns.format = 'comparison'
    patterns.retentionStrategy = 'tension building'
  } else if (title.toLowerCase().includes('reaction')) {
    patterns.format = 'reaction'
    patterns.retentionStrategy = 'emotional journey'
  } else if (title.toLowerCase().includes('story') || title.toLowerCase().includes('my ')) {
    patterns.format = 'storytelling'
    patterns.retentionStrategy = 'narrative arc'
  } else if (title.toLowerCase().includes('shorts') || title.toLowerCase().includes('#shorts')) {
    patterns.format = 'shorts'
    patterns.retentionStrategy = 'immediate payoff'
  }

  // Detect hook type
  if (title.includes('?')) {
    patterns.hook = 'curiosity gap'
    patterns.emotionalTriggers.push('curiosity')
  } else if (title.toLowerCase().includes('secret') || title.toLowerCase().includes('hidden')) {
    patterns.hook = 'insider knowledge'
    patterns.emotionalTriggers.push('exclusivity', 'curiosity')
  } else if (title.toLowerCase().includes('shocking') || title.toLowerCase().includes('unbelievable')) {
    patterns.hook = 'surprise factor'
    patterns.emotionalTriggers.push('surprise', 'awe')
  } else if (title.toLowerCase().includes('must watch') || title.toLowerCase().includes('important')) {
    patterns.hook = 'urgency'
    patterns.emotionalTriggers.push('urgency', 'fomo')
  }

  // Detect emotional triggers
  if (title.toLowerCase().includes('fail') || title.toLowerCase().includes('worst')) {
    patterns.emotionalTriggers.push('schadenfreude')
  }
  if (title.toLowerCase().includes('best') || title.toLowerCase().includes('top')) {
    patterns.emotionalTriggers.push('aspiration')
  }
  if (title.toLowerCase().includes('challenge')) {
    patterns.emotionalTriggers.push('competition')
  }
  if (title.toLowerCase().includes('transform') || title.toLowerCase().includes('before')) {
    patterns.emotionalTriggers.push('transformation')
  }

  return patterns
}

function analyzeOptimization(video: any, title: string, description: string): OptimizationInsights {
  const insights: OptimizationInsights = {
    title: {
      current: 50,
      suggestions: [],
      powerWords: []
    },
    thumbnail: {
      score: 50,
      recommendations: []
    },
    description: {
      seoScore: 50,
      improvements: []
    }
  }

  // Title analysis
  const titleLength = title.length
  if (titleLength >= 40 && titleLength <= 60) {
    insights.title.current += 15
  }

  const powerWords = ['ultimate', 'best', 'worst', 'secret', 'proven', 'exclusive', 'shocking', 'amazing']
  const foundPowerWords = powerWords.filter(word => title.toLowerCase().includes(word))
  insights.title.powerWords = foundPowerWords
  if (foundPowerWords.length > 0) {
    insights.title.current += foundPowerWords.length * 10
  }

  if (!title.includes('?') && !title.includes('!')) {
    insights.title.suggestions.push('Add a question mark or exclamation point to increase curiosity')
  }
  if (titleLength > 60) {
    insights.title.suggestions.push('Title may be truncated on mobile - aim for under 60 characters')
  }
  if (!/\d/.test(title)) {
    insights.title.suggestions.push('Consider adding a specific number (e.g., "7 Tips" performs better than "Tips")')
  }

  // Thumbnail analysis (based on view count as proxy)
  const views = Number(video.statistics?.viewCount || 0)
  if (views > 1000000) {
    insights.thumbnail.score = 85
    insights.thumbnail.recommendations.push('High-performing thumbnail detected - study contrast, facial expressions, and text overlay')
  } else if (views > 100000) {
    insights.thumbnail.score = 70
    insights.thumbnail.recommendations.push('Good performance - test adding emotional faces or bold colors')
  } else {
    insights.thumbnail.score = 50
    insights.thumbnail.recommendations.push('Consider A/B testing with faces, bright colors, and minimal text')
  }
  insights.thumbnail.recommendations.push('Use 1280x720 resolution with bold, readable text (3-4 words max)')

  // Description analysis
  const descLength = description.length
  if (descLength > 200) insights.description.seoScore += 20
  if (descLength > 500) insights.description.seoScore += 10
  if (/https?:\/\/\S+/.test(description)) insights.description.seoScore += 10
  if (/\d{1,2}:\d{2}/.test(description)) insights.description.seoScore += 10

  if (descLength < 200) {
    insights.description.improvements.push('Add more context - aim for 200+ characters for better SEO')
  }
  if (!/https?:\/\/\S+/.test(description)) {
    insights.description.improvements.push('Add relevant links to playlists or related content')
  }
  if (!/#\w+/.test(description)) {
    insights.description.improvements.push('Include 3-5 relevant hashtags')
  }

  return insights
}

function analyzeEngagementDeep(video: any, engagement: number): EngagementAnalysis {
  const views = Number(video.statistics?.viewCount || 0)
  const likes = Number(video.statistics?.likeCount || 0)
  const comments = Number(video.statistics?.commentCount || 0)

  // Calculate like velocity (likes per 1000 views)
  const likeVelocity = views > 0 ? (likes / views) * 1000 : 0

  // Estimate comment sentiment based on engagement
  const commentSentiment: 'positive' | 'neutral' | 'mixed' =
    engagement > 4 ? 'positive' : engagement > 2 ? 'mixed' : 'neutral'

  // Estimate share probability based on engagement
  const shareProbability = Math.min(100, engagement * 5)

  // Estimate watch time (simplified)
  const watchTimeEstimate = engagement > 3 ? 60 : engagement > 2 ? 45 : 30

  return {
    likeVelocity,
    commentSentiment,
    shareProbability,
    watchTimeEstimate
  }
}

function predictTrajectory(video: any, engagement: number): TrajectoryPrediction {
  const views = Number(video.statistics?.viewCount || 0)
  const publishDate = new Date(video.snippet?.publishedAt || Date.now())
  const daysSincePublish = (Date.now() - publishDate.getTime()) / (1000 * 60 * 60 * 24)

  // Determine growth curve
  let growthCurve: 'viral' | 'steady' | 'plateau' = 'steady'
  if (engagement > 5 && views > 100000) {
    growthCurve = 'viral'
  } else if (engagement < 2 && daysSincePublish > 7) {
    growthCurve = 'plateau'
  }

  // Predict peak time
  const peakTime = growthCurve === 'viral' ? '24-48 hours' :
                   growthCurve === 'steady' ? '3-7 days' : 'already peaked'

  // Determine longevity
  let longevity: 'evergreen' | 'trending' | 'fading' = 'trending'
  const title = video.snippet?.title?.toLowerCase() || ''
  if (title.includes('how to') || title.includes('tutorial') || title.includes('guide')) {
    longevity = 'evergreen'
  } else if (engagement < 2 && daysSincePublish > 14) {
    longevity = 'fading'
  }

  // Project views
  let projectedViews = views
  if (growthCurve === 'viral') {
    projectedViews = views * 3
  } else if (growthCurve === 'steady') {
    projectedViews = views * 1.5
  }

  return {
    projectedViews,
    growthCurve,
    peakTime,
    longevity
  }
}

function analyzeCompetitivePosition(video: any, relatedVideos: any[]): CompetitiveInsights {
  const videoViews = Number(video.statistics?.viewCount || 0)
  const videoEngagement = videoViews > 0 ?
    (Number(video.statistics?.likeCount || 0) + Number(video.statistics?.commentCount || 0) * 2) / videoViews * 100 : 0

  // Calculate relative performance
  const relatedViews = relatedVideos.map(v => Number(v.statistics?.viewCount || 0))
  const avgRelatedViews = relatedViews.length > 0 ? relatedViews.reduce((a, b) => a + b, 0) / relatedViews.length : 0

  const performanceRatio = avgRelatedViews > 0 ? videoViews / avgRelatedViews : 1

  let nichePosition = 'average'
  if (performanceRatio > 2) nichePosition = 'leader'
  else if (performanceRatio > 1.2) nichePosition = 'above average'
  else if (performanceRatio < 0.8) nichePosition = 'below average'

  // Analyze differentiation
  const title = video.snippet?.title?.toLowerCase() || ''
  const relatedTitles = relatedVideos.map(v => v.snippet?.title?.toLowerCase() || '')

  const commonWords = findCommonWords(relatedTitles)
  const uniqueWords = title.split(/\s+/).filter((word: string) => !commonWords.includes(word))

  const differentiation = uniqueWords.length > 3 ? 'highly differentiated' :
                          uniqueWords.length > 1 ? 'moderately differentiated' : 'similar to competition'

  // Identify gap
  const competitorGap = performanceRatio > 1.5 ?
    'Significantly outperforming similar content - maintain this advantage' :
    performanceRatio < 0.8 ?
    'Underperforming - study top performers and adapt their strategies' :
    'Performing on par with competition'

  // Calculate opportunity score
  const opportunityScore = Math.min(100, Math.round((videoEngagement * 10) + (performanceRatio * 20)))

  return {
    nichePosition,
    differentiation,
    competitorGap,
    opportunityScore
  }
}

function findCommonWords(titles: string[]): string[] {
  const wordCounts: Record<string, number> = {}
  titles.forEach(title => {
    title.split(/\s+/).forEach((word: string) => {
      wordCounts[word] = (wordCounts[word] || 0) + 1
    })
  })

  return Object.entries(wordCounts)
    .filter(([, count]) => count >= titles.length * 0.3)
    .map(([word]) => word)
}

// Channel Intelligence
export interface ChannelIntelligence {
  growthDrivers: GrowthDriver[]
  contentStrategy: StrategyInsights
  audienceInsights: AudienceAnalysis
  competitiveEdge: CompetitiveEdge
  recommendations: Recommendation[]
}

export interface GrowthDriver {
  driver: string
  impact: number
  trend: 'rising' | 'stable' | 'falling'
}

export interface StrategyInsights {
  contentMix: Record<string, number>
  uploadPattern: string
  optimalTiming: { day: string; hour: number }
  seriesStrategy: boolean
}

export interface AudienceAnalysis {
  loyaltyScore: number
  engagementDepth: 'deep' | 'moderate' | 'surface'
  growthVelocity: number
  retentionEstimate: number
}

export interface CompetitiveEdge {
  uniqueValue: string
  marketPosition: 'leader' | 'challenger' | 'follower'
  differentiation: string
  moatStrength: 'strong' | 'moderate' | 'weak'
}

export interface Recommendation {
  priority: 'high' | 'medium' | 'low'
  action: string
  expectedImpact: string
  timeframe: string
}

export function analyzeChannelIntelligence(channel: any, videos: any[]): ChannelIntelligence {
  // Growth drivers
  const growthDrivers: GrowthDriver[] = []

  const uploadFrequency = calculateUploadFrequency(videos)
  if (uploadFrequency > 2) {
    growthDrivers.push({
      driver: 'Consistent Uploads',
      impact: uploadFrequency > 4 ? 90 : 70,
      trend: 'rising'
    })
  }

  const avgViews = videos.length > 0 ?
    videos.reduce((sum, v) => sum + Number(v.statistics?.viewCount || 0), 0) / videos.length : 0
  const subscriberCount = Number(channel.statistics?.subscriberCount || 0)
  const viewToSubRatio = subscriberCount > 0 ? avgViews / subscriberCount : 0

  if (viewToSubRatio > 0.3) {
    growthDrivers.push({
      driver: 'High Content Reach',
      impact: Math.round(viewToSubRatio * 100),
      trend: 'rising'
    })
  }

  // Content strategy
  const contentTypes = analyzeContentTypes(videos)
  const uploadPattern = analyzeUploadPattern(videos)
  const optimalTiming = findOptimalTiming(videos)
  const seriesStrategy = detectSeriesStrategy(videos)

  // Audience insights
  const engagementRates = videos.map(v => {
    const views = Number(v.statistics?.viewCount || 0)
    const likes = Number(v.statistics?.likeCount || 0)
    return views > 0 ? (likes / views) * 100 : 0
  })
  const avgEngagement = engagementRates.length > 0 ?
    engagementRates.reduce((a, b) => a + b, 0) / engagementRates.length : 0

  const audienceInsights: AudienceAnalysis = {
    loyaltyScore: Math.min(100, avgEngagement * 20),
    engagementDepth: avgEngagement > 3 ? 'deep' : avgEngagement > 1.5 ? 'moderate' : 'surface',
    growthVelocity: calculateGrowthVelocity(videos),
    retentionEstimate: Math.min(100, avgEngagement * 25 + 30)
  }

  // Competitive edge
  const competitiveEdge: CompetitiveEdge = {
    uniqueValue: identifyUniqueValue(channel, videos),
    marketPosition: subscriberCount > 100000 ? 'leader' : subscriberCount > 10000 ? 'challenger' : 'follower',
    differentiation: analyzeDifferentiation(videos),
    moatStrength: avgEngagement > 3 ? 'strong' : avgEngagement > 2 ? 'moderate' : 'weak'
  }

  // Recommendations
  const recommendations: Recommendation[] = generateRecommendations(channel, videos, avgEngagement, uploadFrequency)

  return {
    growthDrivers,
    contentStrategy: {
      contentMix: contentTypes,
      uploadPattern,
      optimalTiming,
      seriesStrategy
    },
    audienceInsights,
    competitiveEdge,
    recommendations
  }
}

function calculateUploadFrequency(videos: any[]): number {
  if (videos.length < 2) return 0
  const dates = videos.map(v => new Date(v.snippet?.publishedAt)).sort((a, b) => b.getTime() - a.getTime())
  const daysSpan = (dates[0].getTime() - dates[dates.length - 1].getTime()) / (1000 * 60 * 60 * 24)
  return daysSpan > 0 ? (videos.length / daysSpan) * 7 : 0
}

function analyzeContentTypes(videos: any[]): Record<string, number> {
  const types: Record<string, number> = {}
  const keywords: Record<string, string[]> = {
    'Tutorial': ['how to', 'tutorial', 'guide', 'learn'],
    'Entertainment': ['funny', 'prank', 'challenge', 'reaction'],
    'Review': ['review', 'unboxing', 'test'],
    'Vlog': ['vlog', 'day in', 'daily'],
    'Gaming': ['game', 'gameplay', 'playthrough']
  }

  videos.forEach(video => {
    const title = video.snippet?.title?.toLowerCase() || ''
    for (const [type, words] of Object.entries(keywords)) {
      if (words.some(w => title.includes(w))) {
        types[type] = (types[type] || 0) + 1
        break
      }
    }
  })

  return types
}

function analyzeUploadPattern(videos: any[]): string {
  if (videos.length < 3) return 'irregular'
  const days = videos.map(v => new Date(v.snippet?.publishedAt).getDay())
  const dayCounts = days.reduce((acc, d) => { acc[d] = (acc[d] || 0) + 1; return acc }, {} as Record<number, number>)
  const mostCommonDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0]

  return mostCommonDay && mostCommonDay[1] >= videos.length * 0.4 ?
    `consistent (${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][Number(mostCommonDay[0])]})` :
    'irregular'
}

function findOptimalTiming(videos: any[]): { day: string; hour: number } {
  if (videos.length === 0) return { day: 'unknown', hour: 12 }

  const days = videos.map(v => new Date(v.snippet?.publishedAt).getDay())
  const hours = videos.map(v => new Date(v.snippet?.publishedAt).getHours())

  const avgDay = Math.round(days.reduce((a, b) => a + b, 0) / days.length)
  const avgHour = Math.round(hours.reduce((a, b) => a + b, 0) / hours.length)

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  return { day: dayNames[avgDay] || 'unknown', hour: avgHour }
}

function detectSeriesStrategy(videos: any[]): boolean {
  const titles = videos.map(v => v.snippet?.title || '')
  const hasPartNumbers = titles.some(t => /part\s*\d|episode\s*\d|#\d+/i.test(t))
  const hasConsistentPrefix = titles.length > 2 &&
    titles.slice(0, 3).every((t, i, arr) => {
      if (i === 0) return true
      const words1 = t.split(' ').slice(0, 2).join(' ')
      const words2 = arr[i-1].split(' ').slice(0, 2).join(' ')
      return words1 === words2
    })

  return hasPartNumbers || hasConsistentPrefix
}

function calculateGrowthVelocity(videos: any[]): number {
  if (videos.length < 3) return 0
  const sorted = [...videos].sort((a, b) =>
    new Date(a.snippet?.publishedAt).getTime() - new Date(b.snippet?.publishedAt).getTime()
  )

  const earlyViews = sorted.slice(0, Math.floor(sorted.length / 2))
    .reduce((sum, v) => sum + Number(v.statistics?.viewCount || 0), 0) / Math.floor(sorted.length / 2)
  const recentViews = sorted.slice(-Math.floor(sorted.length / 2))
    .reduce((sum, v) => sum + Number(v.statistics?.viewCount || 0), 0) / Math.floor(sorted.length / 2)

  return earlyViews > 0 ? ((recentViews - earlyViews) / earlyViews) * 100 : 0
}

function identifyUniqueValue(channel: any, videos: any[]): string {
  const titles = videos.map(v => v.snippet?.title?.toLowerCase() || '')
  const commonThemes = findCommonWords(titles)

  if (commonThemes.length > 0) {
    return `Specializes in ${commonThemes.slice(0, 3).join(', ')} content`
  }

  return 'General content creator'
}

function analyzeDifferentiation(videos: any[]): string {
  const titles = videos.map(v => v.snippet?.title || '')
  const hasUniqueAngles = titles.some(t =>
    /vs|comparison|reaction|challenge|experiment/i.test(t)
  )

  return hasUniqueAngles ? 'Uses unique content angles (vs, experiments, reactions)' : 'Standard content format'
}

function generateRecommendations(channel: any, videos: any[], avgEngagement: number, uploadFrequency: number): Recommendation[] {
  const recommendations: Recommendation[] = []

  if (uploadFrequency < 2) {
    recommendations.push({
      priority: 'high',
      action: 'Increase upload frequency to 2-3 times per week',
      expectedImpact: '+40% channel growth',
      timeframe: '4-8 weeks'
    })
  }

  if (avgEngagement < 2) {
    recommendations.push({
      priority: 'high',
      action: 'Add stronger CTAs in first 30 seconds and end of videos',
      expectedImpact: '+25% engagement rate',
      timeframe: '2-4 weeks'
    })
  }

  const hasSeries = detectSeriesStrategy(videos)
  if (!hasSeries) {
    recommendations.push({
      priority: 'medium',
      action: 'Create a content series to boost binge-watching',
      expectedImpact: '+30% watch time',
      timeframe: '6-12 weeks'
    })
  }

  recommendations.push({
    priority: 'medium',
    action: 'Analyze top 3 performing videos and replicate their format',
    expectedImpact: '+20% average views',
    timeframe: '4-6 weeks'
  })

  return recommendations
}
