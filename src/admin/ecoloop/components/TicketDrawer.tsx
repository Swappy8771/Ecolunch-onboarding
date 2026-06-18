import { useEffect, useState } from 'react'
import { X, ArrowLeft, MapPin, User, Clock } from 'lucide-react'
import type { Ticket } from '../types/ecoloop.types'
import { TicketStatusBadge, PriorityBadge, CategoryBadge, PRIORITY_META } from './TicketStatusBadge'
import { TicketDetailPanel } from './TicketDetail/TicketDetailPanel'

const PRIORITY_ACCENT: Record<string, string> = {
  critical: '#f87171',
  high:     '#fb923c',
  medium:   '#fbbf24',
  low:      '#4ade80',
}

interface TicketDrawerProps {
  ticket: Ticket | null
  onClose: () => void
}

export function TicketDrawer({ ticket, onClose }: TicketDrawerProps) {
  // Keep last ticket alive so content doesn't vanish during the slide-out
  const [displayTicket, setDisplayTicket] = useState<Ticket | null>(ticket)

  useEffect(() => {
    if (ticket) setDisplayTicket(ticket)
  }, [ticket])

  const isOpen   = ticket !== null
  const accent   = displayTicket ? (PRIORITY_ACCENT[displayTicket.priority] ?? '#60a5fa') : '#60a5fa'
  const pm       = displayTicket ? PRIORITY_META[displayTicket.priority] : null

  return (
    <>
      {/* ── Backdrop ── */}
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

      {/* ── Modal panel ── */}
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
        {displayTicket && (
          <>
            {/* ── Priority accent line ── */}
            <div className="shrink-0 h-[3px]" style={{ background: accent }} />

            {/* ── Sticky drawer header ── */}
            <div className="shrink-0 flex flex-col"
              style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-default)' }}>

              {/* Top bar: nav / badges / close */}
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
                    {displayTicket.number}
                  </span>
                  <TicketStatusBadge status={displayTicket.status} />
                  <PriorityBadge    priority={displayTicket.priority} />
                  <CategoryBadge    category={displayTicket.category} />
                </div>

                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer shrink-0 transition-opacity hover:opacity-70"
                  style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
                  <X size={13} strokeWidth={2.5} />
                </button>
              </div>

              {/* Subject + meta + quick actions */}
              <div className="px-5 pb-4 flex flex-col gap-2.5">
                <h2 className="text-[17px] font-bold leading-snug" style={{ color: 'var(--text-1)' }}>
                  {displayTicket.subject}
                </h2>

                <div className="flex items-center gap-3 flex-wrap" style={{ color: 'var(--text-4)' }}>
                  <span className="flex items-center gap-1 text-[11.5px]">
                    <MapPin size={10} strokeWidth={2} />{displayTicket.caterer}
                  </span>
                  <span className="w-1 h-1 rounded-full" style={{ background: 'var(--border-strong)' }} />
                  <span className="flex items-center gap-1 text-[11.5px]">
                    <User size={10} strokeWidth={2} />{displayTicket.assignedTo}
                  </span>
                  <span className="w-1 h-1 rounded-full" style={{ background: 'var(--border-strong)' }} />
                  <span className="flex items-center gap-1 text-[11.5px]">
                    <Clock size={10} strokeWidth={2} />{displayTicket.lastActivity}
                  </span>
                </div>

                {/* Quick action chips */}
                <div className="flex items-center gap-2 flex-wrap pt-0.5">
                  {[
                    { label: 'Send Message',    bg: 'var(--accent)',             color: '#07070a',           border: 'transparent'                        },
                    { label: 'Add Note',        bg: 'rgba(167,139,250,0.12)',   color: '#a78bfa',           border: 'rgba(167,139,250,0.25)'              },
                    { label: 'Reassign',        bg: 'var(--bg-inner)',           color: 'var(--text-3)',     border: 'var(--border-strong)'                },
                    { label: 'Change Priority', bg: pm?.bg  ?? 'var(--bg-inner)', color: pm?.color ?? 'var(--text-3)', border: pm?.border ?? 'var(--border-strong)' },
                    { label: 'Close Ticket',    bg: 'rgba(248,113,113,0.10)',   color: '#f87171',           border: 'rgba(248,113,113,0.25)'              },
                  ].map(({ label, bg, color, border }) => (
                    <button key={label}
                      className="px-3 py-1.5 rounded-lg text-[11.5px] font-semibold cursor-pointer shrink-0 transition-opacity hover:opacity-80"
                      style={{ background: bg, color, border: `1px solid ${border}` }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Scrollable content ── */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-5 py-5">
                <TicketDetailPanel ticket={displayTicket} hideHeader />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
