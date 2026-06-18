import type { Letter } from '@/types'

// المرحلة 6: تدريب الحروف ومخارج الأصوات — نبدأ بحرف الشين
export const letters: Letter[] = [
  {
    id: 'l_sheen',
    glyph: 'ش',
    sound: 'ششش',
    say: 'شِين',
    examples: [
      { id: 'lx_sun', label: 'شمس', image: '☀️' },
      { id: 'lx_tea', label: 'شاي', image: '🍵' },
      { id: 'lx_chips', label: 'شبس', image: '🍟' },
      { id: 'lx_candle', label: 'شمعة', image: '🕯️' },
    ],
  },
  // قابل للتوسع: س، ص، ر، ل، ك، ق، ج ...
]

export const defaultLetter = letters[0]
