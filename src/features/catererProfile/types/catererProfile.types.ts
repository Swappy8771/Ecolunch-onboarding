export interface CatererProfileCompanyViewModel {
  legalName: string | null
  tradingName: string | null
  organizationType: string | null
  website: string | null
  foundedYear: number | null
  logoUrl: string | null
}

export interface CatererProfileBusinessViewModel {
  verticals: string[]
  industrySector: string | null
  employeeCount: number | null
  annualCapacityMeals: number | null
  kitchenLocations: number | null
  deliveryZones: string[]
}

export interface CatererPrimaryContactViewModel {
  name: string | null
  title: string | null
  email: string | null
  phone: string | null
}

export interface CatererSecondaryContactViewModel {
  name: string | null
  email: string | null
}

export interface CatererProfileContactViewModel {
  primaryContact: CatererPrimaryContactViewModel | null
  secondaryContact: CatererSecondaryContactViewModel | null
}

export interface CatererProfileAddressViewModel {
  city: string | null
  line1: string | null
  postalCode: string | null
  country: string | null
  region: string | null
  operatingAddress: string | null
}

export interface CatererProfileTaxViewModel {
  neqNumber: string | null
  sirenNumber: string | null
  vatNumber: string | null
  siretNumber: string | null
  apeNafCode: string | null
  rcsRegistration: string | null
}

export interface CatererProfileViewModel {
  id: string
  companyName: string | null
  company: CatererProfileCompanyViewModel
  business: CatererProfileBusinessViewModel
  contact: CatererProfileContactViewModel
  address: CatererProfileAddressViewModel
  tax: CatererProfileTaxViewModel
}

export type ProfileSectionKey = 'company' | 'business' | 'contact' | 'address' | 'tax'

export interface ProfileSectionCompletionViewModel {
  key: string
  percentage: number
  validationStatus: string
}

export interface CatererProfileOverviewViewModel {
  completionPercentage: number
  completedFields: string[]
  missingFields: string[]
  totalFields: number
  sections: ProfileSectionCompletionViewModel[]
}
