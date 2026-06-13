import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { fetchChannelById, fetchChannelVideos } from '@/lib/api-client'
import { analyzeVideoIntelligence } from '@/lib/ai-insights'

/**
 * Channel Interest Filter Page
 * /channel/[id]/interest/[interest]
 * 
 * Shows channel videos filtered by a specific audience interest.
 * Each video card shows analysis strongly correlated to the interest.
 */
import InterestVideoList from '@/app/components/InterestVideoList'

const INTEREST_CONFIG: Record<string, {
  icon: string; color: string; bg: string; border: string; text: string
  keywords: string[]; description: string
}> = {
  technology: {
    icon: '💻', color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400',
    keywords: ['tech', 'technology', 'ai', 'artificial intelligence', 'coding', 'programming', 'software', 'hardware', 'review', 'gadget', 'computer', 'laptop', 'phone', 'iphone', 'android', 'windows', 'mac', 'linux', 'python', 'javascript', 'web', 'app', 'startup', 'crypto', 'blockchain', 'cyber', 'security', 'data', 'machine learning', 'cloud', 'devops', 'api', 'saas', 'tool'],
    description: 'Tech reviews, tutorials, news, and deep-dives into the latest innovations.',
  },
  music: {
    icon: '🎵', color: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400',
    keywords: ['music', 'song', 'album', 'remix', 'cover', 'live', 'concert', 'band', 'guitar', 'piano', 'drum', 'bass', 'vocal', 'singer', 'rapper', 'beat', 'production', 'mixing', 'mastering', 'studio', 'recording', 'producer', 'dj', 'edm', 'hip hop', 'rock', 'pop', 'jazz', 'classical', 'acoustic', 'lyrics', 'karaoke', 'instrumental'],
    description: 'Music covers, production tutorials, live performances, and song breakdowns.',
  },
  sports: {
    icon: '⚽', color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400',
    keywords: ['sport', 'sports', 'football', 'soccer', 'basketball', 'nba', 'nfl', 'mlb', 'f1', 'formula', 'tennis', 'golf', 'cricket', 'ufc', 'boxing', 'wrestling', 'mma', 'athletic', 'fitness', 'workout', 'training', 'match', 'game', 'tournament', 'championship', 'league', 'player', 'team', 'highlight', 'replay', 'score'],
    description: 'Match highlights, training tips, sports analysis, and athlete stories.',
  },
  gaming: {
    icon: '🎮', color: 'from-violet-500 to-purple-500', bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-400',
    keywords: ['gaming', 'game', 'play', 'playthrough', 'walkthrough', 'tutorial', 'guide', 'tips', 'trick', 'strategy', 'esport', 'esports', 'stream', 'streamer', 'twitch', 'pc', 'console', 'xbox', 'playstation', 'ps5', 'switch', 'nintendo', 'steam', 'valorant', 'fortnite', 'minecraft', 'roblox', 'cod', 'warzone', 'apex', 'league', 'dota', 'csgo', 'overwatch', 'zelda', 'mario'],
    description: 'Game reviews, walkthroughs, esports coverage, and gaming culture.',
  },
  tutorial: {
    icon: '📚', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400',
    keywords: ['tutorial', 'how to', 'learn', 'course', 'lesson', 'beginner', 'advanced', 'step by step', 'guide', 'explained', 'basics', 'masterclass', 'training', 'class', 'tips', 'trick', 'hack', 'skill', 'practice', 'diy', 'make', 'build', 'create', 'setup', 'install', 'configure'],
    description: 'In-depth tutorials and educational content for all skill levels.',
  },
  entertainment: {
    icon: '🎬', color: 'from-red-500 to-pink-500', bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400',
    keywords: ['entertainment', 'funny', 'comedy', 'meme', 'viral', 'challenge', 'prank', 'reaction', 'vlog', 'story', 'storytime', 'drama', 'celebrity', 'famous', 'star', 'hollywood', 'movie', 'film', 'tv', 'show', 'episode', 'season', 'trailer', 'review', 'spoiler', 'unboxing', 'haul', 'try', 'taste'],
    description: 'Comedy, reactions, challenges, vlogs, and pop culture deep-dives.',
  },
  education: {
    icon: '🎓', color: 'from-sky-500 to-indigo-500', bg: 'bg-sky-500/10', border: 'border-sky-500/30', text: 'text-sky-400',
    keywords: ['education', 'educational', 'science', 'history', 'math', 'physics', 'chemistry', 'biology', 'psychology', 'philosophy', 'documentary', 'explain', 'explainer', 'ted', 'lecture', 'professor', 'university', 'college', 'research', 'study', 'experiment', 'theory', 'concept', 'fact', 'knowledge', 'learning', 'academic'],
    description: 'Educational deep-dives, science explainers, and thought-provoking content.',
  },
  vlog: {
    icon: '📱', color: 'from-teal-500 to-emerald-500', bg: 'bg-teal-500/10', border: 'border-teal-500/30', text: 'text-teal-400',
    keywords: ['vlog', 'daily', 'day in', 'routine', 'life', 'lifestyle', 'travel', 'adventure', 'morning', 'night', 'aesthetic', 'cozy', 'home', 'apartment', 'city', 'street', 'explore', 'document', 'personal', 'storytime', 'update', 'behind', 'bts'],
    description: 'Daily life, travel adventures, and personal stories from creators.',
  },
  review: {
    icon: '⭐', color: 'from-yellow-500 to-amber-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400',
    keywords: ['review', 'honest', 'unboxing', 'hands on', 'first look', 'comparison', 'vs', 'versus', 'worth', 'buy', 'best', 'top', 'worst', 'rating', 'recommend', 'tested', 'tried', 'month later', 'year later', 'long term', 'pros', 'cons', 'verdict', 'opinion'],
    description: 'Honest product reviews, comparisons, and buyer guides.',
  },
  comedy: {
    icon: '😂', color: 'from-lime-500 to-green-500', bg: 'bg-lime-500/10', border: 'border-lime-500/30', text: 'text-lime-400',
    keywords: ['comedy', 'funny', 'humor', 'joke', 'skit', 'sketch', 'stand up', 'standup', 'improv', 'parody', 'satire', 'spoof', 'meme', 'compilation', 'try not to laugh', 'laugh', 'hilarious', 'roast', 'prank', 'fail', 'blooper'],
    description: 'Comedy sketches, stand-up clips, and internet humor compilations.',
  },
  fitness: {
    icon: '💪', color: 'from-orange-500 to-red-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400',
    keywords: ['fitness', 'workout', 'exercise', 'gym', 'muscle', 'weight', 'loss', 'gain', 'bodybuilding', 'training', 'cardio', 'hiit', 'yoga', 'stretch', 'flexibility', 'diet', 'nutrition', 'protein', 'meal', 'health', 'wellness', 'transformation', 'before', 'after', 'routine'],
    description: 'Workout routines, nutrition guides, and fitness transformation stories.',
  },
  food: {
    icon: '🍕', color: 'from-rose-500 to-pink-500', bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400',
    keywords: ['food', 'cooking', 'recipe', 'chef', 'kitchen', 'bake', 'baking', 'meal', 'restaurant', 'food review', 'mukbang', 'taste', 'try', 'eat', 'eating', 'delicious', 'cuisine', 'dish', 'ingredient', 'homemade', 'street food', 'fast food', 'healthy', 'dessert', 'drink'],
    description: 'Recipes, restaurant reviews, cooking tutorials, and food adventures.',
  },
  travel: {
    icon: '✈️', color: 'from-cyan-500 to-blue-500', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400',
    keywords: ['travel', 'trip', 'journey', 'explore', 'adventure', 'destination', 'country', 'city', 'beach', 'mountain', 'hotel', 'airbnb', 'backpack', 'solo', 'budget', 'luxury', 'tour', 'guide', 'hidden gem', 'local', 'culture', 'abroad', 'international', 'visa', 'flight'],
    description: 'Travel guides, destination reviews, and adventure vlogs from around the world.',
  },
  fashion: {
    icon: '👗', color: 'from-fuchsia-500 to-purple-500', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/30', text: 'text-fuchsia-400',
    keywords: ['fashion', 'style', 'outfit', 'ootd', 'clothing', 'wear', 'trend', 'designer', 'brand', 'luxury', 'streetwear', 'sneaker', 'shoe', 'accessory', 'jewelry', 'watch', 'makeup', 'beauty', 'skincare', 'hair', 'nail', 'haul', 'try on', 'lookbook'],
    description: 'Fashion trends, outfit ideas, beauty tutorials, and style guides.',
  },
  beauty: {
    icon: '💄', color: 'from-pink-500 to-rose-500', bg: 'bg-pink-500/10', border: 'border-pink-500/30', text: 'text-pink-400',
    keywords: ['beauty', 'makeup', 'skincare', 'hair', 'nail', 'cosmetic', 'foundation', 'lipstick', 'eyeshadow', 'tutorial', 'routine', 'product', 'review', 'haul', 'grwm', 'get ready', 'morning routine', 'night routine', 'dermatologist', 'spa', 'self care'],
    description: 'Beauty tutorials, skincare routines, and product reviews.',
  },
  diy: {
    icon: '🔨', color: 'from-stone-500 to-amber-500', bg: 'bg-stone-500/10', border: 'border-stone-500/30', text: 'text-stone-400',
    keywords: ['diy', 'do it yourself', 'craft', 'handmade', 'homemade', 'woodwork', 'carpentry', 'repair', 'fix', 'renovation', 'home improvement', 'build', 'make', 'create', 'project', 'workshop', 'garage', 'tool', 'hack', 'creative', 'art', 'paint', 'draw'],
    description: 'DIY projects, home improvement, crafting, and maker content.',
  },
  science: {
    icon: '🔬', color: 'from-blue-500 to-violet-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400',
    keywords: ['science', 'scientific', 'research', 'experiment', 'hypothesis', 'theory', 'physics', 'chemistry', 'biology', 'astronomy', 'space', 'planet', 'universe', 'atom', 'molecule', 'cell', 'dna', 'evolution', 'quantum', 'gravity', 'energy', 'laboratory'],
    description: 'Science explainers, experiments, and fascinating discoveries.',
  },
  news: {
    icon: '📰', color: 'from-gray-500 to-slate-500', bg: 'bg-gray-500/10', border: 'border-gray-500/30', text: 'text-gray-400',
    keywords: ['news', 'breaking', 'update', 'current events', 'politics', 'world', 'local', 'investigation', 'report', 'journalist', 'correspondent', 'interview', 'press', 'media', 'analysis', 'opinion', 'debate', 'controversy', 'scandal', 'election', 'economy'],
    description: 'News coverage, current events analysis, and investigative journalism.',
  },
}

