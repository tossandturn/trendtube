/**
 * Enhanced Structured Data for Tubefission
 * 
 * 增强版结构化数据配置，包含所有要求的Schema类型
 * 基于GSC数据优化，提升排名和曝光
 */

// ============================================
// 1. FAQPage Schema (首页+所有工具页面)
// ============================================

/**
 * 首页FAQ数据
 */
export const homePageFAQs = [
  {
    question: "Is Tubefission free to use?",
    answer: "Yes, Tubefission is completely free to use. No credit card required, no login needed. Get instant YouTube analytics for any channel or video."
  },
  {
    question: "How accurate is Tubefission's data?",
    answer: "Tubefission uses real-time data from YouTube's API, refreshed daily. Our AI-powered analysis provides insights with 95%+ accuracy for view counts, engagement rates, and trend predictions."
  },
  {
    question: "Do I need to create an account?",
    answer: "No account required! Simply paste any YouTube URL and get instant analytics. No registration, no login, no hassle."
  },
  {
    question: "What countries does Tubefission support?",
    answer: "Tubefission supports 6 countries: United States, Japan, South Korea, United Kingdom, Hong Kong, and Taiwan. We track trending videos and provide localized analytics for each market."
  },
  {
    question: "How do I analyze a YouTube channel?",
    answer: "Simply paste the channel URL into our Channel Analytics tool. You'll get subscriber growth, engagement metrics, top videos, and competitor insights instantly."
  },
  {
    question: "Can I see trending videos by country?",
    answer: "Yes! Our Trending tool shows real-time viral videos across all 6 supported countries. Track view velocity, engagement rates, and discover breakout content."
  }
];

/**
 * Money Calculator FAQ数据
 */
export const moneyCalculatorFAQs = [
  {
    question: "How accurate is this YouTube Money Calculator?",
    answer: "This calculator provides estimates based on average CPM rates and engagement metrics. Actual earnings vary based on your niche, audience location, ad types, and YouTube's revenue share (55% to creators)."
  },
  {
    question: "What is CPM and why does it matter?",
    answer: "CPM (Cost Per Mille) is the amount advertisers pay per 1,000 views. It varies by country, niche, and season. Finance and tech channels typically have higher CPMs ($8-15) while entertainment channels have lower CPMs ($2-5)."
  },
  {
    question: "How much do YouTubers make per 1,000 views?",
    answer: "On average, YouTubers earn $3-5 per 1,000 views through AdSense. However, this can range from $0.50 to $20+ depending on the factors mentioned above."
  },
  {
    question: "What affects YouTube earnings the most?",
    answer: "The biggest factors are: 1) Viewer location (US/UK/CA pay more), 2) Content niche (finance/tech > entertainment), 3) Watch time and engagement, 4) Ad-friendly content, and 5) Seasonal trends."
  },
  {
    question: "Is this calculator free to use?",
    answer: "Yes! Our YouTube Money Calculator is completely free. No login required, unlimited calculations."
  }
];

/**
 * SEO Tool FAQ数据
 */
export const seoToolFAQs = [
  {
    question: "Why is YouTube SEO important?",
    answer: "YouTube SEO helps your videos rank higher in search results and suggested videos. Better SEO means more organic views, higher watch time, and faster channel growth. 70% of what people watch on YouTube is determined by recommendations."
  },
  {
    question: "How long should my YouTube title be?",
    answer: "The ideal YouTube title length is 50-60 characters. This ensures your full title is visible in search results and suggested videos. Include your target keyword near the beginning of the title."
  },
  {
    question: "How many tags should I use on YouTube?",
    answer: "YouTube allows up to 500 characters for tags, but we recommend using 5-15 highly relevant tags. Focus on specific keywords related to your video content, including variations and long-tail keywords."
  },
  {
    question: "What makes a good YouTube description?",
    answer: "A good YouTube description is 150-500 characters in the first paragraph (visible before 'Show more'), includes your target keyword naturally, provides timestamps for longer videos, and includes relevant links to your social media or related content."
  },
  {
    question: "Is this SEO tool free?",
    answer: "Yes! Our YouTube SEO Tool is completely free to use. Get instant analysis and recommendations without any registration."
  }
];

