/**
 * Enhanced SEO Configuration for Tubefission
 * 
 * 增强版SEO配置，包含emoji、年份标记和优化关键词
 * 基于GSC数据优化，提升排名和点击率
 */

// ============================================
// 1. 优化的标题模板
// ============================================

/**
 * 标题优化规则：
 * 1. 添加emoji提升CTR
 * 2. 包含年份(2024)显示时效性
 * 3. 强调"free"关键词
 * 4. 包含"tool"或"calculator"
 * 5. 控制在60字符以内
 */

export const optimizedTitles = {
  // 首页
  home: "🚀 Free YouTube Analytics Tool 2024 | AI Video & Channel Insights",
  
  // 工具页面
  moneyCalculator: "💰 Free YouTube Money Calculator 2024 | Estimate Earnings",
  seoTool: "🔍 Free YouTube SEO Tool 2024 | Optimize Titles & Tags",
  bestTime: "⏰ Best Time to Post on YouTube 2024 | Free Scheduler",
  nicheFinder: "🎯 Free YouTube Niche Finder 2024 | Discover Opportunities",
  
  // 现有工具页面
  channelAnalytics: "📊 Free YouTube Channel Analytics 2024 | Growth Tracker",
  competitorAnalysis: "🔥 Free YouTube Competitor Analysis 2024 | Spy Tool",
  trendFinder: "📈 Free YouTube Trend Finder 2024 | Viral Tracker",
  videoAnalyzer: "🎬 Free YouTube Video Analyzer 2024 | Performance Tool",
  opportunityFinder: "💡 Free YouTube Opportunity Finder 2024 | Niche Hunter",
  
  // 动态页面
  trending: "🔥 Trending YouTube Videos 2024 | Real-Time Viral Tracker",
  trends: "📊 YouTube Trends 2024 | Free Trend Discovery Tool",
  trendsCountry: (country) => `🇺🇸 Trending YouTube Videos in ${country} 2024`,
  video: (title) => `🎬 ${title.slice(0, 40)}... | Video Analysis 2024`,
  channel: (name) => `📊 ${name} | Channel Analytics 2024`,
  topic: (keyword) => `🎯 ${keyword} | YouTube Topic Trends 2024`
};

// ============================================
// 2. 优化的Meta描述
// ============================================

/**
 * 描述优化规则：
 * 1. 150-160字符
 * 2. 开头包含"Free"
 * 3. 包含行动号召(CTA)
 * 4. 包含主要关键词
 * 5. 添加年份
 */

export const optimizedDescriptions = {
  home: "Free YouTube analytics tool 2024. Analyze any channel, discover viral trends, and get competitor insights without login. AI-powered video intelligence. Try it now!",
  
  moneyCalculator: "Free YouTube money calculator 2024. Estimate your channel earnings based on views, CPM, and engagement. Calculate potential revenue instantly. No signup required!",
  
  seoTool: "Free YouTube SEO tool 2024. Optimize video titles, descriptions, and tags for better rankings. Get AI-powered SEO recommendations. Improve your search visibility today!",
  
  bestTime: "Free best time to post on YouTube tool 2024. Discover optimal posting times for maximum views and engagement. Data-driven insights by country. Schedule smarter!",
  
  nicheFinder: "Free YouTube niche finder 2024. Discover profitable content opportunities and trending topics. Find your perfect niche with AI-powered analysis. Start now!",
  
  channelAnalytics: "Free YouTube channel analytics 2024. Track subscriber growth, engagement rates, and top-performing videos. Analyze any channel instantly. No login required!",
  
  competitorAnalysis: "Free YouTube competitor analysis 2024. Spy on your competitors' strategies, top videos, and growth tactics. Reverse-engineer success. Try it free!",
  
  trendFinder: "Free YouTube trend finder 2024. Discover viral content before it peaks. Real-time trend tracking across 6 countries. Stay ahead of the curve. Start free!",
  
  videoAnalyzer: "Free YouTube video analyzer 2024. Get deep insights into any video's performance, engagement, and SEO. Optimize your content strategy. Analyze now!",
  
  opportunityFinder: "Free YouTube opportunity finder 2024. Discover content gaps and trending topics with low competition. Find your next viral video idea. Try it free!",
  
  trending: "Free trending YouTube videos tracker 2024. See what's viral right now across 6 countries. Real-time view velocity and engagement analysis. Discover trends free!",
  
  trends: "Free YouTube trends discovery tool 2024. Explore trending topics and viral keywords. Data-driven insights to grow your channel. No signup needed. Start now!"
};

