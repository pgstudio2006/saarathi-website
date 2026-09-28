// Blog data layer.
//
// Production (Vercel/Netlify): blogs + categories live in blob storage via
// /api functions, so anything published from the admin is visible to every
// visitor. Local dev (`vite dev` alone): falls back to localStorage so the
// workflow still works offline. In that mode uploads become data URLs —
// they stay on that machine only.

import { defaultBlogs, DEFAULT_CATEGORIES } from '../data/defaultBlogs'

const BLOGS_KEY = 'saarathi_blogs'
const CATEGORIES_KEY = 'saarathi_categories'
const SEEDED_KEY = 'saarathi_seeded'
const KEY_STORAGE = 'saarathi_admin_key'
const MODE_STORAGE = 'saarathi_admin_mode'
const STRATEGY_STORAGE = 'saarathi_upload_strategy'
const LOCAL_PASSWORD = import.meta.env?.VITE_ADMIN_PASSWORD || 'admin123'
const CHUNK_SIZE = 3 * 1024 * 1024 // raw bytes per chunk (matches media.mjs)
const SINGLE_LIMIT = 3.2 * 1024 * 1024 // switch to chunked upload above this

// ---------- session ----------

export function adminSession() {
  try {
    const key = sessionStorage.getItem(KEY_STORAGE)
    const mode = sessionStorage.getItem(MODE_STORAGE) || 'api'
    return key ? { key, mode } : null
  } catch {
    return null
  }
}

export function logoutAdmin() {
  sessionStorage.removeItem(KEY_STORAGE)
  sessionStorage.removeItem(MODE_STORAGE)
  sessionStorage.removeItem(STRATEGY_STORAGE)
}

// Asks the media endpoint which platform is serving /api so uploads use the
// right mechanism (Vercel Blob direct uploads vs Netlify chunked uploads).
async function detectStrategy() {
  try {
    const res = await fetch('/api/media')
    if (!res.ok) return null
    const data = await res.json()
    return data.platform || null
  } catch {
    return null
  }
}

// Validates the password against the live API; falls back to the local
// development password when no real backend exists behind /api (plain
// `vite dev` has no serverless functions, so /api/* returns 404/500 with a
// non-JSON body). A JSON response with { blogs } means a real API is live.
export async function loginAdmin(password) {
  try {
    const res = await fetch('/api/blogs?all=1', { headers: { 'x-admin-key': password } })
    const isJson = (res.headers.get('content-type') || '').toLowerCase().includes('application/json')
    if (isJson) {
      const data = await res.json().catch(() => null)
      if (data && Array.isArray(data.blogs)) {
        sessionStorage.setItem(KEY_STORAGE, password)
        sessionStorage.setItem(MODE_STORAGE, 'api')
        const strategy = await detectStrategy()
        if (strategy) sessionStorage.setItem(STRATEGY_STORAGE, strategy)
        else sessionStorage.removeItem(STRATEGY_STORAGE)
        return { ok: true, mode: 'api' }
      }
      if (data && data.error) return { ok: false, error: data.error === 'Unauthorized' ? 'Wrong password. Try again.' : data.error }
      return { ok: false, error: 'Server error — please try again.' }
    }
    // Non-JSON body: no backend behind /api here (bare `vite dev`).
  } catch {
    /* network error — continue to the local password check below */
  }
  if (password === LOCAL_PASSWORD) {
    sessionStorage.setItem(KEY_STORAGE, password)
    sessionStorage.setItem(MODE_STORAGE, 'local')
    return { ok: true, mode: 'local' }
  }
  return { ok: false, error: 'Could not reach the server.' }
}

const authHeaders = () => {
  const s = adminSession()
  return s ? { 'x-admin-key': s.key } : {}
}

// ---------- html safety ----------

// Escapes text so it can be embedded in generated HTML.
export function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const ALLOWED_TAGS = new Set([
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'span', 'a',
  'ul', 'ol', 'li', 'blockquote', 'h3', 'h4',
])

const ALLOWED_ATTRS = {
  a: ['href', 'target', 'rel'],
  span: ['class'],
}

