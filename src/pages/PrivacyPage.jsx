import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const LAST_UPDATED = '28 August 2026'

const tocLinks = [
  { id: 'short-version', label: 'Short version' },
  { id: 'who-we-are', label: 'Who we are' },
  { id: 'what-we-collect', label: 'What we collect' },
  { id: 'how-we-use', label: 'How we use it' },
  { id: 'consent', label: 'Consent' },
  { id: 'children', label: 'Children' },
  { id: 'cookies', label: 'Cookies & trackers' },
  { id: 'third-parties', label: 'Third parties' },
  { id: 'retention', label: 'Retention' },
  { id: 'security', label: 'Security' },
  { id: 'rights', label: 'Your rights' },
  { id: 'grievance', label: 'Grievance Officer' },
  { id: 'outside-india', label: 'Outside India' },
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

export default function PrivacyPage({ openModal }) {
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
          <div className="article-cat">Privacy Policy</div>
          <h1 className="article-title">Your privacy, treated with the same care.</h1>
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
          <div className="policy-toc" role="navigation" aria-label="Sections of the privacy policy">
            {tocLinks.map((l) => (
              <a key={l.id} className="policy-toc__item" href={`#${l.id}`}>{l.label}</a>
            ))}
          </div>

          <article className="article-body reveal">
            <p>
              Saarathi is being built for families who already carry enough. So this policy is written the way we write
              everything else — plainly, honestly, and without hiding anything in the small print. It explains exactly
              what information this website collects, why we collect it, and what you can do about it. It is short,
              because right now we collect very little.
            </p>

            <div className="article-waitlist policy-summary" id="short-version" style={{ scrollMarginTop: '7rem' }}>
              <div className="article-waitlist__title">The short version</div>
              <ul>
                <li>We collect one thing: your <strong>email address</strong>, if you choose to join the waitlist.</li>
                <li>We use it for one purpose: to reach out to you <strong>personally</strong> when Saarathi is ready. No automated emails. No sales calls.</li>
                <li>We run <strong>no ads, no trackers, no analytics</strong>. We never sell or share your information.</li>
                <li>We collect <strong>nothing about your child</strong> on this website — no names, no diagnoses, no history.</li>
                <li>Ask us to delete your email at any time, and we will — promptly, and without fuss.</li>
              </ul>
            </div>

            <Section id="who-we-are" title="1. Who we are, and what this policy covers">
              <p>
                <strong>Saarathi</strong> is an AI-enabled child development guide for parents of children with autism
                and developmental disabilities. Saarathi has not launched yet — this website is how we introduce
                ourselves, share what we are learning, and let families register interest.
              </p>
              <p>
                This policy covers <strong>this website only</strong> — its pages, articles and waitlist. When the
                Saarathi app launches, we will publish a dedicated privacy policy explaining how the app handles your
                information and your child's information, including how we obtain parental consent. That policy will
                govern the app; this one governs this website.
              </p>
              <p>
                These terms work alongside our <a href="/terms">Terms of Use</a>, which set out the ground rules for
                using this website. For the purposes of India's <em>Digital Personal Data Protection Act, 2023</em>
                (&ldquo;DPDP Act&rdquo;), we act as the <strong>Data Fiduciary</strong> for the personal data described
                below. If you are visiting from outside India, see <a href="#outside-india">section 12</a>.
              </p>
            </Section>

            <Section id="what-we-collect" title="2. What information we collect">
              <h3>What you give us (always voluntary)</h3>
              <p>
                The only personal information this website collects is what you type into the waitlist form:
              </p>
              <ul>
                <li><strong>Your email address</strong> — so we can let you know when Saarathi is ready.</li>
                <li><strong>The date and time</strong> you submitted the form.</li>
                <li><strong>The page you joined from</strong> (for example, the home page or a particular article) — so we understand which of our writing brought you to us.</li>
              </ul>
              <p>
                That is the entire list. We do not ask for your name, phone number, address, payment details — and,
                importantly, we do not ask anything about your child: no name, no date of birth, no diagnosis, no
                developmental history. There is no account to create and nothing to log into.
              </p>
              <h3>What is collected automatically</h3>
              <p>
                Like nearly every website, our hosting provider (Netlify) keeps short-lived technical logs of requests —
                such as IP address, browser type, and which pages were requested. We use these only to keep the site
                secure and working. They are not used to identify you personally, and we do not augment them with
                anything else.
              </p>
            </Section>

            <Section id="how-we-use" title="3. How we use your information">
              <ul>
                <li>To contact you personally when Saarathi is ready for your family — true to our promise: no automated emails, no sales calls.</li>
                <li>To manage the waitlist fairly — removing duplicates and sequencing early access.</li>
                <li>To understand, in aggregate, how many families are interested and which articles resonate, so we can make this site more useful.</li>
              </ul>
              <p>
                We do not use your information for profiling, targeted advertising, or automated decision-making of any
                kind.
              </p>
            </Section>

            <Section id="consent" title="4. Consent, and taking it back">
              <p>
                We process waitlist emails on the basis of <strong>your consent</strong>, which you give freely when you
                submit the form. You can withdraw that consent at any time by emailing us — it is exactly as easy as
                joining was, and we will delete your details from the waitlist.
              </p>
              <p>
                Withdrawing consent does not affect anything we did before you withdrew it — but since the only thing
                we do is hold your email until launch day, withdrawing consent simply means we stop holding it.
              </p>
            </Section>

            <Section id="children" title="5. Children's privacy">
              <p>
                This website is written for <strong>parents, caregivers and professionals</strong> — not for children.
                We do not knowingly collect personal data from anyone under 18, and we do not collect data
                <em> about</em> children at all on this website.
              </p>
              <p>
                If you believe a child has provided us with personal information through this site, please email us and
                we will delete it promptly.
              </p>
              <p>
                Under the DPDP Act, processing a child's data requires verifiable parental consent. We take that
                obligation seriously: when the Saarathi app launches and families begin using it, the handling of
                children's information — with proper parental consent — will be a central, explicitly described part of
                the app's own privacy policy.
              </p>
            </Section>

            <Section id="cookies" title="6. Cookies, trackers and local storage">
              <ul>
                <li><strong>No advertising or tracking cookies.</strong> No Google Analytics or similar analytics. No advertising pixels.</li>
                <li><strong>Google Fonts.</strong> This site loads its typefaces from Google's font servers. To do that, your browser necessarily shares your IP address with Google. This is purely visual — nothing about your visit is recorded by us through fonts.</li>
                <li><strong>Local browser storage.</strong> Used only for administrative features of the site (such as managing blog content by our own team). It stores no personal data about visitors and nothing that identifies you.</li>
                <li><strong>No cross-site tracking of any kind.</strong> What you read here stays here.</li>
              </ul>
            </Section>

            <Section id="third-parties" title="7. Who else can see your data">
              <p>We keep this list deliberately, almost stubbornly, small:</p>
              <ul>
                <li><strong>Google (waitlist storage).</strong> When you join the waitlist, your submission is delivered through a Google Apps Script into a private Google Sheet. Access is restricted to the Saarathi team. Google processes it under its own contractual safeguards.</li>
                <li><strong>Netlify (hosting).</strong> Serves this website and keeps the standard technical logs described in section 2.</li>
                <li><strong>Google Fonts (typeface delivery).</strong> Your IP address, as described in section 6.</li>
              </ul>
              <p>
                That is the entire list. We do not sell, rent, trade or share your personal information with
                advertisers, data brokers, or anyone else — full stop.
              </p>
            </Section>

            <Section id="retention" title="8. How long we keep your information">
              <p>
                Waitlist emails are kept until the first of the following happens: (a) you ask us to delete them,
                (b) you ask us to stop contacting you, or (c) the waitlist is retired — after which the entries are
                deleted. Technical logs from our hosting provider are kept only for the short, fixed period the
                provider defines.
              </p>
              <p>
                When we delete, we delete. There are no ghost copies of your email floating around an advertising
                network — because it was never there in the first place.
              </p>
            </Section>

            <Section id="security" title="9. How we protect your information">
              <p>
                Your waitlist details live in an access-restricted Google Sheet that only the Saarathi team can open.
                This website is served entirely over HTTPS. And honestly, the best security measure we have is the one
                we designed on purpose: we collect so little that there is very little to protect. The safest database
                is a small one.
              </p>
              <p>
                No system is perfect, though. If a security incident ever affects your information, we will tell you
                directly and without delay — and tell you what we are doing about it.
              </p>
            </Section>

            <Section id="rights" title="10. Your rights and choices">
              <p>Wherever you live, you can always:</p>
              <ul>
                <li><strong>Ask what we hold about you.</strong> The answer will be short: your email, when you joined, and the page you joined from.</li>
                <li><strong>Ask us to correct it.</strong></li>
                <li><strong>Ask us to delete it.</strong></li>
                <li><strong>Withdraw consent</strong> and stop hearing from us, at any time.</li>
              </ul>
              <p>
                Under the DPDP Act, you also have the right to <strong>nominate</strong> a person to exercise these
                rights on your behalf, and the right to raise a grievance — first with us, and then with the Data
                Protection Board of India.
              </p>
              <p>
                If you are in the EU or UK, the GDPR gives you equivalent rights (access, rectification, erasure,
                restriction, portability, and objection). Write to us and we will honour them under the same standard
                described in this policy.
              </p>
              <p>
                To exercise any of these rights, simply email <strong>hello@saarathi.care</strong>. We will respond
                within 30 days.
              </p>
            </Section>

            <Section id="grievance" title="11. Grievance Officer">
              <p>Under the DPDP Act, we have designated a Grievance Officer for questions and complaints:</p>
              <ul>
                <li><strong>Grievance Officer — Saarathi</strong></li>
                <li>Email: <strong>hello@saarathi.care</strong></li>
              </ul>
              <p>
                We aim to acknowledge every grievance within 48 hours and resolve it within 30 days. If you are not
                satisfied with our response, you may escalate the matter to the Data Protection Board of India.
              </p>
            </Section>

            <Section id="outside-india" title="12. If you visit from outside India">
              <p>
                This website is accessible worldwide. The providers listed in section 7 (Google, Netlify) may process
                data on infrastructure located outside India — and outside your own country. Where required, we rely on
                your consent and on contractual safeguards with these providers.
              </p>
              <p>Whatever your jurisdiction, we apply the same standard described in this policy to every family.</p>
            </Section>

            <Section id="changes" title="13. Changes to this policy">
              <p>
                If we make a material change — for example, launching the app, or adding any new tool that touches
                personal information — we will update this page, change the &ldquo;last updated&rdquo; date above, and,
                if you are on the waitlist, write to you personally before the change takes effect. Where the law
                requires fresh consent, we will ask for it rather than assume it.
              </p>
            </Section>

            <Section id="contact" title="14. Contact us">
              <p>
                If anything here is unclear, or you simply want to talk to a human before trusting us with your email:
              </p>
              <p><strong>Email: hello@saarathi.care</strong></p>
              <p>We read every message ourselves. That has been true so far, and it will stay true.</p>
            </Section>

            <div className="article-divider" aria-hidden="true"></div>

            <blockquote>
              <p>This policy was written by humans, for humans — the same way we intend to build Saarathi.</p>
            </blockquote>
          </article>

          <div className="article-waitlist reveal">
            <h2 className="article-waitlist__title">Ready when you are.</h2>
            <p className="article-waitlist__body">Now that you have read the fine print — and found there is barely any — we would love to have your family on the list.</p>
            <button className="btn btn-primary" onClick={openModal}>Join Waitlist</button>
          </div>
        </div>
      </section>
    </main>
  )
}
