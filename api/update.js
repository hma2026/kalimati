// api/update.js — أداة التحديث (نمط بصمة).
// يرفع الإداريّ ZIP مجزّأً → يُجمَّع في Redis → يُفكّ → يُلتزم إلى GitHub → Vercel يعيد النشر.
// كل التحديثات تُسجَّل ويُعرض رقم إصدار تسلسلي. ملف عام (بلا بادئة _) = endpoint.
import { rGet, rSet, rDel, rIncr, rLpush, rLtrim, rLrange, rExpire } from './_redis.js'
import { commitFiles } from './_github.js'
import { unzipToFiles } from './_zip.js'

const VERSION_KEY = 'kalimati:build'       // عدّاد تسلسلي
const LOG_KEY = 'kalimati:updatelog'       // قائمة سجلّ التحديثات
const CHUNK_TTL = 3600                      // الشرائح تنتهي بعد ساعة
const MAX_FILES = 800

function send(res, code, obj) {
  res.statusCode = code
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(obj))
}

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body
  const chunks = []
  for await (const c of req) chunks.push(c)
  const raw = Buffer.concat(chunks).toString('utf8')
  return raw ? JSON.parse(raw) : {}
}

function authed(req) {
  const secret = process.env.ADMIN_SECRET
  if (!secret) return false
  const given = req.headers['x-admin-secret']
  return typeof given === 'string' && given.length === secret.length && given === secret
}

async function getStatus() {
  const v = (await rGet(VERSION_KEY)) || '0'
  const raw = (await rLrange(LOG_KEY, 0, 49)) || []
  const log = raw.map((s) => { try { return JSON.parse(s) } catch { return null } }).filter(Boolean)
  return { version: Number(v), log }
}

export default async function handler(req, res) {
  try {
    if (!authed(req)) return send(res, 401, { ok: false, error: 'غير مصرّح — كلمة مرور الإدارة خاطئة' })

    const action = (req.query?.action || '').toString()

    // الحالة (الإصدار + السجل)
    if (req.method === 'GET' || action === 'status') {
      return send(res, 200, { ok: true, ...(await getStatus()) })
    }

    if (req.method !== 'POST') return send(res, 405, { ok: false, error: 'method' })
    const body = await readJson(req)

    // بدء جلسة رفع
    if (action === 'begin') {
      const uploadId = 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
      await rSet(`kalimati:upd:${uploadId}:meta`, JSON.stringify({ at: Date.now() }), CHUNK_TTL)
      const v = (await rGet(VERSION_KEY)) || '0'
      return send(res, 200, { ok: true, uploadId, version: Number(v) })
    }

    // استقبال شريحة
    if (action === 'chunk') {
      const { uploadId, index, data } = body
      if (!uploadId || index == null || typeof data !== 'string') {
        return send(res, 400, { ok: false, error: 'بيانات شريحة ناقصة' })
      }
      await rSet(`kalimati:upd:${uploadId}:${index}`, data, CHUNK_TTL)
      await rExpire(`kalimati:upd:${uploadId}:meta`, CHUNK_TTL)
      return send(res, 200, { ok: true, index: Number(index) })
    }

    // تجميع + فكّ + التزام
    if (action === 'commit') {
      const { uploadId, total, note, kind, singlePath } = body
      if (!uploadId || !total) return send(res, 400, { ok: false, error: 'uploadId/total ناقص' })

      // تجميع الشرائح بالترتيب
      const parts = []
      for (let i = 0; i < Number(total); i++) {
        const part = await rGet(`kalimati:upd:${uploadId}:${i}`)
        if (part == null) return send(res, 400, { ok: false, error: `الشريحة ${i} مفقودة — أعد الرفع` })
        parts.push(Buffer.from(part, 'base64'))
      }
      const buffer = Buffer.concat(parts)

      // تجهيز الملفات
      let files
      if (kind === 'file') {
        if (!singlePath) return send(res, 400, { ok: false, error: 'singlePath مطلوب' })
        files = [{ path: singlePath, contentBase64: buffer.toString('base64') }]
      } else {
        files = unzipToFiles(new Uint8Array(buffer))
      }
      if (!files.length) return send(res, 400, { ok: false, error: 'لا ملفات' })
      if (files.length > MAX_FILES) return send(res, 400, { ok: false, error: `ملفات كثيرة (${files.length})` })

      // الإصدار التسلسلي الجديد + رسالة الالتزام
      const version = Number(await rIncr(VERSION_KEY))
      const message = `update #${version}${note ? ' — ' + note : ''} [admin]`
      const result = await commitFiles(files, message)

      // سجلّ ظاهر
      const entry = {
        version,
        note: note || '',
        files: files.length,
        paths: files.map((f) => f.path).slice(0, 30),
        commit: result.commitSha.slice(0, 7),
        commitUrl: result.commitUrl,
        at: new Date().toISOString(),
      }
      await rLpush(LOG_KEY, JSON.stringify(entry))
      await rLtrim(LOG_KEY, 0, 99)

      // تنظيف الشرائح
      const delKeys = [`kalimati:upd:${uploadId}:meta`]
      for (let i = 0; i < Number(total); i++) delKeys.push(`kalimati:upd:${uploadId}:${i}`)
      await rDel(...delKeys)

      return send(res, 200, { ok: true, version, files: files.length, commit: entry.commit, commitUrl: result.commitUrl, deploy: 'Vercel يعيد النشر الآن' })
    }

    return send(res, 400, { ok: false, error: 'action غير معروف' })
  } catch (e) {
    return send(res, 500, { ok: false, error: String(e?.message || e) })
  }
}
