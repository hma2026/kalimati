import { useChildren } from '@/store/useChildrenStore'
import { useSettings } from '@/store/useSettingsStore'
import type { Child, ChildProgress, Settings } from '@/types'

interface BackupFile {
  app: 'kalimati'
  version: 1
  exportedAt: string
  children: Child[]
  activeId: string | null
  progress: Record<string, ChildProgress>
  settings: Settings
}

export function exportAll(): string {
  const c = useChildren.getState()
  const s = useSettings.getState()
  const { update, applySensory, reset, ...settings } = s
  const payload: BackupFile = {
    app: 'kalimati',
    version: 1,
    exportedAt: new Date().toISOString(),
    children: c.children,
    activeId: c.activeId,
    progress: c.progress,
    settings,
  }
  return JSON.stringify(payload, null, 2)
}

export function downloadBackup() {
  const blob = new Blob([exportAll()], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `kalimati-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

export function importBackup(json: string): { ok: boolean; error?: string } {
  try {
    const data = JSON.parse(json) as Partial<BackupFile>
    if (data.app !== 'kalimati' || !Array.isArray(data.children)) {
      return { ok: false, error: 'الملف غير متوافق مع كلمة كلمة' }
    }
    useChildren.getState().replaceAll({
      children: data.children,
      progress: data.progress ?? {},
      activeId: data.activeId ?? null,
    })
    if (data.settings) {
      const s = useSettings.getState()
      ;(Object.keys(data.settings) as (keyof Settings)[]).forEach((k) =>
        s.update(k, (data.settings as Settings)[k] as never),
      )
    }
    return { ok: true }
  } catch {
    return { ok: false, error: 'تعذّر قراءة الملف' }
  }
}
