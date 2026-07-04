# Product IA, Mobile, and SEO Redesign Implementation Plan

> **For implementer:** Preserve existing SEO URLs and metadata while simplifying the product navigation and mobile experience.

**Goal:** Reframe TubeFission around Analyze, Discover, Compare, Plan, and Track workflows without removing long-tail SEO landing pages.

**Architecture:** Add a unified product header with one global analysis entry point, then migrate page-level navigation toward the new workflow taxonomy. Keep SEO landing pages available through the header menu, footer links, sitemap, and contextual internal links.

**Tech Stack:** Next.js App Router, React client components, Tailwind CSS, existing YouTube parser and region modules.

---

## Phase 1: Unified Shell

1. Replace the double sticky `RegionBar` + `VideoAnalyzerBar` pattern with a single responsive `ProductHeader`.
2. Keep region switching, auth links, and URL analysis available.
3. On mobile, use a compact one-line header with a menu drawer and an expandable analysis form.
4. Preserve current routes and avoid URL redirects.

## Phase 2: Homepage and Core Flow

1. Make the homepage start from three jobs: Analyze, Discover, Compare.
2. Keep SEO copy and FAQ lower on the page.
3. Add internal links from homepage modules to the existing SEO landing pages.

## Phase 3: Result Pages

1. Optimize video and channel result pages for mobile-first decision reading.
2. Put conclusion/actions before deep diagnostics.
3. Keep advanced analytics modules available lower on the page.

## Phase 4: SEO Preservation

1. Keep existing high-value routes in `app/sitemap.ts`.
2. Keep canonical metadata on SEO landing pages.
3. Add footer/tool-directory links in the unified navigation.
4. Avoid deleting or renaming long-tail pages.

## Phase 5: Verification

1. Run targeted lint on changed files.
2. Run production build when feasible.
3. Verify mobile and desktop screenshots for home, trending, compare, and video pages.
4. Push to GitHub and confirm Vercel deploys the new commit.
