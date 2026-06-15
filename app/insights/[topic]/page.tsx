/* =========================================================
   INSIGHT ARTICLE PAGE - Professional SEO articles
   /insights/[topic]/page.tsx
========================================================= */

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  Clock,
  ArrowRight,
  BookOpen,
  Share2,
  Bookmark,
  ChevronRight,
  Lightbulb,
  Target,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react'
import { getInsightContent, INSIGHT_ARTICLES } from '@/lib/recommendations'
import { ArticleSchema, BreadcrumbSchema } from '@/app/components/ArticleSchema'

// Valid topics
const VALID_TOPICS = Object.keys(INSIGHT_ARTICLES)

interface PageProps {
  params: Promise<{ topic: string }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { topic } = await params
  const article = getInsightContent(topic)

  if (!article) {
    return {
      title: 'Article Not Found | TubeFission Insights',
      description: 'Explore professional insights and analysis on YouTube trends and content strategy.'
    }
  }

  return {
    title: `${article.title} | TubeFission Insights`,
    description: article.description,
    keywords: [...article.tags, 'YouTube analytics', 'content strategy', 'creator economy', 'video marketing'],
    authors: [{ name: article.author }],
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      locale: 'en_US',
      authors: [article.author],
      publishedTime: article.publishDate,
      tags: article.tags,
      images: [{
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: article.title
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      creator: '@tubefission'
    },
    alternates: {
      canonical: `https://tubefission.com/insights/${topic}`
    }
  }
}

// Generate static params
export function generateStaticParams() {
  return VALID_TOPICS.map(topic => ({ topic }))
}

// Main page component
export default async function InsightArticlePage({ params }: PageProps) {
  const { topic } = await params
  const article = getInsightContent(topic)

  if (!article) {
    notFound()
  }

  // Estimate word count
  const wordCount = article.content.trim().split(/\s+/).length

  // Breadcrumb items
  const breadcrumbItems = [
    { name: 'Home', url: 'https://tubefission.com/' },
    { name: 'Insights', url: 'https://tubefission.com/insights' },
    { name: article.title, url: `https://tubefission.com/insights/${topic}` }
  ]

  // Parse content sections
  const sections = article.content.split('##').filter(s => s.trim()).map(section => {
    const lines = section.trim().split('\n')
    const title = lines[0].trim()
    const content = lines.slice(1).join('\n').trim()
    return { title, content }
  })

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Schema Markup */}
      <ArticleSchema
        title={article.title}
        description={article.description}
        url={`https://tubefission.com/insights/${topic}`}
        author={article.author}
        publishDate={article.publishDate}
        tags={article.tags}
        readingTime={article.readingTime}
        wordCount={wordCount}
      />
      <BreadcrumbSchema items={breadcrumbItems} />

