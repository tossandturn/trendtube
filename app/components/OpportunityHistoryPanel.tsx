'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { BookmarkPlus, Check, Clock, Trash2 } from 'lucide-react'
import {
  addOpportunitySamplesToCompareBasket,
  getOpportunityBriefHref,
  getOpportunityCompareHref,
  getOpportunityResearchHref,
  getOpportunitySampleIds,
  type OpportunityHistoryItem,
} from '@/app/components/opportunityActions'

const STORAGE_KEY = 'tubefission:opportunityHistory'
const MAX_HISTORY_ITEMS = 12

interface OpportunityHistoryPanelProps {
  current?: OpportunityHistoryItem
}

function readItems(): OpportunityHistoryItem[] {
  if (typeof window === 'undefined') return []
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeItems(items: OpportunityHistoryItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_HISTORY_ITEMS)))
}

export default function OpportunityHistoryPanel({ current }: OpportunityHistoryPanelProps) {
  const [items, setItems] = useState<OpportunityHistoryItem[]>(readItems)

  const isSaved = useMemo(() => {
    if (!current) return false
    return items.some((item) => item.id === current.id)
  }, [current, items])

  function saveCurrent() {
    if (!current) return
    const next = [
      { ...current, savedAt: new Date().toISOString() },
      ...items.filter((item) => item.id !== current.id),
    ].slice(0, MAX_HISTORY_ITEMS)
    setItems(next)
    writeItems(next)
  }

  function removeItem(id: string) {
    const next = items.filter((item) => item.id !== id)
    setItems(next)
    writeItems(next)
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-red-600">Opportunity project history</div>
          <h2 className="mt-1 text-lg font-black text-gray-900">Save the opportunity, continue the loop</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            Keep promising niches in a local opportunity pool so the product becomes a repeat workflow instead of a one-off lookup.
          </p>
        </div>
        {current && (
          <button
            type="button"
            onClick={saveCurrent}
            className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
              isSaved ? 'bg-emerald-50 text-emerald-700' : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {isSaved ? <Check className="h-4 w-4" /> : <BookmarkPlus className="h-4 w-4" />}
            {isSaved ? 'Saved' : 'Save opportunity'}
          </button>
        )}
      </div>

      <div className="mt-5">
        {items.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2">
            {items.slice(0, 4).map((item) => {
              const sampleIds = getOpportunitySampleIds(item)
              const hasCompareSamples = sampleIds.length >= 2

              return (
                <div key={item.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{item.niche}</h3>
                      {item.query && <p className="mt-1 text-xs text-gray-500">{item.query}</p>}
                      <p className="mt-1 text-xs text-gray-500">{item.verdict}</p>
                    </div>
                    <div className="shrink-0 rounded-lg bg-white px-2.5 py-1 text-center">
                      <div className="text-sm font-black text-gray-900">{item.score}</div>
                      <div className="text-[10px] font-bold text-gray-500">{item.grade}</div>
                    </div>
                  </div>
                  <p className="line-clamp-2 text-xs leading-relaxed text-gray-500">{item.recommendation}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link href={getOpportunityResearchHref(item)} className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white">
                      Research
                    </Link>
                    <Link
                      href={hasCompareSamples ? getOpportunityCompareHref(item) : getOpportunityResearchHref(item)}
                      onClick={() => addOpportunitySamplesToCompareBasket(item)}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700"
                    >
                      {hasCompareSamples ? 'Compare' : 'Find samples'}
                    </Link>
                    <Link href={getOpportunityBriefHref(item)} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700">
                      Brief
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-white hover:text-red-600"
                      aria-label={`Remove ${item.niche}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-5 text-sm text-gray-500">
            <div className="mb-2 flex items-center gap-2 font-bold text-gray-700">
              <Clock className="h-4 w-4" />
              No saved opportunities yet
            </div>
            Save the recommended niche first, then come back here to continue analysis, comparison, and planning.
          </div>
        )}
      </div>
    </section>
  )
}
