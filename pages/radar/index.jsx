import React, { useState, useMemo } from 'react';
import SEOHead from '../../components/SEOHead';
import InternalLinking from '../../components/InternalLinking';
import {
  ViralRadarCard,
  SignalBadge,
  VPSGauge,
  RegionSelector,
  TrendChart,
  REGIONS,
} from '../../components/viral-radar';

/**
 * 爆款雷达系统 - 仪表盘页面
 * Viral Radar Dashboard
 * 
 * 功能：
 * - 区域筛选器（US/JP/KR/GB/HK/TW）
 * - VPS卡片展示（分数+分级+类别）
 * - 实时信号流列表
 * - 趋势图表
 */

// 模拟数据生成器
const generateMockData = (region) => {
  const categories = ['Technology', 'Gaming', 'Music', 'Entertainment', 'Education', 'Sports', 'Fashion', 'Food'];
  const signals = [['trending'], ['viral'], ['breakout'], ['early'], ['trending', 'viral'], ['breakout', 'early']];
  
  const baseData = [
    {
      id: '1',
      title: 'iPhone 16 Pro Max - 完整评测与隐藏功能',
      channelName: 'TechReviewer Pro',
      thumbnail: 'https://images.unsplash.com/photo-1511707171634-5b89735cf1a4?w=400&h=225&fit=crop',
      vpsScore: 94,
      grade: 'S',
      category: 'Technology',
      signals: ['trending', 'viral'],
      viewCount: 2500000,
      growthRate: 156.7,
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      title: 'Black Myth: Wukong - 终极BOSS攻略',
      channelName: 'GamingMaster',
      thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=225&fit=crop',
      vpsScore: 88,
      grade: 'A',
      category: 'Gaming',
      signals: ['viral', 'breakout'],
      viewCount: 1200000,
      growthRate: 89.3,
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      title: '2024年最火K-pop舞蹈挑战合集',
      channelName: 'KpopDanceCentral',
      thumbnail: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=225&fit=crop',
      vpsScore: 85,
      grade: 'A',
      category: 'Music',
      signals: ['trending'],
      viewCount: 890000,
      growthRate: 67.5,
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      title: 'AI绘画工具对比测试 - Midjourney vs DALL-E 3',
      channelName: 'AI Creative Lab',
      thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=225&fit=crop',
      vpsScore: 82,
      grade: 'A',
      category: 'Technology',
      signals: ['early', 'breakout'],
      viewCount: 650000,
      growthRate: 45.2,
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '5',
      title: '日本便利店美食终极指南',
      channelName: 'JapanFoodie',
      thumbnail: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=400&h=225&fit=crop',
      vpsScore: 78,
      grade: 'B',
      category: 'Food',
      signals: ['trending'],
      viewCount: 420000,
      growthRate: 34.8,
      publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '6',
      title: 'Squid Game Season 2 - 剧情预测分析',
      channelName: 'SeriesAnalyst',
      thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=225&fit=crop',
      vpsScore: 76,
      grade: 'B',
      category: 'Entertainment',
      signals: ['viral'],
      viewCount: 380000,
      growthRate: 28.9,
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  // 根据区域调整数据
  const regionMultiplier = {
    US: 1.5,
    JP: 1.3,
    KR: 1.4,
    GB: 1.2,
    HK: 1.1,
    TW: 1.15,
  };

  return baseData.map(item => ({
    ...item,
    viewCount: Math.floor(item.viewCount * (regionMultiplier[region] || 1) * (0.8 + Math.random() * 0.4)),
    vpsScore: Math.min(100, Math.floor(item.vpsScore + (Math.random() * 10 - 5))),
  }));
};

// 生成趋势数据
const generateTrendData = (region) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const baseMultiplier = {
    US: 1.5, JP: 1.2, KR: 1.3, GB: 1.1, HK: 1.0, TW: 1.05,
  };
  const multiplier = baseMultiplier[region] || 1;

  return days.map((day, i) => ({
    label: day,
    value: Math.floor((50000 + Math.random() * 30000) * multiplier * (1 + i * 0.1)),
    value2: Math.floor((40000 + Math.random() * 25000) * multiplier),
  }));
};

// 生成实时信号流数据
const generateSignalStream = (region) => {
  const signalTypes = ['trending', 'viral', 'breakout', 'early'];
  const categories = ['Technology', 'Gaming', 'Music', 'Entertainment', 'Education'];
  
  return Array.from({ length: 10 }, (_, i) => ({
    id: `signal-${i}`,
    type: signalTypes[Math.floor(Math.random() * signalTypes.length)],
    title: [
      '新信号检测：科技类视频播放量激增',
      '病毒式传播：游戏视频分享量暴涨',
      '突破信号：音乐视频互动率创新高',
      '早期机会：教育类内容搜索量上升',
      '热门趋势：娱乐视频评论活跃度增加',
    ][Math.floor(Math.random() * 5)],
    category: categories[Math.floor(Math.random() * categories.length)],
    timestamp: new Date(Date.now() - i * 15 * 60 * 1000).toISOString(),
    strength: Math.floor(60 + Math.random() * 40),
  }));
};

// FAQ数据
const radarFaqs = [
  {
    question: '什么是VPS分数？',
    answer: 'VPS (Viral Potential Score) 是爆款潜力分数，基于多维度算法计算，包括观看增长率、互动率、分享率、评论质量等因素，分数范围0-100，分数越高表示视频成为爆款的潜力越大。',
  },
  {
    question: '信号类型代表什么？',
    answer: 'Trending(热门)：正在热门趋势中的内容；Viral(病毒式)：呈现病毒式传播特征；Breakout(突破)：突破常规增长曲线；Early(早期)：早期信号，有机会在爆发前介入。',
  },
  {
    question: '如何使用区域筛选器？',
    answer: '点击区域按钮(US/JP/KR/GB/HK/TW)可切换不同地区的数据。不同地区的爆款趋势可能存在差异，了解多地区趋势有助于发现跨区域的爆款机会。',
  },
  {
    question: '分级S/A/B/C/D是什么意思？',
    answer: 'S级(90-100分)：极高爆款潜力；A级(80-89分)：优秀爆款潜力；B级(60-79分)：良好潜力；C级(40-59分)：一般潜力；D级(0-39分)：较低潜力。',
  },
];

export default function ViralRadarPage() {
  const [selectedRegion, setSelectedRegion] = useState('US');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSignal, setSelectedSignal] = useState('all');

  // 获取数据
  const viralData = useMemo(() => generateMockData(selectedRegion), [selectedRegion]);
  const trendData = useMemo(() => generateTrendData(selectedRegion), [selectedRegion]);
  const signalStream = useMemo(() => generateSignalStream(selectedRegion), [selectedRegion]);

  // 过滤数据
  const filteredData = useMemo(() => {
    return viralData.filter(item => {
      const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
      const signalMatch = selectedSignal === 'all' || item.signals.includes(selectedSignal);
      return categoryMatch && signalMatch;
    });
  }, [viralData, selectedCategory, selectedSignal]);

  // 统计数据
  const stats = useMemo(() => {
    const totalViews = filteredData.reduce((sum, item) => sum + item.viewCount, 0);
    const avgVPS = filteredData.length > 0 
      ? Math.floor(filteredData.reduce((sum, item) => sum + item.vpsScore, 0) / filteredData.length)
      : 0;
    const sGradeCount = filteredData.filter(item => item.grade === 'S').length;
    
    return { totalViews, avgVPS, sGradeCount, totalCount: filteredData.length };
  }, [filteredData]);

  // 格式化数字
  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // 格式化时间
  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const categories = ['all', 'Technology', 'Gaming', 'Music', 'Entertainment', 'Education', 'Sports', 'Fashion', 'Food'];
  const signalTypes = ['all', 'trending', 'viral', 'breakout', 'early'];

  return (
    <div className="min-h-screen bg-slate-900">
      <SEOHead
        title="Viral Radar - Global Content Early Warning System | TubeFission"
        description="Discover trending content before it goes viral. Real-time viral potential scoring, signal detection, and trend analysis across US, JP, KR, GB, HK, TW regions."
      />

      {/* Header */}
      <header className="bg-slate-800/50 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">📡</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Viral Radar</h1>
                <p className="text-slate-400 text-sm">Global Content Early Warning System</p>
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
        {/* Stats Overview */}
        <section className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
              <p className="text-slate-400 text-sm">Total Views</p>
              <p className="text-2xl font-bold text-white">{formatNumber(stats.totalViews)}</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
              <p className="text-slate-400 text-sm">Avg VPS</p>
              <p className={`text-2xl font-bold ${stats.avgVPS >= 80 ? 'text-emerald-400' : 'text-blue-400'}`}>
                {stats.avgVPS}
              </p>
            </div>
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
              <p className="text-slate-400 text-sm">S-Grade Content</p>
              <p className="text-2xl font-bold text-amber-400">{stats.sGradeCount}</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
              <p className="text-slate-400 text-sm">Tracked Videos</p>
              <p className="text-2xl font-bold text-white">{stats.totalCount}</p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Categories</option>
                {categories.filter(c => c !== 'all').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm">Signal:</span>
              <select
                value={selectedSignal}
                onChange={(e) => setSelectedSignal(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Signals</option>
                {signalTypes.filter(s => s !== 'all').map(sig => (
                  <option key={sig} value={sig}>{sig.charAt(0).toUpperCase() + sig.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Viral Cards */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Trending Content</h2>
              <SignalList signals={['trending', 'viral', 'breakout', 'early']} size="sm" />
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {filteredData.map((item) => (
                <ViralRadarCard
                  key={item.id}
                  {...item}
                  onClick={() => console.log('Clicked:', item.id)}
                />
              ))}
            </div>

            {/* Trend Chart */}
            <TrendChart
              data={trendData}
              title="Weekly Trend Analysis"
              description={`View growth trends for ${REGIONS.find(r => r.code === selectedRegion)?.name}`}
              height={250}
              showGrid
              showDots
              fillArea
            />
          </div>

          {/* Right Column - Signal Stream */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Live Signal Stream</h2>
            
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 space-y-3">
              {signalStream.map((signal) => (
                <div
                  key={signal.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors cursor-pointer"
                >
                  <SignalBadge type={signal.type} size="sm" animated />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{signal.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-slate-400 text-xs">{signal.category}</span>
                      <span className="text-slate-500 text-xs">• {formatTime(signal.timestamp)}</span>
                    </div>
                  </div>
                  <VPSGauge score={signal.strength} size="sm" showLabel={false} showScore={false} />
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/30 p-4">
              <h3 className="text-white font-semibold mb-3">Signal Distribution</h3>
              <div className="space-y-2">
                {['trending', 'viral', 'breakout', 'early'].map(type => {
                  const count = signalStream.filter(s => s.type === type).length;
                  const percent = (count / signalStream.length) * 100;
                  return (
                    <div key={type} className="flex items-center gap-2">
                      <SignalBadge type={type} size="sm" />
                      <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-slate-400 text-xs w-8 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {radarFaqs.map((faq, idx) => (
              <div key={idx} className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
                <h3 className="text-white font-semibold mb-2">{faq.question}</h3>
                <p className="text-slate-400 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Internal Linking */}
        <section className="mt-12">
          <InternalLinking currentPage="viral-radar" />
        </section>
      </main>
    </div>
  );
}
