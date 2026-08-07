import type {
  EstablishmentDetailViewModel,
  EstablishmentListResult,
  EstablishmentDashboardViewModel,
  EstablishmentOverviewViewModel,
  ActiveModuleFlagsViewModel,
  ContactViewModel,
  ClosureCalendarViewModel,
} from '../types/catererEstablishments.types'

/**
 * Hand-authored, not generated — `modules/establishments`'s responses have
 * no documented OpenAPI response schema (same pattern as every other
 * hand-authored mapper this session), so these mirror
 * `establishments.dto.ts`'s actual DTO shapes directly.
 */

interface ContactDto {
  id: string | null
  establishmentId: string
  establishmentName: string
  name: string | null
  role: string | null
  email: string | null
  phone: string | null
}

interface ClosureCalendarDto {
  id: string
  establishmentId: string
  establishmentName: string
  label: string
  year: string | null
  closureDate: string | null
  uploadedAt: string | null
  source: ClosureCalendarViewModel['source']
  status: ClosureCalendarViewModel['status']
}

interface EstablishmentDetailDto {
  id: string
  catererId: string
  type: 'school' | 'daycare' | 'camp' | 'css'
  name: string
  city: string | null
  status: 'active' | 'pending' | 'incomplete'
  address?: string | null
  schoolType?: string | null
  cssDistrictId?: string | null
  cssDistrictName?: string | null
  studentCount?: number | null
  daycareType?: string | null
  childCapacity?: number | null
  sessionDates?: { start: string; end: string }[]
  participantCount?: number | null
  municipality?: string | null
  schoolCount?: number
  contacts: ContactDto[]
  closureCalendars?: ClosureCalendarDto[]
}

function toContactViewModel(dto: ContactDto): ContactViewModel {
  return { ...dto }
}

function toClosureViewModel(dto: ClosureCalendarDto): ClosureCalendarViewModel {
  return { ...dto }
}

export function toEstablishmentDetailViewModel(dto: EstablishmentDetailDto): EstablishmentDetailViewModel {
  const base = {
    id: dto.id,
    catererId: dto.catererId,
    name: dto.name,
    city: dto.city,
    status: dto.status,
    contacts: dto.contacts.map(toContactViewModel),
  }

  switch (dto.type) {
    case 'school':
      return {
        ...base,
        type: 'school',
        address: dto.address ?? null,
        schoolType: (dto.schoolType as 'public' | 'private' | null) ?? null,
        cssDistrictId: dto.cssDistrictId ?? null,
        cssDistrictName: dto.cssDistrictName ?? null,
        studentCount: dto.studentCount ?? null,
        closureCalendars: (dto.closureCalendars ?? []).map(toClosureViewModel),
      }
    case 'daycare':
      return {
        ...base,
        type: 'daycare',
        address: dto.address ?? null,
        daycareType: (dto.daycareType as 'CPE' | 'Daycare' | 'Garderie' | null) ?? null,
        childCapacity: dto.childCapacity ?? null,
        closureCalendars: (dto.closureCalendars ?? []).map(toClosureViewModel),
      }
    case 'camp':
      return {
        ...base,
        type: 'camp',
        address: dto.address ?? null,
        sessionDates: dto.sessionDates ?? [],
        participantCount: dto.participantCount ?? null,
      }
    case 'css':
      return {
        ...base,
        type: 'css',
        municipality: dto.municipality ?? null,
        schoolCount: dto.schoolCount ?? 0,
      }
  }
}

export function toEstablishmentListResult(dto: {
  data: EstablishmentDetailDto[]
  page: number
  limit: number
  total: number
}): EstablishmentListResult {
  return {
    data: dto.data.map(toEstablishmentDetailViewModel),
    page: dto.page,
    limit: dto.limit,
    total: dto.total,
  }
}

export function toActiveModuleFlags(dto: ActiveModuleFlagsViewModel): ActiveModuleFlagsViewModel {
  return { ...dto }
}

export function toDashboardViewModel(dto: {
  counts: EstablishmentDashboardViewModel['counts']
  activeModules: ActiveModuleFlagsViewModel
  schools: EstablishmentDetailDto[]
  cssDistricts: EstablishmentDetailDto[]
  daycares: EstablishmentDetailDto[]
  camps: EstablishmentDetailDto[]
}): EstablishmentDashboardViewModel {
  return {
    counts: { ...dto.counts },
    activeModules: { ...dto.activeModules },
    schools: dto.schools.map(toEstablishmentDetailViewModel) as EstablishmentDashboardViewModel['schools'],
    cssDistricts: dto.cssDistricts.map(toEstablishmentDetailViewModel) as EstablishmentDashboardViewModel['cssDistricts'],
    daycares: dto.daycares.map(toEstablishmentDetailViewModel) as EstablishmentDashboardViewModel['daycares'],
    camps: dto.camps.map(toEstablishmentDetailViewModel) as EstablishmentDashboardViewModel['camps'],
  }
}

export function toOverviewViewModel(dto: {
  completionPercentage: number
  completedFields: string[]
  missingFields: string[]
  totalFields: number
  sections: { key: string; percentage: number; validationStatus: string }[]
}): EstablishmentOverviewViewModel {
  return {
    completionPercentage: dto.completionPercentage,
    completedFields: dto.completedFields,
    missingFields: dto.missingFields,
    totalFields: dto.totalFields,
    sections: dto.sections.map(s => ({ ...s })),
  }
}
