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
  { id: 'level2', num: '٢', title: 'المستوى الثاني', desc: 'جمل من كلمتين (أبغى + كلمة)', accent: '#7B3FF2', soft: '#EFE9FF' },
  { id: 'level3', num: '٣', title: 'المستوى الثالث', desc: 'جمل من ثلاث كلمات فأكثر', accent: '#2F9B5F', soft: '#DEF7E9' },
  { id: 'level4', num: '٤', title: 'المستوى الرابع', desc: 'المشاعر والاحتياجات', accent: '#E84C68', soft: '#FDE3EA' },
  { id: 'level5', num: '٥', title: 'المستوى الخامس', desc: 'الألوان والأشكال', accent: '#2F78EA', soft: '#DDEBFF' },
  { id: 'level6', num: '٦', title: 'المستوى السادس', desc: 'عبارات يومية', accent: '#D99A1E', soft: '#FBF0D2' },
]

export const levelById = (id: string) => LEVELS.find((l) => l.id === id)
export const levelIndex = (id: string) => LEVELS.findIndex((l) => l.id === id)
