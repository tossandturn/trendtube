import {
  getCompareUrl,
  isVideoCompareBasketAvailable,
  readVideoCompareItems,
  writeVideoCompareItems,
  type VideoCompareItem,
} from '@/app/components/AddToVideoCompareButton'
import { getCreatorBriefHref } from '@/lib/creator-brief-links'

export type OpportunityVideoSample = VideoCompareItem

export interface OpportunityHistoryItem {
  id: string
  niche: string
  query?: string
  score: number
  grade: string
  verdict: string
  recommendation: string
  href: string
  compareHref: string
  researchHref?: string
  briefHref?: string
  sampleVideos?: OpportunityVideoSample[]
  savedAt?: string
}

function encodeTopic(value: string) {
  return encodeURIComponent(value.trim())
}

export function getOpportunityTopic(item: OpportunityHistoryItem) {
  return item.query || item.niche
}

export function getOpportunityResearchHref(item: OpportunityHistoryItem) {
  if (item.researchHref) return item.researchHref
  if (item.query) return `/low-competition-keywords?focus=${encodeTopic(item.query)}#opportunities`
  return item.href || '/low-competition-keywords'
}

export function getOpportunityBriefHref(item: OpportunityHistoryItem) {
  if (item.briefHref) return item.briefHref

  return getCreatorBriefHref({
    topic: getOpportunityTopic(item),
    type: 'script',
    source: 'workspace',
    niche: item.niche,
    angle: item.recommendation,
  })
}

export function getOpportunitySampleIds(item: OpportunityHistoryItem) {
  const ids = (item.sampleVideos || [])
    .map((video) => video.id)
    .filter((id): id is string => Boolean(id))

  return Array.from(new Set(ids))
}

export function getOpportunityCompareHref(item: OpportunityHistoryItem) {
  const sampleIds = getOpportunitySampleIds(item)
  if (sampleIds.length >= 2) return getCompareUrl(sampleIds)
  if (item.compareHref) return item.compareHref
  return '/compare-new?type=videos'
}

export function addOpportunitySamplesToCompareBasket(item: OpportunityHistoryItem) {
  if (typeof window === 'undefined' || !item.sampleVideos?.length) return
  if (!isVideoCompareBasketAvailable()) {
    window.localStorage.setItem('tubefission:postLoginRedirect', `${window.location.pathname}${window.location.search}${window.location.hash}`)
    window.location.href = '/login'
    return
  }

  const currentItems = readVideoCompareItems()
  const currentIds = new Set(currentItems.map((video) => video.id))
  const nextItems = [...currentItems]

  item.sampleVideos.forEach((video) => {
    if (!video.id || currentIds.has(video.id)) return
    currentIds.add(video.id)
    nextItems.push({
      ...video,
      sourceLabel: video.sourceLabel || item.niche,
      addedAt: video.addedAt || new Date().toISOString(),
    })
  })

  writeVideoCompareItems(nextItems)
}
