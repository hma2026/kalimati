import type { ReactNode } from 'react'
import { VolumeIcon } from '@/lib/icons'

interface Props {
  label: string
  /** emoji string OR a node (color blob / shape glyph) */
  visual: ReactNode
  selected?: boolean
  accent?: string
  /** small emoji badge in the corner (e.g. emotion icon) */
  badge?: string
  onClick?: () => void
  onSpeak?: () => void
  big?: boolean
}

export function PictureCard({ label, visual, selected, accent, badge, onClick, onSpeak, big }: Props) {
  const isEmoji = typeof visual === 'string'
  return (
    <button
      className={`pcard${selected ? ' is-on' : ''}${big ? ' pcard--big' : ''}`}
      style={selected && accent ? { borderColor: accent, boxShadow: `0 0 0 3px ${accent}33` } : undefined}
      onClick={onClick}
      aria-pressed={selected}
    >
      {badge && <span className="pcard__badge" aria-hidden>{badge}</span>}
      <span className="pcard__visual" aria-hidden>
        {isEmoji ? <span className="pcard__emoji">{visual}</span> : visual}
      </span>
      <span className="pcard__label">{label}</span>
      {onSpeak && (
        <span
          className="pcard__speak"
          role="button"
          tabIndex={0}
          aria-label="استمع"
          onClick={(e) => { e.stopPropagation(); onSpeak() }}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); onSpeak() } }}
        >
          <VolumeIcon size={18} />
        </span>
      )}
    </button>
  )
}
