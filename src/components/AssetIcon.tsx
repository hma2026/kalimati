import type { CSSProperties } from 'react'
import { assetByRef } from '@/data/assetManifest'

/**
 * يعرض أصل SVG بمرجعه الكامل داخل images، مثل: <AssetIcon refKey="ui/speaker" />
 * أو <AssetIcon refKey="animals/cat" />. لا يعرض شيئاً إن لم يوجد الأصل (لا emoji).
 */
export function AssetIcon({
  refKey, size = 28, className, style,
}: { refKey: string; size?: number; className?: string; style?: CSSProperties }) {
  const url = assetByRef(refKey)
  if (!url) return null
  return (
    <img
      src={url} alt="" width={size} height={size} loading="lazy" decoding="async"
      className={className}
      style={{ width: size, height: size, objectFit: 'contain', display: 'block', ...style }}
    />
  )
}
