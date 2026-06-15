/* =========================================================
   ARTICLE SCHEMA COMPONENT - Structured data for articles
   https://schema.org/Article
========================================================= */

import Script from 'next/script'

interface ArticleSchemaProps {
  title: string
  description: string
  url: string
  image?: string
  author?: string
  authorUrl?: string
  publishDate: string
  modifiedDate?: string
  tags?: string[]
  readingTime?: number
  wordCount?: number
}

export function ArticleSchema({
  title,
  description,
  url,
  image = 'https://tubefission.com/og-image.jpg',
  author = 'TubeFission',
  authorUrl = 'https://tubefission.com',
  publishDate,
  modifiedDate,
  tags = [],
  readingTime,
  wordCount
}: ArticleSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    url: url,
    image: {
      '@type': 'ImageObject',
      url: image,
      width: 1200,
      height: 630
    },
    author: {
      '@type': 'Organization',
      name: author,
      url: authorUrl
    },
    publisher: {
      '@type': 'Organization',
      name: 'TubeFission',
      logo: {
        '@type': 'ImageObject',
        url: 'https://tubefission.com/logo.png',
        width: 600,
        height: 60
      }
    },
    datePublished: publishDate,
    dateModified: modifiedDate || publishDate,
    keywords: tags.join(', '),
    articleSection: tags[0] || 'YouTube Analytics',
    ...(readingTime && { timeRequired: `PT${readingTime}M` }),
    ...(wordCount && { wordCount }),
    inLanguage: 'en-US',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    }
  }

  return (
    <Script
      id="article-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// BlogPosting variant for blog-style articles
export function BlogPostingSchema({
  title,
  description,
  url,
  image = 'https://tubefission.com/og-image.jpg',
  author = 'TubeFission',
  authorUrl = 'https://tubefission.com',
  publishDate,
  modifiedDate,
  tags = [],
  readingTime,
  wordCount
}: ArticleSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    url: url,
    image: {
      '@type': 'ImageObject',
      url: image,
      width: 1200,
      height: 630
    },
    author: {
      '@type': 'Organization',
      name: author,
      url: authorUrl
    },
    publisher: {
      '@type': 'Organization',
      name: 'TubeFission',
      logo: {
        '@type': 'ImageObject',
        url: 'https://tubefission.com/logo.png',
        width: 600,
        height: 60
      }
    },
    datePublished: publishDate,
    dateModified: modifiedDate || publishDate,
    keywords: tags.join(', '),
    articleSection: 'YouTube Analytics Blog',
    ...(readingTime && { timeRequired: `PT${readingTime}M` }),
    ...(wordCount && { wordCount }),
    inLanguage: 'en-US',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    }
  }

  return (
    <Script
      id="blogposting-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// FAQPage schema for FAQ sections
interface FAQItem {
  question: string
  answer: string
}

export function FAQSchema({ faqs }: { faqs: FAQItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// BreadcrumbList schema for navigation
interface BreadcrumbItem {
  name: string
  url: string
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// HowTo schema for tutorial content
interface HowToStep {
  name: string
  text: string
  url?: string
}

interface HowToSchemaProps {
  name: string
  description: string
  steps: HowToStep[]
  totalTime?: string
  estimatedCost?: string
}

export function HowToSchema({
  name,
  description,
  steps,
  totalTime,
  estimatedCost
}: HowToSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    ...(totalTime && { totalTime }),
    ...(estimatedCost && { estimatedCost: { '@type': 'MonetaryAmount', currency: 'USD', value: estimatedCost } }),
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.url && { url: step.url })
    }))
  }

  return (
    <Script
      id="howto-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
