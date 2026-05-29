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
      name: 'TubeFission',
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

interface DatasetSchemaProps {
  name: string
  description: string
  url: string
  keywords: string[]
  datePublished: string
  dateModified: string
}

export function DatasetSchema({ name, description, url, keywords, datePublished, dateModified }: DatasetSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name,
    description,
    url,
    keywords,
    creator: {
      '@type': 'Organization',
      name: 'TubeFission',
    },
    datePublished,
    dateModified,
    license: 'https://tubefission.com/terms',
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
    author: author ? { '@type': 'Person', name: author } : { '@type': 'Organization', name: 'TubeFission' },
    publisher: {
      '@type': 'Organization',
      name: 'TubeFission',
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
