import { useEffect } from 'react'
import Hero from '../components/Hero'
import Stores from '../components/Stores'
import Articles from '../components/Articles'
import Reality from '../components/Reality'
import Beliefs from '../components/Beliefs'
import FinalCTA from '../components/FinalCTA'

export default function Home() {
  useEffect(() => {
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash)
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100)
      }
    }
  }, [])

  return (
    <main>
      <Hero />
      <Stores />
      <Articles />
      <Reality />
      <Beliefs />
      <FinalCTA />
    </main>
  )
}