// ============================================
// 3. 优化的关键词列表
// ============================================

/**
 * 关键词优化：
 * 1. 高意图关键词优先
 * 2. 包含"free"变体
 * 3. 长尾关键词
 * 4. 2024年份关键词
 */

export const optimizedKeywords = {
  home: [
    "free youtube analytics tool 2024",
    "youtube analytics free",
    "youtube channel analyzer free",
    "youtube competitor analysis tool",
    "youtube trend finder free",
    "ai youtube analytics",
    "youtube video analyzer free",
    "youtube growth tool free",
    "youtube insights tool",
    "youtube statistics free"
  ],
  
  moneyCalculator: [
    "youtube money calculator free 2024",
    "youtube earnings calculator free",
    "youtube revenue estimator",
    "youtube income calculator free",
    "youtube cpm calculator",
    "how much do youtubers make",
    "youtube monetization calculator",
    "youtube ad revenue calculator",
    "youtube money estimator free",
    "calculate youtube earnings"
  ],
  
  seoTool: [
    "youtube seo tool free 2024",
    "youtube keyword tool free",
    "youtube title optimizer free",
    "youtube tag generator free",
    "youtube description optimizer",
    "youtube seo optimization free",
    "video seo tool free",
    "youtube keyword research tool",
    "youtube seo checker free",
    "optimize youtube video seo"
  ],
  
  bestTime: [
    "best time to post on youtube 2024",
    "youtube posting schedule free",
    "optimal upload time youtube",
    "youtube engagement time",
    "best time to upload videos free",
    "youtube peak hours 2024",
    "when to post on youtube",
    "youtube posting time calculator",
    "youtube scheduler free",
    "best posting time by country"
  ],
  
  nicheFinder: [
    "youtube niche finder free 2024",
    "youtube niche ideas",
    "profitable youtube niches",
    "youtube niche research tool",
    "best youtube niches 2024",
    "youtube niche analyzer",
    "find youtube niche",
    "youtube niche ideas generator",
    "youtube content ideas tool",
    "youtube niche opportunities"
  ]
};

// ============================================
// 4. 优化的Open Graph配置
// ============================================

export const optimizedOpenGraph = {
  home: {
    title: "🚀 Free YouTube Analytics Tool 2024 | AI Video & Channel Insights",
    description: "Free YouTube analytics tool 2024. Analyze any channel, discover viral trends, and get competitor insights without login. Try it now!",
    type: "website",
    locale: "en_US",
    siteName: "Tubefission",
    images: [{
      url: "https://tubefission.com/og-home-2024.png",
      width: 1200,
      height: 630,
      alt: "Free YouTube Analytics Tool 2024 - Tubefission"
    }]
  },
  
  moneyCalculator: {
    title: "💰 Free YouTube Money Calculator 2024 | Estimate Your Earnings",
    description: "Calculate your potential YouTube earnings based on views, CPM, and engagement. Free tool - no signup required!",
    images: [{
      url: "https://tubefission.com/og-money-calculator-2024.png",
      width: 1200,
      height: 630,
      alt: "Free YouTube Money Calculator 2024"
    }]
  },
  
  seoTool: {
    title: "🔍 Free YouTube SEO Tool 2024 | Optimize Videos for Search",
    description: "Optimize your video titles, descriptions, and tags for better rankings. Get AI-powered SEO recommendations free!",
    images: [{
      url: "https://tubefission.com/og-seo-tool-2024.png",
      width: 1200,
      height: 630,
      alt: "Free YouTube SEO Tool 2024"
    }]
  },
  
  bestTime: {
    title: "⏰ Best Time to Post on YouTube 2024 | Free Scheduler",
    description: "Discover the optimal posting times for maximum views and engagement. Data-driven insights by country.",
    images: [{
      url: "https://tubefission.com/og-best-time-2024.png",
      width: 1200,
      height: 630,
      alt: "Best Time to Post on YouTube 2024"
    }]
  },
  
  nicheFinder: {
    title: "🎯 Free YouTube Niche Finder 2024 | Discover Opportunities",
    description: "Find profitable content niches and trending topics. AI-powered niche analysis tool. Start free!",
    images: [{
      url: "https://tubefission.com/og-niche-finder-2024.png",
      width: 1200,
      height: 630,
      alt: "Free YouTube Niche Finder 2024"
    }]
  }
};

