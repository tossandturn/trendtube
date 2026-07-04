import Link from 'next/link'
import Image from 'next/image'

const groups = [
  {
    title: 'Analyze',
    links: [
      { label: 'YouTube Video Analyzer', href: '/youtube-video-analyzer' },
      { label: 'YouTube Channel Analytics', href: '/youtube-channel-analytics' },
      { label: 'Competitor Analysis', href: '/youtube-competitor-analysis' },
    ],
  },
  {
    title: 'Discover',
    links: [
      { label: 'Trending Videos', href: '/trending' },
      { label: 'Trend Database', href: '/trends' },
      { label: 'YouTube AI Trends', href: '/youtube-ai-trends' },
      { label: 'YouTube Shorts Trends', href: '/youtube-shorts-trends' },
    ],
  },
  {
    title: 'Plan',
    links: [
      { label: 'Keyword Research', href: '/youtube-keyword-research' },
      { label: 'Niche Finder', href: '/youtube-niche-finder' },
      { label: 'Opportunity Finder', href: '/youtube-opportunity-finder' },
      { label: 'AI Tools', href: '/youtube-ai-tools' },
    ],
  },
  {
    title: 'SEO Hubs',
    links: [
      { label: 'Gaming YouTube Trends', href: '/gaming-youtube-trends' },
      { label: 'Viral Music Trends', href: '/viral-music-trends' },
      { label: 'Viral YouTube Shorts', href: '/viral-youtube-shorts' },
      { label: 'Low Competition Keywords', href: '/low-competition-keywords' },
    ],
  },
]

export default function ProductFooter() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_3fr]">
        <div>
          <div className="flex items-center gap-2">
            <Image src="/favicon.svg" alt="" width={28} height={28} className="h-7 w-7" />
            <div>
              <div className="text-sm font-bold text-gray-900">TubeFission</div>
              <div className="text-xs text-gray-500">YouTube intelligence platform</div>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-600">
            Analyze videos and channels, discover regional trends, compare competitors, and plan stronger creator decisions with real YouTube data.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {groups.map((group) => (
            <div key={group.title}>
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">{group.title}</h2>
              <div className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <Link key={link.href} href={link.href} className="block text-sm text-gray-600 hover:text-red-600">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}
