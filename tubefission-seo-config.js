/**
 * Tubefission SEO Technical Fixes
 * 
 * 这个文件包含所有技术SEO修复的代码实现
 * 1. 结构化数据组件
 * 2. SEO元标签组件
 * 3. 图片优化组件
 * 4. Hreflang支持
 */

// ============================================
// 1. 结构化数据 (Schema.org)
// ============================================

/**
 * SoftwareApplication Schema
 * 用于标记主应用
 */
export const SoftwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Tubefission",
  "applicationCategory": "AnalyticsApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "1250"
  },
  "description": "Free AI-powered YouTube analytics platform for competitor research and viral trend discovery",
  "featureList": [
    "YouTube Channel Analytics",
    "Competitor Analysis",
    "Trend Discovery",
    "Video Performance Analysis",
    "Niche Finder",
    "Opportunity Detection"
  ],
  "softwareVersion": "2.0",
  "url": "https://tubefission.com",
  "screenshot": "https://tubefission.com/screenshot.png",
  "author": {
    "@type": "Organization",
    "name": "Tubefission"
  }
};

/**
 * WebSite Schema
 * 用于网站整体标记
 */
export const WebSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Tubefission - YouTube AI Analytics Platform",
  "url": "https://tubefission.com",
  "description": "Free AI-powered YouTube analytics, competitor research, and viral trend discovery platform",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://tubefission.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "inLanguage": [
    "en-US",
    "ja-JP",
    "ko-KR",
    "en-GB",
    "zh-HK",
    "zh-TW"
  ]
};

/**
 * Organization Schema
 * 用于公司/品牌标记
 */
export const OrganizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Tubefission",
  "alternateName": "Tubefission Analytics",
  "url": "https://tubefission.com",
  "logo": "https://tubefission.com/logo.png",
  "sameAs": [
    "https://twitter.com/tubefission",
    "https://github.com/tubefission"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "email": "support@tubefission.com"
  }
};

/**
 * VideoObject Schema
 * 用于视频分析页面
 */
export const VideoObjectSchema = (videoData) => ({
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
    "name": videoData.channelTitle
  }
});

/**
 * FAQPage Schema
 * 用于FAQ部分
 */
export const FAQPageSchema = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

/**
 * BreadcrumbList Schema
 * 用于面包屑导航
 */
export const BreadcrumbListSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

/**
 * ItemList Schema
 * 用于趋势列表
 */
export const ItemListSchema = (items, listName) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": listName,
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "item": {
      "@type": "VideoObject",
      "name": item.title,
      "url": item.url,
      "description": item.description
    }
  }))
});

// ============================================
// 2. SEO元标签配置
// ============================================

/**
 * 默认SEO配置
 */
export const defaultSEO = {
  titleTemplate: "%s | Tubefission - Free YouTube Analytics Tool",
  defaultTitle: "Tubefission - Free YouTube Analytics & Trend Intelligence Platform",
  description: "Free AI-powered YouTube analytics tool. Analyze any channel, discover viral trends, and get competitor insights without login. Real-time data from 6 countries.",
  canonical: "https://tubefission.com",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tubefission.com",
    siteName: "Tubefission",
    images: [
      {
        url: "https://tubefission.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tubefission - YouTube Analytics Platform"
      }
    ]
  },
  twitter: {
    handle: "@tubefission",
    site: "@tubefission",
    cardType: "summary_large_image"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  additionalMetaTags: [
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1, maximum-scale=5"
    },
    {
      name: "theme-color",
      content: "#6366f1"
    },
    {
      name: "msapplication-TileColor",
      content: "#6366f1"
    },
    {
      name: "apple-mobile-web-app-capable",
      content: "yes"
    },
    {
      name: "apple-mobile-web-app-status-bar-style",
      content: "black-translucent"
    }
  ]
};

/**
 * Hreflang配置
 * 支持6个国家/地区
 */
export const hreflangConfig = [
  { lang: "en-US", url: "https://tubefission.com" },
  { lang: "ja-JP", url: "https://tubefission.com/ja" },
  { lang: "ko-KR", url: "https://tubefission.com/ko" },
  { lang: "en-GB", url: "https://tubefission.com/gb" },
  { lang: "zh-HK", url: "https://tubefission.com/hk" },
  { lang: "zh-TW", url: "https://tubefission.com/tw" },
  { lang: "x-default", url: "https://tubefission.com" }
];

/**
 * 生成Hreflang标签
 */
export const generateHreflangTags = (path = "") => {
  return hreflangConfig.map(({ lang, url }) => ({
    rel: "alternate",
    hrefLang: lang,
    href: `${url}${path}`
  }));
};

// ============================================
// 3. 页面特定SEO配置
// ============================================

/**
 * 首页SEO配置
 */
