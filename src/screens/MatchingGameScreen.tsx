import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useNav } from '@/store/useNavStore'
import { useChildren, progressStats } from '@/store/useChildrenStore'
import { useSettings } from '@/store/useSettingsStore'
import { useGames, CARD_COUNT } from '@/store/useGamesStore'
import { useSpeech } from '@/hooks/useSpeech'
import { useHaptics } from '@/hooks/useHaptics'
import { playSuccessChime } from '@/lib/sound'
import { mediaVisual } from '@/components/Media'
import { AssetIcon } from '@/components/AssetIcon'
import { Disclaimer } from '@/components/Disclaimer'
import { HomeIcon, ChevLeft, StarIcon, VolumeIcon, RefreshIcon } from '@/lib/icons'
import { ANIMALS } from '@/data/animals'
import { L5_COLORS } from '@/data/levelContent'
import { getAnimalLabel, getAnimalSound, getColorLabel, profileOf } from '@/data/dialects'
import type { GameType, MatchDifficulty } from '@/types'

const ACCENT = '#D69A06'
const DIFFS: { id: MatchDifficulty; label: string; stars: number; color: string }[] = [
  { id: 'very_easy', label: 'سهل جدًا', stars: 2, color: '#22c55e' },
  { id: 'easy', label: 'سهل', stars: 2, color: '#3b82f6' },
  { id: 'medium', label: 'متوسط', stars: 3, color: '#f97316' },
  { id: 'advanced', label: 'متقدم', stars: 4, color: '#ef4444' },
]

interface Card { id: string; key: string }
const shuffle = <T,>(a: T[]): T[] => {
  const r = [...a]
  for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[r[i], r[j]] = [r[j], r[i]] }
  return r
}

