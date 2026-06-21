import { create } from 'zustand'
import type { ScreenName, NavState } from '@/types'

interface NavStore extends NavState {
  history: NavState[]
  go: (screen: ScreenName, params?: Record<string, unknown>) => void
  back: () => void
  reset: (screen: ScreenName) => void
}

/* حفظ/استعادة آخر شاشة عبر sessionStorage — حتى لا يعود التطبيق للبداية بعد إعادة التحميل/النشر */
const NAV_KEY = 'hma_nav_state'

function loadInitial(): { screen: ScreenName; params: Record<string, unknown> } {
  try {
    const raw = sessionStorage.getItem(NAV_KEY)
    if (raw) {
      const v = JSON.parse(raw)
      if (v && typeof v.screen === 'string' && v.screen !== 'splash') {
        return { screen: v.screen as ScreenName, params: v.params ?? {} }
      }
    }
  } catch { /* تجاهل */ }
  return { screen: 'splash', params: {} }
}

function persist(screen: ScreenName, params: Record<string, unknown>) {
  try { sessionStorage.setItem(NAV_KEY, JSON.stringify({ screen, params })) } catch { /* تجاهل */ }
}

const initial = loadInitial()

export const useNav = create<NavStore>((set, get) => ({
  screen: initial.screen,
  params: initial.params,
  history: [],
  go: (screen, params = {}) =>
    set((s) => {
      persist(screen, params)
      return { history: [...s.history, { screen: s.screen, params: s.params }], screen, params }
    }),
  back: () => {
    const { history } = get()
    if (history.length === 0) {
      // لا سجلّ (شاشة مُستعادة بعد إعادة تحميل) → ارجع للرئيسية بدل لا شيء
      persist('home', {})
      set({ screen: 'home', params: {} })
      return
    }
    const prev = history[history.length - 1]
    persist(prev.screen, prev.params)
    set({ screen: prev.screen, params: prev.params, history: history.slice(0, -1) })
  },
  reset: (screen) => { persist(screen, {}); set({ screen, params: {}, history: [] }) },
}))
