import { useState } from 'react'
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

/** البديل المعبّر (ليس placeholder رمادي): بقعة/مربع/دائرة لون، شكل مرسوم، أو رمز تعبيري كبير. */
function fallbackNode(key: string, size: number, colorMode: ColorDisplayMode): ReactNode {
  const m = getMedia(key)
  if (!m) return <span style={{ fontSize: size * 0.9, lineHeight: 1 }} aria-hidden>🧩</span>
  if (m.kind === 'color') {
    const hex = m.hex ?? '#cccccc'
    if (colorMode === 'square') return <span aria-hidden style={swatch(hex, size, 14)} />
    if (colorMode === 'circle') return <span aria-hidden style={swatch(hex, size, '50%')} />
    return <ColorBlob hex={hex} size={size} />
  }
  if (m.kind === 'shape') return <ShapeGlyph type={key} size={size} />
  return <span style={{ fontSize: Math.round(size * 0.92), lineHeight: 1 }} aria-hidden>{m.emoji ?? '🧩'}</span>
}

/**
 * يعرض الرسم التعبيري فوراً، وإن وُجدت صورة فعلية (assets) يتلاشى ظهورها فوقه.
 * فلا يظهر مربّع صورة مكسور أو رمادي إطلاقاً، والصور الحقيقية تُستخدم تلقائياً.
 */
function MediaImg({ k, size, colorMode }: { k: string; size: number; colorMode: ColorDisplayMode }) {
  const url = getAsset(k) ?? getMediaImage(k) ?? getAssetUrl(k)
  const [loaded, setLoaded] = useState(false)
  const fb = fallbackNode(k, size, colorMode)
  if (!url) return <>{fb}</>
  return (
    <span style={{ position: 'relative', display: 'inline-grid', placeItems: 'center', width: size, height: size }}>
      {!loaded && fb}
      <img
        src={url} alt="" width={size} height={size} loading="lazy" decoding="async"
        onLoad={() => setLoaded(true)} onError={() => setLoaded(false)}
        style={loaded
          ? { width: size, height: size, objectFit: 'contain', display: 'block' }
          : { position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
      />
    </span>
  )
}

/** مسار الرسم الموحّد لكل الشاشات (الدرس واللعبة والتقارير) بنفس المفتاح. */
export function mediaVisual(key: string, size = 56, colorMode: ColorDisplayMode = 'lesson'): ReactNode {
  return <MediaImg k={key} size={size} colorMode={colorMode} />
}
