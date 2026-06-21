import { useNav } from '@/store/useNavStore'
import { useChildren, progressStats } from '@/store/useChildrenStore'
import { useHaptics } from '@/hooks/useHaptics'
import { SectionHeader } from '@/components/SectionHeader'
import { ColorBlob } from '@/components/Glyphs'
import { AssetIcon } from '@/components/AssetIcon'
import { Disclaimer } from '@/components/Disclaimer'
import { ChevLeft } from '@/lib/icons'

const ACCENT = '#D69A06'

export function GamesScreen() {
  const nav = useNav()
  const prog = useChildren((s) => (s.activeId ? s.progress[s.activeId] : undefined))
  const haptic = useHaptics()
  const stars = progressStats(prog).stars

  const open = (gameType: 'color' | 'animal') => { haptic('tap'); nav.go('match', { gameType }) }

  return (
    <div className="screen level" style={{ ['--accent' as string]: ACCENT, background: '#FFFBEB' }}>
      <SectionHeader title="ألعاب تعليمية" desc="تعلّم وطوّر مهاراتك بطريقة ممتعة" accent={ACCENT} stars={stars} />

      <div className="screen__scroll stack">
        <button className="game-card" onClick={() => open('color')}>
          <span className="game-card__chev"><ChevLeft size={26} /></span>
          <span className="game-card__visuals" aria-hidden>
            <ColorBlob hex="#EF4444" size={38} /><ColorBlob hex="#3B82F6" size={38} />
            <ColorBlob hex="#FACC15" size={38} /><ColorBlob hex="#22C55E" size={38} />
          </span>
          <span className="game-card__txt">
            <strong>مطابقة الألوان</strong>
            <span>طابِق كرتين من نفس اللون</span>
          </span>
        </button>

        <button className="game-card" onClick={() => open('animal')}>
          <span className="game-card__chev"><ChevLeft size={26} /></span>
          <span className="game-card__visuals" aria-hidden><AssetIcon refKey="animals/cat" size={38} /><AssetIcon refKey="animals/dog" size={38} /><AssetIcon refKey="animals/cow" size={38} /><AssetIcon refKey="animals/sheep" size={38} /></span>
          <span className="game-card__txt">
            <strong>مطابقة الحيوانات</strong>
            <span>طابِق كرتين من نفس الحيوان</span>
          </span>
        </button>

        <div className="soon-grid">
          <div className="game-card game-card--soon">
            <span className="badge-soon">قريباً</span>
            <span className="game-card__visuals" aria-hidden><AssetIcon refKey="animals/cat" size={34} /> = قط</span>
            <span className="game-card__txt"><strong>مطابقة صورة وكلمة</strong></span>
          </div>
          <div className="game-card game-card--soon">
            <span className="badge-soon">قريباً</span>
            <span className="game-card__visuals" aria-hidden><AssetIcon refKey="ui/speaker" size={30} /> <AssetIcon refKey="animals/cat" size={34} /></span>
            <span className="game-card__txt"><strong>مطابقة صوت بصورة</strong></span>
          </div>
        </div>
      </div>

      <Disclaimer />
    </div>
  )
}
