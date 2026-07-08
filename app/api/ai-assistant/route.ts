import { NextResponse } from 'next/server'
import { searchYouTubeMulti } from '@/lib/api-client'

interface AIOutput {
  type: 'title' | 'hook' | 'thumbnail' | 'script'
  content: string
  source: string
  evidence?: Array<{
    label: string
    value: string
    type: 'Fact' | 'Derived' | 'Inference'
    source: string
    note: string
  }>
  sourceVideos?: Array<{
    id: string
    title: string
    channelTitle: string
    views: number
  }>
}

export async function POST(request: Request) {
  try {
    const { topic, type } = await request.json()

    if (!topic || !type) {
      return NextResponse.json({ error: 'Topic and type required' }, { status: 400 })
    }

    // Search for related videos to analyze patterns
    const videos = await searchYouTubeMulti(
      [topic, `${topic} tutorial`, `${topic} tips`],
      15,
      'viewCount'
    )

    const relevantVideos = filterRelevantVideos(topic, videos)

    // Sort by view count and get top semantically relevant performers
    const topVideos = relevantVideos
      .sort((a: any, b: any) => {
        const viewsA = Number(a.statistics?.viewCount || 0)
        const viewsB = Number(b.statistics?.viewCount || 0)
        return viewsB - viewsA
      })
      .slice(0, 10)

    // Analyze patterns from top videos
    const titles = topVideos.map((v: any) => v.snippet?.title || '')
    const patterns = analyzeTitlePatterns(titles)
    const evidence = buildEvidence(topic, topVideos, patterns, videos.length)
    const sourceVideos = topVideos.slice(0, 5).map((video: any) => ({
      id: video.id,
      title: video.snippet?.title || 'Untitled video',
      channelTitle: video.snippet?.channelTitle || 'Unknown channel',
      views: Number(video.statistics?.viewCount || 0),
    }))

    // Generate content based on type and analyzed patterns
    let result: AIOutput

    switch (type) {
      case 'title':
        result = generateTitle(topic, patterns)
        break
      case 'hook':
        result = generateHook(topic, patterns, topVideos)
        break
      case 'thumbnail':
        result = generateThumbnailEvidence(topic, patterns)
        break
      case 'script':
        result = generateScriptEvidence(topic, patterns)
        break
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    return NextResponse.json({ ...result, evidence, sourceVideos })
  } catch (error) {
    console.error('AI Assistant error:', error)
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 })
  }
}

function formatCompact(num: number): string {
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return Math.round(num).toLocaleString()
}

function buildEvidence(topic: string, topVideos: any[], patterns: ReturnType<typeof analyzeTitlePatterns>, rawSampleCount = topVideos.length): AIOutput['evidence'] {
  const totalViews = topVideos.reduce((sum, video) => sum + Number(video.statistics?.viewCount || 0), 0)
  const avgViews = topVideos.length > 0 ? totalViews / topVideos.length : 0
  const confidence = topVideos.length >= 5 ? 'High' : topVideos.length >= 3 ? 'Medium' : topVideos.length >= 1 ? 'Low' : 'Insufficient'
  const patternSignals = [
    patterns.hasNumbers > 0 ? `${patterns.hasNumbers} use numbers` : '',
    patterns.hasHowTo > 0 ? `${patterns.hasHowTo} use how-to framing` : '',
    patterns.hasSecret > 0 ? `${patterns.hasSecret} use curiosity/secret framing` : '',
    patterns.hasResult > 0 ? `${patterns.hasResult} show results or transformation` : '',
  ].filter(Boolean).join(', ') || 'No dominant title pattern found'

  return [
    {
      label: 'Source sample',
      value: `${topVideos.length} videos`,
      type: 'Fact',
      source: 'YouTube Data API',
      note: `${rawSampleCount} raw videos were checked; ${topVideos.length} matched the topic strongly enough to use as evidence.`,
    },
    {
      label: 'Evidence fit',
      value: `${confidence} confidence`,
      type: 'Derived',
      source: 'Topic relevance filter',
      note: topVideos.length >= 3
        ? `Recommendations are based on semantically matched public videos for "${topic}".`
        : 'Sample is too small for a strong recommendation. Treat the draft as a creative starting point, not a data-backed decision.',
    },
    {
      label: 'Public demand',
      value: topVideos.length > 0 ? formatCompact(totalViews) : 'Insufficient data',
      type: 'Fact',
      source: 'YouTube Data API',
      note: topVideos.length > 0
        ? `Total public views across the matched sample. Average: ${formatCompact(avgViews)} views/video.`
        : 'No semantically matched source videos were available for demand analysis.',
    },
    {
      label: 'Title pattern',
      value: patternSignals,
      type: 'Derived',
      source: 'Title metadata',
      note: 'Pattern counts are extracted from public titles, not private CTR data.',
    },
    {
      label: 'Keywords',
      value: topVideos.length >= 3 ? patterns.topKeywords.slice(0, 5).join(', ') || 'No strong keyword cluster' : 'Insufficient matched sample',
      type: 'Derived',
      source: 'Public titles',
      note: 'Generic stop words are removed before counting repeated terms.',
    },
    {
      label: 'AI boundary',
      value: 'Creative draft',
      type: 'Inference',
      source: 'TubeFission interpretation',
      note: 'Suggestions adapt public patterns. They do not use private retention, CTR, revenue, or audience demographics.',
    },
  ]
}

