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
  { id: 'level2', num: '٢', title: 'المستوى الثاني', desc: 'جمل من كلمتين (أبغى + كلمة)', accent: '#7B3FF2', soft: '#F3EEFF' },
  { id: 'level3', num: '٣', title: 'المستوى الثالث', desc: 'جمل من ثلاث كلمات فأكثر', accent: '#2F9B5F', soft: '#ECF8F1' },
  { id: 'level4', num: '٤', title: 'المستوى الرابع', desc: 'المشاعر والاحتياجات', accent: '#F15B78', soft: '#FCEAEF' },
  { id: 'level5', num: '٥', title: 'المستوى الخامس', desc: 'الألوان والأشكال', accent: '#1477DD', soft: '#EAF2FD' },
  { id: 'level6', num: '٦', title: 'المستوى السادس', desc: 'عبارات يومية', accent: '#D99A1E', soft: '#FCF4DD' },
]

export const levelById = (id: string) => LEVELS.find((l) => l.id === id)
export const levelIndex = (id: string) => LEVELS.findIndex((l) => l.id === id)
