// بوّابة فحص الأصول — npm run check:assets
// يتحقق: كل مفتاح مستخدم له صورة (لا emoji نهائي) · لا placeholder رمادي ·
// لا صورة مكسورة/فارغة · لا تضارب مفاتيح · assetManifest يغطّي المطلوب.
import fs from 'fs'
import path from 'path'

const IMG = 'src/assets/images'
const fail = []
const warn = []

// 1) خريطة مفاتيح البطاقات (تستثني ui/avatars/rewards مثل التطبيق)
const EXCLUDE = new Set(['ui', 'avatars', 'rewards'])
const reg = {}            // key -> category
const fileByKey = {}      // key -> abs path
let totalSvg = 0
for (const cat of fs.readdirSync(IMG)) {
  const cd = path.join(IMG, cat)
  if (!fs.statSync(cd).isDirectory()) continue
  for (const f of fs.readdirSync(cd)) {
    if (!/\.(svg|png|webp|jpe?g)$/i.test(f)) continue
    totalSvg++
    const key = f.replace(/\.(svg|png|webp|jpe?g)$/i, '')
    if (EXCLUDE.has(cat)) continue
    if (reg[key] && reg[key] !== cat) fail.push(`تضارب مفتاح "${key}" بين ${reg[key]} و ${cat}`)
    reg[key] = cat
    fileByKey[key] = path.join(cd, f)
  }
}

// 2) المفاتيح المستخدمة فعلياً في التطبيق (يجب أن تُحلّ كلها لأصل — وإلا يظهر emoji)
const animals = ['cat','dog','cow','sheep','horse','chicken','duck','bird','lion','elephant']
const colors = ['red','blue','green','yellow','white','black','brown','pink','orange','purple']
const shapes = ['circle','square','triangle','rectangle','star','heart','arrow','line']
const L2 = ['water','milk','juice','bathroom','eat','play','sleep','goOut','chips']
const L3 = ['water','car','bathroom','tired','stomachPain','mother','father','sleep']
const L4 = ['happy','sad','scared','angry','tired','bored','stomachPain','headPain','toothPain','earPain','handPain','legPain','loudSound','quietPlace','doNotTouch','mother','father','help','stop','goOut']
const L6 = ['salam','ahlan','hi','salam_alaykum','bye','byebye','maa_salama','bismillah','alhamdulillah','finished','enough','water','request_word','help','come','open','yes','no','thanks','khalas','tayeb','lala']
const required = [...new Set([...animals, ...colors, ...shapes, ...L2, ...L3, ...L4, ...L6])]
const missing = required.filter(k => !(k in reg))
if (missing.length) fail.push(`مفاتيح مستخدمة بلا أصل (سيظهر emoji): ${missing.join(', ')}`)

// 3) لا placeholder رمادي: ممنوع أي PNG تحت public/assets/cards
const cardsDir = 'public/assets/cards'
if (fs.existsSync(cardsDir)) {
  const pngs = []
  const walk = d => fs.readdirSync(d).forEach(n => {
    const p = path.join(d, n)
    if (fs.statSync(p).isDirectory()) walk(p)
    else if (/\.(png|jpe?g)$/i.test(n)) pngs.push(p)
  })
  walk(cardsDir)
  if (pngs.length) fail.push(`placeholders محتملة تحت ${cardsDir}: ${pngs.length} ملف`)
}

// 4) لا صورة مكسورة/فارغة: كل SVG غير فارغ ويحوي <svg
for (const cat of fs.readdirSync(IMG)) {
  const cd = path.join(IMG, cat)
  if (!fs.statSync(cd).isDirectory()) continue
  for (const f of fs.readdirSync(cd)) {
    if (!f.endsWith('.svg')) continue
    const p = path.join(cd, f)
    const s = fs.readFileSync(p, 'utf8')
    if (s.trim().length < 40 || !s.includes('<svg')) fail.push(`SVG مكسور/فارغ: ${cat}/${f}`)
    if (/[\u0600-\u06FF]/.test(s)) warn.push(`نص عربي داخل الصورة: ${cat}/${f}`)
  }
}

// 5) لا تضارب play/star
if (reg['play'] && reg['play'] !== 'actions') fail.push(`play يُحلّ إلى ${reg['play']} بدل actions`)
if (reg['star'] && reg['star'] !== 'shapes') fail.push(`star يُحلّ إلى ${reg['star']} بدل shapes`)

// 6) assetManifest يغطّي كل المفاتيح المطلوبة
const mf = 'src/data/assetManifest.ts'
if (!fs.existsSync(mf)) fail.push('assetManifest.ts غير موجود')
else {
  const t = fs.readFileSync(mf, 'utf8')
  const notInManifest = required.filter(k => !new RegExp(`itemKey:\\s*"${k}"`).test(t))
  if (notInManifest.length) fail.push(`مفاتيح غير مسجّلة في assetManifest: ${notInManifest.join(', ')}`)
}

// تقرير
console.log(`assets: ${totalSvg} svg | card keys: ${Object.keys(reg).length} | required: ${required.length} resolved`)
console.log(`play -> ${reg['play']} | star -> ${reg['star']}`)
if (warn.length) { console.log('\nتحذيرات:'); warn.forEach(w => console.log('  ⚠ ' + w)) }
if (fail.length) {
  console.error('\n❌ check:assets فشل:')
  fail.forEach(e => console.error('  - ' + e))
  process.exit(1)
}
console.log('\n✅ check:assets نجح — لا emoji نهائي، لا placeholder، لا صورة مكسورة، لا مفتاح ناقص.')
