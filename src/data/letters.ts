import type { Letter } from '@/types'

/**
 * الحروف الهجائية كاملة (أ → ي) لشاشة الحروف (Scroll طويل، بلا pagination).
 * كل حرف: الاسم المنطوق (say) + كلمة مثال. media = مفتاح أصل حقيقي إن وُجد، وإلا '' ⇒ بديل SVG مؤقت.
 * Temporary visuals: words without a real asset fall back to an SVG placeholder (no emoji).
 */
const mk = (
  id: string, glyph: string, say: string, word: string, media = '',
): Letter => ({
  id,
  glyph,
  sound: say,
  say,
  examples: [{ id: `${id}_ex`, label: word, image: '', media }],
})

export const letters: Letter[] = [
  mk('l_alif', 'أ', 'أَلِف', 'أسد', 'lion'),
  mk('l_baa', 'ب', 'بَاء', 'بطة', 'duck'),
  mk('l_taa', 'ت', 'تَاء', 'تفاح', 'apple'),
  mk('l_thaa', 'ث', 'ثَاء', 'ثعلب', 'fox'),
  mk('l_jeem', 'ج', 'جِيم', 'جزر', 'carrot'),
  mk('l_haa1', 'ح', 'حَاء', 'حصان', 'horse'),
  mk('l_khaa', 'خ', 'خَاء', 'خروف', 'sheep'),
  mk('l_dal', 'د', 'دَال', 'دجاجة', 'chicken'),
  mk('l_thal', 'ذ', 'ذَال', 'ذئب', 'wolf'),
  mk('l_raa', 'ر', 'رَاء', 'رمان', 'pomegranate'),
  mk('l_zay', 'ز', 'زَاي', 'زرافة', 'giraffe'),
  mk('l_seen', 'س', 'سِين', 'سمكة', 'fish'),
  mk('l_sheen', 'ش', 'شِين', 'شبس', 'chips'),
  mk('l_sad', 'ص', 'صَاد', 'صقر', 'falcon'),
  mk('l_dad', 'ض', 'ضَاد', 'ضفدع', 'frog'),
  mk('l_taa2', 'ط', 'طَاء', 'طائر', 'bird'),
  mk('l_zaa', 'ظ', 'ظَاء', 'ظبي', 'deer'),
  mk('l_ayn', 'ع', 'عَيْن', 'عصير', 'juice'),
  mk('l_ghayn', 'غ', 'غَيْن', 'غيمة', 'cloud'),
  mk('l_faa', 'ف', 'فَاء', 'فيل', 'elephant'),
  mk('l_qaf', 'ق', 'قَاف', 'قطة', 'cat'),
  mk('l_kaf', 'ك', 'كَاف', 'كلب', 'dog'),
  mk('l_lam', 'ل', 'لَام', 'لبن', 'milk'),
  mk('l_meem', 'م', 'مِيم', 'ماء', 'water'),
  mk('l_noon', 'ن', 'نُون', 'نجمة', 'star'),
  mk('l_haa2', 'هـ', 'هَاء', 'هدية', 'gift'),
  mk('l_waw', 'و', 'وَاو', 'وردة', 'rose'),
  mk('l_yaa', 'ي', 'يَاء', 'يد', 'hand'),
]

export const defaultLetter = letters[0]
