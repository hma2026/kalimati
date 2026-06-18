import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useAudioRecorder } from '@/hooks/useAudioRecorder'
import { useSpeech } from '@/hooks/useSpeech'
import { useHaptics } from '@/hooks/useHaptics'
import { useChildren } from '@/store/useChildrenStore'
import { blobStore, recKey } from '@/lib/blobStore'
import { RewardOverlay } from './RewardOverlay'
import { VolumeIcon, MicIcon, StopIcon, PlayIcon, StarIcon, RefreshIcon } from '@/lib/icons'
import { avatarAssets } from '@/data/assetManifest'

const childAvatar = avatarAssets?.child_boy_01?.imageUrl ?? null

interface Props {
  itemId: string
  /** Spoken + displayed text (already built from the dialect engine). */
  text: string
  accent: string
  /** Visual to show next to the text (emoji string or a node like a color blob). */
  visual?: ReactNode
  /** The little pointing character. */
  character?: string
  instruction?: string
  /** 'full' = long labels (levels 2-5), 'compact' = short labels (level 6). */
  variant?: 'full' | 'compact'
  /** Calming cards: suppress confetti/loud reward, keep it gentle. */
  calm?: boolean
}

export function SelectedPracticePanel({
  itemId, text, accent, visual, character, instruction, variant = 'full', calm,
}: Props) {
  const rec = useAudioRecorder()
  const { speak, speaking } = useSpeech()
  const haptic = useHaptics()
  const activeId = useChildren((s) => s.activeId)
  const recordAttempt = useChildren((s) => s.recordAttempt)

  const [reward, setReward] = useState(false)
  const [praise, setPraise] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // load existing recording for this child+item
  useEffect(() => {
    let alive = true
    setPraise(null)
    rec.reset()
    if (activeId) blobStore.get(recKey(activeId, itemId)).then((b) => { if (alive && b) rec.loadBlob(b) })
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId, activeId])

  // persist new recordings
  useEffect(() => {
    if (rec.blob && activeId && !rec.isRecording) void blobStore.set(recKey(activeId, itemId), rec.blob)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rec.blob])

  const listen = () => { haptic('soft'); speak(text) }
  const toggleRec = () => (rec.isRecording ? rec.stop() : rec.start())
  const playback = () => {
    if (!rec.url) return
    if (!audioRef.current) audioRef.current = new Audio()
    audioRef.current.src = rec.url
    void audioRef.current.play()
  }
  const correct = () => {
    recordAttempt(itemId, 'great')
    haptic('success')
    if (calm) setPraise('أحسنت')
    else { setPraise('أحسنت يا بطل!'); setReward(true) }
  }
  const redo = () => { recordAttempt(itemId, 'retry'); setPraise(null); rec.reset() }

  const isEmojiVisual = typeof visual === 'string'

  return (
    <div className="practice" style={{ ['--accent' as string]: accent }}>
      <div className="practice__stage">
        {character
          ? <span className="practice__char" aria-hidden>{character}</span>
          : childAvatar
            ? <span className="practice__char" aria-hidden><img src={childAvatar} alt="" className="practice__char-img" loading="lazy" /></span>
            : null}
        <div className="practice__text" style={{ color: accent }}>{text}</div>
        {visual != null && (
          <span className="practice__visual" aria-hidden>
            {isEmojiVisual ? <span style={{ fontSize: '3rem' }}>{visual}</span> : visual}
          </span>
        )}
      </div>

      {instruction && (
        <div className="practice__hint">
          <VolumeIcon size={16} style={{ color: accent }} /> {instruction}
        </div>
      )}

      {variant === 'compact' ? (
        <div className="practice__row practice__row--compact">
          <button className="pbtn pbtn--listen" onClick={listen} aria-pressed={speaking}>
            <VolumeIcon size={22} /><span>اسمع</span>
          </button>
          <button className={`pbtn pbtn--rec${rec.isRecording ? ' is-rec' : ''}`} onClick={toggleRec}>
            {rec.isRecording ? <StopIcon size={22} /> : <MicIcon size={22} />}<span>{rec.isRecording ? 'إيقاف' : 'سجل'}</span>
          </button>
          <button className="pbtn pbtn--play" onClick={playback} disabled={!rec.url}>
            <PlayIcon size={22} /><span>استمع</span>
          </button>
          <button className="pbtn pbtn--ok" onClick={correct}>
            <StarIcon size={22} /><span>صحيح</span>
          </button>
          <button className="pbtn pbtn--redo" onClick={redo}>
            <RefreshIcon size={22} /><span>إعادة</span>
          </button>
        </div>
      ) : (
        <>
          <div className="practice__row">
            <button className="pbtn-line pbtn--listen" onClick={listen} aria-pressed={speaking}>
              <VolumeIcon size={20} /> اسمع الجملة
            </button>
            <button className={`pbtn-line pbtn--rec${rec.isRecording ? ' is-rec' : ''}`} onClick={toggleRec}>
              {rec.isRecording ? <StopIcon size={20} /> : <MicIcon size={20} />} {rec.isRecording ? 'إيقاف التسجيل' : 'سجل صوتك'}
            </button>
            <button className="pbtn-line pbtn--play" onClick={playback} disabled={!rec.url}>
              <PlayIcon size={20} /> استمع لتسجيلك
            </button>
          </div>
          <div className="practice__row practice__row--eval">
            <button className="pbtn-line pbtn--ok" onClick={correct}>
              <StarIcon size={20} /> نطق صحيح
            </button>
            <button className="pbtn-line pbtn--redo" onClick={redo}>
              <RefreshIcon size={20} /> أعِد مرة أخرى
            </button>
          </div>
        </>
      )}

      {rec.error && <div className="muted-note" style={{ color: 'var(--red)' }}>{rec.error}</div>}
      {praise && <div className="praise" style={calm ? { background: 'var(--blue-soft)', color: '#1e5b8a' } : undefined}>{praise}</div>}

      <RewardOverlay show={reward} text={praise ?? 'أحسنت!'} onDone={() => setReward(false)} />
    </div>
  )
}
