import type { Metadata } from 'next'
import Link from 'next/link'
import { runHealthCheck } from '@/lib/monitor'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'System Status | TubeFission',
  description: 'Real-time system health, API quota, and data freshness monitoring for TubeFission.',
  robots: {
    index: false,
    follow: false,
  },
}

function StatusBadge({ status }: { status: string }) {
  const color =
    status === 'healthy'
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : status === 'degraded'
      ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      : 'bg-red-500/20 text-red-400 border-red-500/30'
  return (
    <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${color} data-mono`}>
      {status.toUpperCase()}
    </span>
  )
}

function CheckCard({
  title,
  ok,
  children,
}: {
  title: string
  ok: boolean
  children: React.ReactNode
}) {
  return (
    <div className={`glass-panel neon-border rounded-2xl p-5 sm:p-6 glow-hover corner-accent border-l-4 ${ok ? 'border-l-green-500' : 'border-l-red-500'}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-sm sm:text-base">{title}</h3>
        <span className={`w-2.5 h-2.5 rounded-full ${ok ? 'bg-green-500 pulse-glow-green' : 'bg-red-500 pulse-glow-red'}`} />
      </div>
      {children}
    </div>
  )
}

export default async function StatusPage() {
  const report = await runHealthCheck()
  const dataAge = report.checks.dataFreshness.hoursSince
  const dataFreshnessLabel = dataAge === Infinity
    ? 'No data yet'
    : dataAge <= 3
      ? 'Fresh'
      : dataAge <= 48
        ? 'Delayed but usable'
        : 'Stale'

  return (
    <main className="min-h-screen bg-[#070707] text-white terminal-grid relative overflow-hidden">
      <div className="ambient-glow-tl" />
      <div className="ambient-glow-tr" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6 sm:mb-8">
          <span className="text-lg">&larr;</span>
          <span className="text-sm font-medium">Back to Trends</span>
        </Link>

        <div className="mb-8 sm:mb-10">
          <div className="text-zinc-500 text-xs font-bold tracking-[0.2em] uppercase mb-2 data-mono">DATA COLLECTION HEALTH</div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-glow">TubeFission Status</h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Data collection health, API availability, quota usage, and freshness signals for creator research pages.
          </p>
        </div>

        {/* Overall Status */}
        <div className="glass-panel neon-border rounded-2xl p-6 sm:p-8 mb-8 glow-hover corner-accent">
          <div className="flex items-center justify-between mb-4">
            <div className="text-zinc-500 text-xs data-mono tracking-wider">OVERALL STATUS</div>
            <StatusBadge status={report.status} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-panel rounded-xl p-3 text-center">
              <div className="text-zinc-500 text-[10px] data-mono tracking-wider mb-1">API LATENCY</div>
              <div className={`text-lg font-black data-mono ${report.checks.youtubeApi.latencyMs < 1000 ? 'text-green-400' : 'text-yellow-400'}`}>
                {report.checks.youtubeApi.latencyMs}ms
              </div>
            </div>
            <div className="glass-panel rounded-xl p-3 text-center">
              <div className="text-zinc-500 text-[10px] data-mono tracking-wider mb-1">QUOTA USED</div>
              <div className={`text-lg font-black data-mono ${report.checks.quota.ok ? 'text-green-400' : 'text-red-400'}`}>
                {report.checks.quota.percentage}%
              </div>
            </div>
            <div className="glass-panel rounded-xl p-3 text-center">
              <div className="text-zinc-500 text-[10px] data-mono tracking-wider mb-1">DATA AGE</div>
              <div className={`text-lg font-black data-mono ${report.checks.dataFreshness.ok ? 'text-green-400' : dataAge <= 48 ? 'text-yellow-400' : 'text-red-400'}`}>
                {report.checks.dataFreshness.hoursSince === Infinity ? 'N/A' : `${report.checks.dataFreshness.hoursSince}h`}
              </div>
              <div className={`mt-1 text-[10px] font-bold ${report.checks.dataFreshness.ok ? 'text-green-400' : dataAge <= 48 ? 'text-yellow-400' : 'text-red-400'}`}>
                {dataFreshnessLabel}
              </div>
            </div>
            <div className="glass-panel rounded-xl p-3 text-center">
              <div className="text-zinc-500 text-[10px] data-mono tracking-wider mb-1">ERRORS (1H)</div>
              <div className={`text-lg font-black data-mono ${report.checks.errors.ok ? 'text-green-400' : 'text-red-400'}`}>
                {report.checks.errors.count1h}
              </div>
            </div>
          </div>
          <div className="mt-4 text-zinc-500 text-xs data-mono">
            Version: {report.version} 路 Checked: {new Date(report.timestamp).toLocaleString('en-US', { timeZone: 'UTC' })} UTC
          </div>
        </div>

        {/* Detailed Checks */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 mb-8">
          <CheckCard title="YouTube API Connectivity" ok={report.checks.youtubeApi.ok}>
            <div className="text-zinc-400 text-sm mb-2">
              {report.checks.youtubeApi.ok
                ? `Responding in ${report.checks.youtubeApi.latencyMs}ms`
                : `Failed: ${report.checks.youtubeApi.error}`}
            </div>
            <div className="text-zinc-500 text-xs data-mono">
              Endpoint: googleapis.com/youtube/v3/videos
            </div>
          </CheckCard>

          <CheckCard title="API Quota Usage" ok={report.checks.quota.ok}>
            <div className="text-zinc-400 text-sm mb-2">
              {report.checks.quota.used.toLocaleString()} / {report.checks.quota.limit.toLocaleString()} units
            </div>
            <div className="w-full bg-zinc-800/50 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${report.checks.quota.ok ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(100, report.checks.quota.percentage)}%` }}
              />
            </div>
          </CheckCard>

          <CheckCard title="Data Freshness" ok={report.checks.dataFreshness.ok}>
            <div className="text-zinc-400 text-sm mb-2">
              {report.checks.dataFreshness.lastUpdate
                ? `Last update: ${new Date(report.checks.dataFreshness.lastUpdate).toLocaleString('en-US', { timeZone: 'UTC' })} UTC`
                : 'No historical data found'}
            </div>
            <div className="text-zinc-500 text-xs data-mono">
              {report.checks.dataFreshness.hoursSince === Infinity
                ? 'Run data collection to initialize history'
                : `${report.checks.dataFreshness.hoursSince} hours since last collection`}
            </div>
          </CheckCard>

          <CheckCard title="Error Rate (1h)" ok={report.checks.errors.ok}>
            <div className="text-zinc-400 text-sm mb-2">
              {report.checks.errors.count1h === 0
                ? 'No errors in the last hour'
                : `${report.checks.errors.count1h} alert(s) in the last hour`}
            </div>
            {report.checks.errors.recent.length > 0 && (
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {report.checks.errors.recent.map((alert, i) => (
                  <div key={i} className="text-[10px] data-mono text-zinc-500 truncate">
                    <span className={alert.level === 'critical' ? 'text-red-400' : alert.level === 'warning' ? 'text-yellow-400' : 'text-zinc-400'}>
                      [{alert.level.toUpperCase()}]
                    </span>{' '}
                    {alert.message}
                  </div>
                ))}
              </div>
            )}
          </CheckCard>
        </div>

        {/* Public Readiness */}
        <div className="glass-panel neon-border rounded-2xl p-5 sm:p-6 glow-hover corner-accent">
          <h3 className="font-bold text-sm sm:text-base mb-3">Creator Workflow Readiness</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-500">Analysis</div>
              <div className="mt-2 text-sm font-bold text-green-400">Available</div>
              <p className="mt-2 text-xs leading-relaxed text-zinc-500">Video, channel, and trend analysis pages are online.</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-500">Workspace</div>
              <div className="mt-2 text-sm font-bold text-green-400">Available</div>
              <p className="mt-2 text-xs leading-relaxed text-zinc-500">Saved history, watchlists, compare queues, and alert drafts are active.</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-500">Notifications</div>
              <div className="mt-2 text-sm font-bold text-yellow-400">Rolling out</div>
              <p className="mt-2 text-xs leading-relaxed text-zinc-500">Trend and competitor alerts can be drafted now; delivery channels are being expanded.</p>
            </div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-zinc-500">
            This page shows product health for users. Internal delivery configuration is kept out of the public status view.
          </p>
        </div>
        {/* Footer */}
        <footer className="border-t border-zinc-800/60 pt-10 mt-10 text-zinc-600 text-xs data-mono text-center">
          Auto-refresh this page to monitor system health in real-time.
        </footer>
      </div>
    </main>
  )
}
