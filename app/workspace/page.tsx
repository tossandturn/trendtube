'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Bell, BookmarkCheck, CheckCircle2, Cloud, GitCompare, History, Plus, Rocket } from 'lucide-react'
import {
  addOpportunitySamplesToCompareBasket,
  getOpportunityBriefHref,
  getOpportunityCompareHref,
  getOpportunityResearchHref,
  getOpportunitySampleIds,
  type OpportunityHistoryItem,
} from '@/app/components/opportunityActions'
import { readVideoCompareIds, writeVideoCompareIds } from '@/app/components/AddToVideoCompareButton'

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

interface User {
  id: string
  username: string
  email: string
  emailVerified?: boolean
}

interface WorkspaceSnapshot {
  opportunities?: OpportunityHistoryItem[]
  watchlist?: WatchlistItem[]
  alerts?: AlertConfig[]
  compareIds?: string[]
}

const STORAGE_KEYS = {
  opportunities: 'tubefission:opportunityHistory',
  watchlist: 'tubefission_watchlist',
  alerts: 'tubefission_alerts',
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

function writeArray<T>(key: string, value: T[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, JSON.stringify(value))
}

function readUser(): User | null {
  if (typeof window === 'undefined') return null
  try {
    const parsed = JSON.parse(window.localStorage.getItem('user') || 'null')
    return parsed?.id && parsed?.email ? parsed : null
  } catch {
    window.localStorage.removeItem('user')
    return null
  }
}

function mergeByStableKey<T>(localItems: T[], cloudItems: T[] = []): T[] {
  const seen = new Set<string>()
  return [...localItems, ...cloudItems].filter((item) => {
    const record = item as { id?: string }
    const key = record.id || JSON.stringify(item)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export default function WorkspacePage() {
  const initialWorkspace = useMemo(() => ({
    opportunities: readArray<OpportunityHistoryItem>(STORAGE_KEYS.opportunities),
    watchlist: readArray<WatchlistItem>(STORAGE_KEYS.watchlist),
    alerts: readArray<AlertConfig>(STORAGE_KEYS.alerts),
    compareIds: readVideoCompareIds(),
  }), [])
  const [opportunities, setOpportunities] = useState<OpportunityHistoryItem[]>(() => readArray<OpportunityHistoryItem>(STORAGE_KEYS.opportunities))
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => readArray<WatchlistItem>(STORAGE_KEYS.watchlist))
  const [alerts, setAlerts] = useState<AlertConfig[]>(() => readArray<AlertConfig>(STORAGE_KEYS.alerts))
  const [compareIds, setCompareIds] = useState<string[]>(() => readVideoCompareIds())
  const [user] = useState<User | null>(() => readUser())
  const [syncStatus, setSyncStatus] = useState<'local' | 'syncing' | 'synced' | 'error'>('local')
  const [syncedAt, setSyncedAt] = useState<string | null>(null)

  useEffect(() => {
    const token = window.localStorage.getItem('authToken')

    if (!user || !token) {
      return
    }

    async function syncWorkspace() {
      setSyncStatus('syncing')
      try {
        const res = await fetch('/api/workspace/sync', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to load workspace')

        const cloud = (data.workspace || {}) as WorkspaceSnapshot
        const merged = {
          opportunities: mergeByStableKey(initialWorkspace.opportunities, cloud.opportunities),
          watchlist: mergeByStableKey(initialWorkspace.watchlist, cloud.watchlist),
          alerts: mergeByStableKey(initialWorkspace.alerts, cloud.alerts),
          compareIds: Array.from(new Set([...initialWorkspace.compareIds, ...(cloud.compareIds || [])])),
        }

        setOpportunities(merged.opportunities)
        setWatchlist(merged.watchlist)
        setAlerts(merged.alerts)
        setCompareIds(merged.compareIds)
        writeArray(STORAGE_KEYS.opportunities, merged.opportunities)
        writeArray(STORAGE_KEYS.watchlist, merged.watchlist)
        writeArray(STORAGE_KEYS.alerts, merged.alerts)
        writeVideoCompareIds(merged.compareIds)

        const saveRes = await fetch('/api/workspace/sync', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(merged),
        })
        const saved = await saveRes.json()
        if (!saveRes.ok) throw new Error(saved.error || 'Failed to save workspace')

        setSyncedAt(saved.syncedAt || data.syncedAt || new Date().toISOString())
        setSyncStatus('synced')
      } catch (error) {
        console.error('Workspace sync failed:', error)
        setSyncStatus('error')
      }
    }

    syncWorkspace()
  }, [initialWorkspace, user])

  const activeAlerts = alerts.filter((alert) => alert.isActive).length
  const topOpportunity = opportunities[0]
  const syncLabel = syncStatus === 'synced'
    ? `Synced${syncedAt ? ` ${new Date(syncedAt).toLocaleDateString()}` : ''}`
    : syncStatus === 'syncing'
      ? 'Syncing account workspace'
      : syncStatus === 'error'
        ? 'Local saved, cloud sync needs retry'
        : 'Local workspace only'
  const nextAction = useMemo(() => {
    if (topOpportunity) return { label: 'Continue best saved opportunity', href: getOpportunityResearchHref(topOpportunity) }
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
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${syncStatus === 'synced' ? 'bg-green-50 text-green-700' : syncStatus === 'error' ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                {syncStatus === 'synced' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Cloud className="h-3.5 w-3.5" />}
                {syncLabel}
              </span>
              {user ? (
                <span className="text-xs font-semibold text-gray-500">Linked to {user.email}</span>
              ) : (
                <span className="text-xs font-semibold text-gray-500">Sign in to connect this workspace across devices.</span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
            <Link href={nextAction.href} className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700">
              <Rocket className="h-4 w-4" />
              {nextAction.label}
            </Link>
            {!user && (
              <Link href="/signup" className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-800 hover:bg-gray-50">
                Create account to sync
              </Link>
            )}
          </div>
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
                {opportunities.slice(0, 6).map((item) => {
                  const sampleIds = getOpportunitySampleIds(item)
                  const hasCompareSamples = sampleIds.length >= 2

                  return (
                    <div key={item.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="font-bold text-gray-900">{item.niche}</h3>
                          {item.query && <p className="mt-1 text-xs font-semibold text-gray-500">Query: {item.query}</p>}
                          <p className="mt-1 text-xs font-semibold text-red-600">{item.verdict}</p>
                          <p className="mt-2 text-sm leading-relaxed text-gray-500">{item.recommendation}</p>
                          <p className="mt-2 text-xs font-medium text-gray-400">
                            {sampleIds.length > 0 ? `${sampleIds.length} saved sample videos available for compare.` : 'Open research to collect sample videos before comparing.'}
                          </p>
                        </div>
                        <div className="shrink-0 rounded-xl bg-white px-3 py-2 text-center">
                          <div className="text-xl font-black text-gray-900">{item.score}</div>
                          <div className="text-xs font-bold text-gray-500">Grade {item.grade}</div>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link href={getOpportunityResearchHref(item)} className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white">Open research</Link>
                        <Link
                          href={hasCompareSamples ? getOpportunityCompareHref(item) : getOpportunityResearchHref(item)}
                          onClick={() => addOpportunitySamplesToCompareBasket(item)}
                          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700"
                        >
                          {hasCompareSamples ? 'Compare samples' : 'Find samples'}
                        </Link>
                        <Link href={getOpportunityBriefHref(item)} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700">Create brief</Link>
                      </div>
                    </div>
                  )
                })}
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
