import { useState, useEffect, useRef } from 'react'
import { submitWaitlist } from '../utils/submitWaitlist'

export default function WaitlistModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false)
      setEmail('')
      setError('')
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 280)
    }
  }, [isOpen])

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape' && isOpen) onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError('')
    const result = await submitWaitlist(email)
    setLoading(false)
    if (result.ok) {
      setSubmitted(true)
      setEmail('')
    } else {
      setError(result.error || 'Something went wrong. Please try again.')
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay open" role="dialog" aria-modal="true" aria-labelledby="modalTitle" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <button className="modal__close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </button>

        {!submitted ? (
          <div id="modalFormWrap">
            <div className="modal__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M10 3C10 3 6 5.8 6 9.5C6 11.6 7.6 13.2 10 14C12.4 13.2 14 11.6 14 9.5C14 5.8 10 3 10 3Z" fill="white" fillOpacity=".95" />
                <circle cx="10" cy="17" r="1.5" fill="white" fillOpacity=".6" />
              </svg>
            </div>
            <h2 className="modal__title" id="modalTitle">Join the waitlist</h2>
            <p className="modal__body">Be among the first families to experience Saarathi. We will reach out personally — no automated emails, no sales calls.</p>
            <form className="modal__form" onSubmit={handleSubmit}>
              <label htmlFor="modalEmail" className="sr-only">Your email address</label>
              <input type="email" id="modalEmail" ref={inputRef} className="field-input" placeholder="Your email address" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>{loading ? 'Joining...' : 'Join Waitlist'}</button>
            </form>
            {error && <p className="form-error" role="alert" style={{ marginTop: '0.75rem' }}>{error}</p>}
            <div className="modal__trust">
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 1.5L2 4v3.5c0 3.3 2.6 6.4 6 7 3.4-.6 6-3.7 6-7V4L8 1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5.5 8l1.75 1.75L10.5 6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              No spam. Just one message when we are ready for you.
            </div>
          </div>
        ) : (
          <div className="form-success visible" style={{ paddingBlock: '1rem' }}>
            <div className="form-success__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="form-success__title">You are on the list.</div>
            <p className="form-success__body">We will reach out personally when Saarathi is ready for your family.</p>
          </div>
        )}
      </div>
    </div>
  )
}
