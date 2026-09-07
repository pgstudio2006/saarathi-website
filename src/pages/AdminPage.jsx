import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  adminSession,
  adminLoadBlogs,
  saveBlog,
  deleteBlog,
  loginAdmin,
  logoutAdmin,
  slugify,
  uploadFile,
  makeVideoPoster,
} from '../utils/blogs'

const CATEGORIES = ['Understanding', 'Daily life', 'Therapy', 'School', 'Self-care', 'Research', 'Admin']

const THEMES = [
  { color: '#3A3ABF', bg: '#EEEEFF' },
  { color: '#7EC8C8', bg: '#EAF7F7' },
  { color: '#9B87F5', bg: '#DDD8FD' },
  { color: '#F59E0B', bg: '#FEF3C7' },
  { color: '#EC4899', bg: '#FCE7F3' },
  { color: '#10B981', bg: '#D1FAE5' },
]

const BLOCK_LABELS = { heading: 'Heading', text: 'Paragraph', image: 'Image', video: 'Video', audio: 'Audio' }

const today = () => new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

let uidCounter = 1000
const nextUid = () => ++uidCounter

const newBlog = () => ({
  slug: '',
  title: '',
  excerpt: '',
  tag: 'Understanding',
  readTime: '4 min',
  date: today(),
  featured: false,
  color: THEMES[0].color,
  bg: THEMES[0].bg,
  published: true,
  blocks: [],
})

const withUids = (blocks) => (blocks || []).map((b) => ({ ...b, uid: nextUid() }))

