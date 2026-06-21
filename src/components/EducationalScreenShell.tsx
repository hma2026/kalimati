import type { ReactNode } from 'react'
import { useNav } from '@/store/useNavStore'
import { useChildren, progressStats } from '@/store/useChildrenStore'
import { HomeIcon, StarIcon, BackIcon } from '@/lib/icons'

/**
 * قاعدة Style 1 الموحّدة للشاشات التعليمية:
 * RTL، ترويسة بسيطة (رجوع + عنوان كبير + نجوم + الرئيسية)، عنوان بنفسجي، وصف قصير،
 * محتوى قابل للتمرير. الشريط السفلي الموحّد يُعرض عالمياً من App (لا يُكرّر هنا).
 * بلا Dashboard، بلا شريط جانبي، بلا إحصائيات/Charts/Tips.
 */
export function EducationalScreenShell({
  title,
  subtitle,
  accent = 'var(--primary)',
  children,
  topAction,
  showStars = true,
}: {
  title: string
  subtitle?: string
  accent?: string
  children: ReactNode
  topAction?: ReactNode
  showStars?: boolean
}) {
  const nav = useNav()
  const prog = useChildren((s) => (s.activeId ? s.progress[s.activeId] : undefined))
  const stars = progressStats(prog).stars
  return (
    <div className="screen edu" style={{ ['--accent' as string]: accent }}>
      <header className="edu-head">
        <button className="edu-head__btn" aria-label="رجوع" onClick={() => nav.back()}>
          <BackIcon size={22} />
        </button>
        <div className="edu-head__mid">
          <h1 className="edu-title">{title}</h1>
          {subtitle && <p className="edu-sub">{subtitle}</p>}
        </div>
        <div className="edu-head__side">
          {showStars && (
            <span className="edu-stars">
              <StarIcon size={16} style={{ color: 'var(--star)' }} /> {stars}
            </span>
          )}
          {topAction}
          <button className="edu-head__btn" aria-label="الرئيسية" onClick={() => nav.reset('home')}>
            <HomeIcon size={20} />
          </button>
        </div>
      </header>

      <div className="screen__scroll edu-scroll">{children}</div>
    </div>
  )
}
