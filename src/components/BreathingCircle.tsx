import { useEffect, useState } from 'react'

/** دائرة التنفّس — slow expand/contract to help the child self-regulate. */
export function BreathingCircle() {
  const [phase, setPhase] = useState('شهيق…')
  // Sync label with the 8s CSS animation (4s in / 4s out).
  useEffect(() => {
    const iv = window.setInterval(
      () => setPhase((p) => (p === 'شهيق…' ? 'زفير…' : 'شهيق…')),
      4000,
    )
    return () => window.clearInterval(iv)
  }, [])
  return (
    <div className="breath" aria-hidden>
      {phase}
    </div>
  )
}
