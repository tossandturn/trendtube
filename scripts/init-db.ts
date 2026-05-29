import { getDb, upsertTrend, addTag, upsertSnapshot } from '../lib/db'
import { mkdirSync } from 'fs'
import { join } from 'path'

const DATA_DIR = join(process.cwd(), 'data')

try {
  mkdirSync(DATA_DIR, { recursive: true })
} catch {
  // exists
}

const db = getDb()

const SEED_TRENDS = [
  { slug: 'ai-shorts', title: 'AI Shorts Trends 2026', category: 'Technology', description: 'Discover viral AI-powered Shorts trends. From ChatGPT tutorials to AI-generated content, learn how creators are leveraging AI to grow fast.', tags: ['ai', 'shorts', 'chatgpt', 'technology', 'automation'] },
  { slug: 'gaming-youtube', title: 'Gaming YouTube Trends 2026', category: 'Gaming', description: 'Track the latest gaming trends on YouTube. From Minecraft builds to GTA updates, discover what gamers are watching right now.', tags: ['gaming', 'minecraft', 'gta', 'fortnite', 'esports'] },
  { slug: 'mrbeast-style', title: 'MrBeast-Style Video Trends 2026', category: 'Entertainment', description: 'Analyze high-production challenge videos. Learn the psychology behind viral challenges and extreme content formats.', tags: ['challenge', 'entertainment', 'viral', 'high-production', 'collaboration'] },
  { slug: 'youtube-automation', title: 'YouTube Automation Trends 2026', category: 'Business', description: 'Faceless channel strategies and automation workflows. Build scalable YouTube businesses without showing your face.', tags: ['automation', 'business', 'faceless', 'passive-income', 'outsourcing'] },
  { slug: 'viral-music', title: 'Viral Music Trends 2026', category: 'Music', description: 'Track viral music trends, song covers, and music reaction content dominating YouTube right now.', tags: ['music', 'viral', 'covers', 'reactions', 'songs'] },
  { slug: 'youtube-shorts', title: 'YouTube Shorts Trends 2026', category: 'Short-Form', description: 'Short-form content trends and viral Shorts strategies for maximum reach and engagement.', tags: ['shorts', 'viral', 'short-form', 'quick-content', 'algorithm'] },
  { slug: 'coding-tutorials', title: 'Coding Tutorial Trends 2026', category: 'Education', description: 'Programming and coding tutorial trends. From Python to web development, track what learners are searching for.', tags: ['coding', 'programming', 'python', 'webdev', 'education'] },
  { slug: 'crypto-finance', title: 'Crypto & Finance Trends 2026', category: 'Finance', description: 'Cryptocurrency, trading, and personal finance content trends on YouTube.', tags: ['crypto', 'finance', 'trading', 'bitcoin', 'investing'] },
  { slug: 'food-cooking', title: 'Food & Cooking Trends 2026', category: 'Food', description: 'Culinary trends, recipe Shorts, and food review content capturing viewer attention.', tags: ['food', 'cooking', 'recipes', 'mukbang', 'reviews'] },
  { slug: 'fitness-health', title: 'Fitness & Health Trends 2026', category: 'Health', description: 'Workout routines, health tips, and fitness transformation content trending on YouTube.', tags: ['fitness', 'health', 'workout', 'gym', 'transformation'] },
]

console.log('🌱 Seeding database...')

for (const t of SEED_TRENDS) {
  const trend = upsertTrend(t.slug, t.title, t.category, t.description)
  for (const tag of t.tags) {
    addTag(trend.id, tag)
  }
  // Create a dummy snapshot for today so pages have data
  const today = new Date().toISOString().split('T')[0]
  upsertSnapshot({
    trend_id: trend.id,
    velocity: Math.floor(Math.random() * 500000) + 50000,
    views: Math.floor(Math.random() * 10000000) + 1000000,
    likes: Math.floor(Math.random() * 500000) + 50000,
    comments: Math.floor(Math.random() * 50000) + 5000,
    creator_count: Math.floor(Math.random() * 500) + 50,
    saturation_score: Math.random() * 100,
    breakout_score: Math.random() * 100,
    predicted_peak_hours: Math.floor(Math.random() * 72) + 1,
    snapshot_date: today,
  })
  console.log(`  ✓ ${t.slug}`)
}

console.log('✅ Database seeded successfully')
