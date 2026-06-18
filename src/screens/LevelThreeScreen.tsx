import { useState } from 'react'
import { useChildren, progressStats, statsForPrefix } from '@/store/useChildrenStore'
import { useSettings } from '@/store/useSettingsStore'
import { useHaptics } from '@/hooks/useHaptics'
import { LevelHeader } from '@/components/LevelHeader'
import { LevelNav } from '@/components/LevelNav'
import { PhraseCard } from '@/components/PhraseCard'
import { SelectedPracticePanel } from '@/components/SelectedPracticePanel'
import { ProgressCard } from '@/components/ProgressCard'
import { mediaVisual } from '@/components/Media'
import { Disclaimer } from '@/components/Disclaimer'
import { formatSession } from '@/lib/format'
import { levelById } from '@/data/levelMeta'
import { L3_PHRASES } from '@/data/levelContent'
import { profileOf } from '@/data/dialects'

export function LevelThreeScreen() {
  const level = levelById('level3')!
  const child = useChildren((s) => s.children.find((c) => c.id === s.activeId) ?? null)
  const prog = useChildren((s) => (s.activeId ? s.progress[s.activeId] : undefined))
  const toggleFavorite = useChildren((s) => s.toggleFavorite)
  const fallback = useSettings((s) => s.selectedDialect)
  const haptic = useHaptics()
  const [sel, setSel] = useState<string>('water_cold')

  const profile = profileOf(child, fallback)
  const stars = progressStats(prog).stars
  const ls = statsForPrefix(prog, 'l3_')

  const selItem = L3_PHRASES.find((p) => p.key === sel) ?? L3_PHRASES[0]

  return (
    <div className="screen level" style={{ ['--accent' as string]: level.accent, background: level.soft }}>
      <LevelHeader level={level} stars={stars} />

      <div className="l3-head">اختر جملة للتدرب</div>

      <div className="screen__scroll stack">
        <div className="phrase-list">
          {L3_PHRASES.map((p) => (
            <PhraseCard
              key={p.key}
              text={p.build(profile)}
              visual={mediaVisual(p.media, 46)}
              selected={sel === p.key}
              favorite={!!prog?.favorites[`l3_${p.key}`]}
              accent={level.accent}
              onClick={() => { setSel(p.key); haptic('sentence') }}
              onToggleFav={() => toggleFavorite(`l3_${p.key}`)}
            />
          ))}
        </div>

        <div className="l3-bottom">
          <SelectedPracticePanel
            itemId={`l3_${selItem.key}`}
            text={selItem.build(profile)}
            accent={level.accent}
            visual={mediaVisual(selItem.media, 64)}
          />
          <ProgressCard
            accent={level.accent}
            percent={ls.percent}
            mastered={ls.mastered}
            inTraining={ls.inTraining}
            lastSession={formatSession(prog?.lastSessionAt ?? null)}
          />
        </div>
      </div>

      <LevelNav levelId="level3" accent={level.accent} />
      <Disclaimer />
    </div>
  )
}
