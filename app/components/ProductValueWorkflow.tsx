'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Circle } from 'lucide-react'

interface ProductValueDimension {
  label: string
  note: string
}

interface ProductValueWorkflowProps {
  compact?: boolean
}

interface WorkspaceState {
  analyzeStarted: boolean
  opportunities: number
  watchlist: number
  activeAlerts: number
  compareIds: number
  isSynced: boolean
}

const STORAGE_KEYS = {
  opportunities: 'tubefission:opportunityHistory',
  watchlist: 'tubefission_watchlist',
  alerts: 'tubefission_alerts',
  compare: 'tubefission:videoCompareIds',
  session: 'analyzeSessionId',
  user: 'user',
  token: 'authToken',
}

const ADVANTAGE_DIMENSIONS: ProductValueDimension[] = [
  { label: 'Analyze', note: 'Start from a video, channel, trend, or niche.' },
  { label: 'Diagnose', note: 'Separate content reasons, traffic signals, and data confidence.' },
  { label: 'Compare', note: 'Use a basket to benchmark multiple candidates before copying.' },
  { label: 'Decide', note: 'Turn analysis into a concrete title, hook, and distribution bet.' },
  { label: 'Track', note: 'Save the opportunity, watch the benchmark, and set alerts.' },
  { label: 'Resume', note: 'Use Workspace as the place to continue research.' },
]

const COMPETITOR_COMPARISON = [
  { type: 'Generic analyzers', gap: 'Report metrics, then stop.', edge: 'TubeFission guides the next action.' },
  { type: 'SEO tools', gap: 'Focus on keywords only.', edge: 'TubeFission connects topic, video, and channel signals.' },
  { type: 'Trend lists', gap: 'Show what is hot now.', edge: 'TubeFission adds velocity, saturation, and watchlists.' },
]

const EMPTY_WORKSPACE: WorkspaceState = {
  analyzeStarted: false,
  opportunities: 0,
  watchlist: 0,
  activeAlerts: 0,
  compareIds: 0,
  isSynced: false,
}

function readArray(key: string): unknown[] {
  if (typeof window === 'undefined') return []
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function readWorkspaceState(): WorkspaceState {
  if (typeof window === 'undefined') return EMPTY_WORKSPACE
  const alerts = readArray(STORAGE_KEYS.alerts) as Array<{ isActive?: boolean }>
  return {
    analyzeStarted: Boolean(window.localStorage.getItem(STORAGE_KEYS.session)),
    opportunities: readArray(STORAGE_KEYS.opportunities).length,
    watchlist: readArray(STORAGE_KEYS.watchlist).length,
    activeAlerts: alerts.filter((alert) => alert.isActive).length,
    compareIds: readArray(STORAGE_KEYS.compare).length,
    isSynced: Boolean(window.localStorage.getItem(STORAGE_KEYS.user) && window.localStorage.getItem(STORAGE_KEYS.token)),
  }
}

export default function ProductValueWorkflow({ compact = false }: ProductValueWorkflowProps) {
  const [workspace, setWorkspace] = useState<WorkspaceState>(EMPTY_WORKSPACE)

  useEffect(() => {
    queueMicrotask(() => {
      setWorkspace(readWorkspaceState())
    })
  }, [])

  const milestones = useMemo(() => [
    {
      label: 'Run real analysis',
      copy: 'Analyze a URL.',
      done: workspace.analyzeStarted,
      href: '/youtube-video-analyzer',
    },
    {
      label: 'Save an opportunity',
      copy: 'Keep a niche.',
      done: workspace.opportunities > 0,
      href: '/low-competition-keywords',
    },
    {
      label: 'Benchmark with compare',
      copy: 'Add two samples.',
      done: workspace.compareIds >= 2,
      href: '/compare-new?type=videos',
    },
    {
      label: 'Build a watchlist',
      copy: 'Track winners.',
      done: workspace.watchlist > 0,
      href: '/watchlist',
    },
    {
      label: 'Set a momentum alert',
      copy: 'Catch changes.',
      done: workspace.activeAlerts > 0,
      href: '/alerts',
    },
    {
      label: 'Sync the workspace',
      copy: 'Save the loop.',
      done: workspace.isSynced,
      href: workspace.isSynced ? '/workspace' : '/signup',
    },
  ], [workspace])

  const completedMilestones = milestones.filter((milestone) => milestone.done).length
  const activationScore = Math.round((completedMilestones / milestones.length) * 100)
  const nextMilestone = milestones.find((milestone) => !milestone.done)

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="rounded-xl bg-gray-950 p-5 text-white">
          <div className="text-xs font-bold uppercase tracking-wider text-red-600">Workflow Progress</div>
          <div className="mt-2 flex items-end gap-3">
            <div className="text-5xl font-black">{completedMilestones}</div>
            <div className="pb-2 text-sm font-bold text-gray-400">/6 steps active</div>
          </div>
          <p className="mt-3 text-sm text-gray-300">
            A stronger product is one that helps users keep moving: analyze, decide, save, monitor, and return.
          </p>

          <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Your workflow activation</div>
                <div className="mt-1 text-sm font-bold">{completedMilestones}/6 signals active</div>
              </div>
              <div className="text-right text-xs font-bold text-gray-400">{activationScore}% complete</div>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-red-500" style={{ width: `${(completedMilestones / milestones.length) * 100}%` }} />
            </div>
          </div>

          {nextMilestone && (
            <Link href={nextMilestone.href} className="mt-4 inline-flex w-full items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 text-sm font-bold text-gray-950 hover:bg-gray-100">
              <span>Next: {nextMilestone.label}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {ADVANTAGE_DIMENSIONS.map((dimension) => (
            <div key={dimension.label} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
              <div className="mb-1 flex items-center justify-between gap-3">
                <span className="text-sm font-bold text-gray-800">{dimension.label}</span>
                <span className="text-xs font-black uppercase tracking-wide text-red-600">Flow</span>
              </div>
              {!compact && <p className="mt-2 truncate text-xs text-gray-500">{dimension.note}</p>}
            </div>
          ))}
        </div>
      </div>

      {!compact && <div className="mt-4 border-t border-gray-100 pt-4">
        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-sm font-bold text-gray-900">Why users choose it</div>
            <div className="text-xs text-gray-500">The advantage is workflow plus guidance, not just more charts.</div>
          </div>
          <Link href="/workspace" className="text-xs font-bold text-red-600 hover:text-red-700">Open workspace</Link>
        </div>
        <div className="grid gap-2 lg:grid-cols-3">
          {COMPETITOR_COMPARISON.map((item) => (
            <div key={item.type} className="rounded-xl border border-gray-200 bg-white p-3">
              <div className="text-sm font-black text-gray-900">{item.type}</div>
              <div className="mt-2 rounded-lg bg-gray-50 p-2 text-xs text-gray-500">{item.gap}</div>
              <div className="mt-2 rounded-lg bg-red-50 p-2 text-xs font-semibold text-red-700">{item.edge}</div>
            </div>
          ))}
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          {milestones.map((step, index) => (
            <Link key={step.label} href={step.href} className="rounded-xl border border-gray-200 bg-white p-3 hover:border-red-200 hover:bg-red-50">
              <div className="flex items-center gap-2">
                {step.done ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Circle className="h-4 w-4 text-gray-300" />}
                <div className="text-xs font-black text-red-600">0{index + 1}</div>
              </div>
              <div className="mt-2 text-sm font-bold text-gray-900">{step.label}</div>
              <div className="mt-1 text-xs text-gray-500">{step.copy}</div>
            </Link>
          ))}
        </div>
      </div>}
    </section>
  )
}
