import type { Child } from '@/types'

/**
 * Sample children for first run. Real profiles are created by the teacher/parent
 * and stored locally. Avatars are rich circular portraits resolved by assetByRef
 * (PNG wins over SVG). Dialect falls back to the app default when not set per-child.
 */
export const seedChildren: Child[] = [
  { id: 'c_ahmad', name: 'أحمد', avatar: 'avatars/child_ahmad', age: 5, gender: 'boy', createdAt: 0 },
  { id: 'c_sara', name: 'سارة', avatar: 'avatars/child_sara', age: 4, gender: 'girl', createdAt: 0 },
  { id: 'c_mohammed', name: 'محمد', avatar: 'avatars/child_mohammed', age: 6, gender: 'boy', createdAt: 0 },
  { id: 'c_layan', name: 'ليان', avatar: 'avatars/child_layan', age: 5, gender: 'girl', createdAt: 0 },
]

export const AVATAR_CHOICES = [
  'avatars/child_ahmad',
  'avatars/child_sara',
  'avatars/child_mohammed',
  'avatars/child_layan',
  'avatars/child_boy_01',
  'avatars/child_girl_01',
]
