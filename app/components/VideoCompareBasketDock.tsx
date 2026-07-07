'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useMemo, useSyncExternalStore } from 'react'
import { GitCompare, ShoppingBasket, X } from 'lucide-react'
import {
  getCompareUrl,
  isVideoCompareBasketAvailable,
  readVideoCompareItems,
  subscribeVideoCompareIds,
  writeVideoCompareItems,
} from './AddToVideoCompareButton'

export default function VideoCompareBasketDock() {
  const pathname = usePathname()
  const router = useRouter()
  const items = useSyncExternalStore(subscribeVideoCompareIds, readVideoCompareItems, () => [])
  const ids = useMemo(() => items.map((item) => item.id), [items])
  const isAvailable = isVideoCompareBasketAvailable()

  if (pathname?.startsWith('/compare-new')) return null

  const handleLoginClick = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('tubefission:postLoginRedirect', `${window.location.pathname}${window.location.search}${window.location.hash}`)
    }
    router.push('/login')
  }

  if (!isAvailable) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-md sm:left-auto sm:right-5 sm:mx-0">
        <div className="rounded-2xl border border-amber-200 bg-white p-3 shadow-2xl shadow-gray-900/15">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <ShoppingBasket className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-sm font-black text-gray-950">
                Analysis Basket
                <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                  Login
                </span>
              </div>
              <p className="mt-1 text-xs leading-5 text-gray-600">
                Sign in to save videos to your account basket and reuse them in Compare.
              </p>

              <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                <button
                  type="button"
                  onClick={handleLoginClick}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-950 px-3 py-2 text-xs font-bold text-white hover:bg-gray-800"
                >
                  <GitCompare className="h-4 w-4" />
                  Sign in to use Basket
                </button>
                <Link
                  href="/trends"
                  className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Browse
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) return null

  const compareHref = getCompareUrl(ids)
  const readyToCompare = items.length >= 2

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-md sm:left-auto sm:right-5 sm:mx-0">
      <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-2xl shadow-gray-900/15">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
            <ShoppingBasket className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-black text-gray-950">
                Analysis Basket
                <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-600">
                  {items.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => writeVideoCompareItems([])}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Clear analysis basket"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-1 space-y-0.5">
              {items.slice(0, 2).map((item) => (
                <div key={item.id} className="truncate text-xs text-gray-600">
                  {item.title || item.id}
                </div>
              ))}
              {items.length > 2 && (
                <div className="text-xs font-medium text-gray-500">+{items.length - 2} more candidates</div>
              )}
            </div>

            <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
              <Link
                href={compareHref}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-950 px-3 py-2 text-xs font-bold text-white hover:bg-gray-800"
              >
                <GitCompare className="h-4 w-4" />
                {readyToCompare ? 'Open Compare' : 'Pick second video'}
              </Link>
              <Link
                href="/trends"
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Add more
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
