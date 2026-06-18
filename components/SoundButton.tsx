import { VolumeIcon } from '@/lib/icons'

interface Props {
  onClick: () => void
  playing?: boolean
  label?: string
}

/** The large round "اسمع الكلمة" button. */
export function SoundButton({ onClick, playing, label = 'اسمع الكلمة' }: Props) {
  return (
    <button
      className={`speak-fab${playing ? ' is-playing' : ''}`}
      onClick={onClick}
      aria-label={label}
    >
      <VolumeIcon size={32} />
    </button>
  )
}
