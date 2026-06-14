/**
 * YouTube Analytics Engine — 自动化测试脚本
 * 验证所有分析函数的数学正确性和边界处理
 */

// 模拟ES Module导入（将export转为可用格式）
const fs = require('fs');
let engineCode = fs.readFileSync('D:/openclaw/master/lib/youtube-analytics-engine.js', 'utf8');

// 转换ES Module为CommonJS以支持测试
engineCode = engineCode.replace(/export const /g, 'const ');
engineCode = engineCode.replace(/export function /g, 'function ');
engineCode = engineCode.replace(/export default /g, 'module.exports = ');

// 在文件末尾执行
eval(engineCode);

// ============================================
// 测试工具
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
  assert(value >= min && value <= max, message, `Expected ${min}-${max}, got ${value}`);
}

function section(name) {
  console.log(`\n📋 ${name}`);
}

// ============================================
// 测试数据
// ============================================
const mockVideo = {
  videoId: 'test123',
  title: 'How to Grow Your YouTube Channel in 2026 - Complete Guide',
  description: 'This is a comprehensive guide to growing your YouTube channel in 2026. We cover SEO, thumbnails, engagement strategies, and more. Timestamps: 0:00 Intro, 2:30 SEO Tips, 5:00 Thumbnail Design. Subscribe for more content! #YouTube #Growth https://tubefission.com',
  tags: ['youtube growth', 'youtube tips', 'how to grow youtube', 'youtube seo', 'youtube algorithm', 'content creation', 'social media marketing', 'youtube 2026'],
  thumbnail: 'https://example.com/thumb.jpg',
  channelTitle: 'Growth Expert',
  channelId: 'UC123',
  publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30天前
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
  publishedAt: new Date(Date.now() - 730 * 24 * 60 * 60 * 1000).toISOString(), // 2年前
  country: 'US',
};

// ============================================
// 测试1: analyzeVideo
// ============================================
section('analyzeVideo() — 综合视频分析');

const videoResult = analyzeVideo(mockVideo);

// 基础结构测试
assert(typeof videoResult === 'object', 'analyzeVideo returns an object');
assert(typeof videoResult.overallScore === 'object', 'Has overallScore');
assert(typeof videoResult.overallScore.score === 'number', 'Score is a number');
assertRange(videoResult.overallScore.score, 0, 100, 'Score in 0-100 range');
assert(typeof videoResult.overallScore.grade === 'string', 'Grade is a string');
assert(['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'].includes(videoResult.overallScore.grade), `Grade is valid: ${videoResult.overallScore.grade}`);

// 分解评分
assert(typeof videoResult.overallScore.breakdown === 'object', 'Has score breakdown');
assertRange(videoResult.overallScore.breakdown.engagementScore, 0, 100, 'Engagement score 0-100');
assertRange(videoResult.overallScore.breakdown.seoScore, 0, 100, 'SEO score 0-100');
assertRange(videoResult.overallScore.breakdown.velocityScore, 0, 100, 'Velocity score 0-100');
assertRange(videoResult.overallScore.breakdown.growthScore, 0, 100, 'Growth score 0-100');

// 互动率计算
assert(typeof videoResult.metrics === 'object', 'Has metrics object');
assert(videoResult.metrics.engagementRate > 0, `Engagement rate > 0: ${videoResult.metrics.engagementRate}`);
// 期望值: (8000+450)/150000 * 100 = 5.63%
assertRange(videoResult.metrics.engagementRate, 5.0, 6.5, 'Engagement rate ~5.6%');
assert(videoResult.metrics.likeRatio > 0, `Like ratio > 0: ${videoResult.metrics.likeRatio}`);
assertRange(videoResult.metrics.likeRatio, 4.5, 6.0, 'Like ratio ~5.3%');
assert(videoResult.metrics.commentRatio > 0, `Comment ratio > 0: ${videoResult.metrics.commentRatio}`);

// 观看速度
assert(videoResult.metrics.dailyViewRate > 0, `Daily view rate > 0: ${videoResult.metrics.dailyViewRate}`);
assertRange(videoResult.metrics.dailyViewRate, 4000, 6000, 'Daily view rate ~5000 (150K/30d)');
assert(['accelerating', 'stable', 'decelerating'].includes(videoResult.metrics.velocityTrend), 'Velocity trend is valid');

