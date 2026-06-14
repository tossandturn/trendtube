import { Metadata } from 'next'
import Link from 'next/link'
import { getRegion } from '@/lib/region-server'
import { fetchTrendingVideos } from '@/lib/api-client'
import { getViewVelocity, getEngagementRate } from '@/lib/analytics'

export const metadata: Metadata = {
  title: 'YouTube Gaming Trends | TubeFission',
  description: 'Discover trending gaming content across Minecraft, GTA, Fortnite, Valorant and more. Real-time analytics for YouTube gaming creators.',
}

// Gaming categories with their configurations
const GAMING_CATEGORIES = [
  {
    id: 'minecraft',
    name: 'Minecraft',
    icon: '🟫',
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    description: 'Building, survival, redstone, and creative content',
    keywords: ['minecraft', 'mc', 'survival', 'building', 'redstone'],
    subCategories: ['Survival', 'Creative', 'PvP', 'Skyblock', 'Modded'],
  },
  {
    id: 'gta',
    name: 'GTA V',
    icon: '🚗',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description: 'Roleplay, missions, mods, and online gameplay',
    keywords: ['gta', 'gta 5', 'grand theft auto', 'gta online', 'gta rp'],
    subCategories: ['Roleplay', 'Missions', 'Races', 'Mods', 'Money Guide'],
  },
  {
    id: 'fortnite',
    name: 'Fortnite',
    icon: '🔫',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    description: 'Battle royale, creative mode, and competitive',
    keywords: ['fortnite', 'battle royale', 'v-bucks', 'chapter'],
    subCategories: ['Battle Royale', 'Zero Build', 'Creative', 'Ranked', 'Item Shop'],
  },
  {
    id: 'valorant',
    name: 'Valorant',
    icon: '🎯',
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    description: 'Tactical FPS, agents, and competitive ranking',
    keywords: ['valorant', 'tactical', 'agents', 'rank', 'clutch'],
    subCategories: ['Competitive', 'Unrated', 'Spike Rush', 'Customs', 'Skin Showcase'],
  },
  {
    id: 'roblox',
    name: 'Roblox',
    icon: '🔲',
    color: 'from-gray-500 to-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    description: 'Game creation, popular games, and roleplay',
    keywords: ['roblox', 'obby', 'simulator', 'tycoon'],
    subCategories: ['Adventure', 'Simulator', 'Horror', 'Roleplay', 'Tycoon'],
  },
  {
    id: 'cod',
    name: 'Call of Duty',
    icon: '💀',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    description: 'Warzone, multiplayer, and campaign content',
    keywords: ['call of duty', 'cod', 'warzone', 'mw3', 'cold war'],
    subCategories: ['Warzone', 'Multiplayer', 'DMZ', 'Ranked', 'Loadouts'],
  },
  {
    id: 'mobile-gaming',
    name: 'Mobile Gaming',
    icon: '📱',
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    description: 'Mobile esports, tutorials, and game reviews',
    keywords: ['mobile', 'android', 'ios', 'mobile legends', 'pubg mobile'],
    subCategories: ['PUBG Mobile', 'Mobile Legends', 'Genshin Impact', 'CoD Mobile', 'Free Fire'],
  },
  {
    id: 'indie-games',
    name: 'Indie Games',
    icon: '🎮',
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    description: 'Rising indie titles and hidden gems',
    keywords: ['indie', 'indie game', 'early access', 'demo'],
    subCategories: ['Early Access', 'Game Jam', 'Pixel Art', 'Roguelike', 'Simulation'],
  },
]

function formatNumber(n: string | number | undefined): string {
  const num = typeof n === 'string' ? Number(n) : n || 0
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B'
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M'
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K'
  return Math.round(num).toLocaleString()
}

function getThumbnailUrl(video: any): string {
  return video.snippet?.thumbnails?.high?.url ||
    video.snippet?.thumbnails?.medium?.url ||
    video.snippet?.thumbnails?.default?.url ||
    `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`
}

