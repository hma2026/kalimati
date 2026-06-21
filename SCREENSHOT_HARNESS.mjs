// كلمة كلمة — أداة التحقّق البصري عبر متصفّح headless (مُثبَتة)
// إعداد (في كل جلسة جديدة):  cd /tmp && npm i @sparticuz/chromium puppeteer-core
// تشغيل:                      cd /home/claude/kalimati && npm run build
//                             (cd dist && python3 -m http.server 5055 &)
//                             node SCREENSHOT_HARNESS.mjs
//
// ملاحظات:
//  - خطوط Google لا تُحمَّل headless → بديل النظام (لا يؤثّر على البنية/الألوان).
//  - انقر أزراراً حقيقية (button/a/[role=button])، لا div (لئلا يفشل التنقّل في React).
//  - عطّل الكاش. iPad VP 1024×1366، جوال 390×844.

import chromium from '@sparticuz/chromium'      // أو: const chromium = require('@sparticuz/chromium').default
import puppeteer from 'puppeteer-core'

const SHOTS = '/tmp/shots'
const URL = 'http://localhost:5055'

const wait = (ms) => new Promise(r => setTimeout(r, ms))

async function main() {
  const exe = await chromium.executablePath()
  const browser = await puppeteer.launch({
    args: [...chromium.args, '--no-sandbox', '--disable-dev-shm-usage'],
    executablePath: exe, headless: 'shell',
  })
  const page = await browser.newPage()
  await page.setCacheEnabled(false)
  await page.setViewport({ width: 1024, height: 1366, deviceScaleFactor: 1 })

  // ينقر أول زر حقيقي يحتوي النص
  const clickBtn = (t) => page.evaluate((t) => {
    const els = [...document.querySelectorAll('button,a,[role=button]')]
    const el = els.find(e => e.offsetParent !== null && e.textContent.replace(/\s+/g, ' ').includes(t))
    if (el) { el.click(); return true } return false
  }, t)

  const shot = async (name) => { await wait(800); await page.screenshot({ path: `${SHOTS}/${name}.png` }); console.log('shot', name) }

  // الوصول للرئيسية: ابدأ ← اختيار طفل
  async function gotoHome() {
    await page.goto(`${URL}/?b=${Date.now()}`, { waitUntil: 'domcontentloaded' })
    await wait(1300)
    await clickBtn('ابدأ'); await wait(700)
    await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find(e => /أحمد/.test(e.textContent)); if (b) b.click() })
    await wait(900)
  }

  // شاشة البداية
  await page.goto(`${URL}/?b=${Date.now()}`, { waitUntil: 'domcontentloaded' }); await wait(1500)
  await shot('splash')

  // الرئيسية + المستويات (انقر التبويب/الزر باسمه، ثم ارجع «الرئيسية»)
  await gotoHome(); await shot('home')
  const screens = [
    ['كلمات مفردة', 'level1'], ['حروف', 'letter'],
    ['المستوى الثاني', 'level2'], ['المستوى الثالث', 'level3'],
    ['المستوى الرابع', 'level4'], ['المستوى الخامس', 'level5'],
    ['المستوى السادس', 'level6'], ['حيوانات وأصوات', 'animals'],
    ['ألعاب تعليمية', 'games'], ['تقرير التقدّم', 'report'],
  ]
  for (const [label, name] of screens) {
    if (!(await clickBtn(label))) { await gotoHome(); continue }
    await wait(500); await shot(name)
    if (!(await clickBtn('الرئيسية'))) await gotoHome(); else await wait(700)
  }

  // مثال: تبويب داخل مستوى (الأشكال في L5)
  // await clickBtn('المستوى الخامس'); await wait(700); await clickBtn('الأشكال'); await shot('level5_shapes')

  await browser.close()
  console.log('DONE — عاين اللقطات في', SHOTS)
}
main()
