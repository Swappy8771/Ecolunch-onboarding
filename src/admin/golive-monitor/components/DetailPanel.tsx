import { X, MapPin, Hash, Clock } from 'lucide-react'
import type { CatererReadiness } from '../types/golive.types'
import { GoLiveStatusBadge } from './GoLiveStatusBadge'
import { ChecklistPanel } from './ChecklistPanel'
import { BlockersPanel } from './BlockersPanel'

function StatRow({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <span className="text-[12.5px]" style={{ color: 'var(--text-3)' }}>{label}</span>
      <span className="text-[14px] font-black tabular-nums" style={{ color: color ?? 'var(--text-1)' }}>{value}</span>
    </div>
  )
}

interface DetailPanelProps {
  caterer: CatererReadiness
  onClose: () => void
  onOpenSection: (section: string) => void
}

export function DetailPanel({ caterer, onClose, onOpenSection }: DetailPanelProps) {
  const c = caterer
  const barColor = c.status === 'ready' ? '#4ade80' : c.status === 'blocked' ? '#f87171' : '#fbbf24'

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-5 py-4 shrink-0"
        style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-[15px] font-black" style={{ color: 'var(--text-1)' }}>{c.name}</h3>
            <GoLiveStatusBadge status={c.status} />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1" style={{ color: 'var(--text-4)' }}>
              <MapPin size={11} strokeWidth={2} />
              <span className="text-[11.5px]">{c.city}</span>
            </div>
            <div className="flex items-center gap-1" style={{ color: 'var(--text-4)' }}>
              <Hash size={11} strokeWidth={2} />
              <span className="text-[11.5px] font-mono">{c.id}</span>
            </div>
          </div>
        </div>
        <button onClick={onClose}
          className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer shrink-0 transition-all"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-strong)', color: 'var(--text-4)' }}>
          <X size={13} strokeWidth={2.5} />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 px-5 py-4">
        {/* Overall progress */}
        <div className="rounded-xl px-4 py-4"
          style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] uppercase tracking-[0.12em] font-bold" style={{ color: 'var(--text-4)' }}>Overall Progress</p>
            <span className="text-[16px] font-black" style={{ color: barColor }}>{c.progressPct}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden mb-3" style={{ background: 'var(--bg-card)' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${c.progressPct}%`, background: barColor }} />
          </div>
          <div className="flex flex-col gap-0">
            <StatRow label="Completed Steps"  value={c.completedSteps}  color="#4ade80" />
            <StatRow label="Blocking Steps"   value={c.blockingSteps}   color={c.blockingSteps > 0 ? '#f87171' : 'var(--text-4)'} />
            <StatRow label="Open Corrections" value={c.openCorrections} color={c.openCorrections > 0 ? '#fbbf24' : 'var(--text-4)'} />
            <div className="flex items-center justify-between py-2.5">
              <span className="text-[12.5px]" style={{ color: 'var(--text-3)' }}>Open Validations</span>
              <span className="text-[14px] font-black tabular-nums" style={{ color: c.openValidations > 0 ? '#a78bfa' : 'var(--text-4)' }}>{c.openValidations}</span>
            </div>
          </div>
        </div>

        {/* Last updated */}
        <div className="flex items-center gap-2" style={{ color: 'var(--text-4)' }}>
          <Clock size={11} strokeWidth={2} />
          <span className="text-[11.5px]">Last updated: {c.lastUpdated}</span>
        </div>

        {/* Checklist */}
        <ChecklistPanel items={c.checklist} />

        {/* Blockers */}
        <BlockersPanel blockers={c.blockers} onOpenSection={onOpenSection} />

        {/* Audit trail (last 3) */}
        {c.audit.length > 0 && (
          <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
            <div className="px-4 py-3" style={{ background: 'var(--bg-inner)', borderBottom: '1px solid var(--border-default)' }}>
              <p className="text-[11px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>Recent Activity</p>
            </div>
            <div className="px-4 py-2">
              {c.audit.slice(0, 3).map((e, i) => (
                <div key={e.id} className="flex items-start gap-2.5 py-2.5"
                  style={{ borderBottom: i < 2 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: 'var(--accent)' }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-medium" style={{ color: 'var(--text-2)' }}>{e.action}</p>
                    <p className="text-[11px]" style={{ color: 'var(--text-4)' }}>{e.user} · {e.ts}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
