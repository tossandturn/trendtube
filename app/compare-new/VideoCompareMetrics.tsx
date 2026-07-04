'use client'

import {
  Bar,
  BarChart,
  Radar,
  RadarChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface VideoCompareMetricsProps {
  leftVideo: CompareVideo
  rightVideo: CompareVideo
}

interface CompareVideo {
  id?: string
  snippet?: {
    title?: string
    description?: string
    channelTitle?: string
    publishedAt?: string
  }
  statistics?: {
    viewCount?: string
    likeCount?: string
    commentCount?: string
  }
}

type Side = 'left' | 'right' | 'tie'

interface VideoAnalysis {
  title: string
  channelTitle: string
  views: number
  likes: number
  comments: number
  ageDays: number
  engagementRate: number
  likeRate: number
  commentRate: number
  velocity: number
  conversationDepth: number
  topic: string
  format: string
  audience: {
    age: string
    gender: string
    geography: string
    language: string
  }
  scores: {
    reach: number
    engagement: number
    stickiness: number
    commercial: number
    regionalFit: number
    packaging: number
    efficiency: number
    lifecycle: number
    overall: number
  }
  businessModel: string
  monetizationFit: string
  risk: string
}

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value))
}

function formatNumber(n: string | number | undefined) {
  const num = Number(n || 0)
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B'
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M'
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K'
  return Math.round(num).toLocaleString()
}

function safePercent(value: number, digits = 2) {
  return `${value.toFixed(digits)}%`
}

function getAgeDays(video: CompareVideo) {
  const publishedAt = video.snippet?.publishedAt
  if (!publishedAt) return 30
  const ageMs = Date.now() - new Date(publishedAt).getTime()
  return Math.max(1, ageMs / (1000 * 60 * 60 * 24))
}

function getText(video: CompareVideo) {
  return `${video.snippet?.title || ''} ${video.snippet?.description || ''}`.toLowerCase()
}

function inferTopic(video: CompareVideo) {
  const text = getText(video)
  if (/ai|chatgpt|openai|automation|agent/.test(text)) return 'AI / productivity'
  if (/finance|business|startup|money|invest|marketing|saas/.test(text)) return 'Business / finance'
  if (/gaming|minecraft|roblox|fortnite|gameplay/.test(text)) return 'Gaming'
  if (/beauty|fashion|makeup|skincare|style/.test(text)) return 'Beauty / lifestyle'
  if (/food|recipe|cooking|restaurant/.test(text)) return 'Food'
  if (/music|song|album|dance|cover/.test(text)) return 'Music / entertainment'
  if (/football|soccer|nba|nfl|sports/.test(text)) return 'Sports'
  if (/tutorial|how to|guide|learn|course/.test(text)) return 'Education / tutorial'
  return 'General entertainment'
}

