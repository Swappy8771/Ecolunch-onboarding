import { ArrowLeft, X, MapPin, User, Clock } from 'lucide-react'
import { useEcoLoopDetail, useEcoLoopHistory } from '@/features/adminEcoloop/hooks/useEcoLoopQueries'
import type { LinkedModule } from '@/features/adminEcoloop/types/ecoloop.types'
import { TicketStatusBadge, PriorityBadge, LinkedModuleBadge } from './TicketStatusBadge'
import { TicketDetailPanel } from './TicketDetail/TicketDetailPanel'

const PRIORITY_ACCENT: Record<string, string> = {
  urgent: '#f87171',
  high:   '#fb923c',
  normal: '#fbbf24',
  low:    '#4ade80',
}

interface TicketDrawerProps {
  conversationId: string | null
  onClose: () => void
  isSendingMessage: boolean
  isSavingNote: boolean
  onSendMessage: (content: string) => void
  onAddNote: (content: string) => void
  onLinkNew: (module: LinkedModule) => void
  onReassign: () => void
  onChangePriority: () => void
  onCloseTicket: () => void
}

export function TicketDrawer({
  conversationId, onClose, isSendingMessage, isSavingNote,
  onSendMessage, onAddNote, onLinkNew, onReassign, onChangePriority, onCloseTicket,
}: TicketDrawerProps) {
  const isOpen = conversationId !== null
  const detailQuery = useEcoLoopDetail(conversationId ?? '', isOpen)
  const historyQuery = useEcoLoopHistory(conversationId ?? '', isOpen)

  const conversation = detailQuery.data?.conversation
  const accent = conversation ? (PRIORITY_ACCENT[conversation.priority] ?? '#60a5fa') : '#60a5fa'

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          zIndex: 9998,
          background: 'rgba(7,7,10,0.65)', backdropFilter: 'blur(6px)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 300ms ease',
        }}
      />

      <div
        className="flex flex-col"
        style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: isOpen ? 'translate(-50%, -50%)' : 'translate(-50%, -48%)',
          zIndex: 9999,
          width: 'min(820px, calc(100vw - 32px))',
          maxHeight: 'calc(100vh - 48px)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: '16px',
          boxShadow: '0 32px 96px rgba(0,0,0,0.5)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 280ms ease, transform 280ms cubic-bezier(0.32,0.72,0,1)',
          overflow: 'hidden',
        }}
      >
        {isOpen && conversation && (
          <>
            <div className="shrink-0 h-[3px]" style={{ background: accent }} />

            <div className="shrink-0 flex flex-col"
              style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-default)' }}>
              <div className="flex items-center gap-3 px-5 py-3">
                <button
                  onClick={onClose}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold cursor-pointer shrink-0 transition-opacity hover:opacity-70"
                  style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
                  <ArrowLeft size={12} strokeWidth={2.5} />Back
                </button>

                <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
                  <span className="text-[10.5px] font-mono font-bold px-2 py-0.5 rounded shrink-0"
                    style={{ background: 'var(--bg-surface)', color: 'var(--text-4)', border: '1px solid var(--border-strong)' }}>
                    {conversation.id.slice(0, 8)}
                  </span>
                  <TicketStatusBadge status={conversation.status} />
                  <PriorityBadge priority={conversation.priority} />
                  <LinkedModuleBadge module={conversation.linkedModule} />
                </div>

                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer shrink-0 transition-opacity hover:opacity-70"
                  style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
                  <X size={13} strokeWidth={2.5} />
                </button>
              </div>

              <div className="px-5 pb-4 flex flex-col gap-2.5">
                <h2 className="text-[17px] font-bold leading-snug" style={{ color: 'var(--text-1)' }}>
                  {conversation.subject}
                </h2>

                <div className="flex items-center gap-3 flex-wrap" style={{ color: 'var(--text-4)' }}>
                  <span className="flex items-center gap-1 text-[11.5px]">
                    <MapPin size={10} strokeWidth={2} />{conversation.catererName}
                  </span>
                  <span className="w-1 h-1 rounded-full" style={{ background: 'var(--border-strong)' }} />
                  <span className="flex items-center gap-1 text-[11.5px]">
                    <User size={10} strokeWidth={2} />{conversation.assigneeName ?? 'Unassigned'}
                  </span>
                  <span className="w-1 h-1 rounded-full" style={{ background: 'var(--border-strong)' }} />
                  <span className="flex items-center gap-1 text-[11.5px]">
                    <Clock size={10} strokeWidth={2} />
                    {conversation.lastMessageAt ? new Date(conversation.lastMessageAt).toLocaleString() : 'No activity'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="px-5 py-5">
                <TicketDetailPanel
                  conversation={conversation}
                  messages={detailQuery.data?.messages ?? []}
                  auditHistory={historyQuery.data?.auditHistory ?? []}
                  hideHeader
                  isSendingMessage={isSendingMessage}
                  isSavingNote={isSavingNote}
                  onSendMessage={onSendMessage}
                  onAddNote={onAddNote}
                  onLinkNew={onLinkNew}
                  onReassign={onReassign}
                  onChangePriority={onChangePriority}
                  onCloseTicket={onCloseTicket}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
