import { useNav } from '@/store/useNavStore'
import { useChildren, progressStats } from '@/store/useChildrenStore'
import { useSpeech } from '@/hooks/useSpeech'
import { useHaptics } from '@/hooks/useHaptics'
import { mediaVisual } from '@/components/Media'
import { PlaceholderVisual } from '@/components/PlaceholderVisual'
import { AssetIcon } from '@/components/AssetIcon'
import { getAsset } from '@/assets/assetRegistry'
import { StarIcon, BurstIcon, VolumeIcon } from '@/lib/icons'
import { L4_FEELINGS, L4_PAIN, L4_CALM } from '@/data/levelContent'

const LABELS: Record<string, string> = {
  happy:'سعيد', sad:'زعلان', scared:'خايف', angry:'معصب', tired:'تعيان', bored:'طفشان',
  tummy:'بطني', head:'راسي', teeth:'أسناني', ear:'أذني', hand:'يدي', leg:'رجلي',
  loud:'الصوت عالي', quiet:'مكان هادي', notouch:'لا تلمسني', mom:'ماما', dad:'بابا',
  help:'ساعدني', stop:'أوقف', out:'أطلع',
}

export function LevelFourScreen() {
  const nav = useNav()
  const child = useChildren((s) => s.children.find((c) => c.id === s.activeId) ?? null)
  const prog = useChildren((s) => (s.activeId ? s.progress[s.activeId] : undefined))
  const { speak } = useSpeech()
  const haptic = useHaptics()
  const stars = progressStats(prog).stars
  const say = (t: string) => { haptic('tap'); speak(t) }

  const card = (c: { key: string; media: string }, tint: string) => {
    const has = !!(c.media && getAsset(c.media))
    const label = LABELS[c.key] ?? c.key
    return (
      <button className="wc" key={c.key} onClick={() => say(label)}>
        <span className="wc__img">{has ? mediaVisual(c.media, 96) : <PlaceholderVisual size={56} accent={tint} />}</span>
        <span className="wc__bot"><span className="wc__lbl">{label}</span><span className="wc__snd"><VolumeIcon size={13} /></span></span>
      </button>
    )
  }

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
        <section className="sw__sec"><span className="sw__badge" style={{['--bt' as never]:'#EC4899'}}>مشاعر</span>
          <div className="sw__grid">{L4_FEELINGS.map((c) => card(c, '#EC4899'))}</div></section>
        <section className="sw__sec"><span className="sw__badge" style={{['--bt' as never]:'#FB923C'}}>ألم</span>
          <div className="sw__grid">{L4_PAIN.map((c) => card(c, '#FB923C'))}</div></section>
        <section className="sw__sec"><span className="sw__badge" style={{['--bt' as never]:'#34C759'}}>تهدئة</span>
          <div className="sw__grid">{L4_CALM.map((c) => card(c, '#34C759'))}</div></section>
      </div>
    </div>
  )
}
