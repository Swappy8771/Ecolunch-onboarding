import { useState } from 'react'
import { CalendarDays, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react'
import type { CatererSetup } from '../../types/modules.types'

const STATUS_COLORS = {
  ok:       { bg: 'rgba(74,222,128,0.10)',  border: 'rgba(74,222,128,0.28)',  text: '#4ade80'  },
  warning:  { bg: 'rgba(251,191,36,0.10)', border: 'rgba(251,191,36,0.26)', text: '#fbbf24'  },
  error:    { bg: 'rgba(248,113,113,0.09)', border: 'rgba(248,113,113,0.25)', text: '#f87171' },
  inactive: { bg: 'var(--bg-inner)',        border: 'var(--border-strong)',   text: 'var(--text-4)' },
}

type DateStatus = 'ok' | 'warning' | 'error' | 'inactive'

function getDateStatus(mod: CatererSetup['modules'][0], contractStart: string | null): DateStatus {
  if (mod.status === 'inactive') return 'inactive'
  if (!mod.effectiveDate) return 'error'
  if (contractStart && mod.effectiveDate < contractStart) return 'warning'
  return 'ok'
}

export function EffectiveDatesScreen({ setup }: { setup: CatererSetup }) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [dates, setDates] = useState(
    Object.fromEntries(setup.modules.map(m => [m.id, { effectiveDate: m.effectiveDate, endDate: m.endDate }]))
  )

  const contractStart = setup.terms.startDate
  const active = setup.modules.filter(m => m.status !== 'inactive')
  const missingDates = active.filter(m => !dates[m.id]?.effectiveDate)
  const conflicts = active.filter(m => {
    const d = dates[m.id]?.effectiveDate
    return d && contractStart && d < contractStart
  })

  return (
    <div className="flex flex-col gap-5">
      {/* Status summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Active Modules',   value: active.length,          color: '#60a5fa' },
          { label: 'Dates Set',        value: active.length - missingDates.length, color: '#4ade80' },
          { label: 'Missing Dates',    value: missingDates.length,    color: missingDates.length > 0 ? '#f87171' : '#4ade80' },
          { label: 'Date Conflicts',   value: conflicts.length,       color: conflicts.length > 0 ? '#fbbf24' : '#4ade80' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl px-4 py-3 text-center"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
            <p className="text-[10px] uppercase tracking-[0.12em] font-bold mb-0.5" style={{ color: 'var(--text-4)' }}>{label}</p>
            <p className="text-[22px] font-black" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {conflicts.length > 0 && (
        <div className="flex items-start gap-3 rounded-2xl px-5 py-3.5"
          style={{ background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.22)' }}>
          <AlertTriangle size={14} strokeWidth={2} className="shrink-0 mt-0.5" style={{ color: '#fbbf24' }} />
          <div>
            <p className="text-[12.5px] font-bold" style={{ color: '#fbbf24' }}>
              {conflicts.length} module date{conflicts.length > 1 ? 's' : ''} precede contract start ({contractStart})
            </p>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-4)' }}>
              {conflicts.map(m => m.shortName).join(', ')} — effective date is before the contract start date. Consider aligning them.
            </p>
          </div>
        </div>
      )}

      {missingDates.length > 0 && (
        <div className="flex items-start gap-3 rounded-2xl px-5 py-3.5"
          style={{ background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.22)' }}>
          <AlertTriangle size={14} strokeWidth={2} className="shrink-0 mt-0.5" style={{ color: '#f87171' }} />
          <div>
            <p className="text-[12.5px] font-bold" style={{ color: '#f87171' }}>Missing effective dates</p>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-4)' }}>
              {missingDates.map(m => m.name).join(', ')} — effective date is required for all active modules.
            </p>
          </div>
        </div>
      )}

      {/* Dates table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <div className="px-5 py-3.5 flex items-center justify-between"
          style={{ background: 'var(--bg-inner)', borderBottom: '1px solid var(--border-default)' }}>
          <div className="flex items-center gap-2">
            <CalendarDays size={13} strokeWidth={1.8} style={{ color: 'var(--accent)' }} />
            <p className="text-[11px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>
              Module Dates Timeline
            </p>
          </div>
          {contractStart && (
            <span className="text-[11px] px-2.5 py-1 rounded-full font-medium"
              style={{ background: 'var(--bg-card)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
              Contract start: {contractStart}
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: '680px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
                {['Module', 'Status', 'Effective Date', 'End Date', 'Auto-Renew', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3">
                    <span className="text-[10.5px] uppercase tracking-[0.12em] font-bold" style={{ color: 'var(--text-4)' }}>{h}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {setup.modules.map((mod, idx) => {
                const d = dates[mod.id]
                const ds: DateStatus = getDateStatus({ ...mod, effectiveDate: d.effectiveDate, endDate: d.endDate }, contractStart)
                const clr = STATUS_COLORS[ds]
                const isEditing = editingId === mod.id

                return (
                  <tr key={mod.id}
                    style={{ borderBottom: idx < setup.modules.length - 1 ? '1px solid var(--border-subtle)' : 'none', opacity: mod.status === 'inactive' ? 0.5 : 1 }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-inner)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[13px] font-semibold" style={{ color: 'var(--text-1)' }}>{mod.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-medium w-fit"
                          style={{ background: 'var(--bg-inner)', color: 'var(--text-4)', border: '1px solid var(--border-strong)' }}>
                          {mod.shortName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                        style={{ background: clr.bg, color: clr.text, border: `1px solid ${clr.border}` }}>
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: clr.text }} />
                        {mod.status.charAt(0).toUpperCase() + mod.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {isEditing ? (
                        <input type="date"
                          value={d.effectiveDate ?? ''}
                          onChange={e => setDates(prev => ({ ...prev, [mod.id]: { ...prev[mod.id], effectiveDate: e.target.value || null } }))}
                          onBlur={() => setEditingId(null)}
                          className="px-2.5 py-1.5 rounded-lg text-[12.5px] outline-none"
                          style={{ background: 'var(--bg-inner)', border: '1px solid var(--accent)', color: 'var(--text-1)' }}
                          autoFocus />
                      ) : (
                        <button onClick={() => setEditingId(mod.id)}
                          className="flex items-center gap-1.5 cursor-pointer group"
                          style={{ color: d.effectiveDate ? 'var(--text-2)' : '#f87171' }}>
                          <span className="text-[13px] font-medium tabular-nums">
                            {d.effectiveDate ?? 'Set date'}
                          </span>
                          <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent)' }}>edit</span>
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <input type="date"
                        value={d.endDate ?? ''}
                        onChange={e => setDates(prev => ({ ...prev, [mod.id]: { ...prev[mod.id], endDate: e.target.value || null } }))}
                        className="px-2.5 py-1.5 rounded-lg text-[12.5px] outline-none"
                        style={{ background: 'transparent', border: '1px solid transparent', color: d.endDate ? 'var(--text-2)' : 'var(--text-4)', cursor: 'pointer' }}
                        onFocus={e => { e.currentTarget.style.background = 'var(--bg-inner)'; e.currentTarget.style.borderColor = 'var(--border-strong)' }}
                        onBlur={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent' }} />
                    </td>
                    <td className="px-4 py-3.5">
                      {mod.status !== 'inactive' ? (
                        <div className="flex items-center gap-1.5" style={{ color: '#4ade80' }}>
                          <RefreshCw size={11} strokeWidth={2} />
                          <span className="text-[11.5px] font-medium">Annual</span>
                        </div>
                      ) : (
                        <span className="text-[11.5px]" style={{ color: 'var(--text-4)' }}>—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {ds === 'ok' && <CheckCircle2 size={13} strokeWidth={2} style={{ color: '#4ade80' }} />}
                      {(ds === 'warning' || ds === 'error') && <AlertTriangle size={13} strokeWidth={2} style={{ color: ds === 'error' ? '#f87171' : '#fbbf24' }} />}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
