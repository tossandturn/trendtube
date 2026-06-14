import React, { useState } from 'react';
import SEOHead from '../components/SEOHead';
import InternalLinking from '../components/InternalLinking';
import RegionFilter from '../components/RegionFilter';
import { useRegionFilter } from '../hooks/useRegionFilter';
import { bestTimeSEO } from '../tubefission-seo-config';

/**
 * Best Time to Post on YouTube页面
 * 数据驱动的最佳发布时间分析
 */
const BestTimeToPost = () => {
  const { selectedRegion, handleRegionChange, regionName } = useRegionFilter('US');
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [selectedCategory, setSelectedCategory] = useState('general');

  // 最佳发布时间数据
  const timeData = {
    US: {
      name: "United States",
      timezone: "EST (UTC-5)",
      bestDays: ["Thursday", "Friday", "Saturday"],
      peakHours: ["14:00", "15:00", "16:00"],
      secondaryHours: ["09:00", "12:00", "19:00"],
      worstDays: ["Sunday", "Monday"],
      worstHours: ["02:00", "03:00", "04:00"],
      stats: {
        avgViews: "+35%",
        engagement: "+28%",
        ctr: "+22%"
      }
    },
    UK: {
      name: "United Kingdom",
      timezone: "GMT (UTC+0)",
      bestDays: ["Thursday", "Friday"],
      peakHours: ["15:00", "16:00", "17:00"],
      secondaryHours: ["12:00", "19:00", "20:00"],
      worstDays: ["Monday", "Tuesday"],
      worstHours: ["01:00", "02:00", "06:00"],
      stats: {
        avgViews: "+32%",
        engagement: "+25%",
        ctr: "+20%"
      }
    },
    JP: {
      name: "Japan",
      timezone: "JST (UTC+9)",
      bestDays: ["Saturday", "Sunday"],
      peakHours: ["19:00", "20:00", "21:00"],
      secondaryHours: ["12:00", "17:00", "22:00"],
      worstDays: ["Monday", "Tuesday"],
      worstHours: ["03:00", "04:00", "05:00"],
      stats: {
        avgViews: "+38%",
        engagement: "+31%",
        ctr: "+24%"
      }
    },
    KR: {
      name: "South Korea",
      timezone: "KST (UTC+9)",
      bestDays: ["Friday", "Saturday"],
      peakHours: ["20:00", "21:00", "22:00"],
      secondaryHours: ["13:00", "18:00", "23:00"],
      worstDays: ["Monday", "Tuesday"],
      worstHours: ["02:00", "03:00", "06:00"],
      stats: {
        avgViews: "+36%",
        engagement: "+29%",
        ctr: "+23%"
      }
    },
    CA: {
      name: "Canada",
      timezone: "EST (UTC-5)",
      bestDays: ["Thursday", "Friday", "Saturday"],
      peakHours: ["14:00", "15:00", "16:00"],
      secondaryHours: ["09:00", "12:00", "19:00"],
      worstDays: ["Sunday", "Monday"],
      worstHours: ["02:00", "03:00", "04:00"],
      stats: {
        avgViews: "+33%",
        engagement: "+26%",
        ctr: "+21%"
      }
    },
    AU: {
      name: "Australia",
      timezone: "AEST (UTC+10)",
      bestDays: ["Thursday", "Friday"],
      peakHours: ["16:00", "17:00", "18:00"],
      secondaryHours: ["11:00", "14:00", "20:00"],
      worstDays: ["Monday", "Tuesday"],
      worstHours: ["01:00", "02:00", "05:00"],
      stats: {
        avgViews: "+30%",
        engagement: "+24%",
        ctr: "+19%"
      }
    }
  };

  // 类别特定数据
  const categoryData = {
    general: { multiplier: 1.0, note: "Standard performance" },
    gaming: { multiplier: 1.15, note: "Best: 6PM-10PM on weekends" },
    education: { multiplier: 1.1, note: "Best: 2PM-4PM weekdays" },
    entertainment: { multiplier: 1.2, note: "Best: 7PM-10PM daily" },
    tech: { multiplier: 1.08, note: "Best: 12PM-2PM weekdays" },
    beauty: { multiplier: 1.12, note: "Best: 8PM-10PM weekdays" },
    fitness: { multiplier: 1.05, note: "Best: 5AM-7AM & 6PM-8PM" },
    cooking: { multiplier: 1.1, note: "Best: 11AM-1PM & 5PM-7PM" }
  };

  const currentData = timeData[selectedCountry];
  const currentCategory = categoryData[selectedCategory];

  // FAQ数据
  const faqs = [
    {
      question: "What is the best time to post on YouTube?",
      answer: "The best time to post on YouTube varies by country and audience. Generally, Thursday to Saturday between 2PM-4PM (local time) shows the highest engagement. However, gaming content performs better in the evening (6PM-10PM), while educational content does well in the afternoon (2PM-4PM)."
    },
    {
      question: "Does posting time really matter on YouTube?",
      answer: "Yes, posting time significantly impacts initial performance. Videos posted during peak hours get more initial views, which signals YouTube's algorithm to recommend your content. Our data shows up to 35% more views when posting at optimal times."
    },
    {
      question: "How do I find my audience's best time?",
      answer: "Check YouTube Analytics under Audience > When your viewers are on YouTube. This shows when your specific audience is most active. Combine this data with our tool's recommendations for your target country."
    },
    {
      question: "Should I post at the same time every day?",
      answer: "Consistency helps, but it's not mandatory. Focus on posting during your audience's peak hours, even if that varies by day. Weekend evenings typically perform better for entertainment, while weekday afternoons work well for educational content."
    }
  ];

  // 生成24小时热力图数据
  const generateHeatmapData = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    return days.map(day => ({
      day,
      hours: hours.map(hour => {
        let score = 50; // Base score
        
        // Country factor
        if (currentData.bestDays.includes(day)) score += 30;
        if (currentData.worstDays.includes(day)) score -= 20;
        
        const hourStr = hour.toString().padStart(2, '0') + ':00';
        if (currentData.peakHours.includes(hourStr)) score += 25;
        if (currentData.secondaryHours.includes(hourStr)) score += 10;
        if (currentData.worstHours.includes(hourStr)) score -= 15;
        
        // Category multiplier
        score = Math.round(score * currentCategory.multiplier);
        
        return { hour, score: Math.min(100, Math.max(0, score)) };
      })
    }));
  };

  const heatmapData = generateHeatmapData();

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getScoreOpacity = (score) => {
    return Math.max(0.2, score / 100);
  };

  return (
    <>
      <SEOHead
        title={bestTimeSEO.title}
        description={bestTimeSEO.description}
        canonical="https://tubefission.com/youtube-best-time-to-post"
        ogImage="https://tubefission.com/og-best-time.png"
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
              Best Time to Post on YouTube
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Data-driven insights on the optimal posting times for maximum views and engagement. 
              Free tool - no login required.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Target Country
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500"
                  >
                    {Object.entries(timeData).map(([code, data]) => (
                      <option key={code} value={code}>{data.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Content Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="general">General</option>
                    <option value="gaming">Gaming</option>
                    <option value="education">Education</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="tech">Technology</option>
                    <option value="beauty">Beauty & Fashion</option>
                    <option value="fitness">Fitness & Health</option>
                    <option value="cooking">Cooking & Food</option>
                  </select>
                  <p className="text-xs text-slate-400 mt-1">{currentCategory.note}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Best Times Summary */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Best Days */}
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30">
                <h3 className="text-lg font-semibold mb-4 text-green-400">Best Days</h3>
                <div className="space-y-2">
                  {currentData.bestDays.map((day, index) => (
                    <div key={day} className="flex items-center gap-2">
                      <span className="text-2xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
                      <span className="font-medium">{day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Peak Hours */}
              <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl p-6 border border-indigo-500/30">
                <h3 className="text-lg font-semibold mb-4 text-indigo-400">Peak Hours</h3>
                <div className="space-y-2">
                  {currentData.peakHours.map((hour) => (
                    <div key={hour} className="flex items-center gap-2">
                      <span className="text-xl">⚡</span>
                      <span className="font-medium">{hour} {currentData.timezone.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Stats */}
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-blue-500/30">
                <h3 className="text-lg font-semibold mb-4 text-blue-400">Performance Boost</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Avg Views</span>
                    <span className="text-green-400 font-bold">{currentData.stats.avgViews}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Engagement</span>
                    <span className="text-green-400 font-bold">{currentData.stats.engagement}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">CTR</span>
                    <span className="text-green-400 font-bold">{currentData.stats.ctr}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Heatmap */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Weekly Posting Heatmap</h2>
            <p className="text-slate-400 mb-6">
              {currentData.name} • {currentData.timezone} • {categoryData[selectedCategory].note}
            </p>
            
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Hour labels */}
                <div className="flex mb-2">
                  <div className="w-20"></div>
                  {Array.from({ length: 24 }, (_, i) => (
                    <div key={i} className="flex-1 text-center text-xs text-slate-500">
                      {i.toString().padStart(2, '0')}
                    </div>
                  ))}
                </div>
                
                {/* Heatmap grid */}
                {heatmapData.map(({ day, hours }) => (
                  <div key={day} className="flex items-center mb-1">
                    <div className="w-20 text-sm text-slate-300">{day.slice(0, 3)}</div>
                    <div className="flex-1 flex gap-0.5">
                      {hours.map(({ hour, score }) => (
                        <div
                          key={hour}
                          className={`flex-1 h-8 rounded ${getScoreColor(score)}`}
                          style={{ opacity: getScoreOpacity(score) }}
                          title={`${day} ${hour}:00 - Score: ${score}/100`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
                
                {/* Legend */}
                <div className="flex items-center justify-end gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-slate-400">Best (80-100)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="text-slate-400">Good (60-79)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                    <span className="text-slate-400">Average (40-59)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-slate-400">Poor (0-39)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Country Comparison */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Best Times by Country</h2>
            <div className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700">
              <table className="w-full">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-slate-300">Country</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-slate-300">Best Days</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-slate-300">Peak Hours</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-slate-300">Timezone</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {Object.entries(timeData).map(([code, data]) => (
                    <tr 
                      key={code} 
                      className={`hover:bg-slate-700/50 ${selectedCountry === code ? 'bg-indigo-500/10' : ''}`}
                      onClick={() => setSelectedCountry(code)}
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium">{data.name}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {data.bestDays.join(', ')}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {data.peakHours.slice(0, 2).join(', ')}...
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {data.timezone}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Pro Tips for Maximum Engagement</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                <h3 className="font-semibold mb-2 text-indigo-400">⏰ Schedule in Advance</h3>
                <p className="text-slate-300 text-sm">
                  Use YouTube's scheduled publishing feature to post at optimal times, even if you're not available. 
                  This ensures consistency and maximum reach.
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                <h3 className="font-semibold mb-2 text-indigo-400">📊 Monitor Your Analytics</h3>
                <p className="text-slate-300 text-sm">
                  Check YouTube Studio's "When your viewers are on YouTube" report to find your specific 
                  audience's peak activity times.
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                <h3 className="font-semibold mb-2 text-indigo-400">🎯 Consider Time Zones</h3>
                <p className="text-slate-300 text-sm">
                  If you have a global audience, post when your largest viewer segment is most active. 
                  You can also create content specifically for different time zones.
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                <h3 className="font-semibold mb-2 text-indigo-400">🔄 Test Different Times</h3>
                <p className="text-slate-300 text-sm">
                  Experiment with posting at different times and track performance. What works for others 
                  may not work for your specific audience.
                </p>
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
              <a href="/youtube-seo-tool" className="block bg-slate-800/50 rounded-lg p-6 border border-slate-700 hover:border-indigo-500 transition-colors">
                <h3 className="font-semibold mb-2">SEO Tool</h3>
                <p className="text-sm text-slate-400">Optimize video SEO</p>
              </a>
              <a href="/trending" className="block bg-slate-800/50 rounded-lg p-6 border border-slate-700 hover:border-indigo-500 transition-colors">
                <h3 className="font-semibold mb-2">Trending Videos</h3>
                <p className="text-sm text-slate-400">Discover viral content</p>
              </a>
            </div>
          </div>
        </section>

        {/* Internal Links */}
        <InternalLinking links={[
          { href: '/youtube-niche-finder', title: 'YouTube Niche Finder', description: 'Discover profitable content niches with AI-powered analysis and CPM data.' },
          { href: '/youtube-opportunity-finder', title: 'YouTube Opportunity Finder', description: 'Find untapped content opportunities and high-potential niches in your market.' },
          { href: '/channel', title: 'Channel Analytics', description: 'Analyze any YouTube channel for growth metrics, engagement, and competitor insights.' },
          { href: '/trends', title: 'YouTube Trends', description: 'Discover trending videos and viral content ideas across multiple countries.' },
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

export default BestTimeToPost;
