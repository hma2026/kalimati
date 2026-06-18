import { useSpeech } from '@/hooks/useSpeech'
import { useHaptics } from '@/hooks/useHaptics'
import { AppHeader } from '@/components/AppHeader'
import { BreathingCircle } from '@/components/BreathingCircle'

const CALM_CARDS = [
  { id: 'calm_rest', label: 'أحتاج راحة' },
  { id: 'calm_loud', label: 'الصوت عالي' },
  { id: 'calm_quiet', label: 'أبغى مكان هادي' },
  { id: 'calm_touch', label: 'لا تلمسني' },
  { id: 'calm_mom', label: 'أبغى أمي' },
  { id: 'calm_alone', label: 'خليني شوي' },
]

export function CalmScreen() {
  const { speak } = useSpeech()
  const haptic = useHaptics()

  return (
    <div className="screen calm">
      <AppHeader title="أنا محتاج أهدأ" />

      <div className="screen__scroll stack">
        <BreathingCircle />

        <div className="card-grid" data-cols={2}>
          {CALM_CARDS.map((c) => (
            <button
              key={c.id}
              className="tile"
              style={{ background: 'var(--blue-soft)', minHeight: 92 }}
              onClick={() => { haptic('soft'); speak(c.label) }}
            >
              <span className="tile__label" style={{ color: '#1e5b8a' }}>{c.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
