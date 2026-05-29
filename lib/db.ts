import Database from 'better-sqlite3'
import { join } from 'path'

const IS_VERCEL = !!process.env.VERCEL
const DB_PATH = IS_VERCEL ? ':memory:' : (process.env.DATABASE_URL || join(process.cwd(), 'data', 'tubefission.db'))

let db: Database.Database | null = null
let seeded = false

export function getDb(): Database.Database {
  if (db) return db
  db = new Database(DB_PATH)
  if (!IS_VERCEL) db.pragma('journal_mode = WAL')
  initSchema(db)
  return db
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS trends (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      category TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS trend_snapshots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      trend_id INTEGER NOT NULL,
      velocity INTEGER,
      views INTEGER,
      likes INTEGER,
      comments INTEGER,
      creator_count INTEGER,
      saturation_score REAL,
      breakout_score REAL,
      predicted_peak_hours INTEGER,
      snapshot_date DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (trend_id) REFERENCES trends(id)
    );

    CREATE INDEX IF NOT EXISTS idx_trend_date ON trend_snapshots(trend_id, snapshot_date);

    CREATE TABLE IF NOT EXISTS trend_tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      trend_id INTEGER NOT NULL,
      tag_name TEXT,
      FOREIGN KEY (trend_id) REFERENCES trends(id)
    );

    CREATE INDEX IF NOT EXISTS idx_tag ON trend_tags(tag_name);

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    );

    CREATE TABLE IF NOT EXISTS saved_trends (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      trend_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, trend_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (trend_id) REFERENCES trends(id)
    );
  `)
}

/* =========================================================
   TRENDS
========================================================= */

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
  const db = getDb()
  const stmt = db.prepare(
    'INSERT INTO trends (slug, title, category, description) VALUES (?, ?, ?, ?) RETURNING *'
  )
  return stmt.get(slug, title, category || null, description || null) as Trend
}

export function getTrendBySlug(slug: string): Trend | undefined {
  const db = getDb()
  return db.prepare('SELECT * FROM trends WHERE slug = ?').get(slug) as Trend | undefined
}

export function getAllTrends(): Trend[] {
  const db = getDb()
  return db.prepare('SELECT * FROM trends ORDER BY updated_at DESC').all() as Trend[]
}

export function getTrendsByCategory(category: string): Trend[] {
  const db = getDb()
  return db.prepare('SELECT * FROM trends WHERE category = ? ORDER BY updated_at DESC').all(category) as Trend[]
}

export function upsertTrend(slug: string, title: string, category?: string, description?: string): Trend {
  const existing = getTrendBySlug(slug)
  if (existing) {
    const db = getDb()
    db.prepare('UPDATE trends SET title = ?, category = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(title, category || existing.category, description || existing.description, existing.id)
    return getTrendBySlug(slug)!
  }
  return createTrend(slug, title, category, description)
}

/* =========================================================
   TREND SNAPSHOTS
========================================================= */

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
  const db = getDb()
  const stmt = db.prepare(
    `INSERT INTO trend_snapshots
     (trend_id, velocity, views, likes, comments, creator_count, saturation_score, breakout_score, predicted_peak_hours, snapshot_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`
  )
  return stmt.get(
    data.trend_id, data.velocity, data.views, data.likes, data.comments,
    data.creator_count, data.saturation_score, data.breakout_score, data.predicted_peak_hours, data.snapshot_date
  ) as TrendSnapshot
}

export function getSnapshotForDate(trendId: number, date: string): TrendSnapshot | undefined {
  const db = getDb()
  return db.prepare('SELECT * FROM trend_snapshots WHERE trend_id = ? AND snapshot_date = ?').get(trendId, date) as TrendSnapshot | undefined
}

export function upsertSnapshot(data: Omit<TrendSnapshot, 'id' | 'created_at'>): TrendSnapshot {
  const existing = getSnapshotForDate(data.trend_id, data.snapshot_date)
  if (existing) {
    const db = getDb()
    db.prepare(
      `UPDATE trend_snapshots SET
       velocity = ?, views = ?, likes = ?, comments = ?, creator_count = ?,
       saturation_score = ?, breakout_score = ?, predicted_peak_hours = ?
       WHERE id = ?`
    ).run(
      data.velocity, data.views, data.likes, data.comments, data.creator_count,
      data.saturation_score, data.breakout_score, data.predicted_peak_hours, existing.id
    )
    return getSnapshotForDate(data.trend_id, data.snapshot_date)!
  }
  return createSnapshot(data)
}

export function getTrendSnapshots(trendId: number, limit = 365): TrendSnapshot[] {
  const db = getDb()
  return db.prepare(
    'SELECT * FROM trend_snapshots WHERE trend_id = ? ORDER BY snapshot_date DESC LIMIT ?'
  ).all(trendId, limit) as TrendSnapshot[]
}

export function getLatestSnapshot(trendId: number): TrendSnapshot | undefined {
  const db = getDb()
  return db.prepare(
    'SELECT * FROM trend_snapshots WHERE trend_id = ? ORDER BY snapshot_date DESC LIMIT 1'
  ).get(trendId) as TrendSnapshot | undefined
}

/* =========================================================
   TREND TAGS
========================================================= */

export function addTag(trendId: number, tagName: string) {
  const db = getDb()
  db.prepare('INSERT OR IGNORE INTO trend_tags (trend_id, tag_name) VALUES (?, ?)').run(trendId, tagName)
}

export function getTagsForTrend(trendId: number): string[] {
  const db = getDb()
  const rows = db.prepare('SELECT tag_name FROM trend_tags WHERE trend_id = ?').all(trendId) as { tag_name: string }[]
  return rows.map(r => r.tag_name)
}

export function getTrendsByTag(tagName: string): Trend[] {
  const db = getDb()
  return db.prepare(
    `SELECT t.* FROM trends t
     JOIN trend_tags tt ON t.id = tt.trend_id
     WHERE tt.tag_name = ? ORDER BY t.updated_at DESC`
  ).all(tagName) as Trend[]
}

export function getAllTags(): string[] {
  const db = getDb()
  const rows = db.prepare('SELECT DISTINCT tag_name FROM trend_tags ORDER BY tag_name').all() as { tag_name: string }[]
  return rows.map(r => r.tag_name)
}

/* =========================================================
   USERS
========================================================= */

export interface User {
  id: number
  email: string
  password_hash: string
  created_at: string
  last_login: string | null
}

export function createUser(email: string, passwordHash: string): User {
  const db = getDb()
  const stmt = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?) RETURNING *')
  return stmt.get(email, passwordHash) as User
}

export function getUserByEmail(email: string): User | undefined {
  const db = getDb()
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined
}

export function updateLastLogin(userId: number) {
  const db = getDb()
  db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(userId)
}

/* =========================================================
   SAVED TRENDS
========================================================= */

export function saveTrend(userId: number, trendId: number) {
  const db = getDb()
  db.prepare('INSERT OR IGNORE INTO saved_trends (user_id, trend_id) VALUES (?, ?)').run(userId, trendId)
}

export function unsaveTrend(userId: number, trendId: number) {
  const db = getDb()
  db.prepare('DELETE FROM saved_trends WHERE user_id = ? AND trend_id = ?').run(userId, trendId)
}

export function getSavedTrends(userId: number): Trend[] {
  const db = getDb()
  return db.prepare(
    `SELECT t.* FROM trends t
     JOIN saved_trends st ON t.id = st.trend_id
     WHERE st.user_id = ? ORDER BY st.created_at DESC`
  ).all(userId) as Trend[]
}

export function isTrendSaved(userId: number, trendId: number): boolean {
  const db = getDb()
  const row = db.prepare('SELECT 1 FROM saved_trends WHERE user_id = ? AND trend_id = ?').get(userId, trendId)
  return !!row
}
