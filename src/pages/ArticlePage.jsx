import { useEffect, useState, useRef } from 'react'
import { useParams, Navigate, useNavigate } from 'react-router-dom'
import { getArticle, getRelated } from '../data/articles'
import { submitWaitlist } from '../utils/submitWaitlist'

function AudioPlayer({ title, duration }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [speed, setSpeed] = useState(1)
  const rafRef = useRef(null)
  const lastRef = useRef(null)
  const totalSeconds = parseDuration(duration)

  function parseDuration(d) {
    const [m, s] = d.split(':').map(Number)
    return m * 60 + s
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${String(s).padStart(2, '0')}`
  }

  function startLoop() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    lastRef.current = performance.now()
    const loop = (now) => {
      const delta = (now - lastRef.current) / 1000
      lastRef.current = now
      setProgress((p) => {
        const next = p + (delta / totalSeconds) * speed
        if (next >= 1) {
          setIsPlaying(false)
          return 0
        }
        return next
      })
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
  }

  function stopLoop() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
  }

  function togglePlay() {
    if (isPlaying) {
      setIsPlaying(false)
      stopLoop()
    } else {
      setIsPlaying(true)
      startLoop()
    }
  }

  function skip(dir) {
    setProgress((p) => Math.max(0, Math.min(1, p + (dir === 'back' ? -10 : 10) / totalSeconds)))
  }

  function seek(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    setProgress(Math.max(0, Math.min(1, x / rect.width)))
  }

  function cycleSpeed() {
    setSpeed((s) => (s === 1 ? 1.25 : s === 1.25 ? 1.5 : s === 1.5 ? 2 : 1))
  }

  useEffect(() => { return () => stopLoop() }, [])

  return (
    <div className="audio-section" aria-label="Audio player">
      <div className="audio-player">
        <div className="audio-player__top">
          <div className="audio-player__art" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" fill="white" fillOpacity=".95" />
            </svg>
          </div>
          <div className="audio-player__info">
            <div className="audio-player__label">Listen to this article</div>
            <div className="audio-player__title">{title}</div>
          </div>
        </div>

        <div className="audio-player__progress">
          <span className="audio-player__time">{formatTime(progress * totalSeconds)}</span>
          <div className="audio-player__track" onClick={seek} role="slider" aria-label="Seek" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
            <div className="audio-player__fill" style={{ width: `${progress * 100}%` }}></div>
            <div className="audio-player__thumb" style={{ left: `${progress * 100}%` }}></div>
          </div>
          <span className="audio-player__time">{duration}</span>
        </div>

        <div className="audio-player__controls">
          <button className="audio-ctrl" aria-label="Skip back 10 seconds" onClick={() => skip('back')}>
            <svg viewBox="0 0 24 24" fill="none"><path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button className="audio-ctrl audio-ctrl--play" aria-label={isPlaying ? 'Pause' : 'Play'} onClick={togglePlay}>
            <svg viewBox="0 0 24 24" fill="none">
              {isPlaying ? (
                <path d="M10 9v6M14 9v6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d="M8 5v14l11-7z" fill="white" />
              )}
            </svg>
          </button>
          <button className="audio-ctrl" aria-label="Skip forward 10 seconds" onClick={() => skip('forward')}>
            <svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button className="audio-speed" aria-label={`Playback speed ${speed}x`} onClick={cycleSpeed}>{speed}x</button>
        </div>
      </div>
    </div>
  )
}

function Infographic({ color, bg }) {
  const stats = [
    { value: '1 in 36', label: 'children identified' },
    { value: '3–8', label: 'key years' },
    { value: '100s', label: 'of daily moments' },
  ]
  return (
    <div className="infographic-section">
      <div className="infographic" style={{ background: bg }}>
        <div className="infographic__badge">Visual summary</div>
        <div className="infographic__icon" aria-hidden="true" style={{ color }}>
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M3 3v18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18 17V9M13 17V11M8 17v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="infographic__title">The shape of early development</div>
        <p className="infographic__body">A visual companion to this article. Development is rarely linear — progress comes in waves, plateaus, and unexpected leaps.</p>
        <div className="infographic__stats">
          {stats.map((s) => (
            <div className="infographic__stat" key={s.label}>
              <div className="infographic__stat-num">{s.value}</div>
              <div className="infographic__stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ArticleWaitlist() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError('')
    const result = await submitWaitlist(email)
    setLoading(false)
    if (result.ok) {
      setSubmitted(true)
      setEmail('')
    } else {
      setError(result.error || 'Something went wrong. Please try again.')
    }
  }

  if (submitted) {
    return (
      <div className="article-waitlist">
        <div className="form-success visible" style={{ padding: '1rem 0' }}>
          <div className="form-success__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div className="form-success__title">You are on the list.</div>
          <p className="form-success__body">We will reach out personally when Saarathi is ready for your family.</p>
        </div>
      </div>
    )
  }
  return (
    <div className="article-waitlist">
      <h2 className="article-waitlist__title">Be among the first families.</h2>
      <p className="article-waitlist__body">Saarathi is opening to a small number of families first. Join the waitlist and we will reach out when it is your turn.</p>
      <form className="wl-form" onSubmit={handleSubmit}>
        <label htmlFor="articleWlemail" className="sr-only">Email address</label>
        <input type="email" id="articleWlemail" className="field-input" placeholder="Your email address" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Joining...' : 'Join Waitlist'}</button>
      </form>
      {error && <p className="form-error" role="alert">{error}</p>}
    </div>
  )
}

export default function ArticlePage({ openModal }) {
  const { slug } = useParams()
  const navigate = useNavigate()
  const article = getArticle(slug)
  const related = getRelated(slug)

  useEffect(() => {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: 0.08, rootMargin: '0px 0px -24px 0px' })
    document.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [slug])

  if (!article) return <Navigate to="/" replace />

  return (
    <main>
      <div className="article-header">
        <div className="wrap wrap--article">
          <nav className="article-breadcrumb">
            <button onClick={() => navigate('/')}>Home</button>
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <button onClick={() => navigate('/awareness')}>Awareness</button>
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span>{article.tag}</span>
          </nav>
          <div className="article-cat">{article.tag}</div>
          <h1 className="article-title">{article.title}</h1>
          <div className="article-meta">
            <div className="article-meta__item">
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" /><path d="M8 4v4l3 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
              {article.readTime}
            </div>
            <div className="article-meta__item">
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" /><path d="M2 7h12M5 1v3M11 1v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
              {article.date}
            </div>
            <div className="article-meta__item">
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M10 2H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6l-4-4z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /><path d="M10 2v4h4M6 7h4M6 11h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Saarathi Awareness
            </div>
          </div>
        </div>
      </div>

      <div className="wrap wrap--article">
        <AudioPlayer title={article.title} duration={article.duration} />
        <Infographic color={article.color} bg={article.bg} />
      </div>

      <section className="article-body-section">
        <div className="wrap wrap--article">
          <article className="article-body reveal">
            <p>{article.intro}</p>
            {article.sections.map((section, i) => (
              <div key={i}>
                {section.heading && <h2>{section.heading}</h2>}
                {section.paragraphs.map((p, j) => (
                  <p key={j} dangerouslySetInnerHTML={{ __html: p }}></p>
                ))}
              </div>
            ))}
            <div className="article-divider" aria-hidden="true"></div>
            <h2>{article.keyPointsTitle}</h2>
            <ul>
              {article.keyPoints.map((point, i) => <li key={i}>{point}</li>)}
            </ul>
            <blockquote><p>{article.closing}</p></blockquote>
          </article>

          <div className="reveal">
            <ArticleWaitlist />
          </div>
        </div>
      </section>

      <section className="similar-section">
        <div className="wrap">
          <h2 className="similar-title">Continue reading</h2>
          <div className="similar-grid">
            {related.map((a) => (
              <button className="sim-card" key={a.slug} onClick={() => navigate(`/articles/${a.slug}`)}>
                <div className="sim-card__visual" style={{ background: a.bg }} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" color={a.color}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm0-4h-2c0-3.25 3-3 3-5 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 2.5-3 2.75-3 5z" fill="currentColor" fillOpacity=".18" />
                  </svg>
                </div>
                <div className="sim-card__cat">{a.tag}</div>
                <h3 className="sim-card__title">{a.title}</h3>
                <span className="sim-card__link">Read <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
              </button>
            ))}
          </div>
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/awareness')}>View all articles &rarr;</button>
          </div>
        </div>
      </section>
    </main>
  )
}
