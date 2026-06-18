import { useState } from 'react'
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
import { StarIcon } from '@/lib/icons'
import { levelById } from '@/data/levelMeta'
import {
  DAILY, DAILY_CATS, DIFF_RANK, buildDailyPhrase, profileOf, type DailyPhrase,
} from '@/data/dialects'

const GUIDANCE = [
  { label: 'سهل جدًا', color: '#22c55e', examples: 'سلام، باي، نعم' },
  { label: 'سهل', color: '#3b82f6', examples: 'باي باي، بسم الله، الحمد لله' },
  { label: 'متوسط', color: '#f97316', examples: 'السلام عليكم' },
]

export function LevelSixScreen() {
  const level = levelById('level6')!
  const child = useChildren((s) => s.children.find((c) => c.id === s.activeId) ?? null)
  const prog = useChildren((s) => (s.activeId ? s.progress[s.activeId] : undefined))
  const fallback = useSettings((s) => s.selectedDialect)
  const difficulty = useSettings((s) => s.dailyPhrasesDifficulty)
  const religiousOn = useSettings((s) => s.religiousPhrasesEnabled)
  const { speak } = useSpeech()
  const haptic = useHaptics()

  const [cat, setCat] = useState<DailyPhrase['cat']>('greet')
  const [sel, setSel] = useState<string | null>(null)

  const profile = profileOf(child, fallback)
  const stars = progressStats(prog).stars
  const maxRank = DIFF_RANK[difficulty]

  const list = DAILY.filter((d) =>
    d.cat === cat &&
    DIFF_RANK[d.difficulty] <= maxRank &&
    (religiousOn || !d.religious),
  )
  const selPhrase = DAILY.find((d) => d.key === sel && d.cat === cat)

  const pick = (d: DailyPhrase) => { setSel(d.key); haptic('tap'); speak(buildDailyPhrase(d, profile)) }

  return (
    <div className="screen level" style={{ ['--accent' as string]: level.accent, background: level.soft }}>
      <LevelHeader level={level} stars={stars} />

      <CategoryTabs
        accent={level.accent}
        active={cat}
        onChange={(c) => { setCat(c as DailyPhrase['cat']); setSel(null) }}
        tabs={DAILY_CATS.map((c) => ({ id: c.id, label: c.label, icon: c.icon }))}
      />

      <div className="screen__scroll l6-body">
        <div className="card-grid l6-cards" data-cols={6}>
          {list.map((d) => (
            <PictureCard
              key={d.key}
              big
              visual={mediaVisual(d.key, 52)}
              label={buildDailyPhrase(d, profile)}
              selected={sel === d.key}
              accent={level.accent}
              onClick={() => pick(d)}
            />
          ))}
          {list.length === 0 && <p className="muted-note">لا توجد عبارات بهذا المستوى. غيّر مستوى الصعوبة من الإعدادات.</p>}
        </div>

        <div className="l6-bottom">
          {selPhrase ? (
            <SelectedPracticePanel
              itemId={`l6_${selPhrase.key}`}
              text={buildDailyPhrase(selPhrase, profile)}
              accent={level.accent}
              visual={mediaVisual(selPhrase.key, 60)}
                variant="compact"
              instruction="اسمع، وقل العبارة مثل الصورة"
            />
          ) : (
            <div className="practice"><p className="muted-note" style={{ textAlign: 'center' }}>اختر عبارة لبدء التدريب</p></div>
          )}

          <aside className="card guide-card">
            <div className="guide-card__title">إرشادات مستوى الصعوبة</div>
            {GUIDANCE.map((g) => (
              <div className="guide-row" key={g.label}>
                <span className="guide-row__ex">{g.examples}</span>
                <span className="guide-row__lvl" style={{ color: g.color, display: 'inline-flex', alignItems: 'center', gap: 4 }}><StarIcon size={14} style={{ color: g.color }} /> {g.label}</span>
              </div>
            ))}
          </aside>
        </div>
      </div>

      <LevelNav levelId="level6" accent={level.accent} />
      <Disclaimer />
    </div>
  )
}
