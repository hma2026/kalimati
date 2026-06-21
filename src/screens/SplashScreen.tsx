import { useState } from 'react'
import { useNav } from '@/store/useNavStore'
import { TeacherGate } from '@/components/TeacherGate'
import { PlayIcon, StarIcon, ChatDotsIcon, PaperPlaneIcon } from '@/lib/icons'
import kidsUrl from '@/assets/images/brand/splash_kids.png'

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

/* نجوم ونقاط زخرفية (مطابِقة للنموذج) */
const DECOR = [
  { t: 'star', cls: 'sd-star', x: '79%', y: '7%', s: 26 },
  { t: 'star', cls: 'sd-star--p', x: '20%', y: '20%', s: 18 },
  { t: 'star', cls: 'sd-star', x: '13%', y: '30%', s: 20 },
  { t: 'star', cls: 'sd-star--p', x: '85%', y: '28%', s: 18 },
  { t: 'star', cls: 'sd-star', x: '88%', y: '60%', s: 22 },
  { t: 'star', cls: 'sd-star', x: '14%', y: '64%', s: 16 },
  { t: 'dot', cls: 'sd-dot--pink', x: '24%', y: '34%' },
  { t: 'dot', cls: 'sd-dot--purple', x: '83%', y: '20%' },
  { t: 'dot', cls: 'sd-dot--blue', x: '90%', y: '48%' },
  { t: 'dot', cls: 'sd-dot--blue', x: '12%', y: '48%' },
  { t: 'dot', cls: 'sd-dot--pink', x: '78%', y: '54%' },
]

export function SplashScreen() {
  const nav = useNav()
  const [gate, setGate] = useState(false)

  return (
    <div className="splash">
      {/* الزخارف */}
      <div className="splash-deco" aria-hidden>
        <span className="sd-bubble sd-bubble--p" style={{ left: '17%', top: '7%' }}><ChatDotsIcon size={30} /></span>
        <span className="sd-bubble sd-bubble--b" style={{ right: '9%', top: '32%' }}><ChatDotsIcon size={28} /></span>
        <span className="sd-plane" style={{ left: '7%', top: '45%' }}><PaperPlaneIcon size={34} /></span>
        {DECOR.map((d, i) =>
          d.t === 'star' ? (
            <span key={i} className={d.cls} style={{ left: d.x, top: d.y }}><StarIcon size={d.s} /></span>
          ) : (
            <span key={i} className={'sd-dot ' + d.cls} style={{ left: d.x, top: d.y }} />
          ),
        )}
      </div>

      {/* العنوان والنصّ — كتابة فعلية */}
      <h1 className="splash__title">كلمة كلمة</h1>
      <p className="splash__sub">أداة مساعدة للتواصل والتدريب على النطق، ولا تغني عن المختصين.</p>

      {/* صورة الطفلين فقط (معزولة) */}
      <img className="splash__kids" src={kidsUrl} alt="طفلان يلوّحان" draggable={false} />

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
