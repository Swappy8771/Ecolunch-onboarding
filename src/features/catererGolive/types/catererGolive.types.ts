/**
 * UI-facing types for the Caterer Portal's Go-live feature. Mirrors the
 * backend's `golive.dto.ts` shapes directly (no documented OpenAPI
 * response schema component — hand-authored `@openapi` blocks only, same
 * pattern as every other hand-authored mapper this session).
 */

export interface GoLiveBlockerViewModel {
  id: string
  title: string
  description: string | null
  owningModule: string
  category: string
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

/** `blocker`/`warning` come straight from the backend's own `classify()` — required-and-unmet vs optional-and-unmet. Neither set → passed. */
export interface GoLiveChecklistItemViewModel {
  key: string
  title: string
  status: string
  blocker: boolean
  warning: boolean
  sourceModule: string
}

export interface GoLiveChecklistSectionViewModel {
  key: string
  label: string
  items: GoLiveChecklistItemViewModel[]
}

export interface GoLiveChecklistViewModel {
  sections: GoLiveChecklistSectionViewModel[]
}
