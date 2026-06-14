import React from 'react';
import Head from 'next/head';
import Script from 'next/script';

/**
 * Enhanced SEOHead组件
 * 统一的SEO元标签和结构化数据管理
 * 支持增强版Schema和优化配置
 */
const SEOHead = ({ 
  title,
  description,
  canonical,
  ogImage,
  ogType = 'website',
  noIndex = false,
  schemas = [],
  breadcrumbs = [],
  keywords = '',
  twitterCard = 'summary_large_image',
  children
}) => {
  // 生成Hreflang标签
  const hreflangTags = [
    { lang: 'en-US', url: 'https://tubefission.com' },
    { lang: 'ja-JP', url: 'https://tubefission.com/ja' },
    { lang: 'ko-KR', url: 'https://tubefission.com/ko' },
    { lang: 'en-GB', url: 'https://tubefission.com/gb' },
    { lang: 'zh-HK', url: 'https://tubefission.com/hk' },
    { lang: 'zh-TW', url: 'https://tubefission.com/tw' },
    { lang: 'x-default', url: 'https://tubefission.com' }
  ];

  // 生成面包屑Schema
  const breadcrumbSchema = breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://tubefission.com${item.path}`
    }))
  } : null;

  // 合并所有schemas
  const allSchemas = [...schemas];
  if (breadcrumbSchema) {
    allSchemas.push(breadcrumbSchema);
  }

  return (
    <>
      <Head>
        {/* 基础Meta标签 */}
        <title>{title}</title>
        <meta name="description" content={description} />
        {keywords && <meta name="keywords" content={keywords} />}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* Canonical标签 */}
        {canonical && <link rel="canonical" href={canonical} />}
        
        {/* Robots标签 */}
        {noIndex ? (
          <meta name="robots" content="noindex, nofollow" />
        ) : (
          <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        )}
        
        {/* Open Graph标签 */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content={ogType} />
        <meta property="og:url" content={canonical} />
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta property="og:site_name" content="Tubefission" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card标签 */}
        <meta name="twitter:card" content={twitterCard} />
        <meta name="twitter:site" content="@tubefission" />
        <meta name="twitter:creator" content="@tubefission" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}
        
        {/* Hreflang标签 */}
        {hreflangTags.map(({ lang, url }) => (
          <link key={lang} rel="alternate" hrefLang={lang} href={url} />
        ))}
        
        {/* 主题色 */}
        <meta name="theme-color" content="#6366f1" />
        <meta name="msapplication-TileColor" content="#6366f1" />
        
        {/* Apple移动Web应用 */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Tubefission" />
        
        {/* 预连接优化 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://api.tubefission.com" />
        
        {/* 预加载关键资源 */}
        <link rel="preload" href="/logo.svg" as="image" type="image/svg+xml" />
        
        {children}
      </Head>
      
      {/* 结构化数据 */}
      {allSchemas.length > 0 && (
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(allSchemas.length === 1 ? allSchemas[0] : allSchemas)
          }}
        />
      )}
    </>
  );
};

export default SEOHead;
