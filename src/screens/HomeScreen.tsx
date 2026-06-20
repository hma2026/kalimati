import { useState } from 'react'
import { useNav } from '@/store/useNavStore'
import { useChildren, progressStats } from '@/store/useChildrenStore'
import { useSpeech } from '@/hooks/useSpeech'
import { useHaptics } from '@/hooks/useHaptics'
import { TeacherGate } from '@/components/TeacherGate'
import { categories } from '@/data/categories'
import type { Category } from '@/types'
import { HeartIcon, StarIcon } from '@/lib/icons'
import { AssetIcon } from '@/components/AssetIcon'

export function HomeScreen() {
  const nav = useNav()
  const child = useChildren((s) => s.children.find((c) => c.id === s.activeId) ?? null)
  const prog = useChildren((s) => (s.activeId ? s.progress[s.activeId] : undefined))
  const speak = useSpeech().speak
  const haptic = useHaptics()
  const [gate, setGate] = useState(false)

  const stats = progressStats(prog)

  const openTile = (cat: Category) => {
    if (!cat.available) return
    haptic('tap')
    if (cat.id === 'settings') { setGate(true); return }            // settings is behind the teacher gate
    if (cat.screen === 'deck' && cat.deck) nav.go('deck', { deck: cat.deck, title: cat.label })
    else nav.go(cat.screen, { title: cat.label, ...(cat.params ?? {}) })
  }

  const emergency = () => { haptic('success'); speak('أحتاج مساعدة') }

  return (
    <div className="screen">
      <header className="appbar">
        <button className="iconbtn" aria-label="تبديل الطفل" onClick={() => nav.reset('children')}>
          <AssetIcon refKey={child?.avatar ?? 'avatars/child_boy_01'} size={34} />
        </button>
        <h1 className="appbar__title">{child ? `أهلاً ${child.name}` : 'كلمة كلمة'}</h1>
        <span className="appbar__stars"><StarIcon size={18} style={{ color: 'var(--star)' }} /> {stats.stars}</span>
      </header>

      <button className="btn btn--lg" onClick={emergency}
        style={{ background: '#FFF3E0', color: '#9A4B00', border: '2px solid #FFE0B2', boxShadow: 'none' }}>
        <HeartIcon size={22} style={{ color: '#F08C00' }} /> أحتاج مساعدة
      </button>

      <div className="tiles screen__scroll" style={{ alignContent: 'start', paddingBottom: 4 }}>
        {categories.map((cat) => {
          const desc = cat.params?.desc as string | undefined
          if (cat.tint) {
            return (
              <button key={cat.id} className="tile tile--level" style={{ background: cat.tint, color: '#fff' }} onClick={() => openTile(cat)}>
                <span className="tile__num" aria-hidden>{cat.icon}</span>
                <span className="tile__label" style={{ color: '#fff' }}>{cat.label}</span>
                {desc && <span className="tile__desc">{desc}</span>}
              </button>
            )
          }
          return (
            <button key={cat.id} className={`tile${cat.available ? '' : ' tile--soon'}`} onClick={() => openTile(cat)} aria-disabled={!cat.available}>
              {!cat.available && <span className="badge-soon">قريباً</span>}
              {cat.icon.includes('/') ? <AssetIcon refKey={cat.icon} size={52} className="tile__img" /> : <span className="tile__icon" aria-hidden>{cat.icon}</span>}
              <span className="tile__label">{cat.label}</span>
            </button>
          )
        })}
      </div>

      {gate && (
        <TeacherGate onCancel={() => setGate(false)} onUnlock={() => { setGate(false); nav.go('settings') }} />
      )}
    </div>
  )
}
