import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { analyzeVideo, analyzeVideoSEO } from '../../../lib/youtube-analytics-engine';

/**
 * Channel Interest Filter Page
 * /channel/[channelId]/interest/[interest]
 * 
 * Shows channel videos filtered by a specific audience interest.
 * Each video card shows analysis strongly correlated to the interest.
 */

// Interest → keyword/category mapping for filtering
const INTEREST_CONFIG = {
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
    keywords: ['vlog', 'daily', 'day in', 'routine', 'life', 'lifestyle', 'travel', 'adventure', 'morning', 'night', 'routine', 'aesthetic', 'cozy', 'home', 'apartment', 'city', 'street', 'explore', 'document', 'personal', 'storytime', 'update', 'behind', 'bts'],
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
};

/**
 * Score how well a video matches an interest
 */
function scoreVideoForInterest(video, interestKey) {
  const config = INTEREST_CONFIG[interestKey];
  if (!config) return 0;

  const title = (video.title || '').toLowerCase();
  const desc = (video.description || '').toLowerCase();
  const tags = (video.tags || []).join(' ').toLowerCase();
  const combined = `${title} ${title} ${title} ${desc} ${tags}`; // title 3x weight

  let score = 0;
  for (const kw of config.keywords) {
    if (combined.includes(kw)) {
      score += 10;
      // Bonus for title match
      if (title.includes(kw)) score += 15;
    }
  }

  // Category match bonus
  const category = (video.category || '').toLowerCase();
  const categoryMap = {
    technology: ['science & technology', 'education'],
    music: ['music'],
    sports: ['sports'],
    gaming: ['gaming', 'entertainment'],
    entertainment: ['entertainment', 'people & blogs'],
    education: ['education', 'science & technology'],
    comedy: ['entertainment', 'people & blogs'],
    howto: ['howto & style', 'education'],
  };
  if (categoryMap[interestKey]?.some(c => category.includes(c))) {
    score += 20;
  }

  return score;
}

/**
 * Main Page Component
 */