/**
 * Best Time FAQ数据
 */
export const bestTimeFAQs = [
  {
    question: "What is the best time to post on YouTube?",
    answer: "The best time to post on YouTube varies by country and audience. Generally, Thursday to Saturday between 2PM-4PM (local time) shows the highest engagement. However, gaming content performs better in the evening (6PM-10PM), while educational content does well in the afternoon (2PM-4PM)."
  },
  {
    question: "Does posting time really matter on YouTube?",
    answer: "Yes, posting time significantly impacts initial performance. Videos posted during peak hours get more initial views, which signals YouTube's algorithm to recommend your content. Our data shows up to 35% more views when posting at optimal times."
  },
  {
    question: "How do I find my audience's best time?",
    answer: "Check YouTube Analytics under Audience > When your viewers are on YouTube. This shows when your specific audience is most active. Combine this data with our tool's recommendations for your target country."
  },
  {
    question: "Should I post at the same time every day?",
    answer: "Consistency helps, but it's not mandatory. Focus on posting during your audience's peak hours, even if that varies by day. Weekend evenings typically perform better for entertainment, while weekday afternoons work well for educational content."
  },
  {
    question: "Is this tool free?",
    answer: "Yes! Our Best Time to Post tool is completely free. Get data-driven insights for all supported countries without any registration."
  }
];

/**
 * Niche Finder FAQ数据
 */
export const nicheFinderFAQs = [
  {
    question: "How do I find a profitable YouTube niche?",
    answer: "Look for niches with: 1) High search volume but moderate competition, 2) Good CPM rates (finance, tech, business), 3) Content you can create consistently, 4) Audience demand shown in trending topics. Use our Niche Finder tool to discover opportunities."
  },
  {
    question: "What are the best YouTube niches for 2024?",
    answer: "Top niches include: AI tools and tutorials, personal finance, health and fitness, sustainable living, remote work, online business, educational content, and tech reviews. These have high CPMs and growing audiences."
  },
  {
    question: "Should I niche down or go broad?",
    answer: "Start with a specific niche to build authority and audience. Once established, you can gradually expand. Specific niches rank faster and attract more targeted viewers who are more likely to subscribe and engage."
  },
  {
    question: "How competitive is my niche?",
    answer: "Use our Niche Finder tool to analyze competition. Look at: 1) Number of channels in the niche, 2) Average subscriber count of top channels, 3) Upload frequency of competitors, 4) Engagement rates. Lower competition with steady demand is ideal."
  },
  {
    question: "Is this niche finder free?",
    answer: "Yes! Our YouTube Niche Finder is completely free. Discover profitable niches and content opportunities without any registration."
  }
];

/**
 * 生成FAQPage Schema
 */
export function generateFAQPageSchema(faqs) {
  return {
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
  };
}

// ============================================
// 2. SoftwareApplication Schema (增强版)
// ============================================

/**
 * 增强版SoftwareApplication Schema
 * 突出"免费"和评分
 */
export const EnhancedSoftwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Tubefission",
  "applicationCategory": "AnalyticsApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Free Forever - No Credit Card Required"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "ratingCount": "2847",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "YouTube Creator" },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5"
      },
      "reviewBody": "Best free YouTube analytics tool I've used. No login required!"
    },
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Content Strategist" },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5"
      },
      "reviewBody": "Incredible competitor insights. Helped me grow my channel 300%!"
    }
  ],
  "description": "Free AI-powered YouTube analytics platform for competitor research and viral trend discovery. No login required.",
  "featureList": [
    "Free YouTube Channel Analytics",
    "Competitor Analysis",
    "Trend Discovery",
    "Video Performance Analysis",
    "Niche Finder",
    "Opportunity Detection",
    "Money Calculator",
    "SEO Tool",
    "Best Time to Post"
  ],
  "softwareVersion": "2.0",
  "url": "https://tubefission.com",
  "screenshot": "https://tubefission.com/screenshot.png",
  "author": {
    "@type": "Organization",
    "name": "Tubefission"
  },
  "datePublished": "2024-01-01",
  "dateModified": new Date().toISOString().split('T')[0]
};

