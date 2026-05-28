import type { Metadata } from 'next'
import Link from 'next/link'
import { fetchTrendingVideos } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'

export const metadata: Metadata = {
  title: 'Viral YouTube Video Ideas 2026 | AI-Powered Content Inspiration',
  description: 'Get viral YouTube video ideas powered by AI. Discover trending topics, content inspiration, and winning video concepts before they blow up.',
  keywords: 'viral video ideas, youtube video ideas, trending content ideas, viral content inspiration',
}

const VIRAL_IDEAS = [
  {
    category: 'AI Content',
    ideas: [
      'I asked AI to create a viral video — here is what happened',
      'Testing viral AI tools so you do not have to',
      'AI predicted these YouTube trends for 2026',
      'I automated my content with AI — results after 30 days',
    ],
    trend: '+145%',
    competition: 'Medium',
  },
  {
    category: 'Shorts Format',
    ideas: [
      'The first 3 seconds of viral Shorts analyzed',
      'I copied viral Shorts for 7 days straight',
      'This Shorts format is breaking the algorithm',
      'Why these Shorts went viral (frame by frame)',
    ],
    trend: '+89%',
    competition: 'Low',
  },
  {
    category: 'Tutorial/Education',
    ideas: [
      'I learned [skill] in 24 hours and documented everything',
      'The tutorial YouTube actually needed',
      'Everything I know about [topic] in 10 minutes',
      'Common mistakes beginners make (and how to fix them)',
    ],
    trend: '+67%',
    competition: 'High',
  },
  {
    category: 'Challenge/Reaction',
    ideas: [
      'I tried [viral trend] so you do not have to',
      'Reacting to [trending topic] as a professional',
      'Testing viral hacks from TikTok — which ones actually work?',
      'I lived like [viral creator] for a week',
    ],
    trend: '+124%',
    competition: 'Medium',
  },
  {
    category: 'Behind the Scenes',
    ideas: [
      'The truth about going viral — what nobody tells you',
      'How I plan my viral videos (full process)',
      'My analytics after hitting [milestone]',
      'What happened after my video went viral',
    ],
    trend: '+56%',
    competition: 'Low',
  },
  {
    category: 'Mystery/Discovery',
    ideas: [
      'Solving [viral mystery] once and for all',
      'The secret behind [viral phenomenon]',
      'I found [hidden thing] everyone is talking about',
      'Exposing the truth about [trending topic]',
    ],
    trend: '+78%',
    competition: 'Medium',
  },
]

const TITLE_TEMPLATES = [
  { template: 'I [action] for [time] — here is what happened', example: 'I posted Shorts for 30 days — here is what happened' },
  { template: 'The [number] [topic] you need to know about', example: 'The 5 YouTube trends you need to know about' },
  { template: 'Why [thing] is going viral (and how to use it)', example: 'Why this audio is going viral (and how to use it)' },
  { template: '[Number] [things] that [result]', example: '7 Shorts hooks that get millions of views' },
  { template: 'Stop doing [common mistake] — do this instead', example: 'Stop making these Shorts mistakes — do this instead' },
]

export default async function ViralVideoIdeasPage() {
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
          <div className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase mb-2 data-mono">💡 CONTENT IDEAS</div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-glow text-gray-900">
            Viral Video Ideas
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl leading-relaxed mb-6">
            AI-powered video ideas based on real trending content. Get inspiration for your next viral hit
            before everyone else copies the format.
          </p>
        </div>

        {/* Ideas Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {VIRAL_IDEAS.map((category) => (
            <div key={category.category} className="glass-panel neon-border rounded-2xl p-5 glow-hover">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">{category.category}</h3>
                <span className="text-green-600 text-sm font-bold">{category.trend}</span>
              </div>
              <div className="space-y-2 mb-4">
                {category.ideas.map((idea, i) => (
                  <div key={i} className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                    &quot;{idea}&quot;
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500">Competition:</span>
                <span className={`font-bold ${category.competition === 'Low' ? 'text-green-600' : category.competition === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                  {category.competition}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Title Templates */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Viral Title Templates</h2>
          <div className="glass-panel rounded-2xl p-6">
            <div className="space-y-4">
              {TITLE_TEMPLATES.map((template, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-500 mb-1">Template:</div>
                    <div className="text-gray-900 font-medium">{template.template}</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-500 mb-1">Example:</div>
                    <div className="text-red-600 font-medium">&quot;{template.example}&quot;</div>
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
              { q: 'How do I know which idea will go viral?', a: 'Our AI analyzes real-time data including velocity, engagement, and competition to predict which ideas have the highest viral potential.' },
              { q: 'Should I copy viral videos exactly?', a: 'No — use them as inspiration. Add your unique angle, expertise, or personality to stand out from copycats.' },
              { q: 'How often are these ideas updated?', a: 'Our system analyzes trends hourly and updates recommendations based on the latest viral content.' },
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
