'use client'

import { useRouter } from 'next/navigation'
import { REGIONS, REGION_META, type Region } from '@/lib/region'

interface RegionSelectorBarProps {
  currentRegion: string
}

export default function RegionSelectorBar({ currentRegion }: RegionSelectorBarProps) {
  const router = useRouter()

  const switchRegion = async (newRegion: string) => {
    document.cookie = `region=${newRegion}; path=/; max-age=31536000`
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {REGIONS.map((r) => {
        const meta = REGION_META[r]
        const isActive = r === currentRegion
        return (
          <button
            key={r}
            onClick={() => switchRegion(r)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              isActive
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span className="mr-1">{meta.flag}</span>
            {r}
          </button>
        )
      })}
    </div>
  )
}
