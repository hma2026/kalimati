import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Child, ChildProgress, ItemProgress, Rating } from '@/types'
import { seedChildren } from '@/data/children'

/** نجاح 5 مرات => الكلمة/العبارة "متقنة". */
export const MASTERY_THRESHOLD = 5

function todayKey(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function emptyProgress(): ChildProgress {
  return { items: {}, stars: 0, teacherNote: '', lastSessionAt: null, byDate: {}, favorites: {}, counters: {} }
}

interface ChildrenStore {
  children: Child[]
  activeId: string | null
  progress: Record<string, ChildProgress>

  setActive: (id: string | null) => void
  addChild: (data: Partial<Child> & { name: string; avatar: string }) => string
  updateChild: (id: string, patch: Partial<Child>) => void
  removeChild: (id: string) => void

  recordAttempt: (itemId: string, rating: Rating) => { rewarded: boolean; mastered: boolean }
  setNote: (text: string) => void
  toggleFavorite: (itemId: string) => void
  bumpCounter: (key: string) => void
  addStars: (n: number) => void
  resetChild: (id: string) => void

  replaceAll: (data: { children: Child[]; progress: Record<string, ChildProgress>; activeId: string | null }) => void
}

export const useChildren = create<ChildrenStore>()(
  persist(
    (set, get) => ({
      children: seedChildren.map((c) => ({ ...c, createdAt: c.createdAt || Date.now() })),
      activeId: null,
      progress: {},

      setActive: (id) => set({ activeId: id }),

      addChild: (data) => {
        const id = `c_${Date.now().toString(36)}`
        const child: Child = {
          id,
          name: data.name.trim(),
          avatar: data.avatar,
          age: data.age,
          gender: data.gender ?? 'boy',
          dialectId: data.dialectId,
          createdAt: Date.now(),
        }
        set((s) => ({
          children: [...s.children, child],
          progress: { ...s.progress, [id]: emptyProgress() },
        }))
        return id
      },

      updateChild: (id, patch) =>
        set((s) => ({ children: s.children.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),

      removeChild: (id) =>
        set((s) => {
          const { [id]: _drop, ...restProgress } = s.progress
          return {
            children: s.children.filter((c) => c.id !== id),
            progress: restProgress,
            activeId: s.activeId === id ? null : s.activeId,
          }
        }),

      recordAttempt: (itemId, rating) => {
        const { activeId } = get()
        if (!activeId) return { rewarded: false, mastered: false }
        const now = Date.now()
        const positive = rating === 'great' || rating === 'good'

        let mastered = false
        set((s) => {
          const prog = { ...(s.progress[activeId] ?? emptyProgress()) }
          const prev: ItemProgress = prog.items[itemId] ?? {
            attempts: 0, successes: 0, mastered: false, lastTriedAt: 0,
          }
          const successes = prev.successes + (positive ? 1 : 0)
          mastered = prev.mastered || successes >= MASTERY_THRESHOLD
          prog.items = {
            ...prog.items,
            [itemId]: { attempts: prev.attempts + 1, successes, mastered, lastTriedAt: now },
          }
          const tk = todayKey()
          prog.byDate = { ...prog.byDate, [tk]: (prog.byDate[tk] ?? 0) + 1 }
          prog.lastSessionAt = now
          if (positive) prog.stars += 1
          return { progress: { ...s.progress, [activeId]: prog } }
        })
        return { rewarded: positive, mastered }
      },

      setNote: (text) => {
        const { activeId } = get()
        if (!activeId) return
        set((s) => {
          const prog = { ...(s.progress[activeId] ?? emptyProgress()), teacherNote: text }
          return { progress: { ...s.progress, [activeId]: prog } }
        })
      },

      toggleFavorite: (itemId) => {
        const { activeId } = get()
        if (!activeId) return
        set((s) => {
          const prog = { ...(s.progress[activeId] ?? emptyProgress()) }
          const fav = { ...prog.favorites }
          if (fav[itemId]) delete fav[itemId]
          else fav[itemId] = true
          prog.favorites = fav
          return { progress: { ...s.progress, [activeId]: prog } }
        })
      },

      bumpCounter: (key) => {
        const { activeId } = get()
        if (!activeId) return
        set((s) => {
          const prog = { ...(s.progress[activeId] ?? emptyProgress()) }
          prog.counters = { ...prog.counters, [key]: (prog.counters?.[key] ?? 0) + 1 }
          return { progress: { ...s.progress, [activeId]: prog } }
        })
      },

      addStars: (n) => {
        const { activeId } = get()
        if (!activeId) return
        set((s) => {
          const prog = { ...(s.progress[activeId] ?? emptyProgress()) }
          prog.stars += n
          prog.lastSessionAt = Date.now()
          return { progress: { ...s.progress, [activeId]: prog } }
        })
      },

      resetChild: (id) => set((s) => ({ progress: { ...s.progress, [id]: emptyProgress() } })),

      replaceAll: (data) =>
        set({ children: data.children, progress: data.progress, activeId: data.activeId }),
    }),
    {
      name: 'kalimati.children.v1',
      migrate: (persisted) => {
        const state = persisted as { progress?: Record<string, ChildProgress> }
        if (state?.progress) {
          for (const k of Object.keys(state.progress)) {
            if (!state.progress[k].favorites) state.progress[k].favorites = {}
            if (!state.progress[k].counters) state.progress[k].counters = {}
          }
        }
        return state as never
      },
      version: 3,
    },
  ),
)

// ---- Selectors / derived stats ----
export function activeChild() {
  const { children, activeId } = useChildren.getState()
  return children.find((c) => c.id === activeId) ?? null
}

export function progressStats(p: ChildProgress | undefined) {
  const items = Object.values(p?.items ?? {})
  const mastered = items.filter((i) => i.mastered).length
  const inTraining = items.filter((i) => i.attempts > 0 && !i.mastered).length
  const attemptsToday = p?.byDate[todayKey()] ?? 0
  const total = mastered + inTraining
  const percent = total === 0 ? 0 : Math.round((mastered / total) * 100)
  return { mastered, inTraining, attemptsToday, percent, stars: p?.stars ?? 0 }
}

/** Stats limited to item ids that start with a level prefix (e.g. "l3_"). */
export function statsForPrefix(p: ChildProgress | undefined, prefix: string) {
  const entries = Object.entries(p?.items ?? {}).filter(([id]) => id.startsWith(prefix))
  const items = entries.map(([, v]) => v)
  const mastered = items.filter((i) => i.mastered).length
  const inTraining = items.filter((i) => i.attempts > 0 && !i.mastered).length
  const attempts = items.reduce((a, i) => a + i.attempts, 0)
  const successes = items.reduce((a, i) => a + i.successes, 0)
  const total = mastered + inTraining
  const percent = total === 0 ? 0 : Math.round((mastered / total) * 100)
  return { mastered, inTraining, attempts, successes, percent, entries }
}

export { todayKey }
