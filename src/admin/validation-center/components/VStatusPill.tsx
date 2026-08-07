import { StatusPill } from '@shared/ui/StatusPill'
import type { ValidationStatus } from '@/features/adminValidation/types/validation.types'

/** The real 6-value backend `ValidationItem.status` enum — no collapsing (the old mock only had 4 values and dropped `in_review`/`closed` entirely). */
export const STATUS_META: Record<ValidationStatus, { label: string; color: string; bg: string; border: string }> = {
  pending_review:       { label: 'Pending Review',       color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.30)'  },
  in_review:             { label: 'In Review',            color: '#818cf8', bg: 'rgba(129,140,248,0.12)', border: 'rgba(129,140,248,0.30)' },
  approved:              { label: 'Approved',             color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.30)'  },
  rejected:              { label: 'Rejected',             color: '#f87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.30)' },
  correction_requested:  { label: 'Correction Requested', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.30)'  },
  closed:                { label: 'Closed',                color: 'var(--text-4)', bg: 'var(--bg-inner)', border: 'var(--border-strong)'   },
}

export function VStatusPill({ status }: { status: ValidationStatus }) {
  const m = STATUS_META[status]
  return <StatusPill label={m.label} bg={m.bg} color={m.color} border={m.border} dot />
}
