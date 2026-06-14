/**
 * TopicClusterNav.jsx
 * Hub-and-spoke navigation component for topic clusters
 * 
 * Usage:
 *   <TopicClusterNav
 *     hub={{ title: 'Gaming Trends', href: '/trends/gaming' }}
 *     spokes={[
 *       { title: 'Mobile Gaming', href: '/trends/gaming/mobile' },
 *       { title: 'PC Gaming', href: '/trends/gaming/pc' },
 *       { title: 'Console Gaming', href: '/trends/gaming/console' },
 *       { title: 'Esports', href: '/trends/gaming/esports' },
 *       { title: 'Indie Games', href: '/trends/gaming/indie' },
 *       { title: 'VR Gaming', href: '/trends/gaming/vr' },
 *       { title: 'Game Reviews', href: '/trends/gaming/reviews' },
 *       { title: 'Streaming', href: '/trends/gaming/streaming' },
 *     ]}
 *     currentPage="/trends/gaming/pc"
 *   />
 */

import React from 'react';

/**
 * @typedef {Object} HubNode
 * @property {string} title
 * @property {string} href
 * @property {string} [icon] — optional emoji or icon character
 */

/**
 * @typedef {Object} SpokeNode
 * @property {string} title
 * @property {string} href
 * @property {string} [description] — optional short description
 */

/**
 * Hub-and-spoke topic cluster navigation
 * @param {Object} props
 * @param {HubNode} props.hub — central hub page
 * @param {SpokeNode[]} props.spokes — related spoke pages
 * @param {string} props.currentPage — current pathname for highlighting
 */
