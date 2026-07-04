import { sql } from '@vercel/postgres'
import Database from 'better-sqlite3'
import { existsSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'

const IS_VERCEL = !!process.env.VERCEL

// For local scripts - SQLite fallback
let sqliteDb: Database.Database | null = null

export function getDb(): Database.Database {
  if (sqliteDb) return sqliteDb
  const DB_PATH = process.env.DATABASE_URL || join(process.cwd(), 'data', 'tubefission.db')
  const dbDir = dirname(DB_PATH)
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true })
  }
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

// User functions
export async function createUser(username: string, email: string, passwordHash: string): Promise<User> {
  const result = await sql<User>`
    INSERT INTO users (username, email, password_hash)
    VALUES (${username}, ${email}, ${passwordHash})
    RETURNING *
  `
  return result.rows[0]
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const result = await sql<User>`SELECT * FROM users WHERE email = ${email}`
  return result.rows[0]
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
  const result = await sql<User>`SELECT * FROM users WHERE username = ${username}`
  return result.rows[0]
}

export async function verifyUserEmail(userId: number): Promise<void> {
  await sql`UPDATE users SET email_verified = 1 WHERE id = ${userId}`
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
  const result = await sql<EmailVerification>`
    INSERT INTO email_verifications (user_id, token, expires_at)
    VALUES (${userId}, ${token}, ${expiresAt.toISOString()})
    RETURNING *
  `
  return result.rows[0]
}

export async function getVerificationByToken(token: string): Promise<EmailVerification | undefined> {
  const result = await sql<EmailVerification>`SELECT * FROM email_verifications WHERE token = ${token}`
  return result.rows[0]
}

export async function markVerificationUsed(token: string): Promise<void> {
  await sql`UPDATE email_verifications SET verified_at = CURRENT_TIMESTAMP WHERE token = ${token}`
}

export async function deleteExpiredVerifications(): Promise<void> {
  await sql`DELETE FROM email_verifications WHERE expires_at < CURRENT_TIMESTAMP AND verified_at IS NULL`
}

export async function updateLastLogin(userId: number): Promise<void> {
  await sql`UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ${userId}`
}

// Initialize tables
export async function initTables() {
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
}

// Initialize on module load
if (IS_VERCEL) {
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

// Trend snapshots
export interface TrendSnapshot {
  id: number
  trend_id: number
  velocity: number | null
  views: number | null
  likes: number | null
  comments: number | null
  creator_count: number | null
  saturation_score: number | null
  breakout_score: number | null
  predicted_peak_hours: number | null
  snapshot_date: string
  created_at: string
}

export function createSnapshot(data: Omit<TrendSnapshot, 'id' | 'created_at'>): TrendSnapshot {
  throw new Error('Not implemented')
}

export function getSnapshotForDate(trendId: number, date: string): TrendSnapshot | undefined {
  return undefined
}

export function upsertSnapshot(data: Omit<TrendSnapshot, 'id' | 'created_at'>): TrendSnapshot {
  throw new Error('Not implemented')
}

export function getTrendSnapshots(trendId: number, limit?: number): TrendSnapshot[] {
  return []
}

export function getLatestSnapshot(trendId: number): TrendSnapshot | undefined {
  return undefined
}

// Tags
export function addTag(trendId: number, tagName: string) {}

export function getTagsForTrend(trendId: number): string[] {
  return []
}

export function getTrendsByTag(tagName: string): Trend[] {
  return []
}

export function getAllTags(): string[] {
  return []
}

// Saved trends
export function saveTrend(userId: number, trendId: number) {}

export function unsaveTrend(userId: number, trendId: number) {}

export function getSavedTrends(userId: number): Trend[] {
  return []
}

export function isTrendSaved(userId: number, trendId: number): boolean {
  return false
}

// Analyze attempts
export interface AnalyzeAttempt {
  id: number
  user_id: number | null
  session_id: string
  attempt_number: number
  analyzed_at: string
}

export function recordAnalyzeAttempt(sessionId: string, userId?: number): AnalyzeAttempt {
  throw new Error('Not implemented')
}

export function getSessionAnalyzeCount(sessionId: string): number {
  return 0
}

export function getUserAnalyzeCount(userId: number): number {
  return 0
}
