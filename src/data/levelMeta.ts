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
  { id: 'level2', num: '٢', title: 'المستوى الثاني', desc: 'جمل من كلمتين (أبغى + كلمة)', accent: '#7C3AED', soft: '#EDE7FF' },
  { id: 'level3', num: '٣', title: 'المستوى الثالث', desc: 'جمل من ثلاث كلمات فأكثر', accent: '#1F9D57', soft: '#DCFCE7' },
  { id: 'level4', num: '٤', title: 'المستوى الرابع', desc: 'المشاعر والاحتياجات', accent: '#E8476B', soft: '#FDE2EA' },
  { id: 'level5', num: '٥', title: 'المستوى الخامس', desc: 'الألوان والأشكال', accent: '#2F6FED', soft: '#DBEAFE' },
  { id: 'level6', num: '٦', title: 'المستوى السادس', desc: 'عبارات يومية', accent: '#D69A06', soft: '#FEF3C7' },
]

export const levelById = (id: string) => LEVELS.find((l) => l.id === id)
export const levelIndex = (id: string) => LEVELS.findIndex((l) => l.id === id)
