/* =========================================================
   STANDALONE HEALTH CHECK
   Run locally or in CI/GitHub Actions for unattended monitoring.
   Usage: npx tsx scripts/health-check.ts
========================================================= */

import { runHealthCheck, sendAlert } from '../lib/monitor'

async function main() {
  console.log('🔍 Running health check...')
  const report = await runHealthCheck()

  console.log(`Status: ${report.status.toUpperCase()}`)
  console.log(`  API: ${report.checks.youtubeApi.ok ? 'OK' : 'FAIL'} (${report.checks.youtubeApi.latencyMs}ms)`)
  console.log(`  Quota: ${report.checks.quota.percentage}%`)
  console.log(`  Data freshness: ${report.checks.dataFreshness.hoursSince}h ago`)
  console.log(`  Errors (1h): ${report.checks.errors.count1h}`)

  if (report.status !== 'healthy') {
    console.error('❌ Health check failed. Alert dispatched.')
    process.exit(1)
  }

  console.log('✅ All checks passed.')
  process.exit(0)
}

main().catch((err) => {
  console.error('Health check crashed:', err)
  sendAlert({
    level: 'critical',
    source: 'Health Check Script',
    message: 'Health check script crashed',
    detail: err instanceof Error ? err.message : String(err),
    timestamp: new Date().toISOString(),
  })
  process.exit(1)
})
