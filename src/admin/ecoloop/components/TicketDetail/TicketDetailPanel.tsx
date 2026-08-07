import { X, MapPin, Hash, User, Calendar } from 'lucide-react'
import type { ConversationViewModel, MessageViewModel, AuditEntryViewModel, LinkedModule } from '@/features/adminEcoloop/types/ecoloop.types'
import { TicketStatusBadge, PriorityBadge, LinkedModuleBadge } from '../TicketStatusBadge'
import { ConversationSection }  from './ConversationSection'
import { InternalNotesSection } from './InternalNotesSection'
import { SystemActionsSection } from './SystemActionsSection'
import { LinkedObjectsSection } from './LinkedObjectsSection'

interface TicketDetailPanelProps {
  conversation: ConversationViewModel
  messages: MessageViewModel[]
  auditHistory: AuditEntryViewModel[]
  onClose?: () => void
  hideHeader?: boolean
  isSendingMessage: boolean
  isSavingNote: boolean
  onSendMessage: (content: string) => void
  onAddNote: (content: string) => void
  onLinkNew: (module: LinkedModule) => void
  onReassign: () => void
  onChangePriority: () => void
  onCloseTicket: () => void
}

export function TicketDetailPanel({
  conversation: t, messages, auditHistory, onClose, hideHeader,
  isSendingMessage, isSavingNote, onSendMessage, onAddNote, onLinkNew,
  onReassign, onChangePriority, onCloseTicket,
}: TicketDetailPanelProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* ── Header card (hidden when rendered inside TicketDrawer, which renders its own) ── */}
      {!hideHeader && <div className="rounded-2xl overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <div className="flex items-start justify-between gap-3 px-5 py-4"
          style={{ background: 'var(--bg-inner)', borderBottom: '1px solid var(--border-default)' }}>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded"
                style={{ background: 'var(--bg-card)', color: 'var(--text-4)', border: '1px solid var(--border-strong)' }}>
                {t.id.slice(0, 8)}
              </span>
              <TicketStatusBadge status={t.status} />
              <PriorityBadge priority={t.priority} />
              <LinkedModuleBadge module={t.linkedModule} />
            </div>
            <h2 className="text-[15px] font-bold leading-snug" style={{ color: 'var(--text-1)' }}>{t.subject}</h2>
          </div>
          {onClose && (
            <button onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer shrink-0"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-strong)', color: 'var(--text-4)' }}>
              <X size={13} strokeWidth={2.5} />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          {[
            { icon: <MapPin size={11} strokeWidth={2} />,   label: 'Caterer',       value: t.catererName },
            { icon: <Hash   size={11} strokeWidth={2} />,   label: 'Linked Module', value: t.linkedModule ?? 'None' },
            { icon: <User   size={11} strokeWidth={2} />,   label: 'Assigned To',   value: t.assigneeName ?? 'Unassigned' },
            { icon: <Calendar size={11} strokeWidth={2} />, label: 'Last Activity', value: t.lastMessageAt ? new Date(t.lastMessageAt).toLocaleString() : 'No activity' },
          ].map(({ icon, label, value }, idx) => (
            <div key={label} className="px-4 py-3 flex flex-col gap-0.5"
              style={{ borderBottom: '1px solid var(--border-subtle)', borderRight: idx < 3 ? '1px solid var(--border-subtle)' : 'none' }}>
              <div className="flex items-center gap-1" style={{ color: 'var(--text-4)' }}>
                {icon}
                <span className="text-[10.5px] uppercase tracking-[0.10em] font-bold">{label}</span>
              </div>
              <span className="text-[12.5px] font-semibold truncate" style={{ color: 'var(--text-2)' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>}

      {/* ── Ticket-level actions — always shown, whether or not the drawer renders its own header ── */}
      <div className="flex items-center gap-2 px-1 flex-wrap">
        <span className="text-[10.5px] uppercase tracking-[0.11em] font-bold mr-1" style={{ color: 'var(--text-4)' }}>Actions</span>
        <button onClick={onReassign} className="flex items-center px-3 py-1.5 rounded-lg text-[11.5px] font-semibold cursor-pointer" style={{ background: 'var(--bg-card)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>Reassign</button>
        <button onClick={onChangePriority} className="flex items-center px-3 py-1.5 rounded-lg text-[11.5px] font-semibold cursor-pointer" style={{ background: 'var(--bg-card)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>Change Priority</button>
        {t.status !== 'closed' && (
          <button onClick={onCloseTicket} className="flex items-center px-3 py-1.5 rounded-lg text-[11.5px] font-semibold cursor-pointer" style={{ background: 'rgba(248,113,113,0.10)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}>Close Ticket</button>
        )}
      </div>

      {/* ── Sections ── */}
      <ConversationSection messages={messages} isSending={isSendingMessage} onSend={onSendMessage} />
      <InternalNotesSection messages={messages} isSubmitting={isSavingNote} onAdd={onAddNote} />
      <SystemActionsSection events={auditHistory} />
      <LinkedObjectsSection items={t.linkedItems} catererId={t.catererId} onLinkNew={onLinkNew} />
    </div>
  )
}
