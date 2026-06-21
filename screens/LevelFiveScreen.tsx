import { useState } from 'react'
import { useNav } from '@/store/useNavStore'
import { useChildren, progressStats } from '@/store/useChildrenStore'
import { useSpeech } from '@/hooks/useSpeech'
import { useHaptics } from '@/hooks/useHaptics'
import { TeacherGate } from '@/components/TeacherGate'
import { mediaVisual } from '@/components/Media'
import { AssetIcon } from '@/components/AssetIcon'
import { SettingsIcon, StarIcon, BurstIcon, VolumeIcon } from '@/lib/icons'

const COLORS = [
  { key: 'red', label: 'أحمر' }, { key: 'blue', label: 'أزرق' }, { key: 'yellow', label: 'أصفر' },
  { key: 'green', label: 'أخضر' }, { key: 'orange', label: 'برتقالي' }, { key: 'pink', label: 'وردي' },
  { key: 'purple', label: 'بنفسجي' }, { key: 'white', label: 'أبيض' }, { key: 'black', label: 'أسود' }, { key: 'brown', label: 'بني' },
]
const SHAPES = [
  { key: 'circle', label: 'دائرة' }, { key: 'square', label: 'مربع' }, { key: 'triangle', label: 'مثلث' },
  { key: 'rectangle', label: 'مستطيل' }, { key: 'star', label: 'نجمة' }, { key: 'heart', label: 'قلب' },
]

/* كرات لامعة ثلاثية الأبعاد (SVG) للصفّ الأول من الألوان — مطابِقة للنموذج */
const BALLS: Record<string, { c: string; hi: string; sh: string }> = {
  red: { c: '#e8362a', hi: '#ff8f80', sh: '#a81c14' },
  blue: { c: '#2b7de0', hi: '#84bbf6', sh: '#19529b' },
  yellow: { c: '#f5c518', hi: '#fde986', sh: '#c89708' },
  green: { c: '#5cb82e', hi: '#abe17c', sh: '#3a8616' },
  orange: { c: '#f08c1c', hi: '#ffc270', sh: '#c06006' },
}
const ColorBall = ({ k }: { k: string }) => {
  const p = BALLS[k]
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden>
      <defs>
        <radialGradient id={`cb-${k}`} cx="38%" cy="32%" r="72%">
          <stop offset="0%" stopColor={p.hi} />
          <stop offset="55%" stopColor={p.c} />
          <stop offset="100%" stopColor={p.sh} />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="91" rx="27" ry="5" fill="#26345c" opacity="0.1" />
      <circle cx="50" cy="48" r="39" fill={`url(#cb-${k})`} />
      <ellipse cx="37" cy="33" rx="13" ry="9" fill="#fff" opacity="0.5" />
    </svg>
  )
}

/** المستوى 5 — الألوان والأشكال (مطابِق للنموذج: قسمان معاً، صور حقيقية + كلمة + زر نطق). */
export function LevelFiveScreen() {
  const nav = useNav()
  const child = useChildren((s) => s.children.find((c) => c.id === s.activeId) ?? null)
  const prog = useChildren((s) => (s.activeId ? s.progress[s.activeId] : undefined))
  const { speak } = useSpeech()
  const haptic = useHaptics()
  const [gate, setGate] = useState(false)
  const stars = progressStats(prog).stars
  const say = (t: string) => { haptic('tap'); speak(t) }

  return (
    <div className="screen l5">
      <header className="home-bar l5-bar">
        <span className="l5-left">
          <button className="l5-gear" aria-label="الإعدادات" onClick={() => setGate(true)}><SettingsIcon size={20} /></button>
          <span className="home-stars"><StarIcon size={18} style={{ color: 'var(--star,#F6C84C)' }} /> {stars}</span>
        </span>
        <h1 className="home-title l5-title">
          <span className="home-title__b" aria-hidden><BurstIcon size={14} /></span>
          الألوان والأشكال
          <span className="home-title__b" aria-hidden><BurstIcon size={14} /></span>
        </h1>
        <button className="home-welcome" onClick={() => nav.back()} aria-label="رجوع">
          <span className="home-welcome__txt">مرحباً {child?.name ?? ''}</span>
          <span className="home-welcome__ava"><AssetIcon refKey={child?.avatar ?? 'avatars/child_boy_01'} size={40} /></span>
        </button>
      </header>
      <p className="l5-sub">استمع للكلمة وتعرّف على اللون أو الشكل</p>

      <div className="words-scroll screen__scroll">
        <section className="wsec">
          <h2 className="wsec__title" style={{ ['--gt' as never]: '#8B5CF6' }}>ألوان</h2>
          <div className="wgrid wgrid--5">
            {COLORS.map((c) => (
              <button className="wcell" key={c.key} onClick={() => say(c.label)}>
                <span className="wcell__img">{BALLS[c.key] ? <ColorBall k={c.key} /> : mediaVisual(c.key, 96, 'lesson')}</span>
                <span className="wcell__row"><span className="wcell__word">{c.label}</span><span className="wcell__snd" aria-hidden><VolumeIcon size={15} /></span></span>
              </button>
            ))}
          </div>
        </section>

        <section className="wsec">
          <h2 className="wsec__title" style={{ ['--gt' as never]: '#3B82F6' }}>أشكال</h2>
          <div className="wgrid wgrid--3">
            {SHAPES.map((s) => (
              <button className="wcell" key={s.key} onClick={() => say(s.label)}>
                <span className="wcell__img">{mediaVisual(s.key, 96)}</span>
                <span className="wcell__row"><span className="wcell__word">{s.label}</span><span className="wcell__snd" aria-hidden><VolumeIcon size={15} /></span></span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {gate && <TeacherGate onCancel={() => setGate(false)} onUnlock={() => { setGate(false); nav.go('settings') }} />}
    </div>
  )
}
