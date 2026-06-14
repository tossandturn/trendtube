/* =========================================================
   REGION / COUNTRY CONFIGURATION
   Unified region selection with cookie persistence
   NOTE: This file must NOT import next/headers because it is
   used by both Server and Client Components.
   Server-only helpers live in ./region-server.ts
========================================================= */

export const REGIONS = ['GLOBAL', 'US', 'JP', 'KR', 'GB', 'HK', 'TW'] as const
export type Region = (typeof REGIONS)[number]

export const REGION_META: Record<Region, { label: string; flag: string; lang: string }> = {
  GLOBAL: { label: 'Global', flag: 'un', lang: 'en' },
  US: { label: 'United States', flag: 'us', lang: 'en' },
  JP: { label: 'Japan', flag: 'jp', lang: 'ja' },
  KR: { label: 'Korea', flag: 'kr', lang: 'ko' },
  GB: { label: 'United Kingdom', flag: 'gb', lang: 'en' },
  HK: { label: 'Hong Kong', flag: 'hk', lang: 'zh-Hant' },
  TW: { label: 'Taiwan', flag: 'tw', lang: 'zh-Hant' },
}

export const REGION_LABELS: Record<Region, {
  full: string
  trending: string
  shorts: string
  emerging: string
  aiTrends: string
  viralShorts: string
  views: string
  velocity: string
  engagement: string
  opportunity: string
  competition: string
  backToTrends: string
}> = {
  GLOBAL: {
    full: 'Global',
    trending: 'Trending',
    shorts: 'Shorts',
    emerging: 'Emerging',
    aiTrends: 'AI Trends',
    viralShorts: 'Viral Shorts',
    views: 'Views',
    velocity: 'Velocity',
    engagement: 'Engagement',
    opportunity: 'Opportunity',
    competition: 'Competition',
    backToTrends: 'Back to Trends',
  },
  US: {
    full: 'United States',
    trending: 'Trending',
    shorts: 'Shorts',
    emerging: 'Emerging',
    aiTrends: 'AI Trends',
    viralShorts: 'Viral Shorts',
    views: 'Views',
    velocity: 'Velocity',
    engagement: 'Engagement',
    opportunity: 'Opportunity',
    competition: 'Competition',
    backToTrends: 'Back to Trends',
  },
  JP: {
    full: 'Japan',
    trending: 'トレンド',
    shorts: 'ショート',
    emerging: '急上昇',
    aiTrends: 'AI トレンド',
    viralShorts: 'バイラルショート',
    views: '再生数',
    velocity: ' velocity',
    engagement: 'エンゲージメント',
    opportunity: 'チャンス',
    competition: '競争',
    backToTrends: 'トレンドに戻る',
  },
  KR: {
    full: 'Korea',
    trending: '트렌딩',
    shorts: '쇼츠',
    emerging: '급상승',
    aiTrends: 'AI 트렌드',
    viralShorts: '바이럴 쇼츠',
    views: '조회수',
    velocity: ' velocity',
    engagement: '참여도',
    opportunity: '기회',
    competition: '경쟁',
    backToTrends: '트렌드로 돌아가기',
  },
  GB: {
    full: 'United Kingdom',
    trending: 'Trending',
    shorts: 'Shorts',
    emerging: 'Emerging',
    aiTrends: 'AI Trends',
    viralShorts: 'Viral Shorts',
    views: 'Views',
    velocity: 'Velocity',
    engagement: 'Engagement',
    opportunity: 'Opportunity',
    competition: 'Competition',
    backToTrends: 'Back to Trends',
  },
  HK: {
    full: 'Hong Kong',
    trending: '熱門',
    shorts: 'Shorts',
    emerging: '新興趨勢',
    aiTrends: 'AI 趨勢',
    viralShorts: '爆紅 Shorts',
    views: '觀看次數',
    velocity: '增速',
    engagement: '互動率',
    opportunity: '機會',
    competition: '競爭',
    backToTrends: '返回熱門',
  },
  TW: {
    full: 'Taiwan',
    trending: '熱門',
    shorts: 'Shorts',
    emerging: '新興趨勢',
    aiTrends: 'AI 趨勢',
    viralShorts: '爆紅 Shorts',
    views: '觀看次數',
    velocity: '增速',
    engagement: '互動率',
    opportunity: '機會',
    competition: '競爭',
    backToTrends: '返回熱門',
  },
}

export function getRegionLabels(region: Region) {
  return REGION_LABELS[region]
}
