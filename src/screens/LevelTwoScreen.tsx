import { useState } from 'react'
import { useChildren, progressStats } from '@/store/useChildrenStore'
import { useSettings } from '@/store/useSettingsStore'
import { useHaptics } from '@/hooks/useHaptics'
import { LevelHeader } from '@/components/LevelHeader'
import { LevelNav } from '@/components/LevelNav'
import { StepIndicator } from '@/components/StepIndicator'
import { PictureCard } from '@/components/PictureCard'
import { SelectedPracticePanel } from '@/components/SelectedPracticePanel'
import { mediaVisual } from '@/components/Media'
import { Disclaimer } from '@/components/Disclaimer'
import { levelById } from '@/data/levelMeta'
import { L2_ITEMS, buildL2 } from '@/data/levelContent'
import { getRequestWord, getWordLabel, profileOf } from '@/data/dialects'

export function LevelTwoScreen() {
  const level = levelById('level2')!
  const child = useChildren((s) => s.children.find((c) => c.id === s.activeId) ?? null)
  const prog = useChildren((s) => (s.activeId ? s.progress[s.activeId] : undefined))
  const fallback = useSettings((s) => s.selectedDialect)
  const haptic = useHaptics()
  const [sel, setSel] = useState<string | null>(null)

  const profile = profileOf(child, fallback)
  const stars = progressStats(prog).stars
  const requestWord = getRequestWord(profile)

  const choose = (key: string) => { setSel(key); haptic('sentence') }

  return (
    <div className="screen level" style={{ ['--accent' as string]: level.accent, background: level.soft }}>
      <LevelHeader level={level} stars={stars} />

      <StepIndicator
        accent={level.accent}
        current={sel ? 3 : 2}
        steps={[`اختر «${requestWord}»`, 'اختر ما تريد', 'الجملة']}
      />

      <div className="screen__scroll l2-grid">
        <section className="card l2-pick">
          <div className="card-title"><span className="num" style={{ background: level.accent }}>٢</span> اختر ما تريد</div>
          <div className="card-grid" data-cols={3}>
            {L2_ITEMS.map((it) => (
              <PictureCard
                key={it.key}
                visual={mediaVisual(it.key, 52)}
                label={getWordLabel(it.key, profile)}
                selected={sel === it.key}
                accent={level.accent}
                onClick={() => choose(it.key)}
              />
            ))}
          </div>
        </section>

        <section className="card l2-sentence">
          <div className="card-title"><span className="num" style={{ background: level.accent }}>٣</span> الجملة</div>
          {sel ? (
            <SelectedPracticePanel
              itemId={`l2_${sel}`}
              text={buildL2(sel, profile)}
              accent={level.accent}
              visual={mediaVisual(sel, 64)}
              character="🧒"
            />
          ) : (
            <div className="empty-stage">
              <span className="bubble" style={{ background: level.soft, color: level.accent }}>{requestWord}…</span>
              <span className="practice__char" aria-hidden>🧒</span>
              <p className="muted-note">اختر بطاقة من اليمين لتكوين الجملة</p>
            </div>
          )}
        </section>
      </div>

      <LevelNav levelId="level2" accent={level.accent} />
      <Disclaimer />
    </div>
  )
}
