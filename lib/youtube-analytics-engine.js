import { analyzeCommentIntelligence } from './comment-intelligence.js';

/**
 * ============================================================
 * YouTube Analytics Engine v2.0
 * 专业级YouTube数据分析引擎
 * 
 * 提供视频分析、频道分析、SEO评分、行业基准对比、趋势预测
 * 纯JS实现，无外部依赖，兼容Next.js SSR/SSG
 * ============================================================
 */

// ============================================
// 1. 行业基准数据 (Industry Benchmarks)
// 基于2025-2026年公开行业研究数据
// ============================================

export const CATEGORY_BENCHMARKS = {
  Gaming: {
    avgEngagementRate: 3.2,
    avgViewsPerVideo: 25000,
    avgCPM: 4.5,
    avgSubscriberGrowthRate: 2.8,
    avgLikeRatio: 4.2,
    avgCommentRatio: 0.4,
    optimalVideoLength: '12-20 min',
    uploadFrequency: '4-7/week',
    topCountries: ['US', 'BR', 'MX', 'IN', 'RU'],
    avgTitleLength: 55,
    avgDescriptionLength: 800,
    avgTagCount: 18,
  },
  Music: {
    avgEngagementRate: 2.8,
    avgViewsPerVideo: 80000,
    avgCPM: 2.5,
    avgSubscriberGrowthRate: 2.2,
    avgLikeRatio: 5.0,
    avgCommentRatio: 0.3,
    optimalVideoLength: '3-5 min',
    uploadFrequency: '2-4/week',
    topCountries: ['US', 'IN', 'BR', 'MX', 'ID'],
    avgTitleLength: 45,
    avgDescriptionLength: 400,
    avgTagCount: 12,
  },
  Education: {
    avgEngagementRate: 4.5,
    avgViewsPerVideo: 15000,
    avgCPM: 8.5,
    avgSubscriberGrowthRate: 3.5,
    avgLikeRatio: 5.8,
    avgCommentRatio: 0.6,
    optimalVideoLength: '10-15 min',
    uploadFrequency: '2-3/week',
    topCountries: ['US', 'IN', 'GB', 'CA', 'AU'],
    avgTitleLength: 58,
    avgDescriptionLength: 1200,
    avgTagCount: 15,
  },
  Entertainment: {
    avgEngagementRate: 2.5,
    avgViewsPerVideo: 50000,
    avgCPM: 3.0,
    avgSubscriberGrowthRate: 2.0,
    avgLikeRatio: 3.5,
    avgCommentRatio: 0.3,
    optimalVideoLength: '8-15 min',
    uploadFrequency: '3-5/week',
    topCountries: ['US', 'IN', 'BR', 'MX', 'GB'],
    avgTitleLength: 52,
    avgDescriptionLength: 500,
    avgTagCount: 14,
  },
  'Howto & Style': {
    avgEngagementRate: 3.8,
    avgViewsPerVideo: 20000,
    avgCPM: 6.0,
    avgSubscriberGrowthRate: 3.0,
    avgLikeRatio: 5.0,
    avgCommentRatio: 0.5,
    optimalVideoLength: '8-12 min',
    uploadFrequency: '2-4/week',
    topCountries: ['US', 'IN', 'BR', 'GB', 'DE'],
    avgTitleLength: 55,
    avgDescriptionLength: 900,
    avgTagCount: 16,
  },
  'Science & Technology': {
    avgEngagementRate: 3.5,
    avgViewsPerVideo: 30000,
    avgCPM: 10.0,
    avgSubscriberGrowthRate: 3.2,
    avgLikeRatio: 5.2,
    avgCommentRatio: 0.5,
    optimalVideoLength: '10-18 min',
    uploadFrequency: '1-3/week',
    topCountries: ['US', 'IN', 'GB', 'DE', 'JP'],
    avgTitleLength: 56,
    avgDescriptionLength: 1000,
    avgTagCount: 14,
  },
  'News & Politics': {
    avgEngagementRate: 2.0,
    avgViewsPerVideo: 40000,
    avgCPM: 4.0,
    avgSubscriberGrowthRate: 1.8,
    avgLikeRatio: 2.5,
    avgCommentRatio: 0.5,
    optimalVideoLength: '8-15 min',
    uploadFrequency: '5-14/week',
    topCountries: ['US', 'IN', 'GB', 'CA', 'AU'],
    avgTitleLength: 60,
    avgDescriptionLength: 600,
    avgTagCount: 20,
  },
  'People & Blogs': {
    avgEngagementRate: 3.0,
    avgViewsPerVideo: 10000,
    avgCPM: 3.5,
    avgSubscriberGrowthRate: 2.5,
    avgLikeRatio: 4.0,
    avgCommentRatio: 0.4,
    optimalVideoLength: '10-20 min',
    uploadFrequency: '3-5/week',
    topCountries: ['US', 'IN', 'BR', 'MX', 'ID'],
    avgTitleLength: 50,
    avgDescriptionLength: 500,
    avgTagCount: 15,
  },
  'Film & Animation': {
    avgEngagementRate: 2.5,
    avgViewsPerVideo: 20000,
    avgCPM: 3.5,
    avgSubscriberGrowthRate: 2.0,
    avgLikeRatio: 4.5,
    avgCommentRatio: 0.3,
    optimalVideoLength: '5-15 min',
    uploadFrequency: '1-3/week',
    topCountries: ['US', 'IN', 'GB', 'CA', 'AU'],
    avgTitleLength: 48,
    avgDescriptionLength: 500,
    avgTagCount: 12,
  },
  'Autos & Vehicles': {
    avgEngagementRate: 2.8,
    avgViewsPerVideo: 18000,
    avgCPM: 7.0,
    avgSubscriberGrowthRate: 2.2,
    avgLikeRatio: 4.0,
    avgCommentRatio: 0.3,
    optimalVideoLength: '10-20 min',
    uploadFrequency: '2-4/week',
    topCountries: ['US', 'IN', 'GB', 'DE', 'BR'],
    avgTitleLength: 52,
    avgDescriptionLength: 700,
    avgTagCount: 14,
  },
  Sports: {
    avgEngagementRate: 2.5,
    avgViewsPerVideo: 35000,
    avgCPM: 3.5,
    avgSubscriberGrowthRate: 2.0,
    avgLikeRatio: 3.5,
    avgCommentRatio: 0.3,
    optimalVideoLength: '8-15 min',
    uploadFrequency: '3-7/week',
    topCountries: ['US', 'IN', 'GB', 'BR', 'MX'],
    avgTitleLength: 55,
    avgDescriptionLength: 500,
    avgTagCount: 18,
  },
  'Travel & Events': {
    avgEngagementRate: 3.0,
    avgViewsPerVideo: 12000,
    avgCPM: 5.5,
    avgSubscriberGrowthRate: 2.5,
    avgLikeRatio: 5.0,
    avgCommentRatio: 0.4,
    optimalVideoLength: '10-18 min',
    uploadFrequency: '1-3/week',
    topCountries: ['US', 'GB', 'DE', 'AU', 'CA'],
    avgTitleLength: 50,
    avgDescriptionLength: 800,
    avgTagCount: 15,
  },
  'Pets & Animals': {
    avgEngagementRate: 4.0,
    avgViewsPerVideo: 15000,
    avgCPM: 3.0,
    avgSubscriberGrowthRate: 2.5,
    avgLikeRatio: 6.0,
    avgCommentRatio: 0.4,
    optimalVideoLength: '5-10 min',
    uploadFrequency: '3-5/week',
    topCountries: ['US', 'IN', 'BR', 'GB', 'JP'],
    avgTitleLength: 45,
    avgDescriptionLength: 400,
    avgTagCount: 12,
  },
  Comedy: {
    avgEngagementRate: 3.0,
    avgViewsPerVideo: 30000,
    avgCPM: 3.5,
    avgSubscriberGrowthRate: 2.5,
    avgLikeRatio: 5.0,
    avgCommentRatio: 0.3,
    optimalVideoLength: '5-12 min',
    uploadFrequency: '2-5/week',
    topCountries: ['US', 'IN', 'BR', 'MX', 'GB'],
    avgTitleLength: 48,
    avgDescriptionLength: 400,
    avgTagCount: 12,
  },
};

