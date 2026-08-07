import type { Mapper } from '@/api/mappers/types'
import type {
  CatererAddress,
  CatererDisplayStatus,
  CatererFormInput,
  CatererOrganizationType,
  CatererPrimaryContact,
  CatererRegion,
  CatererSecondaryContact,
  CatererTax,
  CatererVertical,
  CatererViewModel,
} from '../types/caterer.types'

/**
 * Hand-authored, not generated. The OpenAPI spec's response bodies are
 * schema-less for most of `/admin/caterers*` still (see
 * `src/api/generated/helpers.ts`'s header), so this type is derived
 * directly from `backend/src/modules/caterers/caterers.dto.ts`'s
 * `CatererResponseDTO`/`CatererListItemDTO` (Phase A/B), not from a
 * generated type. Keep in sync with that file if the backend shape
 * changes.
 */
export interface CatererDto {
  id: string
  companyName: string
  legalName: string
  tradingName: string | null
  organizationType: string | null
  website: string | null
  foundedYear: number | null
  city: string | null
  verticals?: string[]
  region: string
  status: 'onboarding' | 'active' | 'paused' | 'archived'
  displayStatus: CatererDisplayStatus
  assignedAdminId: string | null
  assignedAdminName: string | null
  assignedAdminEmail: string | null
  onboardingProgressPct?: number
  updatedAt?: string
  createdAt?: string
  validationCount?: number
  ticketCount?: number
  primaryContact?: { name: string | null; title: string | null; email: string | null; phone: string | null } | null
  secondaryContact?: { name: string | null; email: string | null } | null
  address?: { line1: string | null; postalCode: string | null; country: string | null; region: string | null } | null
  tax?: { neqNumber: string | null; sirenNumber: string | null; vatNumber: string | null } | null
}

const VERTICAL_FROM_BACKEND: Record<string, CatererVertical> = {
  schools: 'Schools',
  daycares: 'Daycares',
  css: 'CSS',
  camps: 'Camps',
}

export type CatererBackendVertical = 'schools' | 'daycares' | 'css' | 'camps'

const VERTICAL_TO_BACKEND: Record<CatererVertical, CatererBackendVertical> = {
  Schools: 'schools',
  Daycares: 'daycares',
  CSS: 'css',
  Camps: 'camps',
}

function mapVerticalsFromBackend(verticals: string[] | undefined): CatererVertical[] {
  if (!verticals) return []
  return verticals
    .map(v => VERTICAL_FROM_BACKEND[v])
    .filter((v): v is CatererVertical => v !== undefined)
}

/**
 * Converts a UI vertical value back to the backend's lowercase enum, for
 * list-filter queries and create/update request bodies — returns the
 * literal union type the generated request/query types expect, not a
 * plain `string`.
 */
export function mapVerticalToBackendFilter(vertical: CatererVertical | undefined): CatererBackendVertical | undefined {
  return vertical ? VERTICAL_TO_BACKEND[vertical] : undefined
}

export const mapCatererToViewModel: Mapper<CatererDto, CatererViewModel> = dto => ({
  id: dto.id,
  name: dto.companyName,
  legalName: dto.legalName,
  tradingName: dto.tradingName ?? '',
  organizationType: (dto.organizationType as CatererOrganizationType | null) ?? '',
  website: dto.website ?? '',
  foundedYear: dto.foundedYear ?? null,
  city: dto.city ?? '',
  region: (dto.region as CatererRegion) ?? 'qc',
  status: dto.displayStatus,
  verticals: mapVerticalsFromBackend(dto.verticals),
  progress: dto.onboardingProgressPct ?? 0,
  assignedAdminId: dto.assignedAdminId ?? null,
  assignedAdminName: dto.assignedAdminName ?? null,
  assignedAdminEmail: dto.assignedAdminEmail ?? null,
  updatedAt: (dto.updatedAt ?? dto.createdAt ?? '').slice(0, 10),
  primaryContact: {
    name: dto.primaryContact?.name ?? '',
    title: dto.primaryContact?.title ?? '',
    email: dto.primaryContact?.email ?? '',
    phone: dto.primaryContact?.phone ?? '',
  },
  secondaryContact: {
    name: dto.secondaryContact?.name ?? '',
    email: dto.secondaryContact?.email ?? '',
  },
  address: {
    line1: dto.address?.line1 ?? '',
    postalCode: dto.address?.postalCode ?? '',
    country: dto.address?.country ?? '',
    region: dto.address?.region ?? '',
  },
  tax: {
    neqNumber: dto.tax?.neqNumber ?? '',
    sirenNumber: dto.tax?.sirenNumber ?? '',
    vatNumber: dto.tax?.vatNumber ?? '',
  },
  validations: dto.validationCount ?? 0,
  tickets: dto.ticketCount ?? 0,
})

/** Drops empty-string optional fields so the request body doesn't send `''` where the backend expects `undefined`/absence. */
function orUndefined(value: string): string | undefined {
  return value.trim() ? value.trim() : undefined
}

function mapContactOrUndefined(contact: CatererPrimaryContact): CatererPrimaryContact | undefined {
  if (!contact.name && !contact.title && !contact.email && !contact.phone) return undefined
  return contact
}

function mapSecondaryContactOrUndefined(contact: CatererSecondaryContact): CatererSecondaryContact | undefined {
  if (!contact.name && !contact.email) return undefined
  return contact
}

function mapAddressOrUndefined(address: CatererAddress): CatererAddress | undefined {
  if (!address.line1 && !address.postalCode && !address.country && !address.region) return undefined
  return address
}

function mapTaxOrUndefined(tax: CatererTax): CatererTax | undefined {
  if (!tax.neqNumber && !tax.sirenNumber && !tax.vatNumber) return undefined
  return tax
}

/**
 * Shared by create/update — both backend schemas (`createCatererSchema`/
 * `updateCatererSchema`) accept the identical optional "profile fields"
 * set (see `caterers.schema.ts`'s `profileFields`), so one mapping
 * function covers both request bodies.
 */
export function mapFormInputToRequestBody(input: CatererFormInput) {
  return {
    companyName: input.companyName.trim(),
    legalName: input.legalName.trim(),
    tradingName: orUndefined(input.tradingName),
    organizationType: input.organizationType || undefined,
    website: orUndefined(input.website),
    foundedYear: input.foundedYear.trim() ? Number(input.foundedYear) : undefined,
    city: orUndefined(input.city),
    region: input.region,
    verticals: input.verticals.map(mapVerticalToBackendFilter).filter((v): v is CatererBackendVertical => v !== undefined),
    assignedAdminId: input.assignedAdminId ?? undefined,
    primaryContact: mapContactOrUndefined(input.primaryContact),
    secondaryContact: mapSecondaryContactOrUndefined(input.secondaryContact),
    address: mapAddressOrUndefined(input.address),
    tax: mapTaxOrUndefined(input.tax),
  }
}

/** Populates the edit form from a loaded `CatererViewModel`. */
export function mapViewModelToFormInput(caterer: CatererViewModel): CatererFormInput {
  return {
    companyName: caterer.name,
    legalName: caterer.legalName,
    tradingName: caterer.tradingName,
    organizationType: caterer.organizationType,
    website: caterer.website,
    foundedYear: caterer.foundedYear !== null ? String(caterer.foundedYear) : '',
    city: caterer.city,
    region: caterer.region,
    verticals: caterer.verticals,
    assignedAdminId: caterer.assignedAdminId,
    primaryContact: caterer.primaryContact,
    secondaryContact: caterer.secondaryContact,
    address: caterer.address,
    tax: caterer.tax,
  }
}