function analyzeTitlePatterns(titles: string[]) {
  const patterns = {
    sampleCount: titles.length,
    hasNumbers: titles.filter(t => /\d/.test(t)).length,
    hasHowTo: titles.filter(t => /how to/i.test(t)).length,
    hasSecret: titles.filter(t => /secret|hidden|hacks?/i.test(t)).length,
    hasResult: titles.filter(t => /result|before|after|change/i.test(t)). length,
    hasTimeFrame: titles.filter(t => /days?|hours?|minutes?|weeks?/i.test(t)).length,
    hasStopNever: titles.filter(t => /stop|never|don't/i.test(t)).length,
    hasWhy: titles.filter(t => /why|what|how/i.test(t)).length,
    avgLength: titles.length ? Math.round(titles.reduce((acc, t) => acc + t.length, 0) / titles.length) : 0,
    topKeywords: extractTopKeywords(titles),
  }
  return patterns
}

function extractTopKeywords(titles: string[]) {
  const wordCounts: Record<string, number> = {}
  titles.forEach(title => {
    title.toLowerCase().split(/\s+/).forEach(word => {
      word = word.replace(/[^\w]/g, '')
      if (word.length > 2 && !STOP_WORDS.has(word)) {
        wordCounts[word] = (wordCounts[word] || 0) + 1
      }
    })
  })

  return Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word)
}

function generateTitle(topic: string, patterns: any): AIOutput {
  const templates = []

  if (patterns.hasResult > 3) {
    templates.push(
      `I Tried ${topic} for 30 Days (Unexpected Results)`,
      `${topic} Changed Everything in Just 7 Days`,
      `Before vs After: ${topic} Challenge Results`
    )
  }

  if (patterns.hasSecret > 2) {
    templates.push(
      `The ${topic} Secret No One Talks About`,
      `Hidden ${topic} Hacks That Actually Work`,
      `${topic} Secrets Experts Don't Want You to Know`
    )
  }

  if (patterns.hasStopNever > 2) {
    templates.push(
      `Stop Making These ${topic} Mistakes`,
      `Never Do This With ${topic}`,
      `Don't Start ${topic} Before Watching This`
    )
  }

  if (patterns.hasHowTo > 3) {
    templates.push(
      `How to Master ${topic} (Step by Step)`,
      `Complete ${topic} Tutorial for Beginners`,
      `How I Learned ${topic} in 30 Days`
    )
  }

  // Default templates based on high-performing patterns
  templates.push(
    `Why ${topic} is Taking Over Right Now`,
    `The Truth About ${topic} Nobody Shares`,
    `I Tested ${topic} So You Don't Have To`,
    `${topic}: What Actually Works in 2026`
  )

  // Pick template deterministically based on topic hash
  const hash = topic.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
  const selectedTemplate = templates[hash % templates.length]

  return {
    type: 'title',
    content: selectedTemplate,
    source: patterns.sampleCount >= 3
      ? `Public-title pattern inference. Average title length in matched sample: ${patterns.avgLength || 0} characters.`
      : 'Low-confidence creative draft: fewer than 3 semantically matched source videos were available.'
  }
}

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does',
  'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that',
  'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'my', 'your', 'his', 'her',
  'its', 'our', 'their', 'about', 'today', 'welcome', 'official', 'video', 'videos',
])

function tokenizeTopic(text: string) {
  return Array.from(new Set(
    text
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .map((word) => word.trim())
      .filter((word) => word.length > 1 && !STOP_WORDS.has(word))
  ))
}

