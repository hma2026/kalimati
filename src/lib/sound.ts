// A soft two-note chime for success. Deliberately gentle (no startling sounds).
// Gated by settings: only plays when sound is enabled and loud sounds aren't disabled.

let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AC) return null
  if (!ctx) ctx = new AC()
  return ctx
}

function tone(c: AudioContext, freq: number, start: number, dur: number, peak: number) {
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = 'sine'
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(peak, start + 0.04)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + dur)
  osc.connect(gain).connect(c.destination)
  osc.start(start)
  osc.stop(start + dur + 0.05)
}

/** Pleasant rising two-note chime. `gentle` lowers the volume further. */
export function playSuccessChime(opts: { enabled: boolean; gentle?: boolean }) {
  if (!opts.enabled) return
  const c = getCtx()
  if (!c) return
  if (c.state === 'suspended') void c.resume()
  const peak = opts.gentle ? 0.06 : 0.12
  const t = c.currentTime
  tone(c, 659.25, t, 0.18, peak) // E5
  tone(c, 987.77, t + 0.12, 0.28, peak) // B5
}

/** Soft single tap blip (used sparingly). */
export function playTapBlip(enabled: boolean) {
  if (!enabled) return
  const c = getCtx()
  if (!c) return
  if (c.state === 'suspended') void c.resume()
  tone(c, 523.25, c.currentTime, 0.07, 0.05)
}
