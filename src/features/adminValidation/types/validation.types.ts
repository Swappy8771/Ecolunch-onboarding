/**
 * UI-facing types for the Validation Center feature. ViewModel/filter
 * shapes only — the raw backend DTO shapes live next to the mapper that
 * produces these, in `../mappers/validation.mapper.ts`.
 */

/** The real 10-value backend `ValidationItem.type` enum (`validation.model.ts`). */
export type ValidationType =
  | 'profile'
  | 'banking'
  | 'document'
  | 'contract'
  | 'menu'
  | 'establishment'
  | 'module'
  | 'pricing'
  | 'golive'
  | 'smart_import'

/** The real 6-value `ValidationItem.status` enum. */
export type ValidationStatus =
  | 'pending_review'
  | 'in_review'
  | 'approved'
  | 'rejected'
  | 'correction_requested'
  | 'closed'

export type ValidationPriority = 'critical' | 'high' | 'medium' | 'low'

export interface ValidationInternalNoteViewModel {
  authorId: string | null
  note: string
  createdAt: string
}

export interface ValidationItemViewModel {
  id: string
  catererId: string
  type: ValidationType
  priority: ValidationPriority
  status: ValidationStatus
  section: string | null
  title: string | null
  description: string | null
  /** Free-form snapshot of the data under review (`dataSnapshot: Mixed` backend-side) — rendered as read-only JSON, no assumed shape. */
  dataSnapshot: Record<string, unknown>
  linkedDocumentId: string | null
  smartImportJobId: string | null
  reviewedBy: string | null
  reviewedAt: string | null
  internalNotes: ValidationInternalNoteViewModel[]
  createdAt: string
}

export interface ValidationHistoryEntryViewModel {
  timestamp: string
  action: string
  actorId: string | null
  actorType: string
}

export interface ValidationListFilters {
  caterer?: string
  type?: ValidationType
  status?: ValidationStatus
  priority?: ValidationPriority
}
