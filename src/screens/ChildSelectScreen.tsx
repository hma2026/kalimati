import { useState } from 'react'
import { useNav } from '@/store/useNavStore'
import { useChildren } from '@/store/useChildrenStore'
import { AddChildModal } from '@/components/AddChildModal'
import { TeacherGate } from '@/components/TeacherGate'
import { InstallPrompt } from '@/components/InstallPrompt'
import { assetByRef } from '@/data/assetManifest'
import {
  SettingsIcon, BackIcon, PlusIcon, StarIcon,
  ChatDotsIcon, PaperPlaneIcon, CareHandsIcon, BurstIcon,
} from '@/lib/icons'

const isUrl = (s: string) => /^(https?:|data:|\/|blob:)/.test(s)

/* لوحة بستيلية تُوائم خلفية كل صورة طفل: أخضر/وردي/أزرق/بنفسجي */
const PALETTE = [
  { ring: '#a6d398', bg: '#e2f1da', pill: '#d4ecca', text: '#4e8c3c' }, // أحمد — أخضر
  { ring: '#efa6b3', bg: '#fbe1e6', pill: '#f8d2d9', text: '#c44a62' }, // سارة — وردي
  { ring: '#9ec6ee', bg: '#e0edfb', pill: '#d3e5fa', text: '#356fb0' }, // محمد — أزرق
  { ring: '#c2b1ec', bg: '#ece4fb', pill: '#e2d6f8', text: '#6a4fb0' }, // ليان — بنفسجي
]

/* نجوم ونقاط زخرفية مبعثرة (مطابِقة للنموذج) */
const DECOR = [
  { t: 'star', cls: 'st', x: '16%', y: '16%', s: 22 },
  { t: 'star', cls: 'st--p', x: '83%', y: '11%', s: 18 },
  { t: 'star', cls: 'st', x: '9%', y: '62%', s: 20 },
  { t: 'star', cls: 'st', x: '90%', y: '40%', s: 16 },
  { t: 'star', cls: 'st--p', x: '79%', y: '60%', s: 18 },
  { t: 'star', cls: 'st', x: '12%', y: '83%', s: 16 },
  { t: 'star', cls: 'st--p', x: '88%', y: '82%', s: 18 },
  { t: 'dot', cls: 'dot--pink', x: '27%', y: '21%' },
  { t: 'dot', cls: 'dot--blue', x: '72%', y: '18%' },
  { t: 'dot', cls: 'dot--purple', x: '13%', y: '46%' },
  { t: 'dot', cls: 'dot--blue', x: '85%', y: '55%' },
  { t: 'dot', cls: 'dot--pink', x: '80%', y: '72%' },
  { t: 'dot', cls: 'dot--blue', x: '20%', y: '74%' },
]

export function ChildSelectScreen() {
  const nav = useNav()
  const children = useChildren((s) => s.children)
  const activeId = useChildren((s) => s.activeId)
  const setActive = useChildren((s) => s.setActive)
  const [adding, setAdding] = useState(false)
  const [gate, setGate] = useState(false)

  const choose = (id: string) => { setActive(id); nav.go('home') }

  return (
    <div className="cs">
      {/* زخارف خلفية */}
      <div className="cs-deco" aria-hidden>
        {DECOR.map((d, i) =>
          d.t === 'star' ? (
            <span key={i} className={d.cls} style={{ left: d.x, top: d.y }}>
              <StarIcon size={d.s} />
            </span>
          ) : (
            <span key={i} className={'dot ' + d.cls} style={{ left: d.x, top: d.y }} />
          ),
        )}
      </div>

      {/* الترويسة: إعدادات (يسار) + عنوان (وسط) + رجوع (يمين) */}
      <div className="cs-bar">
        <button className="cs-bar__btn cs-bar__btn--settings" aria-label="الإعدادات" onClick={() => setGate(true)}>
          <SettingsIcon size={24} />
        </button>
        <div className="cs-titlewrap">
          <h1 className="cs-title">اختيار الطفل</h1>
          <span className="cs-title__bubble" aria-hidden><ChatDotsIcon size={26} /></span>
        </div>
        <button className="cs-bar__btn cs-bar__btn--back" aria-label="رجوع" onClick={() => nav.back()}>
          <BackIcon size={24} />
        </button>
      </div>

      {/* العنوان الفرعي */}
      <div className="cs-sub">
        <span className="cs-sub__b"><BurstIcon size={16} /></span>
        <span>اختر ملف الطفل للمتابعة</span>
        <span className="cs-sub__b"><BurstIcon size={16} /></span>
      </div>

      <div className="cs__scroll">
        <InstallPrompt />

        {/* شبكة الأطفال */}
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
                  {url ? <img src={url} alt="" /> : null}
                </span>
                <span className="cs-card__name">{c.name}</span>
              </button>
            )
          })}
        </div>

        {/* إضافة طفل + طائرة ورقية */}
        <div className="cs-addrow">
          <span className="cs-plane" aria-hidden><PaperPlaneIcon size={34} /></span>
          <button className="cs-add" aria-label="إضافة طفل" onClick={() => setAdding(true)}>
            <span className="cs-add__circle"><PlusIcon size={34} strokeWidth={2.4} /></span>
            <span className="cs-add__txt">إضافة طفل</span>
          </button>
        </div>

        {/* شريط المساعدة السفلي */}
        <div className="cs-foot">
          <span className="cs-foot__ic" aria-hidden><CareHandsIcon size={26} /></span>
          <span className="cs-foot__txt">أداة مساعدة للتواصل والتدريب على النطق</span>
        </div>
      </div>

      {adding && <AddChildModal onClose={() => setAdding(false)} onAdded={choose} />}
      {gate && (
        <TeacherGate onCancel={() => setGate(false)} onUnlock={() => { setGate(false); nav.go('settings') }} />
      )}
    </div>
  )
}
