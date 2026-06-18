/**
 * سجلّ الصور المركزي
 * ----------------------------------------------------------------------------
 * يكتشف تلقائياً أي صورة توضع تحت `src/assets/images/**` ويربطها بمفتاحها
 * الداخلي (اسم الملف بدون الامتداد). فقط ضع الملف وسيُستخدم فوراً في الدرس
 * واللعبة معاً — بدون تعديل أي شاشة.
 *
 *   src/assets/images/animals/cat.svg    →  getAsset('cat')
 *   src/assets/images/drinks/water.png   →  getAsset('water')
 *   src/assets/images/shapes/circle.svg  →  getAsset('circle')
 *
 * الصيغ المدعومة: svg / png / webp / jpg.
 * مجلدا `ui/` و `avatars/` لا يدخلان خريطة مفاتيح البطاقات (أصول واجهة/شخصيات
 * تُعرض في design-handoff فقط)، حتى لا يتضارب مفتاح مثل play/star.
 */

const modules = import.meta.glob('/src/assets/images/**/*.{png,webp,svg,jpg,jpeg}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

/** key (filename without extension) -> resolved asset URL (يستثني ui/ و avatars/) */
const REGISTRY: Record<string, string> = {}
for (const path in modules) {
  if (path.includes('/ui/') || path.includes('/avatars/')) continue
  const file = path.split('/').pop() ?? ''
  const key = file.replace(/\.(png|webp|svg|jpe?g)$/i, '')
  if (key) REGISTRY[key] = modules[path]
}

/** كل الأصول (بما فيها ui/avatars) بالمسار النسبي — لأدوات التسليم. */
export const ALL_ASSET_PATHS: Record<string, string> = {}
for (const path in modules) {
  const rel = path.replace('/src/assets/images/', '')
  ALL_ASSET_PATHS[rel] = modules[path]
}

/** المجلدات المعتمدة لكل تصنيف. */
export const ASSET_DIRS: Record<string, string> = {
  drinks: 'src/assets/images/drinks',
  food: 'src/assets/images/food',
  actions: 'src/assets/images/actions',
  people: 'src/assets/images/people',
  emotions: 'src/assets/images/emotions',
  pain: 'src/assets/images/pain',
  sensory: 'src/assets/images/sensory',
  colors: 'src/assets/images/colors',
  shapes: 'src/assets/images/shapes',
  daily: 'src/assets/images/daily',
  animals: 'src/assets/images/animals',
  ui: 'src/assets/images/ui',
  avatars: 'src/assets/images/avatars',
}

/** يرجع رابط الصورة الفعلية للمفتاح، أو null إن لم تتوفّر بعد. */
export const getAsset = (key: string): string | null => REGISTRY[key] ?? null
export const hasAsset = (key: string): boolean => key in REGISTRY
export const assetKeys = (): string[] => Object.keys(REGISTRY)
