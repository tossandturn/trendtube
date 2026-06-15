/* =========================================================
   DATASET SCHEMA COMPONENT - Structured data for datasets
   https://schema.org/Dataset
========================================================= */

import Script from 'next/script'

interface DatasetSchemaProps {
  name: string
  description: string
  url: string
  keywords?: string[]
  creator?: string
  license?: string
  datePublished?: string
  dateModified?: string
  temporalCoverage?: string
  spatialCoverage?: string
  variableMeasured?: string[]
  measurementTechnique?: string
}

export function DatasetSchema({
  name,
  description,
  url,
  keywords = [],
  creator = 'TubeFission',
  license = 'https://tubefission.com/terms',
  datePublished,
  dateModified,
  temporalCoverage,
  spatialCoverage,
  variableMeasured = [],
  measurementTechnique = 'Data analysis'
}: DatasetSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name,
    description,
    url,
    keywords: keywords.join(', '),
    creator: {
      '@type': 'Organization',
      name: creator,
      url: 'https://tubefission.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'TubeFission',
      url: 'https://tubefission.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://tubefission.com/logo.png'
      }
    },
    license,
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    ...(temporalCoverage && { temporalCoverage }),
    ...(spatialCoverage && { spatialCoverage }),
    ...(variableMeasured.length > 0 && { variableMeasured }),
    measurementTechnique,
    isAccessibleForFree: true,
    inLanguage: 'en-US'
  }

  return (
    <Script
      id="dataset-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// DataCatalog schema for collections of datasets
interface DataCatalogProps {
  name: string
  description: string
  url: string
  datasetCount: number
  keywords?: string[]
}

export function DataCatalogSchema({
  name,
  description,
  url,
  datasetCount,
  keywords = []
}: DataCatalogProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DataCatalog',
    name,
    description,
    url,
    keywords: keywords.join(', '),
    provider: {
      '@type': 'Organization',
      name: 'TubeFission',
      url: 'https://tubefission.com'
    },
    dataset: {
      '@type': 'Dataset',
      name: `${name} Collection`,
      description: `Collection of ${datasetCount} datasets`,
      url
    }
  }

  return (
    <Script
      id="datacatalog-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Table schema for data tables
interface TableSchemaProps {
  name: string
  description: string
  about: string
  tableColumns: { name: string; description: string }[]
}

export function TableSchema({
  name,
  description,
  about,
  tableColumns
}: TableSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Table',
    about,
    name,
    description,
    tableColumns: tableColumns.map(col => ({
      '@type': 'TableColumn',
      name: col.name,
      description: col.description
    }))
  }

  return (
    <Script
      id="table-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Trend Dataset schema for YouTube trend data
interface TrendDatasetSchemaProps {
  country: string
  date: string
  videoCount: number
  trendCategories: string[]
}

export function TrendDatasetSchema({
  country,
  date,
  videoCount,
  trendCategories
}: TrendDatasetSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `YouTube Trends in ${country} - ${date}`,
    description: `Comprehensive dataset of trending YouTube videos in ${country} for ${date}, including view counts, engagement metrics, and trend analysis across ${trendCategories.length} categories.`,
    url: `https://tubefission.com/trends/${country.toLowerCase()}`,
    keywords: ['YouTube trends', country, 'video analytics', 'social media data', ...trendCategories],
    creator: {
      '@type': 'Organization',
      name: 'TubeFission',
      url: 'https://tubefission.com'
    },
    datePublished: date,
    temporalCoverage: date,
    spatialCoverage: country,
    variableMeasured: ['View count', 'Engagement rate', 'Trend velocity', 'Upload time', 'Video duration', 'Like count', 'Comment count'],
    measurementTechnique: 'API data collection and statistical analysis',
    isAccessibleForFree: true,
    license: 'https://tubefission.com/terms',
    distribution: {
      '@type': 'DataDownload',
      contentUrl: `https://tubefission.com/api/trends/${country.toLowerCase()}?date=${date}`,
      encodingFormat: 'JSON'
    },
    includedInDataCatalog: {
      '@type': 'DataCatalog',
      name: 'TubeFission YouTube Trends Database'
    }
  }

  return (
    <Script
      id="trend-dataset-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Statistics schema for data visualization
interface StatisticsSchemaProps {
  name: string
  description: string
  statistics: {
    label: string
    value: string
    type?: 'quantitative' | 'qualitative'
  }[]
}

export function StatisticsSchema({
  name,
  description,
  statistics
}: StatisticsSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name,
    description,
    variableMeasured: statistics.map(s => s.label),
    hasPart: statistics.map(stat => ({
      '@type': 'StatisticalVariable',
      name: stat.label,
      description: `${stat.label}: ${stat.value}`,
      measurementMethod: stat.type || 'quantitative'
    }))
  }

  return (
    <Script
      id="statistics-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// TimeSeries schema for time-based trend data
interface TimeSeriesProps {
  name: string
  description: string
  startDate: string
  endDate: string
  measurement: string
  unit: string
}

export function TimeSeriesSchema({
  name,
  description,
  startDate,
  endDate,
  measurement,
  unit
}: TimeSeriesProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name,
    description,
    temporalCoverage: `${startDate}/${endDate}`,
    variableMeasured: [{
      '@type': 'PropertyValue',
      name: measurement,
      unitText: unit
    }]
  }

  return (
    <Script
      id="timeseries-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
