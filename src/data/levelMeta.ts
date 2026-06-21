import type { ScreenName } from '@/types'

export interface LevelMeta {
  id: Extract<ScreenName, 'level2' | 'level3' | 'level4' | 'level5' | 'level6'>
  num: string
  title: string
  desc: string
  /** accent color + soft tint for the level's theme */
  accent: string
  soft: string
}

export const LEVELS: LevelMeta[] = [
  { id: 'level2', num: '٢', title: 'جمل قصيرة', desc: 'اسمع الجملة وتعلم استخدامها', accent: '#7B3FF2', soft: '#F3EEFF' },
  { id: 'level3', num: '٣', title: 'جمل جاهزة', desc: 'عبارات تساعدك في يومك', accent: '#2F9B5F', soft: '#ECF8F1' },
  { id: 'level4', num: '٤', title: 'المشاعر والاحتياجات', desc: 'عبّر عن شعورك أو حاجتك', accent: '#F15B78', soft: '#FCEAEF' },
  { id: 'level5', num: '٥', title: 'الألوان والأشكال', desc: 'تعرف على اللون أو الشكل', accent: '#1477DD', soft: '#EAF2FD' },
  { id: 'level6', num: '٦', title: 'العبارات اليومية', desc: 'عبارات نستخدمها كل يوم', accent: '#D99A1E', soft: '#FCF4DD' },
]

export const levelById = (id: string) => LEVELS.find((l) => l.id === id)
export const levelIndex = (id: string) => LEVELS.findIndex((l) => l.id === id)
