import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBlogs, addBlog, updateBlog, deleteBlog, slugify, loginAdmin, logoutAdmin, isAdmin } from '../utils/blogs'

const CATEGORIES = ['Understanding', 'Daily life', 'Therapy', 'School', 'Self-care', 'Research', 'Admin']

const COLORS = [
  { color: '#3A3ABF', bg: '#EEEEFF' },
  { color: '#7EC8C8', bg: '#EAF7F7' },
  { color: '#9B87F5', bg: '#DDD8FD' },
  { color: '#F59E0B', bg: '#FEF3C7' },
  { color: '#EC4899', bg: '#FCE7F3' },
  { color: '#10B981', bg: '#D1FAE5' },
]

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (loginAdmin(password)) {
      onLogin()
    } else {
      setError('Wrong password. Try again.')
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <h1 className="admin-login__title">Admin Login</h1>
        <p className="admin-login__body">Enter the admin password to manage blog posts.</p>
        <form onSubmit={handleSubmit} className="admin-login__form">
          <label htmlFor="adminPassword" className="sr-only">Password</label>
          <input
            id="adminPassword"
            type="password"
            className="field-input"
            placeholder="Admin password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError('') }}
            required
          />
          <button type="submit" className="btn btn-primary btn-block">Login</button>
        </form>
        {error && <p className="form-error" role="alert">{error}</p>}
      </div>
    </div>
  )
}

function BlockEditor({ block, onChange, onRemove, onMove }) {
  const fileRef = useRef(null)
  const [loading, setLoading] = useState(false)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    try {
      const data = await fileToBase64(file)
      onChange({ ...block, value: data })
    } catch {
      alert('Could not read file.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-block">
      <div className="admin-block__hd">
        <span className="admin-block__type">{block.type}</span>
        <div className="admin-block__actions">
          <button type="button" className="admin-block__action" onClick={() => onMove(-1)} aria-label="Move up">&uarr;</button>
          <button type="button" className="admin-block__action" onClick={() => onMove(1)} aria-label="Move down">&darr;</button>
          <button type="button" className="admin-block__action admin-block__action--danger" onClick={onRemove} aria-label="Remove">&times;</button>
        </div>
      </div>
      <div className="admin-block__body">
        {block.type === 'text' && (
          <textarea
            className="admin-textarea"
            placeholder="Write paragraph text..."
            value={block.value}
            onChange={(e) => onChange({ ...block, value: e.target.value })}
            rows={5}
          />
        )}
        {block.type === 'heading' && (
          <input
            type="text"
            className="field-input"
            placeholder="Section heading"
            value={block.value}
            onChange={(e) => onChange({ ...block, value: e.target.value })}
          />
        )}
        {(block.type === 'audio' || block.type === 'video') && (
          <div className="admin-media-input">
            <input
              type="text"
              className="field-input"
              placeholder={`Paste ${block.type} URL (mp3/mp4/webm) or upload file below`}
              value={block.value || ''}
              onChange={(e) => onChange({ ...block, value: e.target.value })}
            />
            <div className="admin-file-row">
              <input
                type="file"
                ref={fileRef}
                accept={block.type === 'audio' ? 'audio/*' : 'video/*'}
                style={{ display: 'none' }}
                onChange={handleFile}
              />
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => fileRef.current?.click()}>
                {loading ? 'Uploading...' : `Upload ${block.type} file`}
              </button>
            </div>
            {block.value && (
              block.type === 'audio' ? (
                <audio controls src={block.value} className="admin-preview-audio" />
              ) : (
                <video controls src={block.value} className="admin-preview-video" />
              )
            )}
          </div>
        )}
        {block.type === 'image' && (
          <div className="admin-media-input">
            <input
              type="text"
              className="field-input"
              placeholder="Paste image URL or upload image"
              value={block.value || ''}
              onChange={(e) => onChange({ ...block, value: e.target.value })}
            />
            <div className="admin-file-row">
              <input
                type="file"
                ref={fileRef}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFile}
              />
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => fileRef.current?.click()}>
                {loading ? 'Uploading...' : 'Upload image'}
              </button>
            </div>
            {block.value && <img src={block.value} alt="Preview" className="admin-preview-image" />}
          </div>
        )}
      </div>
    </div>
  )
}

