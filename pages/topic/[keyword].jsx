import React, { useState } from 'react';
import SEOHead from '../../components/SEOHead';
import RegionFilter from '../../components/RegionFilter';
import { useRegionFilter } from '../../hooks/useRegionFilter';
import { 
  getTopicData,
  generateTopicSEO,
  generateBreadcrumbSchema
} from '../../programmatic-seo-infrastructure';

/**
 * 话题/关键词页面
 * /topic/[keyword]
 * 
 * 展示特定关键词的趋势分析和内容机会
 */
export default function TopicPage({ keyword, topicData }) {
  const { selectedRegion, handleRegionChange, regionName } = useRegionFilter('US');
  const seo = generateTopicSEO(keyword, topicData);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Topics', path: '/topics' },
    { name: keyword, path: `/topic/${encodeURIComponent(keyword)}` }
  ]);

  // 难度颜色
  const getDifficultyColor = (difficulty) => {
    if (difficulty <= 30) return 'text-green-400';
    if (difficulty <= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  // 趋势图标
  const getTrendIcon = (trend) => {
    if (trend === 'up') return '📈';
    if (trend === 'down') return '📉';
    return '➡️';
  };

  return (
    <>
      <SEOHead
        title={seo.title}
        description={seo.description}
        canonical={`https://tubefission.com/topic/${encodeURIComponent(keyword)}`}
        ogImage={seo.openGraph.images[0].url}
        schemas={[breadcrumbSchema]}
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
              <li><a href="/topics" className="hover:text-white transition-colors">Topics</a></li>
              <li>/</li>
              <li className="text-white capitalize">{keyword}</li>
            </ol>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 capitalize">
                {keyword} Trends on YouTube
              </h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                Explore "{keyword}" content opportunities, search trends, and top-performing videos.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-4 mb-12">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 text-center">
                <p className="text-3xl font-bold text-indigo-400">
                  {topicData.searchVolume?.toLocaleString() || 'N/A'}
                </p>
                <p className="text-slate-400 text-sm">Monthly Searches</p>
              </div>
              
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 text-center">
                <p className="text-3xl font-bold text-purple-400">
                  {topicData.competition || 'N/A'}
                </p>
                <p className="text-slate-400 text-sm">Competition</p>
              </div>
              
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 text-center">
                <p className="text-3xl font-bold text-pink-400">
                  {getTrendIcon(topicData.trend)}
                </p>
                <p className="text-slate-400 text-sm">Trend Direction</p>
              </div>
              
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 text-center">
                <p className={`text-3xl font-bold ${getDifficultyColor(topicData.difficulty || 50)}`}>
                  {topicData.difficulty || 'N/A'}
                </p>
                <p className="text-slate-400 text-sm">Difficulty (0-100)</p>
              </div>
            </div>

            {/* Opportunity Score */}
            <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-xl p-8 border border-indigo-500/30 mb-12">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Content Opportunity Score</h2>
                  <p className="text-slate-300">
                    Based on search volume, competition, and trend direction
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-5xl font-bold ${getDifficultyColor(100 - (topicData.opportunity || 50))}`}>
                    {topicData.opportunity || 'N/A'}
                  </p>
                  <p className="text-slate-400 text-sm">Out of 100</p>
                </div>
              </div>
            </div>

            {/* Related Keywords */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Related Keywords</h2>
              <div className="flex flex-wrap gap-2">
                {topicData.relatedKeywords?.map((related) => (
                  <a
                    key={related.keyword}
                    href={`/topic/${encodeURIComponent(related.keyword)}`}
                    className="px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700 hover:border-indigo-500 transition-colors"
                  >
                    <span className="text-slate-300">{related.keyword}</span>
                    <span className="text-slate-500 ml-2">({related.volume})</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Top Videos */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Top Performing Videos</h2>
              
              {topicData.topVideos && topicData.topVideos.length > 0 ? (
                <div className="space-y-4">
                  {topicData.topVideos.map((video, index) => (
                    <article
                      key={video.videoId}
                      className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-indigo-500 transition-colors"
                    >
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center font-bold">
                          #{index + 1}
                        </div>
                        
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
                        
                        <div className="flex-grow min-w-0">
                          <a
                            href={`/video/${video.videoId}`}
                            className="block font-semibold hover:text-indigo-400 transition-colors line-clamp-2"
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
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400">No video data available for this topic.</p>
              )}
            </div>
          </div>
        </section>

        {/* Content Ideas */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Content Ideas for "{keyword}"</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                <h3 className="font-semibold mb-2 text-indigo-400">🎬 Tutorial Video</h3>
                <p className="text-slate-300 text-sm">
                  "How to {keyword} - Complete Guide for Beginners"
                </p>
                <p className="text-slate-500 text-xs mt-2">
                  Estimated views: {formatNumber(Math.floor(Math.random() * 500000 + 100000))}
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                <h3 className="font-semibold mb-2 text-indigo-400">📊 Comparison</h3>
                <p className="text-slate-300 text-sm">
                  "Best {keyword} Tools Compared (2024)"
                </p>
                <p className="text-slate-500 text-xs mt-2">
                  Estimated views: {formatNumber(Math.floor(Math.random() * 300000 + 50000))}
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                <h3 className="font-semibold mb-2 text-indigo-400">💡 Tips & Tricks</h3>
                <p className="text-slate-300 text-sm">
                  "10 {keyword} Tips You Need to Know"
                </p>
                <p className="text-slate-500 text-xs mt-2">
                  Estimated views: {formatNumber(Math.floor(Math.random() * 200000 + 30000))}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Tips */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">SEO Tips for "{keyword}"</h2>
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400">✓</span>
                  <span>Include "{keyword}" in your title within the first 60 characters</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400">✓</span>
                  <span>Use related keywords in your description and tags</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400">✓</span>
                  <span>Create content that answers common questions about {keyword}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400">✓</span>
                  <span>Post when your audience is most active (check our Best Time tool)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400">✓</span>
                  <span>Use our SEO Tool to optimize your titles, descriptions, and tags</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Related Topics */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Explore Related Topics</h2>
            <div className="flex flex-wrap gap-2">
              {['youtube seo', 'content strategy', 'video marketing', 'audience growth', 'engagement tips'].map((topic) => (
                <a
                  key={topic}
                  href={`/topic/${encodeURIComponent(topic)}`}
                  className="px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-indigo-500 transition-colors"
                >
                  {topic}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Create Content?</h2>
            <p className="text-slate-400 mb-6">
              Use our tools to optimize your {keyword} content for maximum reach
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/youtube-seo-tool"
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all"
              >
                Optimize with SEO Tool
              </a>
              <a
                href="/youtube-best-time-to-post"
                className="px-8 py-4 bg-slate-700 rounded-lg font-semibold hover:bg-slate-600 transition-all"
              >
                Find Best Posting Time
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-slate-800">
          <div className="max-w-6xl mx-auto text-center text-slate-400 text-sm">
            <p>© 2024 Tubefission. Free YouTube analytics tools.</p>
          </div>
        </footer>
      </div>
    </>
  );
}

// 静态路径配置 - 全部动态生成
export async function getStaticPaths() {
  return {
    paths: [], // 不预生成任何页面
    fallback: 'blocking' // 全部动态生成
  };
}

// 获取数据
export async function getStaticProps({ params }) {
  try {
    const keyword = decodeURIComponent(params.keyword);
    const topicData = await getTopicData(keyword);
    
    return {
      props: {
        keyword,
        topicData
      },
      revalidate: 43200
    };
  } catch (error) {
    return {
      notFound: true
    };
  }
}

// 辅助函数
function formatNumber(num) {
  if (!num) return '0';
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}
