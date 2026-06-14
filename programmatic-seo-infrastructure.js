/**
 * Tubefission Programmatic SEO Infrastructure
 * 
 * 程序化SEO动态路由和架构设计
 * 支持大规模页面生成和自动索引
 */

// ============================================
// 1. 动态路由配置
// ============================================

/**
 * 支持的动态路由类型
 */
export const DYNAMIC_ROUTES = {
  // 国家趋势页面
  TRENDS_COUNTRY: {
    pattern: '/trends/[country]',
    params: ['country'],
    countries: ['us', 'jp', 'kr', 'gb', 'hk', 'tw', 'ca', 'au', 'de', 'fr', 'in', 'br'],
    generateStaticParams: true,
    revalidate: 3600 // 每小时重新验证
  },
  
  // 视频分析页面
  VIDEO_ANALYSIS: {
    pattern: '/video/[videoId]',
    params: ['videoId'],
    generateStaticParams: false, // 按需生成
    revalidate: 86400 // 每天重新验证
  },
  
  // 频道分析页面
  CHANNEL_ANALYSIS: {
    pattern: '/channel/[channelId]',
    params: ['channelId'],
    generateStaticParams: false,
    revalidate: 86400
  },
  
  // 话题/关键词页面
  TOPIC: {
    pattern: '/topic/[keyword]',
    params: ['keyword'],
    keywords: [], // 从数据库动态加载
    generateStaticParams: true,
    revalidate: 43200 // 每12小时
  },
  
  // 分类页面
  CATEGORY: {
    pattern: '/category/[category]',
    params: ['category'],
    categories: ['gaming', 'music', 'entertainment', 'education', 'tech', 'beauty', 'fitness', 'cooking', 'travel', 'finance'],
    generateStaticParams: true,
    revalidate: 86400
  },
  
  // 趋势日期归档
  TRENDING_DATE: {
    pattern: '/trending/[country]/[date]',
    params: ['country', 'date'],
    generateStaticParams: false,
    revalidate: 604800 // 每周（历史数据不变）
  }
};

// ============================================
// 2. 数据获取函数
// ============================================

/**
 * 获取国家趋势数据
 * @param {string} country - 国家代码
 * @returns {Promise<Object>} 趋势数据
 */
export async function getTrendsByCountry(country) {
  // 这里应该调用实际的API
  // 示例实现：
  const response = await fetch(`https://api.tubefission.com/trends/${country}`);
  const data = await response.json();
  
  return {
    country,
    countryName: getCountryName(country),
    trends: data.trends || [],
    lastUpdated: new Date().toISOString(),
    totalVideos: data.totalVideos || 0,
    topCategories: data.categories || []
  };
}

/**
 * 获取视频分析数据
 * @param {string} videoId - YouTube视频ID
 * @returns {Promise<Object>} 视频分析数据
 */
export async function getVideoAnalysis(videoId) {
  const response = await fetch(`https://api.tubefission.com/video/${videoId}`);
  const data = await response.json();
  
  return {
    videoId,
    title: data.title,
    description: data.description,
    thumbnail: data.thumbnail,
    channelId: data.channelId,
    channelTitle: data.channelTitle,
    publishedAt: data.publishedAt,
    viewCount: data.viewCount,
    likeCount: data.likeCount,
    commentCount: data.commentCount,
    duration: data.duration,
    tags: data.tags || [],
    category: data.category,
    analytics: {
      velocity: data.velocity,
      engagement: data.engagement,
      performance: data.performance
    }
  };
}

/**
 * 获取频道分析数据
 * @param {string} channelId - YouTube频道ID
 * @returns {Promise<Object>} 频道分析数据
 */
export async function getChannelAnalysis(channelId) {
  const response = await fetch(`https://api.tubefission.com/channel/${channelId}`);
  const data = await response.json();
  
  return {
    channelId,
    title: data.title,
    description: data.description,
    thumbnail: data.thumbnail,
    subscriberCount: data.subscriberCount,
    videoCount: data.videoCount,
    viewCount: data.viewCount,
    publishedAt: data.publishedAt,
    country: data.country,
    analytics: {
      growth: data.growth,
      engagement: data.engagement,
      topVideos: data.topVideos || []
    }
  };
}

/**
 * 获取话题数据
 * @param {string} keyword - 关键词
 * @returns {Promise<Object>} 话题数据
 */
export async function getTopicData(keyword) {
  const response = await fetch(`https://api.tubefission.com/topic/${encodeURIComponent(keyword)}`);
  const data = await response.json();
  
  return {
    keyword,
    searchVolume: data.searchVolume,
    competition: data.competition,
    trend: data.trend,
    relatedKeywords: data.relatedKeywords || [],
    topVideos: data.topVideos || [],
    opportunity: data.opportunity,
    difficulty: data.difficulty
  };
}

// ============================================
// 3. SEO元数据生成
// ============================================

/**
 * 生成趋势国家页面的SEO元数据
 */
