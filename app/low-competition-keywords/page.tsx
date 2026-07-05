import type { Metadata } from 'next'
import Link from 'next/link'
import { searchYouTubeMulti } from '@/lib/api-client'
import OpportunityHistoryPanel from '@/app/components/OpportunityHistoryPanel'
import ProductValueWorkflow from '@/app/components/ProductValueWorkflow'

export const metadata: Metadata = {
  title: 'Low Competition YouTube Keywords 2026 | Find Underserved Niches',
  description: 'Discover low competition YouTube keywords, validate ranking videos, compare samples, and turn underserved niches into a practical YouTube content plan.',
  keywords: 'low competition youtube keywords, underserved youtube niches, youtube niche finder, low competition niches, youtube keyword workflow',
  alternates: {
    canonical: 'https://tubefission.com/low-competition-keywords',
  },
}

interface YouTubeVideo {
  id?: string
  snippet?: {
    title?: string
    channelTitle?: string
    publishedAt?: string
  }
  statistics?: {
    viewCount?: string
    likeCount?: string
    commentCount?: string
  }
}

interface ValueScoreDimension {
  key: string
  label: string
  score: number
  weight: number
  note: string
}

interface ValueScore {
  total: number
  grade: string
  verdict: string
  recommendation: string
  dimensions: ValueScoreDimension[]
}

interface NicheAnalysis {
  niche: string
  query: string
  videos: YouTubeVideo[]
  searchVolume: string
  competition: 'Low' | 'Medium' | 'High' | 'Unknown'
  cpm: string
  growth: string
  saturation: string
  difficulty: number
  videoCount: number
  opportunityScore: number
  valueScore: ValueScore
}

const NICHE_QUERIES = [
  { niche: 'AI Tool Reviews', query: 'AI tools review tutorial' },
  { niche: 'YouTube Analytics', query: 'youtube analytics tutorial' },
  { niche: 'Niche Gaming Guides', query: 'gaming tutorial guide' },
  { niche: 'Content Strategy', query: 'content strategy tips' },
  { niche: 'Thumbnail Design', query: 'thumbnail design tutorial' },
  { niche: 'Creator Tips', query: 'creator tips advice' },
  { niche: 'Shorts Strategy', query: 'youtube shorts strategy' },
  { niche: 'Channel Growth', query: 'channel growth tips' },
]

const JOURNEY_STEPS = [
  {
    step: '1',
    label: 'Discover',
    title: 'Pick an opportunity',
    copy: 'Start with a niche that has demand, manageable competition, and a clear creator angle.',
  },
  {
    step: '2',
    label: 'Validate',
    title: 'Open ranking samples',
    copy: 'Study the videos that already rank: hook, timeline, keywords, traffic, and audience response.',
  },
  {
    step: '3',
    label: 'Compare',
    title: 'Choose the benchmark',
    copy: 'Compare two examples so the next upload has a concrete model and a clear avoid list.',
  },
  {
    step: '4',
    label: 'Plan',
    title: 'Turn insight into a brief',
    copy: 'Write the next title angle, opening shot, SEO support, and production checklist.',
  },
]

function formatNumber(n: string | undefined) {
  const num = Number(n || 0)
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return num.toLocaleString()
}

function getVideoId(video?: YouTubeVideo) {
  if (!video) return ''
  return typeof video.id === 'string' ? video.id : ''
}

function analyzeCompetition(videos: YouTubeVideo[]) {
  if (videos.length === 0) {
    return { level: 'Unknown' as const, difficulty: 0, videoCount: 0, saturation: 0 }
  }

  const totalViews = videos.reduce((sum, v) => sum + Number(v.statistics?.viewCount || 0), 0)
  const avgViews = totalViews / videos.length
  const highViewCount = videos.filter((v) => Number(v.statistics?.viewCount || 0) > 1_000_000).length
  const saturation = (highViewCount / videos.length) * 100

  let difficulty = Math.min(10, Math.round(avgViews / 500_000))
  if (saturation > 50) difficulty += 2

  let level: 'Low' | 'Medium' | 'High'
  if (difficulty <= 4) level = 'Low'
  else if (difficulty <= 7) level = 'Medium'
  else level = 'High'

  return { level, difficulty, videoCount: videos.length, saturation }
}

