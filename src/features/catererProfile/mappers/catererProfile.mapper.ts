import type { CatererProfileViewModel, CatererProfileOverviewViewModel } from '../types/catererProfile.types'

/**
 * Hand-authored, not generated — `GET /caterer/profile`/`/overview` have no
 * documented `content.application/json.schema` in the OpenAPI spec (same
 * pattern as every other hand-authored mapper this session), so this
 * mirrors `catererProfileService.toPublicProfile()`'s actual return shape.
 */
interface CatererProfileDto {
  id: string
  companyName: string | null
  company: {
    legalName: string | null
    tradingName: string | null
    organizationType: string | null
    website: string | null
    foundedYear: number | null
    logoUrl: string | null
  }
  business: {
    verticals: string[]
    industrySector: string | null
    employeeCount: number | null
    annualCapacityMeals: number | null
    kitchenLocations: number | null
    deliveryZones: string[]
  }
  contact: {
    primaryContact: { name: string | null; title: string | null; email: string | null; phone: string | null } | null
    secondaryContact: { name: string | null; email: string | null } | null
  }
  address: {
    city: string | null
    line1: string | null
    postalCode: string | null
    country: string | null
    region: string | null
    operatingAddress: string | null
  }
  tax: {
    neqNumber: string | null
    sirenNumber: string | null
    vatNumber: string | null
    siretNumber: string | null
    apeNafCode: string | null
    rcsRegistration: string | null
  }
}

export function toCatererProfileViewModel(dto: CatererProfileDto): CatererProfileViewModel {
  return {
    id: dto.id,
    companyName: dto.companyName,
    company: { ...dto.company },
    business: { ...dto.business },
    contact: { ...dto.contact },
    address: { ...dto.address },
    tax: { ...dto.tax },
  }
}

interface CatererProfileOverviewDto {
  completionPercentage: number
  completedFields: string[]
  missingFields: string[]
  totalFields: number
  sections: { key: string; percentage: number; validationStatus: string }[]
}

export function toCatererProfileOverviewViewModel(dto: CatererProfileOverviewDto): CatererProfileOverviewViewModel {
  return {
    completionPercentage: dto.completionPercentage,
    completedFields: dto.completedFields,
    missingFields: dto.missingFields,
    totalFields: dto.totalFields,
    sections: dto.sections.map(s => ({ key: s.key, percentage: s.percentage, validationStatus: s.validationStatus })),
  }
}