export function generateTrendsCountrySEO(country, trendsData) {
  const countryName = getCountryName(country);
  const topTrend = trendsData.trends?.[0];
  
  return {
    title: `Trending YouTube Videos in ${countryName} | Real-Time Viral Content`,
    description: `Discover what's trending on YouTube in ${countryName} right now. Track viral videos, view velocity, and engagement metrics. Updated hourly with real data.`,
    keywords: [
      `trending youtube ${country}`,
      `viral videos ${country}`,
      `youtube trends ${country}`,
      `popular videos ${country}`,
      `youtube ${country} today`
    ],
    openGraph: {
      title: `Trending YouTube Videos in ${countryName}`,
      description: `Discover viral content trending in ${countryName} right now.`,
      images: [{
        url: topTrend?.thumbnail || `https://tubefission.com/og-trends-${country}.png`,
        width: 1200,
        height: 630
      }]
    }
  };
}

/**
 * 生成视频分析页面的SEO元数据
 */
export function generateVideoSEO(videoData) {
  return {
    title: `${videoData.title} - Video Analytics | Tubefission`,
    description: `Analyze "${videoData.title}" by ${videoData.channelTitle}. ${formatNumber(videoData.viewCount)} views, ${videoData.engagement}% engagement. Free YouTube video analysis.`,
    keywords: [
      videoData.title.toLowerCase(),
      `${videoData.channelTitle} analytics`,
      'youtube video analysis',
      'video performance metrics',
      'engagement rate calculator'
    ],
    openGraph: {
      title: videoData.title,
      description: `Analytics for ${videoData.title} by ${videoData.channelTitle}`,
      type: 'video.other',
      images: [{
        url: videoData.thumbnail,
        width: 1200,
        height: 630
      }]
    }
  };
}

/**
 * 生成频道分析页面的SEO元数据
 */
export function generateChannelSEO(channelData) {
  return {
    title: `${channelData.title} - Channel Analytics | Tubefission`,
    description: `Analyze ${channelData.title} YouTube channel. ${formatNumber(channelData.subscriberCount)} subscribers, ${formatNumber(channelData.videoCount)} videos. Free competitor analysis.`,
    keywords: [
      `${channelData.title} youtube`,
      `${channelData.title} analytics`,
      'youtube channel analysis',
      'competitor research',
      'channel growth metrics'
    ],
    openGraph: {
      title: `${channelData.title} - YouTube Channel Analytics`,
      description: `Deep analytics for ${channelData.title} YouTube channel`,
      images: [{
        url: channelData.thumbnail,
        width: 1200,
        height: 630
      }]
    }
  };
}

/**
 * 生成话题页面的SEO元数据
 */
export function generateTopicSEO(keyword, topicData) {
  return {
    title: `${keyword} - YouTube Trend Analysis | Tubefission`,
    description: `Explore "${keyword}" trends on YouTube. Search volume: ${topicData.searchVolume}, Competition: ${topicData.competition}. Discover content opportunities and top-performing videos.`,
    keywords: [
      keyword,
      `${keyword} youtube`,
      `${keyword} trends`,
      'youtube keyword research',
      'content ideas'
    ],
    openGraph: {
      title: `${keyword} - YouTube Topic Analysis`,
      description: `Trend analysis and content opportunities for "${keyword}"`,
      images: [{
        url: `https://tubefission.com/og-topic-${encodeURIComponent(keyword)}.png`,
        width: 1200,
        height: 630
      }]
    }
  };
}

// ============================================
// 4. 结构化数据生成
// ============================================

/**
 * 生成视频分析页面的结构化数据
 */
export function generateVideoSchema(videoData) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": videoData.title,
    "description": videoData.description,
    "thumbnailUrl": videoData.thumbnail,
    "uploadDate": videoData.publishedAt,
    "duration": videoData.duration,
    "interactionStatistic": [
      {
        "@type": "InteractionCounter",
        "interactionType": { "@type": "WatchAction" },
        "userInteractionCount": videoData.viewCount
      },
      {
        "@type": "InteractionCounter",
        "interactionType": { "@type": "LikeAction" },
        "userInteractionCount": videoData.likeCount
      }
    ],
    "author": {
      "@type": "Organization",
      "name": videoData.channelTitle,
      "url": `https://youtube.com/channel/${videoData.channelId}`
    },
    "publisher": {
      "@type": "Organization",
      "name": "Tubefission",
      "logo": {
        "@type": "ImageObject",
        "url": "https://tubefission.com/logo.png"
      }
    }
  };
}

/**
 * 生成趋势列表的结构化数据
 */
export function generateTrendsListSchema(trends, country) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Trending YouTube Videos in ${getCountryName(country)}`,
    "itemListElement": trends.slice(0, 10).map((trend, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "VideoObject",
        "name": trend.title,
        "url": `https://tubefission.com/video/${trend.videoId}`,
        "thumbnail": trend.thumbnail,
        "interactionStatistic": {
          "@type": "InteractionCounter",
          "interactionType": { "@type": "WatchAction" },
          "userInteractionCount": trend.viewCount
        }
      }
    }))
  };
}

