/**
 * Page Speed Optimization Configuration
 * 
 * 页面速度优化配置
 * 目标：移动>70，桌面>90
 * LCP<2.5s, FID<100ms, CLS<0.1
 */

// ============================================
// 1. Next.js 配置优化
// ============================================

/**
 * next.config.js 优化配置
 */
export const nextConfig = {
  // 图片优化
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // 压缩
  compress: true,
  
  // 生产环境优化
  productionBrowserSourceMaps: false,
  
  // 实验性功能
  experimental: {
    // 优化包导入
    optimizePackageImports: [
      'lodash',
      'date-fns',
      'recharts',
      '@heroicons/react'
    ],
    // 优化CSS
    optimizeCss: true,
    // 滚动恢复
    scrollRestoration: true,
  },
  
  // 头部优化
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400'
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          }
        ]
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, max-age=0, must-revalidate'
          }
        ]
      }
    ];
  },
  
  // 重定向
  async redirects() {
    return [
      {
        source: '/channel',
        destination: '/youtube-channel-analytics',
        permanent: true
      }
    ];
  },
  
  // Webpack优化
  webpack: (config, { dev, isServer }) => {
    // 生产环境优化
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // 框架代码
          framework: {
            name: 'framework',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
            priority: 40,
            enforce: true
          },
          // 库代码
          lib: {
            name: 'lib',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](lodash|date-fns|recharts)[\\/]/,
            priority: 30,
            enforce: true
          },
          // 组件代码
          components: {
            name: 'components',
            chunks: 'all',
            test: /[\\/]components[\\/]/,
            priority: 20,
            enforce: true
          },
          // 工具代码
          utils: {
            name: 'utils',
            chunks: 'all',
            test: /[\\/]utils[\\/]/,
            priority: 10,
            enforce: true
          }
        }
      };
    }
    return config;
  }
};

// ============================================
// 2. 图片优化组件
// ============================================

/**
 * 优化的图片组件配置
 */
export const imageOptimizationConfig = {
  // WebP配置
  webp: {
    quality: 85,
    effort: 4,
    smartSubsample: true,
    nearLossless: true
  },
  
  // AVIF配置
  avif: {
    quality: 80,
    effort: 4,
    chromaSubsampling: '4:2:0'
  },
  
  // 响应式图片配置
  responsive: {
    sizes: [640, 750, 828, 1080, 1200, 1920],
    srcSet: (src, sizes) => sizes
      .map(size => `${src}?w=${size} ${size}w`)
      .join(', ')
  },
  
  // 懒加载配置
  lazyLoading: {
    threshold: 0.1,
    rootMargin: '50px',
    triggerOnce: true
  },
  
  // 占位图
  placeholder: {
    blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyU//Z',
    blur: {
      width: 40,
      height: 30
    }
  }
};

// ============================================
// 3. 字体优化
// ============================================

/**
 * 字体加载优化
 */
export const fontOptimization = {
  // 预加载关键字体
  preload: [
    {
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
      as: 'style'
    }
  ],
  
  // 字体显示策略
  display: 'swap',
  
  // 字体子集
  subsets: ['latin'],
  
  // 权重
  weights: [400, 500, 600, 700],
  
  // 回退字体
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
};

// ============================================
// 4. 脚本优化
// ============================================

/**
 * 第三方脚本加载优化
 */
export const scriptOptimization = {
  // 延迟加载的脚本
  defer: [
    {
      src: 'https://analytics.example.com/script.js',
      strategy: 'lazyOnload'
    },
    {
      src: 'https://chat-widget.example.com/widget.js',
      strategy: 'lazyOnload'
    }
  ],
  
  // 异步加载的脚本
  async: [
    {
      src: 'https://ads.example.com/ads.js',
      strategy: 'afterInteractive'
    }
  ],
  
  // 预加载的脚本
  preload: [
    {
      href: 'https://api.tubefission.com/data',
      as: 'fetch',
      crossOrigin: 'anonymous'
    }
  ]
};

// ============================================
// 5. CSS优化
// ============================================

/**
 * CSS优化配置
 */