function inferFormat(video: CompareVideo) {
  const text = getText(video)
  if (/shorts|#shorts|tiktok|reels/.test(text)) return 'Short-form discovery'
  if (/how to|tutorial|guide|explained|course/.test(text)) return 'Tutorial / evergreen'
  if (/review|vs|comparison|best .* tool|tested/.test(text)) return 'Review / comparison'
  if (/reaction|reacts|commentary|analysis/.test(text)) return 'Commentary'
  if (/challenge|i tried|24 hours|last to/.test(text)) return 'Challenge / spectacle'
  return 'Broad appeal video'
}

function inferAudience(video: CompareVideo) {
  const text = getText(video)

  let age = 'Mixed 18-34'
  if (/school|student|teen|gaming|anime|shorts|roblox|minecraft/.test(text)) age = 'Younger 16-24'
  else if (/finance|business|marketing|career|invest|productivity|ai/.test(text)) age = 'Adult 25-44'
  else if (/parent|home|retirement|real estate/.test(text)) age = 'Adult 35+'

  let gender = 'Balanced'
  if (/football|gaming|crypto|cars|nfl|nba|coding/.test(text)) gender = 'Male-leaning'
  else if (/beauty|fashion|makeup|wedding|mom|skincare/.test(text)) gender = 'Female-leaning'

  let geography = 'Broad English-speaking'
  if (/india|hindi|bollywood|delhi|mumbai/.test(text)) geography = 'India-focused'
  else if (/korea|k-pop|kdrama|seoul/.test(text)) geography = 'Korea-focused'
  else if (/japan|anime|manga|tokyo/.test(text)) geography = 'Japan-leaning'
  else if (/uk|premier league|london/.test(text)) geography = 'UK-leaning'
  else if (/usa|american|nfl|nba|new york|los angeles/.test(text)) geography = 'US-leaning'
  else if (/brasil|brazil|portuguese/.test(text)) geography = 'Brazil / Portuguese'
  else if (/méxico|mexico|spanish|latam/.test(text)) geography = 'LATAM / Spanish'

  let language = 'Likely English'
  if (/hindi|bollywood|india/.test(text)) language = 'Hindi / English mix'
  else if (/k-pop|korea|korean/.test(text)) language = 'Korean / global fandom'
  else if (/japan|anime|manga/.test(text)) language = 'Japanese / global fandom'
  else if (/spanish|méxico|mexico|latam/.test(text)) language = 'Spanish'
  else if (/portuguese|brasil|brazil/.test(text)) language = 'Portuguese'

  return { age, gender, geography, language }
}

function inferBusinessModel(topic: string, format: string) {
  if (topic === 'Business / finance' || topic === 'AI / productivity') return 'High-value sponsorships, affiliate, software leads'
  if (topic === 'Education / tutorial') return 'Course, template, affiliate, newsletter capture'
  if (format === 'Review / comparison') return 'Affiliate and buyer-intent sponsorship'
  if (topic === 'Beauty / lifestyle') return 'Brand sponsorship and product placement'
  if (topic === 'Gaming') return 'Sponsorship, merch, live community'
  if (topic === 'Music / entertainment') return 'Awareness, catalog lift, platform distribution'
  return 'Ad revenue, sponsorship, audience growth'
}

function inferRisk(topic: string, format: string, engagementRate: number, commentRate: number) {
  if (engagementRate < 1) return 'Low audience response: do not copy until hook and retention are reviewed.'
  if (format === 'Short-form discovery') return 'Discovery-heavy: validate whether viewers convert into repeat audience.'
  if (topic === 'General entertainment' && commentRate < 0.05) return 'Broad reach but shallow intent: commercial value may be weaker.'
  if (format === 'Challenge / spectacle') return 'Execution cost may be high; copy the promise, not the production budget.'
  return 'Moderate risk: validate with more videos in the same niche.'
}

function analyzeVideo(video: CompareVideo): VideoAnalysis {
  const views = Number(video.statistics?.viewCount || 0)
  const likes = Number(video.statistics?.likeCount || 0)
  const comments = Number(video.statistics?.commentCount || 0)
  const ageDays = getAgeDays(video)
  const engagementRate = views ? ((likes + comments * 2) / views) * 100 : 0
  const likeRate = views ? (likes / views) * 100 : 0
  const commentRate = views ? (comments / views) * 100 : 0
  const velocity = views / ageDays
  const conversationDepth = likes ? (comments / likes) * 100 : 0
  const topic = inferTopic(video)
  const format = inferFormat(video)
  const audience = inferAudience(video)

  const reach = clamp(Math.log10(views + 1) * 12)
  const engagement = clamp(engagementRate * 16)
  const stickiness = clamp(commentRate * 900 + conversationDepth * 3)
  const commercial = clamp(
    (topic === 'Business / finance' || topic === 'AI / productivity' ? 36 : 18) +
    (topic === 'Education / tutorial' ? 24 : 0) +
    (format === 'Review / comparison' ? 24 : 0) +
    engagementRate * 5 +
    Math.log10(views + 1) * 4
  )
  const regionalFit = clamp(
    55 +
    (audience.geography === 'Broad English-speaking' ? 18 : 10) +
    (audience.language === 'Likely English' ? 12 : 8) +
    (topic === 'Music / entertainment' || topic === 'Gaming' ? 8 : 0)
  )
  const packaging = clamp(likeRate * 18 + Math.log10(views + 1) * 5)
  const efficiency = clamp(Math.log10(velocity + 1) * 16 + engagementRate * 5)
  const lifecycle = clamp(
    (format === 'Tutorial / evergreen' || format === 'Review / comparison' ? 72 : 48) +
    (ageDays > 30 && velocity > 10000 ? 18 : 0) +
    (format === 'Short-form discovery' ? -10 : 0)
  )

  const overall = Math.round(
    reach * 0.16 +
    engagement * 0.16 +
    stickiness * 0.14 +
    commercial * 0.18 +
    regionalFit * 0.1 +
    packaging * 0.1 +
    efficiency * 0.1 +
    lifecycle * 0.06
  )

  return {
    title: video.snippet?.title || 'Untitled video',
    channelTitle: video.snippet?.channelTitle || 'Unknown channel',
    views,
    likes,
    comments,
    ageDays,
    engagementRate,
    likeRate,
    commentRate,
    velocity,
    conversationDepth,
    topic,
    format,
    audience,
    scores: {
      reach: Math.round(reach),
      engagement: Math.round(engagement),
      stickiness: Math.round(stickiness),
      commercial: Math.round(commercial),
      regionalFit: Math.round(regionalFit),
      packaging: Math.round(packaging),
      efficiency: Math.round(efficiency),
      lifecycle: Math.round(lifecycle),
      overall,
    },
    businessModel: inferBusinessModel(topic, format),
    monetizationFit: commercial >= 75 ? 'Strong commercial fit' : commercial >= 55 ? 'Moderate commercial fit' : 'Awareness-first fit',
    risk: inferRisk(topic, format, engagementRate, commentRate),
  }
}

function getWinner(left: number, right: number): Side {
  if (Math.abs(left - right) < 0.0001) return 'tie'
  return left > right ? 'left' : 'right'
}

function winnerLabel(side: Side) {
  if (side === 'tie') return 'Tie'
  return side === 'left' ? 'Video A' : 'Video B'
}

function getScoreColor(score: number) {
  if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200'
  if (score >= 65) return 'text-blue-700 bg-blue-50 border-blue-200'
  if (score >= 50) return 'text-amber-700 bg-amber-50 border-amber-200'
  return 'text-gray-700 bg-gray-50 border-gray-200'
}

function buildDecision(left: VideoAnalysis, right: VideoAnalysis) {
  const overallWinner = getWinner(left.scores.overall, right.scores.overall)
  const commercialWinner = getWinner(left.scores.commercial, right.scores.commercial)
  const stickinessWinner = getWinner(left.scores.stickiness, right.scores.stickiness)
  const efficiencyWinner = getWinner(left.scores.efficiency, right.scores.efficiency)

  let headline = `${winnerLabel(overallWinner)} is the stronger strategic benchmark`
  if (overallWinner === 'tie') headline = 'Both videos are close; pick based on your business goal'

  const recommendation = [
    commercialWinner !== 'tie'
      ? `${winnerLabel(commercialWinner)} has better monetization potential.`
      : 'Commercial potential is similar.',
    stickinessWinner !== 'tie'
      ? `${winnerLabel(stickinessWinner)} shows stronger fan-response signals.`
      : 'Fan-response quality is close.',
    efficiencyWinner !== 'tie'
      ? `${winnerLabel(efficiencyWinner)} is moving faster relative to publish age.`
      : 'Momentum efficiency is close.',
  ].join(' ')

  return { headline, recommendation, overallWinner, commercialWinner, stickinessWinner, efficiencyWinner }
}

function DimensionCard({
  title,
  description,
  left,
  right,
  format,
}: {
  title: string
  description: string
  left: number
  right: number
  format?: (value: number) => string
}) {
  const max = Math.max(left, right, 1)
  const winner = getWinner(left, right)
  const display = format || ((value: number) => String(Math.round(value)))

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold text-gray-900">{title}</div>
          <p className="mt-1 text-xs text-gray-500">{description}</p>
        </div>
        {winner !== 'tie' && (
          <span className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-bold ${winner === 'left' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'}`}>
            {winnerLabel(winner)}
          </span>
        )}
      </div>
      <div className="space-y-3">
        <div>
          <div className="mb-1 flex justify-between text-xs">
            <span className="font-medium text-blue-700">Video A</span>
            <span className="font-bold text-gray-900">{display(left)}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-blue-500" style={{ width: `${(left / max) * 100}%` }} />
          </div>
        </div>
        <div>
          <div className="mb-1 flex justify-between text-xs">
            <span className="font-medium text-red-700">Video B</span>
            <span className="font-bold text-gray-900">{display(right)}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-red-500" style={{ width: `${(right / max) * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VideoCompareMetrics({ leftVideo, rightVideo }: VideoCompareMetricsProps) {
  const left = analyzeVideo(leftVideo)
  const right = analyzeVideo(rightVideo)
  const decision = buildDecision(left, right)

  const scoreRows = [
    { dimension: 'Reach', A: left.scores.reach, B: right.scores.reach },
    { dimension: 'Engagement', A: left.scores.engagement, B: right.scores.engagement },
    { dimension: 'Fan Stickiness', A: left.scores.stickiness, B: right.scores.stickiness },
    { dimension: 'Commercial Value', A: left.scores.commercial, B: right.scores.commercial },
    { dimension: 'Region Fit', A: left.scores.regionalFit, B: right.scores.regionalFit },
    { dimension: 'Efficiency', A: left.scores.efficiency, B: right.scores.efficiency },
  ]

  const rawMetricRows = [
    { metric: 'Views', left: left.views, right: right.views },
    { metric: 'Views / day', left: left.velocity, right: right.velocity },
    { metric: 'Likes', left: left.likes, right: right.likes },
    { metric: 'Comments', left: left.comments, right: right.comments },
  ]

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Analyst verdict</div>
            <h3 className="text-xl font-bold text-gray-900">{decision.headline}</h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">{decision.recommendation}</p>
            <p className="mt-3 text-xs leading-relaxed text-gray-500">
              Scores are inferred from public YouTube data: views, likes, comments, publish age, title/description signals, and format patterns. They do not use private retention, revenue, or geographic analytics.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Video A', left.scores.overall, 'blue'],
              ['Video B', right.scores.overall, 'red'],
            ].map(([label, score, color]) => (
              <div key={String(label)} className={`rounded-xl border p-4 ${getScoreColor(Number(score))}`}>
                <div className="text-xs font-bold uppercase tracking-wider">{label}</div>
                <div className="mt-2 text-4xl font-black">{score}</div>
                <div className="mt-1 text-xs">{color === 'blue' ? left.monetizationFit : right.monetizationFit}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
        <div className="mb-5 flex flex-col gap-1">
          <h3 className="text-lg font-bold text-gray-900">Professional Scorecard</h3>
          <p className="text-sm text-gray-500">A product and data-analysis view of which video is more useful to benchmark.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-80 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={scoreRows}>
                <PolarGrid />
                <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar name="Video A" dataKey="A" stroke="#2563eb" fill="#2563eb" fillOpacity={0.22} />
                <Radar name="Video B" dataKey="B" stroke="#dc2626" fill="#dc2626" fillOpacity={0.18} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <DimensionCard title="Commercial Value" description="Buyer intent, sponsor fit, affiliate potential." left={left.scores.commercial} right={right.scores.commercial} />
            <DimensionCard title="Fan Stickiness" description="Comment intensity and deeper audience response." left={left.scores.stickiness} right={right.scores.stickiness} />
            <DimensionCard title="Region Fit" description="Language and geography scalability signals." left={left.scores.regionalFit} right={right.scores.regionalFit} />
            <DimensionCard title="Content Efficiency" description="Views per day adjusted by engagement quality." left={left.scores.efficiency} right={right.scores.efficiency} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5">
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-blue-700">Video A business read</div>
          <h4 className="font-bold text-gray-900 line-clamp-2">{left.title}</h4>
          <div className="mt-4 space-y-2 text-sm text-gray-700">
            <div><span className="font-medium text-gray-500">Topic:</span> {left.topic}</div>
            <div><span className="font-medium text-gray-500">Format:</span> {left.format}</div>
            <div><span className="font-medium text-gray-500">Business model:</span> {left.businessModel}</div>
            <div><span className="font-medium text-gray-500">Audience:</span> {left.audience.age}, {left.audience.gender}</div>
            <div><span className="font-medium text-gray-500">Region:</span> {left.audience.geography} ({left.audience.language})</div>
            <div><span className="font-medium text-gray-500">Risk:</span> {left.risk}</div>
          </div>
        </div>
        <div className="rounded-2xl border border-red-200 bg-red-50/50 p-5">
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-red-700">Video B business read</div>
          <h4 className="font-bold text-gray-900 line-clamp-2">{right.title}</h4>
          <div className="mt-4 space-y-2 text-sm text-gray-700">
            <div><span className="font-medium text-gray-500">Topic:</span> {right.topic}</div>
            <div><span className="font-medium text-gray-500">Format:</span> {right.format}</div>
            <div><span className="font-medium text-gray-500">Business model:</span> {right.businessModel}</div>
            <div><span className="font-medium text-gray-500">Audience:</span> {right.audience.age}, {right.audience.gender}</div>
            <div><span className="font-medium text-gray-500">Region:</span> {right.audience.geography} ({right.audience.language})</div>
            <div><span className="font-medium text-gray-500">Risk:</span> {right.risk}</div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
        <h3 className="mb-4 text-lg font-bold text-gray-900">Data Benchmarks</h3>
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <DimensionCard title="Engagement Rate" description="Weighted likes + comments per view." left={left.engagementRate} right={right.engagementRate} format={(v) => safePercent(v)} />
            <DimensionCard title="Comment Rate" description="Conversation signal per view." left={left.commentRate} right={right.commentRate} format={(v) => safePercent(v, 3)} />
            <DimensionCard title="Views Per Day" description="Momentum normalized by publish age." left={left.velocity} right={right.velocity} format={(v) => formatNumber(v)} />
          </div>
          <div className="h-72 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rawMetricRows} layout="vertical" margin={{ left: 82, right: 24, top: 8, bottom: 8 }}>
                <XAxis type="number" tickFormatter={(value) => formatNumber(value)} />
                <YAxis dataKey="metric" type="category" width={78} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => formatNumber(Number(value))} />
                <Bar dataKey="left" name="Video A" fill="#2563eb" radius={[0, 4, 4, 0]} />
                <Bar dataKey="right" name="Video B" fill="#dc2626" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
        <h3 className="mb-4 text-lg font-bold text-gray-900">PM Action Plan</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-2 font-semibold text-gray-900">If optimizing revenue</div>
            <p className="text-sm text-gray-600">
              Benchmark {winnerLabel(decision.commercialWinner)}. Study topic intent, sponsor category, and whether the CTA can naturally point to a product or service.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-2 font-semibold text-gray-900">If optimizing community</div>
            <p className="text-sm text-gray-600">
              Benchmark {winnerLabel(decision.stickinessWinner)}. Reuse the question, conflict, or identity hook that makes viewers comment rather than just watch.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-2 font-semibold text-gray-900">If optimizing regional growth</div>
            <p className="text-sm text-gray-600">
              Compare the region and language clues before copying. A local fandom signal may outperform globally but fail in your target market.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
