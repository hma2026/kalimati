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
      return <svg aria-hidden width={s} height={s} viewBox="0 0 24 24" fill="#7c3aed"><path d="M12 2l2.9 6.2 6.8.8-5 4.6 1.3 6.7L12 18.9 5.7 21l1.3-6.7-5-4.6 6.8-.8z"/></svg>
    case 'heart':
      return <svg aria-hidden width={s} height={s} viewBox="0 0 24 24" fill="#ec4899"><path d="M12 21s-7-4.6-9.3-9C1.3 9 2.6 5.5 6 5.5c2 0 3.2 1.3 4 2.6.8-1.3 2-2.6 4-2.6 3.4 0 4.7 3.5 3.3 6.5C19 16.4 12 21 12 21z"/></svg>
    case 'arrow':
      return <svg aria-hidden width={s} height={s} viewBox="0 0 24 24" fill="#f97316"><path d="M4 10h9V6l7 6-7 6v-4H4z"/></svg>
    case 'line':
      return <span aria-hidden style={{ width: s, height: 8, background: '#1f2937', borderRadius: 6, display: 'inline-block' }} />
    default:
      return <span aria-hidden style={{ ...base, background: '#ccc', borderRadius: 8 }} />
  }
}
