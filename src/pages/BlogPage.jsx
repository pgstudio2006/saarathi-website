import { useEffect, useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { getBlogs, getBlog } from '../utils/blogs'

function BlogCard({ blog, onClick }) {
  return (
    <button className="article-card" onClick={onClick}>
      <div className="ac-visual" style={{ background: blog.bg }} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" color={blog.color}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="ac-body">
        <div className="ac-meta">
          <span className="ac-cat">{blog.tag}</span>
          <span className="ac-time">{blog.readTime}</span>
          {blog.featured && <span className="ac-featured-tag">Featured</span>}
        </div>
        <h2 className="ac-title">{blog.title}</h2>
        <p className="ac-excerpt">{blog.excerpt}</p>
        <span className="ac-link">Read this blog <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
      </div>
    </button>
  )
}

function BlogDetail({ slug }) {
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)

  useEffect(() => {
    setBlog(getBlog(slug))
  }, [slug])

  useEffect(() => {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: 0.08, rootMargin: '0px 0px -24px 0px' })
    document.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [blog])

  if (!blog) return <Navigate to="/blogs" replace />

  return (
    <main>
      <div className="article-header">
        <div className="wrap wrap--article">
          <nav className="article-breadcrumb">
            <button onClick={() => navigate('/')}>Home</button>
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <button onClick={() => navigate('/blogs')}>Blogs</button>
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span>{blog.tag}</span>
          </nav>
          <div className="article-cat">{blog.tag}</div>
          <h1 className="article-title">{blog.title}</h1>
          <div className="article-meta">
            <div className="article-meta__item">
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" /><path d="M8 4v4l3 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
              {blog.readTime}
            </div>
            <div className="article-meta__item">
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" /><path d="M2 7h12M5 1v3M11 1v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
              {blog.date}
            </div>
          </div>
        </div>
      </div>

      <section className="article-body-section">
        <div className="wrap wrap--article">
          <article className="article-body reveal">
            {blog.blocks.map((block, i) => {
              if (block.type === 'heading') return <h2 key={i}>{block.value}</h2>
              if (block.type === 'text') return <p key={i}>{block.value}</p>
              if (block.type === 'image') return <img key={i} src={block.value} alt="" className="admin-blog-image" />
              if (block.type === 'audio') return (
                <div key={i} className="audio-player" style={{ marginBlock: '1.5rem' }}>
                  <audio controls src={block.value} style={{ width: '100%' }} />
                </div>
              )
              if (block.type === 'video') return (
                <div key={i} className="admin-blog-video">
                  <video controls src={block.value} />
                </div>
              )
              return null
            })}
          </article>
        </div>
      </section>
    </main>
  )
}

function BlogList() {
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    setBlogs(getBlogs())
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: 0.08, rootMargin: '0px 0px -24px 0px' })
    document.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [blogs])

  return (
    <>
      <div className="page-hd">
        <div className="wrap">
          <div className="page-hd__inner">
            <div className="eyebrow">Blogs</div>
            <h1 className="page-hd__title">Stories, audio, and video for families.</h1>
            <p className="page-hd__desc">Curated posts from the Saarathi team. Text, images, audio clips, and video — all in one place.</p>
          </div>
        </div>
      </div>

      <section className="articles-section">
        <div className="wrap">
          <div className="articles-grid">
            {blogs.map((blog, i) => (
              <div key={blog.slug} className={`reveal ${i > 0 ? `d${i % 3}` : ''}`}>
                <BlogCard blog={blog} onClick={() => navigate(`/blogs/${blog.slug}`)} />
              </div>
            ))}
            {blogs.length === 0 && (
              <div className="no-results visible" style={{ gridColumn: '1/-1' }}>
                <p className="no-results__title">No blogs yet.</p>
                <p className="no-results__body">Check back soon for new posts.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default function BlogPage() {
  const { slug } = useParams()
  return slug ? <BlogDetail slug={slug} /> : <BlogList />
}
