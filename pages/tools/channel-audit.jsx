import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import RegionFilter from '../../components/RegionFilter';
import { useRegionFilter } from '../../hooks/useRegionFilter';

const auditDimensions = [
  {
    name: 'Metadata Optimization',
    icon: '📝',
    description: 'Analyzes title length, keyword placement, description completeness, and tag relevance for maximum search visibility.',
  },
  {
    name: 'Engagement Rate Analysis',
    icon: '💬',
    description: 'Calculates likes-to-views ratio, comments-to-views ratio, and overall audience interaction quality.',
  },
  {
    name: 'Subscriber Growth Pattern',
    icon: '📈',
    description: 'Tracks subscriber velocity, identifies growth spikes, and detects stagnation or decline trends.',
  },
  {
    name: 'Content Consistency Score',
    icon: '🎯',
    description: 'Evaluates upload frequency, content theme consistency, and posting schedule optimization.',
  },
  {
    name: 'Thumbnail Effectiveness',
    icon: '🖼️',
    description: 'Assesses thumbnail CTR, visual consistency, text readability, and branding coherence.',
  },
  {
    name: 'Audience Retention Insights',
    icon: '⏱️',
    description: 'Analyzes average view duration, drop-off points, and video pacing effectiveness.',
  },
  {
    name: 'SEO Keyword Coverage',
    icon: '🔍',
    description: 'Identifies missing keyword opportunities in titles, descriptions, and tags across all videos.',
  },
  {
    name: 'Competitive Positioning',
    icon: '🏆',
    description: 'Compares your channel metrics against top competitors in your niche.',
  },
  {
    name: 'Monetization Readiness',
    icon: '💰',
    description: 'Checks YPP eligibility, estimated revenue potential, and sponsorship attractiveness.',
  },
  {
    name: 'Brand & Channel Health',
    icon: '❤️',
    description: 'Evaluates overall channel presentation, about section optimization, and playlist organization.',
  },
];

const sampleReport = {
  channelName: 'Tech Review Central',
  overallScore: 72,
  grade: 'B+',
  scores: [
    { dimension: 'Metadata', score: 85, status: 'good' },
    { dimension: 'Engagement', score: 68, status: 'warning' },
    { dimension: 'Growth', score: 74, status: 'good' },
    { dimension: 'Consistency', score: 45, status: 'critical' },
    { dimension: 'Thumbnails', score: 78, status: 'good' },
    { dimension: 'Retention', score: 62, status: 'warning' },
    { dimension: 'SEO', score: 91, status: 'good' },
    { dimension: 'Competitive', score: 55, status: 'warning' },
    { dimension: 'Monetization', score: 80, status: 'good' },
    { dimension: 'Brand Health', score: 88, status: 'good' },
  ],
  recommendations: [
    'Increase upload frequency from 1 to 2-3 videos per week to boost consistency score',
    'Improve engagement by adding clear CTAs in first 30 seconds of videos',
    'Create competitor analysis to identify content gaps in your niche',
    'Optimize video intros to improve audience retention by 15%',
  ],
};

