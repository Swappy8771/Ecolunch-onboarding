import type {
  MenuViewModel, DishViewModel, ActiveMenuModuleFlagsViewModel, MenuListResult, MenuOverviewViewModel,
} from '../types/catererMenus.types'

/**
 * Hand-authored, not generated — `modules/menus`'s responses have no
 * documented OpenAPI response schema (same pattern as every other
 * hand-authored mapper this session), so these mirror `menus.dto.ts`'s
 * actual DTO shapes directly.
 */

interface DishDto {
  id: string
  catererId: string
  name: string
  description: string | null
  priceCents: number | null
  category: string | null
  photoUrl: string | null
  availableDays: string[]
  allergens: { allergenCode: string; isTrace: boolean }[]
}

interface MenuDto {
  id: string
  catererId: string
  type: MenuViewModel['type']
  name: string
  status: MenuViewModel['status']
  establishmentId: string | null
  ageGroup: string | null
  sessionDates: { start: string; end: string }[]
  rotationWeeks: number | null
  choicesPerDay: number | null
  packageName: string | null
  packagePriceCents: number | null
  smartImportJobId: string | null
  dishes: DishDto[]
  schedule: MenuViewModel['schedule']
  createdAt: string
  updatedAt: string
}

export function toDishViewModel(dto: DishDto): DishViewModel {
  return { ...dto }
}

export function toMenuViewModel(dto: MenuDto): MenuViewModel {
  return {
    ...dto,
    dishes: dto.dishes.map(toDishViewModel),
  }
}

export function toMenuListResult(dto: { data: MenuDto[]; page: number; limit: number; total: number }): MenuListResult {
  return {
    data: dto.data.map(toMenuViewModel),
    page: dto.page,
    limit: dto.limit,
    total: dto.total,
  }
}

export function toActiveMenuModuleFlags(dto: ActiveMenuModuleFlagsViewModel): ActiveMenuModuleFlagsViewModel {
  return { ...dto }
}

export function toMenuOverviewViewModel(dto: {
  completionPercentage: number
  completedFields: string[]
  missingFields: string[]
  totalFields: number
  sections: { key: string; percentage: number; validationStatus: string }[]
}): MenuOverviewViewModel {
  return {
    completionPercentage: dto.completionPercentage,
    completedFields: dto.completedFields,
    missingFields: dto.missingFields,
    totalFields: dto.totalFields,
    sections: dto.sections.map(s => ({ ...s })),
  }
}
