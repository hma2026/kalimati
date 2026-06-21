import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

/** Base line-icon wrapper (24x24, currentColor). */
function Svg({ children, size = 24, ...p }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...p}
    >
      {children}
    </svg>
  )
}

export const HomeIcon = (p: IconProps) => (
  <Svg {...p}><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></Svg>
)
export const SettingsIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 13a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 7 19.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 13.6 1.7 1.7 0 0 0 1.9 13H1.8a2 2 0 1 1 0-4H2a1.7 1.7 0 0 0 1-2.9l-.1-.1A2 2 0 1 1 5.7 3.2l.1.1A1.7 1.7 0 0 0 8.6 3 1.7 1.7 0 0 0 9.7 1.9V1.8a2 2 0 1 1 4 0V2a1.7 1.7 0 0 0 2.9 1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0 1.2 2.9H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </Svg>
)
export const MenuIcon = (p: IconProps) => (
  <Svg {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Svg>
)
export const BackIcon = (p: IconProps) => (
  // points left to match the mockup headers
  <Svg {...p}><path d="M15 5l-7 7 7 7" /></Svg>
)
export const ChevRight = (p: IconProps) => (
  <Svg {...p}><path d="M9 6l6 6-6 6" /></Svg>
)
export const ChevLeft = (p: IconProps) => (
  <Svg {...p}><path d="M15 6l-6 6 6 6" /></Svg>
)
export const VolumeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 9v6h4l5 4V5L8 9H4z" />
    <path d="M16 8a5 5 0 0 1 0 8" /><path d="M18.5 5.5a9 9 0 0 1 0 13" />
  </Svg>
)
export const MicIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5 11a7 7 0 0 0 14 0" /><path d="M12 18v3" />
  </Svg>
)
export const PlayIcon = (p: IconProps) => (
  <Svg {...p}><path d="M7 5l12 7-12 7V5z" fill="currentColor" stroke="none" /></Svg>
)
export const StopIcon = (p: IconProps) => (
  <Svg {...p}><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" stroke="none" /></Svg>
)
export const CheckIcon = (p: IconProps) => (
  <Svg {...p}><path d="M5 13l4 4L19 7" /></Svg>
)
export const RefreshIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M21 12a9 9 0 1 1-2.6-6.4" /><path d="M21 4v5h-5" />
  </Svg>
)
export const StarIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3l2.7 6 6.3.5-4.8 4.1 1.5 6.2L12 16.9 6.3 19.8l1.5-6.2L3 9.5 9.3 9 12 3z" fill="currentColor" stroke="none" />
  </Svg>
)
export const StarOutlineIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3l2.7 6 6.3.5-4.8 4.1 1.5 6.2L12 16.9 6.3 19.8l1.5-6.2L3 9.5 9.3 9 12 3z" />
  </Svg>
)
export const PawIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="6" cy="11" r="2" fill="currentColor" stroke="none" />
    <circle cx="10" cy="6.5" r="2" fill="currentColor" stroke="none" />
    <circle cx="14" cy="6.5" r="2" fill="currentColor" stroke="none" />
    <circle cx="18" cy="11" r="2" fill="currentColor" stroke="none" />
    <path d="M12 12c-2.6 0-5 1.9-5 4.2 0 1.6 1.3 2.6 3 2.6 .9 0 1.4-.4 2-.4s1.1.4 2 .4c1.7 0 3-1 3-2.6 0-2.3-2.4-4.2-5-4.2z" fill="currentColor" stroke="none" />
  </Svg>
)
export const ChartIcon = (p: IconProps) => (
  <Svg {...p}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></Svg>
)
export const LockIcon = (p: IconProps) => (
  <Svg {...p}><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 1 1 8 0v3" /></Svg>
)
export const PlusIcon = (p: IconProps) => (
  <Svg {...p}><path d="M12 5v14M5 12h14" /></Svg>
)
export const CloseIcon = (p: IconProps) => (
  <Svg {...p}><path d="M6 6l12 12M18 6L6 18" /></Svg>
)
export const VibrateIcon = (p: IconProps) => (
  <Svg {...p}><rect x="8" y="4" width="8" height="16" rx="2" /><path d="M3 9v6M21 9v6" /></Svg>
)
export const TypeIcon = (p: IconProps) => (
  <Svg {...p}><path d="M5 6h14M9 6v13M15 10h6M18 10v9" /></Svg>
)
export const GridIcon = (p: IconProps) => (
  <Svg {...p}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></Svg>
)
export const GlobeIcon = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" /></Svg>
)
export const HeartIcon = (p: IconProps) => (
  <Svg {...p}><path d="M12 20s-7-4.6-9.3-9C1 7.7 3 4.5 6.2 4.5c1.9 0 3.2 1 3.8 2 .6-1 1.9-2 3.8-2C17 4.5 19 7.7 17.3 11 15 15.4 12 20 12 20z" fill="currentColor" stroke="none" /></Svg>
)
export const DownloadIcon = (p: IconProps) => (
  <Svg {...p}><path d="M12 3v12M7 11l5 5 5-5" /><path d="M5 21h14" /></Svg>
)
export const UploadIcon = (p: IconProps) => (
  <Svg {...p}><path d="M12 21V9M7 13l5-5 5 5" /><path d="M5 3h14" /></Svg>
)
export const TrashIcon = (p: IconProps) => (
  <Svg {...p}><path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" /></Svg>
)
export const SparkleIcon = (p: IconProps) => (
  <Svg {...p}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" fill="currentColor" stroke="none" /></Svg>
)

/* ===== v0.5.2 — أيقونات شاشة اختيار الطفل (مرسومة، تدعم التعبئة) ===== */
export const ChatDotsIcon = ({ size = 38 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M5 4h14a3 3 0 0 1 3 3v6.4a3 3 0 0 1-3 3h-7.6l-4.2 3.1A1 1 0 0 1 5.4 19v-2.6A3 3 0 0 1 2 13.4V7a3 3 0 0 1 3-3z"
      fill="currentColor"
    />
    <circle cx="8.4" cy="10.2" r="1.45" fill="#fff" />
    <circle cx="12" cy="10.2" r="1.45" fill="#fff" />
    <circle cx="15.6" cy="10.2" r="1.45" fill="#fff" />
  </svg>
)

export const PaperPlaneIcon = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M21.4 3.1 2.7 10.4c-.7.3-.6 1.3.1 1.5l5.5 1.7 1.7 5.6c.2.7 1.2.8 1.5.1l2.2-4.1 4 3.1c.5.4 1.2.1 1.3-.5L22.3 4c.1-.7-.6-1.2-1.2-.9Z" fill="currentColor" />
    <path d="M9 13.5 21 4" stroke="#fff" strokeWidth="1" strokeLinecap="round" opacity=".55" fill="none" />
    <path d="m9 13.5-.7 4.2 2.6-2.7Z" fill="currentColor" opacity=".8" />
  </svg>
)

export const CareHandsIcon = ({ size = 30 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 6.7c.95-1.65 4.25-1.6 4.6 1 .28 2.05-2 4.05-4.6 5.75C9.4 11.75 7.12 9.75 7.4 7.7c.35-2.6 3.65-2.65 4.6-1Z"
      fill="#fff"
    />
    <path
      d="M4.4 14.2c1.7 0 2.7 1.15 3.75 2.3 1.05 1.1 2.1 1.9 3.85 1.9s2.8-.8 3.85-1.9c1.05-1.15 2.05-2.3 3.75-2.3"
      stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
)

export const BurstIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
    <path d="M7 12h5M8 7l4.5 2.6M8 17l4.5-2.6" />
  </svg>
)
