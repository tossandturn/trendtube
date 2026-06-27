import type { Metadata } from 'next'
import Link from 'next/link'
import { searchYouTubeMulti } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'

export const metadata: Metadata = {
  title: 'Viral YouTube Video Ideas 2026 | AI-Powered Content Inspiration',
  description: 'Get viral YouTube video ideas powered by real trend data. Discover trending topics, content inspiration, and winning video concepts before they blow up.',
  keywords: 'viral video ideas, youtube video ideas, trending content ideas, viral content inspiration',
}

function formatNumber(n: string | undefined) {
  const num = Number(n || 0)
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return num.toLocaleString()
}

// Generate ideas based on real video patterns
function generateIdeasFromVideos(videos: any[]) {
  const ideas = []

  for (const video of videos.slice(0, 20)) {
    const title = video.snippet?.title || ''
    const views = Number(video.statistics?.viewCount || 0)

    // Extract patterns from real titles
    if (title.toLowerCase().includes('tutorial') || title.toLowerCase().includes('how to')) {
      ideas.push({
        template: `How to [achieve result] in [timeframe] — Complete Tutorial`,
        example: title,
        views: formatNumber(video.statistics?.viewCount),
        category: 'Tutorial/Education'
      })
    }

    if (title.toLowerCase().includes('vs') || title.toLowerCase().includes('comparison')) {
      ideas.push({
        template: `[Thing A] vs [Thing B]: Which is Better?`,
        example: title,
        views: formatNumber(video.statistics?.viewCount),
        category: 'Comparison'
      })
    }

    if (title.toLowerCase().includes('review')) {
      ideas.push({
        template: `Honest Review: [Product/Service] After [Timeframe]`,
        example: title,
        views: formatNumber(video.statistics?.viewCount),
        category: 'Review'
      })
    }

    if (title.toLowerCase().includes('challenge') || title.toLowerCase().includes('try')) {
      ideas.push({
        template: `I [action] for [timeframe] — Here is What Happened`,
        example: title,
        views: formatNumber(video.statistics?.viewCount),
        category: 'Challenge'
      })
    }

    if (views > 1000000) {
      ideas.push({
        template: `The [Number] [Things] You Need to Know About [Topic]`,
        example: title,
        views: formatNumber(video.statistics?.viewCount),
        category: 'Listicle'
      })
    }
  }

  // Remove duplicates and return top unique ideas
  const seen = new Set()
  return ideas.filter(idea => {
    if (seen.has(idea.template)) return false
    seen.add(idea.template)
    return true
  }).slice(0, 12)
}

