import { useEffect, useRef, useState } from 'react'
import { useAudioRecorder } from '@/hooks/useAudioRecorder'
import { useChildren } from '@/store/useChildrenStore'
import { blobStore, recKey } from '@/lib/blobStore'
import { RewardOverlay } from './RewardOverlay'
import { MicIcon, StopIcon, PlayIcon, RefreshIcon, CheckIcon, StarIcon } from '@/lib/icons'
import type { Rating } from '@/types'

interface Props {
  itemId: string
}

const PRAISE: Record<Exclude<Rating, 'retry'>, string> = {
  great: 'ممتاز! نطق رائع',
  good: 'جيد جداً! استمر',
}

export function RecordPanel({ itemId }: Props) {
  const rec = useAudioRecorder()
  const activeId = useChildren((s) => s.activeId)
  const recordAttempt = useChildren((s) => s.recordAttempt)

  const [reward, setReward] = useState(false)
  const [praise, setPraise] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Load any previously saved recording for replay across sessions.
  useEffect(() => {
    let alive = true
    setPraise(null)
    rec.reset()
    if (activeId) {
      blobStore.get(recKey(activeId, itemId)).then((b) => {
        if (alive && b) rec.loadBlob(b)
      })
    }
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId, activeId])

  // Persist new recordings.
  useEffect(() => {
    if (rec.blob && activeId && !rec.isRecording) {
      void blobStore.set(recKey(activeId, itemId), rec.blob)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rec.blob])

  const play = () => {
    if (!rec.url) return
    if (!audioRef.current) audioRef.current = new Audio()
    audioRef.current.src = rec.url
    void audioRef.current.play()
  }

  const evaluate = (rating: Rating) => {
    const res = recordAttempt(itemId, rating)
    if (rating === 'retry') { setPraise(null); return }
    setPraise(PRAISE[rating])
    if (res.rewarded) setReward(true)
  }

  const mm = String(Math.floor(rec.seconds / 60)).padStart(2, '0')
  const ss = String(rec.seconds % 60).padStart(2, '0')

  return (
    <div className="card record-card">
      <button
        className={`rec-mic${rec.isRecording ? ' is-rec' : ''}`}
        onClick={() => (rec.isRecording ? rec.stop() : rec.start())}
        aria-label={rec.isRecording ? 'إيقاف التسجيل' : 'سجّل صوتك'}
      >
        {rec.isRecording ? <StopIcon size={34} /> : <MicIcon size={34} />}
      </button>

      <div className={`rec-waves${rec.isRecording ? '' : ' is-idle'}`} aria-hidden>
        {Array.from({ length: 7 }).map((_, i) => (
          <span key={i} style={{ animationDelay: `${i * 0.09}s`, height: 8 }} />
        ))}
      </div>

      <div className="rec-timer">
        {rec.isRecording ? `${mm}:${ss}` : rec.url ? 'تم التسجيل' : 'اضغط لتسجيل صوت الطفل'}
      </div>

      {rec.error && <div className="muted-note" style={{ color: 'var(--red)' }}>{rec.error}</div>}

      {rec.url && !rec.isRecording && (
        <div className="rec-actions">
          <button className="btn btn--soft" onClick={play}><PlayIcon size={20} /> استماع</button>
          <button className="btn btn--ghost" onClick={() => rec.reset()}><RefreshIcon size={20} /> إعادة</button>
        </div>
      )}

      <div className="eval" style={{ width: '100%', boxShadow: 'none', padding: '8px 0 0' }}>
        <div className="eval__q">تقييم المعلم للنطق</div>
        <div className="eval__row">
          <button className="eval__btn eval__btn--great" onClick={() => evaluate('great')}>
            <span className="ico"><StarIcon /></span> ممتاز
          </button>
          <button className="eval__btn eval__btn--good" onClick={() => evaluate('good')}>
            <span className="ico"><CheckIcon /></span> جيد
          </button>
          <button className="eval__btn eval__btn--retry" onClick={() => evaluate('retry')}>
            <span className="ico"><RefreshIcon /></span> يحتاج إعادة
          </button>
        </div>
        {praise && <div className="praise">{praise}</div>}
      </div>

      <RewardOverlay show={reward} text={praise ?? 'أحسنت!'} onDone={() => setReward(false)} />
    </div>
  )
}
