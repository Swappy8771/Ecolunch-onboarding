import { Cpu, Link2, ArrowUpDown, XCircle, MessageSquare, Ticket } from 'lucide-react'
import type { AuditEntryViewModel } from '@/features/adminEcoloop/types/ecoloop.types'

const ACTION_META: Record<string, { label: string; icon: React.ReactNode }> = {
  'ecoloop.conversation_created':          { label: 'Ticket Created',        icon: <Ticket        size={11} strokeWidth={2} /> },
  'ecoloop.conversation_created_by_module':{ label: 'Ticket Created (auto)', icon: <Ticket        size={11} strokeWidth={2} /> },
  'ecoloop.message_added':                 { label: 'Message Sent',         icon: <MessageSquare size={11} strokeWidth={2} /> },
  'ecoloop.note_added':                     { label: 'Internal Note Added',  icon: <MessageSquare size={11} strokeWidth={2} /> },
  'ecoloop.link_added':                    { label: 'Item Linked',          icon: <Link2         size={11} strokeWidth={2} /> },
  'ecoloop.reassigned':                    { label: 'Reassigned',           icon: <ArrowUpDown   size={11} strokeWidth={2} /> },
  'ecoloop.priority_changed':               { label: 'Priority Changed',      icon: <ArrowUpDown   size={11} strokeWidth={2} /> },
  'ecoloop.status_changed':                { label: 'Status Changed',       icon: <ArrowUpDown   size={11} strokeWidth={2} /> },
  'ecoloop.conversation_closed':            { label: 'Ticket Closed',        icon: <XCircle       size={11} strokeWidth={2} /> },
  'ecoloop.conversation_reopened':          { label: 'Ticket Reopened',      icon: <ArrowUpDown   size={11} strokeWidth={2} /> },
  'ecoloop.conversation_resolved':          { label: 'Ticket Resolved',      icon: <XCircle       size={11} strokeWidth={2} /> },
}

export function SystemActionsSection({ events }: { events: AuditEntryViewModel[] }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1.5">
        <Cpu size={11} strokeWidth={2} style={{ color: 'var(--text-4)' }} />
        <p className="text-[11px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>System Actions</p>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        {events.length === 0 ? (
          <p className="text-[12.5px] text-center py-8" style={{ color: 'var(--text-4)' }}>No system events recorded.</p>
        ) : (
          <div className="px-4 py-3 flex flex-col gap-0">
            {events.map((e, i) => {
              const meta = ACTION_META[e.action] ?? { label: e.action, icon: <Cpu size={10} strokeWidth={2} /> }
              return (
                <div key={`${e.timestamp}-${i}`} className="flex gap-3 pb-3">
                  <div className="flex flex-col items-center shrink-0" style={{ width: '20px' }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-4)' }}>
                      {meta.icon}
                    </div>
                    {i < events.length - 1 && (
                      <div className="w-px flex-1 mt-1" style={{ background: 'var(--border-subtle)', minHeight: '12px' }} />
                    )}
                  </div>

                  <div className="flex flex-col gap-0.5 min-w-0 pt-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[12.5px] font-semibold" style={{ color: 'var(--text-2)' }}>{meta.label}</span>
                      <span className="text-[11px]" style={{ color: 'var(--text-4)' }}>{new Date(e.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-[11.5px]" style={{ color: 'var(--text-4)' }}>By {e.actorType === 'system' ? 'System' : e.actorId ?? 'Unknown'}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
