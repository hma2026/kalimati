import { useEffect, useRef, useState } from 'react'
import { useNav } from '@/store/useNavStore'
import { BackIcon } from '@/lib/icons'
import { getAsset } from '@/assets/assetRegistry'
import { PlaceholderVisual } from '@/components/PlaceholderVisual'
import { replaceableAssets } from '@/data/replaceableAssets'

/* ============================ عميل أداة التحديث ============================ */
type Resp = { status: number; data: any }

async function callApi(action: string, secret: string, body?: unknown): Promise<Resp> {
  const res = await fetch(`/api/update?action=${action}`, {
    method: action === 'status' ? 'GET' : 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
    body: action === 'status' ? undefined : JSON.stringify(body ?? {}),
  })
  const data = await res.json().catch(() => ({}))
  return { status: res.status, data }
}

function bufToB64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf)
  let bin = ''
  const CH = 0x8000
  for (let i = 0; i < bytes.length; i += CH) {
    bin += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + CH)))
  }
  return btoa(bin)
}

// 3MB خام لكل شريحة ⇒ ~4MB Base64 < حد 4.5MB لمعظم الاستضافات
const RAW_CHUNK = 3 * 1024 * 1024

async function uploadFile(
  file: File,
  opts: { kind: 'zip' | 'file'; singlePath?: string; note?: string },
  secret: string,
  onProgress: (p: number) => void,
): Promise<any> {
  const buf = await file.arrayBuffer()
  const total = Math.max(1, Math.ceil(buf.byteLength / RAW_CHUNK))
  const begin = await callApi('begin', secret, { kind: opts.kind })
  if (begin.status !== 200) throw new Error(begin.data.error || 'فشل بدء الرفع')
  const uploadId = begin.data.uploadId

  for (let i = 0; i < total; i++) {
    const slice = buf.slice(i * RAW_CHUNK, (i + 1) * RAW_CHUNK)
    const r = await callApi('chunk', secret, { uploadId, index: i, data: bufToB64(slice) })
    if (r.status !== 200) throw new Error(r.data.error || `فشل رفع الشريحة ${i + 1}`)
    onProgress(Math.round(((i + 1) / total) * 88))
  }
  onProgress(94)
  const commit = await callApi('commit', secret, {
    uploadId, total, note: opts.note, kind: opts.kind, singlePath: opts.singlePath,
  })
  if (commit.status !== 200) throw new Error(commit.data.error || 'فشل تطبيق التحديث')
  onProgress(100)
  return commit.data
}

