import { COLOR_KEYS, SHAPE_KEYS, getColorHex } from './dialects'

/**
 * طبقة الوسائط الموحّدة (مصدر واحد للعرض).
 * ----------------------------------------------------------------------------
 * كل عنصر مرتبط بمفتاح ثابت. الصورة الفعلية (إن وُجدت) تُدار من assetManifest.ts
 * و assetRegistry.ts. وحتى تتوفّر الصور المرسومة، نعرض رمزاً تعبيرياً ملوّناً
 * كبيراً (ليس placeholder رمادياً) عبر mediaVisual، فيبقى المظهر كرتونياً ومعبّراً.
 * النص يأتي دائماً من dialects.ts حسب اللهجة (لا يُطبع داخل الصورة).
 */

export type MediaKind = 'word' | 'color' | 'shape' | 'animal'

export interface MediaAsset {
  key: string
  kind: MediaKind
  emoji?: string
  image?: string | null
  hex?: string
}

const ANIMAL_EMOJI: Record<string, string> = {
  cat: '🐱', dog: '🐶', cow: '🐮', sheep: '🐑', horse: '🐴',
  chicken: '🐔', duck: '🦆', bird: '🐦', lion: '🦁', elephant: '🐘',
}

// رموز تعبيرية ملوّنة لكل المفاتيح غير اللون/الشكل (بديل معبّر حتى تُضاف الصور).
const ITEM_EMOJI: Record<string, string> = {
  // مشروبات/أكل
  water: '💧', milk: '🥛', juice: '🧃', bread: '🍞', chips: '🍟', candy: '🍬', eat: '🍽️',
  // أفعال/احتياجات
  bathroom: '🚽', sleep: '🛏️', goOut: '🚪', play: '🧸', help: '🆘', come: '👈', open: '🔓',
  car: '🚗', cold: '❄️', stop: '✋', loudSound: '🔊', quietPlace: '🤫', doNotTouch: '🙅',
  // أشخاص
  mother: '👩', father: '👨',
  // مشاعر
  happy: '😊', sad: '😢', scared: '😨', angry: '😡', tired: '😴', bored: '😑',
  // ألم
  stomachPain: '🤢', headPain: '🤕', toothPain: '🦷', earPain: '👂', handPain: '✋', legPain: '🦵',
  // عبارات يومية
  salam: '👋', ahlan: '🙋', hi: '✋', salam_alaykum: '🤲', bye: '👋', byebye: '🖐️',
  maa_salama: '🤚', bismillah: '🤲', alhamdulillah: '🙏', finished: '✅', enough: '✋',
  request_word: '🙋', yes: '✅', no: '❌', thanks: '🙏', khalas: '🛑', tayeb: '👌', lala: '🙅',
}

export const MEDIA: Record<string, MediaAsset> = {}
for (const k of COLOR_KEYS) MEDIA[k] = { key: k, kind: 'color', hex: getColorHex(k), image: null }
for (const k of SHAPE_KEYS) MEDIA[k] = { key: k, kind: 'shape', image: null }
for (const k of Object.keys(ANIMAL_EMOJI)) MEDIA[k] = { key: k, kind: 'animal', emoji: ANIMAL_EMOJI[k], image: null }
for (const k of Object.keys(ITEM_EMOJI)) {
  if (!MEDIA[k]) MEDIA[k] = { key: k, kind: 'word', emoji: ITEM_EMOJI[k], image: null }
}

export const getMedia = (key: string): MediaAsset | undefined => MEDIA[key]
export const getMediaEmoji = (key: string): string => MEDIA[key]?.emoji ?? ''
export const getMediaImage = (key: string): string | null => MEDIA[key]?.image ?? null
export const getMediaHex = (key: string): string | undefined => MEDIA[key]?.hex
export const ANIMAL_KEYS = Object.keys(ANIMAL_EMOJI)