/**
 * 生成面包屑导航结构化数据
 */
export function generateBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://tubefission.com${item.path}`
    }))
  };
}

// ============================================
// 5. 辅助函数
// ============================================

/**
 * 获取国家名称
 */
function getCountryName(code) {
  const countries = {
    us: 'United States',
    jp: 'Japan',
    kr: 'South Korea',
    gb: 'United Kingdom',
    hk: 'Hong Kong',
    tw: 'Taiwan',
    ca: 'Canada',
    au: 'Australia',
    de: 'Germany',
    fr: 'France',
    in: 'India',
    br: 'Brazil'
  };
  return countries[code.toLowerCase()] || code.toUpperCase();
}

/**
 * 格式化数字
 */
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * 生成URL友好的slug
 */
export function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * 从slug还原文本
 */
export function slugToText(slug) {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

// ============================================
// 6. Next.js页面配置
// ============================================

/**
 * 趋势国家页面的Next.js配置
 */
export const trendsCountryConfig = {
  // 生成静态参数
  generateStaticParams: async () => {
    return DYNAMIC_ROUTES.TRENDS_COUNTRY.countries.map(country => ({
      country
    }));
  },
  
  // 重新验证时间
  revalidate: DYNAMIC_ROUTES.TRENDS_COUNTRY.revalidate,
  
  // 动态元数据
  generateMetadata: async ({ params }) => {
    const data = await getTrendsByCountry(params.country);
    const seo = generateTrendsCountrySEO(params.country, data);
    return seo;
  }
};

/**
 * 视频分析页面的Next.js配置
 */
export const videoAnalysisConfig = {
  // 按需生成，不预渲染
  generateStaticParams: async () => {
    // 返回热门视频ID用于预渲染
    const popularVideos = await fetch('https://api.tubefission.com/popular-videos?limit=100');
    return popularVideos.map(video => ({ videoId: video.id }));
  },
  
  revalidate: DYNAMIC_ROUTES.VIDEO_ANALYSIS.revalidate,
  
  generateMetadata: async ({ params }) => {
    const data = await getVideoAnalysis(params.videoId);
    return generateVideoSEO(data);
  }
};

/**
 * 频道分析页面的Next.js配置
 */
export const channelAnalysisConfig = {
  generateStaticParams: async () => {
    // 返回热门频道ID用于预渲染
    const popularChannels = await fetch('https://api.tubefission.com/popular-channels?limit=50');
    return popularChannels.map(channel => ({ channelId: channel.id }));
  },
  
  revalidate: DYNAMIC_ROUTES.CHANNEL_ANALYSIS.revalidate,
  
  generateMetadata: async ({ params }) => {
    const data = await getChannelAnalysis(params.channelId);
    return generateChannelSEO(data);
  }
};

// ============================================
// 7. Sitemap生成
// ============================================

/**
 * 生成动态页面URL列表
 */
export async function generateDynamicSitemapUrls() {
  const urls = [];
  
  // 趋势国家页面
  for (const country of DYNAMIC_ROUTES.TRENDS_COUNTRY.countries) {
    urls.push({
      url: `/trends/${country}`,
      changefreq: 'hourly',
      priority: 0.9,
      lastmod: new Date().toISOString()
    });
  }
  
  // 分类页面
  for (const category of DYNAMIC_ROUTES.CATEGORY.categories) {
    urls.push({
      url: `/category/${category}`,
      changefreq: 'daily',
      priority: 0.8
    });
  }
  
  // 热门视频页面（从API获取）
  const popularVideos = await fetch('https://api.tubefission.com/popular-videos?limit=1000');
  for (const video of popularVideos) {
    urls.push({
      url: `/video/${video.id}`,
      changefreq: 'daily',
      priority: 0.7,
      lastmod: video.lastAnalyzed
    });
  }
  
  // 热门频道页面
  const popularChannels = await fetch('https://api.tubefission.com/popular-channels?limit=500');
  for (const channel of popularChannels) {
    urls.push({
      url: `/channel/${channel.id}`,
      changefreq: 'daily',
      priority: 0.7,
      lastmod: channel.lastAnalyzed
    });
  }
  
  return urls;
}

// ============================================
// 8. 导出
// ============================================

export default {
  routes: DYNAMIC_ROUTES,
  data: {
    getTrendsByCountry,
    getVideoAnalysis,
    getChannelAnalysis,
    getTopicData
  },
  seo: {
    generateTrendsCountrySEO,
    generateVideoSEO,
    generateChannelSEO,
    generateTopicSEO
  },
  schema: {
    generateVideoSchema,
    generateTrendsListSchema,
    generateBreadcrumbSchema
  },
  config: {
    trendsCountry: trendsCountryConfig,
    videoAnalysis: videoAnalysisConfig,
    channelAnalysis: channelAnalysisConfig
  },
  sitemap: {
    generateDynamicSitemapUrls
  },
  utils: {
    generateSlug,
    slugToText
  }
};
