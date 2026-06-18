import { useNav } from '@/store/useNavStore'
import { HomeIcon, StarIcon } from '@/lib/icons'
import type { LevelMeta } from '@/data/levelMeta'

export function LevelHeader({ level, stars }: { level: LevelMeta; stars: number }) {
  const nav = useNav()
  return (
    <header className="level-bar">
      <span className="stars-badge">
        <StarIcon size={18} style={{ color: 'var(--star)' }} /> {stars}
        <small>نجوم</small>
      </span>

      <div className="level-title" style={{ background: level.accent }}>
        <strong>{level.title}</strong>
        <span>{level.desc}</span>
      </div>

      <button className="home-mini" aria-label="الرئيسية" onClick={() => nav.reset('home')}>
        <HomeIcon size={22} />
        <small>الرئيسية</small>
      </button>
    </header>
  )
}
