import { useChildren, progressStats, statsForPrefix } from '@/store/useChildrenStore'
import { useSettings } from '@/store/useSettingsStore'
import { AppHeader } from '@/components/AppHeader'
import { ProgressRing } from '@/components/ProgressRing'
import { formatSession } from '@/lib/format'
import { LEVELS } from '@/data/levelMeta'
import { DAILY, buildDailyPhrase, profileOf, getAnimalLabel } from '@/data/dialects'
import { ANIMALS } from '@/data/animals'
import { mediaVisual } from '@/components/Media'
import { useGames, gamesSummary } from '@/store/useGamesStore'

const DIFF_LABEL: Record<string, string> = { very_easy: 'سهل جدًا', easy: 'سهل', medium: 'متوسط' }

export function ReportScreen() {
  const child = useChildren((s) => s.children.find((c) => c.id === s.activeId) ?? null)
  const prog = useChildren((s) => (s.activeId ? s.progress[s.activeId] : undefined))
  const setNote = useChildren((s) => s.setNote)
  const fallback = useSettings((s) => s.selectedDialect)
  const difficulty = useSettings((s) => s.dailyPhrasesDifficulty)
  const stats = progressStats(prog)
  const profile = profileOf(child, fallback)
  const activeId = useChildren((s) => s.activeId)
  const gameProgress = useGames((g) => g.progress)
  const gSummary = gamesSummary(gameProgress, activeId)

  // Animals
  const animalStats = statsForPrefix(prog, 'anim_')
  const animalMost = [...animalStats.entries].sort((a, b) => b[1].attempts - a[1].attempts)[0]
  const animalLast = [...animalStats.entries].sort((a, b) => b[1].lastTriedAt - a[1].lastTriedAt)[0]
  const animalSoundPlays = prog?.counters?.animalSoundPlays ?? 0
  const animalName = (id?: string) => {
    if (!id) return '—'
    const key = id.replace('anim_', '')
    return ANIMALS.some((a) => a.key === key) ? getAnimalLabel(key, profile) : '—'
  }
  const GAME_LABEL: Record<string, string> = { color: 'مطابقة الألوان', animal: 'مطابقة الحيوانات', word: 'صورة وكلمة', sound: 'صوت وصورة' }

  // Level 6 extras
  const l6 = statsForPrefix(prog, 'l6_')
  const mostUsed = [...l6.entries].sort((a, b) => b[1].attempts - a[1].attempts)[0]
  const lastTried = [...l6.entries].sort((a, b) => b[1].lastTriedAt - a[1].lastTriedAt)[0]
  const labelFor = (id?: string) => {
    if (!id) return '—'
    const key = id.replace('l6_', '')
    const d = DAILY.find((x) => x.key === key)
    return d ? buildDailyPhrase(d, profile) : '—'
  }

  return (
    <div className="screen">
      <AppHeader title="تقرير التقدّم" />

      <div className="screen__scroll stack">
        <div className="card">
          <p className="muted-note" style={{ marginBottom: 4 }}>{child ? `الطفل: ${child.name}` : ''}</p>
          <div className="ring-wrap"><ProgressRing percent={stats.percent} /></div>
          <div className="stats" style={{ marginTop: 10 }}>
            <div className="stat"><div className="stat__num stat__num--g">{stats.mastered}</div><div className="stat__lbl">كلمات متقنة</div></div>
            <div className="stat"><div className="stat__num stat__num--b">{stats.inTraining}</div><div className="stat__lbl">قيد التدريب</div></div>
            <div className="stat"><div className="stat__num stat__num--p">{stats.attemptsToday}</div><div className="stat__lbl">محاولات اليوم</div></div>
          </div>
        </div>

        <div className="panel"><div className="panel__title">آخر جلسة</div><div className="panel__body">{formatSession(prog?.lastSessionAt ?? null)}</div></div>
        <div className="panel"><div className="panel__title">مجموع النجوم</div><div className="panel__body">{stats.stars} نجمة</div></div>

        <div>
          <h3 className="settings-h" style={{ marginInline: 0 }}>تقدّم المستويات</h3>
          <div className="stack">
            {LEVELS.map((lv) => {
              const ls = statsForPrefix(prog, `${lv.id.replace('level', 'l')}_`)
              return (
                <div className="card level-row" key={lv.id}>
                  <div className="level-row__head">
                    <span className="level-row__name" style={{ color: lv.accent }}>{lv.title}</span>
                    <span className="level-row__pct" style={{ color: lv.accent }}>{ls.percent}%</span>
                  </div>
                  <div className="level-row__bar"><span style={{ width: `${ls.percent}%`, background: lv.accent }} /></div>
                  <div className="level-row__nums">
                    <span>محاولات: <b>{ls.attempts}</b></span>
                    <span>نجاحات: <b>{ls.successes}</b></span>
                    <span>متقنة: <b>{ls.mastered}</b></span>
                    <span>تحتاج تدريب: <b>{ls.inTraining}</b></span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="card">
          <h3 className="settings-h" style={{ marginInline: 0, marginTop: 0 }}>العبارات اليومية (المستوى السادس)</h3>
          <div className="panel"><div className="panel__title">عبارات متقنة</div><div className="panel__body">{l6.mastered}</div></div>
          <div className="panel"><div className="panel__title">أكثر عبارة استخداماً</div><div className="panel__body">{labelFor(mostUsed?.[0])}</div></div>
          <div className="panel"><div className="panel__title">آخر عبارة تدرّب عليها</div><div className="panel__body">{labelFor(lastTried?.[0])}</div></div>
          <div className="panel"><div className="panel__title">مستوى الصعوبة الحالي</div><div className="panel__body">{DIFF_LABEL[difficulty]}</div></div>
        </div>

        <div className="card">
          <h3 className="settings-h" style={{ marginInline: 0, marginTop: 0 }}>الحيوانات والأصوات</h3>
          <div className="stats">
            <div className="stat"><div className="stat__num stat__num--g">{animalStats.mastered}</div><div className="stat__lbl">متقنة</div></div>
            <div className="stat"><div className="stat__num stat__num--b">{animalStats.inTraining}</div><div className="stat__lbl">تحتاج تدريب</div></div>
            <div className="stat"><div className="stat__num stat__num--p">{animalSoundPlays}</div><div className="stat__lbl">تشغيل الأصوات</div></div>
          </div>
          <div className="panel" style={{ marginTop: 10 }}><div className="panel__title">أكثر حيوان تدرّب عليه</div><div className="panel__body" style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>{animalMost?.[0] && <span style={{ display: 'inline-flex' }} aria-hidden>{mediaVisual(animalMost[0], 28)}</span>}{animalName(animalMost?.[0])}</div></div>
          <div className="panel"><div className="panel__title">آخر حيوان تدرّب عليه</div><div className="panel__body">{animalName(animalLast?.[0])}</div></div>
        </div>

        <div className="card">
          <h3 className="settings-h" style={{ marginInline: 0, marginTop: 0 }}>الألعاب التعليمية</h3>
          <div className="stats">
            <div className="stat"><div className="stat__num stat__num--p">{gSummary.totalPlayed}</div><div className="stat__lbl">ألعاب لُعبت</div></div>
            <div className="stat"><div className="stat__num stat__num--g">{gSummary.totalCompleted}</div><div className="stat__lbl">مكتملة</div></div>
            <div className="stat"><div className="stat__num stat__num--b">{gSummary.bestScore}</div><div className="stat__lbl">أفضل نتيجة</div></div>
          </div>
          <div className="panel" style={{ marginTop: 10 }}><div className="panel__title">أكثر لعبة مفضّلة</div><div className="panel__body">{gSummary.favType ? GAME_LABEL[gSummary.favType] : '—'}</div></div>
          <div className="panel"><div className="panel__title">آخر جلسة لعب</div><div className="panel__body">{formatSession(gSummary.lastPlayedAt)}</div></div>
        </div>

        <div>
          <label className="panel__title" htmlFor="note" style={{ display: 'block', marginBottom: 6 }}>ملاحظات المعلم</label>
          <textarea id="note" className="note-input" placeholder="اكتب ملاحظة عن أداء الطفل…"
            value={prog?.teacherNote ?? ''} onChange={(e) => setNote(e.target.value)} />
        </div>
      </div>
    </div>
  )
}