// CPM by country (USD)
export const CPM_BY_COUNTRY = {
  US: 6.50, GB: 5.20, CA: 5.80, AU: 5.00, DE: 4.50,
  FR: 4.00, JP: 3.80, KR: 3.50, BR: 1.50, IN: 1.20,
  MX: 1.80, ID: 1.00, RU: 1.50, NG: 0.80, EG: 0.90,
  TR: 1.50, TH: 1.20, VN: 0.80, PH: 1.00, SA: 3.00,
  AE: 3.50, HK: 3.00, TW: 2.50, SG: 4.00, NZ: 4.50,
};

// Enrich benchmarks with VSI-related metrics
for (const cat of Object.keys(CATEGORY_BENCHMARKS)) {
  if (CATEGORY_BENCHMARKS[cat].avgShareRate == null) {
    CATEGORY_BENCHMARKS[cat].avgShareRate = 0.8;
  }
  if (CATEGORY_BENCHMARKS[cat].avgReturnViewerRate == null) {
    CATEGORY_BENCHMARKS[cat].avgReturnViewerRate = 15;
  }
}

// ============================================
// 2. 视频分析模块
// ============================================

/**
 * 分析单个YouTube视频的全面指标
 * @param {Object} videoData - YouTube API返回的视频数据
 * @returns {Object} 完整分析报告
 */
export function analyzeVideo(videoData) {
  const viewCount = videoData.viewCount || 0;
  const likeCount = videoData.likeCount || 0;
  const commentCount = videoData.commentCount || 0;
  const daysSincePublished = getDaysSince(videoData.publishedAt);
  const category = videoData.category || 'Entertainment';
  const benchmark = CATEGORY_BENCHMARKS[category] || CATEGORY_BENCHMARKS['Entertainment'];

  // === 基础指标计算 ===
  const engagementRate = viewCount > 0 ? ((likeCount + commentCount) / viewCount) * 100 : 0;
  const likeRatio = viewCount > 0 ? (likeCount / viewCount) * 100 : 0;
  const commentRatio = viewCount > 0 ? (commentCount / viewCount) * 100 : 0;
  const likeToCommentRatio = commentCount > 0 ? likeCount / commentCount : 0;

  // === 观看速度分析 ===
  const dailyViewRate = daysSincePublished > 0 ? viewCount / daysSincePublished : viewCount;

  // 观看速度趋势
  let velocityTrend = 'stable';
  let decayFactor = 0.8;
  if (daysSincePublished <= 3) {
    velocityTrend = 'accelerating';
    decayFactor = 1.2;
  } else if (daysSincePublished > 30) {
    velocityTrend = 'decelerating';
    decayFactor = 0.5;
  }

  const estimated30DayViews = Math.round(viewCount + dailyViewRate * 30 * decayFactor);
  const estimated90DayViews = Math.round(viewCount + dailyViewRate * 90 * decayFactor * 0.6);

  // === 频道数据（如果有的话） ===
  const subscriberCount = videoData.subscriberCount || 0;
  const viewsPerSubscriber = subscriberCount > 0 ? viewCount / subscriberCount : 0;
  const subscriberConversionRate = viewCount > 0 ? Math.min((viewCount * 0.01) / subscriberCount * 100, 100) : 0;

  // === 预估留存率（基于视频时长和观看数据） ===
  const retentionEstimate = estimateRetention(videoData.duration, viewCount, commentCount);

  // === 分类基准对比 ===
  const engagementPercentile = calculatePercentile(engagementRate, benchmark.avgEngagementRate);
  const performanceVsCategory = getPerformanceRating(engagementRate, benchmark.avgEngagementRate);

  // === 互动率评分 (0-100) ===
  const engagementScore = calculateEngagementScore({
    engagementRate,
    likeRatio,
    commentRatio,
    likeToCommentRatio,
    benchmark,
  });

  // === SEO评分 (0-100) ===
  const seoScore = calculateVideoSEOScore(videoData);

  // === 速度评分 (0-100) ===
  const velocityScore = calculateVelocityScore({
    dailyViewRate,
    daysSincePublished,
    viewCount,
    benchmark,
  });

  // === 增长评分 (0-100) ===
  const growthScore = calculateGrowthScore({
    dailyViewRate,
    viewsPerSubscriber,
    subscriberConversionRate,
    daysSincePublished,
  });

  // === Advanced Metrics ===
  const vsiResult = calculateViewerSatisfactionIndex(videoData);
  const surfaceResult = calculateAlgorithmSurfaceDistribution(videoData);
  const decayResult = calculateContentDecayRate(videoData);
  const sevResult = calculateSessionExtensionValue(videoData);
  
  // Use real comment intelligence if comments array provided, otherwise fallback to basic estimation
  const commentIntel = videoData.comments && videoData.comments.length > 0
    ? analyzeCommentIntelligence(videoData.comments)
    : calculateCommentIntelligence(videoData);

  // === 综合评分 ===
  const overallScore = Math.round(
    engagementScore * 0.25 +
    seoScore * 0.20 +
    velocityScore * 0.18 +
    growthScore * 0.12 +
    vsiResult.score * 0.25
  );

  const grade = getGrade(overallScore);

  // === 行动建议 ===
  const recommendations = generateVideoRecommendations(videoData, {
    engagementRate,
    likeRatio,
    commentRatio,
    engagementPercentile,
    velocityTrend,
    seoScore,
    benchmark,
  });

  // === SWOT分析 ===
  const competitiveAnalysis = generateVideoSWOT(videoData, {
    engagementRate,
    engagementPercentile,
    dailyViewRate,
    velocityTrend,
    viewsPerSubscriber,
    benchmark,
  });

  // === 收入预估 ===
  const revenueEstimate = estimateVideoRevenue(viewCount, category);

  return {
    overallScore: {
      score: overallScore,
      grade,
      breakdown: {
        engagementScore: Math.round(engagementScore),
        seoScore: Math.round(seoScore),
        velocityScore: Math.round(velocityScore),
        growthScore: Math.round(growthScore),
        vsiScore: vsiResult.score,
      },
    },
    metrics: {
      engagementRate: round2(engagementRate),
      likeRatio: round2(likeRatio),
      commentRatio: round4(commentRatio),
      likeToCommentRatio: round2(likeToCommentRatio),
      engagementPercentile,
      dailyViewRate: Math.round(dailyViewRate),
      velocityTrend,
      estimated30DayViews: Math.round(estimated30DayViews),
      estimated90DayViews: Math.round(estimated90DayViews),
      viewsPerSubscriber: round2(viewsPerSubscriber),
      subscriberConversionRate: round2(subscriberConversionRate),
      retentionEstimate: round1(retentionEstimate),
    },
    benchmarks: {
      category,
      avgEngagementRate: benchmark.avgEngagementRate,
      avgDailyViews: benchmark.avgViewsPerVideo / 30,
      performanceVsCategory,
      percentileRank: engagementPercentile,
    },
    recommendations,
    competitiveAnalysis,
    revenueEstimate,
    viewerSatisfaction: vsiResult,
    algorithmSurface: surfaceResult,
    contentDecay: decayResult,
    sessionExtension: sevResult,
    commentIntelligence: commentIntel,
  };
}

// ============================================
// 3. 频道分析模块
// ============================================

/**
 * 分析YouTube频道的全面指标
 * @param {Object} channelData - YouTube API返回的频道数据
 * @returns {Object} 完整频道分析报告
 */