// 预估
assert(videoResult.metrics.estimated30DayViews > mockVideo.viewCount, '30-day forecast > current views');
assert(videoResult.metrics.estimated90DayViews > videoResult.metrics.estimated30DayViews, '90-day > 30-day forecast');

// 基准对比
assert(typeof videoResult.benchmarks === 'object', 'Has benchmarks');
assert(videoResult.benchmarks.category === 'Education', 'Category is Education');
assert(videoResult.benchmarks.avgEngagementRate > 0, 'Benchmark engagement rate exists');
assert(['well_above', 'above', 'average', 'below', 'well_below'].includes(videoResult.benchmarks.performanceVsCategory), 'Performance rating valid');
assertRange(videoResult.benchmarks.percentileRank, 1, 99, 'Percentile 1-99');

// 行动建议
assert(Array.isArray(videoResult.recommendations), 'Has recommendations array');
assert(videoResult.recommendations.length > 0, `Has ${videoResult.recommendations.length} recommendations`);
assert(videoResult.recommendations.every(r => r.priority && r.area && r.issue && r.suggestion), 'All recommendations have required fields');

// SWOT
assert(typeof videoResult.competitiveAnalysis === 'object', 'Has competitive analysis');
assert(Array.isArray(videoResult.competitiveAnalysis.strength), 'Has strengths array');
assert(Array.isArray(videoResult.competitiveAnalysis.weakness), 'Has weaknesses array');
assert(Array.isArray(videoResult.competitiveAnalysis.opportunity), 'Has opportunities array');
assert(Array.isArray(videoResult.competitiveAnalysis.threat), 'Has threats array');

// 收入预估
assert(typeof videoResult.revenueEstimate === 'object', 'Has revenue estimate');
assert(videoResult.revenueEstimate.estimatedRevenueLow < videoResult.revenueEstimate.estimatedRevenueAvg, 'Low < Avg revenue');
assert(videoResult.revenueEstimate.estimatedRevenueAvg < videoResult.revenueEstimate.estimatedRevenueHigh, 'Avg < High revenue');
assert(videoResult.revenueEstimate.estimatedRevenueAvg > 0, `Avg revenue > 0: $${videoResult.revenueEstimate.estimatedRevenueAvg}`);
assertRange(videoResult.revenueEstimate.cpmLow, 2, 8, 'CPM low is reasonable');
assertRange(videoResult.revenueEstimate.cpmHigh, 5, 15, 'CPM high is reasonable');

// ============================================
// 测试2: 边界条件 — 极端数据
// ============================================
section('analyzeVideo() — 边界条件');

const zeroVideo = {
  ...mockVideo,
  viewCount: 0,
  likeCount: 0,
  commentCount: 0,
  publishedAt: new Date().toISOString(),
};
const zeroResult = analyzeVideo(zeroVideo);
assert(zeroResult.overallScore.score >= 0, 'Zero views does not crash');
assert(zeroResult.metrics.engagementRate === 0, 'Zero views → 0 engagement rate');
assert(zeroResult.metrics.dailyViewRate >= 0, 'Zero views → non-negative daily rate');

const megaVideo = {
  ...mockVideo,
  viewCount: 100000000,
  likeCount: 5000000,
  commentCount: 200000,
  category: 'Entertainment',
};
const megaResult = analyzeVideo(megaVideo);
assertRange(megaResult.overallScore.score, 0, 100, 'Mega video score in range');
assert(megaResult.metrics.engagementPercentile >= 50, `Mega video percentile: ${megaResult.metrics.engagementPercentile}`);
assert(megaResult.revenueEstimate.estimatedRevenueHigh > 10000, 'Mega video revenue > $10K');

// ============================================
// 测试3: analyzeChannel
// ============================================
section('analyzeChannel() — 频道分析');

const channelResult = analyzeChannel(mockChannel);

assert(typeof channelResult === 'object', 'analyzeChannel returns an object');
assert(typeof channelResult.healthScore === 'object', 'Has health score');
assertRange(channelResult.healthScore.overall, 0, 100, 'Health score 0-100');
assertRange(channelResult.healthScore.growthHealth, 0, 100, 'Growth health 0-100');
assertRange(channelResult.healthScore.contentHealth, 0, 100, 'Content health 0-100');
assertRange(channelResult.healthScore.engagementHealth, 0, 100, 'Engagement health 0-100');
assertRange(channelResult.healthScore.consistencyHealth, 0, 100, 'Consistency health 0-100');

