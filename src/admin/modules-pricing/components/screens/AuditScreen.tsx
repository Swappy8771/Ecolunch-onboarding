import { useState } from 'react'
import { User, Package, ArrowRight, Filter, List, GitBranch } from 'lucide-react'
import type { CatererSetup, AuditEntry } from '../../types/modules.types'

function formatTs(ts: string) {
  const [date, time] = ts.split(' ')
  return { date, time }
}

function DiffBadge({ prev, next }: { prev: string | null; next: string | null }) {
  if (!prev && !next) return null
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {prev !== null && (
        <span className="px-2 py-0.5 rounded text-[11px] font-mono"
          style={{ background: 'rgba(248,113,113,0.10)', color: '#f87171', border: '1px solid rgba(248,113,113,0.22)' }}>
          {prev}
        </span>
      )}
      {prev !== null && next !== null && (
        <ArrowRight size={10} strokeWidth={2.5} style={{ color: 'var(--text-4)' }} />
      )}
      {next !== null && (
        <span className="px-2 py-0.5 rounded text-[11px] font-mono"
          style={{ background: 'rgba(74,222,128,0.09)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.22)' }}>
          {next}
        </span>
      )}
    </div>
  )
}

function TimelineEntry({ entry, isLast }: { entry: AuditEntry; isLast: boolean }) {
  const { date, time } = formatTs(entry.ts)
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center shrink-0" style={{ width: '20px' }}>
        <div className="w-3 h-3 rounded-full shrink-0 mt-1.5" style={{ background: 'var(--accent)', border: '2px solid var(--bg-surface)' }} />
        {!isLast && <div className="w-0.5 flex-1 mt-1" style={{ background: 'var(--border-subtle)' }} />}
      </div>
      <div className="flex-1 pb-5 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
          <p className="text-[13px] font-semibold" style={{ color: 'var(--text-1)' }}>{entry.action}</p>
          <span className="text-[11px] tabular-nums shrink-0" style={{ color: 'var(--text-4)' }}>{date} {time}</span>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap mb-2">
          <div className="flex items-center gap-1" style={{ color: 'var(--text-4)' }}>
            <User size={10} strokeWidth={2} />
            <span className="text-[11.5px]">{entry.user}</span>
          </div>
          {entry.module && (
            <div className="flex items-center gap-1" style={{ color: 'var(--text-4)' }}>
              <Package size={10} strokeWidth={2} />
              <span className="text-[11.5px]">{entry.module}</span>
            </div>
          )}
          {entry.field && (
            <span className="text-[11px] px-1.5 py-0.5 rounded font-mono"
              style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
              .{entry.field}
            </span>
          )}
        </div>
        <DiffBadge prev={entry.prev} next={entry.next} />
      </div>
    </div>
  )
}

