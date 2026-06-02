/* =========================================================
   DAILY DIGEST SENDER — Sends one email per day with all alerts
========================================================= */

import { sendDailyDigest } from '../lib/monitor'

async function main() {
  console.log('Sending daily digest...')
  await sendDailyDigest()
  console.log('Done!')
}

main().catch(console.error)
