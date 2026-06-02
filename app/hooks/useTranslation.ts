'use client'

import { useState, useEffect } from 'react'
import { Region, REGIONS } from '@/lib/region'
import { getTranslation, TranslationKey } from '@/lib/translations'

export function useTranslation() {
  const [region, setRegion] = useState<Region>('US')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Get region from cookie
    const getRegion = () => {
      const match = document.cookie.match(/region=([^;]+)/)
      return (match?.[1] as Region) || 'US'
    }

    const currentRegion = getRegion()
    if (REGIONS.includes(currentRegion as Region)) {
      setRegion(currentRegion as Region)
    }
    setIsLoaded(true)
  }, [])

  const t = (key: TranslationKey): string => {
    return getTranslation(region, key)
  }

  const isChinese = region === 'HK' || region === 'TW'

  return { t, region, isChinese, isLoaded }
}

// Simple hook for client components
export function useLocale() {
  const [region, setRegion] = useState<Region>('US')

  useEffect(() => {
    const getRegion = () => {
      const match = document.cookie.match(/region=([^;]+)/)
      return (match?.[1] as Region) || 'US'
    }

    const currentRegion = getRegion()
    if (REGIONS.includes(currentRegion as Region)) {
      setRegion(currentRegion as Region)
    }
  }, [])

  return {
    region,
    isChinese: region === 'HK' || region === 'TW',
    lang: region === 'HK' || region === 'TW' ? 'zh' : 'en',
  }
}
