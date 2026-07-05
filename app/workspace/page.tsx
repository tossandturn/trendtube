'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Bell, BookmarkCheck, GitCompare, History, Plus, Rocket } from 'lucide-react'

interface OpportunityHistoryItem {
  id: string
  niche: string
  score: number
  grade: string
  verdict: string
  recommendation: string
  href: string
  compareHref: string
}

interface WatchlistItem {
  id: string
  type: 'trend' | 'channel' | 'niche'
  name: string
}

interface AlertConfig {
  id: string
  name: string
  isActive: boolean
}

const STORAGE_KEYS = {
  opportunities: 'tubefission:opportunityHistory',
  watchlist: 'tubefission_watchlist',
  alerts: 'tubefission_alerts',
  compare: 'tubefission:videoCompareIds',
}

function readArray<T>(key: string): T[] {
  if (typeof window === 'undefined') return []
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function WorkspacePage() {
  const [opportunities] = useState<OpportunityHistoryItem[]>(() => readArray<OpportunityHistoryItem>(STORAGE_KEYS.opportunities))
  const [watchlist] = useState<WatchlistItem[]>(() => readArray<WatchlistItem>(STORAGE_KEYS.watchlist))
  const [alerts] = useState<AlertConfig[]>(() => readArray<AlertConfig>(STORAGE_KEYS.alerts))
  const [compareIds] = useState<string[]>(() => readArray<string>(STORAGE_KEYS.compare))

  const activeAlerts = alerts.filter((alert) => alert.isActive).length
  const topOpportunity = opportunities[0]
  const nextAction = useMemo(() => {
    if (topOpportunity) return { label: 'Continue best saved opportunity', href: topOpportunity.href }
    if (compareIds.length > 0) return { label: 'Open comparison queue', href: `/compare-new?type=videos&left=${encodeURIComponent(compareIds[0])}${compareIds[1] ? `&right=${encodeURIComponent(compareIds[1])}` : ''}` }
    if (watchlist.length > 0) return { label: 'Review watchlist', href: '/watchlist' }
    return { label: 'Find first opportunity', href: '/low-competition-keywords' }
  }, [compareIds, topOpportunity, watchlist.length])

  return (
    <main className="min-h-screen bg-white text-gray-900 terminal-grid relative overflow-hidden">
      <div className="ambient-glow-tl" />
      <div className="ambient-glow-tr" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
        <section className="mb-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">Creator Workspace</div>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-5xl">Keep every opportunity moving</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-500 sm:text-base">
              Your saved opportunities, watchlist, alerts, and comparison queue live here so TubeFission becomes a recurring workflow, not a one-time lookup.
            </p>
          </div>
          <Link href={nextAction.href} className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700">
            <Rocket className="h-4 w-4" />
            {nextAction.label}
          </Link>
        </section>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Saved opportunities', value: opportunities.length, icon: History, href: '#opportunities' },
            { label: 'Watchlist items', value: watchlist.length, icon: BookmarkCheck, href: '/watchlist' },
            { label: 'Active alerts', value: activeAlerts, icon: Bell, href: '/alerts' },
            { label: 'Compare queue', value: compareIds.length, icon: GitCompare, href: '/compare-new?type=videos' },
          ].map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.label} href={item.href} className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-red-200 hover:bg-red-50">
                <Icon className="h-5 w-5 text-red-600" />
                <div className="mt-4 text-3xl font-black text-gray-900">{item.value}</div>
                <div className="mt-1 text-sm font-semibold text-gray-600">{item.label}</div>
              </Link>
            )
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div id="opportunities" className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-black text-gray-900">Saved opportunity history</h2>
                <p className="mt-1 text-sm text-gray-500">Return to the niches and ideas you already decided were worth investigating.</p>
              </div>
              <Link href="/low-competition-keywords" className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-gray-800 hover:bg-gray-50">
                <Plus className="h-4 w-4" />
                Add opportunity
              </Link>
            </div>

            {opportunities.length > 0 ? (
              <div className="grid gap-3">
                {opportunities.slice(0, 6).map((item) => (
                  <div key={item.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900">{item.niche}</h3>
                        <p className="mt-1 text-xs font-semibold text-red-600">{item.verdict}</p>
                        <p className="mt-2 text-sm leading-relaxed text-gray-500">{item.recommendation}</p>
                      </div>
                      <div className="shrink-0 rounded-xl bg-white px-3 py-2 text-center">
                        <div className="text-xl font-black text-gray-900">{item.score}</div>
                        <div className="text-xs font-bold text-gray-500">Grade {item.grade}</div>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link href={item.href} className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white">Analyze</Link>
                      <Link href={item.compareHref} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700">Compare</Link>
                      <Link href="/ai-assistant" className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700">Plan brief</Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
                <History className="mx-auto h-8 w-8 text-gray-400" />
                <h3 className="mt-3 font-bold text-gray-900">No saved opportunities yet</h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">Start from low-competition keywords, save the best niche, then continue from this workspace.</p>
                <Link href="/low-competition-keywords" className="mt-4 inline-flex rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white">Find opportunities</Link>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <h2 className="text-lg font-black text-gray-900">Retention loop</h2>
              <div className="mt-4 space-y-3">
                {[
                  { title: 'Save', copy: 'Keep promising opportunities in your project history.', href: '/low-competition-keywords' },
                  { title: 'Watch', copy: 'Track trends, channels, and niches that matter.', href: '/watchlist' },
                  { title: 'Alert', copy: 'Get notified when momentum changes.', href: '/alerts' },
                  { title: 'Review', copy: 'Return here before planning the next upload.', href: '/workspace' },
                ].map((item, index) => (
                  <Link key={item.title} href={item.href} className="flex gap-3 rounded-xl bg-gray-50 p-3 hover:bg-red-50">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-black text-red-700">{index + 1}</span>
                    <span>
                      <span className="block text-sm font-bold text-gray-900">{item.title}</span>
                      <span className="block text-xs leading-relaxed text-gray-500">{item.copy}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <h2 className="text-lg font-black text-gray-900">Quick links</h2>
              <div className="mt-4 grid gap-2">
                <Link href="/watchlist" className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-800 hover:bg-gray-50">Open Watchlist</Link>
                <Link href="/alerts" className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-800 hover:bg-gray-50">Manage Alerts</Link>
                <Link href="/compare-new?type=videos" className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-800 hover:bg-gray-50">Open Compare</Link>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}
