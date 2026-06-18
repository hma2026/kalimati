import { create } from 'zustand'
import type { ScreenName, NavState } from '@/types'

interface NavStore extends NavState {
  history: NavState[]
  go: (screen: ScreenName, params?: Record<string, unknown>) => void
  back: () => void
  reset: (screen: ScreenName) => void
}

export const useNav = create<NavStore>((set, get) => ({
  screen: 'splash',
  params: {},
  history: [],
  go: (screen, params = {}) =>
    set((s) => ({
      history: [...s.history, { screen: s.screen, params: s.params }],
      screen,
      params,
    })),
  back: () => {
    const { history } = get()
    if (history.length === 0) return
    const prev = history[history.length - 1]
    set({ screen: prev.screen, params: prev.params, history: history.slice(0, -1) })
  },
  reset: (screen) => set({ screen, params: {}, history: [] }),
}))
