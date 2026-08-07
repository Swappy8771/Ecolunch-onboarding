import type { Mapper } from '@/api/mappers/types'
import type {
  ContractType,
  ContractStatus,
  ContractListItemViewModel,
  ContractDetailViewModel,
  ContractSignatureRequestViewModel,
  MergeFieldViewModel,
  ContractBlockerViewModel,
  ContractSummaryViewModel,
  ContractHistoryEntryViewModel,
  ContractHistoryViewModel,
  ContractTemplateViewModel,
  CreateDraftContractInput,
  SendContractInput,
} from '../types/contract.types'

/**
 * Hand-authored, not generated. Most `/admin/contracts/*` response bodies
 * still have no OpenAPI `content.schema` (see `src/api/generated/
 * helpers.ts`'s header — `list`/`templates`/`getById`/`history`/
 * `document/download` are the exceptions, and even those resolve to a
 * deeply-nested generated shape), so this file follows the same
 * convention already established for Caterers/Document Vault: hand-author
 * an interface here, kept in sync by hand with the real backend DTOs in
 * `backend/src/modules/contracts/contracts.dto.ts`.
 */

export interface ContractDto {
  id: string
  catererId: string
  type: ContractType
  status: ContractStatus
  signatoryName: string | null
  signatoryEmail: string | null
  sentAt: string | null
  signedAt: string | null
  linkedModules: string[]
  createdAt: string
  updatedAt: string
}

export interface ContractMergeFieldDto {
  client_name: string | null
  legal_name: string | null
  monthly_rate_cents: number
  setup_fees_cents: number
  start_date: string | null
  modules_list: string[]
  signatory_name: string | null
  signatory_email: string | null
}

export interface ContractSignatureRequestDto {
  signerName: string | null
  signerEmail: string | null
  status: 'sent' | 'viewed' | 'signed' | 'declined'
  order: number
  viewedAt: string | null
  signedAt: string | null
}

export interface ContractDetailDto extends ContractDto {
  templateId: string | null
  dropboxSignRequestId: string | null
  mergeFields: ContractMergeFieldDto
  signatureRequests: ContractSignatureRequestDto[]
  signedDocumentId: string | null
  auditTrailDocumentId: string | null
  declinedAt: string | null
  createdBy: string | null
  createdByName: string | null
  lastError: string | null
}

export interface ContractBlockerDto {
  contractId: string
  type: ContractType
  status: ContractStatus
  signatoryEmail: string | null
}

/**
 * Matches the real `GET /admin/contracts/caterers/{catererId}/summary`
 * response — `ContractProgressDTO` server-side, NOT `contracts.dto.ts`'s
 * unused `ContractSummaryDTO`. See `contract.types.ts`'s
 * `ContractSummaryViewModel` doc comment for the full explanation.
 */
export interface ContractProgressDto {
  total: number
  required: number
  signed: number
  pending: number
  completionPercentage: number
  goLiveComplete: boolean
  blockers: ContractBlockerDto[]
}

export interface ContractHistoryEntryDto {
  date: string
  action: string
  actor: string
  webhookEvent: string | null
}

export interface ContractHistoryDto {
  contract: ContractDetailDto
  history: ContractHistoryEntryDto[]
}

export interface ContractTemplateDto {
  type: ContractType
  name: string
  templateId: string | null
}

/** `44900` → `"$449"`; `44950` → `"$449.50"`. No `Intl` dependency — matches this codebase's existing plain-string currency formatting (see the old mock's `$${monthlyRate}` style). */
function formatCents(cents: number): string {
  const dollars = cents / 100
  return Number.isInteger(dollars) ? `$${dollars}` : `$${dollars.toFixed(2)}`
}

function formatDateOnly(iso: string | null): string | null {
  return iso ? iso.slice(0, 10) : null
}

/** `YYYY-MM-DD HH:MM`, matching the old mock's audit-log date format exactly. */
function formatDateTime(iso: string): string {
  return iso.replace('T', ' ').slice(0, 16)
}

