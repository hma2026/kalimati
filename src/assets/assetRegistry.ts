/**
 * سجلّ الصور المركزي
 * ----------------------------------------------------------------------------
 * يكتشف تلقائياً أي صورة توضع تحت `src/assets/images/**` ويربطها بمفتاحها
 * الداخلي (اسم الملف بدون الامتداد). فقط ضع الملف وسيُستخدم فوراً في الدرس
 * واللعبة معاً — بدون تعديل أي شاشة.
 *
 *   src/assets/images/animals/cat.png   →  getAsset('cat')
 *   src/assets/images/colors/red.webp   →  getAsset('red')
 *   src/assets/images/shapes/circle.svg →  getAsset('circle')
 *
 * الصيغ المدعومة: png / webp / svg / jpg.
 * إن لم توجد صورة لمفتاح ما، يرجع null ويستخدم النظام بديلاً مؤقتاً
 * (رمز تعبيري / بقعة لون / شكل) عبر mediaVisual.
 */

// Vite يحوّل هذا وقت البناء إلى روابط فعلية للأصول.
const modules = import.meta.glob('/src/assets/images/**/*.{png,webp,svg,jpg,jpeg}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

/** key (filename without extension) -> resolved asset URL */
const REGISTRY: Record<string, string> = {}
for (const path in modules) {
  const file = path.split('/').pop() ?? ''
  const key = file.replace(/\.(png|webp|svg|jpe?g)$/i, '')
  if (key) REGISTRY[key] = modules[path]
}

/** المجلدات المتوقّعة لكل نوع (للتوثيق وأدوات الإدارة المستقبلية). */
export const ASSET_DIRS: Record<string, string> = {
  animal: 'src/assets/images/animals',
  color: 'src/assets/images/colors',
  shape: 'src/assets/images/shapes',
  word: 'src/assets/images/foods',
  emotion: 'src/assets/images/emotions',
  daily: 'src/assets/images/daily-phrases',
  character: 'src/assets/images/characters',
}

/** يرجع رابط الصورة الفعلية للمفتاح، أو null إن لم تتوفّر بعد. */
export const getAsset = (key: string): string | null => REGISTRY[key] ?? null
export const hasAsset = (key: string): boolean => key in REGISTRY
export const assetKeys = (): string[] => Object.keys(REGISTRY)
