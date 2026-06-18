// يفشل إذا وُجد emoji ظاهر في واجهة الطفل.
// النطاق: src/screens, src/components, src/data — باستثناء media.ts (خريطة fallback
// داخلية لا تُعرض) وأسطر fallbackEmoji داخل assetManifest.ts (احتياط مسموح).
import fs from 'fs'
import path from 'path'

// نطاقات emoji فقط (تستثني الأسهم والترقيم والرموز الفنية مثل ⌫ والحروف العربية)
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{1F000}-\u{1F0FF}\u{1F1E6}-\u{1F1FF}\u{FE0F}]/u
const ZW = /[\u200c\u200d\u200e\u200f\ufeff]/

const ROOTS = ['src/screens', 'src/components', 'src/data']
const EXEMPT_FILES = new Set(['media.ts'])      // خريطة fallback داخلية
const offenders = []

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    const st = fs.statSync(p)
    if (st.isDirectory()) { walk(p); continue }
    if (!/\.(ts|tsx)$/.test(name)) continue
    if (EXEMPT_FILES.has(name)) continue
    const isManifest = name === 'assetManifest.ts'
    const lines = fs.readFileSync(p, 'utf8').split('\n')
    lines.forEach((ln, i) => {
      if (isManifest && ln.includes('fallbackEmoji')) return   // احتياط مسموح
      const cleaned = ln.replace(ZW, '')
      if (EMOJI.test(cleaned)) {
        const m = cleaned.match(new RegExp(EMOJI, 'gu')) || []
        offenders.push({ file: p, line: i + 1, chars: [...new Set(m)].join(' '), ctx: ln.trim().slice(0, 60) })
      }
    })
  }
}
ROOTS.forEach(r => { if (fs.existsSync(r)) walk(r) })

if (offenders.length) {
  console.error(`❌ check:no-emoji-ui فشل — emoji ظاهر في الواجهة (${offenders.length}):`)
  offenders.slice(0, 40).forEach(o => console.error(`  ${o.file}:${o.line}  [${o.chars}]  ${o.ctx}`))
  process.exit(1)
}
console.log('✅ check:no-emoji-ui نجح — لا emoji ظاهر في واجهة الطفل (الاحتياط الداخلي مسموح فقط).')