export function analyzeChannel(channelData) {
  const subscriberCount = channelData.subscriberCount || 0;
  const viewCount = getChannelViewCount(channelData) || 0;
  const videoCount = channelData.videoCount || 0;
  const daysSinceCreated = getDaysSince(channelData.publishedAt);
  const yearsSinceCreated = Math.max(daysSinceCreated / 365, 0.1);

  // === 基础指标 ===
  const avgViewsPerVideo = videoCount > 0 ? viewCount / videoCount : 0;
  const viewsPerSubscriber = subscriberCount > 0 ? viewCount / subscriberCount : 0;

  // === 增长分析 ===
  const subscriberGrowthRate = calculateSubscriberGrowthRate(subscriberCount, daysSinceCreated);
  const subscriberDoublingTime = subscriberGrowthRate > 0
    ? Math.log(2) / Math.log(1 + subscriberGrowthRate / 100)
    : Infinity;

  // 增长轨迹判断
  let growthTrajectory = 'stable';
  if (subscriberGrowthRate > 10) growthTrajectory = 'viral';
  else if (subscriberGrowthRate > 5) growthTrajectory = 'exponential';
  else if (subscriberGrowthRate > 2) growthTrajectory = 'linear';
  else if (subscriberGrowthRate > 0.5) growthTrajectory = 'plateau';
  else growthTrajectory = 'declining';

  // 投影
  const monthlyGrowthMultiplier = 1 + subscriberGrowthRate / 100;
  const projectedSubscribers30d = Math.round(subscriberCount * monthlyGrowthMultiplier);
  const projectedSubscribers90d = Math.round(subscriberCount * Math.pow(monthlyGrowthMultiplier, 3));
  const projectedSubscribers1y = Math.round(subscriberCount * Math.pow(monthlyGrowthMultiplier, 12));

  // === 内容策略分析 ===
  const uploadFrequencyDays = videoCount > 0 && daysSinceCreated > 0
    ? daysSinceCreated / videoCount
    : 7;
  const uploadFrequencyPerWeek = 7 / uploadFrequencyDays;
  const uploadFrequencyText = formatUploadFrequency(uploadFrequencyPerWeek);
  const uploadConsistency = Math.min(100, Math.max(0, 100 - Math.abs(uploadFrequencyPerWeek - 3) * 15));

  // 内容分布估算
  const contentMix = estimateContentMix(avgViewsPerVideo, videoCount, subscriberCount);

  // === 健康评分 ===
  const growthHealth = calculateGrowthHealth(subscriberGrowthRate, growthTrajectory);
  const contentHealth = calculateContentHealth(avgViewsPerVideo, videoCount, uploadConsistency);
  const engagementHealth = calculateEngagementHealth(viewsPerSubscriber, subscriberCount);
  const consistencyHealth = Math.round(uploadConsistency);
  const overallHealth = Math.round(growthHealth * 0.3 + contentHealth * 0.25 + engagementHealth * 0.25 + consistencyHealth * 0.2);

  // === 收入分析 ===
  const revenueAnalysis = estimateChannelRevenue(subscriberCount, avgViewsPerVideo, videoCount, uploadFrequencyPerWeek);

  // === 受众洞察 ===
  const audienceInsights = {
    topCountries: channelData.country ? [channelData.country, 'US', 'IN'] : ['US', 'IN', 'BR'],
    ageGroupEstimate: estimateAgeGroup(subscriberCount),
    genderSplitEstimate: estimateGender(subscriberCount),
    peakActivityHours: ['14:00-16:00', '19:00-21:00'],
    audienceType: viewsPerSubscriber > 5 ? 'loyal' : viewsPerSubscriber < 1 ? 'casual' : 'mixed',
  };

  // === SWOT分析 ===
  const swot = generateChannelSWOT({
    subscriberCount,
    avgViewsPerVideo,
    viewsPerSubscriber,
    uploadFrequencyPerWeek,
    growthTrajectory,
    subscriberGrowthRate,
    yearsSinceCreated,
  });

  // === 增长计划 ===
  const growthPlan = generateGrowthPlan({
    subscriberCount,
    subscriberGrowthRate,
    avgViewsPerVideo,
    uploadFrequencyPerWeek,
    growthTrajectory,
  });

  return {
    healthScore: {
      overall: overallHealth,
      growthHealth: Math.round(growthHealth),
      contentHealth: Math.round(contentHealth),
      engagementHealth: Math.round(engagementHealth),
      consistencyHealth: Math.round(consistencyHealth),
    },
    growth: {
      subscriberGrowthRate: round2(subscriberGrowthRate),
      subscriberDoublingTime: Math.round(subscriberDoublingTime),
      viewGrowthTrend: subscriberGrowthRate > 3 ? 'accelerating' : subscriberGrowthRate > 0 ? 'stable' : 'declining',
      projectedSubscribers30d,
      projectedSubscribers90d,
      projectedSubscribers1y,
      growthTrajectory,
    },
    contentStrategy: {
      avgViewsPerVideo: Math.round(avgViewsPerVideo),
      viewDistribution: contentMix.distribution,
      uploadFrequency: uploadFrequencyText,
      uploadConsistency: Math.round(uploadConsistency),
      optimalUploadDay: 'Saturday',
      optimalVideoLength: '10-15 min',
      contentMix: {
        evergreen: contentMix.evergreen,
        trending: contentMix.trending,
        shorts: contentMix.shorts,
      },
    },
    revenueAnalysis,
    audienceInsights,
    swot,
    growthPlan,
  };
}

// ============================================
// 4. 视频SEO评分模块
// ============================================

export function analyzeVideoSEO(videoData) {
  const title = videoData.title || '';
  const description = videoData.description || '';
  const tags = videoData.tags || [];
  const targetKeyword = videoData.targetKeyword || '';
  const category = videoData.category || 'Entertainment';

  // === 标题分析 ===
  const titleLength = title.length;
  let titleLengthRating = 'optimal';
  if (titleLength < 40) titleLengthRating = 'too_short';
  else if (titleLength > 70) titleLengthRating = 'too_long';

  const titleAnalysis = {
    length: titleLengthRating,
    hasKeyword: targetKeyword ? title.toLowerCase().includes(targetKeyword.toLowerCase()) : false,
    hasNumber: /\d/.test(title),
    hasEmoji: /[\u{1F300}-\u{1FAFF}]/u.test(title),
    hasYear: /20\d{2}/.test(title),
    emotionalTrigger: /[!?]|best|worst|insane|amazing|secret|shocking|never|always/i.test(title),
    powerWords: findPowerWords(title),
    recommended: generateRecommendedTitle(title, targetKeyword),
  };

  // 标题评分
  let titleScore = 50; // 基础分
  if (titleLengthRating === 'optimal') titleScore += 20;
  else titleScore += 5;
  if (titleAnalysis.hasKeyword) titleScore += 10;
  if (titleAnalysis.hasNumber) titleScore += 5;
  if (titleAnalysis.hasEmoji) titleScore += 3;
  if (titleAnalysis.hasYear) titleScore += 4;
  if (titleAnalysis.emotionalTrigger) titleScore += 5;
  if (titleAnalysis.powerWords.length > 0) titleScore += 3;
  titleScore = Math.min(100, titleScore);

  // === 描述分析 ===
  const descLength = description.length;
  let descLengthRating = 'optimal';
  if (descLength < 150) descLengthRating = 'too_short';
  else if (descLength > 5000) descLengthRating = 'too_long';

  const descriptionAnalysis = {
    length: descLengthRating,
    hasLinks: /https?:\/\//.test(description),
    hasTimestamps: /\d{1,2}:\d{2}/.test(description),
    hasHashtags: /#\w+/.test(description),
    keywordDensity: targetKeyword
      ? (description.toLowerCase().split(targetKeyword.toLowerCase()).length - 1) / Math.max(descLength / 100, 1)
      : 0,
    readability: descLength > 500 ? 'good' : descLength > 150 ? 'fair' : 'poor',
  };

  let descScore = 40;
  if (descLengthRating === 'optimal') descScore += 25;
  else descScore += 10;
  if (descriptionAnalysis.hasLinks) descScore += 8;
  if (descriptionAnalysis.hasTimestamps) descScore += 10;
  if (descriptionAnalysis.hasHashtags) descScore += 5;
  if (descriptionAnalysis.readability === 'good') descScore += 7;
  descScore = Math.min(100, descScore);

  // === 标签分析 ===
  const tagCount = tags.length;
  let tagCountRating = 'optimal';
  if (tagCount < 5) tagCountRating = 'too_few';
  else if (tagCount > 30) tagCountRating = 'too_many';

  const avgTagLength = tagCount > 0
    ? tags.reduce((sum, t) => sum + t.length, 0) / tagCount
    : 0;

  const tagAnalysis = {
    count: tagCountRating,
    avgTagLength: Math.round(avgTagLength),
    hasBroadTags: tags.some(t => t.split(' ').length === 1),
    hasLongTailTags: tags.some(t => t.split(' ').length >= 3),
    hasCompetitorTags: false,
    suggestedTags: generateTagSuggestions(title, category),
  };

  let tagScore = 40;
  if (tagCountRating === 'optimal') tagScore += 20;
  else tagScore += 8;
  if (tagAnalysis.hasBroadTags) tagScore += 8;
  if (tagAnalysis.hasLongTailTags) tagScore += 12;
  if (tagCount >= 8) tagScore += 10;
  tagScore = Math.min(100, tagScore);

  // === 缩略图评分（基于可用信号） ===
  const thumbnailScore = videoData.thumbnail ? 60 : 20; // 有缩略图基础分

  // === 综合SEO评分 ===
  const overall = Math.round(titleScore * 0.35 + descScore * 0.30 + tagScore * 0.25 + thumbnailScore * 0.10);

  return {
    seoScore: {
      title: {
        score: Math.round(titleScore),
        issues: getTitleIssues(titleAnalysis),
        suggestions: getTitleSuggestions(titleAnalysis, targetKeyword),
      },
      description: {
        score: Math.round(descScore),
        issues: getDescIssues(descriptionAnalysis),
        suggestions: getDescSuggestions(descriptionAnalysis, targetKeyword),
      },
      tags: {
        score: Math.round(tagScore),
        issues: getTagIssues(tagAnalysis),
        suggestions: tagAnalysis.suggestedTags.slice(0, 10),
      },
      thumbnail: { score: Math.round(thumbnailScore), issues: [], suggestions: [] },
      overall,
    },
    titleAnalysis,
    descriptionAnalysis,
    tagAnalysis,
  };
}

