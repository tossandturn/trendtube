'use client'

import { useEffect, useMemo, useState } from 'react'
import { Bell, Mail, Pencil, Plus, Trash2 } from 'lucide-react'

type AlertMetric =
  | 'view_velocity'
  | 'engagement_rate'
  | 'view_count'
  | 'opportunity_score'
  | 'competition_saturation'
  | 'upload_frequency'
  | 'trend_rank'

type AlertDirection = 'above' | 'below' | 'change'

interface AlertConfig {
  id: string
  name: string
  target: string
  metric: AlertMetric
  direction: AlertDirection
  threshold: number
  email: string
  isActive: boolean
  createdAt: string
  channels: 'email'[]
}

interface AlertFormState {
  name: string
  target: string
  metric: AlertMetric
  direction: AlertDirection
  threshold: string
  email: string
}

const STORAGE_KEY = 'tubefission_alerts'

const METRIC_OPTIONS: Array<{
  id: AlertMetric
  name: string
  unit: string
  defaultThreshold: number
  description: string
}> = [
  {
    id: 'view_velocity',
    name: 'View velocity',
    unit: 'views/day',
    defaultThreshold: 100000,
    description: 'Daily view growth crosses the trigger point.',
  },
  {
    id: 'engagement_rate',
    name: 'Engagement rate',
    unit: '%',
    defaultThreshold: 5,
    description: 'Likes and comments become unusually strong.',
  },
  {
    id: 'view_count',
    name: 'Total views',
    unit: 'views',
    defaultThreshold: 1000000,
    description: 'A watched video reaches a scale milestone.',
  },
  {
    id: 'opportunity_score',
    name: 'Opportunity score',
    unit: '/100',
    defaultThreshold: 80,
    description: 'A topic becomes worth acting on.',
  },
  {
    id: 'competition_saturation',
    name: 'Competition saturation',
    unit: '%',
    defaultThreshold: 35,
    description: 'Creator activity drops into a lower competition window.',
  },
  {
    id: 'upload_frequency',
    name: 'Upload frequency',
    unit: 'uploads/week',
    defaultThreshold: 10,
    description: 'A channel or niche suddenly changes publishing pace.',
  },
  {
    id: 'trend_rank',
    name: 'Trend rank',
    unit: 'rank',
    defaultThreshold: 10,
    description: 'A tracked topic enters a top ranking band.',
  },
]

const DIRECTION_OPTIONS: Array<{ id: AlertDirection; label: string; helper: string }> = [
  { id: 'above', label: 'Rises above', helper: 'Trigger when the metric is greater than the threshold.' },
  { id: 'below', label: 'Falls below', helper: 'Trigger when the metric is lower than the threshold.' },
  { id: 'change', label: 'Changes by', helper: 'Trigger when the metric moves by this amount.' },
]

const DEFAULT_FORM: AlertFormState = {
  name: '',
  target: '',
  metric: 'view_velocity',
  direction: 'above',
  threshold: '100000',
  email: '',
}

function getMetric(metric: AlertMetric) {
  return METRIC_OPTIONS.find((item) => item.id === metric) || METRIC_OPTIONS[0]
}

function getDirection(direction: AlertDirection) {
  return DIRECTION_OPTIONS.find((item) => item.id === direction) || DIRECTION_OPTIONS[0]
}

function isMetric(value: unknown): value is AlertMetric {
  return METRIC_OPTIONS.some((item) => item.id === value)
}

function isDirection(value: unknown): value is AlertDirection {
  return DIRECTION_OPTIONS.some((item) => item.id === value)
}

function normalizeAlert(value: unknown): AlertConfig | null {
  if (!value || typeof value !== 'object') return null

  const source = value as Record<string, unknown>
  const metric = isMetric(source.metric)
    ? source.metric
    : source.type === 'competition_drop'
      ? 'competition_saturation'
      : source.type === 'breakout_prediction'
        ? 'opportunity_score'
        : 'view_velocity'
  const direction = isDirection(source.direction)
    ? source.direction
    : metric === 'competition_saturation'
      ? 'below'
      : 'above'
  const threshold = typeof source.threshold === 'number' && Number.isFinite(source.threshold)
    ? source.threshold
    : getMetric(metric).defaultThreshold

  return {
    id: typeof source.id === 'string' ? source.id : Date.now().toString(),
    name: typeof source.name === 'string' && source.name.trim() ? source.name : getMetric(metric).name,
    target: typeof source.target === 'string' ? source.target : '',
    metric,
    direction,
    threshold,
    email: typeof source.email === 'string' ? source.email : '',
    isActive: typeof source.isActive === 'boolean' ? source.isActive : true,
    createdAt: typeof source.createdAt === 'string' ? source.createdAt : new Date().toISOString(),
    channels: ['email'],
  }
}

