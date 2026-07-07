import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | TubeFission',
  description: 'TubeFission terms covering acceptable use, public YouTube data analysis, accounts, limitations, and contact information.',
  alternates: { canonical: 'https://tubefission.com/terms' },
}

export default function TermsPage() {
  return (
    <main className="bg-white">
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">Terms of Service</div>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-gray-950 sm:text-5xl">Using TubeFission responsibly</h1>
        <p className="mt-4 text-sm text-gray-500">Last updated: July 7, 2026</p>

        <div className="mt-8 space-y-8 text-sm leading-7 text-gray-700">
          <section>
            <h2 className="text-xl font-black text-gray-950">Service purpose</h2>
            <p className="mt-2">
              TubeFission provides YouTube trend intelligence, video analysis, comparison tools, watchlists, alerts, and creator planning workflows based on public data and product-generated scoring.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-950">Acceptable use</h2>
            <p className="mt-2">
              Do not use TubeFission to scrape at abusive scale, infringe copyright, harass creators, misrepresent data, bypass access controls, or violate YouTube terms, Google policies, or applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-950">Analysis limitations</h2>
            <p className="mt-2">
              Scores and recommendations are decision aids inferred from public signals. They are not guarantees of views, revenue, ranking, or monetization approval. You remain responsible for your content decisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-950">Accounts and workspace features</h2>
            <p className="mt-2">
              Some features, including Analysis Basket, saved workspace, watchlists, and alerts, require login. Keep your account credentials secure and contact support if you believe your account has been misused.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-950">Contact</h2>
            <p className="mt-2">
              Terms questions can be sent to <a href="mailto:support@tubefission.com" className="font-bold text-red-600 hover:text-red-700">support@tubefission.com</a>.
            </p>
          </section>
        </div>
      </article>
    </main>
  )
}
