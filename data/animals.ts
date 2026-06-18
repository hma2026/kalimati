import type { Difficulty } from '@/types'

export interface AnimalItem {
  key: string
  difficulty: Difficulty
}

/**
 * قائمة الحيوانات (مفاتيح + صعوبة). الصورة تأتي من طبقة الوسائط الموحّدة
 * (media.ts) عبر المفتاح، والاسم من dialects.getAnimalLabel، وصوت الحيوان من
 * dialects.getAnimalSound — فلا تكرار ولا اختلاف بين الدرس واللعبة.
 */
export const ANIMALS: AnimalItem[] = [
  { key: 'cat', difficulty: 'very_easy' },
  { key: 'dog', difficulty: 'very_easy' },
  { key: 'cow', difficulty: 'very_easy' },
  { key: 'sheep', difficulty: 'easy' },
  { key: 'horse', difficulty: 'easy' },
  { key: 'chicken', difficulty: 'easy' },
  { key: 'duck', difficulty: 'easy' },
  { key: 'bird', difficulty: 'easy' },
  { key: 'lion', difficulty: 'medium' },
  { key: 'elephant', difficulty: 'medium' },
]
