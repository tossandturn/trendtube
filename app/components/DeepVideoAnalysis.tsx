'use client'

interface DeepVideoAnalysisProps {
  video: {
    id?: string
    snippet?: {
      title?: string
      description?: string
      channelTitle?: string
      publishedAt?: string
      tags?: string[]
      categoryId?: string
    }
    statistics?: {
      viewCount?: string
      likeCount?: string
      commentCount?: string
    }
  }
  velocity: number
  engagementRate: number
}

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value))
}

function formatNumber(value: number) {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return Math.round(value).toLocaleString()
}

function getText(video: DeepVideoAnalysisProps['video']) {
  return `${video.snippet?.title || ''} ${video.snippet?.description || ''}`.toLowerCase()
}

function extractKeywords(video: DeepVideoAnalysisProps['video']) {
  const title = video.snippet?.title || ''
  const description = video.snippet?.description || ''
  const tags = (video.snippet?.tags || []).slice(0, 8)
  const source = `${title} ${description}`
  const stopWords = new Set(['the', 'and', 'for', 'you', 'with', 'this', 'that', 'from', 'your', 'have', 'what', 'when', 'where', 'why', 'how', 'are', 'was', 'but', 'not', 'can', 'all', 'new', 'video', 'youtube'])
  const words = source
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[^a-z0-9#@ ]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word))

  const counts = new Map<string, number>()
  words.forEach((word) => counts.set(word, (counts.get(word) || 0) + 1))

  const inferred = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word)

  return Array.from(new Set([...tags, ...inferred])).slice(0, 12)
}

