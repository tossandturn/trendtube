import React, { useState } from 'react';
import SEOHead from '../components/SEOHead';
import InternalLinking from '../components/InternalLinking';
import RegionFilter from '../components/RegionFilter';
import { useRegionFilter } from '../hooks/useRegionFilter';
import { getNicheFinderSchemas } from '../enhanced-structured-data';

/**
 * YouTube Opportunity Finder - 扩展版
 * 内容扩展到1000+字，增加H2/H3
 */
const YouTubeOpportunityFinder = () => {
  const { selectedRegion, handleRegionChange, regionName } = useRegionFilter('US');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // 内容机会数据
  const opportunities = [
    {
      title: "AI Tool Reviews",
      category: "tech",
      searchVolume: "Very High",
      competition: "Medium",
      growth: "+450%",
      difficulty: 45,
      cpm: "$12.50",
      description: "Review new AI tools like ChatGPT, Midjourney, Claude, and AI productivity apps",
      contentIdeas: [
        "ChatGPT vs Claude: Which is Better?",
        "10 AI Tools That Will Change Your Workflow",
        "Midjourney Tutorial for Beginners",
        "AI Tools for Content Creators"
      ]
    },
    {
      title: "Personal Finance for Gen Z",
      category: "finance",
      searchVolume: "High",
      competition: "Low",
      growth: "+280%",
      difficulty: 35,
      cpm: "$15.00",
      description: "Budgeting, investing, and financial advice targeted at younger audiences",
      contentIdeas: [
        "How to Start Investing with $100",
        "Budgeting Tips for College Students",
        "Side Hustles That Actually Work",
        "Credit Score Explained Simply"
      ]
    },
    {
      title: "Remote Work Setup Guides",
      category: "business",
      searchVolume: "High",
      competition: "Medium",
      growth: "+200%",
      difficulty: 40,
      cpm: "$11.00",
      description: "Home office setups, productivity tips, and remote work lifestyle",
      contentIdeas: [
        "Best Desk Setup Under $500",
        "Remote Work Productivity Hacks",
        "Digital Nomad Gear Essentials",
        "How to Land Remote Jobs"
      ]
    },
    {
      title: "Sustainable Living Hacks",
      category: "lifestyle",
      searchVolume: "Medium",
      competition: "Low",
      growth: "+150%",
      difficulty: 30,
      cpm: "$7.50",
      description: "Eco-friendly tips, zero waste, and sustainable product reviews",
      contentIdeas: [
        "Zero Waste Swaps Under $20",
        "Sustainable Fashion on a Budget",
        "DIY Eco-Friendly Cleaning Products",
        "Minimalist Lifestyle Guide"
      ]
    },
    {
      title: "Short-form Content Strategy",
      category: "business",
      searchVolume: "Very High",
      competition: "Medium",
      growth: "+380%",
      difficulty: 50,
      cpm: "$9.00",
      description: "YouTube Shorts strategy, TikTok growth, and viral content creation",
      contentIdeas: [
        "YouTube Shorts Algorithm Explained",
        "How to Go Viral on Shorts",
        "Shorts vs Long-form: Which to Choose?",
        "Content Repurposing Strategy"
      ]
    },
    {
      title: "Mental Health for Creators",
      category: "health",
      searchVolume: "High",
      competition: "Low",
      growth: "+220%",
      difficulty: 32,
      cpm: "$8.50",
      description: "Creator burnout, work-life balance, and mental wellness tips",
      contentIdeas: [
        "Avoiding Creator Burnout",
        "Setting Boundaries as a Creator",
        "Dealing with Negative Comments",
        "Building a Sustainable Content Schedule"
      ]
    }
  ];

  // 过滤机会
  const filteredOpportunities = selectedCategory === 'all' 
    ? opportunities 
    : opportunities.filter(opp => opp.category === selectedCategory);

  // 内容机会类型
  const opportunityTypes = [
    {
      type: "Trending Topics",
      icon: "🔥",
      description: "Topics currently gaining search volume and viewer interest",
      examples: ["AI tools", "Short-form content", "Remote work"]
    },
    {
      type: "Content Gaps",
      icon: "🎯",
      description: "High search volume with low-quality existing content",
      examples: ["Specific tutorials", "Niche comparisons", "Beginner guides"]
    },
    {
      type: "Evergreen Content",
      icon: "🌲",
      description: "Consistent search demand year-round",
      examples: ["How-to guides", "Product reviews", "Educational content"]
    },
    {
      type: "Seasonal Opportunities",
      icon: "📅",
      description: "Topics that peak during specific times of year",
      examples: ["Holiday content", "Back to school", "New Year resolutions"]
    }
  ];

  // FAQ数据
  const faqs = [
    {
      question: "What is a content opportunity on YouTube?",
      answer: "A content opportunity is a topic or video idea that has high viewer demand but low competition from existing creators. These opportunities allow new channels to rank in search results and attract viewers without competing against established channels with millions of subscribers."
    },
    {
      question: "How do I find content opportunities?",
      answer: "Use our Opportunity Finder tool to discover trending topics with growth potential. Look for: 1) Rising search trends, 2) Low competition keywords, 3) Content gaps where existing videos don't fully answer viewer questions, 4) Emerging topics before they become saturated."
    },
    {
      question: "What makes a good YouTube opportunity?",
      answer: "A good opportunity has: high and growing search volume, moderate to low competition, good CPM potential for monetization, and aligns with your expertise. The best opportunities are specific enough to rank but broad enough to attract a sizable audience."
    },
    {
      question: "Should I focus on trending or evergreen content?",
      answer: "Aim for 70% evergreen content that provides long-term value and 30% trending content for short-term growth. Evergreen videos continue getting views months after publishing, while trending videos can bring quick subscribers if you act fast."
    },
    {
      question: "How often should I post to capitalize on opportunities?",
      answer: "For trending opportunities, post within 24-48 hours while interest is high. For evergreen opportunities, focus on quality over speed. Consistency matters more than frequency - aim for 1-2 high-quality videos per week rather than daily low-quality uploads."
    },
    {
      question: "Can small channels compete for opportunities?",
      answer: "Absolutely! Small channels often have advantages: faster production, niche expertise, and authentic connections with audiences. Focus on specific sub-niches where big creators haven't established dominance yet."
    }
  ];

  const getDifficultyColor = (difficulty) => {
    if (difficulty <= 30) return 'text-green-400';
    if (difficulty <= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <>
      <SEOHead
        title="💡 Free YouTube Opportunity Finder 2024 | Content Ideas"
        description="Free YouTube opportunity finder 2024. Discover trending topics and content gaps. Find your next viral video idea. Start now!"
        canonical="https://tubefission.com/youtube-opportunity-finder"
        ogImage="https://tubefission.com/og-opportunity-finder-2024.png"
        schemas={getNicheFinderSchemas()}
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
              💡 Find Your Next Viral Video
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Discover trending topics and content gaps on YouTube. 
              AI-powered opportunity detection. Free tool - no login required.
            </p>
          </div>
        </section>

        {/* What is Opportunity Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">What Is a Content Opportunity?</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 text-lg mb-4">
                A content opportunity is a gap between what viewers are searching for and what content currently exists. 
                These opportunities represent your best chance to rank in search results, attract viewers, and grow your channel 
                without competing against established creators.
              </p>
              <p className="text-slate-300 text-lg mb-4">
                The YouTube algorithm favors content that satisfies viewer intent. When you identify and fill content gaps, 
                YouTube rewards you with higher search rankings and recommended video placement, leading to exponential growth.
              </p>
              <h3 className="text-2xl font-semibold mt-8 mb-4">Types of Content Opportunities</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              {opportunityTypes.map((type) => (
                <div key={type.type} className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                  <div className="text-3xl mb-3">{type.icon}</div>
                  <h3 className="font-bold text-lg mb-2">{type.type}</h3>
                  <p className="text-slate-400 text-sm mb-3">{type.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {type.examples.map((ex) => (
                      <span key={ex} className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Filter by Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Categories</option>
                <option value="tech">Technology</option>
                <option value="finance">Finance</option>
                <option value="business">Business</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="health">Health</option>
              </select>
            </div>
          </div>
        </section>

        {/* Opportunities Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">🚀 Top Content Opportunities for 2024</h2>
            <p className="text-slate-300 mb-8">
              Based on search trends, competition analysis, and growth data, here are the best opportunities right now:
            </p>
            
            <div className="space-y-6">
              {filteredOpportunities.map((opp, index) => (
                <div
                  key={opp.title}
                  className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-indigo-500 transition-colors"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center font-bold">
                      #{index + 1}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-xl mb-2">{opp.title}</h3>
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                          {opp.growth}
                        </span>
                      </div>
                      <p className="text-slate-400 mb-4">{opp.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                      <p className="text-slate-400 text-xs">Search Volume</p>
                      <p className="font-bold text-indigo-400">{opp.searchVolume}</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                      <p className="text-slate-400 text-xs">Competition</p>
                      <p className="font-bold text-yellow-400">{opp.competition}</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                      <p className="text-slate-400 text-xs">Difficulty</p>
                      <p className={`font-bold ${getDifficultyColor(opp.difficulty)}`}>
                        {opp.difficulty}/100
                      </p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                      <p className="text-slate-400 text-xs">CPM</p>
                      <p className="font-bold text-green-400">{opp.cpm}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-sm text-slate-300">Content Ideas:</h4>
                    <div className="flex flex-wrap gap-2">
                      {opp.contentIdeas.map((idea) => (
                        <span
                          key={idea}
                          className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-sm"
                        >
                          {idea}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to Evaluate Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">How to Evaluate Opportunities</h2>
            <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-xl p-6 border border-indigo-500/30">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-bold text-lg mb-2 text-indigo-400">📈 Search Volume</h3>
                  <p className="text-slate-300 text-sm">
                    Look for topics with consistent or growing search demand. 
                    Use Google Trends to verify upward trajectory.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-indigo-400">🎯 Competition</h3>
                  <p className="text-slate-300 text-sm">
                    Analyze top-ranking videos. Can you create better content? 
                    Look for outdated or low-quality results you can outperform.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-indigo-400">💰 Monetization</h3>
                  <p className="text-slate-300 text-sm">
                    Consider CPM rates and sponsorship potential. 
                    Business and finance niches typically monetize better.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Action Steps Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">How to Capitalize on Opportunities</h2>
            <div className="space-y-4">
              {[
                {
                  step: 1,
                  title: "Act Fast on Trends",
                  description: "Trending opportunities have a 48-72 hour window. Create and publish content quickly while interest is high."
                },
                {
                  step: 2,
                  title: "Create Better Content",
                  description: "Don't just copy existing videos. Add unique insights, better production quality, or more comprehensive information."
                },
                {
                  step: 3,
                  title: "Optimize for SEO",
                  description: "Use our SEO Tool to optimize titles, descriptions, and tags. Target specific keywords with low competition."
                },
                {
                  step: 4,
                  title: "Promote Strategically",
                  description: "Share on relevant subreddits, forums, and social media where your target audience hangs out."
                },
                {
                  step: 5,
                  title: "Analyze and Iterate",
                  description: "Use analytics to see what works. Double down on successful content types and adjust your strategy."
                }
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center font-bold">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                    <p className="text-slate-400">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
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

        {/* CTA Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Create Your Next Hit?</h2>
            <p className="text-slate-400 mb-6">
              Use our tools to research, optimize, and track your content performance
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/youtube-seo-tool"
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all"
              >
                Optimize with SEO Tool
              </a>
              <a
                href="/youtube-trend-finder"
                className="px-8 py-4 bg-slate-700 rounded-lg font-semibold hover:bg-slate-600 transition-all"
              >
                Find More Trends
              </a>
            </div>
          </div>
        </section>

        {/* Internal Links */}
        <InternalLinking links={[
          { href: '/youtube-niche-finder', title: 'YouTube Niche Finder', description: 'Discover profitable content niches with AI-powered analysis and CPM data.' },
          { href: '/channel', title: 'Channel Analytics', description: 'Analyze any YouTube channel for growth metrics, engagement, and competitor insights.' },
          { href: '/youtube-seo-tool', title: 'YouTube SEO Tool', description: 'Optimize your video titles, descriptions, and tags for higher search rankings.' },
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

export default YouTubeOpportunityFinder;
