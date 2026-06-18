/**
 * أداة قص الأصول من Sprite/Asset Sheets باستخدام sharp.
 * ----------------------------------------------------------------------------
 * تقرأ tools/extract-assets/asset-crops.json (إحداثيات يدوية لكل عنصر)، تقصّ
 * الصورة الداخلية فقط (بدون النص العربي)، وتحفظها في public/assets/... ثم
 * تطبع قائمة المفاتيح المستخرجة. النص يبقى من dialects.ts.
 *
 * التشغيل:
 *   npm i -D sharp tsx
 *   1) ضع صور الشيتات في tools/extract-assets/sheets/
 *   2) عرّف الإحداثيات في asset-crops.json
 *   3) npx tsx tools/extract-assets/extractAssets.ts
 *
 * ملاحظة: الصور الحالية في المشروع placeholders ولّدها generate_assets.py.
 * استخدم هذه الأداة فقط عند توفّر شيت صور فعلي عالي الدقة.
 */
import sharp from 'sharp'
import { readFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve, join } from 'node:path'

interface Crop { x: number; y: number; width: number; height: number }
interface CropItem { key: string; sourceImage: string; crop: Crop; output: string }

const ROOT = resolve(__dirname, '..', '..')
const SHEETS = join(__dirname, 'sheets')
const cropsFile = join(__dirname, 'asset-crops.json')

async function run() {
  if (!existsSync(cropsFile)) { console.error('asset-crops.json غير موجود'); process.exit(1) }
  const items: CropItem[] = JSON.parse(readFileSync(cropsFile, 'utf8'))
  const done: string[] = []
  const missing: string[] = []

  for (const it of items) {
    const src = join(SHEETS, it.sourceImage)
    if (!existsSync(src)) { missing.push(`${it.key} (شيت مفقود: ${it.sourceImage})`); continue }
    const out = resolve(ROOT, it.output)
    mkdirSync(dirname(out), { recursive: true })
    try {
      await sharp(src)
        .extract({ left: it.crop.x, top: it.crop.y, width: it.crop.width, height: it.crop.height })
        .resize(240, 240, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toFile(out)
      done.push(it.key)
    } catch (e) {
      missing.push(`${it.key} (فشل القص: ${(e as Error).message})`)
    }
  }

  console.log(`تم استخراج ${done.length} أصل:`, done.join(', ') || '—')
  if (missing.length) {
    console.log(`\nيحتاج إعادة/دقة أعلى (${missing.length}):`)
    for (const m of missing) console.log('  - ' + m)
  }
  console.log('\nثم حدّث المسارات في assetManifest عند الحاجة (المفاتيح نفسها).')
}
run()