function estimateSearchVolume(videos: YouTubeVideo[]) {
  if (videos.length === 0) return 'N/A'

  const totalViews = videos.reduce((sum, v) => sum + Number(v.statistics?.viewCount || 0), 0)
  const avgViewsPerVideo = totalViews / videos.length
  const estimatedMonthly = Math.round((avgViewsPerVideo * videos.length) / 3)

  if (estimatedMonthly >= 1_000_000) return `${(estimatedMonthly / 1_000_000).toFixed(1)}M/mo`
  if (estimatedMonthly >= 1_000) return `${(estimatedMonthly / 1_000).toFixed(0)}K/mo`
  return `${estimatedMonthly}/mo`
}

function calculateGrowth(videos: YouTubeVideo[]) {
  if (videos.length === 0) return '+0%'

  const recentVideos = videos.filter((v) => {
    const published = new Date(v.snippet?.publishedAt || 0)
    const daysOld = (Date.now() - published.getTime()) / (1000 * 60 * 60 * 24)
    return daysOld < 90
  })

  const recentRatio = recentVideos.length / videos.length
  const growthPercent = Math.round(recentRatio * 100)
  return `+${growthPercent}%`
}

function estimateCPM(query: string) {
  const queryLower = query.toLowerCase()
  if (queryLower.includes('tutorial') || queryLower.includes('how to')) return '$4-8'
  if (queryLower.includes('review')) return '$6-12'
  if (queryLower.includes('business') || queryLower.includes('marketing')) return '$8-15'
  if (queryLower.includes('finance') || queryLower.includes('money')) return '$10-20'
  if (queryLower.includes('tech') || queryLower.includes('ai')) return '$6-10'
  return '$3-6'
}

function getSaturationLabel(saturation: number) {
  if (saturation < 20) return 'Early'
  if (saturation < 50) return 'Growing'
  return 'Established'
}

function clampScore(score: number) {
  return Math.min(100, Math.max(0, Math.round(score)))
}

function parseGrowth(growth: string) {
  const growthValue = Number(growth.replace(/[^0-9]/g, '')) || 0
  return Math.min(100, growthValue)
}

function parseCpmMidpoint(cpm: string) {
  const numbers = cpm.match(/\d+/g)?.map(Number) || []
  if (numbers.length === 0) return 3
  if (numbers.length === 1) return numbers[0]
  return (numbers[0] + numbers[1]) / 2
}

function calculateEngagementScore(videos: YouTubeVideo[]) {
  if (videos.length === 0) return 35

  const engagementRates = videos.slice(0, 10).map((video) => {
    const views = Number(video.statistics?.viewCount || 0)
    const likes = Number(video.statistics?.likeCount || 0)
    const comments = Number(video.statistics?.commentCount || 0)
    if (!views) return 0
    return ((likes + comments * 2) / views) * 100
  })

  const averageEngagement = engagementRates.reduce((sum, rate) => sum + rate, 0) / Math.max(1, engagementRates.length)
  return clampScore(averageEngagement * 18)
}