/* ================================ الشاشة ================================ */
export function AdminScreen() {
  const nav = useNav()
  const [secret, setSecret] = useState(() => sessionStorage.getItem('hma_admin') || '')
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [tab, setTab] = useState<'version' | 'update' | 'assets'>('version')
  const [version, setVersion] = useState<number | null>(null)
  const [log, setLog] = useState<any[]>([])
  const [err, setErr] = useState('')
  const [checking, setChecking] = useState(false)

  async function refresh(sec = secret) {
    const r = await callApi('status', sec)
    if (r.status === 200) { setVersion(r.data.version); setLog(r.data.log || []); return true }
    return false
  }

  // محاولة دخول تلقائي إن وُجد سرّ محفوظ
  useEffect(() => {
    if (secret) refresh(secret).then((ok) => setAuthed(ok))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function login() {
    setErr(''); setChecking(true)
    const r = await callApi('status', pw)
    setChecking(false)
    if (r.status === 200) {
      setSecret(pw); sessionStorage.setItem('hma_admin', pw)
      setVersion(r.data.version); setLog(r.data.log || []); setAuthed(true)
    } else if (r.status === 401) setErr('كلمة المرور خاطئة')
    else setErr(r.data.error || 'تعذّر الاتصال بالخادم')
  }

  function logout() { sessionStorage.removeItem('hma_admin'); setSecret(''); setAuthed(false); setPw('') }

  return (
    <div className="screen admin">
      <div className="admin__bar">
        <button className="admin__back" aria-label="رجوع" onClick={() => nav.back()}><BackIcon size={24} /></button>
        <h1 className="admin__title">إدارة الموقع</h1>
        {authed && <button className="admin__logout" onClick={logout}>خروج</button>}
      </div>

      {!authed ? (
        <div className="admin__login">
          <p className="admin__hint">شاشة خاصة بالإدارة لإعدادات الموقع والتحديثات.</p>
          <input
            className="admin__pw" type="password" placeholder="كلمة مرور الإدارة" value={pw}
            onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && login()}
          />
          <button className="admin__btn" onClick={login} disabled={!pw || checking}>
            {checking ? 'جارٍ التحقق…' : 'دخول'}
          </button>
          {err && <div className="admin__err">{err}</div>}
        </div>
      ) : (
        <>
          <div className="admin__tabs">
            <button className={'admin__tab' + (tab === 'version' ? ' is-on' : '')} onClick={() => setTab('version')}>الإصدار والسجل</button>
            <button className={'admin__tab' + (tab === 'update' ? ' is-on' : '')} onClick={() => setTab('update')}>رفع تحديث</button>
            <button className={'admin__tab' + (tab === 'assets' ? ' is-on' : '')} onClick={() => setTab('assets')}>الأيقونات والصور</button>
          </div>

          <div className="screen__scroll admin__body">
            {tab === 'version' && <VersionTab version={version} log={log} onRefresh={() => refresh()} />}
            {tab === 'update' && <UpdateTab secret={secret} onDone={() => refresh()} />}
            {tab === 'assets' && <AssetsTab secret={secret} onDone={() => refresh()} />}
          </div>
        </>
      )}
    </div>
  )
}

/* ----------------------------- تبويب الإصدار ----------------------------- */
function VersionTab({ version, log, onRefresh }: { version: number | null; log: any[]; onRefresh: () => void }) {
  return (
    <div className="admin__pane">
      <div className="admin__ver">
        <span className="admin__ver-lbl">الإصدار الحالي</span>
        <span className="admin__ver-num">#{version ?? '—'}</span>
      </div>
      <button className="admin__btn admin__btn--soft" onClick={onRefresh}>تحديث الحالة</button>
      <h3 className="admin__h3">سجلّ التحديثات</h3>
      {log.length === 0 ? (
        <p className="admin__muted">لا توجد تحديثات بعد.</p>
      ) : (
        <ul className="admin__log">
          {log.map((e, i) => (
            <li key={i} className="admin__log-item">
              <div className="admin__log-top">
                <b>#{e.version}</b>
                <span className="admin__log-meta">{e.files} ملف · {new Date(e.at).toLocaleString('ar')}</span>
              </div>
              {e.note && <div className="admin__log-note">{e.note}</div>}
              <div className="admin__log-commit">{e.commit}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/* ----------------------------- تبويب رفع تحديث ----------------------------- */
function UpdateTab({ secret, onDone }: { secret: string; onDone: () => void }) {
  const [note, setNote] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [prog, setProg] = useState(0)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  async function run() {
    if (!file) return
    setBusy(true); setMsg(null); setProg(0)
    try {
      const r = await uploadFile(file, { kind: 'zip', note }, secret, setProg)
      setMsg({ ok: true, text: `تم التحديث بنجاح — الإصدار #${r.version} (${r.files} ملف). ${r.deploy}` })
      setFile(null); setNote(''); onDone()
    } catch (e: any) {
      setMsg({ ok: false, text: e.message || 'فشل التحديث' })
    } finally { setBusy(false) }
  }

  return (
    <div className="admin__pane">
      <p className="admin__hint">ارفع ملفاً مضغوطاً (.zip) يحوي الملفات المتغيّرة فقط. تُجزّأ وتُرفع ثم تُطبّق على الموقع وتُنشر تلقائياً.</p>
      <label className="admin__field">وصف التحديث (اختياري)
        <input className="admin__input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="مثال: إصلاح بطاقة الحروف" />
      </label>
      <label className="admin__file">
        <input type="file" accept=".zip,application/zip" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <span>{file ? file.name + ` (${(file.size / 1048576).toFixed(2)}MB)` : 'اختر ملف ZIP'}</span>
      </label>
      {busy && (
        <div className="admin__progress"><div className="admin__progress-bar" style={{ width: prog + '%' }} /><span>{prog}%</span></div>
      )}
      <button className="admin__btn" onClick={run} disabled={!file || busy}>{busy ? 'جارٍ التحديث…' : 'رفع وتطبيق التحديث'}</button>
      {msg && <div className={msg.ok ? 'admin__ok' : 'admin__err'}>{msg.text}</div>}
    </div>
  )
}

/* --------------------------- تبويب الأيقونات والصور --------------------------- */
function AssetsTab({ secret, onDone }: { secret: string; onDone: () => void }) {
  const [busyKey, setBusyKey] = useState('')
  const [prog, setProg] = useState(0)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const inputs = useRef<Record<string, HTMLInputElement | null>>({})

  async function upload(key: string, path: string, file: File) {
    setBusyKey(key); setMsg(null); setProg(0)
    try {
      const r = await uploadFile(file, { kind: 'file', singlePath: path, note: `صورة ${key}` }, secret, setProg)
      setMsg({ ok: true, text: `تم رفع صورة «${key}» — إصدار #${r.version} — ستظهر بعد إعادة النشر (~دقيقتان).` })
      onDone()
    } catch (e: any) {
      setMsg({ ok: false, text: e.message || 'فشل الرفع' })
    } finally { setBusyKey('') }
  }

  return (
    <div className="admin__pane">
      <p className="admin__hint">استبدل البدائل المؤقتة بصور حقيقية (PNG مفضّل). الصورة تُلتزم وتظهر تلقائياً بعد النشر دون أي تعديل برمجي.</p>
      <div className="admin__assets">
        {replaceableAssets.map((a) => {
          const url = getAsset(a.key)
          return (
            <div key={a.key} className="assetcell">
              <div className="assetcell__thumb">
                {url ? <img src={url} alt="" /> : <PlaceholderVisual size={46} accent="#7c3aed" />}
              </div>
              <span className="assetcell__lbl">{a.label}</span>
              <input
                ref={(el) => { inputs.current[a.key] = el }}
                type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" hidden
                onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(a.key, a.path, f) }}
              />
              <button
                className="assetcell__btn" disabled={!!busyKey}
                onClick={() => inputs.current[a.key]?.click()}
              >
                {busyKey === a.key ? `${prog}%` : url ? 'تبديل' : 'استبدال'}
              </button>
            </div>
          )
        })}
      </div>
      {msg && <div className={msg.ok ? 'admin__ok' : 'admin__err'}>{msg.text}</div>}
    </div>
  )
}
