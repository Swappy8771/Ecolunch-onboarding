import { AlertTriangle, ExternalLink, Mail, Send, CheckCircle2, ShieldAlert, Clock } from 'lucide-react'
import type { GoLiveListItemViewModel } from '@/features/adminGolive/types/golive.types'

interface ActionBarProps {
  selected: GoLiveListItemViewModel | null
  isBusy: boolean
  onViewBlockers: () => void
  onOpenBlockingSection: () => void
  onSendReminder: () => void
  onSendEcoLoop: () => void
  onValidate: () => void
  onBlockOrUnblock: () => void
  onViewAudit: () => void
}

export function ActionBar({
  selected, isBusy, onViewBlockers, onOpenBlockingSection, onSendReminder, onSendEcoLoop, onValidate, onBlockOrUnblock, onViewAudit,
}: ActionBarProps) {
  const isReady = selected?.readiness === 'ready'
  const isBlocked = selected?.readiness === 'blocked'
  const hasBlockers = (selected?.blockerCount ?? 0) > 0

  return (
    <div
      className="sticky bottom-0 z-10 flex items-center gap-2 px-5 py-3 flex-wrap"
      style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-default)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {selected ? (
        <div className="flex items-center gap-2 mr-2 shrink-0">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
          <span className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>{selected.catererName}</span>
        </div>
      ) : (
        <span className="text-[12px] mr-2 shrink-0" style={{ color: 'var(--text-4)' }}>Select a caterer to act</span>
      )}

      <div className="w-px h-5 shrink-0" style={{ background: 'var(--border-strong)' }} />

      <button
        disabled={!selected}
        onClick={onViewBlockers}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}>
        <AlertTriangle size={13} strokeWidth={2} />
        View Blockers
        {hasBlockers && (
          <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-black"
            style={{ background: 'rgba(248,113,113,0.20)', color: '#f87171' }}>
            {selected?.blockerCount}
          </span>
        )}
      </button>

      <button
        disabled={!selected || !hasBlockers}
        onClick={onOpenBlockingSection}
        title={!hasBlockers ? 'No blockers to open' : undefined}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}>
        <ExternalLink size={13} strokeWidth={2} />
        Open Blocking Section
      </button>

      <button
        disabled={!selected}
        onClick={onSendReminder}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}>
        <Mail size={13} strokeWidth={2} />
        Send Client Reminder
      </button>

      <button
        disabled={!selected}
        onClick={onSendEcoLoop}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}>
        <Send size={13} strokeWidth={2} />
        Send via EcoLoop
      </button>

      <div className="flex-1 hidden sm:block" />

      <div className="flex items-center gap-2 flex-wrap">
        <button
          disabled={!selected || isBlocked || isReady || isBusy}
          onClick={onValidate}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: 'var(--accent)', color: '#07070a' }}>
          <CheckCircle2 size={13} strokeWidth={2.5} />
          Validate Go-live
        </button>

        <button
          disabled={!selected || isBusy}
          onClick={onBlockOrUnblock}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={isBlocked
            ? { background: 'rgba(74,222,128,0.10)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.28)' }
            : { background: 'rgba(248,113,113,0.10)', color: '#f87171', border: '1px solid rgba(248,113,113,0.28)' }}>
          <ShieldAlert size={13} strokeWidth={2} />
          {isBlocked ? 'Unblock Go-live' : 'Block Go-live'}
        </button>

        <button
          disabled={!selected}
          onClick={onViewAudit}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: 'var(--bg-card)', color: 'var(--text-3)', border: '1px solid var(--border-default)' }}>
          <Clock size={13} strokeWidth={2} />
          View Audit
        </button>
      </div>
    </div>
  )
}