// ============================================
// 5. 趋势预测模块
// ============================================

/**
 * 预测视频/频道趋势
 */
export function predictTrend(currentMetrics, historicalData = []) {
  const viewCount = currentMetrics.viewCount || 0;
  const daysSincePublished = currentMetrics.daysSincePublished || getDaysSince(currentMetrics.publishedAt);
  const dailyViewRate = daysSincePublished > 0 ? viewCount / daysSincePublished : viewCount;

  // 增长阶段判断
  let growthPhase = 'growing';
  if (daysSincePublished <= 3) growthPhase = 'emerging';
  else if (daysSincePublished <= 14) growthPhase = 'growing';
  else if (daysSincePublished <= 60) {
    const acceleration = historicalData.length >= 2
      ? (historicalData[1].views - historicalData[0].views) / Math.max(historicalData[0].views, 1)
      : 0;
    growthPhase = acceleration > 0.1 ? 'growing' : acceleration > -0.05 ? 'peak' : 'declining';
  } else {
    growthPhase = dailyViewRate < viewCount / 100 ? 'declining' : 'plateau';
  }

  // 动量评分 (-100 to +100)
  let momentumScore = 0;
  if (growthPhase === 'emerging') momentumScore = 70;
  else if (growthPhase === 'growing') momentumScore = 40;
  else if (growthPhase === 'peak') momentumScore = 10;
  else if (growthPhase === 'plateau') momentumScore = -15;
  else momentumScore = -50;

  // 预估
  const decayFactor = growthPhase === 'emerging' ? 1.5
    : growthPhase === 'growing' ? 1.2
    : growthPhase === 'peak' ? 0.9
    : growthPhase === 'plateau' ? 0.5
    : 0.2;

  const next7Days = Math.round(viewCount + dailyViewRate * 7 * decayFactor);
  const next30Days = Math.round(viewCount + dailyViewRate * 30 * decayFactor * 0.8);
  const next90Days = Math.round(viewCount + dailyViewRate * 90 * decayFactor * 0.5);

  const confidence = daysSincePublished > 30 ? 'high' : daysSincePublished > 7 ? 'medium' : 'low';

  const recommendedAction =
    growthPhase === 'emerging' ? 'This content is gaining early traction. Publish follow-up content immediately to capitalize on momentum.'
    : growthPhase === 'growing' ? 'Strong growth phase. Create a series or playlist around this topic to maximize subscriber conversion.'
    : growthPhase === 'peak' ? 'Approaching peak. Consider creating related content or a sequel while audience interest is still high.'
    : growthPhase === 'plateau' ? 'Growth is leveling off. Focus on evergreen SEO optimization and internal linking to extend content lifespan.'
    : 'Trend is declining. Archive lessons learned and pivot to emerging topics in your niche.';

  return {
    viewForecast: { next7Days, next30Days, next90Days, confidence },
    growthPhase,
    momentumScore,
    trendDirection: momentumScore > 10 ? 'up' : momentumScore > -10 ? 'stable' : 'down',
    recommendedAction,
  };
}

// ============================================
// 6. Viewer Satisfaction & Advanced Metrics
// ============================================

/**
 * Calculate Viewer Satisfaction Index (VSI)
 * VSI = (AVD_ratio × 0.30) + (like_view_ratio × 0.25) + (share_rate × 0.20) + (comment_sentiment × 0.15) + (return_viewer_rate × 0.10)
 */
export function calculateViewerSatisfactionIndex(videoData) {
  const viewCount = videoData.viewCount || 0;
  const likeCount = videoData.likeCount || 0;
  const commentCount = videoData.commentCount || 0;
  const subscriberCount = videoData.subscriberCount || 0;
  const category = videoData.category || 'Entertainment';
  const benchmark = CATEGORY_BENCHMARKS[category] || CATEGORY_BENCHMARKS['Entertainment'];

  // AVD_ratio: averageViewDuration / length (normalized 0-1)
  const durationSeconds = parseDuration(videoData.duration);
  const avdRatio = durationSeconds > 0
    ? Math.min((videoData.averageViewDuration || durationSeconds * 0.45) / durationSeconds, 1)
    : 0.5;

  // like_view_ratio: normalized to category benchmark
  const rawLikeRatio = viewCount > 0 ? (likeCount / viewCount) * 100 : 0;
  const likeViewRatio = Math.min(rawLikeRatio / Math.max(benchmark.avgLikeRatio, 0.01), 1);

  // share_rate: estimated shares / views
  const estimatedShares = estimateShares(videoData);
  const shareRate = viewCount > 0 ? estimatedShares / viewCount : 0;

  // comment_sentiment: placeholder (0.5 until NLP implemented)
  const commentSentiment = 0.5;

  // return_viewer_rate: subscriber / total views
  const returnViewerRate = viewCount > 0 ? Math.min(subscriberCount / viewCount, 1) : 0;

  // VSI calculation
  const vsi = (avdRatio * 0.30) + (likeViewRatio * 0.25) + (shareRate * 0.20) + (commentSentiment * 0.15) + (returnViewerRate * 0.10);
  const score = Math.round(vsi * 100);

  const grade = getGrade(score);

  const breakdown = {
    avdRatio: round2(avdRatio),
    likeViewRatio: round2(likeViewRatio),
    shareRate: round4(shareRate),
    commentSentiment,
    returnViewerRate: round2(returnViewerRate),
  };

  let interpretation;
  if (score >= 85) interpretation = 'Excellent viewer satisfaction. Your content strongly resonates with your audience across all dimensions.';
  else if (score >= 70) interpretation = 'Good viewer satisfaction. Most engagement signals are healthy with room for optimization in specific areas.';
  else if (score >= 50) interpretation = 'Moderate viewer satisfaction. Some engagement signals need improvement. Focus on watch time and shareability.';
  else if (score >= 30) interpretation = 'Below-average viewer satisfaction. Multiple engagement signals are weak. Review content quality and audience targeting.';
  else interpretation = 'Poor viewer satisfaction. Significant issues with audience engagement. Consider re-evaluating content strategy.';

  return { score, grade, breakdown, interpretation };
}

/**
 * Calculate Algorithm Surface Distribution
 * Estimates which YouTube surface drives most views based on public signals
 * @param {Object} videoData
 * @returns {{
 *   dominantSurface: string,
 *   distribution: {home: number, search: number, suggested: number, shorts: number, subscriptions: number},
 *   optimizationTips: string[]
 * }}
 */
