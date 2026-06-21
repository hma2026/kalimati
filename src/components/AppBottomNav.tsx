import { useState } from 'react'
import { useNav } from '@/store/useNavStore'
import { TeacherGate } from './TeacherGate'
import { HomeIcon, GridIcon, ChatDotsIcon, SparkleIcon, SettingsIcon } from '@/lib/icons'
import type { ScreenName } from '@/types'

type Tab = 'home' | 'words' | 'sentences' | 'games' | 'trainer'

/** الشاشة الحالية -> التبويب النشط (لطيف، غير إلزامي لكل الشاشات). */
const ACTIVE: Partial<Record<ScreenName, Tab>> = {
  home: 'home',
  deck: 'words',
  level2: 'sentences',
  level3: 'sentences',
  level6: 'sentences',
  dailyPhrases: 'sentences',
  games: 'games',
  match: 'games',
  settings: 'trainer',
}

const TABS: { id: Tab; label: string; Icon: typeof HomeIcon }[] = [
  { id: 'home', label: 'الرئيسية', Icon: HomeIcon },
  { id: 'words', label: 'الكلمات', Icon: GridIcon },
  { id: 'sentences', label: 'الجمل', Icon: ChatDotsIcon },
  { id: 'games', label: 'الألعاب', Icon: SparkleIcon },
  { id: 'trainer', label: 'المدرب', Icon: SettingsIcon },
]

/**
 * الشريط السفلي الموحّد لكل شاشات الطفل: الرئيسية | الكلمات | الجمل | الألعاب | المدرب.
 * «المدرب» يمرّ عبر بوابة وليّ الأمر. لا «تقارير» ولا «أنشطة» هنا.
 */
export function AppBottomNav({ screen }: { screen: ScreenName }) {
  const nav = useNav()
  const [gate, setGate] = useState(false)
  const active = ACTIVE[screen]

  const goTab = (t: Tab) => {
    switch (t) {
      case 'home': nav.reset('home'); break
      case 'words': nav.go('deck', { deck: 'words', title: 'الكلمات' }); break
      case 'sentences': nav.go('level2', { title: 'جمل قصيرة' }); break
      case 'games': nav.go('games', { title: 'الألعاب' }); break
      case 'trainer': setGate(true); break
    }
  }

  return (
    <>
      <nav className="appnav" aria-label="التنقّل">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={'appnav__btn' + (active === id ? ' is-active' : '')}
            onClick={() => goTab(id)}
            aria-current={active === id ? 'page' : undefined}
          >
            <span className="appnav__ic"><Icon size={24} /></span>
            <span className="appnav__lbl">{label}</span>
          </button>
        ))}
      </nav>
      {gate && (
        <TeacherGate onCancel={() => setGate(false)} onUnlock={() => { setGate(false); nav.go('settings') }} />
      )}
    </>
  )
}
