import type { ReactNode } from 'react'
import { StarIcon, StarOutlineIcon } from '@/lib/icons'

interface Props {
  text: string
  visual: ReactNode
  selected?: boolean
  favorite?: boolean
  accent?: string
  onClick?: () => void
  onToggleFav?: () => void
}

export function PhraseCard({ text, visual, selected, favorite, accent, onClick, onToggleFav }: Props) {
  return (
    <button
      className={`phrase-card${selected ? ' is-on' : ''}`}
      style={selected && accent ? { borderColor: accent, boxShadow: `0 0 0 3px ${accent}33` } : undefined}
      onClick={onClick}
      aria-pressed={selected}
    >
      <span
        className="phrase-card__fav"
        role="button"
        tabIndex={0}
        aria-label={favorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
        onClick={(e) => { e.stopPropagation(); onToggleFav?.() }}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); onToggleFav?.() } }}
      >
        {favorite ? <StarIcon size={20} style={{ color: 'var(--star)' }} /> : <StarOutlineIcon size={20} />}
      </span>
      <span className="phrase-card__text">{text}</span>
      <span className="phrase-card__img" aria-hidden>{visual}</span>
    </button>
  )
}