// 增长分析
assert(typeof channelResult.growth === 'object', 'Has growth analysis');
assert(channelResult.growth.subscriberGrowthRate >= 0, `Growth rate >= 0: ${channelResult.growth.subscriberGrowthRate}`);
assert(['viral', 'exponential', 'linear', 'plateau', 'declining'].includes(channelResult.growth.growthTrajectory), 'Trajectory valid');
assert(channelResult.growth.projectedSubscribers30d >= mockChannel.subscriberCount, '30d projection >= current');
assert(channelResult.growth.projectedSubscribers1y >= channelResult.growth.projectedSubscribers90d, '1y >= 90d projection');

// 内容策略
assert(typeof channelResult.contentStrategy === 'object', 'Has content strategy');
assert(channelResult.contentStrategy.avgViewsPerVideo > 0, `Avg views/video > 0: ${channelResult.contentStrategy.avgViewsPerVideo}`);
// 期望值: 12000000 / 320 = 37500
assertRange(channelResult.contentStrategy.avgViewsPerVideo, 35000, 40000, 'Avg views/video ~37500');
assert(typeof channelResult.contentStrategy.uploadFrequency === 'string', 'Upload frequency is string');
assertRange(channelResult.contentStrategy.uploadConsistency, 0, 100, 'Consistency 0-100');

// 收入分析
assert(typeof channelResult.revenueAnalysis === 'object', 'Has revenue analysis');
assert(channelResult.revenueAnalysis.estimatedMonthlyRevenue.low < channelResult.revenueAnalysis.estimatedMonthlyRevenue.avg, 'Monthly low < avg');
assert(channelResult.revenueAnalysis.estimatedMonthlyRevenue.avg < channelResult.revenueAnalysis.estimatedMonthlyRevenue.high, 'Monthly avg < high');
assert(channelResult.revenueAnalysis.estimatedAnnualRevenue.avg > 0, `Annual avg > $0: ${channelResult.revenueAnalysis.estimatedAnnualRevenue.avg}`);

// SWOT
assert(typeof channelResult.swot === 'object', 'Has SWOT');
assert(channelResult.swot.strengths.length > 0, 'Has at least 1 strength');
assert(channelResult.swot.opportunities.length > 0, 'Has at least 1 opportunity');

// 增长计划
assert(Array.isArray(channelResult.growthPlan), 'Has growth plan');
assert(channelResult.growthPlan.length === 4, `Growth plan has 4 phases (got ${channelResult.growthPlan.length})`);
assert(channelResult.growthPlan.every(p => p.timeframe && p.actions && p.expectedOutcome), 'All plans have required fields');

// ============================================
// 测试4: analyzeVideoSEO
// ============================================
section('analyzeVideoSEO() — SEO评分');

const seoResult = analyzeVideoSEO(mockVideo);

assert(typeof seoResult === 'object', 'Returns an object');
assert(typeof seoResult.seoScore === 'object', 'Has seoScore');
assertRange(seoResult.seoScore.overall, 0, 100, 'Overall SEO 0-100');
assertRange(seoResult.seoScore.title.score, 0, 100, 'Title score 0-100');
assertRange(seoResult.seoScore.description.score, 0, 100, 'Description score 0-100');
assertRange(seoResult.seoScore.tags.score, 0, 100, 'Tags score 0-100');

// 标题分析
assert(typeof seoResult.titleAnalysis === 'object', 'Has title analysis');
assert(seoResult.titleAnalysis.length === 'optimal', `Title length: ${seoResult.titleAnalysis.length}`);
assert(seoResult.titleAnalysis.hasKeyword === false || seoResult.titleAnalysis.hasKeyword === true, 'hasKeyword is boolean');
assert(seoResult.titleAnalysis.hasNumber === true, 'Title has number');
assert(seoResult.titleAnalysis.hasYear === true, 'Title has year');
assert(seoResult.titleAnalysis.emotionalTrigger === true, 'Title has emotional trigger');

// 描述分析
assert(typeof seoResult.descriptionAnalysis === 'object', 'Has description analysis');
assert(seoResult.descriptionAnalysis.hasLinks === true, 'Description has links');
assert(seoResult.descriptionAnalysis.hasTimestamps === true, 'Description has timestamps');
assert(seoResult.descriptionAnalysis.hasHashtags === true, 'Description has hashtags');