export default async function GamingTrendsPage() {
  const region = await getRegion()
  const videos = await fetchTrendingVideos(region, 50)

  // Organize videos by gaming category
  const categoryVideos: Record<string, any[]> = {}
  GAMING_CATEGORIES.forEach(cat => {
    categoryVideos[cat.id] = videos.filter((v: any) => {
      const text = `${v.snippet?.title || ''} ${v.snippet?.description || ''}`.toLowerCase()
      return cat.keywords.some(k => text.includes(k.toLowerCase()))
    }).slice(0, 6)
  })

  // Find trending gaming videos overall
  const gamingVideos = videos.filter((v: any) => {
    const text = `${v.snippet?.title || ''} ${v.snippet?.description || ''}`.toLowerCase()
    return GAMING_CATEGORIES.some(cat =>
      cat.keywords.some(k => text.includes(k.toLowerCase()))
    ) || ['gaming', 'gameplay', 'walkthrough', 'speedrun', 'esports'].some(k => text.includes(k))
  })

  const topGamingVideo = gamingVideos[0]
  const totalGamingViews = gamingVideos.reduce((sum: number, v: any) =>
    sum + Number(v.statistics?.viewCount || 0), 0)

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section - Mobile Optimized */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <span>→</span>
            <Link href="/trends" className="hover:text-white transition">Trends</Link>
            <span>→</span>
            <span className="text-white">Gaming</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600/20 border border-red-500/30 rounded-full text-red-400 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                Live Gaming Trends
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-6 leading-tight">
                YouTube Gaming
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                  Trend Intelligence
                </span>
              </h1>
              <p className="text-gray-400 text-sm sm:text-base lg:text-lg mb-6 max-w-xl">
                Real-time analytics across Minecraft, GTA, Fortnite, Valorant and more.
                Discover what's trending in {region} gaming content right now.
              </p>

              {/* Quick Stats - Mobile: Stack Vertically */}
              <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-3 sm:gap-6">
                <div className="flex items-center gap-2 sm:gap-3 bg-gray-800/50 rounded-xl p-2 sm:p-0 sm:bg-transparent">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-700 sm:bg-gray-800 rounded-lg sm:rounded-xl flex items-center justify-center text-lg sm:text-2xl">
                    🎮
                  </div>
                  <div>
                    <div className="text-lg sm:text-2xl font-bold">{gamingVideos.length}</div>
                    <div className="text-gray-500 text-xs sm:text-sm">Videos</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 bg-gray-800/50 rounded-xl p-2 sm:p-0 sm:bg-transparent">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-700 sm:bg-gray-800 rounded-lg sm:rounded-xl flex items-center justify-center text-lg sm:text-2xl">
                    👁️
                  </div>
                  <div>
                    <div className="text-lg sm:text-2xl font-bold">{formatNumber(totalGamingViews)}</div>
                    <div className="text-gray-500 text-xs sm:text-sm">Views</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 bg-gray-800/50 rounded-xl p-2 sm:p-0 sm:bg-transparent">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-700 sm:bg-gray-800 rounded-lg sm:rounded-xl flex items-center justify-center text-lg sm:text-2xl">
                    🏆
                  </div>
                  <div>
                    <div className="text-lg sm:text-2xl font-bold">{GAMING_CATEGORIES.length}</div>
                    <div className="text-gray-500 text-xs sm:text-sm">Categories</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Top Video - Mobile Optimized */}
            {topGamingVideo && (
              <Link
                href={`/video/${topGamingVideo.id}`}
                className="group relative block rounded-xl sm:rounded-2xl overflow-hidden border border-gray-700 hover:border-red-500 transition-all"
              >
                <div className="aspect-video relative">
                  <img
                    src={getThumbnailUrl(topGamingVideo)}
                    alt={topGamingVideo.snippet?.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                  <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1">
                    <span>👑</span>
                    <span className="hidden sm:inline">#1 Gaming Video</span>
                    <span className="sm:hidden">#1</span>
                  </div>
                  <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4">
                    <h3 className="text-sm sm:text-base lg:text-xl font-bold mb-1 sm:mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                      {topGamingVideo.snippet?.title}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm mb-2 truncate">
                      {topGamingVideo.snippet?.channelTitle}
                    </p>
                    <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                      <span className="text-gray-300">
                        {formatNumber(topGamingVideo.statistics?.viewCount)} views
                      </span>
                      <span className="text-green-400 hidden sm:inline">
                        {getViewVelocity(topGamingVideo) >= 1000
                          ? formatNumber(getViewVelocity(topGamingVideo)) + '/day'
                          : Math.round(getViewVelocity(topGamingVideo)) + '/day'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Gaming Categories Grid - Mobile Optimized */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Gaming Categories</h2>
              <p className="text-gray-500 text-sm mt-1">Explore trends by game</p>
            </div>
            <Link
              href="/trends/gaming-youtube"
              className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1 text-sm sm:text-base"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {GAMING_CATEGORIES.map((category) => {
              const catVideos = categoryVideos[category.id] || []
              const catViews = catVideos.reduce((sum: number, v: any) =>
                sum + Number(v.statistics?.viewCount || 0), 0)

              return (
                <Link
                  key={category.id}
                  href={`/trends/${category.id}`}
                  className={`group block ${category.bgColor} ${category.borderColor} border rounded-xl p-3 sm:p-5 hover:shadow-md transition-all active:scale-95`}
                >
                  <div className="text-2xl sm:text-3xl mb-2">{category.icon}</div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1 group-hover:text-red-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm mb-2 line-clamp-1">{category.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">
                      {catVideos.length} trending
                    </span>
                    {catViews > 0 && (
                      <span className="font-medium text-gray-900">
                        {formatNumber(catViews)}
                      </span>
                    )}
                  </div>
                  {/* Sub-categories tags - Hidden on mobile */}
                  <div className="hidden sm:flex flex-wrap gap-1 mt-3">
                    {category.subCategories.slice(0, 3).map((sub) => (
                      <span
                        key={sub}
                        className="text-[10px] bg-white/70 text-gray-600 px-2 py-0.5 rounded"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Category Detail Sections - Mobile Optimized */}
      {GAMING_CATEGORIES.map((category) => {
        const catVideos = categoryVideos[category.id] || []
        if (catVideos.length === 0) return null

        return (
          <section key={category.id} className="py-8 sm:py-12 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-2xl sm:text-3xl">{category.icon}</span>
                  <div>
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-900">{category.name}</h2>
                    <p className="text-gray-500 text-xs sm:text-sm">{category.description}</p>
                  </div>
                </div>
                <Link
                  href={`/trends/${category.id}`}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition text-sm text-center"
                >
                  Explore →
                </Link>
              </div>

              {/* Sub-category filters - Horizontal scroll on mobile */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible sm:pb-0 scrollbar-hide">
                {category.subCategories.map((sub) => (
                  <button
                    key={sub}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs sm:text-sm transition whitespace-nowrap"
                  >
                    {sub}
                  </button>
                ))}
              </div>

              {/* Videos Grid - Mobile: 2 cols, Tablet: 3, Desktop: 6 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {catVideos.slice(0, 6).map((video: any, idx: number) => (
                  <Link
                    key={video.id}
                    href={`/video/${video.id}`}
                    className="group block bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-red-300 hover:shadow-md transition-all active:scale-95"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={getThumbnailUrl(video)}
                        alt={video.snippet?.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className={`absolute top-1.5 left-1.5 sm:top-2 sm:left-2 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded text-[10px] sm:text-xs font-bold ${
                        idx === 0
                          ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900'
                          : idx === 1
                          ? 'bg-gray-200 text-gray-700'
                          : idx === 2
                          ? 'bg-orange-200 text-orange-800'
                          : 'bg-gray-900/80 text-white'
                      }`}>
                        #{idx + 1}
                      </div>
                      <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1 py-0.5 rounded">
                        {formatNumber(video.statistics?.viewCount)}
                      </div>
                    </div>
                    <div className="p-2">
                      <h4 className="text-xs font-medium text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors">
                        {video.snippet?.title}
                      </h4>
                      <p className="text-[10px] text-gray-500 mt-1 truncate">
                        {video.snippet?.channelTitle}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )
      })}

      {/* Trending Gaming Topics - Mobile Optimized */}
      <section className="py-8 sm:py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-8">Trending Gaming Topics</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { topic: 'Speedrunning', icon: '⏱️', growth: '+245%', color: 'bg-red-500' },
              { topic: 'No Death Challenges', icon: '💀', growth: '+189%', color: 'bg-orange-500' },
              { topic: '100% Completion', icon: '✅', growth: '+156%', color: 'bg-green-500' },
              { topic: 'Reacting to Updates', icon: '📰', growth: '+134%', color: 'bg-blue-500' },
              { topic: 'Esports Highlights', icon: '🏆', growth: '+122%', color: 'bg-purple-500' },
              { topic: 'Challenge Runs', icon: '🎯', growth: '+98%', color: 'bg-pink-500' },
              { topic: 'Mod Showcases', icon: '🔧', growth: '+87%', color: 'bg-cyan-500' },
              { topic: 'Tournament Clips', icon: '🎮', growth: '+76%', color: 'bg-yellow-500' },
            ].map((item) => (
              <div
                key={item.topic}
                className="bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-700 hover:border-gray-600 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl sm:text-2xl">{item.icon}</span>
                  <span className={`${item.color} text-white text-xs font-bold px-2 py-1 rounded-full`}>
                    {item.growth}
                  </span>
                </div>
                <h3 className="font-bold text-sm sm:text-base">{item.topic}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Creator Opportunities - Mobile Optimized */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl sm:rounded-2xl p-4 sm:p-8 text-white">
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div>
                <h2 className="text-xl sm:text-3xl font-bold mb-3 sm:mb-4">Gaming Creator Opportunities</h2>
                <p className="text-red-100 text-sm sm:text-base mb-4 sm:mb-6">
                  Gaming content on YouTube is experiencing explosive growth. With {formatNumber(totalGamingViews)} views
                  across {gamingVideos.length} trending videos, now is the perfect time to establish your gaming channel.
                </p>
                <div className="space-y-2 sm:space-y-3">
                  {[
                    'Low competition in emerging indie games',
                    'Consistent engagement across all game types',
                    'Multiple monetization opportunities',
                    'Build loyal community with series content',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 sm:gap-3">
                      <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs flex-shrink-0">✓</div>
                      <span className="text-red-50 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
                <h3 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">Popular Content Formats</h3>
                <div className="space-y-2 sm:space-y-3">
                  {[
                    { format: 'Shorts Gaming Clips', engagement: 'High', views: '2M+' },
                    { format: 'Long-form Walkthroughs', engagement: 'Very High', views: '500K+' },
                    { format: 'Live Stream Highlights', engagement: 'High', views: '1M+' },
                    { format: 'Tutorial & Guides', engagement: 'Medium', views: '300K+' },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 border-b border-white/10 last:border-0 gap-1">
                      <span className="text-sm">{item.format}</span>
                      <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-red-200">
                        <span>{item.engagement}</span>
                        <span className="font-bold">{item.views}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Mobile Optimized */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Start Tracking Gaming Trends</h2>
          <p className="text-gray-600 mb-4 sm:mb-6 max-w-xl mx-auto text-sm sm:text-base">
            Get real-time alerts when new gaming trends emerge. Stay ahead of the competition.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/trends/gaming-youtube"
              className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition text-center"
            >
              Explore Gaming Trends →
            </Link>
            <Link
              href="/trends"
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-white transition text-center"
            >
              View All Trends
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