function filterRelevantVideos(topic: string, videos: any[]) {
  const topicTokens = tokenizeTopic(topic)
  if (topicTokens.length === 0) return []
  const exactPhrase = topic.toLowerCase().replace(/\s+/g, ' ').trim()
  const minMatches = topicTokens.length >= 2 ? 2 : 1
  const minTitleMatches = topicTokens.length >= 2 ? Math.min(2, topicTokens.length) : 1
  const platformTokens = topicTokens.filter((token) => ['youtube', 'tiktok', 'instagram', 'shorts'].includes(token))

  return videos
    .map((video: any) => {
      const snippet = video.snippet || {}
      const tags = Array.isArray(snippet.tags) ? snippet.tags.join(' ') : ''
      const title = String(snippet.title || '').toLowerCase()
      const text = [
        title,
        snippet.description,
        snippet.channelTitle,
        tags,
      ].filter(Boolean).join(' ').toLowerCase()
      const titleTokens = new Set(title.split(/[^a-z0-9]+/).filter(Boolean))
      const textTokens = new Set(text.split(/[^a-z0-9]+/).filter(Boolean))
      const matched = topicTokens.filter((token) => textTokens.has(token))
      const titleMatched = topicTokens.filter((token) => titleTokens.has(token))
      const hasExactPhrase = exactPhrase.length > 2 && text.includes(exactPhrase)
      const hasRequiredPlatform = platformTokens.every((token) => textTokens.has(token))
      return {
        video,
        titleMatches: titleMatched.length,
        hasRequiredPlatform,
        score: matched.length + (hasExactPhrase ? 2 : 0),
      }
    })
    .filter(({ score, titleMatches, hasRequiredPlatform }: { score: number; titleMatches: number; hasRequiredPlatform: boolean }) =>
      score >= minMatches && titleMatches >= minTitleMatches && hasRequiredPlatform
    )
    .sort((a: any, b: any) => b.score - a.score)
    .map(({ video }: { video: any }) => video)
}

function generateHook(topic: string, patterns: any, topVideos: any[]): AIOutput {
  const avgViews = topVideos.length > 0
    ? Math.round(topVideos.reduce((acc, v) => acc + Number(v.statistics?.viewCount || 0), 0) / topVideos.length)
    : 0

  const viewStr = avgViews >= 1000000
    ? `${(avgViews / 1000000).toFixed(1)}M`
    : avgViews >= 1000
      ? `${(avgViews / 1000).toFixed(0)}K`
      : avgViews.toString()

  const hooks = [
    `Wait until you see what happened when I tried ${topic}... This changed everything.`,
    `I spent 100+ hours testing ${topic} so you don't have to. Here's what actually works.`,
    `${topic} experts hate this trick. But it works every single time.`,
    `The truth about ${topic} that nobody wants to admit (but ${viewStr} people watched this).`,
    `Stop scrolling if you care about ${topic}. This is the video you've been waiting for.`,
    `I was doing ${topic} wrong for years. Here's what nobody told me.`,
    `What if I told you that ${topic} could be 10x easier than you think?`,
    `This ${topic} hack saved my channel. And it takes 30 seconds to implement.`,
  ]

  const hash = topic.split('').reduce((a, b) => a + b.charCodeAt(0), 0)

  return {
    type: 'hook',
    content: hooks[hash % hooks.length],
    source: topVideos.length >= 3
      ? `Based on matched public source videos averaging ${viewStr} views. Hook is an inferred creative draft.`
      : 'Low-confidence creative draft: fewer than 3 semantically matched source videos were available.'
  }
}

function generateThumbnail(topic: string, patterns: any): AIOutput {
  const thumbnails = []

  if (patterns.hasResult > 3) {
    thumbnails.push(
      '🎨 Split screen: Before/After results with shocked expression',
      '🎨 Bold arrow pointing to transformation result with text overlay'
    )
  }

  if (patterns.hasSecret > 2) {
    thumbnails.push(
      '🎨 Face with "shocked" expression + blurred secret element',
      '🎨 Hand covering mouth + text: "THE TRUTH"'
    )
  }

  thumbnails.push(
    '🎨 Your face (reaction) + topic visual side by side',
    '🎨 Large number/stats displayed prominently with contrasting background',
    '🎨 Question mark + mysterious element from topic',
    '🎨 Close-up of problem/solution with arrow annotation',
    '🎨 Split comparison showing wrong way vs your way'
  )

  const hash = topic.split('').reduce((a, b) => a + b.charCodeAt(0), 0)

  return {
    type: 'thumbnail',
    content: thumbnails[hash % thumbnails.length],
    source: `Inferred from repeated public title/topic patterns: ${patterns.topKeywords?.slice(0, 3).join(', ') || 'no strong keyword cluster'}.`
  }
}

