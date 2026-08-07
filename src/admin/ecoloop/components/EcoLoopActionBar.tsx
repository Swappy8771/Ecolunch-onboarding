import {
  Send, Lock, Link2, FileText, FileSignature, Cpu, ShieldAlert,
  UserPlus, ArrowUpDown, XCircle, Plus, ClipboardList
} from 'lucide-react'
import type { ConversationViewModel, LinkedModule } from '@/features/adminEcoloop/types/ecoloop.types'

interface EcoLoopActionBarProps {
  selected: ConversationViewModel | null
  onCreateTicket: () => void
  onSendMessage: () => void
  onAddNote: () => void
  onLinkNew: (module: LinkedModule) => void
  onReassign: () => void
  onChangePriority: () => void
  onCloseTicket: () => void
}

export function EcoLoopActionBar({
  selected, onCreateTicket, onSendMessage, onAddNote, onLinkNew, onReassign, onChangePriority, onCloseTicket,
}: EcoLoopActionBarProps) {
  const dis = !selected
  const closed = selected?.status === 'closed'

  const actions: { id: string; label: string; icon: React.ReactNode; style: 'default' | 'accent' | 'danger' | 'purple'; onClick: () => void; disabled?: boolean }[] = [
    { id: 'send-message',      label: 'Send Message',          icon: <Send          size={12} strokeWidth={2} />, style: 'accent',  onClick: onSendMessage },
    { id: 'add-note',          label: 'Add Internal Note',     icon: <Lock          size={12} strokeWidth={2} />, style: 'purple',  onClick: onAddNote },
    { id: 'link-validation',   label: 'Link Validation Item',  icon: <Link2         size={12} strokeWidth={2} />, style: 'default', onClick: () => onLinkNew('validation') },
    { id: 'link-document',     label: 'Link Document',         icon: <FileText      size={12} strokeWidth={2} />, style: 'default', onClick: () => onLinkNew('documents') },
    { id: 'link-contract',     label: 'Link Contract',         icon: <FileSignature size={12} strokeWidth={2} />, style: 'default', onClick: () => onLinkNew('contracts') },
    { id: 'link-smart-import', label: 'Link Smart Import',     icon: <Cpu           size={12} strokeWidth={2} />, style: 'default', onClick: () => onLinkNew('smart-import') },
    { id: 'link-golive',       label: 'Link Go-live Blocker',  icon: <ShieldAlert   size={12} strokeWidth={2} />, style: 'default', onClick: () => onLinkNew('go-live') },
    { id: 'link-correction',   label: 'Link Correction',       icon: <ClipboardList size={12} strokeWidth={2} />, style: 'default', onClick: () => onLinkNew('corrections') },
    { id: 'reassign',          label: 'Reassign',              icon: <UserPlus      size={12} strokeWidth={2} />, style: 'default', onClick: onReassign },
    { id: 'change-priority',   label: 'Change Priority',       icon: <ArrowUpDown   size={12} strokeWidth={2} />, style: 'default', onClick: onChangePriority },
    { id: 'close-ticket',      label: 'Close Ticket',          icon: <XCircle       size={12} strokeWidth={2} />, style: 'danger',  onClick: onCloseTicket, disabled: closed },
  ]

  const bg = {
    default: 'var(--bg-card)',
    accent:  'var(--accent)',
    danger:  'rgba(248,113,113,0.10)',
    purple:  'rgba(167,139,250,0.10)',
  }
  const fg = {
    default: 'var(--text-2)',
    accent:  '#07070a',
    danger:  '#f87171',
    purple:  '#a78bfa',
  }
  const bd = {
    default: 'var(--border-default)',
    accent:  'transparent',
    danger:  'rgba(248,113,113,0.25)',
    purple:  'rgba(167,139,250,0.25)',
  }

  return (
    <div className="sticky bottom-0 z-10 flex items-center gap-2 px-5 py-3 overflow-x-auto"
      style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-default)', backdropFilter: 'blur(12px)' }}>
      {/* Create ticket — always available */}
      <button onClick={onCreateTicket}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold cursor-pointer shrink-0"
        style={{ background: 'var(--accent)', color: '#07070a' }}>
        <Plus size={13} strokeWidth={2.5} />Create Ticket
      </button>

      <div className="w-px h-5 shrink-0" style={{ background: 'var(--border-strong)' }} />

      {/* Context label */}
      {selected ? (
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
          <span className="text-[11.5px] font-semibold shrink-0" style={{ color: 'var(--text-3)' }}>{selected.id.slice(0, 8)}</span>
        </div>
      ) : (
        <span className="text-[11.5px] shrink-0" style={{ color: 'var(--text-4)' }}>Select a ticket</span>
      )}

      {/* Ticket-scoped actions — single scrollable row */}
      <div className="flex items-center gap-1.5">
        {actions.map(a => (
          <button key={a.id}
            disabled={dis || a.disabled}
            onClick={a.onClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11.5px] font-semibold cursor-pointer transition-all disabled:opacity-35 disabled:cursor-not-allowed shrink-0"
            style={{ background: bg[a.style], color: fg[a.style], border: `1px solid ${bd[a.style]}` }}>
            {a.icon}{a.label}
          </button>
        ))}
      </div>
    </div>
  )
}
