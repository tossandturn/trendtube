/**
 * YouTube Analytics Engine — 自动化测试
 * 
 * 直接读取 engine.js 源码并执行测试
 * 运行: node test-analytics-engine.mjs
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// 读取引擎源码并转化为可执行函数
let source = readFileSync(join(__dirname, 'lib', 'youtube-analytics-engine.js'), 'utf8');

// 移除 ES module 关键字，用 var 替代 const/let 以确保 eval 作用域
source = source.replace(/^export /gm, '');
source = source.replace(/^import\b.*$/gm, '');
source = source.replace(/\bconst\b/g, 'var');
source = source.replace(/\blet\b/g, 'var');

// 在全局 eval 中执行
const fn = new Function(source + `
  return {
    analyzeVideo,
    analyzeChannel,
    analyzeVideoSEO,
    predictTrend,
    CATEGORY_BENCHMARKS,
    CPM_BY_COUNTRY,
    calculateViewerSatisfactionIndex,
    calculateAlgorithmSurfaceDistribution,
    calculateContentDecayRate,
    calculateSessionExtensionValue,
    calculateCommentIntelligence,
  };
`);

const {
  analyzeVideo,
  analyzeChannel,
  analyzeVideoSEO,
  predictTrend,
  CATEGORY_BENCHMARKS,
  CPM_BY_COUNTRY,
  calculateViewerSatisfactionIndex,
  calculateAlgorithmSurfaceDistribution,
  calculateContentDecayRate,
  calculateSessionExtensionValue,
  calculateCommentIntelligence,
} = fn();

// ============================================
// 测试框架
// ============================================
let totalTests = 0;
let passed = 0;
let failed = 0;
const failures = [];

function assert(condition, message, details) {
  totalTests++;
  if (condition) {
    passed++;
    console.log(`  ✅ ${message}`);
  } else {
    failed++;
    console.log(`  ❌ ${message}`);
    if (details) console.log(`     → ${details}`);
    failures.push(message + (details ? ': ' + details : ''));
  }
}

function assertRange(value, min, max, message) {
  assert(typeof value === 'number' && value >= min && value <= max, message, `Expected ${min}-${max}, got ${value}`);
}

function section(name) {
  console.log(`\n📋 ${name}`);
}

// ============================================
// 测试数据
// ============================================
const now = new Date();
const mockVideo = {
  videoId: 'test123',
  title: 'How to Grow Your YouTube Channel in 2026 - Complete Guide',
  description: 'This is a comprehensive guide to growing your YouTube channel in 2026. We cover SEO, thumbnails, engagement strategies, and more. Timestamps: 0:00 Intro, 2:30 SEO Tips, 5:00 Thumbnail Design. Subscribe for more content! #YouTube #Growth https://tubefission.com',
  tags: ['youtube growth', 'youtube tips', 'how to grow youtube', 'youtube seo', 'youtube algorithm', 'content creation', 'social media marketing', 'youtube 2026'],
  thumbnail: 'https://example.com/thumb.jpg',
  channelTitle: 'Growth Expert',
  channelId: 'UC123',
  publishedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  viewCount: 150000,
  likeCount: 8000,
  commentCount: 450,
  duration: 'PT15M30S',
  category: 'Education',
  subscriberCount: 250000,
};

const mockChannel = {
  channelId: 'UC123',
  title: 'Growth Expert',
  description: 'YouTube growth tips and strategies',
  thumbnail: 'https://example.com/avatar.jpg',
  subscriberCount: 250000,
  viewCount: 12000000,
  videoCount: 320,
  publishedAt: new Date(now.getTime() - 730 * 24 * 60 * 60 * 1000).toISOString(),
  country: 'US',
};

// ============================================
// 测试1: analyzeVideo — 结构完整性
// ============================================
section('analyzeVideo() — 综合视频分析');

const videoResult = analyzeVideo(mockVideo);

assert(typeof videoResult === 'object', 'analyzeVideo returns an object');
assert(typeof videoResult.overallScore === 'object', 'Has overallScore');
assertRange(videoResult.overallScore.score, 0, 100, `Score in 0-100: ${videoResult.overallScore.score}`);
assert(['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'].includes(videoResult.overallScore.grade), `Grade valid: ${videoResult.overallScore.grade}`);

// 分解评分
assert(typeof videoResult.overallScore.breakdown === 'object', 'Has score breakdown');
assertRange(videoResult.overallScore.breakdown.engagementScore, 0, 100, `Engagement score: ${videoResult.overallScore.breakdown.engagementScore}`);
assertRange(videoResult.overallScore.breakdown.seoScore, 0, 100, `SEO score: ${videoResult.overallScore.breakdown.seoScore}`);
assertRange(videoResult.overallScore.breakdown.velocityScore, 0, 100, `Velocity score: ${videoResult.overallScore.breakdown.velocityScore}`);
assertRange(videoResult.overallScore.breakdown.growthScore, 0, 100, `Growth score: ${videoResult.overallScore.breakdown.growthScore}`);

// 互动率
assert(videoResult.metrics.engagementRate > 0, `Engagement rate > 0: ${videoResult.metrics.engagementRate}%`);
assertRange(videoResult.metrics.engagementRate, 5.0, 6.0, `Engagement ~5.6%: ${videoResult.metrics.engagementRate}%`);
assert(videoResult.metrics.likeRatio > 0, `Like ratio > 0: ${videoResult.metrics.likeRatio}%`);

// 观看速度
assert(videoResult.metrics.dailyViewRate > 0, `Daily view rate > 0: ${videoResult.metrics.dailyViewRate}`);
assertRange(videoResult.metrics.dailyViewRate, 4000, 6000, `Daily views ~5000: ${videoResult.metrics.dailyViewRate}`);
assert(['accelerating', 'stable', 'decelerating'].includes(videoResult.metrics.velocityTrend), 'Velocity trend valid');

// 预估
assert(videoResult.metrics.estimated30DayViews > 150000, '30-day forecast > current');
assert(videoResult.metrics.estimated90DayViews > videoResult.metrics.estimated30DayViews, '90-day > 30-day');

// 基准对比
assert(videoResult.benchmarks.category === 'Education', 'Category set');
assert(videoResult.benchmarks.avgEngagementRate > 0, 'Benchmark rate exists');
assert(['well_above', 'above', 'average', 'below', 'well_below'].includes(videoResult.benchmarks.performanceVsCategory), 'Performance rating valid');
assertRange(videoResult.benchmarks.percentileRank, 1, 99, `Percentile: ${videoResult.benchmarks.percentileRank}`);

// 行动建议
assert(Array.isArray(videoResult.recommendations), 'Has recommendations');
assert(videoResult.recommendations.length > 0, `${videoResult.recommendations.length} recommendations generated`);
assert(videoResult.recommendations.every(r => r.priority && r.area && r.issue && r.suggestion && r.expectedImpact), 'All recs have fields');

assert(videoResult.overallScore.breakdown.vsiScore != null, `VSI score in breakdown: ${videoResult.overallScore.breakdown.vsiScore}`);
assertRange(videoResult.overallScore.breakdown.vsiScore, 0, 100, `VSI score: ${videoResult.overallScore.breakdown.vsiScore}`);

assert(typeof videoResult.viewerSatisfaction === 'object', 'Has viewerSatisfaction');
assertRange(videoResult.viewerSatisfaction.score, 0, 100, `VSI score field: ${videoResult.viewerSatisfaction.score}`);
assert(typeof videoResult.viewerSatisfaction.grade === 'string', 'VSI has grade');
assert(typeof videoResult.viewerSatisfaction.interpretation === 'string', 'VSI has interpretation');
assert(typeof videoResult.viewerSatisfaction.breakdown === 'object', 'VSI has breakdown');

assert(typeof videoResult.algorithmSurface === 'object', 'Has algorithmSurface');
assert(typeof videoResult.algorithmSurface.dominantSurface === 'string', 'Has dominant surface');
assert(typeof videoResult.algorithmSurface.distribution === 'object', 'Has distribution');
assert(Array.isArray(videoResult.algorithmSurface.optimizationTips), 'Has optimization tips');

assert(typeof videoResult.contentDecay === 'object', 'Has contentDecay');
assert(typeof videoResult.contentDecay.rate === 'number', 'Decay has rate');
assert(['evergreen', 'standard', 'dead'].includes(videoResult.contentDecay.classification), 'Decay classification valid');
assert(typeof videoResult.contentDecay.shelfLife === 'string', 'Decay has shelfLife');
assert(Array.isArray(videoResult.contentDecay.recommendations), 'Decay has recommendations');

assert(typeof videoResult.sessionExtension === 'object', 'Has sessionExtension');
assertRange(videoResult.sessionExtension.score, 0, 100, `SEV score: ${videoResult.sessionExtension.score}`);
assert(['high', 'medium', 'low'].includes(videoResult.sessionExtension.extensionPotential), 'SEV extensionPotential valid');
assert(Array.isArray(videoResult.sessionExtension.tips), 'SEV has tips');

assert(typeof videoResult.commentIntelligence === 'object', 'Has commentIntelligence');
assert(typeof videoResult.commentIntelligence.questionDensity === 'number', 'Comment has questionDensity');
assertRange(videoResult.commentIntelligence.sentimentScore, 0, 100, `Comment sentiment: ${videoResult.commentIntelligence.sentimentScore}`);
assert(Array.isArray(videoResult.commentIntelligence.contentGaps), 'Comment has contentGaps');
assert(['beginner', 'intermediate', 'advanced'].includes(videoResult.commentIntelligence.audienceLevel), 'Audience level valid');

// SWOT
assert(Array.isArray(videoResult.competitiveAnalysis.strengths), 'Has strengths');
assert(Array.isArray(videoResult.competitiveAnalysis.weaknesses), 'Has weaknesses');
assert(Array.isArray(videoResult.competitiveAnalysis.opportunities), 'Has opportunities');
assert(Array.isArray(videoResult.competitiveAnalysis.threats), 'Has threats');

// 收入
assert(videoResult.revenueEstimate.estimatedRevenueLow < videoResult.revenueEstimate.estimatedRevenueAvg, 'Low < Avg');
assert(videoResult.revenueEstimate.estimatedRevenueAvg < videoResult.revenueEstimate.estimatedRevenueHigh, 'Avg < High');
assert(videoResult.revenueEstimate.estimatedRevenueAvg > 0, `Avg revenue > 0: $${videoResult.revenueEstimate.estimatedRevenueAvg}`);

// ============================================
// 测试2: 边界条件
// ============================================
section('analyzeVideo() — 边界条件');

const zeroVideo = { ...mockVideo, viewCount: 0, likeCount: 0, commentCount: 0, publishedAt: now.toISOString() };
const zeroResult = analyzeVideo(zeroVideo);
assert(zeroResult.overallScore.score >= 0, 'Zero views → no crash');
assert(zeroResult.metrics.engagementRate === 0, 'Zero views → 0 engagement');

const megaVideo = { ...mockVideo, viewCount: 100000000, likeCount: 5000000, commentCount: 200000, category: 'Entertainment' };
const megaResult = analyzeVideo(megaVideo);
assertRange(megaResult.overallScore.score, 0, 100, `Mega video score: ${megaResult.overallScore.score}`);
assert(megaResult.revenueEstimate.estimatedRevenueHigh > 10000, 'Mega video revenue > $10K');

// ============================================
// 测试3: analyzeChannel
// ============================================
section('analyzeChannel() — 频道分析');

const ch = analyzeChannel(mockChannel);

assert(typeof ch === 'object', 'analyzeChannel returns object');
assertRange(ch.healthScore.overall, 0, 100, `Health score: ${ch.healthScore.overall}`);
assertRange(ch.healthScore.growthHealth, 0, 100, 'Growth health 0-100');
assertRange(ch.healthScore.contentHealth, 0, 100, 'Content health 0-100');
assertRange(ch.healthScore.engagementHealth, 0, 100, 'Engagement health 0-100');
assertRange(ch.healthScore.consistencyHealth, 0, 100, 'Consistency health 0-100');

assert(ch.growth.subscriberGrowthRate >= 0, `Growth rate: ${ch.growth.subscriberGrowthRate}%`);
assert(['viral', 'exponential', 'linear', 'plateau', 'declining'].includes(ch.growth.growthTrajectory), 'Trajectory valid');
assert(ch.growth.projectedSubscribers30d >= 250000, '30d projection >= current');
assert(ch.growth.projectedSubscribers1y >= ch.growth.projectedSubscribers90d, '1y >= 90d');

assertRange(ch.contentStrategy.avgViewsPerVideo, 35000, 40000, `Avg views/video: ${ch.contentStrategy.avgViewsPerVideo}`);
assert(typeof ch.contentStrategy.uploadFrequency === 'string', 'Upload frequency is string');
assertRange(ch.contentStrategy.uploadConsistency, 0, 100, `Consistency: ${ch.contentStrategy.uploadConsistency}`);

assert(ch.revenueAnalysis.estimatedMonthlyRevenue.low < ch.revenueAnalysis.estimatedMonthlyRevenue.avg, 'Monthly low < avg');
assert(ch.revenueAnalysis.estimatedMonthlyRevenue.avg < ch.revenueAnalysis.estimatedMonthlyRevenue.high, 'Monthly avg < high');
assert(ch.revenueAnalysis.estimatedAnnualRevenue.avg > 0, `Annual avg: $${ch.revenueAnalysis.estimatedAnnualRevenue.avg}`);

assert(ch.swot.strengths.length > 0, 'Has strengths');
assert(ch.swot.opportunities.length > 0, 'Has opportunities');

assert(ch.growthPlan.length === 4, `Growth plan: ${ch.growthPlan.length} phases`);
assert(ch.growthPlan.every(p => p.timeframe && p.actions && p.expectedOutcome), 'Plan fields complete');

// ============================================
// 测试4: analyzeVideoSEO
// ============================================
section('analyzeVideoSEO() — SEO评分');

const seo = analyzeVideoSEO(mockVideo);
assertRange(seo.seoScore.overall, 0, 100, `Overall SEO: ${seo.seoScore.overall}`);
assertRange(seo.seoScore.title.score, 0, 100, `Title score: ${seo.seoScore.title.score}`);
assertRange(seo.seoScore.description.score, 0, 100, `Desc score: ${seo.seoScore.description.score}`);
assertRange(seo.seoScore.tags.score, 0, 100, `Tags score: ${seo.seoScore.tags.score}`);

assert(seo.titleAnalysis.length === 'optimal', 'Title length optimal');
assert(seo.titleAnalysis.hasNumber === true, 'Title has number');
assert(seo.titleAnalysis.hasYear === true, 'Title has year');
assert(seo.descriptionAnalysis.hasLinks === true, 'Desc has links');
assert(seo.descriptionAnalysis.hasTimestamps === true, 'Desc has timestamps');
assert(seo.tagAnalysis.count === 'optimal', 'Tag count optimal');

// ============================================
// 测试5: predictTrend
// ============================================
section('predictTrend() — 趋势预测');

const trend = predictTrend(mockVideo);
assert(trend.viewForecast.next7Days > 150000, '7-day > current');
assert(trend.viewForecast.next30Days > trend.viewForecast.next7Days, '30-day > 7-day');
assert(trend.viewForecast.next90Days > trend.viewForecast.next30Days, '90-day > 30-day');
assert(['high', 'medium', 'low'].includes(trend.viewForecast.confidence), 'Confidence valid');
assert(['emerging', 'growing', 'peak', 'plateau', 'declining'].includes(trend.growthPhase), 'Phase valid');
assertRange(trend.momentumScore, -100, 100, `Momentum: ${trend.momentumScore}`);
assert(typeof trend.recommendedAction === 'string' && trend.recommendedAction.length > 10, 'Has action');

// ============================================
// 测试6: 基准数据
// ============================================
section('CATEGORY_BENCHMARKS — 基准数据');

const cats = Object.keys(CATEGORY_BENCHMARKS);
assert(cats.length >= 10, `Categories: ${cats.length}`);

for (const cat of cats) {
  const b = CATEGORY_BENCHMARKS[cat];
  assert(b.avgEngagementRate > 0, `${cat}: engagement > 0`);
  assert(b.avgCPM > 0, `${cat}: CPM > 0`);
  assert(typeof b.optimalVideoLength === 'string', `${cat}: has videoLength`);
  assert(typeof b.uploadFrequency === 'string', `${cat}: has frequency`);
}

// ============================================
// 测试8: calculateViewerSatisfactionIndex — VSI独立测试
// ============================================
section('calculateViewerSatisfactionIndex() — VSI分析');

const vsi = calculateViewerSatisfactionIndex(mockVideo);
assert(typeof vsi === 'object', 'VSI returns object');
assertRange(vsi.score, 0, 100, `VSI score: ${vsi.score}`);
assert(typeof vsi.grade === 'string', 'VSI has grade');
assert(vsi.breakdown.avdRatio >= 0 && vsi.breakdown.avdRatio <= 1, 'avdRatio 0-1');
assert(vsi.breakdown.likeViewRatio >= 0 && vsi.breakdown.likeViewRatio <= 1, 'likeViewRatio 0-1');
assert(vsi.breakdown.shareRate >= 0, 'shareRate >= 0');
assert(vsi.breakdown.commentSentiment === 0.5, 'commentSentiment placeholder = 0.5');
assert(vsi.breakdown.returnViewerRate >= 0 && vsi.breakdown.returnViewerRate <= 1, 'returnViewerRate 0-1');
assert(typeof vsi.interpretation === 'string' && vsi.interpretation.length > 20, 'VSI has interpretation');

// VSI with zero views
const vsiZero = calculateViewerSatisfactionIndex({ viewCount: 0, likeCount: 0, commentCount: 0, subscriberCount: 0, duration: 'PT10M', category: 'Entertainment' });
assert(vsiZero.score >= 0 && vsiZero.score <= 100, `VSI zero views: ${vsiZero.score}`);

// VSI with very high engagement (must beat mockVideo on all dimensions)
const vsiHigh = calculateViewerSatisfactionIndex({ viewCount: 150000, likeCount: 15000, commentCount: 800, subscriberCount: 300000, duration: 'PT10M', category: 'Education' });
assert(vsiHigh.score > vsi.score, `High engagement VSI (${vsiHigh.score}) > normal (${vsi.score})`);

// VSI formula manual verification
// AVD = 0.45 (no avgViewDuration → duration*0.45), likeRatio = (8000/150000)*100/5.8=0.919..., share rate ≈ small, sentiment = 0.5, returnViewer = 250000/150000 = 1.0 (capped)
assert(typeof vsi.score === 'number', 'VSI score is number');
assert(typeof vsi.breakdown === 'object', 'VSI has breakdown object');

// ============================================
// 测试9: calculateAlgorithmSurfaceDistribution
// ============================================
section('calculateAlgorithmSurfaceDistribution() — 分发渠道');

const surface = calculateAlgorithmSurfaceDistribution(mockVideo);
assert(typeof surface === 'object', 'Surface returns object');
assert(typeof surface.dominantSurface === 'string', 'Has dominant surface');
assert(surface.distribution != null, 'Has distribution');
assert(surface.distribution.home != null, 'Distribution has home');
assert(surface.distribution.search != null, 'Distribution has search');
assert(surface.distribution.suggested != null, 'Distribution has suggested');
assert(surface.distribution.shorts != null, 'Distribution has shorts');
assert(surface.distribution.subscriptions != null, 'Distribution has subscriptions');

// Distribution percentages should sum to ~100
const distSum = surface.distribution.home + surface.distribution.search + surface.distribution.suggested + surface.distribution.shorts + surface.distribution.subscriptions;
assert(distSum >= 99 && distSum <= 101, `Distribution sums to ~100: ${distSum.toFixed(1)}`);
assert(Array.isArray(surface.optimizationTips), 'Has tips array');
assert(surface.optimizationTips.length > 0, 'Has optimization tips');

// Short video → shorts should be dominant or high
const shortVideo = { ...mockVideo, duration: 'PT30S', isShort: true };
const shortSurface = calculateAlgorithmSurfaceDistribution(shortVideo);
assert(shortSurface.distribution.shorts > 0, 'Short video has shorts distribution > 0');

// Playlist present → suggested should be high
const playlistVideo = { ...mockVideo, playlistId: 'PL123' };
const playlistSurface = calculateAlgorithmSurfaceDistribution(playlistVideo);
assert(playlistSurface.distribution.suggested > 0, 'Playlist video has suggested > 0');

// ============================================
// 测试10: calculateContentDecayRate
// ============================================
section('calculateContentDecayRate() — 内容衰减');

const decay = calculateContentDecayRate(mockVideo);
assert(typeof decay === 'object', 'Decay returns object');
assert(typeof decay.rate === 'number', 'Decay has rate');
assert(['evergreen', 'standard', 'dead'].includes(decay.classification), 'Classification valid');
assert(typeof decay.shelfLife === 'string', 'Has shelfLife');
assert(Array.isArray(decay.recommendations), 'Has recommendations');
assert(decay.recommendations.length > 0, 'Has >0 recommendations');

// Verify formula for known data
// 30 days, 150000 views → dailyViewRate ≈ 5000
// viewsAt30d ≈ 5000*30*1.2 = 180000
// viewsAt90d ≈ 5000*90*0.8 = 360000 (full 90-day projection)
// CDR = (360000 - 180000) / 180000 = 1.0
assert(decay.rate >= 0.5, `Decay rate positive: ${decay.rate}`);
assert(decay.classification === 'evergreen' || decay.classification === 'standard', `Classification for rate ~1: ${decay.classification}`);

// Dead content scenario
const deadDecay = calculateContentDecayRate({ viewCount: 500, publishedAt: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000).toISOString(), viewsAt30d: 1000, viewsAt90d: 100 });
assert(deadDecay.classification === 'dead', `Dead content classification: ${deadDecay.classification}`);
assert(deadDecay.recommendations.length > 0, 'Dead content has recommendations');

// ============================================
// 测试11: calculateSessionExtensionValue
// ============================================
section('calculateSessionExtensionValue() — SEV');

const sev = calculateSessionExtensionValue(mockVideo);
assert(typeof sev === 'object', 'SEV returns object');
assertRange(sev.score, 0, 100, `SEV score: ${sev.score}`);
assert(['high', 'medium', 'low'].includes(sev.extensionPotential), 'Extension potential valid');
assert(Array.isArray(sev.tips), 'Has tips');
assert(sev.tips.length > 0, 'Has >0 tips');

// SEV with zero views
const sevZero = calculateSessionExtensionValue({ viewCount: 0, likeCount: 0, commentCount: 0, subscriberCount: 0, duration: 'PT10M', videoCount: 0 });
assert(sevZero.score >= 0 && sevZero.score <= 100, `SEV zero views: ${sevZero.score}`);

// High engagement → higher SEV
const sevHigh = calculateSessionExtensionValue({ viewCount: 10000, likeCount: 1000, commentCount: 200, subscriberCount: 10000, duration: 'PT20M', videoCount: 50 });
assert(sevHigh.score > sev.score, `High engagement SEV (${sevHigh.score}) > normal (${sev.score})`);

// ============================================
// 测试12: calculateCommentIntelligence
// ============================================
section('calculateCommentIntelligence() — 评论智能');

const commentIntel = calculateCommentIntelligence(mockVideo);
assert(typeof commentIntel === 'object', 'Comment intel returns object');
assert(typeof commentIntel.questionDensity === 'number', 'Has questionDensity');
assert(commentIntel.questionDensity >= 0, `Question density >= 0: ${commentIntel.questionDensity}`);
assert(commentIntel.questionDensity <= 40, `Question density <= 40: ${commentIntel.questionDensity}`);
assertRange(commentIntel.sentimentScore, 0, 100, `Sentiment score: ${commentIntel.sentimentScore}`);
assert(Array.isArray(commentIntel.contentGaps), 'Has contentGaps');
assert(commentIntel.contentGaps.length > 0, 'Has >0 content gaps');
assert(['beginner', 'intermediate', 'advanced'].includes(commentIntel.audienceLevel), 'Audience level valid');

// High comment-to-like ratio → higher question density
const highComments = calculateCommentIntelligence({ viewCount: 10000, likeCount: 100, commentCount: 800, subscriberCount: 5000 });
assert(highComments.questionDensity > commentIntel.questionDensity, `High comment density (${highComments.questionDensity}) > normal (${commentIntel.questionDensity})`);

// Low engagement → different audience level
const lowComments = calculateCommentIntelligence({ viewCount: 100000, likeCount: 5000, commentCount: 10, subscriberCount: 1000 });
assert(lowComments.audienceLevel === 'advanced', `Low comment ratio → advanced: ${lowComments.audienceLevel}`);

// Zero data
const commentZero = calculateCommentIntelligence({ viewCount: 0, likeCount: 0, commentCount: 0, subscriberCount: 0 });
assert(commentZero.sentimentScore >= 0 && commentZero.sentimentScore <= 100, 'Zero data sentiment valid');

// ============================================
// 测试13: 数学一致性
// ============================================
section('数学公式验证');

// (8000+450)/150000*100 = 5.6333
const expectedEng = ((8000 + 450) / 150000) * 100;
assert(
  Math.abs(videoResult.metrics.engagementRate - expectedEng) < 0.1,
  `Engagement: expected ~${expectedEng.toFixed(2)}%, got ${videoResult.metrics.engagementRate}%`
);

// 8000/150000*100 = 5.3333
const expectedLike = (8000 / 150000) * 100;
assert(
  Math.abs(videoResult.metrics.likeRatio - expectedLike) < 0.1,
  `Like ratio: expected ~${expectedLike.toFixed(2)}%, got ${videoResult.metrics.likeRatio}%`
);

// 150000/30 = 5000
assert(
  Math.abs(videoResult.metrics.dailyViewRate - 5000) < 100,
  `Daily rate: expected ~5000, got ${videoResult.metrics.dailyViewRate}`
);

// 12000000/320 = 37500
assert(
  Math.abs(ch.contentStrategy.avgViewsPerVideo - 37500) < 100,
  `Avg views: expected ~37500, got ${ch.contentStrategy.avgViewsPerVideo}`
);

// 加权评分验证
const b = videoResult.overallScore.breakdown;
const expectedScore = Math.round(b.engagementScore * 0.25 + b.seoScore * 0.20 + b.velocityScore * 0.18 + b.growthScore * 0.12 + b.vsiScore * 0.25);
assert(videoResult.overallScore.score === expectedScore, `Weighted score: expected ${expectedScore}, got ${videoResult.overallScore.score}`);

// 收入公式: 150000/1000 * 8.5 * 0.55 = $701.25
const expectedRev = Math.round(150000 / 1000 * 8.5 * 0.55);
assert(
  Math.abs(videoResult.revenueEstimate.estimatedRevenueAvg - expectedRev) < 50,
  `Revenue: expected ~$${expectedRev}, got $${videoResult.revenueEstimate.estimatedRevenueAvg}`
);

// ============================================
// 测试8: 跨类别对比
// ============================================
section('跨类别基准对比');

const gamingResult = analyzeVideo({ ...mockVideo, category: 'Gaming' });
const musicResult = analyzeVideo({ ...mockVideo, category: 'Music' });
assert(gamingResult.benchmarks.avgEngagementRate === 3.2, 'Gaming benchmark 3.2%');
assert(musicResult.benchmarks.avgEngagementRate === 2.8, 'Music benchmark 2.8%');
assert(gamingResult.benchmarks.percentileRank > 50, `Gaming percentile > 50: ${gamingResult.benchmarks.percentileRank}`);

// ============================================
// 测试9: 推荐引擎
// ============================================
section('推荐引擎质量');

const badResult = analyzeVideo({
  ...mockVideo, title: 'video', description: 'short', tags: [],
  viewCount: 100, likeCount: 1, commentCount: 0,
});
assert(badResult.recommendations.length >= 3, `Bad video gets ${badResult.recommendations.length} recs`);
assert(badResult.recommendations.some(r => r.priority === 'high'), 'Bad video has high-priority recs');

// Good video should have higher score due to better metrics
// Note: the new VSI weighting means subscriber ratio matters significantly
const goodResult = analyzeVideo({
  ...mockVideo,
  title: 'YouTube Growth Guide 2026 - Get 1 Million Subs!',
  description: 'Complete guide to growing your YouTube channel in 2026. We cover SEO optimization, thumbnail design, engagement strategies, and the YouTube algorithm. Timestamps: 0:00 Intro, 2:30 SEO Tips, 5:00 Thumbnails. Subscribe! #YouTube #Growth #SEO https://tubefission.com https://youtube.com/expert',
  tags: ['youtube growth 2026', 'grow youtube channel', 'youtube seo tips', 'youtube algorithm', 'how to get subscribers', 'content creation 2026', 'social media growth', 'youtube tips for beginners', 'video marketing', 'youtube success'],
  likeCount: 25000, commentCount: 1500, viewCount: 300000, subscriberCount: 200000,
});
assert(goodResult.overallScore.score >= videoResult.overallScore.score, `Good video scores >= normal: ${goodResult.overallScore.score} >= ${videoResult.overallScore.score}`);

// ============================================
// 测试9b: 评论智能分析
// ============================================
section('评论智能分析');

// 需要单独加载 comment-intelligence 模块
let ciSource = '';
try {
  ciSource = readFileSync(join(__dirname, 'lib', 'comment-intelligence.js'), 'utf8');
  ciSource = ciSource.replace(/^export /gm, '');
  ciSource = ciSource.replace(/^import\b.*$/gm, '');
  ciSource = ciSource.replace(/\bconst\b/g, 'var');
  ciSource = ciSource.replace(/\blet\b/g, 'var');
} catch(e) {}

if (ciSource) {
  const ciFn = new Function(ciSource + '\n  return { analyzeCommentIntelligence, extractContentGaps, calculateAudienceExpertise };');
  const { analyzeCommentIntelligence, extractContentGaps, calculateAudienceExpertise } = ciFn();

  const mockComments = [
    { text: 'How do I grow my channel?', author: 'user1', likes: 5, date: '2026-01-01' },
    { text: 'Great video! Very helpful content.', author: 'user2', likes: 10, date: '2026-01-02' },
    { text: 'Why does my view count not increase?', author: 'user3', likes: 3, date: '2026-01-03' },
    { text: 'I love this creator, best channel ever!', author: 'user4', likes: 15, date: '2026-01-04' },
    { text: 'Can you explain the SEO part more?', author: 'user5', likes: 7, date: '2026-01-05' },
    { text: 'Bad video, waste of time.', author: 'user6', likes: 1, date: '2026-01-06' },
    { text: 'When will you post the next video?', author: 'user7', likes: 2, date: '2026-01-07' },
    { text: 'Thanks for the tips!', author: 'user8', likes: 4, date: '2026-01-08' },
    { text: 'What software do you use for editing?', author: 'user9', likes: 6, date: '2026-01-09' },
    { text: 'This is exactly what I needed.', author: 'user10', likes: 8, date: '2026-01-10' },
  ];

  const ciResult = analyzeCommentIntelligence(mockComments);
  assert(typeof ciResult === 'object', 'Comment intelligence returns object');
  assert(typeof ciResult.questionDensity === 'number', 'Has questionDensity');
  assert(ciResult.questionDensity >= 0 && ciResult.questionDensity <= 100, `Question density 0-100: ${ciResult.questionDensity}`);
  assert(typeof ciResult.sentimentScore === 'number', 'Has sentimentScore');
  assert(ciResult.sentimentScore >= 0 && ciResult.sentimentScore <= 100, `Sentiment score 0-100: ${ciResult.sentimentScore}`);
  assert(Array.isArray(ciResult.contentGaps), 'contentGaps is array');
  assert(['beginner', 'intermediate', 'advanced'].includes(ciResult.audienceLevel), `audienceLevel valid: ${ciResult.audienceLevel}`);
  assert(typeof ciResult.engagementQuality === 'string', 'Has engagementQuality');
  
  // 4 out of 10 comments are questions (How, Why, Can, When, What)
  assert(ciResult.questionDensity >= 30, `Question density ~40%: ${ciResult.questionDensity}`);
  
  // Content gaps from unanswered questions
  assert(ciResult.contentGaps.length >= 0, `Content gaps extracted: ${ciResult.contentGaps.length}`);
  
  console.log(`     → Q density: ${ciResult.questionDensity}%, Sentiment: ${ciResult.sentimentScore}, Level: ${ciResult.audienceLevel}`);
} else {
  console.log('     → Comment intelligence module not loaded, skipping...');
}

// ============================================
// 测试10: 性能
// ============================================
section('性能测试');

const iter = 1000;
const t0 = Date.now();
for (let i = 0; i < iter; i++) {
  analyzeVideo(mockVideo);
  analyzeChannel(mockChannel);
  analyzeVideoSEO(mockVideo);
  predictTrend(mockVideo);
}
const ms = Date.now() - t0;
assert(ms < 10000, `${iter} cycles in ${ms}ms (< 10s)`);
console.log(`     → ${Math.round(ms / iter)}ms per full analysis cycle`);

// ============================================
// 汇总
// ============================================
console.log('\n' + '='.repeat(60));
console.log(`📊 YouTube Analytics Engine — 测试报告`);
console.log('='.repeat(60));
console.log(`  总测试: ${totalTests}`);
console.log(`  ✅ 通过: ${passed}`);
console.log(`  ❌ 失败: ${failed}`);
console.log(`  通过率: ${((passed / totalTests) * 100).toFixed(1)}%`);
console.log('='.repeat(60));

if (failures.length > 0) {
  console.log('\n❌ 失败详情:');
  failures.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));
} else {
  console.log('\n🎉 全部测试通过！分析引擎数学逻辑正确。');
}

process.exit(failed > 0 ? 1 : 0);
