import { HeartIcon } from '@/lib/icons'

export function Disclaimer() {
  return (
    <p className="disclaimer">
      <HeartIcon size={15} style={{ color: 'var(--accent, var(--primary))' }} />{' '}
      أداة مساعدة للتواصل والتدريب على النطق، ولا تغني عن المختصين.
    </p>
  )
}