export default async function ViralVideoIdeasPage() {
  const region = await getRegion()

  // Search for trending content to generate real ideas
  const videos = await searchYouTubeMulti(
    ['trending', 'viral', 'popular right now'],
    30,
    'viewCount'
  )

  const ideas = generateIdeasFromVideos(videos)

  // Calculate real stats
  const totalViews = videos.reduce((sum, v) => sum + Number(v.statistics?.viewCount || 0), 0)
  const avgViews = videos.length > 0 ? Math.round(totalViews / videos.length) : 0

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
          <div className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase mb-2 data-mono">💡 CONTENT IDEAS</div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-glow text-gray-900">
            Viral Video Ideas
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl leading-relaxed mb-6">
            AI-powered video ideas based on real trending content. Get inspiration for your next viral hit
            before everyone else copies the format.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="glass-panel rounded-xl p-4 border border-gray-200">
              <div className="text-gray-500 text-[10px] data-mono tracking-wider mb-1">📊 ANALYZED VIDEOS</div>
              <div className="text-xl font-black text-glow text-gray-900">{videos.length}</div>
            </div>
            <div className="glass-panel rounded-xl p-4 border border-gray-200">
              <div className="text-gray-500 text-[10px] data-mono tracking-wider mb-1">⚡ AVG VIEWS</div>
              <div className="text-xl font-black text-green-600 text-glow-green">{formatNumber(avgViews.toString())}</div>
            </div>
            <div className="glass-panel rounded-xl p-4 border border-gray-200">
              <div className="text-gray-500 text-[10px] data-mono tracking-wider mb-1">💡 IDEAS GENERATED</div>
              <div className="text-xl font-black text-yellow-600 text-glow-yellow">{ideas.length}</div>
            </div>
            <div className="glass-panel rounded-xl p-4 border border-gray-200">
              <div className="text-gray-500 text-[10px] data-mono tracking-wider mb-1">🎯 CATEGORIES</div>
              <div className="text-xl font-black text-purple-600">4+</div>
            </div>
          </div>
        </div>

        {/* Ideas Grid */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Trending Video Templates</h2>
          <p className="text-sm text-gray-500 mb-6">
            These templates are derived from videos with {formatNumber(totalViews.toString())} total views
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ideas.map((idea, i) => (
              <div key={i} className="glass-panel neon-border rounded-2xl p-5 glow-hover">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">{idea.category}</span>
                  <span className="text-xs text-gray-500">👁️ {idea.views}</span>
                </div>
                <div className="mb-3">
                  <div className="text-xs text-gray-500 mb-1">Template:</div>
                  <div className="font-medium text-gray-900">{idea.template}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Example:</div>
                  <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 line-clamp-2">
                    &quot;{idea.example}&quot;
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Title Formula Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Proven Title Formulas</h2>
          <div className="glass-panel rounded-2xl p-6">
            <div className="space-y-4">
              {[
                { template: 'I [action] for [time] — here is what happened', example: 'I posted Shorts for 30 days — here is what happened', why: 'Creates curiosity and promises results' },
                { template: 'The [number] [topic] you need to know about', example: 'The 5 YouTube trends you need to know about', why: 'Specific number increases CTR' },
                { template: 'Why [thing] is going viral (and how to use it)', example: 'Why this audio is going viral (and how to use it)', why: 'Addresses trending curiosity' },
                { template: '[Number] [things] that [result]', example: '7 Shorts hooks that get millions of views', why: 'Promises actionable value' },
                { template: 'Stop doing [common mistake] — do this instead', example: 'Stop making these Shorts mistakes — do this instead', why: 'Pattern interrupt grabs attention' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-2 pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-500 mb-1">Template:</div>
                    <div className="text-gray-900 font-medium">{item.template}</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-500 mb-1">Example:</div>
                    <div className="text-red-600 font-medium">&quot;{item.example}&quot;</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-500 mb-1">Why it works:</div>
                    <div className="text-green-600 text-sm">{item.why}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Making Ideas Go Viral</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { title: 'Timing is Everything', desc: 'Upload within 24 hours of spotting a trend. Early movers get the most views.' },
              { title: 'Add Your Twist', desc: 'Do not just copy — add your unique perspective or expertise to stand out.' },
              { title: 'Hook in 3 Seconds', desc: 'The first 3 seconds determine if viewers stay. Start with the most compelling moment.' },
            ].map((item) => (
              <div key={item.title} className="glass-panel rounded-xl p-5">
                <div className="font-bold text-gray-900 mb-2">{item.title}</div>
                <div className="text-gray-500 text-sm">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900">FAQ</h2>
          <div className="space-y-3">
            {[
              { q: 'How do I know which idea will go viral?', a: 'We analyze real-time data including velocity, engagement, and competition to predict which ideas have the highest viral potential based on actual trending patterns.' },
              { q: 'Should I copy viral videos exactly?', a: 'No — use them as inspiration. Add your unique angle, expertise, or personality to stand out from copycats.' },
              { q: 'How often are these ideas updated?', a: 'Ideas are generated fresh from current trending content every time you visit, ensuring you get the latest patterns.' },
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
          <h2 className="text-xl font-bold mb-2 text-gray-900">Get Fresh Ideas Daily</h2>
          <p className="text-gray-500 text-sm mb-4 max-w-xl mx-auto">
            Never run out of content ideas. Get AI-generated video concepts tailored to your niche.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition"
          >
            Start Getting Ideas →
          </Link>
        </div>
      </div>
    </main>
  )
}
