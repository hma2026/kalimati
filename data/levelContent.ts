import type { ChildProfile } from '@/types'
import * as D from './dialects'

/**
 * محتوى المستويات: مفاتيح + صور (رموز بديلة) + دالة بناء النص حسب اللهجة.
 * النص النهائي يأتي من دوال dialects.ts فقط.
 */

// ===== المستوى الثاني: أبغى + كلمة =====
export interface L2Item { key: string; image: string }
export const L2_ITEMS: L2Item[] = [
  { key: 'water', image: '💧' },
  { key: 'milk', image: '🥛' },
  { key: 'juice', image: '🧃' },
  { key: 'bathroom', image: '🚽' },
  { key: 'eat', image: '🍽️' },
  { key: 'play', image: '🧸' },
  { key: 'sleep', image: '🛏️' },
  { key: 'goOut', image: '🚪' },
  { key: 'chips', image: '🍟' },
]
export const buildL2 = (key: string, p: ChildProfile) => D.buildRequestPhrase(key, p)

// ===== المستوى الثالث: جمل أطول =====
// media = مفتاح الصورة في assetManifest (نعيد استخدام صور موجودة بدل صور جديدة)
export interface L3Item { key: string; media: string; build: (p: ChildProfile) => string }
export const L3_PHRASES: L3Item[] = [
  { key: 'water_cold', media: 'water', build: (p) => `${D.buildRequestPhrase('water', p)} ${D.cold(p)}` },
  { key: 'play_car', media: 'car', build: (p) => `${D.getRequestWord(p)} ${D.getWordLabel('play', p)} سيارة` },
  { key: 'go_bathroom', media: 'bathroom', build: (p) => `${D.getRequestWord(p)} ${D.go(p)} الحمام` },
  { key: 'tired', media: 'tired', build: (p) => D.buildEmotionPhrase('tired', p) },
  { key: 'tummy', media: 'stomachPain', build: (p) => D.buildPainPhrase('tummy', p) },
  { key: 'want_mom', media: 'mother', build: (p) => `${D.getRequestWord(p)} أمي` },
  { key: 'want_dad', media: 'father', build: (p) => `${D.getRequestWord(p)} بابا` },
  { key: 'sleep_now', media: 'sleep', build: (p) => `${D.buildRequestPhrase('sleep', p)} ${D.now(p)}` },
]

// ===== المستوى الرابع: مشاعر / ألم / تهدئة =====
// media = مفتاح الصورة في assetManifest. badge يبقى زخرفة صغيرة اختيارية.
export interface L4Card { key: string; media: string; badge?: string }
export const L4_FEELINGS: L4Card[] = [
  { key: 'happy', media: 'happy', badge: '😊' },
  { key: 'sad', media: 'sad', badge: '☹️' },
  { key: 'scared', media: 'scared', badge: '👻' },
  { key: 'angry', media: 'angry', badge: '😡' },
  { key: 'tired', media: 'tired', badge: '🔋' },
  { key: 'bored', media: 'bored', badge: '💭' },
]
export const L4_PAIN: L4Card[] = [
  { key: 'tummy', media: 'stomachPain' },
  { key: 'head', media: 'headPain' },
  { key: 'teeth', media: 'toothPain' },
  { key: 'ear', media: 'earPain' },
  { key: 'hand', media: 'handPain' },
  { key: 'leg', media: 'legPain' },
]
export const L4_CALM: L4Card[] = [
  { key: 'loud', media: 'loudSound' },
  { key: 'quiet', media: 'quietPlace' },
  { key: 'notouch', media: 'doNotTouch' },
  { key: 'mom', media: 'mother' },
  { key: 'dad', media: 'father' },
  { key: 'help', media: 'help' },
  { key: 'stop', media: 'stop' },
  { key: 'out', media: 'goOut' },
]

// ===== المستوى الخامس: ألوان / أشكال / تدريب الجملة =====
export const L5_COLORS = D.COLOR_KEYS.map((k) => ({ key: k, label: D.getColorLabel(k), hex: D.getColorHex(k) }))
export const L5_SHAPES = D.SHAPE_KEYS.map((k) => ({ key: k, label: D.getShapeLabel(k) }))

export interface L5Sentence { key: string; kind: D.ColorSentenceKind; ref: string }
export const L5_SENTENCES: L5Sentence[] = [
  { key: 'this_blue', kind: 'this_color', ref: 'blue' },
  { key: 'this_square', kind: 'this_shape', ref: 'square' },
  { key: 'want_blue', kind: 'want_color', ref: 'blue' },
  { key: 'this_red', kind: 'this_color', ref: 'red' },
  { key: 'this_circle', kind: 'this_shape', ref: 'circle' },
  { key: 'want_red', kind: 'want_color', ref: 'red' },
]