function calculateValueScore({
  query,
  videos,
  difficulty,
  growth,
  competition,
  cpm,
  saturation,
}: {
  query: string
  videos: YouTubeVideo[]
  difficulty: number
  growth: string
  competition: NicheAnalysis['competition']
  cpm: string
  saturation: string
}): ValueScore {
  const totalViews = videos.reduce((sum, video) => sum + Number(video.statistics?.viewCount || 0), 0)
  const avgViews = videos.length ? totalViews / videos.length : 0
  const recentGrowth = parseGrowth(growth)
  const cpmMidpoint = parseCpmMidpoint(cpm)
  const queryLower = query.toLowerCase()
  const hasSearchIntent = /tutorial|how to|guide|tips|review|analytics|strategy/.test(queryLower)
  const audienceResponse = calculateEngagementScore(videos)

  const dimensions: ValueScoreDimension[] = [
    {
      key: 'demand',
      label: 'Demand',
      score: clampScore(Math.log10(avgViews + 1) * 14 + videos.length * 1.5),
      weight: 0.22,
      note: avgViews > 500_000 ? 'Strong proven audience demand.' : 'Demand exists but needs validation through samples.',
    },
    {
      key: 'competition',
      label: 'Competition',
      score: clampScore(100 - difficulty * 9 + (competition === 'Low' ? 12 : competition === 'Medium' ? 4 : -8)),
      weight: 0.2,
      note: competition === 'Low' ? 'Entry window looks accessible.' : competition === 'Medium' ? 'Requires sharper packaging.' : 'Established players may be hard to beat.',
    },
    {
      key: 'commercial',
      label: 'Commercial',
      score: clampScore(cpmMidpoint * 6 + (queryLower.includes('review') || queryLower.includes('business') || queryLower.includes('ai') ? 18 : 8)),
      weight: 0.18,
      note: cpmMidpoint >= 8 ? 'Good advertiser and affiliate fit.' : 'Commercial upside is moderate.',
    },
    {
      key: 'momentum',
      label: 'Momentum',
      score: clampScore(recentGrowth + (saturation === 'Early' ? 14 : saturation === 'Growing' ? 8 : -4)),
      weight: 0.16,
      note: saturation === 'Early' ? 'Early-stage topic with room to rank.' : saturation === 'Growing' ? 'Growing market, move quickly.' : 'More mature market, differentiation matters.',
    },
    {
      key: 'repeatability',
      label: 'Repeatability',
      score: clampScore((hasSearchIntent ? 56 : 44) + audienceResponse * 0.3 + (queryLower.includes('strategy') || queryLower.includes('tips') ? 12 : 4)),
      weight: 0.14,
      note: hasSearchIntent ? 'Search intent and audience response support a repeatable cluster.' : 'Needs a clearer repeatable format.',
    },
    {
      key: 'execution',
      label: 'Execution',
      score: clampScore(92 - difficulty * 6 + (queryLower.includes('tutorial') || queryLower.includes('tips') ? 8 : 0)),
      weight: 0.1,
      note: difficulty <= 4 ? 'Feasible for a lean creator workflow.' : 'Needs stronger research and production quality.',
    },
  ]

  const total = clampScore(dimensions.reduce((sum, item) => sum + item.score * item.weight, 0))
  const grade = total >= 85 ? 'A' : total >= 72 ? 'B' : total >= 60 ? 'C' : 'D'
  const verdict = total >= 85
    ? 'High-value opportunity'
    : total >= 72
      ? 'Worth testing'
      : total >= 60
        ? 'Validate before committing'
        : 'Low priority'
  const recommendation = total >= 85
    ? 'Build a 5-video cluster now and use the top samples as benchmarks.'
    : total >= 72
      ? 'Analyze one sample, compare two winners, then publish a focused test.'
      : total >= 60
        ? 'Open the ranking samples first and look for weak hooks before producing.'
        : 'Keep watching, but prioritize stronger opportunities first.'

  return { total, grade, verdict, recommendation, dimensions }
}

function getCompareHref(videos: YouTubeVideo[]) {
  const ids = videos.map(getVideoId).filter(Boolean)
  if (ids.length < 2) return '/compare-new?type=videos'
  return `/compare-new?type=videos&left=${encodeURIComponent(ids[0])}&right=${encodeURIComponent(ids[1])}`
}

function getTopVideoHref(videos: YouTubeVideo[]) {
  const id = getVideoId(videos[0])
  return id ? `/video/${encodeURIComponent(id)}` : '/youtube-video-analyzer'
}

function getOpportunityHistoryItem(niche: NicheAnalysis) {
  return {
    id: niche.query.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    niche: niche.niche,
    query: niche.query,
    score: niche.valueScore.total,
    grade: niche.valueScore.grade,
    verdict: niche.valueScore.verdict,
    recommendation: niche.valueScore.recommendation,
    href: getTopVideoHref(niche.videos),
    compareHref: getCompareHref(niche.videos),
  }
}

