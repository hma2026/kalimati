import { useState } from 'react'
import { useChildren } from '@/store/useChildrenStore'
import { useSettings } from '@/store/useSettingsStore'
import { AVATAR_CHOICES } from '@/data/children'
import { AssetIcon } from '@/components/AssetIcon'
import { DIALECTS } from '@/data/dialects'
import { CloseIcon } from '@/lib/icons'
import type { DialectId, Gender } from '@/types'

interface Props {
  onClose: () => void
  onAdded?: (id: string) => void
}

export function AddChildModal({ onClose, onAdded }: Props) {
  const addChild = useChildren((s) => s.addChild)
  const defaultDialect = useSettings((s) => s.selectedDialect)
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<Gender>('boy')
  const [dialectId, setDialectId] = useState<DialectId>(defaultDialect)
  const [avatar, setAvatar] = useState(AVATAR_CHOICES[0])

  const save = () => {
    if (!name.trim()) return
    const id = addChild({ name, avatar, age: age ? Number(age) : undefined, gender, dialectId })
    onAdded?.(id)
    onClose()
  }

  return (
    <div className="modal-mask" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <h3>إضافة طفل</h3>
          <button className="iconbtn iconbtn--sm iconbtn--ghost" aria-label="إغلاق" onClick={onClose}><CloseIcon /></button>
        </div>

        <div className="field">
          <label htmlFor="ch-name">الاسم</label>
          <input id="ch-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="اسم الطفل" autoFocus />
        </div>

        <div className="field">
          <label htmlFor="ch-age">العمر (اختياري)</label>
          <input id="ch-age" type="number" inputMode="numeric" min={1} max={18} value={age}
                 onChange={(e) => setAge(e.target.value)} placeholder="مثال: 5" />
        </div>

        <div className="field">
          <label>الجنس</label>
          <div className="choices" style={{ alignSelf: 'flex-start' }}>
            <button className={gender === 'boy' ? 'is-on' : ''} onClick={() => setGender('boy')}>ولد</button>
            <button className={gender === 'girl' ? 'is-on' : ''} onClick={() => setGender('girl')}>بنت</button>
          </div>
        </div>

        <div className="field">
          <label htmlFor="ch-dialect">اللهجة</label>
          <select id="ch-dialect" value={dialectId} onChange={(e) => setDialectId(e.target.value as DialectId)}>
            {DIALECTS.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
          </select>
        </div>

        <div className="field">
          <label>الصورة</label>
          <div className="avatar-pick">
            {AVATAR_CHOICES.map((a) => (
              <button key={a} className={a === avatar ? 'is-on' : ''} onClick={() => setAvatar(a)} aria-label="اختيار صورة">
                <AssetIcon refKey={a} size={40} />
              </button>
            ))}
          </div>
        </div>

        <button className="btn btn--primary btn--block btn--lg" onClick={save} disabled={!name.trim()}>
          حفظ
        </button>
      </div>
    </div>
  )
}
