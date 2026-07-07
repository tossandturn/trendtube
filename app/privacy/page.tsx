import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | TubeFission',
  description: 'TubeFission privacy policy covering account data, public YouTube data, analytics, cookies, workspace storage, and contact information.',
  alternates: { canonical: 'https://tubefission.com/privacy' },
}

export default function PrivacyPage() {
  return (
    <main className="bg-white">
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">Privacy Policy</div>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-gray-950 sm:text-5xl">How TubeFission handles data</h1>
        <p className="mt-4 text-sm text-gray-500">Last updated: July 7, 2026</p>

        <div className="mt-8 space-y-8 text-sm leading-7 text-gray-700">
          <section>
            <h2 className="text-xl font-black text-gray-950">Information we process</h2>
            <p className="mt-2">
              TubeFission analyzes public YouTube data such as video titles, descriptions, channel names, thumbnails, publish dates, view counts, likes, comments, and public metadata returned by YouTube APIs or cached trend snapshots.
            </p>
            <p className="mt-2">
              If you create an account, we may store your email, username, authentication session, saved opportunities, watchlists, alert settings, and account-scoped comparison basket.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-950">How we use information</h2>
            <p className="mt-2">
              We use data to provide video analysis, trend discovery, competitor comparison, saved workspace features, alert configuration, product security, abuse prevention, and product improvement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-950">Cookies, ads, and analytics</h2>
            <p className="mt-2">
              TubeFission may use cookies or local storage for login sessions, region settings, saved workspace state, and product preferences. We use privacy-focused analytics to understand site usage. Pages may include Google AdSense scripts where permitted by policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-950">Your choices</h2>
            <p className="mt-2">
              You can use many analysis pages without an account. Account-only features such as Analysis Basket, saved workspace, alerts, and synced watchlists require login. You may request help with account data by emailing support@tubefission.com.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-950">Contact</h2>
            <p className="mt-2">
              Privacy questions can be sent to <a href="mailto:support@tubefission.com" className="font-bold text-red-600 hover:text-red-700">support@tubefission.com</a>.
            </p>
          </section>
        </div>
      </article>
    </main>
  )
}
