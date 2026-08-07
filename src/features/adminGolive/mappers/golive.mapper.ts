import type { Mapper } from '@/api/mappers/types'
import type {
  GoLiveListItemViewModel,
  GoLiveOverviewViewModel,
  GoLiveRequirementViewModel,
  GoLiveSummaryViewModel,
  GoLiveBlockerViewModel,
  GoLiveWarningViewModel,
  GoLiveHistoryEntryViewModel,
  GoLiveReadiness,
} from '../types/golive.types'

/**
 * Hand-authored, not generated — the two new endpoints (`/remind`,
 * `/send-ecoloop`) aren't in the generated OpenAPI snapshot yet, and the
 * rest of this module's responses are plain service-return shapes with
 * no dedicated response-schema generation either (matches the `.dto.ts`
 * interfaces in `backend/src/modules/golive/golive.dto.ts` by hand).
 */

function toReadiness(isReadyForGoLive: boolean, isBlocked: boolean): GoLiveReadiness {
  if (isBlocked) return 'blocked'
  return isReadyForGoLive ? 'ready' : 'not_ready'
}

export interface GoLiveListItemDto {
  catererId: string
  catererName: string
  isReadyForGoLive: boolean
  isBlocked: boolean
  onboardingProgressPct: number
  completedCount: number
  totalRequirements: number
  blockerCount: number
  openCorrectionsCount: number
  openValidationsCount: number
}

export const mapGoLiveListItemToViewModel: Mapper<GoLiveListItemDto, GoLiveListItemViewModel> = dto => ({
  catererId: dto.catererId,
  catererName: dto.catererName,
  readiness: toReadiness(dto.isReadyForGoLive, dto.isBlocked),
  onboardingProgressPct: dto.onboardingProgressPct,
  completedCount: dto.completedCount,
  totalRequirements: dto.totalRequirements,
  blockerCount: dto.blockerCount,
  openCorrectionsCount: dto.openCorrectionsCount,
  openValidationsCount: dto.openValidationsCount,
})

export interface GoLiveOverviewDto {
  catererId: string
  catererName: string
  isReadyForGoLive: boolean
  onboardingProgressPct: number
  requirements: { requirement: string; status: 'complete' | 'incomplete' | 'blocked' | 'waived'; blockingReason?: string }[]
  completedCount: number
  incompleteCount: number
  blockedCount: number
  waivedCount: number
}

export const mapGoLiveOverviewToViewModel: Mapper<GoLiveOverviewDto, GoLiveOverviewViewModel> = dto => ({
  catererId: dto.catererId,
  catererName: dto.catererName,
  readiness: toReadiness(dto.isReadyForGoLive, dto.blockedCount > 0),
  onboardingProgressPct: dto.onboardingProgressPct,
  requirements: dto.requirements.map(mapRequirement),
  completedCount: dto.completedCount,
  incompleteCount: dto.incompleteCount,
  blockedCount: dto.blockedCount,
  waivedCount: dto.waivedCount,
})

function mapRequirement(r: GoLiveOverviewDto['requirements'][number]): GoLiveRequirementViewModel {
  return { requirement: r.requirement, status: r.status, blockingReason: r.blockingReason ?? null }
}

export interface GoLiveSummaryDto {
  ready: boolean
  completionPercentage: number
  totals: { total: number; passed: number; warnings: number; blockers: number }
  blockers: { id: string; title: string; description: string | null; owningModule: string; category: string; source: string }[]
  warnings: { id: string; title: string; description: string | null; owningModule: string; category: string }[]
}

export const mapGoLiveSummaryToViewModel: Mapper<GoLiveSummaryDto, GoLiveSummaryViewModel> = dto => ({
  ready: dto.ready,
  completionPercentage: dto.completionPercentage,
  totals: dto.totals,
  blockers: dto.blockers.map(mapBlocker),
  warnings: dto.warnings.map(mapWarning),
})

function mapBlocker(b: GoLiveSummaryDto['blockers'][number]): GoLiveBlockerViewModel {
  return { id: b.id, title: b.title, description: b.description, owningModule: b.owningModule, category: b.category, source: b.source }
}

function mapWarning(w: GoLiveSummaryDto['warnings'][number]): GoLiveWarningViewModel {
  return { id: w.id, title: w.title, description: w.description, owningModule: w.owningModule, category: w.category }
}

export interface GoLiveHistoryEntryDto {
  timestamp: string
  action: string
  actorId: string | null
  actorType: string
  details: unknown
}

export const mapGoLiveHistoryEntryToViewModel: Mapper<GoLiveHistoryEntryDto, GoLiveHistoryEntryViewModel> = dto => ({
  timestamp: dto.timestamp,
  action: dto.action,
  actorId: dto.actorId,
  actorType: dto.actorType,
  details: dto.details,
})