export default function ChannelInterestPage({ channelId, interest, channelData, videos }) {
  const router = useRouter();
  const interestKey = interest.toLowerCase();
  const config = INTEREST_CONFIG[interestKey] || INTEREST_CONFIG.technology;

  // Score and filter videos
  const scoredVideos = videos
    .map(v => ({
      ...v,
      interestScore: scoreVideoForInterest(v, interestKey),
      analysis: analyzeVideo(v),
      seoAnalysis: analyzeVideoSEO(v),
    }))
    .filter(v => v.interestScore > 0)
    .sort((a, b) => b.interestScore - a.interestScore);

  const totalVideos = scoredVideos.length;
  const avgScore = scoredVideos.length > 0
    ? Math.round(scoredVideos.reduce((s, v) => s + v.interestScore, 0) / scoredVideos.length)
    : 0;

  const formatNumber = (n) => {
    if (n >= 1000000000) return (n / 1000000000).toFixed(1) + 'B';
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return (n || 0).toLocaleString();
  };

  const formatDate = (d) => {
    if (!d) return 'Unknown';
    const date = new Date(d);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <>
      <Head>
        <title>{`${channelData.title} — ${config.icon} ${interest} Videos Analysis | Tubefission`}</title>
        <meta name="description" content={`Analyze ${channelData.title}'s ${interest.toLowerCase()} content strategy. ${config.description}`} />
        <link rel="canonical" href={`https://tubefission.com/channel/${channelId}/interest/${interestKey}`} />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">

        {/* Breadcrumb */}
        <nav className="py-4 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
          <div className="max-w-6xl mx-auto">
            <ol className="flex items-center space-x-2 text-sm text-slate-400 flex-wrap">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li>/</li>
              <li><a href="/youtube-channel-analytics" className="hover:text-white transition-colors">Channels</a></li>
              <li>/</li>
              <li><a href={`/channel/${channelId}`} className="hover:text-white transition-colors truncate max-w-[150px]">{channelData.title}</a></li>
              <li>/</li>
              <li className={`font-medium ${config.text}`}>{config.icon} {interest}</li>
            </ol>
          </div>
        </nav>

        {/* ========== HERO ========== */}
        <section className="pt-8 pb-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-5 mb-6">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-600 flex-shrink-0">
                <img src={channelData.thumbnail || '/default-avatar.png'} alt={channelData.title} className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                  {config.icon} {interest} Videos
                </h1>
                <p className="text-slate-400">
                  <a href={`/channel/${channelId}`} className="hover:text-white transition-colors">{channelData.title}</a>
                  {' · '}{totalVideos} related videos analyzed
                </p>
              </div>
            </div>

            {/* Interest Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className={`${config.bg} rounded-xl p-4 border ${config.border}`}>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Matched Videos</p>
                <p className={`text-2xl font-bold ${config.text}`}>{totalVideos}</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Avg Match Score</p>
                <p className="text-2xl font-bold text-white">{avgScore}</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Total Views</p>
                <p className="text-2xl font-bold text-white">
                  {formatNumber(scoredVideos.reduce((s, v) => s + (v.viewCount || 0), 0))}
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Avg Engagement</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {scoredVideos.length > 0
                    ? (scoredVideos.reduce((s, v) => s + (v.analysis?.engagementRate || 0), 0) / scoredVideos.length).toFixed(1) + '%'
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========== INTEREST TAGS (navigate between interests) ========== */}
        <section className="py-6 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-6xl mx-auto">
            <p className="text-sm text-slate-400 mb-3">🏷️ Switch Interest</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(INTEREST_CONFIG).map(([key, cfg]) => (
                <Link
                  key={key}
                  href={`/channel/${channelId}/interest/${key}`}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    key === interestKey
                      ? `${cfg.bg} ${cfg.text} border ${cfg.border} ring-2 ring-offset-1 ring-offset-slate-900 ${cfg.border.replace('/30', '/50')}`
                      : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-500 hover:text-slate-300'
                  }`}
                >
                  {cfg.icon} {key.charAt(0).toUpperCase() + key.slice(1)}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ========== VIDEO LIST ========== */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold mb-6">
              📊 {totalVideos} {interest}-Related Videos — Ranked by Relevance
            </h2>

            {scoredVideos.length === 0 ? (
              <div className="bg-slate-800/50 rounded-2xl p-12 border border-slate-700 text-center">
                <p className="text-5xl mb-4">{config.icon}</p>
                <p className="text-xl font-semibold mb-2">No {interest} videos found</p>
                <p className="text-slate-400">This channel doesn't appear to have content related to {interest.toLowerCase()}.</p>
                <Link href={`/channel/${channelId}`} className="inline-block mt-4 px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-500 transition-colors">
                  ← Back to Channel Overview
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {scoredVideos.map((video, i) => (
                  <VideoCard
                    key={video.videoId || i}
                    video={video}
                    index={i + 1}
                    config={config}
                    interestKey={interestKey}
                    formatNumber={formatNumber}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ========== INTEREST STRATEGY INSIGHTS ========== */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold mb-6">💡 {interest} Content Strategy Insights</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <InsightCard
                title="📊 Content Volume"
                value={`${totalVideos} videos`}
                detail={`${((totalVideos / Math.max(channelData.videoCount || 1, 1)) * 100).toFixed(0)}% of channel's total content`}
                color={config.text}
              />
              <InsightCard
                title="👁️ View Share"
                value={formatNumber(scoredVideos.reduce((s, v) => s + (v.viewCount || 0), 0))}
                detail={`${((scoredVideos.reduce((s, v) => s + (v.viewCount || 0), 0) / Math.max(channelData.viewCount || 1, 1)) * 100).toFixed(0)}% of total channel views`}
                color="text-cyan-400"
              />
              <InsightCard
                title="💬 Engagement Quality"
                value={`${scoredVideos.length > 0 ? (scoredVideos.reduce((s, v) => s + (v.analysis?.engagementRate || 0), 0) / scoredVideos.length).toFixed(1) : 0}%`}
                detail={`vs ${(scoredVideos.reduce((s, v) => s + (v.analysis?.engagementRate || 0), 0) / Math.max(scoredVideos.length, 1)).toFixed(1)}% channel average`}
                color="text-emerald-400"
              />
              <InsightCard
                title="🎯 SEO Score"
                value={`${scoredVideos.length > 0 ? Math.round(scoredVideos.reduce((s, v) => s + (v.seoAnalysis?.overallSEOScore || 0), 0) / scoredVideos.length) : 0}/100`}
                detail="Average SEO optimization for this interest"
                color="text-yellow-400"
              />
              <InsightCard
                title="📅 Best Performing"
                value={scoredVideos.length > 0 ? formatDate(scoredVideos[0].publishedAt) : 'N/A'}
                detail={scoredVideos.length > 0 ? `"${scoredVideos[0].title?.substring(0, 40)}..."` : ''}
                color="text-purple-400"
              />
              <InsightCard
                title="📈 Growth Potential"
                value={avgScore > 50 ? '🟢 Strong' : avgScore > 20 ? '🟡 Moderate' : '🔴 Weak'}
                detail={avgScore > 50 ? 'Channel has strong authority in this interest' : avgScore > 20 ? 'Some content overlap — room to grow' : 'Low relevance — opportunity to expand'}
                color={avgScore > 50 ? 'text-emerald-400' : avgScore > 20 ? 'text-yellow-400' : 'text-red-400'}
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-slate-800">
          <div className="max-w-6xl mx-auto text-center text-slate-400 text-sm">
            <p>© 2026 Tubefission. Interest-based channel analysis.</p>
          </div>
        </footer>
      </div>
    </>
  );
}

// ========== Video Card Component ==========
function VideoCard({ video, index, config, interestKey, formatNumber, formatDate }) {
  const analysis = video.analysis;
  const seo = video.seoAnalysis;

  const scoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const matchBadge = (score) => {
    if (score >= 80) return { label: 'Strong Match', cls: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
    if (score >= 50) return { label: 'Good Match', cls: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
    if (score >= 25) return { label: 'Partial Match', cls: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };
    return { label: 'Weak Match', cls: 'bg-slate-600/20 text-slate-400 border-slate-500/30' };
  };

  const badge = matchBadge(video.interestScore);

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 hover:border-slate-600 transition-all overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Thumbnail + Rank */}
        <div className="relative sm:w-64 flex-shrink-0">
          <div className="aspect-video bg-slate-900">
            {video.thumbnail ? (
              <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">🎬</div>
            )}
          </div>
          {/* Rank Badge */}
          <div className="absolute top-2 left-2 bg-black/80 rounded-lg px-2 py-1 text-xs font-bold">
            #{index}
          </div>
          {/* Duration */}
          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-black/80 rounded px-1.5 py-0.5 text-xs font-mono">
              {video.duration}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base sm:text-lg line-clamp-2 mb-1 hover:text-indigo-400 transition-colors">
                <a href={`https://youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer">
                  {video.title}
                </a>
              </h3>
              <p className="text-xs text-slate-500">{formatDate(video.publishedAt)} · {video.category || 'Unknown'}</p>
            </div>
            {/* Match Score */}
            <div className="text-right flex-shrink-0">
              <div className={`text-2xl font-extrabold ${scoreColor(video.interestScore)}`}>{video.interestScore}</div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${badge.cls}`}>{badge.label}</span>
            </div>
          </div>

          {/* Metrics Row */}
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-400 mb-3">
            <span>👁️ {formatNumber(video.viewCount)} views</span>
            <span>👍 {formatNumber(video.likeCount)} likes</span>
            <span>💬 {formatNumber(video.commentCount)} comments</span>
            <span>📊 Engagement: {(analysis?.engagementRate || 0).toFixed(1)}%</span>
          </div>

          {/* Analysis Badges */}
          <div className="flex flex-wrap gap-2">
            {/* VSI Badge */}
            <span className="text-[10px] px-2 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
              VSI: {analysis?.viewerSatisfaction?.score || '—'}/100
            </span>
            {/* SEO Badge */}
            <span className="text-[10px] px-2 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full">
              SEO: {seo?.overallSEOScore || '—'}/100
            </span>
            {/* Content Decay */}
            {analysis?.contentDecay && (
              <span className={`text-[10px] px-2 py-1 rounded-full border ${
                analysis.contentDecay.classification === 'evergreen'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : analysis.contentDecay.classification === 'standard'
                  ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                  : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
                {analysis.contentDecay.classification}
              </span>
            )}
            {/* Algorithm Surface */}
            {analysis?.algorithmSurface?.dominantSurface && (
              <span className="text-[10px] px-2 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full">
                📡 {analysis.algorithmSurface.dominantSurface}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== Insight Card Component ==========
function InsightCard({ title, value, detail, color }) {
  return (
    <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
      <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">{title}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-slate-500 mt-1">{detail}</p>
    </div>
  );
}

// ========== Static Props ==========
export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const { channelId, interest } = params;
  const interestKey = interest.toLowerCase();

  if (!INTEREST_CONFIG[interestKey]) {
    return { notFound: true };
  }

  // In production, this would fetch from YouTube Data API
  // For now, return the channelId and interest for client-side rendering
  return {
    props: {
      channelId,
      interest: interestKey,
      channelData: {
        title: 'Channel',
        thumbnail: '',
        subscriberCount: 0,
        viewCount: 0,
        videoCount: 0,
      },
      videos: [],
    },
    revalidate: 3600,
  };
}
