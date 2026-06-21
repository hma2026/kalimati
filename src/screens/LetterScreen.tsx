import { useSpeech } from '@/hooks/useSpeech'
import { useHaptics } from '@/hooks/useHaptics'
import { EducationalScreenShell } from '@/components/EducationalScreenShell'
import { PlaceholderVisual } from '@/components/PlaceholderVisual'
import { mediaVisual } from '@/components/Media'
import { getAsset } from '@/assets/assetRegistry'
import { VolumeIcon } from '@/lib/icons'
import { letters } from '@/data/letters'

/** ألوان تمييز تدور على البطاقات (هادئة). */
const TINTS = ['#7c3aed', '#2F9B5F', '#1477DD', '#E84C68', '#D99A1E', '#0EA5A0', '#C2410C', '#9333EA']

/**
 * شاشة الحروف — Scroll طويل من الألف إلى الياء (بلا pagination).
 * كل بطاقة: حرف كبير + صورة حقيقية أو بديل SVG مؤقت + كلمة مثال + زر صوت للحرف وزر صوت للكلمة.
 */
export function LetterScreen() {
  const { speak, speaking } = useSpeech()
  const haptic = useHaptics()

  return (
    <EducationalScreenShell title="الحروف" subtitle="من الألف إلى الياء — اسمع الحرف والكلمة">
      <div className="letters-grid">
        {letters.map((l, i) => {
          const tint = TINTS[i % TINTS.length]
          const ex = l.examples[0]
          const hasImg = !!(ex?.media && getAsset(ex.media))
          return (
            <div className="lettercard" key={l.id} style={{ ['--lt' as string]: tint }}>
              <div className="lettercard__glyph">{l.glyph}</div>

              <div className="lettercard__ex">
                <span className="lettercard__img">
                  {hasImg ? mediaVisual(ex!.media!, 52) : <PlaceholderVisual size={52} accent={tint} />}
                </span>
                <span className="lettercard__word">{ex?.label}</span>
              </div>

              <div className="lettercard__btns">
                <button
                  className={'lettercard__sound' + (speaking ? ' is-on' : '')}
                  aria-label={`انطق حرف ${l.say}`}
                  onClick={() => { haptic('letter'); speak(l.say) }}
                >
                  <VolumeIcon size={18} /> الحرف
                </button>
                <button
                  className="lettercard__sound lettercard__sound--soft"
                  aria-label={`انطق كلمة ${ex?.label ?? ''}`}
                  onClick={() => { haptic('tap'); if (ex) speak(ex.label) }}
                >
                  <VolumeIcon size={18} /> الكلمة
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </EducationalScreenShell>
  )
}
