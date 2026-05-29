import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTrendsByCategory } from '@/lib/db'
import { getLatestSnapshot } from '@/lib/db'

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

const CATEGORY_META: Record<string, { title: string; description: string }> = {
  technology: {
    title: 'Technology Trends',
    description: 'AI tools, software reviews, and tech tutorials trending on YouTube.'
  },
  gaming: {
    title: 'Gaming Trends',
    description: 'Minecraft, GTA, Fortnite, and esports content trends.'
  },
  entertainment: {
    title: 'Entertainment Trends',
    description: 'Challenge videos, high-production content, and viral entertainment.'
  },
  business: {
    title: 'Business & Automation Trends',
    description: 'Faceless channels, passive income, and YouTube business strategies.'
  },
  music: {
    title: 'Music Trends',
    description: 'Viral songs, music reactions, and cover trends on YouTube.'
  },
  'short-form': {
    title: 'Short-Form Content Trends',
    description: 'YouTube Shorts trends and viral short-form content strategies.'
  },
  education: {
    title: 'Education Trends',
    description: 'Coding tutorials, programming education, and learning content.'
  },
  finance: {
    title: 'Finance Trends',
    description: 'Cryptocurrency, investing, and personal finance content trends.'
  },
  food: {
    title: 'Food & Cooking Trends',
    description: 'Recipes, mukbang, and culinary content trends.'
  },
  health: {
    title: 'Health & Fitness Trends',
    description: 'Workouts, fitness transformations, and health content trends.'
  },
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  const meta = CATEGORY_META[category] || { title: category, description: `${category} trends on YouTube` }
  return {
    title: `${meta.title} | TubeFission`,
    description: meta.description,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  const normalizedCategory = category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  const trends = getTrendsByCategory(normalizedCategory)

  if (trends.length === 0) {
    notFound()
  }

  const trendsWithStats = trends.map(t => {
    const snapshot = getLatestSnapshot(t.id)
    return {
      ...t,
      velocity: snapshot?.velocity || 0,
      breakout: snapshot?.breakout_score || 0,
    }
  })

  const meta = CATEGORY_META[category] || { title: normalizedCategory, description: `${normalizedCategory} trends` }

  return (
    <main className="min-h-screen bg-[#fafafa]">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="flex items-center text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span className="mx-2">&gt;</span>
          <Link href="/trends" className="hover:text-gray-900">Trends</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-900">{meta.title}</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{meta.title}</h1>
          <p className="text-lg text-gray-600 max-w-2xl">{meta.description}</p>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{trends.length}</p>
              <p className="text-sm text-gray-500">Trends</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {Math.round(trendsWithStats.reduce((a, b) => a + b.velocity, 0) / trends.length / 1000)}K
              </p>
              <p className="text-sm text-gray-500">Avg Velocity</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(trendsWithStats.reduce((a, b) => a + (b.breakout || 0), 0) / trends.length)}
              </p>
              <p className="text-sm text-gray-500">Avg Breakout</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trends Grid */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Trends in this category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendsWithStats.map(trend => (
              <Link
                key={trend.id}
                href={`/trends/${trend.slug}`}
                className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{trend.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">{trend.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-green-600 font-medium">
                    {trend.velocity > 0 ? `+${(trend.velocity / 1000).toFixed(1)}K` : '0'} velocity
                  </span>
                  <span className="text-blue-600">
                    {trend.breakout?.toFixed(0) || '0'} breakout
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
