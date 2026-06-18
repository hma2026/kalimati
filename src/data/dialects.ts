import type { ChildProfile, DialectId, Difficulty } from '@/types'

/**
 * نظام اللهجات المركزي
 * ----------------------------------------------------------------------------
 * الشاشات لا تكتب أي جملة عربية ثابتة. كل النصوص التعليمية تُبنى من هنا حسب
 * ملف الطفل (اللهجة + الجنس). تغيير لهجة الطفل يغيّر كل المستويات تلقائياً.
 */

export const DIALECTS: { id: DialectId; label: string }[] = [
  { id: 'hijazi', label: 'الحجازية / الغربية' },
  { id: 'najdi', label: 'النجدية / الوسطى' },
  { id: 'sharqi', label: 'الشرقية' },
  { id: 'fusha', label: 'العربية الفصحى' },
  { id: 'masri', label: 'المصرية' },
  { id: 'shami', label: 'الشامية' },
  { id: 'iraqi', label: 'العراقية' },
  { id: 'custom', label: 'لهجة مخصّصة' },
]

type DMap = Partial<Record<DialectId, string>> & { default: string }
const pick = (m: DMap, p: ChildProfile) => m[p.dialectId] ?? m.default

// ----- صيغة الطلب -----
export function getRequestWord(p: ChildProfile): string {
  switch (p.dialectId) {
    case 'hijazi': return 'أبغى'
    case 'najdi': return 'أبي'
    case 'sharqi': return 'أبي'
    case 'fusha': return 'أريد'
    case 'masri': return p.gender === 'girl' ? 'عايزة' : 'عايز'
    case 'shami': return 'بدي'
    case 'iraqi': return 'أريد'
    case 'custom': return (p.customRequestWord && p.customRequestWord.trim()) || 'أبغى'
  }
}

// ----- كلمات مفردة (مفاتيح ثابتة) -----
const WORDS: Record<string, DMap> = {
  water: { default: 'مويه', sharqi: 'ماي', fusha: 'ماء', masri: 'مية', shami: 'مي', iraqi: 'مي' },
  milk: { default: 'حليب' },
  juice: { default: 'عصير' },
  bathroom: { default: 'حمام' },
  eat: { default: 'أكل' },
  play: { default: 'ألعب' },
  sleep: { default: 'أنام' },
  goOut: { default: 'أطلع', fusha: 'أخرج' },
  chips: { default: 'شبس', masri: 'شيبسي', fusha: 'رقائق' },
}

export const getWordLabel = (key: string, p: ChildProfile): string =>
  WORDS[key] ? pick(WORDS[key], p) : key

export const buildRequestPhrase = (key: string, p: ChildProfile): string =>
  `${getRequestWord(p)} ${getWordLabel(key, p)}`

// ----- صفات/كلمات مساعدة للمستوى الثالث -----
const COLD: DMap = { default: 'بارد', fusha: 'باردًا', masri: 'ساقعة', shami: 'باردة' }
const NOW: DMap = { default: 'الحين', fusha: 'الآن', masri: 'دلوقتي', shami: 'هلق', iraqi: 'هسه' }
const GO: DMap = { default: 'أروح', fusha: 'أذهب', shami: 'روح' }
export const cold = (p: ChildProfile) => pick(COLD, p)
export const now = (p: ChildProfile) => pick(NOW, p)
export const go = (p: ChildProfile) => pick(GO, p)

// ----- المشاعر (تتغيّر حسب الجنس واللهجة) -----
const EMO: Record<string, { boy: string; girl: string; fboy?: string; fgirl?: string }> = {
  happy: { boy: 'أنا سعيد', girl: 'أنا سعيدة' },
  sad: { boy: 'أنا زعلان', girl: 'أنا زعلانة', fboy: 'أنا حزين', fgirl: 'أنا حزينة' },
  scared: { boy: 'أنا خايف', girl: 'أنا خايفة', fboy: 'أنا خائف', fgirl: 'أنا خائفة' },
  angry: { boy: 'أنا معصب', girl: 'أنا معصبة', fboy: 'أنا غاضب', fgirl: 'أنا غاضبة' },
  tired: { boy: 'أنا تعبان', girl: 'أنا تعبانة', fboy: 'أنا متعب', fgirl: 'أنا متعبة' },
  bored: { boy: 'أنا طفشان', girl: 'أنا طفشانة', fboy: 'أنا ضجِر', fgirl: 'أنا ضجِرة' },
}
export function buildEmotionPhrase(key: string, p: ChildProfile): string {
  const e = EMO[key]
  if (!e) return key
  if (p.dialectId === 'fusha') return p.gender === 'girl' ? (e.fgirl ?? e.girl) : (e.fboy ?? e.boy)
  return p.gender === 'girl' ? e.girl : e.boy
}