export function calculateAlgorithmSurfaceDistribution(videoData) {
  const title = videoData.title || '';
  const description = videoData.description || '';
  const subscriberCount = videoData.subscriberCount || 0;
  const viewCount = videoData.viewCount || 0;
  const durationSeconds = parseDuration(videoData.duration);
  const isShort = (durationSeconds > 0 && durationSeconds <= 60) || videoData.isShort === true;
  const hasPlaylist = videoData.playlistId != null || videoData.playlistPresence === true;
  const inPlaylist = videoData.inPlaylist === true;
  const endScreenPresent = videoData.endScreenPresent === true;
  const cardCount = videoData.cardCount || 0;

  // --- Signal-based surface scoring (0-10 scale per surface) ---
  let searchScore = 0;
  let homeScore = 0;
  let suggestedScore = 0;
  let shortsScore = 0;
  let subsScore = 0;

  // Search: title length & keyword density
  const titleWords = title.split(/\s+/).filter(Boolean);
  const descWords = description.split(/\s+/).filter(Boolean);
  const keywordDensity = titleWords.length > 0
    ? descWords.filter(w => titleWords.some(tw => tw.toLowerCase() === w.toLowerCase())).length / Math.max(descWords.length, 1)
    : 0;

  if (title.length >= 55 && title.length <= 70) searchScore += 4;
  else if (title.length >= 45) searchScore += 2;
  if (keywordDensity >= 0.03) searchScore += 3;
  else if (keywordDensity >= 0.01) searchScore += 1;
  if (/\b(20\d{2}|202\d)\b/.test(title)) searchScore += 1;
  if (/\b(how to|tutorial|guide|review|vs|versus|best|top \d+)\b/i.test(title)) searchScore += 2;

  // Home: thumbnail CTR proxy (engagement rate), emotional triggers
  const engagementRate = viewCount > 0
    ? ((videoData.likeCount || 0) + (videoData.commentCount || 0)) / viewCount
    : 0;
  const engagementPct = engagementRate * 100;

  if (videoData.thumbnail) homeScore += 2;
  if (/[!?]/.test(title)) homeScore += 1;
  if (engagementPct >= 5) homeScore += 3;
  else if (engagementPct >= 2) homeScore += 2;
  else if (engagementPct >= 1) homeScore += 1;
  if (title.length >= 40 && title.length <= 60) homeScore += 1;
  if (videoData.thumbnailCTR != null) {
    const ctr = videoData.thumbnailCTR;
    if (ctr >= 8) homeScore += 3;
    else if (ctr >= 5) homeScore += 2;
    else if (ctr >= 3) homeScore += 1;
  }

  // Suggested: playlist presence, end screens, cards
  if (hasPlaylist || inPlaylist) suggestedScore += 3;
  if (endScreenPresent) suggestedScore += 2;
  if (cardCount >= 2) suggestedScore += 2;
  else if (cardCount >= 1) suggestedScore += 1;
  if (videoData.endScreenClickRate != null) suggestedScore += 1;
  if (videoData.playlistCompletionRate != null && videoData.playlistCompletionRate > 0.3) suggestedScore += 2;

  // Shorts: short-form content
  if (isShort) shortsScore += 8;
  if (videoData.isShort === true) shortsScore += 2;
  if (durationSeconds > 0 && durationSeconds <= 30) shortsScore += 1;

  // Subscriptions: subscriber ratio
  const subRatio = viewCount > 0 ? subscriberCount / viewCount : 0;
  const subPercent = subRatio * 100;
  if (subPercent > 50) subsScore += 4;
  else if (subPercent > 20) subsScore += 3;
  else if (subPercent > 10) subsScore += 2;
  else if (subPercent > 5) subsScore += 1;
  if (subscriberCount >= 100000) subsScore += 1;
  if (videoData.notificationEnabled === true) subsScore += 1;

  // Normalize to percentages
  const total = Math.max(searchScore + homeScore + suggestedScore + shortsScore + subsScore, 1);

  const distribution = {
    home: round2((homeScore / total) * 100),
    search: round2((searchScore / total) * 100),
    suggested: round2((suggestedScore / total) * 100),
    shorts: round2((shortsScore / total) * 100),
    subscriptions: round2((subsScore / total) * 100),
  };

  // Determine dominant surface
  let dominant = 'home';
  let maxVal = 0;
  for (const [surface, val] of Object.entries(distribution)) {
    if (val > maxVal) { maxVal = val; dominant = surface; }
  }

  // Build optimization tips
  const tips = [];
  if (distribution.search < 20) {
    tips.push('Optimize titles with target keywords (45-70 chars) and add year tags to boost search discoverability.');
  }
  if (distribution.home < 25) {
    tips.push('Improve thumbnails and title emotional triggers to increase browse impressions CTR.');
  }
  if (distribution.suggested < 15 && !hasPlaylist && !inPlaylist) {
    tips.push('Add videos to playlists and use end screens to increase suggested video appearances.');
  }
  if (distribution.shorts < 10 && !isShort) {
    tips.push('Create YouTube Shorts versions of top content for Shorts shelf visibility.');
  }
  if (distribution.subscriptions < 10) {
    tips.push('Encourage viewers to subscribe and enable notifications for more subscription-surface traffic.');
  }
  if (tips.length === 0) {
    tips.push('Surface distribution is balanced. Continue current strategy.');
  }

  return {
    dominantSurface: dominant,
    distribution,
    optimizationTips: tips,
  };
}

/**
 * Calculate Content Decay Rate (CDR)
 * CDR = (views_at_90d - views_at_30d) / views_at_30d
 */
export function calculateContentDecayRate(videoData) {
  const viewCount = videoData.viewCount || 0;
  const daysSincePublished = getDaysSince(videoData.publishedAt);
  const dailyViewRate = daysSincePublished > 0 ? viewCount / daysSincePublished : viewCount;

  // For single-point data, estimate views at milestones
  // Use actual data up to daysSincePublished, then project forward
  const viewsAt30d = videoData.viewsAt30d || (daysSincePublished >= 30
    ? Math.round(dailyViewRate * 30 * 1.2)  // Already past 30d: actual trajectory
    : Math.round(dailyViewRate * daysSincePublished * 1.2)); // Still before 30d: project
  const viewsAt90d = videoData.viewsAt90d || (daysSincePublished >= 90
    ? Math.round(dailyViewRate * 90 * 0.8)  // Already past 90d: actual trajectory
    : Math.round(viewCount + dailyViewRate * (90 - daysSincePublished) * 0.6)); // Project forward with decay

  let cdr;
  if (viewsAt30d > 0) {
    cdr = (viewsAt90d - viewsAt30d) / viewsAt30d;
  } else {
    cdr = 0;
  }

  let classification;
  let shelfLife;
  if (cdr > 1.0) {
    classification = 'evergreen';
    shelfLife = '12+ months — This content continues to gain significant traction over time.';
  } else if (cdr > 0) {
    classification = 'standard';
    shelfLife = '3-6 months — Normal content lifecycle with moderate staying power.';
  } else {
    classification = 'dead';
    shelfLife = 'Under 3 months — Content has exhausted its primary audience.';
  }

  const recommendations = [];
  if (classification === 'dead') {
    recommendations.push('Repurpose this content into a new format (Shorts, blog post, or updated version).');
    recommendations.push('Add to a playlist with evergreen content to extend its passive view life.');
    recommendations.push('Consider updating the title with fresh keywords to capture new search demand.');
  } else if (classification === 'standard') {
    recommendations.push('Create a follow-up or "updated" version to capitalize on existing interest.');
    recommendations.push('Add end screens and cards to funnel viewers to newer content.');
    recommendations.push('Update description with new links and relevant hashtags to maintain search visibility.');
  } else {
    recommendations.push('Double down on this topic — create a series or deep-dive follow-ups.');
    recommendations.push('Optimize the description with additional keywords based on search console data.');
    recommendations.push('Promote this video in community posts and social media to amplify evergreen performance.');
  }

  return {
    rate: round2(cdr),
    classification,
    shelfLife,
    recommendations,
  };
}

/**
 * Calculate Session Extension Value (SEV)
 * SEV = (playlist_completion_rate × avg_videos_after) + (end_screen_click_rate × suggested_ctr)
 */
export function calculateSessionExtensionValue(videoData) {
  const viewCount = videoData.viewCount || 0;
  const commentCount = videoData.commentCount || 0;
  const durationSeconds = parseDuration(videoData.duration);
  const subscriberCount = videoData.subscriberCount || 0;
  const videoCount = videoData.videoCount || 0;

  const engagementRate = viewCount > 0 ? (commentCount / viewCount) : 0;

  // Estimate playlist completion rate from engagement signals
  const playlistCompletionRate = Math.min(0.3 + engagementRate * 15 + (videoCount > 10 ? 0.15 : 0), 0.85);

  // Average videos watched after this video
  const avgVideosAfter = Math.min(1 + (subscriberCount / Math.max(viewCount, 1)) * 5 + engagementRate * 50, 5);

  // End screen click rate estimate
  const endScreenClickRate = Math.min(0.02 + engagementRate * 2 + (durationSeconds > 300 ? 0.01 : 0), 0.15);

  // Suggested CTR estimate
  const suggestedCTR = Math.min(0.05 + engagementRate * 3 + (videoCount > 20 ? 0.02 : 0), 0.25);

  const sev = (playlistCompletionRate * avgVideosAfter) + (endScreenClickRate * suggestedCTR);
  const score = Math.round(Math.min(sev * 50, 100));

  let extensionPotential;
  if (score >= 70) extensionPotential = 'high';
  else if (score >= 40) extensionPotential = 'medium';
  else extensionPotential = 'low';

  const tips = [];
  if (playlistCompletionRate < 0.4) tips.push('Add this video to a well-ordered playlist and create binge-worthy content sequences.');
  if (endScreenClickRate < 0.05) tips.push('Add end screens with compelling calls-to-action linking to related videos.');
  if (avgVideosAfter < 2) tips.push('Use info cards and verbal CTAs to guide viewers to your next video.');
  if (suggestedCTR < 0.1) tips.push('Create content in series format to increase suggested video click-through.');
  if (tips.length === 0) tips.push('Strong session extension value. Maintain current strategy for maximizing watch time.');

  return { score, extensionPotential, tips };
}

