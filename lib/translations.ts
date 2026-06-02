/* =========================================================
   TRANSLATION SYSTEM
   English by default, Chinese only for HK/TW regions
========================================================= */

import { Region } from './region'

// Translation keys for all UI text
type TranslationKey =
  // Navigation & Common
  | 'nav.home' | 'nav.trends' | 'nav.trending' | 'nav.shorts' | 'nav.aiAssistant' | 'nav.watchlist' | 'nav.alerts'
  // Hero Section
  | 'hero.title' | 'hero.subtitle' | 'hero.inputPlaceholder' | 'hero.analyzeButton' | 'hero.trendingNow'
  // Video Analysis
  | 'video.aiScore' | 'video.views' | 'video.likes' | 'video.comments' | 'video.published'
  | 'video.velocity' | 'video.engagement' | 'video.competition' | 'video.opportunity'
  | 'video.backToTrends' | 'video.channelAnalysis' | 'video.relatedVideos'
  // Channel Analysis
  | 'channel.subscribers' | 'channel.videoCount' | 'channel.viewCount' | 'channel.joined'
  | 'channel.description' | 'channel.recentVideos' | 'channel.growthTrend'
  // Deep Analytics
  | 'analytics.contentLifecycle' | 'analytics.commentAnalysis' | 'analytics.trendEvolution'
  | 'analytics.creatorEcosystem' | 'analytics.topicPrediction' | 'analytics.smartRecommendations'
  // Content Lifecycle
  | 'lifecycle.day1' | 'lifecycle.week1' | 'lifecycle.month1' | 'lifecycle.stable'
  | 'lifecycle.potential.viral' | 'lifecycle.potential.growing' | 'lifecycle.potential.steady'
  | 'lifecycle.dayViews' | 'lifecycle.weekViews' | 'lifecycle.monthViews' | 'lifecycle.stableEstimate'
  // Comment Analysis
  | 'comments.hotWords' | 'comments.sentiment.positive' | 'comments.sentiment.neutral' | 'comments.sentiment.negative'
  | 'comments.insights' | 'comments.userFeedback'
  // AI Recommendations
  | 'recommendations.title' | 'recommendations.basedOn' | 'recommendations.tip'
  // Common UI
  | 'ui.loading' | 'ui.error' | 'ui.retry' | 'ui.save' | 'ui.share' | 'ui.copy' | 'ui.close'
  | 'ui.seeMore' | 'ui.seeLess' | 'ui.learnMore' | 'ui.getStarted'
  // Footer
  | 'footer.product' | 'footer.resources' | 'footer.company'
  // Auth
  | 'auth.login' | 'auth.signup' | 'auth.logout' | 'auth.email' | 'auth.password'
  | 'auth.forgotPassword' | 'auth.verifyEmail'

