import { useState, useEffect } from 'react'

const navLinks = [
  { name: 'The Reality', href: '/#reality' },
  { name: 'Our Belief', href: '/#belief' },
  { name: 'Awareness', href: '/#awareness' },
  { name: 'Join Waitlist', href: '/#waitlist' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed left-0 right-0 z-50 transition-all duration-500 ease-out ${
        scrolled ? 'top-4 px-4' : 'top-0 px-0'
      }`}
    >
      <div
        className={`mx-auto flex items-center justify-between transition-all duration-500 ease-out ${
          scrolled
            ? 'max-w-3xl px-5 h-14 rounded-full bg-stone-900/90 backdrop-blur-xl shadow-lg shadow-stone-900/20 border border-white/10'
            : 'max-w-7xl px-6 h-24 bg-transparent'
        }`}
      >
        <a href="/" className="flex items-center gap-3 group">
          <img
            src="/logo.svg"
            alt="Sarathi"
            className={`w-auto transition-all duration-500 ease-out group-hover:scale-105 ${
              scrolled ? 'h-9' : 'h-14'
            }`}
          />
          <span className={`font-display font-bold tracking-tight transition-all duration-500 ${
            scrolled ? 'text-lg text-white' : 'text-2xl text-stone-900'
          }`}>
            Sarathi
          </span>
        </a>

        <nav className={`hidden md:flex items-center transition-all duration-500 ${
          scrolled ? 'gap-7' : 'gap-9'
        }`}>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`group/link relative overflow-hidden inline-block text-base font-medium transition-colors ${
                scrolled
                  ? 'text-cream-200/80 hover:text-white'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span className="block transition-transform duration-300 ease-out group-hover/link:-translate-y-full">
                {link.name}
              </span>
              <span className="absolute inset-0 block translate-y-full transition-transform duration-300 ease-out group-hover/link:translate-y-0">
                {link.name}
              </span>
            </a>
          ))}
        </nav>

        <a
          href="/#waitlist"
          className={`group/cta hidden md:inline-flex items-center justify-center overflow-hidden font-semibold rounded-full transition-all hover:-translate-y-0.5 ${
            scrolled
              ? 'px-5 py-2 text-sm bg-white text-stone-900 hover:bg-cream-100'
              : 'px-6 py-2.5 text-base bg-stone-900 text-white hover:bg-stone-800'
          }`}
        >
          <span className="relative block overflow-hidden">
            <span className="block transition-transform duration-300 ease-out group-hover/cta:-translate-y-full">
              Join Waitlist
            </span>
            <span className="absolute inset-0 block translate-y-full transition-transform duration-300 ease-out group-hover/cta:translate-y-0">
              Join Waitlist
            </span>
          </span>
        </a>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`md:hidden p-2 -mr-2 transition-colors ${scrolled ? 'text-white' : 'text-stone-700'}`}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 top-0 z-[-1]"
            onClick={() => setMobileOpen(false)}
          />
          <div className={`md:hidden mx-4 mt-2 bg-stone-900/95 backdrop-blur-xl rounded-2xl shadow-lg shadow-stone-900/20 border border-white/10 px-5 py-5 ${scrolled ? '' : 'mt-0'}`}>
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-medium text-cream-200/90 hover:text-white transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>
        </>
      )}
    </header>
  )
}
