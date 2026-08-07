import type { ProfileSectionKey } from '@/features/catererProfile/types/catererProfile.types'

/**
 * Single source of truth for how each profile field is displayed. Bridges
 * two intentionally different backend shapes: `GET /caterer/profile`
 * returns fields nested by UI section (`profilePath`, e.g.
 * `company.legalName`), while `GET /caterer/profile/overview` computes
 * completion against the raw `Caterer` model's own field layout
 * (`overviewPath`, e.g. `legalName` or `businessDetails.industrySector`) —
 * see `catererProfileService.buildProfileSections()` on the backend. A
 * field's `overviewPath` is only ever present in `overview.completedFields`/
 * `missingFields` if it's required (`computeCompletion()` never records
 * optional fields in either array), so a field with no match in *either*
 * array is optional.
 */
export interface ProfileFieldConfig {
  key: string
  label: string
  profilePath: string
  overviewPath: string
}

export const SECTION_META: { key: ProfileSectionKey; title: string }[] = [
  { key: 'company', title: 'Company Information' },
  { key: 'business', title: 'Business Details' },
  { key: 'contact', title: 'Primary Contact Information' },
  { key: 'address', title: 'Address Information' },
  { key: 'tax', title: 'Tax Information' },
]

export const FIELD_CONFIG: Record<ProfileSectionKey, ProfileFieldConfig[]> = {
  company: [
    { key: 'legalName', label: 'Legal Name', profilePath: 'company.legalName', overviewPath: 'legalName' },
    { key: 'tradingName', label: 'Trading Name', profilePath: 'company.tradingName', overviewPath: 'tradingName' },
    { key: 'organizationType', label: 'Organization Type', profilePath: 'company.organizationType', overviewPath: 'organizationType' },
    { key: 'foundedYear', label: 'Founded Year', profilePath: 'company.foundedYear', overviewPath: 'foundedYear' },
    { key: 'website', label: 'Website', profilePath: 'company.website', overviewPath: 'website' },
    { key: 'logoUrl', label: 'Company Logo', profilePath: 'company.logoUrl', overviewPath: 'logoUrl' },
  ],
  business: [
    { key: 'verticals', label: 'Active Service Types', profilePath: 'business.verticals', overviewPath: 'verticals' },
    { key: 'industrySector', label: 'Industry Sector', profilePath: 'business.industrySector', overviewPath: 'businessDetails.industrySector' },
    { key: 'employeeCount', label: 'Number of Employees', profilePath: 'business.employeeCount', overviewPath: 'businessDetails.employeeCount' },
    { key: 'annualCapacityMeals', label: 'Annual Capacity (meals)', profilePath: 'business.annualCapacityMeals', overviewPath: 'businessDetails.annualCapacityMeals' },
    { key: 'kitchenLocations', label: 'Kitchen Locations', profilePath: 'business.kitchenLocations', overviewPath: 'businessDetails.kitchenLocations' },
    { key: 'deliveryZones', label: 'Delivery Zones', profilePath: 'business.deliveryZones', overviewPath: 'businessDetails.deliveryZones' },
  ],
  contact: [
    { key: 'primaryName', label: 'Full Name', profilePath: 'contact.primaryContact.name', overviewPath: 'primaryContact.name' },
    { key: 'primaryTitle', label: 'Job Title', profilePath: 'contact.primaryContact.title', overviewPath: 'primaryContact.title' },
    { key: 'primaryEmail', label: 'Email Address', profilePath: 'contact.primaryContact.email', overviewPath: 'primaryContact.email' },
    { key: 'primaryPhone', label: 'Phone Number', profilePath: 'contact.primaryContact.phone', overviewPath: 'primaryContact.phone' },
    { key: 'secondaryName', label: 'Secondary Contact Name', profilePath: 'contact.secondaryContact.name', overviewPath: 'secondaryContact.name' },
    { key: 'secondaryEmail', label: 'Secondary Contact Email', profilePath: 'contact.secondaryContact.email', overviewPath: 'secondaryContact.email' },
  ],
  address: [
    { key: 'line1', label: 'Registered Address', profilePath: 'address.line1', overviewPath: 'address.line1' },
    { key: 'city', label: 'City', profilePath: 'address.city', overviewPath: 'city' },
    { key: 'postalCode', label: 'Postal Code', profilePath: 'address.postalCode', overviewPath: 'address.postalCode' },
    { key: 'country', label: 'Country', profilePath: 'address.country', overviewPath: 'address.country' },
    { key: 'region', label: 'Region / Department', profilePath: 'address.region', overviewPath: 'address.region' },
    { key: 'operatingAddress', label: 'Operating Address', profilePath: 'address.operatingAddress', overviewPath: 'address.operatingAddress' },
  ],
  tax: [
    { key: 'neqNumber', label: 'NEQ Number', profilePath: 'tax.neqNumber', overviewPath: 'tax.neqNumber' },
    { key: 'sirenNumber', label: 'SIREN Number', profilePath: 'tax.sirenNumber', overviewPath: 'tax.sirenNumber' },
    { key: 'vatNumber', label: 'VAT Number', profilePath: 'tax.vatNumber', overviewPath: 'tax.vatNumber' },
    { key: 'siretNumber', label: 'SIRET Number', profilePath: 'tax.siretNumber', overviewPath: 'tax.siretNumber' },
    { key: 'apeNafCode', label: 'APE / NAF Code', profilePath: 'tax.apeNafCode', overviewPath: 'tax.apeNafCode' },
    { key: 'rcsRegistration', label: 'RCS Registration', profilePath: 'tax.rcsRegistration', overviewPath: 'tax.rcsRegistration' },
  ],
}

export function getByPath(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, segment) => {
    if (acc && typeof acc === 'object' && segment in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[segment]
    }
    return undefined
  }, obj)
}

export function formatFieldValue(value: unknown): string | null {
  if (value === null || value === undefined) return null
  if (Array.isArray(value)) return value.length > 0 ? value.join(', ') : null
  if (typeof value === 'string') return value.trim().length > 0 ? value : null
  return String(value)
}
