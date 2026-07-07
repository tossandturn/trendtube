import type { Metadata } from 'next'
import Link from 'next/link'
import { PRODUCT_ACCESS_COPY, PRODUCT_DIFFERENTIATION } from '@/lib/product-positioning'

interface ComparePageProps {
  params: Promise<{
    tool: string
  }>
}

const COMPARISON_DATA: Record<string, {
  title: string
  description: string
  competitorName: string
  features: Array<{
    name: string
    tubefission: string
    competitor: string
    winner: 'tubefission' | 'competitor' | 'tie'
  }>
  pricing: Array<{
    plan: string
    tubefission: string
    competitor: string
  }>
  positioning: {
    bestFor: string
    uniqueAdvantage: string
    whySwitch: string
  }
}> = {
  'vidiq': {
    title: 'TubeFission vs VidIQ: Which is Better for Trend Analysis?',
    description: 'Detailed comparison of TubeFission and VidIQ. See which tool offers better trend prediction, pricing, and features for YouTube creators.',
    competitorName: 'VidIQ',
    features: [
      { name: 'Trend Velocity Tracking', tubefission: 'Real-time AI analysis', competitor: 'Basic metrics', winner: 'tubefission' },
      { name: 'Viral Prediction', tubefission: 'AI-powered forecasting', competitor: 'Historical data only', winner: 'tubefission' },
      { name: 'Competition Analysis', tubefission: 'Deep supply/demand metrics', competitor: 'Basic competitor tracking', winner: 'tubefission' },
      { name: 'Upload Timing', tubefission: 'AI-recommended windows', competitor: 'Best time suggestions', winner: 'tubefission' },
      { name: 'SEO Optimization', tubefission: 'Trend-based keywords', competitor: 'Full SEO suite', winner: 'competitor' },
      { name: 'Channel Audit', tubefission: 'Trend opportunity scan', competitor: 'Comprehensive audit', winner: 'competitor' },
      { name: 'Keyword Research', tubefission: 'Trending keywords', competitor: 'Extensive database', winner: 'competitor' },
      { name: 'Pricing', tubefission: 'Free preview; no public paid pricing yet', competitor: 'Starts at $7.50/mo', winner: 'tie' },
    ],
    pricing: [
      { plan: 'Preview', tubefission: PRODUCT_ACCESS_COPY.limit, competitor: 'Limited features, 3 keyword lookups' },
      { plan: 'Paid plans', tubefission: 'Not publicly priced yet', competitor: '$7.50/mo - Boost' },
      { plan: 'Teams', tubefission: 'Workspace/team pricing not announced', competitor: '$39/mo - Pro' },
    ],
    positioning: {
      bestFor: 'Creators focused on trend prediction and early opportunity detection',
      uniqueAdvantage: 'AI-powered viral prediction before trends saturate',
      whySwitch: 'Get predictive insights 24-48 hours before competitors using historical data',
    },
  },
  'tubebuddy': {
    title: 'TubeFission vs TubeBuddy: Trend Intelligence Comparison',
    description: 'Compare TubeFission and TubeBuddy features, pricing, and use cases. Find the best tool for your YouTube growth strategy.',
    competitorName: 'TubeBuddy',
    features: [
      { name: 'Trend Prediction', tubefission: 'AI viral forecasting', competitor: 'Trend alerts', winner: 'tubefission' },
      { name: 'Opportunity Scoring', tubefission: 'Multi-factor AI score', competitor: 'Opportunity finder', winner: 'tubefission' },
      { name: 'Velocity Analysis', tubefission: 'Real-time acceleration tracking', competitor: 'View tracking', winner: 'tubefission' },
      { name: 'Thumbnail Tools', tubefission: 'Trend-based suggestions', competitor: 'A/B testing, generator', winner: 'competitor' },
      { name: 'Bulk Processing', tubefission: 'Limited', competitor: 'Extensive bulk tools', winner: 'competitor' },
      { name: 'End Screen Tools', tubefission: 'None', competitor: 'Templates, analytics', winner: 'competitor' },
      { name: 'Competition Level', tubefission: 'AI-calculated', competitor: 'Manual research', winner: 'tubefission' },
      { name: 'Integration', tubefission: 'Web workspace and compare basket', competitor: 'Browser extension', winner: 'tie' },
    ],
    pricing: [
      { plan: 'Free', tubefission: 'Full feature access, limited volume', competitor: 'Limited features, 30 day trial' },
      { plan: 'Paid plans', tubefission: 'Not publicly priced yet', competitor: '$4.50/mo (annual)' },
      { plan: 'Teams', tubefission: 'Workspace/team pricing not announced', competitor: '$14/mo (annual)' },
    ],
    positioning: {
      bestFor: 'Data-focused creators who prioritize trend timing over workflow optimization',
      uniqueAdvantage: 'Predictive analytics vs historical optimization',
      whySwitch: 'Focus on what will trend, not just what has trended',
    },
  },
  'google-trends': {
    title: 'TubeFission vs Google Trends: YouTube-Specific Analysis',
    description: 'Why TubeFission is better than Google Trends for YouTube creators. Compare features, data sources, and actionable insights.',
    competitorName: 'Google Trends',
    features: [
      { name: 'Data Source', tubefission: 'YouTube API + AI', competitor: 'Google Search only', winner: 'tubefission' },
      { name: 'Platform Focus', tubefission: 'YouTube-specific', competitor: 'General web search', winner: 'tubefission' },
      { name: 'Velocity Metrics', tubefission: 'Views/hour, acceleration', competitor: 'Search interest only', winner: 'tubefission' },
      { name: 'Creator Alerts', tubefission: 'Custom email alert rules', competitor: 'None', winner: 'tubefission' },
      { name: 'Competition Analysis', tubefission: 'Video count, creator density', competitor: 'Search volume only', winner: 'tubefission' },
      { name: 'Actionable Insights', tubefission: 'Upload timing, title suggestions', competitor: 'Trend direction only', winner: 'tubefission' },
      { name: 'Geographic Data', tubefission: '6 regions, YouTube-specific', competitor: 'Global search', winner: 'tie' },
      { name: 'Cost', tubefission: 'Free preview with workspace account', competitor: '100% free', winner: 'competitor' },
    ],
    pricing: [
      { plan: 'Preview', tubefission: PRODUCT_ACCESS_COPY.limit, competitor: 'Free - unlimited searches' },
      { plan: 'Paid plans', tubefission: 'Not publicly priced yet', competitor: 'N/A' },
      { plan: 'Enterprise', tubefission: 'Not publicly announced', competitor: 'N/A' },
    ],
    positioning: {
      bestFor: 'Serious creators who need YouTube-specific data and actionable recommendations',
      uniqueAdvantage: 'YouTube-native metrics vs general search trends',
      whySwitch: 'Google Trends shows search intent; TubeFission shows YouTube reality',
    },
  },
}

