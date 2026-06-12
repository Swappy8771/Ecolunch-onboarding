import { useState } from 'react'
import { Lock, Plus } from 'lucide-react'
import type { InternalNote } from '../../types/ecoloop.types'

export function InternalNotesSection({ notes }: { notes: InternalNote[] }) {
  const [draft, setDraft] = useState('')
  const [adding, setAdding] = useState(false)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Lock size={11} strokeWidth={2} style={{ color: '#a78bfa' }} />
          <p className="text-[11px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>Internal Notes</p>
          <span className="text-[10px] px-1.5 py-0.5 rounded font-bold"
            style={{ background: 'rgba(167,139,250,0.12)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.25)' }}>
            Admin Only
          </span>
        </div>
        <button onClick={() => setAdding(!adding)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11.5px] font-semibold cursor-pointer"
          style={{ background: 'rgba(167,139,250,0.10)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.25)' }}>
          <Plus size={11} strokeWidth={2.5} />Add Note
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        {notes.length === 0 && !adding ? (
          <p className="text-[12.5px] text-center py-8" style={{ color: 'var(--text-4)' }}>No internal notes added yet.</p>
        ) : (
          <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {notes.map(n => (
              <div key={n.id} className="px-4 py-3.5 flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{ background: 'rgba(167,139,250,0.15)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.28)' }}>
                      {n.author.charAt(0)}
                    </div>
                    <span className="text-[12px] font-semibold" style={{ color: '#a78bfa' }}>{n.author}</span>
                  </div>
                  <span className="text-[11px]" style={{ color: 'var(--text-4)' }}>{n.ts}</span>
                </div>
                <p className="text-[12.5px] leading-relaxed ml-8" style={{ color: 'var(--text-3)' }}>{n.content}</p>
              </div>
            ))}
          </div>
        )}

        {adding && (
          <div className="px-4 py-3" style={{ borderTop: notes.length > 0 ? '1px solid var(--border-default)' : 'none', background: 'var(--bg-inner)' }}>
            <textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              placeholder="Add an internal note (visible to admins only)…"
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl text-[12.5px] leading-relaxed resize-none outline-none mb-2"
              style={{ background: 'var(--bg-card)', border: '1px solid rgba(167,139,250,0.30)', color: 'var(--text-1)' }}
              autoFocus
            />
            <div className="flex items-center gap-2 justify-end">
              <button onClick={() => { setDraft(''); setAdding(false) }}
                className="px-3 py-1.5 rounded-lg text-[12px] font-semibold cursor-pointer"
                style={{ background: 'var(--bg-card)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
                Cancel
              </button>
              <button disabled={!draft.trim()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold cursor-pointer disabled:opacity-40"
                style={{ background: 'rgba(167,139,250,0.15)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.30)' }}>
                <Lock size={11} strokeWidth={2} />Save Note
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