      {/* Hero Section */}
      <article className="bg-white">
        {/* Header */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            {/* Breadcrumb */}
            <nav className="mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm text-gray-400 flex-wrap">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><span className="text-gray-500">/</span></li>
                <li><Link href="/insights" className="hover:text-white transition-colors">Insights</Link></li>
                <li><span className="text-gray-500">/</span></li>
                <li className="text-white font-medium truncate">{article.title}</li>
              </ol>
            </nav>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {article.readingTime} min read
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {new Date(article.publishDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              <span className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                {wordCount.toLocaleString()} words
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-300 max-w-3xl leading-relaxed">
              {article.description}
            </p>

            {/* Author */}
            <div className="mt-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">TF</span>
              </div>
              <div>
                <p className="font-medium text-white">{article.author}</p>
                <p className="text-sm text-gray-400">Research Team</p>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Key Takeaways Box */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border border-red-100 mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Lightbulb className="w-6 h-6 text-red-600" />
              Key Takeaways
            </h2>
            <ul className="space-y-3">
              {article.keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 text-xs font-bold">{idx + 1}</span>
                  </div>
                  <span className="text-gray-700">{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Main Content */}
          <div className="prose prose-lg prose-gray max-w-none">
            {sections.map((section, idx) => (
              <section key={idx} className="mb-12">
                {section.title && (
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    {section.title}
                  </h2>
                )}
                <div className="text-gray-700 leading-relaxed space-y-4">
                  {section.content.split('\n\n').map((paragraph, pIdx) => {
                    // Check if it's a list
                    if (paragraph.trim().startsWith('**') && paragraph.includes('**:')) {
                      const items = paragraph.split('\n').filter(line => line.trim())
                      return (
                        <ul key={pIdx} className="space-y-2 my-4">
                          {items.map((item, iIdx) => {
                            const match = item.match(/\*\*(.+?)\*\*:\s*(.+)/)
                            if (match) {
                              return (
                                <li key={iIdx} className="flex items-start gap-2">
                                  <span className="text-red-600 font-semibold">{match[1]}:</span>
                                  <span className="text-gray-700">{match[2]}</span>
                                </li>
                              )
                            }
                            return null
                          })}
                        </ul>
                      )
                    }
                    // Check if it's a numbered list
                    if (paragraph.match(/^\d+\./)) {
                      const items = paragraph.split('\n').filter(line => line.trim().match(/^\d+\./))
                      return (
                        <ol key={pIdx} className="list-decimal list-inside space-y-2 my-4">
                          {items.map((item, iIdx) => (
                            <li key={iIdx} className="text-gray-700">
                              {item.replace(/^\d+\.\s*/, '')}
                            </li>
                          ))}
                        </ol>
                      )
                    }
                    // Regular paragraph
                    if (paragraph.trim()) {
                      return (
                        <p key={pIdx} className="text-gray-700 leading-relaxed">
                          {paragraph.trim()}
                        </p>
                      )
                    }
                    return null
                  })}
                </div>
              </section>
            ))}
          </div>

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-gray-600 font-medium">Share this article:</span>
                <div className="flex gap-2">
                  <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <Bookmark className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Last updated: {new Date(article.publishDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-red-600" />
            Related Insights
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(INSIGHT_ARTICLES)
              .filter(([key]) => key !== topic)
              .slice(0, 3)
              .map(([key, relatedArticle]) => (
                <Link
                  key={key}
                  href={`/insights/${key}`}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-red-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium">
                      {relatedArticle.tags[0]}
                    </span>
                    <span className="text-gray-400 text-sm flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {relatedArticle.readingTime} min
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                    {relatedArticle.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {relatedArticle.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-red-600 font-medium text-sm">
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-red-600 to-red-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Apply These Insights?
          </h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Join TubeFission to track trends, analyze competitors, and get personalized content recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-white text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              href="/trends"
              className="px-8 py-4 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-400 transition-colors"
            >
              Explore Trends
            </Link>
          </div>
        </div>
      </section>

      {/* Internal Links */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* More Articles */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-red-600" />
                More Articles
              </h3>
              <ul className="space-y-2">
                {Object.entries(INSIGHT_ARTICLES)
                  .filter(([key]) => key !== topic)
                  .slice(0, 4)
                  .map(([key, article]) => (
                    <li key={key}>
                      <Link
                        href={`/insights/${key}`}
                        className="text-gray-600 hover:text-red-600 transition-colors flex items-center gap-2"
                      >
                        <ChevronRight className="w-4 h-4" />
                        {article.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Popular Trends */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-red-600" />
                Popular Trends
              </h3>
              <ul className="space-y-2">
                {['US', 'JP', 'KR', 'GB'].map(code => (
                  <li key={code}>
                    <Link
                      href={`/trends/${code.toLowerCase()}`}
                      className="text-gray-600 hover:text-red-600 transition-colors flex items-center gap-2"
                    >
                      <ChevronRight className="w-4 h-4" />
                      {code} Trends
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tools */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-red-600" />
                Free Tools
              </h3>
              <ul className="space-y-2">
                {[
                  { name: 'Video Analyzer', href: '/video' },
                  { name: 'Channel Analytics', href: '/channel' },
                  { name: 'Trend Discovery', href: '/trends' },
                  { name: 'Competitor Analysis', href: '/compare' }
                ].map(tool => (
                  <li key={tool.name}>
                    <Link
                      href={tool.href}
                      className="text-gray-600 hover:text-red-600 transition-colors flex items-center gap-2"
                    >
                      <ChevronRight className="w-4 h-4" />
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
