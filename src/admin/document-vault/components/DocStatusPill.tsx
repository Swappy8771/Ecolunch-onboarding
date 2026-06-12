import { StatusPill } from '@shared/ui/StatusPill'

export type DocStatus = 'approved' | 'pending' | 'rejected' | 'correction'

export const DOC_STATUS_META: Record<DocStatus, { label: string; color: string; bg: string; border: string }> = {
  approved:   { label: 'Approved',        color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.30)'  },
  pending:    { label: 'Pending Review',  color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.30)'  },
  rejected:   { label: 'Rejected',       color: '#f87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.30)' },
  correction: { label: 'Correction Req.', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.30)'  },
}

export function DocStatusPill({ status }: { status: DocStatus }) {
  const m = DOC_STATUS_META[status]
  return <StatusPill label={m.label} bg={m.bg} color={m.color} border={m.border} dot />
}
