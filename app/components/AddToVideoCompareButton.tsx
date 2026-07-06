'use client'

import { useEffect, useMemo, useState, type MouseEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Check, GitCompare } from 'lucide-react'

const STORAGE_KEY = 'tubefission:videoCompareIds'
const CHANGE_EVENT = 'tubefission:videoCompareChanged'
const MAX_BASKET_VIDEOS = 50

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

export function readVideoCompareIds(): string[] {
  if (typeof window === 'undefined') return []

  try {
    return normalizeIds(JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]'))
  } catch {
    return []
  }
}

export function writeVideoCompareIds(ids: string[]) {
  const nextIds = normalizeIds(ids)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextIds))
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: nextIds }))
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
  className?: string
  compact?: boolean
  fullWidth?: boolean
}

export default function AddToVideoCompareButton({
  videoId,
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
    if (isSelected) return compact ? 'Open' : `Open Basket (${ids.length})`
    return compact ? 'Basket' : `Add to Basket${ids.length > 0 ? ` (${ids.length})` : ''}`
  }, [compact, hydrated, ids.length, isSelected])

  const Icon = isSelected ? Check : ids.length > 0 ? ArrowRight : GitCompare

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()

    const currentIds = readVideoCompareIds()
    let nextIds = currentIds.includes(videoId)
      ? currentIds
      : [...currentIds, videoId]

    if (nextIds.length > MAX_BASKET_VIDEOS) {
      nextIds = nextIds.slice(nextIds.length - MAX_BASKET_VIDEOS)
    }

    writeVideoCompareIds(nextIds)
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
