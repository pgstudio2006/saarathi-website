const BLOGS_KEY = 'saarathi_blogs'
const ADMIN_KEY = 'saarathi_admin_session'

const defaultBlogs = [
  {
    slug: 'admin-welcome',
    title: 'Welcome to the Saarathi Admin Blog',
    excerpt: 'This is a sample blog post created from the admin panel.',
    tag: 'Admin',
    readTime: '3 min',
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    featured: false,
    color: '#3A3ABF',
    bg: '#EEEEFF',
    blocks: [
      { type: 'heading', value: 'Getting started' },
      { type: 'text', value: 'Use the admin panel to create blogs with text, images, audio, and video blocks. Each block can be reordered before publishing.' },
    ],
  },
]

export function getBlogs() {
  try {
    const raw = localStorage.getItem(BLOGS_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) && parsed.length ? parsed : defaultBlogs
  } catch {
    return defaultBlogs
  }
}

export function saveBlogs(blogs) {
  localStorage.setItem(BLOGS_KEY, JSON.stringify(blogs))
}

export function getBlog(slug) {
  return getBlogs().find((b) => b.slug === slug)
}

export function addBlog(blog) {
  const blogs = getBlogs()
  blogs.unshift(blog)
  saveBlogs(blogs)
  return blog
}

export function updateBlog(slug, updates) {
  const blogs = getBlogs()
  const idx = blogs.findIndex((b) => b.slug === slug)
  if (idx === -1) return null
  blogs[idx] = { ...blogs[idx], ...updates, slug }
  saveBlogs(blogs)
  return blogs[idx]
}

export function deleteBlog(slug) {
  const blogs = getBlogs().filter((b) => b.slug !== slug)
  saveBlogs(blogs)
}

export function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 80)
}

export function loginAdmin(password) {
  const expected = import.meta.env?.VITE_ADMIN_PASSWORD || 'admin123'
  if (password === expected) {
    localStorage.setItem(ADMIN_KEY, '1')
    return true
  }
  return false
}

export function logoutAdmin() {
  localStorage.removeItem(ADMIN_KEY)
}

export function isAdmin() {
  return localStorage.getItem(ADMIN_KEY) === '1'
}
