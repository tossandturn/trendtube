'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Circle } from 'lucide-react'

interface ProductValueDimension {
  label: string
  score: number
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

const PRODUCT_DIMENSIONS: ProductValueDimension[] = [
  { label: 'Painkiller', score: 88, note: 'Fast next-move clarity.' },
  { label: 'Workflow Fit', score: 86, note: 'One loop from discovery to tracking.' },
  { label: 'Data Advantage', score: 84, note: 'Real signals plus saved history.' },
  { label: 'Decision Power', score: 85, note: 'Benchmarks become actions.' },
  { label: 'SEO Acquisition', score: 87, note: 'Search-led entry pages.' },
  { label: 'Retention System', score: 82, note: 'Watchlist, alerts, workspace.' },
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

function getBaseProductScore() {
  const total = PRODUCT_DIMENSIONS.reduce((sum, item) => sum + item.score, 0)
  return Math.round(total / PRODUCT_DIMENSIONS.length)
}

function getGrade(score: number) {
  if (score >= 90) return 'A'
  if (score >= 86) return 'A-'
  if (score >= 82) return 'B+'
  return 'B'
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
  const baseScore = getBaseProductScore()
  const productScore = Math.min(90, baseScore + completedMilestones)
  const nextMilestone = milestones.find((milestone) => !milestone.done)

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="rounded-xl bg-gray-950 p-5 text-white">
          <div className="text-xs font-bold uppercase tracking-wider text-red-600">Competitive Advantage</div>
          <div className="mt-2 flex items-end gap-3">
            <div className="text-5xl font-black">{productScore}</div>
            <div className="pb-2 text-sm font-bold text-gray-400">/100 {getGrade(productScore)}</div>
          </div>

          <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Path to 90</div>
                <div className="mt-1 text-sm font-bold">{completedMilestones}/6 signals active</div>
              </div>
              <div className="text-right text-xs font-bold text-gray-400">Base {baseScore}</div>
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
          {PRODUCT_DIMENSIONS.map((dimension) => (
            <div key={dimension.label} className="rounded-xl bg-gray-50 p-3">
              <div className="mb-1 flex items-center justify-between gap-3">
                <span className="text-sm font-bold text-gray-800">{dimension.label}</span>
                <span className="text-sm font-black text-gray-900">{dimension.score}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full rounded-full bg-red-500" style={{ width: `${dimension.score}%` }} />
              </div>
              {!compact && <p className="mt-2 truncate text-xs text-gray-500">{dimension.note}</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 border-t border-gray-100 pt-4">
        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-sm font-bold text-gray-900">Activation workflow</div>
            <div className="text-xs text-gray-500">Score rises when the workflow is actually used.</div>
          </div>
          <Link href="/workspace" className="text-xs font-bold text-red-600 hover:text-red-700">Open workspace</Link>
        </div>
        <div className="grid gap-2 md:grid-cols-3">
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
      </div>
    </section>
  )
}
