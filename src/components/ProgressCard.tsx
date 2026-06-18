import { ProgressRing } from './ProgressRing'

interface Props {
  percent: number
  mastered: number
  inTraining: number
  lastSession: string
  accent: string
}

export function ProgressCard({ percent, mastered, inTraining, lastSession, accent }: Props) {
  return (
    <div className="card progress-card">
      <div className="progress-card__title" style={{ color: accent }}>تقدّمك في هذا المستوى</div>
      <div className="ring-wrap"><ProgressRing percent={percent} size={116} /></div>
      <div className="progress-card__row">
        <div className="mini-stat mini-stat--g">
          <strong>{mastered}</strong>
          <span>جمل متقنة</span>
        </div>
        <div className="mini-stat mini-stat--o">
          <strong>{inTraining}</strong>
          <span>تحتاج تدريب</span>
        </div>
      </div>
      <div className="panel" style={{ marginTop: 10 }}>
        <div className="panel__title">📅 آخر جلسة</div>
        <div className="panel__body">{lastSession}</div>
      </div>
    </div>
  )
}
