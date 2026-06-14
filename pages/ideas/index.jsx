import React, { useState, useCallback } from 'react';
import SEOHead from '../../components/SEOHead';
import InternalLinking from '../../components/InternalLinking';
import {
  ViralRadarCard,
  SignalBadge,
  RegionSelector,
  REGIONS,
} from '../../components/viral-radar';

/**
 * 选题生成器页面
 * Content Idea Generator
 * 
 * 功能：
 * - 基于爆款信号生成选题
 * - AI标题建议
 * - Thumbnail设计建议
 * - 竞争分析
 */

// 模拟AI生成的标题
const generateAITitles = (topic, count = 5) => {
  const templates = [
    `终极指南：${topic} - 99%的人都不知道`,
    `${topic}的真相 - 看完这个视频你就懂了`,
    `我花了100小时研究${topic}，这是我发现的`,
    `${topic}完全教程 - 从零开始到精通`,
    `为什么${topic}这么火？深度解析`,
    `${topic}的5个秘密技巧 - 立即提升你的水平`,
    `专业人士如何${topic}？独家揭秘`,
    `${topic}新手必看 - 避免这些常见错误`,
    `${topic}的未来趋势 - 2024年最新预测`,
    `我用${topic}改变了生活 - 真实案例分享`,
  ];
  
  return templates.slice(0, count).map((title, i) => ({
    id: `title-${i}`,
    title: title.replace(/${topic}/g, topic),
    score: Math.floor(70 + Math.random() * 25),
    tags: ['CTR优化', 'SEO友好', '情感触发'].slice(0, Math.floor(Math.random() * 3) + 1),
  }));
};

// 模拟缩略图建议
const generateThumbnailIdeas = (topic) => {
  return [
    {
      id: 'thumb-1',
      title: '震惊表情 + 对比图',
      description: `使用惊讶表情配合"Before/After"对比，突出${topic}的效果`,
      elements: ['惊讶表情', '箭头指向', '高对比色彩'],
      colorScheme: '红/黄高对比',
      ctrEstimate: '8.5%',
    },
    {
      id: 'thumb-2',
      title: '数字清单风格',
      description: `大数字"5"配合清单项目，展示${topic}的关键点`,
      elements: ['大号数字', '勾选标记', '清晰文字'],
      colorScheme: '蓝/白专业风',
      ctrEstimate: '7.2%',
    },
    {
      id: 'thumb-3',
      title: '问题悬念式',
      description: `提出关于${topic}的悬念问题，激发好奇心`,
      elements: ['问号图标', '模糊处理', ' teasertext'],
      colorScheme: '紫/黑神秘风',
      ctrEstimate: '9.1%',
    },
    {
      id: 'thumb-4',
      title: '结果展示型',
      description: `直接展示${topic}的成果/效果，用数据说话`,
      elements: ['数据可视化', '成果截图', '增长箭头'],
      colorScheme: '绿/金成功风',
      ctrEstimate: '6.8%',
    },
  ];
};

// 模拟竞争分析
const generateCompetitorAnalysis = (topic) => {
  return [
    {
      id: 'comp-1',
      channelName: 'TechGuru Pro',
      videoTitle: `${topic}完全指南2024`,
      viewCount: 2500000,
      uploadDate: '2024-01-15',
      strengths: ['信息全面', '制作精良', 'SEO优化好'],
      weaknesses: ['视频过长', '节奏较慢', '缺乏互动'],
      gaps: ['缺少实操演示', '没有对比分析', '未覆盖最新功能'],
    },
    {
      id: 'comp-2',
      channelName: 'QuickTips Daily',
      videoTitle: `5分钟学会${topic}`,
      viewCount: 890000,
      uploadDate: '2024-02-01',
      strengths: ['短小精悍', '节奏快', '易理解'],
      weaknesses: ['深度不够', '信息有遗漏', '画质一般'],
      gaps: ['可以更深入', '添加案例', '专业度提升'],
    },
    {
      id: 'comp-3',
      channelName: 'Expert Insights',
      videoTitle: `${topic}的行业秘密`,
      viewCount: 1200000,
      uploadDate: '2024-01-28',
      strengths: ['专业权威', '独家内容', '观点独特'],
      weaknesses: ['门槛较高', '受众较窄', '互动较少'],
      gaps: ['降低门槛', '增加趣味性', '更多实例'],
    },
  ];
};

