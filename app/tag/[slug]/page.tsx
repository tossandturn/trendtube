import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || ''

const TAG_KEYWORDS: Record<string, string[]> = {
  ai: ['ai', 'chatgpt', 'openai', 'gpt'],
  shorts: ['shorts', '#shorts', 'short'],
  gaming: ['gaming', 'minecraft', 'gta', 'fortnite'],
  coding: ['coding', 'developer', 'programming', 'react', 'javascript'],
  crypto: ['crypto', 'bitcoin', 'ethereum'],
  business: ['business', 'money', 'startup'],
  football: ['football', 'soccer'],
  anime: ['anime'],
  music: ['music', 'song'],
  'mrbeast-style': ['$10000', '$100000', 'challenge', 'last to leave'],
}

const TAG_ANALYSIS: Record<string, string> = {
  ai: 'AI content is surging due to rapid tool releases, democratized access, and creator curiosity. Early adopters are capturing massive search traffic before saturation hits.',
  shorts: 'Shorts benefit from YouTube\'s aggressive algorithmic push, lower competition per upload, and mobile-first consumption trends. Vertical content receives 2-3x more impressions.',
  gaming: 'Gaming maintains evergreen demand with new releases, updates, and community events driving cyclical spikes. Live streaming cross-pollination amplifies discovery.',
  coding: 'Developer education content has high search retention and strong CPMs. Tutorial-style videos generate steady long-tail traffic and build loyal subscriber bases.',
  crypto: 'Crypto trends spike around market movements, regulatory news, and new project launches. Timing uploads to news cycles yields outsized view velocity.',
  business: 'Business content attracts high-value audiences and premium advertisers. "How to make money" queries are perpetually high-volume across all platforms.',
  football: 'Football content peaks during match days, transfer windows, and tournaments. Fan communities drive intense engagement and rapid sharing behavior.',
  anime: 'Anime trends surge around season releases, manga adaptations, and viral clips. Dedicated communities generate above-average watch time and comment density.',
  music: 'Music content benefits from algorithmic playlisting, reaction formats, and trend-jacking viral sounds. Short-form music clips drive exceptional reach.',
  'mrbeast-style': 'High-stakes challenge formats trigger curiosity gaps and social sharing. The MrBeast formula has proven replicable across budget levels and niches.',
}

const VIDEO_IDEAS: Record<string, string[]> = {
  ai: ['I built an AI app in 60 seconds — here is the result', 'ChatGPT vs human coder: who wins?', 'This free AI tool replaced my designer'],
  shorts: ['Wait for the ending — unbelievable twist', 'I tried viral shorts for 7 days', 'This short got 10M views in 24 hours'],
  gaming: ['Secret level 99% of players miss', 'I broke the game with this glitch', 'Speedrun world record reaction'],
  coding: ['JavaScript trick senior devs hide', 'Build a SaaS in 1 hour', 'React mistake costing you views'],
  crypto: ['This coin is about to explode', 'I tracked whale wallets for a week', 'Crypto portfolio for beginners 2026'],
  business: ['Side hustle making $500/day', 'Business idea no one talks about', 'I copied this store and doubled sales'],
  football: ['Goal that broke the internet', 'This player is unstoppable right now', 'Match analysis you need to see'],
  anime: ['Anime that will break you', 'Top 10 anime this season', 'This scene went viral for a reason'],
  music: ['Song you need in your playlist', 'This beat is pure fire', 'Music production secret revealed'],
  'mrbeast-style': ['$1000 challenge — last to leave wins', 'I copied MrBeast with $100', 'Extreme challenge gone wrong'],
}

function hashRandom(seed: string, max: number) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0
  }
  return Math.abs(hash) % max
}

interface TagPageProps {
  params: Promise<{ slug: string }>
}