// ============================================
// 5. 完整的页面SEO配置
// ============================================

export const enhancedPageSEO = {
  home: {
    title: optimizedTitles.home,
    description: optimizedDescriptions.home,
    keywords: optimizedKeywords.home.join(", "),
    openGraph: optimizedOpenGraph.home,
    twitter: {
      card: "summary_large_image",
      title: optimizedTitles.home,
      description: optimizedDescriptions.home,
      image: optimizedOpenGraph.home.images[0].url
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
    }
  },
  
  moneyCalculator: {
    title: optimizedTitles.moneyCalculator,
    description: optimizedDescriptions.moneyCalculator,
    keywords: optimizedKeywords.moneyCalculator.join(", "),
    openGraph: optimizedOpenGraph.moneyCalculator,
    twitter: {
      card: "summary_large_image",
      title: optimizedTitles.moneyCalculator,
      description: optimizedDescriptions.moneyCalculator,
      image: optimizedOpenGraph.moneyCalculator.images[0].url
    }
  },
  
  seoTool: {
    title: optimizedTitles.seoTool,
    description: optimizedDescriptions.seoTool,
    keywords: optimizedKeywords.seoTool.join(", "),
    openGraph: optimizedOpenGraph.seoTool,
    twitter: {
      card: "summary_large_image",
      title: optimizedTitles.seoTool,
      description: optimizedDescriptions.seoTool,
      image: optimizedOpenGraph.seoTool.images[0].url
    }
  },
  
  bestTime: {
    title: optimizedTitles.bestTime,
    description: optimizedDescriptions.bestTime,
    keywords: optimizedKeywords.bestTime.join(", "),
    openGraph: optimizedOpenGraph.bestTime,
    twitter: {
      card: "summary_large_image",
      title: optimizedTitles.bestTime,
      description: optimizedDescriptions.bestTime,
      image: optimizedOpenGraph.bestTime.images[0].url
    }
  },
  
  nicheFinder: {
    title: optimizedTitles.nicheFinder,
    description: optimizedDescriptions.nicheFinder,
    keywords: optimizedKeywords.nicheFinder.join(", "),
    openGraph: optimizedOpenGraph.nicheFinder,
    twitter: {
      card: "summary_large_image",
      title: optimizedTitles.nicheFinder,
      description: optimizedDescriptions.nicheFinder,
      image: optimizedOpenGraph.nicheFinder.images[0].url
    }
  }
};

// ============================================
// 6. H1标题配置
// ============================================

export const optimizedH1Headings = {
  home: "🚀 Free AI-Powered YouTube Analytics Platform 2024",
  moneyCalculator: "💰 Free YouTube Money Calculator 2024",
  seoTool: "🔍 Free YouTube SEO Optimization Tool 2024",
  bestTime: "⏰ Best Time to Post on YouTube in 2024",
  nicheFinder: "🎯 Free YouTube Niche Finder Tool 2024",
  channelAnalytics: "📊 Free YouTube Channel Analytics Tool",
  competitorAnalysis: "🔥 Free YouTube Competitor Analysis Tool",
  trendFinder: "📈 Free YouTube Trend Discovery Tool",
  videoAnalyzer: "🎬 Free YouTube Video Performance Analyzer",
  opportunityFinder: "💡 Free YouTube Content Opportunity Finder",
  trending: "🔥 Trending YouTube Videos Today",
  trends: "📊 YouTube Trend Discovery & Analysis"
};

// ============================================
// 7. 导出所有配置
// ============================================

export default {
  titles: optimizedTitles,
  descriptions: optimizedDescriptions,
  keywords: optimizedKeywords,
  openGraph: optimizedOpenGraph,
  pageSEO: enhancedPageSEO,
  h1Headings: optimizedH1Headings
};