// 标签分析
assert(typeof seoResult.tagAnalysis === 'object', 'Has tag analysis');
assert(seoResult.tagAnalysis.count === 'optimal', `Tag count: ${seoResult.tagAnalysis.count}`);
assert(seoResult.tagAnalysis.hasBroadTags === true, 'Has broad tags');

// ============================================
// 测试5: predictTrend
// ============================================
section('predictTrend() — 趋势预测');

const trendResult = predictTrend(mockVideo);

assert(typeof trendResult === 'object', 'Returns an object');
assert(typeof trendResult.viewForecast === 'object', 'Has view forecast');
assert(trendResult.viewForecast.next7Days > mockVideo.viewCount, '7-day forecast > current views');
assert(trendResult.viewForecast.next30Days > trendResult.viewForecast.next7Days, '30-day > 7-day');
assert(trendResult.viewForecast.next90Days > trendResult.viewForecast.next30Days, '90-day > 30-day');
assert(['high', 'medium', 'low'].includes(trendResult.viewForecast.confidence), 'Confidence is valid');

assert(['emerging', 'growing', 'peak', 'plateau', 'declining'].includes(trendResult.growthPhase), `Growth phase: ${trendResult.growthPhase}`);
assertRange(trendResult.momentumScore, -100, 100, 'Momentum -100 to 100');
assert(['up', 'stable', 'down'].includes(trendResult.trendDirection), 'Trend direction valid');
assert(typeof trendResult.recommendedAction === 'string', 'Has recommended action');
assert(trendResult.recommendedAction.length > 10, 'Action is not empty');

// ============================================
// 测试6: 行业基准数据
// ============================================
section('CATEGORY_BENCHMARKS — 基准数据完整性');

const requiredCategories = ['Gaming', 'Music', 'Education', 'Entertainment', 'Science & Technology', 'News & Politics'];
for (const cat of requiredCategories) {
  assert(CATEGORY_BENCHMARKS[cat] !== undefined, `Benchmark exists: ${cat}`);
  if (CATEGORY_BENCHMARKS[cat]) {
    const b = CATEGORY_BENCHMARKS[cat];
    assert(b.avgEngagementRate > 0, `${cat} avgEngagementRate > 0`);
    assert(b.avgCPM > 0, `${cat} avgCPM > 0`);
    assert(typeof b.optimalVideoLength === 'string', `${cat} has optimalVideoLength`);
    assert(typeof b.uploadFrequency === 'string', `${cat} has uploadFrequency`);
  }
}

const categoryCount = Object.keys(CATEGORY_BENCHMARKS).length;
assert(categoryCount >= 10, `At least 10 categories (got ${categoryCount})`);

// ============================================
// 测试7: 数据一致性 — 数学验证
// ============================================
section('数学一致性验证');

// 互动率公式验证
const expectedEngagement = ((8000 + 450) / 150000) * 100; // = 5.633%
assert(
  Math.abs(videoResult.metrics.engagementRate - expectedEngagement) < 0.1,
  `Engagement rate math check: expected ~${expectedEngagement.toFixed(2)}%, got ${videoResult.metrics.engagementRate}%`
);

// 点赞率公式验证
const expectedLikeRatio = (8000 / 150000) * 100; // = 5.333%
assert(
  Math.abs(videoResult.metrics.likeRatio - expectedLikeRatio) < 0.1,
  `Like ratio math check: expected ~${expectedLikeRatio.toFixed(2)}%, got ${videoResult.metrics.likeRatio}%`
);

// 每日观看量验证
const expectedDaily = 150000 / 30; // = 5000
assert(
  Math.abs(videoResult.metrics.dailyViewRate - expectedDaily) < 100,
  `Daily view rate check: expected ~${expectedDaily}, got ${videoResult.metrics.dailyViewRate}`
);

// 频道平均观看量验证
const expectedAvgViews = 12000000 / 320; // = 37500
assert(
  Math.abs(channelResult.contentStrategy.avgViewsPerVideo - expectedAvgViews) < 100,
  `Avg views/video check: expected ~${expectedAvgViews}, got ${channelResult.contentStrategy.avgViewsPerVideo}`
);

// 评分分解加权验证
const b = videoResult.overallScore.breakdown;
const expectedScore = Math.round(
  b.engagementScore * 0.35 +
  b.seoScore * 0.25 +
  b.velocityScore * 0.25 +
  b.growthScore * 0.15
);
assert(
  videoResult.overallScore.score === expectedScore,
  `Weighted score check: expected ${expectedScore}, got ${videoResult.overallScore.score}`
);

