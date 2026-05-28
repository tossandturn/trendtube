'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface WatchlistItem {
  id: string
  type: 'trend' | 'channel' | 'niche'
  name: string
  addedAt: string
  metrics?: {
    velocity?: number
    engagement?: number
    growth?: string
  }
}

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'trend' | 'channel' | 'niche'>('all')

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('tubefission_watchlist')
    if (saved) {
      setWatchlist(JSON.parse(saved))
    }
  }, [])

  const filteredItems = activeTab === 'all'
    ? watchlist
    : watchlist.filter(item => item.type === activeTab)

  const removeItem = (id: string) => {
    const updated = watchlist.filter(item => item.id !== id)
    setWatchlist(updated)
    localStorage.setItem('tubefission_watchlist', JSON.stringify(updated))
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Watchlist</h1>
          <p className="text-gray-600">Track trends, channels, and niches that matter to you</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'trend', 'channel', 'niche'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === tab
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab !== 'all' && ` (${watchlist.filter(i => i.type === tab).length})`}
            </button>
          ))}
        </div>

        {/* Watchlist Items */}
        {filteredItems.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      item.type === 'trend' ? 'bg-red-100 text-red-700' :
                      item.type === 'channel' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </span>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-600 transition"
                  >
                    ×
                  </button>
                </div>

                <h3 className="font-bold text-lg mb-2">{item.name}</h3>

                {item.metrics && (
                  <div className="space-y-1 text-sm">
                    {item.metrics.velocity && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Velocity</span>
                        <span className="font-medium">
                          {item.metrics.velocity >= 1000000
                            ? (item.metrics.velocity / 1000000).toFixed(1) + 'M'
                            : (item.metrics.velocity / 1000).toFixed(0) + 'K'}/day
                        </span>
                      </div>
                    )}
                    {item.metrics.engagement && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Engagement</span>
                        <span className="font-medium">{item.metrics.engagement.toFixed(2)}%</span>
                      </div>
                    )}
                    {item.metrics.growth && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Growth</span>
                        <span className="font-medium text-green-600">{item.metrics.growth}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link
                    href={item.type === 'trend' ? `/trends/${item.id}` : `/tag/${item.id}`}
                    className="text-sm text-red-600 font-medium hover:underline"
                  >
                    View details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-200">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-bold mb-2">No items in watchlist</h3>
            <p className="text-gray-600 mb-6">Start tracking trends, channels, and niches to monitor their performance</p>
            <Link
              href="/trending"
              className="inline-block px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition"
            >
              Explore Trends
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
