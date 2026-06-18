import { useState } from 'react'
import { useChildren, progressStats } from '@/store/useChildrenStore'
import { useSettings } from '@/store/useSettingsStore'
import { useSpeech } from '@/hooks/useSpeech'
import { useHaptics } from '@/hooks/useHaptics'
import { SectionHeader } from '@/components/SectionHeader'
import { LevelNav } from '@/components/LevelNav'
import { AnimalPracticePanel } from '@/components/AnimalPracticePanel'
import { Disclaimer } from '@/components/Disclaimer'
import { mediaVisual } from '@/components/Media'
import { VolumeIcon } from '@/lib/icons'
import { ANIMALS } from '@/data/animals'
import { getAnimalLabel, getAnimalSound, profileOf } from '@/data/dialects'

const ACCENT = '#7B3FF2'

export function AnimalsScreen() {
  const child = useChildren((s) => s.children.find((c) => c.id === s.activeId) ?? null)
  const prog = useChildren((s) => (s.activeId ? s.progress[s.activeId] : undefined))
  const fallback = useSettings((s) => s.selectedDialect)
  const { speak } = useSpeech()
  const haptic = useHaptics()
  const [sel, setSel] = useState<string | null>(null)

  const profile = profileOf(child, fallback)
  const stars = progressStats(prog).stars
  const selAnimal = ANIMALS.find((a) => a.key === sel)

  const sayName = (key: string) => { haptic('tap'); speak(getAnimalLabel(key, profile)) }

  return (
    <div className="screen level" style={{ ['--accent' as string]: ACCENT, background: '#F7F5FD' }}>
      <SectionHeader title="حيوانات وأصوات" desc="تعلم أسماء الحيوانات وأصواتها" accent={ACCENT} stars={stars} />

      <div className="screen__scroll stack">
        <div className="card-grid" data-cols={3}>
          {ANIMALS.map((a) => (
            <button
              key={a.key}
              className={`pcard${sel === a.key ? ' is-on' : ''}`}
              style={sel === a.key ? { borderColor: ACCENT, boxShadow: `0 0 0 3px ${ACCENT}33` } : undefined}
              onClick={() => { setSel(a.key); sayName(a.key) }}
            >
              <span className="pcard__emoji" aria-hidden>{mediaVisual(a.key, 104)}</span>
              <span className="pcard__label">{getAnimalLabel(a.key, profile)}</span>
              <span
                role="button"
                tabIndex={0}
                aria-label="اسمع الاسم"
                className="pcard__speak pcard__speak--name"
                onClick={(e) => { e.stopPropagation(); sayName(a.key) }}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); sayName(a.key) } }}
              >
                <VolumeIcon size={18} />
              </span>
            </button>
          ))}
        </div>

        {selAnimal && (
          <AnimalPracticePanel
            itemId={`anim_${selAnimal.key}`}
            mediaKey={selAnimal.key}
            name={getAnimalLabel(selAnimal.key, profile)}
            sound={getAnimalSound(selAnimal.key)}
            accent={ACCENT}
          />
        )}
      </div>

      <LevelNav levelId="__none__" accent={ACCENT} />
      <Disclaimer />
    </div>
  )
}