// Generate default comparison
function generateComparison(tool: string) {
  const normalized = tool.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  return {
    title: `TubeFission vs ${normalized}: Complete Comparison`,
    description: `Compare TubeFission and ${normalized} features, pricing, and capabilities for YouTube creators.`,
    competitorName: normalized,
    features: [
      { name: 'Trend Prediction', tubefission: 'AI-powered', competitor: 'Basic tracking', winner: 'tubefission' as const },
      { name: 'Pricing', tubefission: 'Free preview; paid pricing not public', competitor: 'Varies by product', winner: 'tie' as const },
    ],
    pricing: [
      { plan: 'Preview', tubefission: PRODUCT_ACCESS_COPY.limit, competitor: 'Limited' },
      { plan: 'Paid plans', tubefission: 'Not publicly priced yet', competitor: 'Contact' },
    ],
    positioning: {
      bestFor: 'YouTube creators seeking AI-powered trend prediction',
      uniqueAdvantage: 'Advanced analytics and forecasting',
      whySwitch: 'Get ahead of trends before they saturate',
    },
  }
}

export async function generateMetadata({ params }: ComparePageProps): Promise<Metadata> {
  const { tool } = await params
  const data = COMPARISON_DATA[tool] || generateComparison(tool)

  return {
    title: data.title,
    description: data.description,
    keywords: `tubefission vs ${tool}, ${tool} alternative, youtube trend tool comparison, ${tool} vs`,
    alternates: {
      canonical: `https://tubefission.com/compare/${tool}`,
    },
    openGraph: {
      title: data.title,
      description: data.description,
      url: `https://tubefission.com/compare/${tool}`,
      type: 'article',
    },
  }
}

