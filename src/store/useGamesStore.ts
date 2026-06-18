import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GameType, MatchDifficulty } from '@/types'

export interface GameProgress {
  totalPlayed: number
  totalCompleted: number
  bestScore: number
  bestTimeMs: number | null
  lastPlayedAt: number | null
  itemCounts: Record<string, number>
}

function emptyGP(): GameProgress {
  return { totalPlayed: 0, totalCompleted: 0, bestScore: 0, bestTimeMs: null, lastPlayedAt: null, itemCounts: {} }
}

interface GamesStore {
  // progress[childId][gameType]
  progress: Record<string, Partial<Record<GameType, GameProgress>>>
  startGame: (childId: string, type: GameType) => void
  recordMatch: (childId: string, type: GameType, itemKey: string) => void
  completeGame: (childId: string, type: GameType, score: number, timeMs: number) => void
  resetChild: (childId: string) => void
}

export const useGames = create<GamesStore>()(
  persist(
    (set) => ({
      progress: {},

      startGame: (childId, type) =>
        set((s) => {
          const forChild = { ...(s.progress[childId] ?? {}) }
          const gp = { ...(forChild[type] ?? emptyGP()) }
          gp.totalPlayed += 1
          gp.lastPlayedAt = Date.now()
          forChild[type] = gp
          return { progress: { ...s.progress, [childId]: forChild } }
        }),

      recordMatch: (childId, type, itemKey) =>
        set((s) => {
          const forChild = { ...(s.progress[childId] ?? {}) }
          const gp = { ...(forChild[type] ?? emptyGP()) }
          gp.itemCounts = { ...gp.itemCounts, [itemKey]: (gp.itemCounts[itemKey] ?? 0) + 1 }
          forChild[type] = gp
          return { progress: { ...s.progress, [childId]: forChild } }
        }),

      completeGame: (childId, type, score, timeMs) =>
        set((s) => {
          const forChild = { ...(s.progress[childId] ?? {}) }
          const gp = { ...(forChild[type] ?? emptyGP()) }
          gp.totalCompleted += 1
          gp.bestScore = Math.max(gp.bestScore, score)
          gp.bestTimeMs = gp.bestTimeMs == null ? timeMs : Math.min(gp.bestTimeMs, timeMs)
          gp.lastPlayedAt = Date.now()
          forChild[type] = gp
          return { progress: { ...s.progress, [childId]: forChild } }
        }),

      resetChild: (childId) =>
        set((s) => {
          const { [childId]: _drop, ...rest } = s.progress
          return { progress: rest }
        }),
    }),
    { name: 'kalimati.games.v1' },
  ),
)

export const CARD_COUNT: Record<MatchDifficulty, number> = {
  very_easy: 4, easy: 6, medium: 8, advanced: 12,
}

/** Summary across both game types for the report screen. */
export function gamesSummary(progress: GamesStore['progress'], childId: string | null) {
  const forChild = childId ? progress[childId] ?? {} : {}
  const types = Object.entries(forChild) as [GameType, GameProgress][]
  const totalPlayed = types.reduce((a, [, g]) => a + g.totalPlayed, 0)
  const totalCompleted = types.reduce((a, [, g]) => a + g.totalCompleted, 0)
  const bestScore = types.reduce((a, [, g]) => Math.max(a, g.bestScore), 0)
  const lastPlayedAt = types.reduce<number | null>((a, [, g]) => Math.max(a ?? 0, g.lastPlayedAt ?? 0) || null, null)
  const favType = [...types].sort((a, b) => b[1].totalPlayed - a[1].totalPlayed)[0]?.[0]
  // favorite item across all types
  const allCounts: Record<string, number> = {}
  for (const [, g] of types) for (const [k, n] of Object.entries(g.itemCounts)) allCounts[k] = (allCounts[k] ?? 0) + n
  const favItem = Object.entries(allCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
  return { totalPlayed, totalCompleted, bestScore, lastPlayedAt, favType, favItem }
}
