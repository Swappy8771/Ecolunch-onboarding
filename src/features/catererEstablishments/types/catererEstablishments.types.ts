export type EstablishmentType = 'school' | 'daycare' | 'camp' | 'css'
export type EstablishmentStatus = 'active' | 'pending' | 'incomplete'
export type SchoolType = 'public' | 'private'
export type DaycareType = 'CPE' | 'Daycare' | 'Garderie'
export type ClosureCalendarStatus = 'approved' | 'pending' | 'missing'
export type ClosureSource = 'manual' | 'ics_import' | 'prefill' | 'upload'

export interface ContactViewModel {
  id: string | null
  establishmentId: string
  establishmentName: string
  name: string | null
  role: string | null
  email: string | null
  phone: string | null
}

export interface ClosureCalendarViewModel {
  id: string
  establishmentId: string
  establishmentName: string
  label: string
  year: string | null
  closureDate: string | null
  uploadedAt: string | null
  source: ClosureSource | null
  status: ClosureCalendarStatus
}

interface EstablishmentBaseViewModel {
  id: string
  catererId: string
  name: string
  city: string | null
  status: EstablishmentStatus
}

export interface SchoolViewModel extends EstablishmentBaseViewModel {
  type: 'school'
  address: string | null
  schoolType: SchoolType | null
  cssDistrictId: string | null
  cssDistrictName: string | null
  studentCount: number | null
  contacts: ContactViewModel[]
  closureCalendars: ClosureCalendarViewModel[]
}

export interface CssDistrictViewModel extends EstablishmentBaseViewModel {
  type: 'css'
  municipality: string | null
  contacts: ContactViewModel[]
  schoolCount: number
}

export interface DaycareViewModel extends EstablishmentBaseViewModel {
  type: 'daycare'
  address: string | null
  daycareType: DaycareType | null
  childCapacity: number | null
  contacts: ContactViewModel[]
  closureCalendars: ClosureCalendarViewModel[]
}

export interface CampSessionDateViewModel {
  start: string
  end: string
}

export interface CampViewModel extends EstablishmentBaseViewModel {
  type: 'camp'
  address: string | null
  sessionDates: CampSessionDateViewModel[]
  participantCount: number | null
  contacts: ContactViewModel[]
}

export type EstablishmentDetailViewModel = SchoolViewModel | DaycareViewModel | CampViewModel | CssDistrictViewModel

export interface ActiveModuleFlagsViewModel {
  schoolMeals: boolean
  daycareMeals: boolean
  campMeals: boolean
}

export interface EstablishmentCountsViewModel {
  schools: number
  daycares: number
  contacts: number
  calendars: number
}

export interface EstablishmentDashboardViewModel {
  counts: EstablishmentCountsViewModel
  activeModules: ActiveModuleFlagsViewModel
  schools: SchoolViewModel[]
  cssDistricts: CssDistrictViewModel[]
  daycares: DaycareViewModel[]
  camps: CampViewModel[]
}

export interface EstablishmentListFilters {
  type?: EstablishmentType
  status?: EstablishmentStatus
  search?: string
  page?: number
  limit?: number
}

export interface EstablishmentListResult {
  data: EstablishmentDetailViewModel[]
  page: number
  limit: number
  total: number
}

export interface EstablishmentOverviewSectionViewModel {
  key: string
  percentage: number
  validationStatus: string
}

export interface EstablishmentOverviewViewModel {
  completionPercentage: number
  completedFields: string[]
  missingFields: string[]
  totalFields: number
  sections: EstablishmentOverviewSectionViewModel[]
}
