import React, { useState } from 'react';
import SEOHead from '../../components/SEOHead';
import InternalLinking from '../../components/InternalLinking';
import RegionFilter from '../../components/RegionFilter';
import { useRegionFilter } from '../../hooks/useRegionFilter';
import {
  generateFAQPageSchema,
  EnhancedSoftwareApplicationSchema,
  EnhancedOrganizationSchema,
} from '../../enhanced-structured-data';

// FAQ data (exported for schema generation)
const channelAnalyticsFaqs = [
  {
    question: 'What is YouTube channel analytics and why should I use it?',
    answer:
      'YouTube channel analytics is the process of examining a channel\'s performance metrics such as subscriber growth, total views, engagement rate, and audience demographics. By analyzing these data points, creators can identify which videos perform best, understand audience behavior, and make data-driven decisions to grow their channels. Our free channel analytics tool gives you instant access to these insights without requiring login or API keys, making it the fastest way to benchmark any YouTube channel against competitors and industry standards.',
  },
  {
    question: 'How do I analyze a YouTube channel using your tool?',
    answer:
      'Simply enter the channel name, channel ID, or full channel URL into the search box at the bottom of this page and click the "Analyze Channel" button. Our system will retrieve the channel\'s public data from YouTube and display a comprehensive breakdown including subscriber count, total video views, average views per video, upload frequency, engagement rate, and top-performing content. You can compare up to five channels side by side to identify gaps and opportunities in your content strategy.',
  },
  {
    question: 'What metrics does your channel analyzer track?',
    answer:
      'Our channel analyzer tracks over 20 key performance indicators including subscriber count and growth trajectory, total and average view counts, estimated monthly revenue based on niche CPM rates, engagement rate (likes, comments, shares divided by views), upload consistency score, video duration analysis, audience retention patterns, and top-performing content categories. We also calculate a proprietary Channel Health Score from 0 to 100 that summarizes overall channel performance and growth potential in a single number.',
  },
  {
    question: 'Can I compare my channel with competitors?',
    answer:
      'Yes. Our side-by-side comparison feature lets you enter two or more channels and instantly see how they stack up against each other. The comparison includes subscriber-to-view ratios, engagement rates, upload frequency, content strategy differences, and growth trends over the past 90 days. This competitive intelligence helps you understand where you stand in your niche and which areas need improvement to outperform rival channels.',
  },
  {
    question: 'Is the channel analytics tool really free?',
    answer:
      'Absolutely. Tubefission\'s channel analytics tool is 100% free with no hidden costs, no credit card required, and no account registration needed. You can analyze unlimited channels, run unlimited comparisons, and export your results as many times as you like. We believe that every creator deserves access to professional-grade analytics regardless of budget, which is why all our core tools remain free forever.',
  },
  {
    question: 'How often is the channel data updated?',
    answer:
      'Our system pulls data from YouTube\'s public API and refreshes channel metrics every 24 hours. Subscriber counts, view totals, and video lists are updated daily so you always see current figures. Historical trend data is stored for up to 12 months, allowing you to track growth trajectories and seasonal patterns over time. For real-time subscriber counts during live events, we recommend combining our tool with YouTube Studio for the most accurate picture.',
  },
  {
    question: 'What makes Tubefission different from other channel analytics tools?',
    answer:
      'Unlike tools that require account creation, paid subscriptions, or Chrome extensions, Tubefission delivers instant analytics with zero friction. We combine raw data with AI-powered insights that translate numbers into actionable recommendations. Our proprietary Channel Health Score and growth prediction algorithms help you understand not just where your channel is now, but where it is heading. We also integrate niche-specific CPM data so you can evaluate the monetization potential alongside growth metrics.',
  },
];

// Schema data for this page
const channelAnalyticsSchemas = [
  EnhancedSoftwareApplicationSchema,
  EnhancedOrganizationSchema,
  generateFAQPageSchema(channelAnalyticsFaqs),
];

/**
 * Channel Analytics Landing Page
 * /channel/index.jsx
 */