export default async function LowCompetitionKeywordsPage() {
  const nicheAnalysis: NicheAnalysis[] = await Promise.all(
    NICHE_QUERIES.map(async ({ niche, query }) => {
      const videos = await searchYouTubeMulti([query], 20, 'relevance')
      const competition = analyzeCompetition(videos)
      const searchVolume = estimateSearchVolume(videos)
      const growth = calculateGrowth(videos)
      const cpm = estimateCPM(query)
      const valueScore = calculateValueScore({
        query,
        videos,
        difficulty: competition.difficulty,
        growth,
        competition: competition.level,
        cpm,
        saturation: getSaturationLabel(competition.saturation),
      })

      return {
        niche,
        query,
        videos,
        searchVolume,
        competition: competition.level,
        cpm,
        growth,
        saturation: getSaturationLabel(competition.saturation),
        difficulty: competition.difficulty,
        videoCount: competition.videoCount,
        opportunityScore: valueScore.total,
        valueScore,
      }
    })
  )

  const sortedNiches = nicheAnalysis.sort((a, b) => b.opportunityScore - a.opportunityScore)
  const featuredNiche = sortedNiches[0]

  return (
    <main className="min-h-screen bg-white text-gray-900 terminal-grid relative overflow-hidden">
      <div className="ambient-glow-tl" />
      <div className="ambient-glow-tr" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 sm:mb-8">
          <span className="text-lg" aria-hidden="true">{'<'}</span>
          <span className="text-sm font-medium">Back to TubeFission</span>
        </Link>

        <section className="mb-8 sm:mb-10">
          <div className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase mb-2 data-mono">NICHE DECISION WORKFLOW</div>
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-glow text-gray-900">
                Low Competition Keywords
              </h1>
              <p className="text-gray-500 text-sm sm:text-base max-w-2xl leading-relaxed">
                Use this page as a decision path: find an underserved keyword, validate the ranking videos, compare the best samples, then turn the winner into your next upload brief.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
              <Link href="#opportunities" className="rounded-xl border border-gray-200 bg-white p-3 text-sm font-semibold text-gray-800 hover:border-red-200 hover:bg-red-50">
                Pick niche
              </Link>
              <Link href="#samples" className="rounded-xl border border-gray-200 bg-white p-3 text-sm font-semibold text-gray-800 hover:border-red-200 hover:bg-red-50">
                Validate videos
              </Link>
              <Link href={featuredNiche ? getCompareHref(featuredNiche.videos) : '/compare-new?type=videos'} className="rounded-xl border border-gray-200 bg-white p-3 text-sm font-semibold text-gray-800 hover:border-red-200 hover:bg-red-50">
                Compare samples
              </Link>
              <Link href="/ai-assistant" className="rounded-xl border border-gray-200 bg-white p-3 text-sm font-semibold text-gray-800 hover:border-red-200 hover:bg-red-50">
                Build plan
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-8 grid gap-3 md:grid-cols-4">
          {JOURNEY_STEPS.map((item) => (
            <div key={item.step} className="rounded-2xl border border-gray-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-sm font-black text-red-700">{item.step}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{item.label}</span>
              </div>
              <h2 className="text-sm font-bold text-gray-900">{item.title}</h2>
              <p className="mt-2 text-xs leading-relaxed text-gray-500">{item.copy}</p>
            </div>
          ))}
        </section>

        <section className="mb-8 rounded-2xl border border-red-100 bg-red-50 p-4 sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-red-700">TubeFission Value Score</div>
              <h2 className="mt-1 text-lg font-black text-gray-900">One score, six business signals</h2>
            </div>
            <p className="text-sm leading-relaxed text-gray-700">
              The product now grades every niche by demand, competition, commercial value, momentum, repeatability, and execution difficulty, then turns that score into a concrete recommendation.
            </p>
          </div>
        </section>

        <div className="mb-8">
          <ProductValueWorkflow compact />
        </div>

        <div className="mb-8">
          <OpportunityHistoryPanel current={featuredNiche ? getOpportunityHistoryItem(featuredNiche) : undefined} />
        </div>

        <section id="opportunities" className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] mb-12">
          <div className="glass-panel rounded-2xl overflow-hidden border border-gray-200">
            <div className="p-5 border-b border-gray-200">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Opportunity Board</h2>
                  <p className="text-sm text-gray-500 mt-1">Sorted by multidimensional value: demand, competition, commercial upside, momentum, repeatability, and execution fit.</p>
                </div>
                <Link href="/youtube-keyword-research" className="inline-flex w-fit items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                  Research custom keyword
                </Link>
              </div>
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Niche</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Value Score</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Volume</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Competition</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Value</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Next step</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedNiches.map((niche) => (
                    <tr key={niche.niche} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-900">{niche.niche}</div>
                        <div className="text-xs text-gray-400">{niche.videoCount} videos analyzed</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="font-black text-gray-900">{niche.valueScore.total}</div>
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-black text-gray-700">{niche.valueScore.grade}</span>
                        </div>
                        <div className="mt-1 h-1.5 w-20 overflow-hidden rounded-full bg-gray-100">
                          <div className="h-full rounded-full bg-red-500" style={{ width: `${niche.opportunityScore}%` }} />
                        </div>
                        <div className="mt-1 text-xs text-gray-500">{niche.valueScore.verdict}</div>
                      </td>
                      <td className="px-4 py-4 text-gray-600">{niche.searchVolume}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${
                          niche.competition === 'Low' ? 'bg-green-100 text-green-700' :
                          niche.competition === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {niche.competition}
                        </span>
                        <div className="mt-1 text-xs text-gray-400">{niche.saturation}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-gray-600">{niche.cpm}</div>
                        <div className="text-xs font-bold text-green-600">{niche.growth}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-2">
                          <Link href={getTopVideoHref(niche.videos)} className="rounded-lg bg-red-600 px-3 py-2 text-center text-xs font-bold text-white hover:bg-red-700">
                            Analyze sample
                          </Link>
                          <Link href={getCompareHref(niche.videos)} className="rounded-lg border border-gray-200 px-3 py-2 text-center text-xs font-bold text-gray-700 hover:bg-gray-50">
                            Compare
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-3 p-4 md:hidden">
              {sortedNiches.map((niche) => (
                <div key={niche.niche} className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{niche.niche}</h3>
                      <p className="mt-1 text-xs text-gray-500">{niche.videoCount} videos analyzed</p>
                    </div>
                    <div className="shrink-0 rounded-xl bg-red-50 px-3 py-2 text-center">
                      <div className="text-lg font-black text-red-700">{niche.valueScore.total}</div>
                      <div className="text-[10px] font-bold uppercase text-red-600">Grade {niche.valueScore.grade}</div>
                    </div>
                  </div>
                  <div className="mt-3 rounded-lg bg-gray-50 p-3 text-xs font-medium text-gray-600">
                    {niche.valueScore.verdict}: {niche.valueScore.recommendation}
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-lg bg-gray-50 p-3">
                      <div className="text-xs text-gray-500">Volume</div>
                      <div className="font-bold text-gray-900">{niche.searchVolume}</div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3">
                      <div className="text-xs text-gray-500">CPM</div>
                      <div className="font-bold text-gray-900">{niche.cpm}</div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3">
                      <div className="text-xs text-gray-500">Competition</div>
                      <div className="font-bold text-gray-900">{niche.competition}</div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3">
                      <div className="text-xs text-gray-500">Trend</div>
                      <div className="font-bold text-green-600">{niche.growth}</div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link href={getTopVideoHref(niche.videos)} className="rounded-lg bg-red-600 px-3 py-2 text-center text-xs font-bold text-white">
                      Analyze sample
                    </Link>
                    <Link href={getCompareHref(niche.videos)} className="rounded-lg border border-gray-200 px-3 py-2 text-center text-xs font-bold text-gray-700">
                      Compare
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {featuredNiche && (
            <aside className="space-y-6">
              <div className="glass-panel rounded-2xl p-5 border border-gray-200">
                <div className="text-xs font-bold uppercase tracking-wider text-red-600">Recommended next move</div>
                <h2 className="mt-2 text-xl font-bold text-gray-900">{featuredNiche.niche}</h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {featuredNiche.valueScore.verdict}. {featuredNiche.valueScore.recommendation}
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-gray-50 p-3">
                    <div className="text-xs uppercase tracking-wider text-gray-400">Value score</div>
                    <div className="font-black text-gray-900">{featuredNiche.valueScore.total}/100</div>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3">
                    <div className="text-xs uppercase tracking-wider text-gray-400">Grade</div>
                    <div className="font-black text-gray-900">{featuredNiche.valueScore.grade}</div>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3">
                    <div className="text-xs uppercase tracking-wider text-gray-400">Trend</div>
                    <div className="font-black text-green-600">{featuredNiche.growth}</div>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3">
                    <div className="text-xs uppercase tracking-wider text-gray-400">Est. volume</div>
                    <div className="font-black text-gray-900">{featuredNiche.searchVolume}</div>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {featuredNiche.valueScore.dimensions.map((dimension) => (
                    <div key={dimension.key}>
                      <div className="mb-1 flex items-center justify-between gap-3 text-xs">
                        <span className="font-bold text-gray-700">{dimension.label}</span>
                        <span className="font-black text-gray-900">{dimension.score}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                        <div className="h-full rounded-full bg-red-500" style={{ width: `${dimension.score}%` }} />
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-gray-500">{dimension.note}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 grid gap-2">
                  <Link href={getTopVideoHref(featuredNiche.videos)} className="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700">
                    Validate top ranking video
                  </Link>
                  <Link href={getCompareHref(featuredNiche.videos)} className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-800 hover:bg-gray-50">
                    Compare the first two samples
                  </Link>
                </div>
              </div>

              <div id="samples" className="glass-panel rounded-2xl p-5 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Ranking Samples To Validate</h2>
                <div className="space-y-3">
                  {featuredNiche.videos.slice(0, 3).map((video) => (
                    <Link key={getVideoId(video) || video.snippet?.title} href={getTopVideoHref([video])} className="block rounded-xl border border-gray-100 p-3 hover:border-red-200 hover:bg-gray-50 transition">
                      <div className="font-medium text-gray-900 line-clamp-2 mb-1">{video.snippet?.title}</div>
                      <div className="text-xs text-gray-500 mb-1">{video.snippet?.channelTitle}</div>
                      <div className="text-xs text-gray-400">{formatNumber(video.statistics?.viewCount)} views</div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          )}
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Decision Rules</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: 'Only enter with proof',
                copy: 'Open at least one ranking sample. If the top videos have weak hooks or thin descriptions, the niche may be easy to improve.',
              },
              {
                title: 'Compare before producing',
                copy: 'Do not copy one video blindly. Compare two samples to separate reusable structure from accidental performance.',
              },
              {
                title: 'Ship a 5-video cluster',
                copy: 'Low competition works best when you publish a small topical cluster quickly: one broad guide, three long-tail answers, and one comparison.',
              },
            ].map((item, index) => (
              <div key={item.title} className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-sm font-black text-red-700">{index + 1}</div>
                <h3 className="font-bold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{item.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900">FAQ</h2>
          <div className="space-y-3">
            {[
              { q: 'What makes a keyword low competition?', a: 'Low competition keywords have clear demand but few strong videos satisfying the search intent. They are often emerging topics or specific long-tail phrases.' },
              { q: 'What should I do after finding one?', a: 'Open the top ranking sample, inspect its hook and content timeline, compare it against a second sample, then create a brief for a stronger next upload.' },
              { q: 'Should I only target low competition keywords?', a: 'Use a mix: 70% low competition for quick learning, 20% medium competition for growth, and 10% high competition for authority signals.' },
            ].map((item) => (
              <div key={item.q} className="glass-panel rounded-xl p-4">
                <h3 className="font-bold text-sm mb-1 text-gray-900">{item.q}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel neon-border rounded-2xl p-6 sm:p-8 glow-hover">
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-xl font-bold mb-2 text-gray-900">Ready to turn this into a content plan?</h2>
              <p className="text-gray-500 text-sm max-w-2xl">
                Move from keyword discovery into a concrete creator workflow: validate a sample, compare benchmarks, then draft the next upload.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link href={featuredNiche ? getTopVideoHref(featuredNiche.videos) : '/youtube-video-analyzer'} className="inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700">
                Analyze sample
              </Link>
              <Link href="/ai-assistant" className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-800 hover:bg-gray-50">
                Build next brief
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
