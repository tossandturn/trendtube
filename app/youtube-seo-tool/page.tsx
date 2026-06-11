import type { Metadata } from 'next'
import Link from 'next/link'
import { BreadcrumbSchema, FAQPageSchema } from '@/app/components/JsonLd'

export const metadata: Metadata = {
  title: '🔍 YouTube SEO Tool 2025 | Optimize Videos for More Views',
  description: 'Optimize your YouTube videos with our free SEO Tool. Analyze titles, descriptions, tags, and thumbnails. Get AI-powered SEO recommendations. Try it now!',
  keywords: 'youtube seo tool, youtube video optimizer, youtube tag generator, youtube title optimizer, youtube seo 2025',
  alternates: {
    canonical: 'https://tubefission.com/youtube-seo-tool',
  },
}

const FAQ_ITEMS = [
  {
    question: 'How does the YouTube SEO Tool work?',
    answer: 'Our tool analyzes your video metadata against top-performing videos in your niche. It provides actionable recommendations for titles, descriptions, tags, and thumbnails based on real data.',
  },
  {
    question: 'What makes a good YouTube title?',
    answer: 'Effective titles include your target keyword within the first 60 characters, create curiosity or promise value, use numbers when relevant, and stay under 70 characters to avoid truncation.',
  },
  {
    question: 'How many tags should I use?',
    answer: 'YouTube allows up to 500 characters for tags. Use 10-15 relevant tags including your main keyword, variations, and related topics. Focus on relevance over quantity.',
  },
  {
    question: 'Does the tool show competitor analysis?',
    answer: 'Yes, the SEO tool compares your metadata against top-ranking videos for your target keywords, showing you exactly what is working in your niche.',
  },
]

export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://tubefission.com' },
        { name: 'YouTube SEO Tool', url: 'https://tubefission.com/youtube-seo-tool' },
      ]} />
      <FAQPageSchema items={FAQ_ITEMS} />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-orange-50 to-white pt-16 pb-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            🔍 YouTube SEO Tool 2025
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            Optimize your videos for maximum visibility. Analyze titles, descriptions, tags, 
            and thumbnails with AI-powered recommendations.
          </p>
        </div>
      </section>

      {/* SEO Analyzer Form */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video Title
              </label>
              <input
                type="text"
                placeholder="Enter your video title..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">0/70 characters</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Keyword
              </label>
              <input
                type="text"
                placeholder="e.g., youtube seo tips"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={4}
                placeholder="Enter your video description..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">0/5000 characters</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                placeholder="seo, youtube, optimization, tags..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <button className="w-full py-4 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors">
              Analyze SEO Score
            </button>
          </div>

          {/* SEO Score Preview */}
          <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">SEO Score</h3>
              <span className="text-3xl font-bold text-orange-600">--/100</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Title Optimization</span>
                <span className="text-sm font-medium text-gray-400">--/25</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Description Quality</span>
                <span className="text-sm font-medium text-gray-400">--/25</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tags Relevance</span>
                <span className="text-sm font-medium text-gray-400">--/25</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Keyword Usage</span>
                <span className="text-sm font-medium text-gray-400">--/25</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <article className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-6">YouTube SEO Best Practices for 2025</h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          YouTube is the second largest search engine in the world. Optimizing your videos for 
          search can dramatically increase your organic reach and help you build a sustainable 
          audience without relying solely on the recommendation algorithm.
        </p>

        <h2 className="text-3xl font-bold mb-6">Title Optimization</h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Your title is the most important SEO element. It needs to include your target keyword 
          while also being compelling enough to earn clicks.
        </p>

        <div className="space-y-4 mb-10">
          <div className="bg-green-50 rounded-lg p-5 border border-green-200">
            <h3 className="font-semibold text-green-900 mb-2">✅ Best Practices</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-green-800">
              <li>Include target keyword in first 60 characters</li>
              <li>Use numbers (e.g., "7 Tips", "Step-by-Step")</li>
              <li>Create curiosity or promise value</li>
              <li>Keep under 70 characters</li>
              <li>Use power words (Ultimate, Complete, Essential)</li>
            </ul>
          </div>
          <div className="bg-red-50 rounded-lg p-5 border border-red-200">
            <h3 className="font-semibold text-red-900 mb-2">❌ Common Mistakes</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-red-800">
              <li>Clickbait titles that do not match content</li>
              <li>All caps or excessive punctuation</li>
              <li>Keyword stuffing</li>
              <li>Vague or generic titles</li>
              <li>Misleading thumbnails and titles</li>
            </ul>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-6">Description SEO</h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Your description should provide context for both viewers and YouTube's algorithm. 
          The first 150 characters are crucial as they appear in search results.
        </p>

        <div className="space-y-4 mb-10">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Description Structure</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>First 150 chars:</strong> Hook + main keyword</p>
              <p><strong>Next paragraph:</strong> Detailed summary with secondary keywords</p>
              <p><strong>Middle section:</strong> Timestamps, resources, links</p>
              <p><strong>End:</strong> Subscribe CTA, social links</p>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-6">Tag Strategy</h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Tags help YouTube understand your video's context and content. While less important 
          than titles and descriptions, they still contribute to your video's discoverability.
        </p>

        <div className="space-y-4 mb-10">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">1</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Start with Exact Match</h3>
              <p className="text-gray-600 text-sm">Include your exact target keyword as the first tag.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">2</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Add Variations</h3>
              <p className="text-gray-600 text-sm">Include keyword variations and related phrases.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">3</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Include Broad Terms</h3>
              <p className="text-gray-600 text-sm">Add broader category tags to reach wider audiences.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">4</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Use All 500 Characters</h3>
              <p className="text-gray-600 text-sm">Maximize your tag limit with relevant keywords.</p>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4 mb-10">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">{item.question}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-8 border border-orange-100 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to Optimize Your Videos?</h2>
          <p className="text-gray-600 mb-6">Use Tubefission's trend analysis to find high-opportunity keywords for your niche.</p>
          <Link href="/trends" className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors">
            Find Trending Keywords →
          </Link>
        </div>
      </article>
    </main>
  )
}
