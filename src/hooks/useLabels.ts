import { create } from 'zustand'

interface LabelStore {
  overrides: Record<string, string>
  loaded: boolean
  load: () => Promise<void>
  getLabel: (key: string, fallback: string) => string
}

/**
 * مخزن المسمّيات المعدّلة من لوحة التحكم.
 * يُحمّل مرة واحدة عند بدء التطبيق.
 * getLabel(key, fallback) يُرجع المسمّى المعدّل إن وُجد، وإلا الافتراضي.
 */
export const useLabels = create<LabelStore>((set, get) => ({
  overrides: {},
  loaded: false,
  load: async () => {
    if (get().loaded) return
    try {
      const r = await fetch('/api/labels')
      const d = await r.json()
      if (d.ok && d.labels) set({ overrides: d.labels, loaded: true })
      else set({ loaded: true })
    } catch {
      set({ loaded: true })
    }
  },
  getLabel: (key, fallback) => get().overrides[key] ?? fallback,
}))