export function AuditScreen({ setup }: { setup: CatererSetup }) {
  const [mode, setMode] = useState<'table' | 'timeline'>('timeline')
  const [filterModule, setFilterModule] = useState('')
  const [filterUser, setFilterUser] = useState('')

  const modules = [...new Set(setup.audit.map(e => e.module).filter(Boolean))] as string[]
  const users   = [...new Set(setup.audit.map(e => e.user))]

  const filtered = setup.audit.filter(e => {
    if (filterModule && e.module !== filterModule) return false
    if (filterUser   && e.user   !== filterUser)   return false
    return true
  })

  return (
    <div className="flex flex-col gap-4">
      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap px-4 py-3.5 rounded-2xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <div className="flex items-center gap-1.5" style={{ color: 'var(--text-4)' }}>
          <Filter size={12} strokeWidth={2} />
          <span className="text-[11px] uppercase tracking-[0.12em] font-bold">Filters</span>
        </div>

        <select value={filterModule} onChange={e => setFilterModule(e.target.value)}
          className="px-3 py-1.5 rounded-lg text-[12px] outline-none cursor-pointer"
          style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-2)' }}>
          <option value="">All modules</option>
          {modules.map(m => <option key={m} value={m}>{m}</option>)}
          <option value="">— none —</option>
        </select>

        <select value={filterUser} onChange={e => setFilterUser(e.target.value)}
          className="px-3 py-1.5 rounded-lg text-[12px] outline-none cursor-pointer"
          style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-2)' }}>
          <option value="">All users</option>
          {users.map(u => <option key={u} value={u}>{u}</option>)}
        </select>

        {(filterModule || filterUser) && (
          <button onClick={() => { setFilterModule(''); setFilterUser('') }}
            className="text-[11.5px] px-2.5 py-1 rounded-lg cursor-pointer"
            style={{ background: 'rgba(248,113,113,0.09)', color: '#f87171', border: '1px solid rgba(248,113,113,0.22)' }}>
            Clear filters
          </button>
        )}

        <div className="ml-auto flex items-center gap-1 p-0.5 rounded-xl" style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)' }}>
          {[
            { id: 'timeline', icon: <GitBranch size={12} strokeWidth={2} />, label: 'Timeline' },
            { id: 'table',    icon: <List       size={12} strokeWidth={2} />, label: 'Table'    },
          ].map(({ id, icon, label }) => (
            <button key={id} onClick={() => setMode(id as 'table' | 'timeline')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11.5px] font-semibold cursor-pointer transition-all"
              style={{
                background: mode === id ? 'var(--bg-card)' : 'transparent',
                color: mode === id ? 'var(--text-1)' : 'var(--text-4)',
                border: mode === id ? '1px solid var(--border-default)' : '1px solid transparent',
              }}>
              {icon}{label}
            </button>
          ))}
        </div>

        <span className="text-[12px]" style={{ color: 'var(--text-4)' }}>{filtered.length} entries</span>
      </div>

      {mode === 'timeline' ? (
        <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
          {filtered.length === 0 ? (
            <p className="text-[13px] text-center py-8" style={{ color: 'var(--text-4)' }}>No audit entries match the current filters.</p>
          ) : (
            filtered.map((entry, i) => (
              <TimelineEntry key={entry.id} entry={entry} isLast={i === filtered.length - 1} />
            ))
          )}
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: '700px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
                  {['Timestamp', 'User', 'Action', 'Module', 'Field', 'Change'].map(h => (
                    <th key={h} className="text-left px-4 py-3">
                      <span className="text-[10.5px] uppercase tracking-[0.12em] font-bold" style={{ color: 'var(--text-4)' }}>{h}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8">
                    <span className="text-[13px]" style={{ color: 'var(--text-4)' }}>No entries match filters.</span>
                  </td></tr>
                ) : filtered.map((e, i) => {
                  const { date, time } = formatTs(e.ts)
                  return (
                    <tr key={e.id}
                      style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}
                      onMouseEnter={ev => { (ev.currentTarget as HTMLElement).style.background = 'var(--bg-inner)' }}
                      onMouseLeave={ev => { (ev.currentTarget as HTMLElement).style.background = 'transparent' }}>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[12px] tabular-nums font-medium" style={{ color: 'var(--text-2)' }}>{time}</span>
                          <span className="text-[11px] tabular-nums" style={{ color: 'var(--text-4)' }}>{date}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5" style={{ color: 'var(--text-3)' }}>
                          <User size={11} strokeWidth={2} />
                          <span className="text-[12.5px]">{e.user}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[12.5px] font-medium" style={{ color: 'var(--text-1)' }}>{e.action}</span>
                      </td>
                      <td className="px-4 py-3">
                        {e.module ? (
                          <div className="flex items-center gap-1" style={{ color: 'var(--text-3)' }}>
                            <Package size={10} strokeWidth={2} />
                            <span className="text-[12px]">{e.module}</span>
                          </div>
                        ) : <span style={{ color: 'var(--text-4)' }}>—</span>}
                      </td>
                      <td className="px-4 py-3">
                        {e.field
                          ? <span className="text-[11.5px] font-mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>.{e.field}</span>
                          : <span style={{ color: 'var(--text-4)' }}>—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <DiffBadge prev={e.prev} next={e.next} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
