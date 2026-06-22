import { useNav } from '@/store/useNavStore'
import { useChildren, progressStats } from '@/store/useChildrenStore'
import { useSpeech } from '@/hooks/useSpeech'
import { useHaptics } from '@/hooks/useHaptics'
import { useLabels } from '@/hooks/useLabels'
import { mediaVisual } from '@/components/Media'
import { AssetIcon } from '@/components/AssetIcon'
import { StarIcon, BurstIcon, VolumeIcon } from '@/lib/icons'

const COLORS = [
  { key: 'red', label: 'أحمر' }, { key: 'blue', label: 'أزرق' }, { key: 'yellow', label: 'أصفر' },
  { key: 'green', label: 'أخضر' }, { key: 'orange', label: 'برتقالي' }, { key: 'pink', label: 'وردي' },
  { key: 'purple', label: 'بنفسجي' }, { key: 'white', label: 'أبيض' }, { key: 'black', label: 'أسود' }, { key: 'brown', label: 'بني' },
]
const SHAPES = [
  { key: 'circle', label: 'دائرة' }, { key: 'square', label: 'مربع' }, { key: 'triangle', label: 'مثلث' },
  { key: 'rectangle', label: 'مستطيل' }, { key: 'star', label: 'نجمة' }, { key: 'heart', label: 'قلب' },
]

export function LevelFiveScreen() {
  const nav = useNav()
  const child = useChildren((s) => s.children.find((c) => c.id === s.activeId) ?? null)
  const prog = useChildren((s) => (s.activeId ? s.progress[s.activeId] : undefined))
  const { speak } = useSpeech()
  const haptic = useHaptics()
  const stars = progressStats(prog).stars
  const { getLabel } = useLabels()
  const say = (t: string) => { haptic('tap'); speak(t) }

  return (
    <div className="sw">
      <header className="sw__hdr">
        <span className="sw__stars"><StarIcon size={16} style={{color:'#F6C84C'}} /> {stars}</span>
        <h1 className="sw__title"><BurstIcon size={10} /> الألوان والأشكال <BurstIcon size={10} /></h1>
        <button className="sw__welcome" onClick={() => nav.back()} aria-label="رجوع">
          مرحباً {child?.name ?? ''}
          <span className="sw__ava"><AssetIcon refKey={child?.avatar ?? 'avatars/child_boy_01'} size={34} /></span>
        </button>
      </header>
      <p className="sw__sub">استمع للكلمة وتعرّف على اللون أو الشكل</p>
      <div className="sw__scroll">
        <section className="sw__sec"><span className="sw__badge" style={{['--bt' as never]:'#8B5CF6'}}>ألوان</span>
          <div className="sw__grid">{COLORS.map((c) => (
            <button className="wc" key={c.key} onClick={() => say(c.label)}>
              <span className="wc__img">{mediaVisual(c.key, 96, 'lesson')}</span>
              <span className="wc__bot"><span className="wc__lbl">{getLabel(c.key, c.label)}</span><span className="wc__snd"><VolumeIcon size={22} /></span></span>
            </button>
          ))}</div></section>
        <section className="sw__sec"><span className="sw__badge" style={{['--bt' as never]:'#3B82F6'}}>أشكال</span>
          <div className="sw__grid">{SHAPES.map((s) => (
            <button className="wc" key={s.key} onClick={() => say(getLabel(s.key, s.label))}>
              <span className="wc__img">{mediaVisual(s.key, 96)}</span>
              <span className="wc__bot"><span className="wc__lbl">{s.label}</span><span className="wc__snd"><VolumeIcon size={22} /></span></span>
            </button>
          ))}</div></section>
      </div>
    </div>
  )
}
