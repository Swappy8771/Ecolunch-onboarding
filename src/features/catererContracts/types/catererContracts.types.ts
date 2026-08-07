export type ContractType =
  | 'msa'
  | 'nda'
  | 'dpa'
  | 'platform_terms'
  | 'food_safety'
  | 'module_annex'
  | 'fee_schedule'

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

export interface ContractListItemViewModel {
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

export interface ContractSignatureRequestViewModel {
  signerName: string | null
  signerEmail: string | null
  status: 'sent' | 'viewed' | 'signed' | 'declined'
  order: number
  viewedAt: string | null
  signedAt: string | null
}

/** Caterer-safe detail — the backend already strips template id, merge fields, creator, and audit trail. */
export interface ContractDetailViewModel extends ContractListItemViewModel {
  declinedAt: string | null
  signatureRequests: ContractSignatureRequestViewModel[]
  signedDocumentId: string | null
}

export interface ContractBlockerViewModel {
  contractId: string
  type: ContractType
  status: ContractStatus
  signatoryEmail: string | null
}

export interface ContractProgressViewModel {
  total: number
  required: number
  signed: number
  pending: number
  completionPercentage: number
  goLiveComplete: boolean
  blockers: ContractBlockerViewModel[]
}

export interface ContractDocumentVersionViewModel {
  id: string
  fileName: string
  mimeType: string
  version: number
  status: string
}

export interface ContractDocumentViewModel {
  contractId: string
  document: ContractDocumentVersionViewModel
  versions: ContractDocumentVersionViewModel[]
}

export interface ContractDocumentDownloadViewModel {
  contractId: string
  url: string
}
