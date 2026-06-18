import { useMemo, useState } from 'react'
import { useNav } from '@/store/useNavStore'
import { useChildren, progressStats } from '@/store/useChildrenStore'
import { useSettings } from '@/store/useSettingsStore'
import { useSpeech } from '@/hooks/useSpeech'
import { useHaptics } from '@/hooks/useHaptics'
import { AppHeader } from '@/components/AppHeader'
import { WordCard } from '@/components/WordCard'
import { SoundButton } from '@/components/SoundButton'
import { RecordPanel } from '@/components/RecordPanel'
import { getDeck } from '@/data/words'
import type { DeckId } from '@/types'
import { ChevLeft, ChevRight, MicIcon } from '@/lib/icons'

export function CardGridScreen() {
  const nav = useNav()
  const deck = (nav.params.deck as DeckId) ?? 'words'
  const title = (nav.params.title as string) ?? 'كلمات'

  const cards = useMemo(() => getDeck(deck), [deck])
  const perPage = useSettings((s) => s.cardsPerPage)
  const { speak, speaking } = useSpeech()
  const haptic = useHaptics()

  const prog = useChildren((s) => (s.activeId ? s.progress[s.activeId] : undefined))
  const stats = progressStats(prog)

  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [practice, setPractice] = useState(false)

  const pageCount = Math.max(1, Math.ceil(cards.length / perPage))
  const safePage = Math.min(page, pageCount - 1)
  const slice = cards.slice(safePage * perPage, safePage * perPage + perPage)

  const tap = (id: string, say: string) => {
    setSelected(id)
    haptic('tap')
    speak(say)
  }

  const selectedCard = cards.find((c) => c.id === selected) ?? slice[0]

  return (
    <div className="screen">
      <AppHeader title={title} stars={stats.stars} />

      <div className="deck-head">
        <span className="deck-count">صفحة {safePage + 1} من {pageCount}</span>
        {selectedCard && (
          <button
            className={`btn btn--soft`}
            onClick={() => setPractice((v) => !v)}
            style={practice ? { background: 'var(--primary)', color: '#fff' } : undefined}
          >
            <MicIcon size={18} /> أنا أقول
          </button>
        )}
      </div>

      <div className="screen__scroll stack">
        <div className="card-grid" data-cols={perPage}>
          {slice.map((c) => (
            <WordCard
              key={c.id}
              card={c}
              selected={selected === c.id}
              mastered={prog?.items[c.id]?.mastered}
              onClick={() => tap(c.id, c.say ?? c.label)}
            />
          ))}
        </div>

        {practice && selectedCard && <RecordPanel itemId={selectedCard.id} />}
      </div>

      <div className="controls">
        <button
          className="iconbtn pager"
          aria-label="السابق"
          disabled={safePage === 0}
          onClick={() => setPage(safePage - 1)}
        >
          <ChevRight />
        </button>

        <SoundButton playing={speaking} onClick={() => selectedCard && speak(selectedCard.say ?? selectedCard.label)} />

        <button
          className="iconbtn pager"
          aria-label="التالي"
          disabled={safePage >= pageCount - 1}
          onClick={() => setPage(safePage + 1)}
        >
          <ChevLeft />
        </button>
      </div>
    </div>
  )
}
