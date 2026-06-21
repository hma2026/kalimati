import { EducationalScreenShell } from '@/components/EducationalScreenShell'

/** شاشة القصص — مبدئية (قريباً)، بالستايل الموحّد. */
export function StoriesScreen() {
  return (
    <EducationalScreenShell title="قصص" subtitle="قصص تفاعلية قصيرة — قريباً">
      <div className="stories-soon">
        <p>سنضيف هنا قصصاً مصوّرة قصيرة للأطفال قريباً.</p>
      </div>
    </EducationalScreenShell>
  )
}
