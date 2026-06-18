import { useCallback } from 'react'
import { useSettings } from '@/store/useSettingsStore'
import type { HapticLevel } from '@/types'

export type HapticKind = 'tap' | 'soft' | 'sentence' | 'success' | 'letter'

const PATTERNS: Record<HapticKind, number[]> = {
  tap: [12],
  soft: [6],
  sentence: [18, 40, 18],
  success: [22, 30, 22, 30, 45],
  letter: [14],
}

const LEVEL_SCALE: Record<HapticLevel, number> = { light: 0.6, medium: 1, strong: 1.6 }

/** الاهتزاز المدروس — intentional, settings-aware haptic feedback. */
export function useHaptics() {
  const enabled = useSettings((s) => s.hapticsEnabled)
  const level = useSettings((s) => s.hapticLevel)

  return useCallback(
    (kind: HapticKind) => {
      if (!enabled) return
      if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return
      const scale = LEVEL_SCALE[level]
      const pattern = PATTERNS[kind].map((ms) => Math.max(1, Math.round(ms * scale)))
      try { navigator.vibrate(pattern) } catch { /* unsupported */ }
    },
    [enabled, level],
  )
}
