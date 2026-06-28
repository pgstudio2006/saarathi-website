import { useState, useEffect } from 'react'

export default function WaitlistModal() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
    setEmail('')
    setTimeout(() => setOpen(false), 1800)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
        onClick={() => setOpen(false)}
      />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-slate-900/20 p-6 sm:p-8 md:p-10 animate-fade-up">
        <button
          onClick={() => setOpen(false)}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center justify-center gap-2 mb-6">
          <img src="/logo.svg" alt="Sarthi" className="h-9 w-auto" />
          <span className="font-display text-xl font-bold tracking-tight text-slate-900">Sarthi</span>
        </div>

        <div className="relative flex items-center justify-center gap-2 sm:gap-3 mb-7 h-40 sm:h-44 perspective-[1200px]">
          <div className="w-20 sm:w-24 origin-bottom-right -rotate-[10deg] drop-shadow-xl">
            <img src="/03_Anchor (1).svg" alt="" className="w-full rounded-[1.25rem]" />
          </div>
          <div className="w-24 sm:w-28 z-10 drop-shadow-2xl">
            <img src="/03_Anchor.svg" alt="" className="w-full rounded-[1.5rem]" />
          </div>
          <div className="w-20 sm:w-24 origin-bottom-left rotate-[10deg] drop-shadow-xl">
            <img src="/03_Anchor (2).svg" alt="" className="w-full rounded-[1.25rem]" />
          </div>
        </div>

        <h2 className="font-display text-2xl font-bold text-center text-slate-900 leading-snug mb-2">
          Join the waitlist
        </h2>
        <p className="text-sm text-center text-slate-500 mb-6 text-balance">
          Be the first to know when Sarthi launches.
        </p>

        {submitted ? (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-leaf-100 text-leaf-600 mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-base font-semibold text-slate-900">You are on the list!</p>
            <p className="text-sm text-slate-500 mt-1">We will reach out soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all"
            />
            <p className="text-[11px] text-center text-slate-400 leading-snug px-2">
              By signing up, you agree to our Terms of Service and Privacy Policy. No spam, ever.
            </p>
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/15"
            >
              Join the waitlist
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
