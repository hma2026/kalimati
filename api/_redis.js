// api/_redis.js — مساعد Upstash Redis عبر REST. ملف داخلي (بادئة _) وليس endpoint.
const URL = process.env.UPSTASH_REDIS_REST_URL
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

async function cmd(args) {
  if (!URL || !TOKEN) throw new Error('Upstash env vars missing (UPSTASH_REDIS_REST_URL/TOKEN)')
  const res = await fetch(URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
  })
  if (!res.ok) throw new Error(`Redis HTTP ${res.status}`)
  const json = await res.json()
  if (json.error) throw new Error('Redis: ' + json.error)
  return json.result
}

export const rGet = (k) => cmd(['GET', k])
export const rSet = (k, v, ttlSec) =>
  ttlSec ? cmd(['SET', k, v, 'EX', String(ttlSec)]) : cmd(['SET', k, v])
export const rDel = (...keys) => cmd(['DEL', ...keys])
export const rIncr = (k) => cmd(['INCR', k])
export const rLpush = (k, v) => cmd(['LPUSH', k, v])
export const rLtrim = (k, a, b) => cmd(['LTRIM', k, String(a), String(b)])
export const rLrange = (k, a, b) => cmd(['LRANGE', k, String(a), String(b)])
export const rExpire = (k, ttlSec) => cmd(['EXPIRE', k, String(ttlSec)])
