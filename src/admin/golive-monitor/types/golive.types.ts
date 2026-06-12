export type GoLiveStatus = 'ready' | 'not-ready' | 'blocked'

export type ChecklistItemId =
  | 'account-created'
  | 'profile-validated'
  | 'banking-validated'
  | 'establishments-confirmed'
  | 'menus-validated'
  | 'documents-approved'
  | 'contracts-signed'
  | 'modules-configured'
  | 'pricing-configured'
  | 'corrections-closed'
  | 'ecoloop-blockers-closed'

export type ChecklistItemStatus = 'complete' | 'incomplete' | 'blocked'

export type BlockerCategory =
  | 'document'
  | 'contract'
  | 'pricing'
  | 'validation'
  | 'menu'
  | 'ecoloop'
  | 'banking'

export interface ChecklistItem {
  id: ChecklistItemId
  label: string
  status: ChecklistItemStatus
  section: string
}

export interface Blocker {
  id: string
  title: string
  category: BlockerCategory
  description: string
  section: string
}

export interface AuditLog {
  id: string
  ts: string
  user: string
  action: string
}

export interface CatererReadiness {
  id: string
  name: string
  city: string
  vertical: string
  status: GoLiveStatus
  progressPct: number
  completedSteps: number
  totalSteps: number
  blockingSteps: number
  openCorrections: number
  openValidations: number
  checklist: ChecklistItem[]
  blockers: Blocker[]
  audit: AuditLog[]
  lastUpdated: string
}