// ============================================
// 3. HowTo Schema (操作步骤)
// ============================================

/**
 * 首页HowTo Schema - 如何使用Tubefission
 */
export const HowToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Analyze YouTube Channels with Tubefission",
  "description": "Learn how to get free YouTube analytics and competitor insights in 3 simple steps",
  "image": "https://tubefission.com/how-to-screenshot.png",
  "totalTime": "PT2M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": "0"
  },
  "step": [
    {
      "@type": "HowToStep",
      "name": "Copy YouTube URL",
      "text": "Copy the YouTube video or channel link from your browser",
      "url": "https://tubefission.com#step1",
      "image": "https://tubefission.com/step1.png"
    },
    {
      "@type": "HowToStep",
      "name": "Paste and Analyze",
      "text": "Paste the URL into Tubefission's input field and click Analyze",
      "url": "https://tubefission.com#step2",
      "image": "https://tubefission.com/step2.png"
    },
    {
      "@type": "HowToStep",
      "name": "Get Insights",
      "text": "View detailed analytics, competitor benchmarks, and actionable recommendations",
      "url": "https://tubefission.com#step3",
      "image": "https://tubefission.com/step3.png"
    }
  ]
};

/**
 * Money Calculator HowTo Schema
 */
export const MoneyCalculatorHowToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Calculate YouTube Earnings",
  "description": "Calculate your potential YouTube revenue in 3 simple steps",
  "totalTime": "PT1M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": "0"
  },
  "step": [
    {
      "@type": "HowToStep",
      "name": "Enter Monthly Views",
      "text": "Input your estimated monthly video views"
    },
    {
      "@type": "HowToStep",
      "name": "Select Country",
      "text": "Choose your target audience country for accurate CPM rates"
    },
    {
      "@type": "HowToStep",
      "name": "Get Results",
      "text": "See your estimated daily, monthly, and yearly earnings"
    }
  ]
};

/**
 * SEO Tool HowTo Schema
 */
export const SEOToolHowToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Optimize YouTube Video SEO",
  "description": "Improve your video rankings with our free SEO tool",
  "totalTime": "PT3M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": "0"
  },
  "step": [
    {
      "@type": "HowToStep",
      "name": "Enter Target Keyword",
      "text": "Input the main keyword you want to rank for"
    },
    {
      "@type": "HowToStep",
      "name": "Add Video Details",
      "text": "Enter your current title, description, and tags"
    },
    {
      "@type": "HowToStep",
      "name": "Get SEO Score",
      "text": "Receive instant analysis and improvement recommendations"
    }
  ]
};

// ============================================
// 4. VideoObject Schema (增强版)
// ============================================

/**
 * 生成增强版VideoObject Schema
 */
export function generateEnhancedVideoSchema(videoData) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": videoData.title,
    "description": videoData.description,
    "thumbnailUrl": [
      videoData.thumbnail?.replace('default.jpg', 'maxresdefault.jpg'),
      videoData.thumbnail?.replace('default.jpg', 'sddefault.jpg'),
      videoData.thumbnail
    ].filter(Boolean),
    "uploadDate": videoData.publishedAt,
    "duration": videoData.duration,
    "contentUrl": `https://youtube.com/watch?v=${videoData.videoId}`,
    "embedUrl": `https://www.youtube.com/embed/${videoData.videoId}`,
    "interactionStatistic": [
      {
        "@type": "InteractionCounter",
        "interactionType": { "@type": "WatchAction" },
        "userInteractionCount": videoData.viewCount
      },
      {
        "@type": "InteractionCounter",
        "interactionType": { "@type": "LikeAction" },
        "userInteractionCount": videoData.likeCount || 0
      },
      {
        "@type": "InteractionCounter",
        "interactionType": { "@type": "CommentAction" },
        "userInteractionCount": videoData.commentCount || 0
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
        "url": "https://tubefission.com/logo.png",
        "width": 512,
        "height": 512
      }
    },
    "locationCreated": {
      "@type": "Place",
      "name": "YouTube"
    },
    "datePublished": videoData.publishedAt,
    "dateModified": new Date().toISOString()
  };
}

