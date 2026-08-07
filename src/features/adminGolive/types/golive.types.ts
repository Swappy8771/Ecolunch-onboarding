/**
 * UI-facing types for the Go-live Monitor feature. ViewModel/filter shapes
 * only — the raw backend DTO shapes live next to the mapper that produces
 * these, in `../mappers/golive.mapper.ts`.
 */

/** Derived, not a raw backend enum — `ready` (isReadyForGoLive), `blocked` (admin explicitly ran block), `not_ready` (neither). */
export type GoLiveReadiness = 'ready' | 'not_ready' | 'blocked'

export interface GoLiveListItemViewModel {
  catererId: string
  catererName: string
  readiness: GoLiveReadiness
  onboardingProgressPct: number
  completedCount: number
  totalRequirements: number
  blockerCount: number
  openCorrectionsCount: number
  openValidationsCount: number
}

/** One of the 11 hardcoded base requirements (`GOLIVE_REQUIREMENTS`). */
export interface GoLiveRequirementViewModel {
  requirement: string
  status: 'complete' | 'incomplete' | 'blocked' | 'waived'
  blockingReason: string | null
}

export interface GoLiveOverviewViewModel {
  catererId: string
  catererName: string
  readiness: GoLiveReadiness
  onboardingProgressPct: number
  requirements: GoLiveRequirementViewModel[]
  completedCount: number
  incompleteCount: number
  blockedCount: number
  waivedCount: number
}

export interface GoLiveBlockerViewModel {
  id: string
  title: string
  description: string | null
  owningModule: string
  category: string
  /** For `owningModule === 'golive'` (the base 11 requirements), this is the requirement key — used to route "Open Blocking Section". */
  source: string
}

export interface GoLiveWarningViewModel {
  id: string
  title: string
  description: string | null
  owningModule: string
  category: string
}

export interface GoLiveSummaryViewModel {
  ready: boolean
  completionPercentage: number
  totals: { total: number; passed: number; warnings: number; blockers: number }
  blockers: GoLiveBlockerViewModel[]
  warnings: GoLiveWarningViewModel[]
}

export interface GoLiveHistoryEntryViewModel {
  timestamp: string
  action: string
  actorId: string | null
  actorType: string
  details: unknown
}