/**
 * Analyze comment intelligence: question density, sentiment, content gaps, audience level
 */
export function calculateCommentIntelligence(videoData) {
  const commentCount = videoData.commentCount || 0;
  const viewCount = videoData.viewCount || 0;
  const likeCount = videoData.likeCount || 0;

  // Question density estimation
  const commentToLikeRatio = likeCount > 0 ? commentCount / likeCount : 0;
  const questionDensity = Math.min(Math.round(commentToLikeRatio * 100 * 3), 40);

  // Sentiment score (basic keyword matching placeholder)
  const likeToCommentRatio = commentCount > 0 ? likeCount / commentCount : 0;
  let sentimentScore;
  if (likeToCommentRatio >= 20) sentimentScore = 85;
  else if (likeToCommentRatio >= 15) sentimentScore = 75;
  else if (likeToCommentRatio >= 10) sentimentScore = 65;
  else if (likeToCommentRatio >= 5) sentimentScore = 55;
  else sentimentScore = 40;

  // Content gap signals
  const contentGaps = [];
  if (questionDensity > 15) contentGaps.push('High question density suggests viewers need more detailed explanations or tutorials.');
  if (commentToLikeRatio > 0.08) contentGaps.push('Active comment discussions indicate interest in related subtopics — consider dedicated follow-up content.');
  if (viewCount > 50000 && commentCount < viewCount * 0.002) contentGaps.push('Low comment volume for view count suggests content may lack discussion prompts or controversial angles.');
  if (contentGaps.length === 0) contentGaps.push('Comment engagement is healthy. No major content gaps detected from comment signals.');

  // Audience level estimation
  let audienceLevel;
  if (questionDensity > 20) audienceLevel = 'beginner';
  else if (questionDensity > 8) audienceLevel = 'intermediate';
  else audienceLevel = 'advanced';

  return {
    questionDensity: Math.min(questionDensity, 40),
    sentimentScore,
    contentGaps,
    audienceLevel,
  };
}

// ============================================
// 内部辅助函数
// ============================================

function getDaysSince(dateString) {
  if (!dateString) return 0;
  const published = new Date(dateString);
  const now = new Date();
  return Math.max(Math.floor((now - published) / (1000 * 60 * 60 * 24)), 0);
}

function parseDuration(durationStr) {
  if (!durationStr) return 0;
  // ISO 8601 duration: PT15M30S, PT1H2M3S, PT45S
  const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) {
    // Try simple formats like "15:30" or "15:30:00"
    const parts = durationStr.split(':').map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return 0;
  }
  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;
  return hours * 3600 + minutes * 60 + seconds;
}

function estimateShares(videoData) {
  const viewCount = videoData.viewCount || 0;
  const likeCount = videoData.likeCount || 0;
  const commentCount = videoData.commentCount || 0;
  // Estimate shares as ~0.3% of views for average content, scaled by engagement
  const baseShareRate = 0.003;
  const engagementMultiplier = viewCount > 0 ? 1 + ((likeCount + commentCount) / viewCount) * 10 : 1;
  return Math.round(viewCount * baseShareRate * engagementMultiplier);
}

function getChannelViewCount(channelData) {
  return channelData.viewCount || channelData.totalViewCount || 0;
}

function round1(n) { return Math.round(n * 10) / 10; }
function round2(n) { return Math.round(n * 100) / 100; }
function round4(n) { return Math.round(n * 10000) / 10000; }

function calculatePercentile(value, average) {
  // 简单百分位估算：假设对数正态分布
  if (value <= 0) return 1;
  const ratio = value / Math.max(average, 0.001);
  if (ratio >= 3) return 95;
  if (ratio >= 2) return 85;
  if (ratio >= 1.5) return 75;
  if (ratio >= 1.2) return 65;
  if (ratio >= 0.8) return 50;
  if (ratio >= 0.5) return 30;
  if (ratio >= 0.3) return 15;
  return 5;
}

function getPerformanceRating(value, benchmark) {
  const ratio = value / Math.max(benchmark, 0.001);
  if (ratio >= 2) return 'well_above';
  if (ratio >= 1.3) return 'above';
  if (ratio >= 0.7) return 'average';
  if (ratio >= 0.4) return 'below';
  return 'well_below';
}

function getGrade(score) {
  if (score >= 95) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 75) return 'B+';
  if (score >= 65) return 'B';
  if (score >= 55) return 'C+';
  if (score >= 45) return 'C';
  if (score >= 30) return 'D';
  return 'F';
}

function estimateRetention(duration, views, comments) {
  // 简单留存估算：基于评论率和观看数
  const commentRate = views > 0 ? comments / views : 0;
  let base = 35; // 默认35%留存
  if (commentRate > 0.01) base += 10; // 高评论率暗示高留存
  if (commentRate > 0.005) base += 5;
  return Math.min(base, 65);
}

function calculateEngagementScore({ engagementRate, likeRatio, commentRatio, likeToCommentRatio, benchmark }) {
  let score = 0;

  // 互动率 vs 基准 (0-40分)
  const ratio = engagementRate / Math.max(benchmark.avgEngagementRate, 0.01);
  score += Math.min(40, ratio * 20);

  // 点赞率 vs 基准 (0-25分)
  const likeRatioScore = likeRatio / Math.max(benchmark.avgLikeRatio, 0.01);
  score += Math.min(25, likeRatioScore * 15);

  // 评论率 vs 基准 (0-20分)
  const commentRatioScore = commentRatio / Math.max(benchmark.avgCommentRatio, 0.01);
  score += Math.min(20, commentRatioScore * 12);

  // 点赞评论比 (0-15分)
  if (likeToCommentRatio >= 5 && likeToCommentRatio <= 20) score += 15;
  else if (likeToCommentRatio >= 3 && likeToCommentRatio <= 30) score += 10;
  else score += 5;

  return Math.min(100, Math.max(0, score));
}

function calculateVideoSEOScore(videoData) {
  // 使用SEO分析模块获取综合分
  const seoAnalysis = analyzeVideoSEO(videoData);
  return seoAnalysis.seoScore.overall;
}

function calculateVelocityScore({ dailyViewRate, daysSincePublished, viewCount, benchmark }) {
  const avgDailyBenchmark = benchmark.avgViewsPerVideo / 30;
  const ratio = dailyViewRate / Math.max(avgDailyBenchmark, 1);
  let score = Math.min(100, ratio * 50);

  // 新视频奖励
  if (daysSincePublished <= 3 && viewCount > 1000) score = Math.min(100, score + 20);
  // 旧视频维持
  if (daysSincePublished > 90 && dailyViewRate > avgDailyBenchmark) score = Math.min(100, score + 15);

  return Math.max(0, Math.min(100, score));
}

function calculateGrowthScore({ dailyViewRate, viewsPerSubscriber, subscriberConversionRate, daysSincePublished }) {
  let score = 0;

  // 每日观看量 (0-40)
  if (dailyViewRate > 10000) score += 40;
  else if (dailyViewRate > 1000) score += 30;
  else if (dailyViewRate > 100) score += 20;
  else score += 10;

  // 破圈能力 (0-35)
  if (viewsPerSubscriber > 10) score += 35;
  else if (viewsPerSubscriber > 5) score += 25;
  else if (viewsPerSubscriber > 2) score += 15;
  else score += 5;

  // 订阅转化 (0-25)
  score += Math.min(25, subscriberConversionRate * 0.5);

  return Math.max(0, Math.min(100, score));
}

function formatUploadFrequency(perWeek) {
  if (perWeek >= 7) return `${Math.round(perWeek)} videos/day`;
  if (perWeek >= 1) return `${perWeek.toFixed(1)} videos/week`;
  if (perWeek >= 0.14) return `${Math.round(perWeek * 4)} videos/month`;
  return 'Irregular';
}

function estimateContentMix(avgViews, videoCount, subscribers) {
  const viewsPerSub = subscribers > 0 ? avgViews / subscribers : 0;
  let distribution = 'consistent';
  if (viewsPerSub > 5) distribution = 'hit-driven';
  if (videoCount > 500 && avgViews < 10000) distribution = 'balanced';

  return {
    distribution,
    evergreen: 40,
    trending: 35,
    shorts: 25,
  };
}

