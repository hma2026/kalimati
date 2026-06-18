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

/** الألوان/الأشكال = متّجهات نظيفة (تحترم إعداد العرض). الرمز التعبيري طوارئ فقط. */
function fallbackNode(key: string, size: number, colorMode: ColorDisplayMode): ReactNode {
  const m = getMedia(key)
  if (m?.kind === 'color') {
    const hex = m.hex ?? '#cccccc'
    if (colorMode === 'square') return <span aria-hidden style={swatch(hex, size, 14)} />
    if (colorMode === 'circle') return <span aria-hidden style={swatch(hex, size, '50%')} />
    return <ColorBlob hex={hex} size={size} />
  }
  if (m?.kind === 'shape') return <ShapeGlyph type={key} size={size} />
  return <span style={{ fontSize: Math.round(size * 0.92), lineHeight: 1 }} aria-hidden>{m?.emoji ?? ''}</span>
}

/**
 * يعرض أصل SVG المستقل مباشرةً لكل عنصر (حيوان/شعور/طعام/فعل/ألم/تهدئة/يومي).
 * الألوان والأشكال تُرسم كمتّجهات نظيفة تحترم إعداد العرض. لا emoji كتصميم نهائي،
 * ولا placeholder رمادي، ولا صورة مكسورة — الرمز التعبيري لا يظهر إلا إذا فشل
 * تحميل أصل فعلي (حالة طوارئ لا تحدث مع أصولنا المضمّنة).
 */
function MediaImg({ k, size, colorMode }: { k: string; size: number; colorMode: ColorDisplayMode }) {
  const [errored, setErrored] = useState(false)
  const m = getMedia(k)
  // الألوان في وضع مربّع/دائرة تُرسم متّجهاً يحترم الإعداد؛ غير ذلك (وضع الدرس)
  // والأشكال تستخدم أصل SVG النظيف من السجل.
  if (m?.kind === 'color' && (colorMode === 'square' || colorMode === 'circle')) {
    return <>{fallbackNode(k, size, colorMode)}</>
  }
  const url = getAsset(k) ?? getMediaImage(k) ?? getAssetUrl(k)
  if (!url || errored) return <>{fallbackNode(k, size, colorMode)}</>
  return (
    <img
      src={url} alt="" width={size} height={size} loading="lazy" decoding="async"
      onError={() => setErrored(true)}
      style={{ width: size, height: size, objectFit: 'contain', display: 'block' }}
    />
  )
}

/** مسار الرسم الموحّد لكل الشاشات (الدرس واللعبة والتقارير) بنفس المفتاح. */
export function mediaVisual(key: string, size = 56, colorMode: ColorDisplayMode = 'lesson'): ReactNode {
  return <MediaImg k={key} size={size} colorMode={colorMode} />
}
