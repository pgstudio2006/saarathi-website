import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { articles } from '../data/articles'

function InlineForm({ formId, successId }) {
  const [submitted, setSubmitted] = useState(false)
  if (submitted) {
    return (
      <div className="form-success visible" id={successId} aria-live="polite">
        <div className="form-success__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <div className="form-success__title">You are on the list.</div>
        <p className="form-success__body">We will reach out personally when Saarathi is ready for your family.</p>
      </div>
    )
  }
  return (
    <div id={formId}>
      <form className="hero__form-row" onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }}>
        <label htmlFor={`${formId}-email`} className="sr-only">Your email address</label>
        <input type="email" id={`${formId}-email`} className="field-input" placeholder="Your email address" autoComplete="email" required />
        <button type="submit" className="btn btn-primary">Join Waitlist</button>
      </form>
      <div className="form-trust">
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M8 1.5L2 4v3.5c0 3.3 2.6 6.4 6 7 3.4-.6 6-3.7 6-7V4L8 1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5.5 8l1.75 1.75L10.5 6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        No spam. Just one message when we are ready for you.
      </div>
    </div>
  )
}

export default function Home({ openModal }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.slice(1)
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: 0.08, rootMargin: '0px 0px -24px 0px' })
    document.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const featured = articles.slice(0, 3)

  return (
    <main>
      {/* Hero */}
      <section className="hero" aria-labelledby="hero-h1">
        <div className="wrap">
          <div className="hero__inner">
            <div className="hero__badge"><span className="badge-dot" aria-hidden="true"></span>Coming soon — join the waitlist</div>
            <h1 className="hero__headline" id="hero-h1">Every Small<br />Moment <em>Matters.</em></h1>
            <p className="hero__subhead">You notice everything about your child. We are building something that helps those moments find their meaning.</p>
            <InlineForm formId="heroForm" successId="heroSuccess" />
          </div>
        </div>
        <div className="hero__scroll-cue" aria-hidden="true">
          <span>Scroll</span>
          <svg className="scroll-arrow" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10l6 6 6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </section>

      {/* Awareness preview */}
      <section className="section section--white" id="awareness" aria-labelledby="awareness-h2">
        <div className="wrap">
          <div className="section-hd reveal">
            <div className="eyebrow">Awareness</div>
            <h2 className="section-title" id="awareness-h2">Understanding your child's world,<br />one article at a time.</h2>
            <p className="section-body">Warm, honest writing for parents — grounded in research, free of clinical distance.</p>
          </div>

          <div className="articles-grid">
            {featured.map((a, i) => (
              <button className={`article-card reveal ${i > 0 ? `d${i}` : ''}`} key={a.slug} onClick={() => navigate(`/articles/${a.slug}`)}>
                <div className="ac-visual" style={{ background: a.bg }} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" color={a.color}>
                    {a.slug === 'understanding-autism-beyond-labels' && <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm0-4h-2c0-3.25 3-3 3-5 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 2.5-3 2.75-3 5z" fill="currentColor" fillOpacity=".18" />}
                    {a.slug === 'why-tiny-moments-matter' && <path d="M4.318 6.318a4.5 4.5 0 0 0 0 6.364L12 20.364l7.682-7.682a4.5 4.5 0 0 0-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 0 0-6.364 0z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity=".15" />}
                    {a.slug === 'parent-therapist-collaboration' && <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.5" />}
                  </svg>
                </div>
                <div className="ac-body">
                  <div className="ac-meta"><span className="ac-cat">{a.tag}</span><span className="ac-time">{a.readTime}</span></div>
                  <h3 className="ac-title">{a.title}</h3>
                  <p className="ac-excerpt">{a.excerpt}</p>
                  <span className="ac-link">Read this article <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                </div>
              </button>
            ))}
          </div>

          <div className="awareness-footer-row reveal">
            <p className="awareness-footer-row__text"><strong>More articles on development, parenting, and collaboration.</strong> New pieces added every two weeks.</p>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/awareness')}>View all articles &rarr;</button>
          </div>
        </div>
      </section>

      {/* Reality */}
      <section className="section section--alt" id="reality" aria-labelledby="reality-h2">
        <div className="wrap">
          <div className="section-hd reveal">
            <div className="eyebrow">The daily reality</div>
            <h2 className="section-title" id="reality-h2">Some days, it feels like<br />you are carrying all of it alone.</h2>
            <p className="section-body">The school pickup that did not go well. The therapy session you raced across town for. The quiet worry at 2am about whether your child will be okay. You are holding so much — and most of it, no one else even sees.</p>
          </div>
          <div className="truths">
            <div className="truth reveal">
              <div className="truth__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" /><path d="M6 12v5c3 1.5 9 1.5 12 0v-5" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
              <h3 className="truth__title">School does not always understand</h3>
              <p className="truth__body">You send your child off and spend the day hoping the message got through. The notes home are short. The full story of how the day actually went rarely makes it back to you.</p>
            </div>
            <div className="truth reveal d1">
              <div className="truth__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.65" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
              <h3 className="truth__title">Therapy runs your whole week</h3>
              <p className="truth__body">Speech on Tuesday, OT on Thursday, the long drive, the waiting room, the cost. You show up for every session — then try to remember it all well enough to make it count at home.</p>
            </div>
            <div className="truth reveal d2">
              <div className="truth__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-4.35-9.5-9C1 9 2.5 5 6 5c2 0 3.2 1.2 4 2.5C10.8 6.2 12 5 14 5c3.5 0 5 4 3.5 7C19 16.65 12 21 12 21z" stroke="currentColor" strokeWidth="1.65" strokeLinejoin="round" /></svg></div>
              <h3 className="truth__title">The worry never fully switches off</h3>
              <p className="truth__body">"Is this enough? Am I doing the right things? When will my child be okay?" The questions follow you into the night, and there is rarely anyone to answer them.</p>
            </div>
            <div className="truth reveal d3">
              <div className="truth__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.65" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" /></svg></div>
              <h3 className="truth__title">And you are exhausted</h3>
              <p className="truth__body">Between school, therapy, work, and everyone else who needs you, there is little left for yourself. You keep going anyway — because that is what this kind of love asks of you.</p>
            </div>
          </div>
          <p className="section-body reveal" style={{ marginTop: '2.75rem', textAlign: 'center', marginInline: 'auto', fontWeight: 500, color: 'var(--text-1)' }}>You are not failing. You are carrying something genuinely hard — and you deserve a companion who sees all of it.</p>
        </div>
      </section>

      {/* Manifesto */}
      <section className="section section--white" id="vision" aria-labelledby="vision-h2">
        <div className="wrap">
          <div className="section-hd section-hd--center reveal">
            <div className="eyebrow">Our belief</div>
            <h2 className="section-title" id="vision-h2">What we know to be true.</h2>
            <p className="section-body">Saarathi was not built around technology. It was built around a family. These are the principles that guide everything we make.</p>
          </div>
          <div className="manifesto reveal">
            <div className="manifesto__line"><span className="manifesto__num" aria-hidden="true">01</span><p className="manifesto__text"><em>Parents are the experts.</em> No clinician, algorithm, or framework knows your child the way you do. Every tool we build begins with that truth.</p></div>
            <div className="manifesto__line"><span className="manifesto__num" aria-hidden="true">02</span><p className="manifesto__text">Observation is not a task — it is something every parent already does, every single day. <em>We build tools worthy of that effort.</em></p></div>
            <div className="manifesto__line"><span className="manifesto__num" aria-hidden="true">03</span><p className="manifesto__text">Development is not a race. There is no behind. <em>There is only this child, on this journey, at this moment.</em></p></div>
            <div className="manifesto__line"><span className="manifesto__num" aria-hidden="true">04</span><p className="manifesto__text">The best outcomes happen when parents, therapists, and teachers share the same picture. <em>Alignment is not optional — it is the work.</em></p></div>
            <div className="manifesto__line"><span className="manifesto__num" aria-hidden="true">05</span><p className="manifesto__text">Technology should disappear into the background. <em>You should only ever feel the presence of support — never the weight of a system.</em></p></div>
          </div>
        </div>
      </section>

      {/* Waitlist section */}
      <section className="waitlist-section" id="waitlist" aria-labelledby="waitlist-h2">
        <div className="wrap wrap--narrow">
          <div className="waitlist-section__inner">
            <div className="eyebrow" style={{ justifyContent: 'center' }}>Coming soon</div>
            <h2 className="waitlist-section__title" id="waitlist-h2">Be among the first families<br />to experience Saarathi.</h2>
            <p className="waitlist-section__body">We are opening Saarathi to a small number of families first. Join the waitlist and we will reach out personally — no automated sequences, no sales calls. Just a conversation.</p>
            <InlineForm formId="footForm" successId="footSuccess" />
          </div>
        </div>
      </section>
    </main>
  )
}
