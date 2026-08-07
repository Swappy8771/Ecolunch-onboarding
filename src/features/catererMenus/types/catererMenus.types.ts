export type MenuType = 'school' | 'daycare' | 'camp' | 'common_meals' | 'rotating_cycle'
export type MenuStatus = 'draft' | 'submitted' | 'under_review' | 'validated'

export interface DishAllergenViewModel {
  allergenCode: string
  isTrace: boolean
}

export interface DishViewModel {
  id: string
  catererId: string
  name: string
  description: string | null
  priceCents: number | null
  category: string | null
  photoUrl: string | null
  availableDays: string[]
  allergens: DishAllergenViewModel[]
}

export interface MenuScheduleEntryViewModel {
  weekNumber: number
  dayOfWeek: string
  choiceSlot: string | null
  dishId: string | null
  priceCents: number | null
}

export interface MenuSessionDateViewModel {
  start: string
  end: string
}

export interface MenuViewModel {
  id: string
  catererId: string
  type: MenuType
  name: string
  status: MenuStatus
  establishmentId: string | null
  ageGroup: string | null
  sessionDates: MenuSessionDateViewModel[]
  rotationWeeks: number | null
  choicesPerDay: number | null
  packageName: string | null
  packagePriceCents: number | null
  smartImportJobId: string | null
  dishes: DishViewModel[]
  schedule: MenuScheduleEntryViewModel[]
  createdAt: string
  updatedAt: string
}

export interface MenuListFilters {
  type?: MenuType
  search?: string
  page?: number
  limit?: number
}

export interface MenuListResult {
  data: MenuViewModel[]
  page: number
  limit: number
  total: number
}

export interface ActiveMenuModuleFlagsViewModel {
  schoolMeals: boolean
  daycareMeals: boolean
  campMeals: boolean
}

export interface MenuOverviewSectionViewModel {
  key: string
  percentage: number
  validationStatus: string
}

export interface MenuOverviewViewModel {
  completionPercentage: number
  completedFields: string[]
  missingFields: string[]
  totalFields: number
  sections: MenuOverviewSectionViewModel[]
}
