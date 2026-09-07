// Vercel serverless function: media uploads via Vercel Blob client uploads.
//   GET  /api/media  -> { ok, platform: 'vercel' } (strategy probe, public)
//   POST /api/media  -> issues a short-lived direct-upload token so the browser
//                       uploads straight to Blob storage (handles large videos,
//                       bypasses the function body limit). Admin key required
//                       via clientPayload.
//
// The browser uses @vercel/blob/client `upload()` pointed at this URL.

import { handleUpload } from '@vercel/blob/client'

const getAdminKey = () => process.env.ADMIN_PASSWORD || 'saarathi2026'

const MAX_SIZE = 400 * 1024 * 1024

const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif', 'image/svg+xml',
  'video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v',
  'audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/ogg', 'audio/webm',
]

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      return res.status(200).json({ ok: true, platform: 'vercel' })
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const json = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const key = req.headers['x-admin-key'] || clientPayload
        if (typeof key !== 'string' || key.length === 0 || key !== getAdminKey()) {
          throw new Error('Unauthorized')
        }
        return {
          allowedContentTypes: ALLOWED_TYPES,
          maximumSizeInBytes: MAX_SIZE,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ t: Date.now() }),
        }
      },
      onUploadCompleted: async () => {
        /* nothing to do — the returned URL is used immediately by the admin */
      },
    })

    return res.status(200).json(json)
  } catch (err) {
    const message = String(err?.message || 'Upload failed')
    const status = message.toLowerCase().includes('unauthorized') ? 401 : 500
    return res.status(status).json({ error: message })
  }
}
