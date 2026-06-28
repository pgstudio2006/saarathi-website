import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WaitlistModal from './components/WaitlistModal'
import Home from './pages/Home'
import ArticlePage from './pages/ArticlePage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-white">
        <WaitlistModal />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articles/:slug" element={<ArticlePage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
