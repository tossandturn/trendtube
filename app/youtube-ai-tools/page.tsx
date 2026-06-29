import type { Metadata } from 'next'
import Link from 'next/link'
import { fetchTrendingVideos } from '@/lib/api-client'
import { getRegion } from '@/lib/region-server'


export const metadata: Metadata = {
  title: 'Best AI Tools for YouTube 2026 | Creator AI Software',
  description: 'Discover the best AI tools for YouTube creators. From script writing to video editing, these AI tools will revolutionize your content creation workflow.',
  keywords: 'ai tools for youtube, youtube ai tools, ai video editing, ai script writing, ai thumbnail generator',
  robots: {
    index: false,
    follow: true,
  },
}

const AI_CATEGORIES = [
  {
    category: 'Script Writing',
    tools: [
      { name: 'TubeFission AI', desc: 'AI-powered script generation with trend optimization', free: true, paid: true, popular: true },
      { name: 'ChatGPT', desc: 'Versatile AI writing assistant for scripts and descriptions', free: true, paid: true },
      { name: 'Claude', desc: 'Advanced AI with superior long-form content understanding', free: true, paid: true },
      { name: 'Jasper', desc: 'Marketing-focused AI copywriting tool', free: false, paid: true },
    ],
  },
  {
    category: 'Video Editing',
    tools: [
      { name: 'Descript', desc: 'Text-based video editing with AI transcription', free: false, paid: true, popular: true },
      { name: 'Runway ML', desc: 'AI video generation and editing with visual effects', free: true, paid: true },
      { name: 'CapCut', desc: 'AI-powered editing with auto-captions and effects', free: true, paid: true },
      { name: 'Pictory', desc: 'AI video creation from text and blog posts', free: false, paid: true },
    ],
  },
  {
    category: 'Thumbnail Generation',
    tools: [
      { name: 'Canva AI', desc: 'AI-powered design with Magic Edit and background removal', free: true, paid: true, popular: true },
      { name: 'Midjourney', desc: 'AI image generation for custom thumbnail backgrounds', free: false, paid: true },
      { name: 'DALL-E 3', desc: 'OpenAI image generation integrated with ChatGPT', free: false, paid: true },
      { name: 'Remove.bg', desc: 'AI background removal for professional thumbnails', free: true, paid: true },
    ],
  },
  {
    category: 'Voice & Audio',
    tools: [
      { name: 'ElevenLabs', desc: 'Realistic AI voice generation and cloning', free: true, paid: true, popular: true },
      { name: 'Adobe Podcast', desc: 'AI audio enhancement and noise removal', free: true, paid: true },
      { name: 'Murf.ai', desc: 'AI voiceover with 120+ voices', free: true, paid: true },
      { name: 'Auphonic', desc: 'AI audio post-processing and leveling', free: true, paid: true },
    ],
  },
  {
    category: 'Analytics & Research',
    tools: [
      { name: 'TubeFission', desc: 'AI trend prediction and niche analysis', free: true, paid: true, popular: true },
      { name: 'VidIQ', desc: 'AI-powered keyword research and channel insights', free: true, paid: true },
      { name: 'Social Blade', desc: 'Channel analytics and growth predictions', free: true, paid: true },
      { name: 'Tubics', desc: 'AI SEO optimization for YouTube videos', free: false, paid: true },
    ],
  },
  {
    category: 'Content Ideas',
    tools: [
      { name: 'TubeFission Ideas', desc: 'AI-generated viral video ideas based on trends', free: true, paid: true, popular: true },
      { name: 'AnswerThePublic', desc: 'AI question analysis for content inspiration', free: false, paid: true },
      { name: 'BuzzSumo', desc: 'Content discovery and trend analysis', free: false, paid: true },
      { name: 'Exploding Topics', desc: 'AI-powered trending topic discovery', free: true, paid: true },
    ],
  },
]

const AI_WORKFLOW = [
  {
    step: 1,
    title: 'Research with AI',
    desc: 'Use TubeFission AI to find trending topics and get content ideas tailored to your niche.',
    tools: ['TubeFission', 'Exploding Topics'],
  },
  {
    step: 2,
    title: 'Write with AI',
    desc: 'Generate scripts and descriptions using AI writing assistants optimized for engagement.',
    tools: ['Claude', 'ChatGPT'],
  },
  {
    step: 3,
    title: 'Create Thumbnails',
    desc: 'Design eye-catching thumbnails with AI image generation and editing tools.',
    tools: ['Canva AI', 'Midjourney'],
  },
  {
    step: 4,
    title: 'Edit with AI',
    desc: 'Speed up editing with AI transcription, auto-captions, and smart cuts.',
    tools: ['Descript', 'CapCut'],
  },
  {
    step: 5,
    title: 'Optimize & Publish',
    desc: 'Use AI analytics to optimize titles, tags, and publishing times for maximum reach.',
    tools: ['TubeFission', 'VidIQ'],
  },
]

export default async function YouTubeAIToolsPage() {
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
          <div className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase mb-2 data-mono">🤖 AI FOR CREATORS</div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-glow text-gray-900">
            AI Tools for YouTube
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl leading-relaxed mb-6">
            Supercharge your YouTube workflow with AI. From script writing to video editing,
            these tools will save you hours and boost your content quality.
          </p>
        </div>

        <div className="mb-12">
          <div className="glass-panel neon-border rounded-2xl p-6 sm:p-8 glow-hover bg-gradient-to-br from-purple-50 to-blue-50">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
              <div className="text-4xl">🚀</div>
              <div>
                <div className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">All-in-One AI Suite</div>
                <h2 className="text-2xl font-black text-gray-900">TubeFission AI Suite</h2>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              The complete AI toolkit for YouTube creators. Trend prediction, script writing,
              title optimization, and thumbnail suggestions — all powered by advanced AI.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Free Plan</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">GPT-4 Powered</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">Trend Trained</span>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4 text-gray-900">AI Tools by Category</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {AI_CATEGORIES.map((category) => (
              <div key={category.category} className="glass-panel neon-border rounded-2xl p-5">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-purple-600">🤖</span> {category.category}
                </h3>
                <div className="space-y-3">
                  {category.tools.map((tool) => (
                    <div key={tool.name} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{tool.name}</span>
                        {tool.popular && <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">HOT</span>}
                        {tool.free && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">FREE</span>}
                        {tool.paid && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">PAID</span>}
                      </div>
                      <p className="text-sm text-gray-600">{tool.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Recommended AI Workflow</h2>
          <div className="space-y-4">
            {AI_WORKFLOW.map((step) => (
              <div key={step.step} className="glass-panel neon-border rounded-2xl p-5">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold flex-shrink-0">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{step.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {step.tools.map((tool) => (
                        <span key={tool} className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
