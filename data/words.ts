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

/* ===================================================================
   كلمات مفردة — مصفوفة بالفئات (مطابِقة للنموذج، 12 فئة).
   media = مفتاح أصل: حقيقي إن وُجد، وإلا بديل SVG مؤقت قابل للاستبدال من لوحة التحكم.
=================================================================== */
export interface WordGroup { id: string; label: string; tint: string; words: WordCard[] }
const w = (id: string, label: string, media: string, say?: string): WordCard => ({ id, label, image: '', media, ...(say ? { say } : {}) })

export const wordCategories: WordGroup[] = [
  { id: 'people', label: 'أشخاص', tint: '#8B5CF6', words: [
    w('wp_mom','ماما','mother'), w('wp_dad','بابا','father'), w('wp_brother','أخوي','brother'),
    w('wp_sister','أختي','sister'), w('wp_grandpa','جدّو','grandpa'), w('wp_grandma','جدّتي','grandma'),
  ]},
  { id: 'drinks', label: 'مشروبات', tint: '#3B82F6', words: [
    w('wd_water','مويه','water'), w('wd_milk','حليب','milk'), w('wd_juice','عصير','juice'), w('wd_laban','لبن','laban'),
  ]},
  { id: 'food', label: 'مأكولات', tint: '#F59E0B', words: [
    w('wf_meal','أكل','meal'), w('wf_bread','خبز','bread'), w('wf_rice','رز','rice'), w('wf_dates','تمر','dates'),
    w('wf_egg','بيض','egg'), w('wf_cheese','جبن','cheese'), w('wf_chicken','دجاج','chicken_food'), w('wf_cake','حلا','cake'),
  ]},
  { id: 'fruits', label: 'فواكه', tint: '#34C759', words: [
    w('wr_banana','موز','banana'), w('wr_apple','تفاح','apple'), w('wr_orange','برتقال','orange_fruit'),
    w('wr_grapes','عنب','grapes'), w('wr_melon','بطيخ','watermelon'),
  ]},
  { id: 'veg', label: 'خضار', tint: '#22C55E', words: [
    w('wv_tomato','طماطم','tomato'), w('wv_cucumber','خيار','cucumber'), w('wv_carrot','جزر','carrot'), w('wv_potato','بطاطس','potato'),
  ]},
  { id: 'places', label: 'أماكن', tint: '#0EA5A0', words: [
    w('wpl_home','بيت','house'), w('wpl_bath','حمام','bathroom_room'), w('wpl_mosque','مسجد','mosque'), w('wpl_school','مدرسة','school'),
    w('wpl_kitchen','مطبخ','kitchen'), w('wpl_room','غرفتي','bedroom'), w('wpl_garden','حديقة','garden'),
  ]},
  { id: 'clothes', label: 'ملابس', tint: '#EC4899', words: [
    w('wc_shirt','لبس','shirt'), w('wc_boots','جزمة','boots'), w('wc_sock','شراب','sock'), w('wc_cap','طاقية','cap'), w('wc_jacket','جاكيت','jacket'),
  ]},
  { id: 'daily', label: 'أشياء يومية', tint: '#A855F7', words: [
    w('wi_phone','جوال','phone'), w('wi_tv','تلفزيون','tv'), w('wi_car','سيارة','car'), w('wi_book','كتاب','book_obj'),
    w('wi_clock','ساعة','clock_obj'), w('wi_key','مفتاح','key'), w('wi_bag','شنطة','bag'),
  ]},
  { id: 'toys', label: 'ألعاب', tint: '#F97316', words: [
    w('wt_ball','كرة','ball'), w('wt_blocks','مكعبات','blocks'), w('wt_doll','دمية','doll'), w('wt_bike','دراجة','bike'), w('wt_puzzle','بازل','puzzle_toy'),
  ]},
  { id: 'body', label: 'أجزاء الجسم', tint: '#3B82F6', words: [
    w('wb_head','راس','head'), w('wb_eye','عين','eye'), w('wb_ear','أذن','ear'), w('wb_nose','أنف','nose'),
    w('wb_mouth','فم','mouth'), w('wb_hand','يد','hand'), w('wb_leg','رجل','leg'), w('wb_tummy','بطن','tummy'),
  ]},
  { id: 'hygiene', label: 'نظافة وحمام', tint: '#8B5CF6', words: [
    w('wh_brush','فرشاة','toothbrush'), w('wh_paste','معجون','toothpaste'), w('wh_soap','صابون','soap'),
    w('wh_shampoo','شامبو','shampoo'), w('wh_towel','منشفة','towel'), w('wh_tissue','مناديل','tissues'),
  ]},
]

/** كل كلمات شاشة "كلمات مفردة" مسطّحة (للوحة التحكم والبحث). */
export const allWordCards: WordCard[] = wordCategories.flatMap((g) => g.words)