export function MatchingGameScreen() {
  const nav = useNav()
  const gameType = (nav.params.gameType as GameType) ?? 'color'
  const isAnimal = gameType === 'animal'

  const child = useChildren((s) => s.children.find((c) => c.id === s.activeId) ?? null)
  const activeId = useChildren((s) => s.activeId)
  const prog = useChildren((s) => (s.activeId ? s.progress[s.activeId] : undefined))
  const addStars = useChildren((s) => s.addStars)
  const fallback = useSettings((s) => s.selectedDialect)
  const s = useSettings()
  const games = useGames()
  const { speak } = useSpeech()
  const haptic = useHaptics()

  const profile = profileOf(child, fallback)
  const stars = progressStats(prog).stars
  const quiet = s.sensoryMode === 'sensitive' || s.disableLoudSounds

  // setup options (seeded from settings)
  const [phase, setPhase] = useState<'setup' | 'preview' | 'play' | 'done'>('setup')
  const [difficulty, setDifficulty] = useState<MatchDifficulty>(
    s.gameCardCount === 4 ? 'very_easy' : s.gameCardCount === 6 ? 'easy' : s.gameCardCount === 12 ? 'advanced' : 'medium',
  )
  const [previewSec, setPreviewSec] = useState(s.gamePreviewSeconds)
  const [animations, setAnimations] = useState(!s.reduceMotion)
  const [applause, setApplause] = useState(s.rewardsEnabled)
  const [animalSnd, setAnimalSnd] = useState(s.animalSoundsEnabled)

  const [cards, setCards] = useState<Card[]>([])
  const [faceUp, setFaceUp] = useState<string[]>([])
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [attempts, setAttempts] = useState(0)
  const [matches, setMatches] = useState(0)
  const [tryMsg, setTryMsg] = useState(false)
  const [celebrate, setCelebrate] = useState<string | null>(null)
  const [count, setCount] = useState(0)
  const busy = useRef(false)
  const startedAt = useRef(0)

  const labelFor = (key: string) => (isAnimal ? getAnimalLabel(key, profile) : getColorLabel(key))
  const visualFor = (key: string, size: number): ReactNode => mediaVisual(key, size, s.colorDisplayMode)

  const begin = () => {
    const pairs = CARD_COUNT[difficulty] / 2
    const pool = isAnimal ? ANIMALS.map((a) => a.key) : L5_COLORS.map((c) => c.key)
    const chosen = shuffle(pool).slice(0, pairs)
    const deck: Card[] = shuffle(chosen.flatMap((key, i) => [
      { id: `${key}_a_${i}`, key }, { id: `${key}_b_${i}`, key },
    ]))
    setCards(deck); setFaceUp([]); setMatched(new Set()); setAttempts(0); setMatches(0)
    if (activeId) games.startGame(activeId, gameType)
    startedAt.current = Date.now()
    setPhase('preview'); setCount(previewSec)
  }

  // preview countdown
  useEffect(() => {
    if (phase !== 'preview') return
    if (count <= 0) { setPhase('play'); return }
    const t = window.setTimeout(() => setCount((c) => c - 1), 1000)
    return () => window.clearTimeout(t)
  }, [phase, count])

  // completion check
  useEffect(() => {
    if (phase === 'play' && cards.length > 0 && matched.size === cards.length) {
      const timeMs = Date.now() - startedAt.current
      if (activeId) games.completeGame(activeId, gameType, cards.length / 2, timeMs)
      addStars(2) // completion bonus
      setPhase('done')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matched, phase, cards])

  const onTap = (card: Card) => {
    if (phase !== 'play' || busy.current) return
    if (faceUp.includes(card.id) || matched.has(card.id)) return
    haptic('tap')
    const next = [...faceUp, card.id]
    setFaceUp(next)
    if (next.length === 2) {
      busy.current = true
      setAttempts((a) => a + 1)
      const a = cards.find((c) => c.id === next[0])!
      const b = cards.find((c) => c.id === next[1])!
      if (a.key === b.key) {
        window.setTimeout(() => {
          setMatched((m) => new Set([...m, a.id, b.id]))
          setFaceUp([])
          onMatch(a.key)
          busy.current = false
        }, 420)
      } else {
        window.setTimeout(() => { setFaceUp([]); setTryMsg(true); window.setTimeout(() => setTryMsg(false), 700); busy.current = false }, 820)
      }
    }
  }

  const onMatch = (key: string) => {
    setMatches((m) => m + 1)
    addStars(1)
    if (activeId) games.recordMatch(activeId, gameType, key)
    haptic('success')
    if (applause && !quiet) playSuccessChime({ enabled: s.soundEnabled, gentle: s.sensoryMode === 'calm' })
    const name = labelFor(key)
    speak(name)
    if (isAnimal && animalSnd && !quiet) window.setTimeout(() => speak(getAnimalSound(key)), 700)
    setCelebrate(key)
    window.setTimeout(() => setCelebrate(null), 1500)
  }

  const cols = cards.length <= 4 ? 2 : cards.length <= 6 ? 3 : 4
  const flip = animations && !s.reduceMotion // sensory/reduce-motion => no flip animation
  const Toggle = ({ on, set }: { on: boolean; set: (v: boolean) => void }) => (
    <label className="switch"><input type="checkbox" checked={on} onChange={(e) => set(e.target.checked)} /><span className="switch__track"><span className="switch__thumb" /></span></label>
  )

  return (
    <div className="screen level" style={{ ['--accent' as string]: ACCENT, background: '#FFFBEB' }}>
      <header className="level-bar">
        <span className="stars-badge"><StarIcon size={18} style={{ color: 'var(--star)' }} /> {stars}<small>نجوم</small></span>
        <div className="level-title" style={{ background: ACCENT }}>
          <strong>{isAnimal ? 'مطابقة الحيوانات' : 'مطابقة الألوان'}</strong>
          <span>{phase === 'play' ? `محاولات: ${attempts}` : phase === 'preview' ? 'تذكّر أماكن الكروت' : 'لعبة الذاكرة والمطابقة'}</span>
        </div>
        <button className="home-mini" aria-label="الرئيسية" onClick={() => nav.reset('home')}><HomeIcon size={22} /><small>الرئيسية</small></button>
      </header>

      {phase === 'setup' && (
        <div className="screen__scroll stack">
          <button className="btn btn--ghost" style={{ alignSelf: 'flex-start' }} onClick={() => nav.go('games')}><ChevLeft size={18} /> رجوع</button>
          <h3 className="settings-h" style={{ marginInline: 0 }}>اختر درجة الصعوبة</h3>
          <div className="diff-grid">
            {DIFFS.map((d) => (
              <button key={d.id} className={`diff-card${difficulty === d.id ? ' is-on' : ''}`}
                style={difficulty === d.id ? { borderColor: d.color, boxShadow: `0 0 0 3px ${d.color}33` } : undefined}
                onClick={() => setDifficulty(d.id)}>
                <span style={{ display: 'inline-flex', gap: 2 }}>{Array.from({ length: d.stars }).map((_, i) => <StarIcon key={i} size={16} style={{ color: d.color }} />)}</span>
                <strong>{d.label}</strong>
                <span className="muted-note">{CARD_COUNT[d.id]} كروت</span>
              </button>
            ))}
          </div>

          <h3 className="settings-h" style={{ marginInline: 0 }}>خيارات اللعبة</h3>
          <div className="card rows">
            <div className="row"><span className="row__label">مدة ظهور الكروت</span>
              <select value={previewSec} onChange={(e) => setPreviewSec(Number(e.target.value) as 2 | 4 | 6)}>
                <option value={2}>٢ ثوانٍ</option><option value={4}>٤ ثوانٍ</option><option value={6}>٦ ثوانٍ</option>
              </select>
            </div>
            <div className="row"><span className="row__label">الحركة</span><Toggle on={animations} set={setAnimations} /></div>
            <div className="row"><span className="row__label">التصفيق</span><Toggle on={applause} set={setApplause} /></div>
            {isAnimal && <div className="row"><span className="row__label">أصوات الحيوانات</span><Toggle on={animalSnd} set={setAnimalSnd} /></div>}
          </div>

          <button className="btn btn--primary btn--block btn--lg" style={{ background: '#22c55e' }} onClick={begin}>ابدأ اللعبة</button>
        </div>
      )}

      {(phase === 'preview' || phase === 'play') && (
        <div className="screen__scroll stack">
          <div className="game-status">
            <span>{phase === 'preview' ? 'تذكّر أماكن الكروت' : 'أوجد كل زوج متطابق'}</span>
            {phase === 'preview' && <span className="count-badge">{count} ثوانٍ</span>}
          </div>

          <div className="match-grid" data-cols={cols}>
            {cards.map((card) => {
              const show = phase === 'preview' || faceUp.includes(card.id) || matched.has(card.id)
              const isMatched = matched.has(card.id)
              return (
                <button
                  key={card.id}
                  className={`match-card${show ? ' is-up' : ''}${isMatched ? ' is-matched' : ''}${flip ? '' : ' no-flip'} ${isAnimal ? 'mc--animal' : 'mc--color'}`}
                  onClick={() => onTap(card)}
                  aria-label={show ? labelFor(card.key) : 'كرت مقلوب'}
                >
                  {show ? <span className="match-card__face">{visualFor(card.key, isAnimal ? 46 : 52)}</span>
                    : <span className="match-card__back" aria-hidden><AssetIcon refKey={isAnimal ? 'rewards/star_burst' : 'rewards/star'} size={40} /></span>}
                </button>
              )
            })}
          </div>

          {tryMsg && <div className="try-msg">حاول</div>}
        </div>
      )}

      {phase === 'done' && (
        <div className="screen__scroll stack" style={{ alignItems: 'center', textAlign: 'center' }}>
          <div aria-hidden><AssetIcon refKey="rewards/confetti" size={84} /></div>
          <h2 style={{ color: ACCENT }}>أحسنت! أكملت اللعبة</h2>
          <div className="stats" style={{ width: '100%' }}>
            <div className="stat"><div className="stat__num stat__num--g">{matches}</div><div className="stat__lbl">أزواج</div></div>
            <div className="stat"><div className="stat__num stat__num--p">{attempts}</div><div className="stat__lbl">محاولات</div></div>
            <div className="stat"><div className="stat__num stat__num--b">+{matches + 2}</div><div className="stat__lbl">نجوم</div></div>
          </div>
          <button className="btn btn--primary btn--block btn--lg" onClick={() => setPhase('setup')}><RefreshIcon size={20} /> العب مرة أخرى</button>
          <button className="btn btn--soft btn--block" onClick={() => nav.reset('home')}><HomeIcon size={18} /> الرئيسية</button>
        </div>
      )}

      {celebrate && (
        <div className="match-celebrate" role="status">
          <div className="match-celebrate__card">
            <span className="match-celebrate__big" aria-hidden>{visualFor(celebrate, 84)}</span>
            <div className="match-celebrate__label" style={{ color: ACCENT }}>{labelFor(celebrate)}</div>
            <div className="match-celebrate__row">
              <span className="star-pill"><StarIcon size={18} style={{ color: 'var(--star)' }} /> +1 نجمة</span>
              <button className="iconbtn iconbtn--sm" aria-label="استمع" onClick={() => speak(labelFor(celebrate))}><VolumeIcon size={18} /></button>
            </div>
          </div>
        </div>
      )}

      {phase !== 'done' && <Disclaimer />}
    </div>
  )
}
