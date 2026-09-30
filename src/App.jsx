import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WaitlistModal from './components/WaitlistModal'
import Home from './pages/Home'
import AwarenessPage from './pages/AwarenessPage'
import BlogPage from './pages/BlogPage'
import AdminPage from './pages/AdminPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import DataDeletionPage from './pages/DataDeletionPage'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

// Old hand-written article URLs now resolve to the admin-managed blog pages
function ArticleRedirect() {
  const { slug } = useParams()
  return <Navigate to={`/blogs/${slug}`} replace />
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
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/awareness" element={<AwarenessPage />} />
          {/* Old hand-written article URLs now resolve to the admin-managed blog pages */}
          <Route path="/articles/:slug" element={<ArticleRedirect />} />
          <Route path="/blogs" element={<BlogPage />} />
          <Route path="/blogs/:slug" element={<BlogPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/privacy" element={<PrivacyPage openModal={openModal} />} />
          <Route path="/terms" element={<TermsPage openModal={openModal} />} />
          <Route path="/data-deletion" element={<DataDeletionPage />} />
        </Routes>
        <Footer openModal={openModal} />
      </div>
    </BrowserRouter>
  )
}

export default App
