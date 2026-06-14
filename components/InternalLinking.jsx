import React from 'react';

/**
 * InternalLinking Component
 * Renders a "Related Tools & Resources" section with internal links
 * for SEO internal linking structure improvement.
 *
 * @param {Array} links - Array of { href, title, description }
 * @param {string} currentPage - Current page identifier for default links
 */

const defaultLinks = {
  'viral-radar': [
    { href: '/ideas', title: 'Content Idea Generator', description: 'Generate AI-powered content ideas based on trending signals' },
    { href: '/trends', title: 'YouTube Trends', description: 'Discover trending topics across different regions' },
    { href: '/channel', title: 'Channel Analytics', description: 'Analyze any YouTube channel performance' },
    { href: '/tools/channel-audit', title: 'Channel Audit Tool', description: 'Comprehensive channel health check' },
  ],
  'idea-generator': [
    { href: '/radar', title: 'Viral Radar', description: 'Discover viral content before it explodes' },
    { href: '/trends', title: 'YouTube Trends', description: 'Track trending topics in real-time' },
    { href: '/youtube-seo-tool', title: 'YouTube SEO Tool', description: 'Optimize your videos for search' },
    { href: '/youtube-niche-finder', title: 'Niche Finder', description: 'Find profitable YouTube niches' },
  ],
};

const InternalLinking = ({ links = [], currentPage }) => {
  const displayLinks = links.length > 0 ? links : (defaultLinks[currentPage] || []);
  if (!displayLinks || displayLinks.length === 0) return null;

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center">
          Related Tools & Resources
        </h2>
        <p className="text-slate-400 text-center mb-8 max-w-2xl mx-auto">
          Explore more free YouTube analytics tools to grow your channel faster
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group block bg-slate-800/50 rounded-xl p-5 border border-slate-700 hover:border-indigo-500 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/10"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors mb-1 truncate">
                    {link.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
                    {link.description}
                  </p>
                </div>
                <div className="flex-shrink-0 mt-1 text-slate-500 group-hover:text-indigo-400 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InternalLinking;
