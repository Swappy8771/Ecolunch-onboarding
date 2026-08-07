import { useState } from 'react'
import { Search, ChevronDown, ExternalLink, AlertTriangle } from 'lucide-react'
import type { GoLiveListItemViewModel, GoLiveReadiness } from '@/features/adminGolive/types/golive.types'
import { GoLiveStatusBadge } from './GoLiveStatusBadge'

function ProgressBar({ pct, status }: { pct: number; status: GoLiveReadiness }) {
  const color = status === 'ready' ? '#4ade80' : status === 'blocked' ? '#f87171' : '#fbbf24'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-inner)', minWidth: '60px' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-[11px] font-bold tabular-nums shrink-0" style={{ color }}>{pct}%</span>
    </div>
  )
}

interface CatererTableProps {
  caterers: GoLiveListItemViewModel[]
  catererMetaById: Map<string, { city: string; vertical: string }>
  selectedId: string | null
  onSelect: (id: string) => void
}

export function CatererTable({ caterers, catererMetaById, selectedId, onSelect }: CatererTableProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<GoLiveReadiness | ''>('')

  const filtered = caterers.filter(c => {
    const meta = catererMetaById.get(c.catererId)
    const matchSearch = c.catererName.toLowerCase().includes(search.toLowerCase()) ||
                        (meta?.city ?? '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || c.readiness === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="flex flex-col gap-3">
      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1" style={{ minWidth: '160px' }}>
          <Search size={12} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-4)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search caterers…"
            className="w-full pl-8 pr-3 py-2 rounded-xl text-[12.5px] outline-none"
            style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }}
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as GoLiveReadiness | '')}
            className="appearance-none pl-3 pr-7 py-2 rounded-xl text-[12px] font-medium outline-none cursor-pointer"
            style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-2)' }}
          >
            <option value="">All statuses</option>
            <option value="ready">Ready</option>
            <option value="not_ready">Not Ready</option>
            <option value="blocked">Blocked</option>
          </select>
          <ChevronDown size={11} strokeWidth={2} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-4)' }} />
        </div>

        <span className="text-[11.5px] ml-auto" style={{ color: 'var(--text-4)' }}>
          {filtered.length} caterer{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <Search size={28} strokeWidth={1.2} style={{ color: 'var(--text-4)' }} />
            <p className="text-[13.5px] font-semibold" style={{ color: 'var(--text-3)' }}>No caterers match your filters</p>
            <button onClick={() => { setSearch(''); setStatusFilter('') }}
              className="text-[12px] px-3 py-1.5 rounded-lg cursor-pointer"
              style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: '640px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
                  {['Caterer', 'Progress', 'Status', 'Blockers', 'Corrections', 'Validations', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3">
                      <span className="text-[10.5px] uppercase tracking-[0.12em] font-bold" style={{ color: 'var(--text-4)' }}>{h}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => {
                  const isSelected = c.catererId === selectedId
                  const meta = catererMetaById.get(c.catererId)
                  return (
                    <tr
                      key={c.catererId}
                      onClick={() => onSelect(c.catererId)}
                      className="cursor-pointer transition-all"
                      style={{
                        borderBottom: i < filtered.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                        background: isSelected ? 'var(--accent-dim)' : 'transparent',
                        outline: isSelected ? '1px solid var(--accent-border)' : 'none',
                        outlineOffset: '-1px',
                      }}
                      onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'var(--bg-inner)' }}
                      onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[13px] font-semibold" style={{ color: 'var(--text-1)' }}>{c.catererName}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px]" style={{ color: 'var(--text-4)' }}>{meta?.city || '—'}</span>
                            {meta?.vertical && (
                              <>
                                <span className="w-1 h-1 rounded-full" style={{ background: 'var(--text-4)' }} />
                                <span className="text-[10.5px] font-medium px-1.5 py-0.5 rounded"
                                  style={{ background: 'rgba(96,165,250,0.15)', color: '#60a5fa' }}>
                                  {meta.vertical}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5" style={{ minWidth: '120px' }}>
                        <ProgressBar pct={c.onboardingProgressPct} status={c.readiness} />
                        <p className="text-[10.5px] mt-1" style={{ color: 'var(--text-4)' }}>
                          {c.completedCount}/{c.totalRequirements} steps
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        <GoLiveStatusBadge status={c.readiness} />
                      </td>
                      <td className="px-4 py-3.5">
                        {c.blockerCount > 0 ? (
                          <span className="inline-flex items-center gap-1 text-[12px] font-bold" style={{ color: '#f87171' }}>
                            <AlertTriangle size={11} strokeWidth={2} />{c.blockerCount}
                          </span>
                        ) : (
                          <span className="text-[12px]" style={{ color: '#4ade80' }}>—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-[12.5px] font-semibold tabular-nums" style={{ color: c.openCorrectionsCount > 0 ? '#fbbf24' : 'var(--text-4)' }}>
                          {c.openCorrectionsCount}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-[12.5px] font-semibold tabular-nums" style={{ color: c.openValidationsCount > 0 ? '#a78bfa' : 'var(--text-4)' }}>
                          {c.openValidationsCount}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={e => { e.stopPropagation(); onSelect(c.catererId) }}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11.5px] font-semibold cursor-pointer transition-all"
                          style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}
                        >
                          <ExternalLink size={10} strokeWidth={2} />View
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
