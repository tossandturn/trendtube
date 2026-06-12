'use client'

import React, { useState } from 'react'
import Link from 'next/link'

const interests = [
  { key: 'technology', icon: '💻', label: 'Technology', bg: 'bg-blue-500', ring: 'ring-blue-400' },
  { key: 'music', icon: '🎵', label: 'Music', bg: 'bg-purple-500', ring: 'ring-purple-400' },
  { key: 'sports', icon: '⚽', label: 'Sports', bg: 'bg-indigo-500', ring: 'ring-indigo-400' },
  { key: 'gaming', icon: '🎮', label: 'Gaming', bg: 'bg-violet-500', ring: 'ring-violet-400' },
  { key: 'tutorial', icon: '📚', label: 'Tutorial', bg: 'bg-amber-400', ring: 'ring-amber-300' },
  { key: 'entertainment', icon: '🎬', label: 'Entertainment', bg: 'bg-pink-400', ring: 'ring-pink-300' },
  { key: 'education', icon: '🎓', label: 'Education', bg: 'bg-rose-400', ring: 'ring-rose-300' },
  { key: 'vlog', icon: '📱', label: 'Vlog', bg: 'bg-pink-300', ring: 'ring-pink-200' },
  { key: 'review', icon: '⭐', label: 'Review', bg: 'bg-rose-300', ring: 'ring-rose-200' },
  { key: 'comedy', icon: '😂', label: 'Comedy', bg: 'bg-rose-300', ring: 'ring-rose-200' },
  { key: 'fitness', icon: '💪', label: 'Fitness', bg: 'bg-orange-300', ring: 'ring-orange-200' },
  { key: 'food', icon: '🍕', label: 'Food', bg: 'bg-amber-300', ring: 'ring-amber-200' },
  { key: 'travel', icon: '✈️', label: 'Travel', bg: 'bg-yellow-300', ring: 'ring-yellow-200' },
  { key: 'fashion', icon: '👗', label: 'Fashion', bg: 'bg-lime-300', ring: 'ring-lime-200' },
  { key: 'beauty', icon: '💄', label: 'Beauty', bg: 'bg-green-300', ring: 'ring-green-200' },
  { key: 'diy', icon: '🔨', label: 'DIY', bg: 'bg-teal-300', ring: 'ring-teal-200' },
  { key: 'science', icon: '🔬', label: 'Science', bg: 'bg-sky-300', ring: 'ring-sky-200' },
  { key: 'news', icon: '📰', label: 'News', bg: 'bg-cyan-300', ring: 'ring-cyan-200' },
]

interface AudienceInterestsSectionProps {
  channelId: string
}

export default function AudienceInterestsSection({ channelId }: AudienceInterestsSectionProps) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 rounded-2xl p-6 sm:p-8 border border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">☁️</span>
            <h2 className="text-lg font-bold">Audience Interests</h2>
          </div>

          {/* Tag Cloud — Primary row (larger tags) */}
          <div className="flex flex-wrap items-center gap-3 mb-3">
            {interests.slice(0, 8).map((interest) => (
              <Link
                key={interest.key}
                href={`/channel/${channelId}/interest/${interest.key}`}
                className={`group relative px-5 py-2.5 rounded-full text-sm sm:text-base font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg ${interest.bg} text-white hover:ring-2 ${interest.ring} hover:ring-offset-2 hover:ring-offset-slate-900 ${selected === interest.key ? 'ring-2 ring-offset-2 ring-offset-slate-900 scale-105' : ''}`}
                style={{
                  opacity: selected === null || selected === interest.key ? 1 : 0.5,
                }}
                onClick={(e) => {
                  e.preventDefault()
                  setSelected(selected === interest.key ? null : interest.key)
                }}
              >
                {interest.icon} {interest.label}
              </Link>
            ))}
          </div>

          {/* Secondary row (smaller tags) */}
          <div className="flex flex-wrap items-center gap-2">
            {interests.slice(8).map((interest) => (
              <Link
                key={interest.key}
                href={`/channel/${channelId}/interest/${interest.key}`}
                className="group px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-105 bg-slate-700/60 text-slate-300 border border-slate-600 hover:bg-slate-600 hover:text-white hover:border-slate-500"
                style={{
                  opacity: selected === null || selected === interest.key ? 1 : 0.5,
                }}
              >
                {interest.icon} {interest.label}
              </Link>
            ))}
          </div>

          <p className="text-xs text-slate-500 mt-4 text-center">
            Based on video content, tags, and category analysis. Click any keyword to explore related trends.
          </p>
        </div>
      </div>
    </section>
  )
}
