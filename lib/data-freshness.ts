export const TREND_REFRESH_CADENCE = 'Hourly YouTube snapshot'

export function formatSnapshotTimestamp(isoTimestamp: string) {
  return new Date(isoTimestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short',
  })
}

export function trendFreshnessCopy(isoTimestamp: string) {
  return `Data snapshot: ${formatSnapshotTimestamp(isoTimestamp)}. Metrics are YouTube API-backed and refreshed on the hourly cache.`
}
