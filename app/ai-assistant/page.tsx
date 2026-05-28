'use client'

import { useState } from 'react'
import Link from 'next/link'

interface AIOutput {
  type: string
  content: string
  loading?: boolean
}

export default function AIAssistantPage() {
  const [topic, setTopic] = useState('')
  const [outputs, setOutputs] = useState<AIOutput[]>([])
  const [activeTool, setActiveTool] = useState<'title' | 'hook' | 'thumbnail' | 'script'>('title')

  const generateContent = async () => {
    if (!topic) return

    setOutputs(prev => [...prev, { type: activeTool, content: '', loading: true }])

    // Simulate AI generation
    setTimeout(() => {
      const mockOutputs: Record<string, string[]> = {
        title: [
          `I Tried ${topic} for 30 Days (Results)`,
          `The ${topic} Secret No One Talks About`,
          `${topic} Changed Everything for My Channel`,
          `Stop Making These ${topic} Mistakes`,
          `Why ${topic} is Going Viral Right Now`,
        ],
        hook: [
          `Wait until you see what happened when I tried ${topic}...`,
          `This ${topic} hack saved my channel.`,
          `I spent 100 hours testing ${topic} so you don't have to.`,
          `${topic} experts hate this trick.`,
          `The truth about ${topic} that nobody wants to admit.`,
        ],
        thumbnail: [
          '🎨 Shock expression + split screen showing before/after',
          '🎨 Arrow pointing to surprising result with bold text',
          '🎨 You-style face reaction + topic visual',
          '🎨 Question mark + mysterious element from topic',
          '🎨 Results number prominently displayed with reaction',
        ],
        script: [
          `[Hook] - Start with the most surprising result\n[Problem] - Explain why most people fail at ${topic}\n[Solution] - Share your unique approach\n[Proof] - Show actual results/data\n[CTA] - Encourage viewers to try it`,
        ],
      }

      const options = mockOutputs[activeTool]
      const content = options[Math.floor(Math.random() * options.length)]

      setOutputs(prev => [
        ...prev.slice(0, -1),
        { type: activeTool, content }
      ])
    }, 1500)
  }

  const tools = [
    { id: 'title' as const, name: 'Title Generator', icon: '✍️', desc: 'Generate high-CTR video titles' },
    { id: 'hook' as const, name: 'Hook Generator', icon: '🎣', desc: 'Create engaging first 5 seconds' },
    { id: 'thumbnail' as const, name: 'Thumbnail Ideas', icon: '🖼️', desc: 'AI thumbnail concepts' },
    { id: 'script' as const, name: 'Script Outlines', icon: '📝', desc: 'Video structure templates' },
  ]

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">AI Creator Assistant</h1>
          <p className="text-gray-600">Generate titles, hooks, thumbnails, and scripts powered by trend data</p>
        </div>

        {/* Tool Selection */}
        <div className="grid sm:grid-cols-4 gap-4 mb-8">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`p-4 rounded-xl border text-left transition ${
                activeTool === tool.id
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">{tool.icon}</div>
              <div className="font-bold">{tool.name}</div>
              <div className="text-sm text-gray-500">{tool.desc}</div>
            </button>
          ))}
        </div>

        {/* Input Section */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 mb-8">
          <label className="block font-medium mb-2">
            Enter your topic or video idea
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={`e.g., "AI Tools for YouTube" or "Minecraft Building"`}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl"
            />
            <button
              onClick={generateContent}
              disabled={!topic || outputs.some(o => o.loading)}
              className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition disabled:opacity-50"
            >
              {outputs.some(o => o.loading) ? 'Generating...' : 'Generate'}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            💡 Tip: Include specific details like niche, target audience, or content type for better results
          </p>
        </div>

        {/* Generated Outputs */}
        {outputs.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-bold text-lg">Generated {tools.find(t => t.id === activeTool)?.name}s</h2>
            {outputs.map((output, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-gray-200">
                {output.loading ? (
                  <div className="flex items-center gap-3 text-gray-500">
                    <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    Generating {tools.find(t => t.id === output.type)?.name.toLowerCase()}...
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="text-xs text-red-600 font-medium mb-1 uppercase">
                        {tools.find(t => t.id === output.type)?.name}
                      </div>
                      <div className="text-gray-900 whitespace-pre-line">{output.content}</div>
                    </div>
                    <button
                      onClick={() => navigator.clipboard.writeText(output.content)}
                      className="text-sm text-gray-500 hover:text-red-600 transition"
                    >
                      Copy
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-12 grid sm:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="font-bold text-blue-900 mb-2">💡 Pro Tips</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Use trend data to inform your content angles</li>
              <li>• A/B test multiple title variations</li>
              <li>• Front-load value in first 3 seconds</li>
              <li>• Match thumbnail style to top performers</li>
            </ul>
          </div>
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <h3 className="font-bold text-green-900 mb-2">📈 Trend Context</h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li>• Current trending topics in your niche</li>
              <li>• Velocity metrics for related content</li>
              <li>• Competition level indicators</li>
              <li>• Optimal upload timing suggestions</li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Get unlimited AI generations with Pro</p>
          <Link
            href="/trending"
            className="inline-block px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition"
          >
            Upgrade to Pro →
          </Link>
        </div>
      </div>
    </main>
  )
}
