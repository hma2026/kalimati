import { useEffect, useMemo } from 'react'
import { useSettings } from '@/store/useSettingsStore'
import { useHaptics } from '@/hooks/useHaptics'
import { playSuccessChime } from '@/lib/sound'

interface Props {
  show: boolean
  text?: string
  onDone: () => void
}

const CONFETTI_COLORS = ['#facc15', '#7c3aed', '#22c55e', '#3b82f6', '#ec4899']

export function RewardOverlay({ show, text = 'أحسنت يا بطل!', onDone }: Props) {
  const rewardsEnabled = useSettings((s) => s.rewardsEnabled)
  const reduceMotion = useSettings((s) => s.reduceMotion)
  const soundEnabled = useSettings((s) => s.soundEnabled)
  const disableLoud = useSettings((s) => s.disableLoudSounds)
  const haptic = useHaptics()

  const pieces = useMemo(
    () =>
      Array.from({ length: 26 }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.25,
        dur: 1.1 + Math.random() * 0.9,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      })),
    [],
  )

  useEffect(() => {
    if (!show) return
    if (rewardsEnabled) {
      haptic('success')
      playSuccessChime({ enabled: soundEnabled && !disableLoud, gentle: disableLoud })
    }
    const ms = rewardsEnabled ? 1700 : 700
    const t = window.setTimeout(onDone, ms)
    return () => window.clearTimeout(t)
  }, [show]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!show || !rewardsEnabled) return null

  return (
    <>
      {!reduceMotion && (
        <div className="confetti" aria-hidden>
          {pieces.map((p, i) => (
            <i
              key={i}
              style={{
                left: `${p.left}%`,
                background: p.color,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.dur}s`,
              }}
            />
          ))}
        </div>
      )}
      <div className="reward" role="status" aria-live="polite" onClick={onDone}>
        <div className="reward__card">
          <div className="reward__star" aria-hidden>⭐</div>
          <div className="reward__text">{text}</div>
        </div>
      </div>
    </>
  )
}
