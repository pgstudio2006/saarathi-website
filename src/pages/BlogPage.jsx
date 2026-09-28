import { useEffect, useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { getBlog, loadBlogs, loadCategories, sanitizeHtml } from '../utils/blogs'

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

function MediaHeading({ block, kind }) {
  const hasTitle = Boolean(block.title)
  const hasSub = Boolean(block.subtitle)
  if (!hasTitle && !hasSub) return null
  return (
    <div className={`blog-media__head blog-media__head--${kind}`}>
      {hasTitle && <div className="blog-media__title">{block.title}</div>}
      {hasSub && <div className="blog-media__subtitle">{block.subtitle}</div>}
    </div>
  )
}

function BlogDetail({ slug }) {
  const navigate = useNavigate()
  const [blog, setBlog] = useState(undefined) // undefined = loading, null = missing

  useEffect(() => {
    let alive = true
    setBlog(undefined)
    getBlog(slug).then((b) => { if (alive) setBlog(b || null) })
    return () => { alive = false }
  }, [slug])

  useEffect(() => {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: 0.08, rootMargin: '0px 0px -24px 0px' })
    document.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [blog])

  if (blog === undefined) return <main><div className="wrap wrap--article"><p className="admin-empty-state">Loading…</p></div></main>
  if (blog === null) return <Navigate to="/blogs" replace />

  return (
    <main>
      <div className="article-header">
        <div className="wrap wrap--article">
          <nav className="article-breadcrumb">
            <button onClick={() => navigate('/')}>Home</button>
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <button onClick={() => navigate('/awareness')}>Awareness</button>
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
            {(blog.blocks || []).map((block, i) => {
              if (block.type === 'heading') return <h2 key={i}>{block.value}</h2>
              if (block.type === 'text') {
                if (block.html) return <div key={i} className="rt-content" dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.value) }} />
                const parts = String(block.value || '').split(/\n+/).filter(Boolean)
                return parts.map((p, j) => <p key={`${i}-${j}`}>{p}</p>)
              }
              if (block.type === 'image') {
                return (
                  <figure key={i} className="blog-media">
                    {block.value && <img src={block.value} alt={block.title || ''} className="admin-blog-image" />}
                    <MediaHeading block={block} kind="image" />
                  </figure>
                )
              }
              if (block.type === 'audio') {
                return (
                  <figure key={i} className="blog-media blog-media--audio">
                    <MediaHeading block={block} kind="audio" />
                    <div className="audio-player" style={{ marginBlock: 0 }}>
                      <audio controls src={block.value} style={{ width: '100%' }} />
                    </div>
                  </figure>
                )
              }
              if (block.type === 'video') {
                return (
                  <figure key={i} className="blog-media">
                    <div className="admin-blog-video">
                      <video controls src={block.value} poster={block.poster || undefined} preload="metadata" playsInline />
                    </div>
                    <MediaHeading block={block} kind="video" />
                  </figure>
                )
              }
              return null
            })}
          </article>
        </div>
      </section>
    </main>
  )
}

function BlogList({ categories }) {
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState(null) // null = loading

  useEffect(() => {
    let alive = true
    loadBlogs().then((list) => { if (alive) setBlogs(list) })
    return () => { alive = false }
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
            {(blogs || []).map((blog, i) => (
              <div key={blog.slug} className={`reveal ${i > 0 ? `d${i % 3}` : ''}`}>
                <BlogCard blog={blog} onClick={() => navigate(`/blogs/${blog.slug}`)} />
              </div>
            ))}
            {blogs && blogs.length === 0 && (
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
  const [categories, setCategories] = useState([])
  useEffect(() => { loadCategories().then(setCategories) }, [])
  return slug ? <BlogDetail slug={slug} /> : <BlogList categories={categories} />
}
