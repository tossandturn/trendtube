'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

interface TrendDiscoveryProps {
  trends: Array<{
    slug: string
    title: string
    description: string
    category: string
    avgVelocity: number
    breakoutScore: number
    videoCount: number
    totalViews: number
    keyword: string
    tags: string[]
    momentum: 'rising' | 'stable' | 'falling'
  }>
  categories: string[]
}

export function TrendDiscovery({ trends, categories }: TrendDiscoveryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [sortBy, setSortBy] = useState<'velocity' | 'breakout' | 'fresh'>('breakout')
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTrends = useMemo(() => {
    let filtered = trends

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(t => t.category === selectedCategory)
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(query) ||
        t.keyword.toLowerCase().includes(query) ||
        t.tags.some((k: string) => k.toLowerCase().includes(query))
      )
    }

    // Sort
    return filtered.sort((a, b) => {
      if (sortBy === 'velocity') return b.avgVelocity - a.avgVelocity
      if (sortBy === 'breakout') return b.breakoutScore - a.breakoutScore
      return 0
    })
  }, [trends, selectedCategory, sortBy, searchQuery])

  const trendStats = useMemo(() => {
    const rising = filteredTrends.filter(t => t.momentum === 'rising').length
    const viral = filteredTrends.filter(t => t.breakoutScore > 80).length
    const avgVelocity = filteredTrends.length > 0
      ? filteredTrends.reduce((sum, t) => sum + t.avgVelocity, 0) / filteredTrends.length
      : 0

    return { rising, viral, avgVelocity, total: filteredTrends.length }
  }, [filteredTrends])

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Trends
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic or keyword..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'velocity' | 'breakout' | 'fresh')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="breakout">🔥 Breakout Score</option>
              <option value="velocity">⚡ Velocity</option>
            </select>
          </div>

          {/* Timeframe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeframe
            </label>
            <div className="flex gap-2">
              {(['24h', '7d', '30d'] as const).map(tf => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    timeframe === tf
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tf === '24h' ? '24 Hours' : tf === '7d' ? '7 Days' : '30 Days'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{trendStats.total}</div>
            <div className="text-sm text-gray-600">Active Trends</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{trendStats.rising}</div>
            <div className="text-sm text-gray-600">Rising</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{trendStats.viral}</div>
            <div className="text-sm text-gray-600">Viral Potential</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">+{(trendStats.avgVelocity / 1000).toFixed(0)}K</div>
            <div className="text-sm text-gray-600">Avg Velocity</div>
          </div>
        </div>
      </div>

      {/* Trend Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrends.map((trend, idx) => (
          <Link
            key={trend.slug}
            href={`/trends/${trend.slug}`}
            className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all hover:border-blue-300"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    trend.momentum === 'rising'
                      ? 'bg-green-100 text-green-700'
                      : trend.momentum === 'falling'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {trend.momentum === 'rising' ? '↗️ Rising' : trend.momentum === 'falling' ? '↘️ Falling' : '→ Stable'}
                  </span>
                  <span className="text-xs text-gray-500">{trend.category}</span>
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {trend.title}
                </h3>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">{trend.breakoutScore}</div>
                <div className="text-xs text-gray-500">breakout</div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 line-clamp-2 mb-4">
              {trend.description}
            </p>

            {/* Keywords */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs font-medium">
                {trend.keyword}
              </span>
              {trend.tags?.slice(0, 2).map((tag: string, kidx: number) => (
                <span
                  key={kidx}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div>
                <div className="text-sm font-medium text-gray-900">
                  +{(trend.avgVelocity / 1000).toFixed(0)}K
                </div>
                <div className="text-xs text-gray-500">velocity</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {(trend.totalViews / 1e6).toFixed(1)}M
                </div>
                <div className="text-xs text-gray-500">views</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {trend.videoCount}
                </div>
                <div className="text-xs text-gray-500">videos</div>
              </div>
            </div>

            {/* Opportunity Score */}
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Opportunity Score</span>
                <span className="font-medium">
                  {trend.breakoutScore > 80 ? 'High' : trend.breakoutScore > 60 ? 'Medium' : 'Low'}
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    trend.breakoutScore > 80 ? 'bg-green-500' : trend.breakoutScore > 60 ? 'bg-yellow-500' : 'bg-gray-400'
                  }`}
                  style={{ width: `${trend.breakoutScore}%` }}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredTrends.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No trends found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}
