// Netlify Function (v2): blog storage on Netlify Blobs.
//   GET    /api/blogs        -> published blogs + categories (public)
//   GET    /api/blogs?all=1  -> all blogs incl. drafts + categories (admin)
//   POST   /api/blogs        -> create/update a blog (admin key required)
//   PUT    /api/blogs        -> save the category list (admin key required)
//   DELETE /api/blogs?slug=x -> delete a blog (admin key required)
// Admin key comes from the ADMIN_PASSWORD environment variable (set in the
// Netlify dashboard), with a safe default so the site works before it is.

import { getStore } from '@netlify/blobs'
import { defaultBlogs, DEFAULT_CATEGORIES } from '../../src/data/defaultBlogs.js'

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  })

const getAdminKey = () => {
  try {
    return Netlify.env.get('ADMIN_PASSWORD') || 'saarathi2026'
  } catch {
    return 'saarathi2026'
  }
}

const authorized = (req) => {
  const key = req.headers.get('x-admin-key') || ''
  return key.length > 0 && key === getAdminKey()
}

const emptyIndex = () => ({ blogs: defaultBlogs, categories: [...DEFAULT_CATEGORIES] })

const readIndex = async (store) => {
  try {
    const raw = await store.get('index', { type: 'json', consistency: 'strong' })
    if (raw && Array.isArray(raw.blogs)) {
      if (!Array.isArray(raw.categories)) raw.categories = []
      return raw
    }
  } catch {
    /* first run: nothing stored yet */
  }
  return emptyIndex()
}

const writeIndex = (store, index) => store.setJSON('index', index)

// One-time migration: any launch article missing from the stored index gets
// merged in, so the complete article set appears in (and is managed by) the
// admin even when real posts were saved before the seed system existed.
const mergeSeeds = async (store, index) => {
  const existing = new Set(index.blogs.map((b) => b.slug))
  const missing = defaultBlogs.filter((b) => !existing.has(b.slug))
  if (!missing.length) return index
  const cats = new Set(index.categories || [])
  for (const b of missing) if (b.tag) cats.add(b.tag)
  const merged = { ...index, blogs: [...index.blogs, ...missing], categories: [...cats] }
  try {
    await writeIndex(store, merged)
  } catch {
    /* best-effort — still serve the merged list */
  }
  return merged
}

const validBlog = (b) =>
  b &&
  typeof b.slug === 'string' &&
  b.slug.length > 0 &&
  typeof b.title === 'string' &&
  b.title.length > 0 &&
  Array.isArray(b.blocks)

export default async (req) => {
  const url = new URL(req.url)
  const store = getStore({ name: 'saarathi-blogs', consistency: 'strong' })
  const method = req.method

  if (method === 'GET') {
    const wantsAll = url.searchParams.get('all') === '1'
    if (wantsAll && !authorized(req)) return json({ error: 'Unauthorized' }, 401)
    const index = await mergeSeeds(store, await readIndex(store))
    const blogs = wantsAll ? index.blogs : index.blogs.filter((b) => b.published !== false)
    const used = [...new Set(blogs.map((b) => b.tag).filter(Boolean))]
    const categories = index.categories.length ? index.categories : used.length ? used : DEFAULT_CATEGORIES
    return json({ blogs, categories })
  }

  if (method === 'POST') {
    if (!authorized(req)) return json({ error: 'Unauthorized' }, 401)
    let payload
    try {
      payload = await req.json()
    } catch {
      return json({ error: 'Invalid JSON body' }, 400)
    }
    const blog = payload && payload.blog ? payload.blog : payload
    if (!validBlog(blog)) return json({ error: 'Blog must have a slug, a title and blocks' }, 400)

    const index = await readIndex(store)
    const existing = index.blogs.findIndex((b) => b.slug === blog.slug)
    const entry = { ...blog, updatedAt: new Date().toISOString() }
    if (existing === -1) index.blogs.unshift(entry)
    else index.blogs[existing] = entry
    if (entry.tag && !index.categories.includes(entry.tag)) {
      index.categories = [...index.categories, entry.tag]
    }
    await writeIndex(store, index)
    return json({ ok: true, blog: entry })
  }

  if (method === 'PUT') {
    if (!authorized(req)) return json({ error: 'Unauthorized' }, 401)
    let payload
    try {
      payload = await req.json()
    } catch {
      return json({ error: 'Invalid JSON body' }, 400)
    }
    const cats = [...new Set(((payload && payload.categories) || []).map((c) => String(c).trim()).filter(Boolean))]
    const index = await readIndex(store)
    index.categories = cats
    await writeIndex(store, index)
    return json({ ok: true, categories: cats })
  }

  if (method === 'DELETE') {
    if (!authorized(req)) return json({ error: 'Unauthorized' }, 401)
    const slug = url.searchParams.get('slug')
    if (!slug) return json({ error: 'slug query parameter is required' }, 400)
    const index = await readIndex(store)
    const before = index.blogs.length
    index.blogs = index.blogs.filter((b) => b.slug !== slug)
    if (index.blogs.length === before) return json({ error: 'Blog not found' }, 404)
    await writeIndex(store, index)
    return json({ ok: true })
  }

  return json({ error: 'Method not allowed' }, 405)
}
