import { sql } from '@vercel/postgres'
import Database from 'better-sqlite3'
import { join } from 'path'

const IS_VERCEL = !!process.env.VERCEL
const HAS_POSTGRES = !!process.env.POSTGRES_URL

// For local scripts - SQLite fallback
let sqliteDb: Database.Database | null = null

export function getDb(): Database.Database {
  if (sqliteDb) return sqliteDb
  const DB_PATH = process.env.DATABASE_URL || join(process.cwd(), 'data', 'tubefission.db')
  sqliteDb = new Database(DB_PATH)
  sqliteDb.pragma('journal_mode = WAL')
  return sqliteDb
}

// User interface
export interface User {
  id: number
  username: string
  email: string
  password_hash: string
  email_verified: number
  created_at: string
  last_login: string | null
}

// User functions - with SQLite fallback
export async function createUser(username: string, email: string, passwordHash: string): Promise<User> {
  if (HAS_POSTGRES) {
    const result = await sql<User>`
      INSERT INTO users (username, email, password_hash)
      VALUES (${username}, ${email}, ${passwordHash})
      RETURNING *
    `
    return result.rows[0]
  } else {
    const db = getDb()
    const result = db.prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?) RETURNING *').get(username, email, passwordHash) as User
    return result
  }
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  if (HAS_POSTGRES) {
    const result = await sql<User>`SELECT * FROM users WHERE email = ${email}`
    return result.rows[0]
  } else {
    const db = getDb()
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined
  }
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
  if (HAS_POSTGRES) {
    const result = await sql<User>`SELECT * FROM users WHERE username = ${username}`
    return result.rows[0]
  } else {
    const db = getDb()
    return db.prepare('SELECT * FROM users WHERE username = ?').get(username) as User | undefined
  }
}

export async function verifyUserEmail(userId: number): Promise<void> {
  if (HAS_POSTGRES) {
    await sql`UPDATE users SET email_verified = 1 WHERE id = ${userId}`
  } else {
    const db = getDb()
    db.prepare('UPDATE users SET email_verified = 1 WHERE id = ?').run(userId)
  }
}

// Email verification
export interface EmailVerification {
  id: number
  user_id: number
  token: string
  expires_at: string
  verified_at: string | null
  created_at: string
}

export async function createEmailVerification(userId: number, token: string, expiresAt: Date): Promise<EmailVerification> {
  if (HAS_POSTGRES) {
    const result = await sql<EmailVerification>`
      INSERT INTO email_verifications (user_id, token, expires_at)
      VALUES (${userId}, ${token}, ${expiresAt.toISOString()})
      RETURNING *
    `
    return result.rows[0]
  } else {
    const db = getDb()
    const result = db.prepare('INSERT INTO email_verifications (user_id, token, expires_at) VALUES (?, ?, ?) RETURNING *').get(userId, token, expiresAt.toISOString()) as EmailVerification
    return result
  }
}

export async function getVerificationByToken(token: string): Promise<EmailVerification | undefined> {
  if (HAS_POSTGRES) {
    const result = await sql<EmailVerification>`SELECT * FROM email_verifications WHERE token = ${token}`
    return result.rows[0]
  } else {
    const db = getDb()
    return db.prepare('SELECT * FROM email_verifications WHERE token = ?').get(token) as EmailVerification | undefined
  }
}

export async function markVerificationUsed(token: string): Promise<void> {
  if (HAS_POSTGRES) {
    await sql`UPDATE email_verifications SET verified_at = CURRENT_TIMESTAMP WHERE token = ${token}`
  } else {
    const db = getDb()
    db.prepare('UPDATE email_verifications SET verified_at = CURRENT_TIMESTAMP WHERE token = ?').run(token)
  }
}

export async function deleteExpiredVerifications(): Promise<void> {
  if (HAS_POSTGRES) {
    await sql`DELETE FROM email_verifications WHERE expires_at < CURRENT_TIMESTAMP AND verified_at IS NULL`
  } else {
    const db = getDb()
    db.prepare("DELETE FROM email_verifications WHERE expires_at < datetime('now') AND verified_at IS NULL").run()
  }
}

