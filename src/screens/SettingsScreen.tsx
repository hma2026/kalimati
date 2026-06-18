import { useRef, useState } from 'react'
import { useSettings } from '@/store/useSettingsStore'
import { useChildren } from '@/store/useChildrenStore'
import { useNav } from '@/store/useNavStore'
import { AppHeader } from '@/components/AppHeader'
import { blobStore } from '@/lib/blobStore'
import { downloadBackup, importBackup } from '@/lib/backup'
import { DIALECTS } from '@/data/dialects'
import type { DialectId, Difficulty, Gender, GameCardCount, PreviewSeconds, ColorDisplayMode } from '@/types'
import {
  VolumeIcon, VibrateIcon, SparkleIcon, TypeIcon, GridIcon, GlobeIcon, LockIcon,
  HeartIcon, DownloadIcon, UploadIcon, TrashIcon, RefreshIcon, SettingsIcon,
} from '@/lib/icons'
import { AssetIcon } from '@/components/AssetIcon'
import type { CardsPerPage, FontScale, HapticLevel, SensoryMode } from '@/types'

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="switch" aria-label={label}>
      <input type="checkbox" checked={on} onChange={(e) => onChange(e.target.checked)} />
      <span className="switch__track"><span className="switch__thumb" /></span>
    </label>
  )
}