// Whitelist-based HTML sanitizer for rich-text blocks. Everything the admin
// toolbar produces passes through; scripts, styles and unknown tags do not.
export function sanitizeHtml(html) {
  const doc = new DOMParser().parseFromString(String(html ?? ''), 'text/html')

  const walk = (node) => {
    for (const child of [...node.children]) {
      const tag = child.tagName.toLowerCase()
      if (!ALLOWED_TAGS.has(tag)) {
        // Unwrap containers (div etc.), drop dangerous ones entirely.
        if (tag === 'script' || tag === 'style' || tag === 'iframe' || tag === 'object' || tag === 'embed' || tag === 'link' || tag === 'meta') {
          child.remove()
        } else {
          child.replaceWith(...child.childNodes)
        }
        continue
      }
      for (const attr of [...child.attributes]) {
        const name = attr.name.toLowerCase()
        const allowed = (ALLOWED_ATTRS[tag] || []).includes(name)
        const unsafe = name.startsWith('on') || (name === 'href' && /^\s*javascript:/i.test(attr.value))
        if (!allowed || unsafe) child.removeAttribute(attr.name)
      }
      if (tag === 'a') {
        child.setAttribute('rel', 'noopener noreferrer')
        if (!child.getAttribute('target')) child.setAttribute('target', '_blank')
      }
      if (tag === 'span' && child.getAttribute('class') !== 'highlight') child.removeAttribute('class')
      walk(child)
    }
  }
  walk(doc.body)
  return doc.body.innerHTML
}

// ---------- categories ----------

// Categories last returned by the API (set by adminLoadBlogs) so the admin
// editor and the category manager use the server's saved list.
let lastServerCategories = null

export async function loadCategories() {
  if (Array.isArray(lastServerCategories) && lastServerCategories.length) {
    return [...lastServerCategories]
  }
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    if (Array.isArray(parsed) && parsed.length) return parsed
  } catch { /* ignore */ }
  return [...DEFAULT_CATEGORIES]
}

// Saves the category list and applies renames to every post that used the
// old name, so "Understanding Autism" → "Autism 101" updates existing posts.
export async function saveCategories(cats, renameMap = {}) {
  const clean = [...new Set((cats || []).map((c) => String(c).trim()).filter(Boolean))]
  try { localStorage.setItem(CATEGORIES_KEY, JSON.stringify(clean)) } catch { /* ignore */ }

  const renames = Object.entries(renameMap).filter(([from, to]) => from && to && from !== to)
  const session = adminSession()
  const isApi = session && session.mode !== 'local'

  if (isApi) {
    try {
      await fetch('/api/blogs', {
        method: 'PUT',
        headers: { 'content-type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ categories: clean }),
      })
    } catch { /* offline — local copy still saved */ }
  }

  if (renames.length) {
    const retag = (b) => {
      const match = renames.find(([from]) => from === b.tag)
      return match ? { ...b, tag: match[1] } : b
    }
    if (!isApi) {
      saveLocalBlogs(localBlogs().map(retag))
    } else {
      try {
        const res = await fetch('/api/blogs?all=1', { headers: authHeaders() })
        if (res.ok) {
          const data = await res.json()
          for (const b of data.blogs || []) {
            const next = retag(b)
            if (next !== b) {
              await fetch('/api/blogs', {
                method: 'POST',
                headers: { 'content-type': 'application/json', ...authHeaders() },
                body: JSON.stringify({ blog: next }),
              })
            }
          }
        }
      } catch { /* leave tags unchanged on failure */ }
    }
  }

  if (isApi) lastServerCategories = clean
  return clean
}

// ---------- reading ----------

function localBlogs() {
  try {
    const raw = localStorage.getItem(BLOGS_KEY)
    if (raw !== null) {
      // Storage exists — respect it, even when the admin deleted every post.
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : defaultBlogs
    }
    // First run: seed storage with the built-in articles so they are
    // editable/unpublishable in the admin just like any other post.
    try {
      localStorage.setItem(BLOGS_KEY, JSON.stringify(defaultBlogs))
      localStorage.setItem(SEEDED_KEY, '1')
    } catch { /* storage full — defaults stay read-only */ }
    return defaultBlogs
  } catch {
    return defaultBlogs
  }
}

function saveLocalBlogs(blogs) {
  try {
    localStorage.setItem(BLOGS_KEY, JSON.stringify(blogs))
  } catch {
    /* storage full — ignore in local mode */
  }
}

// Public site: published blogs only.
export async function loadBlogs() {
  const session = adminSession()
  if (!session || session.mode === 'local') {
    const blogs = localBlogs()
    return session && session.mode === 'local' ? blogs : blogs.filter((b) => b.published !== false)
  }
  try {
    const res = await fetch('/api/blogs')
    if (!res.ok) throw new Error('bad status')
    const data = await res.json()
    return Array.isArray(data.blogs) ? data.blogs : []
  } catch {
    return localBlogs().filter((b) => b.published !== false)
  }
}

// Admin dashboard: every blog, drafts included.
export async function adminLoadBlogs() {
  const session = adminSession()
  if (!session || session.mode === 'local') return localBlogs()
  try {
    const res = await fetch('/api/blogs?all=1', { headers: authHeaders() })
    if (!res.ok) throw new Error('bad status')
    const data = await res.json()
    if (Array.isArray(data.categories)) lastServerCategories = data.categories
    return Array.isArray(data.blogs) ? data.blogs : []
  } catch {
    return localBlogs()
  }
}

export async function getBlog(slug) {
  const blogs = await loadBlogs()
  return blogs.find((b) => b.slug === slug) || null
}

// ---------- writing ----------

export async function saveBlog(blog) {
  const session = adminSession()
  if (!session || session.mode === 'local') {
    const blogs = localBlogs()
    const i = blogs.findIndex((b) => b.slug === blog.slug)
    if (i === -1) blogs.unshift(blog)
    else blogs[i] = blog
    saveLocalBlogs(blogs)
    return blog
  }
  const res = await fetch('/api/blogs', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ blog }),
  })
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Save failed')
  return (await res.json()).blog
}

