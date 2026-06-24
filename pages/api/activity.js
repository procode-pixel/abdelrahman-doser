export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' })
  try {
    const fbRes = await fetch(`https://doser-portfolio-default-rtdb.firebaseio.com/adminActivity.json?auth=${process.env.FIREBASE_SECRET}`)
    if (!fbRes.ok) return res.status(500).json({ message: 'Firebase fetch error' })
    const obj = await fbRes.json()
    if (!obj) return res.status(200).json([])
    const arr = Object.keys(obj).map(k => ({ id: k, ...obj[k] }))
    arr.sort((a,b) => new Date(b.time) - new Date(a.time))
    return res.status(200).json(arr.slice(0, 200))
  } catch (e) {
    return res.status(500).json({ message: 'Server error', error: String(e) })
  }
}
