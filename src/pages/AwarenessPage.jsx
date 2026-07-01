import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { articles, categories } from '../data/articles'

const iconMap = {
  'understanding-autism-beyond-labels': <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm0-4h-2c0-3.25 3-3 3-5 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 2.5-3 2.75-3 5z" fill="currentColor" fillOpacity=".18" />,
  'why-tiny-moments-matter': <path d="M4.318 6.318a4.5 4.5 0 0 0 0 6.364L12 20.364l7.682-7.682a4.5 4.5 0 0 0-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 0 0-6.364 0z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity=".15" />,
  'parent-therapist-collaboration': <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.5" />,
  'early-intervention-research': <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />,
  'you-cannot-pour-from-empty-cup': <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity=".1" />,
  'language-of-routines': <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />,
  'language-of-routines2': <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />,
  'communication-is-not-just-words': <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="currentColor" fillOpacity=".1" />,
  'sensory-processing': <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />,
  'sensory-processing2': <path d="M23 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />,
  'iep-meeting-guide': <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />,
}

function ArticleIcon({ slug, color }) {
  const paths = []
  if (slug === 'language-of-routines') {
    paths.push(<circle key="c" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />)
    paths.push(<path key="p" d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />)
  } else if (slug === 'sensory-processing') {
    paths.push(<circle key="c" cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />)
    paths.push(<path key="p" d="M23 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />)
  } else {
    paths.push(iconMap[slug])
  }
  return <svg viewBox="0 0 24 24" fill="none" color={color}>{paths}</svg>
}

export default function AwarenessPage() {
  const [active, setActive] = useState('All Articles')
  const navigate = useNavigate()

  useEffect(() => {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: 0.08, rootMargin: '0px 0px -24px 0px' })
    document.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [active])

  const filtered = active === 'All Articles' ? articles : articles.filter((a) => a.tag === active)

  return (
    <>
      <div className="page-hd">
        <div className="wrap">
          <div className="page-hd__inner">
            <div className="eyebrow">Awareness</div>
            <h1 className="page-hd__title">Understanding your child's world,<br />one article at a time.</h1>
            <p className="page-hd__desc">Warm, honest writing for parents of autistic children. Grounded in research. Free of clinical distance. Written for families, not professionals.</p>
          </div>
        </div>
      </div>

      <div className="filter-strip" role="navigation" aria-label="Filter by category">
        <div className="filter-scroll">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${active === cat ? 'active' : ''}`}
              onClick={() => setActive(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <section className="articles-section">
        <div className="wrap">
          <div className="articles-grid">
            {filtered.map((a, i) => (
              <button
                key={a.slug}
                className={`article-card reveal ${i === 0 && a.featured ? 'article-card--featured' : ''} ${i > 0 ? `d${i % 3}` : ''}`}
                onClick={() => navigate(`/articles/${a.slug}`)}
              >
                <div className="ac-visual" style={{ background: a.bg }} aria-hidden="true">
                  <ArticleIcon slug={a.slug} color={a.color} />
                </div>
                <div className="ac-body">
                  <div className="ac-meta">
                    <span className="ac-cat">{a.tag}</span>
                    <span className="ac-time">{a.readTime}</span>
                    {a.featured && <span className="ac-featured-tag">Featured</span>}
                  </div>
                  <h2 className="ac-title">{a.title}</h2>
                  <p className="ac-excerpt">{a.excerpt}</p>
                  <span className="ac-link">Read this article <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                </div>
              </button>
            ))}
            <div className={`no-results ${filtered.length === 0 ? 'visible' : ''}`} aria-live="polite">
              <p className="no-results__title">No articles in this category yet.</p>
              <p className="no-results__body">New articles are added every two weeks. Check back soon.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
