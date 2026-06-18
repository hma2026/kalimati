import { useEffect } from 'react'
import { useNav } from '@/store/useNavStore'
import { useSettings } from '@/store/useSettingsStore'

import { SplashScreen } from '@/screens/SplashScreen'
import { ChildSelectScreen } from '@/screens/ChildSelectScreen'
import { HomeScreen } from '@/screens/HomeScreen'
import { CardGridScreen } from '@/screens/CardGridScreen'
import { LevelTwoScreen } from '@/screens/LevelTwoScreen'
import { LevelThreeScreen } from '@/screens/LevelThreeScreen'
import { LevelFourScreen } from '@/screens/LevelFourScreen'
import { LevelFiveScreen } from '@/screens/LevelFiveScreen'
import { LevelSixScreen } from '@/screens/LevelSixScreen'
import { LetterScreen } from '@/screens/LetterScreen'
import { AnimalsScreen } from '@/screens/AnimalsScreen'
import { GamesScreen } from '@/screens/GamesScreen'
import { MatchingGameScreen } from '@/screens/MatchingGameScreen'
import { CalmScreen } from '@/screens/CalmScreen'
import { ReportScreen } from '@/screens/ReportScreen'
import { SettingsScreen } from '@/screens/SettingsScreen'

export default function App() {
  const screen = useNav((s) => s.screen)
  const fontScale = useSettings((s) => s.fontScale)
  const reduceMotion = useSettings((s) => s.reduceMotion)

  useEffect(() => { document.documentElement.dataset.font = fontScale }, [fontScale])
  useEffect(() => { document.documentElement.classList.toggle('no-motion', reduceMotion) }, [reduceMotion])

  let view
  switch (screen) {
    case 'splash': view = <SplashScreen />; break
    case 'children': view = <ChildSelectScreen />; break
    case 'home': view = <HomeScreen />; break
    case 'deck': view = <CardGridScreen />; break
    case 'level2': view = <LevelTwoScreen />; break
    case 'level3': view = <LevelThreeScreen />; break
    case 'level4': view = <LevelFourScreen />; break
    case 'level5': view = <LevelFiveScreen />; break
    case 'level6': view = <LevelSixScreen />; break
    case 'letters': view = <LetterScreen />; break
    case 'animals': view = <AnimalsScreen />; break
    case 'games': view = <GamesScreen />; break
    case 'match': view = <MatchingGameScreen />; break
    case 'calm': view = <CalmScreen />; break
    case 'report': view = <ReportScreen />; break
    case 'settings': view = <SettingsScreen />; break
    default: view = <SplashScreen />
  }

  return (
    <div className="app">
      <div className="viewport">{view}</div>
    </div>
  )
}
