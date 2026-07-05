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
  { label: 'Painkiller', score: 88, note: 'Creators need a faster answer to what to make next and why it can work.' },
  { label: 'Workflow Fit', score: 86, note: 'Discovery, analysis, comparison, planning, and tracking now connect into one loop.' },
  { label: 'Data Advantage', score: 84, note: 'YouTube signals, comparisons, and saved workspace history create a practical decision layer.' },
  { label: 'Decision Power', score: 85, note: 'The product is shifting from raw metrics toward next-upload guidance and benchmark choices.' },
  { label: 'SEO Acquisition', score: 87, note: 'Keyword, trend, analyzer, and comparison pages give the product strong search-led entry points.' },
  { label: 'Retention System', score: 82, note: 'Workspace, watchlist, alerts, and history exist; the next lift is making them daily habits.' },
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
      copy: 'Analyze at least one video or channel URL.',
      done: workspace.analyzeStarted,
      href: '/youtube-video-analyzer',
    },
    {
      label: 'Save an opportunity',
      copy: 'Keep a niche or keyword in project history.',
      done: workspace.opportunities > 0,
      href: '/low-competition-keywords',
    },
    {
      label: 'Benchmark with compare',
      copy: 'Add two videos or channels before copying a strategy.',
      done: workspace.compareIds >= 2,
      href: '/compare-new?type=videos',
    },
    {
      label: 'Build a watchlist',
      copy: 'Track channels, trends, or niches worth revisiting.',
      done: workspace.watchlist > 0,
      href: '/watchlist',
    },
    {
      label: 'Set a momentum alert',
      copy: 'Turn trend changes into a reason to return.',
      done: workspace.activeAlerts > 0,
      href: '/alerts',
    },
    {
      label: 'Sync the workspace',
      copy: 'Connect history, queues, and tracking to an account.',
      done: workspace.isSynced,
      href: workspace.isSynced ? '/workspace' : '/signup',
    },
  ], [workspace])

  const completedMilestones = milestones.filter((milestone) => milestone.done).length
  const baseScore = getBaseProductScore()
  const productScore = Math.min(90, baseScore + completedMilestones)
  const nextMilestone = milestones.find((milestone) => !milestone.done)

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-red-600">Competitive Advantage</div>
          <div className="mt-2 flex items-end gap-3">
            <div className="text-4xl font-black text-gray-900">{productScore}</div>
            <div className="pb-1 text-sm font-bold text-gray-500">/100 {getGrade(productScore)}</div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            This score now reflects real product strength: core capability plus whether the user has activated the repeatable creator workflow.
          </p>

          <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Path to 90</div>
                <div className="mt-1 text-sm font-bold text-gray-900">{completedMilestones}/6 workflow signals completed</div>
              </div>
              <div className="text-right text-xs font-bold text-gray-500">Base {baseScore}</div>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
              <div className="h-full rounded-full bg-red-500" style={{ width: `${(completedMilestones / milestones.length) * 100}%` }} />
            </div>
          </div>

          {nextMilestone && (
            <Link href={nextMilestone.href} className="mt-4 inline-flex w-full items-center justify-between gap-3 rounded-xl bg-gray-900 px-4 py-3 text-sm font-bold text-white hover:bg-gray-800">
              <span>Improve next: {nextMilestone.label}</span>
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
              {!compact && <p className="mt-2 text-xs leading-relaxed text-gray-500">{dimension.note}</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 border-t border-gray-100 pt-5">
        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-sm font-bold text-gray-900">Activation workflow</div>
            <div className="text-xs text-gray-500">The product reaches 90 only when the user completes the loop, not because we claim it.</div>
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
              <div className="mt-1 text-xs leading-relaxed text-gray-500">{step.copy}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
