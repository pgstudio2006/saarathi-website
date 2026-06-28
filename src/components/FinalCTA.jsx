import { useState } from 'react'

export default function FinalCTA() {
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
    <section id="waitlist" className="py-12 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] px-6 py-12 sm:px-8 sm:py-16 md:px-16 md:py-24 text-center">
          <img
            src="/background.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-sky-900/30 via-sky-800/20 to-sky-900/40" />

          <div className="relative">
            <p className="text-xs font-semibold tracking-extra-wide uppercase text-white/90 mb-5 drop-shadow">Coming soon</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-white text-balance mb-5 md:mb-6 leading-[1.05] drop-shadow-sm">
              Be among the first families.
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed drop-shadow-sm">
              We are opening Sarathi to a small number of families first. Join the waitlist and we will reach out personally — no automated sequences, no sales calls. Just a conversation.
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
                className="group inline-flex items-center justify-center gap-2 pl-5 pr-4 py-2.5 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all whitespace-nowrap"
              >
                Join waitlist
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            </form>
            {submitted ? (
              <p className="mt-4 text-sm font-medium text-white drop-shadow">
                Thank you. We will be in touch soon.
              </p>
            ) : (
              <p className="mt-4 text-xs text-white/70 drop-shadow">
                No spam. Your data stays private. Just one message when we are ready.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
