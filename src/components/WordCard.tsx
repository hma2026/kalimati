import type { WordCard as Card } from '@/types'
import { mediaVisual } from '@/components/Media'

interface Props {
  card: Card
  selected?: boolean
  mastered?: boolean
  onClick?: () => void
}

const isUrl = (s: string) => /^(https?:|data:|\/|blob:)/.test(s)

export function WordCard({ card, selected, mastered, onClick }: Props) {
  return (
    <button
      className={`wcard${selected ? ' wcard--selected' : ''}${mastered ? ' wcard--mastered' : ''}`}
      onClick={onClick}
      aria-pressed={selected}
      aria-label={card.label}
    >
      <span className="wcard__media" style={card.color ? { background: 'var(--surface-2)' } : undefined}>
        {card.color ? (
          <span
            style={{
              width: '62%', aspectRatio: '1', borderRadius: '50%',
              background: card.color,
              boxShadow: card.color === '#ffffff' ? 'inset 0 0 0 2px var(--line)' : 'none',
            }}
          />
        ) : card.media ? (
          mediaVisual(card.media, 72)
        ) : isUrl(card.image) ? (
          <img src={card.image} alt="" />
        ) : null}
      </span>
      <span className="wcard__label">{card.label}</span>
      {selected && (
        <span className="wcard__check" aria-hidden>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
        </span>
      )}
    </button>
  )
}