function Choices<T extends string | number>({ value, options, onChange }: {
  value: T; options: { v: T; label: string }[]; onChange: (v: T) => void
}) {
  return (
    <div className="choices">
      {options.map((o) => (
        <button key={String(o.v)} className={o.v === value ? 'is-on' : ''} onClick={() => onChange(o.v)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

function Row({ icon, label, hint, children }: { icon: React.ReactNode; label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="row">
      <span className="row__label">
        <span className="row__icon">{icon}</span>
        <span>{label}{hint && <span className="row__hint" style={{ display: 'block' }}>{hint}</span>}</span>
      </span>
      {children}
    </div>
  )
}

export function SettingsScreen() {
  const s = useSettings()
  const nav = useNav()
  const activeId = useChildren((st) => st.activeId)
  const activeChild = useChildren((st) => st.children.find((c) => c.id === st.activeId) ?? null)
  const updateChild = useChildren((st) => st.updateChild)
  const resetChild = useChildren((st) => st.resetChild)
  const [tab, setTab] = useState<'settings' | 'data'>('settings')
  const [msg, setMsg] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)

  const flash = (t: string) => { setMsg(t); window.setTimeout(() => setMsg(null), 2500) }

  const onImportFile = async (file: File) => {
    const text = await file.text()
    const res = importBackup(text)
    flash(res.ok ? 'تم استيراد النسخة بنجاح' : res.error ?? 'تعذّر الاستيراد')
  }

  const setPin = () => {
    if (s.pin) {
      if (window.confirm('إزالة رمز القفل؟')) { s.update('pin', null); flash('تم إزالة الرمز') }
      return
    }
    const code = window.prompt('أدخل رمزاً من 4 أرقام لقفل الإعدادات:')
    if (code && /^\d{4}$/.test(code)) { s.update('pin', code); flash('تم تعيين الرمز') }
    else if (code) flash('الرمز يجب أن يكون 4 أرقام')
  }

  const clearAll = async () => {
    if (!window.confirm('سيتم مسح جميع الأطفال والتقدّم والإعدادات نهائياً. متابعة؟')) return
    await blobStore.clear()
    try {
      localStorage.removeItem('kalimati.children.v1')
      localStorage.removeItem('kalimati.settings.v1')
    } catch { /* ignore */ }
    location.reload()
  }

  return (
    <div className="screen">
      <AppHeader title="الإعدادات" />

      <div className="seg">
        <button className={`seg__btn${tab === 'settings' ? ' seg__btn--active' : ''}`} onClick={() => setTab('settings')}>
          <SettingsIcon size={18} /> الإعدادات
        </button>
        <button className={`seg__btn${tab === 'data' ? ' seg__btn--active' : ''}`} onClick={() => setTab('data')}>
          <DownloadIcon size={18} /> البيانات
        </button>
      </div>

      {msg && <div className="install" style={{ background: 'var(--green-soft)', borderColor: '#bbf7d0', color: '#166534' }}>{msg}</div>}

      {tab === 'settings' ? (
        <div className="screen__scroll">
          <div className="card rows">
            <Row icon={<VolumeIcon size={20} />} label="الصوت" hint="نغمة المكافأة والتفاعل">
              <Toggle on={s.soundEnabled} onChange={(v) => s.update('soundEnabled', v)} label="الصوت" />
            </Row>
            <Row icon={<VolumeIcon size={20} />} label="نطق الكلمات" hint="القراءة الصوتية للكلمات">
              <Toggle on={s.speechEnabled} onChange={(v) => s.update('speechEnabled', v)} label="نطق الكلمات" />
            </Row>
            <Row icon={<VibrateIcon size={20} />} label="الاهتزاز">
              <Toggle on={s.hapticsEnabled} onChange={(v) => s.update('hapticsEnabled', v)} label="الاهتزاز" />
            </Row>
            <Row icon={<VibrateIcon size={20} />} label="مستوى الاهتزاز">
              <Choices<HapticLevel>
                value={s.hapticLevel}
                onChange={(v) => s.update('hapticLevel', v)}
                options={[{ v: 'light', label: 'خفيف' }, { v: 'medium', label: 'متوسط' }, { v: 'strong', label: 'قوي' }]}
              />
            </Row>
            <Row icon={<HeartIcon size={20} />} label="الوضع الحسي" hint="حزمة هدوء جاهزة">
              <Choices<SensoryMode>
                value={s.sensoryMode}
                onChange={(v) => s.applySensory(v)}
                options={[{ v: 'normal', label: 'عادي' }, { v: 'calm', label: 'هادئ' }, { v: 'sensitive', label: 'حسّاس' }]}
              />
            </Row>
            <Row icon={<SparkleIcon size={20} />} label="المكافآت" hint="نجوم وتصفيق">
              <Toggle on={s.rewardsEnabled} onChange={(v) => s.update('rewardsEnabled', v)} label="المكافآت" />
            </Row>
            <Row icon={<SparkleIcon size={20} />} label="تقليل الحركة">
              <Toggle on={s.reduceMotion} onChange={(v) => s.update('reduceMotion', v)} label="تقليل الحركة" />
            </Row>
            <Row icon={<TypeIcon size={20} />} label="حجم الخط">
              <Choices<FontScale>
                value={s.fontScale}
                onChange={(v) => s.update('fontScale', v)}
                options={[{ v: 'normal', label: 'عادي' }, { v: 'large', label: 'كبير' }, { v: 'xlarge', label: 'أكبر' }]}
              />
            </Row>
            <Row icon={<GridIcon size={20} />} label="عدد البطاقات">
              <Choices<CardsPerPage>
                value={s.cardsPerPage}
                onChange={(v) => s.update('cardsPerPage', v)}
                options={[{ v: 2, label: '2' }, { v: 4, label: '4' }, { v: 6, label: '6' }, { v: 8, label: '8' }]}
              />
            </Row>
            <Row icon={<VolumeIcon size={20} />} label="تعطيل الأصوات العالية">
              <Toggle on={s.disableLoudSounds} onChange={(v) => s.update('disableLoudSounds', v)} label="تعطيل الأصوات العالية" />
            </Row>
            <Row icon={<GlobeIcon size={20} />} label="اللغة">
              <span className="row__hint">العربية</span>
            </Row>
            <Row icon={<LockIcon size={20} />} label="رمز قفل المعلم" hint={s.pin ? 'مُفعّل' : 'غير مُفعّل'}>
              <button className="btn btn--soft" onClick={setPin}>{s.pin ? 'تغيير / إزالة' : 'تعيين'}</button>
            </Row>
          </div>

          <h3 className="settings-h">إعدادات الطفل</h3>
          <div className="card rows">
            {activeChild ? (
              <>
                <Row icon={<AssetIcon refKey="ui/speaker" size={20} />} label="اللهجة" hint={`الطفل الحالي: ${activeChild.name}`}>
                  <select
                    value={activeChild.dialectId ?? s.selectedDialect}
                    onChange={(e) => updateChild(activeChild.id, { dialectId: e.target.value as DialectId })}
                  >
                    {DIALECTS.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
                  </select>
                </Row>
                <Row icon={<AssetIcon refKey="avatars/child_boy_01" size={20} />} label="الجنس">
                  <Choices<Gender>
                    value={activeChild.gender ?? 'boy'}
                    onChange={(v) => updateChild(activeChild.id, { gender: v })}
                    options={[{ v: 'boy', label: 'ولد' }, { v: 'girl', label: 'بنت' }]}
                  />
                </Row>
              </>
            ) : (
              <div className="row"><span className="row__hint">اختر طفلاً أولاً لضبط اللهجة والجنس.</span></div>
            )}
            <Row icon={<AssetIcon refKey="ui/settings" size={20} />} label="اللهجة الافتراضية" hint="تُستخدم للأطفال الجدد">
              <select value={s.selectedDialect} onChange={(e) => s.update('selectedDialect', e.target.value as DialectId)}>
                {DIALECTS.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
              </select>
            </Row>
          </div>

          <h3 className="settings-h">العبارات اليومية</h3>
          <div className="card rows">
            <Row icon={<AssetIcon refKey="ui/report" size={20} />} label="مستوى الصعوبة">
              <Choices<Difficulty>
                value={s.dailyPhrasesDifficulty}
                onChange={(v) => s.update('dailyPhrasesDifficulty', v)}
                options={[{ v: 'very_easy', label: 'سهل جدًا' }, { v: 'easy', label: 'سهل' }, { v: 'medium', label: 'متوسط' }]}
              />
            </Row>
            <Row icon={<AssetIcon refKey="ui/settings" size={20} />} label="العبارات الدينية" hint="بسم الله، الحمد لله، السلام عليكم">
              <Toggle on={s.religiousPhrasesEnabled} onChange={(v) => s.update('religiousPhrasesEnabled', v)} label="العبارات الدينية" />
            </Row>
          </div>

          <h3 className="settings-h">الألعاب التعليمية</h3>
          <div className="card rows">
            <Row icon={<AssetIcon refKey="rewards/star_burst" size={20} />} label="تشغيل الألعاب">
              <Toggle on={s.gamesEnabled} onChange={(v) => s.update('gamesEnabled', v)} label="تشغيل الألعاب" />
            </Row>
            <Row icon={<AssetIcon refKey="animals/cat" size={20} />} label="أصوات الحيوانات">
              <Toggle on={s.animalSoundsEnabled} onChange={(v) => s.update('animalSoundsEnabled', v)} label="أصوات الحيوانات" />
            </Row>
            <Row icon={<AssetIcon refKey="ui/report" size={20} />} label="عدد الكروت الافتراضي">
              <Choices<GameCardCount>
                value={s.gameCardCount}
                onChange={(v) => s.update('gameCardCount', v)}
                options={[{ v: 4, label: '4' }, { v: 6, label: '6' }, { v: 8, label: '8' }, { v: 12, label: '12' }]}
              />
            </Row>
            <Row icon={<AssetIcon refKey="ui/retry" size={20} />} label="مدة ظهور الكروت">
              <Choices<PreviewSeconds>
                value={s.gamePreviewSeconds}
                onChange={(v) => s.update('gamePreviewSeconds', v)}
                options={[{ v: 2, label: '٢ث' }, { v: 4, label: '٤ث' }, { v: 6, label: '٦ث' }]}
              />
            </Row>
            <Row icon={<AssetIcon refKey="colors/red" size={20} />} label="طريقة عرض الألوان" hint="نفس صورة الدرس افتراضياً">
              <Choices<ColorDisplayMode>
                value={s.colorDisplayMode}
                onChange={(v) => s.update('colorDisplayMode', v)}
                options={[{ v: 'lesson', label: 'نفس الدرس' }, { v: 'square', label: 'مربع' }, { v: 'circle', label: 'دائرة' }]}
              />
            </Row>
          </div>

          <p className="disclaimer" style={{ marginTop: 14 }}>
            أداة مساعدة للتواصل والتدريب على النطق، ولا تغني عن المختصين.
          </p>
        </div>
      ) : (
        <div className="screen__scroll stack">
          <div className="card stack">
            <h3 style={{ fontSize: '1.05rem' }}>نسخة احتياطية</h3>
            <p className="muted-note" style={{ textAlign: 'start' }}>
              بياناتك محفوظة على هذا الجهاز فقط. يمكنك تصدير نسخة أو استعادتها.
            </p>
            <button className="btn btn--primary btn--block" onClick={downloadBackup}>
              <DownloadIcon size={20} /> تصدير نسخة
            </button>
            <button className="btn btn--soft btn--block" onClick={() => fileRef.current?.click()}>
              <UploadIcon size={20} /> استيراد نسخة
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              style={{ display: 'none' }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) void onImportFile(f); e.target.value = '' }}
            />
          </div>

          <div className="card stack">
            <h3 style={{ fontSize: '1.05rem' }}>إعادة التعيين</h3>
            <button
              className="btn btn--ghost btn--block"
              disabled={!activeId}
              onClick={() => { if (activeId && window.confirm('إعادة تعيين تقدّم الطفل الحالي؟')) { resetChild(activeId); flash('تمت إعادة تعيين التقدّم') } }}
            >
              <RefreshIcon size={20} /> إعادة تعيين تقدّم الطفل الحالي
            </button>
            <button className="btn btn--danger btn--block" onClick={clearAll}>
              <TrashIcon size={20} /> مسح كل البيانات
            </button>
          </div>

          <button className="btn btn--soft btn--block" onClick={() => nav.reset('children')}>
            العودة لاختيار الطفل
          </button>
        </div>
      )}
    </div>
  )
}
