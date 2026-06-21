import { useState } from 'react'
import { useChildren, progressStats } from '@/store/useChildrenStore'
import { useSettings } from '@/store/useSettingsStore'
import { useSpeech } from '@/hooks/useSpeech'
import { useHaptics } from '@/hooks/useHaptics'
import { LevelHeader } from '@/components/LevelHeader'
import { CategoryTabs } from '@/components/CategoryTabs'
import { PictureCard } from '@/components/PictureCard'
import { SelectedPracticePanel } from '@/components/SelectedPracticePanel'
import { AssetIcon } from '@/components/AssetIcon'
import { mediaVisual } from '@/components/Media'
import { Disclaimer } from '@/components/Disclaimer'
import { levelById } from '@/data/levelMeta'
import { L5_COLORS, L5_SHAPES, L5_SENTENCES } from '@/data/levelContent'
import { buildColorSentence, getColorLabel, getShapeLabel, profileOf } from '@/data/dialects'
import type { ReactNode } from 'react'

type Tab = 'colors' | 'shapes' | 'sentence'

export function LevelFiveScreen() {
  const level = levelById('level5')!
  const child = useChildren((s) => s.children.find((c) => c.id === s.activeId) ?? null)
  const prog = useChildren((s) => (s.activeId ? s.progress[s.activeId] : undefined))
  const fallback = useSettings((s) => s.selectedDialect)
  const { speak } = useSpeech()
  const haptic = useHaptics()

  const [tab, setTab] = useState<Tab>('colors')
  const [sel, setSel] = useState<{ id: string; text: string; visual: ReactNode } | null>(null)

  const profile = profileOf(child, fallback)
  const stars = progressStats(prog).stars

  const choose = (id: string, text: string, visual: ReactNode) => {
    setSel({ id, text, visual })
    haptic('tap')
    speak(text)
  }

  return (
    <div className="screen level" style={{ ['--accent' as string]: level.accent, background: level.soft }}>
      <LevelHeader level={level} stars={stars} />

      <CategoryTabs
        accent={level.accent}
        active={tab}
        onChange={(t) => { setTab(t as Tab); setSel(null) }}
        tabs={[
          { id: 'colors', label: 'الألوان' },
          { id: 'shapes', label: 'الأشكال' },
          { id: 'sentence', label: 'تدريب الجملة' },
        ]}
      />

      <div className="screen__scroll stack">
        {tab === 'colors' && (
          <div className="card-grid" data-cols={5}>
            {L5_COLORS.map((c) => {
              const text = getColorLabel(c.key)
              return (
                <PictureCard
                  key={c.key}
                  visual={mediaVisual(c.key, 56, 'lesson')}
                  label={c.label}
                  selected={sel?.id === `l5_color_${c.key}`}
                  accent={level.accent}
                  onClick={() => choose(`l5_color_${c.key}`, text, mediaVisual(c.key, 84, 'lesson'))}
                  onSpeak={() => speak(text)}
                />
              )
            })}
          </div>
        )}

        {tab === 'shapes' && (
          <div className="card-grid" data-cols={4}>
            {L5_SHAPES.map((s) => {
              const text = getShapeLabel(s.key)
              return (
                <PictureCard
                  key={s.key}
                  visual={mediaVisual(s.key, 56)}
                  label={s.label}
                  selected={sel?.id === `l5_shape_${s.key}`}
                  accent={level.accent}
                  onClick={() => choose(`l5_shape_${s.key}`, text, mediaVisual(s.key, 84))}
                  onSpeak={() => speak(text)}
                />
              )
            })}
          </div>
        )}

        {tab === 'sentence' && (
          <div className="phrase-list">
            {L5_SENTENCES.map((s) => {
              const text = buildColorSentence(s.kind, s.ref, profile)
              const visual = s.kind === 'this_shape'
                ? mediaVisual(s.ref, 40)
                : mediaVisual(s.ref, 36, 'lesson')
              const dot = s.kind === 'this_shape'
                ? mediaVisual(s.ref, 84)
                : mediaVisual(s.ref, 84, 'lesson')
              return (
                <button
                  key={s.key}
                  className={`phrase-card${sel?.id === `l5_sent_${s.key}` ? ' is-on' : ''}`}
                  style={sel?.id === `l5_sent_${s.key}` ? { borderColor: level.accent, boxShadow: `0 0 0 3px ${level.accent}33` } : undefined}
                  onClick={() => choose(`l5_sent_${s.key}`, text, dot)}
                >
                  <span className="phrase-card__fav" role="button" tabIndex={0} aria-label="استمع"
                        onClick={(e) => { e.stopPropagation(); speak(text) }}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); speak(text) } }}>
                    <AssetIcon refKey="ui/speaker" size={20} />
                  </span>
                  <span className="phrase-card__text">{text}</span>
                  <span className="phrase-card__img" aria-hidden>{visual}</span>
                </button>
              )
            })}
          </div>
        )}

        {sel && (
          <SelectedPracticePanel
            itemId={sel.id}
            text={sel.text}
            accent={level.accent}
            visual={sel.visual}
          />
        )}
      </div>

      <Disclaimer />
    </div>
  )
}
