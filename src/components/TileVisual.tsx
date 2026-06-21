import { assetByRef } from '@/data/assetManifest'
import { getAsset } from '@/assets/assetRegistry'
import { PlaceholderVisual } from './PlaceholderVisual'

/**
 * صورة حقيقية متى توفّرت (بالمفتاح الكامل مثل "animals/cat" أو الاسم المجرّد)،
 * وإلا بديل SVG مؤقت. لا emoji، لا مربع رمادي، لا صورة مكسورة.
 */
export function TileVisual({
  refKey,
  accent = '#7c3aed',
  size = 56,
  glyph,
}: {
  refKey: string
  accent?: string
  size?: number
  glyph?: string
}) {
  const url = (refKey.includes('/') ? assetByRef(refKey) : getAsset(refKey)) ?? null
  if (url) {
    return (
      <span
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          flex: '0 0 auto',
          background: `color-mix(in srgb, ${accent} 13%, #ffffff)`,
        }}
      >
        <img
          src={url}
          alt=""
          width={Math.round(size * 0.78)}
          height={Math.round(size * 0.78)}
          loading="lazy"
          decoding="async"
          style={{ objectFit: 'contain', display: 'block' }}
        />
      </span>
    )
  }
  // Temporary SVG placeholder — replace with final image asset later.
  return <PlaceholderVisual size={size} accent={accent} glyph={glyph} />
}
