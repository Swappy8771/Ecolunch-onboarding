import type { TicketStatus, Priority, TicketCategory } from '../types/ecoloop.types'

export const STATUS_META: Record<TicketStatus, { label: string; color: string; bg: string; border: string }> = {
  open:    { label: 'Open',    color: '#fbbf24', bg: 'rgba(251,191,36,0.10)', border: 'rgba(251,191,36,0.28)' },
  pending: { label: 'Pending', color: '#fb923c', bg: 'rgba(251,146,60,0.10)', border: 'rgba(251,146,60,0.28)' },
  closed:  { label: 'Closed',  color: '#4ade80', bg: 'rgba(74,222,128,0.10)', border: 'rgba(74,222,128,0.28)' },
  blocked: { label: 'Blocked', color: '#f87171', bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.28)' },
}

export const PRIORITY_META: Record<Priority, { label: string; color: string; bg: string; border: string }> = {
  critical: { label: 'Critical', color: '#f87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.30)' },
  high:     { label: 'High',     color: '#fb923c', bg: 'rgba(251,146,60,0.12)',  border: 'rgba(251,146,60,0.28)'  },
  medium:   { label: 'Medium',   color: '#fbbf24', bg: 'rgba(251,191,36,0.10)', border: 'rgba(251,191,36,0.26)' },
  low:      { label: 'Low',      color: '#4ade80', bg: 'rgba(74,222,128,0.10)', border: 'rgba(74,222,128,0.26)' },
}

export const CATEGORY_META: Record<TicketCategory, { label: string; color: string }> = {
  'correction-request':  { label: 'Correction',          color: '#f87171' },
  'client-message':      { label: 'Client Message',       color: '#60a5fa' },
  'validation-followup': { label: 'Validation Follow-up', color: '#a78bfa' },
  'contract-followup':   { label: 'Contract Follow-up',   color: '#fb923c' },
  'golive-blocker':      { label: 'Go-live Blocker',      color: '#f87171' },
  'internal':            { label: 'Internal',             color: 'var(--text-4)' },
}

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  const m = STATUS_META[status]
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap"
      style={{ background: m.bg, color: m.color, border: `1px solid ${m.border}` }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: m.color }} />
      {m.label}
    </span>
  )
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const m = PRIORITY_META[priority]
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-bold whitespace-nowrap"
      style={{ background: m.bg, color: m.color, border: `1px solid ${m.border}` }}>
      {m.label}
    </span>
  )
}

export function CategoryBadge({ category }: { category: TicketCategory }) {
  const m = CATEGORY_META[category]
  return (
    <span className="text-[11px] font-medium" style={{ color: m.color }}>{m.label}</span>
  )
}
