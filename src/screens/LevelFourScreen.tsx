import { useState } from 'react'
import { useNav } from '@/store/useNavStore'
import { useChildren, progressStats } from '@/store/useChildrenStore'
import { useSettings } from '@/store/useSettingsStore'
import { useSpeech } from '@/hooks/useSpeech'
import { useHaptics } from '@/hooks/useHaptics'
import { LevelHeader } from '@/components/LevelHeader'
import { LevelNav } from '@/components/LevelNav'
import { CategoryTabs } from '@/components/CategoryTabs'
import { PictureCard } from '@/components/PictureCard'
import { SelectedPracticePanel } from '@/components/SelectedPracticePanel'
import { mediaVisual } from '@/components/Media'
import { Disclaimer } from '@/components/Disclaimer'
import { levelById } from '@/data/levelMeta'
import { L4_FEELINGS, L4_PAIN, L4_CALM } from '@/data/levelContent'
import { buildEmotionPhrase, buildPainPhrase, buildCalmPhrase, profileOf } from '@/data/dialects'

type Tab = 'feelings' | 'pain' | 'calm'

export function LevelFourScreen() {
  const level = levelById('level4')!
  const nav = useNav()
  const child = useChildren((s) => s.children.find((c) => c.id === s.activeId) ?? null)
  const prog = useChildren((s) => (s.activeId ? s.progress[s.activeId] : undefined))
  const fallback = useSettings((s) => s.selectedDialect)
  const { speak } = useSpeech()
  const haptic = useHaptics()

  const initial = (nav.params.tab as Tab) || 'feelings'
  const [tab, setTab] = useState<Tab>(initial)
  const [sel, setSel] = useState<string | null>(null)

  const profile = profileOf(child, fallback)
  const stars = progressStats(prog).stars

  const cards = tab === 'feelings' ? L4_FEELINGS : tab === 'pain' ? L4_PAIN : L4_CALM
  const build = (key: string) =>
    tab === 'feelings' ? buildEmotionPhrase(key, profile)
      : tab === 'pain' ? buildPainPhrase(key, profile)
        : buildCalmPhrase(key, profile)

  const pick = (key: string) => { setSel(key); haptic('tap'); speak(build(key)) }
  const idPrefix = `l4_${tab}_`

  return (
    <div className="screen level" style={{ ['--accent' as string]: level.accent, background: level.soft }}>
      <LevelHeader level={level} stars={stars} />

      <CategoryTabs
        accent={level.accent}
        active={tab}
        onChange={(t) => { setTab(t as Tab); setSel(null) }}
        tabs={[
          { id: 'feelings', label: 'مشاعر' },
          { id: 'pain', label: 'ألم' },
          { id: 'calm', label: 'تهدئة' },
        ]}
      />

      <div className="screen__scroll stack">
        <div className="card-grid" data-cols={3}>
          {cards.map((c) => (
            <PictureCard
              key={c.key}
              visual={mediaVisual(c.media, 52)}
              label={build(c.key)}
              selected={sel === c.key}
              accent={level.accent}
              onClick={() => pick(c.key)}
              onSpeak={() => speak(build(c.key))}
            />
          ))}
        </div>

        {sel && (
          <SelectedPracticePanel
            itemId={`${idPrefix}${sel}`}
            text={build(sel)}
            accent={level.accent}
            visual={mediaVisual(cards.find((c) => c.key === sel)?.media ?? sel, 64)}

            calm={tab === 'calm'}
          />
        )}
      </div>

      <LevelNav levelId="level4" accent={level.accent} />
      <Disclaimer />
    </div>
  )
}
