import React, { useState } from 'react';
import SEOHead from '../components/SEOHead';
import InternalLinking from '../components/InternalLinking';
import RegionFilter from '../components/RegionFilter';
import { useRegionFilter } from '../hooks/useRegionFilter';
import { seoToolSEO } from '../tubefission-seo-config';

/**
 * YouTube SEO Tool页面
 * 优化视频标题、标签、描述
 */
const YouTubeSEOTool = () => {
  const { selectedRegion, handleRegionChange, regionName } = useRegionFilter('US');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoTags, setVideoTags] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [analysis, setAnalysis] = useState(null);

  // SEO分析函数
  const analyzeSEO = () => {
    const titleLength = videoTitle.length;
    const descriptionLength = videoDescription.length;
    const tagsArray = videoTags.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    // 标题评分
    let titleScore = 0;
    let titleIssues = [];
    if (titleLength >= 50 && titleLength <= 60) titleScore += 30;
    else if (titleLength < 50) titleIssues.push('Title is too short (aim for 50-60 characters)');
    else titleIssues.push('Title is too long (keep under 60 characters)');
    
    if (targetKeyword && videoTitle.toLowerCase().includes(targetKeyword.toLowerCase())) titleScore += 30;
    else if (targetKeyword) titleIssues.push('Target keyword not found in title');
    
    if (/\d/.test(videoTitle)) titleScore += 20;
    if (/[!?]/.test(videoTitle)) titleScore += 10;
    if (videoTitle.split(' ').length >= 5) titleScore += 10;

    // 描述评分
    let descriptionScore = 0;
    let descriptionIssues = [];
    if (descriptionLength >= 150) descriptionScore += 30;
    else descriptionIssues.push('Description is too short (aim for 150+ characters)');
    
    if (descriptionLength >= 500) descriptionScore += 20;
    if (targetKeyword && videoDescription.toLowerCase().includes(targetKeyword.toLowerCase())) descriptionScore += 30;
    else if (targetKeyword) descriptionIssues.push('Target keyword not found in description');
    
    if (videoDescription.includes('http')) descriptionScore += 10;
    if (videoDescription.includes('#')) descriptionScore += 10;

    // 标签评分
    let tagsScore = 0;
    let tagsIssues = [];
    if (tagsArray.length >= 5) tagsScore += 40;
    else tagsIssues.push('Add more tags (aim for 5-15 tags)');
    
    if (tagsArray.length <= 15) tagsScore += 20;
    else tagsIssues.push('Too many tags (keep under 15)');
    
    if (targetKeyword && tagsArray.some(tag => tag.toLowerCase() === targetKeyword.toLowerCase())) tagsScore += 30;
    else if (targetKeyword) tagsIssues.push('Include exact target keyword in tags');
    
    if (tagsArray.some(tag => tag.length > 20)) tagsScore += 10;

    const totalScore = Math.round((titleScore + descriptionScore + tagsScore) / 3);

    // 生成建议
    const suggestions = [
      ...(titleScore < 70 ? titleIssues : []),
      ...(descriptionScore < 70 ? descriptionIssues : []),
      ...(tagsScore < 70 ? tagsIssues : []),
      totalScore >= 80 ? 'Great job! Your SEO is well optimized.' : null,
      titleScore >= 80 && descriptionScore >= 80 ? 'Consider A/B testing different titles to improve CTR.' : null,
      descriptionScore < 80 ? 'Add timestamps to your description to improve engagement.' : null
    ].filter(Boolean);

    // 生成推荐标签
    const recommendedTags = targetKeyword ? [
      targetKeyword,
      `${targetKeyword} tutorial`,
      `${targetKeyword} guide`,
      `${targetKeyword} 2024`,
      `how to ${targetKeyword}`,
      `${targetKeyword} tips`,
      `${targetKeyword} for beginners`,
      `best ${targetKeyword}`,
      ...tagsArray
    ].slice(0, 15) : [];

    setAnalysis({
      titleScore,
      descriptionScore,
      tagsScore,
      totalScore,
      suggestions,
      recommendedTags,
      titleLength,
      descriptionLength,
      tagsCount: tagsArray.length
    });
  };

  // FAQ数据
  const faqs = [
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
    }
  ];

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-500/20 border-green-500';
    if (score >= 60) return 'bg-yellow-500/20 border-yellow-500';
    return 'bg-red-500/20 border-red-500';
  };

  return (
    <>
      <SEOHead
        title={seoToolSEO.title}
        description={seoToolSEO.description}
        canonical="https://tubefission.com/youtube-seo-tool"
        ogImage="https://tubefission.com/og-seo-tool.png"
        schemas={[
          {
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
          }
        ]}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
        {/* Region Filter Bar */}
        <div className="py-4 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
          <div className="max-w-6xl mx-auto flex justify-end">
            <RegionFilter selectedRegion={selectedRegion} onRegionChange={handleRegionChange} />
          </div>
        </div>

        {/* Hero Section */}
        <section className="pt-16 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              YouTube SEO Tool
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Optimize your video titles, descriptions, and tags for better search rankings. 
              Free AI-powered SEO analysis.
            </p>
          </div>
        </section>

        {/* Input Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
              {/* Target Keyword */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Target Keyword (Optional)
                </label>
                <input
                  type="text"
                  value={targetKeyword}
                  onChange={(e) => setTargetKeyword(e.target.value)}
                  placeholder="e.g., youtube seo, video marketing"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-xs text-slate-400 mt-1">
                  The main keyword you want to rank for
                </p>
              </div>

              {/* Video Title */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Video Title
                </label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="Enter your video title..."
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>{videoTitle.length} / 100 characters</span>
                  <span>Recommended: 50-60 characters</span>
                </div>
              </div>

              {/* Video Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Video Description
                </label>
                <textarea
                  value={videoDescription}
                  onChange={(e) => setVideoDescription(e.target.value)}
                  placeholder="Enter your video description..."
                  rows={5}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 resize-none"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>{videoDescription.length} / 5000 characters</span>
                  <span>Recommended: 150+ characters</span>
                </div>
              </div>

              {/* Video Tags */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Video Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={videoTags}
                  onChange={(e) => setVideoTags(e.target.value)}
                  placeholder="tag1, tag2, tag3..."
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>{videoTags.split(',').filter(t => t.trim()).length} tags</span>
                  <span>Recommended: 5-15 tags</span>
                </div>
              </div>

              {/* Analyze Button */}
              <button
                onClick={analyzeSEO}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg font-semibold text-white hover:from-indigo-500 hover:to-purple-500 transition-all transform hover:scale-[1.02]"
              >
                Analyze SEO Score
              </button>
            </div>
          </div>
        </section>

        {/* Analysis Results */}
        {analysis && (
          <section className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">SEO Analysis Results</h2>
              
              {/* Overall Score */}
              <div className={`rounded-xl p-8 mb-6 border-2 ${getScoreBg(analysis.totalScore)}`}>
                <div className="text-center">
                  <p className="text-slate-300 mb-2">Overall SEO Score</p>
                  <p className={`text-5xl font-bold ${getScoreColor(analysis.totalScore)}`}>
                    {analysis.totalScore}/100
                  </p>
                  <p className="text-slate-400 mt-2">
                    {analysis.totalScore >= 80 ? 'Excellent!' : 
                     analysis.totalScore >= 60 ? 'Good, but can be improved' : 
                     'Needs significant improvement'}
                  </p>
                </div>
              </div>

              {/* Individual Scores */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                  <p className="text-slate-400 text-sm mb-2">Title Score</p>
                  <p className={`text-3xl font-bold ${getScoreColor(analysis.titleScore)}`}>
                    {analysis.titleScore}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{analysis.titleLength} chars</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                  <p className="text-slate-400 text-sm mb-2">Description Score</p>
                  <p className={`text-3xl font-bold ${getScoreColor(analysis.descriptionScore)}`}>
                    {analysis.descriptionScore}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{analysis.descriptionLength} chars</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                  <p className="text-slate-400 text-sm mb-2">Tags Score</p>
                  <p className={`text-3xl font-bold ${getScoreColor(analysis.tagsScore)}`}>
                    {analysis.tagsScore}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{analysis.tagsCount} tags</p>
                </div>
              </div>

              {/* Suggestions */}
              {analysis.suggestions.length > 0 && (
                <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 mb-6">
                  <h3 className="font-semibold mb-4">Improvement Suggestions</h3>
                  <ul className="space-y-2">
                    {analysis.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2 text-slate-300">
                        <span className="text-indigo-400 mt-1">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommended Tags */}
              {analysis.recommendedTags.length > 0 && (
                <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                  <h3 className="font-semibold mb-4">Recommended Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.recommendedTags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-sm cursor-pointer hover:bg-indigo-500/30"
                        onClick={() => {
                          const newTags = videoTags ? `${videoTags}, ${tag}` : tag;
                          setVideoTags(newTags);
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-3">
                    Click any tag to add it to your tags
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* SEO Tips */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">YouTube SEO Best Practices</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                <h3 className="font-semibold mb-2 text-indigo-400">🎯 Title Optimization</h3>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• Keep titles 50-60 characters</li>
                  <li>• Include target keyword early</li>
                  <li>• Use numbers and brackets</li>
                  <li>• Add emotional triggers</li>
                </ul>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                <h3 className="font-semibold mb-2 text-indigo-400">📝 Description Tips</h3>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• Write 150+ characters</li>
                  <li>• Include keywords naturally</li>
                  <li>• Add timestamps</li>
                  <li>• Include call-to-action</li>
                </ul>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                <h3 className="font-semibold mb-2 text-indigo-400">🏷️ Tag Strategy</h3>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• Use 5-15 relevant tags</li>
                  <li>• Include exact match keyword</li>
                  <li>• Add long-tail variations</li>
                  <li>• Research competitor tags</li>
                </ul>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                <h3 className="font-semibold mb-2 text-indigo-400">📊 Engagement Factors</h3>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• High CTR thumbnails</li>
                  <li>• Strong hook in first 30s</li>
                  <li>• Encourage comments</li>
                  <li>• End screen cards</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold mb-2 text-indigo-400">{faq.question}</h3>
                  <p className="text-slate-300">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Tools */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Related Tools</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <a href="/youtube-money-calculator" className="block bg-slate-800/50 rounded-lg p-6 border border-slate-700 hover:border-indigo-500 transition-colors">
                <h3 className="font-semibold mb-2">Money Calculator</h3>
                <p className="text-sm text-slate-400">Estimate your earnings</p>
              </a>
              <a href="/youtube-video-analyzer" className="block bg-slate-800/50 rounded-lg p-6 border border-slate-700 hover:border-indigo-500 transition-colors">
                <h3 className="font-semibold mb-2">Video Analyzer</h3>
                <p className="text-sm text-slate-400">Deep video analysis</p>
              </a>
              <a href="/youtube-channel-analytics" className="block bg-slate-800/50 rounded-lg p-6 border border-slate-700 hover:border-indigo-500 transition-colors">
                <h3 className="font-semibold mb-2">Channel Analytics</h3>
                <p className="text-sm text-slate-400">Analyze any channel</p>
              </a>
            </div>
          </div>
        </section>

        {/* Internal Links */}
        <InternalLinking links={[
          { href: '/youtube-niche-finder', title: 'YouTube Niche Finder', description: 'Discover profitable content niches with AI-powered analysis and CPM data.' },
          { href: '/youtube-opportunity-finder', title: 'YouTube Opportunity Finder', description: 'Find untapped content opportunities and high-potential niches in your market.' },
          { href: '/youtube-best-time-to-post', title: 'Best Time to Post', description: 'Find the optimal posting schedule for maximum views and audience engagement.' },
          { href: '/channel', title: 'Channel Analytics', description: 'Analyze any YouTube channel for growth metrics, engagement, and competitor insights.' },
        ]} />

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-slate-800">
          <div className="max-w-4xl mx-auto text-center text-slate-400 text-sm">
            <p>© 2024 Tubefission. Free YouTube analytics tools.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default YouTubeSEOTool;
