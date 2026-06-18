import { useNav } from '@/store/useNavStore'
import { HomeIcon, StarIcon } from '@/lib/icons'

interface Props {
  title: string
  desc: string
  accent: string
  stars: number
}

export function SectionHeader({ title, desc, accent, stars }: Props) {
  const nav = useNav()
  return (
    <header className="level-bar">
      <span className="stars-badge">
        <StarIcon size={18} style={{ color: 'var(--star)' }} /> {stars}
        <small>نجوم</small>
      </span>
      <div className="level-title" style={{ background: accent }}>
        <strong>{title}</strong>
        <span>{desc}</span>
      </div>
      <button className="home-mini" aria-label="الرئيسية" onClick={() => nav.reset('home')}>
        <HomeIcon size={22} />
        <small>الرئيسية</small>
      </button>
    </header>
  )
}