function inferTopic(text: string) {
  if (/ai|chatgpt|openai|automation|agent/.test(text)) return 'AI / productivity'
  if (/business|money|startup|finance|marketing|saas|sales/.test(text)) return 'Business / money'
  if (/gaming|minecraft|roblox|fortnite|gameplay/.test(text)) return 'Gaming'
  if (/tutorial|how to|guide|learn|course/.test(text)) return 'Tutorial / education'
  if (/review|vs|comparison|tested|best/.test(text)) return 'Review / comparison'
  if (/shorts|#shorts|tiktok|reels/.test(text)) return 'Short-form trend'
  if (/music|song|dance|album/.test(text)) return 'Music / entertainment'
  return 'General entertainment'
}

function inferTrafficMix(video: DeepVideoAnalysisProps['video'], engagementRate: number, velocity: number) {
  const text = getText(video)
  const title = video.snippet?.title || ''
  const description = video.snippet?.description || ''
  const hasSearchIntent = /how to|tutorial|guide|review|best|vs|explained|tips|learn/.test(text)
  const hasTrendIntent = /shorts|viral|trend|challenge|reaction|breaking|new/.test(text)
  const hasExternalSupport = /https?:\/\/|instagram|tiktok|discord|newsletter|website|shop/.test(description.toLowerCase())
  const strongPackaging = /!|\?|[0-9]/.test(title) || title.length <= 62

  let search = hasSearchIntent ? 36 : 18
  let browse = strongPackaging ? 34 : 24
  let suggested = velocity > 100_000 || hasTrendIntent ? 28 : 20
  let external = hasExternalSupport ? 12 : 5

  const total = search + browse + suggested + external
  search = Math.round((search / total) * 100)
  browse = Math.round((browse / total) * 100)
  suggested = Math.round((suggested / total) * 100)
  external = Math.max(0, 100 - search - browse - suggested)

  const primary = [
    { name: 'Search', value: search },
    { name: 'Browse', value: browse },
    { name: 'Suggested', value: suggested },
    { name: 'External', value: external },
  ].sort((a, b) => b.value - a.value)[0]

  return {
    primary: primary.name,
    rows: [
      { name: 'Search', value: search, note: hasSearchIntent ? 'Strong query intent in title/description' : 'Limited explicit search phrasing' },
      { name: 'Browse', value: browse, note: strongPackaging ? 'Packaging likely supports homepage clicks' : 'Packaging may need sharper promise' },
      { name: 'Suggested', value: suggested, note: velocity > 100_000 ? 'Momentum supports recommendation spread' : 'Recommendation spread appears moderate' },
      { name: 'External', value: external, note: hasExternalSupport ? 'Description includes off-platform links/signals' : 'Few public external distribution signals' },
    ],
    quality: engagementRate >= 4 ? 'Traffic quality looks strong' : engagementRate >= 2 ? 'Traffic quality looks moderate' : 'Traffic may be shallow',
  }
}

function buildCopyAnalysis(video: DeepVideoAnalysisProps['video']) {
  const title = video.snippet?.title || ''
  const description = video.snippet?.description || ''
  const titleHasNumber = /\d/.test(title)
  const titleHasQuestion = title.includes('?')
  const titleHasEmotion = /insane|secret|best|worst|shocking|amazing|finally|never|biggest|crazy/i.test(title)
  const titleHasOutcome = /how to|why|what happens|i tried|tested|before|after|without/i.test(title)
  const descriptionLength = description.length

  const hookType = titleHasOutcome
    ? 'Outcome promise'
    : titleHasQuestion
      ? 'Curiosity question'
      : titleHasEmotion
        ? 'Emotional hook'
        : titleHasNumber
          ? 'Specificity hook'
          : 'Broad curiosity'

  const strengths = [
    title.length <= 62 ? 'Mobile-friendly title length' : 'Title has enough detail but may truncate on mobile',
    titleHasNumber ? 'Uses specificity through numbers' : 'Could add a number or concrete scope',
    titleHasOutcome ? 'Clear viewer payoff or experiment promise' : 'Viewer payoff could be more explicit',
    descriptionLength > 300 ? 'Description gives search/session context' : 'Description is thin for search support',
  ]

  return {
    hookType,
    titleLength: title.length,
    descriptionLength,
    strengths,
  }
}

function buildSeoAnalysis(video: DeepVideoAnalysisProps['video'], keywords: string[]) {
  const title = video.snippet?.title || ''
  const description = video.snippet?.description || ''
  const tags = video.snippet?.tags || []
  const hasTimestamps = /\d{1,2}:\d{2}/.test(description)
  const hashtagCount = (description.match(/#[a-z0-9_]+/gi) || []).length
  const titleKeywordMatches = keywords.filter((keyword) => title.toLowerCase().includes(keyword.toLowerCase())).length
  const descriptionDepth = description.length >= 500 ? 'Deep' : description.length >= 200 ? 'Moderate' : 'Thin'
  const searchCoverage = clamp(titleKeywordMatches * 18 + Math.min(tags.length, 8) * 4 + (hasTimestamps ? 14 : 0) + Math.min(hashtagCount, 5) * 3 + (description.length >= 300 ? 18 : 0))

  return {
    score: Math.round(searchCoverage),
    hashtagCount,
    tagCount: tags.length,
    rows: [
      {
        label: 'Title keyword fit',
        value: `${titleKeywordMatches}/${Math.max(1, Math.min(keywords.length, 6))}`,
        note: titleKeywordMatches > 0 ? 'Core search terms appear in the title.' : 'Move one primary keyword into the title.',
      },
      {
        label: 'Description depth',
        value: descriptionDepth,
        note: description.length >= 300 ? 'Enough context for search and session matching.' : 'Add a concise summary, chapters, and related phrases.',
      },
      {
        label: 'Chapters',
        value: hasTimestamps ? 'Present' : 'Missing',
        note: hasTimestamps ? 'Timeline metadata can improve scanability.' : 'Add timestamps if the video has clear sections.',
      },
      {
        label: 'Tags / hashtags',
        value: `${tags.length} / ${hashtagCount}`,
        note: tags.length || hashtagCount ? 'Metadata provides extra topical hints.' : 'Add a few exact topic and format tags.',
      },
    ],
  }
}

function buildTimeline(video: DeepVideoAnalysisProps['video']) {
  const title = video.snippet?.title || ''
  const text = getText(video)
  const isTutorial = /how to|tutorial|guide|explained|learn/.test(text)
  const isChallenge = /challenge|i tried|24 hours|last to|experiment/.test(text)
  const isReview = /review|vs|comparison|tested|best/.test(text)

  const opening = isChallenge
    ? 'Open with the stakes, rule, or result preview.'
    : isTutorial
      ? 'Open with the exact outcome viewers will learn.'
      : isReview
        ? 'Open with the comparison criteria and why it matters.'
        : 'Open with the strongest curiosity or payoff from the title.'

  return [
    { time: '0:00-0:15', role: 'Hook', guidance: opening },
    { time: '0:15-0:45', role: 'Context', guidance: `Make the promise behind "${title.slice(0, 80)}" concrete and remove setup friction.` },
    { time: '0:45-70%', role: 'Proof / delivery', guidance: isTutorial ? 'Show steps, proof, examples, and avoid long theory blocks.' : 'Escalate stakes or evidence every 20-40 seconds.' },
    { time: '70%-90%', role: 'Payoff', guidance: 'Deliver the result, reveal, ranking, or key lesson before attention drops.' },
    { time: 'Final 10%', role: 'Next action', guidance: 'Use one CTA tied to the viewer intent: comment, compare, subscribe, or click related video.' },
  ]
}

function buildContentAnalysis(topic: string, video: DeepVideoAnalysisProps['video']) {
  const text = getText(video)
  const format = /shorts|#shorts/.test(text)
    ? 'Short-form discovery'
    : /review|vs|comparison|tested/.test(text)
      ? 'Review / comparison'
      : /how to|tutorial|guide/.test(text)
        ? 'Evergreen tutorial'
        : /challenge|i tried|experiment/.test(text)
          ? 'Challenge / experiment'
          : 'Broad appeal storytelling'

  const viewerJob = topic === 'Tutorial / education'
    ? 'Learn a practical outcome'
    : topic === 'Business / money'
      ? 'Find a valuable tactic or opportunity'
      : topic === 'Review / comparison'
        ? 'Decide what is better or worth trying'
        : 'Get entertained or satisfy curiosity'

  return {
    format,
    viewerJob,
    repeatability: format === 'Challenge / experiment' ? 'Medium: repeat promise, not production cost' : format === 'Evergreen tutorial' ? 'High: can become a series' : 'Medium-high: repeatable with new angles',
    contentGap: format === 'Broad appeal storytelling' ? 'Add a sharper repeatable format so the next upload is easier to systemize.' : 'Build a repeatable template around this format and swap the topic.',
  }
}

function hasAny(text: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(text))
}

function buildViralityDiagnosis(video: DeepVideoAnalysisProps['video'], topic: string, keywords: string[]) {
  const title = video.snippet?.title || ''
  const description = video.snippet?.description || ''
  const tags = video.snippet?.tags || []
  const text = getText(video)
  const lowerTitle = title.toLowerCase()

  const hasClearPromise = hasAny(lowerTitle, [
    /how to/,
    /why/,
    /what happens/,
    /i tried/,
    /tested/,
    /before.*after/,
    /without/,
    /vs|comparison/,
    /best|worst|top/,
  ])
  const hasCuriosity = title.includes('?') || hasAny(lowerTitle, [/secret/, /hidden/, /finally/, /never/, /nobody/, /truth/, /mistake/])
  const hasSpecificity = /\d/.test(title) || hasAny(lowerTitle, [/day/, /hour/, /step/, /rank/, /tier/, /episode/])
  const hasEmotion = hasAny(lowerTitle, [/insane/, /shocking/, /amazing/, /crazy/, /brutal/, /beautiful/, /scary/, /funny/, /failed/, /surprising/])
  const hasTimeliness = hasAny(text, [/new/, /2026/, /2025/, /breaking/, /trend/, /viral/, /update/, /just released/])
  const hasSearchIntent = hasAny(text, [/how to/, /tutorial/, /guide/, /explained/, /review/, /best/, /vs/, /tips/, /learn/])
  const hasShareableFormat = hasAny(text, [/challenge/, /reaction/, /experiment/, /i tried/, /ranking/, /transformation/, /before/, /after/, /shorts/])
  const hasAudienceSpecificity = topic !== 'General entertainment' || tags.length >= 3 || keywords.length >= 4
  const hasDescriptionSupport = description.length >= 220

  const signals = [
    { key: 'Clear promise', active: hasClearPromise, weight: 18, positive: 'The title gives viewers a reason to click because it promises a result, answer, test, or comparison.', negative: 'The title does not make the viewer payoff concrete enough.' },
    { key: 'Curiosity gap', active: hasCuriosity, weight: 14, positive: 'The packaging creates an open loop that can pull viewers into the first click.', negative: 'The packaging has limited curiosity tension.' },
    { key: 'Specific angle', active: hasSpecificity, weight: 12, positive: 'Specific numbers, timeframes, or ranked framing make the idea easier to understand and share.', negative: 'The idea feels broad; a number, timeframe, or concrete constraint would make it sharper.' },
    { key: 'Emotional trigger', active: hasEmotion, weight: 12, positive: 'The wording carries emotional charge, which helps sharing and comments.', negative: 'The content angle may be too neutral to spark strong reactions.' },
    { key: 'Timely demand', active: hasTimeliness, weight: 10, positive: 'The topic has timely or trend-based demand that can amplify discovery.', negative: 'There is little public timing signal in the content metadata.' },
    { key: 'Search intent', active: hasSearchIntent, weight: 10, positive: 'The content can capture search demand because it answers a query or helps a decision.', negative: 'Search intent is weak, so the video depends more on browse or recommendations.' },
    { key: 'Shareable format', active: hasShareableFormat, weight: 12, positive: 'The format is naturally repeatable or discussable, which helps recommendation spread.', negative: 'The format does not yet show an obvious share or repeat mechanic.' },
    { key: 'Audience fit', active: hasAudienceSpecificity, weight: 8, positive: `The topic is legible to a target audience: ${topic}.`, negative: 'The target audience is not clear enough from title, tags, and description.' },
    { key: 'Metadata support', active: hasDescriptionSupport, weight: 4, positive: 'The description gives YouTube more context for matching the video to viewers.', negative: 'The description is thin, which weakens search and recommendation context.' },
  ]

  const score = signals.reduce((sum, signal) => sum + (signal.active ? signal.weight : 0), 0)
  const positiveSignals = signals.filter((signal) => signal.active)
  const missingSignals = signals.filter((signal) => !signal.active)

  const verdict = score >= 74
    ? 'Likely to break out'
    : score >= 56
      ? 'Can work, but needs sharper packaging'
      : 'Likely to stay limited'

  const answer = score >= 56
    ? 'Why this video can go viral'
    : 'Why this video may not go viral'

  const mainReason = score >= 74
    ? 'The content has enough click, curiosity, audience, and distribution signals to earn broader testing.'
    : score >= 56
      ? 'The idea has useful content signals, but one or two weak points may limit how far YouTube can push it.'
      : 'The content does not yet give viewers or the algorithm a strong enough reason to click, stay, and share.'

  return {
    score,
    verdict,
    answer,
    mainReason,
    positives: positiveSignals.length > 0
      ? positiveSignals.slice(0, 4).map((signal) => signal.positive)
      : ['The public content metadata does not show a strong viral trigger yet.'],
    blockers: missingSignals.length > 0
      ? missingSignals.slice(0, 4).map((signal) => signal.negative)
      : ['No major content blocker is visible from public title, description, and tag signals.'],
    evidence: [
      `Title: ${title || 'Unavailable'}`,
      `Topic read: ${topic}`,
      `Keyword signals: ${keywords.slice(0, 5).join(', ') || 'limited public keyword data'}`,
      `Description depth: ${description.length} chars`,
    ],
  }
}

function buildEffectiveness(video: DeepVideoAnalysisProps['video'], velocity: number, engagementRate: number) {
  const views = Number(video.statistics?.viewCount || 0)
  const likes = Number(video.statistics?.likeCount || 0)
  const comments = Number(video.statistics?.commentCount || 0)
  const likeRate = views ? (likes / views) * 100 : 0
  const commentRate = views ? (comments / views) * 100 : 0
  const score = Math.round(clamp(Math.log10(views + 1) * 9 + engagementRate * 12 + Math.log10(velocity + 1) * 8 + commentRate * 600))

  return {
    score,
    summary: score >= 80 ? 'Strong video effect: reach and audience response both look healthy.' : score >= 60 ? 'Useful video effect: has signals worth testing again.' : 'Moderate effect: improve hook, topic specificity, or retention proof.',
    rows: [
      { label: 'Reach', value: formatNumber(views), note: views >= 1_000_000 ? 'Large public demand signal' : 'Demand signal still developing' },
      { label: 'Velocity', value: `${formatNumber(velocity)}/day`, note: velocity > 100_000 ? 'Momentum is still meaningful' : 'Velocity is modest or aged' },
      { label: 'Like rate', value: `${likeRate.toFixed(2)}%`, note: likeRate > 3 ? 'Strong satisfaction signal' : 'Packaging may beat satisfaction' },
      { label: 'Comment rate', value: `${commentRate.toFixed(3)}%`, note: commentRate > 0.08 ? 'Good discussion signal' : 'Needs stronger comment trigger' },
    ],
  }
}

function buildNextBrief(video: DeepVideoAnalysisProps['video'], topic: string, trafficPrimary: string, keywords: string[], effectScore: number) {
  const title = video.snippet?.title || 'this topic'
  const primaryKeyword = keywords[0] || topic
  const goal = effectScore >= 80
    ? 'Scale the format with a controlled variation'
    : effectScore >= 60
      ? 'Retest the idea with stronger packaging'
      : 'Rebuild hook, search intent, and payoff clarity'

  return [
    {
      label: 'Next title angle',
      value: `Make "${primaryKeyword}" the visible promise, then add a stronger result or contrast than "${title.slice(0, 64)}".`,
    },
    {
      label: 'Opening shot',
      value: 'Show the payoff, conflict, or final result first; spend the first 15 seconds proving why viewers should stay.',
    },
    {
      label: 'Distribution bet',
      value: trafficPrimary === 'Search'
        ? 'Write for exact-match search queries and support it with chapters.'
        : trafficPrimary === 'Browse'
          ? 'Prioritize thumbnail/title contrast and a curiosity gap.'
          : trafficPrimary === 'Suggested'
            ? 'Position the next video as a natural follow-up to adjacent creators and topics.'
            : 'Use external communities and description links to seed qualified viewers.',
    },
    {
      label: 'Success metric',
      value: `${goal}. Watch like rate, comment rate, and first-day velocity against this benchmark.`,
    },
  ]
}

export default function DeepVideoAnalysis({ video, velocity, engagementRate }: DeepVideoAnalysisProps) {
  const text = getText(video)
  const topic = inferTopic(text)
  const keywords = extractKeywords(video)
  const traffic = inferTrafficMix(video, engagementRate, velocity)
  const copy = buildCopyAnalysis(video)
  const timeline = buildTimeline(video)
  const content = buildContentAnalysis(topic, video)
  const virality = buildViralityDiagnosis(video, topic, keywords)
  const effect = buildEffectiveness(video, velocity, engagementRate)
  const seo = buildSeoAnalysis(video, keywords)
  const nextBrief = buildNextBrief(video, topic, traffic.primary, keywords, effect.score)

  return (
    <section id="deep-analysis" className="mb-10">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-red-600">Deep Video Analysis</div>
          <h2 className="mt-1 text-xl font-bold text-gray-900">Why this video will spread or stall</h2>
          <p className="mt-2 max-w-3xl text-sm text-gray-500">
            Built from public video data and content signals. Private retention, revenue, and real traffic-source data require YouTube Studio access, so those sections are clearly modeled as analyst inference.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
          <div className="text-xs text-gray-500">Effect score</div>
          <div className="text-2xl font-black text-gray-900">{effect.score}/100</div>
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-5">
        <div className="grid gap-4 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-red-600">Content-led verdict</div>
            <div className="mt-2 text-2xl font-black text-gray-950">{virality.verdict}</div>
            <div className="mt-3 flex items-end gap-2">
              <div className="text-4xl font-black text-red-600">{virality.score}</div>
              <div className="pb-1 text-sm font-bold text-gray-500">/100 content virality</div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">{virality.mainReason}</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-green-100 bg-white p-4">
              <div className="mb-3 text-sm font-black text-gray-900">{virality.answer}</div>
              <div className="space-y-2">
                {virality.positives.map((item) => (
                  <div key={item} className="flex gap-2 text-sm text-gray-700">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-amber-100 bg-white p-4">
              <div className="mb-3 text-sm font-black text-gray-900">Why it may not go further</div>
              <div className="space-y-2">
                {virality.blockers.map((item) => (
                  <div key={item} className="flex gap-2 text-sm text-gray-700">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {virality.evidence.map((item) => (
            <div key={item} className="rounded-lg border border-red-100 bg-white/80 p-3 text-xs leading-relaxed text-gray-600">
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="mb-3 text-sm font-bold text-gray-900">Copywriting & Hook</div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-gray-50 p-3">
              <div className="text-xs text-gray-500">Hook type</div>
              <div className="font-semibold text-gray-900">{copy.hookType}</div>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <div className="text-xs text-gray-500">Title length</div>
              <div className="font-semibold text-gray-900">{copy.titleLength} chars</div>
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            {copy.strengths.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="mb-3 text-sm font-bold text-gray-900">Content Strategy</div>
          <div className="space-y-3 text-sm">
            <div><span className="text-gray-500">Topic:</span> <span className="font-semibold text-gray-900">{topic}</span></div>
            <div><span className="text-gray-500">Format:</span> <span className="font-semibold text-gray-900">{content.format}</span></div>
            <div><span className="text-gray-500">Viewer job:</span> <span className="font-semibold text-gray-900">{content.viewerJob}</span></div>
            <div><span className="text-gray-500">Repeatability:</span> <span className="font-semibold text-gray-900">{content.repeatability}</span></div>
          </div>
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            {content.contentGap}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="mb-3 text-sm font-bold text-gray-900">Traffic & Video Effect</div>
          <div className="mb-3 rounded-lg bg-gray-50 p-3 text-sm">
            <div className="text-xs text-gray-500">Primary traffic hypothesis</div>
            <div className="font-semibold text-gray-900">{traffic.primary} - {traffic.quality}</div>
          </div>
          <div className="space-y-2">
            {traffic.rows.map((row) => (
              <div key={row.name}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="font-medium text-gray-700">{row.name}</span>
                  <span className="font-bold text-gray-900">{row.value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-red-500" style={{ width: `${row.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="mb-4 text-sm font-bold text-gray-900">Likely Video Timeline</div>
          <div className="space-y-3">
            {timeline.map((item) => (
              <div key={item.time} className="grid grid-cols-[88px_1fr] gap-3 rounded-xl bg-gray-50 p-3 text-sm">
                <div>
                  <div className="font-bold text-gray-900">{item.time}</div>
                  <div className="text-xs text-gray-500">{item.role}</div>
                </div>
                <div className="text-gray-700">{item.guidance}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="mb-4 text-sm font-bold text-gray-900">Keywords & Video Effect</div>
          <div className="mb-4 flex flex-wrap gap-2">
            {keywords.map((keyword) => (
              <span key={keyword} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                {keyword}
              </span>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {effect.rows.map((row) => (
              <div key={row.label} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                <div className="text-xs text-gray-500">{row.label}</div>
                <div className="mt-1 text-lg font-bold text-gray-900">{row.value}</div>
                <div className="mt-1 text-xs text-gray-500">{row.note}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
            {effect.summary}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="mb-1 text-sm font-bold text-gray-900">SEO & Keyword Coverage</div>
          <div className="mb-4 text-xs text-gray-500">Modeled from title, description, tags, hashtags, and chapter signals.</div>
          <div className="mb-4 flex items-end justify-between rounded-xl bg-gray-50 p-3">
            <div>
              <div className="text-xs text-gray-500">Search readiness</div>
              <div className="text-2xl font-black text-gray-900">{seo.score}/100</div>
            </div>
            <div className="text-right text-xs text-gray-500">
              <div>{seo.tagCount} tags</div>
              <div>{seo.hashtagCount} hashtags</div>
            </div>
          </div>
          <div className="space-y-3">
            {seo.rows.map((row) => (
              <div key={row.label} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-gray-900">{row.label}</div>
                  <div className="shrink-0 text-sm font-bold text-gray-700">{row.value}</div>
                </div>
                <div className="mt-1 text-xs text-gray-500">{row.note}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="mb-1 text-sm font-bold text-gray-900">Next Upload Brief</div>
          <div className="mb-4 text-xs text-gray-500">A product-style action plan for the next test, based on the current video&apos;s public signals.</div>
          <div className="grid gap-3 sm:grid-cols-2">
            {nextBrief.map((item) => (
              <div key={item.label} className="rounded-xl border border-red-100 bg-red-50 p-3">
                <div className="text-xs font-bold uppercase tracking-wide text-red-700">{item.label}</div>
                <div className="mt-2 text-sm leading-relaxed text-gray-800">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
