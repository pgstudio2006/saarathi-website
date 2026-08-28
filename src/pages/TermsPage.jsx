import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const LAST_UPDATED = '28 August 2026'

const tocLinks = [
  { id: 'short-version', label: 'Short version' },
  { id: 'scope', label: 'What these terms cover' },
  { id: 'medical', label: 'Not medical advice' },
  { id: 'acceptable-use', label: 'Using this website' },
  { id: 'waitlist', label: 'The waitlist' },
  { id: 'app-status', label: 'The app is not out yet' },
  { id: 'our-content', label: 'Our content' },
  { id: 'your-messages', label: 'Messages to us' },
  { id: 'third-parties', label: 'Third parties' },
  { id: 'warranties', label: 'No warranties' },
  { id: 'liability', label: 'Liability' },
  { id: 'law', label: 'Governing law' },
  { id: 'changes', label: 'Changes' },
  { id: 'contact', label: 'Contact' },
]

function Section({ id, title, children }) {
  return (
    <div id={id} style={{ scrollMarginTop: '7rem' }}>
      <h2>{title}</h2>
      {children}
    </div>
  )
}

export default function TermsPage({ openModal }) {
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
            <span>Legal</span>
          </nav>
          <div className="article-cat">Terms of Use</div>
          <h1 className="article-title">The ground rules, kept simple.</h1>
          <div className="article-meta">
            <div className="article-meta__item">
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" /><path d="M8 4v4l3 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
              Last updated: {LAST_UPDATED}
            </div>
            <div className="article-meta__item">
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M10 2H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6l-4-4z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /><path d="M10 2v4h4M6 7h4M6 11h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Version 1.0
            </div>
            <div className="article-meta__item">
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" /><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.4" /></svg>
              Applies to this website
            </div>
          </div>
        </div>
      </div>

      <section className="article-body-section">
        <div className="wrap wrap--article">
          <div className="policy-toc" role="navigation" aria-label="Sections of the terms of use">
            {tocLinks.map((l) => (
              <a key={l.id} className="policy-toc__item" href={`#${l.id}`}>{l.label}</a>
            ))}
          </div>

          <article className="article-body reveal">
            <p>
              These terms set out the ground rules for using the Saarathi website. We have kept them as short and
              human as we can — because legal pages made of walls of text help no one, least of all tired parents.
            </p>

            <div className="article-waitlist policy-summary" id="short-version" style={{ scrollMarginTop: '7rem' }}>
              <div className="article-waitlist__title">The short version</div>
              <ul>
                <li>This website shares information about Saarathi and lets you join the waitlist. That is all it does right now.</li>
                <li>Nothing on this site is <strong>medical advice</strong>. Please speak to your doctor or developmental specialist about your child.</li>
                <li>The Saarathi app is <strong>not available for download yet</strong> — the store buttons are placeholders until launch.</li>
                <li>The words, articles and design here belong to Saarathi. Share links freely; please ask before republishing.</li>
                <li>Use the site lawfully and kindly, and these terms will never be something you need to think about again.</li>
              </ul>
            </div>

            <Section id="scope" title="1. What these terms cover">
              <p>
                These Terms of Use (&ldquo;terms&rdquo;) form an agreement between you and <strong>Saarathi</strong> about your use of
                this website — its pages, articles, blog and waitlist.
              </p>
              <p>
                Saarathi has not launched yet. When the app launches, it will come with its own terms and its own
                privacy policy; until then, these terms cover the website only. By using this website, you agree to
                these terms. If you do not agree with them, please do not use the site — and feel free to write to us
                about what you would change.
              </p>
              <p>
                These terms work alongside our <a href="/privacy">Privacy Policy</a>, which explains how we handle the
                little information this website collects.
              </p>
            </Section>

            <Section id="medical" title="2. Not medical advice — please read this one">
              <p>
                Saarathi is being built to support families, not to replace professionals. Everything on this website —
                our articles, blog posts, and descriptions of the future app — is general information for awareness and
                education. It is <strong>not</strong> medical advice, diagnosis, or treatment, and reading this site or
                joining our waitlist does not create any clinician–patient relationship.
              </p>
              <p>
                The ISAA-based screening we describe is a developmental <em>screening</em> tool. A screening is not a
                diagnosis, and a screening result never replaces an evaluation by a developmental paediatrician,
                clinical psychologist, or therapist.
              </p>
              <p>
                If you are worried about your child's development, please speak to a qualified professional — early
                support genuinely matters. And if you or your child are in crisis, please contact your local emergency
                or mental-health services straight away.
              </p>
            </Section>

            <Section id="acceptable-use" title="3. Using this website">
              <p>You agree to use this website lawfully, and kindly. That means not:</p>
              <ul>
                <li>attempting to breach, test, or circumvent the site's security, or accessing the administrative area without authorisation;</li>
                <li>scraping, bulk-downloading, or systematically copying content from the site;</li>
                <li>interfering with the site's operation, or introducing anything harmful to it;</li>
                <li>misrepresenting your identity, or using the site for any unlawful purpose;</li>
                <li>using the site in a way that would harm other families or the Saarathi community.</li>
              </ul>
              <p>
                This website is intended for adults — parents, caregivers, and professionals. It is not directed at
                children, and you must be at least 18 years old to provide any information through it (such as a
                waitlist email).
              </p>
            </Section>

            <Section id="waitlist" title="4. The waitlist">
              <p>
                Joining the waitlist is voluntary, and it means exactly one thing: you are asking us to let you know
                when Saarathi is ready. It does not guarantee access, a place in line, or a launch date. We may
                prioritise early access as we see fit — for example, for families participating in early testing.
              </p>
              <p>
                You can leave the waitlist at any time by emailing us; we will remove your details promptly. Your
                email is handled as described in our <a href="/privacy">Privacy Policy</a>. One email address per
                person, please — and only an address you are allowed to use.
              </p>
            </Section>

            <Section id="app-status" title="5. The app is not available yet">
              <p>
                The &ldquo;Google Play&rdquo; and &ldquo;App Store&rdquo; buttons on this site are placeholders. The
                app has not launched, and features described here — screening, insights, daily guidance, and
                everything else — are our current plans, not promises. They may change, improve, or be dropped before
                launch. Nothing on this website is an offer to provide the app, and no download is available yet.
              </p>
            </Section>

            <Section id="our-content" title="6. Our content and intellectual property">
              <p>
                Everything on this website — the articles, text, design, logos, illustrations, and the Saarathi name —
                is owned by Saarathi and protected by intellectual property laws. © 2026 Saarathi. All rights
                reserved.
              </p>
              <p>You are welcome to:</p>
              <ul>
                <li>read, print, and share anything here for your personal, non-commercial use;</li>
                <li>share links to our pages with anyone who might find them helpful;</li>
                <li>quote short passages with attribution and a link back to us.</li>
              </ul>
              <p>
                You are not welcome to republish, reproduce, modify, or use our content commercially without our
                written permission — just email us and ask; the answer is usually yes. Third-party names and logos
                mentioned on this site belong to their respective owners.
              </p>
            </Section>

            <Section id="your-messages" title="7. Messages you send us">
              <p>
                If you email us — to join the waitlist, ask a question, or share feedback — you give us permission to
                read and use your message to respond and to improve Saarathi. Please do not send us confidential
                information, and please do not include sensitive details about your child; we do not need them, and
                we would rather you kept them safe.
              </p>
              <p>
                On our side: we will reach out personally, we will not spam you, and we will never sell your details.
                That is a promise, not a clause.
              </p>
            </Section>

            <Section id="third-parties" title="8. Third-party services and links">
              <p>
                This website relies on a small number of third-party services — Netlify for hosting, and Google for
                fonts and waitlist storage. Those services are governed by their own terms and policies, which apply
                between you and them.
              </p>
              <p>
                Where we link to other websites, we do so because we think they may help. We do not control them and
                are not responsible for their content or practices.
              </p>
            </Section>

            <Section id="warranties" title="9. No warranties">
              <p>
                This website is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;. We work hard to keep it
                accurate, kind, and online — but to the fullest extent permitted by law, we make no warranties about
                the completeness, reliability, or availability of the site or its content. We are humans doing our
                best; please verify anything that matters with a qualified professional.
              </p>
            </Section>

            <Section id="liability" title="10. Limitation of liability">
              <p>
                To the maximum extent permitted by law, Saarathi and its team will not be liable for any indirect,
                incidental, or consequential loss or damage arising from your use of — or inability to use — this
                website. Nothing in these terms limits liability that cannot be limited under applicable law.
              </p>
            </Section>

            <Section id="law" title="11. Governing law">
              <p>
                These terms are governed by the laws of India, and any disputes relating to this website will be
                subject to the exclusive jurisdiction of the Indian courts.
              </p>
            </Section>

            <Section id="changes" title="12. Changes to these terms">
              <p>
                We may update these terms as the website — and Saarathi itself — evolves. When we do, we will change
                the &ldquo;last updated&rdquo; date above and note what changed. Continuing to use the site after an
                update means you accept the updated terms; if a change matters, we will make it easy to see.
              </p>
            </Section>

            <Section id="contact" title="13. Contact us">
              <p>Questions about these terms, or anything else at all:</p>
              <p><strong>Email: hello@saarathi.care</strong></p>
              <p>We read every message ourselves. That has been true so far, and it will stay true.</p>
            </Section>

            <div className="article-divider" aria-hidden="true"></div>

            <blockquote>
              <p>We would rather earn your trust than bind you in fine print. These terms exist so everyone knows exactly where they stand.</p>
            </blockquote>
          </article>

          <div className="article-waitlist reveal">
            <h2 className="article-waitlist__title">That is all the small print.</h2>
            <p className="article-waitlist__body">Now that the ground rules are clear — we would love to have your family on the list.</p>
            <button className="btn btn-primary" onClick={openModal}>Join Waitlist</button>
          </div>
        </div>
      </section>
    </main>
  )
}
