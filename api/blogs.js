// Vercel serverless function: blog storage on Vercel Blob.
//   GET    /api/blogs        -> published blogs + categories (public)
//   GET    /api/blogs?all=1  -> all blogs incl. drafts + categories (admin)
//   POST   /api/blogs        -> create/update a blog (admin key required)
//   PUT    /api/blogs        -> save the category list (admin key required)
//   DELETE /api/blogs?slug=x -> delete a blog (admin key required)
// Mirrors the contract of the Netlify version so the frontend is identical.

import { put, list } from '@vercel/blob'
import { defaultBlogs, DEFAULT_CATEGORIES } from '../src/data/defaultBlogs.js'

const INDEX_PATH = 'blogs.json'

const getAdminKey = () => process.env.ADMIN_PASSWORD || 'saarathi2026'

const authorized = (req) => {
  const key = req.headers['x-admin-key']
  return typeof key === 'string' && key.length > 0 && key === getAdminKey()
}

// Until the first admin save creates the index file, the built-in launch
// articles are served as the default content — and the first edit/unpublish/
// delete persists them, making them fully manageable from then on.
const emptyIndex = () => ({ blogs: defaultBlogs, categories: [...DEFAULT_CATEGORIES] })

async function readIndex() {
  try {
    const result = await list({ prefix: INDEX_PATH })
    const blob = (result.blobs || []).find((b) => b.pathname === INDEX_PATH)
    if (!blob) return emptyIndex()
    // cache-buster so the CDN always returns the latest write
    const res = await fetch(`${blob.url}${blob.url.includes('?') ? '&' : '?'}cb=${Date.now()}`)
    if (!res.ok) return emptyIndex()
    const data = await res.json()
    const index = data && Array.isArray(data.blogs) ? data : emptyIndex()
    if (!Array.isArray(index.categories)) index.categories = []
    return index
  } catch {
    return emptyIndex()
  }
}

async function writeIndex(index) {
  await put(INDEX_PATH, JSON.stringify(index), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true, // the index is rewritten on every save/update/delete
    cacheControlMaxAge: 0,
  })
}

const validBlog = (b) =>
  b &&
  typeof b.slug === 'string' &&
  b.slug.length > 0 &&
  typeof b.title === 'string' &&
  b.title.length > 0 &&
  Array.isArray(b.blocks)

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const wantsAll = req.query.all === '1'
      if (wantsAll && !authorized(req)) return res.status(401).json({ error: 'Unauthorized' })
      const index = await readIndex()
      const blogs = wantsAll ? index.blogs : index.blogs.filter((b) => b.published !== false)
      // Categories: saved list first; fall back to whatever posts use.
      const used = [...new Set(blogs.map((b) => b.tag).filter(Boolean))]
      const categories = index.categories.length ? index.categories : used.length ? used : [...DEFAULT_CATEGORIES]
      return res.status(200).json({ blogs, categories })
    }

    if (req.method === 'POST') {
      if (!authorized(req)) return res.status(401).json({ error: 'Unauthorized' })
      const payload = req.body || {}
      const blog = payload.blog || payload
      if (!validBlog(blog)) {
        return res.status(400).json({ error: 'Blog must have a slug, a title and blocks' })
      }
      const index = await readIndex()
      const existing = index.blogs.findIndex((b) => b.slug === blog.slug)
      const entry = { ...blog, updatedAt: new Date().toISOString() }
      if (existing === -1) index.blogs.unshift(entry)
      else index.blogs[existing] = entry
      // Keep the saved category list aware of any new category.
      if (entry.tag && !index.categories.includes(entry.tag)) {
        index.categories = [...index.categories, entry.tag]
      }
      await writeIndex(index)
      return res.status(200).json({ ok: true, blog: entry })
    }

    if (req.method === 'PUT') {
      if (!authorized(req)) return res.status(401).json({ error: 'Unauthorized' })
      const payload = req.body || {}
      const cats = [...new Set((payload.categories || []).map((c) => String(c).trim()).filter(Boolean))]
      const index = await readIndex()
      index.categories = cats
      await writeIndex(index)
      return res.status(200).json({ ok: true, categories: cats })
    }

    if (req.method === 'DELETE') {
      if (!authorized(req)) return res.status(401).json({ error: 'Unauthorized' })
      const slug = req.query.slug
      if (!slug) return res.status(400).json({ error: 'slug query parameter is required' })
      const index = await readIndex()
      const before = index.blogs.length
      index.blogs = index.blogs.filter((b) => b.slug !== slug)
      if (index.blogs.length === before) return res.status(404).json({ error: 'Blog not found' })
      await writeIndex(index)
      return res.status(200).json({ ok: true })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    return res.status(500).json({ error: err?.message || 'Server error' })
  }
}
