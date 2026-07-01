import { useNavigate, useLocation } from 'react-router-dom'

export default function Footer({ openModal }) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleNav = (href) => {
    if (href === '#waitlist') {
      openModal()
      return
    }
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
  }

  return (
    <footer className="footer" role="contentinfo">
      <div className="wrap">
        <div className="footer__inner">
          <div>
            <div className="footer__logo">
              <div className="footer__logo-mark" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none">
                  <path d="M10 3C10 3 6 5.8 6 9.5C6 11.6 7.6 13.2 10 14C12.4 13.2 14 11.6 14 9.5C14 5.8 10 3 10 3Z" fill="white" fillOpacity=".9" />
                  <circle cx="10" cy="16.5" r="1.4" fill="white" fillOpacity=".55" />
                </svg>
              </div>
              <span className="footer__logo-name">Saarathi</span>
            </div>
            <p className="footer__mission">Your guide. Your companion. Your Saarathi.<br />Built for parents of autistic children — so every small moment finds its meaning.</p>
          </div>
          <div>
            <div className="footer__col-title">Navigate</div>
            <ul className="footer__links">
              <li><span className="footer__link" onClick={() => handleNav('/#reality')}>The Reality</span></li>
              <li><span className="footer__link" onClick={() => handleNav('/#vision')}>Our Belief</span></li>
              <li><span className="footer__link" onClick={() => handleNav('/awareness')}>Awareness</span></li>
              <li><span className="footer__link" onClick={() => handleNav('#waitlist')}>Join Waitlist</span></li>
            </ul>
          </div>
          <div>
            <div className="footer__col-title">More</div>
            <ul className="footer__links">
              <li><span className="footer__link">Privacy Policy</span></li>
              <li><span className="footer__link">Terms of Use</span></li>
              <li><span className="footer__link">Contact</span></li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <p className="footer__copy">© 2026 Saarathi. All rights reserved.</p>
          <p className="footer__tagline">Built with care, for the families who need it most.</p>
        </div>
      </div>
    </footer>
  )
}
