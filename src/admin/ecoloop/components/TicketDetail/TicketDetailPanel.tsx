import { X, MapPin, Hash, User, Calendar } from 'lucide-react'
import type { Ticket } from '../../types/ecoloop.types'
import { TicketStatusBadge, PriorityBadge, CategoryBadge, PRIORITY_META } from '../TicketStatusBadge'
import { ConversationSection }        from './ConversationSection'
import { InternalNotesSection }       from './InternalNotesSection'
import { SystemActionsSection }       from './SystemActionsSection'
import { LinkedObjectsSection }       from './LinkedObjectsSection'
import { CorrectionRequestsSection }  from './CorrectionRequestsSection'
import { ValidationFollowupSection }  from './ValidationFollowupSection'

interface TicketDetailPanelProps {
  ticket: Ticket
  onClose?: () => void
  hideHeader?: boolean
}

export function TicketDetailPanel({ ticket: t, onClose, hideHeader }: TicketDetailPanelProps) {
  const pm = PRIORITY_META[t.priority]

  return (
    <div className="flex flex-col gap-5">
      {/* ── Header card (hidden when rendered inside TicketDrawer) ── */}
      {!hideHeader && <div className="rounded-2xl overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        {/* Top bar */}
        <div className="flex items-start justify-between gap-3 px-5 py-4"
          style={{ background: 'var(--bg-inner)', borderBottom: '1px solid var(--border-default)' }}>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded"
                style={{ background: 'var(--bg-card)', color: 'var(--text-4)', border: '1px solid var(--border-strong)' }}>
                {t.number}
              </span>
              <TicketStatusBadge status={t.status} />
              <PriorityBadge priority={t.priority} />
              <CategoryBadge category={t.category} />
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

        {/* Meta grid */}
        <div className="grid grid-cols-2 md:grid-cols-4"
          style={{ borderTop: '1px solid var(--border-subtle)' }}>
          {[
            { icon: <MapPin size={11} strokeWidth={2} />,    label: 'Caterer',      value: t.caterer      },
            { icon: <Hash   size={11} strokeWidth={2} />,    label: 'Category',     value: t.category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) },
            { icon: <User   size={11} strokeWidth={2} />,    label: 'Assigned To',  value: t.assignedTo   },
            { icon: <Calendar size={11} strokeWidth={2} />,  label: 'Last Activity',value: t.lastActivity },
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

        {/* Ticket Actions */}
        <div className="flex items-center gap-2 px-4 py-3 flex-wrap"
          style={{ borderTop: '1px solid var(--border-default)', background: 'var(--bg-inner)' }}>
          <span className="text-[10.5px] uppercase tracking-[0.11em] font-bold mr-1" style={{ color: 'var(--text-4)' }}>Actions</span>
          {[
            { label: 'Send Message',    color: 'var(--accent)',                     textColor: '#07070a'          },
            { label: 'Add Note',        color: 'rgba(167,139,250,0.12)',            textColor: '#a78bfa'          },
            { label: 'Reassign',        color: 'var(--bg-card)',                    textColor: 'var(--text-3)'    },
            { label: 'Change Priority', color: pm.bg,                               textColor: pm.color           },
            { label: 'Close Ticket',    color: 'rgba(248,113,113,0.10)',            textColor: '#f87171'          },
          ].map(({ label, color, textColor }) => (
            <button key={label}
              className="flex items-center px-3 py-1.5 rounded-lg text-[11.5px] font-semibold cursor-pointer transition-all"
              style={{ background: color, color: textColor, border: label === 'Close Ticket' ? '1px solid rgba(248,113,113,0.25)' : label === 'Add Note' ? '1px solid rgba(167,139,250,0.25)' : '1px solid var(--border-strong)' }}>
              {label}
            </button>
          ))}
        </div>
      </div>}

      {/* ── Sections ── */}
      <ConversationSection messages={t.conversation} />
      <InternalNotesSection notes={t.internalNotes} />
      <SystemActionsSection events={t.systemEvents} />
      <LinkedObjectsSection objects={t.linkedObjects} />
      <CorrectionRequestsSection items={t.correctionRequests} />
      <ValidationFollowupSection items={t.validationFollowups} />
    </div>
  )
}
