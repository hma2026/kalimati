interface Tab { id: string; label: string; icon?: string }

interface Props {
  tabs: Tab[]
  active: string
  accent: string
  onChange: (id: string) => void
}

/** Tabbed selector matching the level mockups (active tab fills with the accent). */
export function CategoryTabs({ tabs, active, accent, onChange }: Props) {
  return (
    <div className="ctabs" role="tablist">
      {tabs.map((t) => {
        const on = t.id === active
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={on}
            className={`ctab${on ? ' ctab--on' : ''}`}
            style={on ? { background: accent, color: '#fff', borderColor: accent } : undefined}
            onClick={() => onChange(t.id)}
          >
            {t.icon && <span aria-hidden>{t.icon}</span>} {t.label}
          </button>
        )
      })}
    </div>
  )
}