export const cssOptimization = {
  // 关键CSS提取
  criticalCSS: {
    enabled: true,
    dimensions: [
      { width: 375, height: 667 },   // Mobile
      { width: 1920, height: 1080 }  // Desktop
    ]
  },
  
  // PurgeCSS配置
  purgeCSS: {
    content: [
      './pages/**/*.{js,jsx,ts,tsx}',
      './components/**/*.{js,jsx,ts,tsx}'
    ],
    defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
    safelist: [
      'bg-slate-900',
      'text-white',
      'from-indigo-600',
      'to-purple-600'
    ]
  },
  
  // CSS压缩
  minify: true
};

// ============================================
// 6. 数据获取优化
// ============================================

/**
 * 数据获取优化
 */
export const dataOptimization = {
  // SWR配置
  swr: {
    refreshInterval: 300000, // 5分钟
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000 // 1分钟去重
  },
  
  // React Query配置
  reactQuery: {
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5分钟
        cacheTime: 10 * 60 * 1000, // 10分钟
        refetchOnWindowFocus: false,
        retry: 2,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
      }
    }
  },
  
  // API缓存
  apiCache: {
    trends: 3600,      // 1小时
    video: 86400,      // 1天
    channel: 86400,    // 1天
    search: 300       // 5分钟
  }
};

// ============================================
// 7. Core Web Vitals优化
// ============================================

/**
 * Core Web Vitals优化配置
 */
export const coreWebVitalsOptimization = {
  // LCP优化
  lcp: {
    // 预加载LCP图片
    preloadLCPImages: true,
    // 图片优先级
    imagePriority: 'high',
    // 字体预加载
    preloadFonts: true
  },
  
  // FID优化
  fid: {
    // 代码分割
    codeSplitting: true,
    // 延迟非关键JS
    deferNonCriticalJS: true,
    // 事件监听器优化
    eventListenerOptimization: true
  },
  
  // CLS优化
  cls: {
    // 图片尺寸
    imageDimensions: true,
    // 广告占位
    adPlaceholders: true,
    // 字体加载
    fontLoading: 'optional',
    // 动画优化
    animationOptimization: true
  },
  
  // TTFB优化
  ttfb: {
    // CDN使用
    useCDN: true,
    // 边缘缓存
    edgeCaching: true,
    // 预渲染
    prerender: true
  }
};

// ============================================
// 8. 性能监控
// ============================================

/**
 * 性能监控配置
 */
export const performanceMonitoring = {
  // Web Vitals监控
  webVitals: {
    enabled: true,
    reportTo: '/api/vitals',
    thresholds: {
      LCP: 2500,
      FID: 100,
      CLS: 0.1,
      FCP: 1800,
      TTFB: 600
    }
  },
  
  // 资源加载监控
  resourceTiming: {
    enabled: true,
    sampleRate: 0.1
  },
  
  // 错误监控
  errorTracking: {
    enabled: true,
    sampleRate: 1.0
  }
};

// ============================================
// 9. 页面特定优化
// ============================================

/**
 * 特定页面的优化配置
 */
export const pageSpecificOptimization = {
  // 首页
  home: {
    // 预加载关键资源
    preload: [
      '/hero-image.webp',
      '/logo.svg'
    ],
    // 预连接
    preconnect: [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ],
    // DNS预解析
    dnsPrefetch: [
      'https://api.tubefission.com'
    ]
  },
  
  // Trending页面
  trending: {
    // ISR配置
    isr: {
      revalidate: 3600, // 1小时
      fallback: 'blocking'
    },
    // 骨架屏
    skeleton: true
  },
  
  // Trends页面
  trends: {
    isr: {
      revalidate: 3600,
      fallback: 'blocking'
    },
    skeleton: true
  },
  
  // 工具页面
  tools: {
    // 客户端数据获取
    clientSideData: true,
    // 加载状态
    loadingState: true
  }
};

// ============================================
// 10. 导出所有配置
// ============================================

export default {
  nextConfig,
  image: imageOptimizationConfig,
  font: fontOptimization,
  script: scriptOptimization,
  css: cssOptimization,
  data: dataOptimization,
  webVitals: coreWebVitalsOptimization,
  monitoring: performanceMonitoring,
  pages: pageSpecificOptimization
};
