import type { WordCard, DeckId } from '@/types'

/**
 * NOTE ON IMAGES
 * The `image` field uses emoji as lightweight placeholders so the MVP runs
 * offline with zero assets. They are meant to be replaced by the "مكتبة الصور
 * الآمنة" (simple, single-meaning illustrations) or parent-uploaded photos —
 * just set `image` to an imported asset path or a data URL.
 */

// المرحلة 1: كلمات مفردة
export const words: WordCard[] = [
  { id: 'w_water', label: 'مويه', image: '💧' },
  { id: 'w_milk', label: 'حليب', image: '🥛' },
  { id: 'w_juice', label: 'عصير', image: '🧃' },
  { id: 'w_bread', label: 'عيش', image: '🍞' },
  { id: 'w_chips', label: 'شبس', image: '🍟' },
  { id: 'w_candy', label: 'حلاوة', image: '🍬' },
  { id: 'w_toilet', label: 'حمام', image: '🚽' },
  { id: 'w_out', label: 'أطلع', image: '🚪' },
  { id: 'w_sleep', label: 'أنام', image: '😴' },
  { id: 'w_eat', label: 'أكل', image: '🍽️' },
  { id: 'w_play', label: 'ألعب', image: '🧸' },
  { id: 'w_tired', label: 'تعبان', image: '😣' },
  { id: 'w_yes', label: 'نعم', image: '✅' },
  { id: 'w_no', label: 'لا', image: '❌' },
  { id: 'w_stop', label: 'وقف', image: '✋' },
  { id: 'w_help', label: 'ساعدني', image: '🆘' },
]

// المرحلة 4: المشاعر
export const emotions: WordCard[] = [
  { id: 'e_happy', label: 'سعيد', image: '😊' },
  { id: 'e_sad', label: 'زعلان', image: '😢' },
  { id: 'e_scared', label: 'خايف', image: '😨' },
  { id: 'e_angry', label: 'معصب', image: '😠' },
  { id: 'e_tired', label: 'تعبان', image: '😣' },
  { id: 'e_bored', label: 'طفشان', image: '😒' },
]

// المرحلة 4: الاحتياجات الجسدية والألم
export const needs: WordCard[] = [
  { id: 'n_tummy', label: 'بطني يعورني', image: '🤢', say: 'بطني يعورني' },
  { id: 'n_head', label: 'رأسي يعورني', image: '🤕', say: 'رأسي يعورني' },
  { id: 'n_sleep', label: 'أبغى أنام', image: '😴', say: 'أبغى أنام' },
  { id: 'n_eat', label: 'أبغى آكل', image: '🍽️', say: 'أبغى آكل' },
  { id: 'n_toilet', label: 'أبغى حمام', image: '🚽', say: 'أبغى حمام' },
  { id: 'n_rest', label: 'أبغى أرتاح', image: '🛋️', say: 'أبغى أرتاح' },
]

// المرحلة 5: الألوان (rendered as colored circles via `color`)
export const colors: WordCard[] = [
  { id: 'cl_yellow', label: 'أصفر', image: '🟡', color: '#facc15' },
  { id: 'cl_red', label: 'أحمر', image: '🔴', color: '#ef4444' },
  { id: 'cl_green', label: 'أخضر', image: '🟢', color: '#22c55e' },
  { id: 'cl_blue', label: 'أزرق', image: '🔵', color: '#3b82f6' },
  { id: 'cl_white', label: 'أبيض', image: '⚪', color: '#ffffff' },
  { id: 'cl_black', label: 'أسود', image: '⚫', color: '#1f2937' },
  { id: 'cl_brown', label: 'بني', image: '🟤', color: '#92400e' },
  { id: 'cl_pink', label: 'وردي', image: '🌸', color: '#ec4899' },
]

// المرحلة 5: الأشكال
export const shapes: WordCard[] = [
  { id: 'sh_circle', label: 'دائرة', image: '🔵' },
  { id: 'sh_square', label: 'مربع', image: '🟦' },
  { id: 'sh_triangle', label: 'مثلث', image: '🔺' },
  { id: 'sh_star', label: 'نجمة', image: '⭐' },
  { id: 'sh_heart', label: 'قلب', image: '❤️' },
]

/** "ألوان وأشكال" tile loads both decks together. */
export const colorsAndShapes: WordCard[] = [...colors, ...shapes]

/** Resolve a deck id to its card list. */
export function getDeck(deck: DeckId): WordCard[] {
  switch (deck) {
    case 'words': return words
    case 'emotions': return emotions
    case 'needs': return needs
    case 'colors': return colorsAndShapes
    case 'shapes': return shapes
    default: return words
  }
}

/** Fast lookup of any card by id (used by report + sentence builder). */
export const allCardsById: Record<string, WordCard> = [
  ...words, ...emotions, ...needs, ...colors, ...shapes,
].reduce((acc, c) => { acc[c.id] = c; return acc }, {} as Record<string, WordCard>)