export default async function ComparePage({ params }: ComparePageProps) {
  const { tool } = await params
  const data = COMPARISON_DATA[tool] || generateComparison(tool)

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-red-600">Home</Link>
          <span>→</span>
          <span className="text-gray-900">Compare</span>
          <span>→</span>
          <span className="text-gray-900">{data.competitorName}</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{data.title}</h1>
          <p className="text-gray-600 text-lg max-w-3xl">{data.description}</p>
        </header>

        {/* Quick Verdict */}
        <div className="bg-red-50 rounded-2xl p-6 border border-red-200 mb-12">
          <h2 className="font-bold text-red-900 mb-2">Quick Verdict</h2>
          <p className="text-red-700 mb-4">
            <strong>Choose TubeFission if:</strong> {data.positioning.bestFor}
          </p>
          <p className="text-red-700">
            <strong>Unique advantage:</strong> {data.positioning.uniqueAdvantage}
          </p>
          <p className="mt-3 text-sm text-red-700">
            <strong>Product boundary:</strong> {PRODUCT_DIFFERENTIATION.boundary}
          </p>
        </div>

        {/* Feature Comparison */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Feature Comparison</h2>
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-bold">Feature</th>
                  <th className="text-center px-4 py-3 text-sm font-bold text-red-600">TubeFission</th>
                  <th className="text-center px-4 py-3 text-sm font-bold text-gray-600">{data.competitorName}</th>
                  <th className="text-center px-4 py-3 text-sm font-bold">Winner</th>
                </tr>
              </thead>
              <tbody>
                {data.features.map((feature, i) => (
                  <tr key={i} className="border-t border-gray-200">
                    <td className="px-4 py-3 font-medium">{feature.name}</td>
                    <td className="px-4 py-3 text-center text-sm">{feature.tubefission}</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">{feature.competitor}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                        feature.winner === 'tubefission' ? 'bg-red-100 text-red-700' :
                        feature.winner === 'competitor' ? 'bg-gray-100 text-gray-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {feature.winner === 'tubefission' ? 'TubeFission' :
                         feature.winner === 'competitor' ? data.competitorName :
                         'Tie'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pricing Comparison */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-2">Access & Pricing Comparison</h2>
          <p className="mb-6 text-sm text-gray-500">{PRODUCT_ACCESS_COPY.pricing}</p>
          <div className="grid md:grid-cols-3 gap-6">
            {data.pricing.map((tier) => (
              <div key={tier.plan} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="font-bold mb-4">{tier.plan}</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-red-600 font-medium mb-1">TubeFission</div>
                    <div className="text-sm">{tier.tubefission}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 font-medium mb-1">{data.competitorName}</div>
                    <div className="text-sm text-gray-600">{tier.competitor}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Use Case Comparison */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">When to Choose Each</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
              <h3 className="font-bold text-red-900 mb-3">Choose TubeFission</h3>
              <ul className="space-y-2 text-sm text-red-700">
                <li>• You want AI-powered trend predictions</li>
                <li>• Early opportunity detection matters</li>
                <li>• You need upload timing recommendations</li>
                <li>• Competition analysis is important</li>
                <li>• You want free trend insights</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-3">Choose {data.competitorName}</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• You need comprehensive SEO tools</li>
                <li>• Workflow optimization is priority</li>
                <li>• You want browser extension features</li>
                <li>• Budget is primary concern</li>
                <li>• You prefer established tools</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Bottom Line */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">The Bottom Line</h2>
          <p className="text-gray-600 mb-4">{data.positioning.whySwitch}</p>
          <p className="text-gray-600">
            While {data.competitorName} excels at {data.features.find(f => f.winner === 'competitor')?.name || 'workflow optimization'},
            TubeFission&apos;s predictive capabilities give creators a competitive edge that&apos;s hard to replicate with historical data alone.
          </p>
        </section>

        {/* CTA */}
        <div className="bg-gray-900 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Try the Free Preview</h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            {PRODUCT_ACCESS_COPY.short}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/trending"
              className="px-8 py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition"
            >
              Start Free →
            </Link>
            <Link
              href="/"
              className="px-8 py-4 border border-gray-600 text-white rounded-xl font-bold hover:bg-gray-800 transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
