import type { Child } from '@/types'

/**
 * Sample children for first run. Real profiles are created by the teacher/parent
 * and stored locally. Avatars use emoji placeholders. Dialect falls back to the
 * app default (settings.selectedDialect) when not set per-child.
 */
export const seedChildren: Child[] = [
  { id: 'c_ahmad', name: 'أحمد', avatar: '👦🏻', age: 5, gender: 'boy', createdAt: 0 },
  { id: 'c_sara', name: 'سارة', avatar: '👧🏻', age: 4, gender: 'girl', createdAt: 0 },
  { id: 'c_mohammed', name: 'محمد', avatar: '🧒🏻', age: 6, gender: 'boy', createdAt: 0 },
]

export const AVATAR_CHOICES = [
  '👦🏻', '👧🏻', '🧒🏻', '👦🏽', '👧🏽', '🧒🏽', '🐻', '🐰', '🦊', '🐼', '🦁', '🐧',
]