function BlogEditor({ blog, onSave, onCancel }) {
  const [title, setTitle] = useState(blog?.title || '')
  const [excerpt, setExcerpt] = useState(blog?.excerpt || '')
  const [tag, setTag] = useState(blog?.tag || CATEGORIES[0])
  const [readTime, setReadTime] = useState(blog?.readTime || '5 min')
  const [featured, setFeatured] = useState(blog?.featured || false)
  const [color, setColor] = useState(blog?.color || COLORS[0].color)
  const [bg, setBg] = useState(blog?.bg || COLORS[0].bg)
  const [blocks, setBlocks] = useState(blog?.blocks || [])

  const addBlock = (type) => {
    setBlocks([...blocks, { type, value: '' }])
  }

  const updateBlock = (idx, newBlock) => {
    const next = [...blocks]
    next[idx] = newBlock
    setBlocks(next)
  }

  const removeBlock = (idx) => {
    setBlocks(blocks.filter((_, i) => i !== idx))
  }

  const moveBlock = (idx, dir) => {
    const newIdx = idx + dir
    if (newIdx < 0 || newIdx >= blocks.length) return
    const next = [...blocks]
    const [item] = next.splice(idx, 1)
    next.splice(newIdx, 0, item)
    setBlocks(next)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !blocks.length) return
    const payload = {
      title: title.trim(),
      excerpt: excerpt.trim(),
      tag,
      readTime,
      featured,
      color,
      bg,
      blocks,
      date: blog?.date || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    }
    onSave(blog?.slug, payload)
  }

  const pickColor = (c, b) => { setColor(c); setBg(b) }

  return (
    <form className="admin-editor" onSubmit={handleSubmit}>
      <div className="admin-editor__grid">
        <div>
          <label className="admin-label">Title</label>
          <input type="text" className="field-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label className="admin-label">Read time</label>
          <input type="text" className="field-input" value={readTime} onChange={(e) => setReadTime(e.target.value)} />
        </div>
      </div>
      <div>
        <label className="admin-label">Excerpt</label>
        <textarea className="admin-textarea" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} />
      </div>
      <div className="admin-editor__grid">
        <div>
          <label className="admin-label">Category</label>
          <select className="field-input admin-select" value={tag} onChange={(e) => setTag(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="admin-checkbox-row">
          <input id="featured" type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          <label htmlFor="featured">Featured post</label>
        </div>
      </div>
      <div>
        <label className="admin-label">Card color</label>
        <div className="admin-color-row">
          {COLORS.map((c) => (
            <button
              key={c.color}
              type="button"
              className={`admin-color-swatch ${color === c.color ? 'active' : ''}`}
              style={{ background: c.color }}
              onClick={() => pickColor(c.color, c.bg)}
              aria-label={`Pick color ${c.color}`}
            />
          ))}
        </div>
      </div>

      <div className="admin-blocks">
        <div className="admin-blocks__hd">
          <h2 className="admin-section-title">Content blocks</h2>
          <div className="admin-block-adders">
            {['heading', 'text', 'image', 'audio', 'video'].map((type) => (
              <button key={type} type="button" className="btn btn-ghost btn-sm" onClick={() => addBlock(type)}>
                + {type}
              </button>
            ))}
          </div>
        </div>
        {blocks.length === 0 && <p className="admin-empty">No blocks yet. Add one above.</p>}
        {blocks.map((block, i) => (
          <BlockEditor
            key={i}
            block={block}
            onChange={(b) => updateBlock(i, b)}
            onRemove={() => removeBlock(i)}
            onMove={(dir) => moveBlock(i, dir)}
          />
        ))}
      </div>

      <div className="admin-actions">
        <button type="submit" className="btn btn-primary">{blog ? 'Update blog' : 'Publish blog'}</button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(isAdmin())
  const [blogs, setBlogs] = useState([])
  const [editing, setEditing] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    setBlogs(getBlogs())
  }, [loggedIn])

  const handleLogin = () => {
    setLoggedIn(true)
    setBlogs(getBlogs())
  }

  const handleLogout = () => {
    logoutAdmin()
    setLoggedIn(false)
  }

  const handleSave = (slug, payload) => {
    if (slug) {
      updateBlog(slug, payload)
    } else {
      const newSlug = slugify(payload.title) + '-' + Date.now()
      addBlog({ ...payload, slug: newSlug })
    }
    setBlogs(getBlogs())
    setEditing(null)
  }

  const handleDelete = (slug) => {
    if (window.confirm('Delete this blog permanently?')) {
      deleteBlog(slug)
      setBlogs(getBlogs())
    }
  }

  const startNew = () => setEditing({})
  const startEdit = (blog) => setEditing(blog)
  const closeEditor = () => setEditing(null)

  if (!loggedIn) return <AdminLogin onLogin={handleLogin} />

  return (
    <main className="admin-page">
      <div className="wrap">
        <div className="admin-page__hd">
          <div>
            <div className="eyebrow">Admin</div>
            <h1 className="page-hd__title">Blog manager</h1>
          </div>
          <div className="admin-page__actions">
            <button className="btn btn-primary btn-sm" onClick={startNew}>+ New blog</button>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/blogs')}>View blogs</button>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        {editing ? (
          <BlogEditor blog={editing.slug ? editing : null} onSave={handleSave} onCancel={closeEditor} />
        ) : (
          <>
            {blogs.length === 0 ? (
              <p className="admin-empty-state">No blogs yet. Create one to get started.</p>
            ) : (
              <div className="admin-list">
                {blogs.map((blog) => (
                  <div className="admin-list__item" key={blog.slug}>
                    <div className="admin-list__meta">
                      <span className="ac-cat">{blog.tag}</span>
                      {blog.featured && <span className="ac-featured-tag">Featured</span>}
                      <span className="admin-list__date">{blog.date}</span>
                    </div>
                    <h3 className="admin-list__title">{blog.title}</h3>
                    <p className="admin-list__excerpt">{blog.excerpt}</p>
                    <div className="admin-list__actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => startEdit(blog)}>Edit</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/blogs/${blog.slug}`)}>View</button>
                      <button className="btn btn-ghost btn-sm" style={{ color: '#b91c1c' }} onClick={() => handleDelete(blog.slug)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
