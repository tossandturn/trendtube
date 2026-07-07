import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact TubeFission | Product Support and Data Questions',
  description: 'Contact TubeFission for product support, YouTube data questions, account help, partnerships, or policy concerns.',
  alternates: { canonical: 'https://tubefission.com/contact' },
}

export default function ContactPage() {
  return (
    <main className="bg-white">
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">Contact</div>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-gray-950 sm:text-5xl">Get help with TubeFission</h1>
        <p className="mt-5 text-base leading-8 text-gray-700">
          Use this page for product support, data quality questions, account issues, partnerships, or policy concerns. We review messages related to TubeFission, YouTube trend analysis, saved workspaces, alerts, and comparison workflows.
        </p>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <h2 className="text-lg font-black text-gray-950">Email</h2>
          <p className="mt-2 text-sm leading-7 text-gray-700">
            Contact: <a href="mailto:support@tubefission.com" className="font-bold text-red-600 hover:text-red-700">support@tubefission.com</a>
          </p>
          <p className="mt-3 text-sm leading-7 text-gray-600">
            Include the page URL, your account email if relevant, and a short description of the issue. For data questions, include the video ID, channel ID, or trend URL you are reviewing.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            { title: 'Product support', copy: 'Login, saved workspace, watchlist, alerts, comparison basket, and analysis page issues.' },
            { title: 'Data review', copy: 'Questions about public YouTube data, trend relevance, evidence fit, or a video appearing in the wrong cluster.' },
            { title: 'Policy concerns', copy: 'Privacy, copyright, advertiser safety, or content quality concerns related to the site.' },
            { title: 'Partnerships', copy: 'Creator workflow, agency, research, or integration inquiries.' },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-gray-200 p-5">
              <h2 className="font-bold text-gray-950">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