const TRANSLATIONS: Record<TranslationKey, { en: string; zh: string }> = {
  // Navigation
  'nav.home': { en: 'Home', zh: '首页' },
  'nav.trends': { en: 'Trends', zh: '趋势' },
  'nav.trending': { en: 'Trending', zh: '热门' },
  'nav.shorts': { en: 'Shorts', zh: '短视频' },
  'nav.aiAssistant': { en: 'AI Assistant', zh: 'AI 助手' },
  'nav.watchlist': { en: 'Watchlist', zh: '关注列表' },
  'nav.alerts': { en: 'Alerts', zh: '提醒' },

  // Hero
  'hero.title': { en: 'YouTube AI Analytics & Trend Intelligence', zh: 'YouTube AI 分析与趋势情报' },
  'hero.subtitle': { en: 'Analyze channels, discover viral trends, and get data-driven content insights.', zh: '分析频道，发现病毒式趋势，获取数据驱动的内容洞察。' },
  'hero.inputPlaceholder': { en: 'Paste YouTube video or channel URL...', zh: '粘贴 YouTube 视频或频道链接...' },
  'hero.analyzeButton': { en: 'Analyze Now', zh: '立即分析' },
  'hero.trendingNow': { en: 'Trending Now', zh: '当前热门' },

  // Video Analysis
  'video.aiScore': { en: 'AI Score', zh: 'AI 评分' },
  'video.views': { en: 'Views', zh: '播放量' },
  'video.likes': { en: 'Likes', zh: '点赞' },
  'video.comments': { en: 'Comments', zh: '评论' },
  'video.published': { en: 'Published', zh: '发布于' },
  'video.velocity': { en: 'Velocity', zh: '增速' },
  'video.engagement': { en: 'Engagement', zh: '互动率' },
  'video.competition': { en: 'Competition', zh: '竞争度' },
  'video.opportunity': { en: 'Opportunity', zh: '机会值' },
  'video.backToTrends': { en: 'Back to Trends', zh: '返回热门' },
  'video.channelAnalysis': { en: 'Channel Analysis', zh: '频道分析' },
  'video.relatedVideos': { en: 'Related Videos', zh: '相关视频' },

  // Channel
  'channel.subscribers': { en: 'Subscribers', zh: '订阅者' },
  'channel.videoCount': { en: 'Videos', zh: '视频数' },
  'channel.viewCount': { en: 'Total Views', zh: '总播放量' },
  'channel.joined': { en: 'Joined', zh: '加入时间' },
  'channel.description': { en: 'Description', zh: '简介' },
  'channel.recentVideos': { en: 'Recent Videos', zh: '最近视频' },
  'channel.growthTrend': { en: 'Growth Trend', zh: '增长趋势' },

  // Deep Analytics
  'analytics.contentLifecycle': { en: 'Content Lifecycle Analysis', zh: '内容生命周期分析' },
  'analytics.commentAnalysis': { en: 'Comment Analysis', zh: '评论分析' },
  'analytics.trendEvolution': { en: 'Trend Evolution', zh: '趋势演化' },
  'analytics.creatorEcosystem': { en: 'Creator Ecosystem', zh: '创作者生态' },
  'analytics.topicPrediction': { en: 'Topic Prediction', zh: '话题预测' },
  'analytics.smartRecommendations': { en: 'AI Recommendations', zh: 'AI 推荐' },

  // Lifecycle
  'lifecycle.day1': { en: 'Day 1', zh: '首日' },
  'lifecycle.week1': { en: 'Week 1', zh: '首周' },
  'lifecycle.month1': { en: 'Month 1', zh: '首月' },
  'lifecycle.stable': { en: 'Stable', zh: '稳定期' },
  'lifecycle.potential.viral': { en: 'Viral Potential', zh: '潜力爆款' },
  'lifecycle.potential.growing': { en: 'Growing', zh: '持续增长' },
  'lifecycle.potential.steady': { en: 'Steady', zh: '稳定表现' },
  'lifecycle.dayViews': { en: 'Day 1 Views', zh: '首日播放量' },
  'lifecycle.weekViews': { en: 'Week 1 Total', zh: '首周累计' },
  'lifecycle.monthViews': { en: 'Month 1 Total', zh: '首月累计' },
  'lifecycle.stableEstimate': { en: 'Stable Estimate', zh: '稳定期预估' },

  // Comments
  'comments.hotWords': { en: 'Hot Words', zh: '高频词' },
  'comments.sentiment.positive': { en: 'Positive', zh: '正面' },
  'comments.sentiment.neutral': { en: 'Neutral', zh: '中性' },
  'comments.sentiment.negative': { en: 'Negative', zh: '负面' },
  'comments.insights': { en: 'Insights', zh: '洞察' },
  'comments.userFeedback': { en: 'User Feedback', zh: '用户反馈' },

  // Recommendations
  'recommendations.title': { en: 'AI Recommendations', zh: 'AI 推荐学习' },
  'recommendations.basedOn': { en: 'Based on content similarity', zh: '基于内容相似度分析' },
  'recommendations.tip': { en: 'Analyze these high-scoring videos to improve your content strategy.', zh: '分析这些高评分视频的成功要素，优化你的创作策略。' },

  // Common UI
  'ui.loading': { en: 'Loading...', zh: '加载中...' },
  'ui.error': { en: 'Error', zh: '错误' },
  'ui.retry': { en: 'Retry', zh: '重试' },
  'ui.save': { en: 'Save', zh: '保存' },
  'ui.share': { en: 'Share', zh: '分享' },
  'ui.copy': { en: 'Copy', zh: '复制' },
  'ui.close': { en: 'Close', zh: '关闭' },
  'ui.seeMore': { en: 'See More', zh: '查看更多' },
  'ui.seeLess': { en: 'See Less', zh: '收起' },
  'ui.learnMore': { en: 'Learn More', zh: '了解更多' },
  'ui.getStarted': { en: 'Get Started', zh: '开始使用' },

  // Footer
  'footer.product': { en: 'Product', zh: '产品' },
  'footer.resources': { en: 'Resources', zh: '资源' },
  'footer.company': { en: 'Company', zh: '公司' },

  // Auth
  'auth.login': { en: 'Log In', zh: '登录' },
  'auth.signup': { en: 'Sign Up', zh: '注册' },
  'auth.logout': { en: 'Log Out', zh: '退出' },
  'auth.email': { en: 'Email', zh: '邮箱' },
  'auth.password': { en: 'Password', zh: '密码' },
  'auth.forgotPassword': { en: 'Forgot Password?', zh: '忘记密码？' },
  'auth.verifyEmail': { en: 'Verify Email', zh: '验证邮箱' },
}

// Get translation based on region
export function getTranslation(region: Region, key: TranslationKey): string {
  // Only HK and TW get Chinese, all others get English
  const lang = region === 'HK' || region === 'TW' ? 'zh' : 'en'
  return TRANSLATIONS[key]?.[lang] || TRANSLATIONS[key]?.en || key
}

// Hook-friendly version (for use in components)
export function useTranslation(region: Region) {
  return {
    t: (key: TranslationKey) => getTranslation(region, key),
    region,
    isChinese: region === 'HK' || region === 'TW',
  }
}

export type { TranslationKey }
