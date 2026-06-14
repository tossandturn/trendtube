import React, { useState } from 'react';
import SEOHead from '../../components/SEOHead';
import RegionFilter from '../../components/RegionFilter';
import { useRegionFilter } from '../../hooks/useRegionFilter';
import { 
  getTrendsByCountry, 
  generateTrendsCountrySEO,
  generateTrendsListSchema,
  generateBreadcrumbSchema
} from '../../programmatic-seo-infrastructure';

/**
 * 动态趋势国家页面
 * /trends/[country]
 * 
 * 展示特定国家的YouTube趋势数据
 */
export default function TrendsCountryPage({ country, trendsData }) {
  const { selectedRegion, handleRegionChange, regionName } = useRegionFilter('US');
  const seo = generateTrendsCountrySEO(country, trendsData);
  
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Trends', path: '/trends' },
    { name: trendsData.countryName, path: `/trends/${country}` }
  ]);
  
  const trendsSchema = generateTrendsListSchema(trendsData.trends, country);

  return (
    <>
      <SEOHead
        title={seo.title}
        description={seo.description}
        canonical={`https://tubefission.com/trends/${country}`}
        ogImage={seo.openGraph.images[0].url}
        schemas={[breadcrumbSchema, trendsSchema]}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
        {/* Region Filter Bar */}
        <div className="py-4 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
          <div className="max-w-6xl mx-auto flex justify-end">
            <RegionFilter selectedRegion={selectedRegion} onRegionChange={handleRegionChange} />
          </div>
        </div>

        {/* Breadcrumb */}
        <nav className="py-4 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
          <div className="max-w-6xl mx-auto">
            <ol className="flex items-center space-x-2 text-sm text-slate-400">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li>/</li>
              <li><a href="/trends" className="hover:text-white transition-colors">Trends</a></li>
              <li>/</li>
              <li className="text-white">{trendsData.countryName}</li>
            </ol>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                Trending YouTube Videos in {trendsData.countryName}
              </h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                Discover what's trending on YouTube in {trendsData.countryName} right now. 
                Real-time data updated hourly.
              </p>
              <p className="text-sm text-slate-500 mt-4">
                Last updated: {new Date(trendsData.lastUpdated).toLocaleString()}
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid md:grid-cols-4 gap-4 mb-12">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 text-center">
                <p className="text-3xl font-bold text-indigo-400">
                  {trendsData.totalVideos.toLocaleString()}
                </p>
                <p className="text-slate-400 text-sm">Videos Tracked</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 text-center">
                <p className="text-3xl font-bold text-purple-400">
                  {trendsData.trends.length}
                </p>
                <p className="text-slate-400 text-sm">Trending Now</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 text-center">
                <p className="text-3xl font-bold text-pink-400">
                  {trendsData.topCategories.length}
                </p>
                <p className="text-slate-400 text-sm">Categories</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 text-center">
                <p className="text-3xl font-bold text-green-400">
                  Live
                </p>
                <p className="text-slate-400 text-sm">Data Status</p>
              </div>
            </div>

            {/* Top Categories */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Top Categories</h2>
              <div className="flex flex-wrap gap-2">
                {trendsData.topCategories.map((category) => (
                  <a
                    key={category.name}
                    href={`/category/${category.slug}`}
                    className="px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700 hover:border-indigo-500 transition-colors"
                  >
                    <span className="text-slate-300">{category.name}</span>
                    <span className="text-slate-500 ml-2">({category.count})</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Trending Videos */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Trending Videos</h2>
              <div className="space-y-4">
                {trendsData.trends.map((video, index) => (
                  <article
                    key={video.videoId}
                    className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-indigo-500 transition-colors"
                  >
                    <div className="flex gap-4">
                      {/* Rank */}
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center font-bold text-lg">
                        #{index + 1}
                      </div>
                      
                      {/* Thumbnail */}
                      <a
                        href={`/video/${video.videoId}`}
                        className="flex-shrink-0 w-40 aspect-video bg-slate-700 rounded-lg overflow-hidden"
                      >
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </a>
                      
                      {/* Info */}
                      <div className="flex-grow min-w-0">
                        <a
                          href={`/video/${video.videoId}`}
                          className="block font-semibold text-lg hover:text-indigo-400 transition-colors line-clamp-2"
                        >
                          {video.title}
                        </a>
                        <a
                          href={`/channel/${video.channelId}`}
                          className="text-slate-400 hover:text-white transition-colors text-sm mt-1"
                        >
                          {video.channelTitle}
                        </a>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                          <span>{formatNumber(video.viewCount)} views</span>
                          <span>{video.engagement}% engagement</span>
                          <span className="text-green-400">+{formatNumber(video.velocity)}/day</span>
                        </div>
                      </div>
                      
                      {/* Category */}
                      <div className="flex-shrink-0">
                        <span className="px-3 py-1 bg-slate-700 rounded-full text-sm">
                          {video.category}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Related Countries */}
            <div className="mt-12 pt-8 border-t border-slate-800">
              <h3 className="text-lg font-semibold mb-4">Trending in Other Countries</h3>
              <div className="flex flex-wrap gap-2">
                {['jp', 'kr', 'gb', 'ca', 'au'].filter(c => c !== country).map((c) => (
                  <a
                    key={c}
                    href={`/trends/${c}`}
                    className="px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-indigo-500 transition-colors text-sm"
                  >
                    {getCountryName(c)}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-slate-800">
          <div className="max-w-6xl mx-auto text-center text-slate-400 text-sm">
            <p>© 2024 Tubefission. Real-time YouTube trend analysis.</p>
          </div>
        </footer>
      </div>
    </>
  );
}

// 静态生成配置
export async function generateStaticParams() {
  return [
    { country: 'us' },
    { country: 'jp' },
    { country: 'kr' },
    { country: 'gb' },
    { country: 'hk' },
    { country: 'tw' },
    { country: 'ca' },
    { country: 'au' },
    { country: 'de' },
    { country: 'fr' }
  ];
}

// 重新验证时间（秒）
export const revalidate = 3600; // 每小时

// 生成元数据
export async function generateMetadata({ params }) {
  const data = await getTrendsByCountry(params.country);
  const seo = generateTrendsCountrySEO(params.country, data);
  return seo;
}

// 获取数据
export async function getStaticProps({ params }) {
  const trendsData = await getTrendsByCountry(params.country);
  
  return {
    props: {
      country: params.country,
      trendsData
    }
  };
}

// 辅助函数
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

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
    fr: 'France'
  };
  return countries[code] || code.toUpperCase();
}

// 静态路径配置 - 全部动态生成
export async function getStaticPaths() {
  return {
    paths: [], // 不预生成任何页面
    fallback: 'blocking'
  };
}

// 获取数据
export async function getStaticProps({ params }) {
  try {
    const trendsData = await getTrendsByCountry(params.country);
    return {
      props: {
        country: params.country,
        trendsData
      },
      revalidate: 3600
    };
  } catch (error) {
    return {
      notFound: true
    };
  }
}
