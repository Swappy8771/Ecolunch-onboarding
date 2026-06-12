import type { CatererSetup } from '../../types/modules.types'

export const CATERER_OPTIONS = [
  { id: 'cat-1', name: 'Concept Gourmet',  city: 'Montréal' },
  { id: 'cat-2', name: 'FL Traiteur',      city: 'Québec' },
  { id: 'cat-3', name: 'MSN Alimentation', city: 'Laval' },
  { id: 'cat-4', name: 'ABC Catering',     city: 'Longueuil' },
  { id: 'cat-5', name: 'Brasserie Nord',   city: 'Sherbrooke' },
]

export const SETUPS: Record<string, CatererSetup> = {
  'cat-1': {
    id: 'cat-1',
    name: 'Concept Gourmet',
    legalName: 'Concept Gourmet Inc.',
    city: 'Montréal',
    contractReady: false,
    lastSaved: '2026-06-11 09:42',
    modules: [
      {
        id: 'school-meals', name: 'School Meals', shortName: 'Schools',
        description: 'Full-cycle meal management for K–12 schools — menus, orders, delivery, billing.',
        category: 'meals', dependencies: [], status: 'active',
        effectiveDate: '2026-09-01', endDate: null,
        monthlyRate: 249, setupFee: 500, discountPct: 0, notes: '',
      },
      {
        id: 'daycare-meals', name: 'Daycare / CPE Meals', shortName: 'Daycares',
        description: 'Subsidy-compliant meal delivery management for licensed daycares and CPEs.',
        category: 'meals', dependencies: [], status: 'active',
        effectiveDate: '2026-09-01', endDate: null,
        monthlyRate: 149, setupFee: 350, discountPct: 0, notes: '',
      },
      {
        id: 'camp-meals', name: 'Camp Meals', shortName: 'Camps',
        description: 'Seasonal meal management for day camps and overnight camps.',
        category: 'meals', dependencies: [], status: 'inactive',
        effectiveDate: null, endDate: null,
        monthlyRate: null, setupFee: null, discountPct: 0, notes: '',
      },
      {
        id: 'reportiq', name: 'ReportIQ', shortName: 'ReportIQ',
        description: 'Advanced analytics and reporting engine for operational insights.',
        category: 'analytics', dependencies: ['school-meals'], status: 'inactive',
        effectiveDate: null, endDate: null,
        monthlyRate: null, setupFee: null, discountPct: 0, notes: '',
      },
      {
        id: 'accounting', name: 'Accounting', shortName: 'Accounting',
        description: 'Integrated accounting module — GL, AR, AP, reconciliation.',
        category: 'finance', dependencies: [], status: 'inactive',
        effectiveDate: null, endDate: null,
        monthlyRate: null, setupFee: null, discountPct: 0, notes: '',
      },
      {
        id: 'parent-subs', name: 'Parent Subscriptions', shortName: 'Parent Subs',
        description: 'Parent-facing subscription portal for meal plans and payments.',
        category: 'finance', dependencies: ['school-meals'], status: 'inactive',
        effectiveDate: null, endDate: null,
        monthlyRate: null, setupFee: null, discountPct: 0, notes: '',
      },
      {
        id: 'css-reporting', name: 'CSS Reporting', shortName: 'CSS',
        description: 'Government subsidy compliance and CSS reporting for Quebec programs.',
        category: 'reporting', dependencies: ['daycare-meals'], status: 'configured',
        effectiveDate: '2026-09-01', endDate: null,
        monthlyRate: null, setupFee: null, discountPct: 0,
        notes: 'Pricing TBD — pending finance approval',
      },
    ],
    foundingPartner: {
      enabled: true,
      freeForLife: false,
      discountPct: 20,
      discountExpiry: '2028-08-31',
      notes: 'Founding partner — first cohort. 20% discount on all modules for 24 months.',
    },
    terms: {
      startDate: '2026-09-01',
      termMonths: 24,
      autoRenewal: true,
      paymentDays: 30,
      notes: 'Priority onboarding support included for first 90 days.',
      customConditions: 'White-glove training for kitchen staff included at no charge.',
      specialPricing: 'Founding partner discount applied at invoice level.',
    },
    rules: [
      { id: 'r1',  section: 'payout',        label: 'Payout Cycle',               description: 'Frequency of caterer payouts',                    enabled: true,  value: 'monthly',  status: 'pass' },
      { id: 'r2',  section: 'payout',        label: 'Minimum Payout Threshold',   description: 'Minimum balance before payout is triggered',      enabled: true,  value: '$100',     status: 'pass' },
      { id: 'r3',  section: 'payout',        label: 'Payout Method',              description: 'Payment method for caterer payouts',              enabled: true,  value: 'EFT',      status: 'pass' },
      { id: 'r4',  section: 'credit',        label: 'Credit Window',              description: 'Days allowed for parent credit requests',         enabled: true,  value: '7 days',   status: 'pass' },
      { id: 'r5',  section: 'credit',        label: 'Auto-Credit Approvals',      description: 'Automatically approve credits under threshold',    enabled: false, value: '$25',      status: 'warning' },
      { id: 'r6',  section: 'cutoff',        label: 'Order Cutoff Time',          description: 'Daily order cutoff time (local timezone)',         enabled: true,  value: '10:00',    status: 'pass' },
      { id: 'r7',  section: 'cutoff',        label: 'Cutoff Days in Advance',     description: 'Number of days before delivery orders are locked', enabled: true,  value: '1 day',    status: 'pass' },
      { id: 'r8',  section: 'notifications', label: 'Order Confirmations',        description: 'Send order confirmation emails to parents',        enabled: true,  value: 'email',    status: 'pass' },
      { id: 'r9',  section: 'notifications', label: 'Payment Receipts',           description: 'Send payment receipts automatically',             enabled: true,  value: 'email',    status: 'pass' },
      { id: 'r10', section: 'notifications', label: 'Admin Alerts',               description: 'Notify EcoLunch staff on exceptions',             enabled: true,  value: 'email',    status: 'pass' },
      { id: 'r11', section: 'reports',       label: 'Monthly Summary Report',     description: 'Auto-generate monthly performance summary',        enabled: true,  value: 'PDF',      status: 'pass' },
      { id: 'r12', section: 'reports',       label: 'CSS Compliance Report',      description: 'Auto-generate CSS subsidy compliance report',      enabled: true,  value: 'PDF+CSV',  status: 'pass' },
      { id: 'r13', section: 'labels',        label: 'Allergen Label Format',      description: 'Label format for allergen compliance',             enabled: true,  value: 'standard', status: 'pass' },
      { id: 'r14', section: 'labels',        label: 'Custom Branding on Labels',  description: 'Print caterer logo on meal labels',               enabled: false, value: '',         status: 'pending' },
    ],
    audit: [
      { id: 'a1',  ts: '2026-06-11 09:42', user: 'Admin', action: 'Saved draft',                  module: null,             field: null,           prev: null,           next: null },
      { id: 'a2',  ts: '2026-06-11 09:40', user: 'Admin', action: 'Updated founding partner',     module: null,             field: 'discountPct',  prev: '15',           next: '20' },
      { id: 'a3',  ts: '2026-06-11 09:38', user: 'Admin', action: 'Configured CSS Reporting',     module: 'css-reporting',  field: 'effectiveDate',prev: null,           next: '2026-09-01' },
      { id: 'a4',  ts: '2026-06-10 15:22', user: 'Admin', action: 'Updated pricing',              module: 'school-meals',   field: 'monthlyRate',  prev: '199',          next: '249' },
      { id: 'a5',  ts: '2026-06-10 15:20', user: 'Admin', action: 'Activated module',             module: 'daycare-meals',  field: 'status',       prev: 'inactive',     next: 'active' },
      { id: 'a6',  ts: '2026-06-10 14:58', user: 'Admin', action: 'Set contract start date',      module: null,             field: 'startDate',    prev: null,           next: '2026-09-01' },
      { id: 'a7',  ts: '2026-06-09 11:30', user: 'Admin', action: 'Activated module',             module: 'school-meals',   field: 'status',       prev: 'inactive',     next: 'active' },
      { id: 'a8',  ts: '2026-06-09 11:28', user: 'Admin', action: 'Enabled founding partner',     module: null,             field: 'enabled',      prev: 'false',        next: 'true' },
      { id: 'a9',  ts: '2026-06-08 10:15', user: 'Admin', action: 'Setup created',                module: null,             field: null,           prev: null,           next: null },
    ],
  },
}

export function getSetup(catererId: string): CatererSetup {
  return SETUPS[catererId] ?? SETUPS['cat-1']
}

export function calcStats(setup: CatererSetup) {
  const active   = setup.modules.filter(m => m.status !== 'inactive')
  const priced   = setup.modules.filter(m => m.status !== 'inactive' && m.monthlyRate !== null)
  const total    = active.reduce((s, m) => s + (m.monthlyRate ?? 0) * (1 - m.discountPct / 100), 0)
  const setup_   = active.reduce((s, m) => s + (m.setupFee ?? 0), 0)
  const discount = active.reduce((s, m) => s + (m.monthlyRate ?? 0) * (m.discountPct / 100), 0)
  const fpDiscount = setup.foundingPartner.enabled
    ? total * (setup.foundingPartner.discountPct / 100)
    : 0
  const exceptions = (setup.foundingPartner.enabled ? 1 : 0) +
    setup.modules.filter(m => m.discountPct > 0).length
  const ready = priced.length === active.length && setup.terms.startDate && active.length > 0
  return { active: active.length, priced: priced.length, exceptions, total, setup: setup_, discount, fpDiscount, ready }
}
