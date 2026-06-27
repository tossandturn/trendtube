'use client'

import { useState } from 'react'
import Link from 'next/link'

interface AIOutput {
  type: 'title' | 'hook' | 'thumbnail' | 'script'
  content: string
  source: string
}

export default function AIAssistantPage() {
  const [topic, setTopic] = useState('')
  const [outputs, setOutputs] = useState<AIOutput[]>([])
  const [activeTool, setActiveTool] = useState<'title' | 'hook' | 'thumbnail' | 'script'>('title')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generateContent = async () => {
    if (!topic) return

    setLoading(true)
    setError('')
    setOutputs(prev => [...prev, { type: activeTool, content: '', source: '' }])

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, type: activeTool }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate content')
      }

      const data = await response.json()

      setOutputs(prev => [
        ...prev.slice(0, -1),
        { type: data.type, content: data.content, source: data.source }
      ])
    } catch (err) {
      setError('Failed to generate content. Please try again.')
      setOutputs(prev => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  const tools = [
    { id: 'title' as const, name: 'Title Generator', icon: '✍️', desc: 'Generate high-CTR video titles based on trending patterns' },
    { id: 'hook' as const, name: 'Hook Generator', icon: '🎣', desc: 'Create engaging hooks from top-performing videos' },
    { id: 'thumbnail' as const, name: 'Thumbnail Ideas', icon: '🖼️', desc: 'AI thumbnail concepts from viral patterns' },
    { id: 'script' as const, name: 'Script Outlines', icon: '📝', desc: 'Video structure templates from proven content' },
  ]

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">AI Creator Assistant</h1>
          <p className="text-gray-600">Generate titles, hooks, thumbnails, and scripts powered by real YouTube trend data</p>
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
              disabled={!topic || loading}
              className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Generate'}
            </button>
          </div>
          {error && (
            <p className="text-sm text-red-600 mt-2">{error}</p>
          )}
          <p className="text-sm text-gray-500 mt-2">
            💡 Powered by real YouTube data: We analyze top-performing videos in your niche to generate proven suggestions
          </p>
        </div>

        {/* Generated Outputs */}
        {outputs.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-bold text-lg">Generated {tools.find(t => t.id === activeTool)?.name}s</h2>
            {outputs.map((output, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-gray-200">
                {output.content === '' ? (
                  <div className="flex items-center gap-3 text-gray-500">
                    <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    Analyzing top-performing {topic} videos...
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="text-xs text-red-600 font-medium mb-1 uppercase">
                        {tools.find(t => t.id === output.type)?.name}
                      </div>
                      <div className="text-gray-900 whitespace-pre-line">{output.content}</div>
                      {output.source && (
                        <div className="text-xs text-gray-500 mt-2 bg-gray-100 px-2 py-1 rounded">
                          📊 {output.source}
                        </div>
                      )}
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

        {/* How It Works */}
        <div className="mt-12 bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <h3 className="font-bold text-lg mb-4">How It Works</h3>
          <div className="grid sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-2 font-bold">1</div>
              <div className="font-medium text-sm">Search</div>
              <div className="text-xs text-gray-500">We search YouTube for top videos in your topic</div>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-2 font-bold">2</div>
              <div className="font-medium text-sm">Analyze</div>
              <div className="text-xs text-gray-500">Our AI analyzes patterns, keywords, and structures</div>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-2 font-bold">3</div>
              <div className="font-medium text-sm">Generate</div>
              <div className="text-xs text-gray-500">Proven suggestions based on real performance data</div>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-2 font-bold">4</div>
              <div className="font-medium text-sm">Create</div>
              <div className="text-xs text-gray-500">Use data-driven insights for your content</div>
            </div>
          </div>
        </div>

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
