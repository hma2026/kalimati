import { useNav } from '@/store/useNavStore'
import { useChildren, progressStats } from '@/store/useChildrenStore'
import { useSpeech } from '@/hooks/useSpeech'
import { useHaptics } from '@/hooks/useHaptics'
import { useLabels } from '@/hooks/useLabels'
import { mediaVisual } from '@/components/Media'
import { PlaceholderVisual } from '@/components/PlaceholderVisual'
import { AssetIcon } from '@/components/AssetIcon'
import { getAsset } from '@/assets/assetRegistry'
import { StarIcon, BurstIcon, VolumeIcon } from '@/lib/icons'

interface BodyItem { id: string; label: string; media: string; textColor: string; bgColor: string }

const BODY_PARTS: BodyItem[] = [
  { id: 'head', label: 'رأس', media: 'head', textColor: '#7B3FE4', bgColor: '#EDE4FB' },
  { id: 'eye', label: 'عين', media: 'eye', textColor: '#3B82F6', bgColor: '#DBEAFE' },
  { id: 'ear', label: 'أذن', media: 'ear', textColor: '#22C55E', bgColor: '#DCFCE7' },
  { id: 'nose', label: 'أنف', media: 'nose', textColor: '#F97316', bgColor: '#FEF3C7' },
  { id: 'mouth', label: 'فم', media: 'mouth', textColor: '#EC4899', bgColor: '#FCE7F3' },
  { id: 'hand', label: 'يد', media: 'hand', textColor: '#F97316', bgColor: '#FEF9C3' },
  { id: 'arm', label: 'ذراع', media: 'arm', textColor: '#7B3FE4', bgColor: '#EDE4FB' },
  { id: 'chest', label: 'صدر', media: 'chest', textColor: '#3B82F6', bgColor: '#DBEAFE' },
  { id: 'belly', label: 'بطن', media: 'belly', textColor: '#22C55E', bgColor: '#DCFCE7' },
  { id: 'back', label: 'ظهر', media: 'back', textColor: '#7B3FE4', bgColor: '#EDE4FB' },
  { id: 'leg', label: 'رجل', media: 'leg', textColor: '#F97316', bgColor: '#FEF9C3' },
  { id: 'foot', label: 'قدم', media: 'foot', textColor: '#EC4899', bgColor: '#FCE7F3' },
]

export function BodyPartsScreen() {
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
        <h1 className="sw__title"><BurstIcon size={10} /> أجزاء الجسم <BurstIcon size={10} /></h1>
        <button className="sw__welcome" onClick={() => nav.back()} aria-label="رجوع">
          مرحباً {child?.name ?? ''}
          <span className="sw__ava"><AssetIcon refKey={child?.avatar ?? 'avatars/child_boy_01'} size={34} /></span>
        </button>
      </header>
      <p className="sw__sub">تعلم أسماء أجزاء الجسم بطريقة ممتعة</p>
      <div className="sw__scroll">
        <div className="sw__grid">
          {BODY_PARTS.map((bp) => {
            const has = !!(bp.media && getAsset(bp.media))
            return (
              <button className="wc" key={bp.id} onClick={() => say(bp.label)}>
                <span className="wc__img">{has ? mediaVisual(bp.media, 96) : <PlaceholderVisual size={56} accent={bp.textColor} />}</span>
                <span className="wc__bot">
                  <span className="wc__lbl" style={{color: bp.textColor}}>{getLabel(bp.id, bp.label)}</span>
                  <span className="wc__snd"><VolumeIcon size={22} /></span>
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
