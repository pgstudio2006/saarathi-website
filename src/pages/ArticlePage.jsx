import { useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { getArticle, getRelated } from '../data/articles'

function Infographic() {
  const stats = [
    { value: '1 in 36', label: 'children identified' },
    { value: '3–8', label: 'key years' },
    { value: '100s', label: 'of daily moments' },
  ]
  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 md:p-10 my-12">
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-radial from-sky-500/25 to-transparent blur-3xl" />
      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-extra-wide text-sky-300 mb-2">Infographic</p>
        <h3 className="font-display text-2xl font-bold mb-2">The shape of early development</h3>
        <p className="text-sky-100/70 text-sm max-w-lg mb-8">
          A visual companion to this article. Development is rarely linear — progress comes in waves,
          plateaus, and unexpected leaps.
        </p>
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-white/5 border border-white/10 p-3 sm:p-5 text-center">
              <p className="font-display text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-br from-sky-300 to-sky-500 bg-clip-text text-transparent">
                {s.value}
              </p>
              <p className="text-[11px] sm:text-xs text-sky-100/70 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function InlineCTA() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
    setEmail('')
    setTimeout(() => setSubmitted(false), 4000)
  }
  return (
    <div className="relative overflow-hidden rounded-3xl my-14 p-8 md:p-12 text-center">
      <img src="/background.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-sky-900/30 via-sky-800/20 to-sky-900/40" />
      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-extra-wide text-white/90 mb-3 drop-shadow">
          Coming soon
        </p>
        <h3 className="font-display text-2xl md:text-3xl font-bold text-white leading-snug mb-3 drop-shadow-sm">
          Be the first to know when Sarathi is ready.
        </h3>
        <p className="text-white/90 text-sm max-w-xl mx-auto mb-7 drop-shadow-sm">
          We are building something for parents exactly like you — so no observation, no breakthrough,
          no difficult day goes unwitnessed.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 rounded-3xl sm:rounded-full bg-white shadow-xl shadow-sky-900/10 max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            className="flex-1 bg-transparent px-5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all whitespace-nowrap"
          >
            Join Waitlist
          </button>
        </form>
        <p className="mt-3 text-xs text-white/70 drop-shadow">
          {submitted ? 'Thank you. We will be in touch soon.' : 'No spam. Just one message when we are ready for you.'}
        </p>
      </div>
    </div>
  )
}

export default function ArticlePage() {
  const { slug } = useParams()
  const article = getArticle(slug)

  if (!article) return <Navigate to="/" replace />

  const related = getRelated(slug)

  return (
    <main className="pt-28 md:pt-36 pb-16 md:pb-20">
      <article className="max-w-3xl mx-auto px-5 sm:px-6">
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
          <Link to="/" className="hover:text-sky-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/#awareness" className="hover:text-sky-600 transition-colors">Articles</Link>
          <span>/</span>
          <span className="text-slate-600">{article.tag}</span>
        </nav>

        <span className="inline-block px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold mb-5">
          {article.tag}
        </span>

        <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-slate-900 leading-[1.1] text-balance mb-5">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500 mb-8">
          <span>{article.readTime}</span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span>{article.date}</span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span>Sarathi Awareness</span>
        </div>

        <Infographic />

        <div className="prose-article">
          <p className="text-lg text-slate-700 leading-relaxed mb-6">{article.intro}</p>

          {article.sections.map((section, i) => (
            <div key={i}>
              {section.heading && (
                <h2 className="font-display text-2xl font-bold text-slate-900 mt-10 mb-4">
                  {section.heading}
                </h2>
              )}
              {section.paragraphs.map((p, j) => (
                <p key={j} className="text-slate-600 leading-relaxed mb-5">
                  {p}
                </p>
              ))}
            </div>
          ))}

          <h2 className="font-display text-2xl font-bold text-slate-900 mt-10 mb-4">
            {article.keyPointsTitle}
          </h2>
          <ul className="space-y-3 mb-8">
            {article.keyPoints.map((point, i) => (
              <li key={i} className="flex gap-3 text-slate-600 leading-relaxed">
                <span className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {point}
              </li>
            ))}
          </ul>

          <p className="text-slate-700 leading-relaxed text-lg border-l-2 border-sky-300 pl-5 italic">
            {article.closing}
          </p>
        </div>

        <InlineCTA />
      </article>

      <section className="max-w-6xl mx-auto px-5 sm:px-6 mt-4">
        <h2 className="font-display text-2xl font-bold text-slate-900 mb-6 md:mb-8">Continue reading</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
          {related.map((a) => (
            <Link
              key={a.slug}
              to={`/articles/${a.slug}`}
              className="group p-6 sm:p-7 rounded-3xl border border-slate-100 bg-gradient-to-b from-sky-50/50 to-white hover:border-sky-200 hover:shadow-xl hover:shadow-sky-900/5 transition-all duration-300 hover:-translate-y-1"
            >
              <span className="inline-block px-2.5 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-medium mb-4">
                {a.tag}
              </span>
              <h3 className="font-display text-xl font-semibold text-slate-900 mb-4 leading-tight group-hover:text-sky-600 transition-colors">
                {a.title}
              </h3>
              <span className="inline-flex items-center text-sm font-semibold text-slate-900 group-hover:text-sky-600 transition-colors">
                Read
                <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            to="/#awareness"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-sky-600 transition-colors"
          >
            View all articles
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </main>
  )
}
