import type { Category } from '@/types'

/**
 * شبكة الرئيسية (مطابِقة للنموذج): 12 بطاقة بأيقونات مقصوصة من التصميم.
 * الترتيب يسار→يمين كما في النموذج (الشبكة LTR). tint = لون تمييز خفيف لخلفية البطاقة.
 */
export const categories: Category[] = [
  { id: 'words',    label: 'كلمات مفردة',         icon: 'home/icon_words',    screen: 'deck', deck: 'words', available: true, tint: '#34C759' },
  { id: 'level2',   label: 'جمل قصيرة',           icon: 'home/icon_short',    screen: 'level2', available: true, tint: '#3B82F6' },
  { id: 'level3',   label: 'جمل جاهزة',           icon: 'home/icon_ready',    screen: 'level3', available: true, tint: '#A855F7' },
  { id: 'level4',   label: 'المشاعر والاحتياجات', icon: 'home/icon_emotions', screen: 'level4', available: true, tint: '#EC4899', params: { tab: 'feelings' } },
  { id: 'level5',   label: 'الألوان والأشكال',     icon: 'home/icon_shapes',   screen: 'level5', available: true, tint: '#F59E0B' },
  { id: 'level6',   label: 'العبارات اليومية',     icon: 'home/icon_daily',    screen: 'level6', available: true, tint: '#FB923C' },
  { id: 'letters',  label: 'الحروف',              icon: 'home/icon_letters',  screen: 'letters', available: true, tint: '#7C3AED' },
  { id: 'animals',  label: 'حيوانات وأصوات',      icon: 'home/icon_animals',  screen: 'animals', available: true, tint: '#0EA5A0' },
  { id: 'games',    label: 'ألعاب تعليمية',       icon: 'home/icon_games',    screen: 'games', available: true, tint: '#EF4444' },
  { id: 'stories',  label: 'قصص',                 icon: 'home/icon_stories',  screen: 'stories', available: true, tint: '#6366F1' },
  { id: 'report',   label: 'تقرير التقدم',        icon: 'home/icon_progress', screen: 'report', available: true, tint: '#22C55E' },
  { id: 'settings', label: 'الإعدادات',           icon: 'home/icon_settings', screen: 'settings', available: true, tint: '#8B5CF6' },
]
