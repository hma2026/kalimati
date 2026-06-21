import { useSpeech } from '@/hooks/useSpeech'
import { useHaptics } from '@/hooks/useHaptics'
import { useSettings } from '@/store/useSettingsStore'
import { EducationalScreenShell } from '@/components/EducationalScreenShell'
import { EducationalCard } from '@/components/EducationalCard'
import type { DialectId } from '@/types'

interface Item { key: string; label: string; visual?: string }

/** شبكة بطاقات تعليمية موحّدة + نطق عند الضغط. */
function CardGrid({ items, accent }: { items: Item[]; accent: string }) {
  const { speak } = useSpeech()
  const haptic = useHaptics()
  const say = (label: string) => { haptic('tap'); speak(label) }
  return (
    <div className="educard-grid">
      {items.map((it) => (
        <EducationalCard
          key={it.key}
          label={it.label}
          visualKey={it.visual}
          accent={accent}
          onClick={() => say(it.label)}
          onSpeak={() => say(it.label)}
        />
      ))}
    </div>
  )
}

// ============ العبارات اليومية ============
const DAILY: Item[] = [
  { key: 'hi', label: 'مرحبا' },
  { key: 'bye', label: 'مع السلامة' },
  { key: 'thanks', label: 'شكرا' },
  { key: 'please', label: 'من فضلك' },
  { key: 'yes', label: 'نعم', visual: 'daily/yes' },
  { key: 'no', label: 'لا', visual: 'daily/no' },
  { key: 'sorry', label: 'آسف' },
  { key: 'love', label: 'أحبك' },
]
export function DailyPhrasesScreen() {
  return (
    <EducationalScreenShell title="العبارات اليومية" subtitle="عبارات نستخدمها كل يوم" accent="#D99A1E">
      <CardGrid items={DAILY} accent="#D99A1E" />
    </EducationalScreenShell>
  )
}

// ============ أجزاء الجسم ============
const BODY: Item[] = [
  { key: 'head', label: 'رأس' },
  { key: 'hand', label: 'يد' },
  { key: 'eye', label: 'عين' },
  { key: 'ear', label: 'أذن' },
  { key: 'mouth', label: 'فم' },
  { key: 'nose', label: 'أنف' },
  { key: 'stomach', label: 'بطن' },
  { key: 'leg', label: 'رجل' },
]
export function BodyPartsScreen() {
  return (
    <EducationalScreenShell title="أجزاء الجسم" subtitle="تعرّف على أجزاء جسمك" accent="#E84C68">
      <CardGrid items={BODY} accent="#E84C68" />
    </EducationalScreenShell>
  )
}

// ============ النظافة والروتين اليومي ============
const HYGIENE: Item[] = [
  { key: 'wash_hands', label: 'غسل اليدين' },
  { key: 'brush', label: 'تنظيف الأسنان' },
  { key: 'bath', label: 'الاستحمام' },
  { key: 'toilet', label: 'الحمام', visual: 'actions/bathroom' },
  { key: 'sleep', label: 'النوم', visual: 'actions/sleep' },
  { key: 'eat', label: 'الأكل', visual: 'actions/eat' },
]
export function HygieneRoutineScreen() {
  return (
    <EducationalScreenShell title="النظافة والروتين" subtitle="عادات يومية صحية" accent="#0891B2">
      <CardGrid items={HYGIENE} accent="#0891B2" />
    </EducationalScreenShell>
  )
}

// ============ العائلة والصور المخصصة ============
const FAMILY: Item[] = [
  { key: 'mother', label: 'أمي', visual: 'people/mother' },
  { key: 'father', label: 'أبي', visual: 'people/father' },
  { key: 'brother', label: 'أخي' },
  { key: 'sister', label: 'أختي' },
  { key: 'grandpa', label: 'جدي' },
  { key: 'grandma', label: 'جدتي' },
]
export function FamilyPhotosScreen() {
  return (
    <EducationalScreenShell title="العائلة" subtitle="تعرّف على أفراد عائلتك" accent="#7B3FF2">
      <CardGrid items={FAMILY} accent="#7B3FF2" />
    </EducationalScreenShell>
  )
}

// ============ اختيار طريقة النطق / اللهجة ============
const DIALECTS: { id: DialectId; label: string }[] = [
  { id: 'hijazi', label: 'حجازي' },
  { id: 'najdi', label: 'نجدي' },
  { id: 'sharqi', label: 'شرقاوي' },
  { id: 'fusha', label: 'فصحى' },
  { id: 'masri', label: 'مصري' },
  { id: 'shami', label: 'شامي' },
  { id: 'iraqi', label: 'عراقي' },
]
export function DialectSelectScreen() {
  const { speak } = useSpeech()
  const haptic = useHaptics()
  const selected = useSettings((s) => s.selectedDialect)
  const update = useSettings((s) => s.update)
  const pick = (id: DialectId, label: string) => {
    haptic('tap')
    update('selectedDialect', id)
    speak(label)
  }
  return (
    <EducationalScreenShell title="طريقة النطق" subtitle="اختر اللهجة المناسبة" accent="#2F9B5F">
      <div className="educard-grid">
        {DIALECTS.map((d) => (
          <EducationalCard
            key={d.id}
            label={d.label}
            glyph={d.label.charAt(0)}
            accent="#2F9B5F"
            selected={selected === d.id}
            onClick={() => pick(d.id, d.label)}
            onSpeak={() => { haptic('tap'); speak(d.label) }}
          />
        ))}
      </div>
    </EducationalScreenShell>
  )
}
