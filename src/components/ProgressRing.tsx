interface Props {
  percent: number
  size?: number
}

/** Circular progress indicator (نسبة التقدم). */
export function ProgressRing({ percent, size = 150 }: Props) {
  const stroke = 14
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const clamped = Math.max(0, Math.min(100, percent))
  const offset = c - (clamped / 100) * c

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={`نسبة التقدم ${clamped}%`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--primary-100)" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--primary)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset .6s ease' }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-display)"
        fontWeight="900"
        fontSize={size * 0.24}
        fill="var(--primary-600)"
      >
        {clamped}%
      </text>
    </svg>
  )
}
