'use client'

import { useEffect, useMemo, useState, type MouseEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Check, GitCompare } from 'lucide-react'

const STORAGE_KEY = 'tubefission:videoCompareIds'
const ITEMS_STORAGE_KEY = 'tubefission:videoCompareItems'
const CHANGE_EVENT = 'tubefission:videoCompareChanged'
const MAX_BASKET_VIDEOS = 50

let cachedItemsKey = ''
let cachedItemsSnapshot: VideoCompareItem[] = []

export interface VideoCompareItem {
  id: string
  title?: string
  channelTitle?: string
  thumbnailUrl?: string
  sourceLabel?: string
  addedAt?: string
}

function normalizeIds(value: unknown): string[] {
  if (!Array.isArray(value)) return []

  const ids: string[] = []
  value.forEach((item) => {
    if (typeof item !== 'string') return
    const id = item.trim()
    if (id && !ids.includes(id)) ids.push(id)
  })

  return ids.slice(0, MAX_BASKET_VIDEOS)
}

function normalizeCompareItems(value: unknown): VideoCompareItem[] {
  if (!Array.isArray(value)) return []

  const items: VideoCompareItem[] = []
  value.forEach((item) => {
    const rawId = typeof item === 'string'
      ? item
      : typeof item === 'object' && item !== null && 'id' in item
        ? (item as { id?: unknown }).id
        : ''
    if (typeof rawId !== 'string') return

    const id = rawId.trim()
    if (!id || items.some((existing) => existing.id === id)) return

    const source = typeof item === 'object' && item !== null ? item as Record<string, unknown> : {}
    items.push({
      id,
      title: typeof source.title === 'string' ? source.title : undefined,
      channelTitle: typeof source.channelTitle === 'string' ? source.channelTitle : undefined,
      thumbnailUrl: typeof source.thumbnailUrl === 'string' ? source.thumbnailUrl : undefined,
      sourceLabel: typeof source.sourceLabel === 'string' ? source.sourceLabel : undefined,
      addedAt: typeof source.addedAt === 'string' ? source.addedAt : undefined,
    })
  })

  return items.slice(0, MAX_BASKET_VIDEOS)
}

export function readVideoCompareItems(): VideoCompareItem[] {
  if (typeof window === 'undefined') return []

  try {
    const rawItems = window.localStorage.getItem(ITEMS_STORAGE_KEY) || '[]'
    const rawIds = window.localStorage.getItem(STORAGE_KEY) || '[]'
    const cacheKey = `${rawItems}\n${rawIds}`
    if (cacheKey === cachedItemsKey) return cachedItemsSnapshot

    const storedItems = normalizeCompareItems(JSON.parse(rawItems))
    cachedItemsSnapshot = storedItems.length > 0
      ? storedItems
      : normalizeIds(JSON.parse(rawIds)).map((id) => ({ id }))
    cachedItemsKey = cacheKey
    return cachedItemsSnapshot
  } catch {
    return []
  }
}

export function readVideoCompareIds(): string[] {
  if (typeof window === 'undefined') return []

  try {
    return normalizeIds(JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]'))
  } catch {
    return []
  }
}

export function writeVideoCompareItems(items: VideoCompareItem[]) {
  const nextItems = normalizeCompareItems(items)
  const nextIds = nextItems.map((item) => item.id)
  window.localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(nextItems))
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextIds))
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { ids: nextIds, items: nextItems } }))
}

export function writeVideoCompareIds(ids: string[]) {
  const existingItems = readVideoCompareItems()
  const existingById = new Map(existingItems.map((item) => [item.id, item]))
  const nextItems = normalizeIds(ids).map((id) => existingById.get(id) || { id })
  writeVideoCompareItems(nextItems)
}

export function subscribeVideoCompareIds(onStoreChange: () => void) {
  if (typeof window === 'undefined') return () => {}

  const handleChange = () => onStoreChange()
  window.addEventListener('storage', handleChange)
  window.addEventListener(CHANGE_EVENT, handleChange)

  return () => {
    window.removeEventListener('storage', handleChange)
    window.removeEventListener(CHANGE_EVENT, handleChange)
  }
}

export function getCompareUrl(ids: string[]) {
  const [left, right] = ids
  const params = new URLSearchParams({ type: 'videos' })
  if (left) params.set('left', left)
  if (right) params.set('right', right)
  return `/compare-new?${params.toString()}`
}

interface AddToVideoCompareButtonProps {
  videoId: string
  title?: string
  channelTitle?: string
  thumbnailUrl?: string
  sourceLabel?: string
  className?: string
  compact?: boolean
  fullWidth?: boolean
}

export default function AddToVideoCompareButton({
  videoId,
  title,
  channelTitle,
  thumbnailUrl,
  sourceLabel,
  className = '',
  compact = false,
  fullWidth = false,
}: AddToVideoCompareButtonProps) {
  const router = useRouter()
  const [ids, setIds] = useState<string[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const syncIds = () => {
      setIds(readVideoCompareIds())
      setHydrated(true)
    }

    syncIds()
    window.addEventListener('storage', syncIds)
    window.addEventListener(CHANGE_EVENT, syncIds)

    return () => {
      window.removeEventListener('storage', syncIds)
      window.removeEventListener(CHANGE_EVENT, syncIds)
    }
  }, [])

  const isSelected = ids.includes(videoId)
  const label = useMemo(() => {
    if (!hydrated) return compact ? 'Basket' : 'Add to Basket'
    if (isSelected) return compact ? 'Open Basket' : `Open Basket (${ids.length})`
    return compact ? 'Basket' : `Add to Basket${ids.length > 0 ? ` (${ids.length})` : ''}`
  }, [compact, hydrated, ids.length, isSelected])

  const Icon = isSelected ? Check : ids.length > 0 ? ArrowRight : GitCompare

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()

    const currentItems = readVideoCompareItems()
    const currentIds = currentItems.map((item) => item.id)
    let nextItems = currentIds.includes(videoId)
      ? currentItems
      : [
          ...currentItems,
          {
            id: videoId,
            title,
            channelTitle,
            thumbnailUrl,
            sourceLabel,
            addedAt: new Date().toISOString(),
          },
        ]

    if (nextItems.length > MAX_BASKET_VIDEOS) {
      nextItems = nextItems.slice(nextItems.length - MAX_BASKET_VIDEOS)
    }

    const nextIds = nextItems.map((item) => item.id)
    writeVideoCompareItems(nextItems)
    setIds(nextIds)

    if (currentIds.includes(videoId)) {
      router.push(getCompareUrl(nextIds))
    }
  }

  const selectedClasses = isSelected
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
    : 'border-amber-200 bg-amber-50 text-amber-800 hover:border-amber-300 hover:bg-amber-100'

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isSelected ? `Open comparison basket with video ${videoId}` : `Add video ${videoId} to comparison basket`}
      className={[
        'inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border font-semibold transition',
        compact ? 'px-2.5 py-2 text-xs' : 'px-3 py-2 text-sm',
        fullWidth ? 'w-full' : '',
        selectedClasses,
        className,
      ].filter(Boolean).join(' ')}
    >
      <Icon className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} aria-hidden="true" />
      <span className="truncate">{label}</span>
    </button>
  )
}
