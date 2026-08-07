import type { Mapper } from '@/api/mappers/types'
import type {
  CatererVaultSummaryViewModel,
  DocumentCategoryTileViewModel,
  DocumentStatus,
  DocStatusDisplay,
  DocumentViewModel,
} from '../types/documentVault.types'

/**
 * Hand-authored, not generated. The backend's response schemas do exist
 * for these endpoints now (unlike the Caterers module before its own DTO
 * layer landed), but the generated `ResponseBody<P,M>` shape is a deeply
 * nested, hard-to-consume oneOf-style type — this module follows the same
 * convention already established for Caterers/Banking: hand-author a
 * matching interface here, kept in sync with the real backend DTOs
 * (`backend/src/modules/documents/documents.dto.ts`,
 * `backend/src/modules/document-vault/document-vault.dto.ts`) by hand.
 */

export interface VaultSummaryDto {
  catererId: string
  companyName: string | null
  city: string | null
  total: number
  pending: number
  approved: number
  rejected: number
  corrections: number
  lastActivity: string | null
}

export interface DocumentRequirementDto {
  key: string
  category: string
  moduleKey: string | null
  label: string
  required: boolean
  status: 'missing' | DocumentStatus
  documentId: string | null
  version: number | null
}

export interface DocumentCategoryGroupDto {
  category: string
  categoryLabel: string
  moduleKey: string | null
  requirements: DocumentRequirementDto[]
}

export interface DocumentGroupDto {
  groupKey: 'base' | 'modules'
  label: string
  categories: DocumentCategoryGroupDto[]
}

export interface DocumentDto {
  id: string
  catererId: string
  category: string
  status: DocumentStatus
  version: number
  fileName: string
  uploadedBy: string | null
  uploadedByName: string | null
  createdAt: string
  linkedSection: string | null
  visibility: 'client_visible' | 'internal'
  reviewNote: string | null
}

const STATUS_DISPLAY: Record<DocumentStatus, DocStatusDisplay | null> = {
  uploaded: 'pending',
  under_review: 'pending',
  approved: 'approved',
  rejected: 'rejected',
  correction_requested: 'correction',
  archived: null, // superseded version — never shown in the main table
}

/** `uploaded`/`under_review` both collapse into `pending` — see `DocStatusDisplay`'s doc comment. */
export function toStatusDisplay(status: DocumentStatus): DocStatusDisplay {
  return STATUS_DISPLAY[status] ?? 'pending'
}

export const mapVaultSummaryToViewModel: Mapper<VaultSummaryDto, CatererVaultSummaryViewModel> = dto => ({
  id: dto.catererId,
  name: dto.companyName ?? 'Unnamed Caterer',
  city: dto.city ?? '',
  totalDocs: dto.total,
  pending: dto.pending,
  approved: dto.approved,
  rejected: dto.rejected,
  corrections: dto.corrections,
  lastActivity: dto.lastActivity,
})

/**
 * Maps one `DocumentCategoryGroupDto` to a category tile. Counts are over
 * the requirement catalogue (checklist items annotated with match status),
 * not raw document uploads — see `DocumentCategoryTileViewModel`'s doc
 * comment for why this is a deliberate change from the old mock.
 */
export function mapCategoryGroupToTile(group: DocumentCategoryGroupDto): DocumentCategoryTileViewModel {
  const requirements = group.requirements
  return {
    key: group.category,
    label: group.categoryLabel,
    moduleKey: group.moduleKey,
    totalRequirements: requirements.length,
    approvedCount: requirements.filter(r => r.status === 'approved').length,
    pendingCount: requirements.filter(r => r.status === 'uploaded' || r.status === 'under_review' || r.status === 'correction_requested').length,
    missingCount: requirements.filter(r => r.status === 'missing').length,
  }
}

/** Flattens both groups (`base` + `modules`) into one ordered list of category tiles, skipping empty categories (module-gated categories not currently active). */
export function mapGroupsToTiles(groups: DocumentGroupDto[]): DocumentCategoryTileViewModel[] {
  return groups
    .flatMap(group => group.categories)
    .filter(cat => cat.requirements.length > 0)
    .map(mapCategoryGroupToTile)
}

export const mapDocumentToViewModel: Mapper<DocumentDto, DocumentViewModel> = dto => ({
  id: dto.id,
  fileName: dto.fileName,
  category: dto.category,
  status: dto.status,
  statusDisplay: toStatusDisplay(dto.status),
  version: dto.version,
  uploadedBy: dto.uploadedBy,
  uploadedByName: dto.uploadedByName,
  createdAt: dto.createdAt,
  linkedSection: dto.linkedSection,
  visibility: dto.visibility,
  reviewNote: dto.reviewNote,
})