export const homePageSEO = {
  ...defaultSEO,
  title: "Free YouTube Analytics Tool | AI-Powered Video & Channel Insights",
  description: "Free YouTube analytics tool with AI-powered insights. Analyze any channel, discover viral trends, and get competitor intelligence without login. Real-time data from 6 countries.",
  keywords: [
    "youtube analytics",
    "youtube analytics tool",
    "free youtube analytics",
    "youtube competitor analysis",
    "youtube trend finder",
    "youtube channel analytics",
    "youtube video analyzer",
    "youtube niche finder",
    "viral video tracker",
    "youtube growth tool"
  ],
  openGraph: {
    ...defaultSEO.openGraph,
    title: "Free YouTube Analytics Tool | AI-Powered Insights",
    description: "Analyze any YouTube channel, discover viral trends, and get competitor intelligence without login."
  }
};

/**
 * Trending页面SEO配置
 */
export const trendingPageSEO = {
  ...defaultSEO,
  title: "Trending YouTube Videos Today | Real-Time Viral Tracker",
  description: "Discover trending YouTube videos in real-time. Track viral content, view velocity, and engagement metrics across US, Japan, Korea, UK, Hong Kong, and Taiwan.",
  keywords: [
    "trending youtube videos",
    "viral youtube videos",
    "youtube trends",
    "trending videos today",
    "youtube viral tracker",
    "popular youtube videos",
    "youtube trending now"
  ],
  openGraph: {
    ...defaultSEO.openGraph,
    title: "Trending YouTube Videos Today | Real-Time Viral Tracker",
    description: "Discover what's trending on YouTube right now across 6 countries."
  }
};

/**
 * Trends页面SEO配置
 */
export const trendsPageSEO = {
  ...defaultSEO,
  title: "YouTube Trend Discovery | Find Viral Topics & Keywords",
  description: "Discover trending topics and viral keywords on YouTube. Get data-driven trend intelligence to create content that captures audience attention.",
  keywords: [
    "youtube trend discovery",
    "viral topics",
    "trending keywords",
    "youtube content ideas",
    "viral content trends"
  ]
};

/**
 * Money Calculator页面SEO配置
 */
export const moneyCalculatorSEO = {
  ...defaultSEO,
  title: "YouTube Money Calculator | Estimate Channel Earnings Free",
  description: "Free YouTube Money Calculator. Estimate your channel earnings based on views, CPM, and engagement. Calculate potential revenue from YouTube ads.",
  keywords: [
    "youtube money calculator",
    "youtube earnings calculator",
    "youtube revenue estimator",
    "youtube income calculator",
    "youtube cpm calculator",
    "how much do youtubers make",
    "youtube monetization calculator"
  ],
  openGraph: {
    ...defaultSEO.openGraph,
    title: "YouTube Money Calculator | Estimate Your Earnings",
    description: "Calculate your potential YouTube earnings based on views, CPM, and engagement metrics."
  }
};

/**
 * SEO Tool页面SEO配置
 */
export const seoToolSEO = {
  ...defaultSEO,
  title: "YouTube SEO Tool | Optimize Titles, Tags & Descriptions",
  description: "Free YouTube SEO tool to optimize your video titles, tags, and descriptions. Get AI-powered SEO recommendations to rank higher in search results.",
  keywords: [
    "youtube seo tool",
    "youtube keyword tool",
    "youtube title optimizer",
    "youtube tag generator",
    "youtube description optimizer",
    "youtube seo optimization",
    "video seo tool"
  ]
};

/**
 * Best Time to Post页面SEO配置
 */
export const bestTimeSEO = {
  ...defaultSEO,
  title: "Best Time to Post on YouTube | Data-Driven Insights",
  description: "Discover the best time to post on YouTube for maximum views and engagement. Data-driven insights by country and content category.",
  keywords: [
    "best time to post on youtube",
    "youtube posting schedule",
    "optimal upload time",
    "youtube engagement time",
    "best time to upload videos",
    "youtube peak hours"
  ]
};

// ============================================
// 4. 图片优化配置
// ============================================

/**
 * Next.js Image组件配置
 */
export const imageConfig = {
  // 默认图片尺寸
  defaultSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  
  // 图片格式
  formats: ["image/webp", "image/avif", "image/jpeg", "image/png"],
  
  // 懒加载配置
  lazyLoading: {
    threshold: 0.1,
    rootMargin: "50px"
  },
  
  // 占位图
  placeholder: "blur",
  blurDataURL: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
};

/**
 * 生成响应式图片srcSet
 */
export const generateSrcSet = (src, widths = [640, 750, 1080, 1920]) => {
  return widths
    .map(width => `${src}?w=${width} ${width}w`)
    .join(", ");
};

// ============================================
// 5. 导出所有配置
// ============================================

export default {
  schemas: {
    SoftwareApplication: SoftwareApplicationSchema,
    WebSite: WebSiteSchema,
    Organization: OrganizationSchema,
    VideoObject: VideoObjectSchema,
    FAQPage: FAQPageSchema,
    BreadcrumbList: BreadcrumbListSchema,
    ItemList: ItemListSchema
  },
  seo: {
    default: defaultSEO,
    home: homePageSEO,
    trending: trendingPageSEO,
    trends: trendsPageSEO,
    moneyCalculator: moneyCalculatorSEO,
    seoTool: seoToolSEO,
    bestTime: bestTimeSEO
  },
  hreflang: hreflangConfig,
  image: imageConfig
};
