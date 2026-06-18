import { useState } from 'react'
import { useNav } from '@/store/useNavStore'
import { useChildren } from '@/store/useChildrenStore'
import { AddChildModal } from '@/components/AddChildModal'
import { TeacherGate } from '@/components/TeacherGate'
import { InstallPrompt } from '@/components/InstallPrompt'
import { PlusIcon, SettingsIcon } from '@/lib/icons'

const isUrl = (s: string) => /^(https?:|data:|\/|blob:)/.test(s)

export function ChildSelectScreen() {
  const nav = useNav()
  const children = useChildren((s) => s.children)
  const setActive = useChildren((s) => s.setActive)
  const [adding, setAdding] = useState(false)
  const [gate, setGate] = useState(false)

  const choose = (id: string) => {
    setActive(id)
    nav.go('home')
  }

  return (
    <div className="screen">
      <header className="appbar">
        <span style={{ width: 60 }} />
        <h1 className="appbar__title">اختر الطفل</h1>
        <button className="iconbtn" aria-label="الإعدادات" onClick={() => setGate(true)}>
          <SettingsIcon />
        </button>
      </header>

      <InstallPrompt />

      <div className="children screen__scroll" style={{ alignContent: 'start', paddingTop: 6 }}>
        {children.map((c) => (
          <button key={c.id} className="child" onClick={() => choose(c.id)}>
            <span className="child__avatar">
              {isUrl(c.avatar) ? <img src={c.avatar} alt="" /> : <span aria-hidden>{c.avatar}</span>}
            </span>
            <span className="child__name">{c.name}</span>
          </button>
        ))}

        <button className="child" onClick={() => setAdding(true)}>
          <span className="child__avatar child__avatar--add"><PlusIcon size={36} /></span>
          <span className="child__name">إضافة طفل</span>
        </button>
      </div>

      {adding && <AddChildModal onClose={() => setAdding(false)} onAdded={choose} />}
      {gate && (
        <TeacherGate
          onCancel={() => setGate(false)}
          onUnlock={() => { setGate(false); nav.go('settings') }}
        />
      )}
    </div>
  )
}
