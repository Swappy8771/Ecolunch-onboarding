import type {
  GoLiveSummaryViewModel, GoLiveChecklistViewModel, GoLiveBlockerViewModel, GoLiveWarningViewModel,
  GoLiveChecklistSectionViewModel,
} from '../types/catererGolive.types'

interface SummaryDto {
  ready: boolean
  completionPercentage: number
  totals: { total: number; passed: number; warnings: number; blockers: number }
  blockers: GoLiveBlockerViewModel[]
  warnings: GoLiveWarningViewModel[]
}

interface ChecklistDto {
  sections: GoLiveChecklistSectionViewModel[]
}

export function toGoLiveSummaryViewModel(dto: SummaryDto): GoLiveSummaryViewModel {
  return { ...dto }
}

export function toGoLiveChecklistViewModel(dto: ChecklistDto): GoLiveChecklistViewModel {
  return { sections: dto.sections.map((s) => ({ ...s, items: s.items.map((i) => ({ ...i })) })) }
}