function generateScript(topic: string, patterns: any): AIOutput {
  const structure = `📋 PROVEN SCRIPT STRUCTURE (Based on top performers)

[0:00-0:05] HOOK
"${patterns.hasSecret > 2 ? `I'm about to show you the ${topic} secret that changed everything...` : `In the next 10 minutes, I'm going to show you exactly how I mastered ${topic}...`}"

[0:05-0:30] PROBLEM SETUP
• Most people struggle with ${topic} because...
• Common mistakes that hold creators back
• The #1 reason why ${patterns.topKeywords?.[0] || 'beginners'} fail

[0:30-2:00] SOLUTION INTRO
• What I discovered after ${patterns.hasTimeFrame > 2 ? '30 days of testing' : 'extensive research'}
• The ${patterns.hasSecret > 2 ? 'hidden' : 'simple'} approach nobody talks about
• Why this works differently than you think

[2:00-7:00] MAIN CONTENT
• Step 1: [Actionable first step]
• Step 2: [Implementation detail]
• Step 3: [Optimization tip]
• Include ${patterns.topKeywords?.slice(0, 3).join('/')} reference

[7:00-8:30] PROOF/RESULTS
• Show actual results/data
• Before/after comparison
• Testimonial or example

[8:30-9:30] COMMON QUESTIONS
• Address top comment questions
• Overcome objections
• Set expectations

[9:30-10:00] CTA
"If you found this helpful, subscribe for more ${topic} content. Comment 'READY' below if you're implementing this today!"

---
⏱️ Target length: 8-12 minutes
🎯 Focus keywords: ${patterns.topKeywords?.slice(0, 5).join(', ') || topic}
📈 Based on: ${patterns.hasResult > 3 ? 'results-driven' : 'educational'} format from top performers`

  return {
    type: 'script',
    content: structure,
    source: `Analyzed ${patterns.avgLength} char avg titles, top keywords: ${patterns.topKeywords?.slice(0, 5).join(', ')}`
  }
}

function generateThumbnailEvidence(topic: string, patterns: any): AIOutput {
  const thumbnails: string[] = []

  if (patterns.hasResult > 3) {
    thumbnails.push(
      'Split screen: before/after result, one clear transformation, minimal text',
      'One bold arrow pointing to the proof/result, with a short outcome label'
    )
  }

  if (patterns.hasSecret > 2) {
    thumbnails.push(
      'Close reaction plus one blurred mystery element; text: "THE TRUTH"',
      'Simple face/object contrast with one hidden detail highlighted'
    )
  }

  thumbnails.push(
    'Creator reaction plus topic visual side by side',
    'Large number or result displayed on a high-contrast background',
    'Question mark plus one recognizable topic object',
    'Close-up of the problem and solution with one arrow annotation',
    'Split comparison showing wrong way vs your way'
  )

  const hash = topic.split('').reduce((a, b) => a + b.charCodeAt(0), 0)

  return {
    type: 'thumbnail',
    content: thumbnails[hash % thumbnails.length],
    source: patterns.sampleCount >= 3
      ? `Inferred from repeated public title/topic patterns: ${patterns.topKeywords?.slice(0, 3).join(', ') || 'no strong keyword cluster'}.`
      : 'Low-confidence creative draft: fewer than 3 semantically matched source videos were available.',
  }
}

function generateScriptEvidence(topic: string, patterns: any): AIOutput {
  const structure = `SCRIPT STRUCTURE (public-pattern draft)

[0:00-0:05] HOOK
"${patterns.hasSecret > 2 ? `I'm about to show you the ${topic} secret that changed everything...` : `In the next 10 minutes, I'm going to show you exactly how I mastered ${topic}...`}"

[0:05-0:30] PROBLEM SETUP
- Most people struggle with ${topic} because...
- Common mistakes that hold creators back
- The #1 reason why ${patterns.topKeywords?.[0] || 'beginners'} fail

[0:30-2:00] SOLUTION INTRO
- What I discovered after ${patterns.hasTimeFrame > 2 ? '30 days of testing' : 'extensive research'}
- The ${patterns.hasSecret > 2 ? 'hidden' : 'simple'} approach nobody talks about
- Why this works differently than you think

[2:00-7:00] MAIN CONTENT
- Step 1: [Actionable first step]
- Step 2: [Implementation detail]
- Step 3: [Optimization tip]
- Include ${patterns.topKeywords?.slice(0, 3).join('/')} reference

[7:00-8:30] PROOF/RESULTS
- Show actual results/data
- Before/after comparison
- Testimonial or example

[8:30-9:30] COMMON QUESTIONS
- Address top comment questions
- Overcome objections
- Set expectations

[9:30-10:00] CTA
"If you found this helpful, subscribe for more ${topic} content. Comment 'READY' below if you're implementing this today!"

---
Target length: 8-12 minutes
Focus keywords: ${patterns.topKeywords?.slice(0, 5).join(', ') || topic}
Based on: ${patterns.hasResult > 3 ? 'results-driven' : 'educational'} public-title pattern`

  return {
    type: 'script',
    content: structure,
    source: patterns.sampleCount >= 3
      ? `Public sample inference. Average title length: ${patterns.avgLength || 0} chars. Top keywords: ${patterns.topKeywords?.slice(0, 5).join(', ') || 'none'}.`
      : 'Low-confidence creative draft: fewer than 3 semantically matched source videos were available.',
  }
}
