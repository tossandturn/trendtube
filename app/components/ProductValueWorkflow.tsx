import Link from 'next/link'

interface ProductValueDimension {
  label: string
  score: number
  note: string
}

interface ProductValueWorkflowProps {
  compact?: boolean
}

const PRODUCT_DIMENSIONS: ProductValueDimension[] = [
  { label: 'Painkiller', score: 88, note: 'Creators need to know what to make next and why it can work.' },
  { label: 'Workflow Fit', score: 82, note: 'Discovery, analysis, comparison, planning, and tracking are becoming one loop.' },
  { label: 'Data Advantage', score: 80, note: 'Public YouTube signals are useful, while private retention and revenue remain inferred.' },
  { label: 'Decision Power', score: 84, note: 'The product now turns scores into next-upload guidance instead of raw metrics only.' },
  { label: 'SEO Acquisition', score: 86, note: 'Keyword, trend, and analyzer pages create strong search-led acquisition potential.' },
  { label: 'Retention', score: 72, note: 'Saved opportunities and tracking need to become more visible habits.' },
]

const WORKFLOW_STEPS = [
  { label: 'Discover', href: '/trending', copy: 'Find opportunities' },
  { label: 'Analyze', href: '/youtube-video-analyzer', copy: 'Validate samples' },
  { label: 'Compare', href: '/compare-new?type=videos', copy: 'Choose a benchmark' },
  { label: 'Plan', href: '/ai-assistant', copy: 'Create the brief' },
  { label: 'Track', href: '/watchlist', copy: 'Save and revisit' },
]

function getProductScore() {
  const total = PRODUCT_DIMENSIONS.reduce((sum, item) => sum + item.score, 0)
  return Math.round(total / PRODUCT_DIMENSIONS.length)
}

export default function ProductValueWorkflow({ compact = false }: ProductValueWorkflowProps) {
  const productScore = getProductScore()

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-red-600">TubeFission Product Score</div>
          <div className="mt-2 flex items-end gap-3">
            <div className="text-4xl font-black text-gray-900">{productScore}</div>
            <div className="pb-1 text-sm font-bold text-gray-500">/100 B+</div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            The product value is strongest when users move through one repeatable loop: discover an opportunity, validate it, compare samples, create a brief, then track the result.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {PRODUCT_DIMENSIONS.map((dimension) => (
            <div key={dimension.label} className="rounded-xl bg-gray-50 p-3">
              <div className="mb-1 flex items-center justify-between gap-3">
                <span className="text-sm font-bold text-gray-800">{dimension.label}</span>
                <span className="text-sm font-black text-gray-900">{dimension.score}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full rounded-full bg-red-500" style={{ width: `${dimension.score}%` }} />
              </div>
              {!compact && <p className="mt-2 text-xs leading-relaxed text-gray-500">{dimension.note}</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 border-t border-gray-100 pt-5">
        <div className="mb-3 text-sm font-bold text-gray-900">User workflow</div>
        <div className="grid gap-2 md:grid-cols-5">
          {WORKFLOW_STEPS.map((step, index) => (
            <Link key={step.label} href={step.href} className="rounded-xl border border-gray-200 bg-white p-3 hover:border-red-200 hover:bg-red-50">
              <div className="text-xs font-black text-red-600">0{index + 1}</div>
              <div className="mt-1 text-sm font-bold text-gray-900">{step.label}</div>
              <div className="mt-1 text-xs text-gray-500">{step.copy}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
