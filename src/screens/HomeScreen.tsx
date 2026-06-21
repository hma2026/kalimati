import { useState } from 'react'
import { useNav } from '@/store/useNavStore'
import { useChildren, progressStats } from '@/store/useChildrenStore'
import { useHaptics } from '@/hooks/useHaptics'
import { TeacherGate } from '@/components/TeacherGate'
import { AppBottomNav } from '@/components/AppBottomNav'
import { categories } from '@/data/categories'
import type { Category } from '@/types'
import { StarIcon, BurstIcon } from '@/lib/icons'
import { AssetIcon } from '@/components/AssetIcon'

/* أيقونات SVG للبطاقات البيضاء (فقاعة/ساعة/رسم) */
const IconBubble = () => (
  <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" aria-hidden>
    <ellipse cx="50" cy="84" rx="28" ry="5" fill="#26345c" opacity="0.07" />
    <path d="M24 18h52a13 13 0 0 1 13 13v24a13 13 0 0 1-13 13H45L29 82V68h-5a13 13 0 0 1-13-13V31a13 13 0 0 1 13-13z" fill="#fff" stroke="#e0e6f0" strokeWidth="2.5" />
    <circle cx="35" cy="43" r="5.5" fill="#5b9bf0" /><circle cx="50" cy="43" r="5.5" fill="#5b9bf0" /><circle cx="65" cy="43" r="5.5" fill="#5b9bf0" />
  </svg>
)
const RAYS = Array.from({ length: 12 }, (_, i) => {
  const a = (i * 30 * Math.PI) / 180
  return { x1: 50 + 33 * Math.cos(a), y1: 50 + 33 * Math.sin(a), x2: 50 + 44 * Math.cos(a), y2: 50 + 44 * Math.sin(a) }
})
const IconClock = () => (
  <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" aria-hidden>
    <g stroke="#f4b53a" strokeWidth="6" strokeLinecap="round">{RAYS.map((r, i) => <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} />)}</g>
    <circle cx="50" cy="50" r="32" fill="#ffd76b" stroke="#f4b53a" strokeWidth="3" /><circle cx="50" cy="50" r="23" fill="#fff" />
    <line x1="50" y1="50" x2="50" y2="33" stroke="#5a4a2a" strokeWidth="4" strokeLinecap="round" />
    <line x1="50" y1="50" x2="62" y2="55" stroke="#5a4a2a" strokeWidth="4" strokeLinecap="round" /><circle cx="50" cy="50" r="3.2" fill="#5a4a2a" />
  </svg>
)
const IconChart = () => (
  <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" aria-hidden>
    <ellipse cx="50" cy="88" rx="30" ry="4" fill="#26345c" opacity="0.06" />
    <rect x="20" y="58" width="17" height="28" rx="4" fill="#8b5cf6" /><rect x="42" y="46" width="17" height="40" rx="4" fill="#34c759" /><rect x="63" y="32" width="17" height="54" rx="4" fill="#f5b942" />
    <path d="M18 42 L40 30 L58 37 L84 15" stroke="#3b9ae8" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M73 15 L84 15 L84 26" stroke="#3b9ae8" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const SVG_ICONS: Record<string, () => JSX.Element> = { level2: IconBubble, level6: IconClock, report: IconChart }

export function HomeScreen() {
  const nav = useNav()
  const child = useChildren((s) => s.children.find((c) => c.id === s.activeId) ?? null)
  const prog = useChildren((s) => (s.activeId ? s.progress[s.activeId] : undefined))
  const haptic = useHaptics()
  const [gate, setGate] = useState(false)
  const stats = progressStats(prog)

  const openTile = (cat: Category) => {
    if (!cat.available) return
    haptic('tap')
    if (cat.id === 'settings') { setGate(true); return }
    if (cat.screen === 'deck' && cat.deck) nav.go('deck', { deck: cat.deck, title: cat.label })
    else nav.go(cat.screen, { title: cat.label, ...(cat.params ?? {}) })
  }

  return (
    <div className="home">
      {/* الهيدر الموحّد */}
      <header className="home-bar">
        <span className="home-stars"><StarIcon size={20} style={{ color: 'var(--star, #F6C84C)' }} /> {stats.stars}</span>
        <h1 className="home-title">
          <span className="home-title__b" aria-hidden><BurstIcon size={14} /></span>
          الصفحة الرئيسية
          <span className="home-title__b" aria-hidden><BurstIcon size={14} /></span>
        </h1>
        <button className="home-welcome" onClick={() => nav.reset('children')} aria-label="تبديل الطفل">
          <span className="home-welcome__txt">مرحباً {child?.name ?? ''}</span>
          <span className="home-welcome__ava"><AssetIcon refKey={child?.avatar ?? 'avatars/child_boy_01'} size={40} /></span>
        </button>
      </header>

      {/* شبكة ٤×٣ بطاقات (بدون ساعدني) */}
      <div className="home-grid screen__scroll">
        {categories.map((cat) => {
          const Svg = SVG_ICONS[cat.id]
          return (
            <button key={cat.id} className="hcard" style={{ ['--ct' as never]: cat.tint ?? '#7c3aed' }} onClick={() => openTile(cat)}>
              <span className="hcard__icon">{Svg ? <Svg /> : <AssetIcon refKey={cat.icon} size={78} />}</span>
              <span className="hcard__label">{cat.label}</span>
            </button>
          )
        })}
      </div>

      {/* الفوتر الموحّد */}
      <AppBottomNav screen="home" />

      {gate && (
        <TeacherGate onCancel={() => setGate(false)} onUnlock={() => { setGate(false); nav.go('settings') }} />
      )}
    </div>
  )
}
