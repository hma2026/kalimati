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

const SECTIONS = [
  { id: 'feelings', label: 'مشاعر', tint: '#EC4899', items: [
    { key: 'happy', media: 'happy', defaultLabel: 'سعيد' },
    { key: 'sad', media: 'sad', defaultLabel: 'زعلان' },
    { key: 'scared', media: 'scared', defaultLabel: 'خايف' },
    { key: 'angry', media: 'angry', defaultLabel: 'معصب' },
    { key: 'tired', media: 'tired', defaultLabel: 'تعيان' },
    { key: 'bored', media: 'bored', defaultLabel: 'طفشان' },
  ]},
  { id: 'pain', label: 'ألم', tint: '#FB923C', items: [
    { key: 'stomachPain', media: 'stomachPain', defaultLabel: 'بطني' },
    { key: 'headPain', media: 'headPain', defaultLabel: 'راسي' },
    { key: 'toothPain', media: 'toothPain', defaultLabel: 'أسناني' },
    { key: 'earPain', media: 'earPain', defaultLabel: 'أذني' },
    { key: 'handPain', media: 'handPain', defaultLabel: 'يدي' },
    { key: 'legPain', media: 'legPain', defaultLabel: 'رجلي' },
  ]},
  { id: 'calm', label: 'تهدئة', tint: '#34C759', items: [
    { key: 'loudSound', media: 'loudSound', defaultLabel: 'الصوت عالي' },
    { key: 'quietPlace', media: 'quietPlace', defaultLabel: 'مكان هادي' },
    { key: 'doNotTouch', media: 'doNotTouch', defaultLabel: 'لا تلمسني' },
    { key: 'calm_mother', media: 'calm_mother', defaultLabel: 'ماما' },
    { key: 'calm_father', media: 'calm_father', defaultLabel: 'بابا' },
    { key: 'calm_help', media: 'calm_help', defaultLabel: 'ساعدني' },
    { key: 'calm_stop', media: 'calm_stop', defaultLabel: 'أوقف' },
    { key: 'goOut', media: 'goOut', defaultLabel: 'أطلع' },
  ]},
]

export function LevelFourScreen() {
  const nav = useNav()
  const child = useChildren((s) => s.children.find((c) => c.id === s.activeId) ?? null)
  const prog = useChildren((s) => (s.activeId ? s.progress[s.activeId] : undefined))
  const { speak } = useSpeech()
  const haptic = useHaptics()
  const { getLabel } = useLabels()
  const stars = progressStats(prog).stars
  const say = (t: string) => { haptic('tap'); speak(t) }

  return (
    <div className="sw">
      <header className="sw__hdr">
        <span className="sw__stars"><StarIcon size={16} style={{color:'#F6C84C'}} /> {stars}</span>
        <h1 className="sw__title"><BurstIcon size={10} /> المشاعر والاحتياجات <BurstIcon size={10} /></h1>
        <button className="sw__welcome" onClick={() => nav.back()} aria-label="رجوع">
          مرحباً {child?.name ?? ''}
          <span className="sw__ava"><AssetIcon refKey={child?.avatar ?? 'avatars/child_boy_01'} size={34} /></span>
        </button>
      </header>
      <p className="sw__sub">استمع للكلمة وعبّر عن شعورك أو حاجتك</p>
      <div className="sw__scroll">
        {SECTIONS.map((sec) => (
          <section className="sw__sec" key={sec.id}>
            <span className="sw__badge" style={{['--bt' as never]: sec.tint}}>{sec.label}</span>
            <div className="sw__grid">
              {sec.items.map((c) => {
                const label = getLabel(c.key, c.defaultLabel)
                const has = !!(c.media && getAsset(c.media))
                return (
                  <button className="wc" key={c.key} onClick={() => say(label)}>
                    <span className="wc__img">{has ? mediaVisual(c.media, 96) : <PlaceholderVisual size={56} accent={sec.tint} />}</span>
                    <span className="wc__bot"><span className="wc__lbl">{label}</span><span className="wc__snd"><VolumeIcon size={22} /></span></span>
                  </button>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
