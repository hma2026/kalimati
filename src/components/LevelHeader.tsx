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

      <div
        className={`level-title${level.id === 'level4' || level.id === 'level5' || level.id === 'level6' ? ' level-title--light' : ''}`}
        style={level.id === 'level4' || level.id === 'level5' || level.id === 'level6' ? undefined : { background: level.accent }}
      >
        <strong style={level.id === 'level4' || level.id === 'level5' || level.id === 'level6' ? { color: level.accent } : undefined}>{level.title}</strong>
        <span style={level.id === 'level4' || level.id === 'level5' || level.id === 'level6' ? { color: 'var(--color-muted)' } : undefined}>{level.desc}</span>
      </div>

      <button className="home-mini" aria-label="الرئيسية" onClick={() => nav.reset('home')}>
        <HomeIcon size={22} />
        <small>الرئيسية</small>
      </button>
    </header>
  )
}