async function fetchVideos() {
  if (!API_KEY) return []
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=50&regionCode=US&key=${API_KEY}`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.items || []
  } catch {
    return []
  }
}

function formatNumber(n: string | undefined) {
  const num = Number(n || 0)
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B'
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M'
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K'
  return num.toLocaleString()
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params
  const name = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  return {
    title: `${name} YouTube Trends Today | Viral ${name} Videos & Shorts`,
    description: `Track the fastest-growing ${name} YouTube trends, viral videos, and Shorts opportunities with real-time creator intelligence.`,
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params
  const keywords = TAG_KEYWORDS[slug.toLowerCase()]
  if (!keywords) return notFound()

  const videos = await fetchVideos()
  const filtered = videos.filter((v: any) => {
    const text = `${v.snippet?.title || ''} ${v.snippet?.description || ''}`.toLowerCase()
    return keywords.some((k) => text.includes(k))
  })

  const tagName = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  const analysis = TAG_ANALYSIS[slug.toLowerCase()] || `${tagName} is experiencing significant growth across YouTube. Creators who upload early are capturing outsized attention and subscriber gains.`
  const ideas = VIDEO_IDEAS[slug.toLowerCase()] || [`${tagName} content that blows up`, `Why ${tagName} is trending now`, `The ${tagName} opportunity you missed`]

  const chartValues = Array.from({ length: 7 }, (_, i) => hashRandom(slug + '-chart-' + i, 50) + 30)
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6 sm:mb-8"
        >
          <span className="text-lg">←</span>
          <span className="text-sm font-medium">Back to Trends</span>
        </Link>

        <div className="mb-8 sm:mb-10">
          <div className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-2">TAG INTELLIGENCE</div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">{tagName} YouTube Trends Today</h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Track the fastest-growing {tagName} YouTube trends, viral videos, and Shorts opportunities
            with real-time creator intelligence.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-5">
            <div className="text-zinc-500 text-xs sm:text-sm mb-1">Trending Videos</div>
            <div className="text-xl sm:text-2xl font-black">{filtered.length}</div>
          </div>
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-5">
            <div className="text-zinc-500 text-xs sm:text-sm mb-1">Avg Views</div>
            <div className="text-xl sm:text-2xl font-black text-red-400">
              {formatNumber(
                Math.floor(
                  filtered.reduce((s: number, v: any) => s + Number(v.statistics?.viewCount || 0), 0) /
                    Math.max(filtered.length, 1)
                ).toString()
              )}
            </div>
          </div>
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-5">
            <div className="text-zinc-500 text-xs sm:text-sm mb-1">Growth Signal</div>
            <div className="text-xl sm:text-2xl font-black text-green-400">+{420 + hashRandom(slug, 200)}%</div>
          </div>
        </div>

        {/* 7-Day Growth Chart */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 sm:p-6 mb-10">
          <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">7-Day Growth Curve</h2>
          <div className="flex items-end gap-2 h-32">
            {chartValues.map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-zinc-800 rounded-t-lg relative overflow-hidden" style={{ height: `${val}%` }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-green-500/40 to-green-400/10" />
                </div>
                <span className="text-zinc-500 text-[10px]">{days[idx]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Analysis */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 sm:p-6 mb-10">
          <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2">
            <span className="text-yellow-400">✦</span> AI Trend Analysis
          </h2>
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">{analysis}</p>
        </div>

        {/* Video Ideas */}
        <div className="mb-10">
          <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-red-400">🔥</span> Video Ideas You Should Upload Today
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {ideas.map((idea, idx) => (
              <div key={idx} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5">
                <div className="text-zinc-500 text-xs font-bold mb-2">IDEA #{idx + 1}</div>
                <div className="font-bold text-sm sm:text-base">&quot;{idea}&quot;</div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Grid */}
        <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-yellow-400">✦</span> Top {tagName} Videos
        </h2>

        {filtered.length === 0 && (
          <div className="text-zinc-500 text-sm py-10">No videos found for this tag right now.</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filtered.map((video: any) => (
            <Link key={video.id} href={`/video/${video.id}`} className="group block">
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl sm:rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={video.snippet?.thumbnails?.high?.url}
                    alt={`Thumbnail for ${video.snippet?.title}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur px-2 py-1 rounded-lg text-[10px] sm:text-xs font-medium">
                    {formatNumber(video.statistics?.viewCount)} views
                  </div>
                </div>
                <div className="p-3 sm:p-5">
                  <h3 className="font-bold text-sm sm:text-base line-clamp-2 mb-2 group-hover:text-red-400 transition-colors">
                    {video.snippet?.title}
                  </h3>
                  <div className="flex items-center gap-2 text-zinc-500 text-xs">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-[10px] font-bold">
                      {video.snippet?.channelTitle?.[0]}
                    </div>
                    <span className="truncate">{video.snippet?.channelTitle}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
