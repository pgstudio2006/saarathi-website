// Blog data layer.
//
// Production (Netlify): blogs live in Netlify Blobs via /api functions, so
// anything published from the admin is visible to every visitor.
// Local dev (`vite dev` alone): falls back to localStorage so the workflow
// still works offline. In that mode uploads become data URLs, exactly like
// the old behaviour — they stay on that machine only.

const BLOGS_KEY = 'saarathi_blogs'
const KEY_STORAGE = 'saarathi_admin_key'
const MODE_STORAGE = 'saarathi_admin_mode'
const LOCAL_PASSWORD = import.meta.env?.VITE_ADMIN_PASSWORD || 'admin123'
const CHUNK_SIZE = 3 * 1024 * 1024 // raw bytes per chunk (matches media.mjs)
const SINGLE_LIMIT = 3.2 * 1024 * 1024 // switch to chunked upload above this

const defaultBlogs = [
  {
    slug: 'admin-welcome',
    title: 'Welcome to the Saarathi Blog',
    excerpt: 'A sample post showing how blogs appear on the site.',
    tag: 'Admin',
    readTime: '3 min',
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    featured: false,
    color: '#3A3ABF',
    bg: '#EEEEFF',
    published: true,
    blocks: [
      { type: 'heading', value: 'Getting started' },
      { type: 'text', value: 'Use the admin panel to write posts with text, images, audio and video blocks. Each block can be reordered before you publish.' },
    ],
  },
]

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
}

// Validates the password against the live API; falls back to the local
// development password when the API is unreachable (plain `vite dev`).
export async function loginAdmin(password) {
  try {
    const res = await fetch('/api/blogs?all=1', { headers: { 'x-admin-key': password } })
    if (res.ok) {
      sessionStorage.setItem(KEY_STORAGE, password)
      sessionStorage.setItem(MODE_STORAGE, 'api')
      return { ok: true, mode: 'api' }
    }
    if (res.status === 401) return { ok: false, error: 'Wrong password. Try again.' }
    return { ok: false, error: 'Server error — please try again.' }
  } catch {
    if (password === LOCAL_PASSWORD) {
      sessionStorage.setItem(KEY_STORAGE, password)
      sessionStorage.setItem(MODE_STORAGE, 'local')
      return { ok: true, mode: 'local' }
    }
    return { ok: false, error: 'Could not reach the server.' }
  }
}

const authHeaders = () => {
  const s = adminSession()
  return s ? { 'x-admin-key': s.key } : {}
}

// ---------- reading ----------

function localBlogs() {
  try {
    const raw = localStorage.getItem(BLOGS_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) && parsed.length ? parsed : defaultBlogs
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

  if (out.size <= SINGLE_LIMIT) {
    const url = await apiUploadSingle(out)
    if (onProgress) onProgress(100)
    return url
  }
  return apiUploadChunked(out, onProgress)
}
