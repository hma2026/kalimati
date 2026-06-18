import { useNav } from '@/store/useNavStore'
import { LEVELS, levelIndex } from '@/data/levelMeta'
import { HomeIcon, ChevRight, ChevLeft } from '@/lib/icons'

export function LevelNav({ levelId, accent }: { levelId: string; accent: string }) {
  const nav = useNav()
  const idx = levelIndex(levelId)
  const inSeq = idx >= 0
  const prev = inSeq ? LEVELS[idx - 1] : undefined
  const next = inSeq ? LEVELS[idx + 1] : undefined

  return (
    <nav className="level-nav">
      <button
        className="nav-side"
        disabled={!next}
        onClick={() => next && nav.go(next.id, { title: next.title })}
      >
        <ChevRight size={20} /> التالي
      </button>

      <button className="home-pill" style={{ background: accent }} onClick={() => nav.reset('home')}>
        <HomeIcon size={20} /> الرئيسية
      </button>

      <button
        className="nav-side"
        disabled={!prev}
        onClick={() => prev && nav.go(prev.id, { title: prev.title })}
      >
        السابق <ChevLeft size={20} />
      </button>
    </nav>
  )
}
