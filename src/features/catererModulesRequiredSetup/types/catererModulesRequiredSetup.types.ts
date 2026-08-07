export type ModuleKey = 'school_meals' | 'daycare_meals' | 'camp_meals' | 'accounting' | 'reportiq'

export type SetupItemStatus = 'complete' | 'pending' | 'missing' | 'blocked'

export interface ActiveModulesViewModel {
  schoolMeals: boolean
  daycareMeals: boolean
  campMeals: boolean
  accounting: boolean
  reportiq: boolean
}

export interface SetupChecklistItemViewModel {
  key: string
  moduleKey: ModuleKey
  label: string
  required: boolean
  specRequirement: 'Yes' | 'If applicable'
  status: SetupItemStatus
}

export interface LinkedDocumentSummaryViewModel {
  key: string
  label: string
  status: string
}

export interface LinkedCorrectionSummaryViewModel {
  id: string
  description: string
  status: string
  priority: string
  section: string
}

export interface LinkedConversationSummaryViewModel {
  id: string
  subject: string
  status: string
  priority: string
}

export interface ModuleSetupSummaryViewModel {
  moduleKey: ModuleKey
  label: string
  active: boolean
  completionPercentage: number
  completedCount: number
  pendingCount: number
  totalCount: number
  missingCount: number
  blockerCount: number
  correctionCount: number
  conversationCount: number
}

export interface ModuleDetailViewModel {
  moduleKey: ModuleKey
  label: string
  active: boolean
  completionPercentage: number
  completedCount: number
  pendingCount: number
  totalCount: number
  checklist: SetupChecklistItemViewModel[]
  missingItems: SetupChecklistItemViewModel[]
  linkedDocuments: LinkedDocumentSummaryViewModel[]
  linkedCorrections: LinkedCorrectionSummaryViewModel[]
  /** Caterer-wide, NOT module-specific — Go-live has no per-module granularity. */
  linkedGoLiveBlockers: string[]
  linkedEcoLoopConversations: LinkedConversationSummaryViewModel[]
}

export interface ModulesRequiredSetupOverviewViewModel {
  modules: ModuleSetupSummaryViewModel[]
}

export interface SectionCompletionResultViewModel {
  key: string
  percentage: number
  validationStatus: string
}

export interface ModulesRequiredSetupProgressViewModel {
  completionPercentage: number
  completedFields: string[]
  missingFields: string[]
  totalFields: number
  sections: SectionCompletionResultViewModel[]
}

export interface ModuleMissingItemsViewModel {
  moduleKey: ModuleKey
  items: SetupChecklistItemViewModel[]
}
