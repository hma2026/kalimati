import { useState } from 'react'
import { useNav } from '@/store/useNavStore'
import { TeacherGate } from '@/components/TeacherGate'
import { PlayIcon } from '@/lib/icons'
import heroUrl from '@/assets/images/brand/splash_hero.png'

const UserGlyph = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="12" cy="8" r="4" fill="currentColor" />
    <path d="M4 20c0-4 3.6-6.5 8-6.5S20 16 20 20" fill="currentColor" />
  </svg>
)
const ShieldGlyph = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M12 2l8 3v6c0 5-3.4 8.5-8 11-4.6-2.5-8-6-8-11V5l8-3z" fill="#7C4DD6" />
    <path d="M8.5 12l2.3 2.3L15.5 9.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function SplashScreen() {
  const nav = useNav()
  const [gate, setGate] = useState(false)
  return (
    <div className="splash">
      <img className="splash__hero" src={heroUrl} alt="كلمة كلمة — أداة مساعدة للتواصل والتدريب على النطق، ولا تغني عن المختصين" draggable={false} />

      <div className="splash__actions">
        <button className="splash__btn splash__btn--start" onClick={() => nav.go('children')}>
          <span className="splash__btn-ic"><PlayIcon size={24} /></span>
          <span>ابدأ</span>
        </button>
        <button className="splash__btn splash__btn--teacher" onClick={() => setGate(true)}>
          <span className="splash__btn-ic splash__btn-ic--teacher"><UserGlyph size={22} /></span>
          <span>للمدرب / المعلم</span>
        </button>
      </div>

      <p className="splash__safe"><ShieldGlyph /> تجربة تعليمية آمنة، بصرية، ومناسبة للأطفال.</p>

      {gate && (
        <TeacherGate onCancel={() => setGate(false)} onUnlock={() => { setGate(false); nav.go('settings') }} />
      )}
    </div>
  )
}
