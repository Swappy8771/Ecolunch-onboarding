import type {
  ActiveModulesViewModel,
  ModuleSetupSummaryViewModel,
  ModulesRequiredSetupOverviewViewModel,
  ModuleDetailViewModel,
  SetupChecklistItemViewModel,
  LinkedDocumentSummaryViewModel,
  LinkedCorrectionSummaryViewModel,
  LinkedConversationSummaryViewModel,
  ModulesRequiredSetupProgressViewModel,
  SectionCompletionResultViewModel,
  ModuleMissingItemsViewModel,
} from '../types/catererModulesRequiredSetup.types'

/**
 * Hand-authored, not generated — `modules/modules-required-setup`'s
 * responses have no documented OpenAPI response schema (same pattern as
 * every other hand-authored mapper this session), so these mirror
 * `modules-required-setup.dto.ts`'s actual DTO shapes directly.
 */

export function toActiveModulesViewModel(dto: ActiveModulesViewModel): ActiveModulesViewModel {
  return { ...dto }
}

function toChecklistItemViewModel(dto: SetupChecklistItemViewModel): SetupChecklistItemViewModel {
  return { ...dto }
}

function toLinkedDocument(dto: LinkedDocumentSummaryViewModel): LinkedDocumentSummaryViewModel {
  return { ...dto }
}

function toLinkedCorrection(dto: LinkedCorrectionSummaryViewModel): LinkedCorrectionSummaryViewModel {
  return { ...dto }
}

function toLinkedConversation(dto: LinkedConversationSummaryViewModel): LinkedConversationSummaryViewModel {
  return { ...dto }
}

export function toModuleSetupSummaryViewModel(dto: ModuleSetupSummaryViewModel): ModuleSetupSummaryViewModel {
  return { ...dto }
}

export function toModulesRequiredSetupOverviewViewModel(dto: {
  modules: ModuleSetupSummaryViewModel[]
}): ModulesRequiredSetupOverviewViewModel {
  return { modules: dto.modules.map(toModuleSetupSummaryViewModel) }
}

export function toModuleDetailViewModel(dto: ModuleDetailViewModel): ModuleDetailViewModel {
  return {
    ...dto,
    checklist: dto.checklist.map(toChecklistItemViewModel),
    missingItems: dto.missingItems.map(toChecklistItemViewModel),
    linkedDocuments: dto.linkedDocuments.map(toLinkedDocument),
    linkedCorrections: dto.linkedCorrections.map(toLinkedCorrection),
    linkedGoLiveBlockers: [...dto.linkedGoLiveBlockers],
    linkedEcoLoopConversations: dto.linkedEcoLoopConversations.map(toLinkedConversation),
  }
}

export function toModulesRequiredSetupProgressViewModel(dto: {
  completionPercentage: number
  completedFields: string[]
  missingFields: string[]
  totalFields: number
  sections: SectionCompletionResultViewModel[]
}): ModulesRequiredSetupProgressViewModel {
  return {
    completionPercentage: dto.completionPercentage,
    completedFields: [...dto.completedFields],
    missingFields: [...dto.missingFields],
    totalFields: dto.totalFields,
    sections: dto.sections.map((s) => ({ ...s })),
  }
}

export function toModuleMissingItemsViewModel(dtos: {
  moduleKey: ModuleMissingItemsViewModel['moduleKey']
  items: SetupChecklistItemViewModel[]
}[]): ModuleMissingItemsViewModel[] {
  return dtos.map((d) => ({ moduleKey: d.moduleKey, items: d.items.map(toChecklistItemViewModel) }))
}
