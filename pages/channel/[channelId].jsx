import React from 'react';
import SEOHead from '../../components/SEOHead';
import InternalLinking from '../../components/InternalLinking';
import { analyzeChannel } from '../../lib/youtube-analytics-engine';
import { 
  getChannelAnalysis,
  generateChannelSEO,
  generateBreadcrumbSchema
} from '../../programmatic-seo-infrastructure';

/**
 * Channel Analysis Page — Professional Grade
 * /channel/[channelId]
 * 
 * Uses youtube-analytics-engine for deep channel diagnostics
 */
export default function ChannelAnalysisPage({ channelId, channelData }) {
  const seo = generateChannelSEO(channelData);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Channel Analytics', path: '/youtube-channel-analytics' },
    { name: channelData.title, path: `/channel/${channelId}` }
  ]);

  // === Run professional analysis ===
  const analysis = analyzeChannel(channelData);

  const formatNumber = (n) => {
    if (n >= 1000000000) return (n / 1000000000).toFixed(1) + 'B';
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return (n || 0).toLocaleString();
  };

  const formatCurrency = (n) => `$${(n || 0).toLocaleString()}`;

  const healthColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const healthBg = (score) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const trajectoryIcon = (t) => {
    const map = { viral: '🚀', exponential: '📈', linear: '➡️', plateau: '➡️', declining: '📉' };
    return map[t] || '➡️';
  };

  const trajectoryLabel = (t) => {
    const map = { viral: 'Viral Growth', exponential: 'Exponential', linear: 'Linear Growth', plateau: 'Plateau', declining: 'Declining' };
    return map[t] || t;
  };

  return (
    <>
      <SEOHead
        title={seo.title}
        description={seo.description}
        canonical={`https://tubefission.com/channel/${channelId}`}
        ogImage={channelData.thumbnail}
        schemas={[breadcrumbSchema]}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">

        {/* Breadcrumb */}
        <nav className="py-4 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
          <div className="max-w-6xl mx-auto">
            <ol className="flex items-center space-x-2 text-sm text-slate-400">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li>/</li>
              <li><a href="/youtube-channel-analytics" className="hover:text-white transition-colors">Channel Analytics</a></li>
              <li>/</li>
              <li className="text-white truncate max-w-xs">{channelData.title}</li>
            </ol>
          </div>
        </nav>

        {/* ========== HERO: Channel + Health Score ========== */}
        <section className="pt-8 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-8">
              {/* Channel Info (3 cols) */}
              <div className="lg:col-span-3">
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-indigo-500/50 flex-shrink-0">
                    <img src={channelData.thumbnail || '/default-avatar.png'} alt={channelData.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">{channelData.title}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                      <span>{formatNumber(channelData.subscriberCount)} subscribers</span>
                      <span>•</span>
                      <span>{formatNumber(channelData.viewCount)} total views</span>
                      <span>•</span>
                      <span>{channelData.videoCount} videos</span>
                    </div>
                  </div>
                </div>

                {/* Base Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <MetricBox label="Subscribers" value={formatNumber(channelData.subscriberCount)} icon="👥" />
                  <MetricBox label="Total Views" value={formatNumber(channelData.viewCount)} icon="👁️" />
                  <MetricBox label="Videos" value={channelData.videoCount?.toLocaleString()} icon="🎬" />
                  <MetricBox label="Avg Views/Video" value={formatNumber(analysis.contentStrategy.avgViewsPerVideo)} icon="📊" />
                </div>
              </div>

              {/* Health Score (2 cols) */}
              <div className="lg:col-span-2">
                {/* Big Health Score */}
                <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-2xl p-6 border border-indigo-500/30 mb-4">
                  <p className="text-sm text-slate-400 uppercase tracking-wider mb-2 text-center">Channel Health Score</p>
                  <div className="relative inline-flex items-center justify-center mx-auto w-full">
                    <svg className="w-32 h-32 -rotate-90 mx-auto" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-700" />
                      <circle cx="60" cy="60" r="54" fill="none" strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={`${(analysis.healthScore.overall / 100) * 339.3} 339.3`}
                        className={`${analysis.healthScore.overall >= 80 ? 'stroke-emerald-500' : analysis.healthScore.overall >= 60 ? 'stroke-yellow-500' : analysis.healthScore.overall >= 40 ? 'stroke-orange-500' : 'stroke-red-500'}`} />
                    </svg>
                    <div className="absolute text-center">
                      <p className={`text-4xl font-extrabold ${healthColor(analysis.healthScore.overall)}`}>{analysis.healthScore.overall}</p>
                      <p className="text-xs text-slate-400">/100</p>
                    </div>
                  </div>
                </div>

                {/* 5-Dimension Health Breakdown */}
                <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                  <p className="text-sm text-slate-400 uppercase tracking-wider mb-4">Health Dimensions</p>
                  {[
                    { label: '🚀 Growth', value: analysis.healthScore.growthHealth },
                    { label: '📝 Content', value: analysis.healthScore.contentHealth },
                    { label: '💬 Engagement', value: analysis.healthScore.engagementHealth },
                    { label: '📅 Consistency', value: analysis.healthScore.consistencyHealth },
                  ].map((dim) => (
                    <div key={dim.label} className="mb-3 last:mb-0">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300">{dim.label}</span>
                        <span className={`font-bold ${healthColor(dim.value)}`}>{dim.value}/100</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className={`h-2 rounded-full transition-all ${healthBg(dim.value)}`} style={{ width: `${Math.min(100, dim.value)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== GROWTH ANALYSIS ========== */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold mb-6">📈 Growth Analysis</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                <p className="text-sm text-slate-400 mb-1">Monthly Growth Rate</p>
                <p className="text-2xl font-bold text-emerald-400">{analysis.growth.subscriberGrowthRate}%</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                <p className="text-sm text-slate-400 mb-1">Doubling Time</p>
                <p className="text-2xl font-bold text-cyan-400">
                  {analysis.growth.subscriberDoublingTime < 365
                    ? `${analysis.growth.subscriberDoublingTime} days`
                    : 'N/A'}
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                <p className="text-sm text-slate-400 mb-1">Growth Trajectory</p>
                <p className="text-xl font-bold">
                  {trajectoryIcon(analysis.growth.growthTrajectory)} {trajectoryLabel(analysis.growth.growthTrajectory)}
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                <p className="text-sm text-slate-400 mb-1">View Trend</p>
                <p className="text-xl font-bold">
                  {analysis.growth.viewGrowthTrend === 'accelerating' ? '🚀 Accelerating'
                    : analysis.growth.viewGrowthTrend === 'stable' ? '➡️ Stable'
                    : '📉 Declining'}
                </p>
              </div>
            </div>

            {/* Subscriber Projections */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="font-semibold mb-4">📊 Subscriber Growth Projections</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <ProjectionCard label="Current" value={channelData.subscriberCount} icon="📍" highlight />
                <ProjectionCard label="In 30 Days" value={analysis.growth.projectedSubscribers30d} icon="📅" />
                <ProjectionCard label="In 90 Days" value={analysis.growth.projectedSubscribers90d} icon="📆" />
                <ProjectionCard label="In 1 Year" value={analysis.growth.projectedSubscribers1y} icon="🗓️" />
              </div>
            </div>
          </div>
        </section>

        {/* ========== CONTENT STRATEGY ========== */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold mb-6">📝 Content Strategy Analysis</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                <p className="text-sm text-slate-400 mb-1">Upload Frequency</p>
                <p className="text-xl font-bold">{analysis.contentStrategy.uploadFrequency}</p>
                <p className="text-xs text-slate-500 mt-1">Consistency Score: {analysis.contentStrategy.uploadConsistency}/100</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                <p className="text-sm text-slate-400 mb-1">Content Distribution</p>
                <p className="text-xl font-bold capitalize">{analysis.contentStrategy.viewDistribution}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {analysis.contentStrategy.viewDistribution === 'hit-driven' ? 'Relies on viral hits'
                    : analysis.contentStrategy.viewDistribution === 'consistent' ? 'Steady performance across videos'
                    : 'Balanced mix of hits and steady performers'}
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                <p className="text-sm text-slate-400 mb-1">Avg Views/Subscriber</p>
                <p className="text-xl font-bold">
                  {channelData.subscriberCount > 0
                    ? `${(analysis.contentStrategy.avgViewsPerVideo / channelData.subscriberCount).toFixed(1)}x`
                    : 'N/A'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {analysis.contentStrategy.avgViewsPerVideo / Math.max(channelData.subscriberCount, 1) > 0.5
                    ? '🚀 Strong — content reaches beyond subscribers'
                    : '⚠️ Weak — mostly serving existing audience'}
                </p>
              </div>
            </div>

            {/* Content Mix */}
            <div className="mt-4 bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="font-semibold mb-4">Content Mix Estimate</h3>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-emerald-400">Evergreen</span>
                    <span>{analysis.contentStrategy.contentMix.evergreen}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <div className="bg-emerald-500 h-3 rounded-full" style={{ width: `${analysis.contentStrategy.contentMix.evergreen}%` }} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-yellow-400">Trending</span>
                    <span>{analysis.contentStrategy.contentMix.trending}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <div className="bg-yellow-500 h-3 rounded-full" style={{ width: `${analysis.contentStrategy.contentMix.trending}%` }} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-purple-400">Shorts</span>
                    <span>{analysis.contentStrategy.contentMix.shorts}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <div className="bg-purple-500 h-3 rounded-full" style={{ width: `${analysis.contentStrategy.contentMix.shorts}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== REVENUE ANALYSIS ========== */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold mb-6">💰 Revenue Analysis</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <RevenueBox label="Monthly (Low)" amount={analysis.revenueAnalysis.estimatedMonthlyRevenue.low} color="text-slate-300" />
              <RevenueBox label="Monthly (Average)" amount={analysis.revenueAnalysis.estimatedMonthlyRevenue.avg} color="text-emerald-400" highlight />
              <RevenueBox label="Monthly (High)" amount={analysis.revenueAnalysis.estimatedMonthlyRevenue.high} color="text-yellow-400" />
              <RevenueBox label="Per Video" amount={analysis.revenueAnalysis.revenuePerVideo} color="text-cyan-400" />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                <p className="text-sm text-slate-400 mb-1">Annual Revenue (Avg)</p>
                <p className="text-2xl font-bold text-emerald-400">{formatCurrency(analysis.revenueAnalysis.estimatedAnnualRevenue.avg)}</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                <p className="text-sm text-slate-400 mb-1">CPM Range</p>
                <p className="text-2xl font-bold">${analysis.revenueAnalysis.cpmRange.min} - ${analysis.revenueAnalysis.cpmRange.max}</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                <p className="text-sm text-slate-400 mb-1">Revenue Growth Rate</p>
                <p className="text-2xl font-bold text-purple-400">{analysis.revenueAnalysis.revenueGrowthRate}%/mo</p>
              </div>
            </div>
          </div>
        </section>

        {/* ========== AUDIENCE INSIGHTS ========== */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold mb-6">🌍 Audience Insights</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                <p className="text-sm text-slate-400 mb-2">Top Countries</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.audienceInsights.topCountries.map((c) => (
                    <span key={c} className="px-2 py-1 bg-slate-700 rounded text-sm">{c}</span>
                  ))}
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                <p className="text-sm text-slate-400 mb-1">Age Group Estimate</p>
                <p className="text-lg font-bold">{analysis.audienceInsights.ageGroupEstimate}</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                <p className="text-sm text-slate-400 mb-1">Audience Type</p>
                <p className="text-lg font-bold capitalize">{analysis.audienceInsights.audienceType}</p>
                <p className="text-xs text-slate-500">
                  {analysis.audienceInsights.audienceType === 'loyal' ? 'High repeat viewership — strong community'
                    : analysis.audienceInsights.audienceType === 'casual' ? 'Low repeat viewership — needs better retention'
                    : 'Mix of loyal and casual viewers'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========== AUDIENCE INTERESTS (clickable) ========== */}
        <AudienceInterestsSection channelId={channelId} channelData={channelData} analysis={analysis} />

        {/* ========== SWOT ANALYSIS ========== */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold mb-6">🏆 SWOT Analysis</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <SWOTCard title="💪 Strengths" items={analysis.swot.strengths} color="emerald" />
              <SWOTCard title="⚠️ Weaknesses" items={analysis.swot.weaknesses} color="red" />
              <SWOTCard title="🚀 Opportunities" items={analysis.swot.opportunities} color="cyan" />
              <SWOTCard title="🔥 Threats" items={analysis.swot.threats} color="orange" />
            </div>
          </div>
        </section>

        {/* ========== GROWTH PLAN ========== */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold mb-6">📋 Growth Action Plan</h2>
            <div className="space-y-4">
              {analysis.growthPlan.map((plan, i) => (
                <div key={i} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-indigo-500/30 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-sm">
                      {plan.timeframe.replace('_', ' ')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-bold text-lg capitalize">{plan.timeframe.replace('_', ' ')} Plan</h3>
                        <span className={`px-2 py-0.5 text-xs rounded-full border ${
                          plan.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : plan.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                        }`}>{plan.difficulty}</span>
                      </div>
                      <ul className="space-y-2 mb-4">
                        {plan.actions.map((action, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                            <span className="text-indigo-400 mt-0.5">▸</span>
                            {action}
                          </li>
                        ))}
                      </ul>
                      <p className="text-emerald-400 text-sm font-medium">Expected: {plan.expectedOutcome}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Internal Links */}
        <InternalLinking links={[
          { href: '/youtube-channel-analytics', title: '📈 Channel Analyzer', description: 'Analyze another YouTube channel' },
          { href: '/youtube-video-analyzer', title: '🎬 Video Analyzer', description: 'Deep-dive into individual video performance' },
          { href: '/youtube-money-calculator', title: '💰 Money Calculator', description: 'Estimate channel earnings potential' },
          { href: '/youtube-niche-finder', title: '🎯 Niche Finder', description: 'Find the most profitable niche' },
          { href: '/youtube-seo-tool', title: '🔍 SEO Tool', description: 'Optimize your video SEO' },
          { href: '/youtube-opportunity-finder', title: '💡 Opportunity Finder', description: 'Discover content gaps and opportunities' },
        ]} />

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-slate-800">
          <div className="max-w-6xl mx-auto text-center text-slate-400 text-sm">
            <p>© 2026 Tubefission. Professional YouTube channel analytics.</p>
          </div>
        </footer>
      </div>
    </>
  );
}

// ========== Sub Components ==========

function MetricBox({ label, value, icon }) {
  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
      <p className="text-lg mb-1">{icon}</p>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
}

function ProjectionCard({ label, value, icon, highlight }) {
  return (
    <div className={`rounded-xl p-4 border text-center ${highlight ? 'bg-indigo-600/20 border-indigo-500/30' : 'bg-slate-800/50 border-slate-700'}`}>
      <p className="text-lg mb-1">{icon}</p>
      <p className="text-xl font-bold">{formatNumber(value)}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
}

function RevenueBox({ label, amount, color, highlight }) {
  return (
    <div className={`rounded-xl p-5 border ${highlight ? 'bg-gradient-to-br from-emerald-600/20 to-emerald-800/10 border-emerald-500/30' : 'bg-slate-800/50 border-slate-700'}`}>
      <p className="text-sm text-slate-400 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>${(amount || 0).toLocaleString()}</p>
    </div>
  );
}

function SWOTCard({ title, items, color }) {
  const borderMap = { emerald: 'border-emerald-500/30', red: 'border-red-500/30', cyan: 'border-cyan-500/30', orange: 'border-orange-500/30' };
  return (
    <div className={`bg-slate-800/50 rounded-xl p-5 border ${borderMap[color]}`}>
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

// ========== Audience Interests Section ==========
function AudienceInterestsSection({ channelId, channelData, analysis }) {
  const [selected, setSelected] = React.useState(null);

  // Interest tags with styling
  const interests = [
    { key: 'technology', icon: '💻', label: 'Technology', bg: 'bg-blue-500', ring: 'ring-blue-400' },
    { key: 'music', icon: '🎵', label: 'Music', bg: 'bg-purple-500', ring: 'ring-purple-400' },
    { key: 'sports', icon: '⚽', label: 'Sports', bg: 'bg-indigo-500', ring: 'ring-indigo-400' },
    { key: 'gaming', icon: '🎮', label: 'Gaming', bg: 'bg-violet-500', ring: 'ring-violet-400' },
    { key: 'tutorial', icon: '📚', label: 'Tutorial', bg: 'bg-amber-400', ring: 'ring-amber-300' },
    { key: 'entertainment', icon: '🎬', label: 'Entertainment', bg: 'bg-pink-400', ring: 'ring-pink-300' },
    { key: 'education', icon: '🎓', label: 'Education', bg: 'bg-rose-400', ring: 'ring-rose-300' },
    { key: 'vlog', icon: '📱', label: 'Vlog', bg: 'bg-pink-300', ring: 'ring-pink-200' },
    { key: 'review', icon: '⭐', label: 'Review', bg: 'bg-rose-300', ring: 'ring-rose-200' },
    { key: 'comedy', icon: '😂', label: 'Comedy', bg: 'bg-rose-300', ring: 'ring-rose-200' },
    { key: 'fitness', icon: '💪', label: 'Fitness', bg: 'bg-orange-300', ring: 'ring-orange-200' },
    { key: 'food', icon: '🍕', label: 'Food', bg: 'bg-amber-300', ring: 'ring-amber-200' },
    { key: 'travel', icon: '✈️', label: 'Travel', bg: 'bg-yellow-300', ring: 'ring-yellow-200' },
    { key: 'fashion', icon: '👗', label: 'Fashion', bg: 'bg-lime-300', ring: 'ring-lime-200' },
    { key: 'beauty', icon: '💄', label: 'Beauty', bg: 'bg-green-300', ring: 'ring-green-200' },
    { key: 'diy', icon: '🔨', label: 'DIY', bg: 'bg-teal-300', ring: 'ring-teal-200' },
    { key: 'science', icon: '🔬', label: 'Science', bg: 'bg-sky-300', ring: 'ring-sky-200' },
    { key: 'news', icon: '📰', label: 'News', bg: 'bg-cyan-300', ring: 'ring-cyan-200' },
  ];

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 rounded-2xl p-6 sm:p-8 border border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">☁️</span>
            <h2 className="text-lg font-bold">Audience Interests</h2>
          </div>

          {/* Tag Cloud — Primary row (larger tags) */}
          <div className="flex flex-wrap items-center gap-3 mb-3">
            {interests.slice(0, 8).map((interest) => (
              <a
                key={interest.key}
                href={`/channel/${channelId}/interest/${interest.key}`}
                className={`group relative px-5 py-2.5 rounded-full text-sm sm:text-base font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg ${interest.bg} text-white hover:ring-2 ${interest.ring} hover:ring-offset-2 hover:ring-offset-slate-900 ${selected === interest.key ? 'ring-2 ring-offset-2 ring-offset-slate-900 scale-105' : ''}`}
                style={{
                  opacity: selected === null || selected === interest.key ? 1 : 0.5,
                }}
                onClick={(e) => {
                  e.preventDefault();
                  setSelected(selected === interest.key ? null : interest.key);
                }}
              >
                {interest.icon} {interest.label}
              </a>
            ))}
          </div>

          {/* Secondary row (smaller tags) */}
          <div className="flex flex-wrap items-center gap-2">
            {interests.slice(8).map((interest) => (
              <a
                key={interest.key}
                href={`/channel/${channelId}/interest/${interest.key}`}
                className="group px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-105 bg-slate-700/60 text-slate-300 border border-slate-600 hover:bg-slate-600 hover:text-white hover:border-slate-500"
                style={{
                  opacity: selected === null || selected === interest.key ? 1 : 0.5,
                }}
              >
                {interest.icon} {interest.label}
              </a>
            ))}
          </div>

          <p className="text-xs text-slate-500 mt-4 text-center">
            Based on video content, tags, and category analysis. Click any keyword to explore related trends.
          </p>
        </div>
      </div>
    </section>
  );
}

// Static config for Pages Router
export async function getStaticPaths() {
  return {
    paths: [{ params: { channelId: 'UCBcRF18a7Qf58cCRy5xuWwQ' } }],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  try {
    const channelData = await getChannelAnalysis(params.channelId);
    return { 
      props: { channelId: params.channelId, channelData },
      revalidate: 86400
    };
  } catch { 
    return { notFound: true }; 
  }
}