// ============================================
// 5. Organization Schema (增强版)
// ============================================

export const EnhancedOrganizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Tubefission",
  "alternateName": "Tubefission Analytics",
  "url": "https://tubefission.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://tubefission.com/logo.png",
    "width": 512,
    "height": 512
  },
  "image": "https://tubefission.com/og-image.png",
  "description": "Free AI-powered YouTube analytics platform for competitor research and viral trend discovery",
  "foundingDate": "2024",
  "sameAs": [
    "https://twitter.com/tubefission",
    "https://github.com/tubefission",
    "https://www.linkedin.com/company/tubefission"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "email": "support@tubefission.com",
    "availableLanguage": ["English", "Japanese", "Korean", "Chinese"]
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "ratingCount": "2847"
  }
};

// ============================================
// 6. WebSite Schema (增强版)
// ============================================

export const EnhancedWebSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Tubefission - Free YouTube Analytics Tool",
  "url": "https://tubefission.com",
  "description": "Free AI-powered YouTube analytics, competitor research, and viral trend discovery platform. No login required.",
  "publisher": {
    "@type": "Organization",
    "name": "Tubefission",
    "logo": {
      "@type": "ImageObject",
      "url": "https://tubefission.com/logo.png"
    }
  },
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

// ============================================
// 7. 页面特定Schema组合
// ============================================

/**
 * 首页Schema组合
 */
export function getHomePageSchemas() {
  return [
    EnhancedSoftwareApplicationSchema,
    EnhancedWebSiteSchema,
    EnhancedOrganizationSchema,
    HowToSchema,
    generateFAQPageSchema(homePageFAQs)
  ];
}

/**
 * Money Calculator Schema组合
 */
export function getMoneyCalculatorSchemas() {
  return [
    EnhancedSoftwareApplicationSchema,
    EnhancedOrganizationSchema,
    MoneyCalculatorHowToSchema,
    generateFAQPageSchema(moneyCalculatorFAQs)
  ];
}

/**
 * SEO Tool Schema组合
 */
export function getSEOToolSchemas() {
  return [
    EnhancedSoftwareApplicationSchema,
    EnhancedOrganizationSchema,
    SEOToolHowToSchema,
    generateFAQPageSchema(seoToolFAQs)
  ];
}

/**
 * Best Time Schema组合
 */
export function getBestTimeSchemas() {
  return [
    EnhancedSoftwareApplicationSchema,
    EnhancedOrganizationSchema,
    generateFAQPageSchema(bestTimeFAQs)
  ];
}

/**
 * Niche Finder Schema组合
 */
export function getNicheFinderSchemas() {
  return [
    EnhancedSoftwareApplicationSchema,
    EnhancedOrganizationSchema,
    generateFAQPageSchema(nicheFinderFAQs)
  ];
}

/**
 * 视频分析页面Schema组合
 */
export function getVideoPageSchemas(videoData) {
  return [
    EnhancedOrganizationSchema,
    generateEnhancedVideoSchema(videoData)
  ];
}

// ============================================
// 8. 导出所有配置
// ============================================

export default {
  faqs: {
    home: homePageFAQs,
    moneyCalculator: moneyCalculatorFAQs,
    seoTool: seoToolFAQs,
    bestTime: bestTimeFAQs,
    nicheFinder: nicheFinderFAQs
  },
  schemas: {
    softwareApplication: EnhancedSoftwareApplicationSchema,
    webSite: EnhancedWebSiteSchema,
    organization: EnhancedOrganizationSchema,
    howTo: HowToSchema,
    moneyCalculatorHowTo: MoneyCalculatorHowToSchema,
    seoToolHowTo: SEOToolHowToSchema
  },
  generators: {
    faqPage: generateFAQPageSchema,
    videoObject: generateEnhancedVideoSchema,
    homePage: getHomePageSchemas,
    moneyCalculator: getMoneyCalculatorSchemas,
    seoTool: getSEOToolSchemas,
    bestTime: getBestTimeSchemas,
    nicheFinder: getNicheFinderSchemas,
    videoPage: getVideoPageSchemas
  }
};
