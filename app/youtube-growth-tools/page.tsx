import type { Metadata } from 'next'
import Link from 'next/link'
import { fetchTrendingVideos } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'

export const metadata: Metadata = {
  title: 'Best YouTube Growth Tools 2026 | Creator Resources & Software',
  description: 'Discover the best YouTube growth tools for creators. From analytics to AI-powered content creation, these tools will accelerate your channel growth.',
  keywords: 'youtube growth tools, youtube creator tools, youtube analytics tools, youtube seo tools, channel growth software',
}

const GROWTH_TOOLS = [
  {
    category: 'Trend Discovery',
    tools: [
      { name: 'TubeFission', desc: 'AI-powered trend prediction with real-time viral opportunity detection', free: true, paid: true },
      { name: 'Google Trends', desc: 'Free tool for tracking search interest over time', free: true, paid: false },
      { name: 'VidIQ', desc: 'Keyword research and competitor analysis', free: true, paid: true },
    ],
  },
  {
    category: 'Content Creation',
    tools: [
      { name: 'ChatGPT/Claude', desc: 'AI writing assistance for scripts and descriptions', free: true, paid: true },
      { name: 'Canva', desc: 'Thumbnail design and graphics creation', free: true, paid: true },
      { name: 'Descript', desc: 'AI-powered video editing and transcription', free: false, paid: true },
    ],
  },
  {
    category: 'Analytics & SEO',
    tools: [
      { name: 'YouTube Studio', desc: 'Native analytics and performance tracking', free: true, paid: false },
      { name: 'Social Blade', desc: 'Channel growth tracking and estimates', free: true, paid: true },
      { name: 'TubeBuddy', desc: 'SEO optimization and A/B testing', free: true, paid: true },
    ],
  },
  {
    category: 'Thumbnails & Design',
    tools: [
      { name: 'Photoshop', desc: 'Professional image editing and design', free: false, paid: true },
      { name: 'Remove.bg', desc: 'AI background removal for thumbnails', free: true, paid: true },
      { name: 'Figma', desc: 'Collaborative design tool for thumbnails', free: true, paid: true },
    ],
  },
  {
    category: 'Audio & Music',
    tools: [
      { name: 'Epidemic Sound', desc: 'Copyright-free music for creators', free: false, paid: true },
      { name: 'Audacity', desc: 'Free audio editing software', free: true, paid: false },
      { name: 'Adobe Podcast', desc: 'AI audio enhancement and editing', free: true, paid: true },
    ],
  },
]

const GROWTH_STRATEGIES = [
  {
    stage: '0-1K Subscribers',
    focus: 'Niche Selection',
    tools: ['TubeFission (trends)', 'Canva (thumbnails)', 'YouTube Studio'],
    tips: 'Focus on consistency over perfection. Upload 2-3 times weekly.',
  },
  {
    stage: '1K-10K Subscribers',
    focus: 'Optimization',
    tools: ['VidIQ/TubeBuddy', 'Social Blade', 'ChatGPT (scripts)'],
    tips: 'Start A/B testing thumbnails and titles. Double down on winning formats.',
  },
  {
    stage: '10K-100K Subscribers',
    focus: 'Scaling',
    tools: ['Descript', 'Epidemic Sound', 'Analytics APIs'],
    tips: 'Systematize content creation. Hire editors. Focus on community building.',
  },
  {
    stage: '100K+ Subscribers',
    focus: 'Diversification',
    tools: ['Team collaboration tools', 'Sponsorship platforms', 'Merch platforms'],
    tips: 'Expand to Shorts, podcasts, and other platforms. Build brand beyond YouTube.',
  },
]

