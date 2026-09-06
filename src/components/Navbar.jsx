import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './Navbar.css'

const navLinks = [
  { name: 'The Reality', href: '/#reality' },
  { name: 'Our Belief', href: '/#vision' },
  { name: 'Awareness', href: '/awareness' },
  { name: 'Blogs', href: '/blogs' },
  { name: 'Admin', href: '/admin' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleNav = (href) => {
    if (href.startsWith('/#')) {
      if (location.pathname !== '/') {
        navigate(href)
      } else {
        const id = href.slice(2)
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      navigate(href)
    }
    setMobileOpen(false)
  }

  return (
    <>
      <header className={`topbar ${scrolled ? 'scrolled' : ''}`} role="banner">
        <div className="wrap">
          <a
            className="brand"
            href="/"
            onClick={(e) => { e.preventDefault(); handleNav('/') }}
            aria-label="Saarathi home"
          >
            <span className="brand-mark" aria-hidden="true">
              <img src="/logo.svg" alt="" />
            </span>
            Saarathi
          </a>

          <nav className="nav-links" aria-label="Primary">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNav(link.href) }}
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
            <a
              className="topbar-cta"
              href="/#download"
              onClick={(e) => { e.preventDefault(); handleNav('/#download') }}
            >
              Get the app
            </a>
            <button
              className={`hamburger ${mobileOpen ? 'open' : ''}`}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
              type="button"
            >
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>

      <nav className={`mobile-drawer ${mobileOpen ? 'open' : ''}`} aria-label="Mobile">
        {navLinks.map((link) => (
          <button key={link.name} className="drawer-link" onClick={() => handleNav(link.href)}>
            {link.name}
          </button>
        ))}
        <button
          className="btn btn-primary btn-block"
          onClick={() => { setMobileOpen(false); handleNav('/#download') }}
        >
          Get the app
        </button>
      </nav>
    </>
  )
}
