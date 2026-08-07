import { X, MapPin, Hash } from 'lucide-react'
import { useGoLiveOverview } from '@/features/adminGolive/hooks/useGoLiveOverview'
import { useGoLiveSummary } from '@/features/adminGolive/hooks/useGoLiveSummary'
import { useGoLiveHistory } from '@/features/adminGolive/hooks/useGoLiveHistory'
import type { GoLiveBlockerViewModel } from '@/features/adminGolive/types/golive.types'
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
  catererId: string
  catererName: string
  catererCity: string
  onClose: () => void
  onOpenSection: (blocker: GoLiveBlockerViewModel) => void
}

export function DetailPanel({ catererId, catererName, catererCity, onClose, onOpenSection }: DetailPanelProps) {
  const overviewQuery = useGoLiveOverview(catererId, true)
  const summaryQuery = useGoLiveSummary(catererId, true)
  const historyQuery = useGoLiveHistory(catererId, true)

  const overview = overviewQuery.data
  const summary = summaryQuery.data
  const readiness = overview?.readiness ?? 'not_ready'
  const barColor = readiness === 'ready' ? '#4ade80' : readiness === 'blocked' ? '#f87171' : '#fbbf24'
  const openCorrectionsCount = summary?.blockers.filter(b => b.owningModule === 'corrections').length ?? 0
  const openValidationsCount = summary?.blockers.filter(b => b.owningModule === 'validation').length ?? 0

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-5 py-4 shrink-0"
        style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-[15px] font-black" style={{ color: 'var(--text-1)' }}>{catererName}</h3>
            <GoLiveStatusBadge status={readiness} />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1" style={{ color: 'var(--text-4)' }}>
              <MapPin size={11} strokeWidth={2} />
              <span className="text-[11.5px]">{catererCity || '—'}</span>
            </div>
            <div className="flex items-center gap-1" style={{ color: 'var(--text-4)' }}>
              <Hash size={11} strokeWidth={2} />
              <span className="text-[11.5px] font-mono">{catererId.slice(0, 8)}</span>
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
        {overviewQuery.isLoading ? (
          <p className="text-[13px] text-center py-8" style={{ color: 'var(--text-4)' }}>Loading readiness…</p>
        ) : overviewQuery.isError || !overview ? (
          <p className="text-[13px] text-center py-8" style={{ color: '#f87171' }}>{overviewQuery.error?.message ?? 'Failed to load.'}</p>
        ) : (
          <>
            {/* Overall progress */}
            <div className="rounded-xl px-4 py-4"
              style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)' }}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] uppercase tracking-[0.12em] font-bold" style={{ color: 'var(--text-4)' }}>Overall Progress</p>
                <span className="text-[16px] font-black" style={{ color: barColor }}>{overview.onboardingProgressPct}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden mb-3" style={{ background: 'var(--bg-card)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${overview.onboardingProgressPct}%`, background: barColor }} />
              </div>
              <div className="flex flex-col gap-0">
                <StatRow label="Completed Steps" value={overview.completedCount} color="#4ade80" />
                <StatRow label="Blocking Steps" value={overview.blockedCount + overview.incompleteCount} color={(overview.blockedCount + overview.incompleteCount) > 0 ? '#f87171' : 'var(--text-4)'} />
                <StatRow label="Open Corrections" value={openCorrectionsCount} color={openCorrectionsCount > 0 ? '#fbbf24' : 'var(--text-4)'} />
                <StatRow label="Open Validations" value={openValidationsCount} color={openValidationsCount > 0 ? '#a78bfa' : 'var(--text-4)'} />
              </div>
            </div>

            {/* Checklist */}
            <ChecklistPanel items={overview.requirements} />

            {/* Blockers */}
            {summaryQuery.isLoading ? (
              <p className="text-[12.5px]" style={{ color: 'var(--text-4)' }}>Loading blockers…</p>
            ) : (
              <BlockersPanel blockers={summary?.blockers ?? []} onOpenSection={onOpenSection} />
            )}

            {/* Audit trail */}
            <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
              <div className="px-4 py-3" style={{ background: 'var(--bg-inner)', borderBottom: '1px solid var(--border-default)' }}>
                <p className="text-[11px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>Recent Activity</p>
              </div>
              <div className="px-4 py-2">
                {historyQuery.isLoading ? (
                  <p className="text-[12px] py-3" style={{ color: 'var(--text-4)' }}>Loading…</p>
                ) : (historyQuery.data ?? []).length === 0 ? (
                  <p className="text-[12px] py-3" style={{ color: 'var(--text-4)' }}>No go-live activity recorded yet.</p>
                ) : (
                  (historyQuery.data ?? []).slice(0, 5).map((e, i, arr) => (
                    <div key={i} className="flex items-start gap-2.5 py-2.5"
                      style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                      <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: 'var(--accent)' }} />
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-medium" style={{ color: 'var(--text-2)' }}>{e.action}</p>
                        <p className="text-[11px]" style={{ color: 'var(--text-4)' }}>{e.actorId ?? 'System'} · {e.timestamp.slice(0, 16).replace('T', ' ')}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