// ----- الألم -----
const PAIN_PART: Record<string, string> = {
  tummy: 'بطني', head: 'رأسي', teeth: 'أسناني', ear: 'أذني', hand: 'يدي', leg: 'رجلي',
}
const HURT: DMap = {
  default: 'يعورني', fusha: 'يؤلمني', masri: 'بتوجعني', shami: 'بيوجعني', iraqi: 'يوجعني',
}
export function buildPainPhrase(key: string, p: ChildProfile): string {
  const part = PAIN_PART[key]
  if (!part) return key
  return `${part} ${pick(HURT, p)}`
}

// ----- التهدئة (غالباً ثابتة) -----
const CALM: Record<string, DMap> = {
  loud: { default: 'الصوت عالي' },
  quiet: { default: 'مكان هادي' },
  notouch: { default: 'لا تلمسني' },
  mom: { default: 'ماما' },
  dad: { default: 'بابا' },
  help: { default: 'ساعدني' },
  stop: { default: 'أوقف', fusha: 'توقّف' },
  out: { default: 'أطلع', fusha: 'أخرج' },
}
export const buildCalmPhrase = (key: string, p: ChildProfile): string =>
  CALM[key] ? pick(CALM[key], p) : key

// ----- الألوان والأشكال -----
const COLORS: Record<string, { label: string; hex: string }> = {
  yellow: { label: 'أصفر', hex: '#FACC15' },
  red: { label: 'أحمر', hex: '#EF4444' },
  green: { label: 'أخضر', hex: '#22C55E' },
  blue: { label: 'أزرق', hex: '#3B82F6' },
  white: { label: 'أبيض', hex: '#FFFFFF' },
  black: { label: 'أسود', hex: '#1F2937' },
  brown: { label: 'بني', hex: '#92400E' },
  pink: { label: 'وردي', hex: '#EC4899' },
  orange: { label: 'برتقالي', hex: '#F97316' },
  purple: { label: 'بنفسجي', hex: '#7C3AED' },
}
export const COLOR_KEYS = Object.keys(COLORS)
export const getColorLabel = (k: string) => COLORS[k]?.label ?? k
export const getColorHex = (k: string) => COLORS[k]?.hex ?? '#cccccc'

const SHAPES: Record<string, string> = {
  circle: 'دائرة', square: 'مربع', triangle: 'مثلث', rectangle: 'مستطيل',
  star: 'نجمة', heart: 'قلب', arrow: 'سهم', line: 'خط',
}
export const SHAPE_KEYS = Object.keys(SHAPES)
export const getShapeLabel = (k: string) => SHAPES[k] ?? k

const FEMININE_SHAPES = new Set(['circle']) // دائرة مؤنثة
export type ColorSentenceKind = 'this_color' | 'this_shape' | 'want_color'
export function buildColorSentence(kind: ColorSentenceKind, ref: string, p: ChildProfile): string {
  if (kind === 'this_color') return `هذا ${getColorLabel(ref)}`
  if (kind === 'this_shape') return `${FEMININE_SHAPES.has(ref) ? 'هذه' : 'هذا'} ${getShapeLabel(ref)}`
  return `${getRequestWord(p)} اللون ${getColorLabel(ref)}`
}

// ----- العبارات اليومية (المستوى السادس) -----
export interface DailyPhrase {
  key: string
  cat: 'greet' | 'bye' | 'eat' | 'request' | 'reply'
  image: string
  difficulty: Difficulty
  religious?: boolean
  /** fixed text, or a builder for dialect-aware items (e.g. the request word) */
  text?: string
  build?: (p: ChildProfile) => string
}

export const DAILY_CATS: { id: DailyPhrase['cat']; label: string; icon: string }[] = [
  { id: 'greet', label: 'تحية', icon: '👋' },
  { id: 'bye', label: 'وداع', icon: '🖐️' },
  { id: 'eat', label: 'أكل', icon: '🍴' },
  { id: 'request', label: 'طلب', icon: '✋' },
  { id: 'reply', label: 'ردود', icon: '💬' },
]

