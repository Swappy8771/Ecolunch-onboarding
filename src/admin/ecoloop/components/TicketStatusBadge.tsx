import type { ConversationStatus, ConversationPriority, LinkedModule } from '@/features/adminEcoloop/types/ecoloop.types'

export const STATUS_META: Record<ConversationStatus, { label: string; color: string; bg: string; border: string }> = {
  open:                 { label: 'Open',                color: '#fbbf24', bg: 'rgba(251,191,36,0.10)', border: 'rgba(251,191,36,0.28)' },
  waiting_for_caterer:  { label: 'Waiting on Caterer',   color: '#60a5fa', bg: 'rgba(96,165,250,0.10)', border: 'rgba(96,165,250,0.28)' },
  waiting_for_admin:    { label: 'Waiting on Admin',     color: '#fb923c', bg: 'rgba(251,146,60,0.10)', border: 'rgba(251,146,60,0.28)' },
  resolved:             { label: 'Resolved',             color: '#4ade80', bg: 'rgba(74,222,128,0.10)', border: 'rgba(74,222,128,0.28)' },
  closed:               { label: 'Closed',               color: 'var(--text-4)', bg: 'var(--bg-inner)', border: 'var(--border-strong)' },
}

export const PRIORITY_META: Record<ConversationPriority, { label: string; color: string; bg: string; border: string }> = {
  urgent: { label: 'Urgent', color: '#f87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.30)' },
  high:   { label: 'High',   color: '#fb923c', bg: 'rgba(251,146,60,0.12)',  border: 'rgba(251,146,60,0.28)'  },
  normal: { label: 'Normal', color: '#fbbf24', bg: 'rgba(251,191,36,0.10)', border: 'rgba(251,191,36,0.26)' },
  low:    { label: 'Low',    color: '#4ade80', bg: 'rgba(74,222,128,0.10)', border: 'rgba(74,222,128,0.26)' },
}

export const LINKED_MODULE_META: Record<LinkedModule, { label: string; color: string }> = {
  validation:       { label: 'Validation',        color: '#a78bfa' },
  documents:        { label: 'Document',          color: '#60a5fa' },
  contracts:        { label: 'Contract',          color: '#fb923c' },
  'modules-pricing': { label: 'Modules & Pricing', color: '#fbbf24' },
  'go-live':        { label: 'Go-live Blocker',   color: '#f87171' },
  corrections:      { label: 'Correction',        color: '#f87171' },
  'smart-import':   { label: 'Smart Import',      color: '#4ade80' },
  school_meals:     { label: 'School Meals',       color: '#4ade80' },
  daycare_meals:    { label: 'Daycare / CPE Meals', color: '#60a5fa' },
  camp_meals:       { label: 'Camp Meals',         color: '#a78bfa' },
  accounting:       { label: 'Accounting',         color: '#fbbf24' },
  reportiq:         { label: 'ReportIQ',           color: '#f472b6' },
}

export function TicketStatusBadge({ status }: { status: ConversationStatus }) {
  const m = STATUS_META[status]
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap"
      style={{ background: m.bg, color: m.color, border: `1px solid ${m.border}` }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: m.color }} />
      {m.label}
    </span>
  )
}

export function PriorityBadge({ priority }: { priority: ConversationPriority }) {
  const m = PRIORITY_META[priority]
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-bold whitespace-nowrap"
      style={{ background: m.bg, color: m.color, border: `1px solid ${m.border}` }}>
      {m.label}
    </span>
  )
}

export function LinkedModuleBadge({ module }: { module: LinkedModule | null }) {
  if (!module) return <span className="text-[11px]" style={{ color: 'var(--text-4)' }}>Unlinked</span>
  const m = LINKED_MODULE_META[module]
  return <span className="text-[11px] font-medium" style={{ color: m.color }}>{m.label}</span>
}
