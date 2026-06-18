/** "اليوم - 10:30 ص" or a short date for older sessions. */
export function formatSession(ts: number | null): string {
  if (!ts) return 'لا توجد جلسات بعد'
  const d = new Date(ts)
  const now = new Date()
  const sameDay = d.toDateString() === now.toDateString()
  const time = new Intl.DateTimeFormat('ar', { hour: 'numeric', minute: '2-digit' }).format(d)
  if (sameDay) return `اليوم - ${time}`
  const day = new Intl.DateTimeFormat('ar', { day: 'numeric', month: 'long' }).format(d)
  return `${day} - ${time}`
}
