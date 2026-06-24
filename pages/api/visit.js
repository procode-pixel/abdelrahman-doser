export default async function handler(req, res) {
  const fbUrl = `https://doser-portfolio-default-rtdb.firebaseio.com/analytics.json?auth=${process.env.FIREBASE_SECRET}`
  
  if (req.method === 'GET') {
    try {
      const resp = await fetch(fbUrl)
      const data = resp.ok ? await resp.json() : {}
      return res.status(200).json(data)
    } catch (e) {
      return res.status(500).json({ message: 'Error fetching analytics' })
    }
  }

  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' })
  
  try {
    const { projectId } = req.body
    const now = new Date()
    const todayKey = now.toISOString().slice(0, 10)
    
    const countsResp = await fetch(fbUrl)
    const counts = countsResp.ok ? await countsResp.json() : {}
    
    // Update general analytics
    const total = (counts?.total || 0) + 1
    const daily = { ...(counts?.daily || {}) }
    daily[todayKey] = (daily[todayKey] || 0) + 1
    
    // Update project specific analytics if provided
    const projectVisits = { ...(counts?.projectVisits || {}) }
    if (projectId) {
      projectVisits[projectId] = (projectVisits[projectId] || 0) + 1
    }

    const next = { 
      ...counts, 
      total, 
      daily, 
      projectVisits, 
      lastVisit: now.toISOString() 
    }

    const put = await fetch(fbUrl, { 
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(next) 
    })

    if (!put.ok) return res.status(500).json({ message: 'Failed to update analytics' })
    return res.status(200).json(next)
  } catch (e) {
    return res.status(500).json({ message: 'Server error', error: String(e) })
  }
}

