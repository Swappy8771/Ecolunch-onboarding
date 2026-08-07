import type {
  CorrectionViewModel,
  CorrectionCommentViewModel,
  CorrectionListResult,
  CorrectionSummaryViewModel,
  CorrectionHistoryViewModel,
  CorrectionHistoryEntryViewModel,
} from '../types/catererCorrections.types'

/**
 * Hand-authored, not generated — `modules/corrections`'s responses have
 * no documented OpenAPI response schema (same pattern as every other
 * hand-authored mapper this session), so these mirror `corrections.dto.ts`'s
 * actual DTO shapes directly.
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

export function toCorrectionSummaryViewModel(dto: {
  total: number
  open: number
  inProgress: number
  resolved: number
  closed: number
  goLiveBlocked: boolean
}): CorrectionSummaryViewModel {
  return { ...dto }
}

function toHistoryEntry(dto: {
  timestamp: string
  action: string
  actorId: string | null
  actorType: string
}): CorrectionHistoryEntryViewModel {
  return { ...dto }
}

export function toCorrectionHistoryViewModel(dto: {
  correction: CorrectionDto
  history: { timestamp: string; action: string; actorId: string | null; actorType: string }[]
}): CorrectionHistoryViewModel {
  return {
    correction: toCorrectionViewModel(dto.correction),
    history: dto.history.map(toHistoryEntry),
  }
}
