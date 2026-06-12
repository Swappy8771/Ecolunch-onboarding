import { MapPin } from 'lucide-react'
import type { CatererVault } from '../services/mock/documentVaultMock'

interface CatererSidePanelProps {
  caterers: CatererVault[]
  selected: CatererVault
  onSelect: (c: CatererVault) => void
}

export function CatererSidePanel({ caterers, selected, onSelect }: CatererSidePanelProps) {
  return (
    <div
      className="w-[280px] shrink-0 flex flex-col overflow-hidden rounded-2xl"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}
    >
      <div className="px-4 py-3.5 shrink-0" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <p className="text-[10px] uppercase tracking-[0.14em] font-bold" style={{ color: 'var(--text-4)' }}>
          Caterers
        </p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {caterers.map(c => {
          const isSelected = c.id === selected.id
          return (
            <button
              key={c.id}
              onClick={() => onSelect(c)}
              className="w-full text-left px-3 py-2.5 cursor-pointer transition-colors"
              style={{
                borderLeft: isSelected ? '2px solid #a3e635' : '2px solid transparent',
                background: isSelected ? 'rgba(163,230,53,0.06)' : 'transparent',
                borderBottom: '1px solid var(--border-subtle)',
              }}
              onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'var(--bg-inner)' }}
              onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              <div className="flex items-center justify-between gap-2 min-w-0">
                <span className="text-[13px] font-semibold truncate"
                  style={{ color: isSelected ? '#a3e635' : 'var(--text-1)' }}>
                  {c.name}
                </span>
                {(c.pending > 0 || c.corrections > 0) && (
                  <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                    style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>
                    {c.pending + c.corrections}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin size={9} strokeWidth={1.8} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
                <span className="text-[11px] truncate" style={{ color: 'var(--text-4)' }}>{c.location}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
