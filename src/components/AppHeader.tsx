import type { ReactNode } from 'react'
import { useNav } from '@/store/useNavStore'
import { BackIcon, HomeIcon, StarIcon } from '@/lib/icons'

interface Props {
  title: string
  /** Show the home button instead of back. */
  home?: boolean
  stars?: number
  right?: ReactNode
}

export function AppHeader({ title, home, stars, right }: Props) {
  const nav = useNav()
  return (
    <header className="appbar">
      <div className="appbar__group">
        {home ? (
          <button className="iconbtn" aria-label="الرئيسية" onClick={() => nav.reset('home')}>
            <HomeIcon />
          </button>
        ) : (
          <button className="iconbtn" aria-label="رجوع" onClick={() => nav.back()}>
            <BackIcon />
          </button>
        )}
      </div>

      <h1 className="appbar__title">{title}</h1>

      <div className="appbar__group">
        {typeof stars === 'number' && (
          <span className="appbar__stars">
            <StarIcon size={18} style={{ color: 'var(--star)' }} /> {stars}
          </span>
        )}
        {right}
      </div>
    </header>
  )
}
