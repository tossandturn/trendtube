import React, { useState } from 'react';
import SEOHead from '../components/SEOHead';
import InternalLinking from '../components/InternalLinking';
import RegionFilter from '../components/RegionFilter';
import { useRegionFilter } from '../hooks/useRegionFilter';
import { getNicheFinderSchemas } from '../enhanced-structured-data';

// HowTo Schema for this page
const howToNicheSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Find Your Perfect YouTube Niche in 2026",
  "description": "Step-by-step guide to finding a profitable YouTube niche",
  "step": [
    {"@type": "HowToStep", "name": "Research Market Demand", "text": "Use YouTube search suggestions and Google Trends to identify topics with high search volume and growing interest. Look for keywords with 10K-500K monthly searches."},
    {"@type": "HowToStep", "name": "Analyze Competition", "text": "Check the top channels in each potential niche. Look for niches where top channels have under 100K subscribers - this indicates room for growth."},
    {"@type": "HowToStep", "name": "Evaluate Monetization Potential", "text": "Research CPM rates for different niches. Finance, tech, and business niches typically have CPMs of $8-15, while entertainment may be $2-5."},
    {"@type": "HowToStep", "name": "Validate Your Choice", "text": "Create 3-5 test videos in your chosen niche and measure audience response before committing fully."}
  ]
};

// Combine schemas
const howToNicheSchemas = [...getNicheFinderSchemas(), howToNicheSchema];

/**
 * How to Find YouTube Niche页面
 * /how-to-find-youtube-niche
 * 
 * 帮助用户发现YouTube内容利基
 */
