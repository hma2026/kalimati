import { useCallback, useEffect, useRef, useState } from 'react'

const supported =
  typeof window !== 'undefined' &&
  'MediaRecorder' in window &&
  !!navigator.mediaDevices?.getUserMedia

function pickMime(): string {
  const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg']
  for (const t of types) if (MediaRecorder.isTypeSupported?.(t)) return t
  return ''
}

interface RecorderState {
  isRecording: boolean
  seconds: number
  url: string | null
  blob: Blob | null
  error: string | null
}

/** تسجيل صوت الطفل — start/stop, timer, playback URL, error reporting. */
export function useAudioRecorder() {
  const [state, setState] = useState<RecorderState>({
    isRecording: false, seconds: 0, url: null, blob: null, error: null,
  })
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<number | null>(null)
  const urlRef = useRef<string | null>(null)

  const cleanupStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    if (timerRef.current) { window.clearInterval(timerRef.current); timerRef.current = null }
  }

  const start = useCallback(async () => {
    if (!supported) {
      setState((s) => ({ ...s, error: 'التسجيل غير مدعوم على هذا الجهاز' }))
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      chunksRef.current = []
      const mime = pickMime()
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined)
      rec.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mime || 'audio/webm' })
        if (urlRef.current) URL.revokeObjectURL(urlRef.current)
        const url = URL.createObjectURL(blob)
        urlRef.current = url
        setState((s) => ({ ...s, isRecording: false, url, blob }))
        cleanupStream()
      }
      recorderRef.current = rec
      rec.start()
      setState({ isRecording: true, seconds: 0, url: null, blob: null, error: null })
      timerRef.current = window.setInterval(
        () => setState((s) => ({ ...s, seconds: s.seconds + 1 })),
        1000,
      )
    } catch {
      setState((s) => ({ ...s, error: 'لم يتم السماح باستخدام الميكروفون' }))
      cleanupStream()
    }
  }, [])

  const stop = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop()
    }
    if (timerRef.current) { window.clearInterval(timerRef.current); timerRef.current = null }
  }, [])

  const reset = useCallback(() => {
    if (urlRef.current) { URL.revokeObjectURL(urlRef.current); urlRef.current = null }
    setState({ isRecording: false, seconds: 0, url: null, blob: null, error: null })
  }, [])

  /** Load a previously-saved recording (from IndexedDB) for replay. */
  const loadBlob = useCallback((blob: Blob) => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    const url = URL.createObjectURL(blob)
    urlRef.current = url
    setState((s) => ({ ...s, url, blob }))
  }, [])

  useEffect(() => () => {
    cleanupStream()
    if (urlRef.current) URL.revokeObjectURL(urlRef.current)
  }, [])

  return { ...state, start, stop, reset, loadBlob, supported }
}
