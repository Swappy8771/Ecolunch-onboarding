import type {
  ContractListItemViewModel,
  ContractDetailViewModel,
  ContractSignatureRequestViewModel,
  ContractProgressViewModel,
  ContractBlockerViewModel,
  ContractDocumentViewModel,
  ContractDocumentVersionViewModel,
  ContractDocumentDownloadViewModel,
} from '../types/catererContracts.types'

/**
 * Hand-authored, not generated — `modules/contracts`'s responses have no
 * documented OpenAPI response schema (same pattern as every other
 * hand-authored mapper this session), so these mirror `contracts.dto.ts`'s
 * actual DTO shapes directly (`ContractListDTO`, the caterer-stripped
 * `CatererContractDetailDTO`, `ContractProgressDTO`, `ContractDocumentDTO`,
 * `ContractDocumentDownloadDTO`).
 */

interface ContractListItemDto {
  id: string
  catererId: string
  type: ContractListItemViewModel['type']
  status: ContractListItemViewModel['status']
  signatoryName: string | null
  signatoryEmail: string | null
  sentAt: string | null
  signedAt: string | null
  linkedModules: string[]
  createdAt: string
  updatedAt: string
}

interface ContractDetailDto extends ContractListItemDto {
  declinedAt: string | null
  signatureRequests: ContractSignatureRequestViewModel[]
  signedDocumentId: string | null
}

export function toContractListItemViewModel(dto: ContractListItemDto): ContractListItemViewModel {
  return { ...dto }
}

export function toContractListResult(dtos: ContractListItemDto[]): ContractListItemViewModel[] {
  return dtos.map(toContractListItemViewModel)
}

export function toContractDetailViewModel(dto: ContractDetailDto): ContractDetailViewModel {
  return {
    ...dto,
    signatureRequests: dto.signatureRequests.map((s) => ({ ...s })),
  }
}

export function toContractProgressViewModel(dto: {
  total: number
  required: number
  signed: number
  pending: number
  completionPercentage: number
  goLiveComplete: boolean
  blockers: ContractBlockerViewModel[]
}): ContractProgressViewModel {
  return {
    total: dto.total,
    required: dto.required,
    signed: dto.signed,
    pending: dto.pending,
    completionPercentage: dto.completionPercentage,
    goLiveComplete: dto.goLiveComplete,
    blockers: dto.blockers.map((b) => ({ ...b })),
  }
}

interface DocumentVersionDto {
  id: string
  fileName: string
  mimeType: string
  version: number
  status: string
}

function toContractDocumentVersionViewModel(dto: DocumentVersionDto): ContractDocumentVersionViewModel {
  return {
    id: dto.id,
    fileName: dto.fileName,
    mimeType: dto.mimeType,
    version: dto.version,
    status: dto.status,
  }
}

export function toContractDocumentViewModel(dto: {
  contractId: string
  document: DocumentVersionDto
  versions: DocumentVersionDto[]
}): ContractDocumentViewModel {
  return {
    contractId: dto.contractId,
    document: toContractDocumentVersionViewModel(dto.document),
    versions: dto.versions.map(toContractDocumentVersionViewModel),
  }
}

export function toContractDocumentDownloadViewModel(dto: {
  contractId: string
  url: string
}): ContractDocumentDownloadViewModel {
  return { ...dto }
}
