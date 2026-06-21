import { useNav } from '@/store/useNavStore'
import { useChildren, progressStats } from '@/store/useChildrenStore'
import { useSpeech } from '@/hooks/useSpeech'
import { useHaptics } from '@/hooks/useHaptics'
import { mediaVisual } from '@/components/Media'
import { AssetIcon } from '@/components/AssetIcon'
import { StarIcon, BurstIcon, VolumeIcon } from '@/lib/icons'
import { getAnimalLabel, profileOf } from '@/data/dialects'
import { useSettings } from '@/store/useSettingsStore'
import { useLabels } from '@/hooks/useLabels'

const SECTIONS = [
  { id: 'pets', label: 'حيوانات أليفة', tint: '#8B5CF6', keys: ['cat','dog','rabbit','bird'] },
  { id: 'farm', label: 'حيوانات مزرعة', tint: '#34C759', keys: ['cow','sheep','horse','chicken'] },
  { id: 'wild', label: 'حيوانات برية', tint: '#F59E0B', keys: ['lion','elephant','duck','bird'] },
]

export function AnimalsScreen() {
  const nav = useNav()
  const child = useChildren((s) => s.children.find((c) => c.id === s.activeId) ?? null)
  const prog = useChildren((s) => (s.activeId ? s.progress[s.activeId] : undefined))
  const fallback = useSettings((s) => s.selectedDialect)
  const { speak } = useSpeech()
  const haptic = useHaptics()
  const stars = progressStats(prog).stars
  const profile = profileOf(child, fallback)
  const { getLabel } = useLabels()
  const say = (key: string) => { haptic('tap'); speak(getLabel(key, getAnimalLabel(key, profile))) }

  return (
    <div className="sw">
      <header className="sw__hdr">
        <span className="sw__stars"><StarIcon size={16} style={{color:'#F6C84C'}} /> {stars}</span>
        <h1 className="sw__title"><BurstIcon size={10} /> حيوانات وأصوات <BurstIcon size={10} /></h1>
        <button className="sw__welcome" onClick={() => nav.back()} aria-label="رجوع">
          مرحباً {child?.name ?? ''}
          <span className="sw__ava"><AssetIcon refKey={child?.avatar ?? 'avatars/child_boy_01'} size={34} /></span>
        </button>
      </header>
      <p className="sw__sub">استمع لاسم الحيوان وصوته</p>
      <div className="sw__scroll">
        {SECTIONS.map((sec) => (
          <section className="sw__sec" key={sec.id}>
            <span className="sw__badge" style={{['--bt' as never]: sec.tint}}>{sec.label}</span>
            <div className="sw__grid">{sec.keys.map((key) => (
              <button className="wc" key={key} onClick={() => say(key)}>
                <span className="wc__img">{mediaVisual(key, 96)}</span>
                <span className="wc__bot"><span className="wc__lbl">{getLabel(key, getAnimalLabel(key, profile))}</span><span className="wc__snd"><VolumeIcon size={13} /></span></span>
              </button>
            ))}</div>
          </section>
        ))}
      </div>
    </div>
  )
}
