import type { ReactNode } from 'react'
import { VolumeIcon } from '@/lib/icons'
import { TileVisual } from './TileVisual'

/**
 * البطاقة التعليمية الموحّدة (Style 1):
 * بطاقة بيضاء مستديرة، صورة/أيقونة كبيرة في الأعلى، نص صغير أسفلها، زر صوت دائري واحد.
 * بلا تسجيل داخل البطاقة، بلا شارات تقييم، بلا نصوص وصفية طويلة.
 * تعرض صورة حقيقية إن توفّرت بالمفتاح، وإلا بديل SVG مؤقت.
 */
export function EducationalCard({
  label,
  visualKey,
  accent = 'var(--primary)',
  selected,
  onSpeak,
  onClick,
  visual,
  glyph,
}: {
  label: string
  visualKey?: string
  accent?: string
  selected?: boolean
  onSpeak?: () => void
  onClick?: () => void
  visual?: ReactNode
  glyph?: string
}) {
  return (
    <button
      className={'educard' + (selected ? ' is-sel' : '')}
      style={{ ['--accent' as string]: accent }}
      onClick={onClick}
    >
      <span className="educard__visual">
        {visual ?? <TileVisual refKey={visualKey ?? ''} accent={accent} size={96} glyph={glyph} />}
      </span>
      <span className="educard__label">{label}</span>
      {onSpeak && (
        <span
          className="educard__speak"
          role="button"
          tabIndex={0}
          aria-label="استمع"
          onClick={(e) => { e.stopPropagation(); onSpeak() }}
        >
          <VolumeIcon size={20} />
        </span>
      )}
    </button>
  )
}
