export default function TrendingLoading() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="h-5 w-36 bg-gray-100 rounded mb-8 animate-pulse" />

        <div className="mb-10">
          <div className="h-4 w-40 bg-gray-100 rounded mb-4 animate-pulse" />
          <div className="h-10 sm:h-14 w-full max-w-3xl bg-gray-100 rounded mb-4 animate-pulse" />
          <div className="h-4 w-full max-w-2xl bg-gray-100 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
              <div className="h-3 w-24 bg-gray-100 rounded mb-3 animate-pulse" />
              <div className="h-8 w-20 bg-gray-100 rounded mb-2 animate-pulse" />
              <div className="h-3 w-28 bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              <div className="aspect-video bg-gray-100 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-12 bg-gray-50 rounded-lg animate-pulse" />
                  <div className="h-12 bg-gray-50 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
