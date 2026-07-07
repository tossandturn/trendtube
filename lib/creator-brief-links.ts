export function getCreatorBriefHref({
  topic,
  niche,
  angle,
  source,
  type = 'script',
}: {
  topic: string
  niche?: string
  angle?: string
  source?: string
  type?: 'title' | 'hook' | 'thumbnail' | 'script'
}) {
  const params = new URLSearchParams({ topic, type })
  if (niche) params.set('niche', niche)
  if (angle) params.set('angle', angle)
  if (source) params.set('source', source)
  return `/ai-assistant?${params.toString()}`
}
