/**
 * UI-facing types for the Document Vault feature. ViewModel/filter shapes
 * only — the raw backend DTO shapes live next to the mapper that produces
 * these, in `../mappers/documentVault.mapper.ts`.
 */

/** The real 11-value backend category enum (`documents.model.ts`'s `DOCUMENT_CATEGORIES`). */
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

/** The real 6-value `Document.status` enum. */
export type DocumentStatus = 'uploaded' | 'under_review' | 'approved' | 'rejected' | 'correction_requested' | 'archived'

/**
 * The 4-value display bucket the existing `DocStatusPill` component (`src/
 * admin/document-vault/components/DocStatusPill.tsx`) already renders.
 * `uploaded` and `under_review` both collapse into `pending` — the mock
 * never distinguished them either, and there's no 5th pill slot in the
 * existing UI. `archived` (superseded versions) is never shown in the main
 * table — filtered out before mapping, same as the backend's own
 * "current version" queries already do.
 */
export type DocStatusDisplay = 'approved' | 'pending' | 'rejected' | 'correction'

export interface CatererVaultSummaryViewModel {
  id: string
  name: string
  city: string
  totalDocs: number
  pending: number
  approved: number
  rejected: number
  corrections: number
  /** ISO string or null — formatting to "2h ago"-style relative text is a display concern, done in the component. */
  lastActivity: string | null
}

/**
 * One category tile (Level 2 of the page). Counts are over the Document
 * Vault **requirement catalogue** (checklist items), not raw uploaded-file
 * counts — a deliberate change from the old mock, which counted arbitrary
 * uploads per category. See `documentVault.mapper.ts`'s header for why.
 */
export interface DocumentCategoryTileViewModel {
  key: DocumentCategoryKey | string
  label: string
  moduleKey: string | null
  totalRequirements: number
  approvedCount: number
  pendingCount: number
  missingCount: number
}

export interface DocumentViewModel {
  id: string
  fileName: string
  category: DocumentCategoryKey | string
  status: DocumentStatus
  statusDisplay: DocStatusDisplay
  version: number
  uploadedBy: string | null
  uploadedByName: string | null
  createdAt: string
  linkedSection: string | null
  visibility: 'client_visible' | 'internal'
  reviewNote: string | null
}

export interface DocumentReviewInput {
  decision: 'approve' | 'reject' | 'request_correction'
  note?: string
}

export interface UploadDocumentInput {
  fileName: string
  mimeType: string
  category: DocumentCategoryKey | string
  visibility?: 'client_visible' | 'internal'
  linkedSection?: string
}

export interface ClassifyDocumentInput {
  category?: DocumentCategoryKey | string
  linkedSection?: string | null
}