export async function updateLastLogin(userId: number): Promise<void> {
  if (HAS_POSTGRES) {
    await sql`UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ${userId}`
  } else {
    const db = getDb()
    db.prepare("UPDATE users SET last_login = datetime('now') WHERE id = ?").run(userId)
  }
}

// Initialize tables
export async function initTables() {
  if (HAS_POSTGRES) {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(20) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email_verified INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS email_verifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        verified_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`CREATE INDEX IF NOT EXISTS idx_email_verification_token ON email_verifications(token)`
    await sql`CREATE INDEX IF NOT EXISTS idx_email_verification_user ON email_verifications(user_id)`
  } else {
    const db = getDb()
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(20) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email_verified INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      )
    `)

    db.exec(`
      CREATE TABLE IF NOT EXISTS email_verifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id),
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        verified_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    db.exec("CREATE INDEX IF NOT EXISTS idx_email_verification_token ON email_verifications(token)")
    db.exec("CREATE INDEX IF NOT EXISTS idx_email_verification_user ON email_verifications(user_id)")
  }
}

// Initialize on module load - but only if we have database
if (HAS_POSTGRES) {
  initTables().catch(console.error)
}

// Trends - stubs for now
export interface Trend {
  id: number
  slug: string
  title: string
  category: string | null
  description: string | null
  created_at: string
  updated_at: string
}

export function createTrend(slug: string, title: string, category?: string, description?: string): Trend {
  throw new Error('Not implemented')
}

export function getTrendBySlug(slug: string): Trend | undefined {
  return undefined
}

export function getAllTrends(): Trend[] {
  return []
}

export function getTrendsByCategory(category: string): Trend[] {
  return []
}

export function upsertTrend(slug: string, title: string, category?: string, description?: string): Trend {
  throw new Error('Not implemented')
}

// Additional stub functions for API routes

export interface TrendSnapshot {
  id: number
  trend_id: number
  view_count: number
  video_count: number
  timestamp: string
}

export function getTrendSnapshots(trendId: number, limit?: number): TrendSnapshot[] {
  return []
}

export function getLatestSnapshot(trendId: number): TrendSnapshot | undefined {
  return undefined
}

export interface Tag {
  id: number
  name: string
  slug: string
  video_count: number
}

export function getAllTags(): Tag[] {
  return []
}

export function getTagsForTrend(trendId: number): Tag[] {
  return []
}

export function getTrendsByTag(tagSlug: string): Trend[] {
  return []
}

export async function addTag(trendId: number, tagName: string): Promise<void> {
  // Stub - no-op
}

// Analyze tracking stubs
export interface AnalyzeAttempt {
  id: number
  session_id: string
  video_url?: string
  channel_url?: string
  attempted_at: string
}

export async function recordAnalyzeAttempt(sessionId: string, data?: { videoUrl?: string; channelUrl?: string }): Promise<void> {
  // Stub - no-op
}

export async function getSessionAnalyzeCount(sessionId: string): Promise<number> {
  return 0
}

// Saved trends stubs
export interface SavedTrend {
  id: number
  user_id: number
  trend_id: number
  saved_at: string
}

export function getSavedTrends(userId: number): Trend[] {
  return []
}

export async function saveTrend(userId: number, trendId: number): Promise<void> {
  // Stub - no-op
}

export async function unsaveTrend(userId: number, trendId: number): Promise<void> {
  // Stub - no-op
}

export function isTrendSaved(userId: number, trendId: number): boolean {
  return false
}

// Snapshot functions
export interface Snapshot {
  id: number
  trend_id: number
  date: string
  view_count: number
  video_count: number
  engagement_rate: number
  velocity: number
}

export async function upsertSnapshot(data: {
  trend_id: number
  velocity: number
  views: number
  likes: number
  comments: number
  creator_count: number
  saturation_score: number
  breakout_score: number
  predicted_peak_hours: number
  snapshot_date: string
}): Promise<Snapshot> {
  throw new Error('Not implemented')
}