export default async function YouTubeGrowthToolsPage() {
  const region = await getRegion()
  await fetchTrendingVideos(region, 50)

  return (
    <main className="min-h-screen bg-white text-gray-900 terminal-grid relative overflow-hidden">
      <div className="ambient-glow-tl" />
      <div className="ambient-glow-tr" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 sm:mb-8">
          <span className="text-lg">←</span>
          <span className="text-sm font-medium">Back to TubeFission</span>
        </Link>

        <div className="mb-8 sm:mb-12">
          <div className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase mb-2 data-mono">🛠️ CREATOR RESOURCES</div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-glow text-gray-900">
            YouTube Growth Tools
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl leading-relaxed mb-6">
            Essential tools and resources for YouTube creators at every stage. From trend discovery
            to content creation, these tools will accelerate your channel growth.
          </p>
        </div>

        {/* Featured Tool */}
        <div className="mb-12">
          <div className="glass-panel neon-border rounded-2xl p-6 sm:p-8 glow-hover bg-gradient-to-br from-red-50 to-orange-50">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
              <div className="text-4xl">🚀</div>
              <div>
                <div className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">Featured Tool</div>
                <h2 className="text-2xl font-black text-gray-900">TubeFission — AI Trend Intelligence</h2>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Predict viral trends before they explode. Our AI analyzes millions of videos to identify
              emerging opportunities 24-48 hours before they peak.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Free Plan Available</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">AI-Powered</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">Real-Time Data</span>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Essential Tools by Category</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GROWTH_TOOLS.map((category) => (
              <div key={category.category} className="glass-panel neon-border rounded-2xl p-5">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-red-600">📦</span> {category.category}
                </h3>
                <div className="space-y-3">
                  {category.tools.map((tool) => (
                    <div key={tool.name} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{tool.name}</span>
                        <div className="flex gap-1">
                          {tool.free && <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-bold">FREE</span>}
                          {tool.paid && <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-bold">PRO</span>}
                        </div>
                      </div>
                      <div className="text-gray-500 text-xs">{tool.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Strategy by Stage */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Growth Strategy by Subscriber Milestone</h2>
          <div className="space-y-4">
            {GROWTH_STRATEGIES.map((strategy) => (
              <div key={strategy.stage} className="glass-panel rounded-2xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                  <span className="font-bold text-gray-900">{strategy.stage}</span>
                  <span className="text-gray-400 hidden sm:inline">•</span>
                  <span className="text-red-600 font-medium">{strategy.focus}</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Key Tools:</div>
                    <div className="text-sm text-gray-700">{strategy.tools.join(', ')}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Strategy:</div>
                    <div className="text-sm text-gray-700">{strategy.tips}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ROI Calculator Teaser */}
        <div className="mb-12">
          <div className="glass-panel rounded-2xl p-6 text-center">
            <h2 className="text-xl font-bold mb-2 text-gray-900">Calculate Your Growth Potential</h2>
            <p className="text-gray-500 mb-4">
              See how trend prediction can accelerate your channel growth.
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl font-black text-red-600">3x</div>
                <div className="text-xs text-gray-500">Faster Growth</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-red-600">48h</div>
                <div className="text-xs text-gray-500">Early Access</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-red-600">67%</div>
                <div className="text-xs text-gray-500">More Views</div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900">FAQ</h2>
          <div className="space-y-3">
            {[
              { q: 'What are the must-have tools for new YouTubers?', a: 'Start with YouTube Studio (free), Canva for thumbnails, and TubeFission for trend discovery. These cover analytics, design, and content strategy.' },
              { q: 'Are paid tools worth it?', a: 'Yes, but only after you are consistent. Free tools can get you to 1K-10K subscribers. Invest in paid tools when you want to scale beyond that.' },
              { q: 'How do I choose the right tools?', a: 'Focus on tools that save you time and directly impact your growth metrics. Test free versions before committing to paid plans.' },
            ].map((item, i) => (
              <div key={i} className="glass-panel rounded-xl p-4">
                <div className="font-bold text-sm mb-1 text-gray-900">{item.q}</div>
                <div className="text-gray-500 text-xs leading-relaxed">{item.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="glass-panel neon-border rounded-2xl p-6 sm:p-8 text-center glow-hover">
          <h2 className="text-xl font-bold mb-2 text-gray-900">Start Your Growth Journey</h2>
          <p className="text-gray-500 text-sm mb-4 max-w-xl mx-auto">
            Combine the right tools with trend intelligence to accelerate your YouTube success.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition"
          >
            Get Started Free →
          </Link>
        </div>
      </div>
    </main>
  )
}