export const DAILY: DailyPhrase[] = [
  { key: 'salam', cat: 'greet', text: 'سلام', image: '👋', difficulty: 'very_easy' },
  { key: 'ahlan', cat: 'greet', text: 'أهلًا', image: '🙋', difficulty: 'easy' },
  { key: 'hi', cat: 'greet', text: 'هاي', image: '✋', difficulty: 'very_easy' },
  { key: 'salam_alaykum', cat: 'greet', text: 'السلام عليكم', image: '🧎', difficulty: 'medium', religious: true },

  { key: 'bye', cat: 'bye', text: 'باي', image: '👋', difficulty: 'very_easy' },
  { key: 'byebye', cat: 'bye', text: 'باي باي', image: '🖐️', difficulty: 'easy' },
  { key: 'maa_salama', cat: 'bye', text: 'مع السلامة', image: '🤚', difficulty: 'easy' },

  { key: 'bismillah', cat: 'eat', text: 'بسم الله', image: '🤲', difficulty: 'easy', religious: true },
  { key: 'alhamdulillah', cat: 'eat', text: 'الحمد لله', image: '🙏', difficulty: 'easy', religious: true },
  { key: 'finished', cat: 'eat', text: 'خلصت', image: '🍽️', difficulty: 'very_easy' },
  { key: 'enough', cat: 'eat', text: 'كفاية', image: '✋', difficulty: 'very_easy' },
  { key: 'water', cat: 'eat', build: (p) => getWordLabel('water', p), image: '💧', difficulty: 'very_easy' },

  { key: 'request_word', cat: 'request', build: (p) => getRequestWord(p), image: '🙋', difficulty: 'very_easy' },
  { key: 'help', cat: 'request', text: 'ساعدني', image: '🆘', difficulty: 'easy' },
  { key: 'come', cat: 'request', text: 'تعال', image: '👈', difficulty: 'very_easy' },
  { key: 'open', cat: 'request', text: 'افتح', image: '🔓', difficulty: 'easy' },

  { key: 'yes', cat: 'reply', text: 'نعم', image: '✅', difficulty: 'very_easy' },
  { key: 'no', cat: 'reply', text: 'لا', image: '❌', difficulty: 'very_easy' },
  { key: 'thanks', cat: 'reply', text: 'شكرًا', image: '🙏', difficulty: 'very_easy' },
  { key: 'khalas', cat: 'reply', text: 'خلاص', image: '🛑', difficulty: 'easy' },
  { key: 'tayeb', cat: 'reply', text: 'طيب', image: '👌', difficulty: 'easy' },
  { key: 'lala', cat: 'reply', text: 'لا لا', image: '🙅', difficulty: 'very_easy' },
]

export const DIFF_RANK: Record<Difficulty, number> = { very_easy: 0, easy: 1, medium: 2 }
export const buildDailyPhrase = (d: DailyPhrase, p: ChildProfile): string =>
  d.build ? d.build(p) : (d.text ?? d.key)

// ----- الحيوانات (الاسم + صوت الحيوان) -----
const ANIMAL_NAMES: Record<string, DMap> = {
  cat: { default: 'قط' },
  dog: { default: 'كلب' },
  cow: { default: 'بقرة' },
  sheep: { default: 'خروف' },
  horse: { default: 'حصان' },
  chicken: { default: 'دجاجة' },
  duck: { default: 'بطة' },
  bird: { default: 'عصفور' },
  lion: { default: 'أسد' },
  elephant: { default: 'فيل' },
}
const ANIMAL_SOUNDS: Record<string, string> = {
  cat: 'مواء', dog: 'هو هو', cow: 'مو', sheep: 'مأ مأ', horse: 'هي هي',
  chicken: 'كاك كاك', duck: 'بط بط', bird: 'زقزقة', lion: 'زئير', elephant: 'بوق',
}
export const getAnimalLabel = (key: string, p: ChildProfile): string =>
  ANIMAL_NAMES[key] ? pick(ANIMAL_NAMES[key], p) : key
export const getAnimalSound = (key: string): string => ANIMAL_SOUNDS[key] ?? ''

/** Resolve a child record into the profile needed by the builders. */
export function profileOf(
  child: { gender?: ChildProfile['gender']; dialectId?: ChildProfile['dialectId'] } | null,
  fallbackDialect: DialectId,
): ChildProfile {
  return {
    dialectId: child?.dialectId ?? fallbackDialect,
    gender: child?.gender ?? 'boy',
  }
}
