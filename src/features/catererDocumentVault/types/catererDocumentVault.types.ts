/**
 * UI-facing types for the Caterer Portal's Document Vault feature.
 * Mirrors the backend's `document-vault.dto.ts`/`documents.dto.ts` shapes
 * directly — both modules have no documented OpenAPI response schema
 * component (hand-authored `@openapi` blocks only), same pattern as every
 * other hand-authored mapper this session.
 */

export type DocumentCategoryKey =
  | 'profile'
  | 'legal'
  | 'banking'
  | 'compliance'
  | 'insurance'
  | 'establishments'
  | 'menus'
  | 'modules'
  | 'contracts'
  | 'golive'
  | 'internal'

export type DocumentVaultModuleKey = 'school_meals' | 'daycare_meals' | 'camp_meals' | 'accounting' | 'reportiq'

export type RequirementMatchStatus =
  | 'missing'
  | 'uploaded'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'correction_requested'

export interface DocumentRequirementViewModel {
  key: string
  category: DocumentCategoryKey
  moduleKey: DocumentVaultModuleKey | null
  label: string
  required: boolean
  status: RequirementMatchStatus
  documentId: string | null
  version: number | null
}

export interface DocumentCategoryGroupViewModel {
  category: DocumentCategoryKey
  categoryLabel: string
  moduleKey: DocumentVaultModuleKey | null
  requirements: DocumentRequirementViewModel[]
}

export interface DocumentGroupViewModel {
  groupKey: 'base' | 'modules'
  label: string
  categories: DocumentCategoryGroupViewModel[]
}

export interface DocumentVaultProgressSectionViewModel {
  key: string
  percentage: number
  validationStatus: string
}

export interface DocumentVaultProgressViewModel {
  completionPercentage: number
  completedFields: string[]
  missingFields: string[]
  totalFields: number
  sections: DocumentVaultProgressSectionViewModel[]
}

export type DocumentStatus = 'uploaded' | 'under_review' | 'approved' | 'rejected' | 'correction_requested' | 'archived'

export interface DocumentViewModel {
  id: string
  catererId: string
  category: DocumentCategoryKey
  status: DocumentStatus
  version: number
  versionOf: string | null
  fileName: string
  mimeType: string
  linkedSection: string | null
  reviewNote: string | null
  createdAt: string
  updatedAt: string
}

export interface UploadDocumentInput {
  fileName: string
  mimeType: string
  category: DocumentCategoryKey
  linkedSection: string
}

export interface ReplaceDocumentInput {
  fileName: string
  mimeType: string
}
