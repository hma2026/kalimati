import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Settings, SensoryMode } from '@/types'

const defaults: Settings = {
  soundEnabled: true,
  speechEnabled: true,
  disableLoudSounds: false,
  hapticsEnabled: true,
  hapticLevel: 'medium',
  reduceMotion: false,
  rewardsEnabled: true,
  sensoryMode: 'normal',
  fontScale: 'normal',
  cardsPerPage: 6,
  selectedDialect: 'hijazi',
  dailyPhrasesDifficulty: 'very_easy',
  religiousPhrasesEnabled: true,
  animalSoundsEnabled: true,
  gamesEnabled: true,
  gameCardCount: 8,
  gamePreviewSeconds: 4,
  colorDisplayMode: 'lesson',
  pin: null,
}

interface SettingsStore extends Settings {
  update: <K extends keyof Settings>(key: K, value: Settings[K]) => void
  applySensory: (mode: SensoryMode) => void
  reset: () => void
}

/** Apply a sensory preset by mutating the concrete flags (transparent + editable). */
function presetFor(mode: SensoryMode): Partial<Settings> {
  switch (mode) {
    case 'calm':
      return { reduceMotion: true, disableLoudSounds: true, hapticLevel: 'light', soundEnabled: true, hapticsEnabled: true }
    case 'sensitive':
      return { reduceMotion: true, disableLoudSounds: true, hapticsEnabled: false, soundEnabled: false, hapticLevel: 'light' }
    case 'normal':
    default:
      return { reduceMotion: false, disableLoudSounds: false, hapticsEnabled: true, soundEnabled: true, hapticLevel: 'medium' }
  }
}

export const useSettings = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaults,
      update: (key, value) => set({ [key]: value } as Partial<Settings>),
      applySensory: (mode) => set({ sensoryMode: mode, ...presetFor(mode) }),
      reset: () => set({ ...defaults }),
    }),
    { name: 'kalimati.settings.v1' },
  ),
)
