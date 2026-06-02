/* =========================================================
   MONITORED FETCH — Client-safe version without fs module
========================================================= */

export interface FetchOptions extends RequestInit {
  quotaUnits?: number
  retries?: number
}

/* ---- Enhanced fetch with monitoring (client-safe) ---- */
export async function monitoredFetch(
  url: string,
  options?: FetchOptions
): Promise<Response> {
  const { retries = 2, ...fetchOptions } = options || {}
  const start = Date.now()
  let lastError: Error | undefined

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, fetchOptions)
      const latency = Date.now() - start

      if (!res.ok) {
        const errorMsg = `HTTP ${res.status} from ${new URL(url).hostname}`
        if (res.status >= 500 || attempt < retries) {
          lastError = new Error(errorMsg)
          if (attempt < retries) {
            await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)))
            continue
          }
        }
        // Log to console in browser
        console.warn(`[API] ${errorMsg}, latency: ${latency}ms`)
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
  console.error(`[API] Failed after ${retries + 1} attempts:`, finalError.message)
  throw finalError
}

export function trackQuotaUsage(units: number) {
  // Client-side: just log, don't persist
  console.log(`[Quota] Used ${units} units`)
}

export async function sendAlert(payload: {
  level: 'critical' | 'warning' | 'info'
  source: string
  message: string
  detail?: string
  timestamp: string
}) {
  // Client-side: just log to console
  const logLine = `[${payload.level.toUpperCase()}] ${payload.source}: ${payload.message}`
  if (payload.level === 'critical') console.error(logLine)
  else if (payload.level === 'warning') console.warn(logLine)
  else console.info(logLine)
}
