import type { ReactNode, CSSProperties } from 'react'
import { ColorBlob, ShapeGlyph } from './Glyphs'
import { getMedia, getMediaImage } from '@/data/media'
import { getAssetUrl } from '@/data/assetManifest'
import { getAsset } from '@/assets/assetRegistry'
import type { ColorDisplayMode } from '@/types'

const swatch = (hex: string, size: number, round: number | string): CSSProperties => ({
  width: size, height: size, background: hex, borderRadius: round, display: 'inline-block',
  boxShadow: hex.toLowerCase() === '#ffffff' ? 'inset 0 0 0 2px var(--line)' : '0 4px 10px rgba(0,0,0,.12)',
})

/**
 * مسار الرسم الموحّد (يقرأ منه الدرس واللعبة والتقارير بنفس المفتاح).
 * الأولوية:
 *   1) صورة من assetManifest (المصدر الأساسي — placeholder الآن، تُستبدل لاحقاً).
 *   2) تجاوز يدوي عبر MEDIA[key].image.
 *   3) صورة من assetRegistry (src/assets/images).
 *   4) بديل CSS مؤقت: بقعة/مربع/دائرة لون، شكل، أو رمز تعبيري.
 * `colorMode` يؤثّر على الألوان في مسار البديل فقط.
 */
export function mediaVisual(key: string, size = 56, colorMode: ColorDisplayMode = 'lesson'): ReactNode {
  const img = getAssetUrl(key) ?? getMediaImage(key) ?? getAsset(key)
  if (img) {
    return <img src={img} alt="" width={size} height={size} style={{ objectFit: 'contain', display: 'inline-block' }} />
  }

  const m = getMedia(key)
  if (!m) return <span style={{ fontSize: size, lineHeight: 1 }}>{key}</span>

  if (m.kind === 'color') {
    const hex = m.hex ?? '#cccccc'
    if (colorMode === 'square') return <span aria-hidden style={swatch(hex, size, 12)} />
    if (colorMode === 'circle') return <span aria-hidden style={swatch(hex, size, '50%')} />
    return <ColorBlob hex={hex} size={size} />
  }
  if (m.kind === 'shape') return <ShapeGlyph type={key} size={size} />
  return <span style={{ fontSize: size, lineHeight: 1 }} aria-hidden>{m.emoji}</span>
}
