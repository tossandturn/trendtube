'use client'

import { Suspense } from 'react'
import CompareNewContent from './CompareNewContent'

export default function CompareNewPage() {
  return (
    <Suspense fallback={<CompareNewLoading />}>
      <CompareNewContent />
    </Suspense>
  )
}

function CompareNewLoading() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-gray-500">← Back</span>
              <h1 className="text-xl font-bold text-gray-900">Compare Tool</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 animate-pulse">
          <div className="h-8 bg-gray-100 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto mb-8"></div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-16 bg-gray-100 rounded-xl"></div>
            <div className="h-16 bg-gray-100 rounded-xl"></div>
          </div>
        </div>
      </div>
    </main>
  )
}