// 模拟爆款信号数据
const generateViralSignals = (region) => {
  const signals = [
    {
      id: 'vs-1',
      title: 'AI工具使用教程',
      channelName: 'AI Master',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=225&fit=crop',
      vpsScore: 92,
      grade: 'S',
      category: 'Technology',
      signals: ['trending', 'viral'],
      viewCount: 3200000,
      growthRate: 189.5,
      publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'vs-2',
      title: '高效学习方法',
      channelName: 'StudyPro',
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=225&fit=crop',
      vpsScore: 87,
      grade: 'A',
      category: 'Education',
      signals: ['breakout', 'early'],
      viewCount: 1500000,
      growthRate: 95.3,
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'vs-3',
      title: '健身挑战30天',
      channelName: 'FitLife',
      thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=225&fit=crop',
      vpsScore: 84,
      grade: 'A',
      category: 'Sports',
      signals: ['trending'],
      viewCount: 980000,
      growthRate: 67.8,
      publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    },
  ];
  
  return signals;
};

// FAQ数据
const ideasFaqs = [
  {
    question: '选题生成器如何工作？',
    answer: '选题生成器分析当前爆款视频的信号数据，识别热门趋势和观众兴趣点，然后使用AI算法生成与您的频道定位相关的选题建议。系统会考虑VPS分数、信号类型、区域趋势等多维度数据。',
  },
  {
    question: 'AI标题建议的评分标准是什么？',
    answer: 'AI标题评分基于多个因素：点击率潜力(CTR)、SEO友好度、情感触发强度、独特性、与内容的匹配度。分数越高表示标题越有可能吸引观众点击。',
  },
  {
    question: '如何利用竞争分析？',
    answer: '竞争分析帮助您了解同类视频的表现，识别竞争对手的优势和不足。重点关注"机会缺口"部分，这些是您可以差异化竞争的角度。',
  },
  {
    question: '缩略图设计建议如何选择？',
    answer: '根据您的内容类型和目标受众选择。震惊表情适合教程类，数字清单适合知识类，问题悬念适合揭秘类，结果展示适合案例类。CTR预估仅供参考，实际效果需测试。',
  },
];

