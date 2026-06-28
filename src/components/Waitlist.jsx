import { useState } from 'react'

export default function Waitlist({ variant = 'light' }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
    setEmail('')
    setTimeout(() => setSubmitted(false), 4000)
  }

  const isDark = variant === 'dark'

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          required
          className={`flex-1 px-5 py-3.5 rounded-full border focus:outline-none focus:ring-2 transition-all ${
            isDark
              ? 'bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-sky-400/30 focus:border-sky-400/50'
              : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-sky-500/20 focus:border-sky-500'
          }`}
        />
        <button
          type="submit"
          className={`px-7 py-3.5 text-sm font-semibold rounded-full transition-colors shadow-sm ${
            isDark
              ? 'bg-white text-slate-900 hover:bg-sky-50'
              : 'bg-sky-600 text-white hover:bg-sky-700'
          }`}
        >
          Join Waitlist
        </button>
      </form>
      <p className={`mt-3 text-xs ${isDark ? 'text-sky-100/60' : 'text-slate-500'}`}>
        No spam. Just one message when we are ready for you.
      </p>
      {submitted && (
        <p className={`mt-3 text-sm font-medium animate-fade-in ${isDark ? 'text-sky-200' : 'text-sky-600'}`}>
          Thank you. We will be in touch soon.
        </p>
      )}
    </div>
  )
}
