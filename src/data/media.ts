import { COLOR_KEYS, SHAPE_KEYS, getColorHex } from './dialects'

/**
 * طبقة الوسائط الموحّدة (مصدر واحد للصور)
 * ----------------------------------------------------------------------------
 * كل عنصر (لون/شكل/حيوان/كلمة) مرتبط بمفتاح ثابت. الدروس والألعاب تقرأ الصورة
 * من هنا، فلا يحدث اختلاف بين صورة الدرس وصورة اللعبة.
 *
 * حالياً نستخدم رموزاً تعبيرية (emoji) كبدائل مؤقتة. الصور الفعلية تُدار من
 * `src/assets/assetRegistry.ts`: ضع ملفاً باسم المفتاح تحت `src/assets/images/...`
 * (مثل animals/cat.png) وسيستخدمه `mediaVisual` تلقائياً بدل الرمز التعبيري.
 * يمكن أيضاً ضبط `image` يدوياً هنا كتجاوز صريح إن رغبت.
 */

export type MediaKind = 'word' | 'color' | 'shape' | 'animal'

export interface MediaAsset {
  key: string
  kind: MediaKind
  /** emoji placeholder (used until a real image is provided) */
  emoji?: string
  /** real image URL/import — when set, it overrides the emoji everywhere */
  image?: string | null
  /** color value (for kind 'color') */
  hex?: string
}

const ANIMAL_EMOJI: Record<string, string> = {
  cat: '🐱', dog: '🐶', cow: '🐮', sheep: '🐑', horse: '🐴',
  chicken: '🐔', duck: '🦆', bird: '🐦', lion: '🦁', elephant: '🐘',
}
const WORD_EMOJI: Record<string, string> = {
  water: '💧', milk: '🥛', juice: '🧃', bathroom: '🚽', eat: '🍽️',
  play: '🧸', sleep: '🛏️', goOut: '🚪', chips: '🍟',
}

export const MEDIA: Record<string, MediaAsset> = {}
for (const k of COLOR_KEYS) MEDIA[k] = { key: k, kind: 'color', hex: getColorHex(k), image: null }
for (const k of SHAPE_KEYS) MEDIA[k] = { key: k, kind: 'shape', image: null }
for (const k of Object.keys(ANIMAL_EMOJI)) MEDIA[k] = { key: k, kind: 'animal', emoji: ANIMAL_EMOJI[k], image: null }
for (const k of Object.keys(WORD_EMOJI)) MEDIA[k] = { key: k, kind: 'word', emoji: WORD_EMOJI[k], image: null }

export const getMedia = (key: string): MediaAsset | undefined => MEDIA[key]
export const getMediaEmoji = (key: string): string => MEDIA[key]?.emoji ?? ''
export const getMediaImage = (key: string): string | null => MEDIA[key]?.image ?? null
export const getMediaHex = (key: string): string | undefined => MEDIA[key]?.hex
export const ANIMAL_KEYS = Object.keys(ANIMAL_EMOJI)
export const WORD_KEYS = Object.keys(WORD_EMOJI)
