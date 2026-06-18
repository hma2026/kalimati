import type { WordCard } from '@/types'
import { words } from './words'

// المرحلة 2: جملة من كلمتين — "أبغى" + شيء
export const VERB = 'أبغى'

/** Items that read naturally after "أبغى". */
const REQUESTABLE = [
  'w_water', 'w_milk', 'w_juice', 'w_eat', 'w_play', 'w_sleep', 'w_toilet', 'w_out',
]

export const requestables: WordCard[] = REQUESTABLE
  .map((id) => words.find((w) => w.id === id))
  .filter((w): w is WordCard => Boolean(w))

/** Build the spoken sentence, e.g. "أبغى مويه". */
export function buildSentence(item: WordCard): string {
  return `${VERB} ${item.say ?? item.label}`
}