const ChannelAnalytics = () => {
  const { selectedRegion, handleRegionChange, regionName } = useRegionFilter('US');
  const [channelInput, setChannelInput] = useState('');

  // Internal links for this page
  const relatedLinks = [
    {
      href: '/youtube-niche-finder',
      title: 'YouTube Niche Finder',
      description: 'Discover profitable content niches with AI-powered analysis and CPM data.',
    },
    {
      href: '/youtube-money-calculator',
      title: 'YouTube Money Calculator',
      description: 'Estimate your potential YouTube earnings based on views, CPM, and engagement.',
    },
    {
      href: '/youtube-opportunity-finder',
      title: 'YouTube Opportunity Finder',
      description: 'Find untapped content opportunities and trending topics in your niche.',
    },
    {
      href: '/youtube-best-time-to-post',
      title: 'Best Time to Post',
      description: 'Find the optimal posting schedule for maximum views and engagement.',
    },
    {
      href: '/youtube-seo-tool',
      title: 'YouTube SEO Tool',
      description: 'Optimize your video titles, descriptions, and tags for higher rankings.',
    },
    {
      href: '/trends',
      title: 'YouTube Trends',
      description: 'Discover trending videos and viral content across multiple countries.',
    },
  ];

  // Top channels data
  const topChannels = [
    { name: 'MrBeast', category: 'Entertainment', subscribers: '318M', avgViews: '120M', engagement: '8.2%', uploads: '780+' },
    { name: 'T-Series', category: 'Music', subscribers: '268M', avgViews: '18M', engagement: '3.1%', uploads: '22,000+' },
    { name: 'Dude Perfect', category: 'Sports', subscribers: '60M', avgViews: '35M', engagement: '7.5%', uploads: '200+' },
    { name: 'Marques Brownlee', category: 'Tech', subscribers: '19.8M', avgViews: '5.2M', engagement: '6.8%', uploads: '1,600+' },
    { name: 'Ali Abdaal', category: 'Education', subscribers: '5.8M', avgViews: '1.8M', engagement: '5.9%', uploads: '550+' },
    { name: 'Graham Stephan', category: 'Finance', subscribers: '4.5M', avgViews: '1.2M', engagement: '6.1%', uploads: '900+' },
  ];

  return (
    <>
      <SEOHead
        title="Free YouTube Channel Analytics Tool 2026 — Grow Your Channel"
        description="Analyze any YouTube channel for free. Get subscriber growth, engagement rates, revenue estimates, and competitor insights. No login required."
        canonical="https://tubefission.com/channel"
        ogImage="https://tubefission.com/og-channel-analytics.png"
        keywords="YouTube channel analytics, channel analyzer, YouTube growth, subscriber tracking, channel stats"
        schemas={channelAnalyticsSchemas}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Channel Analytics', path: '/channel' },
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
              Free YouTube Channel Analytics Tool 2026
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Analyze any YouTube channel instantly. Get subscriber growth, engagement metrics,
              revenue estimates, and competitor benchmarks — completely free, no login required.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#analyze"
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all"
              >
                Analyze a Channel Now
              </a>
              <a
                href="#metrics"
                className="px-8 py-4 bg-slate-700 rounded-lg font-semibold hover:bg-slate-600 transition-all"
              >
                See What We Track
              </a>
            </div>
          </div>
        </section>

        {/* What Is Channel Analytics */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">What Is YouTube Channel Analytics?</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 text-lg mb-4">
                YouTube channel analytics is the systematic examination of a channel's performance data
                to understand how it is growing, which content resonates with viewers, and where
                opportunities exist for improvement. Every YouTube channel generates a wealth of data —
                from subscriber counts and total views to watch time, click-through rates, and audience
                demographics — and channel analytics is the process of turning that raw data into
                actionable insights that drive growth.
              </p>
              <p className="text-slate-300 text-lg mb-4">
                For content creators, channel analytics is not optional — it is the foundation of a
                successful YouTube strategy. Without understanding your numbers, you are essentially
                creating content in the dark. You cannot improve what you do not measure, and the
                creators who invest time in analyzing their channel data consistently outperform those
                who rely on intuition alone. Channel analytics reveals which videos attract the most
                subscribers, what topics generate the highest engagement, and how your upload schedule
                affects overall performance.
              </p>
              <p className="text-slate-300 text-lg mb-4">
                Beyond self-analysis, channel analytics becomes a powerful competitive tool when applied
                to rival channels. By benchmarking your metrics against competitors, you can identify gaps
                in content strategy, discover underserved topics, and find inspiration from channels that
                are succeeding where you want to grow. Our free YouTube channel analytics tool makes this
                process effortless — simply enter any channel name or ID and receive a comprehensive
                breakdown within seconds, with no account creation or API keys required.
              </p>
              <p className="text-slate-300 text-lg">
                The importance of channel analytics has only grown as YouTube's algorithm has become more
                sophisticated. In 2026, YouTube uses hundreds of signals to decide which videos to
                recommend, and understanding how your channel's data aligns with those signals is critical
                for organic growth. Channels that regularly review and act on their analytics data see
                an average of 40% faster subscriber growth compared to those that ignore their metrics,
                making channel analytics one of the highest-ROI activities any creator can invest in.
              </p>
            </div>
          </div>
        </section>

        {/* Key Metrics Section */}
        <section id="metrics" className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Key Metrics Every Creator Should Track</h2>
            <div className="prose prose-invert max-w-none mb-8">
              <p className="text-slate-300 text-lg mb-4">
                Not all metrics are created equal. While YouTube Studio provides dozens of data points,
                focusing on the right key performance indicators (KPIs) will give you the clearest
                picture of your channel's health and trajectory. Here are the metrics that matter most
                for growth, monetization, and long-term success on the platform.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-indigo-500 transition-colors">
                <h3 className="text-xl font-bold mb-3 text-indigo-400">Subscriber Growth Rate</h3>
                <p className="text-slate-300 mb-2">
                  The rate at which your subscriber count increases over time is the most direct
                  indicator of channel momentum. A healthy channel shows consistent upward growth
                  with occasional spikes after viral videos. Track your daily, weekly, and monthly
                  subscriber gains to identify which content drives subscriptions. Channels with a
                  growth rate above 5% per month are considered strong performers. Sudden drops in
                  growth rate often signal a content strategy issue or increased competition in your
                  niche.
                </p>
                <p className="text-slate-400 text-sm">
                  Benchmark: Top channels grow 2-8% monthly. New channels should aim for 10%+ monthly
                  growth in the first year.
                </p>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-indigo-500 transition-colors">
                <h3 className="text-xl font-bold mb-3 text-indigo-400">Watch Time &amp; Average View Duration</h3>
                <p className="text-slate-300 mb-2">
                  Watch time is the total number of minutes viewers spend watching your content, and
                  average view duration tells you how long individual videos hold attention. YouTube's
                  algorithm heavily favors videos and channels with high watch time because it signals
                  that content is engaging and worth recommending. A video that keeps viewers watching
                  for 8 minutes outperforms a 10-minute video where viewers leave at the 3-minute
                  mark. Focus on creating content that maximizes retention, not just total views.
                </p>
                <p className="text-slate-400 text-sm">
                  Benchmark: Aim for 50%+ average retention rate and 4+ minutes average view duration.
                </p>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-indigo-500 transition-colors">
                <h3 className="text-xl font-bold mb-3 text-indigo-400">Click-Through Rate (CTR)</h3>
                <p className="text-slate-300 mb-2">
                  CTR measures how often people click on your video when it appears in their feed,
                  search results, or suggested videos. It is directly influenced by your thumbnail
                  design, title, and how well they match viewer intent. A high CTR means your packaging
                  — the combination of title and thumbnail — is compelling enough to stand out in a
                  crowded feed. YouTube tracks CTR for every impression, and videos with higher CTR
                  receive more impressions from the algorithm, creating a virtuous cycle of visibility
                  and growth that compounds over time.
                </p>
                <p className="text-slate-400 text-sm">
                  Benchmark: Average CTR is 2-10%. Above 8% is excellent; below 2% needs immediate
                  attention.
                </p>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-indigo-500 transition-colors">
                <h3 className="text-xl font-bold mb-3 text-indigo-400">Engagement Rate</h3>
                <p className="text-slate-300 mb-2">
                  Engagement rate combines likes, comments, shares, and saves relative to total views.
                  A high engagement rate signals to YouTube that your content sparks conversation and
                  interaction, which is a strong recommendation signal. Comments are particularly
                  valuable because they indicate that viewers are invested enough to spend time writing
                  responses. Encourage engagement by asking questions in your videos, responding to
                  comments, and creating content that invites discussion. Channels with engagement
                  rates above 5% typically see 2-3x more recommendation traffic from the algorithm.
                </p>
                <p className="text-slate-400 text-sm">
                  Benchmark: 3-6% is average; above 8% indicates strong community engagement.
                </p>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-indigo-500 transition-colors">
                <h3 className="text-xl font-bold mb-3 text-indigo-400">Revenue &amp; CPM Estimates</h3>
                <p className="text-slate-300 mb-2">
                  Understanding your revenue per thousand views (CPM) helps you evaluate the
                  monetization potential of your channel and niche. CPM varies dramatically by
                  content category, viewer geography, and seasonality. Finance and business channels
                  typically command CPMs of $12-20, while entertainment channels may see $2-5.
                  Our channel analytics tool estimates your potential revenue based on view counts
                  and niche benchmarks, helping you make informed decisions about content direction
                  and sponsorship pricing. Tracking CPM trends over time also reveals seasonal
                  patterns that affect ad spending.
                </p>
                <p className="text-slate-400 text-sm">
                  Benchmark: US-based audiences typically generate 2-3x higher CPMs than global averages.
                </p>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-indigo-500 transition-colors">
                <h3 className="text-xl font-bold mb-3 text-indigo-400">Upload Frequency &amp; Consistency</h3>
                <p className="text-slate-300 mb-2">
                  How often and how consistently you upload directly impacts subscriber retention
                  and algorithmic visibility. Channels that maintain a regular upload schedule train
                  their audience to expect content at predictable intervals, leading to higher
                  notification click-through rates and more consistent viewership. Inconsistent
                  uploading, on the other hand, can cause subscriber decay as viewers forget about
                  your channel. Our analytics dashboard tracks your upload cadence and compares it
                  to competitors in your niche, helping you set a sustainable publishing schedule
                  that balances quality with consistency.
                </p>
                <p className="text-slate-400 text-sm">
                  Benchmark: 2-3 uploads per week is the sweet spot for most niches. Daily uploads
                  work for news and entertainment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How to Use Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">How to Use Our Channel Analyzer</h2>
            <p className="text-slate-300 text-lg mb-8">
              Our channel analyzer is designed to give you professional-grade insights in three simple
              steps. No technical expertise, account creation, or API configuration required.
            </p>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center font-bold text-2xl">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Enter the Channel Name or ID</h3>
                  <p className="text-slate-300">
                    Type the YouTube channel name, channel ID (starting with UC), or paste the full
                    channel URL into the search box. Our system supports all public channels regardless
                    of subscriber count. You can also search by @handle format that YouTube introduced
                    in recent years. For example, enter "MrBeast", "@mkbhd", or the full URL — all
                    formats work seamlessly.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center font-bold text-2xl">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Click &quot;Analyze Channel&quot;</h3>
                  <p className="text-slate-300">
                    Hit the analyze button and our system will instantly fetch the channel's public
                    data from YouTube. Within 2-3 seconds, you will see a complete dashboard with
                    subscriber count, total views, video count, engagement rate, estimated revenue,
                    upload frequency, and a proprietary Channel Health Score. The analysis includes
                    historical trend data showing growth patterns over the past 90 days so you can
                    see the full trajectory, not just a snapshot.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center font-bold text-2xl">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Explore Insights &amp; Take Action</h3>
                  <p className="text-slate-300">
                    Dive into the detailed breakdown of the channel's performance. Review the top
                    performing videos to understand what content works, compare the channel against
                    competitors using our side-by-side comparison feature, and use the AI-generated
                    recommendations to optimize your own content strategy. Export your results as a
                    PDF report or share them with your team. The insights you gain here directly
                    inform your content calendar, thumbnail strategy, and title optimization efforts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Top Channels by Category */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Top YouTube Channels by Category</h2>
            <p className="text-slate-300 mb-8">
              See how the biggest channels in each category perform. Use these benchmarks to set
              realistic goals for your own channel growth journey.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="p-4 text-slate-400 font-semibold">Channel</th>
                    <th className="p-4 text-slate-400 font-semibold">Category</th>
                    <th className="p-4 text-slate-400 font-semibold">Subscribers</th>
                    <th className="p-4 text-slate-400 font-semibold">Avg Views</th>
                    <th className="p-4 text-slate-400 font-semibold hidden sm:table-cell">Engagement</th>
                    <th className="p-4 text-slate-400 font-semibold hidden md:table-cell">Uploads</th>
                  </tr>
                </thead>
                <tbody>
                  {topChannels.map((ch) => (
                    <tr key={ch.name} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 font-semibold">{ch.name}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded text-xs">
                          {ch.category}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300">{ch.subscribers}</td>
                      <td className="p-4 text-slate-300">{ch.avgViews}</td>
                      <td className="p-4 text-green-400 hidden sm:table-cell">{ch.engagement}</td>
                      <td className="p-4 text-slate-300 hidden md:table-cell">{ch.uploads}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Why Channel Analytics Matter */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Why Channel Analytics Matter for Growth</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 text-lg mb-4">
                Data-driven creators grow faster and more sustainably than those who rely on guesswork.
                Channel analytics transforms raw numbers into a roadmap for growth by revealing patterns
                that are invisible without measurement. When you know which videos drive subscribers,
                what posting times generate the most initial views, and how your engagement rate compares
                to your niche average, you can double down on what works and eliminate what does not.
              </p>
              <p className="text-slate-300 text-lg mb-4">
                One of the most powerful applications of channel analytics is identifying content gaps.
                By analyzing top-performing videos in your niche and comparing them to your own catalog,
                you can discover topics, formats, and styles that your audience wants but that you have
                not yet covered. This gap analysis is the foundation of a content strategy that consistently
                delivers results because it is based on proven demand rather than creative assumptions.
              </p>
              <p className="text-slate-300 text-lg mb-4">
                Channel analytics also plays a critical role in monetization decisions. Understanding
                your CPM rates, audience demographics, and engagement patterns helps you set appropriate
                sponsorship prices, choose the right affiliate products, and optimize your ad placement
                strategy. Creators who track their revenue metrics alongside their content metrics are
                3x more likely to turn their channels into full-time careers because they can identify
                and replicate the conditions that maximize earnings.
              </p>
              <p className="text-slate-300 text-lg">
                Perhaps most importantly, channel analytics provides early warning signs before problems
                become crises. A gradual decline in CTR may indicate thumbnail fatigue, while dropping
                average view duration could signal that your content is not meeting viewer expectations.
                By monitoring these signals regularly, you can course-correct early and maintain the
                upward trajectory that keeps your channel competitive in an ever-evolving platform.
              </p>
            </div>
          </div>
        </section>

        {/* Channel Search */}
        <section id="analyze" className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Analyze Any YouTube Channel</h2>
            <p className="text-slate-400 mb-8">
              Enter a channel name, @handle, or URL to get instant analytics
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={channelInput}
                onChange={(e) => setChannelInput(e.target.value)}
                placeholder="e.g. @mkbhd or UCxxxxx or MrBeast"
                className="flex-1 px-5 py-4 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
              <a
                href={`/channel/${encodeURIComponent(channelInput)}`}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all whitespace-nowrap"
              >
                Analyze Channel
              </a>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {channelAnalyticsFaqs.map((faq, index) => (
                <div key={index} className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold mb-3 text-indigo-400">{faq.question}</h3>
                  <p className="text-slate-300 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Internal Links */}
        <InternalLinking links={relatedLinks} />

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-slate-800">
          <div className="max-w-4xl mx-auto text-center text-slate-400 text-sm">
            <p>&copy; 2026 Tubefission. Free YouTube analytics tools.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ChannelAnalytics;