export default function ChannelAudit() {
  const { selectedRegion, handleRegionChange, regionName } = useRegionFilter('US');
  const [channelUrl, setChannelUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!channelUrl.trim()) return;
    // Extract channel ID/URL for redirect
    const cleanUrl = channelUrl.trim();
    const channelId = cleanUrl.match(/(?:channel\/|c\/|@)([^\/\s]+)/)?.[1] || cleanUrl;
    window.location.href = `/channel/${channelId}`;
  };

  return (
    <>
      <Head>
        <title>Free YouTube Channel Audit Tool 2025 - Analyze & Optimize Your Channel</title>
        <meta name="description" content="Free YouTube channel audit tool. Analyze your channel across 10 dimensions: SEO, engagement, growth, thumbnails, retention, and more. Get actionable recommendations to grow faster." />
        <meta name="keywords" content="youtube channel audit, free youtube audit, youtube channel analyzer, youtube seo audit, channel health check, youtube analytics tool" />
        <meta property="og:title" content="Free YouTube Channel Audit Tool 2025" />
        <meta property="og:description" content="Analyze your YouTube channel across 10 dimensions. Get actionable SEO and growth recommendations for free." />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://tubefission.com/tools/channel-audit" />
      </Head>

      <main className="min-h-screen bg-slate-900 text-white">
        {/* Region Filter Bar */}
        <div className="py-4 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
          <div className="max-w-6xl mx-auto flex justify-end">
            <RegionFilter selectedRegion={selectedRegion} onRegionChange={handleRegionChange} />
          </div>
        </div>

        {/* Hero */}
        <section className="py-12 md:py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-400 text-sm font-medium mb-6">
              🔍 100% Free — No Signup Required
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Free YouTube{' '}
              <span className="text-purple-400">Channel Audit</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-8">
              Analyze your YouTube channel across 10 critical dimensions. Get a detailed scorecard,
              competitor insights, and actionable recommendations to grow faster.
            </p>
          </div>
        </section>

        {/* Input Form */}
        <section className="py-8 px-4">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 md:p-8">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Enter Channel URL or Channel ID
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={channelUrl}
                  onChange={(e) => setChannelUrl(e.target.value)}
                  placeholder="youtube.com/@channelname or UC..."
                  className="flex-1 px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-xl font-semibold transition-colors whitespace-nowrap"
                >
                  🔍 Audit Channel
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                Examples: youtube.com/@mrbeast, youtube.com/c/ChannelName, or paste the full channel URL
              </p>
            </form>
          </div>
        </section>

        {/* Audit Dimensions */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
              What Our Channel Audit Checks
            </h2>
            <p className="text-slate-400 text-center mb-10 max-w-2xl mx-auto">
              Our comprehensive audit analyzes your channel across 10 dimensions that directly impact
              growth, discoverability, and monetization.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {auditDimensions.map((dim, i) => (
                <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-purple-500/30 transition-all">
                  <div className="text-2xl mb-3">{dim.icon}</div>
                  <h3 className="font-semibold text-white mb-2">{dim.name}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{dim.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sample Report Preview */}
        <section className="py-16 px-4 bg-slate-800/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
              Sample Audit Report
            </h2>
            <p className="text-slate-400 text-center mb-10">
              Here is what your channel audit report will look like
            </p>

            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 md:p-8">
              {/* Header */}
              <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-6 border-b border-slate-700">
                <div>
                  <h3 className="text-xl font-bold text-white">{sampleReport.channelName}</h3>
                  <p className="text-slate-400 text-sm">Channel Audit Report • Generated by Tubefission</p>
                </div>
                <div className="mt-4 md:mt-0 text-center">
                  <div className="text-4xl font-bold text-purple-400">{sampleReport.overallScore}</div>
                  <div className="text-sm text-slate-400">Overall Score</div>
                  <div className="inline-block mt-1 px-3 py-0.5 bg-purple-500/20 text-purple-400 rounded-full text-sm font-bold">
                    {sampleReport.grade}
                  </div>
                </div>
              </div>

              {/* Score Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
                {sampleReport.scores.map((s, i) => (
                  <div key={i} className="bg-slate-800 rounded-lg p-3 text-center">
                    <div className={`text-2xl font-bold mb-1 ${
                      s.status === 'good' ? 'text-emerald-400' :
                      s.status === 'warning' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {s.score}
                    </div>
                    <div className="text-xs text-slate-400">{s.dimension}</div>
                    <div className={`text-xs mt-1 font-medium ${
                      s.status === 'good' ? 'text-emerald-400' :
                      s.status === 'warning' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {s.status === 'good' ? '✓ Good' : s.status === 'warning' ? '⚠ Warning' : '✗ Critical'}
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-semibold text-white mb-3">🎯 Top Recommendations</h4>
                <div className="space-y-2">
                  {sampleReport.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-3 bg-slate-800 rounded-lg p-3">
                      <span className="text-purple-400 font-bold">{i + 1}.</span>
                      <span className="text-sm text-slate-300">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Editorial Content */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              The Complete Guide to YouTube Channel Auditing
            </h2>

            <div className="prose prose-invert max-w-none text-slate-300 space-y-6">
              <p className="text-lg leading-relaxed">
                YouTube channel auditing is one of the most overlooked aspects of creator growth. While everyone focuses on creating better videos, optimizing thumbnails, and researching keywords, few creators take the time to step back and analyze their channel as a whole. A comprehensive channel audit is like a health checkup for your YouTube presence — it identifies problems you cannot see, opportunities you have missed, and provides a clear roadmap for improvement.
              </p>

              <h3 className="text-2xl font-bold text-white mt-10 mb-4">
                Why Channel Auditing Matters More Than Ever
              </h3>

              <p className="text-lg leading-relaxed">
                The YouTube algorithm has become increasingly sophisticated. It no longer just looks at individual video performance — it evaluates your entire channel. Your upload consistency, audience retention across all videos, engagement patterns, and even your channel metadata all influence how the algorithm promotes your content. A channel with strong individual videos but poor overall health will struggle to grow, while a well-optimized channel can see compounding growth from every new upload.
              </p>

              <p className="text-lg leading-relaxed">
                In 2025, the competition for viewer attention is fiercer than ever. Over 500 hours of video are uploaded to YouTube every minute. To stand out, you need every advantage you can get. A channel audit gives you that advantage by revealing the specific areas where small improvements can lead to significant results.
              </p>

              <h3 className="text-2xl font-bold text-white mt-10 mb-4">
                Understanding the 10 Dimensions of Channel Health
              </h3>

              <p className="text-lg leading-relaxed">
                Our free YouTube channel audit tool analyzes your channel across 10 critical dimensions. Each dimension represents a key factor that influences your channel's growth, discoverability, and monetization potential. Let us break down what each dimension means and why it matters.
              </p>

              <p className="text-lg leading-relaxed">
                <strong className="text-white">Metadata Optimization</strong> is the foundation of YouTube SEO. Your titles, descriptions, and tags are how YouTube understands what your content is about. Poor metadata means the algorithm cannot match your videos with the right audience. Our audit checks title length, keyword placement, description completeness, and tag relevance to ensure your metadata is working as hard as possible.
              </p>

              <p className="text-lg leading-relaxed">
                <strong className="text-white">Engagement Rate Analysis</strong> reveals how actively your audience interacts with your content. High view counts mean nothing if viewers are not liking, commenting, and sharing. The algorithm interprets engagement as a signal of quality — videos with strong engagement get promoted more. We calculate your likes-to-views ratio, comments-to-views ratio, and overall interaction quality to benchmark your performance.
              </p>

              <p className="text-lg leading-relaxed">
                <strong className="text-white">Subscriber Growth Pattern</strong> tells the story of your channel's momentum. Are you gaining subscribers consistently, or are you experiencing boom-and-bust cycles? We track subscriber velocity, identify growth spikes (what caused them?), and detect stagnation or decline trends. Understanding your growth pattern helps you replicate successes and avoid mistakes.
              </p>

              <p className="text-lg leading-relaxed">
                <strong className="text-white">Content Consistency Score</strong> is one of the most important yet underrated factors. YouTube's algorithm favors channels that upload consistently. Not necessarily daily — but reliably. A channel that uploads 2 videos every week for a year will outperform a channel that uploads 10 videos one week and then disappears for a month. We evaluate your upload frequency, content theme consistency, and posting schedule optimization.
              </p>

              <p className="text-lg leading-relaxed">
                <strong className="text-white">Thumbnail Effectiveness</strong> directly impacts your click-through rate (CTR), which is one of the strongest ranking signals. A great video with a poor thumbnail will never get watched. We assess your thumbnail CTR, visual consistency across your channel, text readability, and branding coherence. Small thumbnail improvements can increase CTR by 20-50%.
              </p>

              <p className="text-lg leading-relaxed">
                <strong className="text-white">Audience Retention Insights</strong> reveal whether your content keeps viewers watching. YouTube prioritizes videos with high retention because they indicate viewer satisfaction. We analyze your average view duration, identify drop-off points (where do viewers leave?), and evaluate video pacing effectiveness. This data helps you structure future videos for maximum retention.
              </p>

              <p className="text-lg leading-relaxed">
                <strong className="text-white">SEO Keyword Coverage</strong> identifies missed opportunities. Many creators optimize individual videos but fail to look at their channel as a whole. Are there high-value keywords you are not targeting? Are your tags outdated? We analyze keyword coverage across all your videos to find gaps and opportunities.
              </p>

              <p className="text-lg leading-relaxed">
                <strong className="text-white">Competitive Positioning</strong> puts your performance in context. It is not enough to know your own metrics — you need to know how you compare to successful channels in your niche. We benchmark your channel against top competitors to identify where you are leading and where you are falling behind.
              </p>

              <p className="text-lg leading-relaxed">
                <strong className="text-white">Monetization Readiness</strong> evaluates your path to revenue. Even if you are not currently monetized, understanding your monetization potential helps you make strategic decisions. We check YouTube Partner Program eligibility, estimate revenue potential based on your niche and performance, and assess your attractiveness to potential sponsors.
              </p>

              <p className="text-lg leading-relaxed">
                <strong className="text-white">Brand & Channel Health</strong> is the holistic view. We evaluate your channel presentation, about section optimization, playlist organization, and overall branding coherence. A well-organized channel with clear branding converts casual viewers into subscribers more effectively.
              </p>

              <h3 className="text-2xl font-bold text-white mt-10 mb-4">
                How to Use Your Audit Results
              </h3>

              <p className="text-lg leading-relaxed">
                Getting your audit results is just the beginning. The real value comes from taking action. Here is how to turn your audit into a growth plan:
              </p>

              <p className="text-lg leading-relaxed">
                Start with your lowest-scoring dimensions. These represent your biggest opportunities for improvement. If your consistency score is low, commit to a regular upload schedule. If your engagement rate is weak, add stronger calls-to-action in your videos. If your metadata is poorly optimized, go back and update your titles, descriptions, and tags.
              </p>

              <p className="text-lg leading-relaxed">
                Focus on dimensions that have compounding effects. Improving your metadata and SEO keyword coverage will help every new video you upload perform better. Fixing your thumbnail consistency will increase CTR across your entire channel. These are high-leverage improvements that pay dividends over time.
              </p>

              <p className="text-lg leading-relaxed">
                Use the competitive positioning data to set realistic goals. If you are scoring 45 in competitive positioning while the top channels in your niche score 85, you know where you need to improve. Study what they are doing differently and adapt their strategies to your content.
              </p>

              <p className="text-lg leading-relaxed">
                Re-audit your channel monthly. YouTube is a dynamic platform, and your channel health changes over time. Regular audits help you track progress, catch problems early, and continuously optimize your strategy. We recommend running a new audit after every 10-20 videos or after any major strategy change.
              </p>

              <h3 className="text-2xl font-bold text-white mt-10 mb-4">
                Common Channel Problems Our Audit Detects
              </h3>

              <p className="text-lg leading-relaxed">
                After analyzing thousands of channels, we have identified the most common problems that hold creators back. Here are the issues our audit most frequently detects:
              </p>

              <p className="text-lg leading-relaxed">
                <strong className="text-white">Inconsistent Uploading:</strong> This is the #1 problem we see. Creators upload 5 videos in one week, then disappear for a month. The algorithm cannot build momentum around your channel if it does not know when to expect new content. Our consistency score identifies this problem and provides specific recommendations for improvement.
              </p>

              <p className="text-lg leading-relaxed">
                <strong className="text-white">Poor Metadata:</strong> Many creators write titles and descriptions as an afterthought. They use clickbait titles that do not match the content, write descriptions that are too short, or use irrelevant tags. Our metadata optimization analysis identifies these issues and shows you exactly what to fix.
              </p>

              <p className="text-lg leading-relaxed">
                <strong className="text-white">Weak Thumbnails:</strong> Thumbnails are your billboard on YouTube. If they are not compelling, no one will click. We frequently see channels with great content but generic, text-heavy, or inconsistent thumbnails. Our thumbnail effectiveness score helps you understand what is working and what is not.
              </p>

              <p className="text-lg leading-relaxed">
                <strong className="text-white">Low Engagement:</strong> Some channels get views but few likes, comments, or shares. This signals to the algorithm that the content is not resonating. Our engagement analysis identifies whether the problem is your content, your CTAs, or your audience targeting.
              </p>

              <p className="text-lg leading-relaxed">
                <strong className="text-white">SEO Blind Spots:</strong> Creators often target the same keywords as everyone else in their niche, missing high-opportunity, low-competition keywords. Our SEO keyword coverage analysis identifies these blind spots and suggests alternatives you might not have considered.
              </p>

              <h3 className="text-2xl font-bold text-white mt-10 mb-4">
                Beyond the Audit: Continuous Optimization
              </h3>

              <p className="text-lg leading-relaxed">
                A channel audit is a snapshot in time, but YouTube growth is a continuous process. After you have implemented your audit recommendations, use our other free tools to maintain and accelerate your growth:
              </p>

              <p className="text-lg leading-relaxed">
                Our <Link href="/youtube-seo-tool" className="text-emerald-400 hover:text-emerald-300 underline">YouTube SEO Tool</Link> helps you research keywords for every new video, ensuring your metadata stays optimized. Our <Link href="/youtube-niche-finder" className="text-cyan-400 hover:text-cyan-300 underline">Niche Finder</Link> identifies content opportunities that your competitors are missing. And our <Link href="/youtube-seo-audit" className="text-purple-400 hover:text-purple-300 underline">YouTube SEO Audit</Link> provides video-level optimization recommendations.
              </p>

              <p className="text-lg leading-relaxed">
                Together, these tools create a complete optimization ecosystem. The channel audit gives you the big picture. The SEO tool helps you execute on individual videos. The niche finder ensures you are creating content in the right areas. And regular re-audits keep you on track.
              </p>

              <p className="text-lg leading-relaxed">
                The best creators on YouTube do not just create great content — they continuously analyze, optimize, and iterate. Our free channel audit tool gives you the insights you need to join their ranks. Enter your channel URL above and get your comprehensive audit report in seconds.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-slate-800/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Is the YouTube channel audit tool really free?',
                  a: 'Yes, our YouTube channel audit tool is completely free to use. There are no hidden fees, no credit card required, and no usage limits. You can audit as many channels as you want, as often as you want.',
                },
                {
                  q: 'What data does the channel audit analyze?',
                  a: 'Our audit analyzes 10 dimensions: metadata optimization, engagement rate, subscriber growth patterns, content consistency, thumbnail effectiveness, audience retention, SEO keyword coverage, competitive positioning, monetization readiness, and overall brand health.',
                },
                {
                  q: 'How accurate is the channel audit?',
                  a: 'Our audit uses data from the YouTube API, public channel statistics, and our proprietary analytics algorithms. The scores and recommendations are based on proven best practices and correlation analysis with successful channels. While no audit can guarantee results, our insights are highly actionable and data-driven.',
                },
                {
                  q: 'Can I audit any YouTube channel?',
                  a: 'Yes, you can audit any public YouTube channel. Simply enter the channel URL, channel ID, or handle (e.g., @channelname). Private channels cannot be audited since their data is not publicly accessible.',
                },
                {
                  q: 'How often should I audit my channel?',
                  a: 'We recommend auditing your channel monthly or after every 10-20 new videos. Regular audits help you track progress, identify new problems early, and continuously optimize your strategy. You should also run an audit after any major strategy changes.',
                },
                {
                  q: 'What should I do after getting my audit results?',
                  a: 'Start with your lowest-scoring dimensions — these represent your biggest opportunities. Focus on high-impact improvements like metadata optimization, thumbnail consistency, and upload schedule regularity. Use our other free tools (SEO Tool, Niche Finder) to support your optimization efforts.',
                },
              ].map((faq, i) => (
                <details key={i} className="bg-slate-900 rounded-xl border border-slate-700 p-4 md:p-6 group">
                  <summary className="font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                    {faq.q}
                    <span className="text-slate-500 group-open:rotate-180 transition-transform ml-2">▾</span>
                  </summary>
                  <p className="text-slate-400 mt-3 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Audit Your Channel?
            </h2>
            <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
              Enter your channel URL above and get a comprehensive audit report in seconds. Identify problems, discover opportunities, and accelerate your growth.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/youtube-seo-tool" className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-semibold transition-colors">
                YouTube SEO Tool →
              </Link>
              <Link href="/youtube-niche-finder" className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-xl font-semibold transition-colors">
                Niche Finder →
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Schema (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'Is the YouTube channel audit tool really free?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes, our YouTube channel audit tool is completely free to use. There are no hidden fees, no credit card required, and no usage limits.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What data does the channel audit analyze?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Our audit analyzes 10 dimensions: metadata optimization, engagement rate, subscriber growth patterns, content consistency, thumbnail effectiveness, audience retention, SEO keyword coverage, competitive positioning, monetization readiness, and overall brand health.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How accurate is the channel audit?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Our audit uses data from the YouTube API, public channel statistics, and our proprietary analytics algorithms. The scores and recommendations are based on proven best practices and correlation analysis with successful channels.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Can I audit any YouTube channel?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes, you can audit any public YouTube channel. Simply enter the channel URL, channel ID, or handle. Private channels cannot be audited.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How often should I audit my channel?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'We recommend auditing your channel monthly or after every 10-20 new videos. Regular audits help you track progress and continuously optimize your strategy.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What should I do after getting my audit results?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Start with your lowest-scoring dimensions — these represent your biggest opportunities. Focus on high-impact improvements like metadata optimization, thumbnail consistency, and upload schedule regularity.',
                  },
                },
              ],
            }),
          }}
        />
      </main>
    </>
  );
}
