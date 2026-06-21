import type { CSSProperties } from 'react'

/**
 * Temporary SVG placeholder — replace with final image asset later.
 * دائرة/مربع pastel + رمز SVG بلون التمييز. لا emoji، لا مربع رمادي، لا صورة مكسورة.
 * قابل للاستبدال لاحقاً بصورة SVG/PNG نهائية دون تغيير منطق الشاشة.
 */
export function PlaceholderVisual({
  size = 56,
  accent = '#7c3aed',
  glyph,
  round = '50%',
}: {
  size?: number
  accent?: string
  glyph?: string
  round?: number | string
}) {
  const wrap: CSSProperties = {
    width: size,
    height: size,
    borderRadius: round,
    display: 'grid',
    placeItems: 'center',
    flex: '0 0 auto',
    background: `color-mix(in srgb, ${accent} 16%, #ffffff)`,
    boxShadow: `inset 0 0 0 2px color-mix(in srgb, ${accent} 32%, #ffffff)`,
  }
  const inner = Math.round(size * 0.5)
  return (
    <span aria-hidden style={wrap}>
      {glyph ? (
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: Math.round(size * 0.46),
            color: accent,
            lineHeight: 1,
          }}
        >
          {glyph}
        </span>
      ) : (
        <svg
          width={inner}
          height={inner}
          viewBox="0 0 24 24"
          fill="none"
          stroke={accent}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4.5" width="18" height="15" rx="3" />
          <circle cx="8.5" cy="10" r="1.7" fill={accent} stroke="none" />
          <path d="M4 17l4.5-4.5 3 3L16 11l4 5" />
        </svg>
      )}
    </span>
  )
}