export function mapMergeFieldsToViewModel(dto: ContractMergeFieldDto): MergeFieldViewModel {
  return {
    clientName: dto.client_name,
    legalName: dto.legal_name,
    monthlyRateFormatted: `${formatCents(dto.monthly_rate_cents)}/mo`,
    setupFeesFormatted: formatCents(dto.setup_fees_cents),
    startDate: formatDateOnly(dto.start_date),
    modulesList: dto.modules_list,
    signatoryName: dto.signatory_name,
    signatoryEmail: dto.signatory_email,
  }
}

function mapSignatureRequestToViewModel(dto: ContractSignatureRequestDto): ContractSignatureRequestViewModel {
  return {
    signerName: dto.signerName,
    signerEmail: dto.signerEmail,
    status: dto.status,
    order: dto.order,
    viewedAt: formatDateOnly(dto.viewedAt),
    signedAt: formatDateOnly(dto.signedAt),
  }
}

export const mapContractToListItem: Mapper<ContractDto, ContractListItemViewModel> = dto => ({
  id: dto.id,
  catererId: dto.catererId,
  type: dto.type,
  status: dto.status,
  signatoryName: dto.signatoryName,
  signatoryEmail: dto.signatoryEmail,
  sentAt: formatDateOnly(dto.sentAt),
  signedAt: formatDateOnly(dto.signedAt),
  linkedModules: dto.linkedModules,
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
})

export const mapContractToDetail: Mapper<ContractDetailDto, ContractDetailViewModel> = dto => ({
  ...mapContractToListItem(dto),
  templateId: dto.templateId,
  dropboxSignRequestId: dto.dropboxSignRequestId,
  mergeFields: mapMergeFieldsToViewModel(dto.mergeFields),
  signatureRequests: dto.signatureRequests.map(mapSignatureRequestToViewModel),
  signedDocumentId: dto.signedDocumentId,
  auditTrailDocumentId: dto.auditTrailDocumentId,
  declinedAt: formatDateOnly(dto.declinedAt),
  createdBy: dto.createdBy,
  createdByName: dto.createdByName,
  lastError: dto.lastError,
})

function mapBlockerToViewModel(dto: ContractBlockerDto): ContractBlockerViewModel {
  return { contractId: dto.contractId, type: dto.type, status: dto.status, signatoryEmail: dto.signatoryEmail }
}

export const mapProgressToSummary: Mapper<ContractProgressDto, ContractSummaryViewModel> = dto => ({
  total: dto.total,
  required: dto.required,
  signed: dto.signed,
  pending: dto.pending,
  completionPercentage: dto.completionPercentage,
  goLiveComplete: dto.goLiveComplete,
  blockers: dto.blockers.map(mapBlockerToViewModel),
})

function mapHistoryEntryToViewModel(dto: ContractHistoryEntryDto): ContractHistoryEntryViewModel {
  return {
    date: formatDateTime(dto.date),
    action: dto.action,
    actor: dto.actor,
    webhookEvent: dto.webhookEvent,
  }
}

export const mapContractHistoryToViewModel: Mapper<ContractHistoryDto, ContractHistoryViewModel> = dto => ({
  contract: mapContractToDetail(dto.contract),
  history: dto.history.map(mapHistoryEntryToViewModel),
})

export const mapContractTemplateToViewModel: Mapper<ContractTemplateDto, ContractTemplateViewModel> = dto => ({
  type: dto.type,
  name: dto.name,
  templateId: dto.templateId,
})

/** Request-body mapper for `POST /admin/contracts/caterers/{catererId}` (create draft). Drops empty-string optional fields so the request doesn't send `''` where the backend expects absence — same convention as `caterer.mapper.ts`'s `orUndefined`. */
export function mapCreateDraftInputToRequestBody(input: CreateDraftContractInput) {
  return {
    type: input.type,
    signatoryName: input.signatoryName?.trim() || undefined,
    signatoryEmail: input.signatoryEmail?.trim() || undefined,
    linkedModules: input.linkedModules?.length ? input.linkedModules : undefined,
  }
}

/** Request-body mapper for `POST /admin/contracts/{cid}/send`. */
export function mapSendInputToRequestBody(input: SendContractInput) {
  return {
    signatoryName: input.signatoryName?.trim() || undefined,
    signatoryEmail: input.signatoryEmail?.trim() || undefined,
  }
}
