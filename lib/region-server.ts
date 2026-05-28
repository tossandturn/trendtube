/* =========================================================
   SERVER-ONLY REGION HELPERS
   Must NOT be imported from Client Components.
========================================================= */

import { cookies } from 'next/headers'
import { REGIONS, type Region } from './region'

export async function getRegion(): Promise<Region> {
  try {
    const c = await cookies()
    const region = c.get('region')?.value
    if (region && REGIONS.includes(region as Region)) return region as Region
  } catch {
    // cookies() fails during static generation — fallback to US
  }
  return 'US'
}
