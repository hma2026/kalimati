import { useCallback, useEffect, useRef, useState } from 'react'
import { useSettings } from '@/store/useSettingsStore'

const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

/** نطق الكلمات بالعربية. Defaults to a clear, slightly slow rate for kids. */
export function useSpeech() {
  const speechEnabled = useSettings((s) => s.speechEnabled)
  const [speaking, setSpeaking] = useState(false)
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)

  useEffect(() => {
    if (!supported) return
    const pick = () => {
      const voices = window.speechSynthesis.getVoices()
      voiceRef.current =
        voices.find((v) => v.lang?.toLowerCase().startsWith('ar')) ??
        voices.find((v) => /arabic/i.test(v.name)) ??
        null
    }
    pick()
    window.speechSynthesis.addEventListener('voiceschanged', pick)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', pick)
  }, [])

  const cancel = useCallback(() => {
    if (!supported) return
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [])

  const speak = useCallback(
    (text: string) => {
      if (!supported || !speechEnabled || !text) return
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      u.lang = 'ar-SA'
      if (voiceRef.current) u.voice = voiceRef.current
      u.rate = 0.92
      u.pitch = 1.05
      u.onstart = () => setSpeaking(true)
      u.onend = () => setSpeaking(false)
      u.onerror = () => setSpeaking(false)
      window.speechSynthesis.speak(u)
    },
    [speechEnabled],
  )

  useEffect(() => () => cancel(), [cancel])

  return { speak, cancel, speaking, supported }
}
