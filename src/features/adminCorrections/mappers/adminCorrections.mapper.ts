import type { CorrectionViewModel, CorrectionCommentViewModel, CorrectionListResult } from '../types/adminCorrections.types'

/**
 * Hand-authored, not generated — `modules/corrections`'s responses have no
 * documented OpenAPI response schema (same pattern as `catererCorrections`'s
 * own mapper), so these mirror `corrections.dto.ts`'s actual DTO shapes directly.
 */

interface CorrectionCommentDto {
  id: string
  authorId: string | null
  authorType: 'admin' | 'caterer'
  body: string
  createdAt: string
}

interface CorrectionDto {
  id: string
  catererId: string
  validationItemId: string | null
  description: string
  section: string
  priority: CorrectionViewModel['priority']
  status: CorrectionViewModel['status']
  ecoloopTicketId: string | null
  linkedDocumentIds: string[]
  comments: CorrectionCommentDto[]
  resolvedAt: string | null
  createdAt: string
  updatedAt: string
}

function toCorrectionCommentViewModel(dto: CorrectionCommentDto): CorrectionCommentViewModel {
  return { ...dto }
}

export function toCorrectionViewModel(dto: CorrectionDto): CorrectionViewModel {
  return {
    ...dto,
    comments: dto.comments.map(toCorrectionCommentViewModel),
  }
}

export function toCorrectionListResult(dto: {
  data: CorrectionDto[]
  total: number
  page: number
  limit: number
}): CorrectionListResult {
  return {
    data: dto.data.map(toCorrectionViewModel),
    total: dto.total,
    page: dto.page,
    limit: dto.limit,
  }
}
