import { redis } from './_redis.js'

const KEY = 'kalimati:labels'

export default async function handler(req, res) {
  const secret = req.headers['x-admin-secret']
  
  // GET: جلب كل المسمّيات المعدّلة (لا يحتاج مصادقة — تُقرأ من التطبيق)
  if (req.method === 'GET') {
    try {
      const data = await redis.get(KEY)
      return res.json({ ok: true, labels: data ? JSON.parse(data) : {} })
    } catch (e) {
      return res.json({ ok: true, labels: {} })
    }
  }
  
  // POST: تعديل مسمّى (يحتاج مصادقة)
  if (req.method === 'POST') {
    if (secret !== process.env.ADMIN_SECRET) {
      return res.status(401).json({ ok: false, error: 'غير مصرّح' })
    }
    try {
      const { key, label } = req.body || JSON.parse(await new Promise(r => { let b=''; req.on('data',c=>b+=c); req.on('end',()=>r(b)) }))
      if (!key || !label) return res.status(400).json({ ok: false, error: 'key و label مطلوبان' })
      
      const existing = await redis.get(KEY)
      const labels = existing ? JSON.parse(existing) : {}
      labels[key] = label
      await redis.set(KEY, JSON.stringify(labels))
      return res.json({ ok: true, key, label })
    } catch (e) {
      return res.status(500).json({ ok: false, error: e.message })
    }
  }
  
  res.status(405).json({ ok: false, error: 'Method not allowed' })
}
