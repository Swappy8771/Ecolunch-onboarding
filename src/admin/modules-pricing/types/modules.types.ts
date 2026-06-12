export type ConfigSection =
  | 'dashboard' | 'modules' | 'pricing' | 'founding-partner'
  | 'commercial-terms' | 'operational-rules' | 'effective-dates'
  | 'validation' | 'contract-readiness' | 'audit'

export type ModuleId =
  | 'school-meals' | 'daycare-meals' | 'camp-meals'
  | 'reportiq' | 'accounting' | 'parent-subs' | 'css-reporting'

export type ModStatus       = 'active' | 'inactive' | 'configured'
export type ValidationLevel = 'pass' | 'warning' | 'error' | 'pending'
export type RuleSection     = 'payout' | 'credit' | 'cutoff' | 'notifications' | 'reports' | 'labels'
export type ModCategory     = 'meals' | 'analytics' | 'finance' | 'reporting'

export interface ModuleConfig {
  id: ModuleId
  name: string
  shortName: string
  description: string
  category: ModCategory
  dependencies: ModuleId[]
  status: ModStatus
  effectiveDate: string | null
  endDate: string | null
  monthlyRate: number | null
  setupFee: number | null
  discountPct: number
  notes: string
}

export interface FoundingPartnerConfig {
  enabled: boolean
  freeForLife: boolean
  discountPct: number
  discountExpiry: string | null
  notes: string
}

export interface CommercialTerms {
  startDate: string
  termMonths: number
  autoRenewal: boolean
  paymentDays: number
  notes: string
  customConditions: string
  specialPricing: string
}

export interface OperationalRule {
  id: string
  section: RuleSection
  label: string
  description: string
  enabled: boolean
  value: string
  status: ValidationLevel
}

export interface AuditEntry {
  id: string
  ts: string
  user: string
  action: string
  module: string | null
  field: string | null
  prev: string | null
  next: string | null
}

export interface CatererSetup {
  id: string
  name: string
  legalName: string
  city: string
  modules: ModuleConfig[]
  foundingPartner: FoundingPartnerConfig
  terms: CommercialTerms
  rules: OperationalRule[]
  audit: AuditEntry[]
  lastSaved: string | null
  contractReady: boolean
}