function readAlerts(): AlertConfig[] {
  if (typeof window === 'undefined') return []
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
    if (!Array.isArray(parsed)) return []
    return parsed.map(normalizeAlert).filter((item): item is AlertConfig => Boolean(item))
  } catch {
    return []
  }
}

function getStoredUserEmail() {
  if (typeof window === 'undefined') return ''
  try {
    const user = JSON.parse(window.localStorage.getItem('user') || 'null')
    return typeof user?.email === 'string' ? user.email : ''
  } catch {
    return ''
  }
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

function formatThreshold(alert: AlertConfig) {
  const metric = getMetric(alert.metric)
  return `${alert.threshold.toLocaleString()} ${metric.unit}`
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertConfig[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<AlertFormState>(DEFAULT_FORM)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    queueMicrotask(() => {
      const savedAlerts = readAlerts()
      setAlerts(savedAlerts)
      const email = getStoredUserEmail()
      if (email) setForm((current) => ({ ...current, email }))
    })
  }, [])

  const activeAlerts = alerts.filter((alert) => alert.isActive).length
  const selectedMetric = getMetric(form.metric)
  const selectedDirection = getDirection(form.direction)

  const suggestedName = useMemo(() => {
    if (form.name.trim()) return form.name
    return `${selectedMetric.name} ${selectedDirection.label.toLowerCase()} ${form.threshold || selectedMetric.defaultThreshold}`
  }, [form.name, form.threshold, selectedDirection, selectedMetric])

  const saveAlerts = (updated: AlertConfig[]) => {
    setAlerts(updated)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  const openCreateModal = () => {
    setEditingId(null)
    setForm({
      ...DEFAULT_FORM,
      threshold: String(METRIC_OPTIONS[0].defaultThreshold),
      email: getStoredUserEmail(),
    })
    setFormError('')
    setShowModal(true)
  }

  const openEditModal = (alert: AlertConfig) => {
    setEditingId(alert.id)
    setForm({
      name: alert.name,
      target: alert.target,
      metric: alert.metric,
      direction: alert.direction,
      threshold: String(alert.threshold),
      email: alert.email,
    })
    setFormError('')
    setShowModal(true)
  }

  const updateMetric = (metric: AlertMetric) => {
    setForm((current) => ({
      ...current,
      metric,
      threshold: String(getMetric(metric).defaultThreshold),
      direction: metric === 'competition_saturation' || metric === 'trend_rank' ? 'below' : 'above',
    }))
  }

  const submitAlert = () => {
    const threshold = Number(form.threshold)
    const email = form.email.trim()

    if (!form.target.trim()) {
      setFormError('Add a keyword, niche, channel, or video to monitor.')
      return
    }
    if (!Number.isFinite(threshold) || threshold <= 0) {
      setFormError('Set a threshold greater than 0.')
      return
    }
    if (!isValidEmail(email)) {
      setFormError('Enter a valid email address for alert delivery.')
      return
    }

    const nextAlert: AlertConfig = {
      id: editingId || Date.now().toString(),
      name: suggestedName.trim(),
      target: form.target.trim(),
      metric: form.metric,
      direction: form.direction,
      threshold,
      email,
      isActive: editingId ? alerts.find((alert) => alert.id === editingId)?.isActive ?? true : true,
      createdAt: editingId ? alerts.find((alert) => alert.id === editingId)?.createdAt || new Date().toISOString() : new Date().toISOString(),
      channels: ['email'],
    }

    const updated = editingId
      ? alerts.map((alert) => (alert.id === editingId ? nextAlert : alert))
      : [nextAlert, ...alerts]

    saveAlerts(updated)
    setShowModal(false)
    setEditingId(null)
    setFormError('')
  }

  const toggleAlert = (id: string) => {
    saveAlerts(alerts.map((alert) => (
      alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
    )))
  }

  const deleteAlert = (id: string) => {
    saveAlerts(alerts.filter((alert) => alert.id !== id))
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-600">
              <Bell className="h-3.5 w-3.5" />
              Alert rules
            </div>
            <h1 className="text-3xl font-black tracking-tight text-gray-950">Trend Alerts</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
              Choose the signal, set the trigger threshold, and send the alert to the right inbox.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700"
          >
            <Plus className="h-4 w-4" />
            Add Alert
          </button>
        </div>

        <div className="mb-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Active alerts</div>
            <div className="mt-2 text-3xl font-black text-gray-950">{activeAlerts}</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Available data types</div>
            <div className="mt-2 text-3xl font-black text-gray-950">{METRIC_OPTIONS.length}</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Delivery</div>
            <div className="mt-2 flex items-center gap-2 text-lg font-black text-gray-950">
              <Mail className="h-5 w-5 text-red-600" />
              Email
            </div>
          </div>
        </div>

        {alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.map((alert) => {
              const metric = getMetric(alert.metric)
              const direction = getDirection(alert.direction)
              return (
                <div key={alert.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 gap-4">
                      <button
                        type="button"
                        onClick={() => toggleAlert(alert.id)}
                        aria-label={alert.isActive ? 'Pause alert' : 'Activate alert'}
                        className={`mt-1 h-7 w-12 shrink-0 rounded-full p-1 transition ${
                          alert.isActive ? 'bg-emerald-500' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`block h-5 w-5 rounded-full bg-white shadow transition ${
                          alert.isActive ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-lg font-black text-gray-950">{alert.name}</h2>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                            alert.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {alert.isActive ? 'Active' : 'Paused'}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                          Monitor <span className="font-bold text-gray-900">{alert.target}</span>
                        </p>
                        <div className="mt-3 grid gap-2 sm:grid-cols-3">
                          <div className="rounded-lg bg-gray-50 p-3">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Data type</div>
                            <div className="mt-1 text-sm font-bold text-gray-900">{metric.name}</div>
                          </div>
                          <div className="rounded-lg bg-gray-50 p-3">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Trigger</div>
                            <div className="mt-1 text-sm font-bold text-gray-900">{direction.label} {formatThreshold(alert)}</div>
                          </div>
                          <div className="rounded-lg bg-gray-50 p-3">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Send to</div>
                            <div className="mt-1 truncate text-sm font-bold text-gray-900">{alert.email || 'No email set'}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(alert)}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteAlert(alert.id)}
                        className="inline-flex items-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-14 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <Bell className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-black text-gray-950">No alerts configured</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
              Create a rule for the exact metric you care about, then TubeFission can notify the right email when it crosses your threshold.
            </p>
            <button
              type="button"
              onClick={openCreateModal}
              className="mt-6 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white hover:bg-red-700"
            >
              Create First Alert
            </button>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
            <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-gray-950">{editingId ? 'Edit Alert' : 'Create Alert'}</h2>
                  <p className="mt-1 text-sm text-gray-500">Customize the signal, threshold, and inbox.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-bold text-gray-600 hover:bg-gray-200"
                >
                  Close
                </button>
              </div>

              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-bold text-gray-800">Alert name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(event) => setForm({ ...form, name: event.target.value })}
                      placeholder="e.g. AI Shorts breakout"
                      className="w-full rounded-xl border border-gray-300 px-3 py-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-bold text-gray-800">Send email to</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(event) => setForm({ ...form, email: event.target.value })}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-gray-300 px-3 py-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-bold text-gray-800">Monitor target</label>
                  <input
                    type="text"
                    value={form.target}
                    onChange={(event) => setForm({ ...form, target: event.target.value })}
                    placeholder="Keyword, niche, channel handle, video ID, or trend name"
                    className="w-full rounded-xl border border-gray-300 px-3 py-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-800">Data type</label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {METRIC_OPTIONS.map((metric) => (
                      <button
                        key={metric.id}
                        type="button"
                        onClick={() => updateMetric(metric.id)}
                        className={`rounded-xl border p-3 text-left transition ${
                          form.metric === metric.id
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-black text-gray-950">{metric.name}</span>
                          <span className="text-xs font-bold text-gray-500">{metric.unit}</span>
                        </div>
                        <p className="mt-1 text-xs leading-5 text-gray-500">{metric.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-800">Trigger direction</label>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {DIRECTION_OPTIONS.map((direction) => (
                        <button
                          key={direction.id}
                          type="button"
                          onClick={() => setForm({ ...form, direction: direction.id })}
                          className={`rounded-xl border px-3 py-3 text-left text-sm font-bold ${
                            form.direction === direction.id
                              ? 'border-red-300 bg-red-50 text-red-700'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}
                          title={direction.helper}
                        >
                          {direction.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-800">Threshold</label>
                    <div className="flex overflow-hidden rounded-xl border border-gray-300 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={form.threshold}
                        onChange={(event) => setForm({ ...form, threshold: event.target.value })}
                        className="min-w-0 flex-1 px-3 py-3 text-sm outline-none"
                      />
                      <div className="flex items-center bg-gray-50 px-3 text-xs font-bold text-gray-500">
                        {selectedMetric.unit}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Rule preview</div>
                  <p className="mt-2 text-sm font-semibold leading-6 text-gray-800">
                    Send an email to <span className="text-red-600">{form.email || 'your inbox'}</span> when{' '}
                    <span className="text-gray-950">{form.target || 'the monitored target'}</span>{' '}
                    <span className="text-gray-950">{selectedMetric.name.toLowerCase()}</span>{' '}
                    {selectedDirection.label.toLowerCase()} <span className="text-gray-950">{form.threshold || selectedMetric.defaultThreshold} {selectedMetric.unit}</span>.
                  </p>
                </div>

                {formError && (
                  <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                    {formError}
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl border border-gray-300 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitAlert}
                  className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-bold text-white hover:bg-red-700"
                >
                  {editingId ? 'Save Changes' : 'Create Alert'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
