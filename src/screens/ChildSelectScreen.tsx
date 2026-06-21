import { useState } from 'react'
import { useNav } from '@/store/useNavStore'
import { useChildren } from '@/store/useChildrenStore'
import { AddChildModal } from '@/components/AddChildModal'
import { TeacherGate } from '@/components/TeacherGate'
import { InstallPrompt } from '@/components/InstallPrompt'
import { assetByRef } from '@/data/assetManifest'
import { SettingsIcon, BackIcon, PlusIcon } from '@/lib/icons'

const isUrl = (s: string) => /^(https?:|data:|\/|blob:)/.test(s)

/* لوحة بستيلية تُوائم خلفية كل صورة طفل (أخضر/وردي/أزرق/بنفسجي) لتفادي تعارض الألوان */
const PALETTE = [
  { ring: '#a6d398', bg: '#e2f1da', pill: '#d4ecca', text: '#4e8c3c' }, // أخضر
  { ring: '#efa6b3', bg: '#fbe1e6', pill: '#f8d2d9', text: '#c44a62' }, // وردي
  { ring: '#9ec6ee', bg: '#e0edfb', pill: '#d3e5fa', text: '#356fb0' }, // أزرق
  { ring: '#c2b1ec', bg: '#ece4fb', pill: '#e2d6f8', text: '#6a4fb0' }, // بنفسجي
]

export function ChildSelectScreen() {
  const nav = useNav()
  const children = useChildren((s) => s.children)
  const activeId = useChildren((s) => s.activeId)
  const setActive = useChildren((s) => s.setActive)
  const [adding, setAdding] = useState(false)
  const [gate, setGate] = useState(false)

  const choose = (id: string) => {
    setActive(id)
    nav.go('home')
  }

  // إذا كان عدد الأطفال زوجياً، تقع بطاقة «الإضافة» وحيدة في صفّها → تمتدّ وتتوسّط
  const addSpan = children.length % 2 === 0

  return (
    <div className="cs">
      {/* الشريط العلوي: رجوع (يسار) + العنوان (وسط) + إعدادات (يمين) */}
      <div className="cs-bar">
        <button className="cs-bar__btn cs-bar__btn--back" aria-label="رجوع" onClick={() => nav.back()}>
          <BackIcon size={26} />
        </button>
        <h1 className="cs-title">اختيار الطفل</h1>
        <button className="cs-bar__btn cs-bar__btn--settings" aria-label="الإعدادات" onClick={() => setGate(true)}>
          <SettingsIcon size={26} />
        </button>
      </div>

      <div className="cs__scroll">
        <InstallPrompt />

        <div className="cs-grid">
          {children.map((c, i) => {
            const p = PALETTE[i % PALETTE.length]
            const url = assetByRef(c.avatar) ?? (isUrl(c.avatar) ? c.avatar : null)
            return (
              <button
                key={c.id}
                className={'cs-card' + (c.id === activeId ? ' cs-card--active' : '')}
                style={{
                  ['--ring' as never]: p.ring,
                  ['--cbg' as never]: p.bg,
                  ['--pill' as never]: p.pill,
                  ['--ptx' as never]: p.text,
                }}
                onClick={() => choose(c.id)}
              >
                <span className="cs-card__ava">
                  {url ? <img src={url} alt="" /> : <span className="cs-card__ph"><PlusIcon size={30} /></span>}
                </span>
                <span className="cs-card__name">{c.name}</span>
              </button>
            )
          })}

          {/* إضافة طفل */}
          <button
            className={'cs-add' + (addSpan ? ' cs-add--span' : '')}
            aria-label="إضافة طفل"
            onClick={() => setAdding(true)}
          >
            <span className="cs-add__circle"><PlusIcon size={42} strokeWidth={2.4} /></span>
            <span className="cs-add__txt">إضافة طفل</span>
          </button>
        </div>
      </div>

      {adding && <AddChildModal onClose={() => setAdding(false)} onAdded={choose} />}
      {gate && (
        <TeacherGate
          onCancel={() => setGate(false)}
          onUnlock={() => { setGate(false); nav.go('settings') }}
        />
      )}
    </div>
  )
}