const formatSize = (bytes) => (bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`)

// ---------------- login ----------------

function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!password || busy) return
    setBusy(true)
    setError('')
    const result = await loginAdmin(password)
    setBusy(false)
    if (result.ok) onLogin(result.mode)
    else setError(result.error || 'Wrong password. Try again.')
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__mark" aria-hidden="true">
          <img src="/logo.svg" alt="" />
        </div>
        <h1 className="admin-login__title">Saarathi Admin</h1>
        <p className="admin-login__body">Sign in to publish blogs to the website.</p>
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
            autoFocus
          />
          <button type="submit" className="btn btn-primary btn-block" disabled={busy}>{busy ? 'Checking…' : 'Sign in'}</button>
        </form>
        {error && <p className="form-error" role="alert">{error}</p>}
      </div>
    </div>
  )
}

// ---------------- dashboard ----------------

function Dashboard({ blogs, loading, mode, onNew, onEdit, onTogglePublish, onDelete, onLogout }) {
  const navigate = useNavigate()
  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="admin-topbar__brand">
          <img src="/logo.svg" alt="" />
          <span>Saarathi Admin</span>
        </div>
        <div className="admin-topbar__actions">
          <button className="btn btn-ghost btn-sm" onClick={onNew}>+ New blog</button>
          <button className="btn btn-ghost btn-sm" onClick={onLogout}>Log out</button>
        </div>
      </header>

      {mode === 'local' && (
        <div className="admin-banner admin-banner--warn">
          Local preview mode — changes stay in this browser only. Open the site on Netlify and sign in there to publish live.
        </div>
      )}

      <section className="admin-section">
        <div className="admin-section__hd">
          <h2 className="admin-section-title">Your blogs</h2>
          <span className="admin-section__count">{loading ? 'Loading…' : `${blogs.length} post${blogs.length === 1 ? '' : 's'}`}</span>
        </div>

        {loading ? (
          <p className="admin-empty-state">Loading your blogs…</p>
        ) : blogs.length === 0 ? (
          <div className="admin-empty-state">
            <p>No blogs yet.</p>
            <button className="btn btn-primary" onClick={onNew}>Write your first blog</button>
          </div>
        ) : (
          <div className="admin-list">
            {blogs.map((b) => (
              <article key={b.slug} className="admin-list__item">
                <div className="admin-list__meta">
                  <span className="admin-badge" data-state={b.published === false ? 'draft' : 'live'}>
                    {b.published === false ? 'Draft' : 'Published'}
                  </span>
                  <span className="ac-cat">{b.tag}</span>
                  <span className="admin-list__date">{b.date}</span>
                </div>
                <h3 className="admin-list__title">{b.title || 'Untitled'}</h3>
                <p className="admin-list__excerpt">{b.excerpt}</p>
                <div className="admin-list__actions">
                  <button className="btn btn-ghost btn-sm" onClick={() => onEdit(b)}>Edit</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => onTogglePublish(b)}>
                    {b.published === false ? 'Publish' : 'Unpublish'}
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/blogs/${b.slug}`)}>View</button>
                  <button className="btn btn-danger btn-sm" onClick={() => onDelete(b)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

// ---------------- block editor ----------------

function BlockCard({ block, index, total, uploadState, onChange, onMove, onRemove }) {
  const fileRef = useRef(null)

  const pickFile = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (file) onChange({ ...block, __file: file })
  }

  return (
    <div className="admin-block">
      <div className="admin-block__hd">
        <span className="admin-block__type">{BLOCK_LABELS[block.type] || block.type}</span>
        <div className="admin-block__actions">
          <button type="button" className="admin-block__action" title="Move up" disabled={index === 0} onClick={() => onMove(index, -1)}>↑</button>
          <button type="button" className="admin-block__action" title="Move down" disabled={index === total - 1} onClick={() => onMove(index, 1)}>↓</button>
          <button type="button" className="admin-block__action admin-block__action--danger" title="Remove block" onClick={() => onRemove(index)}>✕</button>
        </div>
      </div>
      <div className="admin-block__body">
        {block.type === 'heading' && (
          <input
            className="field-input"
            placeholder="Section heading"
            value={block.value || ''}
            onChange={(e) => onChange({ ...block, value: e.target.value })}
          />
        )}
        {block.type === 'text' && (
          <textarea
            className="field-input admin-textarea"
            rows={4}
            placeholder="Write the paragraph…"
            value={block.value || ''}
            onChange={(e) => onChange({ ...block, value: e.target.value })}
          />
        )}
        {(block.type === 'image' || block.type === 'video' || block.type === 'audio') && (
          <div className="admin-media-input">
            {block.value && block.type === 'image' && <img className="admin-preview-image" src={block.value} alt="" />}
            {block.value && block.type === 'video' && (
              <video className="admin-preview-video" src={block.value} poster={block.poster || undefined} controls preload="metadata" />
            )}
            {block.value && block.type === 'audio' && <audio className="admin-preview-audio" src={block.value} controls />}
            <div className="admin-file-row">
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => fileRef.current?.click()}>
                {block.value ? 'Replace file' : 'Choose file'}
              </button>
              {block.__file && <span className="admin-file-name">{block.__file.name} · {formatSize(block.__file.size)}</span>}
              <input
                ref={fileRef}
                type="file"
                hidden
                accept={block.type === 'image' ? 'image/*' : block.type === 'video' ? 'video/*' : 'audio/*'}
                onChange={pickFile}
              />
            </div>
            {uploadState && (
              <div className="admin-progress" role="status">
                <div className="admin-progress__bar"><div className="admin-progress__fill" style={{ width: `${uploadState.pct}%` }} /></div>
                <span className="admin-progress__label">{uploadState.pct < 100 ? `Uploading… ${uploadState.pct}%` : 'Finishing…'}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------- editor ----------------

function Editor({ initial, onBack, onSaved }) {
  const [blog, setBlog] = useState(() => ({ ...newBlog(), ...initial, blocks: withUids(initial.blocks) }))
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.slug))
  const [saving, setSaving] = useState(false)
  const [upload, setUpload] = useState(null) // { uid, pct }
  const [toast, setToast] = useState('')
  const savedSnapshot = useRef(JSON.stringify({ ...newBlog(), ...initial }))
  const toastTimer = useRef(null)

  const showToast = (msg) => {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 3200)
  }

  const friendlyError = (err) => {
    const msg = err?.message || 'Something went wrong.'
    if (/blob credentials|BLOB_READ_WRITE_TOKEN|BLOB_STORE_ID|no store/i.test(msg)) {
      return 'Storage is not connected yet. In the Vercel dashboard open Storage → Create Database → Blob, connect this project, wait for the redeploy, then try again.'
    }
    if (/unauthorized/i.test(msg)) return 'Your session expired — please sign in again.'
    return msg
  }

  const isDirty = JSON.stringify(blog) !== savedSnapshot.current
  const anyUploading = Boolean(upload)

  useEffect(() => {
    const warn = (e) => {
      if (isDirty || anyUploading) { e.preventDefault(); e.returnValue = '' }
    }
    window.addEventListener('beforeunload', warn)
    return () => { window.removeEventListener('beforeunload', warn); clearTimeout(toastTimer.current) }
  }, [isDirty, anyUploading])

  const set = (patch) => setBlog((b) => ({ ...b, ...patch }))

  const setTitle = (title) => setBlog((b) => ({ ...b, title, slug: slugTouched ? b.slug : slugify(title) }))

  const setBlockByUid = (blockUid, next) => {
    setBlog((b) => ({ ...b, blocks: b.blocks.map((bl) => (bl.uid === blockUid ? next : bl)) }))
  }
  const moveBlock = (index, dir) => {
    setBlog((b) => {
      const blocks = [...b.blocks]
      const to = index + dir
      if (to < 0 || to >= blocks.length) return b
      ;[blocks[index], blocks[to]] = [blocks[to], blocks[index]]
      return { ...b, blocks }
    })
  }
  const removeBlock = (index) => setBlog((b) => ({ ...b, blocks: b.blocks.filter((_, i) => i !== index) }))
  const addBlock = (type) => setBlog((b) => ({ ...b, blocks: [...b.blocks, { uid: nextUid(), type, value: '' }] }))

  const handleFileChosen = async (block, file) => {
    setUpload({ uid: block.uid, pct: 0 })
    try {
      let posterUrl = null
      if (file.type.startsWith('video/')) {
        const poster = await makeVideoPoster(file)
        if (poster) {
          posterUrl = await uploadFile(poster, (pct) => setUpload({ uid: block.uid, pct: Math.round(pct * 0.15) }))
        }
      }
      const url = await uploadFile(file, (pct) =>
        setUpload({ uid: block.uid, pct: posterUrl ? 15 + Math.round(pct * 0.85) : Math.max(1, pct) })
      )
      setBlockByUid(block.uid, { uid: block.uid, type: block.type, value: url, ...(posterUrl ? { poster: posterUrl } : {}) })
      showToast('File uploaded ✓')
    } catch (err) {
      showToast(friendlyError(err))
    } finally {
      setUpload(null)
    }
  }

  const handleSave = async () => {
    if (saving || anyUploading) return
    if (!blog.title.trim()) { showToast('Please add a title first.'); return }
    const payload = {
      slug: blog.slug || slugify(blog.title) || `post-${Date.now()}`,
      title: blog.title.trim(),
      excerpt: blog.excerpt || '',
      tag: blog.tag,
      readTime: blog.readTime || '4 min',
      date: blog.date || today(),
      featured: Boolean(blog.featured),
      color: blog.color,
      bg: blog.bg,
      published: blog.published !== false,
      blocks: blog.blocks
        .map(({ uid: _uid, __file, ...rest }) => rest)
        .filter((b) => (b.type === 'heading' || b.type === 'text' ? String(b.value || '').trim() !== '' : Boolean(b.value))),
    }
    setSaving(true)
    try {
      await saveBlog(payload)
      savedSnapshot.current = JSON.stringify(payload)
      showToast('Saved ✓ — live on the site')
      onSaved()
    } catch (err) {
      showToast(friendlyError(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <button className="admin-back" onClick={onBack}>← All blogs</button>
        <div className="admin-topbar__actions">
          <label className="admin-switch" title="Visible on the website?">
            <input type="checkbox" checked={blog.published} onChange={(e) => set({ published: e.target.checked })} />
            <span>{blog.published ? 'Published' : 'Draft'}</span>
          </label>
          <button className="btn btn-primary btn-sm" disabled={saving || anyUploading} onClick={handleSave}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </header>

      <section className="admin-editor">
        <input
          className="admin-title-input"
          placeholder="Blog title"
          value={blog.title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="admin-meta-grid">
          <label className="admin-field">
            <span>Link (slug)</span>
            <input
              className="field-input"
              value={blog.slug}
              placeholder="auto-from-title"
              onChange={(e) => { setSlugTouched(true); set({ slug: slugify(e.target.value) }) }}
            />
          </label>
          <label className="admin-field">
            <span>Category</span>
            <select className="field-input" value={blog.tag} onChange={(e) => set({ tag: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label className="admin-field">
            <span>Read time</span>
            <input className="field-input" value={blog.readTime} onChange={(e) => set({ readTime: e.target.value })} placeholder="4 min" />
          </label>
          <label className="admin-field admin-field--check">
            <span>Featured</span>
            <input type="checkbox" checked={Boolean(blog.featured)} onChange={(e) => set({ featured: e.target.checked })} />
          </label>
        </div>
        <div className="admin-field">
          <span>Excerpt</span>
          <textarea
            className="field-input admin-textarea"
            rows={2}
            placeholder="One or two lines shown on the blog cards"
            value={blog.excerpt}
            onChange={(e) => set({ excerpt: e.target.value })}
          />
        </div>
        <div className="admin-field">
          <span>Card theme</span>
          <div className="admin-themes">
            {THEMES.map((t) => (
              <button
                key={t.bg}
                type="button"
                className={`admin-theme-chip ${blog.bg === t.bg && blog.color === t.color ? 'active' : ''}`}
                style={{ background: t.bg, color: t.color }}
                onClick={() => set({ color: t.color, bg: t.bg })}
                aria-label={`Theme ${t.color}`}
              >
                Aa
              </button>
            ))}
          </div>
        </div>

        <div className="admin-section__hd" style={{ marginTop: '2rem' }}>
          <h2 className="admin-section-title">Content</h2>
          <div className="admin-block-adders">
            <button className="btn btn-ghost btn-sm" onClick={() => addBlock('heading')}>+ Heading</button>
            <button className="btn btn-ghost btn-sm" onClick={() => addBlock('text')}>+ Paragraph</button>
            <button className="btn btn-ghost btn-sm" onClick={() => addBlock('image')}>+ Image</button>
            <button className="btn btn-ghost btn-sm" onClick={() => addBlock('video')}>+ Video</button>
            <button className="btn btn-ghost btn-sm" onClick={() => addBlock('audio')}>+ Audio</button>
          </div>
        </div>

        {blog.blocks.length === 0 && <p className="admin-empty">No content yet — add your first block above.</p>}
        <div className="admin-blocks">
          {blog.blocks.map((block, i) => (
            <BlockCard
              key={block.uid}
              block={block}
              index={i}
              total={blog.blocks.length}
              uploadState={upload && upload.uid === block.uid ? upload : null}
              onChange={(next) => {
                if (next.__file) handleFileChosen(block, next.__file)
                else setBlockByUid(block.uid, { ...block, ...next })
              }}
              onMove={moveBlock}
              onRemove={removeBlock}
            />
          ))}
        </div>

        <div className="admin-actions">
          <button className="btn btn-ghost" onClick={onBack}>Cancel</button>
          <button className="btn btn-primary" disabled={saving || anyUploading} onClick={handleSave}>
            {saving ? 'Saving…' : 'Save blog'}
          </button>
        </div>
      </section>

      {toast && <div className="admin-toast" role="status" onClick={() => setToast('')}>{toast}</div>}
    </div>
  )
}

// ---------------- root ----------------

export default function AdminPage() {
  const navigate = useNavigate()
  const [session, setSession] = useState(adminSession())
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // null = dashboard, object = editor

  const refresh = async () => {
    setLoading(true)
    setBlogs(await adminLoadBlogs())
    setLoading(false)
  }

  useEffect(() => {
    if (session) refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  if (!session) return <LoginScreen onLogin={(mode) => setSession({ key: 'active', mode })} />

  const handleTogglePublish = async (b) => {
    try {
      await saveBlog({ ...b, published: b.published === false })
      await refresh()
    } catch (err) {
      window.alert(err.message || 'Could not update.')
    }
  }

  const handleDelete = async (b) => {
    if (!window.confirm(`Delete “${b.title || b.slug}” permanently?`)) return
    try {
      await deleteBlog(b.slug)
      await refresh()
    } catch (err) {
      window.alert(err.message || 'Could not delete.')
    }
  }

  const handleLogout = () => {
    logoutAdmin()
    setSession(null)
    navigate('/')
  }

  if (editing) {
    return <Editor initial={editing} onBack={() => { setEditing(null); refresh() }} onSaved={() => { setEditing(null); refresh() }} />
  }

  return (
    <Dashboard
      blogs={blogs}
      loading={loading}
      mode={session.mode}
      onNew={() => setEditing(newBlog())}
      onEdit={(b) => setEditing(b)}
      onTogglePublish={handleTogglePublish}
      onDelete={handleDelete}
      onLogout={handleLogout}
    />
  )
}
