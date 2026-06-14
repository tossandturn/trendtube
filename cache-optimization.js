/**
 * Cache Optimization Configuration
 * 
 * 缓存优化配置 - 修复Cache-Control问题
n * 目标：静态资源启用长期缓存，提升页面加载速度
 */

// ============================================
// 1. Next.js 缓存配置
// ============================================

/**
 * 优化的Next.js配置
 * 修复Cache-Control: private问题
 */
export const optimizedCacheConfig = {
  // 图片优化配置
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400, // 24小时
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // 启用压缩
  compress: true,
  
  // 生产环境配置
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  
  // 实验性功能
  experimental: {
    optimizePackageImports: [
      'lodash',
      'date-fns',
      'recharts',
      '@heroicons/react'
    ],
    optimizeCss: true,
    scrollRestoration: true,
  },
  
  // HTTP头配置 - 关键优化
  async headers() {
    return [
      // 静态资源 - 长期缓存
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      // 图片资源 - 长期缓存
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      // 字体文件 - 长期缓存
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      // 公共静态资源 - 长期缓存
      {
        source: '/public/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      // 页面 - 短期缓存+重新验证
      {
        source: '/((?!api|_next|static).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400'
          }
        ]
      },
      // API端点 - 不缓存
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, max-age=0, must-revalidate'
          },
          {
            key: 'Pragma',
            value: 'no-cache'
          }
        ]
      },
      // 动态页面 - 根据类型设置缓存
      {
        source: '/trends/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=3600, stale-while-revalidate=3600'
          }
        ]
      },
      {
        source: '/trending',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=3600, stale-while-revalidate=3600'
          }
        ]
      },
      {
        source: '/video/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400'
          }
        ]
      },
      {
        source: '/channel/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400'
          }
        ]
      }
    ];
  },
  
  // Webpack优化
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          framework: {
            name: 'framework',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
            priority: 40,
            enforce: true
          },
          lib: {
            name: 'lib',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](lodash|date-fns|recharts)[\\/]/,
            priority: 30,
            enforce: true
          },
          components: {
            name: 'components',
            chunks: 'all',
            test: /[\\/]components[\\/]/,
            priority: 20,
            enforce: true
          },
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
// 2. Vercel特定缓存配置
// ============================================

/**
 * Vercel缓存配置
 * 用于vercel.json
 */
export const vercelCacheConfig = {
  "headers": [
    {
      "source": "/_next/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/images/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/fonts/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/((?!api|_next|static).*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400"
        }
      ]
    },
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, max-age=0, must-revalidate"
        }
      ]
    }
  ]
};

// ============================================
// 3. Service Worker缓存策略
// ============================================

/**
 * Service Worker缓存配置
 */
export const serviceWorkerConfig = `
// service-worker.js
const CACHE_NAME = 'tubefission-v1';
const STATIC_ASSETS = [
  '/',
  '/_next/static/**/*',
  '/images/**/*'
];

// 安装时缓存静态资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// fetch事件 - 缓存优先策略
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // API请求不缓存
  if (request.url.includes('/api/')) {
    return;
  }
  
  event.respondWith(
    caches.match(request).then((response) => {
      // 缓存命中，返回缓存
      if (response) {
        return response;
      }
      
      // 缓存未命中，发起网络请求
      return fetch(request).then((fetchResponse) => {
        // 只缓存成功的GET请求
        if (
          fetchResponse.status === 200 &&
          request.method === 'GET'
        ) {
          const responseToCache = fetchResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        
        return fetchResponse;
      });
    })
  );
});
`;

// ============================================
// 4. CDN缓存配置
// ============================================

/**
 * Cloudflare缓存规则
 */
export const cloudflareCacheRules = {
  "rules": [
    {
      "name": "Static Assets",
      "expression": "(http.request.uri.path contains \"/_next/static/\") or (http.request.uri.path contains \"/images/\") or (http.request.uri.path contains \"/fonts/\")",
      "action": {
        "cache": true,
        "cache_ttl": 31536000,
        "browser_cache_ttl": 31536000
      }
    },
    {
      "name": "Dynamic Pages",
      "expression": "not (http.request.uri.path contains \"/api/\") and not (http.request.uri.path contains \"/_next/\")",
      "action": {
        "cache": true,
        "cache_ttl": 3600,
        "browser_cache_ttl": 3600
      }
    },
    {
      "name": "API Endpoints",
      "expression": "http.request.uri.path contains \"/api/\"",
      "action": {
        "cache": false
      }
    }
  ]
};

// ============================================
// 5. 缓存验证脚本
// ============================================

/**
 * 缓存验证脚本
 * 用于验证缓存配置是否正确
 */
export const cacheValidationScript = `
#!/bin/bash

# 测试缓存头
echo "Testing cache headers..."

# 测试静态资源
echo "Testing static assets..."
curl -sI https://tubefission.com/_next/static/test.js | grep -i "cache-control"

# 测试图片
echo "Testing images..."
curl -sI https://tubefission.com/images/logo.png | grep -i "cache-control"

# 测试页面
echo "Testing pages..."
curl -sI https://tubefission.com/ | grep -i "cache-control"

# 测试API
echo "Testing API..."
curl -sI https://tubefission.com/api/trends | grep -i "cache-control"

echo "Cache validation complete!"
`;

// ============================================
// 6. 缓存清理脚本
// ============================================

/**
 * 缓存清理API
 * 用于手动清理缓存
 */
export const cachePurgeAPI = `
// pages/api/purge-cache.js
export default async function handler(req, res) {
  // 验证请求
  const { authorization } = req.headers;
  if (authorization !== \`Bearer \${process.env.CACHE_PURGE_TOKEN}\`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    // 清理Vercel缓存
    const response = await fetch(\`https://api.vercel.com/v13/deployments/\${process.env.VERCEL_DEPLOYMENT_ID}/rebuild\`, {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${process.env.VERCEL_TOKEN}\`
      }
    });
    
    if (response.ok) {
      res.status(200).json({ message: 'Cache purged successfully' });
    } else {
      res.status(500).json({ error: 'Failed to purge cache' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
`;

// ============================================
// 7. 导出所有配置
// ============================================

export default {
  nextConfig: optimizedCacheConfig,
  vercelConfig: vercelCacheConfig,
  serviceWorker: serviceWorkerConfig,
  cloudflareRules: cloudflareCacheRules,
  validationScript: cacheValidationScript,
  purgeAPI: cachePurgeAPI
};
