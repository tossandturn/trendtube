/* =========================================================
   TREND ANALYSIS ENGINE — Velocity, acceleration, prediction
========================================================= */

export interface TrendMetrics {
  velocity: number
  acceleration: number
  saturation: number
  momentum: 'rising' | 'stable' | 'falling'
  prediction: TrendPrediction
}

export interface TrendPrediction {
  projectedGrowth: number
  confidence: number
  peakTime: string
  longevity: 'short' | 'medium' | 'long'
  recommendation: string
}

export interface TrendOpportunity {
  score: number
  competition: 'low' | 'medium' | 'high'
  timing: 'early' | 'peak' | 'late'
  potentialViews: number
  difficulty: number
}

// Calculate trend velocity (views per hour)
export function calculateVelocity(currentViews: number, prevViews: number, hoursElapsed: number): number {
  if (hoursElapsed <= 0) return 0
  const viewDelta = currentViews - prevViews
  return viewDelta / hoursElapsed
}

// Calculate trend acceleration (change in velocity)
export function calculateAcceleration(currentVelocity: number, prevVelocity: number, hoursElapsed: number): number {
  if (hoursElapsed <= 0) return 0
  return (currentVelocity - prevVelocity) / hoursElapsed
}

// Calculate market saturation (0-100)
export function calculateSaturation(videoCount: number, avgViews: number, category: string): number {
  // Higher video count with lower avg views = more saturated
  const baselineVideos: Record<string, number> = {
    'Gaming': 10000,
    'Music': 50000,
    'Education': 5000,
    'Entertainment': 80000,
    'Technology': 8000,
    'default': 20000
  }
  
  const baseline = baselineVideos[category] || baselineVideos.default
  const saturationRatio = videoCount / baseline
  
  // If avg views are low despite many videos, market is saturated
  const viewQuality = avgViews > 100000 ? 0.5 : avgViews > 10000 ? 0.7 : 1
  
  return Math.min(100, saturationRatio * viewQuality * 100)
}

// Determine trend momentum
export function determineMomentum(velocity: number, acceleration: number): 'rising' | 'stable' | 'falling' {
  if (acceleration > 100 || (velocity > 1000 && acceleration > 0)) return 'rising'
  if (acceleration < -100 || (velocity < 100 && acceleration < 0)) return 'falling'
  return 'stable'
}

// Predict trend trajectory
export function predictTrend(
  currentViews: number,
  velocity: number,
  acceleration: number,
  saturation: number,
  age: number
): TrendPrediction {
  // Calculate projected growth
  let projectedGrowth = 0
  let confidence = 50
  
  if (acceleration > 0 && saturation < 60) {
    // Rising trend with room to grow
    projectedGrowth = Math.min(500, (velocity / 1000) * (acceleration / 100) * 100)
    confidence = Math.min(90, 100 - saturation * 0.5)
  } else if (acceleration > 0 && saturation >= 60) {
    // Rising but saturated
    projectedGrowth = Math.min(200, velocity / 1000 * 50)
    confidence = 40
  } else if (acceleration < 0) {
    // Decelerating
    projectedGrowth = Math.max(-50, acceleration / 10)
    confidence = 70
  } else {
    // Stable
    projectedGrowth = 10
    confidence = 60
  }
  
  // Determine peak time
  let peakTime = 'unknown'
  if (age < 24 && acceleration > 0) {
    peakTime = '12-24 hours'
  } else if (age < 72 && acceleration > 0) {
    peakTime = '2-3 days'
  } else if (acceleration < 0) {
    peakTime = 'already peaked'
  } else {
    peakTime = '1 week'
  }
  
  // Determine longevity
  let longevity: 'short' | 'medium' | 'long' = 'medium'
  if (saturation > 80 && acceleration < 0) {
    longevity = 'short'
  } else if (saturation < 40 && acceleration > 0) {
    longevity = 'long'
  }
  
  // Generate recommendation
  let recommendation = ''
  if (acceleration > 0 && saturation < 50) {
    recommendation = '🚀 High opportunity - Create content now while trend is rising'
  } else if (acceleration > 0 && saturation < 70) {
    recommendation = '⚡ Moderate opportunity - Add unique angle to stand out'
  } else if (acceleration < 0) {
    recommendation = '⚠️ Trend fading - Consider alternative angles or next trend'
  } else {
    recommendation = '⏱️ Monitor for changes - Trend is stable'
  }
  
  return {
    projectedGrowth,
    confidence,
    peakTime,
    longevity,
    recommendation
  }
}

// Calculate opportunity score
export function calculateOpportunity(
  breakoutScore: number,
  saturation: number,
  velocity: number,
  videoCount: number
): TrendOpportunity {
  // Score based on multiple factors
  const velocityScore = Math.min(30, velocity / 1000)
  const breakoutScoreNorm = Math.min(40, breakoutScore * 0.4)
  const saturationBonus = saturation < 50 ? 20 : saturation < 70 ? 10 : 0
  
  const score = Math.min(100, velocityScore + breakoutScoreNorm + saturationBonus)
  
  // Determine competition level
  const competition: 'low' | 'medium' | 'high' =
    videoCount < 100 ? 'low' : videoCount < 500 ? 'medium' : 'high'
  
  // Determine timing
  const timing: 'early' | 'peak' | 'late' =
    score > 70 ? 'early' : score > 40 ? 'peak' : 'late'
  
  // Estimate potential views
  const potentialViews = velocity > 0 ? velocity * 24 * 7 : 0
  
  // Calculate difficulty
  const difficulty = Math.min(100, (videoCount / 100) + (saturation * 0.5))
  
  return {
    score,
    competition,
    timing,
    potentialViews,
    difficulty
  }
}

// Analyze trend lifecycle stage
export function analyzeLifecycleStage(
  age: number,
  velocity: number,
  acceleration: number
): 'emerging' | 'accelerating' | 'peak' | 'declining' | 'mature' {
  if (age < 12 && acceleration > 0) return 'emerging'
  if (age < 48 && acceleration > 0 && velocity > 1000) return 'accelerating'
  if (age < 72 && acceleration <= 0 && velocity > 500) return 'peak'
  if (age < 120 && acceleration < -50) return 'declining'
  return 'mature'
}

// Generate trend insights
export function generateTrendInsights(
  trend: any,
  relatedTrends: any[]
): string[] {
  const insights: string[] = []
  
  // Compare to related trends
  const avgRelatedVelocity = relatedTrends.length > 0
    ? relatedTrends.reduce((sum, t) => sum + (t.avgVelocity || 0), 0) / relatedTrends.length
    : 0
  
  if (trend.avgVelocity > avgRelatedVelocity * 2) {
    insights.push(`🔥 This trend is moving ${(trend.avgVelocity / avgRelatedVelocity).toFixed(1)}x faster than related trends`)
  }
  
  // Video count insight
  if (trend.videoCount < 50) {
    insights.push('📊 Low competition - only ' + trend.videoCount + ' videos in this space')
  } else if (trend.videoCount > 500) {
    insights.push('⚠️ High competition - ' + trend.videoCount + ' videos, need strong differentiation')
  }
  
  // Breakout potential
  if (trend.breakoutScore > 80) {
    insights.push('🚀 High breakout potential - early entry opportunity')
  } else if (trend.breakoutScore > 60) {
    insights.push('📈 Moderate breakout potential - can gain traction with quality content')
  }
  
  return insights
}
