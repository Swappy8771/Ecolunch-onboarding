export type ContractStatus =
  | 'draft'
  | 'ready'
  | 'sent'
  | 'viewed'
  | 'partially_signed'
  | 'signed'
  | 'declined'
  | 'expired'
  | 'cancelled'
  | 'error'

export interface AuditEntry {
  date: string
  action: string
  actor: string
  webhook?: string
}

export interface Contract {
  id: string
  name: string
  type: string
  template: string
  caterer: string
  catererId: string
  signatoryName: string
  signatoryEmail: string
  dropboxRequestId: string
  status: ContractStatus
  sentDate: string | null
  viewedDate: string | null
  signedDate: string | null
  version: string
  linkedModules: string[]
  monthlyRate: number | null
  dropboxStoragePath: string | null
  documentVaultLinked: boolean
  goLiveReEvaluated: boolean
  auditLog: AuditEntry[]
}

export interface MergeFields {
  client_name: string
  legal_name: string
  monthly_rate: string
  start_date: string
  modules_list: string
  fee_percentage: string
  fixed_fee: string
  signatory_name: string
  signatory_email: string
}

export interface ContractTemplate {
  id: string
  name: string
  type: string
  version: string
  description: string
}
