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
  loadCategories,
  saveCategories,
  escapeHtml,
} from '../utils/blogs'

const FALLBACK_CATEGORIES = ['Understanding Autism', 'Daily Parenting', 'Collaboration', 'Research', 'Wellbeing']

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
  tag: '',
  readTime: '4 min',
  date: today(),
  featured: false,
  color: THEMES[0].color,
  bg: THEMES[0].bg,
  published: true,
  blocks: [],
})

const withUids = (blocks) =>
  (blocks || []).map((b) => {
    const next = { ...b, uid: nextUid() }
    // Older posts stored plain text with newlines; give the rich editor the
    // same visual line breaks instead of letting HTML collapse them.
    if (next.type === 'text' && !next.html && typeof next.value === 'string') {
      next.value = next.value
        .split(/\n+/)
        .map((line) => `<p>${line.trim() || '<br>'}</p>`)
        .join('')
    }
    return next
  })

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

// ---------------- category manager ----------------

function CategoryManager({ categories, onClose, onSave }) {
  const [rows, setRows] = useState(() => categories.map((name) => ({ id: nextUid(), name, original: name })))
  const [saving, setSaving] = useState(false)

  const addRow = () => setRows((r) => [...r, { id: nextUid(), name: '', original: null }])
  const updateRow = (id, name) => setRows((r) => r.map((row) => (row.id === id ? { ...row, name } : row)))
  const removeRow = (id) => setRows((r) => r.filter((row) => row.id !== id))

  const handleSave = async () => {
    if (saving) return
    const names = rows.map((r) => r.name.trim()).filter(Boolean)
    const unique = [...new Set(names)]
    // Any row whose name changed is a rename: old → new, so existing posts
    // can be re-tagged to follow the category.
    const renameMap = {}
    for (const row of rows) {
      if (row.original && row.name.trim() && row.name.trim() !== row.original) {
        renameMap[row.original] = row.name.trim()
      }
    }
    setSaving(true)
    await onSave(unique, renameMap)
    setSaving(false)
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Manage categories">
        <h3 className="admin-modal__title">Manage categories</h3>
        <p className="admin-modal__body">
          Rename a category to update it everywhere — every post using it is updated too. Add new ones for future posts.
        </p>
        <div className="admin-modal__rows">
          {rows.map((row) => (
            <div key={row.id} className="admin-modal__row">
              <input
                className="field-input"
                placeholder="Category name"
                value={row.name}
                onChange={(e) => updateRow(row.id, e.target.value)}
              />
              <button type="button" className="admin-block__action admin-block__action--danger" title="Remove category" onClick={() => removeRow(row.id)}>✕</button>
            </div>
          ))}
        </div>
        <button type="button" className="btn btn-ghost btn-sm admin-modal__add" onClick={addRow}>+ Add category</button>
        <div className="admin-modal__actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button type="button" className="btn btn-primary" disabled={saving} onClick={handleSave}>{saving ? 'Saving…' : 'Save categories'}</button>
        </div>
      </div>
    </div>
  )
}

// ---------------- dashboard ----------------

