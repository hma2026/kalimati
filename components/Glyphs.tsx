/** A soft "splat"-like colored blob (approximates the mockup color cards). */
export function ColorBlob({ hex, size = 64 }: { hex: string; size?: number }) {
  return (
    <span
      aria-hidden
      style={{
        width: size,
        height: size,
        background: hex,
        display: 'inline-block',
        borderRadius: '42% 58% 60% 40% / 45% 47% 53% 55%',
        boxShadow: hex.toLowerCase() === '#ffffff' ? 'inset 0 0 0 2px var(--line)' : '0 4px 10px rgba(0,0,0,.12)',
      }}
    />
  )
}

/** Colored CSS shapes for the shapes tab. */
export function ShapeGlyph({ type, size = 56 }: { type: string; size?: number }) {
  const s = size
  const base: React.CSSProperties = { width: s, height: s, display: 'inline-block' }
  switch (type) {
    case 'circle':
      return <span aria-hidden style={{ ...base, background: '#22c55e', borderRadius: '50%' }} />
    case 'square':
      return <span aria-hidden style={{ ...base, background: '#3b82f6', borderRadius: 8 }} />
    case 'rectangle':
      return <span aria-hidden style={{ width: s * 1.3, height: s * 0.8, background: '#facc15', borderRadius: 8, display: 'inline-block' }} />
    case 'triangle':
      return (
        <span aria-hidden style={{ width: 0, height: 0, borderInlineStart: `${s / 2}px solid transparent`, borderInlineEnd: `${s / 2}px solid transparent`, borderBottom: `${s}px solid #ef4444`, display: 'inline-block' }} />
      )
    case 'star':
      return <span aria-hidden style={{ fontSize: s, color: '#7c3aed', lineHeight: 1 }}>★</span>
    case 'heart':
      return <span aria-hidden style={{ fontSize: s, color: '#ec4899', lineHeight: 1 }}>♥</span>
    case 'arrow':
      return <span aria-hidden style={{ fontSize: s, color: '#f97316', lineHeight: 1 }}>➜</span>
    case 'line':
      return <span aria-hidden style={{ width: s, height: 8, background: '#1f2937', borderRadius: 6, display: 'inline-block' }} />
    default:
      return <span aria-hidden style={{ ...base, background: '#ccc', borderRadius: 8 }} />
  }
}
