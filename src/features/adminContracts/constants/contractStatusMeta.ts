import type { ContractStatus } from '../types/contract.types'

/**
 * UI display mapping only — keyed by the real backend `ContractStatus`
 * wire values (never renamed, per the approved Phase 4B architecture).
 * Structurally identical to the old mock's `STATUS_META`, with exactly
 * two keys corrected: `ready` → `ready_to_send`, `cancelled` → `canceled`.
 */
export const CONTRACT_STATUS_META: Record<ContractStatus, { label: string; color: string; bg: string; border: string }> = {
  draft:            { label: 'Draft',            color: 'var(--text-3)', bg: 'var(--bg-inner)',        border: 'var(--border-strong)'   },
  ready_to_send:    { label: 'Ready to Send',    color: '#60a5fa',       bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.28)'  },
  sent:             { label: 'Sent',             color: '#a78bfa',       bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.28)' },
  viewed:           { label: 'Viewed',           color: '#22d3ee',       bg: 'rgba(34,211,238,0.12)',  border: 'rgba(34,211,238,0.28)'  },
  partially_signed: { label: 'Partially Signed', color: '#fb923c',       bg: 'rgba(251,146,60,0.12)',  border: 'rgba(251,146,60,0.28)'  },
  signed:           { label: 'Signed',           color: '#4ade80',       bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.28)'  },
  declined:         { label: 'Declined',         color: '#f87171',       bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.28)' },
  expired:          { label: 'Expired',          color: '#94a3b8',       bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.28)' },
  canceled:         { label: 'Canceled',         color: '#94a3b8',       bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.28)' },
  error:            { label: 'Error',            color: '#f43f5e',       bg: 'rgba(244,63,94,0.12)',   border: 'rgba(244,63,94,0.28)'   },
}

/** The 7 real backend contract types (`contracts.model.ts`'s `CONTRACT_TYPES`) — display names only; `useContractTemplates()` is the source of truth for the actual catalogue (name/templateId), this is a fallback label map for places that only have the type key. */
export const CONTRACT_TYPE_LABELS: Record<string, string> = {
  msa: 'MSA',
  nda: 'NDA',
  dpa: 'DPA',
  platform_terms: 'Platform Terms',
  food_safety: 'Food Safety',
  module_annex: 'Module Annex',
  fee_schedule: 'Fee Schedule',
}

/** Webhook event → badge label/color, shown inline next to system-generated audit-history entries. Backend event names unchanged (`ContractHistoryEntryViewModel.webhookEvent`). */
export const CONTRACT_WEBHOOK_EVENT_META: Record<string, { label: string; color: string }> = {
  signature_request_sent:       { label: 'sent',       color: '#a78bfa' },
  signature_request_viewed:     { label: 'viewed',     color: '#22d3ee' },
  signature_request_signed:     { label: 'signed',     color: '#fb923c' },
  signature_request_all_signed: { label: 'all_signed', color: '#4ade80' },
  signature_request_declined:   { label: 'declined',   color: '#f87171' },
  signature_request_expired:    { label: 'expired',    color: '#94a3b8' },
  signature_request_canceled:   { label: 'canceled',   color: '#94a3b8' },
  signature_request_error:      { label: 'error',      color: '#f43f5e' },
}