const HowToFindYouTubeNiche = () => {
  const { selectedRegion, handleRegionChange, regionName } = useRegionFilter('US');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [competitionLevel, setCompetitionLevel] = useState('low');
  const [monetization, setMonetization] = useState('high');

  // 利基数据库
  const niches = [
    {
      name: "AI Tools & Tutorials",
      category: "tech",
      competition: "medium",
      monetization: "high",
      cpm: 12.50,
      searchVolume: "High",
      difficulty: 45,
      description: "Tutorials on ChatGPT, Midjourney, and AI productivity tools",
      subNiches: ["ChatGPT tutorials", "AI image generation", "AI for business", "AI automation"]
    },
    {
      name: "Personal Finance",
      category: "finance",
      competition: "high",
      monetization: "high",
      cpm: 15.00,
      searchVolume: "Very High",
      difficulty: 65,
      description: "Budgeting, investing, and financial independence",
      subNiches: ["Budgeting for beginners", "Stock market investing", "Side hustles", "Saving money tips"]
    },
    {
      name: "Remote Work",
      category: "business",
      competition: "medium",
      monetization: "high",
      cpm: 11.00,
      searchVolume: "High",
      difficulty: 50,
      description: "Work from home tips, digital nomad lifestyle",
      subNiches: ["Work from home setup", "Digital nomad guides", "Remote job hunting", "Productivity tips"]
    },
    {
      name: "Sustainable Living",
      category: "lifestyle",
      competition: "low",
      monetization: "medium",
      cpm: 7.50,
      searchVolume: "Medium",
      difficulty: 35,
      description: "Eco-friendly lifestyle, zero waste, sustainability",
      subNiches: ["Zero waste tips", "Sustainable products", "Eco-friendly DIY", "Minimalism"]
    },
    {
      name: "Health & Fitness",
      category: "health",
      competition: "high",
      monetization: "medium",
      cpm: 8.00,
      searchVolume: "Very High",
      difficulty: 70,
      description: "Workout routines, nutrition, mental health",
      subNiches: ["Home workouts", "Healthy meal prep", "Meditation guides", "Fitness challenges"]
    },
    {
      name: "Online Business",
      category: "business",
      competition: "medium",
      monetization: "high",
      cpm: 13.00,
      searchVolume: "High",
      difficulty: 55,
      description: "E-commerce, dropshipping, affiliate marketing",
      subNiches: ["Shopify tutorials", "Amazon FBA", "Affiliate marketing", "Online courses"]
    },
    {
      name: "Tech Reviews",
      category: "tech",
      competition: "high",
      monetization: "high",
      cpm: 10.00,
      searchVolume: "High",
      difficulty: 60,
      description: "Gadget reviews, software comparisons",
      subNiches: ["Phone reviews", "Laptop comparisons", "Budget tech", "Smart home devices"]
    },
    {
      name: "Creative Skills",
      category: "education",
      competition: "low",
      monetization: "medium",
      cpm: 6.50,
      searchVolume: "Medium",
      difficulty: 30,
      description: "Photography, video editing, graphic design",
      subNiches: ["Photography tips", "Video editing tutorials", "Canva tutorials", "Content creation"]
    },
    {
      name: "Cooking & Recipes",
      category: "food",
      competition: "high",
      monetization: "medium",
      cpm: 6.00,
      searchVolume: "Very High",
      difficulty: 68,
      description: "Quick recipes, meal prep, cooking techniques",
      subNiches: ["15-minute meals", "Meal prep ideas", "Budget cooking", "Healthy recipes"]
    },
    {
      name: "Gaming Guides",
      category: "gaming",
      competition: "high",
      monetization: "medium",
      cpm: 5.50,
      searchVolume: "Very High",
      difficulty: 72,
      description: "Game tutorials, walkthroughs, reviews",
      subNiches: ["Game tutorials", "Walkthroughs", "Gaming setup", "Indie games"]
    },
    {
      name: "Language Learning",
      category: "education",
      competition: "medium",
      monetization: "medium",
      cpm: 8.50,
      searchVolume: "High",
      difficulty: 48,
      description: "Language tutorials, learning tips",
      subNiches: ["English learning", "Spanish lessons", "Language hacks", "Pronunciation guides"]
    },
    {
      name: "DIY & Crafts",
      category: "lifestyle",
      competition: "low",
      monetization: "low",
      cpm: 4.50,
      searchVolume: "Medium",
      difficulty: 25,
      description: "DIY projects, crafting tutorials",
      subNiches: ["Home DIY", "Paper crafts", "Upcycling ideas", "Budget decor"]
    }
  ];

  // 过滤利基
  const filteredNiches = niches.filter(niche => {
    if (selectedCategory !== 'all' && niche.category !== selectedCategory) return false;
    if (competitionLevel === 'low' && niche.competition !== 'low') return false;
    if (competitionLevel === 'medium' && niche.competition === 'high') return false;
    if (monetization === 'high' && niche.monetization !== 'high') return false;
    return true;
  });

  // 获取难度颜色
  const getDifficultyColor = (difficulty) => {
    if (difficulty <= 30) return 'text-green-400';
    if (difficulty <= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  // 获取竞争标签
  const getCompetitionBadge = (level) => {
    const colors = {
      low: 'bg-green-500/20 text-green-400',
      medium: 'bg-yellow-500/20 text-yellow-400',
      high: 'bg-red-500/20 text-red-400'
    };
    return colors[level] || colors.medium;
  };

  // FAQ数据
  const faqs = [
    {
      question: "How do I find a profitable YouTube niche?",
      answer: "Look for niches with: 1) High search volume but moderate competition, 2) Good CPM rates (finance, tech, business), 3) Content you can create consistently, 4) Audience demand shown in trending topics. Use our Niche Finder tool to discover opportunities."
    },
    {
      question: "What are the best YouTube niches for 2024?",
      answer: "Top niches include: AI tools and tutorials, personal finance, health and fitness, sustainable living, remote work, online business, tech reviews, educational content, and creative skills. These have high CPMs and growing audiences."
    },
    {
      question: "Should I niche down or go broad?",
      answer: "Start with a specific niche to build authority and audience. Once established, you can gradually expand. Specific niches rank faster and attract more targeted viewers who are more likely to subscribe and engage."
    },
    {
      question: "How competitive is my niche?",
      answer: "Use our Niche Finder tool to analyze competition. Look at: 1) Number of channels in the niche, 2) Average subscriber count of top channels, 3) Upload frequency of competitors, 4) Engagement rates. Lower competition with steady demand is ideal."
    },
    {
      question: "What is CPM and why does it matter?",
      answer: "CPM (Cost Per Mille) is what advertisers pay per 1,000 views. Higher CPM niches like finance ($15), tech ($12), and business ($13) earn more than entertainment ($5) or gaming ($5.50). Choose a niche with good CPM for better monetization."
    }
  ];

  return (
    <>
      <SEOHead
        title="🎯 Free YouTube Niche Finder 2024 | Discover Profitable Niches"
        description="Free YouTube niche finder 2024. Discover profitable content opportunities and trending topics. Find your perfect niche with AI-powered analysis. Start now!"
        canonical="https://tubefission.com/how-to-find-youtube-niche"
        ogImage="https://tubefission.com/og-niche-finder-2024.png"
        schemas={howToNicheSchemas}
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
              🎯 How to Find Your YouTube Niche
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Discover profitable content niches and trending topics for 2024. 
              Free tool - no login required.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Category
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
                    <option value="health">Health & Fitness</option>
                    <option value="education">Education</option>
                    <option value="food">Food & Cooking</option>
                    <option value="gaming">Gaming</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Competition
                  </label>
                  <select
                    value={competitionLevel}
                    onChange={(e) => setCompetitionLevel(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">Any</option>
                    <option value="low">Low Competition</option>
                    <option value="medium">Medium & Below</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Monetization
                  </label>
                  <select
                    value={monetization}
                    onChange={(e) => setMonetization(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">Any</option>
                    <option value="high">High CPM Only</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Niche Results */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">
              {filteredNiches.length} Niches Found
            </h2>
            
            <div className="space-y-4">
              {filteredNiches.map((niche) => (
                <div
                  key={niche.name}
                  className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-indigo-500 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{niche.name}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getCompetitionBadge(niche.competition)}`}>
                          {niche.competition} competition
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm mb-3">{niche.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {niche.subNiches.map((sub) => (
                          <span
                            key={sub}
                            className="px-3 py-1 bg-slate-700 rounded-full text-xs text-slate-300"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-row md:flex-col gap-4 md:gap-2 text-sm">
                      <div className="text-center">
                        <p className="text-slate-400">CPM</p>
                        <p className="font-bold text-green-400">${niche.cpm.toFixed(2)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-slate-400">Volume</p>
                        <p className="font-bold text-indigo-400">{niche.searchVolume}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-slate-400">Difficulty</p>
                        <p className={`font-bold ${getDifficultyColor(niche.difficulty)}`}>
                          {niche.difficulty}/100
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Niche Selection Guide */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">🎓 Niche Selection Guide</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                <h3 className="font-semibold mb-2 text-indigo-400">✅ What Makes a Good Niche</h3>
                <ul className="text-slate-300 text-sm space-y-2">
                  <li>• High search volume with moderate competition</li>
                  <li>• CPM above $8 for good monetization</li>
                  <li>• Content you can create consistently</li>
                  <li>• Growing trend in search queries</li>
                  <li>• Audience willing to engage and subscribe</li>
                </ul>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                <h3 className="font-semibold mb-2 text-red-400">❌ Red Flags to Avoid</h3>
                <ul className="text-slate-300 text-sm space-y-2">
                  <li>• Oversaturated with big creators</li>
                  <li>• Declining search trends</li>
                  <li>• Content you can't sustain long-term</li>
                  <li>• Very low CPM ($2-3)</li>
                  <li>• Limited monetization options</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Top Niches 2024 */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">🏆 Top Niches for 2024</h2>
            <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-xl p-6 border border-indigo-500/30">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-3xl mb-2">🤖</p>
                  <h3 className="font-semibold mb-1">AI & Tech</h3>
                  <p className="text-slate-400 text-sm">CPM: $12.50</p>
                  <p className="text-green-400 text-sm">High growth</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl mb-2">💰</p>
                  <h3 className="font-semibold mb-1">Finance</h3>
                  <p className="text-slate-400 text-sm">CPM: $15.00</p>
                  <p className="text-green-400 text-sm">Very high demand</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl mb-2">💼</p>
                  <h3 className="font-semibold mb-1">Online Business</h3>
                  <p className="text-slate-400 text-sm">CPM: $13.00</p>
                  <p className="text-green-400 text-sm">Growing fast</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">❓ Frequently Asked Questions</h2>
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

        {/* CTA */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Your Channel?</h2>
            <p className="text-slate-400 mb-6">
              Use our tools to research your niche and optimize your content
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/youtube-channel-analytics"
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all"
              >
                Analyze Competitors
              </a>
              <a
                href="/youtube-trend-finder"
                className="px-8 py-4 bg-slate-700 rounded-lg font-semibold hover:bg-slate-600 transition-all"
              >
                Find Trends
              </a>
            </div>
          </div>
        </section>

        {/* Internal Links */}
        <InternalLinking links={[
          { href: '/youtube-niche-finder', title: 'YouTube Niche Finder', description: 'Discover profitable content niches with AI-powered analysis and CPM data.' },
          { href: '/youtube-opportunity-finder', title: 'YouTube Opportunity Finder', description: 'Find untapped content opportunities and high-potential niches in your market.' },
          { href: '/channel', title: 'Channel Analytics', description: 'Analyze any YouTube channel for growth metrics, engagement, and competitor insights.' },
          { href: '/youtube-money-calculator', title: 'YouTube Money Calculator', description: 'Estimate your potential YouTube earnings based on views, CPM, and engagement rates.' },
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

export default HowToFindYouTubeNiche;
