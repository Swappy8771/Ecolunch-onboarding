import type { CatererReadiness, ChecklistItem } from '../../types/golive.types'

const BASE_CHECKLIST: Omit<ChecklistItem, 'status'>[] = [
  { id: 'account-created',       label: 'Account Created',                section: 'caterers'            },
  { id: 'profile-validated',     label: 'Profile Validated',              section: 'validation-center'   },
  { id: 'banking-validated',     label: 'Banking Information Validated',  section: 'validation-center'   },
  { id: 'establishments-confirmed', label: 'Establishments Confirmed',   section: 'caterers'            },
  { id: 'menus-validated',       label: 'Menus / Packages Validated',     section: 'validation-center'   },
  { id: 'documents-approved',    label: 'Required Documents Approved',    section: 'document-vault'      },
  { id: 'contracts-signed',      label: 'Required Contracts Signed',      section: 'contract-management' },
  { id: 'modules-configured',    label: 'Modules Configured',             section: 'modules-pricing'     },
  { id: 'pricing-configured',    label: 'Pricing Configured',             section: 'modules-pricing'     },
  { id: 'corrections-closed',    label: 'Corrections Closed',             section: 'validation-center'   },
  { id: 'ecoloop-blockers-closed', label: 'EcoLoop Blockers Closed',      section: 'ecoloop'             },
]

function makeChecklist(statuses: ChecklistItem['status'][]): ChecklistItem[] {
  return BASE_CHECKLIST.map((item, i) => ({ ...item, status: statuses[i] ?? 'incomplete' }))
}

export const CATERERS_READINESS: CatererReadiness[] = [
  {
    id: 'cat-1',
    name: 'Concept Gourmet',
    city: 'Montréal',
    vertical: 'Schools',
    status: 'not-ready',
    progressPct: 73,
    completedSteps: 8,
    totalSteps: 11,
    blockingSteps: 2,
    openCorrections: 1,
    openValidations: 2,
    lastUpdated: '2026-06-11 09:42',
    checklist: makeChecklist([
      'complete', 'complete', 'complete', 'complete',
      'complete', 'complete', 'incomplete', 'complete',
      'blocked', 'incomplete', 'incomplete',
    ]),
    blockers: [
      {
        id: 'b1', title: 'Unsigned Contract', category: 'contract',
        description: 'Main service agreement has not been signed by the caterer signatory.',
        section: 'contract-management',
      },
      {
        id: 'b2', title: 'Pricing Not Configured', category: 'pricing',
        description: 'CSS Reporting module is missing monthly rate and setup fee.',
        section: 'modules-pricing',
      },
    ],
    audit: [
      { id: 'a1', ts: '2026-06-11 09:42', user: 'Admin', action: 'Draft saved' },
      { id: 'a2', ts: '2026-06-10 15:22', user: 'Admin', action: 'Pricing updated for School Meals' },
      { id: 'a3', ts: '2026-06-09 11:30', user: 'Admin', action: 'Banking information validated' },
    ],
  },
  {
    id: 'cat-2',
    name: 'FL Traiteur',
    city: 'Québec',
    vertical: 'Daycares',
    status: 'ready',
    progressPct: 100,
    completedSteps: 11,
    totalSteps: 11,
    blockingSteps: 0,
    openCorrections: 0,
    openValidations: 0,
    lastUpdated: '2026-06-10 14:05',
    checklist: makeChecklist(Array(11).fill('complete')),
    blockers: [],
    audit: [
      { id: 'a1', ts: '2026-06-10 14:05', user: 'Admin', action: 'Go-live validated' },
      { id: 'a2', ts: '2026-06-09 10:30', user: 'Admin', action: 'All corrections closed' },
    ],
  },
  {
    id: 'cat-3',
    name: 'MSN Alimentation',
    city: 'Laval',
    vertical: 'Schools',
    status: 'blocked',
    progressPct: 36,
    completedSteps: 4,
    totalSteps: 11,
    blockingSteps: 4,
    openCorrections: 3,
    openValidations: 4,
    lastUpdated: '2026-06-08 16:18',
    checklist: makeChecklist([
      'complete', 'complete', 'blocked', 'complete',
      'incomplete', 'blocked', 'incomplete', 'incomplete',
      'incomplete', 'incomplete', 'incomplete',
    ]),
    blockers: [
      {
        id: 'b1', title: 'Insurance Certificate Missing', category: 'document',
        description: 'Liability insurance certificate (2026) has not been uploaded.',
        section: 'document-vault',
      },
      {
        id: 'b2', title: 'Banking Information Invalid', category: 'banking',
        description: 'EFT transit number failed validation. Caterer must resubmit.',
        section: 'validation-center',
      },
      {
        id: 'b3', title: 'Menu Not Validated', category: 'menu',
        description: '3 school menus are pending nutritional review.',
        section: 'validation-center',
      },
      {
        id: 'b4', title: 'Open Validation', category: 'validation',
        description: '4 validation items require admin decision before proceeding.',
        section: 'validation-center',
      },
    ],
    audit: [
      { id: 'a1', ts: '2026-06-08 16:18', user: 'Admin', action: 'Go-live blocked — insurance missing' },
      { id: 'a2', ts: '2026-06-07 11:00', user: 'Admin', action: 'Banking validation failed' },
    ],
  },
  {
    id: 'cat-4',
    name: 'ABC Catering',
    city: 'Longueuil',
    vertical: 'Camps',
    status: 'not-ready',
    progressPct: 55,
    completedSteps: 6,
    totalSteps: 11,
    blockingSteps: 1,
    openCorrections: 2,
    openValidations: 1,
    lastUpdated: '2026-06-09 13:30',
    checklist: makeChecklist([
      'complete', 'complete', 'complete', 'complete',
      'incomplete', 'complete', 'blocked', 'incomplete',
      'incomplete', 'incomplete', 'incomplete',
    ]),
    blockers: [
      {
        id: 'b1', title: 'Unsigned Contract', category: 'contract',
        description: 'Camp Meals annex has not been countersigned.',
        section: 'contract-management',
      },
    ],
    audit: [
      { id: 'a1', ts: '2026-06-09 13:30', user: 'Admin', action: 'Contract sent to caterer via Dropbox Sign' },
    ],
  },
  {
    id: 'cat-5',
    name: 'Brasserie Nord',
    city: 'Sherbrooke',
    vertical: 'Schools',
    status: 'not-ready',
    progressPct: 18,
    completedSteps: 2,
    totalSteps: 11,
    blockingSteps: 0,
    openCorrections: 0,
    openValidations: 3,
    lastUpdated: '2026-06-07 09:00',
    checklist: makeChecklist([
      'complete', 'complete', 'incomplete', 'incomplete',
      'incomplete', 'incomplete', 'incomplete', 'incomplete',
      'incomplete', 'incomplete', 'incomplete',
    ]),
    blockers: [],
    audit: [
      { id: 'a1', ts: '2026-06-07 09:00', user: 'Admin', action: 'Onboarding started' },
    ],
  },
]

export const SUMMARY = {
  ready:       CATERERS_READINESS.filter(c => c.status === 'ready').length,
  notReady:    CATERERS_READINESS.filter(c => c.status === 'not-ready').length,
  blocked:     CATERERS_READINESS.filter(c => c.status === 'blocked').length,
  total:       CATERERS_READINESS.length,
}
