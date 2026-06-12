import { FolderLock, MapPin, Clock } from 'lucide-react'
import type { CatererVault } from '../services/mock/documentVaultMock'

interface CatererVaultGridProps {
  caterers: CatererVault[]
  searchQuery: string
  onOpen: (c: CatererVault) => void
}

export function CatererVaultGrid({ caterers, searchQuery, onOpen }: CatererVaultGridProps) {
  const filtered = caterers.filter(c =>
    !searchQuery ||
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <FolderLock size={32} strokeWidth={1.2} style={{ color: 'var(--text-4)' }} />
        <span className="text-[13px]" style={{ color: 'var(--text-4)' }}>No caterers match your search.</span>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filtered.map(c => (
        <div
          key={c.id}
          className="rounded-2xl p-5 flex flex-col gap-3.5 transition-all"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', cursor: 'default' }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'rgba(163,230,53,0.45)'
            el.style.boxShadow = '0 0 0 1px rgba(163,230,53,0.15)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'var(--border-default)'
            el.style.boxShadow = 'none'
          }}
        >
          <div>
            <p className="text-[15px] font-bold" style={{ color: 'var(--text-1)' }}>{c.name}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin size={11} strokeWidth={1.8} style={{ color: 'var(--text-4)' }} />
              <span className="text-[12px]" style={{ color: 'var(--text-4)' }}>{c.location}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
              {c.totalDocs} docs
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
              style={{
                background: c.pending > 0 ? 'rgba(251,191,36,0.12)' : 'var(--bg-inner)',
                color: c.pending > 0 ? '#fbbf24' : 'var(--text-4)',
                border: `1px solid ${c.pending > 0 ? 'rgba(251,191,36,0.30)' : 'var(--border-strong)'}`,
              }}>
              {c.pending} pending
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
              style={{
                background: c.corrections > 0 ? 'rgba(248,113,113,0.12)' : 'var(--bg-inner)',
                color: c.corrections > 0 ? '#f87171' : 'var(--text-4)',
                border: `1px solid ${c.corrections > 0 ? 'rgba(248,113,113,0.30)' : 'var(--border-strong)'}`,
              }}>
              {c.corrections} correction{c.corrections !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock size={11} strokeWidth={1.8} style={{ color: 'var(--text-4)' }} />
            <span className="text-[12px]" style={{ color: 'var(--text-4)' }}>Last activity {c.lastActivity}</span>
          </div>

          <button
            onClick={() => onOpen(c)}
            className="w-full py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer"
            style={{ background: 'rgba(163,230,53,0.12)', color: '#a3e635', border: '1px solid rgba(163,230,53,0.30)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(163,230,53,0.22)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(163,230,53,0.12)' }}
          >
            Open Vault →
          </button>
        </div>
      ))}
    </div>
  )
}
