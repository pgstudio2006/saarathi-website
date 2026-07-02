import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WaitlistModal from './components/WaitlistModal'
import Home from './pages/Home'
import AwarenessPage from './pages/AwarenessPage'
import ArticlePage from './pages/ArticlePage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {
  const [modalOpen, setModalOpen] = useState(false)
  const openModal = () => setModalOpen(true)
  const closeModal = () => setModalOpen(false)

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-[var(--bg)]">
        <WaitlistModal isOpen={modalOpen} onClose={closeModal} />
        <Navbar openModal={openModal} />
        <Routes>
          <Route path="/" element={<Home openModal={openModal} />} />
          <Route path="/awareness" element={<AwarenessPage />} />
          <Route path="/articles/:slug" element={<ArticlePage openModal={openModal} />} />
        </Routes>
        <Footer openModal={openModal} />
      </div>
    </BrowserRouter>
  )
}

export default App