function scoreVideoForInterest(video: any, interestKey: string): number {
  const config = INTEREST_CONFIG[interestKey]
  if (!config) return 0
  const title = (video.snippet?.title || '').toLowerCase()
  const desc = (video.snippet?.description || '').toLowerCase()
  const tags = (video.snippet?.tags || []).join(' ').toLowerCase()
  const combined = `${title} ${title} ${title} ${desc} ${tags}`
  let score = 0
  for (const kw of config.keywords) {
    if (combined.includes(kw)) { score += 10; if (title.includes(kw)) score += 15 }
  }
  return score
}

function formatNumber(n: string | number | undefined): string {
  const num = Number(n || 0)
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B'
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M'
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K'
  return num.toLocaleString()
}

function formatDate(d: string | undefined): string {
  if (!d) return 'Unknown'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function calcEngagement(video: any): number {
  const views = Number(video.statistics?.viewCount || 0)
  const likes = Number(video.statistics?.likeCount || 0)
  const comments = Number(video.statistics?.commentCount || 0)
  if (views === 0) return 0
  return ((likes + comments * 2) / views) * 100
}

interface InterestPageProps { params: Promise<{ id: string; interest: string }> }

export default async function InterestPage({ params }: InterestPageProps) {
  const { id, interest } = await params
  const interestKey = interest.toLowerCase()
  if (!INTEREST_CONFIG[interestKey]) notFound()
  const config = INTEREST_CONFIG[interestKey]

  const [channel, videos] = await Promise.all([
    fetchChannelById(id).catch(() => null),
    fetchChannelVideos(id, 50).catch(() => []),
  ])
  if (!channel) notFound()

  const scoredVideos = videos
    .map((v: any) => ({
      ...v,
      interestScore: scoreVideoForInterest(v, interestKey),
      intelligence: analyzeVideoIntelligence(v),
    }))
    .filter((v: any) => v.interestScore > 0)
    .sort((a: any, b: any) => b.interestScore - a.interestScore)

  const totalVideos = scoredVideos.length
  const avgScore = totalVideos > 0 ? Math.round(scoredVideos.reduce((s: number, v: any) => s + v.interestScore, 0) / totalVideos) : 0
  const totalViews = scoredVideos.reduce((s: number, v: any) => s + Number(v.statistics?.viewCount || 0), 0)
  const avgEng = totalVideos > 0 ? (scoredVideos.reduce((s: number, v: any) => s + calcEngagement(v), 0) / totalVideos).toFixed(1) : '0'

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
      {/* Breadcrumb */}
      <nav className="py-4 px-4 sm:px-6 lg:px-8 border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto">
          <ol className="flex items-center space-x-2 text-sm text-gray-500 flex-wrap">
            <li><Link href="/" className="hover:text-gray-900 transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/youtube-channel-analytics" className="hover:text-gray-900 transition-colors">Channels</Link></li>
            <li>/</li>
            <li><Link href={`/channel/${id}`} className="hover:text-gray-900 transition-colors truncate max-w-[150px]">{channel.snippet?.title}</Link></li>
            <li>/</li>
            <li className="font-medium text-gray-900">{config.icon} {interest}</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-8 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300 flex-shrink-0">
              <img src={channel.snippet?.thumbnails?.medium?.url || '/default-avatar.png'} alt={channel.snippet?.title} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">{config.icon} {interest} Videos</h1>
              <p className="text-gray-500">
                <Link href={`/channel/${id}`} className="hover:text-gray-900 transition-colors">{channel.snippet?.title}</Link>
                {' · '}{totalVideos} related videos analyzed
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Matched Videos</p>
              <p className="text-2xl font-bold text-blue-600">{totalVideos}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Avg Match Score</p>
              <p className="text-2xl font-bold">{avgScore}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Total Views</p>
              <p className="text-2xl font-bold">{formatNumber(totalViews)}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Avg Engagement</p>
              <p className="text-2xl font-bold text-green-600">{avgEng}%</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interest Tags */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm text-gray-400 mb-3">🏷️ Switch Interest</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(INTEREST_CONFIG).map(([key, cfg]) => (
              <Link key={key} href={`/channel/${id}/interest/${key}`}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  key === interestKey
                    ? 'bg-blue-100 text-blue-700 border border-blue-300 ring-2 ring-blue-200'
                    : 'bg-gray-100 text-gray-500 border border-gray-200 hover:border-gray-400 hover:text-gray-700'
                }`}>
                {cfg.icon} {key.charAt(0).toUpperCase() + key.slice(1)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Video List with Filters */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold mb-6">📊 {totalVideos} {interest}-Related Videos — Ranked by Relevance</h2>
          {scoredVideos.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
              <p className="text-5xl mb-4">{config.icon}</p>
              <p className="text-xl font-semibold mb-2">No {interest} videos found</p>
              <p className="text-gray-500">This channel doesn't appear to have content related to {interest.toLowerCase()}.</p>
              <Link href={`/channel/${id}`} className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">← Back to Channel</Link>
            </div>
          ) : (
            <InterestVideoList
              videos={scoredVideos}
              interestKey={interestKey}
              interestIcon={config.icon}
              config={config}
            />
          )}
        </div>
      </section>

      {/* Insights */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold mb-6">💡 {interest} Content Strategy Insights</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InsightCard title="📊 Content Volume" value={`${totalVideos} videos`} detail={`${((totalVideos / Math.max(Number(channel.statistics?.videoCount || 1), 1)) * 100).toFixed(0)}% of channel total`} color="text-blue-600" />
            <InsightCard title="👁️ View Share" value={formatNumber(totalViews)} detail={`${((totalViews / Math.max(Number(channel.statistics?.viewCount || 1), 1)) * 100).toFixed(0)}% of total channel views`} color="text-cyan-600" />
            <InsightCard title="💬 Avg Engagement" value={`${avgEng}%`} detail="Average engagement for this interest" color="text-green-600" />
            <InsightCard title="📅 Best Performing" value={scoredVideos.length > 0 ? formatDate(scoredVideos[0].snippet?.publishedAt) : 'N/A'} detail={scoredVideos.length > 0 ? `"${scoredVideos[0].snippet?.title?.substring(0, 40)}..."` : ''} color="text-purple-600" />
            <InsightCard title="📈 Growth Potential" value={avgScore > 50 ? '🟢 Strong' : avgScore > 20 ? '🟡 Moderate' : '🔴 Weak'} detail={avgScore > 50 ? 'Strong authority in this interest' : avgScore > 20 ? 'Some overlap — room to grow' : 'Low relevance — opportunity to expand'} color={avgScore > 50 ? 'text-green-600' : avgScore > 20 ? 'text-yellow-600' : 'text-red-600'} />
            <InsightCard title="🎯 Match Quality" value={avgScore > 50 ? 'High' : avgScore > 20 ? 'Medium' : 'Low'} detail={`Avg keyword match score of ${avgScore} across videos`} color="text-indigo-600" />
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto text-center text-gray-400 text-sm">
          <p>© 2026 Tubefission. Interest-based channel analysis.</p>
        </div>
      </footer>
    </main>
  )
}

function InsightCard({ title, value, detail, color }: { title: string; value: string; detail: string; color: string }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200">
      <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">{title}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-1">{detail}</p>
    </div>
  )
}

export async function generateMetadata({ params }: InterestPageProps): Promise<Metadata> {
  const { interest } = await params
  const config = INTEREST_CONFIG[interest.toLowerCase()]
  if (!config) return { title: 'Interest Not Found | Tubefission' }
  return {
    title: `${config.icon} ${interest} Videos — Channel Analysis | Tubefission`,
    description: `Analyze ${interest} content from this channel. ${config.description}`,
  }
}
