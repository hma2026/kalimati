import type { Category } from '@/types'

/**
 * شبكة الرئيسية لواجهة الطفل — بلا كلمة «مستوى» وبلا عناصر إدارية (لا تقارير).
 * الأيقونات أصول حقيقية متى توفّرت، وإلا بديل SVG مؤقت عبر TileVisual.
 * الترتيب ثابت ومطابق للقرار المعتمد.
 */
export const categories: Category[] = [
  { id: 'words',    label: 'كلمات مفردة',        icon: 'food/bread',         screen: 'deck', deck: 'words', available: true, tint: '#6D4AE6' },
  { id: 'level2',   label: 'جمل قصيرة',          icon: 'ui/speaker',         screen: 'level2', available: true, tint: '#7B3FF2' },
  { id: 'level3',   label: 'جمل جاهزة',          icon: 'actions/help',       screen: 'level3', available: true, tint: '#2F9B5F' },
  { id: 'level4',   label: 'المشاعر والاحتياجات', icon: 'emotions/happy',     screen: 'level4', available: true, tint: '#E84C68', params: { tab: 'feelings' } },
  { id: 'level5',   label: 'الألوان والأشكال',    icon: 'shapes/star',        screen: 'level5', available: true, tint: '#1477DD' },
  { id: 'level6',   label: 'العبارات اليومية',    icon: 'daily/yes',          screen: 'level6', available: true, tint: '#D99A1E' },
  { id: 'letters',  label: 'الحروف',             icon: 'letters',            screen: 'letters', available: true, tint: '#0EA5A0' },
  { id: 'animals',  label: 'الحيوانات وأصواتها',  icon: 'animals/cat',        screen: 'animals', available: true, tint: '#C2410C' },
  { id: 'games',    label: 'الألعاب',            icon: 'rewards/star_burst', screen: 'games', available: true, tint: '#9333EA' },
  { id: 'calm',     label: 'الوضع الحسي',        icon: 'sensory/calm',       screen: 'calm', available: true, tint: '#0891B2' },
  { id: 'settings', label: 'المدرب / ولي الأمر',  icon: 'ui/settings',        screen: 'settings', available: true, tint: '#475569' },
]
