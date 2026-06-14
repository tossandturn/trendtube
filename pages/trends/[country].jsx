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
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                  {trendsData.countryName} Trends
                </span>
              </h1>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Discover what's trending in {trendsData.countryName}. Real-time insights into the most popular content.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="text-3xl font-bold text-indigo-400 mb-2">
                  {formatNumber(trendsData.totalViews)}
                </div>
                <div className="text-slate-400">Total Views</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {trendsData.trendingCount}
                </div>
                <div className="text-slate-400">Trending Videos</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="text-3xl font-bold text-pink-400 mb-2">
                  {trendsData.avgEngagement}%
                </div>
                <div className="text-slate-400">Avg Engagement</div>
              </div>
            </div>

            {/* Trends List */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Trending Now</h2>
              {trendsData.trends.map((trend, index) => (
                <div key={trend.id} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-indigo-500/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl font-bold text-indigo-400">#{index + 1}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">{trend.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span>{trend.channel}</span>
                        <span>{formatNumber(trend.views)} views</span>
                        <span className={trend.trend === 'up' ? 'text-green-400' : trend.trend === 'down' ? 'text-red-400' : 'text-slate-400'}>
                          {trend.trend === 'up' ? '📈' : trend.trend === 'down' ? '📉' : '➡️'} {trend.growth}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
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

// 静态路径配置 - 全部动态生成
export async function getStaticPaths() {
  return {
    paths: [],
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
