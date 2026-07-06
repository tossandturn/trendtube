/* =========================================================
   MONITORING & ALERTING — Daily Digest System
   Alerts are batched and sent once per day to avoid spam
========================================================= */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

export interface AlertPayload {
  level: 'critical' | 'warning' | 'info'
  source: string
  message: string
  detail?: string
  timestamp: string
}

interface DailyDigest {
  date: string
  critical: AlertPayload[]
  warning: AlertPayload[]
  info: AlertPayload[]
  sent: boolean
}

const DATA_DIR = join(process.cwd(), 'data')
const DIGEST_FILE = join(DATA_DIR, 'daily-digest.json')

export interface HealthReport {
  status: 'healthy' | 'degraded' | 'down'
  checks: {
    youtubeApi: { ok: boolean; latencyMs: number; error?: string }
    quota: { ok: boolean; used: number; limit: number; percentage: number }
    dataFreshness: { ok: boolean; lastUpdate: string | null; hoursSince: number; error?: string }
    errors: { ok: boolean; count1h: number; recent: AlertPayload[] }
  }
  timestamp: string
  version: string
}

/* ---- Daily Digest Management ---- */
function getTodayKey(): string {
  return new Date().toISOString().split('T')[0] // YYYY-MM-DD
}

function ensureDataDir(): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true })
  }
}

function loadDigest(): DailyDigest {
  ensureDataDir()
  const today = getTodayKey()

  if (existsSync(DIGEST_FILE)) {
    try {
      const data = JSON.parse(readFileSync(DIGEST_FILE, 'utf-8'))
      if (data.date === today) {
        return data
      }
    } catch {
      // File corrupted, start fresh
    }
  }

  return {
    date: today,
    critical: [],
    warning: [],
    info: [],
    sent: false,
  }
}

function saveDigest(digest: DailyDigest): void {
  ensureDataDir()
  writeFileSync(DIGEST_FILE, JSON.stringify(digest, null, 2))
}

export function addAlertToDigest(payload: AlertPayload): void {
  const digest = loadDigest()
  digest[payload.level].push(payload)
  saveDigest(digest)
}

export async function sendDailyDigest(): Promise<void> {
  const digest = loadDigest()

  if (digest.sent) {
    console.log('Daily digest already sent for', digest.date)
    return
  }

  const totalAlerts = digest.critical.length + digest.warning.length + digest.info.length

  if (totalAlerts === 0) {
    console.log('No alerts to report for', digest.date)
    digest.sent = true
    saveDigest(digest)
    return
  }

  // Build email content
  let html = `
    <h2>TubeFission Daily Report - ${digest.date}</h2>
    <p>Total alerts: ${totalAlerts}</p>
    <ul>
      <li>🔴 Critical: ${digest.critical.length}</li>
      <li>⚠️ Warning: ${digest.warning.length}</li>
      <li>ℹ️ Info: ${digest.info.length}</li>
    </ul>
  `

  if (digest.critical.length > 0) {
    html += '<h3>🔴 Critical Issues</h3><ul>'
    digest.critical.forEach(alert => {
      html += `<li><strong>${alert.source}</strong>: ${alert.message}<br/><small>${alert.timestamp}</small></li>`
    })
    html += '</ul>'
  }

  if (digest.warning.length > 0) {
    html += '<h3>⚠️ Warnings</h3><ul>'
    digest.warning.forEach(alert => {
      html += `<li><strong>${alert.source}</strong>: ${alert.message}</li>`
    })
    html += '</ul>'
  }

  if (digest.info.length > 0) {
    html += '<h3>ℹ️ Info</h3><ul>'
    digest.info.slice(-10).forEach(alert => {
      html += `<li>${alert.source}: ${alert.message}</li>`
    })
    if (digest.info.length > 10) {
      html += `<li>... and ${digest.info.length - 10} more</li>`
    }
    html += '</ul>'
  }

  // Send email
  if (RESEND_API_KEY && ALERT_EMAIL) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'TubeFission Alerts <alerts@tubefission.com>',
          to: ALERT_EMAIL,
          subject: `📊 TubeFission Daily Report - ${digest.date} (${totalAlerts} alerts)`,
          html: html,
        }),
      })
      console.log('Daily digest sent successfully')
      digest.sent = true
      saveDigest(digest)
    } catch (e) {
      console.error('Failed to send daily digest:', e)
    }
  }
}

/* ---- Config ---- */
const ALERT_EMAIL = process.env.ALERT_EMAIL || ''
const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const ALERT_WEBHOOK_URL = process.env.ALERT_WEBHOOK_URL || ''
const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || ''

/* ---- Quota tracking (approximate) ---- */
let quotaUsedToday = 0
const QUOTA_DAILY_LIMIT = 10_000 // YouTube Data API default

export function trackQuotaUsage(units: number) {
  quotaUsedToday += units
}

export function getQuotaStatus() {
  const percentage = Math.round((quotaUsedToday / QUOTA_DAILY_LIMIT) * 100)
  return {
    used: quotaUsedToday,
    limit: QUOTA_DAILY_LIMIT,
    percentage,
    ok: percentage < 90,
  }
}

export function resetQuotaTracking() {
  quotaUsedToday = 0
}

/* ---- Alerting ---- */
export async function sendAlert(payload: AlertPayload) {
  // Always log to console
  const logLine = `[${payload.level.toUpperCase()}] ${payload.source}: ${payload.message}`
  if (payload.level === 'critical') console.error(logLine)
  else if (payload.level === 'warning') console.warn(logLine)
  else console.info(logLine)

  // Add to daily digest - ALL alerts batched for daily summary
  addAlertToDigest(payload)
  // No immediate emails - everything goes into daily digest
}

