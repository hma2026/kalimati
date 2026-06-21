import { useState } from 'react'
import { useNav } from '@/store/useNavStore'
import { useChildren, progressStats } from '@/store/useChildrenStore'
import { useSpeech } from '@/hooks/useSpeech'
import { useHaptics } from '@/hooks/useHaptics'
import { TeacherGate } from '@/components/TeacherGate'
import { mediaVisual } from '@/components/Media'
import { PlaceholderVisual } from '@/components/PlaceholderVisual'
import { AssetIcon } from '@/components/AssetIcon'
import { getAsset } from '@/assets/assetRegistry'
import { SettingsIcon, StarIcon, BurstIcon, VolumeIcon } from '@/lib/icons'
import { L4_FEELINGS, L4_PAIN, L4_CALM } from '@/data/levelContent'

/** التسميات القصيرة المطابِقة للنموذج (تُعرض وتُنطق). */
const LABELS: Record<string, string> = {
  happy: 'سعيد', sad: 'زعلان', scared: 'خايف', angry: 'معصب', tired: 'تعيان', bored: 'طفشان',
  tummy: 'بطني', head: 'راسي', teeth: 'أسناني', ear: 'أذني', hand: 'يدي', leg: 'رجلي',
  loud: 'الصوت عالي', quiet: 'مكان هادي', notouch: 'لا تلمسني', mom: 'ماما', dad: 'بابا',
  help: 'ساعدني', stop: 'أوقف', out: 'أطلع',
}

/** المستوى 4 — المشاعر والاحتياجات (مطابِق للنموذج: 3 أقسام مكدّسة، صورة كبيرة + كلمة + زر نطق). */
export function LevelFourScreen() {
  const nav = useNav()
  const child = useChildren((s) => s.children.find((c) => c.id === s.activeId) ?? null)
  const prog = useChildren((s) => (s.activeId ? s.progress[s.activeId] : undefined))
  const { speak } = useSpeech()
  const haptic = useHaptics()
  const [gate, setGate] = useState(false)
  const stars = progressStats(prog).stars
  const say = (t: string) => { haptic('tap'); speak(t) }

  const card = (c: { key: string; media: string }, tint: string) => {
    const has = !!(c.media && getAsset(c.media))
    const label = LABELS[c.key] ?? c.key
    return (
      <button className="wcell" key={c.key} onClick={() => say(label)}>
        <span className="wcell__img">{has ? mediaVisual(c.media, 96) : <PlaceholderVisual size={64} accent={tint} />}</span>
        <span className="wcell__row"><span className="wcell__word">{label}</span><span className="wcell__snd" aria-hidden><VolumeIcon size={15} /></span></span>
      </button>
    )
  }

  return (
    <div className="screen l5">
      <header className="home-bar l5-bar">
        <span className="l5-left">
          <button className="l5-gear" aria-label="الإعدادات" onClick={() => setGate(true)}><SettingsIcon size={20} /></button>
          <span className="home-stars"><StarIcon size={18} style={{ color: 'var(--star,#F6C84C)' }} /> {stars}</span>
        </span>
        <h1 className="home-title l5-title">
          <span className="home-title__b" aria-hidden><BurstIcon size={14} /></span>
          المشاعر والاحتياجات
          <span className="home-title__b" aria-hidden><BurstIcon size={14} /></span>
        </h1>
        <button className="home-welcome" onClick={() => nav.back()} aria-label="رجوع">
          <span className="home-welcome__txt">مرحباً {child?.name ?? ''}</span>
          <span className="home-welcome__ava"><AssetIcon refKey={child?.avatar ?? 'avatars/child_boy_01'} size={40} /></span>
        </button>
      </header>
      <p className="l5-sub">استمع للكلمة وعبّر عن شعورك أو حاجتك</p>

      <div className="words-scroll screen__scroll">
        <section className="wsec">
          <h2 className="wsec__title" style={{ ['--gt' as never]: '#EC4899' }}>مشاعر</h2>
          <div className="wgrid wgrid--3">{L4_FEELINGS.map((c) => card(c, '#EC4899'))}</div>
        </section>
        <section className="wsec">
          <h2 className="wsec__title" style={{ ['--gt' as never]: '#FB923C' }}>ألم</h2>
          <div className="wgrid wgrid--3">{L4_PAIN.map((c) => card(c, '#FB923C'))}</div>
        </section>
        <section className="wsec">
          <h2 className="wsec__title" style={{ ['--gt' as never]: '#34C759' }}>تهدئة</h2>
          <div className="wgrid wgrid--4">{L4_CALM.map((c) => card(c, '#34C759'))}</div>
        </section>
      </div>

      {gate && <TeacherGate onCancel={() => setGate(false)} onUnlock={() => { setGate(false); nav.go('settings') }} />}
    </div>
  )
}
