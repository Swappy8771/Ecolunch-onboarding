export type CorrectionStatus = 'open' | 'in_progress' | 'resolved' | 'closed'
export type CorrectionPriority = 'high' | 'medium' | 'low'

export interface CorrectionCommentViewModel {
  id: string
  authorId: string | null
  authorType: 'admin' | 'caterer'
  body: string
  createdAt: string
}

export interface CorrectionViewModel {
  id: string
  catererId: string
  validationItemId: string | null
  description: string
  section: string
  priority: CorrectionPriority
  status: CorrectionStatus
  ecoloopTicketId: string | null
  linkedDocumentIds: string[]
  comments: CorrectionCommentViewModel[]
  resolvedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface CorrectionListFilters {
  status?: CorrectionStatus
  priority?: CorrectionPriority
  section?: string
  page?: number
  limit?: number
}

export interface CorrectionListResult {
  data: CorrectionViewModel[]
  total: number
  page: number
  limit: number
}

export interface CorrectionSummaryViewModel {
  total: number
  open: number
  inProgress: number
  resolved: number
  closed: number
  goLiveBlocked: boolean
}

export interface CorrectionHistoryEntryViewModel {
  timestamp: string
  action: string
  actorId: string | null
  actorType: string
}

export interface CorrectionHistoryViewModel {
  correction: CorrectionViewModel
  history: CorrectionHistoryEntryViewModel[]
}
