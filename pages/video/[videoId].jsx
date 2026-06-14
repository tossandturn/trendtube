import React from 'react';
import SEOHead from '../../components/SEOHead';
import InternalLinking from '../../components/InternalLinking';
import { analyzeVideo, analyzeVideoSEO } from '../../lib/youtube-analytics-engine';
import { 
  getVideoAnalysis,
  generateVideoSEO,
  generateVideoSchema,
  generateBreadcrumbSchema
} from '../../programmatic-seo-infrastructure';

/**
 * Video Analysis Page — Professional Grade
 * /video/[videoId]
 * 
 * Uses youtube-analytics-engine for deep analysis
 */
export default function VideoAnalysisPage({ videoId, videoData }) {
  const seo = generateVideoSEO(videoData);
  const videoSchema = generateVideoSchema(videoData);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Video Analysis', path: '/youtube-video-analyzer' },
    { name: videoData.title?.slice(0, 30) + '...', path: `/video/${videoId}` }
  ]);

  // === Run professional analysis ===
  const analysis = analyzeVideo(videoData);
  const seoAnalysis = analyzeVideoSEO(videoData);

  const formatDuration = (duration) => {
    const match = duration?.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return duration || 'N/A';
    const hours = (match[1] || '').replace('H', '');
    const minutes = (match[2] || '').replace('M', '');
    const seconds = (match[3] || '').replace('S', '');
    let result = '';
    if (hours) result += `${hours}:`;
    result += `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    return result;
  };

  const formatNumber = (n) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return (n || 0).toLocaleString();
  };

  const daysSincePublished = getDaysSince(videoData.publishedAt);

  // Score color helper
  const scoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const scoreBg = (score) => {
    if (score >= 80) return 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30';
    if (score >= 60) return 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30';
    if (score >= 40) return 'from-orange-500/20 to-orange-600/10 border-orange-500/30';
    return 'from-red-500/20 to-red-600/10 border-red-500/30';
  };

  const gradeColor = (grade) => {
    if (grade === 'A+' || grade === 'A') return 'text-emerald-400';
    if (grade === 'B+' || grade === 'B') return 'text-cyan-400';
    if (grade === 'C+' || grade === 'C') return 'text-yellow-400';
    return 'text-red-400';
  };

  const performanceLabel = (p) => {
    const map = { well_above: '🚀 Far Above Average', above: '📈 Above Average', average: '➡️ Average', below: '📉 Below Average', well_below: '⚠️ Well Below Average' };
    return map[p] || p;
  };

  const performanceColor = (p) => {
    const map = { well_above: 'text-emerald-400', above: 'text-green-400', average: 'text-slate-300', below: 'text-orange-400', well_below: 'text-red-400' };
    return map[p] || 'text-slate-300';
  };

  const trendIcon = (t) => {
    if (t === 'accelerating') return '🚀';
    if (t === 'decelerating') return '📉';
    return '➡️';
  };

  const priorityColor = (p) => {
    if (p === 'high') return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (p === 'medium') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  return (
    <>
      <SEOHead
        title={seo.title}
        description={seo.description}
        canonical={`https://tubefission.com/video/${videoId}`}
        ogImage={videoData.thumbnail}
        ogType="video.other"
        schemas={[videoSchema, breadcrumbSchema]}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">

        {/* Breadcrumb */}
        <nav className="py-4 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
          <div className="max-w-6xl mx-auto">
            <ol className="flex items-center space-x-2 text-sm text-slate-400">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li>/</li>
              <li><a href="/youtube-video-analyzer" className="hover:text-white transition-colors">Video Analyzer</a></li>
              <li>/</li>
              <li className="text-white truncate max-w-xs">{videoData.title}</li>
            </ol>
          </div>
        </nav>

        {/* ========== HERO: Video + Overall Score ========== */}
        <section className="pt-8 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-8">
              {/* Video Preview (3 cols) */}
              <div className="lg:col-span-3">
                <div className="aspect-video bg-slate-800 rounded-xl overflow-hidden border border-slate-700 mb-4">
                  <a href={`https://youtube.com/watch?v=${videoId}`} target="_blank" rel="noopener noreferrer" className="block w-full h-full relative group">
                    <img src={videoData.thumbnail} alt={videoData.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-sm">{formatDuration(videoData.duration)}</div>
                  </a>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-3">{videoData.title}</h1>
                <a href={`/channel/${videoData.channelId}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <div className="w-10 h-10 bg-slate-700 rounded-full overflow-hidden">
                    <img src={videoData.channelThumbnail || '/default-avatar.png'} alt={videoData.channelTitle} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold">{videoData.channelTitle}</p>
                    <p className="text-sm text-slate-400">{daysSincePublished} days ago</p>
                  </div>
                </a>
                <div className="flex flex-wrap gap-2 mt-4">
                  {videoData.tags?.slice(0, 8).map((tag) => (
                    <a key={tag} href={`/topic/${encodeURIComponent(tag)}`} className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300 hover:bg-slate-700 transition-colors">#{tag}</a>
                  ))}
                </div>
              </div>

              {/* Overall Score Card (2 cols) */}
              <div className="lg:col-span-2 space-y-4">
                {/* Big Score */}
                <div className={`bg-gradient-to-br ${scoreBg(analysis.overallScore.score)} rounded-2xl p-8 border text-center`}>
                  <p className="text-sm text-slate-400 uppercase tracking-wider mb-2">Overall Score</p>
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-700" />
                      <circle cx="60" cy="60" r="54" fill="none" strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={`${(analysis.overallScore.score / 100) * 339.3} 339.3`}
                        className={scoreColor(analysis.overallScore.score).replace('text-', 'stroke-')} />
                    </svg>
                    <div className="absolute text-center">
                      <p className={`text-4xl font-extrabold ${scoreColor(analysis.overallScore.score)}`}>{analysis.overallScore.score}</p>
                      <p className={`text-lg font-bold ${gradeColor(analysis.overallScore.grade)}`}>{analysis.overallScore.grade}</p>
                    </div>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                  <p className="text-sm text-slate-400 uppercase tracking-wider mb-4">Score Breakdown</p>
                  {Object.entries(analysis.overallScore.breakdown).map(([key, value]) => {
                    const labels = { engagementScore: '🎯 Engagement', seoScore: '🔍 SEO', velocityScore: '⚡ Velocity', growthScore: '📈 Growth' };
                    return (
                      <div key={key} className="mb-3 last:mb-0">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-300">{labels[key] || key}</span>
                          <span className={`font-bold ${scoreColor(value)}`}>{value}/100</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div className={`h-2 rounded-full transition-all ${value >= 80 ? 'bg-emerald-500' : value >= 60 ? 'bg-yellow-500' : value >= 40 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${Math.min(100, value)}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== KEY METRICS GRID ========== */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold mb-6">📊 Key Metrics</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <MetricCard label="Views" value={formatNumber(videoData.viewCount)} icon="👁️" />
              <MetricCard label="Likes" value={formatNumber(videoData.likeCount)} icon="👍" />
              <MetricCard label="Comments" value={formatNumber(videoData.commentCount)} icon="💬" />
              <MetricCard label="Engagement" value={`${analysis.metrics.engagementRate}%`} icon="🎯" />
              <MetricCard label="Daily Views" value={formatNumber(analysis.metrics.dailyViewRate)} icon="⚡" />
              <MetricCard label="Retention Est." value={`${analysis.metrics.retentionEstimate}%`} icon="⏱️" />
            </div>
          </div>
        </section>

        {/* ========== BENCHMARK COMPARISON ========== */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold mb-2">🏆 Category Benchmark — {analysis.benchmarks.category}</h2>
            <p className="text-slate-400 text-sm mb-6">How this video performs compared to the {analysis.benchmarks.category} category average on YouTube</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <BenchmarkCard
                metric="Engagement Rate"
                value={`${analysis.metrics.engagementRate}%`}
                benchmark={`${analysis.benchmarks.avgEngagementRate}%`}
                percentile={analysis.metrics.engagementPercentile}
                performance={analysis.benchmarks.performanceVsCategory}
              />
              <BenchmarkCard
                metric="Daily View Rate"
                value={formatNumber(analysis.metrics.dailyViewRate)}
                benchmark={formatNumber(analysis.benchmarks.avgDailyViews)}
                performance={getPerformanceForViews(analysis.metrics.dailyViewRate, analysis.benchmarks.avgDailyViews)}
              />
              <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                <p className="text-sm text-slate-400 mb-1">Performance vs Category</p>
                <p className={`text-lg font-bold ${performanceColor(analysis.benchmarks.performanceVsCategory)}`}>
                  {performanceLabel(analysis.benchmarks.performanceVsCategory)}
                </p>
                <p className="text-sm text-slate-500 mt-2">Percentile Rank: <span className="text-white font-bold">{analysis.metrics.engagementPercentile}th</span></p>
              </div>
            </div>
          </div>
        </section>

        {/* ========== VELOCITY & FORECAST ========== */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold mb-6">⚡ View Velocity & Forecast</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                <p className="text-sm text-slate-400 mb-1">Velocity Trend</p>
                <p className="text-2xl font-bold">{trendIcon(analysis.metrics.velocityTrend)} {analysis.metrics.velocityTrend}</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                <p className="text-sm text-slate-400 mb-1">Views/Day</p>
                <p className="text-2xl font-bold text-cyan-400">{formatNumber(analysis.metrics.dailyViewRate)}</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                <p className="text-sm text-slate-400 mb-1">30-Day Forecast</p>
                <p className="text-2xl font-bold text-purple-400">{formatNumber(analysis.metrics.estimated30DayViews)}</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                <p className="text-sm text-slate-400 mb-1">90-Day Forecast</p>
                <p className="text-2xl font-bold text-indigo-400">{formatNumber(analysis.metrics.estimated90DayViews)}</p>
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
              <p className="text-sm text-slate-400 mb-2">Views per Subscriber</p>
              <div className="flex items-center gap-3">
                <p className="text-2xl font-bold text-emerald-400">{analysis.metrics.viewsPerSubscriber}x</p>
                <p className="text-sm text-slate-400">
                  {analysis.metrics.viewsPerSubscriber > 5
                    ? '🚀 Excellent reach — content is reaching well beyond the subscriber base'
                    : analysis.metrics.viewsPerSubscriber > 2
                    ? '👍 Good reach — solid subscriber-to-view conversion'
                    : '⚠️ Low reach — mainly serving existing subscribers'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========== ENGAGEMENT DEEP DIVE ========== */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold mb-6">🎯 Engagement Analysis</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <EngagementMetric label="Like Ratio" value={`${analysis.metrics.likeRatio}%`} description="likes / views" benchmark={`${analysis.benchmarks.avgEngagementRate * 1.2}%`} />
              <EngagementMetric label="Comment Ratio" value={`${analysis.metrics.commentRatio}%`} description="comments / views" benchmark="0.4%" />
              <EngagementMetric label="Like/Comment Ratio" value={`${analysis.metrics.likeToCommentRatio}:1`} description="likes per comment" benchmark="10:1" />
              <EngagementMetric label="Subscriber Conversion" value={`${analysis.metrics.subscriberConversionRate}%`} description="est. viewers → subs" benchmark="1-3%" />
            </div>
          </div>
        </section>

        {/* ========== REVENUE ESTIMATE ========== */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold mb-6">💰 Revenue Estimate</h2>
            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              <RevenueCard label="Conservative" amount={analysis.revenueEstimate.estimatedRevenueLow} cpm={analysis.revenueEstimate.cpmLow} color="text-slate-300" />
              <RevenueCard label="Average" amount={analysis.revenueEstimate.estimatedRevenueAvg} cpm={analysis.revenueEstimate.cpmAvg} color="text-emerald-400" highlight />
              <RevenueCard label="Optimistic" amount={analysis.revenueEstimate.estimatedRevenueHigh} cpm={analysis.revenueEstimate.cpmHigh} color="text-yellow-400" />
            </div>
            <p className="text-xs text-slate-500 text-center">{analysis.revenueEstimate.note}</p>
          </div>
        </section>

        {/* ========== SEO ANALYSIS ========== */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">🔍 SEO Analysis</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">SEO Score:</span>
                <span className={`text-2xl font-bold ${scoreColor(seoAnalysis.seoScore.overall)}`}>{seoAnalysis.seoScore.overall}/100</span>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <SEOScoreCard title="📝 Title" score={seoAnalysis.seoScore.title.score} issues={seoAnalysis.seoScore.title.issues} suggestions={seoAnalysis.seoScore.title.suggestions} />
              <SEOScoreCard title="📄 Description" score={seoAnalysis.seoScore.description.score} issues={seoAnalysis.seoScore.description.issues} suggestions={seoAnalysis.seoScore.description.suggestions} />
              <SEOScoreCard title="🏷️ Tags" score={seoAnalysis.seoScore.tags.score} issues={seoAnalysis.seoScore.tags.issues} suggestions={seoAnalysis.seoScore.tags.suggestions} />
            </div>
          </div>
        </section>

        {/* ========== ADVANCED METRICS: VSI, SURFACE, DECAY, SEV, COMMENTS ========== */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold mb-6">🧠 Advanced Intelligence</h2>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* VSI Score */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-200">Viewer Satisfaction Index</h3>
                  <span className={`text-2xl font-bold ${scoreColor(analysis.viewerSatisfaction.score)}`}>
                    {analysis.viewerSatisfaction.score}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-0.5 text-xs font-bold rounded border ${gradeBadgeStyle(analysis.viewerSatisfaction.grade)}`}>
                    {analysis.viewerSatisfaction.grade}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-4">{analysis.viewerSatisfaction.interpretation}</p>
                <div className="space-y-2">
                  {Object.entries(analysis.viewerSatisfaction.breakdown || {}).map(([key, value]) => {
                    const labels = {
                      avdRatio: 'Avg View Duration Ratio',
                      likeViewRatio: 'Like/View Ratio',
                      shareRate: 'Share Rate',
                      commentSentiment: 'Comment Sentiment',
                      returnViewerRate: 'Return Viewer Rate',
                    };
                    return (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-slate-500">{labels[key] || key}</span>
                        <span className="text-slate-300 font-medium">{typeof value === 'number' ? value.toFixed(2) : value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Session Extension Value */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-200">Session Extension Value</h3>
                  <span className={`text-2xl font-bold ${scoreColor(analysis.sessionExtension.score)}`}>
                    {analysis.sessionExtension.score}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-0.5 text-xs font-bold rounded border ${extensionBadgeStyle(analysis.sessionExtension.extensionPotential)}`}>
                    {analysis.sessionExtension.extensionPotential?.toUpperCase()} POTENTIAL
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-4">
                  Measures how well this video keeps viewers watching more of your content.
                </p>
                <div className="space-y-2">
                  {analysis.sessionExtension.tips?.map((tip, i) => (
                    <p key={i} className="text-sm text-cyan-400 flex items-start gap-2">
                      <span className="mt-0.5">💡</span>
                      <span>{tip}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Algorithm Surface Distribution */}
            <div className="mt-6 bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-200">Algorithm Surface Distribution</h3>
                <span className="text-sm text-slate-400">
                  Dominant: <span className="text-emerald-400 font-bold capitalize">{analysis.algorithmSurface.dominantSurface}</span>
                </span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <SurfaceBar label="Home" value={analysis.algorithmSurface.distribution.home} color="cyan" />
                <SurfaceBar label="Search" value={analysis.algorithmSurface.distribution.search} color="emerald" />
                <SurfaceBar label="Suggested" value={analysis.algorithmSurface.distribution.suggested} color="purple" />
                <SurfaceBar label="Shorts" value={analysis.algorithmSurface.distribution.shorts} color="yellow" />
                <SurfaceBar label="Subscriptions" value={analysis.algorithmSurface.distribution.subscriptions} color="pink" />
              </div>
              {/* CSS Pie Chart */}
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative w-40 h-40 flex-shrink-0">
                  <PieChart distribution={analysis.algorithmSurface.distribution} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-xs text-slate-500">Top</p>
                      <p className="text-lg font-bold text-white capitalize">{analysis.algorithmSurface.dominantSurface}</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  {analysis.algorithmSurface.optimizationTips?.map((tip, i) => (
                    <p key={i} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="mt-0.5 text-emerald-400">▸</span>
                      <span>{tip}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Decay Rate */}
            <div className="mt-6 bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-200">Content Decay Rate</h3>
                <span className={`px-2 py-0.5 text-xs font-bold rounded border ${decayBadgeStyle(analysis.contentDecay.classification)}`}>
                  {analysis.contentDecay.classification?.toUpperCase()}
                </span>
              </div>
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-3xl font-bold text-white">{analysis.contentDecay.rate}</span>
                <span className="text-sm text-slate-500">decay coefficient</span>
              </div>
              <p className="text-sm text-slate-400 mb-4">{analysis.contentDecay.shelfLife}</p>
              <div className="space-y-2">
                {analysis.contentDecay.recommendations?.map((rec, i) => (
                  <p key={i} className="text-sm text-purple-400 flex items-start gap-2">
                    <span className="mt-0.5">🔄</span>
                    <span>{rec}</span>
                  </p>
                ))}
              </div>
            </div>

            {/* Comment Intelligence */}
            {analysis.commentIntelligence && analysis.commentIntelligence.questionDensity !== undefined && (
              <div className="mt-6 bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-200">Comment Intelligence</h3>
                  <span className={`px-2 py-0.5 text-xs font-bold rounded border ${engagementBadgeStyle(analysis.commentIntelligence.engagementQuality)}`}>
                    {analysis.commentIntelligence.engagementQuality?.toUpperCase()} ENGAGEMENT
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <CommentMetric label="Question Density" value={`${analysis.commentIntelligence.questionDensity}%`} />
                  <CommentMetric label="Sentiment Score" value={analysis.commentIntelligence.sentimentScore} color={sentimentColor(analysis.commentIntelligence.sentimentScore)} />
                  <CommentMetric label="Audience Level" value={analysis.commentIntelligence.audienceLevel} capitalize />
                  <CommentMetric label="Content Gaps" value={analysis.commentIntelligence.contentGaps?.length || 0} />
                </div>
                <div className="space-y-2">
                  {analysis.commentIntelligence.contentGaps?.map((gap, i) => (
                    <p key={i} className="text-sm text-orange-400 flex items-start gap-2">
                      <span className="mt-0.5">🔍</span>
                      <span>{gap}</span>
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ========== COMPETITIVE ANALYSIS (SWOT) ========== */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold mb-6">🏆 Competitive Analysis</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <SWOTQuadrant title="💪 Strengths" items={analysis.competitiveAnalysis.strength} color="emerald" />
              <SWOTQuadrant title="⚠️ Weaknesses" items={analysis.competitiveAnalysis.weakness} color="red" />
              <SWOTQuadrant title="🚀 Opportunities" items={analysis.competitiveAnalysis.opportunity} color="cyan" />
              <SWOTQuadrant title="🔥 Threats" items={analysis.competitiveAnalysis.threat} color="orange" />
            </div>
          </div>
        </section>

        {/* ========== RECOMMENDATIONS ========== */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold mb-6">✅ Action Recommendations</h2>
            <div className="space-y-3">
              {analysis.recommendations.map((rec, i) => (
                <div key={i} className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 hover:border-indigo-500/30 transition-all">
                  <div className="flex items-start gap-4">
                    <span className={`flex-shrink-0 px-2 py-0.5 text-xs font-bold rounded border ${priorityColor(rec.priority)}`}>
                      {rec.priority.toUpperCase()}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-slate-500 uppercase tracking-wider">{rec.area}</span>
                      </div>
                      <p className="text-white font-medium mb-1">{rec.issue}</p>
                      <p className="text-slate-300 text-sm mb-2">{rec.suggestion}</p>
                      <p className="text-emerald-400 text-xs font-medium">Expected impact: {rec.expectedImpact}</p>
                    </div>
                  </div>
                </div>
              ))}
              {analysis.recommendations.length === 0 && (
                <div className="bg-emerald-500/10 rounded-xl p-6 border border-emerald-500/30 text-center">
                  <p className="text-emerald-400 text-lg font-bold">🎉 Excellent! No major issues found.</p>
                  <p className="text-slate-400 text-sm mt-1">This video is well-optimized. Focus on promoting it to maintain momentum.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Internal Links */}
        <InternalLinking links={[
          { href: '/youtube-video-analyzer', title: '🔍 Video Analyzer', description: 'Analyze another video in detail' },
          { href: '/youtube-seo-tool', title: '📝 SEO Tool', description: 'Optimize your video titles, tags & descriptions' },
          { href: '/youtube-channel-analytics', title: '📈 Channel Analytics', description: 'Deep-dive into channel performance' },
          { href: '/youtube-money-calculator', title: '💰 Money Calculator', description: 'Estimate earnings across channels' },
          { href: '/youtube-niche-finder', title: '🎯 Niche Finder', description: 'Find the most profitable niche for your content' },
          { href: '/trends', title: '📊 YouTube Trends', description: 'Discover what is trending right now' },
        ]} />

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-slate-800">
          <div className="max-w-6xl mx-auto text-center text-slate-400 text-sm">
            <p>© 2026 Tubefission. Professional YouTube video analytics.</p>
          </div>
        </footer>
      </div>
    </>
  );
}

// ========== Advanced Metrics Sub-components ==========

function SurfaceBar({ label, value, color }) {
  const colorMap = {
    cyan: 'bg-cyan-500',
    emerald: 'bg-emerald-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500',
    pink: 'bg-pink-500',
  };
  const bgMap = {
    cyan: 'bg-cyan-500/10',
    emerald: 'bg-emerald-500/10',
    purple: 'bg-purple-500/10',
    yellow: 'bg-yellow-500/10',
    pink: 'bg-pink-500/10',
  };
  return (
    <div className={`rounded-lg p-3 border border-slate-700 ${bgMap[color] || 'bg-slate-800/50'}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-slate-400">{label}</span>
        <span className="text-sm font-bold text-white">{value}%</span>
      </div>
      <div className="w-full bg-slate-700/50 rounded-full h-2">
        <div className={`h-2 rounded-full ${colorMap[color] || 'bg-slate-500'}`} style={{ width: `${Math.min(100, value)}%` }} />
      </div>
    </div>
  );
}

function PieChart({ distribution }) {
  const { home, search, suggested, shorts, subscriptions } = distribution;
  const total = home + search + suggested + shorts + subscriptions;
  if (total <= 0) return null;

  const toDeg = (val) => (val / total) * 360;
  const homeDeg = toDeg(home);
  const searchDeg = toDeg(search);
  const suggestedDeg = toDeg(suggested);
  const shortsDeg = toDeg(shorts);

  const colors = ['#06b6d4', '#10b981', '#a855f7', '#eab308', '#ec4899'];
  const stops = [
    `${colors[0]} 0deg ${homeDeg}deg`,
    `${colors[1]} ${homeDeg}deg ${homeDeg + searchDeg}deg`,
    `${colors[2]} ${homeDeg + searchDeg}deg ${homeDeg + searchDeg + suggestedDeg}deg`,
    `${colors[3]} ${homeDeg + searchDeg + suggestedDeg}deg ${homeDeg + searchDeg + suggestedDeg + shortsDeg}deg`,
    `${colors[4]} ${homeDeg + searchDeg + suggestedDeg + shortsDeg}deg 360deg`,
  ];

  return (
    <div
      className="w-full h-full rounded-full"
      style={{
        background: `conic-gradient(${stops.join(', ')})`,
      }}
    />
  );
}

function CommentMetric({ label, value, color, capitalize }) {
  const displayValue = capitalize && typeof value === 'string' ? value.charAt(0).toUpperCase() + value.slice(1) : value;
  return (
    <div className="text-center">
      <p className={`text-xl font-bold ${color || 'text-white'}`}>{displayValue}</p>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
    </div>
  );
}

function gradeBadgeStyle(grade) {
  if (grade === 'A+' || grade === 'A') return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  if (grade === 'B+' || grade === 'B') return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
  if (grade === 'C+' || grade === 'C') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  return 'bg-red-500/20 text-red-400 border-red-500/30';
}

function extensionBadgeStyle(potential) {
  if (potential === 'high') return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  if (potential === 'medium') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  return 'bg-red-500/20 text-red-400 border-red-500/30';
}

function decayBadgeStyle(classification) {
  if (classification === 'evergreen') return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  if (classification === 'standard') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  return 'bg-red-500/20 text-red-400 border-red-500/30';
}

function engagementBadgeStyle(quality) {
  if (quality === 'excellent' || quality === 'high') return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  if (quality === 'good') return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
  if (quality === 'moderate') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  return 'bg-red-500/20 text-red-400 border-red-500/30';
}

function sentimentColor(score) {
  if (score >= 70) return 'text-emerald-400';
  if (score >= 50) return 'text-cyan-400';
  if (score >= 30) return 'text-yellow-400';
  return 'text-red-400';
}

// ========== Sub Components ==========

function MetricCard({ label, value, icon }) {
  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
      <p className="text-lg mb-1">{icon}</p>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
}

function BenchmarkCard({ metric, value, benchmark, percentile, performance }) {
  return (
    <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
      <p className="text-sm text-slate-400 mb-1">{metric}</p>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-2xl font-bold text-white">{value}</span>
        <span className="text-sm text-slate-500">vs {benchmark} avg</span>
      </div>
      {percentile !== undefined && (
        <p className="text-sm text-slate-400">Top <span className="text-white font-bold">{100 - percentile}%</span> of {performance || 'videos'}</p>
      )}
    </div>
  );
}

function EngagementMetric({ label, value, description, benchmark }) {
  return (
    <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
      <p className="text-sm text-slate-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{description}</p>
      <p className="text-xs text-slate-500">Benchmark: {benchmark}</p>
    </div>
  );
}

function RevenueCard({ label, amount, cpm, color, highlight }) {
  return (
    <div className={`rounded-xl p-5 border ${highlight ? 'bg-gradient-to-br from-emerald-600/20 to-emerald-800/10 border-emerald-500/30' : 'bg-slate-800/50 border-slate-700'}`}>
      <p className="text-sm text-slate-400 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>${(amount || 0).toLocaleString()}</p>
      <p className="text-xs text-slate-500 mt-1">CPM: ${cpm?.toFixed(2) || 'N/A'}</p>
    </div>
  );
}

function SEOScoreCard({ title, score, issues, suggestions }) {
  const scoreColor = (s) => s >= 80 ? 'text-emerald-400' : s >= 60 ? 'text-yellow-400' : s >= 40 ? 'text-orange-400' : 'text-red-400';
  return (
    <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{title}</h3>
        <span className={`text-xl font-bold ${scoreColor(score)}`}>{score}</span>
      </div>
      {issues.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Issues</p>
          {issues.map((issue, i) => (
            <p key={i} className="text-sm text-red-400 mb-1">⚠️ {issue}</p>
          ))}
        </div>
      )}
      {suggestions.length > 0 && (
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Suggestions</p>
          {suggestions.slice(0, 3).map((s, i) => (
            <p key={i} className="text-sm text-emerald-400 mb-1">💡 {s}</p>
          ))}
        </div>
      )}
    </div>
  );
}

function SWOTQuadrant({ title, items, color }) {
  const borderMap = { emerald: 'border-emerald-500/30', red: 'border-red-500/30', cyan: 'border-cyan-500/30', orange: 'border-orange-500/30' };
  return (
    <div className={`bg-slate-800/50 rounded-xl p-5 border ${borderMap[color] || 'border-slate-700'}`}>
      <h3 className="font-semibold mb-3">{title}</h3>
      {items.length > 0 ? (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
              <span className="text-slate-500 mt-0.5">•</span>
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500 italic">No significant factors identified</p>
      )}
    </div>
  );
}

// Helpers
function getDaysSince(dateString) {
  if (!dateString) return 0;
  return Math.max(Math.floor((Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24)), 0);
}

function getPerformanceForViews(actual, benchmark) {
  const ratio = actual / Math.max(benchmark, 1);
  if (ratio >= 2) return 'well_above';
  if (ratio >= 1.3) return 'above';
  if (ratio >= 0.7) return 'average';
  if (ratio >= 0.4) return 'below';
  return 'well_below';
}

// Static config for Pages Router
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
  };
}

export async function getStaticProps({ params }) {
  try {
    const videoData = await getVideoAnalysis(params.videoId);
    return { props: { videoId: params.videoId, videoData }, revalidate: 86400 };
  } catch { return { notFound: true }; }
}
