import { useEffect, useRef, useState } from 'react'
import { useAudioRecorder } from '@/hooks/useAudioRecorder'
import { useSpeech } from '@/hooks/useSpeech'
import { useHaptics } from '@/hooks/useHaptics'
import { useChildren } from '@/store/useChildrenStore'
import { useSettings } from '@/store/useSettingsStore'
import { blobStore, recKey } from '@/lib/blobStore'
import { RewardOverlay } from './RewardOverlay'
import { mediaVisual } from './Media'
import { VolumeIcon, MicIcon, StopIcon, PlayIcon, StarIcon, RefreshIcon, PawIcon } from '@/lib/icons'

interface Props {
  itemId: string
  /** media registry key for the animal image */
  mediaKey: string
  /** animal name (dialect-aware) */
  name: string
  /** onomatopoeia spoken as the "animal sound" */
  sound: string
  accent: string
}

export function AnimalPracticePanel({ itemId, mediaKey, name, sound, accent }: Props) {
  const rec = useAudioRecorder()
  const { speak } = useSpeech()
  const haptic = useHaptics()
  const activeId = useChildren((s) => s.activeId)
  const recordAttempt = useChildren((s) => s.recordAttempt)
  const bumpCounter = useChildren((s) => s.bumpCounter)
  const animalSoundsEnabled = useSettings((s) => s.animalSoundsEnabled)
  const quiet = useSettings((s) => s.sensoryMode === 'sensitive')

  const [reward, setReward] = useState(false)
  const [praise, setPraise] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    let alive = true
    setPraise(null)
    rec.reset()
    if (activeId) blobStore.get(recKey(activeId, itemId)).then((b) => { if (alive && b) rec.loadBlob(b) })
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId, activeId])

  useEffect(() => {
    if (rec.blob && activeId && !rec.isRecording) void blobStore.set(recKey(activeId, itemId), rec.blob)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rec.blob])

  const playName = () => { haptic('soft'); speak(name) }
  const playSound = () => {
    if (!animalSoundsEnabled || quiet) return
    haptic('soft'); bumpCounter('animalSoundPlays'); speak(sound)
  }
  const toggleRec = () => (rec.isRecording ? rec.stop() : rec.start())
  const playback = () => {
    if (!rec.url) return
    if (!audioRef.current) audioRef.current = new Audio()
    audioRef.current.src = rec.url
    void audioRef.current.play()
  }
  const correct = () => { recordAttempt(itemId, 'great'); haptic('success'); setPraise('أحسنت يا بطل!'); setReward(true) }
  const redo = () => { recordAttempt(itemId, 'retry'); setPraise(null); rec.reset() }

  return (
    <div className="practice" style={{ ['--accent' as string]: accent }}>
      <div className="practice__stage" style={{ flexDirection: 'column', gap: 6 }}>
        <span style={{ display: 'grid', placeItems: 'center' }} aria-hidden>{mediaVisual(mediaKey, 96)}</span>
        <div className="practice__text" style={{ color: accent }}>{name}</div>
      </div>

      <div className="practice__row">
        <button className="pbtn-line pbtn--listen" onClick={playName}>
          <VolumeIcon size={20} /> اسمع الاسم
        </button>
        <button
          className="pbtn-line pbtn--sound"
          onClick={playSound}
          disabled={!animalSoundsEnabled || quiet}
          title={!animalSoundsEnabled || quiet ? 'أصوات الحيوانات متوقفة' : undefined}
        >
          <PawIcon size={20} /> صوت الحيوان
        </button>
      </div>

      <div className="practice__row practice__row--compact" style={{ marginTop: 10 }}>
        <button className={`pbtn pbtn--rec${rec.isRecording ? ' is-rec' : ''}`} onClick={toggleRec}>
          {rec.isRecording ? <StopIcon size={22} /> : <MicIcon size={22} />}<span>{rec.isRecording ? 'إيقاف' : 'سجل'}</span>
        </button>
        <button className="pbtn pbtn--play" onClick={playback} disabled={!rec.url}><PlayIcon size={22} /><span>استمع</span></button>
        <button className="pbtn pbtn--ok" onClick={correct}><StarIcon size={22} /><span>صحيح</span></button>
        <button className="pbtn pbtn--redo" onClick={redo}><RefreshIcon size={22} /><span>إعادة</span></button>
      </div>

      {rec.error && <div className="muted-note" style={{ color: 'var(--red)' }}>{rec.error}</div>}
      {praise && <div className="praise">{praise}</div>}
      <RewardOverlay show={reward} text={praise ?? 'أحسنت!'} onDone={() => setReward(false)} />
    </div>
  )
}
