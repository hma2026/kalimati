import { useState } from 'react'
import { useChildren, progressStats } from '@/store/useChildrenStore'
import { useSpeech } from '@/hooks/useSpeech'
import { useHaptics } from '@/hooks/useHaptics'
import { AppHeader } from '@/components/AppHeader'
import { WordCard } from '@/components/WordCard'
import { SoundButton } from '@/components/SoundButton'
import { RecordPanel } from '@/components/RecordPanel'
import { letters } from '@/data/letters'

/** Simple, calm mouth illustration (lips rounded forward for ش). */
function Mouth() {
  return (
    <div className="mouth" aria-hidden>
      <svg viewBox="0 0 120 80">
        <ellipse cx="60" cy="40" rx="42" ry="26" fill="#d6486a" />
        <ellipse cx="60" cy="44" rx="30" ry="15" fill="#7a1f38" />
        <path d="M22 36 Q60 20 98 36" fill="none" stroke="#b03a5b" strokeWidth="6" strokeLinecap="round" />
        <rect x="44" y="30" width="32" height="8" rx="3" fill="#fff" opacity="0.9" />
      </svg>
    </div>
  )
}

export function LetterScreen() {
  const { speak, speaking } = useSpeech()
  const haptic = useHaptics()
  const prog = useChildren((s) => (s.activeId ? s.progress[s.activeId] : undefined))
  const stats = progressStats(prog)

  const [letterIdx] = useState(0)
  const letter = letters[letterIdx]

  return (
    <div className="screen">
      <AppHeader title="الحروف" stars={stats.stars} />

      <div className="screen__scroll stack">
        <div className="card" style={{ textAlign: 'center' }}>
          <div className="letter-glyph-wrap">
            <span className="letter-glyph">{letter.glyph}</span>
            <SoundButton playing={speaking} label="انطق الحرف" onClick={() => { haptic('letter'); speak(letter.say) }} />
          </div>
          <Mouth />
          <p className="muted-note" style={{ marginTop: 8 }}>شكل الفم عند نطق الحرف — كرّر: «{letter.sound}»</p>
        </div>

        <div>
          <h3 style={{ marginBottom: 10, fontSize: '1.1rem' }}>كلمات تبدأ بحرف {letter.glyph}</h3>
          <div className="card-grid" data-cols={4}>
            {letter.examples.map((ex) => (
              <WordCard key={ex.id} card={ex} onClick={() => { haptic('tap'); speak(ex.label) }} />
            ))}
          </div>
        </div>

        <RecordPanel itemId={letter.id} />
      </div>
    </div>
  )
}
