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
  { id: 'w_water', label: 'مويه', image: '', media: 'water' },
  { id: 'w_milk', label: 'حليب', image: '', media: 'milk' },
  { id: 'w_juice', label: 'عصير', image: '', media: 'juice' },
  { id: 'w_bread', label: 'عيش', image: '', media: 'bread' },
  { id: 'w_chips', label: 'شبس', image: '', media: 'chips' },
  { id: 'w_candy', label: 'حلاوة', image: '', media: 'candy' },
  { id: 'w_toilet', label: 'حمام', image: '', media: 'bathroom' },
  { id: 'w_out', label: 'أطلع', image: '', media: 'goOut' },
  { id: 'w_sleep', label: 'أنام', image: '', media: 'sleep' },
  { id: 'w_eat', label: 'أكل', image: '', media: 'eat' },
  { id: 'w_play', label: 'ألعب', image: '', media: 'play' },
  { id: 'w_tired', label: 'تعبان', image: '', media: 'tired' },
  { id: 'w_yes', label: 'نعم', image: '', media: 'yes' },
  { id: 'w_no', label: 'لا', image: '', media: 'no' },
  { id: 'w_stop', label: 'وقف', image: '', media: 'stop' },
  { id: 'w_help', label: 'ساعدني', image: '', media: 'help' },
]

// المرحلة 4: المشاعر
export const emotions: WordCard[] = [
  { id: 'e_happy', label: 'سعيد', image: '', media: 'happy' },
  { id: 'e_sad', label: 'زعلان', image: '', media: 'sad' },
  { id: 'e_scared', label: 'خايف', image: '', media: 'scared' },
  { id: 'e_angry', label: 'معصب', image: '', media: 'angry' },
  { id: 'e_tired', label: 'تعبان', image: '', media: 'tired' },
  { id: 'e_bored', label: 'طفشان', image: '', media: 'bored' },
]

// المرحلة 4: الاحتياجات الجسدية والألم
export const needs: WordCard[] = [
  { id: 'n_tummy', label: 'بطني يعورني', image: '', say: 'بطني يعورني', media: 'stomachPain' },
  { id: 'n_head', label: 'رأسي يعورني', image: '', say: 'رأسي يعورني', media: 'headPain' },
  { id: 'n_sleep', label: 'أبغى أنام', image: '', say: 'أبغى أنام', media: 'sleep' },
  { id: 'n_eat', label: 'أبغى آكل', image: '', say: 'أبغى آكل', media: 'eat' },
  { id: 'n_toilet', label: 'أبغى حمام', image: '', say: 'أبغى حمام', media: 'bathroom' },
  { id: 'n_rest', label: 'أبغى أرتاح', image: '', say: 'أبغى أرتاح', media: 'rest' },
]

// المرحلة 5: الألوان (rendered as colored circles via `color`)
export const colors: WordCard[] = [
  { id: 'cl_yellow', label: 'أصفر', image: '', color: '#facc15' },
  { id: 'cl_red', label: 'أحمر', image: '', color: '#ef4444' },
  { id: 'cl_green', label: 'أخضر', image: '', color: '#22c55e' },
  { id: 'cl_blue', label: 'أزرق', image: '', color: '#3b82f6' },
  { id: 'cl_white', label: 'أبيض', image: '', color: '#ffffff' },
  { id: 'cl_black', label: 'أسود', image: '', color: '#1f2937' },
  { id: 'cl_brown', label: 'بني', image: '', color: '#92400e' },
  { id: 'cl_pink', label: 'وردي', image: '', color: '#ec4899' },
]

// المرحلة 5: الأشكال
export const shapes: WordCard[] = [
  { id: 'sh_circle', label: 'دائرة', image: '', media: 'circle' },
  { id: 'sh_square', label: 'مربع', image: '', media: 'square' },
  { id: 'sh_triangle', label: 'مثلث', image: '', media: 'triangle' },
  { id: 'sh_star', label: 'نجمة', image: '', media: 'star' },
  { id: 'sh_heart', label: 'قلب', image: '', media: 'heart' },
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