function Dashboard({ blogs, categories, loading, mode, onNew, onEdit, onTogglePublish, onDelete, onManageCategories, onLogout }) {
  const navigate = useNavigate()
  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="admin-topbar__brand">
          <img src="/logo.svg" alt="" />
          <span>Saarathi Admin</span>
        </div>
        <div className="admin-topbar__actions">
          <button className="btn btn-ghost btn-sm" onClick={onManageCategories}>Categories</button>
          <button className="btn btn-ghost btn-sm" onClick={onNew}>+ New blog</button>
          <button className="btn btn-ghost btn-sm" onClick={onLogout}>Log out</button>
        </div>
      </header>

      {mode === 'local' && (
        <div className="admin-banner admin-banner--warn">
          Local preview mode — changes stay in this browser only. Open the site on Vercel or Netlify and sign in there to publish live.
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
                  {b.published !== false && <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/blogs/${b.slug}`)}>View</button>}
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

// ---------------- rich text editor ----------------

const RICH_ACTIONS = [
  { cmd: 'bold', label: 'B', title: 'Bold', className: 'rt-btn--bold' },
  { cmd: 'italic', label: 'I', title: 'Italic', className: 'rt-btn--italic' },
  { cmd: 'underline', label: 'U', title: 'Underline', className: 'rt-btn--underline' },
  { cmd: 'strikeThrough', label: 'S', title: 'Strikethrough', className: 'rt-btn--strike' },
  { cmd: 'formatBlock', arg: 'h3', label: 'H', title: 'Subheading', className: 'rt-btn--h3' },
  { cmd: 'insertUnorderedList', label: '• List', title: 'Bullet list' },
  { cmd: 'insertOrderedList', label: '1. List', title: 'Numbered list' },
  { cmd: 'formatBlock', arg: 'blockquote', label: '❝', title: 'Quote' },
  { cmd: 'removeFormat', label: '⌫', title: 'Clear formatting' },
]

function RichText({ value, onChange, placeholder }) {
  const ref = useRef(null)
  // Track whether we caused the next input event, so we can skip echoing
  // React's own re-render back into the contentEditable (which resets the caret).
  const composing = useRef(false)

  useEffect(() => {
    if (ref.current && !composing.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || ''
    }
  }, [value])

  // Enter should create clean <p> paragraphs instead of <div>s.
  useEffect(() => {
    try { document.execCommand('defaultParagraphSeparator', false, 'p') } catch { /* older browsers */ }
  }, [])

  const emit = () => {
    if (!ref.current) return
    composing.current = true
    onChange(ref.current.innerHTML)
    requestAnimationFrame(() => { composing.current = false })
  }

  const run = (cmd, arg) => {
    ref.current?.focus()
    document.execCommand(cmd, false, arg)
    emit()
  }

  const normalizeUrl = (url) => {
    const trimmed = String(url || '').trim()
    if (!trimmed) return ''
    if (/^(https?:|mailto:|tel:|\/|#)/i.test(trimmed)) return trimmed
    return `https://${trimmed.replace(/^\/+/, '')}`
  }

  const makeLink = () => {
    ref.current?.focus()
    const sel = window.getSelection()
    if (!sel) return
    const url = window.prompt('Link URL (e.g. www.example.com or https://example.com)')
    const safe = normalizeUrl(url)
    if (!safe) return
    if (sel.isCollapsed) {
      // No selection: insert the URL itself as clickable text.
      document.execCommand('insertHTML', false, `<a href="${safe}" target="_blank" rel="noopener noreferrer">${escapeHtml(safe)}</a>`)
    } else {
      document.execCommand('createLink', false, safe)
    }
    // Sanitize fresh links immediately.
    ref.current?.querySelectorAll('a').forEach((a) => {
      a.setAttribute('target', '_blank')
      a.setAttribute('rel', 'noopener noreferrer')
      if (/^\s*javascript:/i.test(a.getAttribute('href') || '')) a.removeAttribute('href')
    })
    emit()
  }

  return (
    <div className="rt">
      <div className="rt-toolbar" role="toolbar" aria-label="Text formatting" onMouseDown={(e) => e.preventDefault()}>
        {RICH_ACTIONS.map((a) => (
          <button
            key={a.title}
            type="button"
            className={`rt-btn ${a.className || ''}`}
            title={a.title}
            aria-label={a.title}
            onClick={() => run(a.cmd, a.arg)}
          >
            {a.label}
          </button>
        ))}
        <button type="button" className="rt-btn" title="Link" aria-label="Insert link" onClick={makeLink}>🔗</button>
      </div>
      <div
        ref={ref}
        className="rt-area"
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label={placeholder || 'Rich text'}
        data-placeholder={placeholder}
        onInput={emit}
        onBlur={emit}
      />
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

  const setField = (patch) => onChange({ ...block, ...patch })

  const isMedia = block.type === 'image' || block.type === 'video' || block.type === 'audio'

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
            onChange={(e) => setField({ value: e.target.value })}
          />
        )}
        {block.type === 'text' && (
          <RichText
            value={block.value || ''}
            onChange={(html) => setField({ value: html, html: true })}
            placeholder="Write the paragraph… use the toolbar for bold, italic, lists and quotes."
          />
        )}
        {isMedia && (
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
            <div className="admin-media-meta">
              <label className="admin-field">
                <span>Title {block.type === 'audio' || block.type === 'video' ? '' : '(optional)'}</span>
                <input
                  className="field-input"
                  placeholder={block.type === 'image' ? 'Caption for this image' : `Title for this ${block.type}`}
                  value={block.title || ''}
                  onChange={(e) => setField({ title: e.target.value })}
                />
              </label>
              <label className="admin-field">
                <span>Subtitle (optional)</span>
                <input
                  className="field-input"
                  placeholder="Short description shown under the title"
                  value={block.subtitle || ''}
                  onChange={(e) => setField({ subtitle: e.target.value })}
                />
              </label>
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

function Editor({ initial, categories, onBack, onSaved }) {
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
      setBlockByUid(block.uid, {
        uid: block.uid,
        type: block.type,
        value: url,
        title: block.title || '',
        subtitle: block.subtitle || '',
        ...(posterUrl ? { poster: posterUrl } : {}),
      })
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
      tag: blog.tag || categories[0] || 'General',
      readTime: blog.readTime || '4 min',
      date: blog.date || today(),
      featured: Boolean(blog.featured),
      color: blog.color,
      bg: blog.bg,
      published: blog.published !== false,
      blocks: blog.blocks
        .map(({ uid: _uid, __file, ...rest }) => rest)
        .filter((b) => (b.type === 'heading' ? String(b.value || '').trim() !== '' : Boolean(b.value))),
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

  const categoryOptions = blog.tag && !categories.includes(blog.tag) ? [...categories, blog.tag] : categories

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
            <select className="field-input" value={blog.tag || ''} onChange={(e) => set({ tag: e.target.value })}>
              {!blog.tag && <option value="">Choose…</option>}
              {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
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
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // null = dashboard, object = editor
  const [showCategoryManager, setShowCategoryManager] = useState(false)

  const refresh = async () => {
    setLoading(true)
    const [allBlogs, cats] = await Promise.all([adminLoadBlogs(), loadCategories()])
    setBlogs(allBlogs)
    // Posts may use categories that are not in the saved list (e.g. legacy
    // posts) — show them in the dropdowns so nothing gets mis-tagged.
    const used = allBlogs.map((b) => b.tag).filter(Boolean)
    setCategories([...new Set([...cats, ...used])])
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

  const handleSaveCategories = async (next, renameMap) => {
    const saved = await saveCategories(next, renameMap)
    setShowCategoryManager(false)
    // Reload so renamed categories show up on the posts immediately.
    await refresh()
    setCategories((current) => {
      const used = blogs.map((b) => b.tag).filter(Boolean)
      return [...new Set([...saved, ...current, ...used])]
    })
  }

  const handleLogout = () => {
    logoutAdmin()
    setSession(null)
    navigate('/')
  }

  if (editing) {
    return <Editor initial={editing} categories={categories} onBack={() => { setEditing(null); refresh() }} onSaved={() => { setEditing(null); refresh() }} />
  }

  return (
    <>
      <Dashboard
        blogs={blogs}
        categories={categories}
        loading={loading}
        mode={session.mode}
        onNew={() => setEditing(newBlog())}
        onEdit={(b) => setEditing(b)}
        onTogglePublish={handleTogglePublish}
        onDelete={handleDelete}
        onManageCategories={() => setShowCategoryManager(true)}
        onLogout={handleLogout}
      />
      {showCategoryManager && (
        <CategoryManager
          categories={categories}
          onClose={() => setShowCategoryManager(false)}
          onSave={handleSaveCategories}
        />
      )}
    </>
  )
}
