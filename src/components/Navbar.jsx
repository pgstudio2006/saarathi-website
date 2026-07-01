import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const navLinks = [
  { name: 'The Reality', href: '/#reality' },
  { name: 'Our Belief', href: '/#vision' },
  { name: 'Awareness', href: '/awareness' },
]

export default function Navbar({ openModal }) {
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
        navigate('/' + href)
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
      <header className={`nav ${scrolled ? 'scrolled' : ''}`} role="banner">
        <div className="wrap">
          <div className="nav__row">
            <button className="logo" aria-label="Saarathi home" onClick={() => handleNav('/')}>
              <div className="logo__mark" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none">
                  <path d="M10 3C10 3 6 5.8 6 9.5C6 11.6 7.6 13.2 10 14C12.4 13.2 14 11.6 14 9.5C14 5.8 10 3 10 3Z" fill="white" fillOpacity=".92" />
                  <circle cx="10" cy="16.5" r="1.4" fill="white" fillOpacity=".55" />
                </svg>
              </div>
              <span className="logo__name">Saarathi<span>.</span></span>
            </button>

            <nav className="nav__links" aria-label="Primary">
              {navLinks.map((link) => (
                <span
                  key={link.name}
                  className="nav__link"
                  onClick={() => handleNav(link.href)}
                >
                  {link.name}
                </span>
              ))}
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
              <button className="btn btn-primary btn-sm nav__cta" onClick={openModal}>Join Waitlist</button>
              <button
                className={`hamburger ${mobileOpen ? 'open' : ''}`}
                aria-label="Open menu"
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                <span></span><span></span><span></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className={`mobile-drawer ${mobileOpen ? 'open' : ''}`} aria-label="Mobile">
        {navLinks.map((link) => (
          <button key={link.name} className="drawer-link" onClick={() => handleNav(link.href)}>
            {link.name}
          </button>
        ))}
        <button className="btn btn-primary btn-block" onClick={() => { setMobileOpen(false); openModal() }}>
          Join Waitlist
        </button>
      </nav>
    </>
  )
}
