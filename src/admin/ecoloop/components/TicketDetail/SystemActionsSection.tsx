import { Cpu, Link2, FileText, FileSignature, ShieldAlert, ArrowUpDown, XCircle, Ticket } from 'lucide-react'
import type { SystemEvent } from '../../types/ecoloop.types'

const EVENT_ICONS: Record<string, React.ReactNode> = {
  'Ticket Created':          <Ticket       size={11} strokeWidth={2} />,
  'Validation Linked':       <Link2        size={11} strokeWidth={2} />,
  'Document Linked':         <FileText     size={11} strokeWidth={2} />,
  'Contract Linked':         <FileSignature size={11} strokeWidth={2} />,
  'Smart Import Item Linked': <Link2       size={11} strokeWidth={2} />,
  'Go-live Blocker Linked':  <ShieldAlert  size={11} strokeWidth={2} />,
  'Priority Changed':        <ArrowUpDown  size={11} strokeWidth={2} />,
  'Status Changed':          <ArrowUpDown  size={11} strokeWidth={2} />,
  'Ticket Closed':           <XCircle      size={11} strokeWidth={2} />,
  'Message Sent':            <Cpu          size={11} strokeWidth={2} />,
  'Client Reply':            <Cpu          size={11} strokeWidth={2} />,
  'Reminder Sent':           <Cpu          size={11} strokeWidth={2} />,
}

export function SystemActionsSection({ events }: { events: SystemEvent[] }) {
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
            {events.map((e, i) => (
              <div key={e.id} className="flex gap-3 pb-3">
                {/* Timeline spine */}
                <div className="flex flex-col items-center shrink-0" style={{ width: '20px' }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-4)' }}>
                    {EVENT_ICONS[e.event] ?? <Cpu size={10} strokeWidth={2} />}
                  </div>
                  {i < events.length - 1 && (
                    <div className="w-px flex-1 mt-1" style={{ background: 'var(--border-subtle)', minHeight: '12px' }} />
                  )}
                </div>

                <div className="flex flex-col gap-0.5 min-w-0 pt-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[12.5px] font-semibold" style={{ color: 'var(--text-2)' }}>{e.event}</span>
                    <span className="text-[11px]" style={{ color: 'var(--text-4)' }}>{e.ts}</span>
                  </div>
                  {e.detail && (
                    <p className="text-[11.5px]" style={{ color: 'var(--text-4)' }}>{e.detail}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
