/* =========================================================
   JSON-LD STRUCTURED DATA — SEO enhancement
========================================================= */

interface WebPageSchemaProps {
  title: string
  description: string
  url: string
  image?: string
  datePublished?: string
  dateModified?: string
}

export function WebPageSchema({ title, description, url, image, datePublished, dateModified }: WebPageSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url,
    ...(image && { image }),
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    publisher: {
      '@type': 'Organization',
      name: 'Tubefission',
      url: 'https://tubefission.com',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function SoftwareApplicationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Tubefission',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
    },
    description: 'YouTube analytics and trend intelligence for analyzing videos, comparing creators, tracking opportunities, and planning the next upload.',
    url: 'https://tubefission.com',
    image: 'https://tubefission.com/og-image.png',
    author: {
      '@type': 'Organization',
      name: 'Tubefission',
    },
    featureList: [
      'YouTube video and channel analytics',
      'Trend discovery with source-video evidence',
      'Creator briefs and next-upload recommendations',
      'Video and channel comparison workflows',
      'Watchlists, alerts, and workspace history',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface FAQItem {
  question: string
  answer: string
}

export function FAQPageSchema({ items }: { items: FAQItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

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
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface ArticleSchemaProps {
  title: string
  description: string
  url: string
  image?: string
  datePublished: string
  dateModified?: string
  author?: string
}

export function ArticleSchema({ title, description, url, image, datePublished, dateModified, author }: ArticleSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    ...(image && { image }),
    datePublished,
    ...(dateModified && { dateModified }),
    author: author ? { '@type': 'Person', name: author } : { '@type': 'Organization', name: 'Tubefission' },
    publisher: {
      '@type': 'Organization',
      name: 'Tubefission',
      url: 'https://tubefission.com',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