function calculateGrowthHealth(growthRate, trajectory) {
  if (trajectory === 'viral') return 95;
  if (trajectory === 'exponential') return 85;
  if (trajectory === 'linear') return 70;
  if (trajectory === 'plateau') return 50;
  return 25;
}

function calculateContentHealth(avgViews, videoCount, consistency) {
  let score = consistency * 0.4;
  if (avgViews > 50000) score += 30;
  else if (avgViews > 10000) score += 20;
  else if (avgViews > 1000) score += 10;
  score += Math.min(30, videoCount * 0.1);
  return Math.min(100, Math.max(0, score));
}

function calculateSubscriberGrowthRate(subscriberCount, daysSinceCreated) {
  // Estimate monthly growth rate from subscriber count and channel age
  if (daysSinceCreated <= 0 || subscriberCount <= 0) return 0;
  const yearsActive = Math.max(daysSinceCreated / 365, 0.05);
  const monthlyRate = Math.log(subscriberCount / 100) / (yearsActive * 12) * 2;
  return Math.max(0, Math.min(monthlyRate * 10, 50));
}

function calculateEngagementHealth(viewsPerSub, subscriberCount) {
  let score = 50;
  if (viewsPerSub > 5) score += 30;
  else if (viewsPerSub > 2) score += 20;
  else if (viewsPerSub > 0.5) score += 10;
  else score -= 10;
  return Math.min(100, Math.max(0, score));
}

function estimateChannelRevenue(subscriberCount, avgViewsPerVideo, videoCount, uploadPerWeek) {
  const monthlyViews = avgViewsPerVideo * uploadPerWeek * 4;
  const cpmLow = 2.0, cpmAvg = 4.5, cpmHigh = 8.0;
  const revenueShare = 0.55;

  return {
    estimatedMonthlyRevenue: {
      low: Math.round(monthlyViews / 1000 * cpmLow * revenueShare),
      avg: Math.round(monthlyViews / 1000 * cpmAvg * revenueShare),
      high: Math.round(monthlyViews / 1000 * cpmHigh * revenueShare),
    },
    estimatedAnnualRevenue: {
      low: Math.round(monthlyViews / 1000 * cpmLow * revenueShare * 12),
      avg: Math.round(monthlyViews / 1000 * cpmAvg * revenueShare * 12),
      high: Math.round(monthlyViews / 1000 * cpmHigh * revenueShare * 12),
    },
    revenuePerVideo: Math.round(avgViewsPerVideo / 1000 * cpmAvg * revenueShare),
    cpmRange: { min: cpmLow, max: cpmHigh },
    revenueGrowthRate: 0,
  };
}

function estimateVideoRevenue(viewCount, category) {
  const benchmark = CATEGORY_BENCHMARKS[category] || CATEGORY_BENCHMARKS['Entertainment'];
  const cpmLow = benchmark.avgCPM * 0.6;
  const cpmAvg = benchmark.avgCPM;
  const cpmHigh = benchmark.avgCPM * 1.8;
  const revenueShare = 0.55;

  return {
    cpmLow: round2(cpmLow),
    cpmAvg: round2(cpmAvg),
    cpmHigh: round2(cpmHigh),
    estimatedRevenueLow: Math.round(viewCount / 1000 * cpmLow * revenueShare),
    estimatedRevenueAvg: Math.round(viewCount / 1000 * cpmAvg * revenueShare),
    estimatedRevenueHigh: Math.round(viewCount / 1000 * cpmHigh * revenueShare),
    currency: 'USD',
    note: 'Estimates based on category CPM averages and YouTube 55% revenue share. Actual earnings vary by audience location, ad types, and season.',
  };
}

function generateVideoRecommendations(videoData, analysis) {
  const recs = [];
  const { engagementRate, velocityTrend, seoScore, benchmark } = analysis;

  if (engagementRate < benchmark.avgEngagementRate * 0.7) {
    recs.push({
      priority: 'high',
      area: 'content',
      issue: `Engagement rate (${engagementRate.toFixed(1)}%) is below category average (${benchmark.avgEngagementRate}%)`,
      suggestion: 'Add a clear call-to-action asking viewers to like and comment. Ask a specific question at the end of your video to drive comments.',
      expectedImpact: 'Could improve engagement rate by 20-40%',
    });
  }

  if (velocityTrend === 'decelerating') {
    recs.push({
      priority: 'high',
      area: 'timing',
      issue: 'View velocity is decelerating — the video is losing momentum',
      suggestion: 'Create a follow-up video, add end screens linking to this video, and update the title/thumbnail to re-engage the algorithm.',
      expectedImpact: 'Can extend video lifespan by 2-4 weeks',
    });
  }

  const title = videoData.title || '';
  if (title.length < 40) {
    recs.push({
      priority: 'medium',
      area: 'title',
      issue: 'Title is too short and may not capture enough search traffic',
      suggestion: 'Expand to 50-60 characters. Include the target keyword, a number, and an emotional trigger word.',
      expectedImpact: 'Could improve CTR by 10-15%',
    });
  }

  if (title.length > 70) {
    recs.push({
      priority: 'medium',
      area: 'title',
      issue: 'Title is too long and may be truncated in search results',
      suggestion: 'Shorten to 50-60 characters. Front-load the most important keywords.',
      expectedImpact: 'Improved visibility in search results',
    });
  }

  if (!/20\d{2}/.test(title)) {
    recs.push({
      priority: 'low',
      area: 'title',
      issue: 'Title does not include the current year',
      suggestion: 'Add "2026" to signal freshness and relevance to both viewers and the algorithm.',
      expectedImpact: 'Could improve CTR by 5-8% for search queries',
    });
  }

  const desc = videoData.description || '';
  if (desc.length < 150) {
    recs.push({
      priority: 'high',
      area: 'description',
      issue: 'Description is too short (under 150 characters)',
      suggestion: 'Write 200-500 characters minimum. Include keywords naturally, add relevant links, and use timestamps.',
      expectedImpact: 'Improved SEO ranking and discoverability',
    });
  }

  if (!/https?:\/\//.test(desc)) {
    recs.push({
      priority: 'medium',
      area: 'description',
      issue: 'Description has no links',
      suggestion: 'Add links to related videos, playlists, your channel, and social media profiles.',
      expectedImpact: 'Improved channel navigation and cross-promotion',
    });
  }

  const tags = videoData.tags || [];
  if (tags.length < 5) {
    recs.push({
      priority: 'medium',
      area: 'tags',
      issue: `Only ${tags.length} tags found — underutilizing tag SEO`,
      suggestion: 'Add 10-15 relevant tags including broad terms, specific phrases, and competitor channel names.',
      expectedImpact: 'Improved discoverability in YouTube search',
    });
  }

  if (seoScore < 60) {
    recs.push({
      priority: 'high',
      area: 'seo',
      issue: `Overall SEO score is ${seoScore}/100 — significant optimization opportunity`,
      suggestion: 'Focus on title keywords, description length, and tag variety. Use our YouTube SEO Tool for detailed analysis.',
      expectedImpact: 'SEO improvements can increase organic views by 30-50%',
    });
  }

  // Ensure at least 1 recommendation
  if (recs.length === 0) {
    recs.push({
      priority: 'low',
      area: 'content',
      issue: 'The video is well-optimized across key metrics',
      suggestion: 'Consider creating a follow-up or series to maintain momentum and capture additional views.',
      expectedImpact: 'Can extend content lifecycle and increase subscriber conversion',
    });
  }

  return recs;
}

function generateVideoSWOT(videoData, analysis) {
  const { engagementRate, engagementPercentile, dailyViewRate, velocityTrend, viewsPerSubscriber, benchmark } = analysis;
  const strengths = [], weaknesses = [], opportunities = [], threats = [];

  if (engagementPercentile >= 75) strengths.push('Above-average engagement rate');
  if (viewsPerSubscriber > 5) strengths.push('Strong content reach beyond subscriber base');
  if (velocityTrend === 'accelerating') strengths.push('Growing view velocity');
  if (videoData.tags && videoData.tags.length > 10) strengths.push('Well-optimized tags');

  if (engagementPercentile < 40) weaknesses.push('Below-average engagement rate');
  if (velocityTrend === 'decelerating') weaknesses.push('Declining view velocity');
  if ((videoData.description || '').length < 150) weaknesses.push('Insufficient video description');
  if (!videoData.tags || videoData.tags.length < 5) weaknesses.push('Insufficient tags for SEO');

  if (engagementRate > benchmark.avgEngagementRate) opportunities.push('Leverage high engagement to push YouTube Shorts');
  if (velocityTrend === 'stable') opportunities.push('Optimize title/thumbnail to accelerate growth');
  opportunities.push('Create a playlist to increase session time');
  opportunities.push('Cross-promote on social media to boost early velocity');

  if (engagementRate < benchmark.avgEngagementRate * 0.5) threats.push('Low engagement may reduce algorithmic recommendations');
  if (velocityTrend === 'decelerating') threats.push('Declining velocity signals content lifecycle is ending');

  return { strengths, weaknesses, opportunities, threats };
}

