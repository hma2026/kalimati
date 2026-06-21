import { useNav } from '@/store/useNavStore'
import { useChildren, progressStats } from '@/store/useChildrenStore'
import { useSpeech } from '@/hooks/useSpeech'
import { useHaptics } from '@/hooks/useHaptics'
import { AppHeader } from '@/components/AppHeader'
import { PlaceholderVisual } from '@/components/PlaceholderVisual'
import { mediaVisual } from '@/components/Media'
import { getAsset } from '@/assets/assetRegistry'
import { VolumeIcon } from '@/lib/icons'
import { wordCategories } from '@/data/words'

/**
 * شاشة "كلمات مفردة" — أقسام بالفئات، كل قسم شبكة 8 أعمدة منتظمة.
 * كل بطاقة: صورة كبيرة (حقيقية أو بديل SVG مؤقت) + كلمة صغيرة + زر نطق واحد.
 * كل صورة قابلة للاستبدال بأعلى جودة من شاشة الإدارة (تبويب الأيقونات والصور).
 */
export function CardGridScreen() {
  const nav = useNav()
  const title = (nav.params.title as string) ?? 'كلمات مفردة'
  const { speak } = useSpeech()
  const haptic = useHaptics()
  const prog = useChildren((s) => (s.activeId ? s.progress[s.activeId] : undefined))
  const stats = progressStats(prog)

  const say = (text: string) => { haptic('tap'); speak(text) }

  return (
    <div className="screen">
      <AppHeader title={title} stars={stats.stars} />

      <div className="words-scroll screen__scroll">
        {wordCategories.map((g) => (
          <section className="wsec" key={g.id}>
            <h2 className="wsec__title" style={{ ['--gt' as never]: g.tint }}>{g.label}</h2>
            <div className="wgrid">
              {g.words.map((c) => {
                const hasImg = !!(c.media && getAsset(c.media))
                return (
                  <button className="wcell" key={c.id} onClick={() => say(c.say ?? c.label)}>
                    <span className="wcell__img">
                      {hasImg ? mediaVisual(c.media!, 96) : <PlaceholderVisual size={64} accent={g.tint} />}
                    </span>
                    <span className="wcell__row">
                      <span className="wcell__word">{c.label}</span>
                      <span className="wcell__snd" aria-hidden><VolumeIcon size={15} /></span>
                    </span>
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
