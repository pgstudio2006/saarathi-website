import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const LAST_UPDATED = '28 August 2026'

export default function DataDeletionPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: 0.08, rootMargin: '0px 0px -24px 0px' })
    document.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <main>
      <div className="article-header">
        <div className="wrap wrap--article">
          <nav className="article-breadcrumb">
            <button onClick={() => navigate('/')}>Home</button>
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <button onClick={() => navigate('/privacy')}>Privacy Policy</button>
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span>Data Deletion</span>
          </nav>
          <div className="article-cat">Data Deletion</div>
          <h1 className="article-title">Deleting your data, step by step.</h1>
          <div className="article-meta">
            <div className="article-meta__item">
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" /><path d="M8 4v4l3 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
              Last updated: {LAST_UPDATED}
            </div>
          </div>
        </div>
      </div>

      <section className="article-body-section">
        <div className="wrap wrap--article">
          <article className="article-body reveal">
            <p>
              This page explains exactly how to have your personal data deleted from Saarathi, and what
              happens after you ask. It is part of our <a href="/privacy">Privacy Policy</a>; the full detail
              lives there.
            </p>

            <h2>What data Saarathi holds today</h2>
            <p>
              While Saarathi is in its pre-launch phase, this website stores exactly one thing if you choose to
              give it: <strong>your email address</strong> from the waitlist, along with the date you joined and
              the page you joined from. We store nothing else — no accounts, no passwords, and no information
              about your child. When the Saarathi app launches with accounts and screening data, this page will
              be updated to describe how app data is deleted too.
            </p>

            <h2>How to request deletion</h2>
            <p>Send one email — that is the entire process:</p>
            <ul>
              <li>Email <strong>hello@saarathi.care</strong> with the subject line <strong>&ldquo;Delete my data&rdquo;</strong> (any wording works — we read every message).</li>
              <li>Write from the email address you used to join the waitlist, so we can find your entry.</li>
              <li>No forms, no verification hoops, no questions asked.</li>
            </ul>
            <p>
              If you cannot email us for any reason, use the <a href="/privacy#grievance">Grievance Officer</a> contact
              in our Privacy Policy — the same team handles it.
            </p>

            <h2>What happens next</h2>
            <ul>
              <li><strong>Within 48 hours:</strong> we confirm your request.</li>
              <li><strong>Within 30 days:</strong> your email address and every record linked to it are permanently deleted from our systems — including the waitlist database and any backups created since.</li>
              <li>We write back once to confirm the deletion is complete.</li>
            </ul>
            <p>
              One exception worth knowing: if the law requires us to keep a minimal record (for example, a tax
              receipt for a payment — which does not exist yet at the pre-launch stage), we would keep only that
              legal record and delete everything else.
            </p>

            <h2>Questions</h2>
            <p>
              Anything unclear, or you would rather talk before deleting? Write to us anyway — we would rather
              answer questions than lose you quietly. Full contact details and your rights under India's DPDP
              Act are in the <a href="/privacy">Privacy Policy</a>.
            </p>

            <div className="article-divider" aria-hidden="true"></div>

            <blockquote>
              <p>Your data is yours. Asking for it back should never be harder than giving it.</p>
            </blockquote>
          </article>
        </div>
      </section>
    </main>
  )
}
