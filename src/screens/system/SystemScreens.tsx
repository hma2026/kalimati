import type { ReactNode } from 'react'
import { useNav } from '@/store/useNavStore'
import {
  RefreshIcon, GlobeIcon, CloseIcon, CheckIcon, TrashIcon, MicIcon,
  UploadIcon, GridIcon, VolumeIcon, LockIcon, HeartIcon, BackIcon, HomeIcon,
} from '@/lib/icons'

/** قاعدة مبسّطة للشاشات التشغيلية: أيقونة كبيرة + عنوان + رسالة + أزرار. بلا Dashboard/إحصائيات. */
function OperationalShell({
  icon, title, message, accent = 'var(--primary)', spin, children, showHome = true,
}: {
  icon: ReactNode
  title: string
  message?: string
  accent?: string
  spin?: boolean
  children?: ReactNode
  showHome?: boolean
}) {
  const nav = useNav()
  return (
    <div className="screen op" style={{ ['--accent' as string]: accent }}>
      <header className="op-top">
        <button className="edu-head__btn" aria-label="رجوع" onClick={() => nav.back()}><BackIcon size={22} /></button>
        {showHome && (
          <button className="edu-head__btn" aria-label="الرئيسية" onClick={() => nav.reset('home')}><HomeIcon size={20} /></button>
        )}
      </header>
      <div className="op-body">
        <span className={'op-icon' + (spin ? ' op-icon--spin' : '')}>{icon}</span>
        <h1 className="op-title">{title}</h1>
        {message && <p className="op-msg">{message}</p>}
        {children && <div className="op-actions">{children}</div>}
      </div>
    </div>
  )
}

function PrimaryBtn({ label, onClick, accent }: { label: string; onClick: () => void; accent?: string }) {
  return (
    <button className="op-btn" style={{ background: accent ?? 'var(--primary)' }} onClick={onClick}>{label}</button>
  )
}
function GhostBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return <button className="op-btn op-btn--ghost" onClick={onClick}>{label}</button>
}

const useHome = () => useNav().reset
const useBackFn = () => useNav().back

// ============ تشغيلية ============
export function LoadingScreen() {
  return <OperationalShell showHome={false} icon={<RefreshIcon size={48} />} spin title="جارٍ التحميل…" message="لحظات من فضلك" />
}
export function OfflineScreen() {
  const back = useBackFn()
  return (
    <OperationalShell accent="#0891B2" icon={<GlobeIcon size={48} />} title="لا يوجد اتصال بالإنترنت" message="تحقّق من الشبكة وحاول مرة أخرى">
      <PrimaryBtn label="إعادة المحاولة" accent="#0891B2" onClick={() => back()} />
    </OperationalShell>
  )
}
export function ErrorScreen() {
  const back = useBackFn()
  return (
    <OperationalShell accent="#E84C68" icon={<CloseIcon size={44} />} title="تعذّر التحميل" message="حدث خطأ غير متوقّع">
      <PrimaryBtn label="إعادة المحاولة" accent="#E84C68" onClick={() => back()} />
    </OperationalShell>
  )
}
export function EmptyStateScreen() {
  const reset = useHome()
  return (
    <OperationalShell icon={<GridIcon size={46} />} title="لا توجد أنشطة بعد" message="ابدأ من الصفحة الرئيسية">
      <PrimaryBtn label="الرئيسية" onClick={() => reset('home')} />
    </OperationalShell>
  )
}
export function SuccessScreen() {
  const reset = useHome()
  return (
    <OperationalShell accent="#2F9B5F" icon={<CheckIcon size={46} />} title="تم الحفظ بنجاح" >
      <PrimaryBtn label="تمام" accent="#2F9B5F" onClick={() => reset('home')} />
    </OperationalShell>
  )
}
export function ConfirmDeleteScreen() {
  const back = useBackFn()
  return (
    <OperationalShell accent="#E84C68" icon={<TrashIcon size={44} />} title="تأكيد الحذف" message="هل تريد حذف هذا العنصر؟ لا يمكن التراجع.">
      <PrimaryBtn label="حذف" accent="#E84C68" onClick={() => back()} />
      <GhostBtn label="إلغاء" onClick={() => back()} />
    </OperationalShell>
  )
}
export function MicPermissionScreen() {
  const back = useBackFn()
  return (
    <OperationalShell icon={<MicIcon size={46} />} title="إذن الميكروفون" message="نحتاج إذن الميكروفون لتسجيل نطق الطفل">
      <PrimaryBtn label="السماح" onClick={() => back()} />
      <GhostBtn label="لاحقاً" onClick={() => back()} />
    </OperationalShell>
  )
}
export function CameraPermissionScreen() {
  const back = useBackFn()
  return (
    <OperationalShell icon={<UploadIcon size={46} />} title="إذن الكاميرا" message="نحتاج إذن الكاميرا لإضافة صورة مخصصة">
      <PrimaryBtn label="السماح" onClick={() => back()} />
      <GhostBtn label="لاحقاً" onClick={() => back()} />
    </OperationalShell>
  )
}
export function CustomPhotoScreen() {
  const back = useBackFn()
  return (
    <OperationalShell icon={<UploadIcon size={46} />} title="إضافة صورة مخصصة" message="اختر صورة من جهازك لاستخدامها في البطاقات">
      <PrimaryBtn label="اختيار صورة" onClick={() => back()} />
    </OperationalShell>
  )
}
export function EditPhotoScreen() {
  const back = useBackFn()
  return (
    <OperationalShell icon={<GridIcon size={46} />} title="تعديل الصورة" message="قص الصورة واضبطها قبل الحفظ">
      <PrimaryBtn label="حفظ" onClick={() => back()} />
      <GhostBtn label="إلغاء" onClick={() => back()} />
    </OperationalShell>
  )
}
export function PhotoSavedScreen() {
  const reset = useHome()
  return (
    <OperationalShell accent="#2F9B5F" icon={<CheckIcon size={46} />} title="تم حفظ الصورة بنجاح">
      <PrimaryBtn label="تمام" accent="#2F9B5F" onClick={() => reset('home')} />
    </OperationalShell>
  )
}

// ============ إعدادات فرعية (تُفتح خلف بوابة المدرب) ============
export function VoiceSettingsScreen() {
  const back = useBackFn()
  return (
    <OperationalShell icon={<VolumeIcon size={46} />} title="إعدادات الصوت" message="تحكّم في النطق ودرجة الصوت من شاشة المدرب">
      <PrimaryBtn label="رجوع" onClick={() => back()} />
    </OperationalShell>
  )
}
export function NotificationSettingsScreen() {
  const back = useBackFn()
  return (
    <OperationalShell icon={<HeartIcon size={46} />} title="إعدادات التنبيهات" message="تذكيرات التدريب اليومي">
      <PrimaryBtn label="رجوع" onClick={() => back()} />
    </OperationalShell>
  )
}
export function PrivacySettingsScreen() {
  const back = useBackFn()
  return (
    <OperationalShell icon={<LockIcon size={46} />} title="الخصوصية" message="بياناتك تبقى على جهازك ولا تُشارك">
      <PrimaryBtn label="رجوع" onClick={() => back()} />
    </OperationalShell>
  )
}
export function AboutHelpScreen() {
  const back = useBackFn()
  return (
    <OperationalShell icon={<HeartIcon size={46} />} title="عن التطبيق والمساعدة" message="كلمة كلمة — أداة مساعدة للتواصل والتدريب على النطق. لا تغني عن المختصين.">
      <PrimaryBtn label="رجوع" onClick={() => back()} />
    </OperationalShell>
  )
}
