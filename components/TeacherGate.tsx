import { useEffect, useState } from 'react'
import { useSettings } from '@/store/useSettingsStore'
import { CloseIcon } from '@/lib/icons'

interface Props {
  onUnlock: () => void
  onCancel: () => void
}

/**
 * قفل المعلم — protects access to settings and teacher tools.
 * If no PIN is set, requires a 1.2s long-press (so a child can't tap straight in);
 * if a PIN is set, requires the 4-digit code.
 */
export function TeacherGate({ onUnlock, onCancel }: Props) {
  const pin = useSettings((s) => s.pin)
  const [entry, setEntry] = useState('')
  const [shake, setShake] = useState(false)
  const [holding, setHolding] = useState(false)
  const [held, setHeld] = useState(0)

  // long-press path (no PIN configured)
  useEffect(() => {
    if (pin || !holding) return
    const started = Date.now()
    const iv = window.setInterval(() => {
      const p = Math.min(100, ((Date.now() - started) / 1200) * 100)
      setHeld(p)
      if (p >= 100) { window.clearInterval(iv); onUnlock() }
    }, 30)
    return () => window.clearInterval(iv)
  }, [holding, pin, onUnlock])

  const press = (d: string) => {
    const next = (entry + d).slice(0, 4)
    setEntry(next)
    if (next.length === 4) {
      if (next === pin) onUnlock()
      else { setShake(true); setTimeout(() => { setShake(false); setEntry('') }, 450) }
    }
  }

  return (
    <div className="modal-mask" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={shake ? { animation: 'pop .2s' } : undefined}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <h3>للمعلم وولي الأمر</h3>
          <button className="iconbtn iconbtn--sm iconbtn--ghost" aria-label="إغلاق" onClick={onCancel}><CloseIcon /></button>
        </div>

        {pin ? (
          <>
            <p className="muted-note" style={{ textAlign: 'start', marginBottom: 8 }}>أدخل الرمز المكوّن من 4 أرقام</p>
            <div className="pin-dots">
              {[0, 1, 2, 3].map((i) => <i key={i} className={i < entry.length ? 'on' : ''} />)}
            </div>
            <div className="keypad">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((n) => (
                <button key={n} onClick={() => press(n)}>{n}</button>
              ))}
              <button onClick={() => setEntry('')} aria-label="مسح">⌫</button>
              <button onClick={() => press('0')}>0</button>
              <span />
            </div>
          </>
        ) : (
          <>
            <p className="muted-note" style={{ marginBottom: 14 }}>
              استمر بالضغط لفتح الإعدادات (لمنع الدخول العَرضي من الطفل)
            </p>
            <button
              className="btn btn--primary btn--block btn--lg"
              onMouseDown={() => setHolding(true)}
              onMouseUp={() => { setHolding(false); setHeld(0) }}
              onMouseLeave={() => { setHolding(false); setHeld(0) }}
              onTouchStart={() => setHolding(true)}
              onTouchEnd={() => { setHolding(false); setHeld(0) }}
              style={{ position: 'relative', overflow: 'hidden' }}
            >
              <span style={{ position: 'relative', zIndex: 1 }}>استمر بالضغط…</span>
              <span style={{
                position: 'absolute', inset: 0, insetInlineStart: 0, width: `${held}%`,
                background: 'rgba(255,255,255,.25)', transition: 'width .03s linear',
              }} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
