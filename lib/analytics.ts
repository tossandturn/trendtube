/* =========================================================
   ANALYTICS UTILITIES — 100% real data calculations
========================================================= */

export interface Video {
  id: string
  snippet?: {
    title: string
    channelTitle: string
    publishedAt?: string
    thumbnails?: { high?: { url: string }; medium?: { url: string } }
  }
  statistics?: {
    viewCount?: string
    likeCount?: string
    commentCount?: string
  }
}

export function getTagColor(tag: string): string {
  const colors: Record<string, string> = {
    AI: '#3b82f6',
    Shorts: '#ef4444',
    Gaming: '#8b5cf6',
    Coding: '#10b981',
    Crypto: '#f59e0b',
    Business: '#ec4899',
    Football: '#06b6d4',
    Anime: '#f97316',
    Music: '#a855f7',
    'MrBeast Style': '#eab308',
    Trending: '#6366f1',
  }
  return colors[tag] || '#6366f1'
}

export function getTagEmoji(tag: string): string {
  const map: Record<string, string> = {
    AI: '🤖',
    Shorts: '📱',
    Gaming: '🎮',
    Coding: '💻',
    Crypto: '₿',
    Business: '💼',
    Football: '⚽',
    Anime: '⛩️',
    Music: '🎵',
    'MrBeast Style': '💰',
    Trending: '🔥',
  }
  return map[tag] || '📊'
}

/* Days since upload */
export function getVideoAgeDays(video: Video): number {
  const published = video.snippet?.publishedAt
  if (!published) return 1
  const days = (Date.now() - new Date(published).getTime()) / (1000 * 60 * 60 * 24)
  return Math.max(0.1, days)
}

/* Views per day */
export function getViewVelocity(video: Video): number {
  const views = Number(video.statistics?.viewCount || 0)
  const age = getVideoAgeDays(video)
  return views / age
}

/* Engagement rate: (likes + comments*2) / views * 100 */
export function getEngagementRate(video: Video): number {
  const views = Number(video.statistics?.viewCount || 0)
  const likes = Number(video.statistics?.likeCount || 0)
  const comments = Number(video.statistics?.commentCount || 0)
  if (views === 0) return 0
  return ((likes + comments * 2) / views) * 100
}

/* Like ratio: likes / views * 1000 (per mille) */
export function getLikeRatio(video: Video): number {
  const views = Number(video.statistics?.viewCount || 0)
  const likes = Number(video.statistics?.likeCount || 0)
  if (views === 0) return 0
  return (likes / views) * 1000
}

/* Comment ratio: comments / views * 1000 */
export function getCommentRatio(video: Video): number {
  const views = Number(video.statistics?.viewCount || 0)
  const comments = Number(video.statistics?.commentCount || 0)
  if (views === 0) return 0
  return (comments / views) * 1000
}

/* Comment-to-like ratio */
export function getCommentToLikeRatio(video: Video): number {
  const likes = Number(video.statistics?.likeCount || 0)
  const comments = Number(video.statistics?.commentCount || 0)
  if (likes === 0) return 0
  return (comments / likes) * 100
}

/* Format large numbers */
export function fmt(n: number): string {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return Math.round(n).toLocaleString()
}

/* Parse history data */
export interface HistoryEntry {
  date: string
  timestamp: string
  region: string
  videos: {
    id: string
    title: string
    channelTitle: string
    views: number
    likes: number
    comments: number
    publishedAt: string
  }[]
}

import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

export function loadHistory(): HistoryEntry[] {
  try {
    const path = join(process.cwd(), 'public', 'data', 'history.json')
    if (!existsSync(path)) return []
    const raw = readFileSync(path, 'utf-8')
    return JSON.parse(raw) || []
  } catch {
    return []
  }
}
