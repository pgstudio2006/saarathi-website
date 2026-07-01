export async function submitWaitlist(email) {
  const endpoint = import.meta.env.VITE_WAITLIST_ENDPOINT

  if (!endpoint || endpoint.includes('YOUR_SCRIPT_ID')) {
    // No backend configured yet: simulate success locally
    await new Promise((resolve) => setTimeout(resolve, 600))
    return { ok: true, local: true }
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, timestamp: new Date().toISOString(), source: window.location.pathname }),
    })

    if (!response.ok) throw new Error('Network response was not ok')
    return { ok: true, local: false }
  } catch (err) {
    return { ok: false, error: err.message }
  }
}
