import { useState } from 'react'
import { useNav } from '@/store/useNavStore'
import { useChildren, progressStats } from '@/store/useChildrenStore'
import { useHaptics } from '@/hooks/useHaptics'
import { TeacherGate } from '@/components/TeacherGate'
import { categories } from '@/data/categories'
import type { Category } from '@/types'
import { StarIcon, BurstIcon } from '@/lib/icons'
import { AssetIcon } from '@/components/AssetIcon'

/* أيقونات SVG للبطاقات البيضاء */
const IconBubble = () => (<svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" aria-hidden><ellipse cx="50" cy="84" rx="28" ry="5" fill="#26345c" opacity="0.07"/><path d="M24 18h52a13 13 0 0 1 13 13v24a13 13 0 0 1-13 13H45L29 82V68h-5a13 13 0 0 1-13-13V31a13 13 0 0 1 13-13z" fill="#fff" stroke="#e0e6f0" strokeWidth="2.5"/><circle cx="35" cy="43" r="5.5" fill="#5b9bf0"/><circle cx="50" cy="43" r="5.5" fill="#5b9bf0"/><circle cx="65" cy="43" r="5.5" fill="#5b9bf0"/></svg>)
const IconClock = () => (<svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" aria-hidden><circle cx="50" cy="50" r="32" fill="#ffd76b" stroke="#f4b53a" strokeWidth="3"/><circle cx="50" cy="50" r="23" fill="#fff"/><line x1="50" y1="50" x2="50" y2="33" stroke="#5a4a2a" strokeWidth="4" strokeLinecap="round"/><line x1="50" y1="50" x2="62" y2="55" stroke="#5a4a2a" strokeWidth="4" strokeLinecap="round"/><circle cx="50" cy="50" r="3.2" fill="#5a4a2a"/></svg>)
const IconChart = () => (<svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" aria-hidden><rect x="20" y="58" width="17" height="28" rx="4" fill="#8b5cf6"/><rect x="42" y="46" width="17" height="40" rx="4" fill="#34c759"/><rect x="63" y="32" width="17" height="54" rx="4" fill="#f5b942"/><path d="M18 42 L40 30 L58 37 L84 15" stroke="#3b9ae8" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/></svg>)
const SVG_ICONS: Record<string, () => JSX.Element> = { level2: IconBubble, level6: IconClock, report: IconChart }

export function HomeScreen() {
  const nav = useNav()
  const child = useChildren((s) => s.children.find((c) => c.id === s.activeId) ?? null)
  const prog = useChildren((s) => (s.activeId ? s.progress[s.activeId] : undefined))
  const haptic = useHaptics()
  const [gate, setGate] = useState(false)
  const stats = progressStats(prog)

  const openTile = (cat: Category) => {
    if (!cat.available) return; haptic('tap')
    if (cat.id === 'settings') { setGate(true); return }
    if (cat.screen === 'deck' && cat.deck) nav.go('deck', { deck: cat.deck, title: cat.label })
    else nav.go(cat.screen, { title: cat.label, ...(cat.params ?? {}) })
  }

  return (
    <div className="sw">
      <header className="sw__hdr">
        <span className="sw__stars"><StarIcon size={16} style={{color:'#F6C84C'}} /> {stats.stars}</span>
        <h1 className="sw__title"><BurstIcon size={10} /> الصفحة الرئيسية <BurstIcon size={10} /></h1>
        <button className="sw__welcome" onClick={() => nav.reset('children')} aria-label="تبديل الطفل">
          مرحباً {child?.name ?? ''}
          <span className="sw__ava"><AssetIcon refKey={child?.avatar ?? 'avatars/child_boy_01'} size={34} /></span>
        </button>
      </header>
      <div className="sw__scroll">
        <div className="sw__grid sw__grid--home">
          {categories.map((cat) => {
            const Svg = SVG_ICONS[cat.id]
            return (
              <button key={cat.id} className="hcard" style={{['--ct' as never]: cat.tint ?? '#7c3aed'}} onClick={() => openTile(cat)}>
                <span className="hcard__icon">{Svg ? <Svg /> : <AssetIcon refKey={cat.icon} size={78} />}</span>
                <span className="hcard__label">{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>
      {gate && <TeacherGate onCancel={() => setGate(false)} onUnlock={() => { setGate(false); nav.go('settings') }} />}
    </div>
  )
}
