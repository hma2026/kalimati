import { useEffect, useState } from 'react'
import { DownloadIcon, CloseIcon } from '@/lib/icons'

interface BIPEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function isStandalone(): boolean {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    // iOS Safari
    (navigator as unknown as { standalone?: boolean }).standalone === true
  )
}

function isIOS(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    // iPadOS reports as Mac with touch
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

const DISMISS_KEY = 'kalimati.installDismissed.v1'

/** بطاقة "تثبيت التطبيق" — يظهر فقط عند إمكانية التثبيت وعدم وجوده مثبتاً. */
export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null)
  const [show, setShow] = useState(false)
  const [iosHint, setIosHint] = useState(false)

  useEffect(() => {
    if (isStandalone()) return
    if (localStorage.getItem(DISMISS_KEY)) return

    const onBIP = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BIPEvent)
      setShow(true)
    }
    window.addEventListener('beforeinstallprompt', onBIP)

    // iOS never fires beforeinstallprompt → show manual A2HS hint
    if (isIOS()) { setShow(true); setIosHint(true) }

    const onInstalled = () => setShow(false)
    window.addEventListener('appinstalled', onInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBIP)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const dismiss = () => {
    setShow(false)
    try { localStorage.setItem(DISMISS_KEY, '1') } catch { /* ignore */ }
  }

  const install = async () => {
    if (!deferred) return
    await deferred.prompt()
    await deferred.userChoice
    setDeferred(null)
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="install">
      <DownloadIcon />
      {iosHint ? (
        <span className="install__txt">
          لتثبيت التطبيق: اضغط زر المشاركة ثم «إضافة إلى الشاشة الرئيسية»
        </span>
      ) : (
        <>
          <span className="install__txt">ثبّت «كلمة كلمة» على جهازك ليعمل بدون إنترنت</span>
          <button className="btn btn--soft" onClick={install}>تثبيت</button>
        </>
      )}
      <button className="iconbtn iconbtn--sm iconbtn--ghost" aria-label="إغلاق" onClick={dismiss}>
        <CloseIcon size={20} />
      </button>
    </div>
  )
}
