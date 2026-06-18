import type { Category } from '@/types'

/**
 * Home grid (matches the reference composite): word deck, sentences, letters,
 * the five numbered level tiles, animals, games, calm, plus report & settings.
 * Levels 3 & 6 are also reachable via التالي/السابق inside the level screens.
 */
export const categories: Category[] = [
  { id: 'words', label: 'كلمات مفردة', icon: 'food/bread', screen: 'deck', deck: 'words', available: true },
  { id: 'sentence', label: 'جمل', icon: 'ui/speaker', screen: 'level2', available: true },
  { id: 'letters', label: 'حروف', icon: 'ش', screen: 'letters', available: true },
  { id: 'level2', label: 'المستوى الثاني', icon: '٢', screen: 'level2', available: true, tint: '#7B3FF2', params: { desc: 'جمل من كلمتين' } },
  { id: 'level3', label: 'المستوى الثالث', icon: '٣', screen: 'level3', available: true, tint: '#2F9B5F', params: { desc: 'جمل أطول' } },
  { id: 'level4', label: 'المستوى الرابع', icon: '٤', screen: 'level4', available: true, tint: '#E84C68', params: { desc: 'مشاعر واحتياجات', tab: 'feelings' } },
  { id: 'level5', label: 'المستوى الخامس', icon: '٥', screen: 'level5', available: true, tint: '#2F78EA', params: { desc: 'ألوان وأشكال' } },
  { id: 'level6', label: 'المستوى السادس', icon: '٦', screen: 'level6', available: true, tint: '#D99A1E', params: { desc: 'عبارات يومية' } },
  { id: 'animals', label: 'حيوانات وأصوات', icon: 'animals/cat', screen: 'animals', available: true },
  { id: 'games', label: 'ألعاب تعليمية', icon: 'rewards/star_burst', screen: 'games', available: true },
  { id: 'calm', label: 'التهدئة', icon: 'sensory/calm', screen: 'calm', available: true },
  { id: 'report', label: 'تقرير التقدّم', icon: 'ui/report', screen: 'report', available: true },
  { id: 'settings', label: 'الإعدادات', icon: 'ui/settings', screen: 'settings', available: true },
]
