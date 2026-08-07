import type { Mapper } from '@/api/mappers/types'
import type {
  ValidationItemViewModel,
  ValidationInternalNoteViewModel,
  ValidationHistoryEntryViewModel,
  ValidationType,
  ValidationStatus,
  ValidationPriority,
} from '../types/validation.types'

/**
 * Hand-authored, not generated — `validation.service.ts` has no OpenAPI
 * response schema, so these mirror `validation.dto.ts`'s actual DTO shapes
 * directly, same pattern as every other hand-authored mapper this session.
 */

export interface ValidationInternalNoteDto {
  authorId: string | null
  note: string
  createdAt: string
}

export interface ValidationItemDto {
  id: string
  catererId: string
  type: ValidationType
  priority: ValidationPriority
  status: ValidationStatus
  section: string | null
  title: string | null
  description: string | null
  dataSnapshot: Record<string, unknown> | null
  linkedDocumentId: string | null
  smartImportJobId: string | null
  reviewedBy: string | null
  reviewedAt: string | null
  internalNotes: ValidationInternalNoteDto[]
  createdAt: string
  updatedAt: string
}

export interface ValidationAuditEntryDto {
  timestamp: string
  action: string
  actorId: string | null
  actorType: string
}

export const mapValidationItemToViewModel: Mapper<ValidationItemDto, ValidationItemViewModel> = dto => ({
  id: dto.id,
  catererId: dto.catererId,
  type: dto.type,
  priority: dto.priority,
  status: dto.status,
  section: dto.section,
  title: dto.title,
  description: dto.description,
  dataSnapshot: dto.dataSnapshot ?? {},
  linkedDocumentId: dto.linkedDocumentId,
  smartImportJobId: dto.smartImportJobId,
  reviewedBy: dto.reviewedBy,
  reviewedAt: dto.reviewedAt,
  internalNotes: (dto.internalNotes ?? []).map(mapInternalNote),
  createdAt: dto.createdAt,
})

function mapInternalNote(dto: ValidationInternalNoteDto): ValidationInternalNoteViewModel {
  return { authorId: dto.authorId, note: dto.note, createdAt: dto.createdAt }
}

export const mapHistoryEntryToViewModel: Mapper<ValidationAuditEntryDto, ValidationHistoryEntryViewModel> = dto => ({
  timestamp: dto.timestamp,
  action: dto.action,
  actorId: dto.actorId,
  actorType: dto.actorType,
})
