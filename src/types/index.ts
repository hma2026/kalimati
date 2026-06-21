// ===== Domain types for كلمة كلمة =====

/** A single communication card (word / emotion / need / color / shape). */
export interface WordCard {
  id: string
  label: string
  /** Emoji placeholder OR an image URL (data URL for parent-uploaded photos). */
  image: string
  /** مفتاح أصل من assetRegistry (يُعرض عبر mediaVisual بدل image). */
  media?: string
  /** Optional override speech text (defaults to label). */
  say?: string
  /** Optional CSS color (used by color cards). */
  color?: string
}

/** A library category shown on the Home grid. */
export interface Category {
  id: string
  label: string
  icon: string
  screen: ScreenName
  deck?: DeckId
  available: boolean
  /** Extra params passed to the target screen (e.g. an initial tab). */
  params?: Record<string, unknown>
  tint?: string
}

export type DeckId = 'words' | 'emotions' | 'needs' | 'colors' | 'shapes'

export interface Letter {
  id: string
  glyph: string
  sound: string
  say: string
  examples: WordCard[]
}

// ===== Dialect / profile =====
export type DialectId =
  | 'hijazi' | 'najdi' | 'sharqi' | 'fusha' | 'masri' | 'shami' | 'iraqi' | 'custom'
export type Gender = 'boy' | 'girl'
export type Difficulty = 'very_easy' | 'easy' | 'medium'

/** The minimum needed to build dialect-aware text for a child. */
export interface ChildProfile {
  dialectId: DialectId
  gender: Gender
  customRequestWord?: string
}

export interface Child {
  id: string
  name: string
  /** Emoji avatar or image data URL. */
  avatar: string
  age?: number
  gender?: Gender
  dialectId?: DialectId
  createdAt: number
}

export type Rating = 'great' | 'good' | 'retry'

export interface ItemProgress {
  attempts: number
  successes: number
  mastered: boolean
  lastTriedAt: number
}

export interface ChildProgress {
  /** keyed by item/word id */
  items: Record<string, ItemProgress>
  stars: number
  teacherNote: string
  lastSessionAt: number | null
  /** 'YYYY-MM-DD' -> attempts that day */
  byDate: Record<string, number>
  /** favorite phrase ids (Level 3) */
  favorites: Record<string, true>
  /** misc counters (e.g. animalSoundPlays) */
  counters: Record<string, number>
}

export type ScreenName =
  | 'splash'
  | 'children'
  | 'home'
  | 'deck'
  | 'level2'
  | 'level3'
  | 'level4'
  | 'level5'
  | 'level6'
  | 'letters'
  | 'animals'
  | 'games'
  | 'match'
  | 'calm'
  | 'report'
  | 'settings'
  // ===== شاشات تعليمية جديدة =====
  | 'dailyPhrases'
  | 'bodyParts'
  | 'hygieneRoutine'
  | 'familyPhotos'
  | 'dialectSelect'
  // ===== إعدادات فرعية =====
  | 'voiceSettings'
  | 'notificationSettings'
  | 'privacySettings'
  | 'aboutHelp'
  // ===== شاشات تشغيلية =====
  | 'loading'
  | 'offline'
  | 'error'
  | 'emptyState'
  | 'success'
  | 'confirmDelete'
  | 'micPermission'
  | 'cameraPermission'
  | 'customPhoto'
  | 'editPhoto'
  | 'photoSaved'

export interface NavState {
  screen: ScreenName
  params: Record<string, unknown>
}

// ===== Settings =====
export type HapticLevel = 'light' | 'medium' | 'strong'
export type SensoryMode = 'normal' | 'calm' | 'sensitive'
export type FontScale = 'normal' | 'large' | 'xlarge'
export type CardsPerPage = 2 | 4 | 6 | 8

export type GameType = 'color' | 'animal' | 'word' | 'sound'
export type MatchDifficulty = 'very_easy' | 'easy' | 'medium' | 'advanced'
export type GameCardCount = 4 | 6 | 8 | 12
export type PreviewSeconds = 2 | 4 | 6
export type ColorDisplayMode = 'lesson' | 'square' | 'circle'

export interface Settings {
  soundEnabled: boolean
  speechEnabled: boolean
  disableLoudSounds: boolean
  hapticsEnabled: boolean
  hapticLevel: HapticLevel
  reduceMotion: boolean
  rewardsEnabled: boolean
  sensoryMode: SensoryMode
  fontScale: FontScale
  cardsPerPage: CardsPerPage
  /** default dialect for new children / fallback */
  selectedDialect: DialectId
  /** Level 6 daily-phrase controls */
  dailyPhrasesDifficulty: Difficulty
  religiousPhrasesEnabled: boolean
  /** Animals & games */
  animalSoundsEnabled: boolean
  gamesEnabled: boolean
  gameCardCount: GameCardCount
  gamePreviewSeconds: PreviewSeconds
  /** how color items render inside games (default = same as the lesson) */
  colorDisplayMode: ColorDisplayMode
  /** 4-digit teacher gate PIN, or null when not set. */
  pin: string | null
}
