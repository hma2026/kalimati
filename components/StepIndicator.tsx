interface Props {
  steps: string[]
  /** 1-based index of the current step */
  current: number
  accent: string
}

export function StepIndicator({ steps, current, accent }: Props) {
  return (
    <div className="steps">
      {steps.map((label, i) => {
        const n = i + 1
        const done = n <= current
        return (
          <div className="step" key={i}>
            <span className="step__dot" style={done ? { background: accent, color: '#fff', borderColor: accent } : undefined}>
              {n}
            </span>
            <span className="step__label">{label}</span>
            {i < steps.length - 1 && <span className="step__line" style={n < current ? { background: accent } : undefined} />}
          </div>
        )
      })}
    </div>
  )
}
