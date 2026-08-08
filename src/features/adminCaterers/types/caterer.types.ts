/**
 * UI-facing types for the Caterers feature. These are ViewModel/filter
 * shapes a component works with — never the raw backend DTO (that lives
 * next to the mapper that produces these, in `../mappers/caterer.mapper.ts`).
 */

/**
 * Matches the backend's computed `displayStatus` exactly
 * (`backend/src/modules/caterers/caterers.service.ts`'s
 * `computeDisplayStatus`) — NOT the mock data's French onboarding-stage
 * vocabulary (`pre-onboarding`/`en-cours`/`soumis`/`corrections`/
 * `approuves`/`go-live`), which has no backend equivalent. See
 * `knowledge/03-frontend/phase-3-module-integration/Caterers.md` for this
 * vocabulary-drift finding.
 */
export type CatererDisplayStatus =
  | 'pre-onboarding'
  | 'in-progress'
  | 'needs-review'
  | 'approved'
  | 'ready-for-golive'
  | 'completed'
  | 'paused'
  | 'archived'

/** Display casing kept from the existing UI; backend stores these lowercase. */
export type CatererVertical = 'Schools' | 'Daycares' | 'Camps' | 'CSS'

/** Backend's real jurisdiction enum (`qc`/`fr`) — NOT a physical address region. See `CatererAddress.region` for that. */
export type CatererRegion = 'qc' | 'fr'

export type CatererOrganizationType =
  | 'sole_proprietor'
  | 'partnership'
  | 'corporation'
  | 'cooperative'
  | 'non_profit'
  | 'other'

export interface CatererPrimaryContact {
  name: string
  title: string
  email: string
  phone: string
}

export interface CatererSecondaryContact {
  name: string
  email: string
}

/** Province/state (`region`) is distinct from the top-level jurisdiction `CatererRegion`. */
export interface CatererAddress {
  line1: string
  postalCode: string
  country: string
  region: string
}

export interface CatererTax {
  neqNumber: string
  sirenNumber: string
  vatNumber: string
}

export interface CatererViewModel {
  id: string
  name: string
  legalName: string
  tradingName: string
  organizationType: CatererOrganizationType | ''
  website: string
  foundedYear: number | null
  city: string
  region: CatererRegion
  verticals: CatererVertical[]
  status: CatererDisplayStatus
  progress: number
  /** Raw backend user id — always present alongside the resolved name/email below. */
  assignedAdminId: string | null
  /** Resolved server-side (Phase B) via a batch Users lookup. `null` if unassigned or unresolved — never blocks the read. */
  assignedAdminName: string | null
  assignedAdminEmail: string | null
  updatedAt: string
  primaryContact: CatererPrimaryContact
  secondaryContact: CatererSecondaryContact
  address: CatererAddress
  tax: CatererTax
  /** Real backend counts (Phase B) — open Validation Center items / open EcoLoop conversations for this caterer. */
  validations: number
  tickets: number
}

export interface CatererListFilters {
  search?: string
  status?: CatererDisplayStatus
  vertical?: CatererVertical
  assignedAdmin?: string
  page?: number
  limit?: number
}

export interface CatererListResult {
  items: CatererViewModel[]
  total: number
  page: number
  limit: number
}

/**
 * Shared by create and update forms. All fields optional except
 * `companyName`/`legalName` (create-only requirement, enforced by the
 * form, not duplicated here as a type-level distinction — see
 * `CatererFormModal`'s own required-field check).
 */
export interface CatererFormInput {
  companyName: string
  legalName: string
  tradingName: string
  organizationType: CatererOrganizationType | ''
  website: string
  foundedYear: string
  city: string
  region: CatererRegion
  verticals: CatererVertical[]
  assignedAdminId: string | null
  primaryContact: CatererPrimaryContact
  secondaryContact: CatererSecondaryContact
  address: CatererAddress
  tax: CatererTax
}

export const EMPTY_CATERER_FORM_INPUT: CatererFormInput = {
  companyName: '',
  legalName: '',
  tradingName: '',
  organizationType: '',
  website: '',
  city: '',
  region: 'qc',
  foundedYear: '',
  verticals: [],
  assignedAdminId: null,
  primaryContact: { name: '', title: '', email: '', phone: '' },
  secondaryContact: { name: '', email: '' },
  address: { line1: '', postalCode: '', country: '', region: '' },
  tax: { neqNumber: '', sirenNumber: '', vatNumber: '' },
}