export function getRecentAlerts(level?: 'critical' | 'warning' | 'info', limit = 20): AlertPayload[] {
  const digest = loadDigest()
  let alerts: AlertPayload[] = [
    ...digest.critical,
    ...digest.warning,
    ...digest.info,
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  if (level) alerts = alerts.filter((a) => a.level === level)
  return alerts.slice(0, limit)
}

/* ---- Enhanced fetch with monitoring ---- */
export async function monitoredFetch(
  url: string,
  options?: RequestInit & { quotaUnits?: number; retries?: number }
): Promise<Response> {
  const { quotaUnits = 1, retries = 2, ...fetchOptions } = options || {}
  const start = Date.now()
  let lastError: Error | undefined

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, fetchOptions)
      const latency = Date.now() - start

      if (quotaUnits) trackQuotaUsage(quotaUnits)

      if (!res.ok) {
        const errorMsg = `HTTP ${res.status} from ${new URL(url).hostname}`
        if (res.status >= 500 || attempt < retries) {
          lastError = new Error(errorMsg)
          if (attempt < retries) {
            await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)))
            continue
          }
        }
        sendAlert({
          level: res.status >= 500 ? 'critical' : 'warning',
          source: 'API Client',
          message: errorMsg,
          detail: `URL: ${url}\nStatus: ${res.status}\nLatency: ${latency}ms`,
          timestamp: new Date().toISOString(),
        })
        return res
      }

      return res
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)))
      }
    }
  }

  const finalError = lastError || new Error('Unknown fetch error')
  sendAlert({
    level: 'critical',
    source: 'API Client',
    message: `Request failed after ${retries + 1} attempts`,
    detail: `${finalError.message}\nURL: ${url}`,
    timestamp: new Date().toISOString(),
  })
  throw finalError
}

/* ---- Health check ---- */
export async function runHealthCheck(): Promise<HealthReport> {
  const now = new Date()
  const report: HealthReport = {
    status: 'healthy',
    checks: {
      youtubeApi: { ok: false, latencyMs: 0 },
      quota: getQuotaStatus(),
      dataFreshness: { ok: false, lastUpdate: null, hoursSince: Infinity },
      errors: { ok: true, count1h: 0, recent: [] },
    },
    timestamp: now.toISOString(),
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'dev',
  }

  // Check YouTube API
  if (YOUTUBE_API_KEY) {
    const t0 = Date.now()
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3500)
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=1&regionCode=US&key=${YOUTUBE_API_KEY}`,
        { cache: 'no-store', signal: controller.signal }
      )
      report.checks.youtubeApi.latencyMs = Date.now() - t0
      report.checks.youtubeApi.ok = res.ok
      if (!res.ok) {
        report.checks.youtubeApi.error = `HTTP ${res.status}`
      }
    } catch (e) {
      report.checks.youtubeApi.latencyMs = Date.now() - t0
      report.checks.youtubeApi.error = e instanceof Error && e.name === 'AbortError'
        ? 'Health check timed out'
        : e instanceof Error ? e.message : String(e)
    } finally {
      clearTimeout(timeout)
    }
  } else {
    report.checks.youtubeApi.error = 'No API key configured'
  }

  // Check data freshness (history.json)
  try {
    const { loadHistory } = await import('./analytics')
    const history = loadHistory()
    const last = history[history.length - 1]
    if (last) {
      report.checks.dataFreshness.lastUpdate = last.timestamp
      const hoursSince = (now.getTime() - new Date(last.timestamp).getTime()) / (1000 * 60 * 60)
      report.checks.dataFreshness.hoursSince = Math.round(hoursSince * 10) / 10
      report.checks.dataFreshness.ok = hoursSince < 48
    }
  } catch {
    report.checks.dataFreshness.error = 'history.json not found'
  }

  // Error summary
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString()
  const recentAlerts = getRecentAlerts(undefined, 100)
  report.checks.errors.recent = recentAlerts.filter((a) => a.timestamp >= oneHourAgo).slice(0, 20)
  report.checks.errors.count1h = report.checks.errors.recent.length
  report.checks.errors.ok = report.checks.errors.count1h < 5

  // Overall status
  if (!report.checks.errors.ok || (!report.checks.youtubeApi.ok && !report.checks.dataFreshness.ok)) {
    report.status = 'down'
  } else if (!report.checks.youtubeApi.ok || !report.checks.quota.ok || !report.checks.dataFreshness.ok) {
    report.status = 'degraded'
  }

  // Auto-alert on degraded/down
  if (report.status === 'down') {
    await sendAlert({
      level: 'critical',
      source: 'Health Check',
      message: 'TubeFission is DOWN',
      detail: `API: ${report.checks.youtubeApi.ok ? 'OK' : report.checks.youtubeApi.error}\nQuota: ${report.checks.quota.percentage}%\nData: ${report.checks.dataFreshness.hoursSince}h old\nErrors(1h): ${report.checks.errors.count1h}`,
      timestamp: report.timestamp,
    })
  } else if (report.status === 'degraded') {
    await sendAlert({
      level: 'warning',
      source: 'Health Check',
      message: 'TubeFission is DEGRADED',
      detail: `API: ${report.checks.youtubeApi.ok ? 'OK' : report.checks.youtubeApi.error}\nQuota: ${report.checks.quota.percentage}%\nData: ${report.checks.dataFreshness.hoursSince}h old`,
      timestamp: report.timestamp,
    })
  }

  return report
}
