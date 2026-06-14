import React, { useState } from 'react';
import SEOHead from '../components/SEOHead';
import InternalLinking from '../components/InternalLinking';
import RegionFilter from '../components/RegionFilter';
import { useRegionFilter } from '../hooks/useRegionFilter';
import { moneyCalculatorSEO } from '../tubefission-seo-config';

/**
 * YouTube Money Calculator页面
 * 估算YouTube频道收入
 */
const YouTubeMoneyCalculator = () => {
  const { selectedRegion, handleRegionChange, regionName } = useRegionFilter('US');
  const [views, setViews] = React.useState(100000);
  const [cpm, setCpm] = React.useState(4.00);
  const [engagement, setEngagement] = React.useState(5);
  const [country, setCountry] = React.useState('US');

  // 计算收入
  const calculateEarnings = () => {
    const baseEarnings = (views / 1000) * cpm;
    const engagementMultiplier = 1 + (engagement / 100);
    const totalEarnings = baseEarnings * engagementMultiplier;
    
    return {
      daily: totalEarnings / 30,
      monthly: totalEarnings,
      yearly: totalEarnings * 12
    };
  };

  const earnings = calculateEarnings();

  // FAQ数据
  const faqs = [
    {
      question: "How accurate is this YouTube Money Calculator?",
      answer: "This calculator provides estimates based on average CPM rates and engagement metrics. Actual earnings vary based on your niche, audience location, ad types, and YouTube's revenue share (55% to creators)."
    },
    {
      question: "What is CPM and why does it matter?",
      answer: "CPM (Cost Per Mille) is the amount advertisers pay per 1,000 views. It varies by country, niche, and season. Finance and tech channels typically have higher CPMs ($8-15) while entertainment channels have lower CPMs ($2-5)."
    },
    {
      question: "How much do YouTubers make per 1,000 views?",
      answer: "On average, YouTubers earn $3-5 per 1,000 views through AdSense. However, this can range from $0.50 to $20+ depending on the factors mentioned above."
    },
    {
      question: "What affects YouTube earnings the most?",
      answer: "The biggest factors are: 1) Viewer location (US/UK/CA pay more), 2) Content niche (finance/tech > entertainment), 3) Watch time and engagement, 4) Ad-friendly content, and 5) Seasonal trends."
    }
  ];

  // 国家CPM数据
  const countryCPM = {
    US: { cpm: 6.50, name: "United States" },
    UK: { cpm: 5.20, name: "United Kingdom" },
    CA: { cpm: 5.80, name: "Canada" },
    AU: { cpm: 5.00, name: "Australia" },
    DE: { cpm: 4.50, name: "Germany" },
    JP: { cpm: 3.80, name: "Japan" },
    KR: { cpm: 3.50, name: "South Korea" },
    IN: { cpm: 1.20, name: "India" },
    BR: { cpm: 1.50, name: "Brazil" }
  };

  return (
    <>
      <SEOHead
        title={moneyCalculatorSEO.title}
        description={moneyCalculatorSEO.description}
        canonical="https://tubefission.com/youtube-money-calculator"
        ogImage="https://tubefission.com/og-money-calculator.png"
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
              YouTube Money Calculator
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Estimate your YouTube earnings based on views, CPM, and engagement. 
              Free tool - no login required.
            </p>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
              {/* Input Fields */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Monthly Views
                  </label>
                  <input
                    type="number"
                    value={views}
                    onChange={(e) => setViews(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="100000"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Estimated monthly video views
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    CPM (Cost Per 1000 Views)
                  </label>
                  <select
                    value={country}
                    onChange={(e) => {
                      setCountry(e.target.value);
                      setCpm(countryCPM[e.target.value].cpm);
                    }}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500"
                  >
                    {Object.entries(countryCPM).map(([code, data]) => (
                      <option key={code} value={code}>
                        {data.name} - ${data.cpm.toFixed(2)} CPM
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    step="0.01"
                    value={cpm}
                    onChange={(e) => setCpm(Number(e.target.value))}
                    className="w-full mt-2 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Engagement Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={engagement}
                    onChange={(e) => setEngagement(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Likes + Comments / Views × 100
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Content Category
                  </label>
                  <select className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white">
                    <option value="general">General</option>
                    <option value="finance">Finance (High CPM)</option>
                    <option value="tech">Technology (High CPM)</option>
                    <option value="gaming">Gaming (Medium CPM)</option>
                    <option value="entertainment">Entertainment (Low CPM)</option>
                    <option value="education">Education (Medium CPM)</option>
                  </select>
                </div>
              </div>

              {/* Results */}
              <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-xl p-6 border border-indigo-500/30">
                <h2 className="text-2xl font-bold mb-6 text-center">Estimated Earnings</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                    <p className="text-slate-400 text-sm mb-1">Daily</p>
                    <p className="text-2xl font-bold text-green-400">
                      ${earnings.daily.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 text-center border-2 border-indigo-500">
                    <p className="text-slate-400 text-sm mb-1">Monthly</p>
                    <p className="text-3xl font-bold text-green-400">
                      ${earnings.monthly.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                    <p className="text-slate-400 text-sm mb-1">Yearly</p>
                    <p className="text-2xl font-bold text-green-400">
                      ${earnings.yearly.toFixed(2)}
                    </p>
                  </div>
                </div>
                <p className="text-center text-slate-400 text-sm mt-4">
                  *Estimates based on average CPM rates. Actual earnings may vary.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CPM Reference Table */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">CPM Rates by Country</h2>
            <div className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700">
              <table className="w-full">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-slate-300">Country</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-slate-300">Avg CPM</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-slate-300">Tier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {Object.entries(countryCPM)
                    .sort((a, b) => b[1].cpm - a[1].cpm)
                    .map(([code, data]) => (
                    <tr key={code} className="hover:bg-slate-700/50">
                      <td className="px-6 py-4 text-sm">{data.name}</td>
                      <td className="px-6 py-4 text-sm font-medium text-green-400">
                        ${data.cpm.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {data.cpm >= 5 ? (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">High</span>
                        ) : data.cpm >= 3 ? (
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">Medium</span>
                        ) : (
                          <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded">Low</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
              <a href="/youtube-channel-analytics" className="block bg-slate-800/50 rounded-lg p-6 border border-slate-700 hover:border-indigo-500 transition-colors">
                <h3 className="font-semibold mb-2">Channel Analytics</h3>
                <p className="text-sm text-slate-400">Analyze any YouTube channel</p>
              </a>
              <a href="/youtube-seo-tool" className="block bg-slate-800/50 rounded-lg p-6 border border-slate-700 hover:border-indigo-500 transition-colors">
                <h3 className="font-semibold mb-2">SEO Tool</h3>
                <p className="text-sm text-slate-400">Optimize your video SEO</p>
              </a>
              <a href="/youtube-video-analyzer" className="block bg-slate-800/50 rounded-lg p-6 border border-slate-700 hover:border-indigo-500 transition-colors">
                <h3 className="font-semibold mb-2">Video Analyzer</h3>
                <p className="text-sm text-slate-400">Deep video performance analysis</p>
              </a>
            </div>
          </div>
        </section>

        {/* Internal Links */}
        <InternalLinking links={[
          { href: '/youtube-niche-finder', title: 'YouTube Niche Finder', description: 'Discover profitable content niches with AI-powered analysis and CPM data.' },
          { href: '/channel', title: 'Channel Analytics', description: 'Analyze any YouTube channel for growth metrics, engagement, and competitor insights.' },
          { href: '/youtube-opportunity-finder', title: 'YouTube Opportunity Finder', description: 'Find untapped content opportunities and high-potential niches in your market.' },
          { href: '/youtube-seo-tool', title: 'YouTube SEO Tool', description: 'Optimize your video titles, descriptions, and tags for higher search rankings.' },
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

export default YouTubeMoneyCalculator;