// 收入预估公式验证
const expectedRevenue = Math.round(150000 / 1000 * 4.5 * 0.55); // = $371
assert(
  Math.abs(videoResult.revenueEstimate.estimatedRevenueAvg - expectedRevenue) < 50,
  `Revenue math check: expected ~$${expectedRevenue}, got $${videoResult.revenueEstimate.estimatedRevenueAvg}`
);

// ============================================
// 测试8: 不同类别基准对比
// ============================================
section('跨类别基准对比');

const gamingVideo = { ...mockVideo, category: 'Gaming' };
const gamingResult = analyzeVideo(gamingVideo);
assert(gamingResult.benchmarks.category === 'Gaming', 'Gaming category set');
assert(gamingResult.benchmarks.avgEngagementRate === 3.2, `Gaming benchmark: ${gamingResult.benchmarks.avgEngagementRate}`);

const musicVideo = { ...mockVideo, category: 'Music' };
const musicResult = analyzeVideo(musicVideo);
assert(musicResult.benchmarks.category === 'Music', 'Music category set');

// Gaming在3.2%平均基准下5.6%应该表现更好
assert(
  gamingResult.benchmarks.percentileRank > 50,
  `Gaming percentile: ${gamingResult.benchmarks.percentileRank} (5.6% vs 3.2% avg)`
);

// ============================================
// 测试9: 推荐引擎质量
// ============================================
section('推荐引擎质量检查');

const badVideo = {
  ...mockVideo,
  title: 'video',
  description: 'short',
  tags: [],
  viewCount: 100,
  likeCount: 1,
  commentCount: 0,
};
const badResult = analyzeVideo(badVideo);
assert(badResult.recommendations.length >= 3, `Poor video gets ${badResult.recommendations.length} recommendations`);
assert(
  badResult.recommendations.some(r => r.priority === 'high'),
  'Poor video gets high-priority recommendations'
);

const goodVideo = {
  ...mockVideo,
  title: 'Best YouTube Growth Tips 2026 - How to Get 1 Million Subscribers Fast! 🔥',
  description: 'Complete guide to growing your YouTube channel in 2026. We cover SEO optimization, thumbnail design, engagement strategies, and the YouTube algorithm. Timestamps: 0:00 Introduction, 2:30 SEO Tips, 5:00 Thumbnail Design, 8:00 Engagement Strategies, 12:00 Common Mistakes. Subscribe for weekly YouTube growth tips! #YouTube #Growth #SEO https://tubefission.com https://youtube.com/growthexpert',
  tags: ['youtube growth', 'youtube tips 2026', 'how to grow youtube channel', 'youtube seo', 'youtube algorithm 2026', 'content creation tips', 'social media marketing', 'get more subscribers', 'youtube for beginners', 'video marketing'],
  likeCount: 12000,
  commentCount: 800,
  viewCount: 200000,
};
const goodResult = analyzeVideo(goodVideo);
assert(goodResult.overallScore.score > videoResult.overallScore.score, `Good video scores higher: ${goodResult.overallScore.score} > ${videoResult.overallScore.score}`);

// ============================================
// 测试10: 性能测试
// ============================================
section('性能测试');

const iterations = 1000;
const start = Date.now();
for (let i = 0; i < iterations; i++) {
  analyzeVideo(mockVideo);
  analyzeChannel(mockChannel);
}
const elapsed = Date.now() - start;
assert(elapsed < 5000, `${iterations} analysis cycles in ${elapsed}ms (< 5 seconds)`);
console.log(`     → ${Math.round(elapsed / iterations)}ms per analysis cycle`);

// ============================================
// 汇总
// ============================================
console.log('\n' + '='.repeat(60));
console.log(`📊 测试结果汇总`);
console.log('='.repeat(60));
console.log(`  总测试数: ${totalTests}`);
console.log(`  ✅ 通过: ${passed}`);
console.log(`  ❌ 失败: ${failed}`);
console.log(`  通过率: ${((passed / totalTests) * 100).toFixed(1)}%`);
console.log('='.repeat(60));

if (failures.length > 0) {
  console.log('\n❌ 失败详情:');
  failures.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));
}

process.exit(failed > 0 ? 1 : 0);
