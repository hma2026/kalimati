import { useEffect } from 'react'
import { useNav } from '@/store/useNavStore'
import { useSettings } from '@/store/useSettingsStore'
import type { ScreenName } from '@/types'

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
import { AdminScreen } from '@/screens/AdminScreen'
import { AppBottomNav } from '@/components/AppBottomNav'

// شاشات تعليمية جديدة
import {
  DailyPhrasesScreen, BodyPartsScreen, HygieneRoutineScreen,
  FamilyPhotosScreen, DialectSelectScreen,
} from '@/screens/educational/NewEducationalScreens'
// شاشات تشغيلية + إعدادات فرعية
import {
  LoadingScreen, OfflineScreen, ErrorScreen, EmptyStateScreen, SuccessScreen,
  ConfirmDeleteScreen, MicPermissionScreen, CameraPermissionScreen,
  CustomPhotoScreen, EditPhotoScreen, PhotoSavedScreen,
  VoiceSettingsScreen, NotificationSettingsScreen, PrivacySettingsScreen, AboutHelpScreen,
} from '@/screens/system/SystemScreens'

/** الشاشات التي يظهر فيها الشريط السفلي الموحّد (شاشات الطفل التعليمية + الرئيسية). */
const BOTTOM_NAV_SCREENS: ReadonlySet<ScreenName> = new Set<ScreenName>([
  'home', 'deck', 'level2', 'level3', 'level4', 'level5', 'level6',
  'letters', 'animals', 'games', 'match', 'calm',
  'dailyPhrases', 'bodyParts', 'hygieneRoutine', 'familyPhotos', 'dialectSelect',
])

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
    case 'admin': view = <AdminScreen />; break
    // ===== شاشات تعليمية جديدة =====
    case 'dailyPhrases': view = <DailyPhrasesScreen />; break
    case 'bodyParts': view = <BodyPartsScreen />; break
    case 'hygieneRoutine': view = <HygieneRoutineScreen />; break
    case 'familyPhotos': view = <FamilyPhotosScreen />; break
    case 'dialectSelect': view = <DialectSelectScreen />; break
    // ===== إعدادات فرعية =====
    case 'voiceSettings': view = <VoiceSettingsScreen />; break
    case 'notificationSettings': view = <NotificationSettingsScreen />; break
    case 'privacySettings': view = <PrivacySettingsScreen />; break
    case 'aboutHelp': view = <AboutHelpScreen />; break
    // ===== شاشات تشغيلية =====
    case 'loading': view = <LoadingScreen />; break
    case 'offline': view = <OfflineScreen />; break
    case 'error': view = <ErrorScreen />; break
    case 'emptyState': view = <EmptyStateScreen />; break
    case 'success': view = <SuccessScreen />; break
    case 'confirmDelete': view = <ConfirmDeleteScreen />; break
    case 'micPermission': view = <MicPermissionScreen />; break
    case 'cameraPermission': view = <CameraPermissionScreen />; break
    case 'customPhoto': view = <CustomPhotoScreen />; break
    case 'editPhoto': view = <EditPhotoScreen />; break
    case 'photoSaved': view = <PhotoSavedScreen />; break
    default: view = <SplashScreen />
  }

  const showNav = BOTTOM_NAV_SCREENS.has(screen)

  return (
    <div className="app">
      <div className="viewport">
        <div className="screen-host">{view}</div>
        {showNav && <AppBottomNav screen={screen} />}
      </div>
    </div>
  )
}