export async function deleteBlog(slug) {
  const session = adminSession()
  if (!session || session.mode === 'local') {
    saveLocalBlogs(localBlogs().filter((b) => b.slug !== slug))
    return
  }
  const res = await fetch(`/api/blogs?slug=${encodeURIComponent(slug)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Delete failed')
}

export function slugify(title) {
  return String(title)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 80)
}

// ---------- uploads ----------

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '')
    reader.onerror = () => reject(new Error('Could not read the file'))
    reader.readAsDataURL(file)
  })
}

// Downscales large photos to keep uploads fast and pages light.
async function compressImage(file, maxEdge = 1600, quality = 0.85) {
  if (file.type === 'image/gif' || file.size <= 1.5 * 1024 * 1024) return file
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    const blob = await new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/jpeg', quality))
    return blob && blob.size < file.size ? new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' }) : file
  } catch {
    return file
  }
}

// Grabs a frame from a video to use as its poster image.
export async function makeVideoPoster(file) {
  return new Promise((resolve) => {
    try {
      const url = URL.createObjectURL(file)
      const video = document.createElement('video')
      video.muted = true
      video.src = url
      const cleanup = () => URL.revokeObjectURL(url)
      video.onloadeddata = () => {
        video.currentTime = Math.min(1, (video.duration || 2) * 0.25)
      }
      video.onseeked = () => {
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth || 1280
        canvas.height = video.videoHeight || 720
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
        canvas.toBlob(
          (blob) => {
            cleanup()
            resolve(blob ? new File([blob], 'poster.jpg', { type: 'image/jpeg' }) : null)
          },
          'image/jpeg',
          0.8
        )
      }
      video.onerror = () => {
        cleanup()
        resolve(null)
      }
    } catch {
      resolve(null)
    }
  })
}

const apiUploadSingle = async (file) => {
  const data = await fileToBase64(file)
  const res = await fetch('/api/media', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ op: 'single', name: file.name, type: file.type, data }),
  })
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Upload failed')
  return (await res.json()).url
}

const apiUploadChunked = async (file, onProgress) => {
  const key = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').slice(-48)}`
  const total = Math.ceil(file.size / CHUNK_SIZE)
  let sent = 0
  for (let index = 0; index < total; index++) {
    const slice = file.slice(index * CHUNK_SIZE, Math.min(file.size, (index + 1) * CHUNK_SIZE))
    const data = await fileToBase64(slice)
    const res = await fetch('/api/media', {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ op: 'chunk', key, index, data }),
    })
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || `Chunk ${index + 1} failed`)
    sent += slice.size
    if (onProgress) onProgress(Math.round((sent / file.size) * 100))
  }
  const res = await fetch('/api/media', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ op: 'finalize', key, name: file.name, type: file.type, size: file.size, chunks: total, chunkSize: CHUNK_SIZE }),
  })
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Could not finish the upload')
  return (await res.json()).url
}

// Uploads any file. Returns a public URL (or a data URL in local dev mode).
export async function uploadFile(file, onProgress) {
  if (!file) throw new Error('No file chosen')
  if (file.size > 400 * 1024 * 1024) throw new Error('Please choose a file under 400 MB')

  const session = adminSession()
  if (!session || session.mode === 'local') {
    if (onProgress) onProgress(100)
    return fileToBase64(file).then((b) => `data:${file.type};base64,${b}`)
  }

  let out = file
  if (out.type.startsWith('image/')) out = await compressImage(out)

  // Vercel: browser uploads the file directly to Blob storage (the function
  // only issues a short-lived token), so large videos never touch the API.
  let strategy = null
  try { strategy = sessionStorage.getItem(STRATEGY_STORAGE) } catch { strategy = null }
  if (strategy === 'vercel') {
    const { upload } = await import('@vercel/blob/client')
    const blob = await upload(out.name, out, {
      access: 'public',
      handleUploadUrl: '/api/media',
      clientPayload: session.key,
      onProgress: (p) => { if (onProgress) onProgress(Math.round(p)) },
    })
    return blob.url
  }

  if (out.size <= SINGLE_LIMIT) {
    const url = await apiUploadSingle(out)
    if (onProgress) onProgress(100)
    return url
  }
  return apiUploadChunked(out, onProgress)
}