function generateChannelSWOT(data) {
  const { subscriberCount, avgViewsPerVideo, viewsPerSubscriber, uploadFrequencyPerWeek, growthTrajectory, subscriberGrowthRate, yearsSinceCreated } = data;
  const strengths = [], weaknesses = [], opportunities = [], threats = [];

  if (subscriberCount > 100000) strengths.push('Established audience base');
  if (growthTrajectory === 'viral' || growthTrajectory === 'exponential') strengths.push('Strong growth momentum');
  if (avgViewsPerVideo > 50000) strengths.push('High average views per video');
  if (uploadFrequencyPerWeek >= 2) strengths.push('Consistent upload schedule');

  if (growthTrajectory === 'declining') weaknesses.push('Declining subscriber growth');
  if (viewsPerSubscriber < 1) weaknesses.push('Low views per subscriber ratio');
  if (uploadFrequencyPerWeek < 1) weaknesses.push('Infrequent uploads');
  if (avgViewsPerVideo < 5000) weaknesses.push('Low average views per video');

  opportunities.push('Expand to YouTube Shorts for additional discovery');
  opportunities.push('Collaborate with similar-sized channels');
  if (yearsSinceCreated > 2) opportunities.push('Revamp older successful content with updated information');

  if (growthTrajectory === 'plateau') threats.push('Channel may be hitting a ceiling in current niche');
  threats.push('Increasing competition in the content space');

  return { strengths, weaknesses, opportunities, threats };
}

function generateGrowthPlan(data) {
  const { subscriberCount, subscriberGrowthRate, avgViewsPerVideo, uploadFrequencyPerWeek, growthTrajectory } = data;
  const plan = [];

  plan.push({
    timeframe: '1_week',
    actions: [
      'Audit your last 5 videos: identify what worked and what did not',
      'Set up a consistent posting schedule (minimum 2-3 videos/week)',
      'Create 3 YouTube Shorts from your best-performing content',
      'Research 5 trending topics in your niche using Tubefission Trends',
    ],
    expectedOutcome: 'Establish foundation for systematic growth',
    difficulty: 'easy',
  });

  plan.push({
    timeframe: '1_month',
    actions: [
      'Optimize all video titles, descriptions, and tags using SEO scoring',
      'Build a content calendar aligned with upcoming trends and events',
      'Launch a collaboration with 1-2 creators in your niche',
      'Create 1-2 pillar/evergreen videos targeting high-volume keywords',
      'A/B test different thumbnail styles to improve CTR',
    ],
    expectedOutcome: `${Math.round(subscriberGrowthRate * 1.2)}% monthly subscriber growth`,
    difficulty: 'medium',
  });

  plan.push({
    timeframe: '3_months',
    actions: [
      'Build a playlist strategy for increased session time',
      'Develop a signature content format or series',
      'Expand into 1 adjacent sub-niche to broaden audience',
      'Implement end screens and cards on all videos systematically',
      'Cross-promote on 2+ social media platforms',
    ],
    expectedOutcome: `${Math.round(subscriberCount * Math.pow(1 + subscriberGrowthRate / 100, 3)).toLocaleString()} projected subscribers`,
    difficulty: 'medium',
  });

  plan.push({
    timeframe: '6_months',
    actions: [
      'Launch a community post strategy for audience engagement',
      'Explore brand partnership opportunities',
      'Diversify into 2+ content formats (long-form, Shorts, live)',
      'Build an email list or Discord community for direct audience access',
      'Review and reinvest in top-performing content categories',
    ],
    expectedOutcome: `${Math.round(subscriberCount * Math.pow(1 + subscriberGrowthRate / 100, 6)).toLocaleString()} projected subscribers`,
    difficulty: 'hard',
  });

  return plan;
}

function estimateAgeGroup(subscriberCount) {
  if (subscriberCount > 1000000) return '18-34 (primary)';
  if (subscriberCount > 100000) return '18-44 (broad)';
  return '16-35 (estimated)';
}

function estimateGender(subscriberCount) {
  return '55-65% male, 35-45% female (industry average)';
}

function findPowerWords(title) {
  const words = title.split(/\s+/);
  const power = ['best', 'worst', 'amazing', 'secret', 'shocking', 'ultimate', 'proven', 'free', 'easy', 'how', 'top', 'insane', 'epic', 'never', 'always', 'guaranteed', 'exclusive', 'powerful', 'stunning'];
  return words.filter(w => power.includes(w.toLowerCase()));
}

function generateRecommendedTitle(original, keyword) {
  if (!keyword) return original;
  if (original.toLowerCase().includes(keyword.toLowerCase())) return original;
  return `${keyword} — ${original}`;
}

function generateTagSuggestions(title, category) {
  const base = title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const categoryTags = {
    Gaming: ['gaming', 'gameplay', 'gamer', 'playthrough', 'lets play', 'gaming highlights'],
    Music: ['music', 'song', 'official video', 'music video', 'live performance'],
    Education: ['tutorial', 'how to', 'learn', 'explained', 'guide', 'tips'],
    Entertainment: ['funny', 'entertainment', 'comedy', 'viral', 'fun'],
  };
  const catTags = categoryTags[category] || categoryTags['Entertainment'];
  return [...base.slice(0, 5), ...catTags];
}

function getTitleIssues(analysis) {
  const issues = [];
  if (analysis.length === 'too_short') issues.push('Title is too short (under 40 characters)');
  if (analysis.length === 'too_long') issues.push('Title is too long (over 70 characters)');
  if (!analysis.hasKeyword) issues.push('Target keyword not found in title');
  if (!analysis.hasNumber) issues.push('No number in title (numbers boost CTR)');
  if (!analysis.emotionalTrigger) issues.push('No emotional trigger word');
  return issues;
}

function getTitleSuggestions(analysis, keyword) {
  const suggestions = [];
  if (analysis.length !== 'optimal') suggestions.push(`Adjust title length to 50-60 characters`);
  if (!analysis.hasNumber) suggestions.push('Add a number (e.g., "7 Ways", "Top 10", "5 Tips")');
  if (!analysis.hasEmoji) suggestions.push('Add an emoji for visual appeal in search results');
  if (!analysis.hasYear) suggestions.push('Add "2026" to signal fresh content');
  if (!analysis.emotionalTrigger) suggestions.push('Use power words: "Best", "Ultimate", "Secret", "Never"');
  if (keyword && !analysis.hasKeyword) suggestions.push(`Include "${keyword}" in the title`);
  return suggestions;
}

function getDescIssues(analysis) {
  const issues = [];
  if (analysis.length === 'too_short') issues.push('Description too short (under 150 characters)');
  if (analysis.length === 'too_long') issues.push('Description too long (over 5000 characters)');
  if (!analysis.hasLinks) issues.push('No links in description');
  if (!analysis.hasTimestamps) issues.push('No timestamps — timestamps improve SEO and user experience');
  if (!analysis.hasHashtags) issues.push('No hashtags — first 3 hashtags appear above title');
  return issues;
}

function getDescSuggestions(analysis, keyword) {
  const suggestions = [];
  if (analysis.length === 'too_short') suggestions.push('Write at least 200 characters with keywords included');
  if (!analysis.hasLinks) suggestions.push('Add links to related videos, playlists, and social media');
  if (!analysis.hasTimestamps) suggestions.push('Add timestamps for key sections (0:00, 1:30, etc.)');
  if (!analysis.hasHashtags) suggestions.push('Add 3-5 relevant hashtags at the end of the description');
  if (keyword) suggestions.push(`Mention "${keyword}" 2-3 times naturally in the description`);
  return suggestions;
}

function getTagIssues(analysis) {
  const issues = [];
  if (analysis.count === 'too_few') issues.push('Too few tags (under 5)');
  if (analysis.count === 'too_many') issues.push('Too many tags (over 30) — focus on most relevant');
  if (!analysis.hasBroadTags) issues.push('No broad/discovery tags');
  if (!analysis.hasLongTailTags) issues.push('No long-tail phrase tags');
  return issues;
}
