import { useState } from 'react'
import { useNav } from '@/store/useNavStore'
import { TeacherGate } from '@/components/TeacherGate'
import { SparkleIcon, SettingsIcon } from '@/lib/icons'

export function SplashScreen() {
  const nav = useNav()
  const [gate, setGate] = useState(false)
  return (
    <div className="screen" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: 20 }}>
      <div style={{ fontSize: '5.5rem', lineHeight: 1 }} aria-hidden>🧒💬</div>
      <div>
        <h1 style={{ fontSize: '2.6rem', color: 'var(--primary-600)' }}>كلمتي</h1>
        <p style={{ color: 'var(--ink-soft)', fontWeight: 700, marginTop: 6, fontSize: '1.1rem' }}>
          أتعلّم أتكلّم وأعبّر
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 260, maxWidth: '90%' }}>
        <button className="btn btn--primary btn--lg" onClick={() => nav.go('children')}>
          <SparkleIcon size={22} /> ابدأ
        </button>
        <button className="btn btn--ghost" onClick={() => setGate(true)}>
          <SettingsIcon size={20} /> للمدرب / المعلم
        </button>
      </div>

      <p className="disclaimer" style={{ maxWidth: 440 }}>
        أداة مساعدة للتواصل والتدريب على النطق، ولا تغني عن المختصين.
      </p>

      {gate && (
        <TeacherGate onCancel={() => setGate(false)} onUnlock={() => { setGate(false); nav.go('settings') }} />
      )}
    </div>
  )
}