export default function TopicClusterNav({ hub, spokes, currentPage }) {
  if (!hub || !spokes || spokes.length === 0) return null;

  const isCurrent = (href) => {
    if (!currentPage || !href) return false;
    // Normalize: remove trailing slashes for comparison
    const normalize = (s) => s.replace(/\/$/, '');
    return normalize(currentPage) === normalize(href);
  };

  // Limit spokes for visual balance (max 8 for the radial layout)
  const displaySpokes = spokes.slice(0, 8);
  const extraSpokes = spokes.slice(8);

  return (
    <nav className="w-full" aria-label="Topic cluster navigation">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-cyan-500 rounded-full" />
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Explore {hub.title}
          </h2>
        </div>

        {/* Hub-and-Spoke Layout */}
        <div className="relative">
          {/* Desktop: Radial-ish grid layout */}
          <div className="hidden lg:block">
            <div className="relative flex items-center justify-center min-h-[320px]">
              {/* Hub - center */}
              <div className="absolute z-10">
                <HubCard hub={hub} isActive={isCurrent(hub.href)} />
              </div>

              {/* Spokes - positioned around hub */}
              {displaySpokes.map((spoke, index) => {
                const angle = (360 / displaySpokes.length) * index - 90; // Start from top
                const radius = 140; // distance from center in px
                const rad = (angle * Math.PI) / 180;
                const x = Math.cos(rad) * radius;
                const y = Math.sin(rad) * radius;

                return (
                  <div
                    key={spoke.href}
                    className="absolute"
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                      left: '50%',
                      top: '50%',
                      marginLeft: '-80px',
                      marginTop: '-28px',
                      width: '160px',
                    }}
                  >
                    <SpokeCard spoke={spoke} isActive={isCurrent(spoke.href)} />
                  </div>
                );
              })}

              {/* Connecting lines (decorative SVG) */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 400 320"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(16, 185, 129, 0.3)" />
                    <stop offset="100%" stopColor="rgba(6, 182, 212, 0.3)" />
                  </linearGradient>
                </defs>
                {displaySpokes.map((_, index) => {
                  const angle = (360 / displaySpokes.length) * index - 90;
                  const radius = 110;
                  const rad = (angle * Math.PI) / 180;
                  const x2 = 200 + Math.cos(rad) * radius;
                  const y2 = 160 + Math.sin(rad) * radius;
                  return (
                    <line
                      key={index}
                      x1="200"
                      y1="160"
                      x2={x2}
                      y2={y2}
                      stroke="url(#lineGrad)"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Tablet: Horizontal scroll row with hub on left */}
          <div className="hidden md:grid lg:hidden grid-cols-12 gap-4">
            <div className="col-span-4">
              <HubCard hub={hub} isActive={isCurrent(hub.href)} />
            </div>
            <div className="col-span-8">
              <div className="grid grid-cols-2 gap-3">
                {displaySpokes.map((spoke) => (
                  <SpokeCard key={spoke.href} spoke={spoke} isActive={isCurrent(spoke.href)} />
                ))}
              </div>
            </div>
          </div>

          {/* Mobile: Stacked layout */}
          <div className="md:hidden space-y-3">
            <HubCard hub={hub} isActive={isCurrent(hub.href)} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {displaySpokes.map((spoke) => (
                <SpokeCard key={spoke.href} spoke={spoke} isActive={isCurrent(spoke.href)} />
              ))}
            </div>
          </div>

          {/* Extra spokes (if more than 8) — shown as a tag row */}
          {extraSpokes.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-700/50">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">More topics</p>
              <div className="flex flex-wrap gap-2">
                {extraSpokes.map((spoke) => (
                  <a
                    key={spoke.href}
                    href={spoke.href}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${
                      isCurrent(spoke.href)
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-medium'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {spoke.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

/* ─── Sub-components ─── */

function HubCard({ hub, isActive }) {
  return (
    <a
      href={hub.href}
      className={`group block w-40 text-center transition-all duration-300 ${
        isActive ? 'scale-105' : 'hover:scale-105'
      }`}
    >
      <div
        className={`relative rounded-2xl p-5 border-2 transition-all duration-300 ${
          isActive
            ? 'bg-gradient-to-br from-emerald-600/30 to-cyan-600/20 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
            : 'bg-gradient-to-br from-slate-700/50 to-slate-800/50 border-slate-600/40 group-hover:border-cyan-500/40 group-hover:shadow-lg group-hover:shadow-cyan-500/10'
        }`}
      >
        {/* Hub icon */}
        <div
          className={`w-14 h-14 mx-auto mb-3 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 ${
            isActive
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-slate-700/50 text-slate-300 group-hover:bg-cyan-500/20 group-hover:text-cyan-400'
          }`}
        >
          {hub.icon || '🎯'}
        </div>

        {/* Hub title */}
        <h3
          className={`font-bold text-sm leading-tight transition-colors ${
            isActive ? 'text-emerald-400' : 'text-white group-hover:text-cyan-300'
          }`}
        >
          {hub.title}
        </h3>

        {/* Active indicator */}
        {isActive && (
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
    </a>
  );
}

function SpokeCard({ spoke, isActive }) {
  return (
    <a
      href={spoke.href}
      className={`group block transition-all duration-300 ${isActive ? 'scale-105' : 'hover:scale-105'}`}
    >
      <div
        className={`rounded-xl px-4 py-3 border transition-all duration-300 ${
          isActive
            ? 'bg-emerald-500/10 border-emerald-500/40 shadow-md shadow-emerald-500/5'
            : 'bg-slate-800/40 border-slate-700/40 group-hover:bg-slate-700/60 group-hover:border-cyan-500/30 group-hover:shadow-md group-hover:shadow-cyan-500/5'
        }`}
      >
        <div className="flex items-center gap-2">
          {/* Dot indicator */}
          <div
            className={`w-2 h-2 rounded-full flex-shrink-0 transition-all ${
              isActive ? 'bg-emerald-400 scale-125' : 'bg-slate-600 group-hover:bg-cyan-400'
            }`}
          />

          <div className="min-w-0">
            <p
              className={`text-sm font-medium truncate transition-colors ${
                isActive ? 'text-emerald-400' : 'text-slate-300 group-hover:text-cyan-300'
              }`}
            >
              {spoke.title}
            </p>
            {spoke.description && (
              <p className="text-xs text-slate-500 truncate mt-0.5">{spoke.description}</p>
            )}
          </div>

          {/* Arrow */}
          <svg
            className={`w-4 h-4 flex-shrink-0 ml-auto transition-all ${
              isActive
                ? 'text-emerald-400 translate-x-0.5'
                : 'text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5'
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </a>
  );
}
