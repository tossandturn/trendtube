import type { Metadata } from 'next'

interface TrendDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: TrendDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const title = `${slug.replace(/-/g, ' ')} Trend on YouTube Today`

  return {
    title,
    description: `Discover why ${slug.replace(/-/g, ' ')} is trending on YouTube today.`,
    openGraph: {
      title,
      description: `Discover why ${slug.replace(/-/g, ' ')} is trending on YouTube today.`,
      type: 'article',
    },
  }
}

export default async function TrendDetailPage({ params }: TrendDetailPageProps) {
  const { slug } = await params

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-zinc-500 mb-3 uppercase tracking-wider text-sm">
          TREND DETAIL
        </div>

        <h1 className="text-6xl font-black mb-6 capitalize">
          {slug.replace(/-/g, ' ')}
        </h1>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-4">
            AI Trend Analysis
          </h2>

          <p className="text-zinc-300 leading-relaxed text-lg">
            This trend is growing rapidly across YouTube due to creator demand,
            AI adoption, Shorts distribution, and viral engagement loops.
          </p>
        </div>

        <div className="aspect-video bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center text-zinc-600 text-xl">
          Embedded YouTube Videos
        </div>
      </div>
    </main>
  )
}
