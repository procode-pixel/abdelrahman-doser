export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' })

  const payload = req.body || {}
  const action = payload.action || 'unknown'
  const details = payload.details || {}

  // capture IP and UA
  const forwarded = req.headers['x-forwarded-for']
  const ip = forwarded ? forwarded.split(/, /)[0] : req.socket.remoteAddress
  const ua = req.headers['user-agent'] || ''

  const record = { action, details, ip, ua, time: new Date().toISOString() }

  try {
    const fbRes = await fetch(`https://doser-portfolio-default-rtdb.firebaseio.com/adminActivity.json?auth=${process.env.FIREBASE_SECRET}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(record)
    })
    if (!fbRes.ok) {
      const text = await fbRes.text()
      return res.status(500).json({ message: 'Firebase error', details: text })
    }

    // optionally update visit counters if action == 'page_view'
    if (action === 'page_view') {
      // read current counts
      const countsResp = await fetch(`https://doser-portfolio-default-rtdb.firebaseio.com/analytics.json?auth=${process.env.FIREBASE_SECRET}`)
      const counts = countsResp.ok ? await countsResp.json() : null
      const now = new Date()
      const todayKey = now.toISOString().slice(0,10)
      const total = (counts && counts.total) ? counts.total + 1 : 1
      const daily = (counts && counts.daily && counts.daily[todayKey]) ? counts.daily[todayKey] + 1 : 1
      const next = { ...counts, total, daily: { ...(counts?.daily || {}), [todayKey]: daily }, lastVisit: now.toISOString() }
      await fetch(`https://doser-portfolio-default-rtdb.firebaseio.com/analytics.json?auth=${process.env.FIREBASE_SECRET}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(next) })
    }

    return res.status(200).json({ message: 'Logged' })
  } catch (e) {
    return res.status(500).json({ message: 'Server error', error: String(e) })
  }
}