export default function IdeaGeneratorPage() {
  const [selectedRegion, setSelectedRegion] = useState('US');
  const [selectedSignal, setSelectedSignal] = useState(null);
  const [generatedTitles, setGeneratedTitles] = useState([]);
  const [thumbnailIdeas, setThumbnailIdeas] = useState([]);
  const [competitorAnalysis, setCompetitorAnalysis] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('titles');

  const viralSignals = generateViralSignals(selectedRegion);

  // 生成选题
  const generateIdeas = useCallback(async (signal) => {
    setIsGenerating(true);
    setSelectedSignal(signal);
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const topic = signal.title;
    setGeneratedTitles(generateAITitles(topic, 5));
    setThumbnailIdeas(generateThumbnailIdeas(topic));
    setCompetitorAnalysis(generateCompetitorAnalysis(topic));
    
    setIsGenerating(false);
  }, []);

  // 格式化数字
  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <SEOHead
        title="Content Idea Generator - AI-Powered Viral Content Ideas | TubeFission"
        description="Generate viral content ideas powered by AI. Get title suggestions, thumbnail designs, and competitor analysis based on trending signals."
      />

      {/* Header */}
      <header className="bg-slate-800/50 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">💡</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Idea Generator</h1>
                <p className="text-slate-400 text-sm">AI-Powered Content Ideas</p>
              </div>
            </div>
            <RegionSelector
              selectedRegion={selectedRegion}
              onRegionChange={setSelectedRegion}
              variant="pills"
              size="md"
              showLabel={false}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step 1: Select Signal */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-indigo-500 text-white text-sm flex items-center justify-center font-medium">1</span>
            <h2 className="text-xl font-semibold text-white">Select a Viral Signal</h2>
          </div>
          <p className="text-slate-400 text-sm mb-4">Choose a trending video to generate content ideas based on its viral pattern</p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {viralSignals.map((signal) => (
              <div
                key={signal.id}
                onClick={() => generateIdeas(signal)}
                className={`cursor-pointer transition-all ${
                  selectedSignal?.id === signal.id 
                    ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900' 
                    : ''
                }`}
              >
                <ViralRadarCard {...signal} />
              </div>
            ))}
          </div>
        </section>

        {/* Loading State */}
        {isGenerating && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-slate-400">Generating AI-powered ideas...</span>
            </div>
          </div>
        )}

        {/* Generated Content */}
        {!isGenerating && selectedSignal && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-indigo-500 text-white text-sm flex items-center justify-center font-medium">2</span>
              <h2 className="text-xl font-semibold text-white">Generated Ideas for "{selectedSignal.title}"</h2>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-slate-700">
              {[
                { id: 'titles', label: 'AI Titles', icon: '📝' },
                { id: 'thumbnails', label: 'Thumbnails', icon: '🎨' },
                { id: 'competitors', label: 'Competitors', icon: '📊' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-indigo-400 border-b-2 border-indigo-400'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
              {/* AI Titles Tab */}
              {activeTab === 'titles' && (
                <div className="space-y-4">
                  <p className="text-slate-400 text-sm mb-4">AI-generated title suggestions optimized for CTR and SEO</p>
                  {generatedTitles.map((title, idx) => (
                    <div
                      key={title.id}
                      className="flex items-start gap-4 p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium mb-2">{title.title}</h3>
                        <div className="flex items-center gap-2">
                          {title.tags.map((tag, tidx) => (
                            <span
                              key={tidx}
                              className="px-2 py-0.5 bg-slate-600/50 rounded text-slate-300 text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className={`text-2xl font-bold ${title.score >= 85 ? 'text-emerald-400' : 'text-blue-400'}`}>
                          {title.score}
                        </div>
                        <div className="text-slate-500 text-xs">Score</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Thumbnails Tab */}
              {activeTab === 'thumbnails' && (
                <div className="space-y-4">
                  <p className="text-slate-400 text-sm mb-4">Thumbnail design suggestions with CTR estimates</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {thumbnailIdeas.map((idea) => (
                      <div
                        key={idea.id}
                        className="p-4 rounded-lg bg-slate-700/30 border border-slate-600/50 hover:border-indigo-500/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-white font-semibold">{idea.title}</h3>
                          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-sm font-medium">
                            CTR {idea.ctrEstimate}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm mb-3">{idea.description}</p>
                        <div className="mb-3">
                          <span className="text-slate-500 text-xs">Color Scheme: </span>
                          <span className="text-slate-300 text-sm">{idea.colorScheme}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {idea.elements.map((element, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-slate-600/50 rounded text-slate-300 text-xs"
                            >
                              {element}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Competitors Tab */}
              {activeTab === 'competitors' && (
                <div className="space-y-4">
                  <p className="text-slate-400 text-sm mb-4">Competitor analysis and content gaps</p>
                  {competitorAnalysis.map((comp) => (
                    <div
                      key={comp.id}
                      className="p-4 rounded-lg bg-slate-700/30 border border-slate-600/50"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-white font-semibold">{comp.videoTitle}</h3>
                          <p className="text-slate-400 text-sm">{comp.channelName}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-medium">{formatNumber(comp.viewCount)} views</div>
                          <div className="text-slate-500 text-xs">{comp.uploadDate}</div>
                        </div>
                      </div>
                      
                      <div className="grid sm:grid-cols-3 gap-4 mt-4">
                        <div>
                          <h4 className="text-emerald-400 text-sm font-medium mb-2">✓ Strengths</h4>
                          <ul className="space-y-1">
                            {comp.strengths.map((s, i) => (
                              <li key={i} className="text-slate-400 text-xs">{s}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-red-400 text-sm font-medium mb-2">✗ Weaknesses</h4>
                          <ul className="space-y-1">
                            {comp.weaknesses.map((w, i) => (
                              <li key={i} className="text-slate-400 text-xs">{w}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-amber-400 text-sm font-medium mb-2">◆ Content Gaps</h4>
                          <ul className="space-y-1">
                            {comp.gaps.map((g, i) => (
                              <li key={i} className="text-slate-400 text-xs">{g}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Empty State */}
        {!selectedSignal && !isGenerating && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">👆</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Select a Viral Signal</h3>
            <p className="text-slate-400 text-sm">Click on any trending video above to generate AI-powered content ideas</p>
          </div>
        )}

        {/* FAQ Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {ideasFaqs.map((faq, idx) => (
              <div key={idx} className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
                <h3 className="text-white font-semibold mb-2">{faq.question}</h3>
                <p className="text-slate-400 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Internal Linking */}
        <section className="mt-12">
          <InternalLinking currentPage="idea-generator" />
        </section>
      </main>
    </div>
  );
}
