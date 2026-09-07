// Netlify Function (v2): media storage on Netlify Blobs.
//   POST /api/media                 (admin key required) JSON body:
//     { op: 'single',  name, type, data }                       -> small file (base64)
//     { op: 'chunk',   key, index, data }                       -> one chunk of a large file
//     { op: 'finalize', key, name, type, size, chunks, chunkSize } -> finish chunked upload
//   GET  /api/media?key=...  -> serves the file (supports HTTP Range for video seeking)
//
// Large files (videos) are uploaded in ~3 MB chunks so we stay well inside the
// function payload limit, then streamed back with Range support.

import { getStore } from '@netlify/blobs'

const CHUNK_SIZE = 3 * 1024 * 1024 // bytes of raw file data per chunk
const MAX_SINGLE = 3.4 * 1024 * 1024 // max raw size for a one-shot upload

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

const b64ToBytes = (b64) => {
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

const safeName = (name) =>
  String(name || 'file')
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(-64) || 'file'

const newKey = (name) => {
  const rand = Math.random().toString(36).slice(2, 8)
  return `${Date.now()}-${rand}-${safeName(name)}`
}

const readMeta = async (store, key) => {
  try {
    return await store.get(`m:${key}`, { type: 'json', consistency: 'strong' })
  } catch {
    return null
  }
}

export default async (req) => {
  const url = new URL(req.url)
  const store = getStore({ name: 'saarathi-media', consistency: 'strong' })
  const method = req.method

  if (method === 'GET') {
    const key = url.searchParams.get('key')
    if (!key || !/^[A-Za-z0-9._-]+$/.test(key)) return json({ error: 'Invalid key' }, 400)
    const meta = await readMeta(store, key)
    if (!meta) return json({ error: 'Not found' }, 404)

    const baseHeaders = {
      'content-type': meta.type || 'application/octet-stream',
      'cache-control': 'public, max-age=31536000, immutable',
      'accept-ranges': 'bytes',
    }

    if (meta.mode === 'single') {
      const body = await store.get(`f:${key}`, { type: 'arrayBuffer' })
      if (!body) return json({ error: 'Not found' }, 404)
      const range = req.headers.get('range')
      if (range) {
        const m = /bytes=(\d*)-(\d*)/.exec(range)
        if (m && (m[1] !== '' || m[2] !== '')) {
          let start = m[1] === '' ? null : parseInt(m[1], 10)
          let end = m[2] === '' ? meta.size - 1 : parseInt(m[2], 10)
          if (start === null) start = Math.max(0, meta.size - end)
          end = Math.min(end, meta.size - 1)
          if (start > end || start >= meta.size) {
            return new Response(null, { status: 416, headers: { 'content-range': `bytes */${meta.size}` } })
          }
          const slice = new Uint8Array(body).slice(start, end + 1)
          return new Response(slice, {
            status: 206,
            headers: { ...baseHeaders, 'content-range': `bytes ${start}-${end}/${meta.size}`, 'content-length': String(end - start + 1) },
          })
        }
      }
      return new Response(body, { headers: { ...baseHeaders, 'content-length': String(meta.size) } })
    }

    // chunked file: stream the requested byte range chunk by chunk
    const size = meta.size
    const cs = meta.chunkSize || CHUNK_SIZE
    const total = meta.chunks

    let start = 0
    let end = size - 1
    let partial = false
    const range = req.headers.get('range')
    if (range) {
      const m = /bytes=(\d*)-(\d*)/.exec(range)
      if (m && (m[1] !== '' || m[2] !== '')) {
        partial = true
        start = m[1] === '' ? Math.max(0, size - parseInt(m[2], 10)) : parseInt(m[1], 10)
        end = m[2] === '' ? size - 1 : Math.min(parseInt(m[2], 10), size - 1)
      }
    }
    if (start > end || start >= size) {
      return new Response(null, { status: 416, headers: { 'content-range': `bytes */${size}` } })
    }
    end = Math.min(end, size - 1)

    const firstChunk = Math.floor(start / cs)
    const lastChunk = Math.floor(end / cs)
    const headers = { ...baseHeaders, 'content-length': String(end - start + 1) }
    if (partial) headers['content-range'] = `bytes ${start}-${end}/${size}`

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for (let c = firstChunk; c <= lastChunk; c++) {
            const buf = await store.get(`c:${key}:${c}`, { type: 'arrayBuffer' })
            if (!buf) throw new Error(`missing chunk ${c}`)
            const bytes = new Uint8Array(buf)
            const from = Math.max(0, start - c * cs)
            const to = Math.min(bytes.length, end - c * cs + 1)
            if (to > from) controller.enqueue(bytes.slice(from, to))
          }
        } finally {
          controller.close()
        }
      },
    })
    return new Response(stream, { status: partial ? 206 : 200, headers })
  }

  if (method === 'POST') {
    if (!authorized(req)) return json({ error: 'Unauthorized' }, 401)
    let body
    try {
      body = await req.json()
    } catch {
      return json({ error: 'Invalid JSON body' }, 400)
    }

    const op = body.op || 'single'

    if (op === 'single') {
      if (!body.data || body.data.length > Math.ceil((MAX_SINGLE * 4) / 3) + 200) {
        return json({ error: 'File too large for single upload — use chunked upload' }, 413)
      }
      const key = newKey(body.name)
      const bytes = b64ToBytes(body.data)
      await store.set(`f:${key}`, bytes)
      await store.setJSON(`m:${key}`, {
        mode: 'single',
        type: body.type || 'application/octet-stream',
        size: bytes.byteLength,
        name: safeName(body.name),
        uploadedAt: new Date().toISOString(),
      })
      return json({ ok: true, key, url: `/api/media?key=${encodeURIComponent(key)}` })
    }

    if (op === 'chunk') {
      const key = String(body.key || '')
      const index = Number(body.index)
      if (!/^[A-Za-z0-9._-]+$/.test(key)) return json({ error: 'Invalid key' }, 400)
      if (!Number.isInteger(index) || index < 0 || index > 9999) return json({ error: 'Invalid chunk index' }, 400)
      if (!body.data || body.data.length > Math.ceil((CHUNK_SIZE * 4) / 3) + 200) {
        return json({ error: 'Chunk too large' }, 413)
      }
      await store.set(`c:${key}:${index}`, b64ToBytes(body.data))
      return json({ ok: true, index })
    }

    if (op === 'finalize') {
      const key = String(body.key || '')
      const chunks = Number(body.chunks)
      if (!/^[A-Za-z0-9._-]+$/.test(key)) return json({ error: 'Invalid key' }, 400)
      if (!Number.isInteger(chunks) || chunks < 1 || chunks > 9999) return json({ error: 'Invalid chunk count' }, 400)
      if (!Number.isInteger(body.size) || body.size < 1) return json({ error: 'Invalid size' }, 400)
      await store.setJSON(`m:${key}`, {
        mode: 'chunked',
        type: body.type || 'application/octet-stream',
        size: body.size,
        chunks,
        chunkSize: body.chunkSize || CHUNK_SIZE,
        name: safeName(body.name),
        uploadedAt: new Date().toISOString(),
      })
      return json({ ok: true, key, url: `/api/media?key=${encodeURIComponent(key)}` })
    }

    return json({ error: 'Unknown op' }, 400)
  }

  if (method === 'DELETE') {
    if (!authorized(req)) return json({ error: 'Unauthorized' }, 401)
    const key = url.searchParams.get('key')
    if (!key || !/^[A-Za-z0-9._-]+$/.test(key)) return json({ error: 'Invalid key' }, 400)
    const meta = await readMeta(store, key)
    if (meta && meta.mode === 'chunked') {
      const list = await store.list({ prefix: `c:${key}:` })
      for (const blob of list.blobs || []) await store.delete(blob.key)
    }
    if (meta) await store.delete(`f:${key}`)
    await store.delete(`m:${key}`)
    return json({ ok: true })
  }

  return json({ error: 'Method not allowed' }, 405)
}
