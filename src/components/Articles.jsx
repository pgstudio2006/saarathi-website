import { Link } from 'react-router-dom'
import { articles } from '../data/articles'

export default function Articles() {
  return (
    <section id="awareness" className="py-16 md:py-24 lg:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="mb-12 md:mb-20">
          <p className="section-label mb-5">Awareness</p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-slate-900 text-balance max-w-3xl leading-[1.1]">
            Understanding your child's world, one article at a time.
          </h2>
          <p className="mt-4 text-slate-600 max-w-2xl text-base sm:text-lg">
            Warm, honest writing for parents — grounded in research, free of clinical distance.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {articles.map((article) => (
            <Link
              key={article.slug}
              to={`/articles/${article.slug}`}
              className="group flex flex-col p-6 sm:p-8 rounded-3xl border border-slate-100 bg-gradient-to-b from-sky-50/50 to-white hover:bg-white hover:border-sky-200 hover:shadow-xl hover:shadow-sky-900/5 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center gap-3 text-xs font-medium text-slate-500 mb-8">
                <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-700">{article.tag}</span>
                <span>{article.readTime}</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-semibold text-slate-900 mb-3 sm:mb-4 group-hover:text-sky-600 transition-colors leading-tight">
                {article.title}
              </h3>
              <p className="text-slate-600 leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base">
                {article.excerpt}
              </p>
              <span className="mt-auto inline-flex items-center text-sm font-semibold text-slate-900 group-hover:text-sky-600 transition-colors">
                Read this article
                <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-12 md:mt-16 text-center">
          <p className="text-xs text-slate-500">
            New pieces added every two weeks.
          </p>
        </div>
      </div>
    </section>
  )
}
