import type {
  DocumentRequirementViewModel,
  DocumentGroupViewModel,
  DocumentCategoryGroupViewModel,
  DocumentVaultProgressViewModel,
  DocumentViewModel,
  DocumentCategoryKey,
  DocumentVaultModuleKey,
  RequirementMatchStatus,
  DocumentStatus,
} from '../types/catererDocumentVault.types'

interface RequirementDto {
  key: string
  category: DocumentCategoryKey
  moduleKey: DocumentVaultModuleKey | null
  label: string
  required: boolean
  status: RequirementMatchStatus
  documentId: string | null
  version: number | null
}

interface CategoryGroupDto {
  category: DocumentCategoryKey
  categoryLabel: string
  moduleKey: DocumentVaultModuleKey | null
  requirements: RequirementDto[]
}

interface GroupDto {
  groupKey: 'base' | 'modules'
  label: string
  categories: CategoryGroupDto[]
}

interface ProgressDto {
  completionPercentage: number
  completedFields: string[]
  missingFields: string[]
  totalFields: number
  sections: { key: string; percentage: number; validationStatus: string }[]
}

interface DocumentDto {
  id: string
  catererId: string
  category: DocumentCategoryKey
  status: DocumentStatus
  version: number
  versionOf: string | null
  fileName: string
  mimeType: string
  linkedSection: string | null
  reviewNote: string | null
  createdAt: string
  updatedAt: string
}

export function toRequirementViewModel(dto: RequirementDto): DocumentRequirementViewModel {
  return { ...dto }
}

function toCategoryGroupViewModel(dto: CategoryGroupDto): DocumentCategoryGroupViewModel {
  return { ...dto, requirements: dto.requirements.map(toRequirementViewModel) }
}

export function toGroupsViewModel(dto: GroupDto[]): DocumentGroupViewModel[] {
  return dto.map((g) => ({ ...g, categories: g.categories.map(toCategoryGroupViewModel) }))
}

export function toProgressViewModel(dto: ProgressDto): DocumentVaultProgressViewModel {
  return { ...dto }
}

export function toDocumentViewModel(dto: DocumentDto): DocumentViewModel {
  return { ...dto }
}

export function toDocumentListViewModel(dto: { data: DocumentDto[]; total: number }): { data: DocumentViewModel[]; total: number } {
  return { data: dto.data.map(toDocumentViewModel), total: dto.total }
}
