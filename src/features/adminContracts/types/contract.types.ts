/**
 * UI-facing types for the Contracts feature. These are ViewModel/filter
 * shapes a component works with — never the raw backend DTO (that lives
 * next to the mapper that produces these, in `../mappers/contract.mapper.ts`).
 */

/** The real 7-value backend contract type enum (`backend/src/modules/contracts/contracts.dto.ts`'s `ContractType`). */
export type ContractType =
  | 'msa'
  | 'nda'
  | 'dpa'
  | 'platform_terms'
  | 'food_safety'
  | 'module_annex'
  | 'fee_schedule'

/**
 * The real 10-value backend `Contract.status` enum — wire values, never
 * renamed (per the approved Phase 4B architecture). Display labels live
 * in `../constants/contractStatusMeta.ts`, not here.
 */
export type ContractStatus =
  | 'draft'
  | 'ready_to_send'
  | 'sent'
  | 'viewed'
  | 'partially_signed'
  | 'signed'
  | 'declined'
  | 'expired'
  | 'canceled'
  | 'error'

export interface ContractSignatureRequestViewModel {
  signerName: string | null
  signerEmail: string | null
  status: 'sent' | 'viewed' | 'signed' | 'declined'
  order: number
  viewedAt: string | null
  signedAt: string | null
}

/** List row — `GET /admin/contracts`, `GET /admin/contracts/caterers/:catererId`. Lighter than `ContractDetailViewModel`, matching the backend's own `ContractListDTO`/`ContractDetailDTO` split. */
export interface ContractListItemViewModel {
  id: string
  catererId: string
  type: ContractType
  status: ContractStatus
  signatoryName: string | null
  signatoryEmail: string | null
  /** Date-only (`YYYY-MM-DD`) or `null` — formatted in the mapper, never in a component. */
  sentAt: string | null
  signedAt: string | null
  linkedModules: string[]
  createdAt: string
  updatedAt: string
}

/** Display-ready merge-field snapshot — cents converted to formatted currency strings in the mapper, never in a component. */
export interface MergeFieldViewModel {
  clientName: string | null
  legalName: string | null
  monthlyRateFormatted: string
  setupFeesFormatted: string
  startDate: string | null
  modulesList: string[]
  signatoryName: string | null
  signatoryEmail: string | null
}

export interface ContractDetailViewModel extends ContractListItemViewModel {
  templateId: string | null
  dropboxSignRequestId: string | null
  mergeFields: MergeFieldViewModel
  signatureRequests: ContractSignatureRequestViewModel[]
  signedDocumentId: string | null
  auditTrailDocumentId: string | null
  declinedAt: string | null
  createdBy: string | null
  /** Resolved server-side via a batch `usersService.findByIds()` lookup. `null` if unset or unresolved. */
  createdByName: string | null
  /** Populated only when `status === 'error'` — the Retry action and Detail Drawer surface this directly. */
  lastError: string | null
}

export interface ContractBlockerViewModel {
  contractId: string
  type: ContractType
  status: ContractStatus
  signatoryEmail: string | null
}

/**
 * Named `ContractSummaryViewModel` per the approved Phase 4B architecture,
 * but mapped from the real `GET /admin/contracts/caterers/:catererId/summary`
 * response — which is `ContractProgressDTO` server-side
 * (`total/required/signed/pending/completionPercentage/goLiveComplete/
 * blockers`), NOT the `ContractSummaryDTO` interface defined in the
 * backend's `contracts.dto.ts` (`catererId/total/pending/signed/
 * declinedOrExpired`). That DTO is unused — no controller returns it; the
 * page-level dashboard rollup stays client-computed over `useContracts()`
 * per NOTES.md §5.9. See `contract.mapper.ts`'s header for the same note.
 */
export interface ContractSummaryViewModel {
  total: number
  required: number
  signed: number
  pending: number
  completionPercentage: number
  goLiveComplete: boolean
  blockers: ContractBlockerViewModel[]
}

export interface ContractHistoryEntryViewModel {
  /** `YYYY-MM-DD HH:MM` — formatted in the mapper. */
  date: string
  action: string
  actor: string
  webhookEvent: string | null
}

export interface ContractHistoryViewModel {
  contract: ContractDetailViewModel
  history: ContractHistoryEntryViewModel[]
}

/** The fixed 7-template catalogue — `version`/`description` (mock-only fields with no backend equivalent) are dropped, see Phase 4A. */
export interface ContractTemplateViewModel {
  type: ContractType
  name: string
  templateId: string | null
}

export interface ContractListFilters {
  caterer?: string
  status?: ContractStatus
  type?: ContractType
}

export interface CreateDraftContractInput {
  catererId: string
  type: ContractType
  signatoryName?: string
  signatoryEmail?: string
  linkedModules?: string[]
}

export interface SendContractInput {
  cid: string
  signatoryName?: string
  signatoryEmail?: string
}
