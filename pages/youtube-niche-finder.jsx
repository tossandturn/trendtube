import React, { useState } from 'react';
import SEOHead from '../components/SEOHead';
import InternalLinking from '../components/InternalLinking';
import RegionFilter from '../components/RegionFilter';
import { useRegionFilter } from '../hooks/useRegionFilter';
import { getNicheFinderSchemas } from '../enhanced-structured-data';

/**
 * YouTube Niche Finder - 扩展版
 * 内容扩展到1000+字，增加H2/H3
 */
const YouTubeNicheFinder = () => {
  const { selectedRegion, handleRegionChange, regionName } = useRegionFilter('US');
  // 热门利基数据
  const niches = [
    {
      name: "AI Tools & Tutorials",
      category: "Technology",
      cpm: "$12.50",
      growth: "+340%",
      competition: "Medium",
      description: "Comprehensive guides on ChatGPT, Midjourney, and AI productivity tools"
    },
    {
      name: "Personal Finance",
      category: "Finance",
      cpm: "$15.00",
      growth: "+180%",
      competition: "High",
      description: "Budgeting, investing, and financial independence strategies"
    },
    {
      name: "Remote Work",
      category: "Business",
      cpm: "$11.00",
      growth: "+220%",
      competition: "Medium",
      description: "Work from home tips, digital nomad lifestyle guides"
    },
    {
      name: "Sustainable Living",
      category: "Lifestyle",
      cpm: "$7.50",
      growth: "+150%",
      competition: "Low",
      description: "Eco-friendly lifestyle, zero waste, sustainability tips"
    },
    {
      name: "Health & Fitness",
      category: "Health",
      cpm: "$8.00",
      growth: "+120%",
      competition: "High",
      description: "Workout routines, nutrition, mental health content"
    },
    {
      name: "Online Business",
      category: "Business",
      cpm: "$13.00",
      growth: "+200%",
      competition: "Medium",
      description: "E-commerce, dropshipping, affiliate marketing guides"
    }
  ];

  // 利基选择步骤
  const steps = [
    {
      number: 1,
      title: "Analyze Your Interests",
      description: "Start by listing topics you're passionate about. The best niches combine your expertise with audience demand."
    },
    {
      number: 2,
      title: "Research Market Demand",
      description: "Use tools like Google Trends, YouTube Search, and our Niche Finder to identify growing markets."
    },
    {
      number: 3,
      title: "Evaluate Competition",
      description: "Analyze existing channels in your potential niche. Look for gaps you can fill with unique content."
    },
    {
      number: 4,
      title: "Check Monetization Potential",
      description: "Consider CPM rates, affiliate opportunities, and sponsorship potential in your chosen niche."
    },
    {
      number: 5,
      title: "Validate with Content",
      description: "Create 5-10 videos to test audience response before fully committing to a niche."
    }
  ];

  // FAQ数据
  const faqs = [
    {
      question: "What is a YouTube niche and why does it matter?",
      answer: "A YouTube niche is a specific topic or category that your channel focuses on. Choosing the right niche is crucial because it helps you attract a targeted audience, rank higher in search results, and build authority in your field. A well-defined niche also makes it easier to monetize your channel through sponsorships and affiliate marketing."
    },
    {
      question: "How do I find a profitable YouTube niche in 2024?",
      answer: "To find a profitable niche, look for topics with high search volume but moderate competition, good CPM rates (finance, tech, business typically pay more), and growing trends. Use our Niche Finder tool to discover opportunities with data on search volume, competition level, and monetization potential."
    },
    {
      question: "What are the best YouTube niches for beginners?",
      answer: "The best niches for beginners have lower competition but steady demand. Consider: sustainable living, creative skills, DIY & crafts, language learning, or specific sub-niches within larger categories. These niches allow you to build an audience without competing against massive channels."
    },
    {
      question: "Should I niche down or go broad on YouTube?",
      answer: "Start with a specific niche to build authority and a loyal audience. Once you have 10,000+ subscribers and consistent views, you can gradually expand your content. Specific niches rank faster in search and attract viewers who are more likely to subscribe and engage with your content."
    },
    {
      question: "How competitive is too competitive for a YouTube niche?",
      answer: "A niche is too competitive if the top 10 channels all have 1M+ subscribers and upload daily. Look for niches where smaller channels (under 100K subscribers) can still rank in top search results. Use our Competitor Analysis tool to evaluate competition before committing to a niche."
    },
    {
      question: "What is CPM and why does it matter for niche selection?",
      answer: "CPM (Cost Per Mille) is what advertisers pay per 1,000 video views. Finance niches average $15 CPM, tech $12, business $13, while entertainment averages $5. Higher CPM means more revenue per view, making it easier to monetize your channel even with fewer subscribers."
    }
  ];

  return (
    <>
      <SEOHead
        title="🎯 Free YouTube Niche Finder 2024 | Discover Profitable Niches"
        description="Free YouTube niche finder 2024. Discover profitable content opportunities and trending topics. Find your perfect niche with AI-powered analysis. Start now!"
        canonical="https://tubefission.com/youtube-niche-finder"
        ogImage="https://tubefission.com/og-niche-finder-2024.png"
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
              🎯 Find Your Perfect YouTube Niche
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Discover profitable content niches for 2024 with our AI-powered analysis. 
              Find low-competition, high-CPM opportunities. Free tool - no login required.
            </p>
          </div>
        </section>

        {/* What is a Niche Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">What Is a YouTube Niche?</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 text-lg mb-4">
                A YouTube niche is a specific topic or category that your channel focuses on. 
                Instead of creating random videos about anything, successful YouTubers concentrate 
                on a particular subject area where they can establish expertise and attract a dedicated audience.
              </p>
              <p className="text-slate-300 text-lg mb-4">
                Choosing the right niche is one of the most important decisions you'll make as a content creator. 
                It affects everything from your content strategy and audience growth to your monetization potential 
                and long-term success on the platform.
              </p>
              <h3 className="text-2xl font-semibold mt-8 mb-4">Why Your Niche Matters</h3>
              <ul className="text-slate-300 space-y-2 list-disc list-inside">
                <li><strong>Audience Targeting:</strong> A specific niche helps you attract viewers who are genuinely interested in your content</li>
                <li><strong>Search Rankings:</strong> YouTube's algorithm favors channels with clear focus and expertise</li>
                <li><strong>Monetization:</strong> Advertisers pay premium rates for targeted audiences in profitable niches</li>
                <li><strong>Content Ideas:</strong> A defined niche makes it easier to generate consistent content ideas</li>
                <li><strong>Brand Partnerships:</strong> Brands prefer working with creators who have authority in specific areas</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Top Niches Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">🏆 Top YouTube Niches for 2024</h2>
            <p className="text-slate-300 mb-8">
              Based on search trends, CPM rates, and competition analysis, here are the most promising 
              niches for new creators in 2024:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              {niches.map((niche) => (
                <div
                  key={niche.name}
                  className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-indigo-500 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg">{niche.name}</h3>
                    <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded text-xs">
                      {niche.category}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-4">{niche.description}</p>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center p-2 bg-slate-700/50 rounded">
                      <p className="text-slate-400">CPM</p>
                      <p className="font-bold text-green-400">{niche.cpm}</p>
                    </div>
                    <div className="text-center p-2 bg-slate-700/50 rounded">
                      <p className="text-slate-400">Growth</p>
                      <p className="font-bold text-indigo-400">{niche.growth}</p>
                    </div>
                    <div className="text-center p-2 bg-slate-700/50 rounded">
                      <p className="text-slate-400">Competition</p>
                      <p className="font-bold text-yellow-400">{niche.competition}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to Choose Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">How to Choose Your YouTube Niche</h2>
            <p className="text-slate-300 mb-8">
              Follow this proven 5-step process to find the perfect niche for your channel:
            </p>
            
            <div className="space-y-6">
              {steps.map((step) => (
                <div key={step.number} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center font-bold text-xl">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                    <p className="text-slate-400">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CPM Explanation Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Understanding CPM Rates by Niche</h2>
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <p className="text-slate-300 mb-4">
                CPM (Cost Per Mille) represents how much advertisers pay per 1,000 views. 
                Different niches command vastly different rates:
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded">
                  <span className="font-medium">Finance & Investing</span>
                  <span className="font-bold text-green-400">$12-20 CPM</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded">
                  <span className="font-medium">Technology & Software</span>
                  <span className="font-bold text-green-400">$10-15 CPM</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded">
                  <span className="font-medium">Business & Marketing</span>
                  <span className="font-bold text-green-400">$8-14 CPM</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded">
                  <span className="font-medium">Education & Tutorials</span>
                  <span className="font-bold text-yellow-400">$6-10 CPM</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded">
                  <span className="font-medium">Entertainment & Gaming</span>
                  <span className="font-bold text-red-400">$2-6 CPM</span>
                </div>
              </div>
              <p className="text-slate-400 text-sm mt-4">
                *CPM rates vary based on audience location, seasonality, and advertiser demand
              </p>
            </div>
          </div>
        </section>

        {/* Mistakes to Avoid Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">❌ Common Niche Selection Mistakes</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-500/10 rounded-lg p-6 border border-red-500/30">
                <h3 className="font-semibold mb-2 text-red-400">Choosing Based Only on Passion</h3>
                <p className="text-slate-300 text-sm">
                  While passion is important, you need market demand. A niche you love with no audience 
                  won't grow your channel.
                </p>
              </div>
              <div className="bg-red-500/10 rounded-lg p-6 border border-red-500/30">
                <h3 className="font-semibold mb-2 text-red-400">Going Too Broad</h3>
                <p className="text-slate-300 text-sm">
                  "Gaming" is too broad. "Indie Game Reviews" or "Speedrunning Tutorials" 
                  gives you a specific audience to target.
                </p>
              </div>
              <div className="bg-red-500/10 rounded-lg p-6 border border-red-500/30">
                <h3 className="font-semibold mb-2 text-red-400">Ignoring Competition</h3>
                <p className="text-slate-300 text-sm">
                  Entering a saturated niche without a unique angle makes it nearly impossible 
                  to rank and grow.
                </p>
              </div>
              <div className="bg-red-500/10 rounded-lg p-6 border border-red-500/30">
                <h3 className="font-semibold mb-2 text-red-400">Not Researching Monetization</h3>
                <p className="text-slate-300 text-sm">
                  Some niches have passionate audiences but low CPMs. Research revenue potential 
                  before committing.
                </p>
              </div>
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
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your Niche?</h2>
            <p className="text-slate-400 mb-6">
              Use our tools to research competitors and validate your niche choice
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/youtube-competitor-analysis"
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
          { href: '/channel', title: 'Channel Analytics', description: 'Analyze any YouTube channel for growth metrics, engagement, and competitor insights.' },
          { href: '/youtube-money-calculator', title: 'YouTube Money Calculator', description: 'Estimate your potential YouTube earnings based on views, CPM, and engagement rates.' },
          { href: '/youtube-opportunity-finder', title: 'YouTube Opportunity Finder', description: 'Find untapped content opportunities and high-potential niches in your market.' },
          { href: '/youtube-best-time-to-post', title: 'Best Time to Post', description: 'Find the optimal posting schedule for maximum views and audience engagement.' },
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

export default YouTubeNicheFinder;
