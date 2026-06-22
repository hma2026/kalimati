import { useNav } from '@/store/useNavStore'
import { useChildren, progressStats } from '@/store/useChildrenStore'
import { useSpeech } from '@/hooks/useSpeech'
import { useHaptics } from '@/hooks/useHaptics'
import { useLabels } from '@/hooks/useLabels'
import { PlaceholderVisual } from '@/components/PlaceholderVisual'
import { mediaVisual } from '@/components/Media'
import { getAsset } from '@/assets/assetRegistry'
import { VolumeIcon, StarIcon, BurstIcon } from '@/lib/icons'
import { AssetIcon } from '@/components/AssetIcon'
import { wordCategories } from '@/data/words'

const COLS = 4

export function CardGridScreen() {
  const nav = useNav()
  const child = useChildren((s) => s.children.find((c) => c.id === s.activeId) ?? null)
  const prog = useChildren((s) => (s.activeId ? s.progress[s.activeId] : undefined))
  const stars = progressStats(prog).stars
  const { speak } = useSpeech()
  const haptic = useHaptics()
  const { getLabel } = useLabels()
  const say = (t: string) => { haptic('tap'); speak(t) }

  const renderCard = (c: { id: string; label: string; media?: string; say?: string }, tint: string) => {
    const has = !!(c.media && getAsset(c.media))
    return (
      <button className="wc" key={c.id} onClick={() => say(c.say ?? c.label)}>
        <span className="wc__img">{has ? mediaVisual(c.media!, 96) : <PlaceholderVisual size={56} accent={tint} />}</span>
        <span className="wc__bot"><span className="wc__lbl">{getLabel(c.id, c.label)}</span><span className="wc__snd"><VolumeIcon size={22} /></span></span>
      </button>
    )
  }
  const renderEmpty = (i: number, tint: string) => (
    <button className="wc wc--empty" key={`e${i}`} onClick={() => {}}>
      <span className="wc__img"><PlaceholderVisual size={40} accent={tint} /></span>
      <span className="wc__bot"><span className="wc__lbl" style={{opacity:.4}}>—</span></span>
    </button>
  )

  return (
    <div className="sw">
      {/* الهيدر الموحّد */}
      <header className="sw__hdr">
        <span className="sw__stars"><StarIcon size={16} style={{color:'#F6C84C'}} /> {stars}</span>
        <h1 className="sw__title">
          <BurstIcon size={10} /> كلمات مفردة <BurstIcon size={10} />
        </h1>
        <button className="sw__welcome" onClick={() => nav.reset('children')} aria-label="تبديل الطفل">
          مرحباً {child?.name ?? ''}
          <span className="sw__ava"><AssetIcon refKey={child?.avatar ?? 'avatars/child_boy_01'} size={34} /></span>
        </button>
      </header>

      {/* الأقسام (عنوان وسط + شبكة ٤ أعمدة) */}
      <div className="sw__scroll">
        {wordCategories.map((g) => {
          const remainder = g.words.length % COLS
          const pad = remainder === 0 ? 0 : COLS - remainder
          return (
            <section className="sw__sec" key={g.id}>
              <span className="sw__badge" style={{['--bt' as never]: g.tint}}>{g.label}</span>
              <div className="sw__grid">
                {g.words.map((c) => renderCard(c, g.tint))}
                {Array.from({length: pad}, (_, i) => renderEmpty(i, g.tint))}
              </div>
            </section>
          )
        })}
      </div>

      {/* الفوتر الموحّد */}
    </div>
  )
}
