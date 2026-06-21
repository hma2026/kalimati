import { useNav } from '@/store/useNavStore'
import { useChildren, progressStats } from '@/store/useChildrenStore'
import { useSpeech } from '@/hooks/useSpeech'
import { useHaptics } from '@/hooks/useHaptics'
import { PlaceholderVisual } from '@/components/PlaceholderVisual'
import { mediaVisual } from '@/components/Media'
import { getAsset } from '@/assets/assetRegistry'
import { VolumeIcon, StarIcon, SettingsIcon, BurstIcon } from '@/lib/icons'
import { wordCategories } from '@/data/words'

/* أيقونات SVG لشارات الفئات (بدون إيموجي) */
const CAT_ICONS: Record<string, JSX.Element> = {
  people: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>,
  drinks: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M3 2l2 18h14L21 2H3zm9 16c-2.76 0-5-2.24-5-5h10c0 2.76-2.24 5-5 5z"/></svg>,
  food: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>,
  fruits: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><circle cx="12" cy="14" r="7"/><path d="M12 7c-1.1 0-2-.4-2.7-1L12 2l2.7 4c-.7.6-1.6 1-2.7 1z"/></svg>,
  veg: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2C9 2 7 5 7 9c0 3 2 6 5 10 3-4 5-7 5-10 0-4-2-7-5-7z"/></svg>,
  places: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>,
  clothes: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M15.5 1l-3.5 5-3.5-5H1v9h5v13h12V10h5V1z"/></svg>,
  daily: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6 0h-4V4h4v2z"/></svg>,
  toys: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><circle cx="12" cy="8" r="4"/><path d="M12 14c-4 0-6 2-6 4v2h12v-2c0-2-2-4-6-4z"/></svg>,
  body: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><circle cx="12" cy="4" r="3"/><path d="M12 8c-3 0-5 2-5 4v8h3v-4h4v4h3v-8c0-2-2-4-5-4z"/></svg>,
  hygiene: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M7 4h10v2H7zm0 4h10c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2v-8c0-1.1.9-2 2-2z"/></svg>,
}

const COLS = 8

export function CardGridScreen() {
  const nav = useNav()
  const prog = useChildren((s) => (s.activeId ? s.progress[s.activeId] : undefined))
  const stars = progressStats(prog).stars
  const { speak } = useSpeech()
  const haptic = useHaptics()
  const say = (t: string) => { haptic('tap'); speak(t) }

  const renderCard = (c: { id: string; label: string; media?: string; say?: string }, tint: string) => {
    const has = !!(c.media && getAsset(c.media))
    return (
      <button className="wc" key={c.id} onClick={() => say(c.say ?? c.label)}>
        <span className="wc__img">{has ? mediaVisual(c.media!, 96) : <PlaceholderVisual size={56} accent={tint} />}</span>
        <span className="wc__bot"><span className="wc__lbl">{c.label}</span><span className="wc__snd"><VolumeIcon size={13} /></span></span>
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
      {/* الرأس */}
      <header className="sw__hdr">
        <button className="sw__gear" onClick={() => nav.go('settings')}><SettingsIcon size={20} /></button>
        <span className="sw__stars"><StarIcon size={16} style={{color:'#F6C84C'}} /> {stars}</span>
        <h1 className="sw__title">
          <BurstIcon size={10} /> كلمات مفردة <BurstIcon size={10} />
        </h1>
        <button className="sw__back" onClick={() => nav.back()} aria-label="رجوع">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </header>

      {/* الأقسام */}
      <div className="sw__scroll">
        {wordCategories.map((g) => {
          const pad = COLS - g.words.length
          return (
            <section className="sw__sec" key={g.id}>
              <span className="sw__badge" style={{['--bt' as never]: g.tint}}>
                <span className="sw__badge-ico">{CAT_ICONS[g.id] ?? null}</span>
                {g.label}
              </span>
              <div className="sw__grid">
                {g.words.map((c) => renderCard(c, g.tint))}
                {Array.from({length: Math.max(0, pad)}, (_, i) => renderEmpty(i, g.tint))}
              </div>
            </section>
          )
        })}
      </div>

      {/* التنقّل السفلي */}
      <nav className="sw__nav">
        <button className="sw__navbtn" onClick={() => nav.back()}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
          السابق
        </button>
        <button className="sw__navbtn sw__navbtn--home" onClick={() => nav.reset('home')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          الصفحة الرئيسية
        </button>
        <button className="sw__navbtn" onClick={() => {}}>
          الشاشة التالية
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
        </button>
      </nav>
    </div>
  )
}
